import { Component } from "@acryps/page";
import { PlayComponent } from "..";

export abstract class StateComponent extends Component {
	declare parent: PlayComponent;

	onhostchange() {}
	onpeerschange() {}
}
