import { handleMediaReset } from "@/app/api/data/_lib/mediaHandlers";

export async function GET() {
  return handleMediaReset("show");
}
