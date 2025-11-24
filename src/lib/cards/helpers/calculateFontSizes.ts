export const calculateFontSizes = (
	width: number,
	height: number,
) => {
	const fontSize = Math.min(width / 12, height / 12);
	const unit = fontSize / 10
	const roundFontSize = (n: number) => parseInt((n / 4).toFixed(0)) * 4;
	// const commonFontSize = roundFontSize(fontSize);
	const xs = roundFontSize(fontSize - unit * 3);
	const sm = roundFontSize(fontSize - unit * 2);
	const md = roundFontSize(fontSize);
	const lg = roundFontSize(fontSize + unit * 2);
	const xl = roundFontSize(fontSize + unit * 3);
	const xxl = roundFontSize(fontSize + unit * 4);
	const xxxl = roundFontSize(fontSize + unit * 5);

	const fontSizes = {
		xs,
		sm,
		md,
		lg,
		xl,
		xxl,
		xxxl,
	};
	return fontSizes;
};