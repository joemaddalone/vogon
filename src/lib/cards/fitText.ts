export const fitText = (text: string, width: number, ctx: CanvasRenderingContext2D): string[] => {
	const testWidth = ctx.measureText(text)
	if(testWidth.width < width) {
		return [text];
	}
  const splitText = text.split(" ");
	// split splitText into two arrays, the first array is the first part of the text, the second array is the second part of the text
	const center = Math.floor(splitText.length / 2);
  const firstPart = splitText.slice(0, center);
  const secondPart = splitText.slice(center);
  return [firstPart.join(" "), secondPart.join(" ")];
};