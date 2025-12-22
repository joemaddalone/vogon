import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const ratingKey = searchParams.get("ratingKey");

	if (!ratingKey) {
		return new NextResponse("ratingKey is required", { status: 400 });
	}

	// Sanitize ratingKey to prevent directory traversal
	// The directory contains numeric IDs and hex strings
	if (!/^[a-zA-Z0-9]+$/.test(ratingKey)) {
		return new NextResponse("Invalid ratingKey format", { status: 400 });
	}

	const filePath = path.join(process.cwd(), "public", "cache", "episodes", `${ratingKey}.jpg`);

	try {
		const file = await fs.readFile(filePath);
		return new NextResponse(file, {
			headers: {
				"Content-Type": "image/jpeg",
				"Cache-Control": "public, max-age=31536000, immutable",
			},
		});
	} catch (error) {
		return new NextResponse("File not found", { status: 404 });
	}
}
