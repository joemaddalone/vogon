export const dynamic = "force-dynamic";
import { MediaLibrarySection } from "@/components/library/MediaLibrarySection";
import { api } from "@/lib/api";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

export default async function MoviesPage() {
  const libLoader = api.data.plex.movies();

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
        totalLabel="movies"
        type="movie"
      />
    </Suspense>
  );
}
