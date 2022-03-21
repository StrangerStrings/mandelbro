import { css, customElement, html, internalProperty, LitElement }
	from "lit-element";
import { styleMap } from 'lit-html/directives/style-map';
import { defaultStyles } from './defaultStyles';
import { Settings as Settings } from "./Settings";
import './components/Graph';
import './components/Controls';
import { Pixel } from "./components/Graph";

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
				display: flex;
				justify-content: center;
				align-items: center;
			}

			m-graph {
				height: 90vh;
				width: 90vh;
			}

			control-panel {
				position: fixed;
				bottom: 20px;
				left: 20px;
			}
		`
	];


	@internalProperty() settings: Settings = {
		density: 50
	};

	@internalProperty() pixels: Pixel[] = [];

	connectedCallback(): void {
		super.connectedCallback();


		for (let real = 0; real < this.settings.density+1; real++) {
			for (let imag = 0; imag < this.settings.density+1; imag++) {
				const rand = Math.random()
				this.pixels.push({
					x: real,
					y: imag,
					strength: rand
				})
			}
		}

		this.pixels = [...this.pixels]
	}

	settingsChanged(ev: CustomEvent<{settings: Settings}>) {
		this.settings = {...ev.detail.settings};
	}

	render() {
		return html`
			<div class="container">
				<m-graph
					.pixels=${this.pixels}
					.resolution=${this.settings.density}
				>
				</m-graph>
				<!-- <control-panel
					.settings=${this.settings}
					@changed=${this.settingsChanged}
				></control-panel> -->
			</div>
		`;
	}
}