export const dynamic = "force-dynamic";
import { buildPosters } from "@/lib/buildPosterList";
import { MediaDetail } from "@/components/libraryitem/MediaDetail";
import { MediaHeader } from "@/components/libraryitem/MediaHeader";
import { MediaBackdrop } from "@/components/libraryitem/MediaBackdrop";
import { NormalizedMovieDetails } from "@/lib/types";
import { MediaServerClient } from "@/lib/client/mediaserver";
import { getClients } from "@/lib/client/getClients";
import { ItemNotFound } from "@/components/libraryitem/ItemNotFound";
import { CommonSuspense } from "@/components/CommonSuspense";
export default async function MoviePage(props: PageProps<"/movie/[id]">) {
  const { id } = await props.params;
  const config = await getClients();
  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-[30vh]">
        No config found
      </div>
    );
  }
  const mediaServer = new MediaServerClient(config.type!);
  const media = (await mediaServer.getLibraryItemDetails(
    id
  )) as NormalizedMovieDetails;
  if (!media) {
    return <ItemNotFound />;
  }
  const posterBuilder = buildPosters(id, "movie");

  return (
    <CommonSuspense key="media-header" spinnerContainerHeight={30}>
      <MediaBackdrop media={media} />
      <MediaHeader media={media} logos={[]} mediaType="movie" />
      <CommonSuspense key="media-detail" spinnerContainerHeight={25}>
        {/** @ts-expect-error - MediaDetail expects a Promise<{ media: PlexMovieMetadata | PlexShowMetadata | PlexSeasonMetadata | null; knownIds: Record<string, string | null>; tmdbMedia: TMDBDetail | null; posters: { file_path: string; previewUrl?: string; source?: string }[]; backdrops?: { file_path: string; previewUrl?: string; source?: string }[]; logos: { file_path: string; source?: string }[]; mediaType?: "movie" | "show" | "season"; }> */}
        <MediaDetail posterBuilder={posterBuilder} id={id} />
      </CommonSuspense>
    </CommonSuspense>
  );
}
