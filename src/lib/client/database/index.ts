export * from "./database";
export * from "./configuration";
export * from "./server";
import { media } from "./media";

export const dataManager = {
	plex: {
		movie: media.movie,
		episode: media.episode,
		show: media.show,
		season: media.season,
	}
}
