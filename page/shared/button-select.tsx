import { Component } from "@acryps/page";

export class ButtonSelectComponent<OptionType> extends Component {
	private label: (option: OptionType) => string = option => `${option}`;

	constructor (
		private options: OptionType[],
		private selected: OptionType,
		private onselect: (option: OptionType) => void
	) {
		super();
	}

	setLabel(label: (option: OptionType) => string) {
		this.label = label;

		return this;
	}

	render() {
		return <ui-button-select>
			{this.options.map(option => <ui-action ui-click={() => {
				this.selected = option;
				this.onselect(option);

				this.update();
			}} ui-active={this.selected == option}>{this.label(option)}</ui-action>)}
		</ui-button-select>;
	}
}
