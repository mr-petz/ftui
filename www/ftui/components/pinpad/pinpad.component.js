
/*
* PinPad component for FTUI version 3
*
* Developed and Designed by mr_petz
*
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*
* https://github.com/knowthelist/ftui
*/

import { FtuiElement } from '../element.component.js';
import { fhemService } from '../../modules/ftui/fhem.service.js';
import { triggerEvent } from '../../modules/ftui/ftui.helper.js';
let startClick = 0;

export class FtuiPinPad extends FtuiElement {

  constructor(properties) {
    super(Object.assign(FtuiPinPad.properties, properties));

    this.enter = this.shadowRoot.querySelector('.enter');
    this.enter.addEventListener("click", () => this.setEnter());
    this.setpin = this.shadowRoot.querySelector('.PINpad');
    this.setpin.addEventListener("click", v => this.setPin(v));

    // add a long-press event listener for clear all
    this.clear = this.shadowRoot.querySelector('.clear');
    this.clear.addEventListener("touchstart", e => this.setClear(e));
    this.clear.addEventListener("mousedown", e => this.setClear(e));
    this.clear.addEventListener("touchend", e => this.setClear(e));
    this.clear.addEventListener("mouseup", e => this.setClear(e));

    this.pinform = this.shadowRoot.querySelector('.PINform');
    this.shake = this.shadowRoot.querySelector('.content');
    this.shakedot = this.shadowRoot.querySelector('.PINbox');
    this.overlayScreen = this.shadowRoot.querySelector('.overlay');
    this.pinname = this.shadowRoot.querySelector('.PINname');
  }

  template() {
    return `
      <style> @import "components/pinpad/pinpad.component.css";</style>
      <div class="overlay">
        <div class="content">
          <form action="" method="" name="PINform" id="PINform" autocomplete="off" class="PINform">
            <div class="PINname" name="PINname">${this.name}</div>
            <input class="PINbox" id="PINbox" type="password" name="pinbox" value="" disabled></input>
              <div class="PINpad">
                <input type="button" class="PINbutton flatbutton" name="1" value="1" id="1" />
                <input type="button" class="PINbutton flatbutton" name="2" value="2" id="2" />
                <input type="button" class="PINbutton flatbutton" name="3" value="3" id="3" />
                <input type="button" class="PINbutton flatbutton" name="4" value="4" id="4" />
                <input type="button" class="PINbutton flatbutton" name="5" value="5" id="5" />
                <input type="button" class="PINbutton flatbutton" name="6" value="6" id="6" />
                <input type="button" class="PINbutton flatbutton" name="7" value="7" id="7" />
                <input type="button" class="PINbutton flatbutton" name="8" value="8" id="8" />
                <input type="button" class="PINbutton flatbutton" name="9" value="9" id="9" />
                <input type="button" class="clear flatbuttonc" name="clear" value="&#10060;" id="clear" />
                <input type="button" class="PINbutton flatbutton" name="0" value="0" id="0" />
                <input type="button" class="enter flatbuttone" name="enter" value="&#9166;" id="enter" />
              </div>
          </form>
      </div>
    </div> 
    `;
  }

  static get properties() {
    return {
    name:'PinPad',
    left: '40%',
    top: '22%',
    width: '260px',
    height: '',
    bgcolor: '',
    txtcolor: '',
    dotcolor: '',
    fsize: '',
    fsizeb: '',
    fullscreen: '',
    overlay: '75',
    pin: '',
    device: '',
    hidden: true,
    open: false,
    trigger: '',
    set: '',
    noshake: false,
    };
  }

  static get observedAttributes() {
    return [...this.convertToAttributes(FtuiPinPad.properties), ...super.observedAttributes];
  }

  onAttributeChanged(name, newValue) {
    switch (name) {
    case 'pin':
      this.getPin();
    break;
    case 'open':
      this.setState(newValue !== null);
    break;
    case 'trigger':
      if (this.isInitialized && !this.disabled) {
        this.setState(true);
      }
      this.isInitialized = true;
    break;
    }
    this.arrangeWindow();
  }
  
  arrangeWindow() {
    this.pinform.style.left = this.left;
    this.pinform.style.top = this.top;
    this.pinform.style.width = this.width.includes('%') ? this.width : this.width.replace('px','') + 'px';
    this.pinform.style.height = this.width.includes('%') ? this.height : (this.width.replace('px','') * 1.499) + 'px';
    this.setpin.style.setProperty('font-size','var(--pinpad-fsizeb, calc('+this.width+'*'+(this.width.includes('%') ? 25 : 0.175)+'))');
    this.pinform.style.background = this.bgcolor;
    this.pinform.style.setProperty('--pinpad-txtcolor', this.txtcolor);
    this.pinname.style.fontSize = this.fsize;
    this.pinform.style.fontSize = this.fsizeb;
    this.shakedot.style.color = this.dotcolor;
    if (this.hasAttribute('fully')) {
      this.overlayScreen.style.left = this.fullscreen;
      this.readonly;
    }
    if (this.getAttribute('overlay')!==''&&!this.hasAttribute('fully')) {
      this.overlayScreen.style.left = this.overlay;
      this.readonly;
    }
    if (this.hasAttribute('flat')) {
      this.pinform.className = 'flatform';
      this.shakedot.className = 'flatbox';
      this.pinname.className = 'flatname';
      this.readonly;
    }
    this.readonly;
  }

  setState(value) {
    if (value) {
      this.removeAttribute('hidden');
      triggerEvent('ftuiVisibilityChanged');
    } else {
      this.setAttribute('hidden', '');
      this.emitEvent('close');
    }
  }

  getPin() {
    this.getpin = this.pin;
  }

  setPin(v) {
    if (v.target.name!=='clear' && v.target.name!=='enter') {
      this.shakedot.value += v.target.value;
    }
  }

  setClear(e) {
    if (e.type === "mousedown") {
      startClick = e.timeStamp;
    } else if(e.type === "mouseup" && startClick > 0) {
      if (e.timeStamp - startClick > 500) {
        this.shakedot.value = '';
      } else {
        this.shakedot.value = this.shakedot.value.slice(0,this.shakedot.value.length-1);
      }
    }
  }

  setEnter() {
    clearTimeout(this.timer);
    //let device = this.binding.getReadingsOfAttribute('device');
    this.pinbox = this.shakedot.value;
      if (this.pin === this.pinbox && this.getAttribute('set')==='') {
        this.setClear(true);
        this.device = 'off';
        this.submitChange('device',this.device);
        this.hidden = true;
        this.shakedot.value = '';
      };
      if (this.pin === this.pinbox && this.getAttribute('set')!=='') {
        this.setClear(true);
        this.device = 'off';
        this.submitChange('device',this.device);
        //this.submitChange('set',this.set);
        fhemService.sendCommand('set ' + this.set);
        this.hidden = true;
        this.shakedot.value = '';
      };
      if (this.pin !== this.pinbox && !this.hasAttribute('flat')) {
        this.shakedot.className = 'dots';
        if (!this.noshake){
        this.shake.className = 'shake-false-pin';
        }
        this.timer = setTimeout(()=>{this.shake.className = 'content'; this.shakedot.className = 'PINbox'; this.shakedot.value = '';}, 500);
      };
      if (this.pin !== this.pinbox && this.hasAttribute('flat')) {
        this.shakedot.className = 'dots';
        if (!this.noshake){
        this.shake.className = 'shake-false-pin';
        }
        this.timer = setTimeout(()=>{this.shake.className = 'content'; this.shakedot.className = 'flatbox'; this.shakedot.value = '';}, 500);
      };
  }
}

window.customElements.define('ftui-pinpad', FtuiPinPad);
