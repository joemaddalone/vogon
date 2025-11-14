import { db } from "./database";
import { Insertable, Selectable, PlexSeason } from "@/lib/types";

export const getPlexSeasons = async (): Promise<Selectable<PlexSeason>[]> => {
  return await db.selectFrom("PlexSeason").selectAll().execute();
};

export const getPlexSeasonByShow = async (
  ratingKey: string
): Promise<Selectable<PlexSeason>[]> => {
  return await db
    .selectFrom("PlexSeason")
    .where("parentRatingKey", "=", ratingKey)
    .selectAll()
    .execute();
};

export const resetPlexSeasons = async (): Promise<void> => {
  await db.deleteFrom("PlexSeason").execute();
};

export const createPlexSeason = async (
  plexSeason: Insertable<PlexSeason>
): Promise<Selectable<PlexSeason>> => {
  return await db
    .insertInto("PlexSeason")
    .values(plexSeason)
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const createManyPlexSeasons = async (
  plexSeasons: Insertable<PlexSeason>[]
): Promise<void> => {
  await db.transaction().execute(async (tx) => {
    for (const plexSeason of plexSeasons) {
      await tx
        .insertInto("PlexSeason")
        .values(plexSeason)
        .executeTakeFirstOrThrow();
    }
  });
};
