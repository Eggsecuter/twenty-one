import { alignItems, attribute, background, borderBottomLeftRadius, borderBottomRightRadius, borderColor, borderLeftWidth, borderRadius, borderTopLeftRadius, borderTopRightRadius, child, color, cursor, display, flexDirection, fontSize, fr, gap, gridTemplateColumns, justifyContent, letterSpacing, maxHeight, maxWidth, opacity, overflowY, padding, paddingInline, percentage, pointerEvents, rem, rowGap, seconds, textTransform, userSelect } from "@acryps/style";
import { action, colorBackground, colorBackgroundDimmed, colorError, flex, panelBoxShadow, shakeAnimation } from "../global.style";
import { configurePlayerStyle } from "../shared/configure-player/index.style";

export const homeStyle = () => child('ui-home') (
	display('flex'),
	justifyContent('center'),
	alignItems('center'),

	child('ui-introduction') (
		display('flex'),
		maxHeight(percentage(80)),
		maxWidth(rem(50)),
		padding(rem(2)),

		flex(1),
		flexDirection('column'),
		gap(rem(2)),

		borderRadius(rem(2)),
		background(colorBackgroundDimmed),

		panelBoxShadow,
		overflowY('auto'),

		configurePlayerStyle(),

		child('ui-game') (
			display('flex'),
			padding(rem(2)),

			gap(rem(2)),
			flexDirection('column'),
			flex(1),

			borderRadius(rem(2)),
			background(colorBackground),

			attribute('ui-disabled') (
				userSelect('none'),

				opacity(0.5),
				cursor('not-allowed'),

				child('*') (
					pointerEvents('none')
				)
			),

			child('ui-join') (
				display('grid'),
				gridTemplateColumns(fr(1), 'auto'),
				rowGap(rem(0.5)),

				child('input') (
					textTransform('uppercase'),
					letterSpacing(rem(0.5)),

					borderTopRightRadius(0),
					borderBottomRightRadius(0),

					attribute('ui-invalid') (
						borderColor(colorError),

						shakeAnimation.animate(seconds(0.3), 'linear')
					)
				),

				child('ui-action') (
					action(),

					borderTopLeftRadius(0),
					borderBottomLeftRadius(0),
					borderLeftWidth(0)
				),

				child('ui-join-error') (
					display('block'),
					paddingInline(rem(1)),

					color(colorError),
					fontSize(rem(0.8))
				)
			),

			child('ui-create') (
				display('block'),

				child('ui-action') (
					action()
				)
			)
		)
	)
);
