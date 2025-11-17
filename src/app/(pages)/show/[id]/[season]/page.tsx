export const dynamic = "force-dynamic";
import { PlexSeason } from "@/lib/types";
import { Suspense } from "react";
import { buildPosters } from "@/lib/buildPosterList";
import { getPlexSeason } from "@/lib/client/database";
import { Spinner } from "@/components/ui/spinner";
import { MediaDetail } from "@/components/libraryitem/MediaDetail";

export default async function SeasonPage(props: PageProps<"/show/[id]/[season]">) {
  const { id, season } = await props.params;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: seasonId, ...rest } = await getPlexSeason(season);
  const seasonData = { ...rest } as PlexSeason;
  const posterBuilder = buildPosters(id, "season", seasonData?.index || 0, season);

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner className="size-16 text-gray-500" />
        </div>
      }
    >
      <div>
        {/** @ts-expect-error - MediaDetail expects a Promise<{ media: PlexMovieMetadata | PlexShowMetadata | PlexSeasonMetadata | null; knownIds: Record<string, string | null>; tmdbMedia: TMDBDetail | null; posters: { file_path: string; previewUrl?: string; source?: string }[]; backdrops?: { file_path: string; previewUrl?: string; source?: string }[]; logos: { file_path: string; source?: string }[]; mediaType?: "movie" | "show" | "season"; }> */}
        <MediaDetail posterBuilder={posterBuilder} id={season} />
      </div>
    </Suspense>
  );
}