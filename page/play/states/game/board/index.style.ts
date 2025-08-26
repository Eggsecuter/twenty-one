import { alignItems, aspectRatio, attribute, backdropFilter, background, blur, border, borderRadius, bottom, child, color, deg, display, flexDirection, fontSize, gap, height, inset, justifyContent, Keyframes, left, marginBlock, marginBottom, marginInline, marginRight, maxWidth, not, objectFit, opacity, overflow, padding, paddingBlock, paddingInline, percentage, pointerEvents, position, px, ratio, rem, right, rotate, scale, seconds, textAlign, transform, translateX, vw, width, zIndex } from "@acryps/style";
import { colorBackgroundDimmed, colorPrimary, colorCard, action, flex, panelBoxShadow, colorPrimaryDimmed } from "../../../../global.style";

export const dealCardAnimationDuration = seconds(0.5);

const trumpCardScale = scale(1.25);

const dealCardAnimation = new Keyframes('ui-deal')
	.addKeyframe('from', transform(translateX(vw(100)), rotate(deg(Math.random() * 30 + 60))))
	.addKeyframe('to', transform(translateX(0), rotate(0)));

export const boardStyle = () => child('ui-board') (
	padding(rem(2)),
	flex(1),

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
			alignItems('center'),
			gap(rem(1)),

			child('ui-card') (
				display('block'),
				maxWidth(percentage(12)),
				aspectRatio(ratio(1, 1.4)),

				border(px(5), 'solid', colorPrimary),
				borderRadius(rem(0.5)),

				background(colorCard),
				overflow('hidden'),

				attribute('ui-trump-card') (
					height(percentage(50)),
					aspectRatio(ratio(1, 1)),

					child('img') (
						transform(trumpCardScale)
					)
				),

				attribute('ui-deal') (
					dealCardAnimation.animate(dealCardAnimationDuration, 'ease-out')
				),

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
			position('fixed'),
			bottom(rem(1)),
			left(0),
			right(0),

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
		),

		child('ui-trump-card-dialog') (
			not([attribute('ui-active')]) (
				display('none')
			),

			position('fixed'),
			inset(0),
			zIndex(100),

			backdropFilter(blur(px(3))),

			display('flex'),
			justifyContent('center'),
			alignItems('center'),

			child('ui-trump-card') (
				display('block'),
				width(percentage(80)),
				maxWidth(rem(30)),
				padding(rem(2)),

				borderRadius(rem(2)),
				background(colorBackgroundDimmed),

				panelBoxShadow,

				textAlign('center'),

				child('ui-title') (
					display('block'),

					color(colorPrimary),
					fontSize(rem(2))
				),

				child('ui-icon') (
					display('block'),
					width(percentage(50)),
					marginBlock(rem(2)),
					marginInline('auto'),

					border(px(5), 'solid', colorPrimary),
					borderRadius(rem(0.5)),

					overflow('hidden'),

					child('img') (
						display('block'),
						width(percentage(100)),
						height(percentage(100)),
						objectFit('contain'),

						transform(trumpCardScale)
					)
				),

				child('ui-name') (
					display('block'),
					marginBottom(rem(0.5)),

					color(colorPrimary),
					fontSize(rem(1.5))
				),

				child('ui-description') (
					display('block'),

					color(colorPrimaryDimmed)
				)
			)
		)
	)
);
