"use client";
import { Selectable, Media } from "@/lib/types";
import ImageLoader from "@/components/ImageLoader";
import { motion } from "motion/react";
import Link from "next/link";

export const MediaWidget = ({
  movieData,
  className = "",
  mode = "grid",
  itemType,
}: {
  movieData: Selectable<Media>;
  className?: string;
  mode?: "grid" | "rows";
  itemType: "movie" | "show";
}) => {
  // Full mode render
  return (
    <Link
      href={`/${itemType === "movie" ? "movie" : "show"}/${
        movieData.ratingKey
      }`}
      scroll={true}
      className={`bg-white dark:bg-black/50 rounded-lg shadow-md overflow-hidden ${className} w-full widget-block`}
    >
      {/* Poster Section */}

      <motion.div
        className="relative group cursor-pointer overflow-hidden place-content-center"
        layout
        transition={{
          layout: { duration: 0.4, ease: "easeInOut" },
        }}
      >
        {movieData.thumbUrl ? (
          <ImageLoader
            src={movieData.thumbUrl || ""}
            alt={`${movieData.title} poster`}
            width={500}
            height={500}
            className="widget-image"
            unoptimized
          />
        ) : (
          <div className="widget-image">
            <p className="flex items-center justify-center text-center text-3xl font-bold text-gray-700 dark:text-gray-300">
              No poster available
            </p>
          </div>
        )}
        {/* Overview Hover Overlay */}
        {movieData.summary && mode === "grid" && (
          <div className="widget-overview absolute inset-0 bg-black/75 bg-opacity-80  p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <p className="text-sm leading-relaxed text-center text-shadow-lg/30 text-white!">
              {movieData.summary.length > 250
                ? movieData.summary.slice(0, 250) + "..."
                : movieData.summary}
            </p>
          </div>
        )}
      </motion.div>
      {/* Film Information Section */}
      <div className="p-4 min-h-[165px]">
        {/* Title */}
        <h4 className="text-balance break-before-all hyphens-manual w-[240px]">
          {movieData.title}
        </h4>

        {/* Release Date */}
        {movieData.year && (
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            🗓️ {movieData.year.toString()}
          </p>
        )}

        {movieData.summary && mode === "rows" && (
          <motion.span
            className="text-md text-gray-700 dark:text-gray-300 mb-3"
            animate={{
              opacity: 1,
            }}
            initial={{
              opacity: 0,
            }}
            transition={{
              default: {
                type: "tween",
                delay: 0.4,
                duration: 0.4,
                ease: "linear",
              },
            }}
          >
            {movieData.summary}
          </motion.span>
        )}
      </div>
    </Link>
  );
};
