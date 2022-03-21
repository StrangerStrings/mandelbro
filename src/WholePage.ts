import { css, customElement, html, internalProperty, LitElement }
	from "lit-element";
import { styleMap } from 'lit-html/directives/style-map';
import { defaultStyles } from './defaultStyles';
import { Settings as Settings } from "./Settings";
import './components/Graph';
import './components/Controls';

@customElement('whole-page')
/**
 * Page that creates the initial base fractals based on settings
 * and has the ability to automatically spin the fractals
 */
export class WholePage extends LitElement {

	static styles = [
		defaultStyles,
		css`
			.container {
				height: 100%;
				background: black;
			}

			control-panel {
				position: fixed;
				bottom: 20px;
				left: 20px;
			}
		`
	];


	@internalProperty() settings: Settings = {
		amount: 1
	};

	connectedCallback(): void {
		super.connectedCallback();


	}

	settingsChanged(ev: CustomEvent<{settings: Settings}>) {
		this.settings = {...ev.detail.settings};
	}

	render() {
		return html`
			<div class="container">
				<m-graph

				>
				</m-graph>
				<control-panel
					.settings=${this.settings}
					@changed=${this.settingsChanged}
				></control-panel>
			</div>
		`;
	}
}