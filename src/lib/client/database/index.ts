export * from "./database";
export * from "./plexmovie";
export * from "./plexshow";
export * from "./plexseason";
export * from "./plexepisode";
export * from "./configuration";

import { plexMovie } from "./plexmovie";
import { plexEpisode } from "./plexepisode";
import { plexShow } from "./plexshow";
import { plexSeason } from "./plexseason";

export const dataManager = {
	plex: {
		movie: plexMovie,
		episode: plexEpisode,
		show: plexShow,
		season: plexSeason,
	}
}
