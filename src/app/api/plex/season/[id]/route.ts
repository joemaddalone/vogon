import { NextResponse } from "next/server";
import { plex } from "@/lib/client/plex";
import { dataManager as DM } from "@/lib/client/database";

/**
 * GET /api/plex/season/[id]/details
 * Get movie details from local database
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const show = await plex.getMovieDetails(id);
    const episodes = await DM.plex.episode.bySeason(id);

    const data = {...show, episodes: episodes };

    return NextResponse.json({
      data: data,
    });
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch movie details",
      },
      { status: 500 }
    );
  }
}

