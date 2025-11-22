export type FetchedMedia = {
  file_path: string;
  previewUrl?: string;
  source?: string;
  season?: string;
};

export enum MediaTypeEnum {
  MOVIE = 1,
  SHOW = 2,
  SEASON = 3,
  EPISODE = 4,
}