import { Component } from "vldom";

export class PageComponent extends Component {
	constructor() {
		super();
	}

	render(child?) {
		return <div>
			<h1>Card Game</h1>
			
			<a ui-href="/" ui-href-active>Home</a>
			<a ui-href="/test" ui-href-active>Test</a>

			{child}
		</div>;
	}
}
