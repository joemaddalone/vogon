export const dynamic = "force-dynamic";
import { MediaLibrarySection } from "@/components/library/MediaLibrarySection";
import { api } from "@/lib/api";
import { CommonSuspense } from "@/components/CommonSuspense";

export default async function MoviesPage() {
  const libLoader = api.data.plex.movies();

  return (
    <CommonSuspense>
      <MediaLibrarySection
        libLoader={libLoader}
        type="movie"
      />
    </CommonSuspense>
  );
}
