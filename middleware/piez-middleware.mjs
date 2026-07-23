const PIEZ='0xfb9c83432331EAf6f4a9D9488828823587d6f3da';
const PSENT='0x985A1ebac4388DFb6EB4FE1171dCa9c6a5DB9cE7';
const RPC='https://mainnet.base.org';
const GENESIS='cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04';
async function bal(wallet,contract){
  try{
    const r=await fetch(RPC,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method:'eth_call',params:[{to:contract,data:'0x70a08231000000000000000000000000'+wallet.slice(2).padStart(64,'0')},'latest']})});
    const {result}=await r.json();
    return BigInt(result||'0x0');
  }catch{return BigInt(0);}
}
function wrap(data,wallet,tier,cost){return{shape_token_standard:'0.1',genesis_anchor:GENESIS,access:{tier,cost,wallet},data};}

// ── Master key bypass — logged on every use, never silent ──────────────────
function checkMasterKey(req){
  const auth=(req.headers['authorization']||'');
  const m=auth.match(/^PSOURCE\s+(.+)$/);
  if(!m) return false;
  const provided=m[1].trim();
  const expected=process.env.PSOURCE_API_KEY;
  if(!expected){
    console.warn('[MASTER-KEY] PSOURCE_API_KEY not set in env — bypass attempted but rejected');
    return false;
  }
  if(provided!==expected) return false;
  console.log(`[MASTER-KEY] Bypass used: ${new Date().toISOString()} | route=${req.originalUrl||req.url} | ip=${req.ip||req.headers['x-forwarded-for']||'unknown'}`);
  return true;
}

export async function requirePIEZ(req,res,tier=0){
  const cost=[0.001,0.001618,0.002618,0.004236][tier]||0.001;
  if(checkMasterKey(req)){
    return{wallet:'PSOURCE-MASTER',tier,cost,wrap:(d)=>wrap(d,'PSOURCE-MASTER',tier,cost)};
  }
  const m=(req.headers['authorization']||'').match(/^PIEZ-Balance\s+(0x[a-fA-F0-9]{40})$/i);
  if(!m){res.writeHead(401);res.end(JSON.stringify({error:'PIEZ_AUTH_REQUIRED',contract:PIEZ}));return null;}
  const b=await bal(m[1],PIEZ);
  if(b<BigInt(Math.floor(cost*1e18))){res.writeHead(402);res.end(JSON.stringify({error:'INSUFFICIENT_PIEZ',contract:PIEZ}));return null;}
  return{wallet:m[1],tier,cost,wrap:(d)=>wrap(d,m[1],tier,cost)};
}
export async function requirePSENT(req,res,tier=0){
  const cost=[0.001,0.001618,0.002618,0.004236][tier]||0.001;
  if(checkMasterKey(req)){
    return{wallet:'PSOURCE-MASTER',tier,cost};
  }
  const m=(req.headers['authorization']||'').match(/^PSENT-Balance\s+(0x[a-fA-F0-9]{40})$/i);
  if(!m){res.writeHead(401);res.end(JSON.stringify({error:'PSENT_AUTH_REQUIRED',contract:PSENT}));return null;}
  const b=await bal(m[1],PSENT);
  if(b<BigInt(Math.floor(cost*1e18))){res.writeHead(402);res.end(JSON.stringify({error:'INSUFFICIENT_PSENT',contract:PSENT}));return null;}
  return{wallet:m[1],tier,cost};
}
