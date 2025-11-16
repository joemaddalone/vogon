export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { buildPosters } from "@/lib/buildPosterList";
import { getPlexSeason } from "@/lib/client/database";
import { Spinner } from "@/components/ui/spinner";
import { PlexSeason } from "@/lib/types";
import { PlexMediaDetail } from "@/components/libraryitem/PlexMediaDetail";

export default async function PlexSeasonPage({
  params,
}: {
  params: Promise<{ id: string; season: string }>;
}) {
  const { id, season } = await params;

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
        <PlexMediaDetail posterBuilder={posterBuilder} id={season} mediaType="season" />
      </div>
    </Suspense>
  );
}