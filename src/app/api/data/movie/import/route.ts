import { handleMediaImport } from "@/app/api/data/_lib/mediaHandlers";

export async function POST(request: Request) {
  return handleMediaImport("movie", request);
}
