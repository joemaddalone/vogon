"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Library } from "@/components/library/Library";
import { LibraryError } from "@/components/library/LibraryError";
import { Selectable, PlexShow, PlexMovie } from "@/lib/types";
import { api } from "@/lib/api";

type MediaLibrarySectionProps<TItem> = {
  items: TItem[];
  loading: boolean;
  totalLabel: string;
  type: "movie" | "show";
};

export const MediaLibrarySection = <TItem extends object>({
  items,
  loading,
  totalLabel,
  type,
}: MediaLibrarySectionProps<TItem>) => {
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState(items);

  useEffect(() => {
    setEntries(items);
  }, [items]);

  const handleReset = async () => {
    setError(null);

    try {
      await (type === "movie" ? api.data.resetMovies() : api.data.resetShows());
      setEntries([]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to reset library";
      setError(message);
    }
  };

  if (error) {
    return <LibraryError error={error} />;
  }

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            {type === "movie" ? "Movie Library" : "Show Library"}
          </h1>
          <p className="text-muted-foreground">
            {entries.length} total {totalLabel}
          </p>
        </div>
      </div>

      <Library
        key={entries.length}
        type={type}
        items={entries as unknown as Selectable<PlexMovie | PlexShow>[]}
        pending={loading}
      />

      {entries.length > 0 && (
        <Button onClick={handleReset} variant="outline">
          Empty this {type === "movie" ? "Movie" : "Show"} Library
        </Button>
      )}
    </div>
  );
};
