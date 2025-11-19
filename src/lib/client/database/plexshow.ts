import { db } from "./database";
import { Insertable, Selectable, PlexShow } from "@/lib/types";

export const list = async (): Promise<Selectable<PlexShow>[]> => {
  return await db.selectFrom("PlexShow").selectAll().execute();
};

export const reset = async (): Promise<void> => {
  await db.deleteFrom("PlexShow").execute();
};

export const updateThumb = async (ratingKey: string, thumbUrl: string): Promise<void> => {
  await db.updateTable("PlexShow").set({ thumbUrl }).where("ratingKey", "=", ratingKey).execute();
};

export const updateArt = async (ratingKey: string, artUrl: string): Promise<void> => {
  await db.updateTable("PlexShow").set({ artUrl }).where("ratingKey", "=", ratingKey).execute();
};

export const count = async (): Promise<number> => {
  const { count } = await db
  .selectFrom("PlexShow")
  .select(db.fn.countAll().as("count"))
  .executeTakeFirstOrThrow();
  return Number(count);
};

export const item = async (
  id: number
): Promise<Selectable<PlexShow> | undefined> => {
  return await db
    .selectFrom("PlexShow")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirstOrThrow();
};

export const create = async (
  plexShow: Insertable<PlexShow>
): Promise<Selectable<PlexShow>> => {
  return await db
    .insertInto("PlexShow")
    .values(plexShow)
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const createMany = async (
  plexShows: Insertable<PlexShow>[]
): Promise<void> => {
  await db.transaction().execute(async (tx) => {
    for (const plexShow of plexShows) {
      await tx
        .replaceInto("PlexShow")
        .values(plexShow)
        .executeTakeFirstOrThrow();
    }
  });
};

export const plexShow = {
  list: list,
  reset: reset,
  updateThumb: updateThumb,
  updateArt: updateArt,
  count: count,
  get: item,
  create: create,
  createMany: createMany,
}