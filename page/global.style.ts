import { attribute, background, border, borderColor, borderRadius, boxShadow, child, color, cursor, display, flexBasis, flexGrow, flexShrink, fontSize, gap, hex, hover, Integer, Keyframes, marginBottom, maxWidth, minHeight, minWidth, not, opacity, padding, percentage, pointerEvents, px, rem, textAlign, textTransform, transform, translateX, width } from "@acryps/style";

// variables
export const colorPrimary = hex('dbc5a7');
export const colorPrimaryDimmed = hex('928579');

export const colorBackground = hex('323649');
export const colorBackgroundDimmed = hex('20222d');

export const colorError = hex('ff3737');
export const colorSystem = hex('6b6b6b');
export const colorCard = hex('fffffc');

export const boxShadowColor = hex('242424');
export const navigationBoxShadow = boxShadow(boxShadowColor, 0, rem(0.05), rem(1));
export const panelBoxShadow = boxShadow(boxShadowColor, rem(0.05), rem(0.05), rem(1));

// animations
export const shakeAnimation = new Keyframes('shake')
	.addKeyframe(percentage(0), transform(translateX(rem(0))))
	.addKeyframe(percentage(25), transform(translateX(rem(0.25))))
	.addKeyframe(percentage(50), transform(translateX(rem(-0.25))))
	.addKeyframe(percentage(75), transform(translateX(rem(0.25))));

// helper
export const flex = (growOrder: Integer) => [
	flexGrow(growOrder),
	flexShrink(1),
	flexBasis(0)
];

// components
export const action = () => [
	display('block'),
	minWidth(rem(3)),
	padding(rem(1)),

	borderRadius(rem(2)),
	border(px(1), 'solid', colorPrimary),

	textTransform('uppercase'),
	textAlign('center'),

	cursor('pointer'),

	attribute('ui-disabled') (
		opacity(0.5),

		pointerEvents('none'),
		cursor('not-allowed')
	),

	attribute('ui-compact') (
		minWidth(rem(2)),
		padding(rem(0.5))
	),

	attribute('ui-secondary') (
		color(colorPrimary),

		hover() (
			color(colorPrimaryDimmed)
		)
	),

	// default button (primary)
	not([attribute('ui-secondary')]) (
		color(colorBackground),
		background(colorPrimary),

		hover() (
			background(colorPrimaryDimmed),
			borderColor(colorPrimaryDimmed)
		)
	)
];

export const dialog = () => [
	display('block'),
	width(percentage(80)),
	maxWidth(rem(30)),
	padding(rem(2)),

	borderRadius(rem(2)),
	background(colorBackgroundDimmed),

	panelBoxShadow,

	child('ui-title') (
		display('block'),
		marginBottom(rem(1)),

		color(colorPrimary),
		fontSize(rem(1.5))
	),

	child('ui-description') (
		display('block'),
		minHeight(rem(5)),
		marginBottom(rem(2)),

		color(colorPrimaryDimmed)
	),

	child('ui-action-group') (
		display('flex'),
		gap(rem(1)),

		child('ui-action') (
			action(),

			flex(1)
		)
	)
];
