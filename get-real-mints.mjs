import https from 'https';
const NFT = '0xa14c3015E6b9Ad30337bD72c94Dc236835f61165';
const RPC = 'https://mainnet.base.org';
const TOPIC_SINGLE = '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62';
const ZERO = '0x0000000000000000000000000000000000000000000000000000000000000000';

function rpc(method, params){
  const body = JSON.stringify({jsonrpc:'2.0',id:1,method,params});
  return new Promise((res,rej)=>{
    const req = https.request(RPC,{method:'POST',headers:{'Content-Type':'application/json'}},r=>{
      let d='';r.on('data',c=>d+=c);r.on('end',()=>res(JSON.parse(d)));
    });
    req.on('error',rej); req.write(body); req.end();
  });
}

const latest = parseInt((await rpc('eth_blockNumber',[])).result,16);
console.log('Latest block:', latest);

// scan in 10k-block windows to stay under RPC limits
const STEP = 9000;
let all = [];
for (let from = 47000000; from <= latest; from += STEP) {
  const to = Math.min(from+STEP-1, latest);
  const r = await rpc('eth_getLogs',[{
    address: NFT,
    fromBlock: '0x'+from.toString(16),
    toBlock: '0x'+to.toString(16),
    topics: [TOPIC_SINGLE]
  }]);
  if (Array.isArray(r.result) && r.result.length) all = all.concat(r.result);
  process.stdout.write('.');
}
console.log('\nTotal TransferSingle logs:', all.length);

const mints = all.filter(l=>l.topics[2]===ZERO).map(l=>({
  tokenId: BigInt(l.data.slice(0,66)).toString(),
  to: '0x'+l.topics[3].slice(26)
}));
const ids = [...new Set(mints.map(m=>m.tokenId))];
const owners = [...new Set(mints.map(m=>m.to.toLowerCase()))];
console.log('Mints (from 0x0):', mints.length);
console.log('Unique token IDs:', ids.length);
console.log('Unique owners:', owners.length);
console.log('First 20 IDs:', ids.slice(0,20).join(', '));
console.log('Owners:', owners.join(', '));
