"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { PosterOption } from "@/components/libraryitem/PosterOption";

type PosterPickerProps = {
  posters: { file_path: string, previewUrl?: string, source?: string }[];
  ratingKey: string;
  mediaType: "movie" | "show" | "season";
};

export const PosterPicker = ({
  posters,
  ratingKey,
  mediaType,
}: PosterPickerProps) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [busyIndex, setBusyIndex] = useState(-1);


  const updatePoster = async (posterUrl: string, index: number) => {
    setBusyIndex(index);

    await api.plex.poster(ratingKey, posterUrl);
    if(mediaType === "movie") {
      const movie = await api.plex.movieDetail(ratingKey);
      if(movie) {
        await api.data.plex.updatePoster(mediaType, ratingKey, posterUrl || "");
      }
    } else if(mediaType === "show") {
      const show = await api.plex.showDetail(ratingKey);
      if(show) {
        await api.data.plex.updatePoster(mediaType, ratingKey, show.data?.thumbUrl || "");
      }
    } else if(mediaType === "season") {
      const season = await api.plex.seasonDetail(ratingKey);
      if(season) {
        await api.data.plex.updatePoster(mediaType, ratingKey, season.data?.thumbUrl || "");
      }
    }

    setCurrentIndex(index);
    setBusyIndex(-1);
    router.refresh();
  };

  return (
    <ul className="poster-list">
      {posters?.map((poster, index) => (
        <PosterOption
          key={`${poster.file_path}-${index}`}
          posterUrl={poster.file_path}
          previewUrl={poster.previewUrl}
          source={poster.source}
          isCurrent={currentIndex === index}
          isBusy={busyIndex === index}
          onSelect={() => updatePoster(poster.file_path, index)}
        />
      ))}
    </ul>
  );
};

