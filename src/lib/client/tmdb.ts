import { TMDB, type MovieResultItem } from "@lorenzopant/tmdb";
import { TMDBDetail } from "../types";
import { getClients } from "./getClients";

declare module "./tmdb" {
  interface TMDB {
    find(
      external_id: string,
      external_source: string
    ): Promise<MovieResultItem[]>;
    shows: {
      detail: (id: string) => Promise<TMDBDetail>;
    };
    seasons: {
      detail: (id: string) => Promise<TMDBDetail>;
    };
  }
}

export class TMDBWithFind extends TMDB {
  find = async (
    external_id: string,
    external_source?: string
  ): Promise<MovieResultItem[]> => {
    const config = await getClients();
    const apiKey = config?.tmdbApiKey || "";
    const url = `https://api.themoviedb.org/3/find/${external_id}?external_source=${
      external_source || ""
    }`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    if (!response.ok) {
      console.error(`TMDB Find API request failed with status ${response.status}`);
      return [];
    }
    const data = await response.json();
    return data.movie_results as MovieResultItem[];
  };

  shows = {
    details: async (id: string): Promise<TMDBDetail> => {
      const config = await getClients();
      const apiKey = config?.tmdbApiKey || "";
      const url = `https://api.themoviedb.org/3/tv/${id}?append_to_response=images`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json;charset=utf-8",
        },
      });
      if (!response.ok) {
        console.error(`TMDB Show Detail API request failed with status ${response.status}`);
        return null as unknown as TMDBDetail;
      }
      const data = await response.json();
      return data as TMDBDetail;
    },
  };

  seasons = {
    details: async (id: string, season_number: number): Promise<TMDBDetail> => {
      const config = await getClients();
      const apiKey = config?.tmdbApiKey || "";
      const url = `https://api.themoviedb.org/3/tv/${id}/season/${season_number}?append_to_response=images`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json;charset=utf-8",
        },
      });
      if (!response.ok) {
        console.error(`TMDB Season Detail API request failed with status ${response.status}`);
        return null as unknown as TMDBDetail;
      }
      const data = await response.json();
      return data as TMDBDetail;
    },
  };
}



