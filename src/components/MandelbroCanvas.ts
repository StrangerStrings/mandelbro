import { css, customElement, html, LitElement, property } from "lit-element";
import { defaultStyles } from "../defaultStyles";
import { Pixel } from "../WholePage";

/**
 * Html canvas that renders some pixels
 */
@customElement("m-canvas")
export class MandelbroCanvas extends LitElement{
	static styles = [
		defaultStyles,
		css`
			.canvas-container {
				height: 100%;
				background-color: whitesmoke;
			}
		`
	];

	@property({type: Array}) pixels: Pixel[] = [];
	
	@property({type: Number}) resolution: number = 100;
	
	@property({type: Number}) hue: number = 215;
	

	computeColor(strength: number): string {
		const saturation =  80 - (strength * 20);

		const lightness = 35 - (strength * 35);

		return `hsla(${this.hue}deg, ${saturation}%, ${lightness}%, ${strength})`;
	}

	render() {
		const canvas = this.shadowRoot.querySelector('canvas');
		if (canvas) {
			const container = this.shadowRoot.querySelector('.canvas-container');
			const width = container.clientWidth;
			const height = container.clientHeight;

			canvas.width = width;
			canvas.height = height;

			const context = canvas.getContext('2d');

			this.pixels.forEach(pixel => {
				const centerX = pixel.x * width / this.resolution;
				const centerY = pixel.y * height / this.resolution;
				// flipped because canvas position works from the top, i work from the bottom
				const centerYFlipped = height - centerY;

				const overlap = 1.42;
				const radius = width * overlap / this.resolution / 2;
	
				context.beginPath();
				context.arc(centerX, centerYFlipped, radius, 0, 2 * Math.PI, false);

				context.fillStyle = this.computeColor(pixel.strength);
				context.fill();	
			});
		}
		
		return html`
		<div class="canvas-container">
			<canvas></canvas>
		</div>
		`;
	}

}
