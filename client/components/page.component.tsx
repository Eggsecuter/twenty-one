import { Component } from "vldom";

export class PageComponent extends Component {
	constructor() {
		super();
	}

	render(child?) {
		return <div>
			<h1>Card Game</h1>
			
			<ui-nav>
				<ui-nav-items>
					<ui-nav-item ui-href="/home" ui-href-active>Home</ui-nav-item>
					<ui-nav-item ui-href="/test" ui-href-active>Test</ui-nav-item>
				</ui-nav-items>
			</ui-nav>

			{child}
		</div>;
	}
}
