import { Component } from "vldom";

export class PageComponent extends Component {
    render(child: Node) {
		return <ui-page>{child}</ui-page>;
	}
}
