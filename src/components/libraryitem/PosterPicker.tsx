"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { PosterOption } from "@/components/libraryitem/PosterOption";
import { useServer } from "@/components/context/ServerContext";

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
  const { selectedServerId } = useServer();

  const updatePoster = async (posterUrl: string, index: number) => {
    if (!selectedServerId) {
      console.error("No server selected");
      return;
    }

    setBusyIndex(index);

    await api.plex.poster(ratingKey, posterUrl, selectedServerId);
    if(mediaType === "movie") {
      const movie = await api.plex.movieDetail(ratingKey, selectedServerId);
      if(movie) {
        await api.data.plex.updatePoster(mediaType, ratingKey, movie.data?.thumbUrl || "", selectedServerId);
      }
    } else if(mediaType === "show") {
      const show = await api.plex.showDetail(ratingKey, selectedServerId);
      if(show) {
        await api.data.plex.updatePoster(mediaType, ratingKey, show.data?.thumbUrl || "", selectedServerId);
      }
    } else if(mediaType === "season") {
      const season = await api.plex.seasonDetail(ratingKey, selectedServerId);
      if(season) {
        await api.data.plex.updatePoster(mediaType, ratingKey, season.data?.thumbUrl || "", selectedServerId);
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

