"use client";
import { use } from "react";
import { MediaHeader } from "@/components/libraryitem/MediaHeader";
import { PosterPicker } from "@/components/libraryitem/PosterPicker";
import { BackdropPicker } from "@/components/libraryitem/BackdropPicker";
import { TMDBError } from "@/components/libraryitem/TMDBError";
import Image from "next/image";
import ImageLoader from "@/components/ImageLoader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PlexMovieMetadata,
  PlexSeasonMetadata,
  PlexSeasonResponse,
  PlexShowMetadata,
  PlexEpisode,
  TMDBDetail,
} from "@/lib/types";
import Link from "next/link";
import { EpisodesList } from "./EpisodesList";

export const MediaDetail = ({
  posterBuilder,
  id,
}: {
  posterBuilder: Promise<{
    media:
      | (PlexMovieMetadata & { seasons?: PlexSeasonResponse[], episodes?: PlexEpisode[] })
      | (PlexShowMetadata & { seasons?: PlexSeasonResponse[], episodes?: PlexEpisode[] })
      | (PlexSeasonMetadata & { seasons?: PlexSeasonResponse[], episodes?: PlexEpisode[] })
      | null;
    knownIds: Record<string, string | null>;
    tmdbMedia: TMDBDetail | null;
    posters: { file_path: string; previewUrl?: string; source?: string }[];
    backdrops?: { file_path: string; previewUrl?: string; source?: string }[];
    logos: { file_path: string; source?: string }[];
    mediaType?: "movie" | "show" | "season";
  }>;
  id: string;
}) => {
  const { media, knownIds, tmdbMedia, posters, backdrops = [], logos, mediaType } =
    use(posterBuilder);

  if (!tmdbMedia || !media || !mediaType) {
    return <TMDBError knownIds={knownIds} />;
  }

  const hasSeasons =
    mediaType === "show" &&
    media?.seasons?.length !== undefined &&
    media?.seasons?.length > 0;

  const hasEpisodes =
    mediaType === "season" &&
    media?.episodes?.length !== undefined &&
    media?.episodes?.length > 0;

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
      {/** @ts-expect-error - MediaHeader expects a PlexMovieMetadata | PlexShowMetadata | PlexSeasonMetadata **/}
      <MediaHeader media={media} logos={logos} mediaType={mediaType} />
      <Tabs defaultValue="posters">
        <TabsList className="mb-8 inline-flex w-full h-9 justify-start rounded-none p-0 bg-background/60 backdrop-blur-sm border-b shadow-lg">
          <TabsTrigger
            className="border-r border-2 text-md font-bold max-w-[25%] data-[state=active]:bg-primary! data-[state=active]:text-primary-foreground! rounded-none"
            value="posters"
          >
            {mediaType === "season" ? "Seaosn Posters" : "Posters"}
          </TabsTrigger>
          {mediaType !== "season" && (
            <TabsTrigger
              className="border-r border-2 text-md font-bold max-w-[25%] data-[state=active]:bg-primary! data-[state=active]:text-primary-foreground! rounded-none"
              value="backdrops"
            >
              Backdrops
            </TabsTrigger>
          )}
          {hasSeasons && (
            <TabsTrigger
              className="border-r border-2 text-md font-bold max-w-[25%] data-[state=active]:bg-primary! data-[state=active]:text-primary-foreground! rounded-none"
              value="seasons"
            >
              Seasons
            </TabsTrigger>
          )}
          {hasEpisodes && (
            <TabsTrigger
              className="border-r border-2 text-md font-bold max-w-[25%] data-[state=active]:bg-primary! data-[state=active]:text-primary-foreground! rounded-none"
              value="episodes"
            >
              Episodes
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="posters">
          <PosterPicker
            posters={posters}
            ratingKey={id}
            mediaType={mediaType}
          />


        </TabsContent>
        {mediaType !== "season" && (
          <TabsContent value="backdrops">
            <BackdropPicker
              backdrops={backdrops}
              ratingKey={id}
              mediaType={mediaType}
            />
          </TabsContent>
        )}
        {hasEpisodes && (
          <TabsContent value="episodes">
            <EpisodesList episodes={media.episodes || []} />
          </TabsContent>
        )}
        {mediaType === "show" && hasSeasons && (
          <TabsContent value="seasons">
            <ul className="backdrop-list">
              {media.seasons?.map((season) => (
                <Link
                  href={`/show/${id}/${season.ratingKey}`}
                  key={season.ratingKey}
                >
                  <figure key={season.ratingKey} className="relative">
                    <div className="relative overflow-hidden rounded-[12px] transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-foreground/10">
                      <ImageLoader
                        src={season.thumbUrl || ""}
                        alt={season.title || ""}
                        width={500}
                        height={500}
                        unoptimized
                        className="transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <figcaption className="mt-5 text-center">
                      {season.title}
                    </figcaption>
                  </figure>
                </Link>
              ))}
            </ul>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
