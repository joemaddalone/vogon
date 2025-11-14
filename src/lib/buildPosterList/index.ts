import { api } from "@/lib/api";
import { getClients } from "@/lib/client/getClients";
import {
  FanartMovieResponse,
  FanartShowResponse,
  PlexMovieMetadata,
  PlexShowMetadata,
  ApiResponse,
  FetchedMedia,
} from "@/lib/types";
import { ThePosterDbClient } from "@/lib/client/theposterdb";
import { extractKnownIds } from "./extractKnownIds";
import { determineTmdbId } from "./determineTmdbId";
import { fetchTmdbDetails } from "./fetchTmdbDetails";
import * as fanart from "./fanart";
import * as tmdb from "./tmdb";
import * as posterdb from "./posterdb";

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

type MediaType = "movie" | "show";

type MediaConfig = {
  plex: (
    id: string
  ) => Promise<ApiResponse<PlexMovieMetadata | PlexShowMetadata>>;
  fanart: (
    id: string
  ) => Promise<ApiResponse<FanartMovieResponse | FanartShowResponse>>;
};

const mediaMethods: Record<MediaType, MediaConfig> = {
  movie: {
    plex: api.plex.movieDetail,
    fanart: api.fanart.moviePosters,
  },
  show: {
    plex: api.plex.showDetail,
    fanart: api.fanart.showPosters,
  },
};

export const buildPosters = async (id: string, type: "movie" | "show") => {
  const config = await getClients();

  const methods = mediaMethods[type as keyof typeof mediaMethods];
  const { data: media } = await methods.plex(id as string);
  if (!media) {
    return { ...errorResponse, error: "Plex movie not found" };
  }
  const knownIds = extractKnownIds(media?.Guid || []);
  const tmdbId = await determineTmdbId(knownIds);
  const tmdbMedia = await fetchTmdbDetails(tmdbId as string, type);
  if (!tmdbMedia) {
    return { ...errorResponse, error: "TMDB media not found" };
  }

	const posters: FetchedMedia[] =[];
  const backdrops: FetchedMedia[] = [];
  const logos: FetchedMedia[] = [];

  if (config.fanartApiKey) {
    const idForFanart = type === "movie" ? tmdbId : knownIds.tvdbId;
    if (type === "movie") {
			const { fanart_posters, fanart_backdrops, fanart_logos } = await fanart.movie(idForFanart as string);
			posters.push(...fanart_posters);
			backdrops.push(...fanart_backdrops);
			logos.push(...fanart_logos);
		} else if (type === "show") {
			const { fanart_posters, fanart_backdrops, fanart_logos } = await fanart.show(idForFanart as string);
			posters.push(...fanart_posters);
			backdrops.push(...fanart_backdrops);
			logos.push(...fanart_logos);
		}
	}

	const { tmdb_posters, tmdb_backdrops } = await tmdb.images(tmdbMedia);
	posters.push(...tmdb_posters);
	backdrops.push(...tmdb_backdrops);


  if (config.thePosterDbEmail && config.thePosterDbPassword) {
		const { theposterdb_posters } = await posterdb.images(config.thePosterDb as ThePosterDbClient, {
			title: media.title,
			year: media.year,
			itemType: type,
		});
		posters.push(...theposterdb_posters);
  }

  return {
    error: null,
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
