import { Component, PathRouter, Router } from '@acryps/page';
import { registerDirectives } from '@acryps/page-default-directives';
import { PageComponent } from './page';
import { HomeComponent } from './home';
import { GameComponent } from './game';

Component.directives['ui-keyup'] = (element: HTMLInputElement, value) => {
	element.onkeyup = () => {
		value(element.value);
	}
}

export class Application {
	static router: Router;

	static async main() {
		this.router = new PathRouter(PageComponent
			.default(HomeComponent)
			.route('/play/:token', GameComponent)
		);
		
		registerDirectives(Component, this.router);

		this.router.host(document.body);
	}
}

Application.main();