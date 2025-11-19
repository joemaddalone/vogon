import { db } from "./database";
import { Insertable, Selectable, JellyfinSeason } from "@/lib/types";

export const getJellyfinSeasons = async (): Promise<Selectable<JellyfinSeason>[]> => {
  return await db.selectFrom("JellyfinSeason").selectAll().execute();
};

export const getJellyfinSeasonsBySeriesId = async (
  seriesId: string
): Promise<Selectable<JellyfinSeason>[]> => {
  return await db
    .selectFrom("JellyfinSeason")
    .where("seriesId", "=", seriesId)
    .selectAll()
    .execute();
};

export const resetJellyfinSeasons = async (): Promise<void> => {
  await db.deleteFrom("JellyfinSeason").execute();
};

export const updateSeasonThumbUrl = async (itemId: string, thumbUrl: string): Promise<void> => {
  await db.updateTable("JellyfinSeason").set({ thumbUrl }).where("itemId", "=", itemId).execute();
};

export const updateSeasonArtUrl = async (itemId: string, artUrl: string): Promise<void> => {
  await db.updateTable("JellyfinSeason").set({ artUrl }).where("itemId", "=", itemId).execute();
};

export const getSeasonRecordCount = async (): Promise<number> => {
  const { count } = await db
  .selectFrom("JellyfinSeason")
  .select(db.fn.countAll().as("count"))
  .executeTakeFirstOrThrow();
  return Number(count);
};

export const getJellyfinSeason = async (
  id: number
): Promise<Selectable<JellyfinSeason> | undefined> => {
  return await db
    .selectFrom("JellyfinSeason")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirstOrThrow();
};

export const getJellyfinSeasonByItemId = async (
  itemId: string
): Promise<Selectable<JellyfinSeason> | undefined> => {
  return await db
    .selectFrom("JellyfinSeason")
    .where("itemId", "=", itemId)
    .selectAll()
    .executeTakeFirst();
};

export const createJellyfinSeason = async (
  jellyfinSeason: Insertable<JellyfinSeason>
): Promise<Selectable<JellyfinSeason>> => {
  return await db
    .insertInto("JellyfinSeason")
    .values(jellyfinSeason)
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const createManyJellyfinSeasons = async (
  jellyfinSeasons: Insertable<JellyfinSeason>[]
): Promise<void> => {
  await db.transaction().execute(async (tx) => {
    for (const jellyfinSeason of jellyfinSeasons) {
      await tx
        .replaceInto("JellyfinSeason")
        .values(jellyfinSeason)
        .executeTakeFirstOrThrow();
    }
  });
};

