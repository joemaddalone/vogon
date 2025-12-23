import { pint } from "./helpers/pint";
import { calculateFontSizes } from "./helpers/calculateFontSizes";
import { fitText } from "./helpers/fitText";
import { fontManager } from "./helpers/fontManager";
import Path from "@joemaddalone/path";

export const bars = async (
	data: {
		episodeTitle: string;
		seasonNumber: number;
		episodeNumber: number;
		image?: string;
	},
	canvas: HTMLCanvasElement
) => {
	const title = data.episodeTitle.trim();
	const seasonNumber = data.seasonNumber;
	const episodeNumber = data.episodeNumber;
	const ctx = canvas.getContext("2d");
	const width = canvas.width;
	const height = canvas.height;

	if (!ctx) return;

	window.devicePixelRatio = 2;

	const bg = '#fff';
	const fg = '#000';


	ctx.save();
	const p = new Path();
	const rectCount = 8;
	const rectWidth = pint(width / 8.25);
	const totalGapWidth = width - (rectWidth * rectCount);
	const gap = pint(totalGapWidth / (rectCount + 1));
	const ymargin = height * 0.015;

	for (let i = 0; i < rectCount; i++) {
		const cx = gap + (rectWidth / 2) + i * (rectWidth + gap);
		const cy = height / 2 + (i % 2 === 0 ? ymargin : -ymargin);
		p.rect(rectWidth, height * 0.75, cx, cy);
	}


	const region = new Path2D(p.toString());

	// Use destination-in to clip the existing image to the path
	ctx.globalCompositeOperation = "destination-in";
	ctx.fill(region);

	// Fill the remaining transparent area with white
	ctx.globalCompositeOperation = "destination-over";
	ctx.fillStyle = bg;
	ctx.fillRect(0, 0, width, height);

	// Reset composite operation for further drawing
	ctx.globalCompositeOperation = "source-over";


	const fontFamily = fontManager.getFontFamily('teko');
	ctx.font = `bold ${fontFamily}`;
	const fontSizes = calculateFontSizes(width, height);
	ctx.font = `${fontSizes.md}px ${fontFamily}`;

	const episodeText = `Season ${seasonNumber.toString().padStart(2, "0")} / Episode ${episodeNumber.toString().padStart(2, "0")}`;
	ctx.fillStyle = fg;
	ctx.textAlign = "left";
	ctx.textBaseline = "top";

	ctx.fillText(episodeText, 5, 5);

	ctx.textAlign = "left";
	ctx.textBaseline = "middle";
	const titleX = pint(width * 0.01);
	fitText(title.toUpperCase(), width - titleX, titleX, height - pint(fontSizes.md / 2), ctx, true);
	ctx.restore();
};