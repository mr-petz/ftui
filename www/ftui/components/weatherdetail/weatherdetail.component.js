/*
* Weatherdetail component for FTUI version 3
*
* (c) 2023 by jones
* https://forum.fhem.de/index.php?topic=134253.0
*
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*
* https://github.com/knowthelist/ftui
*/
import { FtuiElement } from '../element.component.js';
import { fhemService } from '../../modules/ftui/fhem.service.js';
import { dateFromString, dateFormat, error } from '../../modules/ftui/ftui.helper.js';

//////////////////////////////////////////////////////////////////////////////////////////////
// Weatherdetail class: Shows detailed weather forcast of the selected day
//////////////////////////////////////////////////////////////////////////////////////////////
export class FtuiWeatherdetail extends FtuiElement {
  constructor(properties) {
    super(Object.assign(FtuiWeatherdetail.properties, properties));
    this.fhemIconPath = '../images/default/weather/'; // icon path of kleinklima gfx
    this.ftuiIconPath = './icons/';
  //this.fhemPicsPath = '../images/fhemSVG/';         // icon path of row label gfx
    this.actDay = 0; // wich day-tab is selected (0:today, 1:tomorrow, ...)
    this.maxDay = 8;
    this.lastUpdate = 0;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // Reading of the fhem device has changed
  //////////////////////////////////////////////////////////////////////////////////////////////
  onChangeReading(read) {
    if (!read) return;
    let time = new Date().getTime();
    if (time - this.lastUpdate > 4000) // MANY onChangeReading() events in first 4s after creating!?
    {
      //alert("onChangeReading()")
      this.lastUpdate = time;
      this.fetchData();
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // The html/css part of this component
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
  // All the properties this component can have. They are used as default properties
    //////////////////////////////////////////////////////////////////////////////////////////////
  static get properties() {
    return {
    device: 'proplanta',
    forecast: '4',
    bgcolor: 'dark',
    txtlight: 'white',
    txtdark: 'Gray',
    bordercolor: 'white',
    iconfilter: 'brightness(0) saturate(100%) invert(59%) sepia(0%) saturate(7495%) hue-rotate(38deg) brightness(87%) contrast(81%);',
    };
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // Convert properties to attributes
  //////////////////////////////////////////////////////////////////////////////////////////////
  static get observedAttributes() {
    return [...this.convertToAttributes(FtuiWeatherdetail.properties), ...super.observedAttributes];
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // Component has connected to fhem.
  //////////////////////////////////////////////////////////////////////////////////////////////
  onConnected() {
    // alert("onConnected()") // fires 2 times on reload
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // Triggers on every attribute defined in <ftui-weatherdetail> html element
  //////////////////////////////////////////////////////////////////////////////////////////////
  onAttributeChanged(name) {
    switch (name) {
      case 'device':
        fhemService.getReadingEvents(this.device).subscribe(read => this.onChangeReading(read));
      break;
      case 'forecast':
        if (this.forecast < 1 || this.forecast > this.maxDay)
          this.forecast = 4; // default: 4 days of weather forecast
      break;
    }
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
          content+= '<ftui-column style="border-color: '+this.bordercolor+'; background-color: '+this.bgcolor+';" class='+(day==this.actDay?"tabActive":"tabInactive")+'>';
          content+= '<ftui-label style="color: '+this.txtlight+';" class="date">'+ date +'</ftui-label>';
          content+= '<ftui-label style="color: '+this.txtdark+';" class="weekday">'+(!day?"Heute":wDay)+'</ftui-label>';
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
        //const iconNames = ["fa_time", "fa_cloud", "fa_uniF2C8", "fa_umbrella", "humidity", "fa_flag" ]; // fhem folder
        const iconNames = ["clock-o", "cloud11", "thermometer-1", "umbrella", "rainy1",  "flag" ]; // ftui folder
        this.elemDayAll = this.shadowRoot.getElementById('dayTable');
        this.elemDayAll.textContent = ''; // delete all children
        let content = '<table style="pointer-events: none; background-color: '+this.bgcolor+';">';
        let strDay = "fc"+this.actDay+"_";
        const sumRows = iconNames.length;
        const row = new Array(sumRows);
        for (let y = 0; y < sumRows; y++) {
          row[y] = '<tr style="color: '+this.txtlight+';"><td style="width: 2%;"><img style="filter: '+this.iconfilter+'" class="pic" src="'+this.ftuiIconPath + iconNames[y] +'.svg"></td>';
        }
        for (let hour = 0; hour < 8; hour++) {
          let strHour = String("0" + hour*3).slice(-2);
          row[0]+= '<td><ftui-label text-align="right" class="unit">'
          row[0]+= '<ftui-label class="amount" text="'+ strHour +'"></ftui-label>Uhr</ftui-label></td>';         
          row[1]+= '<td><img height="50px" src='+ this.getWeatherIcon(readings[strDay+"weather"+strHour+"Icon"].Value) +'></td>';
          row[2]+= '<td><ftui-label text-align="right" class="unit">'
          row[2]+= '<ftui-label class="amount" text="'+readings[strDay+"temp"+strHour].Value +'"></ftui-label>°C</ftui-label></td>';         
          row[3]+= '<td><ftui-label text-align="right" class="unit">'
          row[3]+= '<ftui-label class="amount" text="'+readings[strDay+"chOfRain"+strHour].Value +'"></ftui-label>%</ftui-label></td>';         
          row[4]+= '<td><ftui-label text-align="right" class="unit">'
          row[4]+= '<ftui-label class="amount" text="'+readings[strDay+"rain"+strHour].Value +'"></ftui-label>%</ftui-label></td>';         
          row[5]+= '<td><ftui-label text-align="right" class="unit">'
          row[5]+= '<ftui-label class="amount" text="'+readings[strDay+"wind"+strHour].Value +'"></ftui-label>km/h</ftui-label></td>';         
        }
        for (let y = 0; y < sumRows; y++) {
          content+= row[y] + '</tr>';
        }
        this.elemDayAll.innerHTML = content + '</table>';
      }
    })
  }
}

window.customElements.define('ftui-weatherdetail', FtuiWeatherdetail);
