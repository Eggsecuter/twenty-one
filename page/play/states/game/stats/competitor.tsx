import { Component } from "@acryps/page";
import { heartFilledIcon, heartEmptyIcon } from "../../../../built/icons";
import { PlayerComponent } from "../../../player";
import { GameComponent } from "..";
import { defaultBet } from "../../../../../shared/constants";

export class StatsCompetitorComponent extends Component {
	get competitor() {
		return GameComponent.context.competitorContexts[this.competitorContextIndex].competitor;
	}

	constructor (
		private competitorContextIndex: number
	) {
		super();

		GameComponent.context.competitorContexts[this.competitorContextIndex].statsComponent = this;
	}

	async resetHealth() {
		this.competitor.health = GameComponent.context.playComponent.gameSettings.playerHealth;
		this.update();
	}

	async takeDamage() {
		this.competitor.takeDamage();
		this.update();
	}

	render() {
		return <ui-competitor-stats>
			<ui-bet>{defaultBet.toString().padStart(2, '0')}</ui-bet>

			<ui-hearts>{Array(GameComponent.context.playComponent.gameSettings.playerHealth).fill('').map((_, index) =>
				index < this.competitor.health ? heartFilledIcon() : heartEmptyIcon()
			)}</ui-hearts>

			{new PlayerComponent(GameComponent.context.playComponent, this.competitor.player)}
		</ui-competitor-stats>;
	}
}
