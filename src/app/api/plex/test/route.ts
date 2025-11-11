import { NextResponse } from "next/server";
import { plex } from "@/lib/client/plex";

/**
 * GET /api/plex/test
 * Test connection to Plex server
 */
export async function GET() {
  try {
    const isConnected = await plex.testConnection();

    if (isConnected) {
      return NextResponse.json({
        data: "Successfully connected to Plex server",
      });
    } else {
      return NextResponse.json(
        {
          error: "Could not connect to Plex server",
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Plex connection test failed:", error);
    return NextResponse.json(
      {
        error: "Failed to test Plex connection",
      },
      { status: 500 }
    );
  }
}

