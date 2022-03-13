/*
* SonosFavRG component for FTUI version 3
*
* by mr_petz
*
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*
* https://github.com/knowthelist/ftui
*/

import { FtuiContent } from './content.component.js';

export class FtuiContentSonosFavRG extends FtuiContent {

  constructor(properties) {
    super(Object.assign(FtuiContentSonosFavRG.properties, properties));
    this.drop = this.shadowRoot.querySelector('.label');
    this.dropList = this.shadowRoot.querySelector('.list');
    this.dropOverlay = this.shadowRoot.querySelector('.overlay');
    this.drop.addEventListener('click', () => this.showList());
    this.dropList.addEventListener('click', () => this.showList());
    this.dropOverlay.addEventListener('click', () => this.showList());
  }

  template() {
    return `
      <style>
      :host {
        width: 100%;
      }

      .label {
        cursor: pointer;
        margin-left: 2px;
        color: var(--text-color);
      }

      .drop {
        position: absolute;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        width: 90%;
        left: 5%;
        height: 160px;
      }

      .drop .list {
        position: absolute;
        visibility: hidden;
        width: 100%;
        height: 100%;
        background-color: var(--grid-background-color);
        text-align: center;
        border-radius: 5px;
        left: 0;
        top: 5%;
        overflow: scroll;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
        -ms-overflow-style: none;
        cursor: pointer;
        z-index: 9999;
      }

      .drop .overlay {
        visibility: hidden;
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        opacity: 0;
        z-index: 9998;
      }

      .drop .show {
        visibility: visible;      
        -webkit-animation: fadeIn 1s;
        animation: fadeIn 1s;
      }

      .caret {
        color: var(--text-color);
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

      @-webkit-keyframes fadeIn {
        from {opacity: 0;}
        to {opacity: 1;}
      }

      @keyframes fadeIn {
        from {opacity: 0;}
        to {opacity:1 ;}
      }
      </style>
      <div class="label">${this.label}
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
      label: 'FavSonos',
      content: '',
      logowidth: '70',
      logoheight: '70',    
    };
  }

  static get observedAttributes() {
    return [...this.convertToAttributes(FtuiContentSonosFavRG.properties), ...super.observedAttributes];
  }

  onAttributeChanged(newValue, oldValue) {
    if (oldValue !== newValue) {
      switch (newValue) {
        case 'content':
          const deviceName = this.binding.getReadingsOfAttribute('content')[0].split('-');
          const regexp = /informid="(\w*)-item:1:1"/gi;
          const rgName = regexp.exec(this.content);
          const sonosList = rgName[1].split('_').pop();
          const replaceString ="onclick=\"FW_cmd('/fhem?XHR=1&cmd."+deviceName[0]+"%3Dset%20"+deviceName[0]+"%20";
          const setString ='><ftui-label style="display:block;" width="'+this.logowidth+'px" '+(sonosList==='Playlists'?'':'height="'+this.logoheight+'px"')+' @click="sendFhem(\''+'set '+deviceName[0]+' ';
          const logoSize ='width: '+this.logowidth+'px; height: '+this.logoheight+'px;';
          this.dropList.innerHTML = this.content.replaceAll(replaceString,setString).replace(/%20/g,' ').replace(/%2520/g,'%20').replace(/%2528/g,'%28').replace(/%2529/g,'%29').replace(/width\: 70px\; height\: 70px\;/g,logoSize);
          const view = 'div[informid="'+rgName[1]+'-item:1:1"]';
          this.dropList.innerHTML=this.dropList.querySelector(view).innerHTML;
        break;
      }
    }
  }

  showList() {
    this.dropList.classList.toggle('show');
    this.dropOverlay.classList.toggle('show');
  }
}

window.customElements.define('ftui-content-sfav', FtuiContentSonosFavRG);
