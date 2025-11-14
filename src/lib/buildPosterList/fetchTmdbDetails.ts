import { api } from "@/lib/api";

export const fetchTmdbDetails = async (id: string, type: "movie" | "show") => {
  const methods = {
    movie: api.tmdb.detail,
    show: api.tmdb.showDetail,
  };
  const { data: tmdbMediaData, error: tmdbMediaError } = await methods[type](
    id
  );
  if (tmdbMediaError) {
    return null;
  }
  return tmdbMediaData;
};