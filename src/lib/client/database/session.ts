import { db } from "./database";
import { Insertable, Session, Selectable } from "@/lib/types";

export const getSessions = async () => {
  return await db.selectFrom("Session").selectAll().execute();
};

// we're only tracking one session
export const getSession = async (): Promise<Selectable<Session> | undefined> => {
	return await db.selectFrom("Session").selectAll().executeTakeFirst();
};

export const createSession = async (session: Insertable<Session>) => {
	return await db.insertInto("Session").values(session).returningAll().executeTakeFirstOrThrow();
};

export const updateSession = async (sessionId: number, serverId: number) => {
	console.log('updateSession', sessionId, serverId);
	return await db.updateTable("Session").set('serverId', serverId).where("id", "=", sessionId).returningAll().executeTakeFirst();
};

export const deleteSession = async (id: number) => {
	return await db.deleteFrom("Session").where("id", "=", id).execute();
};