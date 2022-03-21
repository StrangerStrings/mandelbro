import { css, customElement, html, internalProperty, LitElement, property, TemplateResult } from "lit-element";
import { defaultStyles, materialIcons } from "../defaultStyles";
import { defaultSettings, Settings } from "../Settings";
import { ifDefined } from 'lit-html/directives/if-defined';

const localSavedSettingsKey = 'savedFractalSettings';

type Control = {
  prop: string;
  title?: string;
  step?: number;
  angleFunction?: boolean;
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
        gap: 3px;
        padding: 5px;
        border-radius: 8px;
        border: 2px solid #858585;
        background: #e1e1e1;
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
  
  /** index of selected? default settings */
  @internalProperty() seletedDefault?: number = 0;
  /** index of selected? custom settings */
  @internalProperty() seletedCustom?: number;
  /** True if neither default nor custom setting are picked */
  @internalProperty() newSettings: boolean = false;
  
  /** Array of saved custom settings */
  @internalProperty() customSettings: Settings[] = [];
  /** Whether to show color controls */
  @internalProperty() showColorControl: boolean = false;
  /** slow down color picker @input event */
  colorChangeDebounce: boolean = false;
  
  /** Whether all controls are hidden - full screen mode */
  @internalProperty() hidden: boolean = true;


  /** Set initial settings and retreive custom from local */
  connectedCallback(): void {
    super.connectedCallback();
    
    this.settings = defaultSettings[this.seletedDefault];
    this.emitSettingsChangedEvent();

    const savedSettings = localStorage.getItem(localSavedSettingsKey);
    if (savedSettings) {
      this.customSettings = JSON.parse(savedSettings);
    }
  }

  /** Emit event with current settings and optionally set varius 'new settings' properties */
  emitSettingsChangedEvent(isNewSettings?: boolean): void {
    this.dispatchEvent(new CustomEvent('changed', {
      detail: {settings: this.settings}
    }));

    if (isNewSettings) {
      this.newSettings = true;
      this.seletedCustom = undefined;
      this.seletedDefault = undefined;
    }
  }

  /** Change a single property and emit event*/
  changeProperty(ev) {
    const id = ev.target.getAttribute('id');
    this.settings[id] = parseFloat(ev.target.value);
    this.emitSettingsChangedEvent(true);
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
  
  // addNewColor() {
  //   this.settings.colors.push('#ffffff');
  //   this.emitSettingsChangedEvent(true);
  // }
  // deleteColor(ev) {
  //   if (this.settings.colors.length == 1) {
  //     return;
  //   }
  //   const id = ev.target.getAttribute('id');
  //   const idx = parseInt(id.replace("color-", ""));

  //   this.settings.colors.splice(idx, 1);

  //   this.emitSettingsChangedEvent(true);
  // }

  // /** Choose a new settings object from dropdown of 'defaults' and 'customs' */
  // pickNewSettings(ev) {
  //   const newSettingsValue = ev.target.value as string;
    
  //   if (newSettingsValue.includes("default-")) {
  //     const idx = parseInt(newSettingsValue.replace("default-", ""));
  //     this.settings = defaultSettings[idx];
  //     this.emitSettingsChangedEvent();

  //     this.newSettings = false;
  //     this.seletedCustom = undefined;
  //     this.seletedDefault = idx;
  //   }
    
  //   if (newSettingsValue.includes("custom-")) {
  //     const idx = parseInt(newSettingsValue.replace("custom-", ""));
  //     this.settings = this.customSettings[idx];
  //     this.emitSettingsChangedEvent();

  //     this.newSettings = false;
  //     this.seletedCustom = idx;
  //     this.seletedDefault = undefined;
  //   }
  // }

  // /** Save current 'new settings' as custom set in local storage */
  // saveSettings() {
  //   this.customSettings.push({...this.settings});
  //   this.customSettings = [...this.customSettings];

  //   this.newSettings = false;
  //   this.seletedCustom = this.customSettings.length - 1;
    
  //   localStorage.setItem(
  //     localSavedSettingsKey, 
  //     JSON.stringify(this.customSettings)
  //   );
  // }
  // /** Delete current custom settings */
  // deleteSettings() {
  //   if (this.seletedCustom == undefined) {
  //     return;
  //   }

  //   this.customSettings.splice(this.seletedCustom, 1);
  //   this.customSettings = [...this.customSettings];

  //   localStorage.setItem(
  //     localSavedSettingsKey, 
  //     JSON.stringify(this.customSettings)
  //   );

  //   this.emitSettingsChangedEvent(true);
  // }
  /** Full screen mode */
  toggleHide() {
    this.hidden = !this.hidden;
  }

  /** Generate a set of inputs, one for each fractal setting */
  // renderControls(): TemplateResult[] {
  //   const controls: Control[] = [
  //     {prop: 'amount'},
  //     {prop: 'layers'},
  //     {prop: 'angle', angleFunction: true},
  //     {prop: 'sway'},
  //     {prop: 'syncopation', title: 'syncopate'},
  //     {prop: 'size'},
  //     {prop: 'thinness'},
  //     {prop: 'shrinking', title: 'shrink', step: 0.005},
  //     {prop: 'forkPosition', title: 'fork pos', step: 0.05}
  //   ];

  //   return controls.map(c => {
  //     const title = c.title ? c.title : c.prop;
  //     const onChange = c.angleFunction ? this.changeAngle : this.changeProperty;

  //     return html`
  //       <div class="control">
  //         ${title}
  //         <input type="number" 
  //           step=${ifDefined(c.step)}
  //           id=${c.prop}
  //           @change=${onChange}
  //           .value=${this.settings[c.prop].toString()}>
  //       </div>
  //     `;
  //   });
  // }

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

  /** Render dropdown options for default, custom and new sets of settings */
  // renderSettingsOptions(): TemplateResult[] {
  //   const defaultOptions = Array.from(
  //     {length: defaultSettings.length},
  //     (_, idx) => html`
  //       <option
  //         value="default-${idx}"
  //         ?selected=${this.seletedDefault == idx}
  //         >Default ${idx+1}
  //       </option>
  //     `);

  //   const customOptions = Array.from(
  //     {length: this.customSettings.length},
  //     (_, idx) => html`
  //       <option
  //         value="custom-${idx}"
  //         ?selected=${this.seletedCustom == idx}
  //         >Custom ${idx+1}
  //       </option>
  //     `);

  //   const newOption = this.newSettings ? 
  //     html`<option value="new" selected>New Custom</option>` : undefined;

  //   return [
  //     ...defaultOptions,
  //     ...customOptions,
  //     newOption
  //   ];
  // }

	render() {
		return html`
      <div class="container"
        ?hidden=${this.hidden}>

        <div class="button-row">
          <span class="material-icons" 
            @click=${this.toggleHide}>
            visibility_off
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
