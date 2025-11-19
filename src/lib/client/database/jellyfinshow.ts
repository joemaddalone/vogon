import { db } from "./database";
import { Insertable, Selectable, JellyfinShow } from "@/lib/types";

export const getJellyfinShows = async (): Promise<Selectable<JellyfinShow>[]> => {
  return await db.selectFrom("JellyfinShow").selectAll().execute();
};

export const resetJellyfinShows = async (): Promise<void> => {
  await db.deleteFrom("JellyfinShow").execute();
};

export const updateShowThumbUrl = async (itemId: string, thumbUrl: string): Promise<void> => {
  await db.updateTable("JellyfinShow").set({ thumbUrl }).where("itemId", "=", itemId).execute();
};

export const updateShowArtUrl = async (itemId: string, artUrl: string): Promise<void> => {
  await db.updateTable("JellyfinShow").set({ artUrl }).where("itemId", "=", itemId).execute();
};

export const getShowRecordCount = async (): Promise<number> => {
  const { count } = await db
  .selectFrom("JellyfinShow")
  .select(db.fn.countAll().as("count"))
  .executeTakeFirstOrThrow();
  return Number(count);
};

export const getJellyfinShow = async (
  id: number
): Promise<Selectable<JellyfinShow> | undefined> => {
  return await db
    .selectFrom("JellyfinShow")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirstOrThrow();
};

export const getJellyfinShowByItemId = async (
  itemId: string
): Promise<Selectable<JellyfinShow> | undefined> => {
  return await db
    .selectFrom("JellyfinShow")
    .where("itemId", "=", itemId)
    .selectAll()
    .executeTakeFirst();
};

export const createJellyfinShow = async (
  jellyfinShow: Insertable<JellyfinShow>
): Promise<Selectable<JellyfinShow>> => {
  return await db
    .insertInto("JellyfinShow")
    .values(jellyfinShow)
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const createManyJellyfinShows = async (
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

