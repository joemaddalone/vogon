"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlexLibrary } from "@/lib/types/plex";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import { motion } from "motion/react";
import { Film, TvIcon } from "lucide-react";

export const Libraries = ({ libraries }: { libraries: PlexLibrary[] }) => {
  const router = useRouter();
  const [importing, setImporting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    <div className="max-w-4xl mx-auto mt-12">
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
          Select Plex Library
        </h1>
        <p className="text-lg text-muted-foreground/90 font-light leading-relaxed max-w-2xl">
          Choose a library to import and manage poster artwork. Be sure the
          library actually contains movies or TV shows. If the library contains
          other types of media you won&apos;t have much luck finding posters for
          it.
        </p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6"
        >
          <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
        </motion.div>
      )}

      {libraries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-20"
        >
          <p className="text-xl text-muted-foreground font-light">
            No libraries found in your Plex server.
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-6">
          {libraries.map((library, index) => (
            <motion.div
              key={library.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden border-border border-b rounded-2xl bg-secondary p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/5"
            >
              <div className="absolute inset-0" />

              <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  {library.type === "movie" ? (
                    <Film className="w-8 h-8 mt-1 text-foreground/80 shrink-0" />
                  ) : (
                    <TvIcon className="w-8 h-8 mt-1 text-foreground/80 shrink-0" />
                  )}
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">
                      {library.title}
                    </h2>
                    <p className="text-base text-muted-foreground font-medium">
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
                    `Import ${
                      library.type === "movie" ? "Movie" : "TV Show"
                    } Library`
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
