import { db } from "./database";
import { Insertable, Selectable, PlexSeason } from "@/lib/types";

export const list = async (): Promise<Selectable<PlexSeason>[]> => {
  return await db.selectFrom("PlexSeason").selectAll().execute();
};

export const byParent = async (
  ratingKey: string
): Promise<Selectable<PlexSeason>[]> => {
  return await db
    .selectFrom("PlexSeason")
    .where("parentRatingKey", "=", ratingKey)
    .selectAll()
    .execute();
};

export const getPlexSeason = async (
  ratingKey: string
): Promise<Selectable<PlexSeason>> => {
    return await db
      .selectFrom("PlexSeason")
      .where("ratingKey", "=", ratingKey)
      .selectAll()
      .executeTakeFirstOrThrow();

};


export const updateThumb = async (ratingKey: string, thumbUrl: string): Promise<void> => {
  await db.updateTable("PlexSeason").set({ thumbUrl }).where("ratingKey", "=", ratingKey).execute();
};

export const updateArt = async (ratingKey: string, artUrl: string): Promise<void> => {
  await db.updateTable("PlexSeason").set({ artUrl }).where("ratingKey", "=", ratingKey).execute();
};

export const reset = async (): Promise<void> => {
  await db.deleteFrom("PlexSeason").execute();
};

export const create = async (
  plexSeason: Insertable<PlexSeason>
): Promise<Selectable<PlexSeason>> => {
  return await db
    .insertInto("PlexSeason")
    .values(plexSeason)
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const createMany = async (
  plexSeasons: Insertable<PlexSeason>[]
): Promise<void> => {
  await db.transaction().execute(async (tx) => {
    for (const plexSeason of plexSeasons) {
      await tx
        .replaceInto("PlexSeason")
        .values(plexSeason)
        .executeTakeFirstOrThrow();
    }
  });
};

export const plexSeason = {
  list: list,
  byShow: byParent,
  updateThumb: updateThumb,
  updateArt: updateArt,
  get: getPlexSeason,
  reset: reset,
  create: create,
  createMany: createMany,
}