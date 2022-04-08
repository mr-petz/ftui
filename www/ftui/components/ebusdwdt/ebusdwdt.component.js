/*
* FtuiEbusdWDT component for FTUI version 3
*
* by mr_petz
*
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*
* https://github.com/knowthelist/ftui
*/

import { FtuiElement } from '../element.component.js';
import { fhemService } from '../../modules/ftui/fhem.service.js';

export class FtuiEbusdWDT extends FtuiElement {
  constructor(properties) {

    super(Object.assign(FtuiEbusdWDT.properties, properties));

    this.container = this.shadowRoot.querySelector('.container');
    this.error = this.shadowRoot.querySelector('.container');

  }

  template() {
    return `
      <style>
      :host  {
        position: relative;
        padding: 0 1em;
      }
      :host:after {
        position: absolute;
        right: 1em;
        top: -0.05em;
        content: "";
        pointer-events: none;
      }
      select {
        border: none;
        background: transparent;
        appearance: none;
        font-size: 1em;
        color: var(--text-color);
        outline: none;
        cursor: pointer;
        overflow-y: scroll;
        scrollbar-width: thin;
        overflow-x: hidden;
        float: left;
      }
      button {
        background: transparent;
        font-size: 1em;
        color: var(--text-color);
        outline: none;
        cursor: pointer;
        margin: 0 0 0 10px;
      }
      select option {
        color: var(--text-color);
      }
      select::-webkit-scrollbar {
        width: 0.5em;
      }
      select::-webkit-scrollbar-thumb {
        background-color: var(--border-color);
      }
      div {
        position: relative;
        margin: 0 2px;
      }
      p {
        padding: 8px 0 8px 0;
      }
      </style>
      <div class="container" style="width: 101%;">
      </div>
      `;
  }

  static get properties() {
    return {
      device: '',
      width: '',
      height: '',
    };
  }

  static get observedAttributes() {
    return [...this.convertToAttributes(FtuiEbusdWDT.properties), ...super.observedAttributes];
  }

  onConnected() {
    this.style.width = this.width;
    this.style.height = this.height;
  }

  onAttributeChanged(name) {
    switch (name) {
      case 'device':
        fhemService.getReadingEvents(this.device + ':' + 'Timer.Monday_0_value').subscribe(read => this.onChangeReading(read));
        fhemService.getReadingEvents(this.device + ':' + 'Timer.Tuesday_0_value').subscribe(read => this.onChangeReading(read));
        fhemService.getReadingEvents(this.device + ':' + 'Timer.Wednesday_0_value').subscribe(read => this.onChangeReading(read));
        fhemService.getReadingEvents(this.device + ':' + 'Timer.Thursday_0_value').subscribe(read => this.onChangeReading(read));
        fhemService.getReadingEvents(this.device + ':' + 'Timer.Friday_0_value').subscribe(read => this.onChangeReading(read));
        fhemService.getReadingEvents(this.device + ':' + 'Timer.Saturday_0_value').subscribe(read => this.onChangeReading(read));
        fhemService.getReadingEvents(this.device + ':' + 'Timer.Sunday_0_value').subscribe(read => this.onChangeReading(read));
        break;
    }
  }

  onChangeReading(read) {
    this.fetchData();
  }

  fetchData() {
    const cmd = 'jsonlist2 ' + this.device;
    fhemService.sendCommand(cmd)
      .then(response => response.json())
      .then((response) => {
        if(response.Results[0]){
        const readings = response.Results[0].Readings;
        this.Readings = [];
          for (let name in readings) {
            this.Readings[name] = readings[name];
          }
          this.fillLists();
        }
      })
      .catch(error => {
        this.error.innerHTML='<div style="text-align:center;">'+error+' '+error.stack+'</div>';
      });
  }
  
  fillLists() {
    if (!this.Readings) return;
    this.container.innerHTML = '';
    let Mo = [],
        Di = [],
        Mi = [],
        Do = [],
        Fr = [],
        Sa = [],
        So = [];
    this.weekd = [];
    this.daysel = [];
    const days = ['Mo','Di','Mi','Do','Fr','Sa','So']
    for (let num = 0; num < 6; num++) {
      Mo[num] = this.Readings['Timer.Monday_'+num+'_value'].Value;
      Di[num] = this.Readings['Timer.Tuesday_'+num+'_value'].Value;
      Mi[num] = this.Readings['Timer.Wednesday_'+num+'_value'].Value;
      Do[num] = this.Readings['Timer.Thursday_'+num+'_value'].Value;
      Fr[num] = this.Readings['Timer.Friday_'+num+'_value'].Value;
      Sa[num] = this.Readings['Timer.Saturday_'+num+'_value'].Value;
      So[num] = this.Readings['Timer.Sunday_'+num+'_value'].Value;
    }
    this.daysel[0] = [this.Readings['Timer.Monday_6_value'].Value,'Mo','Mo-Fr','Mo-So'];
    this.daysel[1] = [this.Readings['Timer.Tuesday_6_value'].Value,'Di','Mo-Fr','Mo-So'];
    this.daysel[2] = [this.Readings['Timer.Wednesday_6_value'].Value,'Mi','Mo-Fr','Mo-So'];
    this.daysel[3] = [this.Readings['Timer.Thursday_6_value'].Value,'Do','Mo-Fr','Mo-So'];
    this.daysel[4] = [this.Readings['Timer.Friday_6_value'].Value,'Fr','Mo-Fr','Mo-So'];
    this.daysel[5] = [this.Readings['Timer.Saturday_6_value'].Value,'Sa','Sa-So','Mo-So'];
    this.daysel[6] = [this.Readings['Timer.Sunday_6_value'].Value,'So','Sa-So','Mo-So'];

    this.weekd.push(Mo,Di,Mi,Do,Fr,Sa,So);

    //create Times
    let i=0;
    let num = 0;
    let idx = 0;
    while ( num < this.weekd.length) {
      const tag = document.createElement('div');
      tag.innerHTML = days[num];
      tag.style = 'float: left; width: 5%;';
      this.container.appendChild(tag);
      const line = document.createElement('div');
      line.innerHTML = '|';
      line.style = 'float: left;margin: 0px 2px 0px 2px;';
      line.id = '|';
      this.container.appendChild(line);
      for (i=0 ; i < this.weekd[0].length; i++) {
        idx++;
        const selectList1 = document.createElement('select');
        selectList1.id = num;
        selectList1.name = 'hour'+idx;
        selectList1.className = 'hour';
        selectList1.style = 'float: left';
        this.container.appendChild(selectList1);
        const dots = document.createElement('div');
        dots.innerHTML = ':';
        dots.style = 'float: left';
        dots.id = 'dots';
        this.container.appendChild(dots);
        const selectList2 = document.createElement('select');
        selectList2.id = num;
        selectList2.name = 'min'+idx;
        selectList2.className = 'min';
        this.container.appendChild(selectList2);
        if (idx % 2 === 0) {
          const line2 = document.createElement('div');
          line2.innerHTML = '|';
          line2.style = 'float: left;margin: 0px 2px 0px 2px;';
          line2.id = '|';
          this.container.appendChild(line2);
        }
        if (idx % 2 === 1) {
          const line3 = document.createElement('div');
          line3.innerHTML = 'bis';
          line3.style = 'float: left';
          line3.id = '-';
          this.container.appendChild(line3);
        }
        for (let i=0;i < 24;i++) {
          const opt = document.createElement('option');
          const hour = String(i).padStart(2, '0');
          opt.id = i;
          opt.value = hour;
          opt.innerHTML = hour;
          selectList1.appendChild(opt);
        }
        for (let i=0;i < 60;i+=10) {
          const opt = document.createElement('option');
          const min = String(i).padStart(2, '0');
          opt.id = i;
          opt.value = min;
          opt.innerHTML = min;
          selectList2.appendChild(opt);
        }
        //set Timevalues
        selectList1.value = this.weekd[num][i].split(':')[0];
        selectList2.value = this.weekd[num][i].split(':')[1];
       }
      //create daysel
      i = 0;
      const selectListCmd = document.createElement('select');
      selectListCmd.id = num;
      selectListCmd.name = 'cmd'+num;
      selectListCmd.className = 'daysel';
      selectListCmd.style = 'float:left';
      this.container.appendChild(selectListCmd);
      while (i < 4) {
        const opt = document.createElement('option');
        opt.id = i;
        opt.value = this.daysel[num][i];
        opt.innerHTML = this.daysel[num][i];
        selectListCmd.appendChild(opt);
        i++;
      }
      //create button
      const opt = document.createElement('BUTTON');
      opt.id = num;
      opt.name = 'Senden '+num;
      opt.className = 'button';
      opt.value = num;
      opt.innerHTML = 'Senden';
      opt.style = 'float: left';
      opt.addEventListener('mousedown', () => this.onClick(opt.id));
      this.container.appendChild(opt);
      //create p
      const p = document.createElement('p');
      p.style.background = 'var(--gray)';
      this.container.appendChild(p);
      num++;
    }
  }

  onClick(id) {
    let setAll = '';
    let leftTime=[];
    let rightTime=[];
    let l = -1;
    let r = -1;
    const setList = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    let set = '';
    let SelectHours = '';
    SelectHours = this.shadowRoot.querySelectorAll('.hour');
    SelectHours.forEach((sel,index) => {if(sel.getAttribute("id")===id){l++;leftTime[l]=sel.value;}});
    let SelectMins = '';
    SelectMins = this.shadowRoot.querySelectorAll('.min');
    SelectMins.forEach((sel,index) => {if(sel.getAttribute("id")===id){r++;rightTime[r]=sel.value;}});
    let selwp = '';
    let SelectDaysel = '';
    SelectDaysel = this.shadowRoot.querySelectorAll('.daysel');
    SelectDaysel.forEach((sel,index) => {if(sel.getAttribute("id")===id) {selwp=sel.value; set=setList[id]}});
    for (let i=0; i < 6; i++) {
    setAll += leftTime[i] + ':' + rightTime[i] + ';;';
    };
    fhemService.sendCommand('set ' + this.device + ' ' + set + ' ' + setAll + selwp);
    ftuiApp.toast('set ' + this.device + ' ' + set + ' ' + setAll + selwp);
  }
}

window.customElements.define('ftui-ebusdwdt', FtuiEbusdWDT);
