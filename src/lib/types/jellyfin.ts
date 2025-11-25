export type JellyfinLibraryResponse = {
  Name: string;
  ServerId: string;
  Id: string;
  CollectionType: string;
  ItemId: string;
};

export type JellyfinMovieResponse = {
  Id: string;
  Name: string;
  ServerId: string;
  Type: string;
  ImageTags?: {
    Primary?: string;
    Backdrop?: string;
  };
  BackdropImageTags?: string[];
  PremiereDate?: string;
  ProductionYear?: number;
  OfficialRating?: string;
  Overview?: string;
  CommunityRating?: number;
  RunTimeTicks?: number;
  ProviderIds?: {
    Tmdb?: string;
    Imdb?: string;
    Tvdb?: string;
  };
  DateCreated?: string;
  DateLastMediaAdded?: string;
  thumbUrl?: string;
  artUrl?: string;
};

export type JellyfinShowResponse = {
  Id: string;
  Name: string;
  ServerId: string;
  Type: string;
  ImageTags?: {
    Primary?: string;
    Backdrop?: string;
  };
  BackdropImageTags?: string[];
  PremiereDate?: string;
  ProductionYear?: number;
  OfficialRating?: string;
  Overview?: string;
  CommunityRating?: number;
  RunTimeTicks?: number;
  ProviderIds?: {
    Tmdb?: string;
    Imdb?: string;
    Tvdb?: string;
  };
  DateCreated?: string;
  DateLastMediaAdded?: string;
  thumbUrl?: string;
  artUrl?: string;
};

export type JellyfinSeasonResponse = {
  Id: string;
  Name: string;
  ServerId: string;
  SeriesId: string;
  SeriesName: string;
  Type: string;
  IndexNumber?: number;
  IndexNumberEnd?: number;
  PremiereDate?: string;
  ProductionYear?: number;
  Overview?: string;
  ImageTags?: {
    Primary?: string;
    Backdrop?: string;
  };
  BackdropImageTags?: string[];
  ParentBackdropImageTags?: string[];
  ProviderIds?: {
    Tmdb?: string;
    Imdb?: string;
    Tvdb?: string;
  };
  SeriesPrimaryImageTag?: string;
  thumbUrl?: string;
  artUrl?: string;
  parentThumb?: string;
};

export type JellyfinEpisodeResponse = {
  Id: string;
  Name: string;
  ServerId: string;
  SeriesId: string;
  SeasonId: string;
  Type: string;
  IndexNumber?: number;
  ParentIndexNumber?: number;
  PremiereDate?: string;
  ProductionYear?: number;
  Overview?: string;
  ImageTags?: {
    Primary?: string;
  };
  SeriesName?: string;
  SeasonName?: string;
  CommunityRating?: number;
  OfficialRating?: string;
  RunTimeTicks?: number;
  ProviderIds?: {
    Tmdb?: string;
    Imdb?: string;
    Tvdb?: string;
  };
  SeriesPrimaryImageTag?: string;
  SeriesThumbImageTag?: string;
  thumbUrl?: string;
  artUrl?: string;
};

export type JellyfinResponse<T> = {
  Items?: T[];
  TotalRecordCount?: number;
  StartIndex?: number;
};

export type JellyfinSystemInfo = {
  Id: string;
  ServerName: string;
  Version: string;
  OperatingSystem: string;
};

export type JellyfinLibrary = {
  Id: string;
  Name: string;
  CollectionType: string;
};

export type JellyfinMovieMetadata = JellyfinMovieResponse & {
  Studios?: Array<{ Name: string; Id: string }>;
  Genres?: Array<{ Name: string; Id: string }>;
  MediaSources?: Array<{
    Id: string;
    Path: string;
    Type: string;
  }>;
  LockedFields?: string[];
};

export type JellyfinShowMetadata = JellyfinShowResponse & {
  Studios?: Array<{ Name: string; Id: string }>;
  Genres?: Array<{ Name: string; Id: string }>;
  MediaSources?: Array<{
    Id: string;
    Path: string;
    Type: string;
  }>;
  LockedFields?: string[];
};

export type JellyfinSeasonMetadata = JellyfinSeasonResponse & {
  SeriesStudio?: string;
};
