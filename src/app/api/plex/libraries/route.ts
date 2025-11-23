import { NextResponse } from "next/server";
import { plex } from "@/lib/client/plex";

/**
 * GET /api/plex/libraries
 * Retrieve all libraries from the Plex server
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const serverId = searchParams.get("serverId")
      ? parseInt(searchParams.get("serverId")!, 10)
      : undefined;

    const libraries = await plex.getLibraries(serverId);

    // Filter to only show movie libraries
    const movieLibraries = libraries.filter(
      (lib) => lib.type === "movie" || lib.type === "show"
    ).sort((a, b) => a.type.localeCompare(b.type));

    return NextResponse.json({
      data: movieLibraries,
    });
  } catch (error) {
    console.error("Error fetching Plex libraries:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch Plex libraries. Check your Plex server configuration.",
      },
      { status: 500 }
    );
  }
}

