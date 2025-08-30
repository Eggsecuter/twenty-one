import { alignItems, background, borderRadius, child, display, height, justifyContent, marginTop, padding, percentage, rem } from "@acryps/style";
import { action, dialog, colorBackgroundDimmed, panelBoxShadow } from "../global.style";
import { configurePlayerStyle } from "../shared/configure-player/index.style";
import { lobbyStyle } from "./states/lobby/index.style";
import { gameStyle } from "./states/game/index.style";

export const playStyle = () => child('ui-play') (
	display('flex'),
	height(percentage(100)),
	alignItems('center'),
	justifyContent('center'),

	child('ui-join-error') (
		dialog()
	),

	child('ui-connection-lost') (
		dialog()
	),

	child('ui-direct-join') (
		display('block'),
		padding(rem(2)),

		borderRadius(rem(2)),
		background(colorBackgroundDimmed),

		panelBoxShadow,

		configurePlayerStyle(),

		child('ui-action') (
			action(),
			marginTop(rem(2))
		)
	),

	lobbyStyle(),
	gameStyle()
);
