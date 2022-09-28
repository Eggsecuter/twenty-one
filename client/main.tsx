import { Component } from 'vldom/component';

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
