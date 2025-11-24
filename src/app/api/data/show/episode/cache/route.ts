import { NextResponse } from "next/server";
import { existsSync } from "fs";
import { writeFile, mkdir } from "fs/promises";
import fs from "fs";
import { join, dirname } from "path";
import { dataManager as DM } from "@/lib/client/database";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ratingKey = searchParams.get("ratingKey");

  if (!ratingKey) {
    return NextResponse.json(
      { error: "Season ID is required" },
      { status: 400 }
    );
  }

  const episode = await DM.plex.episode.get(ratingKey);

  if (!episode.thumbUrl) {
    return NextResponse.json({ error: "no thumb url" }, { status: 400 });
  }

  const imagePath = join(
    process.cwd(),
    "public",
    "cache",
    "episodes",
    `${episode.ratingKey}.jpg`
  );

  if (!existsSync(imagePath)) {
    const image = await fetch(episode.thumbUrl);
    const imageBlob = await image.blob();
    const imageBuffer = await imageBlob.arrayBuffer();
    const imageData = Buffer.from(imageBuffer);
    const imageDir = dirname(imagePath);
    await mkdir(imageDir, { recursive: true });
    await writeFile(imagePath, imageData);
  }

  // return base64 image form imagePath
	const imageBase64 = fs.readFileSync(imagePath, 'base64');

  return NextResponse.json({ data: `data:image/jpeg;base64,${imageBase64}` });
}
