import { seconds, child, display, alignItems, backdropFilter, background, border, borderRadius, bottom, color, deg, flexDirection, fontSize, height, inset, justifyContent, margin, marginBottom, marginTop, padding, percentage, position, px, rem, right, rotate, scale, textAlign, transform, width, zIndex, blur, attribute, not, Keyframes, opacity, gap } from "@acryps/style";
import { colorPrimaryDimmed, colorPrimary, colorBackgroundDimmed, action, panelBoxShadow } from "../../../global.style";
import { menuStyle } from "../../menu/index.style";
import { statsStyle } from "./stats/index.style";
import { boardStyle } from "./board/index.style";

export const roundAnimationDuration = seconds(3);

const roundAnimation = new Keyframes('ui-announce')
	.addKeyframe(percentage(0), transform(scale(15)))
	.addKeyframe(percentage(20), transform(scale(1)), opacity(1))
	.addKeyframe(percentage(100), opacity(0));

const headerHeight = rem(5);

export const gameStyle = () => child('ui-game') (
	display('flex'),
	flexDirection('column'),
	width(percentage(100)),
	height(percentage(100)),

	child('ui-header') (
		display('flex'),
		height(headerHeight),
		justifyContent('space-between'),

		child('ui-round') (
			display('block'),
			padding(rem(1)),

			attribute('ui-announce') (
				roundAnimation.animate(roundAnimationDuration, 'ease-in'),

				position('fixed'),
				inset(0),

				display('flex'),
				justifyContent('center'),
				alignItems('center'),
				gap(rem(1)),

				background(colorBackgroundDimmed),
				fontSize(rem(3)),
				zIndex(100)
			),

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
		height(percentage(100).subtract(headerHeight)),

		statsStyle(),
		boardStyle()
	),

	child('ui-result') (
		not([attribute('ui-active')]) (
			display('none')
		),

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
