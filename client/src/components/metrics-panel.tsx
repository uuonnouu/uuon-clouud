import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Clock, Cpu, Zap, Binary, ChevronDown, ChevronUp } from "lucide-react";

type Metrics = {
  totalRequests: number;
  totalTokensIn: number;
  totalTokensOut: number;
  totalToolCalls: number;
  totalDriftFlags: number;
  avgResponseTime: number;
  lastResponseTime: number;
  uptime: string;
  uptimeMs: number;
  lastRequestAt: number;
  model: string;
  temperature: number;
  maxTokens: number;
  latticePoints: number;
  savedTokens: number;
};

export default function MetricsPanel() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  async function fetchMetrics() {
    try {
      const res = await fetch("/api/metrics");
      if (res.ok) {
        setMetrics(await res.json());
      }
    } catch {}
  }

  if (!metrics) {
    return (
      <div className="border-t border-border px-4 py-2 text-[10px] font-mono text-muted-foreground flex items-center gap-2">
        <Activity className="w-3 h-3 animate-pulse" />
        <span className="uppercase tracking-widest">Connecting to metrics...</span>
      </div>
    );
  }

  return (
    <div className="border-t border-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors"
        data-testid="button-toggle-metrics"
      >
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3" />
          <span className="uppercase tracking-widest font-bold">System Metrics</span>
        </div>
        <div className="flex items-center gap-3">
          {metrics.lastResponseTime > 0 && (
            <span className="text-primary">{(metrics.lastResponseTime / 1000).toFixed(1)}s</span>
          )}
          {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 grid grid-cols-2 md:grid-cols-4 gap-2">
              <MetricCard
                icon={<Clock className="w-3 h-3" />}
                label="Avg Response"
                value={metrics.avgResponseTime > 0 ? `${(metrics.avgResponseTime / 1000).toFixed(1)}s` : "--"}
                sub={metrics.lastResponseTime > 0 ? `Last: ${(metrics.lastResponseTime / 1000).toFixed(1)}s` : "No requests yet"}
              />
              <MetricCard
                icon={<Cpu className="w-3 h-3" />}
                label="Model"
                value={metrics.model.replace("claude-", "").replace("-", " ")}
                sub={`T=${metrics.temperature} · ${metrics.maxTokens} max`}
              />
              <MetricCard
                icon={<Zap className="w-3 h-3" />}
                label="Requests"
                value={metrics.totalRequests.toString()}
                sub={`${metrics.totalToolCalls} tool calls`}
              />
              <MetricCard
                icon={<Binary className="w-3 h-3" />}
                label="I/O"
                value={formatTokens(metrics.totalTokensIn + metrics.totalTokensOut)}
                sub={`In: ${formatTokens(metrics.totalTokensIn)} · Out: ${formatTokens(metrics.totalTokensOut)}`}
              />
            </div>
            <div className="px-4 pb-2 flex items-center justify-between text-[9px] font-mono text-muted-foreground">
              <span className="tracking-widest uppercase">Uptime: {metrics.uptime}</span>
              <span className="tracking-widest uppercase">Lattice: {metrics.latticePoints}-pt</span>
              <span className="text-secondary tracking-widest uppercase">UUON Tokens: {metrics.savedTokens}</span>
              {metrics.totalDriftFlags > 0 && (
                <span className="text-yellow-500 tracking-widest uppercase">Drift: {metrics.totalDriftFlags}</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetricCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="bg-background border border-border rounded-sm p-2">
      <div className="flex items-center gap-1.5 text-primary mb-1">
        {icon}
        <span className="font-mono text-[8px] uppercase tracking-widest font-bold">{label}</span>
      </div>
      <div className="font-display text-white text-sm font-bold">{value}</div>
      <div className="font-mono text-[8px] text-muted-foreground mt-0.5 truncate">{sub}</div>
    </div>
  );
}

function formatTokens(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}
