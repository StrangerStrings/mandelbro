import { css, customElement, html, LitElement, property } from "lit-element";
import { styleMap } from 'lit-html/directives/style-map';
import { defaultStyles } from "../defaultStyles";

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
			}
		`
	];

	@property({type: Number}) noOfChildren: number;

	
	render() {
		return html`
				<div class="graph">
			
				</div>
		`;
	}

}
