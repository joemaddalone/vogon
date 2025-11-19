import { db } from "./database";
import { Insertable, Selectable, JellyfinMovie } from "@/lib/types";

export const getJellyfinMovies = async (): Promise<Selectable<JellyfinMovie>[]> => {
  return await db.selectFrom("JellyfinMovie").selectAll().execute();
};

export const resetJellyfinMovies = async (): Promise<void> => {
  await db.deleteFrom("JellyfinMovie").execute();
};

export const updateThumbUrl = async (itemId: string, thumbUrl: string): Promise<void> => {
  await db.updateTable("JellyfinMovie").set({ thumbUrl }).where("itemId", "=", itemId).execute();
};

export const updateArtUrl = async (itemId: string, artUrl: string): Promise<void> => {
  await db.updateTable("JellyfinMovie").set({ artUrl }).where("itemId", "=", itemId).execute();
};

export const getRecordCount = async (): Promise<number> => {
  const { count } = await db
  .selectFrom("JellyfinMovie")
  .select(db.fn.countAll().as("count"))
  .executeTakeFirstOrThrow();
  return Number(count);
};

export const getJellyfinMovie = async (
  id: number
): Promise<Selectable<JellyfinMovie> | undefined> => {
  return await db
    .selectFrom("JellyfinMovie")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirstOrThrow();
};

export const getJellyfinMovieByItemId = async (
  itemId: string
): Promise<Selectable<JellyfinMovie> | undefined> => {
  return await db
    .selectFrom("JellyfinMovie")
    .where("itemId", "=", itemId)
    .selectAll()
    .executeTakeFirst();
};

export const createJellyfinMovie = async (
  jellyfinMovie: Insertable<JellyfinMovie>
): Promise<Selectable<JellyfinMovie>> => {
  return await db
    .insertInto("JellyfinMovie")
    .values(jellyfinMovie)
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const createManyJellyfinMovies = async (
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

