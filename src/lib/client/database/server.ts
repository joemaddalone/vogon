import { db } from "./database";
import { Insertable, Updateable, Server } from "@/lib/types";

export const getServers = async () => {
  return await db.selectFrom("Server").selectAll().execute();
};

export const getServer = async (id: number) => {
  return await db.selectFrom("Server").where("id", "=", id).selectAll().executeTakeFirst();
};

export const createServer = async (server: Insertable<Server>) => {
  return await db.insertInto("Server").values(server).returningAll().executeTakeFirstOrThrow();
};

export const updateServer = async (id: number, server: Updateable<Server>) => {
  return await db.updateTable("Server").set(server).where("id", "=", id).returningAll().executeTakeFirstOrThrow();
};

export const deleteServer = async (id: number) => {
  return await db.deleteFrom("Server").where("id", "=", id).execute();
};