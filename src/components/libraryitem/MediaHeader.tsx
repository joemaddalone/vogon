"use client";
import { Media, PlexMovieMetadata, PlexShowMetadata } from "@/lib/types";
import { Clock, Calendar, ArrowLeft } from "lucide-react";
import { useHistory } from "@/app/hooks/useHistory";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Route } from "next";

export const MediaHeader = ({
  media,
  logos,
  mediaType,
}: {
  media:
    | PlexMovieMetadata
    | PlexShowMetadata
    | Media;
  logos: { file_path: string }[];
  mediaType: "movie" | "show" | "season";
}) => {
  const router = useRouter();
  const { history, back } = useHistory();
  // get next to last item in history
  const nextToLast = history[history.length - 2];
  const backToLibrary =
    nextToLast === `/${mediaType}` && mediaType !== "season";
  const backToParent =
    mediaType === "season"
      ? `/show/${(media as unknown as Media)?.parentRatingKey}`
      : "";
  // Format duration from milliseconds to hours and minutes
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${minutes}m`;
  };

  return (
    <div className="relative">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent -z-10 rounded-3xl blur-3xl" />

      <div className="py-8 lg:py-10">
        {/* Main layout with poster and info */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Poster */}
          <div className="shrink-0">
            <div className="relative group">
              {/* Glow effect behind poster */}
              <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative w-full lg:w-[380px] aspect-2/3 rounded-3xl overflow-hidden shadow-2xl bg-muted group-hover:shadow-3xl">
                {media?.thumbUrl && (
                  <Image
                    src={media.thumbUrl}
                    alt={media?.title || "poster"}
                    fill
                    className="object-cover"
                    unoptimized
                    priority
                  />
                )}
              </div>
            </div>
          </div>

          {/* Movie Info */}
          <div className="flex-1 lg:mt-0">
            {/* Title Section */}
            <div className="space-y-4">
              {logos.length > 0 ? (
                <Image
                  src={logos[0].file_path}
                  alt={media?.title || "logo"}
                  width={0}
                  height={0}
                  sizes="25vw"
                  className="w-[600px] h-auto object-contain"
                  priority
                />
              ) : (
                <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight bg-linear-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent leading-tight">
                  {mediaType === "season"
                    ? `${(media as Media)?.parentTitle} - ${media?.title}`
                    : media?.title}
                </h1>
              )}

              {/* Metadata badges */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Year */}
                {media?.year && (
                <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-xl">
                  <Calendar className="w-4 h-4" />
                  <span className="font-semibold text-sm">{media?.year}</span>
                </div>
                )}

                {/* Content Rating */}
                {media?.contentRating && (
                  <div className="px-3 py-2 bg-muted/50 rounded-xl backdrop-blur-sm font-semibold text-sm">
                    {media.contentRating}
                  </div>
                )}

                {/* Duration */}
                {mediaType === "movie" && media?.duration && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-xl">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium text-sm">
                      {formatDuration(media.duration)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Summary Section */}
            {media?.summary && (
              <div className="max-w-3xl my-4">
                <p className="text-base md:text-lg lg:text-xl leading-relaxed">
                  {media.summary}
                </p>
              </div>
            )}

            {mediaType === "season" && (
              <Button
                onClick={() => router.push(backToParent as Route)}
                variant="secondary"
                className="mt-4 px-6 py-3 rounded-xl text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" /> Back to{" "}
                {(media as Media)?.parentTitle}
              </Button>
            )}

            {backToLibrary ? (
              <Button
                onClick={back}
                variant="secondary"
                className="mt-4 px-6 py-3 rounded-xl text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" /> Back to{" "}
                {mediaType === "movie" ? "Movies" : "Shows"}
              </Button>
            ) : mediaType !== "season" && (
              <Button
                onClick={() => router.push(`/${mediaType}`)}
                variant="secondary"
                className="mt-4 px-6 py-3 rounded-xl text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" /> Back to{" "}
                {mediaType === "movie" ? "Movies" : "Shows"}
              </Button>

            )}
          </div>
        </div>
      </div>
    </div>
  );
};
