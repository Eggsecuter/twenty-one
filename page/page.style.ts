import { alignItems, attribute, background, border, borderRadius, calc, child, color, cursor, descendant, display, flex, flexDirection, fontFamily, gap, height, hover, is, justifyContent, margin, not, outline, paddingBlock, paddingInline, percentage, position, px, rem, root, style, top, vh, width } from "@acryps/style";
import { colorBackground, colorBackgroundDimmed, colorPrimary, navigationBoxShadow } from "./global.style";
import { iconFont, icons } from "./built/icons";
import { guideStyle } from "./guide/index.style";
import { homeStyle } from "./home/index.style";
import { playStyle } from "./play/index.style";

export const applicationStyle = () => root() (
	icons(),
	iconFont,

	background(colorBackground),
	fontFamily('Arial', 'Helvetica', 'sans-serif'),

	child('body') (
		margin(0),

		descendant('input') (
			display('block'),
			width(calc(percentage(100).subtract(rem(3)).subtract(px(2)).toValueString())),
			paddingBlock(rem(1)),
			paddingInline(rem(1.5)),

			color(colorPrimary),
			background(colorBackgroundDimmed),

			border(px(1), 'solid', colorPrimary),
			borderRadius(rem(2)),
			outline('none')
		),

		child('ui-page') (
			display('flex'),
			height(vh(100)),
			flexDirection('column'),

			child('ui-navigation') (
				position('sticky'),
				top(0),

				display('flex'),
				paddingBlock(rem(1)),
				paddingInline(rem(2)),

				justifyContent('space-between'),
				alignItems('center'),

				background(colorBackgroundDimmed),
				color(colorPrimary),

				navigationBoxShadow,

				child('ui-page-links') (
					display('flex'),
					gap(rem(1)),

					child('ui-page-link') (
						display('block'),
						paddingBlock(rem(1)),
						paddingInline(rem(1.5)),

						borderRadius(rem(2)),
						cursor('pointer'),

						is([attribute('ui-active')], [hover()]) (
							background(colorBackground)
						)
					)
				)
			),

			child('*') (
				not([style('ui-navigation')]) (
					display('block'),

					flex(1)
				)
			),

			homeStyle(),
			guideStyle(),
			playStyle()
		)
	)
);
