"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";
import { BackdropOption } from "@/components/libraryitem/BackdropOption";

type BackdropPickerProps = {
  backdrops: { file_path: string, previewUrl?: string, source?: string }[];
  ratingKey: string;
  mediaType: "movie" | "show";
};

export const BackdropPicker = ({
  backdrops,
  ratingKey,
  mediaType,
}: BackdropPickerProps) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [busyIndex, setBusyIndex] = useState(-1);

  const updateBackdrop = async (backdropUrl: string, index: number) => {
    setBusyIndex(index);

    await api.mediaserver.backdrop(ratingKey, backdropUrl);
    if(mediaType === "movie") {
      const movie = await api.mediaserver.movieDetail(ratingKey);
      if(movie) {
        await api.data.plex.updateBackdrop(mediaType, ratingKey, movie.data?.artUrl || "");
      }
    } else {
      const show = await api.mediaserver.showDetail(ratingKey);
      if(show) {
        await api.data.plex.updateBackdrop(mediaType, ratingKey, show.data?.artUrl || "");
      }
    }

    setCurrentIndex(index);
    setBusyIndex(-1);
    router.refresh();
  };

  return (
    <ul className="backdrop-list">
      {backdrops?.map((backdrop, index) => (
        <BackdropOption
          key={`${backdrop.file_path}-${index}`}
          posterUrl={backdrop.file_path}
          previewUrl={backdrop.previewUrl}
          source={backdrop.source}
          isCurrent={currentIndex === index}
          isBusy={busyIndex === index}
          onSelect={() => updateBackdrop(backdrop.file_path, index)}
        />
      ))}
    </ul>
  );
};

