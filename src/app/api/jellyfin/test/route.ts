import { NextResponse } from "next/server";
import { jellyfin } from "@/lib/client/jellyfin";

/**
 * GET /api/plex/test
 * Test connection to Plex server
 */
export async function GET() {
  try {
    const isConnected = await jellyfin.testConnection();

    if (isConnected) {
      return NextResponse.json({
        data: "Successfully connected to Jellyfin server",
      });
    } else {
      return NextResponse.json(
        {
          error: "Could not connect to Jellyfin server",
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Jellyfin connection test failed:", error);
    return NextResponse.json(
      {
        error: "Failed to test Jellyfin connection",
      },
      { status: 500 }
    );
  }
}

