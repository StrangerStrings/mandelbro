import { css, customElement, html, LitElement, property } from "lit-element";
import { styleMap } from 'lit-html/directives/style-map';
import { defaultStyles } from "../defaultStyles";
import { Pixel } from "../WholePage";

/**
 * component that renders some pixels
 */
@customElement("m-graph")
export class MandelbroGraph extends LitElement{
	static styles = [
		defaultStyles,
		css`
			.graph {
				position: relative;
				height: 100%;
				background-color: whitesmoke;
			}
			.pixel {
				position: absolute;
				border-radius: 50%;
				transform: translate(-50%, 50%) scale(1.42);
				background-color: black;
			}
		`
	];

	@property({type: Array}) pixels: Pixel[] = [];
	
	@property({type: Number}) resolution: number = 100;
	
	@property({type: Number}) hue: number = 215;
	

	computeColor(strength: number): string {
		const saturation =  80 - (strength * 20);

		const lightness = 35 - (strength * 35);

		return `hsl(${this.hue}deg ${saturation}% ${lightness}%)`;
	}

	render() {
		const pixels = this.pixels.map(p => {
			const size = 100/this.resolution;
			const color = this.computeColor(p.strength);
			
			const style = {
				left: `${p.x * size}%`,
				bottom: `${p.y * size}%`,
				height: `${size}%`,
				width: `${size}%`,
				opacity: `${p.strength}`,
				background: `${color}`
			}

			return html`<div class="pixel" style=${styleMap(style)}></div>`;
		})

		return html`
			<div class="graph">
				${pixels}
			</div>
		`;
	}

}
