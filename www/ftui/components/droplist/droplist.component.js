/*
* Droplist component for FTUI version 3
*
* by mr_petz
*
* initial Mario Stephan <mstephan@shared-files.de>
*
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*
* https://github.com/knowthelist/ftui
*/

import { FtuiElement } from '../element.component.js';

export class FtuiDropList extends FtuiElement {
  constructor(properties) {

    super(Object.assign(FtuiDropList.properties, properties));

    this.label = this.shadowRoot.querySelector('.label');
    this.drop = this.shadowRoot.querySelector('.drop');
    this.selectElement = this.shadowRoot.querySelector('.list');
    this.dropOverlay = this.shadowRoot.querySelector('.overlay');
    if (this.list.length > 0 ) {
      this.fillList();
    }
    this.label.addEventListener('mousedown', () => this.showList());
    this.selectElement.addEventListener('click', () => this.toggleShow());
    this.dropOverlay.addEventListener('click', () => this.toggleShow());
  }

  template() {
    return `
      <style>
      :host {
        width: 100%;
      }

      .label {
        position: relative;
        width: max-content;
        cursor: pointer;
        margin-left: 2px;
        color: var(--droplist-text-color, var(--text-color));
        background-color: var(--label-background-color, var(--grid-background-color));
        z-index: 0;
      }
 
      :host([border]) .label{
        border: solid var(--droplist-text-color, var(--text-color));
        border-radius: 5px;
        padding: 2px;
        border-width: 1px;
      }

      .drop {
        position: absolute;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        padding-top: 2px;
        visibility: hidden;
      }

      .drop .list {
        position: absolute;
        visibility: hidden;
        width: auto;
        height: 100%;
        padding: 0 1% 1% 1%;
        background-color: var(--droplist-background-color, var(--gray));
        color: var(--droplist-text-color, var(--text-color));
        border-radius: 5px;
        left: 0;
        overflow-y: scroll;
        overflow-x: hidden;
        scrollbar-width: none;
        -ms-overflow-style: none;
        cursor: pointer;
        z-index: 2;
      }

      ::-webkit-scrollbar {
        width: 0px;
        -webkit-border-top-right-radius: 1em;
        -webkit-border-bottom-right-radius: 1em;
        background: var(--droplist-background-color, var(--gray));
      }

      .drop .overlay {
        visibility: hidden;
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        opacity: 0;
        z-index: 1;
      }

      .drop .show {
        visibility: visible;      
        -webkit-animation: fadeIn 0.3s;
        animation: fadeIn 0.3s;
      }

      .caret {
        color: var(--droplist-text-color, var(--text-color));
        display: inline-block;
        margin-left: 0;
        width: 0;
        height: 0;
        vertical-align: middle;
        border-top: 4px dashed;
        border-top: 4px solid;
        border-right: 4px solid transparent;
        border-left: 4px solid transparent;
        cursor: pointer;
      }

      .select {
        border-bottom: 1px solid;
        padding: 2% 5px 2% 5px;
        width: 100%;
        display: block;
        border-color: var(--droplist-line-color, rgba(0,0,0,0.2));
      }

      @-webkit-keyframes fadeIn {
        from {opacity: 0;}
        to {opacity: 1;}
      }

      @keyframes fadeIn {
        from {opacity: 0;}
        to {opacity:1 ;}
      }

      </style>
      <div class="label">
        <span class="caret"></span>
      </div>
      <div class="drop">
        <span class="list"></span>
        <span class="overlay"></span>
      </div>
      `;
  }

  static get properties() {
    return {
      list: '',
      value: '',
      delimiter: '[;,:|]',
      name: 'Droplist',
      width: 'max-content',
      height: '80px',
      left: '',
      timeout: 60,
      overflow: false,
    };
  }

  static get observedAttributes() {
    return [...this.convertToAttributes(FtuiDropList.properties), ...super.observedAttributes];
  }

  onConnected() {
    this.selectElement.style.width = this.width;
    this.drop.style.height = this.height;
    this.label.style.left = this.left;
    this.drop.style.left = this.left;  
  }

  onAttributeChanged(name) {
    switch (name) {
      case 'list':
        this.fillList();
        break;
      case 'value':
      case 'name':
        this.label.innerHTML = (this.value?this.value+' <span class="caret"></span>':this.name+' <span class="caret"></span>');
        break;
    }
  }

  onClick(item) {
    this.submitChange('value', item);
  }

  showList() {
    if (this.label.offsetParent.offsetHeight < (this.drop.offsetHeight+this.drop.offsetTop)) {
     this.selectElement.style.top = '-'+(parseInt(this.height)+this.label.offsetHeight+2)+'px';
    }
    if (this.offsetParent.offsetWidth-this.selectElement.offsetWidth-this.label.offsetLeft < 0 && this.selectElement.offsetWidth < this.offsetParent.offsetWidth) {
     this.drop.style.left = this.offsetParent.offsetWidth-this.selectElement.offsetWidth-1+'px';
    } else {
     if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
       this.drop.style.left = this.left;
     } else {
     this.drop.style.left = (this.label.offsetLeft+1)+'px';
     }
    }
    this.selectElement.classList.toggle('show');
    this.dropOverlay.classList.toggle('show');
    this.overflow ? this.offsetParent.style.setProperty('overflow','unset') : '';
    this.startTimeout();
  }

  toggleShow() {
    this.selectElement.classList.toggle('show');
    this.dropOverlay.classList.toggle('show'); 
    this.offsetParent.style.setProperty('overflow','hidden');
  }

  fillList() {
    const splitter = this.delimiter.length === 1 ? this.delimiter : new RegExp(this.delimiter);
    const list = String(this.list).split(splitter);
    this.selectElement.length = 0;
    this.selectElement.innerHTML = '';
    if (this.selectElement.childElementCount<list.length){
     list.forEach(item => {
       const opt = document.createElement('span');
       opt.textContent = item;
       opt.className = 'select';
       opt.addEventListener('click', () => this.onClick(item));
       this.selectElement.appendChild(opt);
     });
    }
    this.label.innerHTML = (this.value?this.value+' <span class="caret"></span>':this.name+' <span class="caret"></span>');
  }

  startTimeout() {
    clearTimeout(this.timer);
    if (this.timeout) {
      this.timer = setTimeout(() => {
       this.selectElement.classList.remove('show');
       this.dropOverlay.classList.remove('show'); 
       this.offsetParent.style.setProperty('overflow','hidden');       
      }, this.timeout * 1000);
    }
  }

}

window.customElements.define('ftui-droplist', FtuiDropList);
