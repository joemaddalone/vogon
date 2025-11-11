import { handleMediaList } from "@/app/api/data/_lib/mediaHandlers";

export async function GET() {
  return handleMediaList("movie");
}