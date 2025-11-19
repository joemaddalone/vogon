import {
  JellyfinLibraryResponse,
  JellyfinMovieResponse,
  JellyfinShowResponse,
  JellyfinSeasonResponse,
  JellyfinEpisodeResponse,
  JellyfinResponse,
  JellyfinSystemInfo,
  JellyfinMovieMetadata,
} from "@/lib/types/jellyfin";
import { getClients } from "./getClients";

class JellyfinClient {
  constructor() {}

  private async config() {
    return await getClients();
  }

  /**
   * Make authenticated request to Jellyfin API
   */
  private async request<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const config = await this.config();
    const url = `${config?.jellyfinServerUrl}${endpoint}`;
    const queryParams = new URLSearchParams({
      api_key: config?.jellyfinApiKey || "",
      ...params,
    });

    try {
      const response = await fetch(`${url}?${queryParams.toString()}`, {
        headers: {
          Accept: "application/json",
          "X-Emby-Authorization": `MediaBrowser Token="${config?.jellyfinApiKey}"`,
        },
      });

      if (!response.ok) {
        return {
          error: `Jellyfin API error: ${response.status} ${response.statusText}`,
        } as T;
      }

      return (await response.json()) as T;
    } catch (error) {
      console.error("Jellyfin API request failed:", error);
      return { error: `Jellyfin API request failed: ${error}` } as T;
    }
  }

  /**
   * Get all libraries from Jellyfin server
   */
  async getLibraries(): Promise<JellyfinLibraryResponse[]> {
    const config = await this.config();
    const response = await this.request<JellyfinResponse<JellyfinLibraryResponse>>(
      `/Users/${config?.jellyfinUserId}/Views`
    );
    return response.Items || [];
  }

  /**
   * Get all items from a specific library
   */
  async getLibraryItems(libraryId: string): Promise<JellyfinMovieResponse[]> {
    const config = await this.config();
    const response = await this.request<JellyfinResponse<JellyfinMovieResponse>>(
      `/Users/${config?.jellyfinUserId}/Items`,
      {
        ParentId: libraryId,
        Recursive: "true",
        Fields: "ProviderIds,Overview,ImageTags,BackdropImageTags",
      }
    );
    const items = response.Items || [];

    // Add full URL to thumbnails
    return items.map((item) => ({
      ...item,
      thumbUrl: item.ImageTags?.Primary
        ? `${config?.jellyfinServerUrl}/Items/${item.Id}/Images/Primary?api_key=${config?.jellyfinApiKey}`
        : undefined,
      artUrl: item.BackdropImageTags?.[0]
        ? `${config?.jellyfinServerUrl}/Items/${item.Id}/Images/Backdrop/0?api_key=${config?.jellyfinApiKey}`
        : undefined,
    }));
  }

  /**
   * Get detailed metadata for a specific movie
   */
  async getMovieDetails(itemId: string): Promise<Partial<JellyfinMovieMetadata>> {
    const config = await this.config();
    const response = await this.request<JellyfinMovieMetadata>(
      `/Users/${config?.jellyfinUserId}/Items/${itemId}`,
      {
        Fields: "ProviderIds,Overview,Studios,Genres,MediaSources,ImageTags,BackdropImageTags",
      }
    );

    if (!response || !response.Id) {
      throw new Error("Movie not found");
    }

    return {
      ...response,
      thumbUrl: response.ImageTags?.Primary
        ? `${config?.jellyfinServerUrl}/Items/${itemId}/Images/Primary?api_key=${config?.jellyfinApiKey}`
        : "",
      artUrl: response.BackdropImageTags?.[0]
        ? `${config?.jellyfinServerUrl}/Items/${itemId}/Images/Backdrop/0?api_key=${config?.jellyfinApiKey}`
        : "",
    };
  }

  /**
   * Get seasons for a TV show
   */
  async getShowSeasons(seriesId: string): Promise<JellyfinSeasonResponse[]> {
    const config = await this.config();
    const response = await this.request<JellyfinResponse<JellyfinSeasonResponse>>(
      `/Shows/${seriesId}/Seasons`,
      {
        UserId: config?.jellyfinUserId || "",
        Fields: "ProviderIds,Overview,ImageTags,BackdropImageTags",
      }
    );
    const items = response.Items || [];

    return items.map((season) => ({
      ...season,
      thumbUrl: season.ImageTags?.Primary
        ? `${config?.jellyfinServerUrl}/Items/${season.Id}/Images/Primary?api_key=${config?.jellyfinApiKey}`
        : undefined,
      artUrl: season.BackdropImageTags?.[0]
        ? `${config?.jellyfinServerUrl}/Items/${season.Id}/Images/Backdrop/0?api_key=${config?.jellyfinApiKey}`
        : undefined,
      parentThumb: season.SeriesPrimaryImageTag
        ? `${config?.jellyfinServerUrl}/Items/${season.SeriesId}/Images/Primary?api_key=${config?.jellyfinApiKey}`
        : undefined,
    }));
  }

  /**
   * Get episodes for a season
   */
  async getSeasonEpisodes(seasonId: string): Promise<JellyfinEpisodeResponse[]> {
    const config = await this.config();
    const response = await this.request<JellyfinResponse<JellyfinEpisodeResponse>>(
      `/Users/${config?.jellyfinUserId}/Items`,
      {
        ParentId: seasonId,
        Fields: "ProviderIds,Overview,ImageTags",
      }
    );
    const items = response.Items || [];

    return items.map((episode) => ({
      ...episode,
      thumbUrl: episode.ImageTags?.Primary
        ? `${config?.jellyfinServerUrl}/Items/${episode.Id}/Images/Primary?api_key=${config?.jellyfinApiKey}`
        : undefined,
    }));
  }

  /**
   * Update movie poster with a new image URL
   */
  async updateMoviePoster(itemId: string, posterUrl: string): Promise<void> {
    const config = await this.config();

    // Download the image
    const imageResponse = await fetch(posterUrl);
    if (!imageResponse.ok) {
      throw new Error("Failed to download poster image");
    }
    const imageBlob = await imageResponse.blob();

    // Upload to Jellyfin
    const url = `${config?.jellyfinServerUrl}/Items/${itemId}/Images/Primary`;
    const params = new URLSearchParams({
      api_key: config?.jellyfinApiKey || "",
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`, {
        method: "POST",
        headers: {
          "Content-Type": imageResponse.headers.get("content-type") || "image/jpeg",
          "X-Emby-Authorization": `MediaBrowser Token="${config?.jellyfinApiKey}"`,
        },
        body: imageBlob,
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update poster: ${response.status} ${response.statusText}`
        );
      }

      // Lock the poster field to prevent Jellyfin from overwriting it
      await this.lockPosterField(itemId);
    } catch (error) {
      console.error("Failed to update movie poster:", error);
      throw error;
    }
  }

  /**
   * Update movie backdrop with a new image URL
   */
  async updateMovieBackdrop(itemId: string, backdropUrl: string): Promise<void> {
    const config = await this.config();

    // Download the image
    const imageResponse = await fetch(backdropUrl);
    if (!imageResponse.ok) {
      throw new Error("Failed to download backdrop image");
    }
    const imageBlob = await imageResponse.blob();

    // Upload to Jellyfin
    const url = `${config?.jellyfinServerUrl}/Items/${itemId}/Images/Backdrop/0`;
    const params = new URLSearchParams({
      api_key: config?.jellyfinApiKey || "",
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`, {
        method: "POST",
        headers: {
          "Content-Type": imageResponse.headers.get("content-type") || "image/jpeg",
          "X-Emby-Authorization": `MediaBrowser Token="${config?.jellyfinApiKey}"`,
        },
        body: imageBlob,
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update backdrop: ${response.status} ${response.statusText}`
        );
      }

      // Lock the backdrop field to prevent Jellyfin from overwriting it
      await this.lockBackdropField(itemId);
    } catch (error) {
      console.error("Failed to update movie backdrop:", error);
      throw error;
    }
  }

  /**
   * Lock the poster field to prevent Jellyfin from changing it
   */
  private async lockPosterField(itemId: string): Promise<void> {
    const config = await this.config();
    const url = `${config?.jellyfinServerUrl}/Items/${itemId}`;
    const params = new URLSearchParams({
      api_key: config?.jellyfinApiKey || "",
    });

    try {
      // Get current item metadata
      const item = await this.getMovieDetails(itemId);

      // Update with locked image field
      const response = await fetch(`${url}?${params.toString()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Emby-Authorization": `MediaBrowser Token="${config?.jellyfinApiKey}"`,
        },
        body: JSON.stringify({
          ...item,
          LockedFields: [...(item.LockedFields || []), "Images"],
        }),
      });

      if (!response.ok) {
        console.warn("Failed to lock poster field");
      }
    } catch (error) {
      console.warn("Failed to lock poster field:", error);
    }
  }

  /**
   * Lock the backdrop field to prevent Jellyfin from changing it
   */
  private async lockBackdropField(itemId: string): Promise<void> {
    const config = await this.config();
    const url = `${config?.jellyfinServerUrl}/Items/${itemId}`;
    const params = new URLSearchParams({
      api_key: config?.jellyfinApiKey || "",
    });

    try {
      // Get current item metadata
      const item = await this.getMovieDetails(itemId);

      // Update with locked image field
      const response = await fetch(`${url}?${params.toString()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Emby-Authorization": `MediaBrowser Token="${config?.jellyfinApiKey}"`,
        },
        body: JSON.stringify({
          ...item,
          LockedFields: [...(item.LockedFields || []), "Backdrops"],
        }),
      });

      if (!response.ok) {
        console.warn("Failed to lock backdrop field");
      }
    } catch (error) {
      console.warn("Failed to lock backdrop field:", error);
    }
  }

  /**
   * Refresh metadata for a specific item
   */
  async refreshMetadata(itemId: string): Promise<void> {
    const config = await this.config();
    const url = `${config?.jellyfinServerUrl}/Items/${itemId}/Refresh`;
    const params = new URLSearchParams({
      api_key: config?.jellyfinApiKey || "",
      MetadataRefreshMode: "FullRefresh",
      ImageRefreshMode: "Default",
      ReplaceAllMetadata: "false",
      ReplaceAllImages: "false",
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`, {
        method: "POST",
        headers: {
          "X-Emby-Authorization": `MediaBrowser Token="${config?.jellyfinApiKey}"`,
        },
      });

      if (!response.ok) {
        console.warn("Failed to refresh metadata");
      }
    } catch (error) {
      console.warn("Failed to refresh metadata:", error);
    }
  }

  /**
   * Refresh library
   */
  async refreshLibrary(libraryId: string): Promise<void> {
    const config = await this.config();
    const url = `${config?.jellyfinServerUrl}/Items/${libraryId}/Refresh`;
    const params = new URLSearchParams({
      api_key: config?.jellyfinApiKey || "",
      Recursive: "true",
      MetadataRefreshMode: "Default",
      ImageRefreshMode: "Default",
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`, {
        method: "POST",
        headers: {
          "X-Emby-Authorization": `MediaBrowser Token="${config?.jellyfinApiKey}"`,
        },
      });

      if (!response.ok) {
        console.warn("Failed to refresh library");
      }
    } catch (error) {
      console.warn("Failed to refresh library:", error);
    }
  }

  /**
   * Test connection to Jellyfin server
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.request<JellyfinSystemInfo>("/System/Info");
      return !!response.Id;
    } catch {
      return false;
    }
  }

  /**
   * Get system information
   */
  async getSystemInfo(): Promise<JellyfinSystemInfo | null> {
    try {
      const response = await this.request<JellyfinSystemInfo>("/System/Info");
      return response.Id ? response : null;
    } catch {
      return null;
    }
  }
}

export const jellyfin = new JellyfinClient();

