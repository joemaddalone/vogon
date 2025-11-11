import { NextResponse } from "next/server";
import { getRecordCount, getRecordCountShows } from "@/lib/client/database";

/**
 * GET /api/plex/library/movies
 */
export async function GET() {
  try {
    const count = await getRecordCount();
    const countShows = await getRecordCountShows();
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