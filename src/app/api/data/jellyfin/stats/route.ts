import { NextResponse } from "next/server";
import { dataManager as DM } from "@/lib/client/database";

/**
 * GET /api/plex/library/movies
 */
export async function GET() {
  try {
    const count = await DM.jellyfin.movie.count();
    const countShows = await DM.jellyfin.show.count();
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