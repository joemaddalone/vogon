import type { Collection, Genre, ProductionCompany, ProductionCountry, SpokenLanguage, MovieImages, MovieResultItem } from "@lorenzopant/tmdb";
export interface TMDBResult {
  backdrop_path?: string;
  id: number;
  title?: string;
  original_title?: string;
  overview?: string;
  poster_path?: string;
  media_type?: string;
  adult?: boolean;
  original_language?: string;
  genre_ids?: number[];
  popularity?: number;
  release_date?: string;
  video?: boolean;
  vote_average?: number;
  vote_count?: number;
}

export type TMDBDetail = {
	adult: boolean;
	backdrop_path: string | null;
	belongs_to_collection: Collection | null;
	budget: number;
	genres: Genre[];
	homepage: string | null;
	id: number;
	imdb_id: string | null;
	origin_country: string[];
	original_language: string;
	original_title: string;
	overview: string | null;
	popularity: number;
	poster_path: string | null;
	production_companies: ProductionCompany[];
	production_countries: ProductionCountry[];
	release_date: string; // ISO format (YYYY-MM-DD)
	revenue: number;
	runtime: number | null; // Some movies have no runtime set
	spoken_languages: SpokenLanguage[];
	status: string;
	tagline: string | null;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
	images: MovieImages;
};


export type FindParams = {
	external_id: string;
	external_source?: 'imdb_id' | 'facebook_id' | 'instagram_id' | 'tvdb_id' | 'tiktok_id' | 'twitter_id' | 'wikidata_id' | 'youtube_id';
};

export type FindResult = {
	movie_results: MovieResultItem[];
};