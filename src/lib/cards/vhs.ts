import { pint } from "./helpers/pint";
import { calculateFontSizes } from "./helpers/calculateFontSizes";
import { fitText } from "./helpers/fitText";
import { fontManager } from "./helpers/fontManager";


function drawVignette(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, color = 'rgba(0, 0, 0, 1)') {
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  const innerRadius = Math.min(canvasWidth, canvasHeight) * 0.3;
  const outerRadius = Math.max(canvasWidth, canvasHeight) * 0.7;
  const gradient = ctx.createRadialGradient(centerX, centerY, innerRadius, centerX, centerY, outerRadius);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, color);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

export const vhs = async (
  data: {
    episodeTitle: string;
    seasonNumber: number;
    episodeNumber: number;
  },
  canvas: HTMLCanvasElement
) => {
  const title = data.episodeTitle.trim();
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  if (!ctx) return;

  window.devicePixelRatio = 2;
  const fontFamily = fontManager.getFontFamily('cormorantGaramond');
  ctx.font = `bold ${fontFamily}`;
  const fontSizes = calculateFontSizes(width, height);

  ctx.save();
  drawVignette(ctx, width, height, 'rgba(0, 0, 0, 1)');
  ctx.globalAlpha = 0.25;
  ctx.strokeStyle = '#0008';
  ctx.lineWidth = 2;

  for (let y = 0; y < height; y += 5) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;


  const titleAreaHeight = pint(height * 0.4);
  const titleY = height - titleAreaHeight - pint(height * 0.05);

  ctx.font = `bold ${fontSizes.xl}px ${fontFamily}`;
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";


  fitText(title.toUpperCase(), width - pint(width * 0.25), pint(width / 2), titleY + titleAreaHeight / 2, ctx, true, "rgba(0, 0, 0, 0.5)");

  ctx.restore();
};