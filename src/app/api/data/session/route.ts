import { NextRequest, NextResponse } from "next/server";
import { getSession, createSession, updateSession, deleteSession } from "@/lib/client/database";

export async function GET() {
  const session = await getSession();
  return NextResponse.json({ data: session });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const session = await createSession(body);
  return NextResponse.json({ data: session });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const session = await updateSession(body.sessionId, body.serverId);
  return NextResponse.json({ data: session });
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const session = await deleteSession(body);
  return NextResponse.json({ data: session });
}