import { Component } from "@acryps/page";
import { Competitor } from "../../../../shared/competitor";
import { PlayerComponent } from "../../player";
import { GameComponent } from ".";
import { IconComponent } from "../../../shared";

export class CompetitorComponent extends Component {
	declare parent: GameComponent;

	constructor (
		private competitor: Competitor
	) {
		super();
	}

	render() {
		return <ui-competitor>
			<ui-information>
				{new PlayerComponent(this.parent.parent, this.competitor.player)}

				<ui-hearts>{Array(this.parent.parent.gameSettings.playerHealth).fill('').map((_, index) =>
					new IconComponent(index < this.competitor.heartCount ? 'heart-filled' : 'heart-empty')
				)}</ui-hearts>

				<ui-bet>{this.competitor.bet.toString().padStart(2, '0')}</ui-bet>
			</ui-information>

			<ui-board>
				<ui-sum>{this.competitor.sum}{this.competitor.cards.length && this.competitor.cards[0] == null ? ' + ?' : ''} / {this.parent.perfectSum}</ui-sum>

				<ui-cards>{this.competitor.cards.map(card =>
					<ui-card>
						<img src={`/assets/cards/${card ?? 'back'}.png`} />
					</ui-card>
				)}</ui-cards>
			</ui-board>
		</ui-competitor>;
	}
}
