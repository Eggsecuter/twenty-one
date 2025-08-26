import { alignItems, aspectRatio, borderRadius, child, color, cursor, display, flexDirection, fontSize, fontWeight, gap, height, hover, marginInline, overflow, padding, percentage, ratio, rem, userSelect } from "@acryps/style";
import { colorPrimary, colorPrimaryDimmed, flex } from "../../global.style";

export const configurePlayerStyle = () => child('ui-configure-player') (
	display('flex'),
	flexDirection('column'),
	gap(rem(2)),
	flex(1),

	child('input') (
		fontSize(rem(1.1))
	),

	child('ui-character') (
		display('flex'),
		alignItems('center'),
		gap(rem(2)),
		marginInline('auto'),

		child('ui-action') (
			display('block'),
			padding(rem(1)),

			color(colorPrimaryDimmed),

			fontSize(rem(2)),
			fontWeight('bold'),

			cursor('pointer'),
			userSelect('none'),

			hover() (
				color(colorPrimary)
			)
		),

		child('ui-avatar') (
			display('block'),
			height(rem(15)),
			aspectRatio(ratio(1, 1)),

			borderRadius(percentage(50)),
			overflow('hidden'),

			child('img') (
				display('block'),
				height(percentage(100))
			)
		)
	)
);
