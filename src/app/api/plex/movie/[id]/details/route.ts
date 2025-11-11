import { NextResponse } from "next/server";
import { plex } from "@/lib/client/plex";

/**
 * GET /api/plex/movie/[id]/details
 * Get movie details from local database
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const movie = await plex.getMovieDetails(id);

    return NextResponse.json({
      data: movie,
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

