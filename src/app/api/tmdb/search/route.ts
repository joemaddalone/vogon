import { NextResponse, type NextRequest } from "next/server";
import { getClients } from "@/lib/client/getClients";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");
  const config = await getClients();
  const data = await config.tmdb?.search.movies({
    query: query as string,
    include_adult: false,
    region: "US"
  });
  return NextResponse.json({
    success: true,
    data: data?.results ?? [],
  });
}
