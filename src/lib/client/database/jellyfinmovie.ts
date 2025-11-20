import { db } from "./database";
import { Insertable, Selectable, JellyfinMovie } from "@/lib/types";

export const list = async (): Promise<Selectable<JellyfinMovie>[]> => {
  return await db.selectFrom("JellyfinMovie").selectAll().execute();
};

export const reset = async (): Promise<void> => {
  await db.deleteFrom("JellyfinMovie").execute();
};

export const updateThumb = async (itemId: string, thumbUrl: string): Promise<void> => {
  await db.updateTable("JellyfinMovie").set({ thumbUrl }).where("itemId", "=", itemId).execute();
};

export const updateArt = async (itemId: string, artUrl: string): Promise<void> => {
  await db.updateTable("JellyfinMovie").set({ artUrl }).where("itemId", "=", itemId).execute();
};

export const count = async (): Promise<number> => {
  const { count } = await db
  .selectFrom("JellyfinMovie")
  .select(db.fn.countAll().as("count"))
  .executeTakeFirstOrThrow();
  return Number(count);
};

export const item = async (
  id: number
): Promise<Selectable<JellyfinMovie> | undefined> => {
  return await db
    .selectFrom("JellyfinMovie")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirstOrThrow();
};

export const byItemId = async (
  itemId: string
): Promise<Selectable<JellyfinMovie> | undefined> => {
  return await db
    .selectFrom("JellyfinMovie")
    .where("itemId", "=", itemId)
    .selectAll()
    .executeTakeFirst();
};

export const create = async (
  jellyfinMovie: Insertable<JellyfinMovie>
): Promise<Selectable<JellyfinMovie>> => {
  return await db
    .insertInto("JellyfinMovie")
    .values(jellyfinMovie)
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const createMany = async (
  jellyfinMovies: Insertable<JellyfinMovie>[]
): Promise<void> => {
  await db.transaction().execute(async (tx) => {
    for (const jellyfinMovie of jellyfinMovies) {
      await tx
        .replaceInto("JellyfinMovie")
        .values(jellyfinMovie)
        .executeTakeFirstOrThrow();
    }
  });
};

export const jellyfinMovie = {
  list: list,
  reset: reset,
  updateThumb: updateThumb,
  updateArt: updateArt,
  count: count,
  get: item,
  create: create,
  createMany: createMany,
  byItemId: byItemId,
}

