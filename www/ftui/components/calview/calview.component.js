/*
* CalView component
*
* Developed and Designed by mr_petz & OdfFhem
*
* for FTUI version 3
*
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*
* https://github.com/knowthelist/ftui
*/

import { FtuiElement } from '../element.component.js';
import { fhemService } from '../../modules/ftui/fhem.service.js';

export class FtuiCalView extends FtuiElement {
  constructor(properties) {
    super(Object.assign(FtuiCalView.properties, properties));
    
    this.pos = this.shadowRoot.querySelector('.pos');
    this.error = this.shadowRoot.querySelector('.pos');
    this.size = this.shadowRoot.querySelector('.size');
    this.header = this.shadowRoot.querySelector('thead[name="headers"]');
    this.list = this.shadowRoot.querySelector('tbody[name="list"]');
    this.arrangeWindow();
  }

  template() {
    return `
    <style>@import "components/calview/calview.component.css";</style>
     <main>
      <div class="pos">
       <div class="size">
        <table class="table ${(this.listScroll?'':'no-scroll')}">
         <thead name="headers">
         </thead>
         <tbody name="list" class="${(this.listScroll?'list-scroll':'')}" style="${(!this.headers?'height:98%;':'')}">
         </tbody>
        </table>
       </div>
      </div>
     </main>
     <slot></slot>`;
  }

  static get properties() {
    return {
    device: '',
    headers: '',
    details: '',
    detailwidth: '',
    daysleft: '',
    width: '99%',
    height: '99%',
    top: '',
    max: 5,
    headerLeft: false,
    lineLeft: false,
    lineJustify: false,
    lineBreak: false,
    listScroll: false,
    };
  }

  static get observedAttributes() {
    return [...this.convertToAttributes(FtuiCalView.properties), ...super.observedAttributes];
  }

  onAttributeChanged(name) {
    switch (name) {
    case 'device':
      fhemService.getReadingEvents(this.device + ':' + 'state').subscribe(read => this.onChangeReading(read));
      this.list.innerHTML='<div style="text-align:center;">Daten werden geladen...</div>';
    break;
    case 'headers':
    case 'details':
    case 'detailwidth':
    case 'daysleft':
      this.parseData();
    break;
    case 'width':
    case 'height':
    case 'top':
      this.arrangeWindow();
    break;
    }
  }
 
  arrangeWindow() {
  this.size.style.width = this.width;
  this.size.style.height = this.height;
  this.size.style.top = this.top;
    if (this.width) {
      this.size.style.width = this.width;
    }
    if (this.height) {
      this.size.style.height = this.height;
    }
    if (this.top) {
      this.pos.style.top = this.top;
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
        const readings = response.Results[0].Readings;
        this.data = [];
          for (let name in readings) {
            this.data[name] = readings[name].Value;
          }
        this.parseData();
      })
      .catch(error => {
        this.error.innerHTML='<div style="text-align:center;">'+error+'</div>';
      });
    }

  parseData() {
    if (!this.data) return;
    
    const headers = ((this.headers || this.details || this.detailwidth) ? this.headers : 'Datum,Zeit,Zusammenfassung').split(',') ;
    let details = ((this.headers || this.details || this.detailwidth) ? this.details : 'bdate,btime,summary').split(',');
    const detailwidth = ((this.headers || this.details || this.detailwidth) ? this.detailwidth : '25,20,55').split(',');
    const daysleft = this.daysleft.split(',');
    const sumdetailwidth = eval(detailwidth.join("+"));
    let head = '';
    let list = '';
    let daysleftdata = [];
    let daysleftvalue = '';
    let daysleftbgcolor = '';
    let daysleftcolor = '';
    let daysleftclass = '';
    let elseColorIdx='';
    let colelseColor='';
    let colelseBgColor='';
    let colelseclass = '';
    let daysleftblinkextraclass = '';
    
      daysleft.forEach((daysleft, index) => {
        if (daysleft.length > 0) {
          [daysleftvalue] = (daysleft[0]==='0'?daysleft[0].split(':'):daysleft.split(':').map((e) => parseInt(e)));
          [daysleftbgcolor] = (!daysleftvalue?daysleft.split(':').slice(0):daysleft.split(':').slice(1));
          [daysleftcolor] = (!daysleftvalue?daysleft.split(':').slice(1):daysleft.split(':').slice(2));
          [daysleftclass] = (!daysleftvalue?daysleft.split(':').slice(2):daysleft.split(':').slice(3));
          [daysleftblinkextraclass] = daysleft.split(':').slice(4);
          daysleftdata.push({ position:index, value:(daysleftvalue?parseInt(daysleftvalue):'/'), bgcolor:(daysleftbgcolor?daysleftbgcolor:'-'), color:(daysleftcolor?daysleftcolor:'-') , class:(daysleftclass?daysleftclass:'-'), blinkextraclass:(daysleftblinkextraclass?daysleftblinkextraclass:'-') });
        }
      });

      let start = 1, max = this.data["c-term"];
        if (this.hasAttribute("today") && this.hasAttribute("tomorrow")) {
          max = parseInt(this.data["c-today"]) + parseInt(this.data["c-tomorrow"]);
        } else if (this.hasAttribute("today")) {
          max = parseInt(this.data["c-today"]);
        } else if (this.hasAttribute("tomorrow")) {
          start = start + parseInt(this.data["c-today"]);
          max = parseInt(this.data["c-today"]) + parseInt(this.data["c-tomorrow"]);
        }
        if (this.max < (max - start + 1)) {
          max = start + this.max - 1;
        }

    if(max >= 1){

      for (let i4row = start; i4row <= max; i4row++) {
        let num = '00' + i4row;
            num = num.slice(-3);

        const sourcecolor = this.data['t_'+num+'_'+'sourcecolor'];
        const wdayx = this.data['t_'+num+'_'+'weekdayname'];

          if (this.hasAttribute('wday_date')||this.hasAttribute('date_wday')){
            this.data['t_'+num+'_bdate'] = (this.hasAttribute('date_wday')?this.data['t_'+num+'_bdate'].split().map(x => x.substr(0,6)+'&nbsp;&nbsp;'+wdayx.substr(0,2)):this.data['t_'+num+'_bdate'].split().map(x => wdayx.substr(0,2)+', '+x.substr(0,6)));
            this.data['t_'+num+'_edate'] = this.data['t_'+num+'_edate'].split().map(x => wdayx.substr(0,2)+', '+x.substr(0,6));
          }

        let daysleftIdx = daysleftdata.length-1;
        let blinkIdx = daysleftdata.length-1;
        let coltxtcolor = '';
        let colbgcolor = '';
        let colleftclass = '';
        let colblinkcolor = '';
        let colblinkbgcolor = '';
        let colblinkclass = '';
        let colblinkextraclass = '';

          if (daysleftdata.find(elem => elem.value!=='/')){
            for (let x = 0, idx = daysleftdata.length; x < idx; x++) {
              if (parseInt(this.data['t_'+num+'_daysleft']) <= parseInt(daysleftdata[x].value)&&daysleftdata.find(elem => elem.value!=='/')) {
                daysleftIdx = x;
                coltxtcolor = (daysleftdata[daysleftIdx].class==='blink'&&this.hasAttribute('blinkoutside')?'':(daysleftdata[daysleftIdx].color.match('#')?coltxtcolor=daysleftdata[daysleftIdx].color:coltxtcolor='var(--'+daysleftdata[daysleftIdx].color+')'));
                colbgcolor = (daysleftdata[daysleftIdx].class==='blink'&&this.hasAttribute('blinkoutside')?'':(daysleftdata[daysleftIdx].bgcolor.match('#')?colbgcolor=daysleftdata[daysleftIdx].bgcolor:colbgcolor='var(--'+daysleftdata[daysleftIdx].bgcolor+')'));
                colleftclass = (daysleftdata[daysleftIdx].class==='blink'&&this.hasAttribute('blinkoutside')?'':daysleftdata[daysleftIdx].class);
                break;
              }
            }
          };

          if (daysleftdata.find(elem => elem.class==='blink')){
            for (let x = 0, idx = daysleftdata.length; x < idx; x++) {
              if (parseInt(this.data['t_'+num+'_daysleft']) <= parseInt(daysleftdata[x].value)&&daysleftdata[x].class==='blink'&&parseInt(this.data['t_'+num+'_daysleft'])>=0) {
                blinkIdx = x;
                colblinkcolor = (daysleftdata[blinkIdx].color.match('#')?colblinkcolor=daysleftdata[blinkIdx].color:colblinkcolor='var(--'+daysleftdata[blinkIdx].color+')');
                (daysleftdata[blinkIdx].class==='blink'?coltxtcolor=colblinkcolor:'');
                colblinkbgcolor = (daysleftdata[blinkIdx].bgcolor.match('#')?colblinkbgcolor=daysleftdata[blinkIdx].bgcolor:colblinkbgcolor='var(--'+daysleftdata[blinkIdx].bgcolor+')');
                colblinkclass = daysleftdata[blinkIdx].class;
                colblinkextraclass = daysleftdata[blinkIdx].blinkextraclass;
                break;
              }
            }
          };

          if (daysleftdata.find(elem => elem.value==='/')){
            elseColorIdx = daysleftdata.length-1;
              for (let x = 0, idx = daysleftdata.length; x < idx; x++) {
                if (daysleftdata[x].value==='/'&&daysleftdata[x].class!=='blink') {
                  elseColorIdx = x;
                  colelseColor = (daysleftdata[elseColorIdx].color.match('#')?colelseColor=daysleftdata[elseColorIdx].color:colelseColor='var(--'+daysleftdata[elseColorIdx].color+')');
                  colelseBgColor = (daysleftdata[elseColorIdx].bgcolor.match('#')?colelseBgColor=daysleftdata[elseColorIdx].bgcolor:colelseBgColor='var(--'+daysleftdata[elseColorIdx].bgcolor+')');
                  colelseclass = daysleftdata[elseColorIdx].class;
                  break;
                }
              }
          };

        (this.hasAttribute('sourcecolor')?sourcecolor.match('#')?coltxtcolor=sourcecolor:coltxtcolor='var(--'+sourcecolor+')':'');
        const blinkleft=(this.hasAttribute('round')?'left ':'')+(this.hasAttribute('blinkoutside')?(colblinkclass==='blink'?' '+colblinkclass:''):'');
        const blinkcenter=(!this.hasAttribute('blinkoutside')?(colblinkclass==='blink'?' '+colblinkclass:''):colblinkextraclass);
        const blinkright=(this.hasAttribute('round')?'right ':'')+(this.hasAttribute('blinkoutside')?(colblinkclass==='blink'?' '+colblinkclass:''):'');
        const noheader=(!this.hasAttribute('noheader')&headers.length===details.length);
        const outsidebgcolor=(colblinkclass==='blink'?colblinkbgcolor:(colbgcolor!==''?colbgcolor:colelseBgColor));

        let col=[];
          head = '<tr '+(noheader?'class="dark'+(this.hasAttribute('flat')?'"':' lift"'):'')+'><th style="width:5px"></th>';
          col += '<td class="'+blinkleft+(colleftclass!=='blink'?colleftclass:'')+'" style="background:'+outsidebgcolor+';"></td>';

            for (let i = 0;i < details.length;i++) {
              if (!this.detailwidth && this.details){
                detailwidth[i] = 100/details.length;
              }
              if (eval(detailwidth.join("+"))!==100&&this.detailwidth){
                detailwidth[i] = Number(detailwidth[i])+((100-sumdetailwidth)/details.length);             
              }
              head += '<th id="'+i+'" style="color:'+colelseColor+'; width:'+detailwidth[i]+'%;">'+(noheader?'<div class="'+(this.headerLeft?'text-left':'no-overflow')+'">'+headers[i]+'</div>':'')+'</th>';
              col += '<td class="center '+(colleftclass!=='blink'?colleftclass:colblinkextraclass)+'" style="background:'+(colbgcolor?colbgcolor:(colblinkclass==='blink'?'':colelseBgColor))+'; color:'+(coltxtcolor?coltxtcolor:colelseColor)+'; width:'+detailwidth[i]+'%"><div class="'+(this.lineLeft||this.lineJustify||this.lineBreak?(this.lineJustify?'line-justify':(this.lineLeft?'line-left':(this.lineBreak?'line-break':''))):'no-overflow')+' '+blinkcenter+'" '+(this.lineJustify&&details[i]==='timeshort'?'style="text-align:left;"':'')+'>'+this.data['t_'+num+'_'+details[i]]+'</div></td>';
            };
    
          col += '<td class="'+blinkright+(colleftclass!=='blink'?colleftclass:'')+'" style="background:'+outsidebgcolor+';"></td>';
          head += '<th style="width:5px"></th></tr>'+(noheader?'<p></p>':'');
          list += '<tr class="'+(this.hasAttribute('flat')?'':'lift')+'">'+col+'</tr><p></p>';
      }

    }else{
      let col = [];
          if (daysleftdata.find(elem => elem.value==='/')){
            elseColorIdx = daysleftdata.length-1;
              for (let x = 0, idx = daysleftdata.length; x < idx; x++) {
                if (daysleftdata[x].value==='/'&&daysleftdata[x].class!=='blink') {
                  elseColorIdx = x;
                  colelseColor = daysleftdata[elseColorIdx].color;
                  (colelseColor.match('#')?colelseColor=daysleftdata[elseColorIdx].color:colelseColor='var(--'+daysleftdata[elseColorIdx].color+')');
                  colelseBgColor = daysleftdata[elseColorIdx].bgcolor;
                  (colelseBgColor.match('#')?colelseBgColor=daysleftdata[elseColorIdx].bgcolor:colelseBgColor='var(--'+daysleftdata[elseColorIdx].bgcolor+')');
                  colelseclass = daysleftdata[elseColorIdx].class;
                  break;
                }
              }
          };

        head = '<tr '+(!this.hasAttribute('noheader')?'class="dark'+(this.hasAttribute('flat')?'"':' lift"'):'')+'><th style="width:5px"></th>';
        
          for (let i = 0;i < headers.length;i++) {
            head += '<th style="background:'+colelseBgColor+'; color:'+colelseColor+';" width:'+((detailwidth.length>i&&detailwidth[0]!=='')?detailwidth[i]+'%':'auto')+';">'+(!this.hasAttribute('noheader')?'<div class="'+(this.headerLeft?'text-left':'no-overflow')+'">'+headers[i]+'</div>':'')+'</th>';
          }
          
        head += '<th style="width:5px"></th></tr>'+(!this.hasAttribute('noheader')?'<p></p>':'');
        col += '<td class="'+(this.hasAttribute('round')?' left':'')+'"></td>';
        col += '<td class="center" style="background:'+colelseBgColor+'; color:'+colelseColor+';" colspan="'+headers.length+'"><div class="no-overflow">Derzeit keine Termine</div></td>';
        col += '<td class="'+(this.hasAttribute('round')?' right':'')+'"></td>';
        list += '<tr class="'+(this.hasAttribute('flat')?'':'lift')+'">'+col+'</tr><p></p>';
      }
    this.header.innerHTML=head;
    this.list.innerHTML=list;
  }
}

window.customElements.define('ftui-calview', FtuiCalView);
