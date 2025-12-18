import { PlexClient } from "./plex";
import { JellyfinClient } from "./jellyfin";
import {
  PlexLibraryResponse,
  PlexMovieResponse,
  PlexMovieMetadata,
  PlexSeasonResponse,
  PlexEpisodeResponse,
} from "@/lib/types/plex";
import {
  JellyfinLibraryResponse,
  JellyfinMovieResponse,
  JellyfinMovieMetadata,
  JellyfinSeasonResponse,
  JellyfinEpisodeResponse,
} from "@/lib/types/jellyfin";
import {
  NormalizedLibrary,
  NormalizedMediaItem,
  NormalizedSeason,
  NormalizedEpisode,
  NormalizedMovieDetails,
} from "@/lib/types/mediaserver";

export type MediaServerType = "plex" | "jellyfin";

export class MediaServerClient {
  private client: PlexClient | JellyfinClient;
  private type: MediaServerType;

  constructor(type: MediaServerType) {
    this.type = type;
    if (type === "plex") {
      this.client = new PlexClient();
    } else {
      this.client = new JellyfinClient();
    }
  }

  /**
   * Transform Plex library to normalized format
   */
  private normalizePlexLibrary(
    lib: PlexLibraryResponse
  ): NormalizedLibrary | null {
    // Only include movie and show libraries
    if (lib.type !== "movie" && lib.type !== "show") {
      return null;
    }
    return {
      id: lib.key,
      name: lib.title,
      type: lib.type as "movie" | "show",
    };
  }

  /**
   * Transform Jellyfin library to normalized format
   */
  private normalizeJellyfinLibrary(
    lib: JellyfinLibraryResponse
  ): NormalizedLibrary | null {
    // Map CollectionType to normalized type
    let type: "movie" | "show" | null = null;
    if (lib.CollectionType === "movies") {
      type = "movie";
    } else if (lib.CollectionType === "tvshows") {
      type = "show";
    }
    if (!type) {
      return null;
    }
    return {
      id: lib.Id,
      name: lib.Name,
      type,
    };
  }

  /**
   * Transform Plex media item to normalized format
   */
  private normalizePlexMediaItem(item: PlexMovieResponse): NormalizedMediaItem {
    return {
      ratingKey: item.ratingKey,
      title: item.title,
      year: item.year,
      thumbUrl: item.thumbUrl,
      artUrl: item.artUrl,
      summary: item.summary,
      rating: item.rating,
      contentRating: item.contentRating,
      duration: item.duration ? Math.floor(item.duration / 1000) : undefined, // Convert ms to seconds
      releaseDate: item.originallyAvailableAt ?? undefined,
    };
  }

  /**
   * Transform Jellyfin media item to normalized format
   */
  private normalizeJellyfinMediaItem(
    item: JellyfinMovieResponse
  ): NormalizedMediaItem {
    return {
      ratingKey: item.Id,
      title: item.Name,
      year: item.ProductionYear,
      releaseDate: item.PremiereDate ?? undefined,
      thumbUrl: item.thumbUrl,
      artUrl: item.artUrl,
      summary: item.Overview,
      rating: item.CommunityRating,
      contentRating: item.OfficialRating,
      duration: item.RunTimeTicks
        ? Math.floor(item.RunTimeTicks / 10_000_000)
        : undefined, // Convert ticks (100ns) to seconds
    };
  }

  /**
   * Transform Plex season to normalized format
   */
  private normalizePlexSeason(season: PlexSeasonResponse): NormalizedSeason {
    return {
      ratingKey: season.ratingKey,
      title: season.title,
      seriesId: season.parentRatingKey,
      index: season.index,
      thumbUrl: season.thumbUrl,
      artUrl: season.artUrl,
      parentThumb: season.parentThumb,
      summary: season.summary,
    };
  }

  /**
   * Transform Jellyfin season to normalized format
   */
  private normalizeJellyfinSeason(
    season: JellyfinSeasonResponse
  ): NormalizedSeason {
    return {
      ratingKey: season.Id,
      title: season.Name,
      seriesId: season.SeriesId,
      index: season.IndexNumber,
      thumbUrl: season.thumbUrl,
      artUrl: season.artUrl,
      parentThumb: season.parentThumb,
      summary: season.Overview,
    };
  }

  /**
   * Transform Plex episode to normalized format
   */
  private normalizePlexEpisode(
    episode: PlexEpisodeResponse
  ): NormalizedEpisode {
    return {
      ratingKey: episode.ratingKey,
      title: episode.title,
      seasonId: episode.parentRatingKey,
      index: episode.index,
      parentIndex: episode.parentIndex,
      thumbUrl: episode.thumbUrl,
      summary: episode.summary,
      rating: episode.audienceRating,
      releaseDate: episode.originallyAvailableAt ?? undefined,
      duration: episode.duration
        ? Math.floor(episode.duration / 1000)
        : undefined,
    };
  }

  /**
   * Transform Jellyfin episode to normalized format
   */
  private normalizeJellyfinEpisode(
    episode: JellyfinEpisodeResponse
  ): NormalizedEpisode {
    return {
      ratingKey: episode.Id,
      title: episode.Name,
      seasonId: episode.SeasonId,
      index: episode.IndexNumber,
      parentIndex: episode.ParentIndexNumber,
      thumbUrl: episode.thumbUrl,
      summary: episode.Overview,
      rating: episode.CommunityRating,
      releaseDate: episode.PremiereDate ?? undefined,
      duration: episode.RunTimeTicks
        ? Math.floor(episode.RunTimeTicks / 10_000_000)
        : undefined,
    };
  }

  /**
   * Transform Plex movie details to normalized format
   */
  private normalizePlexMovieDetails(
    details: Partial<PlexMovieMetadata>
  ): NormalizedMovieDetails {
    const base = this.normalizePlexMediaItem(details as PlexMovieResponse);
    const guid = Array.isArray(details.Guid)
      ? details.Guid.reduce((acc, g) => {
          const id = g.id;
          if (id?.startsWith("tmdb://")) {
            acc.tmdb = id.replace("tmdb://", "");
          } else if (id?.startsWith("imdb://")) {
            acc.imdb = id.replace("imdb://", "");
          } else if (id?.startsWith("tvdb://")) {
            acc.tvdb = id.replace("tvdb://", "");
          }
          return acc;
        }, {} as { tmdb?: string; imdb?: string; tvdb?: string })
      : undefined;

    return {
      ...base,
      studio: details.studio,
      providerIds: guid && Object.keys(guid).length > 0 ? guid : undefined,
    };
  }

  /**
   * Transform Jellyfin movie details to normalized format
   */
  private normalizeJellyfinMovieDetails(
    details: Partial<JellyfinMovieMetadata>
  ): NormalizedMovieDetails {
    const base = this.normalizeJellyfinMediaItem(
      details as JellyfinMovieResponse
    );
    return {
      ...base,
      thumbUrl: details.thumbUrl + `?bust=${Date.now()}`,
      artUrl: details.artUrl + `?bust=${Date.now()}`,
      studio: details.Studios?.[0]?.Name,
      genres: details.Genres?.map((g) => g.Name),
      providerIds: details.ProviderIds
        ? {
            tmdb: details.ProviderIds.Tmdb,
            imdb: details.ProviderIds.Imdb,
            tvdb: details.ProviderIds.Tvdb,
          }
        : undefined,
    };
  }

  /**
   * Get all libraries from the media server (normalized)
   */
  async getLibraries(): Promise<NormalizedLibrary[]> {
    const libraries = await this.client.getLibraries();
    if (this.type === "plex") {
      return (libraries as PlexLibraryResponse[])
        .map((lib) => this.normalizePlexLibrary(lib))
        .filter((lib): lib is NormalizedLibrary => lib !== null);
    } else {
      return (libraries as JellyfinLibraryResponse[])
        .map((lib) => this.normalizeJellyfinLibrary(lib))
        .filter((lib): lib is NormalizedLibrary => lib !== null);
    }
  }

  /**
   * Get all items from a specific library (normalized)
   */
  async getLibraryItems(libraryKey: string): Promise<NormalizedMediaItem[]> {
    const items = await this.client.getLibraryItems(libraryKey);
    if (this.type === "plex") {
      return (items as PlexMovieResponse[]).map((item) =>
        this.normalizePlexMediaItem(item)
      );
    } else {
      return (items as JellyfinMovieResponse[]).map((item) =>
        this.normalizeJellyfinMediaItem(item)
      );
    }
  }

  /**
   * Get detailed metadata for a specific movie (normalized)
   */
  async getLibraryItemDetails(itemId: string): Promise<NormalizedMovieDetails> {
    const details = await this.client.getLibraryItemDetails(itemId);
    if (this.type === "plex") {
      return this.normalizePlexMovieDetails(
        details as Partial<PlexMovieMetadata>
      );
    } else {
      return this.normalizeJellyfinMovieDetails(
        details as Partial<JellyfinMovieMetadata>
      );
    }
  }

  /**
   * Get seasons for a TV show (normalized)
   */
  async getShowSeasons(seriesId: string): Promise<NormalizedSeason[]> {
    const seasons = await this.client.getShowSeasons(seriesId);
    if (this.type === "plex") {
      return (seasons as PlexSeasonResponse[]).map((season) =>
        this.normalizePlexSeason(season)
      );
    } else {
      return (seasons as JellyfinSeasonResponse[]).map((season) =>
        this.normalizeJellyfinSeason(season)
      );
    }
  }

  /**
   * Get episodes for a season (normalized)
   */
  async getSeasonEpisodes(seasonId: string): Promise<NormalizedEpisode[]> {
    const episodes = await this.client.getSeasonEpisodes(seasonId);
    if (this.type === "plex") {
      return (episodes as PlexEpisodeResponse[]).map((episode) =>
        this.normalizePlexEpisode(episode)
      );
    } else {
      return (episodes as JellyfinEpisodeResponse[]).map((episode) =>
        this.normalizeJellyfinEpisode(episode)
      );
    }
  }

  /**
   * Update movie poster with a new image URL
   */
  async updateMoviePoster(itemId: string, posterUrl: string): Promise<void> {
    return this.client.updateMoviePoster(itemId, posterUrl);
  }

  /**
   * Update movie backdrop with a new image URL
   */
  async updateMovieBackdrop( itemId: string, backdropUrl: string ): Promise<void> {
    return this.client.updateMovieBackdrop(itemId, backdropUrl);
  }

  /**
   * Test connection to the media server
   */
  async testConnection(): Promise<boolean> {
    return this.client.testConnection();
  }

  /**
   * Get the server type
   */
  getType(): MediaServerType {
    return this.type;
  }
}

/**
 * Factory function to create a MediaServerClient instance based on server type
 */
export function createMediaServerClient(
  type: MediaServerType
): MediaServerClient {
  return new MediaServerClient(type);
}
