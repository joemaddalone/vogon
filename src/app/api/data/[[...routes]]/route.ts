import { Elysia } from "elysia";
import {
	handleMediaList,
	handleMediaUpdate,
	handleMediaReset,
	handleMediaImport,
	handleMediaCache,
} from "@/app/api/data/_lib/mediaHandlers";
import { NextResponse } from "next/server";
import { dataManager as DM } from "@/lib/client/database";
import { getServers, createServer, updateServer, deleteServer } from "@/lib/client/database";
import { getSession, createSession, updateSession, deleteSession } from "@/lib/client/database";


const app = new Elysia({ prefix: "/api/data" });

// movies
app.get("/movie", async () => handleMediaList("movie"));
app.post("/movie/update", async ({ request }) => handleMediaUpdate("movie", request));
app.get("/movie/reset", async () => handleMediaReset("movie"));
app.post("/movie/import", async ({ request }) => handleMediaImport("movie", request));

// shows
app.get("/show", async () => handleMediaList("show"));
app.post("/show/update", async ({ request }) => handleMediaUpdate("show", request));
app.get("/show/reset", async () => handleMediaReset("show"));
app.post("/show/import", async ({ request }) => handleMediaImport("show", request));
app.get('/show/episode/cache', async ({ request }) => handleMediaCache(request));

// seasons
app.post('/season/update', async ({ request }) => handleMediaUpdate("season", request));

// servers
app.get("/server", async () => {
	const servers = await getServers();
	return NextResponse.json({ data: servers });
});
app.post("/server", async ({ request }) => {
	const body = await request.json();
	const server = await createServer(body);
	return NextResponse.json({ data: server });
});
app.put("/server", async ({ request }) => {
	const body = await request.json();
	const server = await updateServer(body.id, body);
	return NextResponse.json({ data: server });
});
app.delete("/server", async ({ request }) => {
	const body = await request.json();
	await deleteServer(body.id);
	return NextResponse.json({ data: { success: true } });
});

// session
app.get("/session", async () => {
	const session = await getSession();
	return NextResponse.json({ data: session });
});
app.post("/session", async ({ request }) => {
	const body = await request.json();
	const session = await createSession(body);
	return NextResponse.json({ data: session });
});
app.put("/session", async ({ request }) => {
	const body = await request.json();
	const session = await updateSession(body.sessionId, body.serverId);
	return NextResponse.json({ data: session });
});
app.delete("/session", async ({ request }) => {
	const body = await request.json();
	const session = await deleteSession(body);
	return NextResponse.json({ data: session });
});

//stats
app.get("/stats", async () => {
	try {
		const count = await DM.plex.movie.count();
		const countShows = await DM.plex.show.count();
		return NextResponse.json({
			data: {
				movies: count,
				shows: countShows,
			},
		});
	} catch (error) {
		console.error("Error fetching imported movies:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch movies from database",
			},
			{ status: 500 }
		);
	}
});



export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const DELETE = app.handle;

