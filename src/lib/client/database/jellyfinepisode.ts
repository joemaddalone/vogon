import { db } from "./database";
import { Insertable, Selectable, JellyfinEpisode } from "@/lib/types";

export const getJellyfinEpisodes = async (): Promise<Selectable<JellyfinEpisode>[]> => {
  return await db.selectFrom("JellyfinEpisode").selectAll().execute();
};

export const bySeason = async (
  seasonId: string
): Promise<Selectable<JellyfinEpisode>[]> => {
  return await db
    .selectFrom("JellyfinEpisode")
    .where("seasonId", "=", seasonId)
    .selectAll()
    .execute();
};

export const bySeries = async (
  seriesId: string
): Promise<Selectable<JellyfinEpisode>[]> => {
  return await db
    .selectFrom("JellyfinEpisode")
    .where("seriesId", "=", seriesId)
    .selectAll()
    .execute();
};

export const reset = async (): Promise<void> => {
  await db.deleteFrom("JellyfinEpisode").execute();
};

export const updateThumb = async (itemId: string, thumbUrl: string): Promise<void> => {
  await db.updateTable("JellyfinEpisode").set({ thumbUrl }).where("itemId", "=", itemId).execute();
};

export const count = async (): Promise<number> => {
  const { count } = await db
  .selectFrom("JellyfinEpisode")
  .select(db.fn.countAll().as("count"))
  .executeTakeFirstOrThrow();
  return Number(count);
};

export const item = async (
  id: number
): Promise<Selectable<JellyfinEpisode> | undefined> => {
  return await db
    .selectFrom("JellyfinEpisode")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirstOrThrow();
};

export const byItemId = async (
  itemId: string
): Promise<Selectable<JellyfinEpisode> | undefined> => {
  return await db
    .selectFrom("JellyfinEpisode")
    .where("itemId", "=", itemId)
    .selectAll()
    .executeTakeFirst();
};

export const create = async (
  jellyfinEpisode: Insertable<JellyfinEpisode>
): Promise<Selectable<JellyfinEpisode>> => {
  return await db
    .insertInto("JellyfinEpisode")
    .values(jellyfinEpisode)
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const createMany = async (
  jellyfinEpisodes: Insertable<JellyfinEpisode>[]
): Promise<void> => {
  await db.transaction().execute(async (tx) => {
    for (const jellyfinEpisode of jellyfinEpisodes) {
      await tx
        .replaceInto("JellyfinEpisode")
        .values(jellyfinEpisode)
        .executeTakeFirstOrThrow();
    }
  });
};

export const jellyfinEpisode = {
  list: getJellyfinEpisodes,
  bySeason: bySeason,
  bySeries: bySeries,
  byItemId: byItemId,
  reset: reset,
  updateThumb: updateThumb,
  count: count,
  get: item,
  create: create,
  createMany: createMany,
}