import { Component, PathRouter, Router } from '@acryps/page';
import { registerDirectives } from '@acryps/page-default-directives';
import { PageComponent } from './page';
import { HomeComponent } from './home';
import { PlayComponent } from './play';
import { GuideComponent } from './guide';
import { PlayerConfiguration } from './shared/player-configuration';

export class Application {
	static router: Router;

	static playerConfiguration = new PlayerConfiguration();

	static async get(path: string) {
		const response = await fetch(path);

		return await response.json();
	}

	static async post(path: string, body: any = {}) {
		const response = await fetch(path, {
			method: 'post',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(body)
		});

		return await response.json();
	}

	static async main() {
		this.router = new PathRouter(PageComponent
			.default(HomeComponent)
			.route('/guide', GuideComponent)
			.route('/play/:token', PlayComponent)
		);

		this.router.onundefinedroute = () => this.router.navigate('/');

		registerDirectives(Component, this.router);

		this.router.host(document.body);
	}
}

Application.main();
