import { NormalizedEpisode } from "@/lib/types";
import { useEffect, useRef } from "react";
import { createCard } from "@/lib/cards";

type cardTypes = "original" | "frame" | "standard" | "minimalDigital" | "vhs";

export const CanvasImage = ({
  episode,
  mode = "original",
  src
}: {
  episode: NormalizedEpisode;
  mode?: cardTypes;
  src?: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef?.current) {
      window.devicePixelRatio = 2;
      const maxWidth = 500;
      const maxHeight = 200;
      const img = new Image();
      img.src = src || `/cache/episodes/${episode.ratingKey}.jpg`;
      img.onload = () => {
        if (canvasRef.current) {
          // Calculate scaling factor
          const scale_factor = Math.min(
            maxWidth / img.width,
            maxHeight / img.height
          );
          const newWidth = img.width * scale_factor;
          const newHeight = img.height * scale_factor;
          const offScreenCanvas = document.createElement("canvas");
          offScreenCanvas.width = newWidth;
          offScreenCanvas.height = newHeight;
          offScreenCanvas.getContext("2d")?.drawImage(img, 0, 0, newWidth, newHeight);

          createCard(
            {
              episodeTitle: episode.title,
              seasonNumber: episode.parentIndex || 0,
              episodeNumber: episode.index || 0,
            },
            mode as cardTypes,
            offScreenCanvas
          );



          canvasRef.current.width = newWidth;
          canvasRef.current.height = newHeight;
          canvasRef.current
            .getContext("2d")
            ?.drawImage(offScreenCanvas, 0, 0, newWidth, newHeight);
        }
      };
    }
  }, [episode, mode, canvasRef, src]);

  return canvasRef ? (
    <canvas ref={canvasRef} />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/cache/episodes/${episode.ratingKey}.jpg`} alt={episode.title} />
  );
};
