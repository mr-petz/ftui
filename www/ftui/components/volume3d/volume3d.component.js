/*
* Volume3d component for FTUI version 3
*
* by mr_petz
*
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*
* https://github.com/knowthelist/ftui
*/

import { FtuiElement } from '../element.component.js';
//import { fhemService } from '../../modules/ftui/fhem.service.js';

export class FtuiVolume3D extends FtuiElement {
  constructor(properties) {

  super(Object.assign(FtuiVolume3D.properties, properties));
    this.newValue=0;
    this.rgbgradient =[];
    this.timer = null;
    this.knobs = this.shadowRoot.querySelector('.knob-surround');
    this.knob = this.shadowRoot.querySelector('.knob');
    this.currentValue = this.shadowRoot.querySelector('.current-value');
    this.ticks = this.shadowRoot.querySelector('.ticks');
    this.grip = this.shadowRoot.querySelector('.grip');
    this.txt = this.shadowRoot.querySelector('.scale');
    this.knob.addEventListener('touchend', () => this.onClick()&(!this.hasScaleText?this.onToolTip()&this.onToolTipTimeOut():''));
    this.knob.addEventListener('mouseup', () => this.onClick()&(!this.hasScaleText?this.onToolTip()&this.onToolTipTimeOut():''));
    this.knob.addEventListener('mousemove', () => this.knobs.getBoundingClientRect()&this.startDrag()&(!this.hasScaleText?this.onToolTip()&this.onToolTipTimeOut():''));
    this.knob.addEventListener('touchmove', () => this.knobs.getBoundingClientRect()&this.startDrag()&(!this.hasScaleText?this.onToolTip()&this.onToolTipTimeOut():''));
    (this.readonly ? this.knob.style.setProperty('pointer-events', 'none') : '');
    (this.step<=0 ? this.step=0.01 : this.step);
  }

  template() {
    return `
        <style>@import "components/volume3d/volume3d.component.css";</style>
        <div class="knob-surround">        
          <div class="knob">
            <div class="grip"></div>
          </div>
          <span class="min">${(parseInt(this.getAttribute('rotation'))===0&&!this.hasScaleText ? this.min : '')}</span>
          <span class="max">${(parseInt(this.getAttribute('rotation'))===0&&!this.hasScaleText ? this.max : '')}</span>
          <div class="ticks"></div>
          <div class="scale"></div>
          <span class="current-value">${(!this.hasScaleText?this.value:'')}</span>
        </div>
      
      `;
  }

  static get properties() {
    return {
      value: 0,
      min: 0,
      max: 100,
      tick: 50,
      wideTick: 100,
      size: 125,
      step: 0,
      degrees: 260,
      rotation: 0,
      unit: '%',
      movegradient: 2,
      hasScaleText: false,
      hasGradient: false,
      hasRgbGradient: false,
      hasSilver: false,
      readonly: false,
      lowcolor:'0,255,0',
      mediumcolor:'255,136,0',
      highcolor:'255,0,0',
      trigger: false,
      tofixed: 0,
    };
  }

  static get observedAttributes() {
    return [...this.convertToAttributes(FtuiVolume3D.properties), ...super.observedAttributes];
  }
  
  onConnected() {
    this.startAngle = Math.round((360-this.degrees+this.rotation) / 2);
    this.endAngle = Math.round(this.startAngle+this.degrees);
    this.tickstyle();
  }

  onAttributeChanged(name) {
    switch (name) {
    case 'value':
      this.newValue=(this.value.toFixed(this.tofixed)<=this.max?this.value.toFixed(this.tofixed):this.max);
      this.startAngle = Math.round((360-this.degrees+this.rotation) / 2);
      this.endAngle = Math.round(this.startAngle+this.degrees);
      const angle = ((this.newValue - this.min) * (this.endAngle-this.startAngle) / (this.max - this.min) - (this.endAngle-this.startAngle)) + this.endAngle;
      this.setAngle(angle);
      (!this.hasScaleText?this.onToolTip()&this.onToolTipTimeOut():'');
    break;
    case 'trigger':
      this.setState(true);
    break;
    }
  }

  tickstyle ()  {
    this.ticks.innerHTML = '';
    this.txt.innerHTML = '';
    let i = -1 ;
    let ticks = [];
    let incr = this.degrees / this.tick;
    const top = Math.round(this.size * 0.65);
    this.knobs.style.setProperty('width', (this.hasSilver?(this.size+10):this.size) + "px");
    this.knobs.style.setProperty('height', (this.hasSilver?(this.size+10):this.size) + "px");
    (this.hasSilver?this.knobs.classList.remove('knob-surround')&this.knobs.classList.add('knob-surround-silver')&this.knob.classList.add('knob-silver'):'');
    this.knobs.style.setProperty('font-size', this.size*0.012 + "em");
  
    const low=this.lowcolor.split(',');
    const medium=this.mediumcolor.split(',');
    const high=this.highcolor.split(',');
    const lowColor = {
      red: parseInt(low[0]),
      green: parseInt(low[1]),
      blue: parseInt(low[2])
    };
    const mediumColor = {
      red: parseInt(medium[0]),
      green: parseInt(medium[1]),
      blue: parseInt(medium[2])
    };
    const highColor = {
      red: parseInt(high[0]),
      green: parseInt(high[1]),
      blue: parseInt(high[2])
    };
    let rgbColor1=lowColor;
    let rgbColor2=mediumColor;
    let rgbColor3=highColor;
    let color1 = rgbColor1;
    let color2 = rgbColor2;
    let color3 = rgbColor3;

    for (let deg = (this.startAngle-0.0001); deg <= (this.endAngle+0.001); deg += incr){
      let fade = (i*(this.max-this.min)/this.tick)/this.max;
      if (rgbColor3) {
        fade = fade * this.movegradient;
        if (fade >= 1) {
          fade -= 1;
          color1 = rgbColor2;
          color2 = rgbColor3;
          }
      }

      const diffRed = color2.red - color1.red;
      const diffGreen = color2.green - color1.green;
      const diffBlue = color2.blue - color1.blue;

      const rgbgradient = {
        red: parseInt(~~(color1.red + (diffRed * fade))),
        green: parseInt(~~(color1.green + (diffGreen * fade))),
        blue: parseInt(~~(color1.blue + (diffBlue * fade))),
      };
      (this.rgbgradient.length===0?this.rgbgradient.push(rgbgradient):'');
      i++
      let tick = document.createElement('div');
      let scale = document.createElement('div');
      tick.classList.add('tick');
      scale.classList.add('txt');
      tick.style.setProperty('transform', "rotate(" + deg + "deg)");
      scale.style.setProperty('transform', "rotate(" + deg + "deg)");
      tick.style.setProperty('--top', (this.size*0.65) + "px");
      scale.style.setProperty('--top', (this.size*0.82) + "px");
      scale.style.setProperty('--size-after', `0.6em`);
      const hslgradient = (this.movegradient*50)-(i*(this.max-this.min)/this.tick)*100/this.max;
        if ((i * this.wideTick) % this.tick === 0) {
          let textContent = '';
          textContent += Math.round(i*(this.max-this.min)/this.tick+this.min);
          if (this.hasScaleText){
            (parseInt(textContent)>=0&&parseInt(textContent)<10?scale.style.setProperty('--size-after', `0.3em`):'');
            (parseInt(textContent)>=100?scale.style.setProperty('--size-after', `0.8em`):'');
            scale.style.setProperty('--values', '"'+textContent+'"');
          };
          (this.hasGradient&&!this.hasRgbGradient ? tick.style.setProperty('--gradient', `hsl(${hslgradient},100%,40%)`)&tick.style.setProperty('--aura', `hsl(${hslgradient},100%,40%)`)&scale.style.setProperty('--gradient', `hsl(${hslgradient},100%,40%)`)&scale.style.setProperty('--aura', `hsl(${hslgradient},100%,40%)`) : tick.style.setProperty('--gradient', `#a8d8f8`)&tick.style.setProperty('--aura', `#79c3f4`)&scale.style.setProperty('--gradient', `#a8d8f8`)&scale.style.setProperty('--aura', `#79c3f4`)&this.currentValue.style.setProperty('--gradient', `#a8d8f8`)&this.currentValue.style.setProperty('--aura', `#79c3f4`));

          (this.hasRgbGradient&&!this.hasGradient?tick.style.setProperty('--gradient', `linear-gradient(to top, rgba(${rgbgradient.red},${rgbgradient.green},${rgbgradient.blue},0.5),rgba(${rgbgradient.red},${rgbgradient.green},${rgbgradient.blue},1))`)&tick.style.setProperty('--aura', ``)&scale.style.setProperty('--gradient', `rgba(${rgbgradient.red},${rgbgradient.green},${rgbgradient.blue},0.7)`)&scale.style.setProperty('--aura', `rgba(${rgbgradient.red},${rgbgradient.green},${rgbgradient.blue},1)`):'');
        }
        if ((i * this.wideTick) % this.tick !== 0) {
          tick.classList.add('small');
          (this.hasGradient||this.hasRgbGradient ? tick.style.setProperty('--gradient', (this.hasRgbGradient?`rgba(${rgbgradient.red},${rgbgradient.green},${rgbgradient.blue},1)`:`hsl(${hslgradient},100%,40%)`)) : tick.style.setProperty('--gradient', `#a8d8f8`)&tick.style.setProperty('--aura', `#79c3f4`));
        }      
      this.ticks.appendChild(tick);
      this.txt.appendChild(scale);
    }   
  }

  setAngle(angle) {
    const step = parseInt(this.getAttribute('step'));
    const gripstep = ((this.newValue - this.min) * (this.endAngle-this.startAngle) / (this.max - this.min) - (this.endAngle-this.startAngle)) + this.endAngle;
    // rotate knob
    this.knob.style.setProperty('-webkit-transform','rotate('+ (step===0?angle:gripstep) +'deg)');
    //this.knob.style.setProperty('-transform','rotate('+angle+'deg)');
    this.knob.style.setProperty('-moz-transform','rotate('+ (step===0?angle:gripstep) +'deg)'); 
    // highlight ticks
    let tickActive = this.shadowRoot.querySelectorAll('.tick');
    let txtActive = this.shadowRoot.querySelectorAll('.txt');
    let valueTicks = this.tick*(this.newValue-this.min)/(this.max-this.min);
    if(this.trigger!==true&&tickActive.length!==0){
      for (let i = 0; i <= this.tick; i++) {
        if(i <= valueTicks){
         tickActive[i].classList.add('activetick');
         (this.hasScaleText?txtActive[i].classList.add('colors'):'');
        } else {
         tickActive[i].classList.remove('activetick');
         (this.hasScaleText?txtActive[i].classList.remove('colors'):'');
        }
      }
    } else {
      this.grip.style.setProperty('background','rgba(255,255,255,0.2)');
      this.knob.style.setProperty('pointer-events', 'none');
    }
  }
  
  startDrag (e)  {
    let knob = this.knobs.getBoundingClientRect();

    const pts = {
        x: knob.left + knob.width / 2,
        y: knob.top + knob.height / 2
      };

    const moveHandler = e => {
      // this.touches = e;
      e.preventDefault();
      //let currentDeg = 0;
      if (e.touches && e.touches.length) {
        e.clientX = e.touches[0].clientX;
        e.clientY = e.touches[0].clientY;
      }

      let currentDeg = this.getDeg(e.clientX, e.clientY, pts);
      let newValue = Math.floor(
        this.convertRange(
          this.startAngle,
          this.endAngle,
          this.min,
          this.max,
          currentDeg
        )
      );
    this.newValue=(Math.round(newValue/this.step)*this.step).toFixed(this.tofixed);
    this.setAngle(currentDeg);
    };

    this.knob.addEventListener("touchmove", e => {
    this.knob.addEventListener("touchmove", moveHandler);
    this.currentValue.style.display = '';
    });
    this.knob.addEventListener("mousedown", moveHandler);
    this.knob.addEventListener('mousedown', e => {
    this.knob.addEventListener("mousemove", moveHandler);
    this.currentValue.style.display = '';
    });
    this.knob.addEventListener('mouseup', e => {
    this.knob.removeEventListener("mousedown", moveHandler);
    this.knob.removeEventListener("mousemove", moveHandler);
    this.knob.removeEventListener("mouseup", moveHandler);
    });
    this.knob.addEventListener("touchstart", e => {
    this.knob.addEventListener("touchstart", moveHandler);
    this.currentValue.style.display = '';
    });
    this.knob.addEventListener("touchend", e => {
    this.knob.removeEventListener("touchmove", moveHandler);
    this.knob.removeEventListener("touchstart", moveHandler);
    this.knob.removeEventListener("touchend", moveHandler);
    });
  }

  getDeg (cX, cY, pts)  {
    const x = cX - pts.x;
    const y = cY - pts.y;
    let deg = (Math.atan(y / x) * 180) / Math.PI;
      if ((x < 0 && y >= 0) || (x < 0 && y < 0)) {
        deg += 90;
      } else {
        deg += 270;
      }
    let finalDeg = Math.min(Math.max(this.startAngle, deg), this.endAngle);
    return finalDeg;
  }

  convertRange (oldMin, oldMax, newMin, newMax, oldValue) {
    return (
      (((oldValue - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin)
    );
  }

  onClick() {
    //let device=(this.hasAttribute('[(value)]')?this.getAttribute('[(value)]').replace(':',' '):this.getAttribute('(value)').replace(':',' '));
    //fhemService.sendCommand('set ' + device + ' ' + this.newValue);
    //ftuiApp.toast('set ' + device + ' ' + this.newValue);
    this.submitChange('value',this.newValue);
  }

  onToolTipTimeOut(){
    clearTimeout(this.timer);
    this.timer = setTimeout(()=>{this.onMoveEnd();}, 2000);
  }

  onToolTip(){
    this.currentValue.innerHTML=this.newValue+this.unit;
  }

  onMoveEnd() {
    this.currentValue.style.display = 'none';
  }

  setState() {
    const allActive = this.shadowRoot.querySelectorAll("div.tick, div.txt");
    if (this.trigger===true&&allActive.length!==0) {
      allActive.forEach(set => {
        set.classList.remove('activetick');
        set.classList.remove('colors');
      });
      this.grip.style.setProperty('background','rgba(255,255,255,0.2)');
      this.knob.style.setProperty('pointer-events', 'none');
    } else {
      this.setAngle();
      this.grip.style.setProperty('background','#a8d8f8');
      this.knob.style.setProperty('pointer-events', '');
    }
  }
}

window.customElements.define('ftui-volume3d', FtuiVolume3D);
