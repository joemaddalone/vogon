import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { CanvasImage } from "./CanvasImage";
import { Button } from "@/components/ui/button";
import { NormalizedEpisode } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { fontManager } from "@/lib/cards/helpers/fontManager";

export const EpisodeModal = ({
  episode,
  close,
}: {
  episode?: NormalizedEpisode | null;
  close: () => void;
}) => {
  const t = useTranslations();
  const [caching, setCaching] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [busyIndex, setBusyIndex] = useState(-1);
  const router = useRouter();

  const cardList = [
    {
      label: "Original",
      value: "original",
    },
    {
      label: "Frame",
      value: "frame",
    },
    {
      label: "Standard",
      value: "standard",
    },
    {
      label: "Minimal Digital",
      value: "minimalDigital",
    },
    {
      label: "VHS",
      value: "vhs",
    },
  ];

  fontManager.loadFont('cormorantGaramond');
  fontManager.loadFont('bebasNeue');
  fontManager.loadFont('orbitron');
  fontManager.loadFont('teko');

  const onClose = () => {
    setCurrentIndex(-1);
    setBusyIndex(-1);
    close();
    router.refresh();
  };

  const canvasRefs = useRef<(HTMLDivElement | null)[]>([]);

  const getRef = (index: number) => {
    return (element: HTMLDivElement | null) => {
      canvasRefs.current[index] = element;
    };
  };
  useEffect(() => {
    if (episode?.ratingKey) {
      const cacheImage = async () => {
        setCaching(true);
        fetch(`/api/data/show/episode/cache?ratingKey=${episode?.ratingKey}`)
          .then((response) => response.json())
          .then(() => {
            setCaching(false);
          })
          .catch(() => {
            setCaching(false);
          });
      };
      cacheImage();
    }
  }, [episode?.ratingKey]);

  const updateCard = async (index: number) => {
    setBusyIndex(index);
    const element = canvasRefs.current[index];

    const base64 = element?.querySelector("canvas")?.toDataURL("image/jpeg");
    if (!base64) {
      throw new Error("Failed to get base64 image");
    }
    await api.mediaserver.posterEpisode(episode?.ratingKey || "", base64);

    // @ts-expect-error - ratingKey is a string
    await api.config.revalidate(`/cache/episodes/${episode.ratingKey}.jpg`);
    setCurrentIndex(index);
    setBusyIndex(-1);
    router.refresh();
  };

  if (!episode) {
    return null;
  }

  return (
    <Dialog key={episode.ratingKey} open={episode.ratingKey !== null} onOpenChange={onClose}>
      <DialogContent
        style={{
          height: "60vh",
          width: "1280px",
          overflow: "auto",
          paddingTop: 20,
        }}
        aria-describedby="episode-dialog-description"
        id="episode-dialog-description"
      >
        <DialogTitle className="mb-0!">
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold">{episode.title}</p>
          </div>
        </DialogTitle>

        {caching ? (
          <div className="flex justify-center items-center h-full w-full">
            <Spinner className="size-16 text-gray-500" />
          </div>
        ) : (
          cardList.map((card, index) => (
            <div className="flex flex-col gap-2 justify-center items-center border border-black-100 rounded-sm p-4" key={card.value}>
              <div>{card.label}</div>
              <figure>
                <div ref={getRef(index)}>
                  <CanvasImage episode={episode} mode={card.value as "original" | "frame"} />
                </div>
                <figcaption className="mt-5 text-center">
                  {currentIndex === index ? (
                    <span className="inline-flex items-center  bg-yellow-400/10 px-4 py-2.5 text-sm font-semibold dark:text-yellow-500 shadow-lg border border-yellow-400/30 backdrop-blur-md">
                      {t("common.current")}
                    </span>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => updateCard(index)}
                      disabled={busyIndex === index}
                      className="relative rounded-xl font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {busyIndex === index ? (
                        <>
                          <Spinner className="size-4" />
                          updating
                        </>
                      ) : (
                        <>Use this card</>
                      )}
                    </Button>
                  )}
                </figcaption>
              </figure>
            </div>
          ))
        )}
      </DialogContent>
    </Dialog>
  );
};
