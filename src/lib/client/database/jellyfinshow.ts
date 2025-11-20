import { db } from "./database";
import { Insertable, Selectable, JellyfinShow } from "@/lib/types";

export const list = async (): Promise<Selectable<JellyfinShow>[]> => {
  return await db.selectFrom("JellyfinShow").selectAll().execute();
};

export const reset = async (): Promise<void> => {
  await db.deleteFrom("JellyfinShow").execute();
};

export const updateThumb = async (itemId: string, thumbUrl: string): Promise<void> => {
  await db.updateTable("JellyfinShow").set({ thumbUrl }).where("itemId", "=", itemId).execute();
};

export const updateArt = async (itemId: string, artUrl: string): Promise<void> => {
  await db.updateTable("JellyfinShow").set({ artUrl }).where("itemId", "=", itemId).execute();
};

export const count = async (): Promise<number> => {
  const { count } = await db
  .selectFrom("JellyfinShow")
  .select(db.fn.countAll().as("count"))
  .executeTakeFirstOrThrow();
  return Number(count);
};

export const item = async (
  id: number
): Promise<Selectable<JellyfinShow> | undefined> => {
  return await db
    .selectFrom("JellyfinShow")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirstOrThrow();
};

export const byItemId = async (
  itemId: string
): Promise<Selectable<JellyfinShow> | undefined> => {
  return await db
    .selectFrom("JellyfinShow")
    .where("itemId", "=", itemId)
    .selectAll()
    .executeTakeFirst();
};

export const create = async (
  jellyfinShow: Insertable<JellyfinShow>
): Promise<Selectable<JellyfinShow>> => {
  return await db
    .insertInto("JellyfinShow")
    .values(jellyfinShow)
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const createMany = async (
  jellyfinShows: Insertable<JellyfinShow>[]
): Promise<void> => {
  await db.transaction().execute(async (tx) => {
    for (const jellyfinShow of jellyfinShows) {
      await tx
        .replaceInto("JellyfinShow")
        .values(jellyfinShow)
        .executeTakeFirstOrThrow();
    }
  });
};

export const jellyfinShow = {
  list: list,
  reset: reset,
  updateThumb: updateThumb,
  updateArt: updateArt,
  count: count,
  get: item,
  byItemId: byItemId,
  create: create,
  createMany: createMany,
}