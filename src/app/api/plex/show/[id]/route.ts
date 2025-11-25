import { NextResponse } from "next/server";
import { MediaServerClient } from "@/lib/client/mediaserver";
import { getClients } from "@/lib/client/getClients";
import  { dataManager as DM } from "@/lib/client/database";

/**
 * GET /api/plex/show/[id]/details
 * Get movie details from local database
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const config = await getClients();
  if(!config) {
    return NextResponse.json({
      error: "No config found",
    }, { status: 500 });
  }
  const mediaServer = new MediaServerClient(config.type!);
  try {
    const { id } = await params;
    const show = await mediaServer.getMovieDetails(id);
    const seasons = await DM.plex.season.byShow(id);

    const data = {
      ...show,
      seasons: seasons,
    };

    return NextResponse.json({
      data: data,
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

