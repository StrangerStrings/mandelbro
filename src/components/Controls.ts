import { css, customElement, html, internalProperty, LitElement, property, TemplateResult } from "lit-element";
import { defaultStyles, materialIcons } from "../defaultStyles";
import { defaultSettings, Settings } from "../Settings";
import { ifDefined } from 'lit-html/directives/if-defined';
import { styleMap } from 'lit-html/directives/style-map';
import { hexToHue } from '../colorUtil'
import { tooltipHelp } from "../tooltipHelp";

type Control = {
  prop: string;
  label?: string;
  step?: number;
  tooltip?: string;
}

/**
 * Control box for changing how you view the mandlebrot set
 */
@customElement("control-panel")
export class Controls extends LitElement{
	static styles = [
		defaultStyles,
    materialIcons,
		css`
      /* containers */
      .container {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 7px;
        padding: 8px 4px 4px;
        border: 3px solid black;
        background: #e9e9e9;
      }

      /* individual controls */
      .control {
        display: flex;
        justify-content: space-between;
      }
      input {
        width: 60px;
        margin-left: 20px;
      }

      /* buttons */
      .button-row {
        display: flex;
        justify-content: space-between;
        margin-top: 2px;
      }
      .material-icons {
        cursor: pointer;
        color: #181818;
      }
      .show-button {
        display: flex;
        justify-content: space-between;
        padding: 7px;
      } 
		`
	];

  
	@property({type: Object}) settings: Settings;
  
  /** Whether all controls are hidden - full screen mode */
  @internalProperty() hidden: boolean = false;


  /** Set initial settings */
  connectedCallback(): void {
    super.connectedCallback();
    
    this.settings = defaultSettings;
    
    this.dispatchEvent(new CustomEvent('changed', {
      detail: {settings: this.settings}
    }));
  }
  

  /** Change a single property and emit event*/
  changeProperty(ev) {
    const id = ev.target.getAttribute('id');
    this.settings[id] = parseFloat(ev.target.value);

    this.dispatchEvent(new CustomEvent('changed', {
      detail: {settings: this.settings}
    }));
  }

  changeColor(ev) {
    const color = ev.target.value
    
    this.settings.color = color
    this.settings.hue = hexToHue(color);

    this.dispatchEvent(new CustomEvent('color-changed', {
      detail: {settings: this.settings}
    }));
  }

  /** Full screen mode */
  toggleHide() {
    this.hidden = !this.hidden;
  }

  reset() {
    this.settings = defaultSettings;
    
    this.dispatchEvent(new CustomEvent('changed', {
      detail: {settings: this.settings}
    }));
  }

  /** Generate a set of inputs, one for each fractal setting */
  renderControls(): TemplateResult[] {
    const controls: Control[] = [
      {prop: 'resolution', step: 20},
      {prop: 'calculations', step: 50}
    ];

    const inputBackground = `hsl(${this.settings.hue}deg 40% 80%)`;

    return controls.map(c => {
      const title = c.label ? c.label : c.prop;

      return html`
        <div class="control">
          <span class="label">
            ${title}
          </span>
          <input type="number" 
            step=${ifDefined(c.step)}
            id=${c.prop}
            title=${c.tooltip}
            @change=${this.changeProperty}
            style=${styleMap({background: inputBackground})}
            .value=${this.settings[c.prop].toString()}>
        </div>
      `;
    });
  }

	render() {
    const background = `hsl(${this.settings.hue}deg 13% 55%)`
    const inputBackground = `hsl(${this.settings.hue}deg 40% 76%)`;

		return html`
      <div class="container"
        style=${styleMap({background})}
        ?hidden=${this.hidden}>

        ${this.renderControls()}

        <div class="control">
          hue 
          <input type="color"
            @change=${this.changeColor}
            .value=${this.settings.color}
            style=${styleMap({background: inputBackground})}
            >
        </div>

        <div class="button-row">
          <span class="material-icons" 
            @click=${this.toggleHide}>
            visibility_off
          </span>
          <span class="material-icons" 
            @click=${this.reset}>
            refresh
          </span>
          <span class="material-icons" 
            title=${tooltipHelp}>
            question_mark
          </span>
        </div>
      </div>

      <div ?hidden=${!this.hidden} class="show-button">
        <span class="material-icons" 
          @click=${this.toggleHide}>
          visibility
        </span>
      </div>
		`;
	}
}
