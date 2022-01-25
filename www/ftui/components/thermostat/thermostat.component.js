/*
* Ftui3 Thermostat component for FTUI version 3
*
* by mr_petz
*
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*
* https://github.com/knowthelist/ftui
*/

import { FtuiElement } from '../element.component.js';
import { fhemService } from '../../modules/ftui/fhem.service.js';
import { FtuiIcon } from '../icon/icon.component.js';

export class FtuiThermostat extends FtuiElement {
  constructor(properties) {

  super(Object.assign(FtuiThermostat.properties, properties));
    this.newValue=0;
    this.tempValue=0;
    this.rgbgradient=[];
    (this.tick<0.1?this.tick=Math.round((this.max-this.min)/this.step):this.tick);
    (!this.hasThermometer?this.step=this.step:this.step=0.01);
    this.knobs = this.shadowRoot.querySelector('.knob-style');
    this.knob = this.shadowRoot.querySelector('.knob');
    this.currentValue = this.shadowRoot.querySelector('.current-value');
    this.ticks = this.shadowRoot.querySelector('.ticks');
    this.grip = this.shadowRoot.querySelector('.knob-style-grip');
    this.txt = this.shadowRoot.querySelector('.txts');
    this.tempvalue = this.shadowRoot.querySelector('.temp');
    this.battIcon = this.shadowRoot.querySelector('.batt-icon');
    this.batt = this.shadowRoot.querySelector('.batt');
    this.vp = this.shadowRoot.querySelector('.valve');
    this.hum = this.shadowRoot.querySelector('.humidity');
    this.knob.addEventListener((('ontouchend' in document.documentElement) ? 'touchend' : 'mouseup'), () => this.onClick()&this.valueView());
    this.knob.addEventListener('mousemove', () => this.knobs.getBoundingClientRect()&this.startDrag()&this.valueView());
    this.knob.addEventListener('mousedown', () => this.valueView());
    this.knob.addEventListener('touchmove', () => this.knobs.getBoundingClientRect()&this.startDrag()&this.valueView());
    (this.readonly||this.isThermometer||this.isHumidity?this.knob.style.setProperty('pointer-events', 'none'):'');
  }

  template() {
    return `
        <style>@import "components/thermostat/thermostat.component.css";
               @import "themes/color-attributes.css";
        </style>
        <div class="knob-style">       
          <div class="knob">
            <div class="knob-style-grip"></div>
          </div>
          <div class="ticks"></div>
          <div class="temp"></div>
          <div class="txts"></div>
          <div class="current-value"></div>
          <ftui-icon ${(!this.isThermometer && !this.isHumidity && this.hasAttribute('[battery]') && this.getAttribute('[battery]') ? 'name="battery" [name]="'+this.getAttribute('[battery]')+' | '+this.batteryIcon+'" [color]="'+this.getAttribute('[battery]')+' | '+this.batteryIconColor+'"' : '')} class="batt-icon"></ftui-icon>
          <div class="batt"></div>
          <ftui-icon ${(!this.isThermometer && !this.isHumidity && this.hasAttribute('[valve]') && this.getAttribute('[valve]') ? 'name="spinner" ' : '')} class="valve-icon"></ftui-icon>
          <div class="valve"></div>
          <ftui-icon ${(!this.isThermometer && !this.isHumidity && this.hasAttribute('[humidity]') && this.getAttribute('[humidity]') ? 'name="tint" ' : '')} class="humidity-icon"></ftui-icon>
          <div class="humidity"></div>
        </div>
     
      `;
  }

  static get properties() {
    return {
     value: -1,
     temp: 0,
     battery: '',
     batteryIconColor: 'step(\'-99:danger, 25:warning, 50:success, 75:primary\')',
     batteryIcon: 'step(\'-99:battery-0, 25:battery-1, 50:battery-2, 75:battery-3, 100: battery\')',
     humidity: '',
     valve: '',
     size: 110,
     min: 15,
     max: 35,
     step: 0.5,
     tick: 0,
     noWideTicks: false,
     degrees: 240,
     rotation: 0,
     unit: '',
     movegradient: 7,
     isThermometer: false,
     isHumidity: false,
     hasZoom: false,
     readonly: false,
     noMinMax: false,
     hasOldStyle: false,
     valueInRgb: false,
     tempInRgb: false,
     lowcolor:'68, 119, 255',
     mediumcolor:'255,0,255',
     highcolor:'255,0,0',
     tofixed: 1,
    };
  }

  static get observedAttributes() {
    return [...this.convertToAttributes(FtuiThermostat.properties), ...super.observedAttributes];
  }
  
  onConnected() {
    this.rgbGradient();
    this.startAngle = Math.round((360-this.degrees+this.rotation) / 2);
    this.endAngle = Math.round(this.startAngle+this.degrees);
    this.tickstyle();
  }

  onAttributeChanged(name) {
    switch (name) {
    case 'value':
      this.tempValue = this.temp;
      this.newValue = this.value.toFixed(this.tofixed);
      this.setAngle();
      this.valueView();
    break;
    case 'temp':
      if(!this.hasThermometer){
        this.tempValue=this.temp;
        this.actTemp();
      }
    break;
    case 'battery':
      if(!this.hasThermometer){
        this.batteryValue();
      }
    break;
    case 'valve':
      if(!this.hasThermometer){
        this.valvePosition();
      }
    break;
    case 'humidity':
      if(!this.hasThermometer){
        this.humidityValue();
      }
    break;
    }
  }
  
  rgbGradient(){
    const low = this.lowcolor.split(',');
    const medium = this.mediumcolor.split(',');
    const high = this.highcolor.split(',');
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
    let rgbColor1 = lowColor;
    let rgbColor2 = mediumColor;
    let rgbColor3 = highColor;
    let color1 = rgbColor1;
    let color2 = rgbColor2;
    let color3 = rgbColor3;
    
    for (let i = 0;  this.rgbgradient.length <= this.tick; i++){
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
    this.rgbgradient.push(rgbgradient);
    }
  }

  tickstyle(){
    this.ticks.innerHTML = '';
    this.txt.innerHTML = '';
    this.tempvalue.innerHTML = '';
    let i = -1 ;
    let incr = this.degrees / this.tick;
    this.knobs.style.setProperty('font-size', this.size*0.012 + "em");
    this.grip.style.setProperty('--grip-left', (this.size*0.025)+'px solid transparent');
    this.grip.style.setProperty('--grip-right', (this.size*0.025)+'px solid transparent');
    this.grip.style.setProperty('--grip-mleft', '-'+(this.size*0.0175)+'px');
    this.currentValue.style.setProperty('--value-width', (this.size*0.8)+'px');
    const atemp = this.tick*((this.tempValue<=this.max?(this.tempValue<=this.min?this.min:this.tempValue):this.max)-this.min)/(this.max-this.min);
    for (let deg = (this.startAngle-0.0001); deg <= (this.endAngle+0.001); deg += incr){
      i++  
      const tick = document.createElement('div');
      const scale = document.createElement('div');
      const temp = document.createElement('div');
      tick.classList.add('tick');
      scale.classList.add('txt');
      temp.classList.add('temp');
      temp.id = 'temp';
      tick.style.setProperty('transform', "rotate(" + deg + "deg)");
      scale.style.setProperty('transform', "rotate(" + deg + "deg)");
      temp.style.setProperty('transform', "rotate(" + deg + "deg)");
      tick.style.setProperty('--top', (this.size * 0.62) + "px");
      temp.style.setProperty('--top', (this.size*0.82) + "px");
      scale.style.setProperty('--top', (this.size*0.82) + "px");
      temp.style.setProperty('--size-after', `0.9em`);
      scale.style.setProperty('--size-after', `0.5em`);
      scale.style.setProperty('--transform', 'rotate(180deg)');
        if ((i * (this.tick*2)) % this.tick === 0) {
          tick.style.setProperty('--gradient', `linear-gradient(to bottom, rgba(${this.rgbgradient[i].red},${this.rgbgradient[i].green},${this.rgbgradient[i].blue},0.3),rgba(${this.rgbgradient[i].red},${this.rgbgradient[i].green},${this.rgbgradient[i].blue},1))`);
        }
        if (Math.round(i * 10) / 10 % 10 === 0) {
          (this.noWideTicks?'':tick.classList.add('thick'));
        }
        if (i === 0) {
          tick.classList.add('thick');
          if(!this.noMinMax){
            scale.style.setProperty('--value', '"'+this.min+'"');
            //scale.style.setProperty('color', 'rgba(255, 255, 255, 0.2)');
            if(Math.round(deg)===0){
              scale.style.setProperty('--top', '');
              scale.style.setProperty('top', '170%');
              (this.min>=10||this.min<=(-10)?(this.min<=(-10)?scale.style.setProperty('left', '41%'):scale.style.setProperty('left', '43%')):scale.style.setProperty('left', '47%'));
              scale.style.setProperty('--transform', 'rotate(0deg)');
            }
            this.txt.appendChild(scale);
          }
        };
        if (i===this.tick) {
          tick.classList.add('thick');
          if(!this.noMinMax){
            scale.style.setProperty('--value', '"'+this.max+'"');
            if(Math.round(deg)===360){
              scale.style.setProperty('--top', '');
              scale.style.setProperty('top', '170%');
              (this.min>=10||this.min<=(-10)?(this.min<=(-10)?scale.style.setProperty('left', '46%'):scale.style.setProperty('left', '43%')):scale.style.setProperty('left', '47%'));
              scale.style.setProperty('--transform', 'rotate(0deg)');
            } else {
              scale.style.setProperty('top', '');
              scale.style.setProperty('left', '50%');
            }
            this.txt.appendChild(scale);
          }
        };
          if(this.isThermometer||this.isHumidity){
            this.currentValue.style.setProperty('top', '25%');
            if (this.isHumidity){
                  tick.classList.add('activetick');
            }
            if(!this.noMinMax&&!this.hasOldStyle){
              if (((this.tick % 2)===0?i:i+.5)===this.tick/2) {
                tick.classList.add('thick');
                scale.style.setProperty('--value', '"'+((this.max+this.min)/2)+'"');
                this.txt.appendChild(scale);
              }
            }
            this.currentValue.style.setProperty('font-size', 'var(--thermostat-value-size,' + this.size*0.014 + 'em)');
          } else {
            if (i===Math.round(atemp)) {
              tick.classList.add('thick-active');
              const textContent=(Math.round(this.tempValue*2)/2).toFixed(1);//+this.unit;
              temp.style.setProperty('--value', '"'+textContent+'"');
              this.tempvalue.appendChild(temp);
            }
            if (this.hasOldStyle) {
              this.currentValue.style.setProperty('font-size', 'var(--thermostat-value-size,' + this.size*0.013 + 'em)');
            }
          }
    this.ticks.appendChild(tick);
    }
    this.setAngle();//for offline
  }

  setAngle() {
    // rotate knob
    const gripStep = (((this.newValue - this.min) * (this.endAngle-this.startAngle) / (this.max - this.min) - (this.endAngle-this.startAngle)) + this.endAngle);
    this.knob.style.setProperty('-webkit-transform','rotate(' + (gripStep<this.startAngle?this.startAngle:gripStep>this.endAngle?this.endAngle:gripStep) + 'deg)');
    this.knob.style.setProperty('-moz-transform','rotate(' + (gripStep<this.startAngle?this.startAngle:gripStep>this.endAngle?this.endAngle:gripStep) + 'deg)');

    // highlight ticks
    const tickActive = this.shadowRoot.querySelectorAll('.tick');
    const tickTxt = this.shadowRoot.querySelectorAll('.txt');
    const actValue = this.tick*(this.newValue-this.min)/(this.max-this.min);
    const tempValue = this.tick*((this.tempValue<=this.max?(this.tempValue<=this.min?this.min:this.tempValue):this.max)-this.min)/(this.max-this.min);
    if (this.rgbgradient.length===(this.tick+1)&&tickActive.length!==0){
      let i = -1 ;
      let incr = this.degrees / this.tick;
      for (let deg = (this.startAngle-0.0001); deg <= (this.endAngle+0.001); deg += incr){
        i++;
        if (this.isThermometer){
          //Thermometer
          if (i<=Math.round(actValue)) {
            tickActive[i].classList.add('activetick');
            tickActive[i].classList.remove('thick-active');
          } else {
            tickActive[i].classList.remove('activetick','thick-active');
          }
          if (i===Math.round(actValue)) {
            tickActive[Math.round(actValue)].classList.add('activetick','thick-active');
            this.knob.style.setProperty('--grip',(this.size*0.4) + "px" + ` solid rgba(${this.rgbgradient[i].red}, ${this.rgbgradient[i].green}, ${this.rgbgradient[i].blue},0.5)`);
            if (this.valueInRgb){
              this.currentValue.style.setProperty('--thermostat-value-color', `rgba(${this.rgbgradient[i].red}, ${this.rgbgradient[i].green}, ${this.rgbgradient[i].blue},0.5)`);
            }
          }
        } else if(this.isHumidity){
        //Humidity
          if (i===Math.round(actValue)) {
            tickActive[Math.round(actValue)].classList.add('thick-active');
            this.knob.style.setProperty('--grip',(this.size*0.4) + "px" + ` solid rgba(${this.rgbgradient[i].red}, ${this.rgbgradient[i].green}, ${this.rgbgradient[i].blue},0.5)`);
            if (this.valueInRgb){
              this.currentValue.style.setProperty('--thermostat-value-color', `rgba(${this.rgbgradient[i].red}, ${this.rgbgradient[i].green}, ${this.rgbgradient[i].blue},0.5)`);
            }
          } else {
            tickActive[i].classList.remove('thick-active');
          }
        } else {
        //Thermostat
          //old-style
          if (this.hasOldStyle) {
            if ((i >= Math.round(actValue) && i < Math.round(tempValue)) || (i < Math.round(actValue) && i > Math.round(tempValue))){
                tickActive[i].classList.add('activetick');
                tickActive[i].classList.remove('thick-active','blink');
            } else {
                tickActive[i].classList.remove('activetick','thick-active','blink');
            }
          } else {
          //new-style
            if ((i >= Math.round(actValue) && i < Math.round(tempValue))){
                tickActive[i].classList.add('activetick');
                tickActive[i].classList.remove('thick-active','blink');
            } else {
                tickActive[i].classList.remove('activetick','thick-active','blink');
            }
          }
          if (i===Math.round(actValue)) {
            tickActive[Math.round(actValue)].classList.add('activetick','thick-active');
            this.knob.style.setProperty('--grip',(this.size*0.4) + "px" + ` solid rgba(${this.rgbgradient[i].red}, ${this.rgbgradient[i].green}, ${this.rgbgradient[i].blue},0.5)`);
            if (this.valueInRgb){
              this.currentValue.style.setProperty('--thermostat-value-color', `rgba(${this.rgbgradient[i].red}, ${this.rgbgradient[i].green}, ${this.rgbgradient[i].blue},0.5)`);
            }
          }
          if (i===Math.round(tempValue)) {
            tickActive[Math.round(tempValue)].classList.add('activetick','thick-active');
            if (this.tempInRgb){
              this.tempvalue.style.setProperty('--thermostat-temp-color', `rgba(${this.rgbgradient[i].red}, ${this.rgbgradient[i].green}, ${this.rgbgradient[i].blue},0.5)`);
            }
          }
          if(!this.hasOldStyle){
            if(Math.round(tempValue)<Math.round(actValue)){
              tickActive[Math.round(tempValue)+1].classList.add('activetick','thick-active','blink');
            }
          }
        }
        if (gripStep<this.startAngle) {
          this.knob.style.setProperty('--grip',(this.size*0.4) + "px" + ` solid rgba(${this.rgbgradient[0].red}, ${this.rgbgradient[0].green}, ${this.rgbgradient[0].blue},0.5)`);
        } else if (gripStep>this.endAngle) {
          this.knob.style.setProperty('--grip',(this.size*0.4) + "px" + ` solid rgba(${this.rgbgradient[this.tick].red}, ${this.rgbgradient[this.tick].green}, ${this.rgbgradient[this.tick].blue},0.5)`);
        }
      }
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
      let newValue = (
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
      (this.hasZoom?this.zoomIn():'');
    };
    this.knob.addEventListener("touchmove", e => {
      this.knob.addEventListener("touchmove", moveHandler);
    });
    this.knob.addEventListener("mousedown", moveHandler);
    this.knob.addEventListener('mousedown', e => {
      (this.hasZoom?this.zoomIn():'');
      this.knob.addEventListener("mousemove", moveHandler);
    });
    this.knob.addEventListener('mouseup', e => {
      this.knob.removeEventListener("mousedown", moveHandler);
      this.knob.removeEventListener("mousemove", moveHandler);
      this.knob.removeEventListener("mouseup", moveHandler);
      (this.hasZoom?this.zoomOut():'');
    });
    this.knob.addEventListener("touchstart", e => {
      (this.hasZoom?this.zoomIn():'');
      this.knob.addEventListener("touchstart", moveHandler);
    });
    this.knob.addEventListener("touchend", e => {
      (this.hasZoom?this.zoomOut():'');
      this.knob.removeEventListener("touchmove", moveHandler);
      this.knob.removeEventListener("touchstart", moveHandler);
      this.knob.removeEventListener("touchend", moveHandler);
    });
  }

  getDeg (cX, cY, pts)  {
    const degrees = this.degrees;
    const x = cX - pts.x;
    const y = cY - pts.y;
    let deg = Math.atan2(y, x) * 180 / Math.PI;
    if (360-(this.endAngle-this.startAngle)+(this.rotation/2) >= deg) {
     deg += 270;
    } else {
     deg -= 90;
    }
    let finalDeg = Math.min(Math.max(this.startAngle,deg), this.endAngle);
    return finalDeg;
  }

  convertRange (oldMin, oldMax, newMin, newMax, oldValue) {
	  return (
   (((oldValue - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin)
   );
  }

  onClick() {
    this.submitChange('value',this.newValue);
  }

  valueView(){
    const temp = (this.value*this.step/this.step).toFixed(this.tofixed);
    (!this.isThermometer&&!this.isHumidity&&Number(this.newValue)===this.min?this.currentValue.innerHTML='off':this.currentValue.innerHTML=(!this.isThermometer&&!this.isHumidity?(this.hasOldStyle?'':'Soll: ')+this.newValue+this.unit:temp+this.unit));
  }

  zoomIn(){
    const tickAll = this.shadowRoot.querySelectorAll('.tick');
    const scale = this.shadowRoot.querySelectorAll('.txt');
    const temp = this.shadowRoot.querySelectorAll('.temp');
    this.currentValue.style.setProperty('font-size','2.4em');
    this.currentValue.style.setProperty('top','5%');
    this.currentValue.style.setProperty('left','50%');
    this.currentValue.innerHTML = this.newValue;
    this.grip.style.setProperty('top','72%');
    tickAll.forEach(tick => {
      tick.style.setProperty('--margin',(this.size*0.15) + "px");
    });
    if(!this.noMinMax){
      scale.forEach(txt => {
        (txt.style.top==='148%'?txt.style.setProperty('top', "165%"):txt.style.setProperty('--top', (this.size*0.92) + "px"));
      });
    }
    temp[1].style.setProperty('--top', (this.size*0.93) + "px");
  }
  
  zoomOut(){
    const tickAll = this.shadowRoot.querySelectorAll('.tick');
    const scale = this.shadowRoot.querySelectorAll('.txt');
    const temp = this.shadowRoot.querySelectorAll('.temp');
    (this.hasOldStyle?this.currentValue.style.setProperty('font-size', 'var(--thermostat-value-size,' + this.size*0.013 + 'em)'):this.currentValue.style.setProperty('font-size','var(--thermostat-value-size)'));
    this.currentValue.style.setProperty('top','10%');
    this.currentValue.style.setProperty('left','');
    this.grip.style.setProperty('bottom','');
    this.grip.style.setProperty('top','67%');
    tickAll.forEach(tick => {
      tick.style.setProperty('--margin','0');
    });
    if(!this.noMinMax){
      scale.forEach(txt => {
       (txt.style.top==='165%'?txt.style.setProperty('top', "148%"):txt.style.setProperty('--top', (this.size*0.82) + "px"));
         //txt.style.setProperty('--top', (this.size*0.82) + "px");
      });
    }
    temp[1].style.setProperty('--top', (this.size*0.82) + "px");
  }

  actTemp(){
    const oldTemp = this.shadowRoot.querySelector('div[id="temp"]');
    let i = -1 ;
    let incr = this.degrees / this.tick;
    const atemp = this.tick*((this.tempValue<=this.max?(this.tempValue<=this.min?this.min:this.tempValue):this.max)-this.min)/(this.max-this.min);
    for (let deg = (this.startAngle-0.0001); deg <= (this.endAngle+0.001); deg += incr){
      i++
      let temp = document.createElement('div');
      temp.classList.add('temp');
      temp.id = 'temp';
      temp.style.setProperty('transform', "rotate(" + deg + "deg)");
      temp.style.setProperty('--top', (this.size*0.84) + "px");
      temp.style.setProperty('--size-after', `0.9em`);
        if (i===Math.round(atemp)) {
          const textContent=(Math.round(this.tempValue*2)/2).toFixed(1);//+this.unit;
          temp.style.setProperty('--value', '"'+textContent+'"');
          oldTemp.parentNode.removeChild(oldTemp);
          this.tempvalue.appendChild(temp);
        }
    }
    this.setAngle();
  }

  batteryValue() {
    (this.battery<25?this.battIcon.classList.add('blink'):this.battIcon.classList.remove('blink'));
    this.batt.innerHTML=this.battery+" %";
  }
 
  valvePosition() {
    this.vp.innerHTML=this.valve;
  }
 
  humidityValue() {
    this.hum.innerHTML=this.humidity+" %";
  }
}

window.customElements.define('ftui-thermostat', FtuiThermostat);
