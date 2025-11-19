import { db } from "./database";
import { Insertable, Selectable, PlexMovie } from "@/lib/types";

export const list = async (): Promise<Selectable<PlexMovie>[]> => {
  return await db.selectFrom("PlexMovie").selectAll().execute();
};

export const reset = async (): Promise<void> => {
  await db.deleteFrom("PlexMovie").execute();
};

export const updateThumb = async (ratingKey: string, thumbUrl: string): Promise<void> => {
  await db.updateTable("PlexMovie").set({ thumbUrl }).where("ratingKey", "=", ratingKey).execute();
};

export const updateArt = async (ratingKey: string, artUrl: string): Promise<void> => {
  await db.updateTable("PlexMovie").set({ artUrl }).where("ratingKey", "=", ratingKey).execute();
};

export const count = async (): Promise<number> => {
  const { count } = await db
  .selectFrom("PlexMovie")
  .select(db.fn.countAll().as("count"))
  .executeTakeFirstOrThrow();
  return Number(count);
};

export const item = async (
  id: number
): Promise<Selectable<PlexMovie> | undefined> => {
  return await db
    .selectFrom("PlexMovie")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirstOrThrow();
};

export const create = async (
  plexMovie: Insertable<PlexMovie>
): Promise<Selectable<PlexMovie>> => {
  return await db
    .insertInto("PlexMovie")
    .values(plexMovie)
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const createMany = async (
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

export const plexMovie = {
  list: list,
  reset: reset,
  updateThumb: updateThumb,
  updateArt: updateArt,
  count: count,
  get: item,
  create: create,
  createMany: createMany,
}