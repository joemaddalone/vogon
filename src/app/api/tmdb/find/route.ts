import { NextResponse, type NextRequest } from "next/server";
import { getClients } from "@/lib/client/getClients";
import type { FindParams } from "@/lib/types";

export async function GET(request: NextRequest) {
    const config = await getClients();
    const external_id = request.nextUrl.searchParams.get("external_id") as string
    const external_source = request.nextUrl.searchParams.get("external_source") as FindParams['external_source']

	if (!external_id) {
		return NextResponse.json({
			error: "Missing external_id",
		}, { status: 400 });
	}

  try {
  const data = await config.tmdb?.find(
      external_id,
      external_source
    );
    return NextResponse.json({
      data: data ?? [],
    });
  } catch (error) {
    console.error("Error fetching TMDB data:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch TMDB data",
      },
      { status: 500 }
    );
  }

}
