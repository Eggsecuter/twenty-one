import { child, width, percentage, padding, rem, display, flexDirection, gap, position, marginRight, borderRadius, border, px, background, color, fontFamily, fontSize, before, content, left, transform, translateX, paddingInline, flexWrap, top, firstOfType, justifyContent, Variable, seconds, Keyframes, attribute } from "@acryps/style";
import { colorPrimary, colorBackgroundDimmed } from "../../../../global.style";
import { playerStyle } from "../../../player/index.style";

export const takeDamageDuration = seconds(1);
const takeDamageAnimation = new Keyframes('ui-take-damage')
	.addKeyframe(percentage(0), transform(translateX(0)))
	.addKeyframe(percentage(5), transform(translateX(percentage(0.3))))
	.addKeyframe(percentage(10), transform(translateX(percentage(-0.6))))
	.addKeyframe(percentage(15), transform(translateX(percentage(0.9))))
	.addKeyframe(percentage(20), transform(translateX(percentage(-1.2))))
	.addKeyframe(percentage(25), transform(translateX(percentage(1.5))))
	.addKeyframe(percentage(30), transform(translateX(percentage(-1.8))))
	.addKeyframe(percentage(35), transform(translateX(percentage(2.1))))
	.addKeyframe(percentage(40), transform(translateX(percentage(-2.4))))
	.addKeyframe(percentage(45), transform(translateX(percentage(2.7))))
	.addKeyframe(percentage(50), transform(translateX(percentage(-3.0))))
	.addKeyframe(percentage(55), transform(translateX(percentage(3.3))))
	.addKeyframe(percentage(60), transform(translateX(percentage(-3.6))))
	.addKeyframe(percentage(65), transform(translateX(percentage(3.9))))
	.addKeyframe(percentage(70), transform(translateX(percentage(-4.2))))
	.addKeyframe(percentage(75), transform(translateX(percentage(4.5))))
	.addKeyframe(percentage(80), transform(translateX(percentage(-4.8))))
	.addKeyframe(percentage(85), transform(translateX(percentage(5.1))))
	.addKeyframe(percentage(90), transform(translateX(percentage(-5.4))))
	.addKeyframe(percentage(95), transform(translateX(percentage(5.7))))
	.addKeyframe(percentage(100), transform(translateX(0)))

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

		attribute('ui-take-damage') (
			child('ui-hearts') (
				takeDamageAnimation.animate(takeDamageDuration, 'step-end')
			)
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
