
export const frame = (
	data: {
		episodeTitle: string;
		seasonNumber: number;
		episodeNumber: number;
	},
	canvas: HTMLCanvasElement
) => {
  const seasonNumber = data.seasonNumber?.toString().padStart(2, "0") || "";
  const episodeNumber = data.episodeNumber?.toString().padStart(2, "0") || "";
  const ctext = `${seasonNumber}/${episodeNumber}`;
	const ctx = canvas.getContext("2d");
	if (!ctx) return;
	const width = canvas.width;
	const height = canvas.height;
  const carr = ctext.split("").join(String.fromCharCode(8202));

  canvas.style.letterSpacing = "0.025em";
  // draw rectangle around the image
  ctx.strokeStyle = "white";
  ctx.strokeRect(10, 10, width - 20, height - 20);
  // draw text in the center of the image
  ctx.fillStyle = "white";
  ctx.font = "16px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "25px sans-serif";
  ctx.fillText(carr, 50, height - 50, 100);
};