import { Component } from '@acryps/page';
import { PlayComponent } from './play';

export class PageComponent extends Component {
	render(child) {
		return <ui-page>
			{this.activeRoute.component != PlayComponent && <ui-navigation>
				<ui-brand ui-href=''>RE7 Card Game</ui-brand>

				<ui-page-links>
					<ui-page-link ui-href='' ui-href-active>Home</ui-page-link>
					<ui-page-link ui-href='/guide' ui-href-active>Guide</ui-page-link>
				</ui-page-links>
			</ui-navigation>}

			{child}
		</ui-page>;
	}
}
