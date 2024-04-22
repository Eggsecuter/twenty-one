import { Component } from '@acryps/page';

export class PageComponent extends Component {
	render(child) {
		return <ui-page>
			<ui-navigation>
				<ui-brand ui-href=''>RE7 Card Game</ui-brand>
			</ui-navigation>

			{child}
		</ui-page>;
	}
}