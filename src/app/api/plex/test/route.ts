import { NextResponse } from "next/server";
import { getClients } from "@/lib/client/getClients";
import { MediaServerClient } from "@/lib/client/mediaserver";


/**
 * GET /api/plex/test
 * Test connection to Plex server
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
    const isConnected = await mediaServer.testConnection();

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

