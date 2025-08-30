import { PlayComponent } from "../..";
import { Competitor } from "../../../../shared/competitor";
import { BoardCompetitorComponent } from "./board/competitor";
import { InformationComponent } from "./board/information";
import { RoundComponent } from "./round";
import { StatsCompetitorComponent } from "./stats/competitor";

export type CompetitorContext = {
	competitor: Competitor;

	statsComponent: StatsCompetitorComponent;
	boardComponent: BoardCompetitorComponent;
}

export class GameContext {
	roundIndex: number;

	competitorContexts: CompetitorContext[];
	roundComponent: RoundComponent;
	informationComponent: InformationComponent;

	constructor(
		public playComponent: PlayComponent
	) {
		this.roundIndex = 1;

		this.competitorContexts = playComponent.players.slice(0, 2).map(player => ({
			competitor: new Competitor(player, playComponent.gameSettings.playerHealth)
		} as CompetitorContext));
	}
}
