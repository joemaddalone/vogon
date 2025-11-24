import { measureText } from "./measureText";
import { pint } from "./pint";
import { textBackground } from "./textBackground";

export const fitText = (text: string, width: number, x: number, y: number, ctx: CanvasRenderingContext2D, draw: boolean = false, background: string = ''): { width: number, height: number, text: string; }[] => {
	ctx.save();
	const { width: testWidth, height: testHeight } = measureText(text, ctx);
	let lines = [];
	if (testWidth < width) {
		lines = [text];
	} else {
		const splitText = text.split(" ");
		// split splitText into two arrays, the first array is the first part of the text, the second array is the second part of the text
		const center = Math.floor(splitText.length / 2);
		const firstPart = splitText.slice(0, center);
		const secondPart = splitText.slice(center);
		lines = [firstPart.join(" "), secondPart.join(" ")];
	}

	if (draw) {
		if (lines.length === 2) {
			if (background) {
				textBackground(ctx, lines[0], x, y, background);
				textBackground(ctx, lines[1], x, y + testHeight + pint((testHeight * 0.3)), background);
			}
			ctx.fillText(
				lines[0],
				x,
				y
			);
			ctx.fillText(lines[1], x, y + testHeight + pint((testHeight * 0.3)));
		} else {
			if (background) {
				textBackground(ctx, lines[0], x, y, background);
			}
			ctx.fillText(lines[0], x, y);
		}
	}
	ctx.restore();
	return lines.map(text => ({ ...measureText(text, ctx), text }));
};