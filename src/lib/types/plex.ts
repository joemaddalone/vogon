export type PlexLibraryResponse = {
  key: string;
  title: string;
  type: string;
  agent: string;
  scanner: string;
  language: string;
  uuid: string;
  updatedAt: number;
  createdAt: number;
  scannedAt: number;
}

export type PlexMovieResponse = {
  ratingKey: string;
  key: string;
  guid: string;
  studio: string;
  type: string;
  title: string;
  contentRating?: string;
  summary: string;
  rating?: number;
  year: number;
  thumb?: string;
  art?: string;
  duration: number;
  originallyAvailableAt?: string;
  addedAt: number;
  updatedAt: number;
  thumbUrl?: string;
  artUrl?: string;
}

export type PlexShowResponse = {
  ratingKey: string;
  key: string;
  guid: string;
  studio: string;
  type: string;
  title: string;
  contentRating?: string;
  summary: string;
  rating?: number;
  year: number;
  thumb?: string;
  art?: string;
  duration: number;
  originallyAvailableAt?: string;
  addedAt: number;
  updatedAt: number;
  thumbUrl?: string;
  artUrl?: string;
}

export type PlexSeasonResponse = {
  ratingKey: string;
  parentRatingKey: string;
  key: string;
  guid: string;
  parentGuid: string;
  parentSlug?: string;
  parentStudio?: string;
  type: string;
  title: string;
  titleSort?: string;
  parentKey: string;
  parentTitle?: string;
  summary?: string;
  index?: number;
  parentIndex?: number;
  year?: number;
  thumb?: string;
  art?: string;
  thumbUrl?: string;
  artUrl?: string;
  parentThumb?: string;
  parentTheme?: string;
}

export type PlexResponse<T> = {
  MediaContainer: {
    size: number;
    allowSync: boolean;
    identifier: string;
    mediaTagPrefix: string;
    mediaTagVersion: number;
    Directory?: T[];
    Metadata?: T[];
  };
}

export type PlexLibrary = {
  key: string;
  title: string;
  type: string;
}

export type PlexMovieMetadata = PlexMovieResponse & {
  Guid: Record<string, string>[],
  librarySectionTitle: string;
  librarySectionID: number;
  librarySectionKey: string;
}

export type PlexShowMetadata = PlexShowResponse & {
  Guid: Record<string, string>[],
  librarySectionTitle: string;
  librarySectionID: number;
  librarySectionKey: string;
}

export type PlexSeasonMetadata = PlexSeasonResponse & {
  Guid: Record<string, string>[],
  librarySectionTitle: string;
  librarySectionID: number;
  librarySectionKey: string;
}