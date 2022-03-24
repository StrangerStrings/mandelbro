import { css, customElement, html, internalProperty, LitElement, property } from "lit-element";
import { styleMap } from 'lit-html/directives/style-map';
import {classMap} from 'lit-html/directives/class-map.js';
import { defaultStyles, materialIcons } from "../defaultStyles";
import { Settings } from "../Settings";

/**
 * Layer over the mandlebro to zoom in and out and pan all four directions
 */
@customElement("view-finder")
export class ViewFinder extends LitElement{
	static styles = [
		defaultStyles,
    materialIcons,
		css`
			.view-finder {
				position: relative;
				height: 100%;
			}

      .zoom {
        position: absolute;
        height: 100%;
        width: 100%;
        cursor: zoom-in;
      }
      .zoomOut {
        cursor: zoom-out
      }

      .arrow {    
        position: absolute;
        cursor: pointer;
        opacity: 0;
      }
      .arrow:hover {
        opacity: 0.2
      }
      
      .arrow-up {
        top: 0;
        width: 100%;
        border-top: 3vh #000000 solid;
        border-left: 4vh solid transparent;
        border-right: 4vh solid transparent;
      }
      .arrow-down {
        bottom: 0;
        width: 100%;
        border-bottom: 3vh #000000 solid;
        border-left: 4vh solid transparent;
        border-right: 4vh solid transparent;
      }
      .arrow-left {
        left: 0;
        height: 100%;
        border-left: 3vh #000000 solid;
        border-top: 4vh solid transparent;
        border-bottom: 4vh solid transparent;
      }
      .arrow-right {
        right: 0;
        height: 100%;
        border-right: 3vh #000000 solid;
        border-top: 4vh solid transparent;
        border-bottom: 4vh solid transparent;
      }
		`
	];

	@property({type: Object}) settings: Settings;
	
  @internalProperty() zoomOut: boolean = false;
	
  zoomFactor: number = 1.5;
  panFactor: number = 0.33;

  connectedCallback(): void {
    super.connectedCallback();

    window.addEventListener('keydown', this.keydown.bind(this));
    window.addEventListener('keyup', this.keyup.bind(this));
  }

  keydown(ev) {
    if (ev.shiftKey) {
      this.zoomOut = true;
    }
  }
  keyup(ev) {
    if (!ev.shiftKey) {
      this.zoomOut = false;
    }
  }
  
  /** returns mouse x & y as ratio of the view */
	calculateMousePosition(ev) {
		var bounds = ev.target.getBoundingClientRect();

		var sizeX = bounds.right - bounds.left;
		var sizeY = bounds.bottom - bounds.top;
		
		const posX = ev.clientX - bounds.left;
    const posY = ev.clientY - bounds.top;

		const ratioX = posX/sizeX;
		const ratioY = posY/sizeY;
		const ratioYReversed = ((ratioY - 0.5) * -1) + 0.5;	

		return {
			x: ratioX,
			y: ratioYReversed
		};
	}

	zoomIn(ev) {
		const mouse = this.calculateMousePosition(ev);
    
    let zoom = this.zoomFactor;
    if (this.zoomOut) {
      zoom = Math.pow(zoom, -1);
    }
    
		const settings = this.settings;

		const centerReal = mouse.x * settings.rangeReal + settings.startReal;
		
		const realDistance = settings.rangeReal / zoom;
		const startReal = centerReal - realDistance/2;
		const endReal = centerReal + realDistance/2;

		const centerImag = mouse.y * settings.rangeImag + settings.startImag;

		const imagDistance = settings.rangeImag / zoom;
		const startImag = centerImag - imagDistance/2;
		const endImag = centerImag + imagDistance/2;

		this.settings = {
			...this.settings,
			startReal,
			endReal,
			rangeReal: realDistance,
			startImag,
			endImag,
			rangeImag: imagDistance
		};

    this.dispatchEvent(new CustomEvent('changed', {
      detail: {settings: this.settings}
    }));
	}


  arrowPress(ev) {
    const direction = ev.target.getAttribute("direction");

    if (direction == 'up') {
      this.pan(undefined, this.panFactor);
    }
    if (direction == 'down') {
      this.pan(undefined, -this.panFactor);
    }
    if (direction == 'left') {
      this.pan(-this.panFactor, undefined);
    }
    if (direction == 'right') {
      this.pan(this.panFactor, undefined);
    }
    
  }

  pan(xPan: number|undefined, yPan: number|undefined) {
    const settings = this.settings;
		
    if (xPan) {
      const realPan = settings.rangeReal * xPan;
      const startReal = settings.startReal + realPan;
      const endReal = settings.startReal + realPan;
      
      this.settings = {
        ...this.settings,
        startReal,
        endReal
      };
    }
    
    if (yPan) {
      const imagPan = settings.rangeImag * yPan;
      const startImag = settings.startImag + imagPan;
      const endImag = settings.startImag + imagPan;
  
      this.settings = {
        ...this.settings,
        startImag,
        endImag
      };
    }

    this.dispatchEvent(new CustomEvent('changed', {
      detail: {settings: this.settings}
    }));
  }


	render() {
    const zoomClass = {
      zoom: true,
      zoomOut: this.zoomOut
    };

		return html`
      <div class="view-finder">

			  <div class=${classMap(zoomClass)}
          @click=${this.zoomIn}
        ></div>

        <div class="arrow arrow-up"
          direction="up"
          @click=${this.arrowPress}
        ></div>
        <div class="arrow arrow-down"
          direction="down"
          @click=${this.arrowPress}
        ></div>
        <div class="arrow arrow-left"
          direction="left"
          @click=${this.arrowPress}
        ></div>
        <div class="arrow arrow-right"
          direction="right"
          @click=${this.arrowPress}
        ></div>

			</div>
		`;
	}

}
