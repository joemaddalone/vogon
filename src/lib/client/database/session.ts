import { db } from "./database";
import { Insertable, Updateable, Session, Selectable } from "@/lib/types";

export const getSessions = async () => {
  return await db.selectFrom("Session").selectAll().execute();
};

// we're just using the first session for this refactor.
// the end result appears to be single server support for now.
export const getSession = async (): Promise<Selectable<Session> | undefined> => {
	return await db.selectFrom("Session").selectAll().executeTakeFirst();
};

export const createSession = async (session: Insertable<Session>) => {
	return await db.insertInto("Session").values(session).returningAll().executeTakeFirstOrThrow();
};

export const updateSession = async (id: number, session: Updateable<Session>) => {
	return await db.updateTable("Session").set(session).where("id", "=", id).returningAll().executeTakeFirstOrThrow();
};

export const deleteSession = async (id: number) => {
	return await db.deleteFrom("Session").where("id", "=", id).execute();
};