# Depth Engine  
  
<!DOCTYPE html>  
  
<html lang="en">  
<head>  
<meta charset="UTF-8">  
<meta name="viewport" content="width=device-width, initial-scale=1.0">  
<title>DEPTH ENGINE v6.1 — GPU EDITION · UUON FOUNDATION</title>  
<style>  
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700&display=swap');  
  
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}  
  
:root{  
–bg:#07070c;–panel:#0e0e16;–b1:#18182a;–b2:#22223a;  
–acc:#e2ff3e;–blue:#3ecfff;–ora:#ff8c3e;–grn:#3effb0;  
–vio:#c87fff;–pink:#ff4fa8;–text:#d2d2e8;–dim:#7878a0;–muted:#3a3a58;  
–pw:304px;  
}  
  
html,body{width:100%;height:100%;overflow:hidden;background:var(–bg);color:var(–text);font-family:‘Syne’,sans-serif;font-size:13px;}  
#app{display:flex;width:100%;height:100%;}  
  
/* SIDEBAR */  
#sidebar{width:var(–pw);min-width:var(–pw);height:100%;background:var(–panel);border-right:1px solid var(–b1);display:flex;flex-direction:column;overflow-y:auto;overflow-x:hidden;z-index:10;}  
#sidebar::-webkit-scrollbar{width:3px;}  
#sidebar::-webkit-scrollbar-thumb{background:var(–b2);border-radius:2px;}  
  
.logo{padding:16px 15px 13px;border-bottom:1px solid var(–b1);flex-shrink:0;}  
.logo-l1{font-family:‘Space Mono’,monospace;font-size:12px;font-weight:700;letter-spacing:0.12em;color:var(–acc);display:flex;align-items:center;gap:8px;}  
.vtag{font-size:8px;background:var(–acc);color:var(–bg);padding:2px 5px;border-radius:2px;font-weight:700;}  
.logo-l2{font-size:9px;color:var(–dim);margin-top:4px;letter-spacing:0.08em;}  
  
.sec{padding:12px 14px;border-bottom:1px solid var(–b1);}  
.sec-hd{font-family:‘Space Mono’,monospace;font-size:8px;letter-spacing:0.22em;color:var(–dim);text-transform:uppercase;margin-bottom:10px;display:flex;align-items:center;gap:6px;}  
.sec-hd .tic{color:var(–acc);}  
.sec-hd::after{content:’’;flex:1;height:1px;background:var(–b1);}  
  
#upload-zone{border:1px dashed var(–b2);border-radius:4px;padding:14px 10px;text-align:center;cursor:pointer;transition:border-color 0.2s;position:relative;overflow:hidden;}  
#upload-zone:hover,#upload-zone.drag{border-color:var(–acc);}  
#upload-zone .uico{font-size:20px;opacity:0.25;margin-bottom:5px;}  
#upload-zone .ulbl{font-size:11px;color:var(–text);font-weight:600;}  
#upload-zone .uhnt{font-size:10px;color:var(–dim);margin-top:2px;}  
#file-input{position:absolute;inset:0;opacity:0;cursor:pointer;}  
#thumb-wrap{margin-top:8px;border-radius:3px;overflow:hidden;border:1px solid var(–b1);display:none;}  
#thumb-wrap img{width:100%;display:block;}  
  
.tabs{display:flex;gap:4px;margin-top:8px;}  
.tab{flex:1;padding:7px 4px;font-size:10px;font-family:‘Space Mono’,monospace;letter-spacing:0.05em;background:transparent;border:1px solid var(–b2);color:var(–dim);cursor:pointer;border-radius:3px;transition:all 0.15s;text-align:center;}  
.tab:hover{border-color:var(–dim);color:var(–text);}  
.tab.av{background:var(–vio);border-color:var(–vio);color:#07070c;font-weight:700;}  
.tab.ay{background:var(–acc);border-color:var(–acc);color:#07070c;font-weight:700;}  
.tab.ab{background:var(–blue);border-color:var(–blue);color:#07070c;font-weight:700;}  
.tab-note{font-size:10px;color:var(–dim);margin-top:6px;line-height:1.5;}  
  
.frac-cards{display:flex;flex-direction:column;gap:5px;}  
.fc{display:flex;align-items:center;gap:10px;padding:9px 11px;border:1px solid var(–b2);border-radius:4px;cursor:pointer;transition:all 0.15s;position:relative;overflow:hidden;}  
.fc::before{content:’’;position:absolute;left:0;top:0;bottom:0;width:3px;border-radius:3px 0 0 3px;background:transparent;transition:background 0.15s;}  
.fc:hover{background:rgba(255,255,255,0.025);}  
  
.fc-0.on{border-color:#e2ff3e;background:rgba(226,255,62,0.06);}  .fc-0.on::before{background:#e2ff3e;} .fc-0.on .fc-name{color:#e2ff3e;} .fc-0.on .fc-tag{opacity:1;color:#e2ff3e;border-color:#e2ff3e;} .fc-0 .fc-tag{color:#e2ff3e;border-color:rgba(226,255,62,0.3);}  
.fc-1.on{border-color:#c87fff;background:rgba(200,127,255,0.06);} .fc-1.on::before{background:#c87fff;} .fc-1.on .fc-name{color:#c87fff;} .fc-1.on .fc-tag{opacity:1;color:#c87fff;border-color:#c87fff;} .fc-1 .fc-tag{color:#c87fff;border-color:rgba(200,127,255,0.3);}  
.fc-2.on{border-color:#ff6230;background:rgba(255,98,48,0.06);}   .fc-2.on::before{background:#ff6230;} .fc-2.on .fc-name{color:#ff6230;} .fc-2.on .fc-tag{opacity:1;color:#ff6230;border-color:#ff6230;} .fc-2 .fc-tag{color:#ff6230;border-color:rgba(255,98,48,0.3);}  
.fc-3.on{border-color:#3effb0;background:rgba(62,255,176,0.06);}  .fc-3.on::before{background:#3effb0;} .fc-3.on .fc-name{color:#3effb0;} .fc-3.on .fc-tag{opacity:1;color:#3effb0;border-color:#3effb0;} .fc-3 .fc-tag{color:#3effb0;border-color:rgba(62,255,176,0.3);}  
.fc-4.on{border-color:#ff4fa8;background:rgba(255,79,168,0.06);}  .fc-4.on::before{background:#ff4fa8;} .fc-4.on .fc-name{color:#ff4fa8;} .fc-4.on .fc-tag{opacity:1;color:#ff4fa8;border-color:#ff4fa8;} .fc-4 .fc-tag{color:#ff4fa8;border-color:rgba(255,79,168,0.3);}  
.fc-5.on{border-color:#ffd23e;background:rgba(255,210,62,0.06);}  .fc-5.on::before{background:#ffd23e;} .fc-5.on .fc-name{color:#ffd23e;} .fc-5.on .fc-tag{opacity:1;color:#ffd23e;border-color:#ffd23e;} .fc-5 .fc-tag{color:#ffd23e;border-color:rgba(255,210,62,0.3);}  
.fc-6.on{border-color:#5fff90;background:rgba(95,255,144,0.06);}  .fc-6.on::before{background:#5fff90;} .fc-6.on .fc-name{color:#5fff90;} .fc-6.on .fc-tag{opacity:1;color:#5fff90;border-color:#5fff90;} .fc-6 .fc-tag{color:#5fff90;border-color:rgba(95,255,144,0.3);}  
.fc-7.on{border-color:#c8a060;background:rgba(200,160,96,0.06);}  .fc-7.on::before{background:#c8a060;} .fc-7.on .fc-name{color:#c8a060;} .fc-7.on .fc-tag{opacity:1;color:#c8a060;border-color:#c8a060;} .fc-7 .fc-tag{color:#c8a060;border-color:rgba(200,160,96,0.3);}  
.fc-8.on{border-color:#a0d8ff;background:rgba(160,216,255,0.06);} .fc-8.on::before{background:#a0d8ff;} .fc-8.on .fc-name{color:#a0d8ff;} .fc-8.on .fc-tag{opacity:1;color:#a0d8ff;border-color:#a0d8ff;} .fc-8 .fc-tag{color:#a0d8ff;border-color:rgba(160,216,255,0.3);}  
.fc-9.on{border-color:#ff8c3e;background:rgba(255,140,62,0.06);}  .fc-9.on::before{background:#ff8c3e;} .fc-9.on .fc-name{color:#ff8c3e;} .fc-9.on .fc-tag{opacity:1;color:#ff8c3e;border-color:#ff8c3e;} .fc-9 .fc-tag{color:#ff8c3e;border-color:rgba(255,140,62,0.3);}  
.fc-10.on{border-color:#e840ff;background:rgba(232,64,255,0.06);} .fc-10.on::before{background:#e840ff;}.fc-10.on .fc-name{color:#e840ff;}.fc-10.on .fc-tag{opacity:1;color:#e840ff;border-color:#e840ff;}.fc-10 .fc-tag{color:#e840ff;border-color:rgba(232,64,255,0.3);}  
.fc-11.on{border-color:#ff3030;background:rgba(255,48,48,0.06);}  .fc-11.on::before{background:#ff3030;}.fc-11.on .fc-name{color:#ff3030;}.fc-11.on .fc-tag{opacity:1;color:#ff3030;border-color:#ff3030;}.fc-11 .fc-tag{color:#ff3030;border-color:rgba(255,48,48,0.3);}  
  
.fc-glyph{width:32px;height:32px;border-radius:3px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:17px;background:rgba(255,255,255,0.04);}  
.fc-info{flex:1;min-width:0;}  
.fc-name{font-family:‘Space Mono’,monospace;font-size:9px;font-weight:700;letter-spacing:0.1em;color:var(–dim);transition:color 0.15s;}  
.fc-desc{font-size:8px;color:var(–muted);margin-top:2px;line-height:1.3;}  
.fc-tag{font-family:‘Space Mono’,monospace;font-size:7px;font-weight:700;letter-spacing:0.06em;padding:2px 5px;border-radius:2px;flex-shrink:0;border:1px solid;opacity:0.45;transition:opacity 0.15s;}  
  
.ctrl{margin-bottom:10px;}  
.ctrl-lbl{display:flex;justify-content:space-between;align-items:center;font-size:11px;color:var(–text);margin-bottom:5px;}  
.val{font-family:‘Space Mono’,monospace;font-size:10px;background:rgba(226,255,62,0.09);color:var(–acc);padding:2px 6px;border-radius:2px;min-width:36px;text-align:center;}  
.vo{background:rgba(255,140,62,0.09);color:var(–ora);}  
.vb{background:rgba(62,207,255,0.09);color:var(–blue);}  
.vv{background:rgba(200,127,255,0.09);color:var(–vio);}  
.vp{background:rgba(255,79,168,0.09);color:var(–pink);}  
.vg{background:rgba(62,255,176,0.09);color:var(–grn);}  
  
input[type=range]{-webkit-appearance:none;width:100%;height:3px;background:var(–b2);border-radius:2px;outline:none;cursor:pointer;}  
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:12px;height:12px;border-radius:50%;cursor:pointer;}  
.ry::-webkit-slider-thumb{background:var(–acc);}  
.ro::-webkit-slider-thumb{background:var(–ora);}  
.rb::-webkit-slider-thumb{background:var(–blue);}  
.rv::-webkit-slider-thumb{background:var(–vio);}  
.rp::-webkit-slider-thumb{background:var(–pink);}  
.rg::-webkit-slider-thumb{background:var(–grn);}  
  
.proj-cards{display:flex;flex-direction:column;gap:4px;}  
.pcard{border:1px solid var(–b2);border-radius:3px;cursor:pointer;transition:all 0.14s;display:flex;align-items:center;gap:10px;padding:9px 11px;position:relative;}  
.pcard::before{content:’’;position:absolute;left:0;top:0;bottom:0;width:2px;background:transparent;border-radius:2px 0 0 2px;transition:background 0.14s;}  
.pcard.a-y{border-color:rgba(226,255,62,0.4);background:rgba(226,255,62,0.04);}  
.pcard.a-y::before{background:var(–acc);}  
.pcard.a-y .pnm{color:var(–acc);}  
.pcard.a-o{border-color:rgba(255,140,62,0.4);background:rgba(255,140,62,0.04);}  
.pcard.a-o::before{background:var(–ora);}  
.pcard.a-o .pnm{color:var(–ora);}  
.pcard.a-b{border-color:rgba(62,207,255,0.4);background:rgba(62,207,255,0.04);}  
.pcard.a-b::before{background:var(–blue);}  
.pcard.a-b .pnm{color:var(–blue);}  
.pcard.a-g{border-color:rgba(62,255,176,0.4);background:rgba(62,255,176,0.04);}  
.pcard.a-g::before{background:var(–grn);}  
.pcard.a-g .pnm{color:var(–grn);}  
.pglyph{width:28px;height:28px;border-radius:2px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}  
.pcard.a-y .pglyph{background:rgba(226,255,62,0.08);}  
.pcard.a-o .pglyph{background:rgba(255,140,62,0.08);}  
.pcard.a-b .pglyph{background:rgba(62,207,255,0.08);}  
.pcard.a-g .pglyph{background:rgba(62,255,176,0.08);}  
.pglyph svg{width:18px;height:18px;}  
.pnfo .pnm{font-family:‘Space Mono’,monospace;font-size:10px;font-weight:700;letter-spacing:0.1em;color:var(–dim);}  
.pnfo .pds{font-size:9px;color:var(–muted);margin-top:2px;}  
.sub{display:none;margin-top:6px;}  
.sub.show{display:block;}  
  
.btns{display:flex;gap:4px;}  
.btn{flex:1;padding:7px 4px;font-size:10px;font-family:‘Space Mono’,monospace;letter-spacing:0.05em;background:transparent;border:1px solid var(–b2);color:var(–dim);cursor:pointer;border-radius:3px;transition:all 0.14s;}  
.btn:hover{border-color:var(–dim);color:var(–text);}  
.btn.oy{background:var(–acc);border-color:var(–acc);color:#07070c;font-weight:700;}  
.btn.oo{background:var(–ora);border-color:var(–ora);color:#07070c;font-weight:700;}  
.btn.ob{background:var(–blue);border-color:var(–blue);color:#07070c;font-weight:700;}  
.btn.og{background:var(–grn);border-color:var(–grn);color:#07070c;font-weight:700;}  
.btn.ov{background:var(–vio);border-color:var(–vio);color:#07070c;font-weight:700;}  
  
.tog-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:9px;}  
.tog-row>label:first-child{font-size:11px;color:var(–text);}  
label.tog{display:flex;cursor:pointer;}  
.tog input{display:none;}  
.tog-t{width:30px;height:16px;background:var(–b2);border-radius:8px;position:relative;transition:background 0.2s;}  
.tog-t::after{content:’’;position:absolute;left:3px;top:3px;width:10px;height:10px;background:var(–muted);border-radius:50%;transition:all 0.18s;}  
.tog input:checked+.tog-t{background:rgba(226,255,62,0.18);}  
.tog input:checked+.tog-t::after{left:17px;background:var(–acc);}  
  
select{width:100%;padding:7px 10px;background:var(–bg);border:1px solid var(–b2);color:var(–text);font-family:‘Syne’,sans-serif;font-size:11px;border-radius:3px;outline:none;cursor:pointer;appearance:none;background-image:url(“data:image/svg+xml,%3Csvg xmlns=‘http://www.w3.org/2000/svg’ width=‘10’ height=‘6’%3E%3Cpath d=‘M0 0l5 6 5-6z’ fill=’%233a3a58’/%3E%3C/svg%3E”);background-repeat:no-repeat;background-position:right 10px center;}  
  
.swatches{display:flex;gap:5px;align-items:center;margin-top:8px;flex-wrap:wrap;}  
.sw{width:20px;height:20px;border-radius:3px;cursor:pointer;border:2px solid transparent;transition:border-color 0.14s;}  
.sw.on{border-color:var(–acc);}  
#custom-color{width:20px;height:20px;border-radius:3px;border:1px solid var(–b2);cursor:pointer;padding:0;}  
  
.action-row{display:flex;gap:5px;margin-bottom:6px;}  
#load-btn{flex:2;padding:11px;background:var(–acc);color:#07070c;border:none;cursor:pointer;font-family:‘Space Mono’,monospace;font-size:10px;font-weight:700;letter-spacing:0.14em;border-radius:3px;transition:background 0.18s;}  
#load-btn:hover{background:#eeff60;}  
#rand-btn{flex:1;padding:11px;background:rgba(200,127,255,0.12);color:var(–vio);border:1px solid rgba(200,127,255,0.3);cursor:pointer;font-family:‘Space Mono’,monospace;font-size:10px;border-radius:3px;transition:all 0.18s;}  
#rand-btn:hover{background:rgba(200,127,255,0.22);}  
.export-row{display:flex;gap:5px;}  
.ex-btn{flex:1;padding:8px;background:transparent;border:1px solid;cursor:pointer;font-family:‘Space Mono’,monospace;font-size:9px;letter-spacing:0.1em;border-radius:3px;transition:all 0.18s;}  
#ex-png{color:var(–blue);border-color:rgba(62,207,255,0.3);}  
#ex-png:hover{background:rgba(62,207,255,0.08);}  
#ex-json{color:var(–grn);border-color:rgba(62,255,176,0.3);}  
#ex-json:hover{background:rgba(62,255,176,0.08);}  
  
/* MAIN */  
#main{flex:1;display:flex;flex-direction:column;overflow:hidden;}  
#cv-wrap{flex:1;position:relative;}  
#cv{position:absolute;inset:0;width:100%!important;height:100%!important;}  
  
#hint{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:14px;pointer-events:none;}  
.hint-ring{position:relative;width:88px;height:88px;}  
.hr1,.hr2,.hr3{position:absolute;border-radius:50%;border:1px solid;}  
.hr1{inset:0;border-color:rgba(226,255,62,0.07);animation:spin 20s linear infinite;}  
.hr2{inset:12px;border-color:rgba(200,127,255,0.07);animation:spin 14s linear infinite reverse;}  
.hr3{inset:24px;border-color:rgba(62,207,255,0.06);animation:spin 9s linear infinite;}  
.hc{position:absolute;inset:36px;display:flex;align-items:center;justify-content:center;font-size:11px;color:rgba(226,255,62,0.18);}  
@keyframes spin{to{transform:rotate(360deg);}}  
.hint-lbl{font-family:‘Space Mono’,monospace;font-size:9px;color:var(–muted);letter-spacing:0.24em;}  
  
#bar{height:24px;background:var(–panel);border-top:1px solid var(–b1);display:flex;align-items:center;padding:0 14px;gap:16px;font-family:‘Space Mono’,monospace;font-size:8px;color:var(–dim);flex-shrink:0;}  
.st{display:flex;align-items:center;gap:5px;}  
.dot{width:4px;height:4px;border-radius:50%;background:var(–b2);transition:background 0.3s;}  
.dot.y{background:var(–acc);}  
.dot.v{background:var(–vio);}  
.dot.b{background:var(–blue);}  
#pill{margin-left:auto;font-family:‘Space Mono’,monospace;font-size:7px;letter-spacing:0.12em;padding:2px 7px;border-radius:2px;border:1px solid;}  
.py{color:var(–acc);border-color:rgba(226,255,62,0.25);background:rgba(226,255,62,0.06);}  
.po{color:var(–ora);border-color:rgba(255,140,62,0.25);background:rgba(255,140,62,0.06);}  
.pb{color:var(–blue);border-color:rgba(62,207,255,0.25);background:rgba(62,207,255,0.06);}  
.pg{color:var(–grn);border-color:rgba(62,255,176,0.25);background:rgba(62,255,176,0.06);}  
#gpu-badge{font-family:‘Space Mono’,monospace;font-size:7px;color:var(–grn);border:1px solid rgba(62,255,176,0.25);background:rgba(62,255,176,0.06);padding:2px 7px;border-radius:2px;}  
  
/* RIGHT-CLICK CONTEXT MENU */  
#ctx-menu {  
position: fixed;  
display: none;  
z-index: 9999;  
background: var(–panel);  
border: 1px solid var(–b2);  
border-radius: 5px;  
padding: 6px 0;  
min-width: 220px;  
box-shadow: 0 8px 32px rgba(0,0,0,0.6);  
font-family: ‘Space Mono’, monospace;  
}  
#ctx-menu.show { display: block; }  
  
.ctx-header {  
font-size: 8px;  
letter-spacing: 0.2em;  
color: var(–dim);  
padding: 4px 14px 6px;  
text-transform: uppercase;  
border-bottom: 1px solid var(–b1);  
margin-bottom: 4px;  
}  
.ctx-item {  
display: flex;  
align-items: center;  
justify-content: space-between;  
padding: 8px 14px;  
font-size: 11px;  
color: var(–text);  
cursor: pointer;  
transition: background 0.12s;  
gap: 16px;  
}  
.ctx-item:hover { background: rgba(226,255,62,0.06); }  
.ctx-item:active { background: rgba(226,255,62,0.12); }  
.ctx-item .ci-label { display: flex; align-items: center; gap: 8px; }  
.ctx-item .ci-icon { font-size: 13px; opacity: 0.7; }  
.ctx-item .ci-res {  
font-size: 9px;  
color: var(–dim);  
font-family: ‘Space Mono’, monospace;  
letter-spacing: 0.06em;  
}  
.ctx-item .ci-badge {  
font-size: 8px;  
padding: 1px 5px;  
border-radius: 2px;  
font-weight: 700;  
letter-spacing: 0.08em;  
}  
.ctx-item .ci-badge.fhd  { background: rgba(62,207,255,0.15); color: var(–blue); }  
.ctx-item .ci-badge.qhd  { background: rgba(62,255,176,0.15); color: var(–grn); }  
.ctx-item .ci-badge.uhd4 { background: rgba(226,255,62,0.15); color: var(–acc); }  
.ctx-item .ci-badge.uhd8 { background: rgba(200,127,255,0.15); color: var(–vio); }  
.ctx-item .ci-badge.proj { background: rgba(255,140,62,0.15); color: var(–ora); }  
  
.ctx-divider { height: 1px; background: var(–b1); margin: 4px 0; }  
  
.ctx-item.exporting { opacity: 0.5; pointer-events: none; }  
  
#ctx-progress {  
display: none;  
padding: 6px 14px 8px;  
border-top: 1px solid var(–b1);  
margin-top: 4px;  
}  
#ctx-progress.show { display: block; }  
.ctx-prog-label { font-size: 8px; color: var(–dim); letter-spacing: 0.1em; margin-bottom: 5px; }  
.ctx-prog-bar { height: 2px; background: var(–b1); border-radius: 1px; overflow: hidden; }  
.ctx-prog-fill { height: 100%; background: linear-gradient(90deg, var(–vio), var(–acc)); width: 0%; transition: width 0.2s; }  
</style>  
  
</head>  
<body>  
<div id="app">  
  
<div id="sidebar">  
  <div class="logo">  
    <div class="logo-l1">DEPTH ENGINE <span class="vtag">V6.1 GPU</span></div>  
    <div class="logo-l2">VERTEX SHADER PROJECTION · UUON FOUNDATION</div>  
  </div>  
  
  <!-- SOURCE -->  
  
  <div class="sec">  
    <div class="sec-hd"><span class="tic">◈</span> Source</div>  
    <div id="upload-zone">  
      <input type="file" id="file-input" accept="image/png,image/jpeg">  
      <div class="uico">⬆</div>  
      <div class="ulbl">Upload Image</div>  
      <div class="uhnt">PNG · JPG · optional</div>  
    </div>  
    <div id="thumb-wrap"><img id="thumb" alt=""></div>  
    <div class="tabs">  
      <button class="tab av" id="tab-frac"  onclick="setMode(0)">FRACTAL</button>  
      <button class="tab"    id="tab-img"   onclick="setMode(1)">IMAGE</button>  
      <button class="tab"    id="tab-blend" onclick="setMode(2)">BLEND</button>  
    </div>  
    <div class="tab-note" id="tab-note">Fractal field generates depth and color. GPU computed.</div>  
  </div>  
  
  <!-- FRACTAL SYSTEM -->  
  
  <div class="sec">  
    <div class="sec-hd"><span class="tic">◈</span> Fractal System</div>  
    <div class="frac-cards">  
  
```  
  <div class="fc fc-0 on" onclick="setFrac(0,this)">  
    <div class="fc-glyph">⬡</div>  
    <div class="fc-info">  
      <div class="fc-name">MANDELBROT</div>  
      <div class="fc-desc">Classic boundary · infinite complexity</div>  
    </div>  
    <div class="fc-tag">z²+c</div>  
  </div>  
  
  <div class="fc fc-1" onclick="setFrac(1,this)">  
    <div class="fc-glyph">✦</div>  
    <div class="fc-info">  
      <div class="fc-name">JULIA</div>  
      <div class="fc-desc">Fixed constant · spider web forms</div>  
    </div>  
    <div class="fc-tag">Cj</div>  
  </div>  
  
  <div class="fc fc-2" onclick="setFrac(2,this)">  
    <div class="fc-glyph">🔥</div>  
    <div class="fc-info">  
      <div class="fc-name">BURNING SHIP</div>  
      <div class="fc-desc">Absolute value · jagged flame edges</div>  
    </div>  
    <div class="fc-tag">|z|²</div>  
  </div>  
  
  <div class="fc fc-3" onclick="setFrac(3,this)">  
    <div class="fc-glyph">◎</div>  
    <div class="fc-info">  
      <div class="fc-name">NOVA</div>  
      <div class="fc-desc">Newton iteration · smooth basins</div>  
    </div>  
    <div class="fc-tag">z³-1</div>  
  </div>  
  
  <div class="fc fc-4" onclick="setFrac(4,this)">  
    <div class="fc-glyph">〜</div>  
    <div class="fc-info">  
      <div class="fc-name">PHOENIX</div>  
      <div class="fc-desc">Memory term · trailing fluid forms</div>  
    </div>  
    <div class="fc-tag">zprev</div>  
  </div>  
  
  <div class="fc fc-5" onclick="setFrac(5,this)">  
    <div class="fc-glyph">⚡</div>  
    <div class="fc-info">  
      <div class="fc-name">POWER MANDEL</div>  
      <div class="fc-desc">Animated power · morphing arms</div>  
    </div>  
    <div class="fc-tag">zⁿ~t</div>  
  </div>  
  
  <div class="fc fc-6" onclick="setFrac(6,this)">  
    <div class="fc-glyph">⟆</div>  
    <div class="fc-info">  
      <div class="fc-name">CELTIC</div>  
      <div class="fc-desc">Abs real part only · organic weave</div>  
    </div>  
    <div class="fc-tag">|Re|</div>  
  </div>  
  
  <div class="fc fc-7" onclick="setFrac(7,this)">  
    <div class="fc-glyph">◈</div>  
    <div class="fc-info">  
      <div class="fc-name">BUFFALO</div>  
      <div class="fc-desc">Double absolute · rough terrain</div>  
    </div>  
    <div class="fc-tag">||z||</div>  
  </div>  
  
  <div class="fc fc-8" onclick="setFrac(8,this)">  
    <div class="fc-glyph">❄</div>  
    <div class="fc-info">  
      <div class="fc-name">TRICORN</div>  
      <div class="fc-desc">Conjugate iteration · crystalline</div>  
    </div>  
    <div class="fc-tag">z̄²+c</div>  
  </div>  
  
  <div class="fc fc-9" onclick="setFrac(9,this)">  
    <div class="fc-glyph">⊕</div>  
    <div class="fc-info">  
      <div class="fc-name">NEWTON</div>  
      <div class="fc-desc">Root basins · tri-color territories</div>  
    </div>  
    <div class="fc-tag">z³=1</div>  
  </div>  
  
  <div class="fc fc-10" onclick="setFrac(10,this)">  
    <div class="fc-glyph">✶</div>  
    <div class="fc-info">  
      <div class="fc-name">KALEIDO</div>  
      <div class="fc-desc">Fold symmetry · reflective petals</div>  
    </div>  
    <div class="fc-tag">fold</div>  
  </div>  
  
  <div class="fc fc-11" onclick="setFrac(11,this)">  
    <div class="fc-glyph">💀</div>  
    <div class="fc-info">  
      <div class="fc-name">BURN JULIA</div>  
      <div class="fc-desc">Ship + Julia hybrid · intense edges</div>  
    </div>  
    <div class="fc-tag">|Cj|</div>  
  </div>  
  
</div>  
  <button class="fbtn"    onclick="setFrac(8,this)">TRICORN</button>  
  <button class="fbtn"    onclick="setFrac(9,this)">NEWTON</button>  
  <button class="fbtn"    onclick="setFrac(10,this)">KALEIDO</button>  
  <button class="fbtn"    onclick="setFrac(11,this)">BURN JULIA</button>  
</div>  
<div style="margin-top:10px;">  
  <div class="ctrl"><div class="ctrl-lbl">Power <span class="val vv" id="v-pw">2.0</span></div><input type="range" id="fPow" min="1.5" max="6" step="0.05" value="2.0" class="rv" oninput="sv('v-pw',this);S('uPow',+this.value)"></div>  
  <div class="ctrl"><div class="ctrl-lbl">Julia Cx <span class="val vv" id="v-jx">-0.70</span></div><input type="range" id="fJx" min="-2" max="2" step="0.01" value="-0.7" class="rv" oninput="sv('v-jx',this);S('uJx',+this.value)"></div>  
  <div class="ctrl"><div class="ctrl-lbl">Julia Cy <span class="val vv" id="v-jy">0.27</span></div><input type="range" id="fJy" min="-2" max="2" step="0.01" value="0.27" class="rv" oninput="sv('v-jy',this);S('uJy',+this.value)"></div>  
  <div class="ctrl"><div class="ctrl-lbl">Iterations <span class="val vv" id="v-it">96</span></div><input type="range" id="fIter" min="16" max="256" step="8" value="96" class="rv" oninput="sv('v-it',this,0);S('uIter',+this.value)"></div>  
  <div class="ctrl"><div class="ctrl-lbl">Zoom <span class="val vv" id="v-fz">1.00</span></div><input type="range" id="fZoom" min="0.1" max="8" step="0.05" value="1.0" class="rv" oninput="sv('v-fz',this);S('uFZoom',+this.value)"></div>  
  <div class="ctrl"><div class="ctrl-lbl">Pan X <span class="val vv" id="v-fx">0.00</span></div><input type="range" id="fPanX" min="-2" max="2" step="0.01" value="0.0" class="rv" oninput="sv('v-fx',this);S('uFPanX',+this.value)"></div>  
  <div class="ctrl"><div class="ctrl-lbl">Pan Y <span class="val vv" id="v-fy">0.00</span></div><input type="range" id="fPanY" min="-2" max="2" step="0.01" value="0.0" class="rv" oninput="sv('v-fy',this);S('uFPanY',+this.value)"></div>  
  <div class="ctrl"><div class="ctrl-lbl">Morph Speed <span class="val vp" id="v-ms">0.00</span></div><input type="range" id="fMorph" min="0" max="1.5" step="0.01" value="0.0" class="rp" oninput="sv('v-ms',this)"></div>  
  <div class="ctrl"><div class="ctrl-lbl">Color Palette <span class="val vp" id="v-cp">1.00</span></div><input type="range" id="fCpal" min="0.2" max="6" step="0.05" value="1.0" class="rp" oninput="sv('v-cp',this);S('uCpal',+this.value)"></div>  
  <div class="ctrl"><div class="ctrl-lbl">Color Offset <span class="val vp" id="v-co">0.00</span></div><input type="range" id="fCoff" min="0" max="1" step="0.01" value="0.0" class="rp" oninput="sv('v-co',this);S('uCoff',+this.value)"></div>  
  <div class="ctrl"><div class="ctrl-lbl">Kaleidoscope <span class="val vp" id="v-kl">1</span></div><input type="range" id="fKal" min="1" max="12" step="1" value="1" class="rp" oninput="sv('v-kl',this,0);S('uKal',+this.value)"></div>  
</div>  
```  
  
  </div>  
  
  <!-- PROJECTION -->  
  
  <div class="sec">  
    <div class="sec-hd"><span class="tic">◈</span> Projection Space</div>  
    <div class="proj-cards">  
      <div class="pcard a-y" id="pc-0" onclick="setProj(0)">  
        <div class="pglyph"><svg viewBox="0 0 18 18" fill="none"><rect x="1.5" y="1.5" width="15" height="15" stroke="currentColor" stroke-width="0.8" opacity="0.6"/><line x1="6.5" y1="1.5" x2="6.5" y2="16.5" stroke="currentColor" stroke-width="0.5" opacity="0.35"/><line x1="11.5" y1="1.5" x2="11.5" y2="16.5" stroke="currentColor" stroke-width="0.5" opacity="0.35"/><line x1="1.5" y1="6.5" x2="16.5" y2="6.5" stroke="currentColor" stroke-width="0.5" opacity="0.35"/><line x1="1.5" y1="11.5" x2="16.5" y2="11.5" stroke="currentColor" stroke-width="0.5" opacity="0.35"/><rect x="8" y="8" width="2" height="2" fill="currentColor" opacity="0.8"/></svg></div>  
        <div class="pnfo"><div class="pnm">PLANAR</div><div class="pds">z = d(u,v) · flat grid</div></div>  
      </div>  
      <div class="pcard" id="pc-1" onclick="setProj(1)">  
        <div class="pglyph"><svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="currentColor" stroke-width="0.7" opacity="0.4"/><circle cx="9" cy="9" r="5" stroke="currentColor" stroke-width="0.7" opacity="0.5"/><circle cx="9" cy="9" r="2.5" stroke="currentColor" stroke-width="0.8" opacity="0.65"/><circle cx="9" cy="9" r="1" fill="currentColor" opacity="0.85"/></svg></div>  
        <div class="pnfo"><div class="pnm">POLAR</div><div class="pds">(r,θ) → disc / ring / flow</div></div>  
      </div>  
      <div class="pcard" id="pc-2" onclick="setProj(2)">  
        <div class="pglyph"><svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="currentColor" stroke-width="0.8" opacity="0.55"/><ellipse cx="9" cy="9" rx="7.5" ry="3.5" stroke="currentColor" stroke-width="0.5" opacity="0.3"/><ellipse cx="9" cy="9" rx="3.5" ry="7.5" stroke="currentColor" stroke-width="0.5" opacity="0.3"/></svg></div>  
        <div class="pnfo"><div class="pnm">SPHERICAL</div><div class="pds">(θ,φ,r) · radial surface</div></div>  
      </div>  
      <div class="pcard" id="pc-3" onclick="setProj(3)">  
        <div class="pglyph"><svg viewBox="0 0 18 18" fill="none"><ellipse cx="9" cy="9" rx="7.5" ry="3.8" stroke="currentColor" stroke-width="0.8" opacity="0.55"/><ellipse cx="9" cy="9" rx="4.5" ry="2.2" stroke="currentColor" stroke-width="0.7" opacity="0.5"/></svg></div>  
        <div class="pnfo"><div class="pnm">TOROIDAL</div><div class="pds">(θ,φ) · torus ring</div></div>  
      </div>  
    </div>  
    <div class="sub" id="sub-polar">  
      <div style="font-size:10px;color:var(--dim);margin:6px 0 4px;">Disc subtype</div>  
      <div class="btns">  
        <button class="btn oo" id="pd-0" onclick="setPolarSub(0,this)">DISC</button>  
        <button class="btn"    id="pd-1" onclick="setPolarSub(1,this)">RING</button>  
        <button class="btn"    id="pd-2" onclick="setPolarSub(2,this)">FLOW</button>  
      </div>  
    </div>  
    <div class="sub" id="sub-sphere">  
      <div style="font-size:10px;color:var(--dim);margin:6px 0 4px;">Sphere shape</div>  
      <div class="btns">  
        <button class="btn ob" id="ps-0" onclick="setSphereSub(0,this)">FULL</button>  
        <button class="btn"    id="ps-1" onclick="setSphereSub(1,this)">DOME</button>  
        <button class="btn"    id="ps-2" onclick="setSphereSub(2,this)">WRAP</button>  
      </div>  
    </div>  
    <div class="sub" id="sub-torus">  
      <div class="ctrl" style="margin-top:6px;"><div class="ctrl-lbl">Major R <span class="val vg" id="v-tr">1.20</span></div><input type="range" id="toR" min="0.4" max="2.5" step="0.05" value="1.2" class="rg" oninput="sv('v-tr',this);S('uTorusR',+this.value)"></div>  
      <div class="ctrl"><div class="ctrl-lbl">Tube R <span class="val vg" id="v-tu">0.45</span></div><input type="range" id="tuR" min="0.1" max="1.2" step="0.02" value="0.45" class="rg" oninput="sv('v-tu',this);S('uTubeR',+this.value)"></div>  
    </div>  
  </div>  
  
  <!-- DEPTH -->  
  
  <div class="sec">  
    <div class="sec-hd"><span class="tic">◈</span> Depth Field</div>  
    <div class="ctrl"><div class="ctrl-lbl">Depth Scale <span class="val" id="v-ds">0.60</span></div><input type="range" id="dScl" min="0" max="1.5" step="0.01" value="0.6" class="ry" oninput="sv('v-ds',this);S('uDepthScale',+this.value)"></div>  
    <div class="ctrl"><div class="ctrl-lbl">Radial Factor <span class="val" id="v-rf">0.40</span></div><input type="range" id="dRad" min="0" max="1" step="0.01" value="0.4" class="ry" oninput="sv('v-rf',this);S('uRadial',+this.value)"></div>  
    <div class="ctrl"><div class="ctrl-lbl">Center X <span class="val" id="v-cx">0.50</span></div><input type="range" id="dCx" min="0" max="1" step="0.01" value="0.5" class="ry" oninput="sv('v-cx',this);S('uCenterX',+this.value)"></div>  
    <div class="ctrl"><div class="ctrl-lbl">Center Y <span class="val" id="v-cy">0.50</span></div><input type="range" id="dCy" min="0" max="1" step="0.01" value="0.5" class="ry" oninput="sv('v-cy',this);S('uCenterY',+this.value)"></div>  
    <div class="ctrl"><div class="ctrl-lbl">Base Radius <span class="val vb" id="v-br">1.00</span></div><input type="range" id="bRad" min="0.3" max="2.5" step="0.05" value="1.0" class="rb" oninput="sv('v-br',this);S('uBaseR',+this.value)"></div>  
    <div class="tog-row"><label>Invert Depth</label><label class="tog"><input type="checkbox" id="tInv" onchange="S('uInvert',this.checked?1.0:0.0)"><div class="tog-t"></div></label></div>  
    <div class="tog-row"><label>Field Warp</label><label class="tog"><input type="checkbox" id="tWarp" onchange="S('uWarpOn',this.checked?1.0:0.0)"><div class="tog-t"></div></label></div>  
    <div class="ctrl"><div class="ctrl-lbl">Warp Strength <span class="val vo" id="v-ws">0.08</span></div><input type="range" id="wStr" min="0" max="0.4" step="0.005" value="0.08" class="ro" oninput="sv('v-ws',this);S('uWarpStr',+this.value)"></div>  
  </div>  
  
  <!-- GRID -->  
  
  <div class="sec">  
    <div class="sec-hd"><span class="tic">◈</span> Grid and Color</div>  
    <div class="ctrl"><div class="ctrl-lbl">Resolution <span class="val" id="v-gr">200</span></div><input type="range" id="gRes" min="50" max="400" step="10" value="200" class="ry" oninput="sv('v-gr',this,0);buildGrid()"></div>  
    <div class="ctrl"><div class="ctrl-lbl">Point Size <span class="val" id="v-ps">1.5</span></div><input type="range" id="ptSz" min="0.5" max="6" step="0.1" value="1.5" class="ry" oninput="sv('v-ps',this);S('uPtSize',+this.value*0.018)"></div>  
    <div class="btns" style="margin-bottom:10px;">  
      <button class="btn ov" id="cm-0" onclick="setColorMode(0,this)">FRACTAL</button>  
      <button class="btn"    id="cm-1" onclick="setColorMode(1,this)">DEPTH</button>  
      <button class="btn"    id="cm-2" onclick="setColorMode(2,this)">IMAGE</button>  
      <button class="btn"    id="cm-3" onclick="setColorMode(3,this)">TINT</button>  
    </div>  
    <div class="swatches">  
      <div class="sw on" style="background:#e2ff3e" onclick="setTint('#e2ff3e',this)"></div>  
      <div class="sw" style="background:#c87fff" onclick="setTint('#c87fff',this)"></div>  
      <div class="sw" style="background:#3ecfff" onclick="setTint('#3ecfff',this)"></div>  
      <div class="sw" style="background:#ff4fa8" onclick="setTint('#ff4fa8',this)"></div>  
      <div class="sw" style="background:#3effb0" onclick="setTint('#3effb0',this)"></div>  
      <div class="sw" style="background:#ff8c3e" onclick="setTint('#ff8c3e',this)"></div>  
      <input type="color" id="custom-color" value="#e2ff3e" oninput="setTint(this.value,null)">  
    </div>  
  </div>  
  
  <!-- IMAGE CONTROLS — only relevant in IMAGE / BLEND mode -->  
  
  <div class="sec" id="img-controls">  
    <div class="sec-hd"><span class="tic">◈</span> Image Controls</div>  
  
```  
<div class="ctrl"><div class="ctrl-lbl">Zoom <span class="val vb" id="v-iz">1.00</span></div>  
  <input type="range" id="iZoom" min="0.1" max="8" step="0.05" value="1.0" class="rb"  
         oninput="sv('v-iz',this);S('uImgZoom',+this.value)"></div>  
  
<div class="ctrl"><div class="ctrl-lbl">Pan X <span class="val vb" id="v-ipx">0.00</span></div>  
  <input type="range" id="iPanX" min="-1" max="1" step="0.01" value="0.0" class="rb"  
         oninput="sv('v-ipx',this);S('uImgPanX',+this.value)"></div>  
  
<div class="ctrl"><div class="ctrl-lbl">Pan Y <span class="val vb" id="v-ipy">0.00</span></div>  
  <input type="range" id="iPanY" min="-1" max="1" step="0.01" value="0.0" class="rb"  
         oninput="sv('v-ipy',this);S('uImgPanY',+this.value)"></div>  
  
<div class="ctrl"><div class="ctrl-lbl">Rotation <span class="val vb" id="v-irot">0.00</span></div>  
  <input type="range" id="iRot" min="-3.14159" max="3.14159" step="0.01" value="0.0" class="rb"  
         oninput="sv('v-irot',this);S('uImgRot',+this.value)"></div>  
  
<div class="ctrl"><div class="ctrl-lbl">Depth Strength <span class="val vb" id="v-ids">0.50</span></div>  
  <input type="range" id="iDepStr" min="0" max="1.5" step="0.01" value="0.5" class="rb"  
         oninput="sv('v-ids',this);S('uImgDepthStr',+this.value)"></div>  
  
<div class="ctrl"><div class="ctrl-lbl">Edge Weight <span class="val vb" id="v-iedge">0.40</span></div>  
  <input type="range" id="iEdge" min="0" max="1" step="0.01" value="0.4" class="rb"  
         oninput="sv('v-iedge',this);S('uImgEdge',+this.value)"></div>  
  
<div style="height:1px;background:var(--b1);margin:6px 0;"></div>  
<div style="font-size:8px;color:var(--dim);letter-spacing:0.12em;margin-bottom:8px;">COLOR ADJUST</div>  
  
<div class="ctrl"><div class="ctrl-lbl">Brightness <span class="val vb" id="v-ibr">1.00</span></div>  
  <input type="range" id="iBright" min="0.1" max="3" step="0.01" value="1.0" class="rb"  
         oninput="sv('v-ibr',this);S('uImgBright',+this.value)"></div>  
  
<div class="ctrl"><div class="ctrl-lbl">Contrast <span class="val vb" id="v-icon">1.00</span></div>  
  <input type="range" id="iContrast" min="0.1" max="3" step="0.01" value="1.0" class="rb"  
         oninput="sv('v-icon',this);S('uImgContrast',+this.value)"></div>  
  
<div class="ctrl"><div class="ctrl-lbl">Saturation <span class="val vb" id="v-isat">1.00</span></div>  
  <input type="range" id="iSat" min="0" max="3" step="0.01" value="1.0" class="rb"  
         oninput="sv('v-isat',this);S('uImgSat',+this.value)"></div>  
  
<div style="height:1px;background:var(--b1);margin:6px 0;"></div>  
<div style="font-size:8px;color:var(--dim);letter-spacing:0.12em;margin-bottom:8px;">FLIP</div>  
<div class="btns">  
  <button class="btn" id="iflipx" onclick="toggleMirrorX(this)">FLIP H</button>  
  <button class="btn" id="iflipy" onclick="toggleMirrorY(this)">FLIP V</button>  
  <button class="btn" onclick="resetImgControls()">RESET</button>  
</div>  
```  
  
  </div>  
  
  <!-- MATERIAL -->  
  
  <div class="sec">  
    <div class="sec-hd"><span class="tic">◈</span> Material</div>  
    <div class="btns" style="margin-bottom:8px;">  
      <button class="btn oy" id="mat-0" onclick="setMat(0,this)">BASIC</button>  
      <button class="btn"    id="mat-1" onclick="setMat(1,this)">METAL</button>  
      <button class="btn"    id="mat-2" onclick="setMat(2,this)">GLASS</button>  
      <button class="btn"    id="mat-3" onclick="setMat(3,this)">CHROME</button>  
      <button class="btn"    id="mat-4" onclick="setMat(4,this)">GLOW</button>  
    </div>  
    <div class="ctrl"><div class="ctrl-lbl">Metalness <span class="val vo" id="v-metal">0.00</span></div>  
      <input type="range" id="mMetal" min="0" max="1" step="0.01" value="0.0" class="ro"  
             oninput="sv('v-metal',this);S('uMetalness',+this.value)"></div>  
    <div class="ctrl"><div class="ctrl-lbl">Roughness <span class="val vo" id="v-rough">1.00</span></div>  
      <input type="range" id="mRough" min="0.01" max="1" step="0.01" value="1.0" class="ro"  
             oninput="sv('v-rough',this);S('uRoughness',+this.value)"></div>  
    <div class="ctrl"><div class="ctrl-lbl">Glass Alpha <span class="val vo" id="v-glass">0.75</span></div>  
      <input type="range" id="mGlass" min="0.05" max="1" step="0.01" value="0.75" class="ro"  
             oninput="sv('v-glass',this);S('uGlassAlpha',+this.value)"></div>  
    <div class="ctrl"><div class="ctrl-lbl">Glow Strength <span class="val vo" id="v-glow">0.50</span></div>  
      <input type="range" id="mGlow" min="0" max="2" step="0.05" value="0.5" class="ro"  
             oninput="sv('v-glow',this);S('uGlowStr',+this.value)"></div>  
  </div>  
  
  <!-- MATERIAL AND ANIMATION -->  
  
  <div class="sec">  
    <div class="sec-hd"><span class="tic">◈</span> Render</div>  
    <div class="btns" style="margin-bottom:8px;">  
      <button class="btn oy" id="rm-0" onclick="setRenderMode(0,this)">POINTS</button>  
      <button class="btn"    id="rm-1" onclick="setRenderMode(1,this)">WIRE</button>  
      <button class="btn"    id="rm-2" onclick="setRenderMode(2,this)">SOLID</button>  
    </div>  
    <div class="ctrl"><div class="ctrl-lbl">Wire Density <span class="val" id="v-wd">0.80</span></div><input type="range" id="wDen" min="0.05" max="1" step="0.01" value="0.8" class="ry" oninput="sv('v-wd',this);buildGrid()"></div>  
  </div>  
  
  <div class="sec">  
    <div class="sec-hd"><span class="tic">◈</span> Animation</div>  
    <div class="btns" style="margin-bottom:8px;">  
      <button class="btn oy" onclick="setAnim(0,this)">OFF</button>  
      <button class="btn"    onclick="setAnim(1,this)">SPIN</button>  
      <button class="btn"    onclick="setAnim(2,this)">PULSE</button>  
      <button class="btn"    onclick="setAnim(3,this)">BREATHE</button>  
    </div>  
    <div class="ctrl"><div class="ctrl-lbl">Speed <span class="val" id="v-as">0.50</span></div><input type="range" id="aSpd" min="0.1" max="2" step="0.05" value="0.5" class="ry" oninput="sv('v-as',this)"></div>  
    <div class="ctrl"><div class="ctrl-lbl">Ambient Light <span class="val" id="v-al">0.40</span></div><input type="range" id="aLgt" min="0" max="1" step="0.01" value="0.4" class="ry" oninput="sv('v-al',this);ambL.intensity=+this.value"></div>  
  </div>  
  
  <!-- ACTIONS -->  
  
  <div class="sec">  
    <div class="action-row">  
      <button id="load-btn" onclick="loadAndBind()">▶ APPLY SOURCE</button>  
      <button id="rand-btn" onclick="randomize()">⚄ RAND</button>  
    </div>  
    <div class="export-row">  
      <button class="ex-btn" id="ex-png"  onclick="exportPNG()">↓ PNG</button>  
      <button class="ex-btn" id="ex-json" onclick="exportProject()">↓ PROJECT</button>  
    </div>  
    <div style="font-size:9px;color:var(--dim);margin-top:6px;line-height:1.5;text-align:center;">All sliders update GPU uniforms instantly · no rebuild</div>  
  </div>  
</div>  
  
<!-- MAIN -->  
  
<div id="main">  
  <div id="cv-wrap">  
    <canvas id="cv"></canvas>  
    <!-- Floating generate button — always visible until first render -->  
    <div id="hint">  
      <div class="hint-ring">  
        <div class="hr1"></div><div class="hr2"></div><div class="hr3"></div>  
        <div class="hc">◎</div>  
      </div>  
      <div class="hint-lbl">READY · PRESS GENERATE</div>  
      <button onclick="loadAndBind()" style="margin-top:16px;padding:13px 32px;background:var(--acc);color:#07070c;border:none;cursor:pointer;font-family:'Space Mono',monospace;font-size:11px;font-weight:700;letter-spacing:0.18em;border-radius:4px;pointer-events:all;">▶ GENERATE</button>  
    </div>  
  </div>  
  <div id="bar">  
    <div class="st"><div class="dot" id="d-src"></div><span id="s-src">NO SOURCE</span></div>  
    <div class="st"><div class="dot" id="d-geo"></div><span id="s-geo">NO GEOMETRY</span></div>  
    <span id="gpu-badge">GPU · VERTEX SHADER</span>  
    <div id="pill" class="py">PLANAR</div>  
    <span id="s-pts" style="font-size:8px;margin-left:6px;">—</span>  
  </div>  
</div>  
  
</div><!-- /app -->  
  
<!-- RIGHT-CLICK EXPORT CONTEXT MENU -->  
  
<div id="ctx-menu">  
  <div class="ctx-header">◈ Export Frame</div>  
  
  <div class="ctx-item" onclick="ctxExport(1920,1080,'FHD')">  
    <div class="ci-label">  
      <span class="ci-icon">↓</span>  
      <span>Full HD</span>  
    </div>  
    <div style="display:flex;align-items:center;gap:8px;">  
      <span class="ci-res">1920 × 1080</span>  
      <span class="ci-badge fhd">FHD</span>  
    </div>  
  </div>  
  
  <div class="ctx-item" onclick="ctxExport(2560,1440,'QHD')">  
    <div class="ci-label">  
      <span class="ci-icon">↓</span>  
      <span>Quad HD</span>  
    </div>  
    <div style="display:flex;align-items:center;gap:8px;">  
      <span class="ci-res">2560 × 1440</span>  
      <span class="ci-badge qhd">QHD</span>  
    </div>  
  </div>  
  
  <div class="ctx-item" onclick="ctxExport(3840,2160,'4K')">  
    <div class="ci-label">  
      <span class="ci-icon">↓</span>  
      <span>Ultra HD 4K</span>  
    </div>  
    <div style="display:flex;align-items:center;gap:8px;">  
      <span class="ci-res">3840 × 2160</span>  
      <span class="ci-badge uhd4">4K</span>  
    </div>  
  </div>  
  
  <div class="ctx-item" onclick="ctxExport(5120,2880,'5K')">  
    <div class="ci-label">  
      <span class="ci-icon">↓</span>  
      <span>5K</span>  
    </div>  
    <div style="display:flex;align-items:center;gap:8px;">  
      <span class="ci-res">5120 × 2880</span>  
      <span class="ci-badge uhd4">5K</span>  
    </div>  
  </div>  
  
  <div class="ctx-item" onclick="ctxExport(7680,4320,'8K')">  
    <div class="ci-label">  
      <span class="ci-icon">↓</span>  
      <span>Ultra HD 8K</span>  
    </div>  
    <div style="display:flex;align-items:center;gap:8px;">  
      <span class="ci-res">7680 × 4320</span>  
      <span class="ci-badge uhd8">8K</span>  
    </div>  
  </div>  
  
  <div class="ctx-divider"></div>  
  
  <div class="ctx-item" onclick="ctxExportSquare(4096)">  
    <div class="ci-label">  
      <span class="ci-icon">↓</span>  
      <span>Square 4K</span>  
    </div>  
    <div style="display:flex;align-items:center;gap:8px;">  
      <span class="ci-res">4096 × 4096</span>  
      <span class="ci-badge uhd4">SQ</span>  
    </div>  
  </div>  
  
  <div class="ctx-item" onclick="ctxExportSquare(8192)">  
    <div class="ci-label">  
      <span class="ci-icon">↓</span>  
      <span>Square 8K</span>  
    </div>  
    <div style="display:flex;align-items:center;gap:8px;">  
      <span class="ci-res">8192 × 8192</span>  
      <span class="ci-badge uhd8">SQ</span>  
    </div>  
  </div>  
  
  <div class="ctx-divider"></div>  
  
  <div class="ctx-item" onclick="ctxExportProject()">  
    <div class="ci-label">  
      <span class="ci-icon">⬡</span>  
      <span>Export Project JSON</span>  
    </div>  
    <span class="ci-badge proj">PRESET</span>  
  </div>  
  
  <div class="ctx-divider"></div>  
  
  <div class="ctx-item" onclick="closeCtxMenu()" style="color:var(--dim);">  
    <div class="ci-label">  
      <span class="ci-icon" style="opacity:0.4;">✕</span>  
      <span>Cancel</span>  
    </div>  
  </div>  
  
  <div id="ctx-progress">  
    <div class="ctx-prog-label" id="ctx-prog-label">RENDERING…</div>  
    <div class="ctx-prog-bar"><div class="ctx-prog-fill" id="ctx-prog-fill"></div></div>  
  </div>  
</div>  
  
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>  
  
<script>  
// ════════════════════════════════════════════════════════════════════════  
//  DEPTH ENGINE v6.1 — GPU ARCHITECTURE  
//  UUON FOUNDATION · Phillip A. Ruiz III  
//  
//  All projection, depth, and fractal computation runs in GLSL shaders.  
//  The CPU builds a UV grid once. Every slider writes one uniform float.  
//  No geometry rebuild on parameter change — only on resolution/mode change.  
//  
//  FIXES from v6:  
//  - All shader uniforms are float (no int comparisons in GLSL ES 1.0)  
//  - uPtSize uniform added and wired  
//  - Morph speed slider wired to fracTime accumulation  
//  - Dead code removed  
//  - Status bar element refs corrected  
//  - Projection comparison uses float equality via step() pattern  
// ════════════════════════════════════════════════════════════════════════  
  
var scene, camera, renderer, clock;  
var ambL, dirL;  
var mesh = null, pts = null;  
var imgTex = null;  
var projMode = 0, polarSub = 0, sphereSub = 0;  
var renderMode = 0, srcMode = 0, colorMode = 0;  
var fracType = 0, animMode = 0;  
var tintRGB = new THREE.Color(0xe2ff3e);  
var fracTime = 0;  
  
// All uniforms live here — sliders write directly, shader reads next frame  
var U = {  
  uFracTime:   { value: 0.0 },  
  uSrcMode:    { value: 0.0 },  
  uColorMode:  { value: 0.0 },  
  uProjMode:   { value: 0.0 },  
  uPolarSub:   { value: 0.0 },  
  uSphereSub:  { value: 0.0 },  
  uAspect:     { value: 1.0 },  
  uDepthScale: { value: 0.6 },  
  uRadial:     { value: 0.4 },  
  uCenterX:    { value: 0.5 },  
  uCenterY:    { value: 0.5 },  
  uBaseR:      { value: 1.0 },  
  uInvert:     { value: 0.0 },  
  uWarpOn:     { value: 0.0 },  
  uWarpStr:    { value: 0.08 },  
  uFracType:   { value: 0.0 },  
  uPow:        { value: 2.0 },  
  uJx:         { value: -0.7 },  
  uJy:         { value: 0.27 },  
  uIter:       { value: 96.0 },  
  uFZoom:      { value: 1.0 },  
  uFPanX:      { value: 0.0 },  
  uFPanY:      { value: 0.0 },  
  uCpal:       { value: 1.0 },  
  uCoff:       { value: 0.0 },  
  uKal:        { value: 1.0 },  
  uTorusR:     { value: 1.2 },  
  uTubeR:      { value: 0.45 },  
  uTint:       { value: new THREE.Color(0xe2ff3e) },  
  uPtSize:     { value: 0.027 },  
  uImgTex:     { value: null },  
  uHasImg:     { value: 0.0 },  
  // Image mode — UV transform applied before sampling  
  uImgZoom:    { value: 1.0 },   // zoom into image  
  uImgPanX:    { value: 0.0 },   // pan X  (-1..1)  
  uImgPanY:    { value: 0.0 },   // pan Y  (-1..1)  
  uImgRot:     { value: 0.0 },   // rotation radians  
  uImgMirrorX: { value: 0.0 },   // 1 = flip horizontal  
  uImgMirrorY: { value: 0.0 },   // 1 = flip vertical  
  uImgDepthStr:{ value: 0.5 },   // how much luminance drives depth in image mode  
  uImgEdge:    { value: 0.4 },   // edge detection weight for depth  
  uImgSat:     { value: 1.0 },   // color saturation multiplier  
  uImgBright:  { value: 1.0 },   // brightness  
  uImgContrast:{ value: 1.0 },   // contrast  
  uMatMode:    { value: 0.0 },   // 0=basic,1=metallic,2=glass,3=glow,4=chrome  
  uMetalness:  { value: 0.0 },   // metalness for PBR-style shading  
  uRoughness:  { value: 1.0 },   // roughness  
  uGlassAlpha: { value: 0.75 },  // glass opacity  
  uGlowStr:    { value: 0.5 }    // emissive glow strength  
};  
  
function S(name, val) {  
  if (U[name] !== undefined) U[name].value = val;  
}  
  
// ─────────────────────────────────────────────────────────────────────  
// VERTEX SHADER  
// All projection math lives here. Runs per-vertex, per-frame, on GPU.  
// UV coordinates come in as attributes. Everything else is uniform.  
// ─────────────────────────────────────────────────────────────────────  
var VERT = [  
'uniform sampler2D uImgTex;',  
'uniform float uSrcMode;',  
'uniform float uProjMode;',  
'uniform float uPolarSub;',  
'uniform float uSphereSub;',  
'uniform float uAspect;',  
'uniform float uDepthScale;',  
'uniform float uRadial;',  
'uniform float uCenterX;',  
'uniform float uCenterY;',  
'uniform float uBaseR;',  
'uniform float uInvert;',  
'uniform float uWarpOn;',  
'uniform float uWarpStr;',  
'uniform float uFracTime;',  
'uniform float uTorusR;',  
'uniform float uTubeR;',  
'uniform float uFracType;',  
'uniform float uPow;',  
'uniform float uJx;',  
'uniform float uJy;',  
'uniform float uIter;',  
'uniform float uFZoom;',  
'uniform float uFPanX;',  
'uniform float uFPanY;',  
'uniform float uKal;',  
'uniform float uHasImg;',  
'uniform float uPtSize;',  
// Image mode UV controls  
'uniform float uImgZoom;',  
'uniform float uImgPanX;',  
'uniform float uImgPanY;',  
'uniform float uImgRot;',  
'uniform float uImgMirrorX;',  
'uniform float uImgMirrorY;',  
'uniform float uImgDepthStr;',  
'uniform float uImgEdge;',  
'varying vec2 vUV;',  
'varying float vDepth;',  
  
'const float PI = 3.14159265;',  
'const float TAU = 6.28318530;',  
  
'vec2 cpow(vec2 z, float n) {',  
'  float r = length(z); if (r < 1e-6) return vec2(0.0);',  
'  float a = atan(z.y, z.x);',  
'  return pow(r, n) * vec2(cos(a*n), sin(a*n));',  
'}',  
'vec2 cmul(vec2 a, vec2 b) { return vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x); }',  
'vec2 cdiv(vec2 a, vec2 b) { float d=dot(b,b)+1e-10; return vec2(dot(a,b), a.y*b.x-a.x*b.y)/d; }',  
'vec2 cconj(vec2 z) { return vec2(z.x, -z.y); }',  
'vec2 kfold(vec2 p, float k) {',  
'  if (k < 2.0) return p;',  
'  float a = atan(p.y, p.x); float r = length(p); float seg = TAU/k;',  
'  a = mod(a, seg); if (a > seg*0.5) a = seg - a;',  
'  return vec2(cos(a), sin(a)) * r;',  
'}',  
  
// Image UV transform: zoom, pan, rotate, mirror — applied before texture sample  
'vec2 imgUV(vec2 uvIn) {',  
'  vec2 uvc = uvIn - 0.5;',                          // center  
'  float c = cos(uImgRot); float s = sin(uImgRot);', // rotate  
'  uvc = vec2(c*uvc.x - s*uvc.y, s*uvc.x + c*uvc.y);',  
'  uvc /= uImgZoom;',                                // zoom (>1 = zoom in)  
'  uvc += vec2(uImgPanX, -uImgPanY);',               // pan  
'  uvc += 0.5;',                                     // un-center  
'  if (uImgMirrorX > 0.5) uvc.x = 1.0 - uvc.x;',   // flip  
'  if (uImgMirrorY > 0.5) uvc.y = 1.0 - uvc.y;',  
'  return uvc;',  
'}',  
  
// Fractal escape depth — used in vertex shader for displacement  
// Uses float comparisons throughout to avoid int uniform issues  
'float fracDepth(vec2 uvIn) {',  
'  vec2 c = ((uvIn - 0.5) * 3.5 / uFZoom) + vec2(uFPanX, uFPanY);',  
'  if (uKal >= 2.0) c = kfold(c, uKal);',  
'  vec2 z = vec2(0.0); vec2 zprev = vec2(0.0);',  
'  vec2 Cj = vec2(uJx + sin(uFracTime*0.17)*0.015, uJy + cos(uFracTime*0.13)*0.015);',  
'  float it = 0.0; float mi = uIter; bool esc = false;',  
'  float ft = uFracType;',  
// Mandelbrot  
'  if (ft < 0.5) {',  
'    for (int i=0;i<256;i++) { if(float(i)>=mi)break; if(dot(z,z)>4.0){esc=true;break;} z=cpow(z,uPow)+c; it+=1.0; }',  
'  } else if (ft < 1.5) {',  // Julia  
'    z=c; for(int i=0;i<256;i++){if(float(i)>=mi)break;if(dot(z,z)>4.0){esc=true;break;}z=cpow(z,uPow)+Cj;it+=1.0;}',  
'  } else if (ft < 2.5) {',  // Burning Ship  
'    for(int i=0;i<256;i++){if(float(i)>=mi)break;if(dot(z,z)>4.0){esc=true;break;}z=vec2(abs(z.x),abs(z.y));z=cpow(z,2.0)+c;it+=1.0;}',  
'  } else if (ft < 3.5) {',  // Nova  
'    z=c; for(int i=0;i<256;i++){if(float(i)>=mi)break;vec2 z2=cmul(z,z);vec2 dz=cdiv(cmul(z2,z)-vec2(1,0),3.0*z2);z=z-dz+c*0.05;it+=1.0;if(length(dz)<0.0003){esc=true;break;}}',  
'  } else if (ft < 4.5) {',  // Phoenix  
'    z=c; for(int i=0;i<256;i++){if(float(i)>=mi)break;if(dot(z,z)>4.0){esc=true;break;}vec2 zn=cpow(z,2.0)+c+0.5*zprev;zprev=z;z=zn;it+=1.0;}',  
'  } else if (ft < 5.5) {',  // Power Mandel  
'    float p2=uPow+sin(uFracTime*0.4)*0.5;',  
'    for(int i=0;i<256;i++){if(float(i)>=mi)break;if(dot(z,z)>4.0){esc=true;break;}z=cpow(z,p2)+c;it+=1.0;}',  
'  } else if (ft < 6.5) {',  // Celtic  
'    for(int i=0;i<256;i++){if(float(i)>=mi)break;if(dot(z,z)>4.0){esc=true;break;}z=vec2(abs(z.x*z.x-z.y*z.y),2.0*z.x*z.y)+c;it+=1.0;}',  
'  } else if (ft < 7.5) {',  // Buffalo  
'    for(int i=0;i<256;i++){if(float(i)>=mi)break;if(dot(z,z)>4.0){esc=true;break;}z=vec2(abs(z.x*z.x-z.y*z.y)-abs(z.x),2.0*abs(z.x)*z.y)+c;it+=1.0;}',  
'  } else if (ft < 8.5) {',  // Tricorn  
'    for(int i=0;i<256;i++){if(float(i)>=mi)break;if(dot(z,z)>4.0){esc=true;break;}z=cpow(cconj(z),2.0)+c;it+=1.0;}',  
'  } else if (ft < 9.5) {',  // Newton  
'    z=c; for(int i=0;i<256;i++){if(float(i)>=mi)break;vec2 z2=cmul(z,z);vec2 dz=cdiv(cmul(z2,z)-vec2(1,0),3.0*z2);z-=dz;it+=1.0;if(length(dz)<0.001){esc=true;break;}}',  
'  } else if (ft < 10.5) {', // Kaleido Mandel  
'    vec2 zk=kfold(c,6.0); for(int i=0;i<256;i++){if(float(i)>=mi)break;if(dot(z,z)>4.0){esc=true;break;}z=cpow(z,uPow)+zk;it+=1.0;}',  
'  } else {',                 // Burning Julia  
'    z=c; for(int i=0;i<256;i++){if(float(i)>=mi)break;if(dot(z,z)>4.0){esc=true;break;}z=vec2(abs(z.x),abs(z.y));z=cpow(z,2.0)+Cj;it+=1.0;}',  
'  }',  
'  if (!esc) return 0.0;',  
'  return (it + 1.0 - log2(max(1.0, log2(dot(z,z))))) / mi;',  
'}',  
  
'void main() {',  
'  vUV = uv;',  
'  vec2 uvW = uv;',  
  
// Field warp  
'  if (uWarpOn > 0.5) {',  
'    uvW.x = clamp(uvW.x + sin(uv.y*3.0+uFracTime)*uWarpStr, 0.0, 1.0);',  
'    uvW.y = clamp(uvW.y + cos(uv.x*3.0+uFracTime)*uWarpStr, 0.0, 1.0);',  
'  }',  
  
// Image UV transform (zoom/pan/rotate/mirror) — only in image/blend mode  
'  vec2 imgUVcoord = imgUV(uvW);',  
  
// Depth sampling  
'  float rawD;',  
'  if (uSrcMode > 0.5 && uHasImg > 0.5) {',  
// Image depth: luminance + simple edge via central difference  
'    vec4 px  = texture2D(uImgTex, imgUVcoord);',  
'    float lum = dot(px.rgb, vec3(0.299,0.587,0.114));',  
'    float off = 0.002;',  
'    float lR  = dot(texture2D(uImgTex, imgUVcoord+vec2(off,0.0)).rgb, vec3(0.299,0.587,0.114));',  
'    float lU  = dot(texture2D(uImgTex, imgUVcoord+vec2(0.0,off)).rgb, vec3(0.299,0.587,0.114));',  
'    float edge = clamp(length(vec2(lR-lum, lU-lum)) * 60.0, 0.0, 1.0);',  
'    rawD = lum*(1.0-uImgEdge) + edge*uImgEdge;',  
'    rawD = clamp(rawD * uImgDepthStr * 2.0, 0.0, 1.0);',  
'  } else {',  
'    rawD = fracDepth(uvW);',  
'  }',  
  
// Radial modifier  
'  vec2 dv = uvW - vec2(uCenterX, uCenterY);',  
'  float dist = length(dv) / 0.7071;',  
'  float boost = 1.0 + uRadial * (1.0 - clamp(dist, 0.0, 1.0));',  
'  float d = clamp(rawD * boost * uDepthScale, 0.0, 1.5);',  
'  if (uInvert > 0.5) d = max(0.0, uDepthScale - d);',  
// IMAGE mode: no displacement  
'  if (uSrcMode > 0.5 && uSrcMode < 1.5) d = 0.0;',  
'  vDepth = rawD;',  
  
'  float ds = uDepthScale * 1.4;',  
'  float asp = uAspect;',  
'  vec3 pos;',  
'  float pm = uProjMode;',  
  
// PLANAR  
'  if (pm < 0.5) {',  
'    pos = vec3((uvW.x-0.5)*2.0, (0.5-uvW.y)*2.0*asp, d*ds - ds*0.3);',  
  
// POLAR  
'  } else if (pm < 1.5) {',  
'    float dx = uvW.x - uCenterX;',  
'    float dy = uvW.y - uCenterY;',  
'    float r_uv = length(vec2(dx, dy));',  
'    float theta = atan(dy, dx);',  
'    float r3d;',  
'    if (uPolarSub < 0.5) { r3d = r_uv * uBaseR * 1.5; }',  
'    else if (uPolarSub < 1.5) { r3d = (0.35 + r_uv*0.65) * uBaseR * 1.5; }',  
'    else { theta += r_uv * PI * 0.5; r3d = r_uv * uBaseR * 1.5; }',  
'    pos = vec3(r3d*cos(theta), r3d*sin(theta), d*ds - ds*0.3);',  
  
// SPHERICAL  
'  } else if (pm < 2.5) {',  
'    float th = uvW.x * TAU;',  
'    if (uSphereSub > 1.5) {',  // WRAP  
'      float R = uBaseR + d*ds;',  
'      pos = vec3(R*sin(th), (0.5-uvW.y)*2.0*max(asp,1.0), R*cos(th));',  
'    } else {',  
'      float phiMax = (uSphereSub < 0.5) ? PI : PI*0.5;',  
'      float phi = uvW.y * phiMax;',  
'      float R = uBaseR + d*ds*sin(phi+0.05);',  
'      pos = vec3(R*sin(phi)*sin(th), R*cos(phi), R*sin(phi)*cos(th));',  
'    }',  
  
// TOROIDAL  
'  } else {',  
'    float th = uvW.x * TAU;',  
'    float ph = uvW.y * TAU;',  
'    float R = uTorusR + d*ds*0.5;',  
'    pos = vec3((R+uTubeR*cos(ph))*cos(th), (R+uTubeR*cos(ph))*sin(th), uTubeR*sin(ph));',  
'  }',  
  
'  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);',  
'  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);',  
'  gl_PointSize = uPtSize * (600.0 / -mvPos.z);',  
'}'  
].join('\n');  
  
// ─────────────────────────────────────────────────────────────────────  
// FRAGMENT SHADER  
// Psychedelic three-channel color model.  
// R, G, B driven at frequencies 1.0, 0.618, 0.382 with 120deg offsets.  
// ─────────────────────────────────────────────────────────────────────  
var FRAG = [  
'precision highp float;',  
'uniform sampler2D uImgTex;',  
'uniform float uSrcMode;',  
'uniform float uColorMode;',  
'uniform float uFracType;',  
'uniform float uFracTime;',  
'uniform float uIter;',  
'uniform float uFZoom;',  
'uniform float uFPanX;',  
'uniform float uFPanY;',  
'uniform float uJx;',  
'uniform float uJy;',  
'uniform float uPow;',  
'uniform float uCpal;',  
'uniform float uCoff;',  
'uniform float uKal;',  
'uniform float uWarpOn;',  
'uniform float uWarpStr;',  
'uniform float uHasImg;',  
'uniform vec3 uTint;',  
'uniform float uImgZoom;',  
'uniform float uImgPanX;',  
'uniform float uImgPanY;',  
'uniform float uImgRot;',  
'uniform float uImgMirrorX;',  
'uniform float uImgMirrorY;',  
'uniform float uImgSat;',  
'uniform float uImgBright;',  
'uniform float uImgContrast;',  
'uniform float uMatMode;',  
'uniform float uMetalness;',  
'uniform float uRoughness;',  
'uniform float uGlassAlpha;',  
'uniform float uGlowStr;',  
'varying vec2 vUV;',  
'varying float vDepth;',  
  
'const float PI = 3.14159265;',  
'const float TAU = 6.28318530;',  
  
'vec2 cp2(vec2 z,float n){float r=length(z);if(r<1e-6)return vec2(0.0);float a=atan(z.y,z.x);return pow(r,n)*vec2(cos(a*n),sin(a*n));}',  
'vec2 cm2(vec2 a,vec2 b){return vec2(a.x*b.x-a.y*b.y,a.x*b.y+a.y*b.x);}',  
'vec2 cd2(vec2 a,vec2 b){float d=dot(b,b)+1e-10;return vec2(dot(a,b),a.y*b.x-a.x*b.y)/d;}',  
'vec2 cc2(vec2 z){return vec2(z.x,-z.y);}',  
'vec2 kf2(vec2 p,float k){if(k<2.0)return p;float a=atan(p.y,p.x),r=length(p),s=TAU/k;a=mod(a,s);if(a>s*0.5)a=s-a;return vec2(cos(a),sin(a))*r;}',  
  
// Image UV transform — same formula as vertex shader  
'vec2 imgUVf(vec2 uvIn) {',  
'  vec2 uvc = uvIn - 0.5;',  
'  float c = cos(uImgRot); float s = sin(uImgRot);',  
'  uvc = vec2(c*uvc.x - s*uvc.y, s*uvc.x + c*uvc.y);',  
'  uvc /= uImgZoom;',  
'  uvc += vec2(uImgPanX, -uImgPanY);',  
'  uvc += 0.5;',  
'  if (uImgMirrorX > 0.5) uvc.x = 1.0 - uvc.x;',  
'  if (uImgMirrorY > 0.5) uvc.y = 1.0 - uvc.y;',  
'  return uvc;',  
'}',  
  
// Sample image with all adjustments applied  
'vec3 imgSample(vec2 uv) {',  
'  vec2 tc = imgUVf(uv);',  
'  vec3 c = texture2D(uImgTex, tc).rgb;',  
// Brightness  
'  c *= uImgBright;',  
// Contrast — pivot at 0.5  
'  c = (c - 0.5) * uImgContrast + 0.5;',  
'  c = clamp(c, 0.0, 1.0);',  
// Saturation — mix toward luminance  
'  float lum = dot(c, vec3(0.299,0.587,0.114));',  
'  c = mix(vec3(lum), c, uImgSat);',  
'  return clamp(c, 0.0, 1.0);',  
'}',  
  
'vec3 psychColor(float t) {',  
'  float base = t * uCpal * 10.0 + uCoff * TAU + uFracTime * 0.3;',  
'  float r = pow(0.5 + 0.5*sin(base*1.000 + 0.000), 0.6);',  
'  float g = pow(0.5 + 0.5*sin(base*0.618 + 2.094), 0.6);',  
'  float b = pow(0.5 + 0.5*sin(base*0.382 + 4.189), 0.6);',  
'  float bnd = exp(-fract(t*uCpal*8.0)*3.5)*0.4;',  
'  return vec3(r,g,b) + vec3(bnd);',  
'}',  
  
'vec3 fracColor(vec2 uvIn) {',  
'  vec2 uvW = uvIn;',  
'  if (uWarpOn > 0.5) {',  
'    uvW.x = clamp(uvW.x + sin(uvIn.y*3.0+uFracTime)*uWarpStr, 0.0, 1.0);',  
'    uvW.y = clamp(uvW.y + cos(uvIn.x*3.0+uFracTime)*uWarpStr, 0.0, 1.0);',  
'  }',  
'  vec2 c = ((uvW-0.5)*3.5/uFZoom) + vec2(uFPanX,uFPanY);',  
'  if (uKal >= 2.0) c = kf2(c, uKal);',  
'  vec2 z=vec2(0.0), zprev=vec2(0.0);',  
'  vec2 Cj=vec2(uJx+sin(uFracTime*0.17)*0.015, uJy+cos(uFracTime*0.13)*0.015);',  
'  float it=0.0, mi=uIter; bool esc=false;',  
'  float ft=uFracType;',  
'  if(ft<0.5){for(int i=0;i<512;i++){if(float(i)>=mi)break;if(dot(z,z)>4.0){esc=true;break;}z=cp2(z,uPow)+c;it+=1.0;}}',  
'  else if(ft<1.5){z=c;for(int i=0;i<512;i++){if(float(i)>=mi)break;if(dot(z,z)>4.0){esc=true;break;}z=cp2(z,uPow)+Cj;it+=1.0;}}',  
'  else if(ft<2.5){for(int i=0;i<512;i++){if(float(i)>=mi)break;if(dot(z,z)>4.0){esc=true;break;}z=vec2(abs(z.x),abs(z.y));z=cp2(z,2.0)+c;it+=1.0;}}',  
'  else if(ft<3.5){z=c;for(int i=0;i<512;i++){if(float(i)>=mi)break;vec2 z2=cm2(z,z);vec2 dz=cd2(cm2(z2,z)-vec2(1,0),3.0*z2);z=z-dz+c*0.05;it+=1.0;if(length(dz)<0.0003){esc=true;break;}}}',  
'  else if(ft<4.5){z=c;for(int i=0;i<512;i++){if(float(i)>=mi)break;if(dot(z,z)>4.0){esc=true;break;}vec2 zn=cp2(z,2.0)+c+0.5*zprev;zprev=z;z=zn;it+=1.0;}}',  
'  else if(ft<5.5){float p2=uPow+sin(uFracTime*0.4)*0.5;for(int i=0;i<512;i++){if(float(i)>=mi)break;if(dot(z,z)>4.0){esc=true;break;}z=cp2(z,p2)+c;it+=1.0;}}',  
'  else if(ft<6.5){for(int i=0;i<512;i++){if(float(i)>=mi)break;if(dot(z,z)>4.0){esc=true;break;}z=vec2(abs(z.x*z.x-z.y*z.y),2.0*z.x*z.y)+c;it+=1.0;}}',  
'  else if(ft<7.5){for(int i=0;i<512;i++){if(float(i)>=mi)break;if(dot(z,z)>4.0){esc=true;break;}z=vec2(abs(z.x*z.x-z.y*z.y)-abs(z.x),2.0*abs(z.x)*z.y)+c;it+=1.0;}}',  
'  else if(ft<8.5){for(int i=0;i<512;i++){if(float(i)>=mi)break;if(dot(z,z)>4.0){esc=true;break;}z=cp2(cc2(z),2.0)+c;it+=1.0;}}',  
'  else if(ft<9.5){z=c;for(int i=0;i<512;i++){if(float(i)>=mi)break;vec2 z2=cm2(z,z);vec2 dz=cd2(cm2(z2,z)-vec2(1,0),3.0*z2);z-=dz;it+=1.0;if(length(dz)<0.001){esc=true;break;}}}',  
'  else if(ft<10.5){vec2 zk=kf2(c,6.0);for(int i=0;i<512;i++){if(float(i)>=mi)break;if(dot(z,z)>4.0){esc=true;break;}z=cp2(z,uPow)+zk;it+=1.0;}}',  
'  else{z=c;for(int i=0;i<512;i++){if(float(i)>=mi)break;if(dot(z,z)>4.0){esc=true;break;}z=vec2(abs(z.x),abs(z.y));z=cp2(z,2.0)+Cj;it+=1.0;}}',  
'  if (!esc) {',  
'    float m=length(z)/2.0;',  
'    float ip=m*uCpal*4.0+uCoff*TAU+uFracTime*0.5;',  
'    return vec3(0.06+0.05*sin(ip*1.3), 0.03+0.07*sin(ip*0.8+2.1), 0.10+0.08*sin(ip*1.7+4.2));',  
'  }',  
'  float tsm=(it+1.0-log2(max(1.0,log2(dot(z,z)))))/mi;',  
'  return psychColor(tsm);',  
'}',  
  
// Fake specular highlight for metallic/glass — uses fragment position as proxy  
'float specular(float roughness) {',  
'  vec2 uvc = vUV - 0.5;',  
'  float rim = pow(clamp(1.0 - length(uvc)*1.6, 0.0, 1.0), 2.0 + roughness*4.0);',  
'  float depth_edge = pow(vDepth, 0.5);',  
'  return rim * depth_edge;',  
'}',  
  
'void main() {',  
'  vec3 col;',  
'  float cm = uColorMode;',  
'  bool hasImg = uHasImg > 0.5;',  
'  bool isImgMode = uSrcMode > 0.5 && uSrcMode < 1.5;',  
'  bool isBlend  = uSrcMode > 1.5;',  
  
// Base color selection  
'  if (cm < 0.5) {',  
'    if (isImgMode && hasImg) {',  
'      col = imgSample(vUV);',          // IMAGE mode — adjusted image color  
'    } else {',  
'      col = fracColor(vUV);',          // FRACTAL color  
'    }',  
'  } else if (cm < 1.5) {',  
'    float d = vDepth;',  
'    col = vec3(0.5+0.5*sin(d*TAU+1.0), 0.5+0.5*sin(d*TAU+3.14), 0.5+0.5*sin(d*TAU+5.28));',  
'    col *= (0.1 + d*0.9);',  
'  } else if (cm < 2.5 && hasImg) {',  
'    col = imgSample(vUV);',  
'  } else {',  
'    col = uTint * (0.12 + vDepth*0.88);',  
'  }',  
  
// Blend mode overlay  
'  if (isBlend && hasImg) {',  
'    vec3 imgC = imgSample(vUV);',  
'    float lum = dot(imgC, vec3(0.299,0.587,0.114));',  
'    col = mix(col, imgC, lum*0.55);',  
'  }',  
  
// ── MATERIAL MODES ──  
'  float mm = uMatMode;',  
  
// METALLIC (1): darken base, add bright specular highlight, boost contrast  
'  if (mm > 0.5 && mm < 1.5) {',  
'    float spec = specular(uRoughness);',  
'    col = col * (0.3 + vDepth*0.7);',           // darken valleys  
'    col = mix(col, vec3(1.0), spec * uMetalness);', // bright peaks  
'    col += vec3(spec*0.2) * uMetalness;',         // rim light  
'    col = pow(col, vec3(1.0/(0.6+uRoughness*0.8)));', // gamma lift  
  
// GLASS (2): partial transparency via mix with dark bg, iridescent edge  
'  } else if (mm > 1.5 && mm < 2.5) {',  
'    float spec = specular(uRoughness * 0.3);',  
'    vec3 glassBase = mix(vec3(0.02,0.03,0.05), col, uGlassAlpha);',  
'    glassBase += vec3(spec*0.5, spec*0.6, spec*0.9);',  // blue-white sheen  
'    float depth_fade = 0.4 + vDepth*0.6;',  
'    col = glassBase * depth_fade;',  
'    col = clamp(col, 0.0, 1.0);',  
  
// CHROME (3): high contrast mirror-like, almost no hue  
'  } else if (mm > 2.5 && mm < 3.5) {',  
'    float lum = dot(col, vec3(0.299,0.587,0.114));',  
'    float spec = specular(0.1);',  
'    col = mix(vec3(lum*0.15), vec3(lum*1.2 + spec), vDepth);',  
'    col += vec3(spec * 0.8);',  
'    col = clamp(col, 0.0, 1.0);',  
  
// GLOW (4): emissive — boost bright areas, darken valleys, add color bloom  
'  } else if (mm > 3.5) {',  
'    float glow = pow(vDepth, 0.5) * uGlowStr;',  
'    col = col * (1.0 + glow * 1.5);',  
'    vec3 bloomColor = col * glow * 0.6;',  
'    col += bloomColor;',  
'    col = clamp(col, 0.0, 1.2);',  // allow slight overbright for bloom feel  
'  }',  
  
'  gl_FragColor = vec4(col, 1.0);',  
'}'  
].join('\n');  
  
// ── INIT ──  
function initThree() {  
  var cv = document.getElementById('cv');  
  var wp = document.getElementById('cv-wrap') || document.getElementById('cvw');  
  if (!cv || !wp) { console.error('Canvas or wrapper not found'); return; }  
  
  scene = new THREE.Scene();  
  scene.background = new THREE.Color(0x07070c);  
  camera = new THREE.PerspectiveCamera(50, wp.clientWidth/wp.clientHeight, 0.01, 100);  
  camera.position.set(0, 0, 3.5);  
  renderer = new THREE.WebGLRenderer({  
    canvas: cv, antialias: true,  
    preserveDrawingBuffer: true, powerPreference: 'high-performance'  
  });  
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));  
  renderer.setSize(wp.clientWidth, wp.clientHeight);  
  
  ambL = new THREE.AmbientLight(0xffffff, 0.4);  
  dirL = new THREE.DirectionalLight(0xffffff, 0.8);  
  dirL.position.set(4, 6, 5);  
  scene.add(ambL, dirL);  
  
  U.uAspect.value = wp.clientWidth / wp.clientHeight;  
  clock = new THREE.Clock();  
  setupOrbit();  
  buildGrid();  
  animLoop();  
  
  window.addEventListener('resize', function() {  
    var w = wp.clientWidth, h = wp.clientHeight;  
    camera.aspect = w/h;  
    camera.updateProjectionMatrix();  
    renderer.setSize(w, h);  
    U.uAspect.value = w/h;  
  });  
}  
  
// ── BUILD GRID — only called on init, resolution change, or render mode change ──  
function buildGrid() {  
  if (mesh) { scene.remove(mesh); mesh.geometry.dispose(); mesh.material.dispose(); mesh = null; }  
  if (pts)  { scene.remove(pts);  pts.geometry.dispose();  pts.material.dispose();  pts  = null; }  
  
  var resEl = document.getElementById('gRes');  
  var denEl = document.getElementById('wDen');  
  var res = resEl ? parseInt(resEl.value) : 200;  
  var den = denEl ? parseFloat(denEl.value) : 0.8;  
  var W = res, H = res;  
  
  var positions = new Float32Array(W * H * 3); // all zero — shader moves them  
  var uvs = new Float32Array(W * H * 2);  
  var indices = [];  
  
  for (var j = 0; j < H; j++) {  
    for (var i = 0; i < W; i++) {  
      var idx = j * W + i;  
      uvs[idx*2]   = i / (W-1);  
      uvs[idx*2+1] = j / (H-1);  
    }  
  }  
  
  for (var j = 0; j < H-1; j++) {  
    for (var i = 0; i < W-1; i++) {  
      if (renderMode === 1 && Math.random() > den) continue;  
      var a = j*W+i, b = j*W+i+1, c = (j+1)*W+i, d = (j+1)*W+i+1;  
      indices.push(a,b,c, b,d,c);  
    }  
  }  
  
  var geo = new THREE.BufferGeometry();  
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));  
  geo.setAttribute('uv',       new THREE.BufferAttribute(uvs, 2));  
  if (renderMode !== 0) geo.setIndex(indices);  
  
  var mat = new THREE.ShaderMaterial({  
    vertexShader:   VERT,  
    fragmentShader: FRAG,  
    uniforms:       U,  
    wireframe:      renderMode === 1  
  });  
  
  if (renderMode === 0) {  
    pts = new THREE.Points(geo, mat);  
    scene.add(pts);  
    var spts = document.getElementById('s-pts') || document.getElementById('spts');  
    if (spts) spts.textContent = (W*H) + ' PTS';  
  } else {  
    mesh = new THREE.Mesh(geo, mat);  
    scene.add(mesh);  
    var spts = document.getElementById('s-pts') || document.getElementById('spts');  
    if (spts) spts.textContent = Math.floor(indices.length/3) + ' TRIS';  
  }  
  
  var dgeo = document.getElementById('d-geo') || document.getElementById('dgeo');  
  var sgeo = document.getElementById('s-geo') || document.getElementById('sgeo');  
  if (dgeo) dgeo.className = 'dot b';  
  if (sgeo) sgeo.textContent = 'GPU GRID ' + W + '\xd7' + H;  
  var hint = document.getElementById('hint');  
  if (hint) hint.style.display = 'none';  
}  
  
// ── ORBIT ──  
var isDrag = false, pm = {x:0, y:0};  
var sp = {t:0.3, p:1.2, r:3.5}, tg = {t:0.3, p:1.2, r:3.5};  
  
function setupOrbit() {  
  var c = renderer.domElement;  
  c.addEventListener('mousedown', function(e) { isDrag=true; pm={x:e.clientX,y:e.clientY}; });  
  c.addEventListener('mousemove', function(e) {  
    if (!isDrag) return;  
    tg.t -= (e.clientX - pm.x) * 0.006;  
    tg.p = Math.max(0.05, Math.min(Math.PI-0.05, tg.p + (e.clientY - pm.y) * 0.006));  
    pm = {x:e.clientX, y:e.clientY};  
  });  
  c.addEventListener('mouseup',    function() { isDrag = false; });  
  c.addEventListener('mouseleave', function() { isDrag = false; });  
  c.addEventListener('wheel', function(e) {  
    tg.r = Math.max(0.4, Math.min(14, tg.r + e.deltaY * 0.005));  
  }, {passive:true});  
  var lt = null;  
  c.addEventListener('touchstart',  function(e) { lt=e.touches; isDrag=true; });  
  c.addEventListener('touchmove',   function(e) {  
    if (!isDrag || !lt) return;  
    if (e.touches.length === 1) {  
      tg.t -= (e.touches[0].clientX - lt[0].clientX) * 0.006;  
      tg.p = Math.max(0.05, Math.min(Math.PI-0.05, tg.p + (e.touches[0].clientY - lt[0].clientY) * 0.006));  
    }  
    lt = e.touches;  
  });  
  c.addEventListener('touchend', function() { isDrag=false; lt=null; });  
}  
  
function camStep() {  
  sp.t += (tg.t - sp.t) * 0.1;  
  sp.p += (tg.p - sp.p) * 0.1;  
  sp.r += (tg.r - sp.r) * 0.1;  
  camera.position.set(  
    sp.r * Math.sin(sp.p) * Math.sin(sp.t),  
    sp.r * Math.cos(sp.p),  
    sp.r * Math.sin(sp.p) * Math.cos(sp.t)  
  );  
  camera.lookAt(0, 0, 0);  
}  
  
// ── ANIM LOOP — CPU does nothing except update time uniforms and camera ──  
function animLoop() {  
  requestAnimationFrame(animLoop);  
  var t   = clock.getElapsedTime();  
  var spdEl = document.getElementById('aSpd'); var spd = spdEl ? parseFloat(spdEl.value) : 0.5;  
  var msEl  = document.getElementById('fMorph'); var ms  = msEl  ? parseFloat(msEl.value)  : 0;  
  
  if (ms > 0) {  
    fracTime += 0.016 * ms;  
    U.uFracTime.value = fracTime;  
  }  
  
  var obj = mesh || pts;  
  if (obj) {  
    if (animMode === 1) obj.rotation.y = t * spd * 0.7;  
    if (animMode === 2) { var s=1+Math.sin(t*spd*2)*0.05; obj.scale.set(s,s,s); }  
    if (animMode === 3) { var s=1+Math.sin(t*spd)*0.08;   obj.scale.set(s,s,s); }  
  }  
  
  camStep();  
  renderer.render(scene, camera);  
}  
  
// ── FILE LOAD ──  
document.getElementById('file-input').addEventListener('change', function(e) {  
  if (e.target.files[0]) loadFile(e.target.files[0]);  
});  
var uzEl = document.getElementById('upload-zone');  
if (uzEl) {  
  uzEl.addEventListener('dragover',  function(e) { e.preventDefault(); uzEl.classList.add('drag'); });  
  uzEl.addEventListener('dragleave', function()  { uzEl.classList.remove('drag'); });  
  uzEl.addEventListener('drop', function(e) {  
    e.preventDefault(); uzEl.classList.remove('drag');  
    if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]);  
  });  
}  
  
function loadFile(file) {  
  if (!file.type.match(/image\/(png|jpeg)/)) return;  
  var fr = new FileReader();  
  fr.onload = function(ev) {  
    var img = new Image();  
    img.onload = function() {  
      var th = document.getElementById('thumb');  
      var tw = document.getElementById('thumb-wrap');  
      if (th) th.src = ev.target.result;  
      if (tw) tw.style.display = 'block';  
      if (imgTex) imgTex.dispose();  
      imgTex = new THREE.Texture(img);  
      imgTex.needsUpdate = true;  
      U.uImgTex.value = imgTex;  
      U.uHasImg.value = 1.0;  
      U.uAspect.value = img.height / img.width;  
      var d = document.getElementById('d-src'); if (d) d.className = 'dot y';  
      var s = document.getElementById('s-src'); if (s) s.textContent = 'IMG ' + img.width + '\xd7' + img.height;  
    };  
    img.src = ev.target.result;  
  };  
  fr.readAsDataURL(file);  
}  
  
function loadAndBind() {  
  if (srcMode === 1 && U.uHasImg.value < 0.5) setMode(0);  
  if (srcMode === 2 && U.uHasImg.value < 0.5) setMode(0);  
  buildGrid();  
  var d = document.getElementById('d-src'); if (d) d.className = 'dot v';  
  var s = document.getElementById('s-src'); if (s) s.textContent = ['FRACTAL','IMAGE','BLEND'][srcMode];  
}  
  
// ── CONTROLS ──  
var MODE_NOTES = [  
  'Fractal field generates depth and color. GPU computed.',  
  'Image uploads once as GPU texture. Flat projection, no depth.',  
  'Fractal depth distorts image texture. Upload image first.'  
];  
  
function setMode(m) {  
  srcMode = m;  
  U.uSrcMode.value = m;  
  document.getElementById('tab-frac').className  = 'tab' + (m===0 ? ' av' : '');  
  document.getElementById('tab-img').className   = 'tab' + (m===1 ? ' ay' : '');  
  document.getElementById('tab-blend').className = 'tab' + (m===2 ? ' ab' : '');  
  document.getElementById('tab-note').textContent = MODE_NOTES[m];  
}  
  
function setFrac(f, btn) {  
  fracType = f;  
  U.uFracType.value = f;  
  document.querySelectorAll('.fc').forEach(function(b) { b.classList.remove('on'); });  
  btn.classList.add('on');  
}  
  
var PROJ_NAMES = ['PLANAR','POLAR','SPHERICAL','TOROIDAL'];  
var PROJ_CLS   = ['a-y','a-o','a-b','a-g'];  
var PROJ_PCLS  = ['py','po','pb','pg'];  
  
function setProj(p) {  
  projMode = p;  
  U.uProjMode.value = p;  
  [0,1,2,3].forEach(function(k) {  
    document.getElementById('pc-' + k).className = 'pcard' + (p===k ? ' '+PROJ_CLS[k] : '');  
  });  
  document.getElementById('sub-polar').className  = 'sub' + (p===1 ? ' show' : '');  
  document.getElementById('sub-sphere').className = 'sub' + (p===2 ? ' show' : '');  
  document.getElementById('sub-torus').className  = 'sub' + (p===3 ? ' show' : '');  
  var pill = document.getElementById('pill');  
  pill.className   = PROJ_PCLS[p];  
  pill.textContent = PROJ_NAMES[p];  
  tg.r = [3.5, 3.0, 5.0, 5.0][p];  
}  
  
function setPolarSub(s, btn) {  
  polarSub = s;  
  U.uPolarSub.value = s;  
  document.querySelectorAll('[id^="pd-"]').forEach(function(b) { b.className='btn'; });  
  btn.className = 'btn oo';  
}  
  
function setSphereSub(s, btn) {  
  sphereSub = s;  
  U.uSphereSub.value = s;  
  document.querySelectorAll('[id^="ps-"]').forEach(function(b) { b.className='btn'; });  
  btn.className = 'btn ob';  
}  
  
function setRenderMode(r, btn) {  
  renderMode = r;  
  document.querySelectorAll('[id^="rm-"]').forEach(function(b) { b.className='btn'; });  
  btn.className = 'btn oy';  
  buildGrid();  
}  
  
function setColorMode(c, btn) {  
  colorMode = c;  
  U.uColorMode.value = c;  
  [0,1,2,3].forEach(function(k) {  
    document.getElementById('cm-' + k).className = 'btn' + (c===k ? ' ov' : '');  
  });  
}  
  
function setTint(hex, el) {  
  tintRGB.set(hex);  
  U.uTint.value = tintRGB.clone();  
  document.getElementById('custom-color').value = hex;  
  document.querySelectorAll('.sw').forEach(function(s) { s.classList.remove('on'); });  
  if (el) el.classList.add('on');  
}  
  
function setAnim(a, btn) {  
  animMode = a;  
  btn.parentElement.querySelectorAll('.btn').forEach(function(b) { b.className='btn'; });  
  btn.className = 'btn oy';  
  var obj = mesh || pts;  
  if (obj) { obj.rotation.y = 0; obj.scale.set(1,1,1); }  
}  
  
function setMat(m, btn) {  
  U.uMatMode.value = m;  
  [0,1,2,3,4].forEach(function(k) {  
    var el = document.getElementById('mat-' + k);  
    if (el) el.className = 'btn' + (k===m ? ' oy' : '');  
  });  
  // Auto-set sensible defaults per material  
  if (m===1) { S('uMetalness',0.9); S('uRoughness',0.2); document.getElementById('mMetal').value=0.9; document.getElementById('mRough').value=0.2; sv('v-metal',document.getElementById('mMetal')); sv('v-rough',document.getElementById('mRough')); }  
  if (m===2) { S('uGlassAlpha',0.75); S('uRoughness',0.15); document.getElementById('mGlass').value=0.75; sv('v-glass',document.getElementById('mGlass')); }  
  if (m===3) { S('uMetalness',1.0); S('uRoughness',0.05); document.getElementById('mMetal').value=1.0; document.getElementById('mRough').value=0.05; sv('v-metal',document.getElementById('mMetal')); sv('v-rough',document.getElementById('mRough')); }  
  if (m===4) { S('uGlowStr',0.8); document.getElementById('mGlow').value=0.8; sv('v-glow',document.getElementById('mGlow')); }  
}  
  
function toggleMirrorX(btn) {  
  var cur = U.uImgMirrorX.value > 0.5;  
  S('uImgMirrorX', cur ? 0.0 : 1.0);  
  btn.className = 'btn' + (cur ? '' : ' ob');  
}  
  
function toggleMirrorY(btn) {  
  var cur = U.uImgMirrorY.value > 0.5;  
  S('uImgMirrorY', cur ? 0.0 : 1.0);  
  btn.className = 'btn' + (cur ? '' : ' ob');  
}  
  
function resetImgControls() {  
  var defaults = {  
    iZoom:1.0, iPanX:0.0, iPanY:0.0, iRot:0.0,  
    iDepStr:0.5, iEdge:0.4, iBright:1.0, iContrast:1.0, iSat:1.0  
  };  
  var umap = {  
    iZoom:'uImgZoom', iPanX:'uImgPanX', iPanY:'uImgPanY', iRot:'uImgRot',  
    iDepStr:'uImgDepthStr', iEdge:'uImgEdge', iBright:'uImgBright',  
    iContrast:'uImgContrast', iSat:'uImgSat'  
  };  
  var vmap = {  
    iZoom:'v-iz', iPanX:'v-ipx', iPanY:'v-ipy', iRot:'v-irot',  
    iDepStr:'v-ids', iEdge:'v-iedge', iBright:'v-ibr', iContrast:'v-icon', iSat:'v-isat'  
  };  
  Object.keys(defaults).forEach(function(id) {  
    var el = document.getElementById(id);  
    if (el) { el.value = defaults[id]; sv(vmap[id], el); }  
    S(umap[id], defaults[id]);  
  });  
  S('uImgMirrorX', 0.0); S('uImgMirrorY', 0.0);  
  document.getElementById('iflipx').className = 'btn';  
  document.getElementById('iflipy').className = 'btn';  
}  
  
// ── RANDOMIZE ──  
function randomize() {  
  fracType = Math.floor(Math.random() * 12);  
  document.querySelectorAll('.fc').forEach(function(b, i) {  
    b.classList.toggle('on', i === fracType);  
  });  
  U.uFracType.value = fracType;  
  
  function rSet(id, uname, mn, mx, dec) {  
    var v = mn + Math.random() * (mx - mn);  
    var el = document.getElementById(id);  
    if (el) { el.value = v.toFixed(dec !== undefined ? dec : 2); }  
    S(uname, v);  
    return v;  
  }  
  
  rSet('fPow',  'uPow',   1.5, 6.0);  
  rSet('fJx',   'uJx',   -1.5, 1.5);  
  rSet('fJy',   'uJy',   -1.5, 1.5);  
  rSet('fZoom', 'uFZoom', 0.2, 5.0);  
  rSet('fPanX', 'uFPanX',-1.0, 1.0);  
  rSet('fPanY', 'uFPanY',-1.0, 1.0);  
  rSet('fCpal', 'uCpal',  0.5, 5.0);  
  rSet('fCoff', 'uCoff',  0.0, 1.0);  
  
  var kal = Math.floor(1 + Math.random() * 5);  
  document.getElementById('fKal').value = kal;  
  S('uKal', kal);  
  sv('v-kl', document.getElementById('fKal'), 0);  
  
  sv('v-pw',  document.getElementById('fPow'));  
  sv('v-jx',  document.getElementById('fJx'));  
  sv('v-jy',  document.getElementById('fJy'));  
  sv('v-fz',  document.getElementById('fZoom'));  
  sv('v-fx',  document.getElementById('fPanX'));  
  sv('v-fy',  document.getElementById('fPanY'));  
  sv('v-cp',  document.getElementById('fCpal'));  
  sv('v-co',  document.getElementById('fCoff'));  
  
  setProj(Math.floor(Math.random() * 4));  
}  
  
// ── EXPORT ──  
function exportPNG() {  
  renderer.render(scene, camera);  
  var a = document.createElement('a');  
  a.download = 'uuon-v6-' + Date.now() + '.png';  
  a.href = renderer.domElement.toDataURL('image/png');  
  a.click();  
}  
  
function exportProject() {  
  var proj = {  
    meta: {  
      tool: 'DEPTH ENGINE v6.1 GPU', version: '6.1',  
      author: 'Phillip A. Ruiz III', organization: 'UUON Foundation Inc.',  
      contact: 'phi1@uuonfoundation.com', website: 'www.uuonfoundation.com',  
      timestamp: new Date().toISOString()  
    },  
    fractal: {  
      system: fracType, power: U.uPow.value,  
      juliaCx: U.uJx.value, juliaCy: U.uJy.value,  
      iterations: U.uIter.value, zoom: U.uFZoom.value,  
      panX: U.uFPanX.value, panY: U.uFPanY.value,  
      morphSpeed: parseFloat(document.getElementById('fMorph').value),  
      colorPalette: U.uCpal.value, colorOffset: U.uCoff.value,  
      kaleidoscope: U.uKal.value, fractalTime: fracTime  
    },  
    projection: {  
      mode: projMode, polarSub: polarSub, sphereSub: sphereSub,  
      torusMajorR: U.uTorusR.value, torusTubeR: U.uTubeR.value  
    },  
    depth: {  
      scale: U.uDepthScale.value, radial: U.uRadial.value,  
      centerX: U.uCenterX.value, centerY: U.uCenterY.value,  
      baseRadius: U.uBaseR.value, invert: U.uInvert.value > 0,  
      warp: U.uWarpOn.value > 0, warpStrength: U.uWarpStr.value  
    },  
    render: {  
      mode: renderMode,  
      resolution: parseInt(document.getElementById('gRes').value),  
      pointSize: U.uPtSize.value  
    },  
    color: { mode: colorMode, tint: '#' + tintRGB.getHexString(), source: srcMode },  
    animation: { mode: animMode, speed: parseFloat(document.getElementById('aSpd').value) }  
  };  
  
  var blob = new Blob([JSON.stringify(proj, null, 2)], {type:'application/json'});  
  var url  = URL.createObjectURL(blob);  
  var a    = document.createElement('a');  
  a.download = 'uuon-v6-' + Date.now() + '.json';  
  a.href = url;  
  document.body.appendChild(a);  
  a.click();  
  document.body.removeChild(a);  
  URL.revokeObjectURL(url);  
  
  var btn  = document.getElementById('ex-json');  
  var orig = btn.textContent;  
  btn.textContent = '\u2713 SAVED';  
  setTimeout(function() { btn.textContent = orig; }, 1200);  
}  
  
// ════════════════════════════════════════════════════════════════════  
//  RIGHT-CLICK EXPORT SYSTEM  
//  
//  How high-res export works:  
//  1. Save current renderer viewport size  
//  2. Temporarily resize renderer to target resolution (e.g. 7680×4320)  
//     Three.js resizes the WebGL framebuffer — same GPU, same scene  
//  3. Update camera aspect to match new dimensions  
//  4. Render one frame at full resolution — GPU handles it natively  
//  5. Call renderer.domElement.toDataURL('image/png') — reads the full  
//     framebuffer, not the screen — gets full resolution pixels  
//  6. Restore renderer and camera to original viewport size  
//  7. Trigger PNG download  
//  
//  The canvas on screen never changes size visibly.  
//  The entire operation takes ~100-500ms depending on resolution and GPU.  
// ════════════════════════════════════════════════════════════════════  
  
var ctxMenu      = document.getElementById('ctx-menu');  
var ctxProg      = document.getElementById('ctx-progress');  
var ctxProgFill  = document.getElementById('ctx-prog-fill');  
var ctxProgLabel = document.getElementById('ctx-prog-label');  
var ctxExporting = false;  
  
// Show menu on right-click anywhere on the 3D canvas  
document.getElementById('cv').addEventListener('contextmenu', function(e) {  
  e.preventDefault();  
  if (ctxExporting) return;  
  showCtxMenu(e.clientX, e.clientY);  
});  
  
// Also allow right-click on the canvas wrap  
document.getElementById('cv-wrap').addEventListener('contextmenu', function(e) {  
  e.preventDefault();  
  if (ctxExporting) return;  
  showCtxMenu(e.clientX, e.clientY);  
});  
  
// Close menu on any click outside  
document.addEventListener('click', function(e) {  
  if (!ctxMenu.contains(e.target)) closeCtxMenu();  
});  
  
// Close on Escape  
document.addEventListener('keydown', function(e) {  
  if (e.key === 'Escape') closeCtxMenu();  
});  
  
function showCtxMenu(x, y) {  
  ctxMenu.classList.add('show');  
  ctxProg.classList.remove('show');  
  ctxProgFill.style.width = '0%';  
  
  // Keep menu inside viewport  
  var mw = 224, mh = 360;  
  var vw = window.innerWidth, vh = window.innerHeight;  
  var left = (x + mw > vw) ? vw - mw - 8 : x;  
  var top  = (y + mh > vh) ? vh - mh - 8 : y;  
  ctxMenu.style.left = left + 'px';  
  ctxMenu.style.top  = top  + 'px';  
}  
  
function closeCtxMenu() {  
  if (!ctxExporting) ctxMenu.classList.remove('show');  
}  
  
function ctxSetProgress(pct, label) {  
  ctxProgFill.style.width = pct + '%';  
  if (label) ctxProgLabel.textContent = label;  
}  
  
function ctxExport(w, h, label) {  
  exportAtResolution(w, h, label);  
}  
  
function ctxExportSquare(size) {  
  exportAtResolution(size, size, size + '\xd7' + size);  
}  
  
function ctxExportProject() {  
  closeCtxMenu();  
  exportProject();  
}  
  
function exportAtResolution(targetW, targetH, label) {  
  if (ctxExporting) return;  
  ctxExporting = true;  
  
  // Show progress inside menu  
  ctxProg.classList.add('show');  
  ctxProgLabel.textContent = 'PREPARING ' + label + '\u2026';  
  ctxProgFill.style.width = '10%';  
  
  // Disable menu items visually  
  var items = ctxMenu.querySelectorAll('.ctx-item');  
  items.forEach(function(el) { el.classList.add('exporting'); });  
  
  // Use setTimeout to allow the UI to repaint before heavy GPU work  
  setTimeout(function() {  
  
    ctxSetProgress(25, 'RESIZING FRAMEBUFFER\u2026');  
  
    // Save current state  
    var wp        = document.getElementById('cv-wrap');  
    var origW     = wp.clientWidth;  
    var origH     = wp.clientHeight;  
    var origAsp   = camera.aspect;  
    var origPR    = renderer.getPixelRatio();  
  
    try {  
      // Step 1: set pixel ratio to 1 for export — we want exact pixel count  
      renderer.setPixelRatio(1);  
  
      // Step 2: resize renderer to target resolution  
      // This changes the WebGL framebuffer — canvas CSS size unchanged  
      renderer.setSize(targetW, targetH, false);  
      // false = don't update canvas CSS style, keep visual size the same  
  
      // Step 3: update camera aspect for new dimensions  
      camera.aspect = targetW / targetH;  
      camera.updateProjectionMatrix();  
  
      ctxSetProgress(55, 'RENDERING ' + label + '\u2026');  
  
      // Step 4: render one full-resolution frame  
      renderer.render(scene, camera);  
  
      ctxSetProgress(80, 'ENCODING PNG\u2026');  
  
      // Step 5: read the full framebuffer as PNG  
      // toDataURL reads from the WebGL buffer, not the screen  
      var dataURL = renderer.domElement.toDataURL('image/png');  
  
      ctxSetProgress(95, 'DOWNLOADING\u2026');  
  
      // Step 6: trigger download  
      var a = document.createElement('a');  
      a.download = 'uuon-depth-' + label.toLowerCase().replace(/\s/g,'-') + '-' + targetW + 'x' + targetH + '-' + Date.now() + '.png';  
      a.href = dataURL;  
      document.body.appendChild(a);  
      a.click();  
      document.body.removeChild(a);  
  
    } catch (err) {  
      console.error('Export error:', err);  
      ctxProgLabel.textContent = 'ERROR — try lower resolution';  
      ctxProgFill.style.background = '#ff4fa8';  
    } finally {  
      // Step 7: restore renderer and camera to viewport size  
      renderer.setPixelRatio(origPR);  
      renderer.setSize(origW, origH, false);  
      camera.aspect = origAsp;  
      camera.updateProjectionMatrix();  
  
      ctxSetProgress(100, '\u2713 ' + label + ' SAVED');  
  
      // Re-enable menu items  
      items.forEach(function(el) { el.classList.remove('exporting'); });  
      ctxExporting = false;  
  
      // Close menu after short delay  
      setTimeout(function() {  
        closeCtxMenu();  
        ctxProg.classList.remove('show');  
        ctxProgFill.style.width = '0%';  
        ctxProgFill.style.background = '';  
      }, 1400);  
    }  
  
  }, 60);  
}  
  
// ── HELPER: update display value next to slider ──  
function sv(id, el, dec) {  
  var d = dec !== undefined ? dec : parseFloat(el.step) < 1 ? 2 : 0;  
  var span = document.getElementById(id);  
  if (span) span.textContent = parseFloat(el.value).toFixed(d);  
}  
  
// ── BOOT ──  
initThree();  
// Auto-render fractal on load — no button press required  
setTimeout(function() { loadAndBind(); }, 100);  
</script>  
  
</body>  
</html>  
