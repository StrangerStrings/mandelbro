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
		density: 160
	};

	@internalProperty() pixels: Pixel[] = [];

	connectedCallback(): void {
		super.connectedCallback();

		for (let real = 0; real < this.settings.density+1; real++) {
			for (let imag = 0; imag < this.settings.density+1; imag++) {
				// const pixel = this.createPixel(real, this.settings.density/2);
				const pixel = this.createPixel(real, imag);
				this.pixels.push(pixel)
			}
		}

		this.pixels = [...this.pixels]
	}

	createPixel(x: number, y: number): Pixel {
		const real = (2*x/this.settings.density) - 1
		const imag = (2*y/this.settings.density) - 1
		
		const strength = this.recursiveMandlebro(real, imag)
		
		return { x, y, strength };
	}

	recursiveMandlebro(real: number, imag: number): number {
		let realAnswer = 0;
		let imagAnswer = 0;
		
		let times = 0;
		while (realAnswer < 2 && times < 100) {
			times++;
			[realAnswer, imagAnswer] = this.imaginaryMath(realAnswer, imagAnswer, real, imag);
		}
		return times/100
	}

	imaginaryMath(
		real: number,
		imag: number,
		realBase: number,
		imagBase: number
		): [real: number, b:number] {
		
			const realAnswer = Math.pow(real,2) - Math.pow(imag,2) + realBase

			const imaginaryAnswer = (2 * imag * real) + imagBase


			
			return [realAnswer, imaginaryAnswer]
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