import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import { PlexLibrary } from "@/lib/types";
import { motion } from "motion/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Film, TvIcon } from "lucide-react";

export const LibraryImport = ({ library, index }: { library: PlexLibrary, index: number }) => {
	const [importing, setImporting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const importLibrary = async (libraryKey: string, libraryType: string) => {
    setImporting(libraryKey);
    setError(null);

    const { data, error } = await api.plex.library(libraryKey);
    if (error) {
      setError(error.message);
      setImporting(null);
      console.error(error);
      return;
    }

    const { error: importError } = await api.data.import(
      data,
      libraryKey,
      libraryType as "movie" | "show"
    );
    setImporting(null);
    if (importError) {
      setError(importError.message);
      console.error(importError);
      return;
    }
    router.push(`/${libraryType === "movie" ? "movie" : "show"}`);
  };
  return (
    <motion.div
      key={library.key}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden border-border border-b rounded-2xl bg-secondary p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/5"
    >
      <div className="absolute inset-0" />
			{error && (
        <div className="text-red-500">
          well shit that didnt work..
        </div>
      )}

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          {library.type === "movie" ? (
            <Film className="w-8 h-8 mt-1 text-foreground/80 shrink-0" />
          ) : (
            <TvIcon className="w-8 h-8 mt-1 text-foreground/80 shrink-0" />
          )}
          <div>
            <h3>
              {library.title}
            </h3>
            <p>
              {library.type === "movie" ? "Movie" : "TV Show"} Library
            </p>
          </div>
        </div>
        <Button
          onClick={() => importLibrary(library.key, library.type)}
          disabled={importing !== null}
          size="lg"
          className="rounded-xl font-medium transition-all duration-300 hover:scale-105 whitespace-nowrap"
        >
          {importing === library.key ? (
            <>
              <Spinner className="size-4" />
              Importing...
            </>
          ) : (
            `Import ${library.type === "movie" ? "Movie" : "TV Show"} Library`
          )}
        </Button>
      </div>
    </motion.div>
  );
};
