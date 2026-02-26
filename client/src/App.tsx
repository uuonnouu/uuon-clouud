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
    <Switch>
      <Route path="/" component={ClouudTerminal} />
      <Route path="/legal" component={LegalPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <SecurityGate>
          <Router />
        </SecurityGate>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
