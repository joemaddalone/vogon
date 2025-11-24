import { pint } from "./pint";

export const measureText = (text: string, ctx: CanvasRenderingContext2D): { height: number, width: number } => {
  const metrics = ctx.measureText(text);
	return {
		height: pint(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent),
		width: pint(metrics.width),
	}
};