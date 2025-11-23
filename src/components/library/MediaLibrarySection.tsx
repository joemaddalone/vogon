"use client";

import { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { Library } from "@/components/library/Library";
import { LibraryError } from "@/components/library/LibraryError";
import { Selectable, Media, ApiResponse } from "@/lib/types";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useServer } from "@/components/context/ServerContext";

type MediaLibrarySectionProps = {
  libLoader: Promise<ApiResponse<Media[]>>;
  totalLabel: string;
  type: "movie" | "show";
};

export const MediaLibrarySection = ({
  libLoader,
  totalLabel,
  type,
}: MediaLibrarySectionProps) => {
  const router = useRouter();
  const [_error, setError] = useState<string | null>(null);
  const { data, error: libError } = use(libLoader);
  const { selectedServerId } = useServer();

  const handleReset = async () => {
    if (!selectedServerId) {
      setError("Please select a server first");
      return;
    }

    setError(null);

    try {
      await (type === "movie"
        ? api.data.plex.resetMovies(selectedServerId)
        : api.data.plex.resetShows(selectedServerId));
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to reset library";
      setError(message);
    }
  };

  if (libError) {
    return <LibraryError error={libError.message} />;
  }

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            {type === "movie" ? "Movie Library" : "Show Library"}
          </h1>
          <p className="text-muted-foreground">
            {data?.length} total {totalLabel}
          </p>
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
          Empty this {type === "movie" ? "Movie" : "Show"} Library
        </Button>
      )}
    </div>
  );
};
