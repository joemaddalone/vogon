export * from "./database";
export * from "./configuration";
export * from "./jellyfinmovie";
import { jellyfinShow } from "./jellyfinshow";
import { jellyfinSeason } from "./jellyfinseason";
import { jellyfinEpisode } from "./jellyfinepisode";
import { jellyfinMovie } from "./jellyfinmovie";
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
	},
	jellyfin: {
		movie: jellyfinMovie,
		show: jellyfinShow,
		season: jellyfinSeason,
		episode: jellyfinEpisode,
	}
}
