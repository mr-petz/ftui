/*
* Volume Slider component for FTUI version 3
*
* by mr_petz
*
* Forumlink: https://forum.fhem.de/index.php/topic,121901.msg1165068.html#msg1165068
*
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*
* https://github.com/knowthelist/ftui
*/

import { FtuiElement } from '../element.component.js';
//import { fhemService } from '../../modules/ftui/fhem.service.js';
//import { FtuiIcon } from '../icon/icon.component.js';
if (!document.querySelector('ftui-icon')) {
  import ('../icon/icon.component.js');
}

export class FtuiVolume extends FtuiElement {
  constructor(properties) {

    super(Object.assign(FtuiVolume.properties, properties));
      this.timer = null;
      this.div = this.shadowRoot.querySelector('div');
      this.tooltip = this.shadowRoot.querySelector('.tooltip');
      this.slider=this.shadowRoot.querySelector('.range-slider');
      this.thumb=this.shadowRoot.querySelector('.thumb-chrome');
      this.progress = this.shadowRoot.querySelector('.progress-chrome');
      this.rangeable = this.shadowRoot.querySelector('.rangeable-container');
      this.range = this.shadowRoot.querySelector('input[id="range"]');
      this.buttonDown = this.shadowRoot.querySelector('button[id="-"]');
      this.buttonUp = this.shadowRoot.querySelector('button[id="+"]');
      this.ticks = this.shadowRoot.querySelector('.ticks');
      this.range.addEventListener('click', () => this.onMoveSlider()&this.rgbGradient()&this.onClickSlider()&this.onToolTip()&this.onToolTipTimeOut());
      this.range.addEventListener('touchend', () => this.onMoveSlider()&this.rgbGradient()&this.onClickSlider()&this.onToolTip()&this.onToolTipTimeOut());
      (!this.hasAttribute('is-vertical')?this.buttonUp.addEventListener('click', () => this.onClickUp()&this.rgbGradient()&this.onMoveSlider()&this.onToolTip()&this.onToolTipTimeOut()):'');
      (!this.hasAttribute('is-vertical')?this.buttonDown.addEventListener('click', () => this.onClickDown()&this.rgbGradient()&this.onMoveSlider()&this.onToolTip()&this.onToolTipTimeOut()):'');
      this.range.addEventListener('mousemove', () => this.onMoveSlider()&this.rgbGradient()&this.onToolTip()&this.onToolTipTimeOut());
      this.range.addEventListener('touchmove', () => this.onMoveSlider()&this.rgbGradient()&this.onToolTip()&this.onToolTipTimeOut());
      this.range.addEventListener('mouseout', () => this.onToolTipTimeOut());
      (!this.hasAttribute('is-vertical')?this.buttonDown.addEventListener('mousemove', () => this.onMoveSlider()&this.rgbGradient()&this.onToolTip()&this.onToolTipTimeOut()):'');
      (!this.hasAttribute('is-vertical')?this.buttonUp.addEventListener('mousemove', () => this.onMoveSlider()&this.rgbGradient()&this.onToolTip()&this.onToolTipTimeOut()):'');
      this.tickCount = Math.ceil(Math.abs(this.max - this.min) / (this.tick<=0?this.tick=50:this.tick)) + 1;
      this.drawTicks();
  }

  template() {
    return `
    <style>@import "components/volume/volume.component.css";</style>

    <div class="wrapper">
      ${(this.hasAttribute('is-vertical')?`
        <input class="range-slider" id="range" type="range" orient="vertical" min="${this.min}" max="${this.max}" value="" step="${this.step}">
          <div class="progress-chrome">
            <div class="fake"></div>
            <div class="thumb-chrome" ></div>
            <div class="tooltip"></div>
            </div>
          <div class="ticks"></div>
          <div class="numbers">
            <span id="min">${this.min}</span>
            <span id="max">${this.max}</span>
          </div>`:`
      <table>
        <thead>
          ${(!this.hasAttribute('has-icons')?'<th style="width: 0%;"></th><th style="width: 100%;"></th><th style="width: 0%;"></th>':'<th style="width: 10%;"></th><th style="width: 80%;"></th><th style="width: 10%;"></th>')}
        </thead>
        <tbody>
          <tr>
            <td>
              <button id="-">${(this.hasAttribute('has-icons')?'<ftui-icon name="'+this.icon.split(',').shift()+'"></ftui-icon>':'')}</button>
            </td>
            <td>
              <input class="range-slider" id="range" type="range" orient="" min="${this.min}" max="${this.max}" value="" step="${this.step}">
              <div class="rangeable-container">
                <div id="tooltip" class="tooltip"></div>
              </div>
              <div class="progress-chrome">
                <div class="thumb-chrome" ></div>
              </div>
              <div class="ticks"></div>
            </td>
            <td>
              <button id="+">${(this.hasAttribute('has-icons')?'<ftui-icon name="'+this.icon.split(',').pop()+'"></ftui-icon>':'')}</button>
            </td>
          </tr>
          <tr>
            <td>
            </td>
            <td>
              <div class="numbers">
                <span id="min">${this.min}</span>
                <span id="max">${this.max}</span>
              </div>
            </td>
            <td>
            </td>
          </tr>
        </tbody>
      </table>`)}
    </div>
      
      `;
  }

  static get properties() {
    return {
      debounce: 200,
      value: '',
      step: 5,
      min: 0,
      max: 100,
      icon: 'volume-down,volume-up',
      color: 'primary',
      iconcolor: '',
      tick: 50,
      wideTick: 100,
      hasTooltips: false,
      lowcolor:'0,255,0',
      mediumcolor:'255,140,0',
      highcolor:'255,0,0',
    };
  }

  static get observedAttributes() {
    return [...this.convertToAttributes(FtuiVolume.properties), ...super.observedAttributes];
  }

  onConnected() {
    if (this.color) {
      this.div.style.color = this.iconcolor;
      if (!this.hasAttribute('is-vertical')){
        this.buttonDown.style.color = this.iconcolor;
        this.buttonUp.style.color = this.iconcolor;
      }
    }
    this.tooltip.style.display = 'none';
    const gradient=100-((this.range.value - this.range.min)/(this.range.max - this.range.min)*100);
      if (!this.hasAttribute('is-vertical')){
        (this.hasAttribute('has-gradient')?this.progress.style.setProperty('background', `linear-gradient(to right, hsla(${gradient},100%,40%,0.3),hsl(${gradient},100%,40%))`)&this.tooltip.style.setProperty('background', `hsl(${gradient},100%,40%)`)&this.tooltip.style.setProperty('--gradient', `hsl(${gradient},100%,40%) transparent transparent`):'')
      } else {
        (this.hasAttribute('has-gradient')?this.progress.style.setProperty('background', `linear-gradient(to top, hsla(${gradient},100%,40%,0.3),hsl(${gradient},100%,40%))`)&this.tooltip.style.setProperty('background', `hsl(${gradient},100%,40%)`)&this.tooltip.style.setProperty('--gradient', `transparent hsl(${gradient},100%,30%) transparent transparent`):'');
      };
    this.onToolTip()&this.onToolTipTimeOut();	
  }

  onAttributeChanged(name) {
    switch (name) {
    case 'value':
      this.sliderInput();
    break;
    }
  }

  onToolTipTimeOut(){
    clearTimeout(this.timer);
    this.timer = setTimeout(()=>{this.onMoveSliderEnd();}, 1000);
  }

  onToolTip(){
    if (this.hasAttribute('has-tooltips')){
      this.tooltip.style.display = '';
        if(!this.hasAttribute('is-vertical')){
        this.rangeable.style.left= (this.range.value - this.range.min)/(this.range.max - this.range.min)*100+'%';
        }
        this.tooltip.textContent = this.range.value;
        }
    }

  onMoveSlider() {
    const gradient=100-((this.range.value - this.range.min)/(this.range.max - this.range.min)*100);
    if (!this.hasAttribute('is-vertical')){
      this.progress.style.width = (this.range.value - this.range.min)/(this.range.max - this.range.min)*100+'%';
      (this.hasAttribute('has-gradient')?this.progress.style.setProperty('background', `linear-gradient(to right, hsla(${gradient},100%,40%,0.3),hsl(${gradient},100%,40%))`)&this.tooltip.style.setProperty('background', `linear-gradient(to right, hsla(${gradient},100%,40%,0.3),hsl(${gradient},100%,40%))`)&this.tooltip.style.setProperty('--gradient', `hsl(${gradient},100%,25%) transparent transparent`):'');
      this.slider.style.setProperty('--ThumbPosition', `translate3d(${-50+((this.range.value - this.range.min)/(this.range.max - this.range.min)*100)+'%'},0,0)`);
    } else {
      this.progress.style.height = (this.range.value - this.range.min)/(this.range.max - this.range.min)*100+'%';
      (this.hasAttribute('has-gradient')?this.progress.style.setProperty('background', `linear-gradient(to top, hsla(${gradient},100%,40%,0.3),hsl(${gradient},100%,40%))`)&this.tooltip.style.setProperty('background', `linear-gradient(to top, hsla(${gradient},100%,40%,0.3),hsl(${gradient},100%,40%))`)&this.tooltip.style.setProperty('--gradient', `transparent hsl(${gradient},100%,30%) transparent transparent`):'');
      this.slider.style.setProperty('--ThumbPosition', `translate3d(0%,${50-((this.range.value - this.range.min)/(this.range.max - this.range.min)*100)+'%'},0)`)
    };
  }
  
  rgbGradient() {
    if(this.hasAttribute('has-rgb-gradient')){
    let low=this.lowcolor.split(',');
    let medium=this.mediumcolor.split(',');
    let high=this.highcolor.split(',');
    let lowColor = {
      red: parseInt(low[0]),
      green: parseInt(low[1]),
      blue: parseInt(low[2])
    };
    let mediumColor = {
      red: parseInt(medium[0]),
      green: parseInt(medium[1]),
      blue: parseInt(medium[2])
    };
    let highColor = {
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
    let fade = (parseInt(this.range.value - this.range.min)/(this.range.max - this.range.min));
    if (rgbColor3) {
      fade = fade * 2;

      if (fade >= 1) {
        fade -= 1;
        color1 = rgbColor2;
        color2 = rgbColor3;
        }
    }

    let diffRed = color2.red - color1.red;
    let diffGreen = color2.green - color1.green;
    let diffBlue = color2.blue - color1.blue;

    let gradients = {
      red: parseInt(Math.floor(color1.red + (diffRed * fade))),
      green: parseInt(Math.floor(color1.green + (diffGreen * fade))),
      blue: parseInt(Math.floor(color1.blue + (diffBlue * fade))),
    };
      if (!this.hasAttribute('is-vertical')){
        this.progress.style.setProperty('background', `linear-gradient(to right, rgba(${gradients.red},${gradients.green},${gradients.blue},0.3),rgba(${gradients.red},${gradients.green},${gradients.blue},1))`);
        this.tooltip.style.setProperty('background', `linear-gradient(to right, rgba(${gradients.red},${gradients.green},${gradients.blue},0.3),rgba(${gradients.red},${gradients.green},${gradients.blue},1))`);
        this.tooltip.style.setProperty('--gradient', `rgba(${gradients.red},${gradients.green},${gradients.blue},0.5) transparent transparent`);
      } else {
        this.progress.style.setProperty('background', `linear-gradient(to top, rgba(${gradients.red},${gradients.green},${gradients.blue},0.3),rgba(${gradients.red},${gradients.green},${gradients.blue},1))`);
        this.tooltip.style.setProperty('background', `linear-gradient(to top, rgba(${gradients.red},${gradients.green},${gradients.blue},0.3),rgba(${gradients.red},${gradients.green},${gradients.blue},1))`);
        this.tooltip.style.setProperty('--gradient', `rgba(${gradients.red},${gradients.green},${gradients.blue},0.5) transparent transparent`);
      }
    }
  }

  onClickSlider() {
    //let device=Object.values(this);
    //device=(this.hasAttribute('[(value)]')?this.getAttribute('[(value)]').replace(':',' '):this.getAttribute('(value)').replace(':',' '));
    //fhemService.sendCommand('set ' + device + ' ' + this.range.value);
    //ftuiApp.toast('set ' + device + ' ' + this.range.value);
    this.submitChange('value',this.range.value);
  }

  onClickUp() {
    const up = parseInt(this.range.value);
    if (this.range.value < parseInt(this.max)){
      this.value = up+parseInt(this.step);
    }
    this.submitChange('value',this.range.value);
  }

  onClickDown() {
    const down = parseInt(this.range.value);
    if (this.range.value > parseInt(this.min)){
      this.value = down-parseInt(this.step);
    }
    this.submitChange('value',this.range.value);
  }

  onMoveSliderEnd() {
    this.tooltip.style.display = 'none';
  }

  sliderInput() {
    this.range.value = parseInt(this.value);
    const gradient=100-((this.range.value - this.range.min)/(this.range.max - this.range.min)*100);
      if(!this.hasAttribute('is-vertical')){
        this.progress.style.width = (this.range.value - this.range.min)/(this.range.max - this.range.min)*100+'%';
        (this.hasAttribute('has-gradient')?this.progress.style.setProperty('background', `linear-gradient(to right, hsla(${gradient},100%,40%,0.3),hsl(${gradient},100%,40%))`)&this.tooltip.style.setProperty('background', `hsl(${gradient},100%,40%)`)&this.tooltip.style.setProperty('--gradient', `hsl(${gradient},100%,40%) transparent transparent`):'');
      } else {
        this.progress.style.height = (this.range.value - this.range.min)/(this.range.max - this.range.min)*100+'%';
        (this.hasAttribute('has-gradient')?this.progress.style.setProperty('background', `linear-gradient(to top, hsla(${gradient},100%,40%,0.3),hsl(${gradient},100%,40%))`)&this.tooltip.style.setProperty('background', `hsl(${gradient},100%,40%)`)&this.tooltip.style.setProperty('--gradient', `transparent hsl(${gradient},100%,30%) transparent transparent`):'');
      };
    this.onToolTip()&this.onToolTipTimeOut()&this.rgbGradient();
  }

  drawTicks() {
    this.ticks.innerHTML = '';
    for (let i = 0; i < this.tickCount; i++) {
      const elem = document.createElement('span');
      if ((i * this.tick) % this.wideTick !== 0) {
        elem.classList.add('small');
      }
      this.ticks.appendChild(elem);
    }
  }

}

window.customElements.define('ftui-volume', FtuiVolume);
