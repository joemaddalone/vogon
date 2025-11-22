import { NextRequest, NextResponse } from "next/server";
import { getServers, createServer, updateServer, deleteServer } from "@/lib/client/database";

export async function GET() {
  const servers = await getServers();
  return NextResponse.json({ data: servers });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const server = await createServer(body);
  return NextResponse.json({ data: server });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const server = await updateServer(body.id, body);
  return NextResponse.json({ data: server });
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
   await deleteServer(body.id);
  return NextResponse.json({ data: { success: true } });
}