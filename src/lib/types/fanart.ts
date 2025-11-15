export type FanartMovieResponse = {
  hdmovieclearart: FanartMovieImage[];
  hdmovieclearart_count: number;
  hdmovielogo: FanartMovieImage[];
  hdmovielogo_count: number;
  moviebackground: FanartMovieImage[];
  moviebackground_count: number;
  moviebanner: FanartMovieImage[];
  moviebanner_count: number;
  moviedisc: FanartMovieImage[];
  moviedisc_count: number;
  movielogo: FanartMovieImage[];
  movielogo_count: number;
  movieposter: FanartMovieImage[];
  movieposter_count: number;
  moviethumb: FanartMovieImage[];
  moviethumb_count: number;
  name: string;
  tmdb_id: string;
};

export type FanartShowResponse = {
  characterart: FanartShowImage[],
  characterart_count: number,
  clearart: FanartShowImage[],
  clearart_count: number,
  clearlogo: FanartShowImage[],
  clearlogo_count: number,
  hdclearart: FanartShowImage[],
  hdclearart_count: number,
  hdtvlogo: FanartShowImage[],
  hdtvlogo_count: number,
  name: string,
  seasonbanner: FanartShowImage[],
  seasonbanner_count: number,
  seasonposter: FanartShowImage[],
  seasonposter_count: number,
  seasonthumb: FanartShowImage[],
  seasonthumb_count: number,
  showbackground: FanartShowImage[],
  showbackground_count: number,
  thetvdb_id: string,
  tvbanner: FanartShowImage[],
  tvbanner_count: number,
  tvposter: FanartShowImage[],
  tvposter_count: number,
  tvthumb: FanartShowImage[],
  tvthumb_count: number;
};

export type FanartMovieImage = {
  id: string;
  lang: string;
  likes: number;
  url: string;
};

export type FanartShowImage = {
  id: string;
  lang: string;
  likes: number;
  url: string;
};


export type FanartSeasonImage = FanartShowImage & {
  season?: string;
};