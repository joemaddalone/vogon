import { NextResponse } from "next/server";
import { jellyfin } from "@/lib/client/jellyfin";

/**
 * GET /api/jellyfin/library/[libraryKey]
 * Retrieve all movies from a specific Plex library
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ libraryKey: string }> }
) {
  try {
    const { libraryKey } = await params;
    const movies = await jellyfin.getLibraryItems(libraryKey);

    return NextResponse.json({
      success: true,
      data: movies,
    });
  } catch (error) {
    console.error("Error fetching Plex library movies:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch movies from Plex library.",
      },
      { status: 500 }
    );
  }
}

