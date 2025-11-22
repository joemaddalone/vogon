import { NextResponse } from "next/server";
import { upsertConfiguration, getConfiguration } from "@/lib/client/database";
import { getClients } from "@/lib/client/getClients";

/**
 * GET /api/config
 * Get current configuration (with sensitive data masked)
 */
export async function GET() {
  try {
    const config = await getClients();

    if (!config) {
      return NextResponse.json({ data: null });
    }

    // Mask sensitive data
    return NextResponse.json({
      data: {
        tmdbApiKey: config.tmdbApiKey || null,
        fanartApiKey: config.fanartApiKey || null,
        removeOverlays: config.removeOverlays ?? 0,
        thePosterDbEmail: config.thePosterDbEmail || null,
        thePosterDbPassword: config.thePosterDbPassword || null,
      },
    });
  } catch (error) {
    console.error("Error fetching configuration:", error);
    return NextResponse.json(
      { error: "Failed to fetch configuration" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/config
 * Update configuration
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      tmdbApiKey,
      fanartApiKey,
      removeOverlays,
      thePosterDbEmail,
      thePosterDbPassword,
    } = body;

    // Validate required fields
    if (!tmdbApiKey) {
      return NextResponse.json(
        { error: "TMDB API Key is required" },
        { status: 400 }
      );
    }

    // Get existing config to preserve masked values if they weren't changed
    const existingConfig = await getConfiguration();

    const configToSave = {
      tmdbApiKey: tmdbApiKey !== null ? tmdbApiKey : existingConfig?.tmdbApiKey,
      fanartApiKey: fanartApiKey !== null ? fanartApiKey : existingConfig?.fanartApiKey,
      removeOverlays: removeOverlays ? 1 : 0,
      thePosterDbEmail: thePosterDbEmail !== null ? thePosterDbEmail : existingConfig?.thePosterDbEmail,
      thePosterDbPassword: thePosterDbPassword !== null ? thePosterDbPassword : existingConfig?.thePosterDbPassword,
    };

    const config = await upsertConfiguration(configToSave);

    return NextResponse.json({
      data: {
        id: config.id,
        tmdbApiKey: config?.tmdbApiKey || null,
        fanartApiKey: config?.fanartApiKey || null,
        removeOverlays: Boolean(config.removeOverlays),
        thePosterDbEmail: config?.thePosterDbEmail || null,
        thePosterDbPassword: config?.thePosterDbPassword || null,
      },
    });
  } catch (error) {
    console.error("Error updating configuration:", error);
    return NextResponse.json(
      { error: "Failed to update configuration" },
      { status: 500 }
    );
  }
}
