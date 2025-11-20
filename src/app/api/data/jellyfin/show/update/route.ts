import { handleMediaUpdate } from "@/app/api/data/_lib/jf_mediaHandlers";

export async function POST(request: Request) {
  return handleMediaUpdate("show", request);
}
