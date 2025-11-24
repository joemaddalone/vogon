import { standard } from "./standard";
import { frame } from "./frame";
import { minimalDigital } from "./minimalDigital";
import { vhs } from "./vhs";

export type cardTypes = "original" | "standard" | "frame" | "minimalDigital" | "vhs";

export const createCard = async (data: {
	episodeTitle: string;
	seasonNumber: number;
	episodeNumber: number;
}, type: cardTypes, canvas: HTMLCanvasElement) => {
	if (type === "standard") {
		await standard(data, canvas);
		return;
	}
	if (type === "frame") {
		await frame(data, canvas);
		return;
	}
	if (type === "minimalDigital") {
		await minimalDigital(data, canvas);
		return;
	}
	if (type === "vhs") {
		await vhs(data, canvas);
		return;
	}
};

