import { NextResponse } from "next/server";
import { getClients } from "@/lib/client/getClients";
import { MediaServerClient } from "@/lib/client/mediaserver";


/**
 * GET /api/mediaserver/test
 * Test connection to the media server
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
        data: "Successfully connected to the media server",
      });
    } else {
      return NextResponse.json(
        {
          error: "Could not connect to the media server",
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Media server connection test failed:", error);
    return NextResponse.json(
      {
        error: "Failed to test media server connection",
      },
      { status: 500 }
    );
  }
}

