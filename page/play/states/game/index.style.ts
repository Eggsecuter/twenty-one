import { child, display, flexDirection, width, percentage, height, justifyContent, padding, rem, color, flexGrow, gap, margin, borderRadius, background, fontSize, flexWrap, position, marginRight, border, fontFamily, content, left, transform, maxHeight, maxWidth, aspectRatio, overflow, objectFit, opacity, pointerEvents, attribute, inset, alignItems, backdropFilter, zIndex, textAlign, marginBottom, bottom, right, marginTop, marginInline, paddingBlock, paddingInline, px, top, translateX, ratio, blur, rotate, deg, scale, nthOfType, before, flexBasis, flexShrink, seconds, is } from "@acryps/style";
import { colorPrimaryDimmed, colorPrimary, colorBackgroundDimmed, colorCard, action, panelBoxShadow } from "../../../global.style";
import { menuStyle } from "../../menu/index.style";
import { playerStyle } from "../../player/index.style";

export const roundAnimationDuration = seconds(2);
export const dealCardAnimationDuration = seconds(0.5);

export const gameStyle = () => child('ui-game') (
	display('flex'),
	flexDirection('column'),
	width(percentage(100)),
	height(percentage(100)),

	child('ui-header') (
		display('flex'),
		justifyContent('space-between'),

		child('ui-round') (
			display('block'),
			padding(rem(1)),

			child('ui-label') (
				display('block'),
				color(colorPrimaryDimmed)
			),

			child('ui-value') (
				display('block'),
				color(colorPrimary)
			)
		),

		menuStyle()
	),

	child('ui-main') (
		display('flex'),
		flexGrow(1),
		flexShrink(1),
		flexBasis(0),

		child('*') (
			is(['ui-stats'], ['ui-board']) (
				display('flex'),
				flexDirection('column'),
				justifyContent('space-between'),
				gap(rem(1)),

				child('*') (
					nthOfType(1) (
						flexDirection('column-reverse')
					)
				)
			)
		),

		child('ui-stats') (
			width(percentage(20)),
			padding(rem(2)),

			child('ui-competitor-stats') (
				display('flex'),
				flexDirection('column'),
				gap(rem(1)),

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
		),

		child('ui-board') (
			padding(rem(2)),

			flexGrow(1),
			flexShrink(1),
			flexBasis(0),

			child('ui-information') (
				display('flex'),
				justifyContent('center'),
				alignItems('center'),
				height(rem(3)),

				child('ui-narration') (
					display('block'),
					paddingBlock(rem(0.5)),
					paddingInline(rem(1)),

					borderRadius(rem(0.25)),
					background(colorBackgroundDimmed),
					color(colorPrimary),

					fontSize(rem(1.2))
				)
			),

			child('ui-competitor-board') (
				display('flex'),
				flexDirection('column'),
				gap(rem(1)),

				child('ui-cards') (
					display('flex'),
					gap(rem(1)),

					child('ui-card') (
						display('block'),
						maxHeight(percentage(90)),
						maxWidth(percentage(10)),
						aspectRatio(ratio(1, 1.4)),

						border(px(5), 'solid', colorPrimary),
						borderRadius(rem(0.5)),

						background(colorCard),
						overflow('hidden'),

						child('img') (
							display('block'),
							width(percentage(100)),
							height(percentage(100)),

							objectFit('cover')
						)
					)
				),

				child('ui-sum') (
					display('block'),
					marginRight('auto'),
					padding(rem(0.5)),

					border(px(1), 'solid', colorPrimary),
					borderRadius(rem(2)),

					color(colorPrimary),
					background(colorBackgroundDimmed)
				),

				child('ui-actions') (
					display('flex'),
					justifyContent('center'),
					gap(rem(1)),

					opacity(0),
					pointerEvents('none'),

					attribute('ui-active') (
						opacity(1),
						pointerEvents('all')
					),

					child('ui-action') (
						action()
					)
				)
			)
		)
	),

	child('ui-result') (
		position('fixed'),
		inset(0),

		display('flex'),
		justifyContent('center'),
		alignItems('center'),

		backdropFilter(blur(px(3))),
		zIndex(100),

		child('ui-panel') (
			display('block'),
			margin(rem(2)),
			padding(rem(3)),

			color(colorPrimary),
			background(colorBackgroundDimmed),
			borderRadius(rem(2)),

			panelBoxShadow,
			textAlign('center'),

			child('ui-title') (
				display('block'),
				marginBottom(rem(2)),

				fontSize(rem(2.5))
			),

			child('ui-winner') (
				display('flex'),
				flexDirection('column'),
				alignItems('center'),
				marginBottom(rem(5)),

				child('ui-avatar') (
					position('relative'),

					display('block'),
					marginBottom(rem(2)),

					child('img') (
						display('block'),
						width(rem(8)),

						borderRadius(percentage(50)),
						border(px(5), 'solid', colorPrimaryDimmed)
					),

					child('ui-icon') (
						position('absolute'),
						bottom(percentage(5)),
						right(0),

						transform(rotate(deg(20)), scale(3))
					)
				),

				child('ui-name') (
					display('block'),
					marginBottom(rem(0.5)),

					fontSize(rem(1.2))
				),

				child('ui-rounds-won') (
					display('block'),
					color(colorPrimaryDimmed)
				)
			),

			child('ui-action') (
				action(),

				marginTop('auto')
			)
		)
	)
);
