import { Component } from "vldom";

export class TestComponent extends Component {
	constructor() {
		super();
	}

    count: number = 0;

    increaseCount() {
		this.count = this.count + 1;
		console.log(`Clicked ${this.count} times`)
	}

	render() {
		return <div>
				<h1>Test</h1>

                <input type="text" $ui-value={this.count} />
                <button ui-click={() => this.increaseCount()}>
                    Click Me!
                </button>
            </div>;
	}
}
