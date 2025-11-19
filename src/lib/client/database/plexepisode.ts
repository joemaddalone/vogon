import { db } from "./database";
import { Insertable, Selectable, PlexEpisode } from "@/lib/types";

export const getPlexEpisodes = async (): Promise<Selectable<PlexEpisode>[]> => {
  return await db.selectFrom("PlexEpisode").selectAll().execute();
};

export const getEpisodeBySeason = async (
  ratingKey: string
): Promise<Selectable<PlexEpisode>[]> => {
  return await db
    .selectFrom("PlexEpisode")
    .where("parentRatingKey", "=", ratingKey)
    .selectAll()
    .execute();
};

export const getPlexEpisode = async (
  ratingKey: string
): Promise<Selectable<PlexEpisode>> => {
  return await db
    .selectFrom("PlexEpisode")
    .where("ratingKey", "=", ratingKey)
    .selectAll()
    .executeTakeFirstOrThrow();
};

export const resetPlexEpisodes = async (): Promise<void> => {
  await db.deleteFrom("PlexEpisode").execute();
};

export const createPlexEpisode = async (
  plexEpisode: Insertable<PlexEpisode>
): Promise<Selectable<PlexEpisode>> => {
  return await db
    .insertInto("PlexEpisode")
    .values(plexEpisode)
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const createManyPlexEpisodes = async (
  plexEpisodes: Insertable<PlexEpisode>[]
): Promise<void> => {
  await db.transaction().execute(async (tx) => {
    for (const plexEpisode of plexEpisodes) {
      await tx
        .replaceInto("PlexEpisode")
        .values(plexEpisode)
        .executeTakeFirstOrThrow();
    }
  });
};


export const plexEpisode = {
  getEpisodes: getPlexEpisodes,
  getEpisodeBySeason: getEpisodeBySeason,
  getPlexEpisode: getPlexEpisode,
  resetPlexEpisodes: resetPlexEpisodes,
  createPlexEpisode: createPlexEpisode,
  createManyPlexEpisodes: createManyPlexEpisodes,
}