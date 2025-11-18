export const dynamic = "force-dynamic";
import { PlexSeason } from "@/lib/types";
import { Suspense } from "react";
import { buildPosters } from "@/lib/buildPosterList";
import { Spinner } from "@/components/ui/spinner";
import { MediaDetail } from "@/components/libraryitem/MediaDetail";
import { MediaHeader } from "@/components/libraryitem/MediaHeader";
import { MediaBackdrop } from "@/components/libraryitem/MediaBackdrop";
import { getPlexSeason } from "@/lib/client/database";

export default async function SeasonPage(props: PageProps<"/show/[id]/[season]">) {
  const { id, season } = await props.params;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: seasonId, ...rest } = await getPlexSeason(season);
  const seasonData = { ...rest } as PlexSeason;
  const media = (await getPlexSeason(season));
  const posterBuilder = buildPosters(id, "season", seasonData?.index || 0, season);

  return (
    <Suspense
    key="media-header"
    fallback={
      <div className="flex items-center justify-center min-h-[30vh]">
        <Spinner className="size-16 text-gray-500" />
      </div>
    }
  >
    {/* @ts-expect-error - MediaBackdrop expects a PlexSeasonMetadata */}
    <MediaBackdrop media={media} />
    <MediaHeader media={media as unknown as PlexSeason} logos={[]} mediaType="season" />
    <Suspense
      key="media-detail"
      fallback={
        <div className="flex items-center justify-center min-h-[25vh]">
          <Spinner className="size-16 text-gray-500" />
        </div>
      }
    >
      {/** @ts-expect-error - MediaDetail expects a Promise<{ media: PlexMovieMetadata | PlexShowMetadata | PlexSeasonMetadata | null; knownIds: Record<string, string | null>; tmdbMedia: TMDBDetail | null; posters: { file_path: string; previewUrl?: string; source?: string }[]; backdrops?: { file_path: string; previewUrl?: string; source?: string }[]; logos: { file_path: string; source?: string }[]; mediaType?: "movie" | "show" | "season"; }> */}
      <MediaDetail posterBuilder={posterBuilder} id={season} />
    </Suspense>
  </Suspense>
  );
}