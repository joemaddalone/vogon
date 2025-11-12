"use client";
import { use } from "react";
import { MediaHeader } from "@/components/libraryitem/MediaHeader";
import { PosterPicker } from "@/components/libraryitem/PosterPicker";
import { TMDBError } from "@/components/libraryitem/TMDBError";
import Image from "next/image";
import { PlexMovieMetadata, PlexShowMetadata, TMDBDetail } from "@/lib/types";

export const PlexMediaDetail = ({
  posterBuilder,
  id,
}: {
  posterBuilder: Promise<{
    media: PlexMovieMetadata | PlexShowMetadata;
    knownIds: Record<string, string>;
    tmdbMedia: TMDBDetail;
    posters: { file_path: string; previewUrl?: string; source?: string }[];
    logos: { file_path: string; source?: string }[];
    mediaType: "movie" | "show";
  }>;
  id: string;
}) => {
  const { media, knownIds, tmdbMedia, posters, logos, mediaType } = use(posterBuilder);

  if (!tmdbMedia) {
    return <TMDBError knownIds={knownIds} />;
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
              priority={true}
            />
          </div>
        </div>
      )}
      <MediaHeader media={media} logos={logos} mediaType={mediaType} />
      <hr className="my-4" />
      <h2 className="my-4 text-2xl font-bold">Posters</h2>
      <PosterPicker posters={posters} ratingKey={id} mediaType={mediaType} />
    </div>
  );
};
