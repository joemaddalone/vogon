import { api } from "@/lib/api";
import { getClients } from "@/lib/client/getClients";
import {
  FanartMovieResponse,
  FanartShowResponse,
  ApiResponse,
  FetchedMedia,
  NormalizedMovieDetails,
} from "@/lib/types";
import { ThePosterDbClient } from "@/lib/client/theposterdb";
import { determineTmdbId } from "./determineTmdbId";
import { fetchTmdbDetails } from "./fetchTmdbDetails";
import * as fanart from "./fanart";
import * as tmdb from "./tmdb";
import * as posterdb from "./posterdb";
import { extractKnownIds } from "./extractKnownIds";

const errorResponse = {
  error: "Unknown error",
  posters: [],
  logos: [],
  media: null,
  knownIds: {
    tmdb: null,
    imdb: null,
    tvdb: null,
  },
  tmdbId: null,
  tmdbMedia: null,
};

type MediaType = "movie" | "show" | "season";

type MediaConfig = {
  plex: (
    id: string
  ) => Promise<
    ApiResponse<NormalizedMovieDetails>
  >;
  fanart: (
    id: string
  ) => Promise<ApiResponse<FanartMovieResponse | FanartShowResponse>>;
};

const mediaMethods: Record<MediaType, MediaConfig> = {
  movie: {
    plex: api.mediaserver.movieDetail,
    fanart: api.fanart.moviePosters,
  },
  show: {
    plex: api.mediaserver.showDetail,
    fanart: api.fanart.showPosters,
  },
  season: {
    plex: api.mediaserver.seasonDetail,
    fanart: api.fanart.showPosters,
  },
};

export const buildPosters = async (
  id: string,
  type: MediaType,
  seasonNumber?: number,
  seasonId?: string
) => {
  const config = await getClients();
  if (!config) {
    return { ...errorResponse, error: "No config found" };
  }

  const methods = mediaMethods[type as keyof typeof mediaMethods];
  let { data: media } = await methods.plex(id as string);
  if (!media) {
    return { ...errorResponse, error: "Plex movie not found" };
  }

  let knownIds;
  // @ts-expect-error - media.guid is not defined in the type
  if(media.Guid) {
    // @ts-expect-error - media.guid is not defined in the type
    knownIds = extractKnownIds(media.Guid);
  } else {
    knownIds = media.providerIds;
  }

  const tmdbId = await determineTmdbId(knownIds as { tmdb?: string; imdb?: string; tvdb?: string });
  const tmdbMedia = await fetchTmdbDetails(
    tmdbId as string,
    type,
    seasonNumber
  );
  if (!tmdbMedia) {
    return { ...errorResponse, error: "TMDB media not found" };
  }

  const posters: FetchedMedia[] = [];
  const backdrops: FetchedMedia[] = [];
  const logos: FetchedMedia[] = [];

  if (config.fanartApiKey && (knownIds?.tvdb || tmdbId)) {
    const idForFanart = type === "movie" ? tmdbId : knownIds?.tvdb;
    if (type === "movie") {
      const { fanart_posters, fanart_backdrops, fanart_logos } =
        await fanart.movie(idForFanart as string);
      posters.push(...fanart_posters);
      backdrops.push(...fanart_backdrops);
      logos.push(...fanart_logos);
    } else if (type === "show") {
      const { fanart_posters, fanart_backdrops, fanart_logos } =
        await fanart.show(idForFanart as string);
      posters.push(...fanart_posters);
      backdrops.push(...fanart_backdrops);
      logos.push(...fanart_logos);
    } else if (type === "season") {
      const { fanart_posters, fanart_backdrops, fanart_logos } =
        await fanart.season(idForFanart as string, seasonNumber as number);
      posters.push(...fanart_posters);
      backdrops.push(...fanart_backdrops);
      logos.push(...fanart_logos);
    }
  }

  const { tmdb_posters, tmdb_backdrops } = await tmdb.images(tmdbMedia);
  posters.push(...tmdb_posters);
  backdrops.push(...tmdb_backdrops);

  if (
    type !== "season" &&
    config.thePosterDbEmail &&
    config.thePosterDbPassword
  ) {
    const { theposterdb_posters } = await posterdb.images(
      config.thePosterDb as ThePosterDbClient,
      {
        title: media.title,
        year: media.year,
        itemType: type,
      }
    );
    posters.push(...theposterdb_posters);
  }

  if (type === "season") {
    const { data: seasonMedia } = await methods.plex(seasonId as string);
    media = seasonMedia;
  }

  return {
    error: undefined,
    backdrops,
    posters,
    logos,
    media,
    knownIds,
    tmdbId,
    tmdbMedia,
    mediaType: type,
  };
};
