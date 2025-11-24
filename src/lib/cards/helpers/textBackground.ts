import { measureText } from "./measureText";
import { pint } from "./pint";

export const textBackground = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, bg: string = "rgba(0, 0, 0, 0.25)") => {
	ctx.save();
	const measure = measureText(text, ctx);
	const padding = pint(measure.height * 0.5);
	ctx.fillStyle = bg;
	ctx.fillRect(
		x - measure.width / 2 - padding,
		y - measure.height / 2 - padding,
		measure.width + padding * 2,
		measure.height + padding * 2
	);
	ctx.restore();
};