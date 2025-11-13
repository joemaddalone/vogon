"use client";
import { use } from "react";
import { MediaHeader } from "@/components/libraryitem/MediaHeader";
import { PosterPicker } from "@/components/libraryitem/PosterPicker";
import { BackdropPicker } from "@/components/libraryitem/BackdropPicker";
import { TMDBError } from "@/components/libraryitem/TMDBError";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    backdrops: { file_path: string; previewUrl?: string; source?: string }[];
    logos: { file_path: string; source?: string }[];
    mediaType: "movie" | "show";
  }>;
  id: string;
}) => {
  const { media, knownIds, tmdbMedia, posters, backdrops, logos, mediaType } =
    use(posterBuilder);

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
      {/* <hr className="my-4" /> */}
      <Tabs defaultValue="posters">
        <TabsList className="mb-8 inline-flex w-full h-9 justify-start rounded-none p-0 bg-background/60 backdrop-blur-sm border-b shadow-lg">
          <TabsTrigger className="border-r border-2 text-md font-bold max-w-[25%] data-[state=active]:bg-primary! data-[state=active]:text-primary-foreground! rounded-none" value="posters">Posters</TabsTrigger>
          <TabsTrigger className="border-r border-2 text-md font-bold max-w-[25%] data-[state=active]:bg-primary! data-[state=active]:text-primary-foreground! rounded-none" value="backdrops">Backdrops</TabsTrigger>
        </TabsList>
        <TabsContent value="posters">
          <PosterPicker
            posters={posters}
            ratingKey={id}
            mediaType={mediaType}
          />
        </TabsContent>
        <TabsContent value="backdrops">
        <BackdropPicker
            backdrops={backdrops}
            ratingKey={id}
            mediaType={mediaType}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
