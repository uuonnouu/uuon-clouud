import { Switch, Route } from 'wouter';
import ClouudTerminal from './pages/clouud-terminal';
import LandingPage from './pages/LandingPage';
import MuseumPage from './pages/MuseumPage';
import ShowcasePortal from './pages/ShowcasePortal';
import BlockchainAlgorithmsPage from './pages/BlockchainAlgorithmsPage';
import OmniProofsPage from './pages/OmniProofsPage';
import Uinverse from './pages/uinverse';
import CodexPage from './pages/codex';

export default function App() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/clouud" component={ClouudTerminal} />
      <Route path="/museum" component={MuseumPage} />
      <Route path="/showcase" component={ShowcasePortal} />
      <Route path="/algorithms" component={BlockchainAlgorithmsPage} />
      <Route path="/proofs" component={OmniProofsPage} />
      <Route path="/uinverse" component={Uinverse} />
      <Route path="/codex" component={CodexPage} />
      <Route path="/dmension-mathematical-universe">
        <iframe
          src="https://distinguished-rebirth-production.up.railway.app"
          style={{ width: '100%', height: '100vh', border: 'none' }}
          title="Dmension"
        />
      </Route>
      <Route>
        <div style={{ color: '#fff', padding: '2rem' }}>404 — Not found</div>
      </Route>
    </Switch>
  );
}
