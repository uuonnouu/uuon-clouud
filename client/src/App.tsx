import { Switch, Route } from 'wouter';
import ClouudTerminal from './pages/clouud-terminal';

export default function App() {
  return (
    <Switch>
      <Route path="/" component={ClouudTerminal} />
      <Route path="/clouud" component={ClouudTerminal} />
      <Route>
        <div style={{color:'#fff',padding:'2rem'}}>404 — Not found</div>
      </Route>
    </Switch>
  );
}
