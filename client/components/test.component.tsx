import { Component } from "vldom";

export class TestComponent extends Component {
	constructor() {
		super();
	}

    count: number = 0;

    increaseCount() {
		this.count++;
		console.log(`Clicked ${this.count} times`)
	}

	render() {
		return <div>
                <input type="text" $ui-value={this.count} />
                <button ui-click={() => this.increaseCount()}>
                    Click Me!
                </button>
            </div>;
	}
}
