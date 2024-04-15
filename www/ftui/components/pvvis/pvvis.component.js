/*
* FTUI3 photovoltaic visualization component for FTUI version 3
*
* based on papas version for FTUI2
* by yersinia & mr_petz & Shadow3561 & docolli
* version 2024-04-15
*
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*
* https://github.com/knowthelist/ftui
*
* FHEM Forum: https://forum.fhem.de/index.php/topic,119440.0.html
*
*/

import { FtuiElement } from '../element.component.js';

export class FtuiPvvis extends FtuiElement {
  constructor(properties) {

    super(Object.assign(FtuiPvvis.properties, properties));
    this.svgdiv = this.shadowRoot.querySelector('.pvvis-box');
    this.sun = this.shadowRoot.getElementById('pvvis-sun-sun');
    this.home = this.shadowRoot.getElementById('pvvis-home-house');
    this.grid = this.shadowRoot.getElementById('pvvis-grid-cable');
    this.car = this.shadowRoot.getElementById('pvvis-car');
    this.battery = this.shadowRoot.getElementById('pvvis-battery');
    this.bat100 = this.shadowRoot.getElementById('bat100');
    this.bat75 = this.shadowRoot.getElementById('bat75');
    this.bat50 = this.shadowRoot.getElementById('bat50');
    this.bat25 = this.shadowRoot.getElementById('bat25');
  }

  template() {
    return `
    <style>@import "components/pvvis/pvvis.component.css";</style>
      <div class="pvvis-box">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
          <defs>
            <clipPath id="pvvis-car-template">
              <path d="m501.4 112h-60l-17-42c-17-43-58-70-104-70h-127c-46 0-87 28-104 70l-17 42h-60c-7.8 0-14 7.3-12 15l6 24c1.3 5.3 6.1 9.1 12 9.1h20c-13 12-22 29-22 48v48c0 16 6.2 31 16 42v54c0 18 14 32 32 32h32c18 0 32-14 32-32v-32h256v32c0 18 14 32 32 32h32c18 0 32-14 32-32v-54c9.8-11 16-26 16-42v-48c0-19-8.6-36-22-48h20c5.5 0 10-3.8 12-9.1l6-24c1.9-7.6-3.8-15-12-15zm-352-18c7.3-18 25-30 45-30h127c20 0 37 12 45 30l20 50h-256zm-52 162c-19 0-32-13-32-32s13-32 32-32c19 0 48 29 48 48s-29 16-48 16zm320 0c-19 0-48 3.2-48-16s29-48 48-48 32 13 32 32-13 32-32 32z"/>
            </clipPath>
          </defs>
          <g id="pvvis-sun-sun" class="pvvis-sun-sun pvvis-sun-inactive">
            <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z" />
          </g>
          <g id="pvvis-sun-sun2" class="pvvis-sun-sun2 pvvis-sun-inactive">
            <path d="M256 159.1c-53.02 0-95.1 42.98-95.1 95.1S202.1 351.1 256 351.1s95.1-42.98 95.1-95.1S309 159.1 256 159.1zM509.3 347L446.1 255.1l63.15-91.01c6.332-9.125 1.104-21.74-9.826-23.72l-109-19.7l-19.7-109c-1.975-10.93-14.59-16.16-23.72-9.824L256 65.89L164.1 2.736c-9.125-6.332-21.74-1.107-23.72 9.824L121.6 121.6L12.56 141.3C1.633 143.2-3.596 155.9 2.736 164.1L65.89 256l-63.15 91.01c-6.332 9.125-1.105 21.74 9.824 23.72l109 19.7l19.7 109c1.975 10.93 14.59 16.16 23.72 9.824L256 446.1l91.01 63.15c9.127 6.334 21.75 1.107 23.72-9.822l19.7-109l109-19.7C510.4 368.8 515.6 356.1 509.3 347zM256 383.1c-70.69 0-127.1-57.31-127.1-127.1c0-70.69 57.31-127.1 127.1-127.1s127.1 57.3 127.1 127.1C383.1 326.7 326.7 383.1 256 383.1z"/>
          </g>
          <g id="pvvis-sun-pvsun" class="pvvis-sun-pvsun pvvis-sun-inactive">
            <g id="pvvis-sun-pvsun-sun">
              <path d="M5.114,5.726c0.169,0.168,0.442,0.168,0.611,0c0.168-0.169,0.168-0.442,0-0.61L3.893,3.282c-0.168-0.168-0.442-0.168-0.61,0c-0.169,0.169-0.169,0.442,0,0.611L5.114,5.726z M3.955,10c0-0.239-0.193-0.432-0.432-0.432H0.932C0.693,9.568,0.5,9.761,0.5,10s0.193,0.432,0.432,0.432h2.591C3.761,10.432,3.955,10.239,3.955,10 M10,3.955c0.238,0,0.432-0.193,0.432-0.432v-2.59C10.432,0.693,10.238,0.5,10,0.5S9.568,0.693,9.568,0.932v2.59C9.568,3.762,9.762,3.955,10,3.955 M14.886,5.726l1.832-1.833c0.169-0.168,0.169-0.442,0-0.611c-0.169-0.168-0.442-0.168-0.61,0l-1.833,1.833c-0.169,0.168-0.169,0.441,0,0.61C14.443,5.894,14.717,5.894,14.886,5.726 M5.114,14.274l-1.832,1.833c-0.169,0.168-0.169,0.441,0,0.61c0.168,0.169,0.442,0.169,0.61,0l1.833-1.832c0.168-0.169,0.168-0.442,0-0.611C5.557,14.106,5.283,14.106,5.114,14.274 M19.068,9.568h-2.591c-0.238,0-0.433,0.193-0.433,0.432s0.194,0.432,0.433,0.432h2.591c0.238,0,0.432-0.193,0.432-0.432S19.307,9.568,19.068,9.568 M14.886,14.274c-0.169-0.168-0.442-0.168-0.611,0c-0.169,0.169-0.169,0.442,0,0.611l1.833,1.832c0.168,0.169,0.441,0.169,0.61,0s0.169-0.442,0-0.61L14.886,14.274z M10,4.818c-2.861,0-5.182,2.32-5.182,5.182c0,2.862,2.321,5.182,5.182,5.182s5.182-2.319,5.182-5.182C15.182,7.139,12.861,4.818,10,4.818M10,14.318c-2.385,0-4.318-1.934-4.318-4.318c0-2.385,1.933-4.318,4.318-4.318c2.386,0,4.318,1.933,4.318,4.318C14.318,12.385,12.386,14.318,10,14.318 M10,16.045c-0.238,0-0.432,0.193-0.432,0.433v2.591c0,0.238,0.194,0.432,0.432,0.432s0.432-0.193,0.432-0.432v-2.591C10.432,16.238,10.238,16.045,10,16.045" />
            </g>
            <g id="pvvis-sun-pvsun-panel">
              <path d="M431.98 448.01l-47.97.05V416h-128v32.21l-47.98.05c-8.82.01-15.97 7.16-15.98 15.99l-.05 31.73c-.01 8.85 7.17 16.03 16.02 16.02l223.96-.26c8.82-.01 15.97-7.16 15.98-15.98l.04-31.73c.01-8.85-7.17-16.03-16.02-16.02zM585.2 26.74C582.58 11.31 568.99 0 553.06 0H86.93C71 0 57.41 11.31 54.79 26.74-3.32 369.16.04 348.08.03 352c-.03 17.32 14.29 32 32.6 32h574.74c18.23 0 32.51-14.56 32.59-31.79.02-4.08 3.35 16.95-54.76-325.47zM259.83 64h120.33l9.77 96H250.06l9.77-96zm-75.17 256H71.09L90.1 208h105.97l-11.41 112zm16.29-160H98.24l16.29-96h96.19l-9.77 96zm32.82 160l11.4-112h149.65l11.4 112H233.77zm195.5-256h96.19l16.29 96H439.04l-9.77-96zm26.06 256l-11.4-112H549.9l19.01 112H455.33z" />
            </g>
          </g>
          <g id="pvvis-home-house">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </g>
          <g id="pvvis-home-plug">
            <path d="M25,9 L21,9 L21,5 C21,4.447 20.553,4 20,4 C19.447,4 19,4.447 19,5 L19,9 L13,9 L13,5 C13,4.447 12.553,4 12,4 C11.447,4 11,4.447 11,5 L11,9 L7,9 C6.447,9 6,9.447 6,10 C6,10.553 6.447,11 7,11 L8,11 L8,15 C8,18.727 10.552,21.849 14,22.738 L14,26 C14,27.104 14.896,28 16,28 C17.104,28 18,27.104 18,26 L18,22.738 C21.448,21.849 24,18.727 24,15 L24,11 L25,11 C25.553,11 26,10.553 26,10 C26,9.447 25.553,9 25,9"></path>
          </g>
          <g id="pvvis-home-socket">
            <path d="M75 2941 c-16 -10 -39 -28 -50 -41 -20 -22 -20 -36 -20 -1415 l0 -1393 25 -27 c55 -59 -38 -55 1445 -55 1483 0 1390 -4 1445 55 l25 27 0 1394 0 1394 -38 37 -37 38 -1383 3 c-1332 2 -1383 1 -1412 -17z m2743 -1453 l-3 -1343 -1340 0 -1340 0 -3 1330 c-1 732 0 1336 3 1343 3 9 282 12 1345 12 l1340 0 -2 -1342z" />
            <path d="M589 2417 c-19 -13 -39 -38 -46 -57 -15 -45 -18 -1676 -3 -1731 6 -19 22 -46 36 -60 l26 -24 885 0 885 0 29 33 29 32 0 878 c0 964 4 904 -60 937 -25 13 -145 15 -888 15 l-859 0 -34 -23z m785 -142 c22 -22 33 -25 101 -25 68 0 79 3 101 25 25 25 25 25 216 25 l192 0 158 -157 158 -157 0 -490 0 -491 -167 -167 -168 -168 -187 0 c-137 0 -188 3 -188 12 0 6 -7 20 -17 30 -13 15 -31 18 -101 18 -87 0 -122 -13 -122 -47 0 -10 -35 -13 -172 -13 l-173 0 -167 167 -168 168 0 480 0 480 167 167 168 168 172 0 c170 0 172 0 197 -25z" />
            <path d="M954 1589 c-16 -18 -19 -37 -19 -111 0 -118 10 -128 132 -128 76 0 86 2 108 25 22 21 25 33 25 100 0 73 -10 112 -34 127 -6 4 -52 8 -102 8 -80 0 -93 -3 -110 -21z" />
            <path d="M1780 1590 c-17 -17 -20 -33 -20 -108 0 -80 2 -91 23 -110 20 -19 35 -22 110 -22 120 0 127 8 127 133 0 123 -4 127 -128 127 -79 0 -95 -3 -112 -20z" />
          </g>
          <g id="pvvis-battery" class="pvvis-battery-charge">
            <line x1="75" y1="30" x2="75" y2="280" class="pvvis-batline"></line>
            <line x1="225" y1="30" x2="225" y2="280" class="pvvis-batline"></line>
            <line x1="69" y1="30" x2="231" y2="30" class="pvvis-batline"></line>
            <line x1="69" y1="284" x2="231" y2="285" class="pvvis-batline"></line>
            <line x1="105" y1="20" x2="195" y2="20" style="stroke-width: 25px;"></line>
            <rect id="bat100" x="92" y="48" width="116" height="48" class="pvvis-batbar"></rect>
            <rect id="bat75" x="92" y="106" width="116" height="48" class="pvvis-batbar"></rect>
            <rect id="bat50" x="92" y="164" width="116" height="48" class="pvvis-batbar"></rect>
            <rect id="bat25" x="92" y="222" width="116" height="48" class="pvvis-batbar"></rect>
            <rect id="pvvis-bat-load-bar" x="86" y="36" width="130" height="10"></rect>
            <path id="pvvis-bat-load-triangle" d="M236 36 l+31 -18 l+0 +36" />
          </g>
          <g id="pvvis-grid-cable" class="pvvis-grid-cable pvvis-grid-consume">
            <path d="M20,5V4c0-0.55-0.45-1-1-1h-2c-0.55,0-1,0.45-1,1v1h-1v4c0,0.55,0.45,1,1,1h1v7c0,1.1-0.9,2-2,2s-2-0.9-2-2V7 c0-2.21-1.79-4-4-4S5,4.79,5,7v7H4c-0.55,0-1,0.45-1,1v4h1v1c0,0.55,0.45,1,1,1h2c0.55,0,1-0.45,1-1v-1h1v-4c0-0.55-0.45-1-1-1H7 V7c0-1.1,0.9-2,2-2s2,0.9,2,2v10c0,2.21,1.79,4,4,4s4-1.79,4-4v-7h1c0.55,0,1-0.45,1-1V5H20z" />
          </g>
          <g id="pvvis-grid-pylon" class="pvvis-grid-pylon pvvis-grid-consume">
            <path d="M50.651,10.354c0.12-0.86-0.858-1.239-1.187-1.364L34.677,3.347 c-0.749-0.285-1.852-1.082-2.356-1.705l-0.632-0.778C31.235,0.307,30.623,0,29.967,0c-0.688,0-1.335,0.348-1.778,0.95l-0.336,0.457 c-0.468,0.637-1.523,1.444-2.261,1.728L10.366,8.986C10.04,9.113,9.065,9.493,9.182,10.35c-0.001,0.025-0.015,0.046-0.015,0.072 v5.692c0,0.481,0.389,0.869,0.87,0.869s0.869-0.389,0.869-0.869v-4.823h13.485l-8.412,47.52c-0.084,0.473,0.232,0.924,0.706,1.006 c0.47,0.087,0.922-0.231,1.006-0.703l2.003-11.312h20.537l2.265,11.331c0.084,0.412,0.446,0.698,0.852,0.698 c0.057,0,0.114-0.005,0.171-0.018c0.471-0.094,0.777-0.551,0.684-1.021l-9.489-47.501h14.211v4.823c0,0.481,0.39,0.869,0.869,0.869 c0.482,0,0.871-0.389,0.871-0.869v-5.692C50.666,10.397,50.653,10.377,50.651,10.354z M23.59,25.801h4.238l-5.432,6.736 L23.59,25.801z M22.769,34.847l6.891-8.548l7.181,8.548H22.769z M34.925,36.585l-5.21,3.049l-5.437-3.049H34.925z M21.593,37.073 l6.383,3.578l-7.825,4.578L21.593,37.073z M22.174,46.061l7.559-4.424l7.888,4.424H22.174z M39.723,45.247l-8.251-4.627 l6.561-3.839L39.723,45.247z M37.19,32.56l-5.679-6.758h4.328L37.19,32.56z M35.492,24.062H23.897l2.144-12.112h7.032 L35.492,24.062z M13.74,9.553l12.475-4.796c1.043-0.4,2.379-1.421,3.04-2.321L29.59,1.98c0.225-0.308,0.512-0.309,0.75-0.018 l0.632,0.777c0.698,0.859,2.055,1.84,3.086,2.233l12.006,4.581H13.74z"/>
          </g>
          <g id="pvvis-grid-pylon2" class="pvvis-grid-pylon2 pvvis-grid-consume">
            <path d="M217.529 46.629H83.817c-8.83 0-16 7.169-16 16v32c0 .196.004.391.011.586v51.22c0 6.209 5.041 11.25 11.25 11.25h22.5c6.209 0 11.25-5.041 11.25-11.25v-35.806h104.701v84.697H83.577c-8.83 0-16 7.169-16 16v32c0 .196.004.391.011.586v51.22c0 6.209 5.041 11.25 11.25 11.25h22.5c6.209 0 11.25-5.041 11.25-11.25v-35.806h104.941v49.925L176.47 506.932l160 .033-39.179-197.538v-50.101h100.402v35.756c0 6.257 5.08 11.337 11.337 11.337h22.674c6.257 0 11.337-5.08 11.337-11.337v-83.756c0-8.831-7.169-16-16-16h-129.75v-84.697h100.642v35.756c0 6.257 5.08 11.337 11.337 11.337h22.674c6.257 0 11.337-5.08 11.337-11.337V62.629c0-8.831-7.169-16-16-16h-129.99V26.162c-.043-12.777-40.058-18.846-40.159-18.633 0 0-39.66 6.092-39.603 18.633v20.467Z"/>
          </g>
          <g id="pvvis-car" class="pvvis-car">
            <rect id="pvvis-car-fill-top" x="0" y="0" clip-path="url(#pvvis-car-template)" class="pvvis-car-fill-top" />
            <rect id="pvvis-car-fill-bottom" x="0" y="100%" clip-path="url(#pvvis-car-template)" class="pvvis-car-fill-bottom" />
          </g>
          <g id="pvvis-loadflows">
            <path id="pv-home" d="M255,100 L255,180 C255,255,255,255,180,255 L100,255" class="pvvis-inactive" />
            <path id="bat-home" d="M500,300 L100,300" class="pvvis-inactive" />
            <path id="pv-grid" d="M300,100 L300,500" class="pvvis-inactive" />
            <path id="pv-bat" d="M345,100 L345,180 C345,255,345,255,420,255 L500,255" class="pvvis-inactive" />
            <path id="grid-home" d="M255,500 L255,420 C255,345,255,345,180,345 L100,345" class="pvvis-inactive" />
            <path id="grid-bat" d="M345,500 L345,425 C345,345,345,345,425,345 L500,345" class="pvvis-inactive" />
            <path id="home-car" d="M0,380 L0,510" class="pvvis-inactive" />
          </g>
          <g id="pvvis-own-cons-flow">
          <!-- when changing d -> update in calc function as well! -->
            <path id="pvvis-own-cons-flow-current" d="M38,34 L88,34" style="" />
            <path id="pvvis-own-cons-flow-basis" d="M38,34 L126,34" style="" />
          </g>
          <g id="pvvis-own-cons-circle" transform="rotate(90, 50, 46)">
            <circle id="pvvis-own-cons-circle-current" cx="50" cy="46" r="25" style="" />
            <circle id="pvvis-own-cons-circle-basis" cx="50" cy="46" r="25" style="" />
          </g>
          <g id="pvvis-autarky-flow">
          <!-- when changing d -> update in calc function as well! -->
            <path id="pvvis-autarky-flow-current" d="M38,52 L88,52" style="" />
            <path id="pvvis-autarky-flow-basis" d="M38,52 L126,52" style="" />
          </g>
          <g id="pvvis-autarky-circle" transform="rotate(90, 110, 46)">
            <circle id="pvvis-autarky-circle-current" cx="110" cy="46" r="25" style="" />
            <circle id="pvvis-autarky-circle-basis" cx="110" cy="46" r="25" style="" />
          </g>
          <!-- TEXT -->
          <text id="pv-produce-txt" x="250" y="52" class="pvvis-produce-txt"></text>
          <text id="home-consume-txt" x="48" y="155" class="pvvis-home-text"></text>
          <text id="bat-val-txt" x="345" y="256" class="" style=""></text>
          <text id="pv-home-txt" x="160" y="160" class="pvvis-text"></text>
          <text id="grid-home-txt" x="160" y="255" class="pvvis-text"></text>
          <text id="grid-bat-txt" x="300" y="255" class="pvvis-text"></text>
          <text id="pv-bat-txt" x="300" y="160" class="pvvis-text"></text>
          <text id="bat-home-txt" x="300" y="235" class="pvvis-text"></text>
          <text id="pv-grid-txt" x="220" y="275" class="pvvis-text" style="text-anchor: start;"></text>
          <text id="home-car-txt" x="64" y="305" class="pvvis-text" style="text-anchor: start;"></text>
          <text id="pvvis-car-temp-val-txt" x="48" y="337" class="" style=""></text>
          <text id="pvvis-car-bat-val-txt" x="48" y="383" class="" style=""></tspan></text>
          <text id="pvvis-bat-remain-txt" x="345" y="228" class="" style=""></text>
          <text id="pvvis-pv-producedtoday-txt" x="250" y="74" class="pvvis-text2"></text>
          <text id="pvvis-pv-forecast-txt" x="250" y="92" class="pvvis-text2"></text>
          <text id="pvvis-home-consumedtoday-txt" x="48" y="153" class="pvvis-text2" style="text-anchor: middle;"></text>
          <text id="pvvis-grid-out-today-txt" x="240" y="325" class="pvvis-text2"></text>
          <text id="pvvis-grid-in-today-txt" x="240" y="345" class="pvvis-text2"></text>
          <text id="pvvis-autarky-pretxt" x="110" y="38" class="pvvis-text2" style="text-anchor: middle;">AU</text>
          <text id="pvvis-autarky-txt" x="110" y="54" class="pvvis-text2" style="text-anchor: middle;"></text>
          <text id="pvvis-own-cons-pretxt" x="50" y="38" class="pvvis-text2" style="text-anchor: middle;">OC</text>
          <text id="pvvis-own-cons-txt" x="50" y="54" class="pvvis-text2" style="text-anchor: middle;"></text>
        </svg>
      </div>
    `;
  }

  static get properties() {
    return {
      auOcType: 'circle',
      autarky: 0,
      batmax: 0,
      batstep: '',
      calcBatRemainTime: false,
      calcBatRemainSocNotPercent: false,
      carSoc: -1,
      carTemp: -100,
      charge: 0,
      chargeDischarge: 0,
      discharge: 0,
      doNotShowZero: false,
      feed: 0,
      feedReceive: 0,
      flowThreshold: 0,
      gridCharge: 0,
      gridConsumeTdy: 0,
      gridFeedTdy: 0,
      gridIcon: 'cable',
      hasGridCharge: false,
      hasNoBattery: false,
      hasNoGridFeed: false,
      hasNoWallbox: false,
      homeConsumeTdy: 0,
      homeIcon: 'house',
      noBatGradient: false,
      noWbInHome: false,
      ownConsumption: 0,
      produce: 0,
      pvForecast: 0,
      pvhomeval: 0,
      pvProdTdy: 0,
      pvmax: 0,
      receive: 0,
      soc: 0,
      sunIcon: 'sun',
      unitCarSoc: '',
      unitSoc: '',
      unitSum: '',
      unitValue: '',
      wbFeed: 0,
      width: '200px',
    };
  }

  static get observedAttributes() {
    return [...this.convertToAttributes(FtuiPvvis.properties), ...super.observedAttributes];
  }

  onConnected() {
    this.svgdiv.style.width = this.width;
    this.checkObjectsExists();
    this.checkIcons();
    this.calcProduce();
    this.calcSunOpacity();
    this.colorGrid();
    this.colorBat();
    this.colorCar();
  }

  onAttributeChanged(name, value) {
    switch (name) {
      case 'autarky':
        this.calcAutarkyOwnConsumption("autarky", value);
        break;
      case 'car-soc':
        this.shadowRoot.getElementById("pvvis-car-bat-val-txt").style.display = "unset";
        this.colorCar();
        break;
      case 'car-temp':
        this.shadowRoot.getElementById("pvvis-car-temp-val-txt").style.display = "unset";
        this.shadowRoot.getElementById("pvvis-car-temp-val-txt").innerHTML = value + '<tspan class="pvvis-txt-unit">&deg;C</tspan>';
        break;
      case 'charge':
        this.flowValue(value, "pv-bat");
        this.socValue();
        this.calcProduce();
        this.colorBat();
        break;
      case 'charge-discharge':
        // one reading - negative when discharge; positive when charge
        if (Number.parseFloat(value) < 0) {
          this.discharge = Math.abs(value);
          this.charge = 0;
        } else if (Number.parseFloat(value) > 0) {
          this.charge = value;
          this.discharge = 0;
        } else {
          this.charge = 0;
          this.discharge = 0;
        }
        break;
      case 'discharge':
        this.flowValue(value, "bat-home");
        this.socValue();
        this.colorBat();
        this.calcHouseConsume();
        break;
      case 'feed':
        this.flowValue(value, "pv-grid");
        this.calcProduce();
        this.colorGrid();
        break;
      case 'feed-receive':
        // one reading - negative when consume; positive when feed
        if (Number.parseFloat(value) > 0) {
          this.feed = value;
          this.receive = 0;
        } else if (Number.parseFloat(value) < 0) {
          this.receive = Math.abs(value);
          this.feed = 0;
        } else {
          this.feed = 0;
          this.receive = 0;
        }
        break;
      case 'grid-charge':
        this.flowValue(value, "grid-bat");
        this.socValue();
        this.calcProduce();
        this.colorBat();
        break;
      case 'grid-consume-tdy':
        this.powerVals(value, "pvvis-grid-in-today-txt", "<tspan style=\"fill: var(--pvvis-color-red, red);\">&rArr;</tspan>&sum;&nbsp;"); //uArr
        break;
      case 'grid-feed-tdy':
        this.powerVals(value, "pvvis-grid-out-today-txt", "<tspan style=\"fill: var(--pvvis-color-green, green);\">&lArr;</tspan>&sum;&nbsp;"); //dArr
        break;
      case 'home-consume-tdy':
        if (!this.hasNoWallbox) {
          this.shadowRoot.getElementById("home-consume-txt").setAttribute("y", "130");
        }
        this.powerVals(value, "pvvis-home-consumedtoday-txt", "&sum;&nbsp;");
        break;
      case 'own-consumption':
        this.calcAutarkyOwnConsumption("own-cons", value);
        break;
      case 'produce':
        this.calcProduce();
        this.calcSunOpacity();
        break;
      case 'pv-forecast':
        this.powerVals(value, "pvvis-pv-forecast-txt", "&UpperRightArrow;&nbsp;");
        break;
      case 'pv-prod-tdy':
        this.powerVals(value, "pvvis-pv-producedtoday-txt", "&sum;&nbsp;");
        break;
      case 'receive':
        this.flowValue(value, "grid-home");
        this.colorGrid();
        this.calcHouseConsume();
        break;
      case 'soc':
        this.socValue();
        this.colorBat();
        break;
      case 'wb-feed':
        this.flowValue(value, "home-car");
        this.colorCar();
        break;
    }
  }

  calcAutarkyOwnConsumption(obj, value) {
    if (!this.auOcType) { this.auOcType = 'circle'; }
    else if (this.auOcType == 'circle') { }
    else if (this.auOcType == 'flow') { }
    else { this.auOcType = 'circle'; }

    value = parseInt(value);
    if (value < 0) { value = 0; }
    if (value > 100) { value = 100; }

    //fill bars in dependence of autarky value from red->green
    //https://jsfiddle.net/JeancarloFontalvo/1sco9Lpe/3/
    const percentColors = [
      { pct: 0, color: { r: 0x99, g: 0x00, b: 0 } },
      { pct: 50, color: { r: 0x99, g: 0x99, b: 0 } },
      { pct: 100, color: { r: 0x00, g: 0x99, b: 0 } }
    ];
    let i = 1;
    for (i; i < percentColors.length - 1; i++) { if (value < percentColors[i].pct) { break; } }
    const lower = percentColors[i - 1];
    const upper = percentColors[i];
    const range = upper.pct - lower.pct;
    const rangePct = (value - lower.pct) / range;
    const pctLower = 1 - rangePct;
    const pctUpper = rangePct;
    const color = {
      r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
      g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
      b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
    };
    this.shadowRoot.getElementById("pvvis-" + obj + "-" + this.auOcType).style.display = "unset";
    this.shadowRoot.getElementById("pvvis-" + obj + "-" + this.auOcType + "-current").style.stroke = 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
    this.shadowRoot.getElementById("pvvis-" + obj + "-pretxt").style.display = "unset";
    this.shadowRoot.getElementById("pvvis-" + obj + "-txt").style.display = "unset";

    if (this.auOcType == "flow") {
      const flowUpperLimit = 126;
      const flowLowerLimit = 38;
      const flowPosY = (obj == "autarky") ? 52 : 34;
      const flowPosX = flowLowerLimit + Math.round((flowUpperLimit - flowLowerLimit) * (value / 100));
      const flowSizeD = "M" + flowLowerLimit + "," + flowPosY + " L" + flowPosX + "," + flowPosY;
      this.shadowRoot.getElementById("pvvis-" + obj + "-" + this.auOcType + "-current").setAttribute("d", flowSizeD);
      //reposition pretxt
      this.shadowRoot.getElementById("pvvis-" + obj + "-pretxt").setAttribute("x", (flowUpperLimit + 4));
      this.shadowRoot.getElementById("pvvis-" + obj + "-pretxt").setAttribute("y", (flowPosY + 4)); //stroke-width = 4
      this.shadowRoot.getElementById("pvvis-" + obj + "-pretxt").style.textAnchor = "start";
      //reposition value txt
      this.shadowRoot.getElementById("pvvis-" + obj + "-txt").setAttribute("x", (flowLowerLimit - 4));
      this.shadowRoot.getElementById("pvvis-" + obj + "-txt").setAttribute("y", (flowPosY + 4)); //stroke-width = 4
      this.shadowRoot.getElementById("pvvis-" + obj + "-txt").style.textAnchor = "end";
    } else if (this.auOcType == "circle") {
      let r = this.shadowRoot.getElementById("pvvis-" + obj + "-" + this.auOcType + "-current").getAttribute("r");
      r = parseInt(r);
      const c = Math.PI * 2 * r; //circumference
      const offset = ((100 - value) / 100) * c;
      this.shadowRoot.getElementById("pvvis-" + obj + "-" + this.auOcType + "-current").style.strokeDashoffset = offset.toFixed(1);
    }
    this.shadowRoot.getElementById("pvvis-" + obj + "-txt").style.fill = 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
    this.shadowRoot.getElementById("pvvis-" + obj + "-txt").innerHTML = value;
    this.shadowRoot.getElementById("pvvis-" + obj + "-txt").innerHTML += '<tspan class="pvvis-txt-unit-value">' + '%' + '</tspan>';
  }

  calcHouseConsume() {
    let houseConsume = this.pvhomeval + this.discharge + this.receive;
    if (this.noWbInHome) { houseConsume = houseConsume - this.wbFeed; }
    if ((this.doNotShowZero) && (houseConsume.toFixed() == 0)) {
      this.shadowRoot.getElementById("home-consume-txt").innerHTML = '';
    } else {
      this.shadowRoot.getElementById("home-consume-txt").innerHTML = houseConsume; //.toFixed();
      if (this.unitValue) { this.shadowRoot.getElementById("home-consume-txt").innerHTML += '<tspan class="pvvis-txt-unit-value">' + this.unitValue + '</tspan>'; }
    }
  }

  calcProduce() {
    this.pvhomeval = Math.abs(this.produce) - this.charge - this.feed;
    if (this.pvhomeval < 0) { this.pvhomeval = 0; }
    this.flowValue(this.pvhomeval, "pv-home");
    this.calcHouseConsume();
  }

  calcSunOpacity() {
    let sunOpacity = 0.2 + (0.8 * (Math.abs(this.produce) / this.pvmax));
    this.sun.style.opacity = sunOpacity.toFixed(3);
    this.sun.classList.remove("pvvis-sun-inactive", "pvvis-sun-active");
    if (Math.abs(this.produce) > 0) {
      this.sun.classList.add("pvvis-sun-active");
      this.shadowRoot.getElementById("pv-produce-txt").innerHTML = this.produce; //Math.abs(this.produce).toFixed();
      if (this.unitValue) { this.shadowRoot.getElementById("pv-produce-txt").innerHTML += '<tspan class="pvvis-txt-unit-value">' + this.unitValue + '</tspan>'; }
    } else {
      this.sun.classList.add("pvvis-sun-inactive");
      this.shadowRoot.getElementById("pv-produce-txt").innerHTML = "";
    }
  }

  colorGrid() {
    let consumption = this.receive + this.gridCharge - this.feed;
    this.grid.classList.remove("pvvis-grid-feed", "pvvis-grid-consume", "pvvis-grid-neutral");
    if (consumption > this.flowThreshold) { this.grid.classList.add("pvvis-grid-consume"); }
    else if (consumption < -this.flowThreshold) { this.grid.classList.add("pvvis-grid-feed"); }
    else { this.grid.classList.add("pvvis-grid-neutral"); }
  }

  colorCar() {
    //this.car.classList.remove("pvvis-car-feed");
    //if(this.wbFeed > 0) { this.car.classList.add("pvvis-car-feed"); }
    if (this.carSoc >= 0) {
      this.shadowRoot.getElementById("pvvis-car-bat-val-txt").innerHTML = this.carSoc.toFixed();
      if (this.unitCarSoc) { this.shadowRoot.getElementById("pvvis-car-bat-val-txt").innerHTML += '<tspan class="pvvis-txt-unit-car">' + this.unitCarSoc + '</tspan>'; }
      this.shadowRoot.getElementById("pvvis-car-fill-bottom").style.display = 'unset';
      this.shadowRoot.getElementById("pvvis-car-fill-bottom").setAttribute("y", ("" + (95 - (this.carSoc * 0.95)) + "%"));
    }
    if ((this.carSoc >= 0) && (this.wbFeed > 0)) {
      this.shadowRoot.getElementById("pvvis-car-fill-top").classList.remove("pvvis-car-fill-top");
      this.shadowRoot.getElementById("pvvis-car-fill-top").classList.add("pvvis-batcar-blink", "pvvis-car-fill-top-charge");
      this.shadowRoot.getElementById("pvvis-car-fill-bottom").classList.remove("pvvis-car-fill-bottom-no-charge");
      this.shadowRoot.getElementById("pvvis-car-fill-bottom").classList.add("pvvis-car-fill-bottom");
    }
    if ((this.carSoc > -1) && (this.wbFeed <= 0)) {
      this.shadowRoot.getElementById("pvvis-car-fill-bottom").classList.remove("pvvis-car-fill-bottom");
      this.shadowRoot.getElementById("pvvis-car-fill-bottom").classList.add("pvvis-car-fill-bottom-no-charge");
      this.shadowRoot.getElementById("pvvis-car-fill-top").classList.remove("pvvis-batcar-blink", "pvvis-car-fill-top-charge");
      this.shadowRoot.getElementById("pvvis-car-fill-top").classList.add("pvvis-car-fill-top")
    }
    if ((this.carSoc < 0) && (this.wbFeed > 0)) {
      this.shadowRoot.getElementById("pvvis-car-fill-top").classList.remove("pvvis-car-fill-top");
      this.shadowRoot.getElementById("pvvis-car-fill-top").classList.add("pvvis-car-fill-top-charge");
    }
    if ((this.carSoc < 0) && (this.wbFeed <= 0)) {
      this.shadowRoot.getElementById("pvvis-car-fill-top").classList.remove("pvvis-batcar-blink", "pvvis-car-fill-top-charge");
      this.shadowRoot.getElementById("pvvis-car-fill-top").classList.add("pvvis-car-fill-top");
    }
  }

  colorBat() {
    let chargeval = this.charge + this.gridCharge - this.discharge;
    let batRemaining;
    let socdiv = (this.calcBatRemainSocNotPercent ? this.batmax : 100);
    this.battery.classList.remove("pvvis-battery-charge", "pvvis-battery-discharge", "pvvis-battery-neutral");
    if (chargeval < 0) {
      // discharge
      this.battery.classList.add("pvvis-battery-discharge");
      batRemaining = Math.abs((this.batmax * (this.soc / socdiv)) / chargeval);
      batRemaining = Math.min(batRemaining, 99.9);
      this.shadowRoot.getElementById("pvvis-bat-remain-txt").style.display = "unset";
      this.shadowRoot.getElementById("pvvis-bat-remain-txt").setAttribute("y", "228");
      this.shadowRoot.getElementById("pvvis-bat-remain-txt").innerHTML = batRemaining.toFixed(1) + '<tspan class="pvvis-txt-unit-soc">h</tspan>';
    }
    else if (chargeval > 0) {
      // charge
      this.battery.classList.add("pvvis-battery-charge");
      batRemaining = Math.abs((this.batmax * (1 - (this.soc / socdiv))) / chargeval);
      batRemaining = Math.min(batRemaining, 99.9);
      this.shadowRoot.getElementById("pvvis-bat-remain-txt").style.display = "unset";
      this.shadowRoot.getElementById("pvvis-bat-remain-txt").setAttribute("y", "176");
      this.shadowRoot.getElementById("pvvis-bat-remain-txt").innerHTML = batRemaining.toFixed(1) + '<tspan class="pvvis-txt-unit-soc">h</tspan>';
    }
    else {
      this.battery.classList.add("pvvis-battery-neutral");
      this.shadowRoot.getElementById("pvvis-bat-remain-txt").style.display = "none";
    }

    //loadbar battery
    const loadbarUpperLimit = 36; //px for y when 100% charged
    const loadbarLowerLimit = 272; //px for y when 0% charged
    let loadbarPosArea = loadbarLowerLimit - loadbarUpperLimit;
    let loadbarPosY = (((socdiv - this.soc) * loadbarPosArea) / socdiv) + loadbarUpperLimit;
    this.shadowRoot.getElementById("pvvis-bat-load-bar").setAttribute("y", "" + loadbarPosY.toFixed() + "");
    this.shadowRoot.getElementById("pvvis-bat-load-triangle").setAttribute("transform", "translate(0, " + (loadbarPosY - loadbarUpperLimit + 5).toFixed() + ")"); //5 =half height of bar (10)
  }

  flowValue(src, obj) {
    const loadOneThird = Math.round(this.pvmax * (1 / 3));
    const loadTwoThirds = Math.round(this.pvmax * (2 / 3));
    this.shadowRoot.getElementById(obj).classList.remove("pvvis-active1", "pvvis-active2", "pvvis-active3", "pvvis-inactive");
    if (!isNaN(src)) { src = parseFloat(src); }
    if (src > loadTwoThirds) {
      this.shadowRoot.getElementById(obj).classList.add("pvvis-active1");
    } else if (src > loadOneThird) {
      this.shadowRoot.getElementById(obj).classList.add("pvvis-active2");
    } else if (src > this.flowThreshold) {
      this.shadowRoot.getElementById(obj).classList.add("pvvis-active3");
    } else {
      this.shadowRoot.getElementById(obj).classList.add("pvvis-inactive");
    }
    if ((this.doNotShowZero) && (Math.round(src) == 0)) {
      this.shadowRoot.getElementById(obj + "-txt").innerHTML = '';
    } else {
      this.shadowRoot.getElementById(obj + "-txt").innerHTML = src; //.toFixed();
      if (this.unitValue) { this.shadowRoot.getElementById(obj + "-txt").innerHTML += '<tspan class="pvvis-txt-unit-value">' + this.unitValue + '</tspan>'; }
    }
  }

  powerVals(val, obj, preHtml) {
    this.shadowRoot.getElementById(obj).style.display = "unset";
    this.shadowRoot.getElementById(obj).innerHTML = preHtml + val;
    if (this.unitSum) { this.shadowRoot.getElementById(obj).innerHTML += '<tspan class="pvvis-txt-unit-power">' + this.unitSum + '</tspan>'; }
  }

  socValue() {
    const defBatStep = [1, 24, 49, 74, 95];
    let arrStep = (this.batstep ? this.batstep.split(',').map(x => +x) : defBatStep);
    if (arrStep.length != 5) { arrStep = defBatStep; }
    const step = arrStep.sort((a, b) => a - b);
    if ((this.soc < step[0]) || (this.soc < 1)) { this.battery.style.opacity = "0.2"; } else { this.battery.style.opacity = "1"; }
    if (this.soc > step[4]) { this.bat100.style.opacity = "1"; } else { this.bat100.style.opacity = "0.2"; }
    if (this.soc > step[3]) { this.bat75.style.opacity = "1"; } else { this.bat75.style.opacity = "0.2"; }
    if (this.soc > step[2]) { this.bat50.style.opacity = "1"; } else { this.bat50.style.opacity = "0.2"; }
    if (this.soc > step[1]) { this.bat25.style.opacity = "1"; } else { this.bat25.style.opacity = "0.2"; }

    let meBlink = (((this.charge < 1) && (this.discharge < 1)) ? false : true);
    if ((meBlink) && (this.soc > step[3]) && (this.soc <= step[4])) { this.bat100.classList.add("pvvis-batbar-blink"); meBlink = false; } else { this.bat100.classList.remove("pvvis-batbar-blink"); }
    if ((meBlink) && (this.soc > step[2]) && (this.soc <= step[3])) { this.bat75.classList.add("pvvis-batbar-blink"); meBlink = false; } else { this.bat75.classList.remove("pvvis-batbar-blink"); }
    if ((meBlink) && (this.soc > step[1]) && (this.soc <= step[2])) { this.bat50.classList.add("pvvis-batbar-blink"); meBlink = false; } else { this.bat50.classList.remove("pvvis-batbar-blink"); }
    if ((meBlink) && (this.soc > step[0]) && (this.soc <= step[1])) { this.bat25.classList.add("pvvis-batbar-blink"); } else { this.bat25.classList.remove("pvvis-batbar-blink"); }

    this.shadowRoot.getElementById("bat-val-txt").innerHTML = this.soc.toFixed();
    if (this.unitSoc) { this.shadowRoot.getElementById("bat-val-txt").innerHTML += '<tspan class="pvvis-txt-unit-soc">' + this.unitSoc + '</tspan>'; }

    if (!this.noBatGradient) {
      //fill bars in dependence of soc value from red->green
      //https://jsfiddle.net/JeancarloFontalvo/1sco9Lpe/3/
      const percentColors = [
        { pct: step[0], color: { r: 0x99, g: 0x00, b: 0 } },
        { pct: step[2], color: { r: 0x99, g: 0x99, b: 0 } },
        { pct: step[4], color: { r: 0x00, g: 0x99, b: 0 } }
      ];
      for (var i = 1; i < percentColors.length - 1; i++) { if (this.soc < percentColors[i].pct) { break; } }
      const lower = percentColors[i - 1];
      const upper = percentColors[i];
      const range = upper.pct - lower.pct;
      const rangePct = (this.soc - lower.pct) / range;
      const pctLower = 1 - rangePct;
      const pctUpper = rangePct;
      const color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
      };
      this.battery.style.fill = 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
    }

  }

  checkIcons() {
    if (!this.gridIcon) { this.gridIcon = 'cable'; }
    else if (this.gridIcon == 'pylon') { }
    else if (this.gridIcon == 'pylon2') { }
    else { this.gridIcon = 'cable'; }
    this.grid = this.shadowRoot.getElementById('pvvis-grid-' + this.gridIcon);
    this.grid.style.display = "unset";

    if (!this.sunIcon) { this.sunIcon = 'sun'; }
    else if (this.sunIcon == 'sun2') { }
    else if (this.sunIcon == 'pvsun') { }
    else { this.sunIcon = 'sun'; }
    this.sun = this.shadowRoot.getElementById('pvvis-sun-' + this.sunIcon);
    this.sun.style.display = "unset";

    if (!this.homeIcon) { this.homeIcon = 'house'; }
    else if (this.homeIcon == 'plug') { }
    else if (this.homeIcon == 'socket') { }
    else { this.homeIcon = 'house'; }
    this.home = this.shadowRoot.getElementById('pvvis-home-' + this.homeIcon);
    this.home.style.display = "unset";
  }

  checkObjectsExists() {
    if (this.hasNoBattery) {
      this.battery.style.display = "none";
      this.shadowRoot.getElementById("pv-bat").style.display = "none";
      this.shadowRoot.getElementById("bat-home").style.display = "none";
      this.shadowRoot.getElementById("pv-bat-txt").innerHTML = "";
      this.shadowRoot.getElementById("pv-bat-txt").style.display = "none";
      this.shadowRoot.getElementById("bat-home-txt").innerHTML = "";
      this.shadowRoot.getElementById("bat-home-txt").style.display = "none";
    }

    if (this.hasNoWallbox) {
      this.car.style.display = "none";
      this.shadowRoot.getElementById("home-car").style.display = "none";
      this.shadowRoot.getElementById("home-car-txt").innerHTML = "";
      this.shadowRoot.getElementById("home-car-txt").style.display = "none";
      this.shadowRoot.getElementById("home-consume-txt").setAttribute("y", "253");
      this.shadowRoot.getElementById("pvvis-car-bat-val-txt").innerHTML = '';
      this.shadowRoot.getElementById("pvvis-car-bat-val-txt").style.display = 'none';
      this.shadowRoot.getElementById("pvvis-car-temp-val-txt").innerHTML = '';
      this.shadowRoot.getElementById("pvvis-car-temp-val-txt").style.display = 'none';
    }

    if (this.hasNoGridFeed) {
      this.shadowRoot.getElementById("pv-grid").style.display = "none";
      this.shadowRoot.getElementById("pv-grid-txt").innerHTML = "";
      this.shadowRoot.getElementById("pv-grid-txt").style.display = "none";
    }

    if (this.hasGridCharge) {
      this.shadowRoot.getElementById("pv-grid-txt").setAttribute("x", "380");
      this.shadowRoot.getElementById("pv-grid-txt").setAttribute("y", "475");
      this.shadowRoot.getElementById("bat-home-txt").setAttribute("y", "310");
      this.shadowRoot.getElementById("grid-bat").style.display = "unset";
      this.shadowRoot.getElementById("grid-bat-txt").style.display = "unset";
    }

    if (this.calcBatRemainTime) {
      this.shadowRoot.getElementById("pvvis-bat-remain-txt").style.display = 'unset';
    } else {
      this.shadowRoot.getElementById("pvvis-bat-remain-txt").innerHTML = '';
      this.shadowRoot.getElementById("pvvis-bat-remain-txt").style.display = 'none';
    }

  }
}

window.customElements.define('ftui-pvvis', FtuiPvvis);
