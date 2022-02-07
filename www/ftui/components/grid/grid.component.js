/*
* Grid component for FTUI version 3
*
* Copyright (c) 2019-2022 Mario Stephan <mstephan@shared-files.de>
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*
* https://github.com/knowthelist/ftui
*/

import { FtuiElement } from '../element.component.js';
import { debounce } from '../../modules/ftui/ftui.helper.js';
// eslint-disable-next-line no-unused-vars
import { FtuiGridTile } from './grid-tile.component.js';

export class FtuiGrid extends FtuiElement {

  constructor() {
    const properties = {
      baseWidth: 140,
      baseHeight: 140,
      margin: 8,
      resize: false,
      responsive: false,
    };
    super(properties);

    this.debouncedResize = debounce(this.configureGrid, this);

    this.windowWidth = 0;
    this.tiles = this.querySelectorAll('ftui-grid-tile');

    if (this.resize && !this.responsive) {
      window.addEventListener('resize', () => {
        if (this.windowWidth !== window.innerWidth) {
          this.debouncedResize(500);
          this.windowWidth = window.innerWidth;
        }
      });
    }
    if (this.responsive) {
      this.configResponsiveGrid();
    } else {
      this.configureGrid();
      document.addEventListener('ftuiVisibilityChanged', () => this.configureGrid());
      document.addEventListener('ftuiComponentsAdded', () => this.configureGrid());
    }
  }

  template() {
    return `<style> 
      :host(:not([responsive])) {
        position: relative;
        display: block;
        width: 100%;
        height: 100%;
        margin: 0;
      }
      :host([responsive]) {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        grid-template-rows: repeat(auto-fill, minmax(140px, 1fr));
        grid-auto-flow: dense;
        grid-auto-columns: 25%;
        grid-auto-rows: 25%;
        gap: ${this.margin}px;
        margin: ${this.margin}px;
      }
      :host([shape="round"]) {
        --grid-tile-border-radius: 1rem;
      }
    </style>
    <slot></slot>
    `;
  }

  onConnected() {
    //this.style.margin = 0;
  }

  configResponsiveGrid() {
    this.tiles.forEach(tile => {
      tile.style['grid-row'] = 'span ' + tile.getAttribute('width');
      tile.style['grid-column'] = 'span ' + tile.getAttribute('height');
    });
    this.style['grid-auto-rows'] = this.baseHeight + 'px';
    this.style['grid-auto-columns'] = this.baseWidth + 'px';
  }

  configureGrid() {
    this.tiles.forEach(tile => {
      const style = tile.style;
      style.width = (tile.width * this.baseWidth - this.margin) + 'px';
      style.height = (tile.height * this.baseHeight - this.margin) + 'px';
      style['position'] = 'absolute';
      tile.setAttribute('title', `row: ${tile.row} | col: ${tile.col}`);
      if (tile.querySelector('ftui-grid')) {
        style.backgroundColor = 'transparent';
        style.left = ((tile.col - 1) * this.baseWidth) + 'px';
        style.top = ((tile.row - 1) * this.baseHeight) + 'px';
      } else {
        style.left = ((tile.col - 1) * this.baseWidth + this.margin) + 'px';
        style.top = ((tile.row - 1) * this.baseHeight + this.margin) + 'px';
      }
    });
  }
}

window.customElements.define('ftui-grid', FtuiGrid);
