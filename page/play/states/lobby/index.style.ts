import { alignItems, attribute, background, border, borderRadius, calc, child, color, cursor, display, flexBasis, flexDirection, flexGrow, flexShrink, fontSize, fr, gap, gridArea, gridTemplateAreas, gridTemplateColumns, gridTemplateRows, height, hover, lastChild, marginBottom, marginTop, maxWidth, opacity, overflow, overflowY, padding, percentage, pointerEvents, px, rem, textAlign, width } from "@acryps/style";
import { action, colorBackground, colorBackgroundDimmed, colorPrimary, colorPrimaryDimmed, panelBoxShadow } from "../../../global.style";
import { playerStyle } from "../../player/index.style";
import { chatStyle } from "../../chat/index.style";
import { menuStyle } from "../../menu/index.style";

export const lobbyStyle = () => child('ui-lobby') (
	display('grid'),
	height(percentage(80)),
	width(percentage(80)),
	maxWidth(rem(50)),

	padding(rem(2)),
	gap(rem(1)),

	borderRadius(rem(2)),
	background(colorBackgroundDimmed),
	panelBoxShadow,

	gridTemplateAreas(
		['versus', 'versus'],
		['settings', 'spectators'],
		['settings', 'chat']
	),
	gridTemplateColumns(fr(1), fr(1)),
	gridTemplateRows('auto', fr(1), fr(1)),

	menuStyle(),

	child('ui-versus') (
		gridArea('versus'),

		display('flex'),
		gap(rem(1)),
		padding(rem(2)),

		borderRadius(rem(2)),
		background(colorBackground),

		playerStyle(
			lastChild() (
				flexDirection('row-reverse'),
				textAlign('end')
			),

			attribute('ui-missing') (
				child('ui-avatar') (
					border(px(1), 'solid', colorPrimaryDimmed)
				),

				child('ui-name') (
					color(colorPrimaryDimmed)
				)
			),

			width(calc(percentage(50).subtract(rem(-0.5)).toValueString()))
		)
	),

	child('ui-spectators') (
		gridArea('spectators'),

		display('flex'),
		flexDirection('column'),
		height(percentage(100)),
		overflow('hidden'),

		child('ui-title') (
			display('flex'),
			alignItems('center'),
			gap(rem(0.5)),

			color(colorPrimary),
			fontSize(rem(1.2)),

			child('ui-icon') (
				color(colorPrimary)
			)
		),

		child('ui-hint') (
			display('block'),
			marginTop(rem(0.5)),

			color(colorPrimaryDimmed),
			fontSize(rem(0.8))
		),

		child('ui-spectator-list') (
			display('flex'),
			flexDirection('column'),
			gap(rem(0.5)),
			marginTop(rem(1)),
			overflowY('auto'),

			playerStyle(
				child('ui-avatar') (
					height(rem(3)),
					width(rem(3))
				)
			)
		)
	),

	child('ui-settings') (
		gridArea('settings'),

		display('flex'),
		flexDirection('column'),
		gap(rem(1)),

		attribute('ui-disabled') (
			opacity(0.5),
			pointerEvents('none'),
			cursor('not-allowed')
		),

		child('ui-title') (
			display('flex'),
			alignItems('center'),
			gap(rem(0.5)),
			color(colorPrimary),
			fontSize(rem(1.2)),

			child('ui-icon') (
				color(colorPrimary)
			)
		),

		child('ui-configurable') (
			display('flex'),
			flexDirection('column'),
			gap(rem(1.5)),

			flexGrow(1),
			flexShrink(1),
			flexBasis(0),

			overflowY('auto'),

			child('ui-setting') (
				display('block'),

				child('ui-label') (
					display('block'),
					marginBottom(rem(0.5)),
					color(colorPrimary)
				),

				child('ui-hint') (
					display('block'),
					marginBottom(rem(1)),
					color(colorPrimaryDimmed),
					fontSize(rem(0.8))
				),

				child('ui-radio-select') (
					display('flex'),
					gap(rem(0.5)),

					child('ui-option') (
						display('block'),
						flexGrow(1),
						flexShrink(1),
						flexBasis(0),
						padding(rem(0.5)),

						borderRadius(rem(2)),
						border(px(1), 'solid', 'transparent'),

						color(colorPrimary),
						background(colorBackground),

						textAlign('center'),
						cursor('pointer'),

						hover() (
							border(px(1), 'solid', colorPrimary)
						),

						attribute('ui-active') (
							background(colorPrimary),
							color(colorBackground)
						)
					)
				)
			)
		),

		child('ui-action') (
			action()
		)
	),

	chatStyle(
		gridArea('chat'),

		height(calc(percentage(100).subtract(rem(2)).toValueString())),
		padding(rem(1)),

		border(px(2), 'solid', colorBackground),
		borderRadius(rem(2)),
		overflow('hidden')
	)
);
