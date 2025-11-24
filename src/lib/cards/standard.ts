import { calculateFontSizes } from "./helpers/calculateFontSizes";
import { fitText } from "./helpers/fitText";
import { measureText } from "./helpers/measureText";
import { pint } from "./helpers/pint";
import { fontManager } from "./helpers/fontManager";

export const standard = async (
  data: {
    episodeTitle: string;
    seasonNumber: number;
    episodeNumber: number;
  },
  canvas: HTMLCanvasElement
) => {
  const title = data.episodeTitle.trim();
  const seasonNumber = data.seasonNumber;
  const episodeNumber = data.episodeNumber;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const bottomBuffer = height * 0.01;
  const halfWidth = pint(width / 2);
  if (!ctx) return;
  window.devicePixelRatio = 2;
  const fontSizes = calculateFontSizes(width, height);

  ctx.shadowColor = "rgba(0, 0, 0, 1)"; // Semi-transparent black shadow
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;

  const fontFamily = fontManager.getFontFamily('bebasNeue');
  const labelFont = `${fontSizes.xs}px ${fontFamily}`;
  const valueFont = `${fontSizes.md}px ${fontFamily}`;

  ctx.font = `${fontSizes.sm}px ${fontFamily}`;
  const testHeight = measureText("HELLOW WORLD", ctx).height + 1;

  ctx.fillStyle = "black";
  const boxHeight = testHeight * 3 + bottomBuffer;
  ctx.fillRect(
    0,
    height - boxHeight - bottomBuffer,
    width,
    boxHeight + bottomBuffer
  );

  const dataLabel = (
    ctx: CanvasRenderingContext2D,
    label: string,
    value: string,
    x: (labelWidth: number) => number
  ) => {
    ctx.fillStyle = "white";
    ctx.font = labelFont;
    const labelTextWidth = measureText(label, ctx).width;
    const labelCenter = x(labelTextWidth);
    ctx.textAlign = "center";
    ctx.fillText(label, labelCenter, height - fontSizes.lg);
    ctx.font = valueFont;
    ctx.fillText(`${value || ""}`, labelCenter, height - (bottomBuffer * 3));
  };

  dataLabel(ctx, "Season", seasonNumber.toString(), (labelWidth: number) =>
    pint(labelWidth / 2)
  );
  dataLabel(
    ctx,
    "Episode",
    episodeNumber.toString(),
    (labelWidth: number) => width - pint(labelWidth / 2)
  );

  ctx.font = `${fontSizes.md}px ${fontFamily}`;
  const lines = fitText(title, width - pint(width * 0.4), halfWidth, height - boxHeight + testHeight + bottomBuffer, ctx, false);

  if (lines.length === 2) {
    ctx.fillText(
      lines[0].text,
      halfWidth,
      height - boxHeight + testHeight + bottomBuffer
    );
    ctx.fillText(lines[1].text, halfWidth, height - bottomBuffer - (lines[1].height / 2));
  } else {
    ctx.fillText(lines[0].text, halfWidth, height - pint(boxHeight / 3));
  }
};
