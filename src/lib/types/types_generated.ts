import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Configuration = {
    id: Generated<number>;
    tmdbApiKey: string | null;
    fanartApiKey: string | null;
    removeOverlays: Generated<number>;
    thePosterDbEmail: string | null;
    thePosterDbPassword: string | null;
};
export type Media = {
    id: Generated<number>;
    artUrl: string | null;
    contentRating: string | null;
    duration: number | null;
    guid: string | null;
    index: number | null;
    libraryKey: string | null;
    parentIndex: number | null;
    parentKey: string | null;
    parentRatingKey: string | null;
    parentTheme: string | null;
    parentThumb: string | null;
    parentTitle: string | null;
    rating: number | null;
    ratingKey: string;
    summary: string | null;
    thumbUrl: string | null;
    title: string;
    type: Generated<number>;
    year: number | null;
};
export type Server = {
    id: Generated<number>;
    name: string;
    url: string;
    token: string;
    userid: string | null;
    type: string;
};
export type DB = {
    Configuration: Configuration;
    Media: Media;
    Server: Server;
};
