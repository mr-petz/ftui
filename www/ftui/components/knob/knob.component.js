/*
* Knob component for FTUI version 3
*
* Copyright (c) 2019-2021 Mario Stephan <mstephan@shared-files.de>
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*
* https://github.com/knowthelist/ftui
*/

import { FtuiElement } from '../element.component.js';
import { countDecimals, round, limit, scale } from '../../modules/ftui/ftui.helper.js';


export class FtuiKnob extends FtuiElement {

  constructor(properties) {

    super(Object.assign(FtuiKnob.properties, properties));

    if (!this.hasScale && !this.hasScaleText && !this.hasValueText && !this.hasArc && !this.hasNeedle) {
      this.hasArc = true;
    }

    this.svg = this.shadowRoot.querySelector('.svg');
    this.outline = this.shadowRoot.querySelector('.outline');
    this.fill = this.shadowRoot.querySelector('.fill');
    this.scale = this.shadowRoot.querySelector('.scale');
    this.needle = this.shadowRoot.querySelector('.needle');
    this.handle = this.shadowRoot.querySelector('.handle');
    this.desired = this.shadowRoot.querySelector('.desired');

    this.rangeAngle = Math.abs(parseFloat(this.endAngle) - parseFloat(this.startAngle));
    this.radian = Math.PI / 180;

    this.NS = 'http://www.w3.org/2000/svg';

    this.W = parseFloat(window.getComputedStyle(this.svg, null).getPropertyValue('width'));
    this.H = parseFloat(window.getComputedStyle(this.svg, null).getPropertyValue('height'));

    // ~~(..) is a faster Math.floor
    this.centerX = ~~(this.W / 2);
    this.centerY = ~~(this.H / 2) + this.offsetY;
    this.radius = ~~(this.centerX / (this.hasScaleText ? 1.5 : 1.1)) - this.strokeWidth * 0.45;

    this.isDragging = false;

    this.svg.addEventListener('touchstart', (evt) => this.onPointerDownEvent(evt), false);
    this.svg.addEventListener('mousedown', (evt) => this.onPointerDownEvent(evt), false);
    this.svg.addEventListener('touchend', (evt) => this.onPointerOutEvent(evt), false);
    this.svg.addEventListener('mouseup', (evt) => this.onPointerOutEvent(evt), false);
    this.svg.addEventListener('mouseout', (evt) => this.onPointerOutEvent(evt), false);
    this.svg.addEventListener('touchmove', (evt) => this.onPointerMoveEvent(evt), false);
    this.svg.addEventListener('mousemove', (evt) => this.onPointerMoveEvent(evt), false);

    if (this.step < 0) {
      const range = Math.abs(this.max - this.min);
      this.step = range <= 1 ? (this.max - this.min) / this.ticks : 1;
    }
    if (this.valueDecimals < 0) {
      this.valueDecimals = countDecimals(this.step);
    }
    if (this.scaleDecimals < 0) {
      this.scaleDecimals = countDecimals(this.step);
    }
    if (this.unit && this.unitOffsetY === 0 && this.valueOffsetY === 0) {
      this.unitOffsetY = 20;
      this.valueOffsetY = -5;
    }
    this.draw(this.valueToAngle(this.value));
  }

  template() {
    return `
    <style> @import "components/knob/knob.component.css"</style>
    <svg class="svg" height="${this.height}" width="${this.width}" focusable="false">
   
    <defs>
        <linearGradient id="gradient1" gradientTransform="rotate(100)">
        <stop class="mix" offset="0%" />
        <stop id="min" offset="10%" />
      </linearGradient>
      <linearGradient id="gradient2" gradientTransform="rotate(80)">
        <stop class="mix" offset="5%" />
        <stop id="max" offset="15%" />
      </linearGradient>
        <pattern id="pattern" x="0" y="0" width="100%" height="100%" patternUnits="userSpaceOnUse">
          <g transform="rotate(0, 0, 0)">
            <rect shape-rendering="crispEdges" x="0" y="5%" width="100%" height="300%" fill="url(#gradient1)"/>
            <rect shape-rendering="crispEdges" x="50%" y="20%" width="100%" height="300%" fill="url(#gradient2)"/>
          </g>
        </pattern>
      </defs>

      <g class="scale" stroke="gray"></g>
   
      <path class="outline" d="" fill="none" stroke-width="${this.strokeWidth}" />
      <path class="fill" d="" fill="none" stroke="url(#pattern)" stroke-width="${this.strokeWidth}" />
      <polygon class="needle" />
      <circle class="handle" r="9" fill="none" />
      <circle class="desired" r="5" fill="none" />
   
    </svg>`;
  }

  static get properties() {
    return {
      startAngle: -210,
      endAngle: 30,
      value: -1,
      desiredValue: -1,
      unit: '',
      min: 0,
      max: 100,
      offsetY: 20,
      ticks: 10,
      step: -1,
      valueDecimals: -1,
      scaleDecimals: -1,
      height: '150',
      width: '150',
      strokeWidth: 15,
      debounce: 200,
      hasScale: false,
      hasScaleText: false,
      hasValueText: false,
      hasArc: false,
      hasHandle: false,
      hasDesired: false,
      hasNeedle: false,
      type: 'default',
      color: 'primary',
      valueSize: '2.5em',
      unitSize: '1em',
      unitOffsetY: 0,
      unitOffsetX: 0,
      valueOffsetY: 0,
      valueOffsetX: 0,
      scaleTextOffset: 4,
    };
  }

  static get observedAttributes() {
    return [...this.convertToAttributes(FtuiKnob.properties), ...super.observedAttributes];
  }

  onAttributeChanged(name, newValue, oldValue) {
    if (oldValue !== newValue) {
      if (!this.isDragging) {
        if (name === 'type') {
          switch (newValue) {
            case 'handle':
              this.hasArc = true;
              this.hasHandle = true;
              this.hasScale = false;
              this.hasNeedle = false;
              this.strokeWidth = 5;
              break;
            case 'arc':
              this.hasArc = true;
              this.hasHandle = false;
              this.hasScale = false;
              this.hasNeedle = false;
              this.strokeWidth = 15;
              break;
            case 'scale':
              this.hasArc = false;
              this.hasHandle = false;
              this.hasScale = true;
              this.hasNeedle = true;
              this.strokeWidth = 10;
              break;
            default:
              break;
          }
        }
        this.draw(this.valueToAngle(this.value));
      }
    }
  }

  // DOM event handler
  onPointerOutEvent(evt) {
    evt.preventDefault();
    this.isDragging = false;
  }

  onPointerDownEvent(evt) {
    evt.preventDefault();
    this.isDragging = true;

    const mouseAngle = this.getMouseAngle(this.svg, evt);
    this.onChange(mouseAngle);
  }

  onPointerMoveEvent(evt) {
    evt.preventDefault();
    if (this.isDragging) {
      const mouseAngle = this.getMouseAngle(this.svg, evt);
      this.onChange(mouseAngle);
    }
  }

  onChange(angle) {
    if (!this.readonly && this.draw(angle)) {
      this.submitChange('value', this.angleToValue(angle));
    }
  }

  draw(angle) {
    if ((angle <= this.endAngle || angle >= 360 + this.startAngle) && angle >= this.startAngle) {
      this.drawScale();

      if (this.hasArc) {
        this.drawArc(angle);
      } else {
        this.hideElement(this.fill);
        this.hideElement(this.outline);
      }
      if (this.hasValueText) {
        this.drawValue(angle);
      }
      if (this.unit) {
        this.drawUnit();
      }
      if (this.hasNeedle) {
        this.drawNeedle(angle);
      }
      if (this.hasHandle) {
        this.drawHandle(angle);
      } else {
        this.hideElement(this.handle);
      }
      if (this.hasDesired) {
        this.drawDesired();
      } else {
        this.hideElement(this.desired);
      }
      return true;
    }
    return false;
  }

  // draw functions

  drawScale() {
    const upperRadius = this.radius + 5;
    const lowerRadius = this.radius - this.strokeWidth
    const textRadius = this.radius + this.strokeWidth + this.scaleTextOffset

    this.clearRect(this.scale);
    if (this.hasScale) {
      for (let a = this.startAngle; a <= this.endAngle; a += this.rangeAngle / this.ticks) {
        // ticks
        const angleInRadians = a * this.radian;
        const scaleLine = document.createElementNS(this.NS, 'line');
        const scaleLineObj = {
          class: 'scale',
          x1: this.centerX + upperRadius * Math.cos(angleInRadians),
          y1: this.centerY + upperRadius * Math.sin(angleInRadians),
          x2: this.centerX + lowerRadius * Math.cos(angleInRadians),
          y2: this.centerY + lowerRadius * Math.sin(angleInRadians),
        };
        this.setSVGAttributes(scaleLine, scaleLineObj);
        this.scale.appendChild(scaleLine);

        if (this.hasScaleText) {
          // text
          const scaleText = document.createElementNS(this.NS, 'text');
          const scaleTextObj = {
            class: 'scale',
            x: this.centerX + textRadius * Math.cos(a * this.radian),
            y: this.centerY + textRadius * Math.sin(a * this.radian),
          };
          this.setSVGAttributes(scaleText, scaleTextObj);
          scaleText.textContent = this.angleToValue(a).toFixed(this.scaleDecimals);
          this.scale.appendChild(scaleText);
        }
      }
    }
  }

  drawArc(angle) {
    this.fill.setAttributeNS(null, 'd',
      this.describeArc(this.centerX, this.centerY, this.radius - 5, this.startAngle + 360, angle));
    this.fill.setAttributeNS(null, 'stroke-width', this.strokeWidth);
    this.fill.style.display = '';
    this.outline.setAttributeNS(null, 'd',
      this.describeArc(this.centerX, this.centerY, this.radius - 5, this.startAngle + 360, this.endAngle + 360));
    this.outline.setAttributeNS(null, 'stroke-width', this.strokeWidth);
    this.outline.style.display = '';
  }

  drawNeedle(angle) {
    const lowerRadius = (this.hasValueText || this.hasValueText === 'true')
      ? this.radius * 0.4 : this.radius * 0.1;
    const expansion = (this.hasValueText || this.hasValueText === 'true')
      ? 3 : 15;

    const nx1 = this.centerX + lowerRadius * Math.cos((angle - expansion) * this.radian);
    const ny1 = this.centerY + lowerRadius * Math.sin((angle - expansion) * this.radian);

    const nx2 = this.centerX + (this.radius + 5) * Math.cos((angle - 3) * this.radian);
    const ny2 = this.centerY + (this.radius + 5) * Math.sin((angle - 3) * this.radian);

    const nx3 = this.centerX + (this.radius + 5) * Math.cos((angle + 3) * this.radian);
    const ny3 = this.centerY + (this.radius + 5) * Math.sin((angle + 3) * this.radian);

    const nx4 = this.centerX + lowerRadius * Math.cos((angle + expansion) * this.radian);
    const ny4 = this.centerY + lowerRadius * Math.sin((angle + expansion) * this.radian);

    const points = nx1 + ',' + ny1 + ' ' + nx2 + ',' + ny2 + ' ' + nx3 + ',' + ny3 + ' ' + nx4 + ',' + ny4;
    this.needle.setAttributeNS(null, 'points', points);
  }

  drawHandle(angle) {
    const hx = this.centerX + (this.radius * 0.9) * Math.cos(angle * this.radian);
    const hy = this.centerY + (this.radius * 0.9) * Math.sin(angle * this.radian);

    this.handle.setAttributeNS(null, 'cx', hx);
    this.handle.setAttributeNS(null, 'cy', hy);
    this.handle.style.display = '';
  }

  drawDesired() {
    const angle = this.valueToAngle(this.desiredValue);

    const hx = this.centerX + (this.radius * 0.9) * Math.cos(angle * this.radian);
    const hy = this.centerY + (this.radius * 0.9) * Math.sin(angle * this.radian);

    this.desired.setAttributeNS(null, 'cx', hx);
    this.desired.setAttributeNS(null, 'cy', hy);
    this.desired.style.display = '';
  }

  drawValue(angle) {
    const scaleText = document.createElementNS(this.NS, 'text');
    const scaleTextObj = {
      class: 'value',
      x: this.centerX + this.valueOffsetX,
      y: this.centerY + this.valueOffsetY,
      'alignment-baseline': 'middle',
    };
    this.setSVGAttributes(scaleText, scaleTextObj);
    scaleText.textContent = this.angleToValue(angle).toFixed(this.valueDecimals);
    scaleText.style.fontSize = this.valueSize;
    this.scale.appendChild(scaleText);
  }

  drawUnit() {
    const scaleText = document.createElementNS(this.NS, 'text');
    const scaleTextObj = {
      class: 'unit',
      x: this.centerX + this.unitOffsetX,
      y: this.centerY + this.unitOffsetY,
      'alignment-baseline': 'middle',
    };
    this.setSVGAttributes(scaleText, scaleTextObj);
    scaleText.textContent = this.unit;
    scaleText.style.fontSize = this.unitSize;
    this.scale.appendChild(scaleText);
  }

  // helpers

  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees) * this.radian;

    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians)),
    };
  }

  valueToAngle(val) {
    const min = parseFloat(this.min);
    const max = parseFloat(this.max);
    const numericValue = !isNaN(val) ? parseFloat(val) : min;
    const limitedValue = limit(numericValue, min, max);
    return scale(limitedValue, min, max, this.startAngle, this.endAngle)
  }

  angleToValue(angle) {
    const min = parseFloat(this.min);
    const max = parseFloat(this.max);
    let normAngle = (angle - 360 >= this.startAngle) ? angle - 360 : angle;
    normAngle = (normAngle < this.startAngle) ? this.startAngle : (normAngle > this.endAngle) ? this.endAngle : normAngle;
    const value = round((((normAngle - this.startAngle) * (max - min)) / this.rangeAngle) + min, this.valueDecimals);
    return value;
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
      'M', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    ].join(' ');

    return d;
  }

  getMouseAngle(elem, evt) {
    const clientRect = elem.getBoundingClientRect();
    const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
    const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
    const x = Math.round(clientX - clientRect.left - this.centerX);
    const y = Math.round(clientY - clientRect.top - this.centerY);
    let angle = Math.atan2(y, x) * 180 / Math.PI;
    angle = angle < 0 ? angle + 360 : angle;
    const min = this.startAngle < 0 ? this.startAngle + 360 : this.startAngle;
    const step = (this.rangeAngle / ((this.max - this.min) / this.step));
    const offset = min - ((Math.ceil(min / step)) * step);
    const out = ((Math.ceil(angle / step)) * step) + offset;
    return Math.floor(out);
  }

  clearRect(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  hideElement(node) {
    node.style.display = 'none';
  }

  setSVGAttributes(elem, oAtt) {
    for (const prop in oAtt) {
      elem.setAttributeNS(null, prop, oAtt[prop]);
    }
  }
}

window.customElements.define('ftui-knob', FtuiKnob);
