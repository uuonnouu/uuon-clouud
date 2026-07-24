import { useState, useRef, useEffect, useCallback } from "react";

function U(y,h,lam){return y*(1+lam*h);}
function gammaH(r,tf,sig,nodes,alp){
  const num=Math.exp(r)*tf;let den=0;
  for(const n of nodes)den+=U(n.yVal,n.h,n.lambda)*Math.pow(1+n.depth,alp);
  return den===0?0:num/(sig*den);
}
function cross(a,b){return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];}
function vLen(v){return Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);}
function norm(v){const l=vLen(v);return l>1e-4?[v[0]/l,v[1]/l,v[2]/l]:[0,1,0];}

function genBranch(d,maxD,bf,pos,dir,len,pIdx,nodes,edges){
  const h=d/Math.max(maxD,1),idx=nodes.length;
  nodes.push({x:pos[0],y:pos[1],z:pos[2],depth:d,h,yVal:0.3+Math.random()*0.7,lambda:0,idx,children:[],parent:pIdx});
  if(pIdx>=0){edges.push([pIdx,idx]);nodes[pIdx].children.push(idx);}
  if(d<maxD){
    const up=Math.abs(dir[1])>0.99?[1,0,0]:[0,1,0];
    const r=norm(cross(dir,up)),u=norm(cross(r,dir));
    for(let b=0;b<bf;b++){
      const a=(b/bf)*Math.PI*2+d*0.9+Math.random()*0.3,sp=0.45+Math.random()*0.25;
      const nd=norm([dir[0]+r[0]*Math.cos(a)*sp+u[0]*Math.sin(a)*sp,dir[1]+r[1]*Math.cos(a)*sp+u[1]*Math.sin(a)*sp,dir[2]+r[2]*Math.cos(a)*sp+u[2]*Math.sin(a)*sp]);
      const dc=0.54+Math.random()*0.14;
      genBranch(d+1,maxD,bf,[pos[0]+nd[0]*len*dc,pos[1]+nd[1]*len*dc,pos[2]+nd[2]*len*dc],nd,len*dc,idx,nodes,edges);
    }
  }
}

function sphereDirs(n){
  const d=[],g=Math.PI*(3-Math.sqrt(5));
  for(let i=0;i<n;i++){const y=1-(i/(n-1))*2,r=Math.sqrt(1-y*y),t=g*i;d.push(norm([Math.cos(t)*r,y,Math.sin(t)*r]));}
  return d;
}

function genRadialTree(maxD,bf,baseLen,trunks){
  const nodes=[],edges=[];
  nodes.push({x:0,y:0,z:0,depth:0,h:0,yVal:1,lambda:0,idx:0,children:[],parent:-1});
  for(const dir of sphereDirs(trunks))genBranch(1,maxD,bf,[dir[0]*baseLen*0.15,dir[1]*baseLen*0.15,dir[2]*baseLen*0.15],dir,baseLen,0,nodes,edges);
  return{nodes,edges};
}

function rotY(p,a){const c=Math.cos(a),s=Math.sin(a);return[p[0]*c+p[2]*s,p[1],-p[0]*s+p[2]*c];}
function rotX(p,a){const c=Math.cos(a),s=Math.sin(a);return[p[0],p[1]*c-p[2]*s,p[1]*s+p[2]*c];}
function proj(p,fov,w,h){const d=fov/(fov+p[2]);return{x:w/2+p[0]*d,y:h/2+p[1]*d,z:p[2],s:d};}

const TEAL="#00E5CC",GOLD="#C9A84C",VIOLET="#7B5EA7",VOID="#04080f";
function hexToRgb(hex){return{r:parseInt(hex.slice(1,3),16),g:parseInt(hex.slice(3,5),16),b:parseInt(hex.slice(5,7),16)};}
const T=hexToRgb(TEAL),G=hexToRgb(GOLD),V=hexToRgb(VIOLET);
function lerpColor(c1,c2,t){return{r:Math.floor(c1.r+(c2.r-c1.r)*t),g:Math.floor(c1.g+(c2.g-c1.g)*t),b:Math.floor(c1.b+(c2.b-c1.b)*t)};}

class Signal{
  constructor(f,t,spd,int,bull){this.from=f;this.to=t;this.t=0;this.speed=spd;this.intensity=int;this.alive=true;this.bull=bull;}
  update(dt){this.t+=dt*this.speed;if(this.t>=1)this.alive=false;}
}

function createMarketSim(){
  let price=67500+Math.random()*3000,vol24h=28e9+Math.random()*8e9,momentum=0;
  return{tick(){
    momentum=momentum*0.97+(Math.random()-0.495)*0.03;
    const shock=Math.random()<0.02?(Math.random()-0.5)*800:0;
    price=Math.max(10000,price*(1+momentum*0.001)+shock);
    const tradeSize=Math.exp(Math.random()*4)*50;
    const tradesPerSec=3+Math.random()*12+(Math.abs(momentum)>0.01?15:0);
    vol24h=vol24h*0.9999+tradeSize*tradesPerSec*86400*0.0001;
    return{price,change24h:momentum*100,vol24h,tradeSize,tradesPerSec,velocity:momentum,live:false};
  }};
}

// ─── Toggle Switch ───────────────────────────────────────────
function Toggle({on,onToggle,label}){
  return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
      <span style={{color:"#999",fontSize:13,fontFamily:"'Share Tech Mono',monospace"}}>{label}</span>
      <div onClick={onToggle} style={{
        width:44,height:24,borderRadius:12,cursor:"pointer",position:"relative",
        background:on?"rgba(0,229,204,0.25)":"rgba(255,255,255,0.06)",
        border:on?`1px solid ${TEAL}`:"1px solid #333",transition:"all 0.25s",
      }}>
        <div style={{
          width:18,height:18,borderRadius:9,position:"absolute",top:2,
          left:on?23:3,transition:"left 0.25s",
          background:on?TEAL:"#555",
          boxShadow:on?`0 0 8px ${TEAL}`:"none",
        }}/>
      </div>
    </div>
  );
}

export default function CLOUUDBrain(){
  const canvasRef=useRef(null),animRef=useRef(null);
  const[seed,setSeed]=useState(0);
  const[params,setParams]=useState({
    r:5.1,thetaF:5,sigma:0.1,lambda:0.2,alpha:3.5,
    maxDepth:6,branchFactor:3,animate:true,pulseSpeed:1,
    fireRate:1,signalSpeed:6,decay:1,trunks:22,
  });
  const cam=useRef({rx:0,ry:0,zm:2,fov:500});
  const dragR=useRef({on:false,lx:0,ly:0});
  const treeRef=useRef({nodes:[],edges:[]});
  const sz=useRef({w:800,h:600});
  const sigs=useRef([]);
  const nrg=useRef([]);
  const lt=useRef(0);
  const set=(k,v)=>setParams(p=>({...p,[k]:v}));

  const market=useRef({price:0,change24h:0,vol24h:0,tradeSize:0,tradesPerSec:0,velocity:0,live:false,history:[]});
  const simRef=useRef(createMarketSim());

  const fetchMarket=useCallback(async()=>{
    try{
      const r=await fetch("https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT");
      if(!r.ok)throw new Error();
      const d=await r.json();
      const price=parseFloat(d.lastPrice),prev=market.current.price||price;
      market.current={price,change24h:parseFloat(d.priceChangePercent),vol24h:parseFloat(d.quoteVolume),
        tradeSize:parseFloat(d.quoteVolume)/Math.max(1,parseInt(d.count)),
        tradesPerSec:parseInt(d.count)/86400,velocity:(price-prev)/prev,live:true,
        history:[...market.current.history.slice(-89),{price,t:Date.now()}]};
    }catch{
      const d=simRef.current.tick();
      market.current={...d,history:[...market.current.history.slice(-89),{price:d.price,t:Date.now()}]};
    }
  },[]);

  useEffect(()=>{fetchMarket();const iv=setInterval(fetchMarket,5000);return()=>clearInterval(iv);},[fetchMarket]);
  useEffect(()=>{
    if(market.current.live)return;
    const iv=setInterval(()=>{const d=simRef.current.tick();market.current={...d,history:[...market.current.history.slice(-89),{price:d.price,t:Date.now()}]};},800);
    return()=>clearInterval(iv);
  },[]);

  const rebuild=useCallback(()=>{
    const{nodes,edges}=genRadialTree(params.maxDepth,params.branchFactor,150,params.trunks);
    nodes.forEach(n=>{n.lambda=params.lambda;});
    treeRef.current={nodes,edges};nrg.current=new Float32Array(nodes.length);sigs.current=[];
  },[params.maxDepth,params.branchFactor,params.lambda,params.trunks,seed]);
  useEffect(()=>{rebuild();},[rebuild]);

  const onPD=e=>{dragR.current={on:true,lx:e.clientX,ly:e.clientY};e.currentTarget.setPointerCapture(e.pointerId);};
  const onPM=e=>{if(!dragR.current.on)return;cam.current.ry+=(e.clientX-dragR.current.lx)*0.006;cam.current.rx=Math.max(-1.4,Math.min(1.4,cam.current.rx+(e.clientY-dragR.current.ly)*0.006));dragR.current.lx=e.clientX;dragR.current.ly=e.clientY;};
  const onPU=e=>{dragR.current.on=false;e.currentTarget.releasePointerCapture(e.pointerId);};
  const onW=useCallback(e=>{e.preventDefault();cam.current.zm=Math.max(0.3,Math.min(16,cam.current.zm*(1-e.deltaY*0.001)));},[]);

  const[clock,setClock]=useState({time:"",date:"",vps:"0"});
  useEffect(()=>{
    const iv=setInterval(()=>{
      const now=new Date(),vps=market.current.vol24h/86400;
      setClock({time:now.toLocaleTimeString("en-US",{hour12:false}),
        date:now.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),
        vps:vps>1e6?(vps/1e6).toFixed(1)+"M":vps>1e3?(vps/1e3).toFixed(0)+"K":vps.toFixed(0)});
    },200);
    return()=>clearInterval(iv);
  },[]);

  const draw=useCallback(time=>{
    const canvas=canvasRef.current;
    if(!canvas){animRef.current=requestAnimationFrame(draw);return;}
    const ctx=canvas.getContext("2d"),W=sz.current.w,H=sz.current.h;
    const dt=Math.min((time-(lt.current||time))/1000,0.05);lt.current=time;
    ctx.fillStyle=VOID;ctx.fillRect(0,0,W,H);
    const{nodes,edges}=treeRef.current;
    if(!nodes.length){animRef.current=requestAnimationFrame(draw);return;}
    nodes.forEach(n=>{n.lambda=params.lambda;});
    const t=params.animate?time*0.001*params.pulseSpeed:0;
    const rAnim=params.r+(params.animate?Math.sin(t*0.7)*0.3:0);
    const c=cam.current,energy=nrg.current,sg=sigs.current;
    const m=market.current;
    const bullish=(m.velocity||0)>=0;
    const sigColor=bullish?T:V;

    if(params.animate&&m.price>0){
      const absVel=Math.abs(m.velocity||0),volNorm=Math.min(1,m.tradesPerSec/20);
      const marketFire=(params.fireRate*0.5+volNorm*0.5+absVel*50)*dt;
      for(let i=0;i<nodes.length;i++){
        if(Math.random()<marketFire*0.015){
          const trI=0.3+volNorm*0.5+absVel*30;
          energy[i]=Math.min(energy[i]+Math.min(trI,1),1);
          if(bullish){for(const ch of nodes[i].children)sg.push(new Signal(i,ch,params.signalSpeed+volNorm*2,Math.min(trI,0.9),true));}
          else{if(nodes[i].parent>=0)sg.push(new Signal(i,nodes[i].parent,params.signalSpeed+volNorm*1.5,Math.min(trI,0.8),false));
            if(Math.random()<0.3)for(const ch of nodes[i].children)sg.push(new Signal(i,ch,params.signalSpeed*0.6,trI*0.4,false));}
        }
      }
      if(absVel>0.005&&Math.random()<absVel*4*dt){
        energy[0]=1;for(const ch of nodes[0].children)sg.push(new Signal(0,ch,params.signalSpeed*1.5,0.95,bullish));
      }
    }

    for(let s=sg.length-1;s>=0;s--){
      sg[s].update(dt);
      if(!sg[s].alive){
        const sig=sg[s];energy[sig.to]=Math.min(energy[sig.to]+sig.intensity*0.6,1);
        if(sig.intensity>0.12){
          const tgts=sig.bull?nodes[sig.to].children:(nodes[sig.to].parent>=0?[nodes[sig.to].parent]:[]).concat(nodes[sig.to].children.slice(0,1));
          for(const ch of tgts){if(ch!==undefined&&Math.random()<0.6)sg.push(new Signal(sig.to,ch,params.signalSpeed+Math.random()*0.3,sig.intensity*0.58,sig.bull));}
        }
        sg.splice(s,1);
      }
    }
    for(let i=0;i<energy.length;i++){energy[i]*=params.decay;if(energy[i]<0.004)energy[i]=0;}

    const pN=nodes.map(n=>{
      const u=U(n.yVal,n.h,n.lambda),w=u*Math.pow(1+n.depth,params.alpha);
      const lR=rAnim+(params.animate?Math.sin(t+n.depth*1.2)*0.2:0);
      return Math.min(Math.max(w===0?0:(Math.exp(lR)*params.thetaF)/(params.sigma*w*nodes.length),0.04),1);
    });

    const zm=c.zm;
    const pr=nodes.map(n=>{let p=[n.x*zm,n.y*zm,n.z*zm];p=rotX(p,c.rx);p=rotY(p,c.ry);return proj(p,c.fov,W,H);});

    const eS=edges.map(([a,b])=>({a,b,z:(pr[a].z+pr[b].z)/2})).sort((a,b)=>b.z-a.z);
    for(const{a,b}of eS){
      const pa=pr[a],pb=pr[b],ag=(pN[a]+pN[b])/2,eA=Math.max(energy[a],energy[b]);
      const dF=Math.min(1,Math.max(0.04,(pa.s+pb.s)/2));
      if(eA>0.2){
        const col=lerpColor({r:60,g:60,b:60},sigColor,eA);
        ctx.strokeStyle=`rgba(${col.r},${col.g},${col.b},${eA*0.7*dF})`;
        ctx.lineWidth=Math.max(0.4,(1-nodes[b].depth/params.maxDepth)*2.8*eA*dF);
      }else{
        const br=ag+eA*0.3,g=Math.floor(15+Math.min(br,1)*80);
        ctx.strokeStyle=`rgba(${g},${g},${g},${(0.05+Math.min(br,1)*0.35)*dF})`;
        ctx.lineWidth=Math.max(0.2,(1-nodes[b].depth/params.maxDepth)*1.8*ag*dF);
      }
      ctx.beginPath();ctx.moveTo(pa.x,pa.y);ctx.lineTo(pb.x,pb.y);ctx.stroke();
    }

    for(const sig of sg){
      const pf=pr[sig.from],pt=pr[sig.to];
      const sx=pf.x+(pt.x-pf.x)*sig.t,sy=pf.y+(pt.y-pf.y)*sig.t;
      const aS=(pf.s+pt.s)/2,rd=Math.max(0.8,2.5*sig.intensity*aS*zm*0.3);
      const col=sig.bull?T:V;
      const gl=ctx.createRadialGradient(sx,sy,0,sx,sy,rd*4);
      gl.addColorStop(0,`rgba(${col.r},${col.g},${col.b},${sig.intensity*0.5})`);
      gl.addColorStop(1,`rgba(${col.r},${col.g},${col.b},0)`);
      ctx.fillStyle=gl;ctx.beginPath();ctx.arc(sx,sy,rd*4,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=`rgba(255,255,255,${sig.intensity*0.85})`;
      ctx.beginPath();ctx.arc(sx,sy,rd,0,Math.PI*2);ctx.fill();
    }

    const nO=nodes.map((_,i)=>i).sort((a,b)=>pr[b].z-pr[a].z);
    for(const i of nO){
      const n=nodes[i],p=pr[i],g=pN[i],e=energy[i];
      const dF=Math.min(1,Math.max(0.06,p.s));
      const pulse=params.animate?1+Math.sin(t*2+n.depth*0.8+i*0.3)*0.12*g:1;
      const eB=1+e*2.5;
      const baseR=i===0?(10*p.s):((1.8+(1-n.depth/Math.max(params.maxDepth,1))*6)*p.s);
      const radius=Math.max(0.3,baseR*g*pulse*eB);
      const baseCol={r:40+Math.floor(g*120),g:40+Math.floor(g*120),b:40+Math.floor(g*120)};
      const col=e>0.05?lerpColor(baseCol,sigColor,Math.min(e*1.5,1)):baseCol;
      const alpha=(0.12+g*0.6+e*0.45)*dF;
      if((g>0.12||e>0.08)&&radius>0.8){
        const glR=radius*(3+e*3);const gl=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,glR);
        gl.addColorStop(0,`rgba(${col.r},${col.g},${col.b},${Math.min(alpha*0.22+e*0.3,0.55)})`);
        gl.addColorStop(1,`rgba(${col.r},${col.g},${col.b},0)`);
        ctx.fillStyle=gl;ctx.beginPath();ctx.arc(p.x,p.y,glR,0,Math.PI*2);ctx.fill();
      }
      ctx.fillStyle=`rgba(${col.r},${col.g},${col.b},${Math.min(alpha,1)})`;
      ctx.beginPath();ctx.arc(p.x,p.y,radius,0,Math.PI*2);ctx.fill();
      if(radius>1.3){
        const cB=e>0.3?{r:Math.min(255,col.r+80),g:Math.min(255,col.g+80),b:Math.min(255,col.b+80)}:{r:200,g:200,b:200};
        ctx.fillStyle=`rgba(${cB.r},${cB.g},${cB.b},${(g*0.35+e*0.5)*dF})`;
        ctx.beginPath();ctx.arc(p.x,p.y,radius*0.2,0,Math.PI*2);ctx.fill();
      }
    }

    // ─── HUD ─────────────────────────────────────────────────
    const gG=gammaH(rAnim,params.thetaF,params.sigma,nodes,params.alpha);
    ctx.textAlign="left";
    ctx.fillStyle=TEAL;ctx.font="600 15px 'Rajdhani','Share Tech Mono',monospace";
    ctx.fillText("CLOUUD",16,26);
    ctx.fillStyle="#444";ctx.font="10px 'Share Tech Mono',monospace";
    ctx.fillText("BRAIN  ·  HIERARCHICAL RECURSIVE TRANSFORMATION",85,26);
    ctx.fillStyle="#666";ctx.font="11px 'Share Tech Mono',monospace";
    ctx.fillText(`ΓH ${gG.toExponential(3)}   N=${nodes.length}   signals=${sg.length}`,16,46);

    const btcStr=m.price>0?`$${m.price.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`:"connecting...";
    const changeStr=m.price>0?`${m.change24h>=0?"+":""}${m.change24h.toFixed(2)}%`:"";
    const liveTag=m.live?"LIVE":"SIM";

    ctx.fillStyle=GOLD;ctx.font="600 24px 'Rajdhani','Share Tech Mono',monospace";
    ctx.fillText(btcStr,16,H-88);
    ctx.fillStyle=m.change24h>=0?TEAL:VIOLET;ctx.font="14px 'Share Tech Mono',monospace";
    ctx.fillText(`${changeStr}`,16,H-64);
    ctx.fillStyle="#555";ctx.font="11px 'Share Tech Mono',monospace";
    ctx.fillText(`${liveTag}  BTC/USDT  24h`,90,H-64);

    if(m.history.length>2){
      const hist=m.history,hW=180,hH=35,hX=16,hY=H-155;
      let mn=Infinity,mx=-Infinity;
      for(const h of hist){mn=Math.min(mn,h.price);mx=Math.max(mx,h.price);}
      const range=mx-mn||1;
      const lineCol=hist[hist.length-1].price>=hist[0].price?T:V;
      ctx.strokeStyle=`rgba(${lineCol.r},${lineCol.g},${lineCol.b},0.45)`;ctx.lineWidth=1.5;
      ctx.beginPath();
      for(let i=0;i<hist.length;i++){
        const x=hX+(i/(hist.length-1))*hW,y=hY+hH-(((hist[i].price-mn)/range)*hH);
        i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.stroke();
      const gl=ctx.createLinearGradient(0,hY,0,hY+hH);
      gl.addColorStop(0,`rgba(${lineCol.r},${lineCol.g},${lineCol.b},0.12)`);
      gl.addColorStop(1,`rgba(${lineCol.r},${lineCol.g},${lineCol.b},0)`);
      ctx.lineTo(hX+hW,hY+hH);ctx.lineTo(hX,hY+hH);ctx.closePath();
      ctx.fillStyle=gl;ctx.fill();
      const lx=hX+hW,ly=hY+hH-(((hist[hist.length-1].price-mn)/range)*hH);
      ctx.fillStyle=`rgba(${lineCol.r},${lineCol.g},${lineCol.b},0.9)`;ctx.beginPath();ctx.arc(lx,ly,3,0,Math.PI*2);ctx.fill();
    }

    ctx.textAlign="right";
    ctx.fillStyle="#fff";ctx.font="600 30px 'Rajdhani','Share Tech Mono',monospace";
    ctx.fillText(clock.time,W-20,H-72);
    ctx.fillStyle="#444";ctx.font="11px 'Share Tech Mono',monospace";
    ctx.fillText(clock.date,W-20,H-50);
    ctx.fillStyle=GOLD;ctx.font="10px 'Share Tech Mono',monospace";
    ctx.fillText(`$${clock.vps}/sec  volume throughput`,W-20,H-34);
    ctx.textAlign="left";ctx.fillStyle="#222";ctx.font="10px 'Share Tech Mono',monospace";
    ctx.fillText("drag to orbit · scroll to zoom",16,H-16);
    ctx.textAlign="right";ctx.fillStyle="#1a1a1a";ctx.font="9px 'Share Tech Mono',monospace";
    ctx.fillText("UUON FOUNDATION",W-20,H-14);

    animRef.current=requestAnimationFrame(draw);
  },[params,seed,clock]);

  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const resize=()=>{const par=canvas.parentElement;const w=par.clientWidth,h=par.clientHeight;const dpr=window.devicePixelRatio||1;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+"px";canvas.style.height=h+"px";canvas.getContext("2d").scale(dpr,dpr);sz.current={w,h};};
    resize();window.addEventListener("resize",resize);canvas.addEventListener("wheel",onW,{passive:false});
    animRef.current=requestAnimationFrame(draw);
    return()=>{cancelAnimationFrame(animRef.current);window.removeEventListener("resize",resize);canvas.removeEventListener("wheel",onW);};
  },[draw,onW]);

  const[panelOpen,setPanelOpen]=useState(true);

  const sl=(label,key,min,max,step)=>(
    <div style={{marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
        <span style={{color:"#999",fontSize:13}}>{label}</span>
        <span style={{color:TEAL,fontSize:13,fontWeight:600}}>{params[key].toFixed(step<1?2:0)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={params[key]}
        onChange={e=>set(key,parseFloat(e.target.value))}
        style={{width:"100%",accentColor:TEAL,height:4,cursor:"pointer"}}/>
    </div>
  );

  const btn={background:"rgba(4,8,15,0.94)",border:"1px solid #1a1a1a",color:"#888",padding:"6px 14px",cursor:"pointer",fontFamily:"'Share Tech Mono',monospace",fontSize:12,letterSpacing:1.5,backdropFilter:"blur(10px)"};

  return(
    <div style={{background:VOID,color:"#fff",width:"100%",height:"100vh",fontFamily:"'Share Tech Mono',monospace",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0}}>
        <canvas ref={canvasRef} onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU}
          style={{width:"100%",height:"100%",display:"block",cursor:"grab",touchAction:"none"}}/>
      </div>

      <button onClick={()=>setPanelOpen(p=>!p)} style={{...btn,position:"absolute",top:12,right:12,zIndex:10,color:TEAL,borderColor:"#1e3a35"}}>{panelOpen?"HIDE":"CTRL"}</button>
      <button onClick={()=>setSeed(s=>s+1)} style={{...btn,position:"absolute",top:12,right:panelOpen?292:80,zIndex:10,transition:"right .25s"}}>REGEN</button>

      {panelOpen&&(
        <div style={{position:"absolute",top:50,right:12,width:260,zIndex:10,background:"rgba(4,8,15,0.95)",border:"1px solid #152520",padding:"16px 16px 12px",overflowY:"auto",maxHeight:"calc(100vh - 62px)",backdropFilter:"blur(14px)"}}>

          <div style={{fontSize:11,color:TEAL,letterSpacing:2,marginBottom:12,opacity:0.7}}>MARKET DRIVE</div>
          {sl("fire rate","fireRate",0.01,1,0.01)}
          {sl("signal speed","signalSpeed",0.5,6,0.1)}
          {sl("decay","decay",0.8,1.0,0.002)}

          <div style={{borderTop:"1px solid #152520",margin:"12px 0",paddingTop:12}}>
            <div style={{fontSize:11,color:GOLD,letterSpacing:2,marginBottom:12,opacity:0.6}}>ΓH PARAMETERS</div>
            {sl("r — recursion","r",0.1,6,0.1)}
            {sl("θf — orientation","thetaF",0.01,5,0.01)}
            {sl("σ — normalize","sigma",0.1,5,0.1)}
            {sl("λ — coupling","lambda",0,3,0.05)}
            {sl("α — depth exp","alpha",0.1,5,0.1)}
          </div>

          <div style={{borderTop:"1px solid #152520",margin:"12px 0",paddingTop:12}}>
            <div style={{fontSize:11,color:VIOLET,letterSpacing:2,marginBottom:12,opacity:0.6}}>STRUCTURE</div>
            {sl("trunks","trunks",4,24,1)}
            {sl("max depth","maxDepth",2,6,1)}
            {sl("branches","branchFactor",2,4,1)}
          </div>

          <div style={{borderTop:"1px solid #152520",margin:"12px 0",paddingTop:12}}>
            <div style={{fontSize:11,color:"#555",letterSpacing:2,marginBottom:12}}>ANIMATION</div>
            <Toggle on={params.animate} onToggle={()=>set("animate",!params.animate)} label="pulse" />
            {params.animate&&sl("speed","pulseSpeed",0.1,4,0.1)}
          </div>
        </div>
      )}
    </div>
  );
}
