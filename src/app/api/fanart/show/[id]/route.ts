import { NextResponse, type NextRequest } from "next/server";
import { getClients } from "@/lib/client/getClients";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const config = await getClients();
	const { id } = await params;
	if (!id) {
		return NextResponse.json({
			error: "Missing id",
		}, { status: 400 });
	}
	try {
  const posters = await config.fanart?.getShowArt(id);
    return NextResponse.json({
      data: posters
    });
  } catch (error) {
    console.error("Error fetching show posters:", error);
    return NextResponse.json({
      error: "Failed to fetch show posters",
    }, { status: 500 });
  }
}