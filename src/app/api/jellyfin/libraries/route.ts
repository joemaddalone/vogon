import { NextResponse } from "next/server";
import { jellyfin } from "@/lib/client/jellyfin";

/**
 * GET /api/jellyfin/libraries
 * Retrieve all libraries from the Jellyfin server
 */
export async function GET() {
  try {
    const libraries = await jellyfin.getLibraries();

    // Filter to only show movie libraries
    const movieLibraries = libraries.filter(
      (lib) => lib.CollectionType === "movies" || lib.CollectionType === "tvshows"
    ).sort((a, b) => a.Name.localeCompare(b.Name));

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

