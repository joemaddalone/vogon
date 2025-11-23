import { NextResponse } from "next/server";
import { dataManager as DM } from "@/lib/client/database";

/**
 * GET /api/data/stats
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return NextResponse.json(
        { error: "serverId is required" },
        { status: 400 }
      );
    }

    const parsedServerId = parseInt(serverId, 10);
    const count = await DM.plex.movie.count(parsedServerId);
    const countShows = await DM.plex.show.count(parsedServerId);
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
}