import { attribute, background, border, borderBottom, calc, child, color, cursor, display, flexDirection, gap, height, hover, justifyContent, margin, marginBottom, minWidth, padding, percentage, position, px, rem, right, textAlign, top, whiteSpace, zIndex } from "@acryps/style";
import { action, colorBackgroundDimmed, colorPrimary, colorPrimaryDimmed } from "../../global.style";

export const menuStyle = () => child('ui-menu') (
	position('fixed'),
	top(0),
	right(0),

	display('flex'),
	flexDirection('column'),
	gap(rem(0.5)),
	margin(rem(0.5)),

	zIndex(100),

	child('ui-tabs') (
		display('flex'),
		justifyContent('end'),
		gap(rem(0.5)),

		child('ui-tab') (
			display('block'),
			height(rem(2)),
			padding(rem(0.5)),
			border(px(1), 'solid', 'transparent'),

			cursor('pointer'),
			zIndex(1),

			hover() (
				color(colorPrimary)
			),

			attribute('ui-active') (
				background(colorBackgroundDimmed),
				border(px(1), 'solid', colorPrimaryDimmed),
				borderBottom('none'),

				child('ui-icon') (
					color(colorPrimary)
				)
			)
		)
	),

	child('ui-dialog') (
		position('absolute'),
		right(0),
		top(calc(percentage(100).subtract(px(1)).toValueString())),

		display('block'),
		minWidth(rem(10)),
		padding(rem(1)),

		background(colorBackgroundDimmed),
		border(px(1), 'solid', colorPrimaryDimmed),

		child('ui-dialog-leave') (
			display('block'),

			child('ui-text') (
				display('block'),
				marginBottom(rem(1)),

				color(colorPrimary),
				textAlign('end'),
				whiteSpace('nowrap')
			),

			child('ui-action-group') (
				display('flex'),
				gap(rem(0.5)),
				justifyContent('end'),

				child('ui-action') (
					action()
				)
			)
		)
	)
);
