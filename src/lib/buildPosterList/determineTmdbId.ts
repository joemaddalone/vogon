import { api } from "@/lib/api";

export const determineTmdbId = async (knownIds: {
  tmdbId: string;
  imdbId: string;
  tvdbId: string;
}) => {
  if (knownIds.tmdbId) {
    return knownIds.tmdbId;
  }
  if (knownIds.tvdbId) {
    const { data: tmdbMovieData, error: tmdbMovieError } = await api.tmdb.find(
      knownIds.tvdbId as string,
      "tvdb_id"
    );
    if (!tmdbMovieError && tmdbMovieData && tmdbMovieData.length > 0) {
      return tmdbMovieData[0].id;
    }
  }

  if (knownIds.imdbId) {
    const { data: tmdbMovieData, error: tmdbMovieError } = await api.tmdb.find(
      knownIds.imdbId as string,
      "imdb_id"
    );
    if (!tmdbMovieError && tmdbMovieData && tmdbMovieData.length > 0) {
      return tmdbMovieData[0].id;
    }
  }

  return null;
};