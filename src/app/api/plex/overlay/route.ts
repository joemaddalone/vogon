import { NextResponse } from "next/server";
import { plex } from "@/lib/client/plex";

export async function POST(request: Request) {
  const { ratingKey, serverId } = await request.json();

  if (!ratingKey) {
    return NextResponse.json(
      {
        error: "Missing required fields: ratingKey",
      },
      { status: 400 }
    );
  }
  try {
    const parsedServerId = serverId ? parseInt(String(serverId), 10) : undefined;
    await plex.removeOverlay(ratingKey, parsedServerId);
    return NextResponse.json({
      data: "Overlay removed successfully",
    });
  } catch (error) {
    console.error("Error removing overlay:", error);
    return NextResponse.json(
      {
        error: "Failed to remove overlay",
      },
      { status: 500 }
    );
  }
}
