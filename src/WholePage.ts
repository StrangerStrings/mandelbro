import { css, customElement, html, internalProperty, LitElement }
	from "lit-element";
import { styleMap } from 'lit-html/directives/style-map';
import { defaultStyles } from './defaultStyles';
import { defaultSettings, Settings as Settings } from "./Settings";
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


	@internalProperty() settings: Settings = defaultSettings[0];

	@internalProperty() pixels: Pixel[] = [];
	
	@internalProperty() mousePosition?: {x: number, y:number};

	debounceHover: boolean = false;

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

	hoverOnGraph(ev) {
		if (this.debounceHover) {
			return
		}
		this.debounceHover = true;
		setTimeout(() => this.debounceHover = false, 100)

		var bounds = ev.target.getBoundingClientRect();

		var sizeX = bounds.bottom - bounds.top
		var sizeY = bounds.right - bounds.left
		
		const posX = ev.clientX - bounds.left
		const posY = ev.clientY - bounds.top

		const ratioX = posX/sizeX
		const ratioY = posY/sizeY
		const ratioYRevered = ((ratioY - 0.5) * -1) + 0.5		

		this.mousePosition = {
			x: ratioX,
			y: ratioYRevered
		}
	}

	zoomIn() {
		const settings = this.settings

		const centerReal = this.mousePosition.x * settings.realDistance + settings.startReal
		
		const realDistance = settings.realDistance * 0.8
		const startReal = centerReal - realDistance/2
		const endReal = centerReal + realDistance/2

		const centerImag = this.mousePosition.y * settings.imagDistance + settings.startImag

		const imagDistance = settings.imagDistance * 0.8
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
					.resolution=${this.settings.resolution}
					@mousemove=${this.hoverOnGraph}
					@click=${this.zoomIn}
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