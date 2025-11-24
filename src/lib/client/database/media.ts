import { db } from "./database";
import { Insertable, Selectable, Media, MediaTypeEnum } from "@/lib/types";
import { getSession } from "./session";

const getServerId = async () => {
  const session = await getSession();
  if (!session) {
    throw new Error("Session not found");
  }
  return session.serverId;

}

// Common operations for all media types
export const list = async (type?: MediaTypeEnum): Promise<Selectable<Media>[]> => {
  const serverId = await getServerId();
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
  ratingKey: string
): Promise<Selectable<Media>> => {
  const serverId = await getServerId();
  return await db
    .selectFrom("Media")
    .where("ratingKey", "=", ratingKey)
    .where("serverId", "=", serverId)
    .selectAll()
    .executeTakeFirstOrThrow();
};

export const byParentRatingKey = async (
  parentRatingKey: string
): Promise<Selectable<Media>[]> => {
  const serverId = await getServerId();
  return await db
    .selectFrom("Media")
    .where("parentRatingKey", "=", parentRatingKey)
    .where("serverId", "=", serverId)
    .selectAll()
    .execute();
};

export const count = async (type?: MediaTypeEnum): Promise<number> => {
  const serverId = await getServerId();
  let query = db.selectFrom("Media").where("serverId", "=", serverId);

  if (type) {
    query = query.where("type", "=", type);
  }

  const result = await query
    .select(db.fn.countAll().as("count"))
    .executeTakeFirstOrThrow();

  return Number(result.count);
};

export const reset = async (type?: MediaTypeEnum): Promise<void> => {
  const serverId = await getServerId();
  let query = db.deleteFrom("Media").where("serverId", "=", serverId);

  if (type) {
    query = query.where("type", "=", type);
  }

  await query.execute();
};

export const updateThumb = async (
  ratingKey: string,
  thumbUrl: string
): Promise<void> => {
  const serverId = await getServerId();
  await db
    .updateTable("Media")
    .set({ thumbUrl })
    .where("ratingKey", "=", ratingKey)
    .where("serverId", "=", serverId)
    .execute();
};

export const updateArt = async (
  ratingKey: string,
  artUrl: string
): Promise<void> => {
  const serverId = await getServerId();
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
  const serverId = await getServerId();
  return await db
    .insertInto("Media")
    .values({ ...media, serverId })
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const createMany = async (
  mediaItems: Insertable<Media>[]
): Promise<void> => {
  const serverId = await getServerId();
  await db.transaction().execute(async (tx) => {
    for (const media of mediaItems) {
      await tx
        .replaceInto("Media")
        .values({ ...media, serverId })
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

