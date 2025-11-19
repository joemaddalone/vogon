import { db } from "./database";
import { Insertable, Selectable, PlexEpisode } from "@/lib/types";

export const list = async (): Promise<Selectable<PlexEpisode>[]> => {
  return await db.selectFrom("PlexEpisode").selectAll().execute();
};

export const byParent = async (
  ratingKey: string
): Promise<Selectable<PlexEpisode>[]> => {
  return await db
    .selectFrom("PlexEpisode")
    .where("parentRatingKey", "=", ratingKey)
    .selectAll()
    .execute();
};

export const item = async (
  ratingKey: string
): Promise<Selectable<PlexEpisode>> => {
  return await db
    .selectFrom("PlexEpisode")
    .where("ratingKey", "=", ratingKey)
    .selectAll()
    .executeTakeFirstOrThrow();
};

export const reset = async (): Promise<void> => {
  await db.deleteFrom("PlexEpisode").execute();
};

export const create = async (
  plexEpisode: Insertable<PlexEpisode>
): Promise<Selectable<PlexEpisode>> => {
  return await db
    .insertInto("PlexEpisode")
    .values(plexEpisode)
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const createMany = async (
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
  list: list,
  bySeason: byParent,
  get: item,
  reset: reset,
  create: create,
  createMany: createMany,
}