import { api } from "@/lib/api";

export const fetchTmdbDetails = async (id: string, type: "movie" | "show" | "season", seasonNumber?: number) => {
  const methods = {
    movie: api.tmdb.detail,
    show: api.tmdb.showDetail,
    season: api.tmdb.seasonDetail,
  };
  const { data: tmdbMediaData, error: tmdbMediaError } = await methods[type](
    id,
    seasonNumber
  );
  if (tmdbMediaError) {
    return null;
  }
  return tmdbMediaData;
};