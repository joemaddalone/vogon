import { standard } from "./standard";
import { frame } from "./frame";

export type cardTypes = "original" | "standard" | "frame";

export const createCard = (data: {
	episodeTitle: string;
	seasonNumber: number;
	episodeNumber: number;
}, type: cardTypes, canvas: HTMLCanvasElement) => {
	if (type === "standard") {
		return standard(data, canvas);
	}
	if (type === "frame") {
		return frame(data, canvas);
	}
};