"use client";

import ImageLoader from "@/components/ImageLoader";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "motion/react";

type BackdropOptionProps = {
  posterUrl: string;
  previewUrl?: string;
  source?: string;
  isCurrent: boolean;
  isBusy: boolean;
  onSelect: () => void;
};

export const BackdropOption = ({
  posterUrl,
  previewUrl,
  source,
  isCurrent,
  isBusy,
  onSelect,
}: BackdropOptionProps) => {
  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="group"
    >
      {source && <div className="flex w-full justify-center items-center text-xs pb-2">source: {source}</div>}
      <figure className="relative">
        <div className="relative overflow-hidden rounded-[12px] transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-foreground/10">
          <ImageLoader
            src={previewUrl || posterUrl}
            alt={previewUrl || posterUrl}
            width={500}
            height={500}
            className="transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <figcaption className="mt-5 text-center">
          {isCurrent ? (
            <span className="inline-flex items-center  bg-yellow-400/10 px-4 py-2.5 text-sm font-semibold dark:text-yellow-500 shadow-lg border border-yellow-400/30 backdrop-blur-md">
              Current Backdrop
            </span>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={onSelect}
              disabled={isBusy}
              className="relative rounded-xl font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBusy ? (
                <>
                  <Spinner className="size-4" />
                  Updating...
                </>
              ) : (
                <>
                  Use this backdrop
                </>
              )}
            </Button>
          )}
        </figcaption>
      </figure>
    </motion.li>
  );
};
