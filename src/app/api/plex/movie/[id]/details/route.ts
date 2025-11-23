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
    const { searchParams } = new URL(request.url);
    const serverId = searchParams.get("serverId")
      ? parseInt(searchParams.get("serverId")!, 10)
      : undefined;

    const movie = await plex.getMovieDetails(id, serverId);

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

