export const dynamic = "force-dynamic";
import { Media } from "@/lib/types";
import { buildPosters } from "@/lib/buildPosterList";
import { MediaDetail } from "@/components/libraryitem/MediaDetail";
import { MediaHeader } from "@/components/libraryitem/MediaHeader";
import { MediaBackdrop } from "@/components/libraryitem/MediaBackdrop";
import { dataManager as DM } from "@/lib/client/database";
import { ItemNotFound } from "@/components/libraryitem/ItemNotFound";
import { CommonSuspense } from "@/components/CommonSuspense";
export default async function SeasonPage(
  props: PageProps<"/show/[id]/[season]">
) {
  const { id, season } = await props.params;

  try {
    const media = await DM.plex.season.get(season);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: seasonId, ...rest } = await DM.plex.season.get(season);
    const seasonData = { ...rest } as unknown as Media;
    const posterBuilder = buildPosters(
      id,
      "season",
      seasonData?.index || 0,
      season
    );

    return (
      <CommonSuspense
        key="media-header"
        spinnerContainerHeight={30}
      >
        {/* @ts-expect-error - MediaBackdrop expects a Media */}
        <MediaBackdrop media={media} />
        <MediaHeader
          media={media as unknown as Media}
          logos={[]}
          mediaType="season"
        />
        <CommonSuspense
          key="media-detail"
          spinnerContainerHeight={25}
        >
          {/** @ts-expect-error - MediaDetail expects a Promise<{ media: PlexMovieMetadata | PlexShowMetadata | PlexSeasonMetadata | null; knownIds: Record<string, string | null>; tmdbMedia: TMDBDetail | null; posters: { file_path: string; previewUrl?: string; source?: string }[]; backdrops?: { file_path: string; previewUrl?: string; source?: string }[]; logos: { file_path: string; source?: string }[]; mediaType?: "movie" | "show" | "season"; }> */}
          <MediaDetail posterBuilder={posterBuilder} id={season} />
        </CommonSuspense>
      </CommonSuspense>
    );
  } catch (_) {
    return (
      <ItemNotFound />
    );
  }
}
