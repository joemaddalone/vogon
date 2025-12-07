"use client";
import { use } from "react";
import { ApiResponse } from "@/lib/types";
import { Film, TvIcon } from "lucide-react";
import { PlexError } from "./PlexError";
import { LibraryCard } from "./LibraryCard";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
export default function Home({
  stats,
  plexConnection,
}: {
  stats: ApiResponse<{ movies: number; shows: number }>;
  plexConnection: Promise<ApiResponse<boolean>>;
}) {
  const t = useTranslations();
  const statsData = stats.data || { movies: 0, shows: 0 };
  const { data: successfulConnection } = use(plexConnection);
  const router = useRouter();
  if (!successfulConnection) {
    return <PlexError />;
  }

  return (
    <div className="home-page max-w-5xl mx-auto">
      {/* Hero Section */}
      <FadeIn className="text-center mb-20 mt-16">
        <h1 className="title">vogon</h1>
        <p className="description">{t("home.description")}</p>
      </FadeIn>

      {/* Library Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Movies Card */}
        <FadeIn>
          {statsData?.movies === 0 ? (
            <div className="empty-card">
              <Film className="library-icon" />
              <p>{t("common.noMovies")}</p>
              <Button
                className="mt-4"
                size="sm"
                onClick={() => router.push("/import")}
              >
                {t("common.importLibraries")}
              </Button>
            </div>
          ) : (
            <LibraryCard
              count={statsData.movies}
              type="movie"
              icon={<Film className="library-icon" />}
            />
          )}
        </FadeIn>

        {/* Shows Card */}
        <FadeIn>
          {statsData?.shows === 0 ? (
            <div className="empty-card">
              <TvIcon className="library-icon" />
              <p>{t("common.noShows")}</p>
              <Button
                className="mt-4"
                size="sm"
                onClick={() => router.push("/import")}
              >
                {t("common.importLibraries")}
              </Button>
            </div>
          ) : (
            <LibraryCard
              count={statsData.shows}
              type="show"
              icon={<TvIcon className="library-icon" />}
            />
          )}
        </FadeIn>
      </div>
    </div>
  );
}
