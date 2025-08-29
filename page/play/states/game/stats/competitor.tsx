import { Component } from "@acryps/page";
import { heartFilledIcon, heartEmptyIcon } from "../../../../built/icons";
import { PlayerComponent } from "../../../player";
import { GameComponent } from "..";
import { defaultBet } from "../../../../../shared/constants";
import { Application } from "../../../..";
import { takeDamageDuration } from "./index.style";

export class StatsCompetitorComponent extends Component {
	declare rootNode: HTMLElement;

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

		setTimeout(() => {
			new Audio('/assets/sfx/take-damage.wav').play();
		}, (+takeDamageDuration.value - 0.1) * 1000);

		this.rootNode.setAttribute('ui-take-damage', '');
		await Application.waitForSeconds(+takeDamageDuration.value);
		this.rootNode.removeAttribute('ui-take-damage');

		this.update();
		await Application.waitForSeconds(0.5);
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
