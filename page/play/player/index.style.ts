import { alignItems, attribute, background, backdropFilter, borderRadius, child, color, cursor, display, gap, height, inset, justifyContent, overflow, padding, percentage, position, rem, right, textOverflow, top, transform, whiteSpace, width, rotate, deg, blur, px, StyleSelectorBody, not, hover, fontSize, flex } from "@acryps/style";
import { action, colorBackgroundDimmed, colorPrimary, colorPrimaryDimmed } from "../../global.style";

export const playerStyle = (...content: StyleSelectorBody[]) => child('ui-player') (
	display('flex'),
	gap(rem(1)),

	alignItems('center'),

	position('relative'),

	attribute('ui-can-open-menu', ':hover') (
		cursor('pointer'),

		child('ui-name') (
			color(colorPrimaryDimmed)
		)
	),

	child('ui-avatar') (
		position('relative'),

		display('block'),
		height(rem(5)),
		width(rem(5)),

		borderRadius(percentage(50)),

		child('ui-icon') (
			position('absolute'),
			top(percentage(-5)),
			right(0),

			display('block'),
			transform(rotate(deg(40))),

			color(colorPrimary),
			fontSize(rem(1.5))
		),

		child('img') (
			display('block'),
			height(percentage(100)),
			borderRadius(percentage(50))
		)
	),

	child('ui-name') (
		display('block'),
		flex(1),

		color(colorPrimary),

		whiteSpace('nowrap'),
		overflow('hidden'),
		textOverflow('ellipsis')
	),

	child('ui-menu') (
		display('flex'),
		gap(rem(0.5)),

		position('absolute'),
		inset(0),
		alignItems('center'),
		justifyContent('end'),

		backdropFilter(blur(px(1))),

		child('ui-action') (
			action(),

			padding(rem(0.5)),

			attribute('ui-secondary') (
				background(colorBackgroundDimmed)
			),

			not([attribute('ui-secondary')]) (
				hover() (
					background(colorBackgroundDimmed)
				)
			)
		)
	),

	...content
);
