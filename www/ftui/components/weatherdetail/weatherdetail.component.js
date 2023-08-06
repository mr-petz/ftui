/*
* Weatherdetail component for FTUI version 3
* Shows a weather forcast for 1-7 days with detailed info of the selected day.
*
* (c) 2023 by jones
*
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*
* https://github.com/knowthelist/ftui
*/

import { FtuiElement } from '../element.component.js';
import { fhemService } from '../../modules/ftui/fhem.service.js';
import { dateFromString, dateFormat } from '../../modules/ftui/ftui.helper.js';

//////////////////////////////////////////////////////////////////////////////////////////////
// Weatherdetail class: Shows detailed weather forcast of the selected day
//////////////////////////////////////////////////////////////////////////////////////////////
export class FtuiWeatherdetail extends FtuiElement {
  constructor(properties) {
    super(Object.assign(FtuiWeatherdetail.properties, properties));
    this.fhemIconPath = '../images/default/weather/'; // path of kleinklima icons
    this.actDay = 0; // wich day-tab is selected (0:today, 1:tomorrow, ...)
    this.maxDay = 7; // proplanta device limit of detailed data
    this.minDay = 1;
    this.lastUpdate = 0; // used for ignoring startup spam from onChangeReading()
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // Reading of the fhem device has changed
  //////////////////////////////////////////////////////////////////////////////////////////////
  onChangeReading(read) {
    if (!read) return;
    let time = new Date().getTime();
    if (time - this.lastUpdate > 4000) // MANY onChangeReading() events in first 4s after creating!?
    {
      this.lastUpdate = time;
      this.fetchData();
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // The html/css part of this component
  // A base part is defined here and will be extended later (access via id / class parameter)
  //////////////////////////////////////////////////////////////////////////////////////////////
  template() {
    return `
      <style> @import "components/weatherdetail/weatherdetail.component.css";</style>
      <ftui-column>
        <table><tr id="dayTabs"></tr></table>
        <ftui-row id="dayTable">please wait...</ftui-row>
      </ftui-column>
      `;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // Default properties
  // Will be overwritten by parameter in <ftui-weatherdetail> html element
  //////////////////////////////////////////////////////////////////////////////////////////////
  static get properties() {
    return {
    device: 'proplanta',
    forecast: '4',
    icondark: 'gray',
    iconlight: 'silver',
    bgactive: 'dark',
    bginactive: '#222222',
    bordercolor: 'gray',
    txtlight: 'white',
    };
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // Convert properties to attributes
  //////////////////////////////////////////////////////////////////////////////////////////////
  static get observedAttributes() {
    return [...this.convertToAttributes(FtuiWeatherdetail.properties), ...super.observedAttributes];
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // Component has connected to fhem
  //////////////////////////////////////////////////////////////////////////////////////////////
  onConnected() { // fires 2 times (?) on reload
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // Triggers on every attribute defined in <ftui-weatherdetail> html element
  //////////////////////////////////////////////////////////////////////////////////////////////
  onAttributeChanged(name) {
    let hStyle = this.shadowRoot.host.style;
    switch (name) {
      case 'device':
        fhemService.getReadingEvents(this.device).subscribe(read => this.onChangeReading(read));
      break;
      case 'forecast':
        if (this.forecast < this.minDay || this.forecast > this.maxDay)
          this.forecast = 4; // default: 4 days of weather forecast
      break;
    }
    // Setting all css default values (todo: run only once, not on every attribute)
    hStyle.setProperty('--icondark', this.icondark);
    hStyle.setProperty('--iconlight', this.iconlight);
    hStyle.setProperty('--bgactive', this.bgactive);
    hStyle.setProperty('--bginactive', this.bginactive);
    hStyle.setProperty('--bordercolor', this.bordercolor);
    hStyle.setProperty('--txtlight', this.txtlight);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // A day-tab was clicked -> update the detailed table
  //////////////////////////////////////////////////////////////////////////////////////////////
  onButtonClick(event, wDay)
  {
    this.actDay = wDay;
    this.fetchData();
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // get kleinklima iconname
  //////////////////////////////////////////////////////////////////////////////////////////////
  getWeatherIcon(iconFilename) {
    const weatherIcon = [
    'sunny.png',                // t1
    'partly_cloudy.png',        // t2
    'partly_cloudy.png',        // t3
    'mostlycloudy.png',         // t4
    'cloudy.png',               // t5
    'chance_of_rain.png',       // t6
    'showers.png',              // t7
    'chance_of_storm.png',      // t8
	  'chance_of_snow.png',       // t9
    'rainsnow.png',             // t10
    'snow.png',                 // t11
    'haze.png',                 // t12
    'haze.png',                 // t13
    'rain.png',                 // t14
    'sunny_night.png',          // n1
    'partlycloudy_night.png',   // n2
    'partlycloudy_night.png',   // n3
    'mostlycloudy_night.png',   // n4
    'overcast.png',             // n5 (Bedeckt)
    'chance_of_rain_night.png', // n6
    'showers_night.png',        // n7
    'chance_of_storm_night.png',// n8
    'sleet.png',                // n9 (Graupel)
    'rainsnow.png',             // n10
    'snow.png',                 // n11
    'haze_night.png',           // n12
    'haze_night.png',           // n13
	  'rain.png']                 // n14
    let filename = iconFilename.substring(iconFilename.lastIndexOf("/")+1, iconFilename.length-4); // w/o path and extension
    let iconNr = filename.substring(1)-1;
    if (iconNr > 14)
	    return "na.png"
    return filename[0]=="t"?this.fhemIconPath + weatherIcon[iconNr]:this.fhemIconPath + weatherIcon[iconNr+14];
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // Get the whole data for this device from fhem
  //////////////////////////////////////////////////////////////////////////////////////////////
  fetchData(){
    fhemService.sendCommand('jsonlist2 ' + this.device)
      .then(response => response.json())
      .then((response) => {
      ////////////////////////////////////////////////////////////////////////////////////////
      // response-Object: Name, PossibleSets, PossibleAttrs, Internals, Readings, Attributes
      //                  Internals  -> of the fhem device (DEF, FUUID, ...)
      //                  Readings   -> of the fhem Device (fc0_cloud00, ...)
      //                  Attributes -> of the fhem Device (devStateIcon, ...)
      ////////////////////////////////////////////////////////////////////////////////////////
      if (response.Results[0])
      {
        const readings = response.Results[0].Readings;
        // -----------------------------------------------------------------------------------
        // Days overview (upper half of this html-object [displayed as tabs])
        // -----------------------------------------------------------------------------------
        this.elemDayTab = this.shadowRoot.getElementById('dayTabs');
        this.elemDayTab.textContent = ''; // delete all children
        for (let day = 0; day < this.forecast; day++) {
          let strDay = "fc"+day+"_";
          let elem = this.elemDayTab.insertCell(-1);
          (this.forecast < 6)?elem.classList.add("fontBig"):elem.classList.add("fontMedium");
          let date = readings[strDay+"date"].Value;
          let wDay = dateFormat(dateFromString(date), "ee");
          let content = '<td>'
          content+= '<ftui-column class='+(day==this.actDay?"tabActive":"tabInactive")+'>';
          content+= '<ftui-label class="date">'+ date +'</ftui-label>';
          content+= '<ftui-label class="weekday">'+(!day?"Heute":wDay)+'</ftui-label>';
          content+= '<img width="100%" src='+ this.getWeatherIcon(readings[strDay+"weatherDayIcon"].Value)+'>';
          content+= '<ftui-label class="tempMin tabUnit"><ftui-label class="'+(this.forecast < 6?"fontBig":"fontMedium")+'" text="'+readings[strDay+"tempMin"].Value+'"></ftui-label>°C&nbsp;';
          content+= '<ftui-label class="tempMax tabUnit"><ftui-label class="'+(this.forecast < 6?"fontBig":"fontMedium")+'" text="'+readings[strDay+"tempMax"].Value+'"></ftui-label>°C</ftui-label></ftui-label>';
          elem.innerHTML = content + '</ftui-column></td>';
          elem.addEventListener("click", event => this.onButtonClick(event, day));
        }
        // when forecast is < 4: create dummy tabs (else tabs would be extremely huge)
        for (let day = this.forecast; day < 4; day++) {
          let elem = this.elemDayTab.insertCell(-1);
        }
        // -----------------------------------------------------------------------------------
        // Day detailed (lower half of this html-object [displayed as table])
        // -----------------------------------------------------------------------------------
        const gfxSVG = [ // inline svg instructions: de.wikipedia.org/wiki/Scalable_Vector_Graphics
          '<svg><path class="svg3" d="m 4 13 a 7 7 0 1 1 0 1z" /><path class="svg1" d="M 10.5 8 l 0 6  l 5.5 0" /></svg>', // clock
          '<svg><path class="svg3" d="m 5 22 c -4.80 0.80, -4.80 7.20, 0  8 l 12, 0 c  3.20 -0.80,  3.2 -4.8, -0.4 -5.6 c 0 -3.6, -3.6 -3.6, -4 -2 c -0.4 -2.96, -5.84 -4.88, -7.76 -0.32"/></svg>', // cloud
          '<svg><path class="svg1" d="M 7.50 16 A 5 5 0 1 0 12.50 16 m 0.5 0.5 l 0 -12  m -6 0.5 l 0 12 M 13 5 A 3 3 0 0 0 7 5" /><path class="svg4" d="M 10 17.5 A 3 3 0 1 0 10.05 17.50 m -1 1 h 2 v -8 h -2 v 8 "/></svg>', // thermometer
          '<svg><path class="svg1" d="M 5 20 A 1 1 0 0 0 11 20 l 0 -18"/><path class="svg3" d="M 20 13 A 9 9 0 0 0 2 13"/><path class="svg5" d="M 7.5 13 A 2.5 2.5 0 0 0 2.5 13 M 14 13 A 3 3 0 0 0 8 13 M 19.5 13 A 2.5 2.5 0 0 0 14.5 13"/></svg>', // umbrella
          '<svg><path class="svg3" d="M 5 16 A 1 1 0 0 0 11 16 l -3 -6 l -3 6.3 M 14 11 A 1 1 0 0 0 18 11 l -2 -4 l -2 4.5"/></svg>', //waterdrops
          '<svg><path class="svg1" d="M 7 5 l 0 20" /><path class="svg3" d="M 9 5 l 10 5 -10 5 0 -10.1" />', // flag
        ];
        this.elemDayAll = this.shadowRoot.getElementById('dayTable');
        this.elemDayAll.textContent = ''; // delete all children
        let content = '<table style="pointer-events: none">';
        let strDay = "fc"+this.actDay+"_";
        const row = ["","","","","",""];
        const sumRows = row.length;
        for (let hour = 0; hour < 8; hour++) {
          let strHour = String("0" + hour*3).slice(-2);
          row[0]+= '<td><ftui-label class="unit"><ftui-label class="amount" text="' + strHour +'"></ftui-label>Uhr</ftui-label></td>';
          row[1]+= '<td><img height="50px" src='+ this.getWeatherIcon(readings[strDay+"weather"+strHour+"Icon"].Value) +'></td>';
          row[2]+= '<td><ftui-label class="unit"><ftui-label class="amount" text="' + readings[strDay+"temp"    +strHour].Value +'"></ftui-label>°C</ftui-label></td>';
          row[3]+= '<td><ftui-label class="unit"><ftui-label class="amount" text="' + readings[strDay+"chOfRain"+strHour].Value +'"></ftui-label>%</ftui-label></td>';
          row[4]+= '<td><ftui-label class="unit"><ftui-label class="amount" text="' + readings[strDay+"rain"    +strHour].Value +'"></ftui-label>mm</ftui-label></td>';
          row[5]+= '<td><ftui-label class="unit"><ftui-label class="amount" text="' + readings[strDay+"wind"    +strHour].Value +'"></ftui-label>km/h</ftui-label></td>';
        }
        for (let y = 0; y < sumRows; y++) {
          content+= '<tr><td style="width: 22px; vertical-align: top;">'+gfxSVG[y]+'</td>' +row[y] +'</tr>';
        }
        this.elemDayAll.innerHTML = content + '</table>';
      }
    })
  }
}

window.customElements.define('ftui-weatherdetail', FtuiWeatherdetail);
