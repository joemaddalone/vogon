import { api } from "@/lib/api";

export const determineTmdbId = async (knownIds: {
  tmdb?: string;
  imdb?: string;
  tvdb?: string;
} | undefined) => {
  if (!knownIds) {
    return null;
  }
  if (knownIds.tmdb) {
    return knownIds.tmdb;
  }
  if (knownIds.tvdb) {
    const { data: tmdbMovieData, error: tmdbMovieError } = await api.tmdb.find(
        knownIds.tvdb as string,
      "tvdb_id"
    );
    if (!tmdbMovieError && tmdbMovieData && tmdbMovieData.length > 0) {
      return tmdbMovieData[0].id;
    }
  }

  if (knownIds.imdb) {
    const { data: tmdbMovieData, error: tmdbMovieError } = await api.tmdb.find(
      knownIds.imdb as string,
      "imdb_id"
    );
    if (!tmdbMovieError && tmdbMovieData && tmdbMovieData.length > 0) {
      return tmdbMovieData[0].id;
    }
  }

  return null;
};