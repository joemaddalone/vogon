"use client";
import { use } from "react";
import { PosterPicker } from "@/components/libraryitem/PosterPicker";
import { BackdropPicker } from "@/components/libraryitem/BackdropPicker";
import { TMDBError } from "@/components/libraryitem/TMDBError";
import ImageLoader from "@/components/ImageLoader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TMDBDetail,
  NormalizedMovieDetails,
  NormalizedSeason,
  NormalizedEpisode,
} from "@/lib/types";
import Link from "next/link";
import { EpisodesList } from "./episode/EpisodesList";
import { useTranslations } from "next-intl";
import type { Configuration } from "@/lib/types";
export const MediaDetail = ({
  posterBuilder,
  id,
  config
}: {
  posterBuilder: Promise<{
    media: (NormalizedMovieDetails & { seasons?: NormalizedSeason[], episodes?: NormalizedEpisode[]; });
    knownIds: Record<string, string | null>;
    tmdbMedia: TMDBDetail | null;
    posters: { file_path: string; previewUrl?: string; source?: string; }[];
    backdrops?: { file_path: string; previewUrl?: string; source?: string; }[];
    logos: { file_path: string; source?: string; }[];
    mediaType?: "movie" | "show" | "season";
  }>;
  id: string;
  config: Configuration;
}) => {
  const { media, knownIds, tmdbMedia, posters, backdrops = [], mediaType } = use(posterBuilder);
  const t = useTranslations();
  if (!tmdbMedia || !media || !mediaType) {
    return <TMDBError knownIds={knownIds} />;
  }

  const hasSeasons =
    mediaType === "show" &&
    media?.seasons?.length !== undefined &&
    media?.seasons?.length > 0;

  const hasEpisodes =
    mediaType === "season" &&
    config?.enableEpisodes &&
    media?.episodes?.length !== undefined &&
    media?.episodes?.length > 0;

  return (
    <div>
      <Tabs defaultValue="posters">
        <TabsList className="mb-8 inline-flex w-full h-9 justify-start rounded-none p-0 bg-background/60 backdrop-blur-sm border-b shadow-lg">
          <TabsTrigger
            className="capitalize border-r border-2 text-md font-bold max-w-[25%] data-[state=active]:bg-primary! data-[state=active]:text-primary-foreground! rounded-none"
            value="posters"
          >
            {t("common.poster", { count: 0 })}
          </TabsTrigger>
          {mediaType !== "season" && (
            <TabsTrigger
              className="capitalize border-r border-2 text-md font-bold max-w-[25%] data-[state=active]:bg-primary! data-[state=active]:text-primary-foreground! rounded-none"
              value="backdrops"
            >
              {t("common.backdrop", { count: 0 })}
            </TabsTrigger>
          )}
          {hasSeasons && (
            <TabsTrigger
              className="capitalize border-r border-2 text-md font-bold max-w-[25%] data-[state=active]:bg-primary! data-[state=active]:text-primary-foreground! rounded-none"
              value="seasons"
            >
              {t("common.season", { count: 0 })}
            </TabsTrigger>
          )}
          {hasEpisodes && (
            <TabsTrigger
              className="capitalize border-r border-2 text-md font-bold max-w-[25%] data-[state=active]:bg-primary! data-[state=active]:text-primary-foreground! rounded-none"
              value="episodes"
            >
              {t("common.episode", { count: 0 })}
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
