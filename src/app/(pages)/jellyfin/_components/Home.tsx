"use client";
import { use } from "react";
import { ApiResponse } from "@/lib/types";
import { Film, TvIcon } from "lucide-react";
import { JellyfinError } from "./JellyfinError";
import { LibraryCard } from "./LibraryCard";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home({
  stats,
  jellyfinConnection,
}: {
  stats: ApiResponse<{ movies: number; shows: number }>;
  jellyfinConnection: Promise<ApiResponse<boolean>>;
}) {
  const statsData = stats.data || { movies: 0, shows: 0 };
  const { data: successfulConnection } = use(jellyfinConnection);
  const router = useRouter();
  if (!successfulConnection) {
    return <JellyfinError />;
  }

  return (
    <div className="home-page max-w-5xl mx-auto">
      {/* Hero Section */}
      <FadeIn className="text-center mb-20 mt-16">
        <h1 className="title">vogon</h1>
        <p className="description">
          Discover and update your media collection with beautiful, high-quality
          poster artwork
        </p>
      </FadeIn>

      {/* Library Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Movies Card */}
        <FadeIn>
          {statsData?.movies === 0 ? (
            <div className="empty-card">
              <Film className="library-icon" />
              <p>No movie libraries found</p>
              <Button className="mt-4" size="sm" onClick={() => router.push("/jellyfin/import")}>Import Libraries</Button>
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
              <p>No show libraries found</p>
              <Button className="mt-4" size="sm" onClick={() => router.push("/jellyfin/import")}>Import Libraries</Button>
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
