/*
* Ftui3Local component for FTUI version 3
*
* Developed by mr_petz & OdfFhem
*
* Copyright (c) 2019-2023
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*
* https://github.com/knowthelist/ftui
*/

import { FtuiElement } from '../element.component.js';
import { parseHocon } from '../../modules/hocon/hocon.min.js';

export class FtuiLocal extends FtuiElement {

  constructor(properties) {
    super(Object.assign(FtuiLocal.properties, properties));
  }

  static get properties() {
    return {
      key: '',
      value: '',
      values: '',
    };
  }

  static get observedAttributes() {
    return [...this.convertToAttributes(FtuiLocal.properties), ...super.observedAttributes];
  }

  onAttributeChanged(name) {
    switch (name) {
      case 'key':
      case 'value':
        this.localValueChanged();
        break;
      case 'values':
        this.localValuesChanged();
        break;
    }
  }

  localValueChanged() {
    if ((this.key) && (this.value)) {
      ftuiApp.fhemService.updateReadingItem('local-'+this.key, { value: this.value, });
    };
  }

  localValuesChanged() {
    if (this.values) {
      Object.entries(parseHocon(this.values, true)).forEach(([key,value]) => {
        ftuiApp.fhemService.updateReadingItem('local-'+key, { value: value, });
      });
    };
  }

}

window.customElements.define('ftui-local', FtuiLocal);
