import { db } from "./database";
import { Insertable, Selectable, Media, MediaTypeEnum } from "@/lib/types";

// Common operations for all media types
export const list = async (type?: MediaTypeEnum): Promise<Selectable<Media>[]> => {
  let query = db.selectFrom("Media");

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
  ratingKey: string
): Promise<Selectable<Media>> => {
  return await db
    .selectFrom("Media")
    .where("ratingKey", "=", ratingKey)
    .selectAll()
    .executeTakeFirstOrThrow();
};

export const byParentRatingKey = async (
  parentRatingKey: string
): Promise<Selectable<Media>[]> => {
  return await db
    .selectFrom("Media")
    .where("parentRatingKey", "=", parentRatingKey)
    .selectAll()
    .execute();
};

export const count = async (type?: MediaTypeEnum): Promise<number> => {
  let query = db.selectFrom("Media");

  if (type) {
    query = query.where("type", "=", type);
  }

  const result = await query
    .select(db.fn.countAll().as("count"))
    .executeTakeFirstOrThrow();

  return Number(result.count);
};

export const reset = async (type?: MediaTypeEnum): Promise<void> => {
  let query = db.deleteFrom("Media");

  if (type) {
    query = query.where("type", "=", type);
  }

  await query.execute();
};

export const updateThumb = async (
  ratingKey: string,
  thumbUrl: string
): Promise<void> => {
  await db
    .updateTable("Media")
    .set({ thumbUrl })
    .where("ratingKey", "=", ratingKey)
    .execute();
};

export const updateArt = async (
  ratingKey: string,
  artUrl: string
): Promise<void> => {
  await db
    .updateTable("Media")
    .set({ artUrl })
    .where("ratingKey", "=", ratingKey)
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
  seasonRatingKey: string
): Promise<Selectable<Media>[]> => {
  return byParentRatingKey(seasonRatingKey);
};

export const byShow = async (
  showRatingKey: string
): Promise<Selectable<Media>[]> => {
  return byParentRatingKey(showRatingKey);
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
    list: () => list(MediaTypeEnum.MOVIE),
    get: getById,
    count: () => count(MediaTypeEnum.MOVIE),
    reset: () => reset(MediaTypeEnum.MOVIE),
    updateThumb,
    updateArt,
    create,
    createMany,
  },

  show: {
    list: () => list(MediaTypeEnum.SHOW),
    get: getById,
    count: () => count(MediaTypeEnum.SHOW),
    reset: () => reset(MediaTypeEnum.SHOW),
    updateThumb,
    updateArt,
    create,
    createMany,
  },

  season: {
    list: () => list(MediaTypeEnum.SEASON),
    get: getByRatingKey,
    byShow,
    reset: () => reset(MediaTypeEnum.SEASON),
    updateThumb,
    updateArt,
    create,
    createMany,
  },

  episode: {
    list: () => list(MediaTypeEnum.EPISODE),
    get: getByRatingKey,
    bySeason,
    reset: () => reset(MediaTypeEnum.EPISODE),
    create,
    createMany,
  },
};

