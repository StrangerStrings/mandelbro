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
				background-color: grey;
				height: 100%;
			}
			.pixel {
				position: absolute;
				border-radius: 50%;
				transform: translate(-50%, 50%);
				background-color: black;
			}
		`
	];

	@property({type: Array}) pixels: Pixel[] = [];
	
	@property({type: Number}) resolution: number = 100;
	
	render() {
		const pixels = this.pixels.map(p => {
			const style = {
				left: `${100 * p.x/this.resolution}%`,
				bottom: `${100 * p.y/this.resolution}%`,
				height: `${100 / this.resolution}%`,
				width: `${100 / this.resolution}%`,
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
