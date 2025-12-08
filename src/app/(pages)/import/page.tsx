export const dynamic = "force-dynamic";
import { Libraries } from "./_components/Libraries";
import { CommonSuspense } from "@/components/CommonSuspense";
import { api } from "@/lib/api";

export default async function ImportLibraryPage() {
  const libs = api.mediaserver.libraries();

  return (
    <CommonSuspense>
      {/* @ts-expect-error - libs is a promise of ApiResponse<NormalizedLibrary[]> */}
       <Libraries libs={libs}  />
    </CommonSuspense>
  );
}
