import { handleMediaUpdate } from "@/app/api/data/_lib/mediaHandlers";

export async function POST(request: Request) {
  return handleMediaUpdate("season", request);
}
