export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { buildPosters } from "@/lib/buildPosterList";
import { MediaDetail } from "@/components/libraryitem/MediaDetail";
import { Spinner } from "@/components/ui/spinner";
import { MediaHeader } from "@/components/libraryitem/MediaHeader";
import { MediaBackdrop } from "@/components/libraryitem/MediaBackdrop";
import { NormalizedMovieDetails } from "@/lib/types";
import { MediaServerClient } from "@/lib/client/mediaserver";
import { getClients } from "@/lib/client/getClients";
export default async function MoviePage(props: PageProps<"/movie/[id]">) {
  const { id } = await props.params;
  const config = await getClients();
  if(!config) {
    return <div className="flex items-center justify-center min-h-[30vh]">No config found</div>
  }
  const mediaServer = new MediaServerClient(config.type!);
  const media = (await mediaServer.getLibraryItemDetails(id)) as NormalizedMovieDetails;
  if(!media) {
    return <div className="flex items-center justify-center min-h-[30vh]">
      Dang we could not find that one, perhaps it&apos;s in another server?
    </div>
  }
  const posterBuilder = buildPosters(id, "movie");

  return (
    <Suspense
      key="media-header"
      fallback={
        <div className="flex items-center justify-center min-h-[30vh]">
          <Spinner className="size-16 text-gray-500" />
        </div>
      }
    >
      <MediaBackdrop media={media} />
      <MediaHeader media={media} logos={[]} mediaType="movie" />
      <Suspense
        key="media-detail"
        fallback={
          <div className="flex items-center justify-center min-h-[25vh]">
            <Spinner className="size-16 text-gray-500 shadow-lg" />
          </div>
        }
      >
        {/** @ts-expect-error - MediaDetail expects a Promise<{ media: PlexMovieMetadata | PlexShowMetadata | PlexSeasonMetadata | null; knownIds: Record<string, string | null>; tmdbMedia: TMDBDetail | null; posters: { file_path: string; previewUrl?: string; source?: string }[]; backdrops?: { file_path: string; previewUrl?: string; source?: string }[]; logos: { file_path: string; source?: string }[]; mediaType?: "movie" | "show" | "season"; }> */}
        <MediaDetail posterBuilder={posterBuilder} id={id} />
      </Suspense>
    </Suspense>
  );
}
