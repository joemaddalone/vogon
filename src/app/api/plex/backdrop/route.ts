import { NextResponse } from "next/server";
import { plex } from "@/lib/client/plex";

/**
 * POST /api/plex/backdrop
 * Update a movie's backdrop in Plex
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ratingKey, backdropUrl, serverId } = body;

    if (!ratingKey || !backdropUrl) {
      return NextResponse.json(
        {
          error: "Missing required fields: ratingKey and backdropUrl",
        },
        { status: 400 }
      );
    }

    const parsedServerId = serverId ? parseInt(String(serverId), 10) : undefined;
    await plex.updateMovieBackdrop(ratingKey, backdropUrl, parsedServerId);

    return NextResponse.json({
      data: "Backdrop updated successfully",
    });
  } catch (error) {
    console.error("Error updating Plex movie backdrop:", error);
    return NextResponse.json(
      {
        error: "Failed to update movie backdrop.",
      },
      { status: 500 }
    );
  }
}
