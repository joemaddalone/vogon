"use client";

import { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { Library } from "@/components/library/Library";
import { LibraryError } from "@/components/library/LibraryError";
import { Selectable, Media, ApiResponse } from "@/lib/types";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useTranslations } from "next-intl";

type MediaLibrarySectionProps = {
  libLoader: Promise<ApiResponse<Media[]>>;
  type: "movie" | "show";
};

export const MediaLibrarySection = ({
  libLoader,
  type,
}: MediaLibrarySectionProps) => {
  const router = useRouter();
  const t = useTranslations();
  const [error, setError] = useState<string | null>(null);
  const { data, error: libError } = use(libLoader);



  const handleReset = async () => {
    setError(null);

    try {
      await (type === "movie" ? api.data.plex.resetMovies() : api.data.plex.resetShows());
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t("common.failedToResetLibrary");
      setError(message);
    }
  };

  if (libError) {
    return <LibraryError error={libError.message} />;
  }

  const isMovie = type === "movie";

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            {t(isMovie ? "common.movieLibrary" : "common.showLibrary")}
          </h1>
        </div>
      </div>

      <Library
        key={data?.length}
        type={type}
        items={data as unknown as Selectable<Media>[]}
        pending={false}
      />

      {data?.length > 0 && (
        <Button onClick={handleReset} variant="outline">
          {t(isMovie ? "common.emptyMovieLibrary" : "common.emptyShowLibrary")}
        </Button>
      )}
    </div>
  );
};
