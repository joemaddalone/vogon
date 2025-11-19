export * from "./database";
export * from "./configuration";
export * from "./jellyfinmovie";
export * from "./jellyfinshow";
export * from "./jellyfinseason";
export * from "./jellyfinepisode";
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
