import { NextResponse } from "next/server";
import { plex } from "@/lib/client/plex";

/**
 * GET /api/plex/library/[libraryKey]
 * Retrieve all movies from a specific Plex library
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ libraryKey: string }> }
) {
  try {
    const { libraryKey } = await params;
    const { searchParams } = new URL(request.url);
    const serverId = searchParams.get("serverId")
      ? parseInt(searchParams.get("serverId")!, 10)
      : undefined;

    const movies = await plex.getLibraryItems(libraryKey, serverId);

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

