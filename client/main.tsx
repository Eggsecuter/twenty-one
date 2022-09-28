import { Component } from "vldom";

export class ExampleComponent extends Component {
	constructor() {
		super();
	}

	render() {
		return <section>
			Example Component test!
		</section>;
	}
}

new ExampleComponent().host(document.body);
