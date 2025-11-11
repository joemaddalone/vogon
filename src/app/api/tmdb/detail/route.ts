import { NextResponse, type NextRequest } from 'next/server'
import { getClients } from '@/lib/client/getClients'

export async function GET(request: NextRequest) {
	const config = await getClients();
	const id = request.nextUrl.searchParams.get("id");
	const data = await config.tmdb?.movies.details({ movie_id: parseInt(id as string),  append_to_response: ["images"] });
	const filtered = data?.images.posters.filter(poster => poster.iso_639_1 === 'en' || poster.iso_639_1 === null);
	return NextResponse.json({
		success: true,
		data: { ...data, images: { ...data?.images, posters: filtered } },
	});
}