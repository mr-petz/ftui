/*
* AnalogClock component for FTUI version 3
*
* initial by http://www.3quarks.com Rüdiger Appel <ruediger.appel (at) me.com>
*
* ported by mr_petz
*
* Forumlink: https://forum.fhem.de/index.php/topic,130895.msg1250993.html#msg1250993
*
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*
* https://github.com/knowthelist/ftui
*/


import { FtuiElement } from '../element.component.js';
import { fhemService } from '../../modules/ftui/fhem.service.js';

export class FtuiAnalogClock extends FtuiElement {

  constructor(properties) {
    super(Object.assign(FtuiAnalogClock.properties, properties));

    this.div = this.shadowRoot.querySelector('#backgroundImage');
  }

  template() {
    return `
    <style></style>
    <div id="backgroundImage" style="background-image: url(${this.backgroundImage}); background-size: 100%;">
      <svg xmlns="http://www.w3.org/2000/svg"
           xmlns:xlink="http://www.w3.org/1999/xlink"
           xmlns:ev="http://www.w3.org/2001/xml-events"
           version="1.1"
           baseProfile="full"
           viewBox="${this.backgroundImage?'-40 -40 280 280':'-5 -5 210 210'}"
           id="svgclock">

        <defs>

          <!-- hour stroke (swiss) -->
          <symbol id="hourStrokeSwiss">
            <rect x="96.25" y="0" width="7.5" height="25"/>
          </symbol>

          <!-- minute stroke (swiss) -->
          <symbol id="minuteStrokeSwiss">
            <rect x="98.5" y="0" width="3" height="7.5"/>
          </symbol>

          <!-- five minutes strokes (swiss) -->
          <symbol id="fiveMinutesStrokesSwiss">
            <use xlink:href="#hourStrokeSwiss"/>
            <use xlink:href="#minuteStrokeSwiss" transform="rotate( 6, 100, 100)"/>
            <use xlink:href="#minuteStrokeSwiss" transform="rotate(12, 100, 100)"/>
            <use xlink:href="#minuteStrokeSwiss" transform="rotate(18, 100, 100)"/>
            <use xlink:href="#minuteStrokeSwiss" transform="rotate(24, 100, 100)"/>
          </symbol>

          <!-- quarter strokes (swiss) -->
          <symbol id="quarterStrokesSwiss">
            <use xlink:href="#fiveMinutesStrokesSwiss"/>
            <use xlink:href="#fiveMinutesStrokesSwiss" transform="rotate(30, 100, 100)"/>
            <use xlink:href="#fiveMinutesStrokesSwiss" transform="rotate(60, 100, 100)"/>
          </symbol>

          <!-- hour stroke (austria) -->
          <symbol id="hourStrokeAustria">
            <polygon points="104,0 96,0 97,22 103,22"/>
          </symbol>

          <!-- minute stroke (austria) -->
          <symbol id="minuteStrokeAustria">
            <rect x="98.8" y="0" width="2.4" height="7.5"/>
          </symbol>

          <!-- five minutes strokes (austria) -->
          <symbol id="fiveMinutesStrokesAustria">
            <use xlink:href="#hourStrokeAustria"/>
            <use xlink:href="#minuteStrokeAustria" transform="rotate( 6, 100, 100)"/>
            <use xlink:href="#minuteStrokeAustria" transform="rotate(12, 100, 100)"/>
            <use xlink:href="#minuteStrokeAustria" transform="rotate(18, 100, 100)"/>
            <use xlink:href="#minuteStrokeAustria" transform="rotate(24, 100, 100)"/>
          </symbol>

          <!-- quarter strokes (austria) -->
          <symbol id="quarterStrokesAustria">
            <use xlink:href="#fiveMinutesStrokesAustria"/>
            <use xlink:href="#fiveMinutesStrokesAustria" transform="rotate(30, 100, 100)"/>
            <use xlink:href="#fiveMinutesStrokesAustria" transform="rotate(60, 100, 100)"/>
          </symbol>

          <!-- three hour stroke (points) -->
          <symbol id="threeHourStrokePoints">
            <circle cx="100" cy="9" r="9"/>
          </symbol>

          <!-- hour stroke (points) -->
          <symbol id="hourStrokePoints">
            <circle cx="100" cy="6" r="6"/>
          </symbol>

          <!-- quarter strokes (points) -->
          <symbol id="quarterStrokesPoints">
            <use xlink:href="#threeHourStrokePoints"/>
            <use xlink:href="#hourStrokePoints" transform="rotate(30, 100, 100)"/>
            <use xlink:href="#hourStrokePoints" transform="rotate(60, 100, 100)"/>
          </symbol>

          <!-- three hour stroke (DIN 41091.1) -->
          <symbol id="threeHourStrokeDIN41091.1">
            <rect x="95.8" y="0" width="8.4" height="30"/>
          </symbol>

          <!-- hour stroke (DIN 41091.1) -->
          <symbol id="hourStrokeDIN41091.1">
            <rect x="95.8" y="0" width="8.4" height="24"/>
          </symbol>

          <!-- minute stroke (DIN 41091.1) -->
          <symbol id="minuteStrokeDIN41091.1">
            <rect x="98.2" y="0" width="3.6" height="8"/>
          </symbol>

          <!-- quarter strokes (DIN 41091.1) -->
          <symbol id="quarterStrokesDIN41091.1">
            <use xlink:href="#threeHourStrokeDIN41091.1"/>
            <use xlink:href="#minuteStrokeDIN41091.1" transform="rotate( 6, 100, 100)"/>
            <use xlink:href="#minuteStrokeDIN41091.1" transform="rotate(12, 100, 100)"/>
            <use xlink:href="#minuteStrokeDIN41091.1" transform="rotate(18, 100, 100)"/>
            <use xlink:href="#minuteStrokeDIN41091.1" transform="rotate(24, 100, 100)"/>
            <use xlink:href="#hourStrokeDIN41091.1"   transform="rotate(30, 100, 100)"/>
            <use xlink:href="#minuteStrokeDIN41091.1" transform="rotate(36, 100, 100)"/>
            <use xlink:href="#minuteStrokeDIN41091.1" transform="rotate(42, 100, 100)"/>
            <use xlink:href="#minuteStrokeDIN41091.1" transform="rotate(48, 100, 100)"/>
            <use xlink:href="#minuteStrokeDIN41091.1" transform="rotate(54, 100, 100)"/>
            <use xlink:href="#hourStrokeDIN41091.1"   transform="rotate(60, 100, 100)"/>
            <use xlink:href="#minuteStrokeDIN41091.1" transform="rotate(66, 100, 100)"/>
            <use xlink:href="#minuteStrokeDIN41091.1" transform="rotate(72, 100, 100)"/>
            <use xlink:href="#minuteStrokeDIN41091.1" transform="rotate(78, 100, 100)"/>
            <use xlink:href="#minuteStrokeDIN41091.1" transform="rotate(84, 100, 100)"/>
          </symbol>

          <!-- three hour stroke (DIN 41091.3) -->
          <symbol id="threeHourStrokeDIN41091.3">
            <rect x="94" y="0" width="12" height="30"/>
          </symbol>

          <!-- hour stroke (DIN 41091.3) -->
          <symbol id="hourStrokeDIN41091.3">
            <rect x="95" y="0" width="10" height="26"/>
          </symbol>

          <!-- quarter strokes (DIN 41091.3) -->
          <symbol id="quarterStrokesDIN41091.3">
            <use xlink:href="#threeHourStrokeDIN41091.3"/>
            <use xlink:href="#hourStrokeDIN41091.3" transform="rotate(30, 100, 100)"/>
            <use xlink:href="#hourStrokeDIN41091.3" transform="rotate(60, 100, 100)"/>
          </symbol>

          <!-- hour stroke (DIN 41091.4) -->
          <symbol id="hourStrokeDIN41091.4">
            <rect x="97" y="0" width="6" height="7"/>
          </symbol>

          <!-- minute stroke (DIN 41091.4) -->
          <symbol id="minuteStrokeDIN41091.4">
            <rect x="98.75" y="0" width="2.5" height="7"/>
          </symbol>

          <!-- five minutes strokes (DIN 41091.4) -->
          <symbol id="fiveMinutesStrokesDIN41091.4">
            <use xlink:href="#hourStrokeDIN41091.4"/>
            <use xlink:href="#minuteStrokeDIN41091.4" transform="rotate( 6, 100, 100)"/>
            <use xlink:href="#minuteStrokeDIN41091.4" transform="rotate(12, 100, 100)"/>
            <use xlink:href="#minuteStrokeDIN41091.4" transform="rotate(18, 100, 100)"/>
            <use xlink:href="#minuteStrokeDIN41091.4" transform="rotate(24, 100, 100)"/>
          </symbol>

          <!-- quarter strokes (DIN 41091.4) -->
          <symbol id="quarterStrokesDIN41091.4">
            <use xlink:href="#fiveMinutesStrokesDIN41091.4"/>
            <use xlink:href="#fiveMinutesStrokesDIN41091.4" transform="rotate(30, 100, 100)"/>
            <use xlink:href="#fiveMinutesStrokesDIN41091.4" transform="rotate(60, 100, 100)"/>
          </symbol>

          <!-- visible dial circle -->
          <clipPath id="dialCircle">
            <circle cx="100" cy="100" r="100"/>
          </clipPath>

        </defs>

        <!-- clock -->
        <g id="clock" clip-path="url(#dialCircle)">

          <!-- background -->  
          <g id="background" style="fill:${this.backgroundColor?this.backgroundColor:'none'}">
            <circle cx="100" cy="100" r="100" style="stroke:none"/>
          </g>

          <!-- dial -->
          <g id="dial" style="fill:${this.dialColor?this.dialColor:'black'}">
            <g id="dialSwiss" ${this.dial.replace(/ /g,'').toUpperCase()==='SWISS'?'':'visibility="hidden"'}>
              <use xlink:href="#quarterStrokesSwiss" style="stroke:none"/>
              <use xlink:href="#quarterStrokesSwiss" style="stroke:none" transform="rotate( 90, 100, 100)"/>
              <use xlink:href="#quarterStrokesSwiss" style="stroke:none" transform="rotate(180, 100, 100)"/>
              <use xlink:href="#quarterStrokesSwiss" style="stroke:none" transform="rotate(270, 100, 100)"/>
            </g>
            <g id="dialAustria" ${this.dial.replace(/ /g,'').toUpperCase()==='AUSTRIA'?'':'visibility="hidden"'}>
              <use xlink:href="#quarterStrokesAustria" style="stroke:none"/>
              <use xlink:href="#quarterStrokesAustria" style="stroke:none" transform="rotate( 90, 100, 100)"/>
              <use xlink:href="#quarterStrokesAustria" style="stroke:none" transform="rotate(180, 100, 100)"/>
              <use xlink:href="#quarterStrokesAustria" style="stroke:none" transform="rotate(270, 100, 100)"/>
            </g>
            <g id="dialPoints" ${this.dial.replace(/ /g,'').toUpperCase()==='POINTS'?'':'visibility="hidden"'}>
              <use xlink:href="#quarterStrokesPoints" style="stroke:none"/>
              <use xlink:href="#quarterStrokesPoints" style="stroke:none" transform="rotate( 90, 100, 100)"/>
              <use xlink:href="#quarterStrokesPoints" style="stroke:none" transform="rotate(180, 100, 100)"/>
              <use xlink:href="#quarterStrokesPoints" style="stroke:none" transform="rotate(270, 100, 100)"/>
            </g>
            <g id="dialDIN41091.1" ${this.dial.replace(/ /g,'').toUpperCase()==='DIN41091.1'?'':'visibility="hidden"'}>
              <use xlink:href="#quarterStrokesDIN41091.1" style="stroke:none"/>
              <use xlink:href="#quarterStrokesDIN41091.1" style="stroke:none" transform="rotate( 90, 100, 100)"/>
              <use xlink:href="#quarterStrokesDIN41091.1" style="stroke:none" transform="rotate(180, 100, 100)"/>
              <use xlink:href="#quarterStrokesDIN41091.1" style="stroke:none" transform="rotate(270, 100, 100)"/>
            </g>
            <g id="dialDIN41091.3" ${this.dial.replace(/ /g,'').toUpperCase()==='DIN41091.3'?'':'visibility="hidden"'}>
              <use xlink:href="#quarterStrokesDIN41091.3" style="stroke:none"/>
              <use xlink:href="#quarterStrokesDIN41091.3" style="stroke:none" transform="rotate( 90, 100, 100)"/>
              <use xlink:href="#quarterStrokesDIN41091.3" style="stroke:none" transform="rotate(180, 100, 100)"/>
              <use xlink:href="#quarterStrokesDIN41091.3" style="stroke:none" transform="rotate(270, 100, 100)"/>
            </g>
            <g id="dialDIN41091.4" ${this.dial.replace(/ /g,'').toUpperCase()==='DIN41091.4'?'':'visibility="hidden"'}>
              <use xlink:href="#quarterStrokesDIN41091.4" style="stroke:none"/>
              <use xlink:href="#quarterStrokesDIN41091.4" style="stroke:none" transform="rotate( 90, 100, 100)"/>
              <use xlink:href="#quarterStrokesDIN41091.4" style="stroke:none" transform="rotate(180, 100, 100)"/>
              <use xlink:href="#quarterStrokesDIN41091.4" style="stroke:none" transform="rotate(270, 100, 100)"/>
              <g text-anchor="middle" letter-spacing="-2" font-family="sans-serif" font-size="24px" style="stroke:none">
                <text x="100" y="30">12</text>
                <text x="143" y="41">1</text>
                <text x="171" y="70">2</text>
                <text x="182" y="109">3</text>
                <text x="171" y="147">4</text>
                <text x="142" y="176">5</text>
                <text x="100" y="188">6</text>
                <text x="60" y="176">7</text>
                <text x="30" y="147">8</text>
                <text x="18" y="109">9</text>
                <text x="34" y="70">10</text>
                <text x="61" y="41">11</text>
              </g>
            </g>
          </g>

          <!-- hour hand -->
          <g id="hourHand" style="fill:${this.hourColor?this.hourColor:'black'}">
            <g id="hourHandSwiss" ${this.hour.replace(/ /g,'').toUpperCase()==='SWISS'?'':'visibility="hidden"'}>
              <polygon points="95,33 105,33 106,125 94,125" style="stroke:none"/>
            </g>
            <g id="hourHandGerman" ${this.hour.replace(/ /g,'').toUpperCase()==='GERMAN'?'':'visibility="hidden"'}>
              <rect x="95" y="40" width="10" height="65" style="stroke:none"/>      
            </g>
            <g id="hourHandSiemens" ${this.hour.replace(/ /g,'').toUpperCase()==='SIEMENS'?'':'visibility="hidden"'}>
              <rect x="97.3" y="65" width="5.4" height="35" style="stroke:none"/>      
              <circle cx="97.3" cy="58.5" r="9" style="stroke:none"/>
              <circle cx="102.7" cy="58.5" r="9" style="stroke:none"/>
              <path d="M 88.3,58.5 Q 88.3,52 100,37.5 Q 111.7,52 111.7,58.5 Z" style="stroke:none"/>
              <path d="M 93.5,123 Q 100,125.5 106.5,123 Q 103,116 102.7,100 L 97.3,100 Q 97.3,116 93.5,123 Z" style="stroke:none"/>
              <circle cx="100" cy="100" r="7.4" style="stroke:none"/>
            </g>
            <g id="hourHandDIN41092.3" ${this.hour.replace(/ /g,'').toUpperCase()==='DIN41092.3'?'':'visibility="hidden"'}>
              <polygon points="94,46 100,40 106,46 106,118 94,118" style="stroke:none"/>
            </g>
            <g id="hourHandSmall" ${this.hour.replace(/ /g,'').toUpperCase()==='SMALL'?'':'visibility="hidden"'}>
              <polygon points="97,46 100,40 103,46 103,118 97,118" style="stroke:none"/>
            </g>
          </g>

          <!-- minute hand -->
          <g id="minuteHand" style="fill:${this.minuteColor?this.minuteColor:'black'}">
            <g id="minuteHandSwiss" ${this.minute.replace(/ /g,'').toUpperCase()==='SWISS'?'':'visibility="hidden"'}>
              <polygon points="96,5 104,5 105,125 95,125" style="stroke:none"/>
            </g>
            <g id="minuteHandGerman" ${this.minute.replace(/ /g,'').toUpperCase()==='GERMAN'?'':'visibility="hidden"'}>
              <rect x="95" y="6" width="8" height="99" style="stroke:none"/>      
            </g>
            <g id="minuteHandSiemens" ${this.minute.replace(/ /g,'').toUpperCase()==='SIEMENS'?'':'visibility="hidden"'}>
              <polygon points="95.3,49 99.5,2 100.5,2 104.7,49 102.7,100 97.3,100" style="stroke:none"/>
              <path d="M 93.5,123 Q 100,125.5 106.5,123 Q 103,116 102.7,100 L 97.3,100 Q 97.3,116 93.5,123 Z" style="stroke:none"/>
              <circle cx="100" cy="100" r="7" style="stroke:none"/>
            </g>
            <g id="minuteHandDIN41092.3" ${this.minute.replace(/ /g,'').toUpperCase()==='DIN41092.3'?'':'visibility="hidden"'}>
              <polygon points="95.5,11.5 100,7 104.5,11.5 104.5,122 95.5,122" style="stroke:none"/>
            </g>
            <g id="minuteHandSmall" ${this.minute.replace(/ /g,'').toUpperCase()==='SMALL'?'':'visibility="hidden"'}>
              <polygon points="97.5,11.5 100,7 102.5,11.5 102.5,122 97.5,122" style="stroke:none"/>
            </g>
          </g>

          <!-- second hand -->
          <g id="secondHand" style="fill:${this.secondColor?this.secondColor:'#ad1a14'}; stroke:${this.secondColor?this.secondColor:'#ad1a14'}">
            <g id="secondHandSwiss" ${this.second.replace(/ /g,'').toUpperCase()==='SWISS'?'':'visibility="hidden"'}>
              <line x1="100" y1="34" x2="100" y2="135" style="stroke-width:3.5; stroke-linecap:butt"/>
              <circle cx="100" cy="34" r="10" style="stroke:none"/>
            </g>
            <g id="secondHandGerman" ${this.second.replace(/ /g,'').toUpperCase()==='GERMAN'?'':'visibility="hidden"'}>
              <polygon points="98,4 102,4 102.3,36 97.7,36" style="stroke:none"/>
              <circle cx="100" cy="45" r="10" style="fill:none; stroke-width:4"/>
              <polygon points="97.5,56 102.5,55 103,102 97,102" style="stroke:none"/>
            </g>
            <g id="secondHandDIN41071.1" ${this.second.replace(/ /g,'').toUpperCase()==='DIN41071.1'?'':'visibility="hidden"'}>
              <polygon points="99.4,8 100.6,8 102.8,123 97.2,123" style="stroke:none"/>
            </g>
            <g id="secondHandDIN41071.2" ${this.second.replace(/ /g,'').toUpperCase()==='DIN41071.2'?'':'visibility="hidden"'}>
              <polygon points="98.8,11 100,9.8 101.2,11 101.6,42 98.4,42" style="stroke:none"/>
              <polygon points="98.1,58 101.9,58 102.5,122 97.5,122" style="stroke:none"/>
              <circle cx="100" cy="50" r="8.5" style="fill:none; stroke-width:6.5"/>
            </g>
          </g>

          <!-- axis cover -->
          <g id="axisCover" style="fill:${this.axisCoverColor?this.axisCoverColor:'none'}">
            <circle id="axisCoverCircle" cx="100" cy="100" r="${this.axisCoverRadius?this.axisCoverRadius:'0'}" style="stroke:none"/>
          </g>
        </g>
      </svg>
    </div>
      `;
  }

  onConnected() {
    this.div.style.setProperty('width', this.width);
    this.div.style.setProperty('height', this.width);
    this.isFhemTime ? this.getFhemTime() : setInterval(() => this.setTime(), isNaN(this.interval) ? 50 : this.interval);
  }

  static get properties() {
    return {
      dial: 'DIN41091.4',
      hour: 'DIN41092.3',
      minute: 'DIN41092.3',
      second: 'DIN41071.1',
      minuteBehavior: 'sweeping',
      secondBehavior: 'stepping',
      secondStopToGo: false,
      secondStopTime: 1.5,
      backgroundColor: 'rgba(0,0,0,0)',
      backgroundImage: '',
      dialColor: 'rgb(20,20,20)',
      hourColor: 'rgb(20,20,20)',
      minuteColor: 'rgb(20,20,20)',
      secondColor: 'rgb(160,50,40)',
      axisCoverColor: '',
      axisCoverRadius: 0,
      isFhemTime: false,
      width: '125px',
      interval: 50,
      offset: 0,
      serverDiff: 0,
    }
  }

  static get observedAttributes() {
    return [...this.convertToAttributes(FtuiAnalogClock.properties), ...super.observedAttributes];
  }

  getFhemTime() {
    if (this.isFhemTime) {
      fhemService.sendCommand('{localtime}', '1')
        .then(res => res.text())
        .then(result => {
          this.fhemTime = new Date(result);
          this.serverDiff = Date.now() - this.fhemTime.getTime();
        });
    }
    setInterval(() => this.setTime(), isNaN(this.interval) ? 50 : this.interval);
  }

  setTime() {
    const now = new Date(Date.now() - Number(this.serverDiff) + 3600000 * Number(this.offset));
    const hours = now.getHours();
    const minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let millis = now.getMilliseconds();

    // rotate hour hands
    this.rotateElement('hourHand', 30 * hours + 0.5 * minutes);

    // rotate minute hand
    this.rotateElement('minuteHand', 6 * minutes + (this.minuteBehavior === 'sweeping' ? 0.1 * seconds : 0));

    // handle "stop to go" second hand
    if (this.secondStopToGo) {
      this.minuteBehavior = 'stepping';
      const wait = isNaN(this.secondStopTime) ? 1.5 : this.secondStopTime;
      const fact = 60 / (60 - Math.min(30, Math.max(0, wait)));
      const time = Math.min(60000, fact * (1000 * seconds + millis));
      seconds  = Math.floor(time / 1000);
      millis   = time % 1000;
    }

    // rotate second hand
    let secondAngle = 6 * seconds;
    if (this.secondBehavior === 'sweeping') {
      secondAngle += 0.006 * millis;
    } else if (this.secondBehavior === 'swinging') {
      secondAngle += 3 * (1 + Math.cos(Math.PI + Math.PI * (0.001 * millis)));
    }
    this.rotateElement('secondHand', secondAngle);
  }

  rotateElement(id, angle) {
    this.shadowRoot.querySelector('#'+id).setAttribute('transform', 'rotate(' + angle + ', 100, 100)');
  }

}

window.customElements.define('ftui-analogclock', FtuiAnalogClock);
