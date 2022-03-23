import { css, customElement, html, internalProperty, LitElement }
	from "lit-element";
import { defaultStyles } from './defaultStyles';
import { Settings } from "./Settings";
import './components/MandelbroGraph';
import './components/MandelbroCanvas';
import './components/ViewFinder';
import './components/Controls';

export type Pixel = {
	x: number;
	y: number;
	strength: number;
}

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

			.graph-window {
				position: relative;
				height: 90vh;
				width: 90vh;
			}
			view-finder {
				position: absolute;
				width:100%;
				height:100%;
				top:0;
				left:0;
			}

			control-panel {
				position: fixed;
				bottom: 20px;
				left: 20px;
			}
		`
	];


	@internalProperty() settings?: Settings;

	@internalProperty() pixels: Pixel[] = [];
	
	createMandelSet() {
		this.pixels = [];

		for (let real = 0; real < this.settings.resolution+1; real++) {
			for (let imag = 0; imag < this.settings.resolution+1; imag++) {
				const pixel = this.createPixel(real, imag);
				this.pixels.push(pixel);
			}
		}

		this.pixels = [...this.pixels];
	}

	createPixel(x: number, y: number): Pixel {
		const real = (this.settings.rangeReal * x / this.settings.resolution) + this.settings.startReal;
		const imag = (this.settings.rangeImag * y /this.settings.resolution) + this.settings.startImag;
		
		const strength = this.recursiveMandlebro(real, imag);
		
		return { x, y, strength };
	}

	/** Recursive imaginary math to check if that number tends towards infinity or not */
	recursiveMandlebro(real: number, imag: number): number {
		let realAnswer = 0;
		let imagAnswer = 0;
		
		let times = 0;
		// if real part of the number becomes greater than 2 it will tend towards infinity
		while (realAnswer < 2 && times < this.settings.calculations) {
			times++;
			[realAnswer, imagAnswer] = this.imaginaryMath(realAnswer, imagAnswer, real, imag);
		}
		return times/this.settings.calculations;
	}

	/** Perform sum: n(+1) = n^2 + c */
	imaginaryMath(
		real: number,
		imag: number,
		realBase: number,
		imagBase: number
		): [real: number, imag: number] {
			// real part of the sum (as real*real=real & imaginary*imaginary=real)
			const realAnswer = Math.pow(real,2) - Math.pow(imag,2) + realBase

			// imaginary part of the sum (as imaginary*real=imaginary)
			const imaginaryAnswer = (2 * imag * real) + imagBase

			return [realAnswer, imaginaryAnswer]
	}


	settingsChanged(ev: CustomEvent<{settings: Settings}>) {
		this.settings = {...ev.detail.settings};
		this.createMandelSet();
	}

	colorChanged(ev: CustomEvent<{settings: Settings}>) {
		this.settings = {...ev.detail.settings};
	}


	render() {
		return html`
			<div class="container">
				<div class="graph-window">
					<m-canvas
						.pixels=${this.pixels}
						.resolution=${this.settings?.resolution}
						.hue=${this.settings?.hue}
					></m-canvas>
					<!-- <m-graph
						.pixels=${this.pixels}
						.resolution=${this.settings?.resolution}
						.hue=${this.settings?.hue}
					></m-graph> -->
					<view-finder
						.settings=${this.settings}
						@changed=${this.settingsChanged}
					></view-finder>
				</div>
				<control-panel
					.settings=${this.settings}
					@changed=${this.settingsChanged}
					@color-changed=${this.colorChanged}
				></control-panel>
			</div>
		`;
	}
}