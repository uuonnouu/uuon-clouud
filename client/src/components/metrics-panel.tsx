import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Clock, Cpu, Zap, Binary, ChevronDown, ChevronUp, Shield, Gauge, Database, Hash, Brain, AlertTriangle } from "lucide-react";

type Metrics = {
  totalRequests: number;
  totalTokensIn: number;
  totalTokensOut: number;
  totalToolCalls: number;
  totalDriftFlags: number;
  avgResponseTime: number;
  lastResponseTime: number;
  responseTimeHistory: number[];
  uptime: string;
  uptimeMs: number;
  lastRequestAt: number;
  model: string;
  temperature: number;
  maxTokens: number;
  latticePoints: number;
  savedTokens: number;
  historyWindow: number;
};

type SelfAssessmentReport = {
  avgScore: number;
  totalAssessments: number;
  totalFlags: number;
  recentFlags: string[];
  scoreHistory: number[];
  gapAnalysis: { category: string; count: number; severity: string }[];
};

function Sparkline({ data, width = 120, height = 24 }: { data: number[]; width?: number; height?: number }) {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  const lastY = height - ((data[data.length - 1] - min) / range) * (height - 4) - 2;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx={width} cy={lastY} r="2" fill="var(--color-primary)" />
    </svg>
  );
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <span className={`inline-block w-1.5 h-1.5 rounded-full ${active ? "bg-green-500 animate-pulse" : "bg-muted-foreground/30"}`} />
  );
}

export default function MetricsPanel() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [assessment, setAssessment] = useState<SelfAssessmentReport | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [tick, setTick] = useState(0);
  const prevMetrics = useRef<Metrics | null>(null);

  useEffect(() => {
    fetchMetrics();
    fetchAssessment();
    const interval = setInterval(() => {
      fetchMetrics();
      fetchAssessment();
      setTick(t => t + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  async function fetchMetrics() {
    try {
      const res = await fetch("/api/metrics");
      if (res.ok) {
        const data = await res.json();
        prevMetrics.current = metrics;
        setMetrics(data);
      }
    } catch {}
  }

  async function fetchAssessment() {
    try {
      const res = await fetch("/api/self-assessment");
      if (res.ok) {
        const data = await res.json();
        setAssessment(data);
      }
    } catch {}
  }

  if (!metrics) {
    return (
      <div className="border-t border-border px-4 py-2 text-[10px] font-mono text-muted-foreground flex items-center gap-2">
        <Activity className="w-3 h-3 animate-pulse" />
        <span className="uppercase tracking-widest">Initializing system metrics...</span>
      </div>
    );
  }

  const isActive = metrics.lastRequestAt > 0 && (Date.now() - metrics.lastRequestAt) < 30000;
  const changed = !!(prevMetrics.current && prevMetrics.current.totalRequests !== metrics.totalRequests);

  return (
    <div className="border-t border-border/50 bg-[#020810]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-1.5 text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors"
        data-testid="button-toggle-metrics"
      >
        <div className="flex items-center gap-2">
          <StatusDot active={isActive} />
          <span className="uppercase tracking-[0.2em] font-bold text-primary/80">SYS</span>
          {metrics.lastResponseTime > 0 && (
            <span className="text-muted-foreground">
              {(metrics.lastResponseTime / 1000).toFixed(1)}s
            </span>
          )}
          <span className="text-muted-foreground/50">·</span>
          <span className="text-muted-foreground">{metrics.totalRequests} req</span>
          <span className="text-muted-foreground/50">·</span>
          <span className="text-secondary/70">{metrics.savedTokens} tokens</span>
          {assessment && assessment.totalAssessments > 0 && (
            <>
              <span className="text-muted-foreground/50">·</span>
              <span style={{ color: assessment.avgScore >= 90 ? '#22c55e' : assessment.avgScore >= 70 ? '#f0b93b' : '#ef4444' }}>
                SA:{assessment.avgScore}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground/50">{metrics.uptime}</span>
          {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <MetricCard
                  icon={<Clock className="w-3 h-3" />}
                  label="Response Time"
                  value={metrics.avgResponseTime > 0 ? `${(metrics.avgResponseTime / 1000).toFixed(1)}s` : "--"}
                  sub={metrics.lastResponseTime > 0 ? `Last: ${(metrics.lastResponseTime / 1000).toFixed(1)}s` : "Awaiting first request"}
                  highlight={changed}
                  sparkline={<Sparkline data={metrics.responseTimeHistory} />}
                />
                <MetricCard
                  icon={<Cpu className="w-3 h-3" />}
                  label="Engine"
                  value={metrics.model.replace("claude-", "").split("-").slice(0, 2).join(" ")}
                  sub={`T=${metrics.temperature} · max ${metrics.maxTokens}`}
                />
                <MetricCard
                  icon={<Zap className="w-3 h-3" />}
                  label="Processing"
                  value={metrics.totalRequests.toString()}
                  sub={`${metrics.totalToolCalls} lattice calls`}
                  highlight={changed}
                />
                <MetricCard
                  icon={<Gauge className="w-3 h-3" />}
                  label="I/O Volume"
                  value={formatNum(metrics.totalTokensIn + metrics.totalTokensOut)}
                  sub={`↑${formatNum(metrics.totalTokensIn)} ↓${formatNum(metrics.totalTokensOut)}`}
                  highlight={changed}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <StatusRow icon={<Hash className="w-3 h-3" />} label="Ellomental Hash" value="12-tetrahedra · 4 cultures" />
                <StatusRow icon={<Database className="w-3 h-3" />} label="UUON Tokens" value={metrics.savedTokens.toString()} accent />
                <StatusRow icon={<Shield className="w-3 h-3" />} label="Drift Guard" value={metrics.totalDriftFlags > 0 ? `${metrics.totalDriftFlags} flagged` : "Clean"} warn={metrics.totalDriftFlags > 0} />
              </div>

              {assessment && assessment.totalAssessments > 0 && (
                <div className="border-t border-border/30 pt-2">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Brain className="w-3 h-3 text-primary/70" />
                    <span className="font-mono text-[7px] uppercase tracking-[0.15em] font-bold text-primary/70">Self-Assessment</span>
                    <span className="ml-auto font-mono text-[9px] font-bold" style={{ color: assessment.avgScore >= 90 ? '#22c55e' : assessment.avgScore >= 70 ? '#f0b93b' : '#ef4444' }}>
                      {assessment.avgScore}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                    <MetricCard
                      icon={<Brain className="w-3 h-3" />}
                      label="Avg Score"
                      value={`${assessment.avgScore}/100`}
                      sub={`${assessment.totalAssessments} responses assessed`}
                      sparkline={assessment.scoreHistory.length >= 2 ? <Sparkline data={assessment.scoreHistory} /> : undefined}
                    />
                    <MetricCard
                      icon={<AlertTriangle className="w-3 h-3" />}
                      label="Total Flags"
                      value={assessment.totalFlags.toString()}
                      sub={assessment.totalFlags === 0 ? "No issues detected" : `Across ${assessment.totalAssessments} responses`}
                    />
                    <MetricCard
                      icon={<Shield className="w-3 h-3" />}
                      label="Clean Rate"
                      value={`${Math.round(((assessment.totalAssessments - assessment.gapAnalysis.reduce((s, g) => s + g.count, 0) / Math.max(assessment.totalAssessments, 1)) / Math.max(assessment.totalAssessments, 1)) * 100)}%`}
                      sub="Responses with no flags"
                    />
                    <MetricCard
                      icon={<Gauge className="w-3 h-3" />}
                      label="Top Gap"
                      value={assessment.gapAnalysis.length > 0 ? assessment.gapAnalysis[0].category : "None"}
                      sub={assessment.gapAnalysis.length > 0 ? `${assessment.gapAnalysis[0].count}x · ${assessment.gapAnalysis[0].severity}` : "No patterns detected"}
                    />
                  </div>

                  {assessment.gapAnalysis.length > 0 && (
                    <div className="space-y-1">
                      <span className="font-mono text-[7px] uppercase tracking-[0.12em] text-muted-foreground/50">Gap Analysis</span>
                      {assessment.gapAnalysis.map((gap, i) => (
                        <div key={i} className="flex items-center gap-2 bg-[#060e1a] border border-border/30 rounded px-2 py-1">
                          <span className={`font-mono text-[8px] font-bold px-1 py-0.5 rounded ${gap.severity === "CRITICAL" ? "bg-red-500/20 text-red-400" : gap.severity === "HIGH" ? "bg-orange-500/20 text-orange-400" : gap.severity === "MODERATE" ? "bg-yellow-500/20 text-yellow-400" : "bg-blue-500/20 text-blue-400"}`}>
                            {gap.severity}
                          </span>
                          <span className="font-mono text-[9px] text-white/80 flex-1">{gap.category}</span>
                          <span className="font-mono text-[8px] text-muted-foreground">{gap.count}x</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {assessment.recentFlags.length > 0 && (
                    <div className="mt-2 space-y-0.5">
                      <span className="font-mono text-[7px] uppercase tracking-[0.12em] text-muted-foreground/50">Recent Flags</span>
                      {assessment.recentFlags.slice(0, 5).map((flag, i) => (
                        <div key={i} className="font-mono text-[8px] text-yellow-500/70 truncate" data-testid={`text-flag-${i}`}>
                          {flag}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-[8px] font-mono text-muted-foreground/40 pt-1 border-t border-border/30">
                <span className="tracking-[0.15em] uppercase">Lattice: {metrics.latticePoints}-pt · 3-tier</span>
                <span className="tracking-[0.15em] uppercase">Window: {metrics.historyWindow} msg</span>
                <span className="tracking-[0.15em] uppercase">Origin: UUON-GCENTRIC-V1</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetricCard({ icon, label, value, sub, highlight, sparkline }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
  sparkline?: React.ReactNode;
}) {
  return (
    <motion.div
      className="bg-[#060e1a] border border-border/40 rounded p-2 relative overflow-hidden"
      animate={highlight ? { borderColor: ["rgba(240,185,59,0.4)", "rgba(240,185,59,0)"] } : {}}
      transition={{ duration: 1.5 }}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5 text-primary/70">
          {icon}
          <span className="font-mono text-[7px] uppercase tracking-[0.15em] font-bold">{label}</span>
        </div>
      </div>
      <div className="font-display text-white text-sm font-bold leading-tight">{value}</div>
      <div className="font-mono text-[7px] text-muted-foreground/60 mt-0.5 truncate">{sub}</div>
      {sparkline && (
        <div className="mt-1.5 -mx-0.5">
          {sparkline}
        </div>
      )}
    </motion.div>
  );
}

function StatusRow({ icon, label, value, accent, warn }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
  warn?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 bg-[#060e1a] border border-border/30 rounded px-2 py-1.5">
      <span className={`${accent ? "text-secondary" : warn ? "text-yellow-500" : "text-primary/50"}`}>{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="font-mono text-[7px] text-muted-foreground/50 uppercase tracking-[0.12em]">{label}</div>
        <div className={`font-mono text-[9px] font-bold truncate ${accent ? "text-secondary" : warn ? "text-yellow-500" : "text-white/80"}`}>{value}</div>
      </div>
    </div>
  );
}

function formatNum(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}
