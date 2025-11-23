import { NextResponse, type NextRequest  } from "next/server";
import { plex } from "@/lib/client/plex";

/**
 * GET /api/plex/library/[libraryKey]/movies
 * Get all imported movies from a specific library
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ libraryKey: string }> }
) {
  try {
    const { libraryKey } = await params;
    const { searchParams } = new URL(request.url);
    const serverId = searchParams.get("serverId")
      ? parseInt(searchParams.get("serverId")!, 10)
      : undefined;

    const movies = await plex.getLibraryItems(libraryKey, serverId);

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

