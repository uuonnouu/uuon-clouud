import { Route, Switch, Link } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CLOUUDBrain from "./components/CLOUUDBrain";
import ClouudTerminal from "./pages/clouud-terminal";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={CLOUUDBrain} />
        <Route path="/terminal" component={ClouudTerminal} />
        <Route path="/chat" component={ClouudTerminal} />
        <Route>
          <div style={{ color: "#fff", background: "#000", height: "100vh",
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={{ fontFamily: "monospace", opacity: 0.6 }}>404 — no route here</div>
            <Link href="/" style={{ color: "#4ade80" }}>Brain</Link>
            <Link href="/terminal" style={{ color: "#4ade80" }}>Terminal</Link>
          </div>
        </Route>
      </Switch>
    </QueryClientProvider>
  );
}
