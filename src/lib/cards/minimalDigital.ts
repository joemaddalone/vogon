import { pint } from "./helpers/pint";
import { calculateFontSizes } from "./helpers/calculateFontSizes";
import { measureText } from "./helpers/measureText";
import { fitText } from "./helpers/fitText";
import { fontManager } from "./helpers/fontManager";

export const minimalDigital = async (
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

  if (!ctx) return;
  ctx.save();
  window.devicePixelRatio = 2;
  const fontFamily = fontManager.getFontFamily('orbitron');
  ctx.font = `bold ${fontFamily}`;
  const fontSizes = calculateFontSizes(width, height);
  ctx.font = `bold ${fontSizes.xl}px ${fontFamily}`;

  const episodeText = `S${seasonNumber.toString().padStart(2, "0")}E${episodeNumber.toString().padStart(2, "0")}`;
  ctx.font = `bold ${fontSizes.md}px ${fontFamily}`;
  ctx.fillStyle = "white";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  const metaMeasure = measureText(episodeText, ctx);
  const metaPadding = pint(fontSizes.md * 0.5);
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(
    metaPadding,
    metaPadding,
    metaMeasure.width + metaPadding * 2,
    metaMeasure.height + metaPadding * 2
  );

  ctx.fillStyle = "white";
  ctx.fillText(episodeText, metaPadding * 2, metaPadding * 2);

  const titleAreaHeight = pint(height * 0.4);
  const titleY = height - titleAreaHeight - pint(height * 0.05);

  ctx.font = `bold ${fontSizes.md}px ${fontFamily}`;
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  fitText(title.toUpperCase(), width - pint(width * 0.25), pint(width / 2), titleY + titleAreaHeight / 2, ctx, true, "rgba(0, 0, 0, 0.3)");
  ctx.restore();
};