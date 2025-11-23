import { handleMediaImport } from "@/app/api/data/_lib/mediaHandlers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { serverId, items, libraryKey } = body;

  if (!serverId) {
    return NextResponse.json(
      { error: "serverId is required" },
      { status: 400 }
    );
  }

  return handleMediaImport("show", { items, libraryKey }, parseInt(String(serverId), 10));
}
