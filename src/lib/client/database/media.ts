import { db } from "./database";
import { Insertable, Selectable, Media, MediaTypeEnum } from "@/lib/types";

// Common operations for all media types
export const list = async (type: MediaTypeEnum, serverId: number): Promise<Selectable<Media>[]> => {
  let query = db.selectFrom("Media").where("serverId", "=", serverId);

  if (type) {
    query = query.where("type", "=", type);
  }

  return await query.selectAll().execute();
};

export const getById = async (
  id: number
): Promise<Selectable<Media> | undefined> => {
  return await db
    .selectFrom("Media")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirstOrThrow();
};

export const getByRatingKey = async (
  ratingKey: string,
  serverId: number
): Promise<Selectable<Media>> => {
  return await db
    .selectFrom("Media")
    .where("ratingKey", "=", ratingKey)
		.where("serverId", "=", serverId)
    .selectAll()
    .executeTakeFirstOrThrow();
};

export const byParentRatingKey = async (
  parentRatingKey: string,
  serverId: number
): Promise<Selectable<Media>[]> => {
  return await db
    .selectFrom("Media")
    .where("parentRatingKey", "=", parentRatingKey)
    .where("serverId", "=", serverId)
    .selectAll()
    .execute();
};

export const count = async (type: MediaTypeEnum, serverId: number): Promise<number> => {
  let query = db.selectFrom("Media").where("serverId", "=", serverId);

  if (type) {
    query = query.where("type", "=", type);
  }

  const result = await query
    .select(db.fn.countAll().as("count"))
    .executeTakeFirstOrThrow();

  return Number(result.count);
};

export const reset = async (type: MediaTypeEnum, serverId: number): Promise<void> => {
  let query = db.deleteFrom("Media").where("serverId", "=", serverId);

  if (type) {
    query = query.where("type", "=", type);
  }

  await query.execute();
};

export const updateThumb = async (
  ratingKey: string,
  thumbUrl: string,
  serverId: number
): Promise<void> => {
  await db
    .updateTable("Media")
    .set({ thumbUrl })
    .where("ratingKey", "=", ratingKey)
    .where("serverId", "=", serverId)
    .execute();
};

export const updateArt = async (
  ratingKey: string,
  artUrl: string,
  serverId: number
): Promise<void> => {
  await db
    .updateTable("Media")
    .set({ artUrl })
    .where("ratingKey", "=", ratingKey)
    .where("serverId", "=", serverId)
    .execute();
};

export const create = async (
  media: Insertable<Media>
): Promise<Selectable<Media>> => {
  return await db
    .insertInto("Media")
    .values(media)
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const createMany = async (
  mediaItems: Insertable<Media>[]
): Promise<void> => {
  await db.transaction().execute(async (tx) => {
    for (const media of mediaItems) {
      await tx
        .replaceInto("Media")
        .values(media)
        .executeTakeFirstOrThrow();
    }
  });
};

// Type-specific helper methods
export const bySeason = async (
  seasonRatingKey: string,
  serverId: number
): Promise<Selectable<Media>[]> => {
  return byParentRatingKey(seasonRatingKey, serverId);
};

export const byShow = async (
  showRatingKey: string,
  serverId: number
): Promise<Selectable<Media>[]> => {
  return byParentRatingKey(showRatingKey, serverId);
};

// Export organized by media type for backward compatibility and clarity
export const media = {
  // Common operations
  list,
  getById,
  getByRatingKey,
  byParentRatingKey,
  count,
  reset,
  updateThumb,
  updateArt,
  create,
  createMany,

  // Type-specific aliases
  bySeason,
  byShow,

  // Organized by type
  movie: {
    list: (serverId: number) => list(MediaTypeEnum.MOVIE, serverId),
    get: getById,
    count: (serverId: number) => count(MediaTypeEnum.MOVIE, serverId),
    reset: (serverId: number) => reset(MediaTypeEnum.MOVIE, serverId),
    updateThumb,
    updateArt,
    create,
    createMany,
  },

  show: {
    list: (serverId: number) => list(MediaTypeEnum.SHOW, serverId),
    get: getById,
    count: (serverId: number) => count(MediaTypeEnum.SHOW, serverId),
    reset: (serverId: number) => reset(MediaTypeEnum.SHOW, serverId),
    updateThumb,
    updateArt,
    create,
    createMany,
  },

  season: {
    list: (serverId: number) => list(MediaTypeEnum.SEASON, serverId),
    get: getByRatingKey,
    byShow,
    reset: (serverId: number) => reset(MediaTypeEnum.SEASON, serverId),
    updateThumb,
    updateArt,
    create,
    createMany,
  },

  episode: {
    list: (serverId: number) => list(MediaTypeEnum.EPISODE, serverId),
    get: getByRatingKey,
    bySeason,
    reset: (serverId: number) => reset(MediaTypeEnum.EPISODE, serverId),
    create,
    createMany,
  },
};

