"use client";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";

const ImageLoader = ({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  sizes = "",
  unoptimized = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  unoptimized?: boolean;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const cacheBustedSrc = useMemo(() => {
    if (retryCount === 0) {
      return src;
    }

    const separator = src.includes("?") ? "&" : "?";
    return `${src}${separator}retry=${retryCount}`;
  }, [src, retryCount]);

  const handleRetry = () => {
    setImageError(false);
    setImageLoaded(false);
    setRetryCount((prev) => prev + 1);
  };

  return (
    <>
      {!imageLoaded && !imageError && (
        <Spinner className="size-16 text-gray-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      )}{" "}
      {!imageLoaded && imageError && (
        <div className="z-10 flex flex-col items-center justify-center bg-primary h-full w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="text-sm">Error loading image</div>
          <Button onClick={handleRetry} variant="outline" className="mt-2 shadow-lg hover:shadow-none">
            Retry
          </Button>
        </div>
      )}
      <Image
        key={retryCount}
        src={cacheBustedSrc}
        alt={alt}
        className={className}
        priority={priority}
        sizes={sizes}
        width={width}
        height={height}
        unoptimized={unoptimized}
        onLoad={() => setImageLoaded(true)}
        style={{ opacity: imageLoaded ? 1 : 0 }}
        onError={() => setImageError(true)}
      />
    </>
  );
};

export default ImageLoader;
