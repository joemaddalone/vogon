import { NextResponse, type NextRequest } from "next/server";
import { getClients } from "@/lib/client/getClients";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const config = await getClients();
  if (!config) {
    return NextResponse.json({
      error: "No config found",
    }, { status: 500 });
  }
	const { id } = await params;
	if (!id) {
		return NextResponse.json({
			error: "Missing id",
		}, { status: 400 });
	}
	try {
  const posters = await config.fanart?.getMovieArt(id);
    return NextResponse.json({
      data: posters
    });
  } catch (error) {
    console.error("Error fetching movie posters:", error);
    return NextResponse.json({
      error: "Failed to fetch movie posters",
    }, { status: 500 });
  }
}