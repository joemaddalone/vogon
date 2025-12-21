import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
	const { path } = await request.json();

	revalidatePath(path, "page");

	return NextResponse.json({
		data: "Revalidated successfully",
	});
}
