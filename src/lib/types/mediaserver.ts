/**
 * Normalized types for media server responses
 * These types provide a unified interface regardless of the underlying server (Plex/Jellyfin)
 */

export type NormalizedLibrary = {
  id: string; // Plex: key, Jellyfin: Id
  name: string; // Plex: title, Jellyfin: Name
  type: "movie" | "show"; // Normalized from Plex: type, Jellyfin: CollectionType
};

export type NormalizedMediaItem = {
  ratingKey: string; // Plex: ratingKey, Jellyfin: Id
  title: string; // Plex: title, Jellyfin: Name
  year?: number; // Plex: year, Jellyfin: ProductionYear
  thumbUrl?: string;
  artUrl?: string;
  summary?: string; // Plex: summary, Jellyfin: Overview
  rating?: number; // Plex: rating, Jellyfin: CommunityRating
  contentRating?: string; // Plex: contentRating, Jellyfin: OfficialRating
  duration?: number; // Plex: duration (seconds), Jellyfin: RunTimeTicks (convert to seconds)
  originallyAvailableAt?: string; // Plex: originallyAvailableAt, Jellyfin: PremiereDate
};

export type NormalizedSeason = {
  ratingKey: string; // Plex: ratingKey, Jellyfin: Id
  title: string; // Plex: title, Jellyfin: Name
  seriesId: string; // Plex: parentRatingKey, Jellyfin: SeriesId
  index?: number; // Plex: index, Jellyfin: IndexNumber
  thumbUrl?: string;
  artUrl?: string;
  parentThumb?: string;
  summary?: string; // Plex: summary, Jellyfin: Overview
  year?: number; // Plex: year, Jellyfin: ProductionYear

};

export type NormalizedEpisode = {
  ratingKey: string; // Plex: ratingKey, Jellyfin: Id
  title: string; // Plex: title, Jellyfin: Name
  seasonId: string; // Plex: parentRatingKey, Jellyfin: SeasonId
  index?: number; // Plex: index, Jellyfin: IndexNumber
  thumbUrl?: string;
  summary?: string; // Plex: summary, Jellyfin: Overview
  rating?: number; // Plex: audienceRating, Jellyfin: CommunityRating
  originallyAvailableAt?: string; // Plex: originallyAvailableAt, Jellyfin: PremiereDate
  duration?: number; // Plex: duration (seconds), Jellyfin: RunTimeTicks (convert to seconds)
  parentIndex?: number; // Plex: parentIndex, Jellyfin: ParentIndexNumber
};

export type NormalizedMovieDetails = NormalizedMediaItem & {
  // Additional fields for detailed movie metadata
  studio?: string;
  genres?: string[];
  providerIds?: {
    tmdb?: string;
    imdb?: string;
    tvdb?: string;
  };
};

