import { Variable, Deg, seconds, rem, scale, Keyframes, transform, translateX, vw, rotate, deg, percentage, opacity, rotate3d, rotateY, px, position, border, borderRadius, background, transformStyle, child, inset, display, width, height, overflow, objectFit, backfaceVisibility, attribute, flexDirection, padding, justifyContent, alignItems, paddingBlock, paddingInline, color, fontSize, gap, firstOfType, perspective, aspectRatio, ratio, maxWidth, maxHeight, marginRight, bottom, left, right, pointerEvents, not, zIndex, backdropFilter, textAlign, marginBlock, marginInline, rotateX, marginBottom, blur, Percentage, descendant, flex } from "@acryps/style";
import { colorBackgroundDimmed, colorPrimary, colorCard, action, panelBoxShadow, colorPrimaryDimmed } from "../../../../global.style";

export const inspectTrumpCardTiltX = new Variable<Deg>('ui-inspect-trump-card-tilt-x');
export const inspectTrumpCardTiltY = new Variable<Deg>('ui-inspect-trump-card-tilt-y');

export const dealCardDuration = seconds(0.5);
const dealCardAnimation = new Keyframes('ui-deal-card')
.addKeyframe('from', transform(translateX(vw(100)), rotate(deg(Math.random() * 30 + 60))))
.addKeyframe('to', transform(translateX(0), rotate(0)));

export const activateTrumpCardDuration = seconds(1);
const activateTrumpCardAnimation = new Keyframes('ui-activate-trump-card')
	.addKeyframe(percentage(0), transform(scale(10)), opacity(0))
	.addKeyframe(percentage(25), transform(scale(1)), opacity(1))
	.addKeyframe(percentage(30), transform(rotate3d(1, 1, 0, deg(10))))
	.addKeyframe(percentage(35), transform(rotate3d(1, -1, 0, deg(10))))
	.addKeyframe(percentage(40), transform(rotate3d(-1, -1, 0, deg(10))))
	.addKeyframe(percentage(45), transform(rotate3d(-1, 1, 0, deg(10))))
	.addKeyframe(percentage(50), transform(rotate3d(1, 1, 0, deg(10))))
	.addKeyframe(percentage(55), transform(rotate3d(1, -1, 0, deg(10))))
	.addKeyframe(percentage(60), transform(rotate3d(-1, -1, 0, deg(10))))
	.addKeyframe(percentage(65), transform(rotate3d(-1, 1, 0, deg(10))))
	.addKeyframe(percentage(70), transform(rotate3d(1, 1, 0, deg(10))))
	.addKeyframe(percentage(75), transform(rotate3d(1, -1, 0, deg(10))))
	.addKeyframe(percentage(80), transform(rotate3d(-1, -1, 0, deg(10))))
	.addKeyframe(percentage(90), transform(rotate3d(-1, 1, 0, deg(10))))
	.addKeyframe(percentage(100), transform(rotate(0)));

export const flipCardDuration = seconds(0.8);
const flipCardAnimation = new Keyframes('ui-flip-card')
	.addKeyframe('from', transform(rotateY(deg(180))))
	.addKeyframe('to', transform(rotateY(deg(0))));

const boardPerspective = perspective(px(500));
const informationHeight = rem(3);
const trumpCardImageScale = scale(1.25);

const playingCards = (heightPercentage: Percentage) => [
	boardPerspective,

	display('flex'),
	height(heightPercentage),
	alignItems('center'),
	gap(rem(1)),

	child('ui-card') (
		position('relative'),

		display('block'),
		maxWidth(percentage(12)),
		maxHeight(percentage(100)),
		aspectRatio(ratio(1, 1.4)),

		flex(1),

		transformStyle('preserve-3d'),

		attribute('ui-trump') (
			aspectRatio(ratio(1, 1)),

			descendant('img') (
				transform(trumpCardImageScale)
			)
		),

		attribute('ui-deal') (
			dealCardAnimation.animate(dealCardDuration, 'ease-out')
		),

		attribute('ui-flip') (
			flipCardAnimation.animate(flipCardDuration, 'linear')
		),

		child('ui-face') (
			position('absolute'),
			inset(0),

			display('block'),

			border(px(3), 'solid', colorPrimary),
			borderRadius(rem(0.5)),
			background(colorCard),
			overflow('hidden'),

			backfaceVisibility('hidden'),

			attribute('ui-front') (
				transform(rotateY(deg(0)))
			),

			attribute('ui-back') (
				transform(rotateY(deg(180)))
			),

			child('img') (
				display('block'),
				width(percentage(100)),
				height(percentage(100)),

				objectFit('cover')
			)
		)
	)
];

export const boardStyle = () => child('ui-board') (
	display('flex'),
	flexDirection('column'),

	padding(rem(2)),
	flex(1),

	child('ui-information') (
		display('flex'),
		justifyContent('center'),
		alignItems('center'),
		height(informationHeight),

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
		height(percentage(50).subtract(informationHeight.divide(2))),

		justifyContent('end'),
		gap(rem(1)),

		firstOfType() (
			flexDirection('column-reverse'),
			justifyContent('start')
		),

		child('ui-trump-cards') (
			playingCards(percentage(25)),

			child('ui-child') (
				attribute('ui-animate') (
					activateTrumpCardAnimation.animate(activateTrumpCardDuration, 'linear')
				)
			)
		),

		child('ui-cards') (
			playingCards(percentage(50)),

			child('ui-card') (
				attribute('ui-trump') (
					maxHeight(percentage(50))
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

				boardPerspective,

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

					inspectTrumpCardTiltX,
					inspectTrumpCardTiltY,
					transform(rotateX(inspectTrumpCardTiltX), rotateY(inspectTrumpCardTiltY)),
					transformStyle('preserve-3d'),

					child('img') (
						display('block'),
						width(percentage(100)),
						height(percentage(100)),
						objectFit('contain'),

						transform(trumpCardImageScale)
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
