import { child, color, display, fontSize, padding, rem } from "@acryps/style";
import { colorPrimary } from "../global.style";

export const guideStyle = () => child('ui-guide') (
	display('block'),
	padding(rem(2)),

	color(colorPrimary),
	fontSize(rem(2))
);
