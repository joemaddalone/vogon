import { calculateFontSizes } from "./calculateFontSizes";
import { fitText } from "./fitText";

const textHeight = (text: string, ctx: CanvasRenderingContext2D): number => {
  const metrics = ctx.measureText(text);
  // return metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
  return metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
};

const pint = (value: number): number => parseInt(value.toFixed(0));

export const standard = (
  data: {
    episodeTitle: string;
    seasonNumber: number;
    episodeNumber: number;
  },
  canvas: HTMLCanvasElement
) => {
  const title = data.episodeTitle.toUpperCase().trim();
  const seasonNumber = data.seasonNumber;
  const episodeNumber = data.episodeNumber;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const bottomBuffer = height * 0.1;
	const halfWidth = pint(width / 2);
  if (!ctx) return;
	window.devicePixelRatio=2;
  const fontSizes = calculateFontSizes(width, height);

  ctx.shadowColor = "rgba(0, 0, 0, 1)"; // Semi-transparent black shadow
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;


  // draw rectangle at the bottom of the image

  const labelFont = `bold ${fontSizes.xs}px sans-serif`;
  const valueFont = `bold ${fontSizes.md}px sans-serif`;

	ctx.font = `bold ${fontSizes.sm}px sans-serif`;
	const testHeight = pint(textHeight('HELLOW WORLD', ctx)) + 1;

  ctx.fillStyle = "black";
	const boxHeight = (testHeight * 3) + bottomBuffer;
  ctx.fillRect(0, height - boxHeight - bottomBuffer, width, boxHeight + bottomBuffer);

  const dataLabel = (
    ctx: CanvasRenderingContext2D,
    label: string,
    value: string,
    x: (labelWidth: number) => number
  ) => {
    ctx.fillStyle = "white";
    ctx.font = labelFont;
    const labelTextWidth = pint(ctx.measureText(label).width);
    const labelCenter = x(labelTextWidth);
    ctx.textAlign = "center";
    ctx.fillText(label, labelCenter, height - fontSizes.lg);
    ctx.font = valueFont;
    ctx.fillText(`${value || ""}`, labelCenter, height - bottomBuffer);
  };

  dataLabel(
    ctx,
    "Season",
    seasonNumber.toString(),
    (labelWidth: number) => pint(10 + labelWidth / 2)
  );
  dataLabel(
    ctx,
    "Episode",
    episodeNumber.toString(),
    (labelWidth: number) => width - pint(10 + (labelWidth / 2))
  );

  ctx.font = `bold ${fontSizes.sm}px sans-serif`;
  const lines = fitText(title, width - pint((width * 0.4)), ctx);
  if (lines.length === 2) {
    ctx.fillText(lines[0], halfWidth, (height - boxHeight) + testHeight + bottomBuffer);
    ctx.fillText(lines[1], halfWidth, height - bottomBuffer);
  } else {
    ctx.fillText(title, halfWidth, height - pint(boxHeight/3));
  }
};
