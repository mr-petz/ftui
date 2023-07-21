/*
* Weatherdetail component for FTUI version 3
*
* (c) 2023 by jones
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
    this.fhemPicsPath = '../images/fhemSVG/';         // icon path of row label gfx
    this.selDay = 0; // 0...4 0:today, 1:tomorrow, ...
    this.elemList  = this.shadowRoot.querySelector('.weather-detail');
    this.dayTab = Array(this.sumDays)
    this.dayTab[0] = this.shadowRoot.getElementById('weatherTab0');
    this.dayTab[1] = this.shadowRoot.getElementById('weatherTab1');
    this.dayTab[2] = this.shadowRoot.getElementById('weatherTab2');
    this.dayTab[3] = this.shadowRoot.getElementById('weatherTab3');
    this.dayTab[0].addEventListener("click", event => this.onButtonClick(event, 0));
    this.dayTab[1].addEventListener("click", event => this.onButtonClick(event, 1));
    this.dayTab[2].addEventListener("click", event => this.onButtonClick(event, 2));
    this.dayTab[3].addEventListener("click", event => this.onButtonClick(event, 3));
    // ---------------------------------------------------------------------------------------
    // Array for day overview
    // ---------------------------------------------------------------------------------------
    this.sumDays= 4; // Sum of days that are shown in this component
    this.arrDayTab = { date :0, icon:1, minTemp:2, maxTemp:3 };
    this.lenDayTab = Object.keys(this.arrDayTab).length;
    this.arrDaySummary = new Array(this.sumDays);
    for (let day = 0; day < this.sumDays; ++day)
      this.arrDaySummary[day] = new Array(this.lenDayTab);
    // ---------------------------------------------------------------------------------------
    // Array for day detailed
    // ---------------------------------------------------------------------------------------
    this.sumDayCols = 8; // Reading columns per Day (24h / 3h gap)
    this.arrReadRow = { chOfRain :0, cloud:1, rain:2, temp:3, wind:4, weather:5 };
    this.lenReadRow= Object.keys(this.arrReadRow).length;
    this.arrDayDetailed = new Array(this.lenReadRow);
    for (let row = 0; row < this.lenReadRow; ++row)
    {
      this.arrDayDetailed[row] = new Array(this.lenReadRow);
      for (let col = 0; col < this.sumDayCols; ++col)
        this.arrDayDetailed[row][col] = new Array(this.sumDayCols);
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // The html/css part of this component
  //////////////////////////////////////////////////////////////////////////////////////////////
  template() {
    return `
      <style> @import "components/weatherdetail/weatherdetail.component.css";</style>
      <ftui-column>
        <table><tr>
          <td id="weatherTab0"></td>
          <td id="weatherTab1"></td>
          <td id="weatherTab2"></td>
          <td id="weatherTab3"></td>
        </tr><tr></tr></table>
        <ftui-row class="weather-detail">please wait...</ftui-row>
      </ftui-column>
      `;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // All the properties this component can have.
  // (e.g. <ftui-weatherdetail device="Proplanta" color="pinkPony" ></ftui-weatherdetail>)
  //////////////////////////////////////////////////////////////////////////////////////////////
  static get properties() {
    return {
    device: '',
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
  onConnected() {}

  //////////////////////////////////////////////////////////////////////////////////////////////
  // Device has changed in the attributes, subscribe reading events for this device
  //////////////////////////////////////////////////////////////////////////////////////////////
  onAttributeChanged(name) {
    switch (name) {
      case 'device':
       fhemService.getReadingEvents(this.device).subscribe(read => this.onChangeReading(read));
      break;
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // Reading of the fhem device has changed
  //////////////////////////////////////////////////////////////////////////////////////////////
  onChangeReading(read) {
    if (!read) return;
    this.fetchData();
  }
 
  //////////////////////////////////////////////////////////////////////////////////////////////
  // A day-tab was clicked -> update the detailed table
  //////////////////////////////////////////////////////////////////////////////////////////////
  onButtonClick(event, wDay)
  {
    this.selDay = wDay;
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
    return filename[0]=="t"?weatherIcon[iconNr]:weatherIcon[iconNr+14];
  }
 
  //////////////////////////////////////////////////////////////////////////////////////////////
  // Add tabs with a daily summary
  //////////////////////////////////////////////////////////////////////////////////////////////
  addDayTabs() {
    for (let day = 0; day < this.sumDays; day++)
    {
      let date = dateFormat(dateFromString(this.arrDaySummary[day][0]), "ee");
      let content = '<ftui-column class='+(day==this.selDay?"tabActive":"tabInactive")+'>';
      content+= '<ftui-label class="date">'+this.arrDaySummary[day][0]+'</ftui-label>';
      content+= '<ftui-label class="weekday">'+(!day?"Heute":date)+'</ftui-label>';
      content+= '<img width="100%" src='+ this.fhemIconPath + this.getWeatherIcon(this.arrDaySummary[day][1])+'>';
      content+= '<ftui-label class="tempMin tabUnit"><ftui-label size="5" text="'+this.arrDaySummary[day][2]+'"></ftui-label>°C&nbsp;';
      content+= '<ftui-label class="tempMax tabUnit"><ftui-label size="5" text="'+this.arrDaySummary[day][3]+'"></ftui-label>°C</ftui-label></ftui-label>';
      content+= '</ftui-column>';
      this.dayTab[day].innerHTML = content;
    }
  }
 
  //////////////////////////////////////////////////////////////////////////////////////////////
  // Fill an array with the fhem readings
  // name:    fhem-reading
  // posHour: pos of the hour-text ("00"-"21") in the name-string (e.g. pos 8 in fc0_rain00)
  // day:     show detailed weather data for this day
  // value:   value of the fhem reading
  // type:    typeNr of the reading
  // isIcon:  is a fcX_weather reading, skip non filename data
  //////////////////////////////////////////////////////////////////////////////////////////////
  fillArray(name, posHour, day, value, type, isIcon) {
    let hour = (name.substring(posHour))?Number(name.substring(posHour, posHour+2))/3:"NaN";
    if (isNaN(hour)) // skip readings without hour data
      return;
    if (!isIcon)
      return this.arrDayDetailed[day][type][hour] = value; // all but icon data
    if (name.includes("Icon")) // only the Icon part is needed, text part is skipped
      this.arrDayDetailed[day][type][hour] = this.fhemIconPath + this.getWeatherIcon(value);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // Add a row to the html table
  // icon:   icon-filename of the first column
  // type:   typeNr of the reading
  // unit:   unit of the reading (mm, %, etc)
  // isIcon: is data an icon-filename
  //////////////////////////////////////////////////////////////////////////////////////////////
  addTableRow(icon, type, unit, isIcon) {
    let content = '<tr><td style="width: 2%;"><img class="pic" src="'+this.fhemPicsPath + icon +'.svg"></td>';
    if (type === null) { // headline
      for (let row = 0; row < 24; row+=3)
        content+= '<td><ftui-label text-align="right" class="unit"><ftui-label class="amount" text="'+ String("0" + row).slice(-2) +'"></ftui-label>Uhr</ftui-label></td>';
      return content + '</tr>';
    }
    if (isIcon) { // kleinklima weather icons
      for (let row = 0; row< 8; row++)
        content+= '<td><img height="50px" src='+ this.arrDayDetailed[this.selDay][type][row] +'></td>';
      return content + '</tr>';
    }
    for (let row = 0; row< 8; row++)
      content+= '<td><ftui-label class="unit"><ftui-label class="amount" text="'+ this.arrDayDetailed[this.selDay][type][row] +'"></ftui-label>'+unit+'</ftui-label></td>';
    return content + '</tr>';
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
        var day=0;
        const readings = response.Results[0].Readings;
        let showDay = "fc"+(this.selDay & 3); // only allow 0..3
        for (let name in readings) {
          // We only need a 4 day forecast, skip all other days
          if (name.startsWith("fc4"))
            break;
          if (name.startsWith("fc"))
          {
            day = Number(name[2])
            const strStartPos = 4; // skip "fcX_"
            // table of day tabs
            if (name.startsWith("date", strStartPos))
              this.arrDaySummary[day][0] = readings[name].Value;
            if (name.startsWith("weatherDayIcon", strStartPos))
              this.arrDaySummary[day][1] = readings[name].Value;
            if (name.startsWith("tempMin", strStartPos))
              this.arrDaySummary[day][2] = readings[name].Value;
            if (name.startsWith("tempMax", strStartPos))
              this.arrDaySummary[day][3] = readings[name].Value;
            // table of all details
            if (name.startsWith("chOfRain", strStartPos))
              this.fillArray(name, 12, day, readings[name].Value, this.arrReadRow.chOfRain, false);
            else if (name.startsWith("cloud", strStartPos))
              this.fillArray(name,  9, day, readings[name].Value, this.arrReadRow.cloud, false);
            else if (name.startsWith("rain", strStartPos))
              this.fillArray(name,  8, day, readings[name].Value, this.arrReadRow.rain, false);
            else if (name.startsWith("temp", strStartPos))
              this.fillArray(name,  8, day, readings[name].Value, this.arrReadRow.temp, false);
            else if (name.startsWith("wind", strStartPos))
              this.fillArray(name,  8, day, readings[name].Value, this.arrReadRow.wind, false);
            else if (name.startsWith("weather", strStartPos))
              this.fillArray(name, 11, day, readings[name].Value, this.arrReadRow.weather, true);
          }
      }
      this.elemList.textContent = '';
      const elemItem = document.createElement('div');
      this.addDayTabs();
      let content = '';
      content+= '<table style="pointer-events: none;">';
      content+= this.addTableRow("fa_time",     null,                      "", false); // headline
      content+= this.addTableRow("fa_cloud",    this.arrReadRow.weather,   "", true);  // weather icon names
    //content+= this.addTableRow("fa_cloud",    this.arrReadRow.cloud,    "%", false); // sky covering
      content+= this.addTableRow("fa_uniF2C8",  this.arrReadRow.temp,    "°C", false); // temperature
      content+= this.addTableRow("fa_umbrella", this.arrReadRow.chOfRain, "%", false); // chance of rain
      content+= this.addTableRow("humidity",    this.arrReadRow.rain,    "mm", false); // abmount of rain
      content+= this.addTableRow("fa_flag",     this.arrReadRow.wind,  "km/h", false); // abmount of rain
      elemItem.innerHTML = content + '</table>';
      this.elemList.appendChild(elemItem);
      }}).catch(error => {
        this.elemList.innerHTML='<div style="text-align:center;">'+error+' '+error.stack+'</div>';
    });
  }
}     

window.customElements.define('ftui-weatherdetail', FtuiWeatherdetail);
