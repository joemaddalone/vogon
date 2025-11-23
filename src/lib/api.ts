import { MovieResultItem } from "@lorenzopant/tmdb";
import {
  PlexLibraryResponse,
  PlexMovieMetadata,
  PlexShowMetadata,
  TMDBDetail,
  TMDBResult,
  ApiResponse,
  FanartMovieResponse,
  FanartShowResponse,
  Configuration,
  Selectable,
  Updateable,
  PlexSeasonMetadata,
  Insertable,
  Server,
  Media,
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
      error: data.error ? new Error(data.error) : undefined,
    };
  } catch (error) {
    console.error("API error:", error);
    return { data: undefined, error: error as Error };
  }
};

export const api = {
  config: {
    get: async (): Promise<ApiResponse<Selectable<Configuration>>> => {
      return await tryCatch(fetch(`${host}/api/config`));
    },
    save: async (
      config: Updateable<Configuration>
    ): Promise<ApiResponse<Configuration>> => {
      return await tryCatch(
        fetch(`${host}/api/config`, {
          method: "POST",
          body: JSON.stringify(config),
        })
      );
    }
  },
  server: {
    get: async (id?: number): Promise<ApiResponse<Selectable<Server>[]>> => {
      return await tryCatch(fetch(`${host}/api/data/server${id ? `/${id}` : ""}`));
    },
    create: async (server: Insertable<Server>): Promise<ApiResponse<Server>> => {
      return await tryCatch(fetch(`${host}/api/data/server`, {
        method: "POST",
        body: JSON.stringify(server),
      }));
    },
    update: async (server: Updateable<Server>): Promise<ApiResponse<Server>> => {
      return await tryCatch(fetch(`${host}/api/data/server`, {
        method: "PUT",
        body: JSON.stringify(server),
      }));
    },
    delete: async (id: number): Promise<ApiResponse<void>> => {
      return await tryCatch(fetch(`${host}/api/data/server`, {
        method: "DELETE",
        body: JSON.stringify({ id }),
      }));
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
    seasonDetail: async (
      id: string,
      seasonNumber?: number
    ): Promise<ApiResponse<TMDBDetail>> => {
      return await tryCatch(
        fetch(
          `${host}/api/tmdb/season/detail?id=${id}${
            seasonNumber ? `&season_number=${seasonNumber}` : ""
          }`
        )
      );
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
    plex: {
      import: async (
        items: Media[],
        libraryKey: string,
        mediaType: "movie" | "show",
        serverId: number
      ): Promise<ApiResponse<string>> => {
        return await tryCatch(
          fetch(`${host}/api/data/${mediaType}/import`, {
            method: "POST",
            body: JSON.stringify({ items, libraryKey, serverId }),
          })
        );
      },
      movies: async (serverId: number): Promise<ApiResponse<Media[]>> => {
        return await tryCatch(fetch(`${host}/api/data/movie?serverId=${serverId}`));
      },
      shows: async (serverId: number): Promise<ApiResponse<Media[]>> => {
        return await tryCatch(fetch(`${host}/api/data/show?serverId=${serverId}`));
      },
      stats: async (serverId: number): Promise<
        ApiResponse<{ movies: number; shows: number }>
      > => {
        return await tryCatch(fetch(`${host}/api/data/stats?serverId=${serverId}`));
      },
      updatePoster: async (
        mediaType: "movie" | "show" | "season",
        ratingKey: string,
        thumbUrl: string,
        serverId: number
      ): Promise<ApiResponse<void>> => {
        return await tryCatch(
          fetch(`${host}/api/data/${mediaType}/update`, {
            method: "POST",
            body: JSON.stringify({ ratingKey, thumbUrl, serverId }),
          })
        );
      },
      updateBackdrop: async (
        mediaType: "movie" | "show",
        ratingKey: string,
        backdropUrl: string,
        serverId: number
      ): Promise<ApiResponse<void>> => {
        return await tryCatch(
          fetch(`${host}/api/data/${mediaType}/update`, {
            method: "POST",
            body: JSON.stringify({ ratingKey, backdropUrl, serverId }),
          })
        );
      },
      resetMedia: async (
        mediaType: "movie" | "show",
        serverId: number
      ): Promise<ApiResponse<void>> => {
        return await tryCatch(fetch(`${host}/api/data/${mediaType}/reset?serverId=${serverId}`));
      },
      resetMovies: async (serverId: number): Promise<ApiResponse<void>> => {
        return await tryCatch(fetch(`${host}/api/data/movie/reset?serverId=${serverId}`));
      },
      resetShows: async (serverId: number): Promise<ApiResponse<void>> => {
        return await tryCatch(fetch(`${host}/api/data/show/reset?serverId=${serverId}`));
      },
    },
  },
  plex: {
    libraries: async (serverId?: number): Promise<ApiResponse<PlexLibraryResponse[]>> => {
      const url = serverId
        ? `${host}/api/plex/libraries?serverId=${serverId}`
        : `${host}/api/plex/libraries`;
      return await tryCatch(fetch(url));
    },
    library: async (libraryKey: string, serverId?: number): Promise<ApiResponse<Media[]>> => {
      const url = serverId
        ? `${host}/api/plex/library/${libraryKey}?serverId=${serverId}`
        : `${host}/api/plex/library/${libraryKey}`;
      return await tryCatch(fetch(url));
    },
    movieDetail: async (
      id: string,
      serverId?: number
    ): Promise<ApiResponse<PlexMovieMetadata>> => {
      const url = serverId
        ? `${host}/api/plex/movie/${id}/details?serverId=${serverId}`
        : `${host}/api/plex/movie/${id}/details`;
      return await tryCatch(fetch(url));
    },
    showDetail: async (id: string, serverId?: number): Promise<ApiResponse<PlexShowMetadata>> => {
      const url = serverId
        ? `${host}/api/plex/show/${id}/details?serverId=${serverId}`
        : `${host}/api/plex/show/${id}/details`;
      return await tryCatch(fetch(url));
    },
    seasonDetail: async (
      id: string,
      serverId?: number
    ): Promise<ApiResponse<PlexSeasonMetadata>> => {
      const url = serverId
        ? `${host}/api/plex/season/${id}/details?serverId=${serverId}`
        : `${host}/api/plex/season/${id}/details`;
      return await tryCatch(fetch(url));
    },
    poster: async (
      ratingKey: string,
      posterUrl: string,
      serverId?: number
    ): Promise<ApiResponse<void>> => {
      return await tryCatch(
        fetch(`${host}/api/plex/poster`, {
          method: "POST",
          body: JSON.stringify({ ratingKey, posterUrl, serverId }),
        })
      );
    },
    backdrop: async (
      ratingKey: string,
      backdropUrl: string,
      serverId?: number
    ): Promise<ApiResponse<void>> => {
      return await tryCatch(
        fetch(`${host}/api/plex/backdrop`, {
          method: "POST",
          body: JSON.stringify({ ratingKey, backdropUrl, serverId }),
        })
      );
    },
    removeOverlay: async (ratingKey: string, serverId?: number): Promise<ApiResponse<void>> => {
      return await tryCatch(
        fetch(`${host}/api/plex/overlay`, {
          method: "POST",
          body: JSON.stringify({ ratingKey, serverId }),
        })
      );
    },
    test: async (serverId?: number): Promise<ApiResponse<boolean>> => {
      const url = serverId
        ? `${host}/api/plex/test?serverId=${serverId}`
        : `${host}/api/plex/test`;
      return await tryCatch(fetch(url));
    },
  },
};
