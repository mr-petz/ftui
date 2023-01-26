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
import { getStylePropertyValue, countDecimals} from '../../modules/ftui/ftui.helper.js';
//import { FtuiIcon } from '../icon/icon.component.js';
if (!document.querySelector('ftui-icon')) {
  import ('../icon/icon.component.js');
}

export class FtuiThermostat extends FtuiElement {
  constructor(properties) {

  super(Object.assign(FtuiThermostat.properties, properties));
    this.svg = this.shadowRoot.querySelector('.svg');
    this.outline = this.shadowRoot.querySelector('.outline');
    this.fill = this.shadowRoot.querySelector('.fill');
    this.scale = this.shadowRoot.querySelector('.scale');
    this.minColor = this.shadowRoot.querySelector('.min');
    this.mixColor = this.shadowRoot.querySelector('.mix');
    this.mix2Color = this.shadowRoot.querySelector('.mix2');
    this.maxColor = this.shadowRoot.querySelector('.max');
    this.newValue = 0;
    this.tempValue = 0;
    this.gripStep = 0;
    this.rgbgradient = [];
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
    const supportTouch = 'ontouchstart' in document;
    this.knob.addEventListener((supportTouch ? 'touchend' : 'mouseup'), () => {
     supportTouch?setTimeout(()=>{this.onClick()}, 100):this.onClick();
     });
    this.knob.addEventListener('mousemove', () => this.knobs.getBoundingClientRect()&(this.isThermometer||this.isHumidity||this.fixed?'':this.startDrag()));
    this.knob.addEventListener('touchmove', () => this.knobs.getBoundingClientRect()&(this.isThermometer||this.isHumidity||this.fixed?'':this.startDrag()));
    if (this.valueDecimals < 0) {
      this.valueDecimals = countDecimals(this.step);
    }
  }

  template() {
    return `
        <style>
         @import "themes/color-attributes.css";
         @import "components/thermostat/thermostat.component.css";
         ${this.startAngle = Math.round((360-this.degrees+this.rotation) / 2)}
         ${this.endAngle = Math.round(this.startAngle+this.degrees)}
        </style>
        <div class="knob-style">
          <div class="knob">
            <div class="knob-style-grip"></div>
          </div>
          <div class="ticks"></div>
          <div class="temp"></div>
          <div class="txts"></div>
          <div class="current-value"></div>
          <svg class="svg" height="${this.size*1.76}" width="${this.size*1.8}" focusable="false" style="${this.startAngle===0?'transform: translate3d(-0.5px, -0.5px, 0px)':''}">
            <defs>
              <linearGradient id="Gradient1" gradientTransform="rotate(100)">
                <stop offset="0%" class="mix"/>
                <stop offset="25%" class="min"/>
              </linearGradient>
               <linearGradient id="Gradient2" gradientTransform="rotate(80)">
                <stop offset="10%" class="mix2"/>
                <stop offset="30%" class="max"/>
              </linearGradient>
              <pattern id="Pattern" x="0" y="0" width="100%" height="100%" patternUnits="userSpaceOnUse">
                <g transform="rotate(${360-(this.endAngle-this.startAngle)+(this.rotation/2)+(this.degrees-360)}, 0, 0)">
                  <rect shape-rendering="crispEdges" x="${this.startAngle===0?'-80%':0}" y="${this.startAngle===0?10:0}" width="100%" height="300%" fill="url(#Gradient1)"/>
                  <rect shape-rendering="crispEdges" x="${this.startAngle===0?(360-this.degrees)/this.size-10+'%':'50%'}" y="${this.startAngle===0?10:0}" width="100%" height="300%" fill="url(#Gradient2)"/>
                </g>
              </pattern>
            </defs>
            <g class="scale" stroke="gray"></g> 
            <path class="outline" d="" fill="none" style="--thermostat-arc-bg-size:${this.size*0.14}" />
            <path class="fill" d="" fill="none" style="stroke:url(#Pattern); --thermostat-arc-fill-size:${this.size*0.15}" />
            <polygon class="needle" />
            <circle class="handle" r="9" fill="none" />
            <circle class="desired" r="5" fill="none" />  
          </svg>
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
      value: '',
      mode: '',
      temp: 0,
      battery: '',
      batteryIconColor: 'step(\'-99:danger, 25:warning, 50:success, 75:primary\')',
      batteryIcon: 'step(\'-99:battery-0, 25:battery-1, 50:battery-2, 75:battery-3, 100: battery\')',
      humidity: '',
      valve: '',
      valueDecimals: -1,
      tempDecimals: 1,
      size: 110,
      min: 15,
      max: 35,
      step: 0.5,
      tick: 0,
      degrees: 240,
      rotation: 0,
      unit: '',
      movegradient: 6,
      fadegradient: 0,
      noWideTicks: false,
      isThermometer: false,
      isHumidity: false,
      hasZoom: false,
      fixed: false,
      noMinMax: false,
      hasOldStyle: false,
      valueInRgb: false,
      tempInRgb: false,
      hasArc: false,
      hasArcTick: false,
      color: '',
      lowcolor:'68,119,255',
      mediumcolor:'255,0,255',
      highcolor:'255,0,0',
    };
  }

  static get observedAttributes() {
    return [...this.convertToAttributes(FtuiThermostat.properties), ...super.observedAttributes];
  }

  onConnected() {
    this.rgbGradient();
    this.tickstyle();
  }

  onAttributeChanged(name) {
    switch (name) {
    case 'value':
      this.newValue = isNaN(this.value.replace(/[^\d.-]/g, ''))?this.newValue=Number(this.min).toFixed(this.valueDecimals):Number(this.value.replace(/[^\d.-]/g, '')).toFixed(this.valueDecimals);
      this.setAngle();
      this.valueView();
    break;
    case 'mode':
      if (this.mode) {
        clearTimeout(this.timer);
        this.device = this.binding.getReadingsOfAttribute('value')[0].replace('-',' ').split(' ');
        this.deviceMode = this.mode;
        this.timer = setTimeout(()=>{fhemService.sendCommand('get ' + this.device[0] + ' setpoint ' + (this.deviceMode==='heating'?'1':'11'))}, 3000);
      }
    break;
    case 'temp':
      if (!this.hasThermometer) {
        this.tempValue=this.temp;
        this.actTemp();
      }
    break;
    case 'battery':
      if (!this.hasThermometer) {
        this.batteryValue();
      }
    break;
    case 'valve':
      if (!this.hasThermometer) {
        this.valvePosition();
      }
    break;
    case 'humidity':
      if (!this.hasThermometer) {
        this.humidityValue();
      }
    break;
    }
  }

  hex2rgb(hex) {
    if (hex.match('#')) {
      const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
      return `${r},${g},${b}`;
    } else {
      return (hex.match('rgb')?hex.replace(/rgb\((.*)\)/g,'$1'):hex.replace(/rgba\((.*)\)/g,'$1'));
    }
  }

  rgbGradient() {
    const low = (getStylePropertyValue('--color-min', this)?this.hex2rgb(getStylePropertyValue('--color-min', this)):getStylePropertyValue('--thermostat-min-color', this)?this.hex2rgb(getStylePropertyValue('--thermostat-min-color', this)):this.hex2rgb(this.lowcolor)).split(',');
    const medium = (getStylePropertyValue('--color-mix', this)?this.hex2rgb(getStylePropertyValue('--color-mix', this)):getStylePropertyValue('--thermostat-mix-color', this)?this.hex2rgb(getStylePropertyValue('--thermostat-mix-color', this)):this.hex2rgb(this.mediumcolor)).split(',');
    const high = (getStylePropertyValue('--color-max', this)?this.hex2rgb(getStylePropertyValue('--color-max', this)):getStylePropertyValue('--thermostat-max-color', this)?this.hex2rgb(getStylePropertyValue('--thermostat-max-color', this)):this.hex2rgb(this.highcolor)).split(',');
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
    let color1 = lowColor;
    let color2 = mediumColor;
    const color3 = highColor;
    
    for (let i = 0;  this.rgbgradient.length <= this.tick; i++) {
      let fade = (i*(this.max-this.min)/this.tick)/(this.max+this.fadegradient);
      if (highColor) {
        fade = fade * this.movegradient;
        if (fade >= 1) {
          fade -= 1;
          color1 = mediumColor;
          color2 = highColor;
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

  tickstyle() {
    this.ticks.innerHTML = '';
    this.txt.innerHTML = '';
    this.tempvalue.innerHTML = '';
    let i = -1 ;
    let incr = this.degrees / this.tick;
    this.knobs.style.setProperty('font-size', this.size*0.012 + "em");
    this.grip.style.setProperty('--grip-left', (this.size*0.025)+'px solid transparent');
    this.grip.style.setProperty('--grip-right', (this.size*0.025)+'px solid transparent');
    this.grip.style.setProperty('--grip-mleft', '-'+(this.size*0.0175)+'px');
    const atemp = this.tick*((this.tempValue<=this.max?(this.tempValue<=this.min?this.min:this.tempValue):this.max)-this.min)/(this.max-this.min);
    for (let deg = (this.startAngle-0.0001); deg <= (this.endAngle+0.001); deg += incr) {
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
      scale.style.setProperty('--top', (this.size*0.8) + "px");
      temp.style.setProperty('--size-after', `0.9em`);
      scale.style.setProperty('--size-after', `0.5em`);
      tick.style.setProperty('--thermostat-tick-height-size', getStylePropertyValue('font-size',this.knobs));
      tick.style.setProperty('font-size', this.size*0.012 + "rem");
      scale.style.setProperty('--transform', 'rotate(180deg)');
        if ((i * (this.tick*2)) % this.tick === 0) {
          tick.style.setProperty('--gradient', `linear-gradient(to bottom, rgba(${this.rgbgradient[i].red},${this.rgbgradient[i].green},${this.rgbgradient[i].blue},0.3),rgba(${this.rgbgradient[i].red},${this.rgbgradient[i].green},${this.rgbgradient[i].blue},1))`);
        }
        if (Math.round(i * 10) / 10 % 10 === 0) {
          (this.noWideTicks?'':tick.classList.add('thick'));
        }
        if (i === 0) {
          tick.classList.add('thick');
          if (!this.noMinMax) {
            scale.style.setProperty('--value', '"'+this.min+'"');
            if (Math.round(deg) === 0) {
              scale.style.setProperty('--top', '');
              scale.style.setProperty('top', '93%');
              (this.min>=10||this.min<=(-10)?(this.min<=(-10)?scale.style.setProperty('left', '43%'):scale.style.setProperty('left', '45.5%')):scale.style.setProperty('left', '48%'));
              scale.style.setProperty('--transform', 'rotate(0deg)');
            }
            this.txt.appendChild(scale);
          }
        };
        if (i === this.tick) {
          tick.classList.add('thick');
          if (!this.noMinMax) {
            scale.style.setProperty('--value', '"'+this.max+'"');
            if (Math.round(deg) === 360) {
              scale.style.setProperty('--top', '');
              scale.style.setProperty('top', '93%');
              (this.min>=10||this.min<=(-10)?(this.min<=(-10)?scale.style.setProperty('left', '46%'):scale.style.setProperty('left', '43%')):scale.style.setProperty('left', '47%'));
              scale.style.setProperty('--transform', 'rotate(0deg)');
            } else {
              scale.style.setProperty('top', '');
              scale.style.setProperty('left', '50%');
            }
            this.txt.appendChild(scale);
          }
        };
        if (this.isThermometer || this.isHumidity) {
          this.currentValue.style.setProperty('line-height', (this.size*0.5)+'px');
          if (this.isHumidity) {
              tick.classList.add('activetick');
          }
          if (!this.noMinMax && !this.hasOldStyle) {
            if (((this.tick % 2) === 0?i:i+.5) === this.tick/2) {
              tick.classList.add('thick');
              scale.style.setProperty('--value', '"'+((this.max+this.min)/2)+'"');
              this.txt.appendChild(scale);
            }
          }
          this.currentValue.style.setProperty('font-size', 'var(--thermostat-value-size,' + this.size*0.014 + 'em)');
        } else {
          if (i === Math.round(atemp)) {
            tick.classList.add('thick-active');
            const textContent=this.tempValue.toFixed(this.tempDecimals);
            temp.style.setProperty('--value', '"'+textContent+'"');
            this.tempvalue.appendChild(temp);
          }
          if (this.hasOldStyle) {
            this.currentValue.style.setProperty('font-size', 'var(--thermostat-value-size,' + this.size*0.014 + 'em)');
          }
        }
    this.ticks.appendChild(tick);
    }
    if (this.hasArc || this.hasArcTick) {
      this.outline.setAttributeNS(null, 'd', this.describeArc(this.size*0.9, this.size*0.9, this.size*0.7, this.startAngle-0.0001, this.endAngle));
      this.minColor.style.stopColor = 'rgba('+this.rgbgradient[0].red+','+this.rgbgradient[0].green+','+this.rgbgradient[0].blue+',1)';
      this.mixColor.style.stopColor = 'rgba('+this.rgbgradient[Math.round(this.tick/2)].red+','+this.rgbgradient[Math.round(this.tick/2)].green+','+this.rgbgradient[Math.round(this.tick/2)].blue+',1)';
      this.mix2Color.style.stopColor = this.mixColor.style.stopColor;
      this.maxColor.style.stopColor = 'rgba('+this.rgbgradient[this.tick].red+','+this.rgbgradient[this.tick].green+','+this.rgbgradient[this.tick].blue+',1)';
    }
    this.setAngle();//for offline
  }

  setAngle() {
    // rotate knob
    this.gripStep = (((this.newValue - this.min) * (this.endAngle-this.startAngle) / (this.max - this.min) - (this.endAngle-this.startAngle)) + this.endAngle);
    this.knob.style.setProperty('-webkit-transform','rotate(' + (this.gripStep<this.startAngle?this.startAngle:this.gripStep>this.endAngle?this.endAngle:this.gripStep) + 'deg)');
    this.knob.style.setProperty('-moz-transform','rotate(' + (this.gripStep<this.startAngle?this.startAngle:this.gripStep>this.endAngle?this.endAngle:this.gripStep) + 'deg)');

    // highlight ticks
    const tickActive = this.shadowRoot.querySelectorAll('.tick');
    const tickTxt = this.shadowRoot.querySelectorAll('.txt');
    const actValue = this.tick*(this.newValue-this.min)/(this.max-this.min);
    const tempValue = this.tick*((this.tempValue<=this.max?(this.tempValue<=this.min?this.min:this.tempValue):this.max)-this.min)/(this.max-this.min);
    if (this.rgbgradient.length===(this.tick+1)&&tickActive.length!==0) {
      let i = -1 ;
      let incr = this.degrees / this.tick;
      for (let deg = (this.startAngle-0.0001); deg <= (this.endAngle+0.001); deg += incr) {
        i++;
        //svg hasArc
        if (this.hasArc || this.hasArcTick) {
          if (this.svg.style.top !== '-4px') {
            if (this.isHumidity) {
              this.fill.setAttributeNS(null, 'd', this.describeArc(this.size*0.9, this.size*0.9, this.size*0.7, this.startAngle-0.0001, this.endAngle));
            } else {
              this.fill.setAttributeNS(null, 'd', this.describeArc(this.size*0.9, this.size*0.9, this.size*0.7, this.startAngle-0.0001, this.gripStep));
            }
          }
          if (!this.hasArcTick) {
            tickActive[i].style.setProperty('--thermostat-tick-color', `rgba(0,0,0,0)`);
            tickActive[0].classList.remove('thick','activetick','thick-active','blink');
            tickActive[i].classList.remove('thick','activetick','thick-active','blink');
          } else {
            tickActive[i].style.setProperty('--thermostat-tick-color', 'var(--medium)');
            tickActive[i].classList.remove('activetick','thick-active');
          }
          if (i===Math.round(actValue)) {
             this.knob.style.setProperty('--grip',(this.size*0.4) + "px" + ` solid rgba(${this.rgbgradient[i].red}, ${this.rgbgradient[i].green}, ${this.rgbgradient[i].blue},0.5)`);
             if (this.valueInRgb) {
                this.currentValue.style.setProperty('--thermostat-value-color', `rgba(${this.rgbgradient[i].red}, ${this.rgbgradient[i].green}, ${this.rgbgradient[i].blue},0.5)`);
             }
          }
          if (i===Math.round(tempValue) && !this.hasThermometer && !this.isHumidity) {
             tickActive[Math.round(tempValue)].classList.add('activetick','thick-active');
             if (this.tempInRgb) {
               this.tempvalue.style.setProperty('--thermostat-temp-color', `rgba(${this.rgbgradient[i].red}, ${this.rgbgradient[i].green}, ${this.rgbgradient[i].blue},0.5)`);
             }
          }
        } else if (this.isThermometer) {
            //Thermometer
            if (i <= Math.round(actValue)) {
              tickActive[i].classList.add('activetick');
              tickActive[i].classList.remove('thick-active');
            } else {
              tickActive[i].classList.remove('activetick','thick-active');
            }
            if (i === Math.round(actValue)) {
              tickActive[Math.round(actValue)].classList.add('activetick','thick-active');
              this.knob.style.setProperty('--grip',(this.size*0.4) + "px" + ` solid rgba(${this.rgbgradient[i].red}, ${this.rgbgradient[i].green}, ${this.rgbgradient[i].blue},0.5)`);
              if (this.valueInRgb) {
                this.currentValue.style.setProperty('--thermostat-value-color', `rgba(${this.rgbgradient[i].red}, ${this.rgbgradient[i].green}, ${this.rgbgradient[i].blue},0.5)`);
              }
            }
          } else if (this.isHumidity) {
          //Humidity
            tickActive[i].classList.add('activetick,thick-active');
            if (i === Math.round(actValue)) {
              this.knob.style.setProperty('--grip',(this.size*0.4) + "px" + ` solid rgba(${this.rgbgradient[i].red}, ${this.rgbgradient[i].green}, ${this.rgbgradient[i].blue},0.5)`);
              if (this.valueInRgb) {
                this.currentValue.style.setProperty('--thermostat-value-color', `rgba(${this.rgbgradient[i].red}, ${this.rgbgradient[i].green}, ${this.rgbgradient[i].blue},0.5)`);
              }
            }
          } else {
          //Thermostat
            //old-style
            if (this.hasOldStyle) {
              if ((i >= Math.round(actValue) && i < Math.round(tempValue)) || (i < Math.round(actValue) && i > Math.round(tempValue))) {
                  tickActive[i].classList.add('activetick');
                  tickActive[i].classList.remove('thick-active','blink');
              } else {
                  tickActive[i].classList.remove('activetick','thick-active','blink');
              }
            } else {
            //new-style
              if ((i >= Math.round(actValue) && i < Math.round(tempValue))) {
                  tickActive[i].classList.add('activetick');
                  tickActive[i].classList.remove('thick-active','blink');
              } else {
                  tickActive[i].classList.remove('activetick','thick-active','blink');
              }
            }
            if (i === Math.round(actValue)) {
              tickActive[Math.round(actValue)].classList.add('activetick','thick-active');
              this.knob.style.setProperty('--grip',(this.size*0.4) + "px" + ` solid rgba(${this.rgbgradient[i].red}, ${this.rgbgradient[i].green}, ${this.rgbgradient[i].blue},0.5)`);
              if (this.valueInRgb){
                this.currentValue.style.setProperty('--thermostat-value-color', `rgba(${this.rgbgradient[i].red}, ${this.rgbgradient[i].green}, ${this.rgbgradient[i].blue},0.5)`);
              }
            }
            if (i === Math.round(tempValue)) {
              tickActive[Math.round(tempValue)].classList.add('activetick','thick-active');
              if (this.tempInRgb) {
                this.tempvalue.style.setProperty('--thermostat-temp-color', `rgba(${this.rgbgradient[i].red}, ${this.rgbgradient[i].green}, ${this.rgbgradient[i].blue},0.5)`);
              }
            }
            if (!this.hasOldStyle) {
              if (Math.round(tempValue)<Math.round(actValue)&&this.gripStep<=this.endAngle) {
                tickActive[Math.round(tempValue)+1].classList.add('activetick','thick-active','blink');
              }
            }
          }
        if (this.gripStep < this.startAngle) {
          this.knob.style.setProperty('--grip',(this.size*0.4) + "px" + ` solid rgba(${this.rgbgradient[0].red}, ${this.rgbgradient[0].green}, ${this.rgbgradient[0].blue},0.5)`);
        } else if (this.gripStep>this.endAngle) {
          this.knob.style.setProperty('--grip',(this.size*0.4) + "px" + ` solid rgba(${this.rgbgradient[this.tick].red}, ${this.rgbgradient[this.tick].green}, ${this.rgbgradient[this.tick].blue},0.5)`);
        }
      }
    }
  }

  startDrag ()  {
    const knob = this.knobs.getBoundingClientRect();
    const pts = {
        x: knob.left + knob.width / 2,
        y: knob.top + knob.height / 2,
      };

    const moveHandler = e => {
      // this.touches = e;
      //e.preventDefault();
      //let currentDeg = 0;
      if (e.touches && e.touches.length) {
        e.clientX = e.touches[0].clientX;
        e.clientY = e.touches[0].clientY;
      }

      const currentDeg = this.getDeg(e.clientX, e.clientY, pts);
      const newValue = (
        this.convertRange(
          this.startAngle,
          this.endAngle,
          this.min,
          this.max,
          currentDeg
        )
      );
      this.newValue = (Math.round(newValue/this.step)*this.step).toFixed(this.valueDecimals);
      this.setAngle(currentDeg);
      (this.hasZoom?this.zoomIn():this.currentValue.textContent = this.newValue);
    };
    this.knob.addEventListener("touchmove", () => {
      this.knob.addEventListener("touchmove", moveHandler);
      this.grip.style.display==='none'?this.grip.style.setProperty('display','block'):'';
    });
    this.knob.addEventListener("mousedown", moveHandler);
    this.knob.addEventListener('mousedown', () => {
      (this.hasZoom?this.zoomIn():'');
      this.knob.addEventListener("mousemove", moveHandler);
      this.grip.style.display==='none'?this.grip.style.setProperty('display','block'):'';
    });
    this.knob.addEventListener('mouseup', () => {
      this.knob.removeEventListener("mousedown", moveHandler);
      this.knob.removeEventListener("mousemove", moveHandler);
      this.knob.removeEventListener("mouseup", moveHandler);
      (this.hasZoom?this.zoomOut():'');
    });
    this.knob.addEventListener("touchstart", () => {
      (this.hasZoom?this.zoomIn():'');
      this.knob.addEventListener("touchstart", moveHandler);
    });
    this.knob.addEventListener("touchend", () => {
      this.knob.removeEventListener("touchmove", moveHandler);
      this.knob.removeEventListener("touchstart", moveHandler);
      this.knob.removeEventListener("touchend", moveHandler);
      (this.hasZoom?this.zoomOut():'');
    });
  }

  getDeg (cX, cY, pts) {
    const degrees = this.degrees;
    const x = cX - pts.x;
    const y = cY - pts.y;
    let deg = Math.atan2(y, x) * 180 / Math.PI;
    if (360-(this.endAngle-this.startAngle)+(this.rotation/2)+(this.degrees-270) >= deg) {
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
    if (!this.mode) {
     this.submitChange('value',this.newValue);
    } else {
     clearTimeout(this.timer1);
     fhemService.sendCommand('set ' + this.device[0] + ' thermostatSetpointSet ' + this.newValue + ' C ' + (this.deviceMode==='heating'?'1':'11'));
     ftuiApp.toast('set ' + this.device[0] + ' thermostatSetpointSet ' + this.newValue + ' C ' + (this.deviceMode==='heating'?'1':'11'));
     this.timer1 = setTimeout(()=>{fhemService.sendCommand('get ' + this.device[0] + ' setpoint ' + (this.deviceMode==='heating'?'1':'11'));ftuiApp.toast('get ' + this.device[0] + ' setpoint ' + (this.deviceMode==='heating'?'1':'11'))}, 3000);
    }
    this.valueView();
  }

  valueView() {
    this.currentValue.textContent = (!this.isThermometer&&!this.isHumidity?isNaN(this.value)?this.value:(this.hasOldStyle?'':'Soll: ')+this.newValue+this.unit:this.newValue+this.unit);
    isNaN(this.value.replace(/[^\d.-]/g, ''))?this.grip.style.setProperty('display','none'):this.grip.style.setProperty('display','block');
  }

  zoomIn() {
    const tickAll = this.shadowRoot.querySelectorAll('.tick');
    const scale = this.shadowRoot.querySelectorAll('.txt');
    const temp = this.shadowRoot.querySelectorAll('.temp');
    this.currentValue.style.setProperty('font-size','var(--thermostat-zoom-value-size,2.4em)');
    this.currentValue.style.setProperty('top','var(--thermostat-zoom-value-top,-7%)');
    this.currentValue.style.setProperty('left','var(--thermostat-zoom-value-left,45%)');
    this.currentValue.textContent = this.newValue;
    if (this.hasArc || this.hasArcTick) {
      this.svg.style.setProperty('width',this.size*2.2+'px');
      this.svg.style.setProperty('height',this.size*2.16+'px');
      this.outline.setAttributeNS(null, 'd', this.describeArc(this.size*1.1, this.size*1.1, this.size*0.85, this.startAngle-0.0001, this.endAngle));
      this.fill.setAttributeNS(null, 'd', this.describeArc(this.size*1.1, this.size*1.1, this.size*0.85, this.startAngle-0.0001, this.gripStep));
    }
    this.grip.style.setProperty('top','72%');
    tickAll.forEach(tick => {
      tick.style.setProperty('--margin',(this.size*0.15) + "px");
    });
    if (!this.noMinMax) {
      scale.forEach(txt => {
        txt.style.setProperty('--top', (this.size*0.92) + "px");
      });
    }
    temp[1].style.setProperty('--top', (this.size*0.93) + "px");
  }
  
  zoomOut() {
    const tickAll = this.shadowRoot.querySelectorAll('.tick');
    const scale = this.shadowRoot.querySelectorAll('.txt');
    const temp = this.shadowRoot.querySelectorAll('.temp');
    (this.hasOldStyle?this.currentValue.style.setProperty('font-size', 'var(--thermostat-value-size,' + this.size*0.014 + 'em)'):this.currentValue.style.setProperty('font-size','var(--thermostat-value-size)'));
    this.currentValue.style.setProperty('top','35%');
    this.currentValue.style.setProperty('left','');
    this.grip.style.setProperty('bottom','');
    this.grip.style.setProperty('top','67%');
    if (this.hasArc || this.hasArcTick) {
      this.svg.style.setProperty('width',this.size*1.8+'px');
      this.svg.style.setProperty('height',this.size*1.76+'px');
      this.outline.setAttributeNS(null, 'd', this.describeArc(this.size*0.9, this.size*0.9, this.size*0.7, this.startAngle-0.0001, this.endAngle));
      this.fill.setAttributeNS(null, 'd', this.describeArc(this.size*0.9, this.size*0.9, this.size*0.7, this.startAngle-0.0001, this.gripStep));
    }
    tickAll.forEach(tick => {
      tick.style.setProperty('--margin','0');
    });
    if (!this.noMinMax) {
      scale.forEach(txt => {
       txt.style.setProperty('--top', (this.size*0.8) + "px");
      });
    }
    temp[1].style.setProperty('--top', (this.size*0.82) + "px");
    this.valueView();
  }

  actTemp() {
    const oldTemp = this.shadowRoot.querySelector('div[id="temp"]');
    let i = -1 ;
    let incr = this.degrees / this.tick;
    const atemp = this.tick*((this.tempValue<=this.max?(this.tempValue<=this.min?this.min:this.tempValue):this.max)-this.min)/(this.max-this.min);
    for (let deg = (this.startAngle-0.0001); deg <= (this.endAngle+0.001); deg += incr) {
      i++
      let temp = document.createElement('div');
      temp.classList.add('temp');
      temp.id = 'temp';
      temp.style.setProperty('transform', "rotate(" + deg + "deg)");
      temp.style.setProperty('--top', (this.size*0.82) + "px");
      temp.style.setProperty('--size-after', `0.9em`);
        if (i===Math.round(atemp)) {
          const textContent=this.tempValue.toFixed(this.tempDecimals);
          temp.style.setProperty('--value', '"'+textContent+'"');
          (oldTemp?oldTemp.parentNode.removeChild(oldTemp):'');
          this.tempvalue.appendChild(temp);
        }
    }
    this.setAngle();
  }

  batteryValue() {
    const battery = this.battery.replace(/[^\d.-]/g, '');
    (battery < 25 && battery !== '') || this.battery === 'low' ? this.battIcon.classList.add('blink') : this.battIcon.classList.remove('blink');
    this.batt.textContent = this.battery;
  }
 
  valvePosition() {
    this.vp.textContent = this.valve;
  }
 
  humidityValue() {
    this.hum.textContent = this.humidity;
  }

  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees+90) * (Math.PI / 180.0);
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians)),
    };
  }

  describeArc(x, y, radius, startArc, endArc) {
    const start = this.polarToCartesian(x, y, radius, endArc);
    const end = this.polarToCartesian(x, y, radius, startArc);
    let largeArcFlag = '0';
    if (endArc >= startArc) {
      largeArcFlag = endArc - startArc <= 180 ? '0' : '1';
    } else {
      largeArcFlag = (endArc + 360.0) - startArc <= 180 ? '0' : '1';
    }

    const d = [
      'M', start.x,  start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    ].join(' ');
    return d;
  }
}

window.customElements.define('ftui-thermostat', FtuiThermostat);
