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
        plexServerUrl: config.plexServerUrl,
        plexToken: config.plexToken ? "••••••••" : null,
        tmdbApiKey: config.tmdbApiKey ? "••••••••" : null,
        fanartApiKey: config.fanartApiKey ? "••••••••" : null,
        removeOverlays: config.removeOverlays ?? 0,
        thePosterDbEmail: config.thePosterDbEmail,
        thePosterDbPassword: config.thePosterDbPassword ? "••••••••" : null,
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
      plexServerUrl,
      plexToken,
      tmdbApiKey,
      fanartApiKey,
      removeOverlays,
      thePosterDbEmail,
      thePosterDbPassword,
    } = body;

    // Validate required fields
    if (!plexServerUrl || !plexToken || !tmdbApiKey) {
      return NextResponse.json(
        { error: "Plex Server URL, Plex Token, and TMDB API Key are required" },
        { status: 400 }
      );
    }

    // Get existing config to preserve masked values if they weren't changed
    const existingConfig = await getConfiguration();

    const configToSave = {
      plexServerUrl,
      plexToken:
        plexToken === "••••••••" && existingConfig?.plexToken
          ? existingConfig.plexToken
          : plexToken,
      tmdbApiKey:
        tmdbApiKey === "••••••••" && existingConfig?.tmdbApiKey
          ? existingConfig.tmdbApiKey
          : tmdbApiKey,
      fanartApiKey:
        fanartApiKey === "••••••••" && existingConfig?.fanartApiKey
          ? existingConfig.fanartApiKey
          : fanartApiKey || null,
      removeOverlays: removeOverlays ? 1 : 0,
      thePosterDbEmail:
        thePosterDbEmail === "••••••••" && existingConfig?.thePosterDbEmail
          ? existingConfig.thePosterDbEmail
          : thePosterDbEmail,
      thePosterDbPassword:
        thePosterDbPassword === "••••••••" &&
        existingConfig?.thePosterDbPassword
          ? existingConfig.thePosterDbPassword
          : thePosterDbPassword,
    };

    const config = await upsertConfiguration(configToSave);

    return NextResponse.json({
      data: {
        id: config.id,
        plexServerUrl: config.plexServerUrl,
        plexToken: "••••••••",
        tmdbApiKey: "••••••••",
        fanartApiKey: config.fanartApiKey ? "••••••••" : null,
        removeOverlays: Boolean(config.removeOverlays),
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
