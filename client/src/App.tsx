import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SecurityGate } from "@/components/security-gate";
import NotFound from "@/pages/not-found";
import ClouudTerminal from "@/pages/clouud-terminal";
import LegalPage from "@/pages/legal";

function Router() {
  return (
    <SecurityGate>
      <Switch>
        <Route path="/" component={ClouudTerminal} />
        <Route path="/legal" component={LegalPage} />
        <Route component={NotFound} />
      </Switch>
    </SecurityGate>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
