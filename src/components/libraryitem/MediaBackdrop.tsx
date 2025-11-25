import {
  NormalizedMovieDetails,
  NormalizedMediaItem,
} from "@/lib/types";
import Image from "next/image";

export const MediaBackdrop = ({
  media,
}: {
  media: NormalizedMovieDetails | NormalizedMediaItem;
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none top-0 left-0 w-full h-full object-cover ">
      <div className="absolute top-0 left-0 w-full h-full z-[-1] object-cover">
        <Image
          src={media.artUrl || ""}
          alt={media.title || ""}
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-full object-cover dark:opacity-40 opacity-30"
          unoptimized
          priority={true}
        />
      </div>
    </div>
  );
};
