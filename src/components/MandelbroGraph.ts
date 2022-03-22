import { css, customElement, html, LitElement, property } from "lit-element";
import { styleMap } from 'lit-html/directives/style-map';
import { defaultStyles } from "../defaultStyles";

export type Pixel = {
	x: number;
	y: number;
	strength: number;
}

/**
 * A fractal (a line) that can contain copies of itself, that can contain copies of itself, that can con..
 */
@customElement("m-graph")
export class Fractal extends LitElement{
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
				transform: translate(-50%, 50%) scale(1.52);
				background-color: black;
			}
		`
	];

	@property({type: Array}) pixels: Pixel[] = [];
	
	@property({type: Number}) resolution: number = 100;
	
	render() {
		const pixels = this.pixels.map(p => {
			const size = 100/this.resolution;
			const style = {
				left: `${p.x * size}%`,
				bottom: `${p.y * size}%`,
				height: `${size}%`,
				width: `${size}%`,
				opacity: `${p.strength}`
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
