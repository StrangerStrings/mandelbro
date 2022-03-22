import { css, customElement, html, internalProperty, LitElement, property, TemplateResult } from "lit-element";
import { defaultStyles, materialIcons } from "../defaultStyles";
import { defaultSettings, Settings } from "../Settings";
import { ifDefined } from 'lit-html/directives/if-defined';

const localSavedSettingsKey = 'savedFractalSettings';

type Control = {
  prop: string;
  label?: string;
  step?: number;
  tooltip?: string;
}

/**
 * Control box for changing the all fractal's settings,
 * and setting/saving custom and default sets
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
      }
      .container, .color-container {
        display: flex;
        flex-direction: column;
        gap: 7px;
        padding: 8px 4px 4px;
        border: 3px solid black;
        background: #e9e9e9;
      }
      .color-container {
        position: absolute;
        right: -70%;
        top: 0px;
        width: 60%;
        height: 100%;
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

      /* color controls */
      .toggle-color {
        cursor: pointer;
      }
      .color-container input {
        margin: 0;
      }
      .control.control-add {
        flex: 1;
      }

      /* buttons */
      .button-row {
        display: flex;
        justify-content: space-between;
        margin-top: 2px;
      }
      .material-icons {
        cursor: pointer;
        color: #505050;
      }
      .show-button {
        display: flex;
        justify-content: space-between;
        padding: 7px;
      } 

      /* misc */
      hr {
        margin: 3px 9px 2px;
      }
		`
	];

  
	@property({type: Object}) settings: Settings;
  
  /** Whether all controls are hidden - full screen mode */
  @internalProperty() hidden: boolean = false;
  
  /** Whether to show color controls */
  @internalProperty() showColorControl: boolean = false;

  /** slow down color picker @input event */
  colorChangeDebounce: boolean = false;
  

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

  createSet() {
  }

  // toggleColorControl() {
  //   this.showColorControl = !this.showColorControl;
  // }
  // /** Change single value in the colors array */
  // changeColor(ev) {
  //   if (this.colorChangeDebounce) {
  //     return;
  //   }
  //   this.colorChangeDebounce = true;
  //   setTimeout(() => { this.colorChangeDebounce = false}, 50);

  //   const id = ev.target.getAttribute('id');
  //   const idx = parseInt(id.replace("color-", ""));

  //   const color = ev.target.value;
  //   this.settings.colors[idx] = color;

  //   console.log('changing');
    
  //   this.emitSettingsChangedEvent(true);
  // }
  // changeBackgroundColor(ev) {
  //   if (this.colorChangeDebounce) {
  //     return;
  //   }
  //   this.colorChangeDebounce = true;
  //   setTimeout(() => { this.colorChangeDebounce = false}, 50);
    
  //   const color = ev.target.value;
  //   this.settings.backgroundColor = color;

  //   this.emitSettingsChangedEvent(true);
  // }
  
  /** Full screen mode */
  toggleHide() {
    this.hidden = !this.hidden;
  }

  reset() {
    this.settings = defaultSettings
    this.createSet()
  }

  /** Generate a set of inputs, one for each fractal setting */
  renderControls(): TemplateResult[] {
    const controls: Control[] = [
      {prop: 'resolution', step: 20},
      {prop: 'discrepency', step: 50}
    ];

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
            .value=${this.settings[c.prop].toString()}>
        </div>
      `;
    });
  }

  /** Render colour picker inputs for each fractal color and background */
  // renderColorControls(): TemplateResult {
  //   const colorsInputs = this.settings?.colors.map((col, idx) =>
  //     html`
  //     <div class="control">
  //       <input type="color" 
  //         id="color-${idx}"
  //         @input=${this.changeColor}
  //         value=${col}>
  //       <span class="material-icons"
  //         id="color-${idx}"
  //         @click=${this.deleteColor}>
  //         close
  //       </span>
  //     </div>`
  //   );

  //   return html`
  //     ${colorsInputs}
  //     <div class="control control-add">
  //       <div></div>
  //       <span class="material-icons"
  //         @click=${this.addNewColor}>
  //         add
  //       </span>
  //     </div>
  //     <hr>
  //     <div class="control">
  //       <input type="color"
  //         @input=${this.changeBackgroundColor}
  //         value=${this.settings.backgroundColor}>
  //     </div>
  //   `;
  // }

	render() {
		return html`
      <div class="container"
        ?hidden=${this.hidden}>

        ${this.renderControls()}

        <div class="button-row">
          <span class="material-icons" 
            @click=${this.toggleHide}>
            visibility_off
          </span>
          <span class="material-icons" 
            @click=${this.reset}>
            add
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
