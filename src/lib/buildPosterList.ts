import { api } from "@/lib/api";
import { getClients } from "@/lib/client/getClients";
import {
  FanartMovieImage,
  FanartMovieResponse,
  FanartShowImage,
  FanartShowResponse,
  ThePosterDbPoster,
} from "@/lib/types";
import { ThePosterDbClient } from "./client/theposterdb";

const errorResponse = {
  error: "Unknown error",
  posters: [],
  logos: [],
  media: null,
  knownIds: {
    tmdbId: null,
    imdbId: null,
    tvdbId: null,
  },
  tmdbId: null,
  tmdbMedia: null,
};

const extractKnownIds = (guid: Record<string, string>[]) => {
  const ids = guid.map((guid: Record<string, string>): string => guid.id);
  const tmdbId = ids.find((str: string) => str.startsWith("tmdb")) || "";
  const imdbId = ids.find((str: string) => str.startsWith("imdb")) || "";
  const tvdbId = ids.find((str: string) => str.startsWith("tvdb")) || "";
  return {
    tmdbId: tmdbId?.split("://")[1],
    imdbId: imdbId?.split("://")[1],
    tvdbId: tvdbId?.split("://")[1],
  };
};

const fetchTmdbDetails = async (id: string, type: "movie" | "show") => {
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

const determineTmdbId = async (knownIds: {
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

export const buildPosters = async (id: string, type: "movie" | "show") => {
  const config = await getClients();
  const methods = {
    plex: type === "movie" ? api.plex.movieDetail : api.plex.showDetail,
    fanart: type === "movie" ? api.fanart.moviePosters : api.fanart.showPosters,
    tmdb: type === "movie" ? "detail" : "showDetail",
  };
  const { data: media } = await methods.plex(
    id as string
  );
  if (!media) {
    return { ...errorResponse, error: "Plex movie not found" };
  }
  const knownIds = extractKnownIds(media?.Guid || []);
  const tmdbId = await determineTmdbId(knownIds);
  const tmdbMedia = await fetchTmdbDetails(tmdbId as string, type);
  if (!tmdbMedia) {
    return { ...errorResponse, error: "TMDB media not found" };
  }
  const posters: { file_path: string; previewUrl?: string; source?: string }[] =
  [];
  const logos: { file_path: string; source?: string }[] = [];

  if (config.fanartApiKey) {
    const idForFanart = type === "movie" ? tmdbId : knownIds.tvdbId;
    const { data: fanartResponse } =
      await methods.fanart(idForFanart as string);
    const fa = fanartResponse as FanartMovieResponse | FanartShowResponse;

    if (type === "movie") {
      if (fa && "movieposter" in fa && fa.movieposter.length > 0) {
        fa.movieposter.forEach((poster: FanartMovieImage) => {
          if (poster.lang === "en") {
            posters.push({
              file_path: poster.url,
              source: "fanart",
            });
          }
        });
      }

      if (fa && "hdmovielogo" in fa && fa.hdmovielogo.length > 0) {
        fa.hdmovielogo
          .filter((logo: FanartShowImage) => logo.lang === "en")
          .forEach((logo: FanartMovieImage) => {
            logos.push({
              file_path: logo.url,
              source: "fanart",
            });
          });
      }
    } else if (type === "show") {
      if (fa && "tvposter" in fa && fa.tvposter.length > 0) {
        fa.tvposter.forEach((poster: FanartShowImage) => {
          posters.push({
            file_path: poster.url,
            source: "fanart",
          });
        });
      }

      if (fa && "hdtvlogo" in fa && fa.hdtvlogo.length > 0) {
        fa.hdtvlogo
          .filter((logo: FanartShowImage) => logo.lang === "en")
          .forEach((logo: FanartShowImage) => {
            logos.push({
              file_path: logo.url,
              source: "fanart",
            });
          });
      }
    }
  }

  if (tmdbMedia.images.posters && tmdbMedia.images.posters.length > 0) {
    tmdbMedia.images.posters.forEach((poster: { file_path: string }) => {
      posters.push({
        file_path: `https://image.tmdb.org/t/p/w500/${poster.file_path}`,
        source: "tmdb",
      });
    });
  }

  if (config.thePosterDbEmail && config.thePosterDbPassword) {
    const theposterdb = config.thePosterDb as ThePosterDbClient;
    try {
      const theposterdbPosters = await theposterdb.search({
        title: media.title,
        year: media.year,
        itemType: type,
      });
      if (theposterdbPosters.length > 0) {
        theposterdbPosters.forEach((poster: ThePosterDbPoster) => {
          posters.push({
            file_path: poster.url,
            previewUrl: poster.url.replace("/download", "/view"),
            source: "theposterdb",
          });
        });
      } else {
        console.log("No posters found in ThePosterDB");
      }
    } catch (error) {
      console.error("Error searching ThePosterDB:", error);
    }
  }

  return {
    error: null,
    posters,
    logos,
    media,
    knownIds,
    tmdbId,
    tmdbMedia,
    mediaType: type,
  };
};
