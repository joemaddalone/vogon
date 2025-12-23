"use client";
import { NormalizedEpisode } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/api";
import { EpisodeModal } from "./EpisodeModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cardTypes } from "@/lib/cards";
import { CanvasImage } from "./CanvasImage";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export const EpisodesList = ({
  episodes,
}: {
  episodes: NormalizedEpisode[];
}) => {
  const t = useTranslations();
  const router = useRouter();
  const [modalEpisode, setModalEpisode] = useState<NormalizedEpisode | null>(
    null
  );

  const [titleCardTemplate, setTitleCardTemplate] = useState<cardTypes>("current");
  const [busy, setBusy] = useState(false);

  const canvasRefs = useRef<(HTMLDivElement | null)[]>([]);

  const getRef = (index: number) => {
    return (element: HTMLDivElement | null) => {
      canvasRefs.current[index] = element;
    };
  };

  useEffect(() => {
    if (episodes?.length === 0) return;
    const cacheEpisodes = async (episodes: NormalizedEpisode[]) => {
      for (const episode of episodes) {
        if (episode?.ratingKey) {
          try {
            await fetch(
              `/api/data/show/episode/cache?ratingKey=${episode?.ratingKey}`
            );
          } catch (error) {
            console.error(error);
          }
        }
      }
    };
    cacheEpisodes(episodes);
  }, [episodes]);


  const setAllEpisodeTemplate = async () => {
    setBusy(true);
    for (const element of canvasRefs.current) {
      const base64 = element?.querySelector("canvas")?.toDataURL("image/jpeg");
      const ratingKey = element?.dataset.ratingKey;
      if (!base64 || !ratingKey) {
        throw new Error("Failed to get base64 image");
      }
      await api.mediaserver.posterEpisode(ratingKey, base64);
    }
    router.refresh();
    setBusy(false);
  };

  return (
    <div>
      <div className="titlecard-select flex items-center gap-2 mb-4">
        <Select
          name="type"
          defaultValue={titleCardTemplate}
          onValueChange={(value) => setTitleCardTemplate(value as cardTypes)}
        >
          <SelectTrigger className="bg-orange-500 rounded-md">
            <SelectValue
              placeholder="Select a title card"
              className="text-white"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Title Cards</SelectLabel>
              <SelectItem value="current">Current Images</SelectItem>
              <SelectItem value="original">Original Images</SelectItem>
              <SelectItem value="bars">Bars Template</SelectItem>
              <SelectItem value="standard">Standard Template</SelectItem>
              <SelectItem value="minimalDigital">
                Minimal Digital Template
              </SelectItem>
              <SelectItem value="vhs">VHS Template</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {titleCardTemplate !== "current" ? (
          <Button onClick={setAllEpisodeTemplate} variant="default" size="sm">
            {busy ? <Spinner className="size-4" /> : null}
            Apply Template
          </Button>
        ) : null}
      </div>
      <ul className="episode-list">
        <EpisodeModal
          episode={modalEpisode}
          close={() => setModalEpisode(null)}
        />
        {episodes.map((episode, index) => (
          <li key={episode.ratingKey}>
            <figure
              key={episode.ratingKey}
              className="relative"
              onClick={() => setModalEpisode(episode)}
            >
              <div className="">
                <div ref={getRef(index)} data-rating-key={episode.ratingKey}>
                  {titleCardTemplate === "current" ? (
                    <CanvasImage
                      episode={episode}
                      mode={titleCardTemplate}
                      src={episode.thumbUrl || ""}
                    />
                  ) : (
                    <CanvasImage
                      episode={episode}
                      mode={titleCardTemplate}
                    />
                  )}
                </div>
              </div>
              <figcaption className="mt-5 text-center">
                {episode.title}
                <br />
                <span className="capitalize">
                  {t("common.season", { count: 1 })}:{episode.parentIndex}{" "}
                  {t("common.episode", { count: 1 })}:{episode.index}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
};
