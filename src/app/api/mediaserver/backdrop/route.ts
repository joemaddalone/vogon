import { NextResponse } from "next/server";
import { getClients } from "@/lib/client/getClients";
import { MediaServerClient } from "@/lib/client/mediaserver";

/**
 * POST /api/mediaserver/backdrop
 * Update a movie's backdrop in the media server
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
    const { ratingKey, backdropUrl } = body;

    if (!ratingKey || !backdropUrl) {
      return NextResponse.json(
        {
          error: "Missing required fields: ratingKey and backdropUrl",
        },
        { status: 400 }
      );
    }

    await mediaServer.updateMovieBackdrop(ratingKey, backdropUrl);

    return NextResponse.json({
      data: "Backdrop updated successfully",
    });
  } catch (error) {
    console.error("Error updating media server movie backdrop:", error);
    return NextResponse.json(
      {
        error: "Failed to update movie backdrop.",
      },
      { status: 500 }
    );
  }
}
