export const dynamic = "force-dynamic";
import { MediaLibrarySection } from "@/components/library/MediaLibrarySection";
import { api } from "@/lib/api";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { getServerId } from "@/lib/server/getServerId";

export default async function MoviesPage() {
  const serverId = await getServerId();

  if (!serverId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p>No server configured. Please add a server in the Config page.</p>
      </div>
    );
  }

  const libLoader = api.data.plex.movies(serverId);

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
