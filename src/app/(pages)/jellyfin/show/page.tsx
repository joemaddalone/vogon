export const dynamic = "force-dynamic";
import { MediaLibrarySection } from "@/components/library/MediaLibrarySection";
import { api } from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default async function ShowsPage() {
  const libLoader = api.data.jellyfin.shows();

  return (
    <Suspense
    fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner className="size-16 text-gray-500" />
      </div>
    }
  >
    <MediaLibrarySection
      libLoader={libLoader}
      totalLabel="shows"
      type="show"
    />
    </Suspense>
  );
}
