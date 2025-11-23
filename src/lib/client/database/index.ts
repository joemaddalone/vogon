export * from "./database";
export * from "./configuration";
export * from "./server";
export * from "./session";
import { media } from "./media";

export const dataManager = {
	plex: {
		movie: media.movie,
		episode: media.episode,
		show: media.show,
		season: media.season,
	}
}
