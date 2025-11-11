import { MovieResultItem } from "@lorenzopant/tmdb";
import {
  PlexLibrary,
  PlexMovie,
  PlexMovieMetadata,
  PlexShowMetadata,
  TMDBDetail,
  TMDBResult,
  ApiResponse,
  PlexShow,
  FanartMovieResponse,
  FanartShowResponse,
  Configuration,
  Selectable,
  Updateable,
} from "./types";

const host = "http://localhost:6001";

const tryCatch = async function <T>(
  promise: Promise<Response>
): Promise<ApiResponse<T>> {
  try {
    const response = await promise;
    const data = await response.json();
    return {
      data: data.data,
      error: data.error ? new Error(data.error) : null,
    };
  } catch (error) {
    console.error("API error:", error);
    return { data: null, error: error as Error };
  }
};

export const api = {
  config: {
    get: async (): Promise<ApiResponse<Selectable<Configuration>>> => {
      return await tryCatch(fetch(`${host}/api/config`));
    },
    save: async (config: Updateable<Configuration>): Promise<ApiResponse<Configuration>> => {
      return await tryCatch(fetch(`${host}/api/config`, { method: "POST", body: JSON.stringify(config) }));
    },
  },
  tmdb: {
    search: async (query: string): Promise<ApiResponse<TMDBResult[]>> => {
      return await tryCatch(fetch(`${host}/api/tmdb/search?query=${query}`));
    },
    detail: async (id: string): Promise<ApiResponse<TMDBDetail>> => {
      return await tryCatch(fetch(`${host}/api/tmdb/detail?id=${id}`));
    },
    showDetail: async (id: string): Promise<ApiResponse<TMDBDetail>> => {
      return await tryCatch(fetch(`${host}/api/tmdb/show/detail?id=${id}`));
    },
    find: async (
      external_id: string,
      external_source?: string
    ): Promise<ApiResponse<MovieResultItem[]>> => {
      return await tryCatch(
        fetch(
          `${host}/api/tmdb/find?external_id=${external_id}${
            external_source ? `&external_source=${external_source}` : ""
          }`
        )
      );
    },
  },
  fanart: {
    moviePosters: async (
      id: string
    ): Promise<ApiResponse<FanartMovieResponse>> => {
      return await tryCatch(fetch(`${host}/api/fanart/movie/${id}`));
    },
    showPosters: async (
      id: string
    ): Promise<ApiResponse<FanartShowResponse>> => {
      return await tryCatch(fetch(`${host}/api/fanart/show/${id}`));
    },
  },
  data: {
    import: async (
      items: PlexMovie[] | PlexShow[],
      libraryKey: string,
      mediaType: "movie" | "show"
    ): Promise<ApiResponse<string>> => {
      return await tryCatch(
        fetch(`${host}/api/data/${mediaType}/import`, {
          method: "POST",
          body: JSON.stringify({ items, libraryKey }),
        })
      );
    },
    movies: async (): Promise<ApiResponse<PlexMovie[]>> => {
      return await tryCatch(fetch(`${host}/api/data/movie`));
    },
    shows: async (): Promise<ApiResponse<PlexShow[]>> => {
      return await tryCatch(fetch(`${host}/api/data/show`));
    },
    stats: async (): Promise<ApiResponse<{ movies: number; shows: number }>> => {
      return await tryCatch(fetch(`${host}/api/data/stats`));
    },
    updatePoster: async (
      mediaType: "movie" | "show",
      ratingKey: string,
      thumbUrl: string
    ): Promise<ApiResponse<void>> => {
      return await tryCatch(
        fetch(`${host}/api/data/${mediaType}/update`, {
          method: "POST",
          body: JSON.stringify({ ratingKey, thumbUrl }),
        })
      );
    },
    resetMedia: async (
      mediaType: "movie" | "show"
    ): Promise<ApiResponse<void>> => {
      return await tryCatch(fetch(`${host}/api/data/${mediaType}/reset`));
    },
    resetMovies: async (): Promise<ApiResponse<void>> => {
      return await tryCatch(fetch(`${host}/api/data/movie/reset`));
    },
    resetShows: async (): Promise<ApiResponse<void>> => {
      return await tryCatch(fetch(`${host}/api/data/show/reset`));
    },
  },
  plex: {
    libraries: async (): Promise<ApiResponse<PlexLibrary[]>> => {
      return await tryCatch(fetch(`${host}/api/plex/libraries`));
    },
    library: async (libraryKey: string): Promise<ApiResponse<PlexMovie[]>> => {
      return await tryCatch(fetch(`${host}/api/plex/library/${libraryKey}`));
    },
    movieDetail: async (
      id: string
    ): Promise<ApiResponse<PlexMovieMetadata>> => {
      return await tryCatch(fetch(`${host}/api/plex/movie/${id}/details`));
    },
    showDetail: async (
      id: string
    ): Promise<ApiResponse<PlexShowMetadata>> => {
      return await tryCatch(fetch(`${host}/api/plex/show/${id}/details`));
    },
    poster: async (
      ratingKey: string,
      posterUrl: string
    ): Promise<ApiResponse<void>> => {
      return await tryCatch(
        fetch(`${host}/api/plex/poster`, {
          method: "POST",
          body: JSON.stringify({ ratingKey, posterUrl }),
        })
      );
    },
    removeOverlay: async (ratingKey: string): Promise<ApiResponse<void>> => {
      return await tryCatch(fetch(`${host}/api/plex/overlay`, {
        method: "POST",
        body: JSON.stringify({ ratingKey }),
      }));
    },
    test: async (): Promise<ApiResponse<boolean>> => {
      return await tryCatch(fetch(`${host}/api/plex/test`));
    },
  },
};
