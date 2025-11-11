import { db } from "./database";
import { Insertable, Selectable, PlexMovie } from "@/lib/types";

export const getPlexMovies = async (): Promise<Selectable<PlexMovie>[]> => {
  return await db.selectFrom("PlexMovie").selectAll().execute();
};

export const resetPlexMovies = async (): Promise<void> => {
  await db.deleteFrom("PlexMovie").execute();
};

export const updateThumbUrl = async (ratingKey: string, thumbUrl: string): Promise<void> => {
  await db.updateTable("PlexMovie").set({ thumbUrl }).where("ratingKey", "=", ratingKey).execute();
};

export const getRecordCount = async (): Promise<number> => {
  const { count } = await db
  .selectFrom("PlexMovie")
  .select(db.fn.countAll().as("count"))
  .executeTakeFirstOrThrow();
  return Number(count);
};

export const getRecordCountShows = async (): Promise<number> => {
  const { count } = await db
  .selectFrom("PlexShow")
  .select(db.fn.countAll().as("count"))
  .executeTakeFirstOrThrow();
  return Number(count);
};

export const getPlexMovie = async (
  id: number
): Promise<Selectable<PlexMovie> | undefined> => {
  return await db
    .selectFrom("PlexMovie")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirstOrThrow();
};

export const createPlexMovie = async (
  plexMovie: Insertable<PlexMovie>
): Promise<Selectable<PlexMovie>> => {
  return await db
    .insertInto("PlexMovie")
    .values(plexMovie)
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const createManyPlexMovies = async (
  plexMovies: Insertable<PlexMovie>[]
): Promise<void> => {
  await db.transaction().execute(async (tx) => {
    for (const plexMovie of plexMovies) {
      await tx
        .replaceInto("PlexMovie")
        .values(plexMovie)
        .executeTakeFirstOrThrow();
    }
  });
};
