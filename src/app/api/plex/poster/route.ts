import { NextResponse } from "next/server";
import { plex } from "@/lib/client/plex";
import { getClients } from "@/lib/client/getClients";
import { MediaServerClient } from "@/lib/client/mediaserver";

/**
 * POST /api/plex/poster
 * Update a movie's poster in Plex
 */
export async function POST(request: Request) {
  const config = await getClients();
  if(!config) {
    return NextResponse.json({
      error: "No config found",
    }, { status: 500 });
  }
  const mediaServer = new MediaServerClient(config.type!);
  try {
    const body = await request.json();
    const { ratingKey, posterUrl } = body;

    if (!ratingKey || !posterUrl) {
      return NextResponse.json(
        {
          error: "Missing required fields: ratingKey and posterUrl",
        },
        { status: 400 }
      );
    }

    await mediaServer.updateMoviePoster(ratingKey, posterUrl);
    if (!config.userid && Boolean(config?.removeOverlays) === true) {
      try {
        await plex.removeOverlay(ratingKey);
      } catch (error) {
        console.error("Error removing overlay:", error);
      }
    }

    return NextResponse.json({
      data: "Poster updated successfully",
    });
  } catch (error) {
    console.error("Error updating Plex movie poster:", error);
    return NextResponse.json(
      {
        error: "Failed to update movie poster.",
      },
      { status: 500 }
    );
  }
}
