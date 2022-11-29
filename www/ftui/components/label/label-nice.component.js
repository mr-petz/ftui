/*
* FtuiLabelNice component for FTUI version 3
*
* by mr_petz
*
* Copyright (c) 2019-2020 Mario Stephan <mstephan@shared-files.de>
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*
* https://github.com/knowthelist/ftui
*/

import { FtuiLabel } from './label.component.js';
import { getStylePropertyValue } from '../../modules/ftui/ftui.helper.js';
const sizes = [0.50, 0.75, 0.875, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3];

export class FtuiLabelNice extends FtuiLabel {

  constructor(properties) {
    super(Object.assign(FtuiLabelNice.properties, properties));
    
    this.elementBgColor = this.shadowRoot.querySelector('#color');
    this.slotElement = this.shadowRoot.querySelector('#slot');
    this.spanSlotElement = this.shadowRoot.querySelector('.slot');
  }

  template() {
    return `
      <style>
      :host {
        display: flex;
        --padding-top: 0;
        --padding-bottom: 0;
        --padding-start: 0.5em;
        --padding-end: 0.5em;
        letter-spacing: -.025em;
        --color-base: currentColor;
        color: var(--color-base, #20639b);
      }

      :host .color {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: var(--border-radius);
        padding-top: var(--padding-top);
        padding-bottom: var(--padding-bottom);
        padding-inline-start: var(--padding-start);
        padding-inline-end: var(--padding-end);
        border-width: var(--border-width);
        border-style: var(--border-style);
        border-color: var(--border-color);
      }
      
      :host([horizontal-reverse]) .color {
        flex-direction: column-reverse;
      }
      
      :host([vertical]) .color {
        flex-direction: row;
      }
      
      :host([vertical-reverse]) .color {
        flex-direction: row-reverse;
      }

      /* width-border-size */

      :host([small]) {
        --padding-top: 0;
        --padding-start: 0;
        --padding-end: 0;
        --padding-bottom: 0;
      }

      :host([large]) {
        --padding-top: 0;
        --padding-start: 1em;
        --padding-end: 1em;
        --padding-bottom: 0;
      }

      /* fill */

      :host([fill="outline"]) {
        --border-width: 2px;
        --border-style: solid;
        --border-color: var(--color-base);
        color: var(--color-base);
      }

      :host([fill="outline_color"]) {
        --border-width: 2px;
        --border-style: solid;
        color: var(--color-base);
      }

      /* shape */

      :host([shape="round"]) {
        --border-radius: 0.35em;
      }

      :host([shape="circle"]) {
        --border-radius: 50%;
        --padding-top: 0;
        --padding-start: 0;
        --padding-end: 0;
        --padding-bottom: 0;
      }

      :host([fill="solid"]) .color {
        background: rgba(255, 255, 255, 0.05);
        color: var(--color-base);
      }

      .slot { 
        display: flex;
        justify-content: center;
        height: 40%;
        align-items: center;
      }

      :host(:empty:not([text])) slot[name="unit"],
        :host([text=""]) slot[name="unit"] { visibility: hidden; }

      :host slot[id="slot"] {
        display: flex;
        font-size: initial;
        justify-content: center;
        align-items: center;
      }

      :host slot[name="content"] { justify-content: center; }
      :host slot[name="start"] { display: initial; margin-right: 0.05em; justify-content: center; }
      :host slot[name="unit"], slot[name="end"] { display: initial; margin-left: 0.01em; justify-content: center; }
      </style>

      <span class="color" id="color">
      <slot id="slot"></slot>
      <span class="slot">
        <slot name="start"></slot><slot name="content">${this.text}</slot><slot name="unit">${this.unit}</slot><slot name="end"></slot></span>
      </span>
      `;
  }

  static get properties() {
    return {
      shape: 'normal',
      fill: 'solid',
      rgb: '',
      hex: '',
      size: '',
      br: false,
    };
  }

  static get observedAttributes() {
    return [...this.convertToAttributes(FtuiLabelNice.properties), ...super.observedAttributes];
  }

  onAttributeChanged(name,newValue) {
    switch (name) {
      case 'rgb':
      case 'hex':
      case 'fill':
        if(this.fill !== 'outline_color' && this.fill !== 'outline'){
          this.elementBgColor.style.background = this.hex ? '#' + newValue.replace('#', '') : this.rgb;
        } else {
          this.elementBgColor.style.background = 'transparent';
          if (this.fill === 'outline_color') {
            this.elementBgColor.style.borderColor = this.hex ? '#' + newValue.replace('#', '') : this.rgb;
          }
        }
      break;
    }
    this.elementBgColor.style.fontSize = sizes[this.size]+'rem';
    const span = this.getElementsByTagName('span');
    let spanSize = [span.length];
    for (let i = 0; i < span.length; i++) {
     spanSize[i] = span[i] && span[i].attributes.size ? span[i].attributes.size.value : '';
     span[i].style.fontSize = sizes[spanSize[i]]+'rem';
    }
    let size = Number(getStylePropertyValue('font-size', this.mainSlotElement).replace('px',''))*2.5;
    if (this.innerHTML.includes('ftui')){
      this.slotElement.style.setProperty('height','45%');
      size = size + (this.text ? size*0.33 : 15);
      this.br ? this.slotElement.style.setProperty('display','contents') : '';
      if (!this.text) {
        this.spanSlotElement.remove();
        this.style.setProperty('display','unset');
        this.slotElement.style.setProperty('height','');
      }
    } else {
      this.spanSlotElement.style.setProperty('line-height','1');
    }
    if (this.shape==='circle' && this.text) {
      this.elementBgColor.style.width = this.width ? this.width.replace('px','') + 'px' : size + 'px';
      this.elementBgColor.style.height = this.width ? this.width.replace('px','') + 'px' : size + 'px';
    } else {
       this.elementBgColor.style.width = this.width ? this.width.replace('px','') + 'px' : '';
       this.elementBgColor.style.height = this.height ? this.height.replace('px','') + 'px' : '';
    }
  }
}

window.customElements.define('ftui-label-nice', FtuiLabelNice);
