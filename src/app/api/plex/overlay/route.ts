import { NextResponse } from "next/server";
import { plex } from "@/lib/client/plex";

export async function POST(request: Request) {
  const { ratingKey } = await request.json();

  if (!ratingKey) {
    return NextResponse.json(
      {
        error: "Missing required fields: ratingKey",
      },
      { status: 400 }
    );
  }
  try {
    await plex.removeOverlay(ratingKey);
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
