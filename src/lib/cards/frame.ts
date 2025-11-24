import { pint } from "./helpers/pint";
import { calculateFontSizes } from "./helpers/calculateFontSizes";
import { fitText } from "./helpers/fitText";
import { fontManager } from "./helpers/fontManager";

export const frame = async (
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
  const frameBuffer = pint(height * 0.05);
  const halfWidth = pint(width / 2);
  if (!ctx) return;
  window.devicePixelRatio = 2;
  const fontFamily = fontManager.getFontFamily('teko');


  ctx.font = `bold ${fontFamily}`;
  const fontSizes = calculateFontSizes(width, height);
  ctx.font = `bold ${fontSizes.lg}px ${fontFamily}`;



  canvas.style.letterSpacing = "0.025em";


  ctx.strokeStyle = "#0008";
  ctx.lineWidth = 20;
  ctx.strokeRect(0, 0, width, height);
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.shadowColor = "rgba(0, 0, 0, 1)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  const [firstLine] = fitText(title, width - pint(width * 0.25), halfWidth, frameBuffer * 1.2, ctx, true);

  const sX = width / 2;
  const sY = height - frameBuffer;
  const metaText = `Season ${seasonNumber.toString()} : Episode ${episodeNumber.toString()}`;
  const [metaLine] = fitText(metaText, width - pint(width * 0.25), sX, sY, ctx, true);


  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;
  const p2 = new Path2D(
    `M ${frameBuffer} ${frameBuffer}
    V ${height - frameBuffer}
    H ${halfWidth - (metaLine.width / 2) - frameBuffer}
    M ${halfWidth + (metaLine.width / 2) + frameBuffer} ${height - frameBuffer}
    H ${width - frameBuffer}
    V ${frameBuffer}
    M ${frameBuffer} ${frameBuffer}
    H ${halfWidth - (firstLine.width / 2) - frameBuffer}
    M ${halfWidth + (firstLine.width / 2) + frameBuffer} ${frameBuffer}
    H ${width - frameBuffer}
    `
  );
  ctx.stroke(p2);



};;
