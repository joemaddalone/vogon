import { db } from "./database";
import { Insertable, Selectable, Configuration } from "@/lib/types";

export const getConfiguration = async (): Promise<Selectable<Configuration> | null> => {
  const config = await db.selectFrom("Configuration").selectAll().executeTakeFirst();
  // const servers = await getServers();
  // we're just using the first server for this refactor.
  // the end result appears to be single server support for now.
  return config || null;
};

export const hasConfiguration = async (): Promise<boolean> => {
  const config = await getConfiguration();
  return config !== null && config.tmdbApiKey !== null;
};

export const upsertConfiguration = async (
  config: Insertable<Configuration>
): Promise<Selectable<Configuration>> => {
  // Check if a configuration exists
  const existing = await getConfiguration();

  if (existing) {
    // Update existing configuration
    return await db
      .updateTable("Configuration")
      .set(config)
      .where("id", "=", existing.id)
      .returningAll()
      .executeTakeFirstOrThrow();
  } else {
    // Create new configuration
    return await db
      .insertInto("Configuration")
      .values(config)
      .returningAll()
      .executeTakeFirstOrThrow();
  }
};

