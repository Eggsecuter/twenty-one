import { child, width, percentage, padding, rem, display, flexDirection, gap, position, marginRight, borderRadius, border, px, background, color, fontFamily, fontSize, before, content, left, transform, translateX, paddingInline, flexWrap, top, firstOfType, justifyContent } from "@acryps/style";
import { colorPrimary, colorBackgroundDimmed } from "../../../../global.style";
import { playerStyle } from "../../../player/index.style";

export const statsStyle = () => child('ui-stats') (
	display('flex'),
	flexDirection('column'),
	justifyContent('space-between'),
	gap(rem(1)),

	width(percentage(20)),
	padding(rem(2)),

	child('ui-competitor-stats') (
		display('flex'),
		flexDirection('column'),
		gap(rem(1)),

		firstOfType() (
			flexDirection('column-reverse')
		),

		child('ui-bet') (
			position('relative'),

			display('block'),
			marginRight('auto'),
			padding(rem(1)),

			borderRadius(rem(0.25)),
			border(px(1), 'solid', colorPrimary),

			background(colorBackgroundDimmed),
			color(colorPrimary),

			fontFamily('monospace'),
			fontSize(rem(1.5)),

			before() (
				content('Bet'),
				position('absolute'),
				top(rem(-0.5)),
				left(percentage(50)),
				transform(translateX(percentage(-50))),

				paddingInline(rem(0.5)),
				borderRadius(rem(0.25)),

				background(colorPrimary),
				color(colorBackgroundDimmed),

				fontSize(rem(1))
			)
		),

		child('ui-hearts') (
			display('flex'),
			flexWrap('wrap'),

			child('ui-icon') (
				color(colorPrimary)
			)
		),

		playerStyle()
	)
);
