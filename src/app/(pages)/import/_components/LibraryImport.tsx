import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import { NormalizedLibrary } from "@/lib/types";
import { motion } from "motion/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Film, TvIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export const LibraryImport = ({ library, index }: { library: NormalizedLibrary, index: number }) => {
	const [importing, setImporting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const t = useTranslations();

	const importLibrary = async (libraryKey: string, libraryType: string) => {
    setImporting(libraryKey);
    setError(null);

    const { data, error } = await api.mediaserver.library(libraryKey);
    if (error) {
      setError(error.message);
      setImporting(null);
      console.error(error);
      return;
    }

    const { error: importError } = await api.data.plex.import(
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

  const isMovie = library.type === "movie";

  return (
    <motion.div
      key={library.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden border-border border-b rounded-2xl bg-secondary p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/5"
    >
      <div className="absolute inset-0" />
			{error && (
        <div className="text-red-500">
          {t("import.importError")}
        </div>
      )}

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          {isMovie ? (
            <Film className="w-8 h-8 mt-1 text-foreground/80 shrink-0" />
          ) : (
            <TvIcon className="w-8 h-8 mt-1 text-foreground/80 shrink-0" />
          )}
          <div>
            <h3>
              {library.name}
            </h3>
            <p>
              {t(isMovie ? "import.movieLibrary" : "import.tvShowLibrary")}
            </p>
          </div>
        </div>
        <Button
          onClick={() => importLibrary(library.id, library.type)}
          disabled={importing !== null}
          size="lg"
          className="rounded-xl font-medium transition-all duration-300 hover:scale-105 whitespace-nowrap"
        >
          {importing === library.id ? (
            <>
              <Spinner className="size-4" />
              {t("import.importing")}
            </>
          ) : (
            t(isMovie ? "import.importMovieLibrary" : "import.importTvShowLibrary")
          )}
        </Button>
      </div>
    </motion.div>
  );
};
