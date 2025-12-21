import { NextResponse } from "next/server";
import { getClients } from "@/lib/client/getClients";
import { MediaServerClient } from "@/lib/client/mediaserver";

export async function POST(request: Request) {
	const config = await getClients();
	if (!config) {
		return NextResponse.json({
			error: "No config found",
		}, { status: 500 });
	}
	const mediaServer = new MediaServerClient(config.type!);
	const { ratingKey, base64 } = await request.json();

	if (!ratingKey || !base64) {
		return NextResponse.json(
			{
				error: "Missing required fields: ratingKey and base64",
			},
			{ status: 400 }
		);
	}

	await mediaServer.updateEpisodePoster(ratingKey, base64);

	return NextResponse.json({
		data: "Poster updated successfully",
	});
}