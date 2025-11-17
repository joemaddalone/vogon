export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { buildPosters } from "@/lib/buildPosterList";
import { MediaDetail } from "@/components/libraryitem/MediaDetail";
import { Spinner } from "@/components/ui/spinner";

export default async function ShowPage(props: PageProps<"/show/[id]">) {
  const { id } = await props.params;
  const posterBuilder = buildPosters(id, "show");

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner className="size-16 text-gray-500" />
        </div>
      }
    >
      {/** @ts-expect-error - MediaDetail expects a Promise<{ media: PlexMovieMetadata | PlexShowMetadata | PlexSeasonMetadata | null; knownIds: Record<string, string | null>; tmdbMedia: TMDBDetail | null; posters: { file_path: string; previewUrl?: string; source?: string }[]; backdrops?: { file_path: string; previewUrl?: string; source?: string }[]; logos: { file_path: string; source?: string }[]; mediaType?: "movie" | "show" | "season"; }> */}
      <MediaDetail posterBuilder={posterBuilder} id={id} />
    </Suspense>
  );
}
