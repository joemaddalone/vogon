export const dynamic = "force-dynamic";
import { buildPosters } from "@/lib/buildPosterList";
import { MediaHeader } from "@/components/library/MediaHeader";
import { PosterPicker } from "@/components/library/PosterPicker";
import Image from "next/image";

export default async function PlexMoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { media, knownIds, tmdbMedia, posters, logos } = await buildPosters(
    id,
    "movie"
  );

  if (!tmdbMedia) {
    return (
      <div className="flex flex-col items-center justify-cente mw-[600px] mx-auto">
        <div className="text-2xl font-bold">
          Damn, we could not find this one..
        </div>
        <div className="mt-4 text-sm">
          <p>TMDB ID: {knownIds?.tmdbId || "N/A"}</p>
          <p>IMDB ID: {knownIds?.imdbId || "N/A"}</p>
          <p>TVDB ID: {knownIds?.tvdbId || "N/A"}</p>
          <p className="mt-4 border-t border-gray-200 pt-4 text-sm font-bold">
            This just means we can&apos;t connect the data listed above to TMDB.
            <br />
            You should probably have Plex &quot;Match&quot; this movie again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {media.artUrl && (
        <div className="fixed inset-0 pointer-events-none top-0 left-0 w-full h-full object-cover ">
          <div className="absolute top-0 left-0 w-full h-full z-[-1] object-cover">
            <Image
              src={media.artUrl}
              alt={media.title}
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-full object-cover dark:opacity-40 opacity-30"
              unoptimized
            />
          </div>
        </div>
      )}
      <MediaHeader media={media} logos={logos} mediaType="movie" />
      <hr className="my-4" />
      <h2 className="my-4 text-2xl font-bold">Posters</h2>
      <PosterPicker posters={posters} ratingKey={id} mediaType="movie" />
    </div>
  );
}
