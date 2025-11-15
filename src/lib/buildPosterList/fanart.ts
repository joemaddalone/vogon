import { api } from "@/lib/api";
import {
  FanartMovieImage,
  FanartMovieResponse,
  FanartShowImage,
  FanartSeasonImage,
  FanartShowResponse,
  FetchedMedia,
} from "@/lib/types";

export const movie = async (id: string) => {
  const p: FetchedMedia[] = [];
  const b: FetchedMedia[] = [];
  const l: FetchedMedia[] = [];
  const { data: fanartResponse } = await api.fanart.moviePosters(id as string);
  const fa = fanartResponse as FanartMovieResponse;

  if (fa && "movieposter" in fa && fa.movieposter.length > 0) {
    fa.movieposter
      .filter((poster: FanartMovieImage) => poster.lang === "en")
      .forEach((poster: FanartMovieImage) => {
        p.push({
          file_path: poster.url,
          source: "fanart",
        });
      });
  }

  if (fa && "hdmovielogo" in fa && fa.hdmovielogo.length > 0) {
    fa.hdmovielogo
      .filter((logo: FanartMovieImage) => logo.lang === "en")
      .forEach((logo: FanartMovieImage) => {
        l.push({
          file_path: logo.url,
          source: "fanart",
        });
      });
  }

  if (fa && "moviebackground" in fa && fa.moviebackground.length > 0) {
    fa.moviebackground.forEach((background: FanartMovieImage) => {
      b.push({
        file_path: background.url,
        source: "fanart",
      });
    });
  }

  return { fanart_posters: p, fanart_backdrops: b, fanart_logos: l };
};

export const show = async (id: string) => {
  const p: FetchedMedia[] = [];
  const b: FetchedMedia[] = [];
  const l: FetchedMedia[] = [];
  const { data: fanartResponse } = await api.fanart.showPosters(id as string);
  const fa = fanartResponse as FanartShowResponse;

  if (fa && "tvposter" in fa && fa.tvposter.length > 0) {
    fa.tvposter.forEach((poster: FanartShowImage) => {
      p.push({
        file_path: poster.url,
        source: "fanart",
      });
    });
  }

  if (fa && "hdtvlogo" in fa && fa.hdtvlogo.length > 0) {
    fa.hdtvlogo
      .filter((logo: FanartShowImage) => logo.lang === "en")
      .forEach((logo: FanartShowImage) => {
        l.push({
          file_path: logo.url,
          source: "fanart",
        });
      });
  }

  if (fa && "showbackground" in fa && fa.showbackground.length > 0) {
    fa.showbackground.forEach((background: FanartShowImage) => {
      b.push({
        file_path: background.url,
        source: "fanart",
      });
    });
  }
  return { fanart_posters: p, fanart_backdrops: b, fanart_logos: l };
};


export const season = async (id: string, seasonNumber: number) => {
  const p: FetchedMedia[] = [];
  const b: FetchedMedia[] = [];
  const l: FetchedMedia[] = [];
  const { data: fanartResponse } = await api.fanart.showPosters(id as string);
  const fa = fanartResponse as FanartShowResponse;

  if (fa && "seasonposter" in fa && fa.seasonposter.length > 0) {
    fa.seasonposter.filter((poster: FanartSeasonImage) => poster.season === seasonNumber.toString()).forEach((poster: FanartSeasonImage) => {
      p.push({
        file_path: poster.url,
        source: "fanart",
        season: seasonNumber.toString(),
      });
    });
  }
  return { fanart_posters: p, fanart_backdrops: b, fanart_logos: l };
}