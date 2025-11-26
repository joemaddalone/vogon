"use client";
import { NormalizedEpisode } from "@/lib/types";
import ImageLoader from "../ImageLoader";

export const EpisodesList = ({ episodes }: { episodes: NormalizedEpisode[] }) => {
  return (
    <div>
      <ul className="backdrop-list">
        {episodes.map((episode) => (
          <li key={episode.ratingKey}>
            <figure key={episode.ratingKey} className="relative">
              <div className="relative overflow-hidden rounded-[12px] transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-foreground/10">
                <ImageLoader
                  src={episode.thumbUrl || ""}
                  alt={episode.title || ""}
                  width={500}
                  height={500}
                  unoptimized
                  className="transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <figcaption className="mt-5 text-center">
                {episode.title}<br />
								Season:{episode.parentIndex} Episode:{episode.index}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
};
