import { standard } from "./standard";
import { frame } from "./frame";
import { minimalDigital } from "./minimalDigital";
import { vhs } from "./vhs";
import { bars } from "./bars";

export type cardTypes = "current" | "original" | "standard" | "frame" | "minimalDigital" | "vhs" | "bars";

export const createCard = async (data: {
	episodeTitle: string;
	seasonNumber: number;
	episodeNumber: number;
	image?: string;
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
	if (type === "bars") {
		await bars(data, canvas);
		return;
	}
};

