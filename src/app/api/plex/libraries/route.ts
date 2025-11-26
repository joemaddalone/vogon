import { NextResponse } from "next/server";
import { getClients } from "@/lib/client/getClients";
import { MediaServerClient } from "@/lib/client/mediaserver";
/**
 * GET /api/plex/libraries
 * Retrieve all libraries from the Plex server
 */
export async function GET() {
  const config = await getClients();
  if(!config) {
    return NextResponse.json({
      error: "No config found",
    }, { status: 500 });
  }
  const mediaServer = new MediaServerClient(config.type!);
  try {
    const libraries = await mediaServer.getLibraries();

    // Filter to only show movie libraries
    const mediaLibraries = libraries.filter(
      (lib) => lib.type === "movie" || lib.type === "show"
    ).sort((a, b) => a.type.localeCompare(b.type));

    return NextResponse.json({
      data: mediaLibraries,
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

