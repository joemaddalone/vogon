import { handleMediaReset } from "@/app/api/data/_lib/mediaHandlers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serverId = searchParams.get("serverId");

  if (!serverId) {
    return NextResponse.json(
      { error: "serverId is required" },
      { status: 400 }
    );
  }

  return handleMediaReset("movie", parseInt(serverId, 10));
}
