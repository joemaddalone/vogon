import { NextResponse, type NextRequest  } from "next/server";
import { jellyfin } from "@/lib/client/jellyfin";

/**
 * GET /api/jellyfin/library/[libraryKey]/movies
 * Get all imported movies from a specific library
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ libraryKey: string }> }
) {
  try {
    const { libraryKey } = await params;
    const movies = await jellyfin.getLibraryItems(libraryKey);

    return NextResponse.json({ data: movies });
  } catch (error) {
    console.error("Error fetching movies from Plex library:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch movies from Plex library.",
      },
      { status: 500 }
    );
  }
}

