/*
* WeekDayTimer component for FTUI version 3
*
* by mr_petz
*
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*
* https://github.com/knowthelist/ftui
*/

import { FtuiElement } from '../element.component.js';
import { fhemService } from '../../modules/ftui/fhem.service.js';

export class FtuiWeekDayTimer extends FtuiElement {
  constructor(properties) {
    super(Object.assign(FtuiWeekDayTimer.properties, properties));

    this.view = this.shadowRoot.querySelector('.view');
    this.error = this.shadowRoot.querySelector('.view');
    this.container = this.shadowRoot.querySelector('.container');
    this.switch = this.shadowRoot.querySelector('.toggle-switch');
    this.buttonSave = this.shadowRoot.querySelector('button[id="save"]');
    this.buttonAdd = this.shadowRoot.querySelector('button[id="add"]');
    this.buttonDelete = this.shadowRoot.querySelector('button[id="del"]');
    this.state = this.shadowRoot.querySelector('button[id="state"]');
    this.wds=[];
    this.rowLength=0;
    this.leftTime=[];
    this.rightTime=[];
    this.Commands=[];
    this.fhemInt=[];
    this.timeValue=[];
    this.cmdValue=[];
    this.fhemSetDevice=[];
    this.switch.addEventListener('change', () => this.onClickSwitch());
    this.buttonSave.addEventListener('click', () => this.onClick());
    this.buttonAdd.addEventListener('click', () => this.onAdd());
    this.buttonDelete.addEventListener('click', () => this.onDelete());
    const d = new Date();
    this.isDay = d.getDay();
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
        padding-left: 2px;
      }
      button {
        border: none;
        background: transparent;
        font-size: 1em;
        color: var(--text-color);
        outline: none;
        cursor: pointer;
        margin: 0 0.15em;
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
        padding-left: 2px;
        top: -2px;
      }
      p {
        padding: 5px;
      }
      .del {
        background: red;
        color: white;
      }
      .cmd {
        width: 60px;
      }
      input[type=checkbox].toggle-switch {
        appearance: none;
        -moz-appearance: none;
        -webkit-appearance: none;
        width: 3em;
        height: 1.5em;
        border-radius: 3em;
        background-color: var(--danger-color);
        outline: 0;
        cursor: pointer;
        transition: background-color 0.5s ease-in-out;
        position: relative;
        bottom: 5px;
        left: 4px;
      }
      input[type=checkbox].toggle-switch:checked {
        background-color: var(--primary-color);
      }
      input[type=checkbox].toggle-switch::after {
        content: '';
        width: 1.5em;
        height: 1.5em;
        background-color: white;
        border-radius: 3em;
        position: absolute;
        transform: scale(0.7);
        left: 0;
        transition: left 0.5s ease-in-out;
        box-shadow: 0 0.1em rgba(0, 0, 0, 0.5);
      }
      input[type=checkbox].toggle-switch:checked::after {
        left: 1.5em;
      }
      </style>
      <div class="view">
        <div class="container"></div>
      </div>
      <div>
        <label style="float: right;">
          <input type="checkbox" class="toggle-switch">
          <span class="slider"></span>
        </label>
        <button id="save" style="background:green; color:white; float: right;">Senden</button>
        <button id="add" style="background:yellow; color:red;">Add</button>
        <button id="del" style="background:red; color:white;">DeleteAll</button>
        <button id="state" style="background:transparent; pointer-events:none;"></button>
      </div>
      `;
  }

  static get properties() {
    return {
      device: '',
      setcmd: 'on,off',
      setdevice: 'device',
      wd: 'Mo,Di,Mi,Do,Fr,Sa,So',
      debounce: 200,
    };
  }

  static get observedAttributes() {
    return [...this.convertToAttributes(FtuiWeekDayTimer.properties), ...super.observedAttributes];
  }

  onConnected() {
    if (this.color) {
      //this.wdButton.style.color = this.color;
    }
    this.style.width = this.width;
    this.style.height = this.height;
  }

  onAttributeChanged(name) {
    switch (name) {
      case 'device':
        fhemService.getReadingEvents(this.device).subscribe(read => this.onChangeReading(read));
        //fhemService.getReadingEvents(this.device + ':' + 'disabled').subscribe(read => this.onChangeReading(read));
      break;
    }
  }

  onChangeReading(read) {
   if (!read) return;
     this.fetchData();
  }

  fetchData() {
    const cmd = 'jsonlist2 ' + this.device;
    fhemService.sendCommand(cmd)
      .then(response => response.json())
      .then((response) => {
        if(response.Results[0]){
        const internals = response.Results[0].Internals;
        const readings = response.Results[0].Readings;
        this.data = [];
        const profile = [];
        this.profcmd = [];
        this.Readings = [];
        let i;
          for (let name in internals) {
            this.data[name] = internals[name];
            if (name.includes('Profil')){
              i = parseInt(name.replace(/Profil /g,'').split(':')[0]);
              profile[i] = internals[name].split(',');
              if (i < 7){
                for (let a = 0; a < profile[i].length; a++) {
                  this.profcmd[i] = internals[name].replace(/, /g,' ').split(' ');
                  if (this.profcmd[0]) {
                    this.profcmd[7] = this.profcmd[0].filter(item => !item.split(':')[2] && item !== '');
                  }
                }
              }
            i++;
            }
          }
          for (let name in readings) {
            this.Readings[name] = readings[name];
          }
        this.fhemData();
      } else {
        this.AddNew();
      }
      })
      .catch(error => {
        this.error.innerHTML='<div style="text-align:center;">'+error+' '+error.stack+'</div>';
      });
  }

  onClick() {
    let setAll='';
    for (let i=0; i < this.rowLength; i++) {
      setAll+=(this.wds[i].join('')===''?this.wds[i]=this.isDay:this.wds[i].join(''))+'|'+(this.perlCommand[i]&&this.perlCommand[i]!==' '&&this.perlInput[i].value!==''?this.perlInput[i].value.replace(/\s+/g,''):this.leftTime[i]+':'+this.rightTime[i])+'|'+(this.w[i][i]?this.Commands[i]+'|'+this.w[i][i]+' ':this.Commands[i]+' ');
    };
    fhemService.sendCommand('modify ' + this.device + ' ' + this.fhemSetDevice + ' ' + this.data.LANGUAGE + ' ' + setAll + ' ' + (this.data.CONDITION||this.data.COMMAND||this.COMMAND.value.length>0?this.COMMAND.value.replace(/;/g,';;'):''));
    ftuiApp.toast(this.device + ' modifyed');
    fhemService.sendCommand('save config');
    this.onChangeReading();
  }

  onClickSwitch() {
    if(this.switch.checked===false){
      fhemService.sendCommand('set ' + this.device + ' disable');
      ftuiApp.toast(this.device + ' disabled');
      fhemService.sendCommand('save config');
      this.view.style.background='rgba(255,255,255,0.5)';
      this.view.style.pointerEvents='none';
      // currValue
      this.state.innerHTML='';
    }
    if(this.switch.checked===true){
      fhemService.sendCommand('set ' + this.device + ' enable');
      ftuiApp.toast(this.device + ' enabled');
      fhemService.sendCommand('save config');
      this.view.style.background='';
      this.view.style.pointerEvents='';
      // currValue
      this.state.innerHTML='aktueller Wert: '+this.Readings.currValue.Value;
    }
  }

  onAdd() {
    let setNew='';
    for (let i=0; i < this.rowLength; i++) {
      setNew+=(this.wds[i].join('')===''?this.wds[i]=this.isDay:this.wds[i].join(''))+'|'+(this.perlCommand[i]&&this.perlCommand[i]!==' '&&this.perlInput[i].value!==''?this.perlInput[i].value.replace(/\s+/g,''):this.leftTime[i]+':'+this.rightTime[i])+'|'+(this.w[i][i]?this.Commands[i]+'|'+this.w[i][i]+' ':this.Commands[i]+' ');
    };
    setNew+=this.isDay+'|00:00|'+this.cmds[0];
    fhemService.sendCommand('defmod ' + this.device + ' WeekdayTimer ' + this.fhemSetDevice + ' ' + this.data.LANGUAGE + ' ' + setNew + ' ' + (this.data.CONDITION||this.data.COMMAND||this.COMMAND.value.length>0?this.COMMAND.value.replace(/;/g,';;'):''));
    ftuiApp.toast('Timer added');
    fhemService.sendCommand('save config');
    this.onChangeReading();
  }

  onDelete() {
    this.wdbuttons = this.shadowRoot.querySelectorAll('button');
    for (let i=0; i < this.wdbuttons.length-3; i++) {
      this.wdbuttons[i].id==='save'?'':this.wdbuttons[i].style.background = '';
    };
    fhemService.sendCommand('modify ' + this.device + ' ' + this.fhemSetDevice + ' ' + this.data.LANGUAGE + ' ' +this.isDay+'|00:00|'+this.cmds[0]);
    ftuiApp.toast('Timer deleted');
    fhemService.sendCommand('save config');
    this.onChangeReading();
  }

  AddNew() {
    fhemService.sendCommand('define ' + this.device + ' WeekdayTimer ' + this.setdevice + ' ' +this.isDay+'|00:00|'+this.cmds[0]);
    ftuiApp.toast('Timer wurde definiert');
    fhemService.sendCommand('save config');
    this.onChangeReading();
  }

  onDeleteRow(delbutton) {
    let del='';
    for (let i=0; i < this.rowLength; i++) {
      if(i!==parseInt(delbutton.id)){
        del+=(this.wds[i].join('')===''?this.wds[i]=this.isDay:this.wds[i].join(''))+'|'+(this.perlCommand[i]&&this.perlCommand[i]!==' '&&this.perlInput[i].value!==''?this.perlInput[i].value.replace(/\s+/g,''):this.leftTime[i]+':'+this.rightTime[i])+'|'+(this.w[i][i]?this.Commands[i]+'|'+this.w[i][i]+' ':this.Commands[i]+' ');
      }
    };
    if(this.rowLength===1){
      del=this.isDay+'|00:00|'+this.cmds[0];
    }
    fhemService.sendCommand('modify ' + this.device + ' ' + this.fhemSetDevice + ' ' + this.data.LANGUAGE + ' ' + del + ' ' + (this.data.CONDITION||this.data.COMMAND||this.COMMAND.value.length>0?this.COMMAND.value.replace(/;/g,';;'):''));
    ftuiApp.toast('Timer deleted');
    fhemService.sendCommand('save config');
    this.onChangeReading();
  }

  AddNew() {
    fhemService.sendCommand('define ' + this.device + ' WeekdayTimer ' + this.setdevice + ' ' +this.isDay+'|00:00|'+this.cmds[0]);
    ftuiApp.toast('Timer wurde definiert');
    fhemService.sendCommand('save config');
    this.onChangeReading();
  }

  onDeleteRow(delbutton) {
    let del='';
    for (let i=0; i < this.rowLength; i++) {
      if(i!==parseInt(delbutton.id)){
        del+=(this.wds[i].join('')===''?this.wds[i]=0:this.wds[i].join(''))+'|'+(this.perlCommand[i]&&this.perlCommand[i]!==' '&&this.perlInput[i].value!==''?this.perlInput[i].value.replace(/\s+/g,''):this.leftTime[i]+':'+this.rightTime[i])+'|'+(this.w[i][i]?this.Commands[i]+'|'+this.w[i][i]+' ':this.Commands[i]+' ');
      }
    };
    if(this.rowLength===1){
      del='0|00:00|'+this.cmds[0];
    }
    fhemService.sendCommand('modify ' + this.device + ' ' + this.fhemSetDevice + ' ' + this.data.LANGUAGE + ' ' + del + ' ' + (this.data.CONDITION||this.data.COMMAND||this.COMMAND.value.length>0?this.COMMAND.value.replace(/;/g,';;'):''));
    ftuiApp.toast('Timer deleted');
    fhemService.sendCommand('save config');
    this.onChangeReading();
  }

  onClickDay(wdbutton) {
    let buttonRow = this.shadowRoot.querySelectorAll('button[id="'+wdbutton.id+'"]');
    if (wdbutton.style.backgroundColor === 'green' || wdbutton.style.border === '1px solid green'){
      if (wdbutton.value==='0'){
        this.wds[wdbutton.id][7]='';
        wdbutton.style.background = '';
        wdbutton.style.border = '1px solid transparent';
        buttonRow[7].style.background = '';
        }
      if (wdbutton.value==='7'){
        if (this.wds[wdbutton.id].join('').length===1){
          this.wds[wdbutton.id][8]='0';
        } else {
          this.wds[wdbutton.id][8]='';
        }
        wdbutton.style.background = '';
      }
      if (wdbutton.value==='8'){
       if (this.wds[wdbutton.id].join('').length===1){
         this.wds[wdbutton.id][9]='1';
       } else {
         this.wds[wdbutton.id][9]='';
       }
        wdbutton.style.background = '';
      }
      if (wdbutton.value==='1234560'){
        for (let i=0; i < 7; i++) {
          this.wds[wdbutton.id][i]=''+i+'';
        }
        buttonRow[6].style.background = '';
        this.wds[wdbutton.id][0]='';
        this.wds[wdbutton.id][7]='';
        wdbutton.style.background = '';
        wdbutton.style.border = '1px solid transparent';
      }
      if (wdbutton.value!=='1234560'&&wdbutton.value!=='0'){
        this.wds[wdbutton.id][wdbutton.value]='';
        wdbutton.style.background = '';
        wdbutton.style.border = '1px solid transparent';
        buttonRow[7].style.background = '';
      }
    } else {
      if (wdbutton.value==='0'){
        this.wds[wdbutton.id][7]=wdbutton.value;
        wdbutton.style.background = 'green';
        buttonRow[7].style.background = '';
      }
      if (wdbutton.value==='7'){
        this.wds[wdbutton.id][8]=wdbutton.value;
        this.wds[wdbutton.id][9]='';
        wdbutton.style.background = 'green';
        for (let i=0; i < 8; i++) {
          buttonRow[i].style.background = '';
          buttonRow[i].style.border = '1px solid transparent';
          this.wds[wdbutton.id][i]=''
          if (this.wds[wdbutton.id][i]){
           buttonRow[i-1].style.border = '1px solid green';
          }
        }
        buttonRow[9].style.background = '';
      }
      if (wdbutton.value==='8'){
        this.wds[wdbutton.id][9]=wdbutton.value;
        this.wds[wdbutton.id][8]='';
        wdbutton.style.background = 'green';
        for (let i=0; i < 8; i++) {
          buttonRow[i].style.background = '';
          buttonRow[i].style.border = '1px solid transparent';
          this.wds[wdbutton.id][i]='';
          if (this.wds[wdbutton.id][i]){
           buttonRow[i-1].style.border = '1px solid green';
          }
        }
        buttonRow[8].style.background = '';
      }
      if (wdbutton.value==='1234560'){
        for (let i=0; i < 7; i++) {
          buttonRow[i].style.background = 'green';
          this.wds[wdbutton.id][i]=''+i+'';
          buttonRow[i].style.border = '1px solid transparent';
        }
        buttonRow[0].style.background = 'green';
        this.wds[wdbutton.id][0]='';
        this.wds[wdbutton.id][7]='0';
        this.wds[wdbutton.id][8]='';
        this.wds[wdbutton.id][9]='';
        wdbutton.style.background = 'green';
        buttonRow[8].style.background = '';
        buttonRow[9].style.background = '';
      }
      if(wdbutton.value!=='1234560'&&wdbutton.value!=='0'&&wdbutton.value!=='7'&&wdbutton.value!=='8') {
        this.wds[wdbutton.id][wdbutton.value]=wdbutton.value;
        wdbutton.style.background = 'green';
        buttonRow[7].style.background = '';
      }
      if(this.wds[buttonRow[0].id].join('')==='1234560') {
        buttonRow[7].style.background = 'green';
      }
    }
  }

  fhemTimeValue() {
    if (this.timeValue.length>0) {
      let i=0;
      while (i < this.times.length) {
        if (this.times[i] === '-') {
          i++;
        } else {
          this.leftSelect = this.shadowRoot.querySelector('select[name="hour'+i+'"]');
          this.rightSelect = this.shadowRoot.querySelector('select[name="min'+i+'"]');
          this.leftSelect.value = this.timeValue[i][0];
          this.rightSelect.value = this.timeValue[i][1];
          this.leftTime[i]=this.timeValue[i][0];
          this.rightTime[i]=this.timeValue[i][1];
          i++;
        }
      };
    };
  }

  clickHourValue(hours) {
    this.leftTime[hours.id]=hours.value;
  }

  clickMinValue(mins) {
    this.rightTime[mins.id]=mins.value;
  }

  clickCmdValue(cmds) {
    this.Commands[cmds.id]=cmds.value;
  }

  hours(h) {
    h.onchange = (i,hours) => {
      hours = i.target;
      this.clickHourValue(hours);
    };
  }

  mins(m) {
    m.onchange = (i,mins) => {
      mins = i.target;
      this.clickMinValue(mins);
    };
  }

  commands(c) {
    c.onchange = (i,cmds) => {
      cmds = i.target;
      this.clickCmdValue(cmds);
    };
  }

  selectCmdValue() {
    if (this.cmds.length>0) {
      let i=0;
      while (i < this.rowLength) {
        this.statesSelect = this.shadowRoot.querySelector('select[name="cmd'+i+'"]');
        this.statesSelect.value = this.cmdValue[i];
        this.Commands[i] = this.cmdValue[i];
        i++;
      };
    };
  }

  fhemData() {
    if (!this.data&&!this.Readings&&!this.tempcmd) return;

    // switch state
    if(this.Readings.disabled){
        if(this.Readings.disabled.Value==='0'){
          this.switch.checked=true;
          this.view.style.background = '';
          this.view.style.pointerEvents = '';
          this.buttonSave.style.pointerEvents = '';
          this.buttonAdd.style.pointerEvents = '';
          this.buttonDelete.style.pointerEvents = '';
          this.buttonSave.style.background = 'green';
          this.buttonAdd.style.background = 'yellow';
          this.buttonDelete.style.background = 'red';
          // currValue
          this.state.innerHTML='aktueller Wert: '+this.Readings.currValue.Value;
        } else {
          this.switch.checked=false;
          this.view.style.pointerEvents='none';
          this.view.style.background='rgba(255,255,255,0.5)';
          this.buttonSave.style.pointerEvents = 'none';
          this.buttonSave.style.background = 'rgba(255,255,255,0.5)';
          this.buttonAdd.style.pointerEvents = 'none';
          this.buttonAdd.style.background = 'rgba(255,255,255,0.5)';
          this.buttonDelete.style.pointerEvents = 'none';
          this.buttonDelete.style.background = 'rgba(255,255,255,0.5)';
          // currValue
          this.state.innerHTML='';
        }
    } else {
      this.switch.checked=false;
      fhemService.sendCommand('set ' + this.device + ' disable');
      this.view.style.background='rgba(255,255,255,0.5)';
      this.view.style.pointerEvents='none';
      fhemService.sendCommand('save config');
      this.buttonSave.style.pointerEvents = 'none';
      this.buttonSave.style.background = 'rgba(255,255,255,0.5)';
      this.buttonAdd.style.pointerEvents = 'none';
      this.buttonAdd.style.background = 'rgba(255,255,255,0.5)';
      this.buttonDelete.style.pointerEvents = 'none';
      this.buttonDelete.style.background = 'rgba(255,255,255,0.5)';
      // currValue
      this.state.innerHTML='';
    }

    // setDevice
    this.fhemSetDevice[0]=this.data.DEVICE;   
    let i = 0;
    const weekDaysNum = ['1','2','3','4','5','6','0','1234560','7','8'];
    let weekDaysName = this.wd.split(',');
    if (weekDaysName.length > 7 || weekDaysName.length < 7){
      if (this.data.LANGUAGE==='de') {
        weekDaysName = ['Mo','Di','Mi','Do','Fr','Sa','So'];
      }
      if (this.data.LANGUAGE==='en') {
        weekDaysName = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
      }
    }
    weekDaysName.push('Week','We','!We');
    const setcmd = this.setcmd.replace(/\s+,\s+|,\s+|\s+,/g,',').trimStart().trimEnd().split(',');
    const command = this.data.COMMAND;
    const condition = this.data.CONDITION;
    this.w = [];
    if (command.length>1) {
      const com = this.data.DEF.indexOf(command);
      this.fhemInt = this.data.DEF.slice(0,com);
      this.fhemInt = this.fhemInt.replace(this.data.DEVICE,'').replace(this.data.LANGUAGE,''); 
    } else if (condition.length>1) {
      const con = this.data.DEF.indexOf(condition);
      this.fhemInt = this.data.DEF.slice(0,con);
      this.fhemInt = this.fhemInt.replace(this.data.DEVICE,'').replace(this.data.LANGUAGE,'');
    } else {
      this.fhemInt = this.data.DEF.replace(this.data.DEVICE,'').replace(this.data.LANGUAGE,'');
    }

    //if first | not present
    this.fhemInt = this.fhemInt.match(/([\|]+)/g).length%2===1 ? this.fhemInt.trimStart().split(' ').join('|') : this.fhemInt;
    this.fhemInt = this.fhemInt.replace(/, /g,',').split(' ').filter(leer => leer);

    for (let i=0; i<this.fhemInt.length; i++){
      this.w[i]=[];
      if (this.fhemInt[i].indexOf(':') === 2 || this.fhemInt[i].indexOf('{') === 0) {
        this.fhemInt[i] = '1234560|' + this.fhemInt[i];
        this.fhemInt[i] = this.fhemInt[i].replace(/\|/g,' ');
      } else {
        this.fhemInt[i] = this.fhemInt[i].replace(/\|/g,' ');
        if (this.fhemInt[i].match(/([\s]+)/g).length===3) {
          this.w[i][i] = this.fhemInt[i].slice(this.fhemInt[i].length-1,this.fhemInt[i].length);
          this.fhemInt[i] = this.fhemInt[i].slice(0,this.fhemInt[i].length-2);
        }
      }
    }

    this.fhemInt = this.fhemInt.join(' ').split(' ').filter(leer => leer && leer!=='w');

    this.times=[];
    this.allCmds=[];
    this.cmds=[];
    this.weekd=[];
    this.perlCommand=[];
    this.perlInput=[];
    let weekdays_unified;

    //split Def to day,time,cmd
      for (let i=0; i<this.fhemInt.length; i++) {
        if (i < 1) continue;
          if (i % 3 === 1) {
          let dstr = '';

          //days
          if (this.data.LANGUAGE==='de') {
           weekdays_unified = this.fhemInt[i-1].replace(/\!\$[wW]e/,'8').replace(/\$[wW]e/,'7').replace(/[sS]o/,'0').replace(/[mM]o/,'1').replace(/[dD]i/,'2').replace(/[mM]i/,'3').replace(/[dD]o/,'4').replace(/[fF]r/,'5').replace(/[sS]a/,'6');
          }
          if (this.data.LANGUAGE==='en') {
           weekdays_unified = this.fhemInt[i-1].replace(/\!\$[wW]e/,'8').replace(/\$[wW]e/,'7').replace(/[sS]u/,'0').replace(/[mM]o/,'1').replace(/[tT]u/,'2').replace(/[wW]e/,'3').replace(/[tT]h/,'4').replace(/[fF]r/,'5').replace(/[sS]a/,'6');
          }
          if (this.data.LANGUAGE==='nl') {
           weekdays_unified = this.fhemInt[i-1].replace(/\!\$[wW]e/,'8').replace(/\$[wW]e/,'7').replace(/[zZ]o/,'0').replace(/[mM]a/,'1').replace(/[mM]a/,'2').replace(/[wW]o/,'3').replace(/[dD]o/,'4').replace(/[vV]r/,'5').replace(/[zZ]a/,'6');
          }
          if (this.data.LANGUAGE==='fr') {
           weekdays_unified = this.fhemInt[i-1].replace(/\!\$[wW]e/,'8').replace(/\$[wW]e/,'7').replace(/[dD]i/,'0').replace(/[lL]u/,'1').replace(/[mM]a/,'2').replace(/[mM]e/,'3').replace(/[jJ]e/,'4').replace(/[vV]e/,'5').replace(/[sS]a/,'6');
          }
          while (weekdays_unified.indexOf('-') > -1) {
            let from = parseInt((weekdays_unified.charAt(weekdays_unified.indexOf('-')-1)));
            let to = parseInt((weekdays_unified.charAt(weekdays_unified.indexOf('-')+1)));
            if (from > to) {to+=7;} // care for "overflow"
            for (let wd=from; wd<=to; wd++) {
              dstr += (wd<7)?wd:(wd-7); // limit to values from 0-7;
            }
            weekdays_unified = weekdays_unified.replace(/.\-./,dstr);
          }
          this.weekd.push(weekdays_unified);

          //time
          if (this.fhemInt[i].includes('{')||this.fhemInt[i].includes('(')) {
           this.times.push('-');
           this.perlCommand.push(this.fhemInt[i]);
          } else {
           this.times.push(this.fhemInt[i]);
           this.perlCommand.push(' ');
          };

          //cmd´s
          this.allCmds.push(this.fhemInt[i+1]);
          }
      }

    //merge Attribute setcmd
    if(this.setcmd.length>0){
      this.allCmds=this.allCmds.concat(setcmd);
    }

    //delete duplicate commands
    this.cmds = [...new Set(this.allCmds)];

    //delete all buttons,selects,dots... after read or update
    this.container.innerHTML = '';

    //create all new
    //create Buttons
    let buttonId=-1;
    let buttonIndex=0;
    this.rowLength=0;
    for (let b=0;b <this.weekd.length;b++){
      buttonId++;
      this.rowLength++;
        for (i=0;i < weekDaysName.length;i++) {
          const opt = document.createElement('BUTTON');
                opt.id = buttonId;
                opt.name = buttonIndex;
                opt.className = 'wdaybutton';
                opt.value = weekDaysNum[i];
                opt.innerHTML = weekDaysName[i];
                opt.style = 'float: left; border: 1px solid transparent';
                opt.addEventListener('mousedown', () => this.onClickDay(opt));
          this.container.appendChild(opt);
          buttonIndex++;
        }

    //create Times
      if (this.times[b] !== '-' && this.perlCommand[b] === ' ') {
        const selectList1 = document.createElement('select');
              selectList1.id = b;
              selectList1.name = 'hour'+b;
              selectList1.className = 'hour';
              selectList1.style = 'float: left';
              selectList1.addEventListener('mousedown', () => this.hours(selectList1));
        this.container.appendChild(selectList1);
        const dots = document.createElement('div');
              dots.innerHTML = ':';
              dots.style = 'float: left';
              dots.id = 'dots';
        this.container.appendChild(dots);
        const selectList2 = document.createElement('select');
              selectList2.id = b;
              selectList2.name = 'min'+b;
              selectList2.className = 'min';
              selectList2.style = 'float: left';
              selectList2.addEventListener('mousedown', () => this.mins(selectList2));
        this.container.appendChild(selectList2);
        for (i=0;i < 24;i++) {
          const opt = document.createElement('option');
          const hour = String(i).padStart(2, '0');
                opt.id = b;
                opt.value = hour;
                opt.innerHTML = hour;
          selectList1.appendChild(opt);
        }
        for (i=0;i < 60;i++) {
          const opt = document.createElement('option');
          const min = String(i).padStart(2, '0');
                opt.id = b;
                opt.value = min;
                opt.innerHTML = min;
          selectList2.appendChild(opt);
        }
      }

      //create cmds
      this.Commands=[];
      i = 0;
      const selectListCmd = document.createElement('select');
            selectListCmd.id = b;
            selectListCmd.name = 'cmd'+b;
            selectListCmd.className = 'cmd';
            selectListCmd.style = 'float:left';
            this.perlCommand[b] !== ' ' ? selectListCmd.style.marginLeft = '39px' : '';
            selectListCmd.addEventListener('mousedown', () => this.commands(selectListCmd));
      this.container.appendChild(selectListCmd);
      while (i < this.cmds.length) {
        const opt = document.createElement('option');
              opt.id = b;
              opt.value = this.cmds[i];
              opt.innerHTML = this.cmds[i];
        selectListCmd.appendChild(opt);
        i++;
      }

      //create button del for row
      const del = document.createElement('BUTTON');
      del.id = buttonId;
      del.className = 'del';
      del.innerHTML = 'del';
      del.style = 'float: left';
      del.addEventListener('mousedown', () => this.onDeleteRow(del));
      this.container.appendChild(del);
      if(this.perlCommand[b] !== ' '){
       let br = document.createElement('br');
       this.container.appendChild(br);
       this.perlInput[b] = document.createElement('input');
       this.perlInput[b].style.width = '100%';
       this.perlInput[b].style.background = 'transparent';
       this.perlInput[b].style.color = 'currentColor';
       this.perlInput[b].value = this.perlCommand[b];
       this.container.appendChild(this.perlInput[b]);
       const sun = document.createElement('p');
         sun.style.padding = '0px';
       this.container.appendChild(sun);
      } else {
        //create p
        let p = document.createElement('p');
        this.container.appendChild(p);
      }
    }

    //create Buttonstate and WeekDayArray
    let newDays=[];
    let newWeek=[];
    this.wds=[];
    let defMoSa=[];
    let defSo=[];
      for (let arr=0;arr < this.weekd.length;arr++) {
        newWeek[arr] = [];
        this.wds[arr] = [];
        defMoSa[arr] = [];
        defSo[arr] = [];
        newDays[arr]=this.weekd[arr].split('');
        newWeek[arr].push(this.weekd[arr]);
      }

    let buttonIds = 0;
    if (this.data){
      buttonIds = 0;
    }
    let wdButton = 0;
    i=0;
    while (i < newDays.length) {
      let blength = 0;
      let week = 1;
      const so = 7;
      if (newWeek[i].toString().length===9){
        newWeek[i]=newWeek[i].toString().split('').sort();
      }   
      defSo[i][so]=newDays[i].find(day => day === '0');
        while (blength < 10) {    
          defMoSa[i][blength]=newDays[i].find(day => day === ''+week+'');
          wdButton = this.shadowRoot.querySelector('button[name="'+buttonIds+'"]');
            if(defMoSa[i][blength]===wdButton.value){
              if (!newWeek[i][0].includes('7') && !newWeek[i][0].includes('8')){
                wdButton.style.background = 'green';
              } else {
                wdButton.style.border = '1px solid green';
              }
              this.wds[i][week]=wdButton.value;
            }
            if(newWeek[i][0].includes('0') && blength === 6){
              if (!newWeek[i][0].includes('7') && !newWeek[i][0].includes('8')){
                wdButton.style.background = 'green';
              }
              this.wds[i][7]='0';
            }
            if(newWeek[i][0]==='1234560' && blength < 8){
              if (!newWeek[i][0].includes('7') && !newWeek[i][0].includes('8')){
                wdButton.style.background = 'green';
              } else {
                wdButton.style.border = '1px solid green';
              }
              this.wds[i][7]='0';
            }
            if(this.profcmd[week]){
              if (newWeek[i][0].includes('7')){
                for(let d=0;d<this.profcmd[week].length;d++){
                  if(this.profcmd[week][d] === this.cmds[i]){
                    wdButton.style.border = '1px solid green';
                  }
                }
              }
              if (newWeek[i][0].includes('8')){
                for(let d=0;d<this.profcmd[week].length;d++){
                  if(this.profcmd[week][d] === this.cmds[i]){
                    wdButton.style.border = '1px solid green';
                  }
                }
              }
            }
            if(newWeek[i][0].includes('7') && blength === 8) {
              wdButton.style.background = 'green';
              this.wds[i][8]='7';
            }
            if(newWeek[i][0].includes('8') && blength === 9) {
              wdButton.style.background = 'green';
              this.wds[i][8]='8';
            }
          blength++;
          week++;
          buttonIds++;
        }
      i++;
    }

    //create timevalue
    i=0;
    this.timeValue=[];
      while (i < this.times.length) {
        if (this.times[i] === '-') {
          this.timeValue[i]='';
          i++;
        } else {
          this.timeValue[i]=this.times[i].split(':');
          i++;
        };
      };
      if(this.timeValue.length>=this.times.length){
        this.fhemTimeValue();
      };

    //create cmdvalue
    this.cmdValue=[];
    i=0;
    while (i < this.rowLength) {
      this.cmdValue[i]=this.allCmds[i].split(',');
      i++;
    };
    //if(this.cmdValue.length===this.cmds.length){
    this.selectCmdValue();
    //};
    
    //TestInput
     const name = document.createElement('div');
     name.innerHTML='Code: <br>'
     this.container.appendChild(name);
     this.COMMAND = document.createElement('textarea');
     this.COMMAND.style.width = '100%';
     this.COMMAND.style.background = 'transparent';
     this.COMMAND.style.color = 'currentColor';
     this.COMMAND.style.resize = 'none';
     this.COMMAND.value = this.data.COMMAND || this.data.CONDITION ? this.data.COMMAND || this.data.CONDITION : '';
     this.container.appendChild(this.COMMAND);
  }
}

window.customElements.define('ftui-weekdaytimer', FtuiWeekDayTimer);
