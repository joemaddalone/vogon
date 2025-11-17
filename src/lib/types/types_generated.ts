import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Configuration = {
    id: Generated<number>;
    plexServerUrl: string | null;
    plexToken: string | null;
    tmdbApiKey: string | null;
    fanartApiKey: string | null;
    removeOverlays: Generated<number>;
    thePosterDbEmail: string | null;
    thePosterDbPassword: string | null;
};
export type PlexEpisode = {
    id: Generated<number>;
    ratingKey: string;
    parentRatingKey: string;
    title: string;
    index: number | null;
    parentIndex: number | null;
    year: number | null;
    summary: string | null;
    thumbUrl: string | null;
    artUrl: string | null;
    duration: number | null;
    guid: string | null;
    importedAt: Generated<string>;
};
export type PlexMovie = {
    id: Generated<number>;
    ratingKey: string;
    libraryKey: string;
    title: string;
    year: number | null;
    summary: string | null;
    thumbUrl: string | null;
    artUrl: string | null;
    duration: number | null;
    rating: number | null;
    contentRating: string | null;
    addedAt: number;
    updatedAt: number;
    guid: string | null;
    importedAt: Generated<string>;
};
export type PlexSeason = {
    id: Generated<number>;
    ratingKey: string;
    parentRatingKey: string;
    type: string;
    title: string;
    parentKey: string;
    parentTitle: string | null;
    summary: string | null;
    index: number | null;
    year: number | null;
    thumbUrl: string | null;
    artUrl: string | null;
    parentThumb: string | null;
    parentTheme: string | null;
};
export type PlexShow = {
    id: Generated<number>;
    ratingKey: string;
    libraryKey: string;
    title: string;
    year: number | null;
    summary: string | null;
    thumbUrl: string | null;
    artUrl: string | null;
    duration: number | null;
    rating: number | null;
    contentRating: string | null;
    addedAt: number;
    updatedAt: number;
    guid: string | null;
    importedAt: Generated<string>;
};
export type DB = {
    Configuration: Configuration;
    PlexEpisode: PlexEpisode;
    PlexMovie: PlexMovie;
    PlexSeason: PlexSeason;
    PlexShow: PlexShow;
};
