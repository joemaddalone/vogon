export const dynamic = "force-dynamic";
import { MediaLibrarySection } from "@/components/library/MediaLibrarySection";
import { api } from "@/lib/api";
import { CommonSuspense } from "@/components/CommonSuspense";

export default async function ShowsPage() {
  const libLoader = api.data.plex.shows();

  return (
    <CommonSuspense>
    <MediaLibrarySection
      libLoader={libLoader}
      type="show"
    />
    </CommonSuspense>
  );
}
