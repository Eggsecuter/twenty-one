import { Component, PathRouter, Router } from '@acryps/page';
import { registerDirectives } from '@acryps/page-default-directives';
import { PageComponent } from './page';
import { HomeComponent } from './home';
import { PlayComponent } from './play';
import { GuideComponent } from './guide';
import { PlayerConfiguration } from './shared/player-configuration';
import { applicationStyle } from './page.style';

export class Application {
	static router: Router;

	static playerConfiguration: PlayerConfiguration;

	static async get(path: string, format: 'text' | 'json' = 'json') {
		const response = await fetch(path);

		return await (format == 'json' ? response.json() : response.text());
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

		applicationStyle().apply();

		this.router.host(document.body);
	}

	static waitForSeconds(seconds: number) {
		return new Promise<void>(done => setTimeout(() => done(), seconds * 1000));
	}
}

Application.main();
