import { NextResponse } from "next/server";
import { MediaServerClient } from "@/lib/client/mediaserver";
import { getClients } from "@/lib/client/getClients";

/**
 * GET /api/plex/library/[libraryKey]
 * Retrieve all movies from a specific Plex library
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ libraryKey: string }> }
) {
  const config = await getClients();
  if(!config) {
    return NextResponse.json({
      error: "No config found",
    }, { status: 500 });
  }
  const mediaServer = new MediaServerClient(config.type!);
  try {
    const { libraryKey } = await params;
    const movies = await mediaServer.getLibraryItems(libraryKey);

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

