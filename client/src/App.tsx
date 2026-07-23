import { Switch, Route } from 'wouter';
import ClouudTerminal from './pages/clouud-terminal';

function HubPage() {
  return (
    <div style={{minHeight:'100vh',background:'#000',color:'#fff',fontFamily:'sans-serif',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'2rem'}}>
      <h1 style={{fontSize:'2rem',letterSpacing:'0.2em'}}>UUON.WORLD</h1>
      <p style={{color:'#888',fontSize:'0.9rem'}}>BY UUON FOUNDATION</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4, 1fr)',gap:'2rem',marginTop:'2rem'}}>
        {[
          {label:'APPS',href:'/clouud'},
          {label:'APIS',href:'/api/status'},
          {label:'SCIENCE',href:'/dmension-mathematical-universe'},
          {label:'HEALTH',href:'/api/health'},
          {label:'AI',href:'/clouud'},
          {label:'DEVELOPER',href:'/api/docs'},
          {label:'TOKEN',href:'https://app.uniswap.org/swap?outputCurrency=0xfb9c83432331EAf6f4a9D9488828823587d6f3da&chain=base'},
          {label:'DASHBOARD',href:'/api/status'},
        ].map(({label,href}) => (
          <a key={label} href={href} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'0.5rem',color:'#fff',textDecoration:'none',opacity:0.8}}>
            <div style={{width:48,height:48,border:'1px solid #444',borderRadius:8}} />
            <span style={{fontSize:'0.7rem',letterSpacing:'0.15em'}}>{label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Switch>
      <Route path="/" component={HubPage} />
      <Route path="/clouud" component={ClouudTerminal} />
      <Route path="/dmension-mathematical-universe">
        <iframe src="https://distinguished-rebirth-production.up.railway.app" style={{width:'100%',height:'100vh',border:'none'}} title="Dmension" />
      </Route>
      <Route>
        <div style={{color:'#fff',padding:'2rem'}}>404 — Not found</div>
      </Route>
    </Switch>
  );
}
