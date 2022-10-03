import { Component } from "vldom";

export class PageComponent extends Component {
	constructor() {
		super();
	}

	render(child?) {
		return <div>
			<h1>Card Game</h1>

			{child}
		</div>;
	}
}
