import { handleMediaReset } from "@/app/api/data/_lib/jf_mediaHandlers";

export async function GET() {
  return handleMediaReset("movie");
}
