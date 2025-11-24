import { NextResponse, type NextRequest } from 'next/server'
import { getClients } from '@/lib/client/getClients'

export async function GET(request: NextRequest) {
	const config = await getClients();
	if (!config) {
    return NextResponse.json({
      error: "No config found",
    }, { status: 500 });
  }
	const id = request.nextUrl.searchParams.get("id");
	const data = await config.tmdb?.shows.details(id as string);
	if (!data) {
		return NextResponse.json({
			error: "Failed to fetch TMDB show details",
		}, { status: 500 });
	}
	const filtered = data.images.posters.filter(poster => poster.iso_639_1 === 'en' || poster.iso_639_1 === null);
	return NextResponse.json({
		success: true,
		data: { ...data, images: { ...data?.images, posters: filtered } },
	});
}