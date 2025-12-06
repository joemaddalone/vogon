export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Libraries } from "./_components/Libraries";
import { api } from "@/lib/api";

export default async function ImportLibraryPage() {
  const libs = api.mediaserver.libraries();

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner className="size-16 text-gray-500" />
        </div>
      }
    >
      {/* @ts-expect-error - libs is a promise of ApiResponse<NormalizedLibrary[]> */}
       <Libraries libs={libs}  />
    </Suspense>
  );
}
