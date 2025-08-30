import { alignSelf, attribute, background, child, color, display, flex, flexDirection, fontSize, fontStyle, gap, nthChild, overflowY, padding, rem, StyleSelectorBody } from "@acryps/style";
import { colorBackground, colorPrimary, colorSystem } from "../../global.style";

export const chatStyle = (...content: StyleSelectorBody[]) => child('ui-chat') (
	display('flex'),
	flexDirection('column'),
	gap(rem(1)),

	alignSelf('end'),

	child('ui-chat-messages') (
		display('flex'),
		flex(1),

		flexDirection('column'),
		overflowY('auto'),

		child('ui-chat-message') (
			display('flex'),
			padding(rem(0.5)),
			gap(rem(0.25)),

			color(colorPrimary),
			fontSize(rem(0.8)),

			nthChild('even') (
				background(colorBackground)
			),

			attribute('ui-system') (
				color(colorSystem),
				fontStyle('italic')
			),

			child('ui-message') (
				display('block'),
				flex(1)
			),

			child('ui-time') (
				fontSize(rem(0.5))
			)
		)
	),

	...content
);
