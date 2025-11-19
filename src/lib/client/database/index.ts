export * from "./database";
export * from "./plexmovie";
export * from "./plexshow";
export * from "./plexseason";
export * from "./plexepisode";
export * from "./configuration";

import { plexMovie } from "./plexmovie";

export const dataManager = {
	plex: {
		movie: plexMovie,
	}
}
