import { css, customElement, html, internalProperty, LitElement }
	from "lit-element";
import { styleMap } from 'lit-html/directives/style-map';
import { defaultStyles } from './defaultStyles';
import { Settings } from "./Settings";
import './components/MandelbroGraph';
import './components/Controls';
import { Pixel } from "./components/MandelbroGraph";

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
				position: relative;
				height: 90vh;
				width: 90vh;
				cursor: zoom-in;
			}

			.view-finder {
				position: absolute;
				transform: translate(-50%,50%);
				border: 2px dashed;
				height:80%;
				width: 80%;
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
	
	zoomFactor: number = 1.33

	createMmmSet() {
		this.pixels = [];

		for (let real = 0; real < this.settings.resolution+1; real++) {
			for (let imag = 0; imag < this.settings.resolution+1; imag++) {
				const pixel = this.createPixel(real, imag);
				this.pixels.push(pixel)
			}
		}

		this.pixels = [...this.pixels]
	}

	createPixel(x: number, y: number): Pixel {
		const real = (this.settings.realDistance * x / this.settings.resolution) + this.settings.startReal
		const imag = (this.settings.imagDistance * y /this.settings.resolution) + this.settings.startImag
		
		const strength = this.recursiveMandlebro(real, imag)
		
		return { x, y, strength };
	}

	recursiveMandlebro(real: number, imag: number): number {
		let realAnswer = 0;
		let imagAnswer = 0;
		
		let times = 0;
		while (realAnswer < 2 && times < this.settings.discrepency) {
			times++;
			[realAnswer, imagAnswer] = this.imaginaryMath(realAnswer, imagAnswer, real, imag);
		}
		return times/this.settings.discrepency
	}

	/** Perform sum: n+1 = n^2 + c */
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
		this.createMmmSet()
	}

	calculateMousePosition(ev) {
		var bounds = ev.target.getBoundingClientRect();

		var sizeX = bounds.bottom - bounds.top
		var sizeY = bounds.right - bounds.left
		
		const posX = ev.clientX - bounds.left
		const posY = ev.clientY - bounds.top

		const ratioX = posX/sizeX
		const ratioY = posY/sizeY
		const ratioYReversed = ((ratioY - 0.5) * -1) + 0.5		

		return {
			x: ratioX,
			y: ratioYReversed
		}
	}

	zoomIn(ev) {
		const mouse = this.calculateMousePosition(ev)

		const settings = this.settings

		const centerReal = mouse.x * settings.realDistance + settings.startReal
		
		const realDistance = settings.realDistance / this.zoomFactor
		const startReal = centerReal - realDistance/2
		const endReal = centerReal + realDistance/2

		const centerImag = mouse.y * settings.imagDistance + settings.startImag

		const imagDistance = settings.imagDistance / this.zoomFactor
		const startImag = centerImag - imagDistance/2
		const endImag = centerImag + imagDistance/2

		this.settings = {
			...this.settings,
			startReal,
			endReal,
			realDistance,
			startImag,
			endImag,
			imagDistance
		}

		this.createMmmSet()
	}

	render() {
		return html`
			<div class="container">
				<m-graph
					.pixels=${this.pixels}
					.resolution=${this.settings?.resolution}
					@click=${this.zoomIn}
				></m-graph>
				<control-panel
					.settings=${this.settings}
					@changed=${this.settingsChanged}
				></control-panel>
			</div>
		`;
	}
}