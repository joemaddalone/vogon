import { handleMediaImport } from "@/app/api/data/_lib/jf_mediaHandlers";

export async function POST(request: Request) {
  return handleMediaImport("show", request);
}
