"use client";
import { NormalizedEpisode } from "@/lib/types";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import ImageLoader from "../ImageLoader";

const CanvasImage = ({ episode }: { episode: NormalizedEpisode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  console.log(episode);

  useEffect(() => {
    if (canvasRef.current) {
      const img = new Image();
      img.src = episode.thumbUrl || "";
      img.onload = () => {
        if (canvasRef.current) {
          // Calculate scaling factor
          const scale_factor = Math.min(
            canvasRef.current.width / img.width,
            canvasRef.current.height / img.height
          );

          const newWidth = img.width * scale_factor;
          const newHeight = img.height * scale_factor;

          const seasonNumber = episode.parentIndex?.toString().padStart(2, "0") || "";
          const episodeNumber = episode.index?.toString().padStart(2, "0") || "";
          const ctext = seasonNumber + '/' + episodeNumber
          const carr = ctext.split("").join(String.fromCharCode(8202))

          canvasRef.current.style.letterSpacing = "0.025em";
          canvasRef.current.getContext("2d")?.drawImage(img, 0, 0, newWidth, newHeight);
          // draw rectangle around the image
          canvasRef.current.getContext("2d")!.strokeStyle = "white";
          canvasRef.current.getContext("2d")!.strokeRect(10, 10, newWidth - 20, newHeight - 20);
          // draw text in the center of the image
          canvasRef.current.getContext("2d")!.fillStyle = "white";
          canvasRef.current.getContext("2d")!.font = "16px serif";
          canvasRef.current.getContext("2d")!.textAlign = "center";
          canvasRef.current.getContext("2d")!.textBaseline = "middle";
          canvasRef.current.getContext("2d")!.font = "25px sans-serif";
          canvasRef.current?.getContext("2d")!.fillText(carr, 50, newHeight - 50, 100);
        }
      };
    }
  }, [episode]);

  return <canvas ref={canvasRef} width={300} height={150} />;
};

export const EpisodesList = ({ episodes }: { episodes: NormalizedEpisode[] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const t = useTranslations();
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
                <span className="capitalize">
								{t("common.season", {count: 1})}:{episode.parentIndex} {t("common.episode", {count: 1})}:{episode.index}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
};