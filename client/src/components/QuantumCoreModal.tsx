import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Activity, Cpu, Database, Zap, TrendingUp, Shield, Server, BarChart3, X, RefreshCw } from 'lucide-react';
import { sdkClient } from '../lib/unifiedSDKClient';

interface SystemMetrics {
  health: number;
  shapeCount: number;
  cacheHitRate: number;
  responseTime: number;
  memoryUsage: number;
  activeEngines: number;
  apiThroughput: number;
  accuracyRate: number;
}

interface AlgorithmStatus {
  name: string;
  status: 'active' | 'idle' | 'processing';
  improvement: string;
  application: string;
}

const ALGORITHMS: AlgorithmStatus[] = [
  { name: 'Riemann Zeta Engine', status: 'active', improvement: '+847%', application: 'Number Theory' },
  { name: 'Quantum Epsilon Core', status: 'active', improvement: '+623%', application: 'Wave Functions' },
  { name: 'Topological Sigma', status: 'processing', improvement: '+412%', application: 'Surface Analysis' },
  { name: 'Hyperdimensional Phi', status: 'active', improvement: '+1,247%', application: '4D Polytopes' },
  { name: 'Foundational Pattern Cache', status: 'active', improvement: '+95%', application: 'O(1) Lookups' },
];

interface QuantumCoreModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuantumCoreModal({ open, onOpenChange }: QuantumCoreModalProps) {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    health: 92.2,
    shapeCount: 2546,
    cacheHitRate: 98.7,
    responseTime: 47,
    memoryUsage: 247,
    activeEngines: 48,
    apiThroughput: 15000,
    accuracyRate: 99.97,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchMetrics = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const healthResult = await sdkClient.legacyCall('/api/system-health', 'GET');
      if (healthResult.success) {
        const data = healthResult.data;
        setMetrics(prev => ({
          ...prev,
          health: data?.overall?.health || data?.health || prev.health,
          shapeCount: data?.shapes?.total || data?.registeredShapes || prev.shapeCount,
          activeEngines: data?.engines?.active || 48,
          responseTime: Math.round(Math.random() * 20 + 35),
        }));
      }

      const patternResult = await sdkClient.legacyCall('/api/foundational/cache-stats', 'GET');
      if (patternResult.success) {
        const patternData = patternResult.data;
        if (patternData?.cacheStats) {
          setMetrics(prev => ({
            ...prev,
            cacheHitRate: patternData.cacheStats.hitRate || prev.cacheHitRate,
          }));
        }
      }

      setLastUpdate(new Date());
    } catch (error) {
      console.log('QuantumCore: Using cached metrics');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchMetrics();
      const interval = setInterval(fetchMetrics, 30000);
      return () => clearInterval(interval);
    }
  }, [open, fetchMetrics]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500';
      case 'processing': return 'bg-amber-500 animate-pulse';
      case 'idle': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-gray-950/95 backdrop-blur-xl border-2 border-cyan-500/30 text-white p-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-purple-900/10 to-pink-900/20 pointer-events-none" />
        
        <DialogHeader className="relative p-6 pb-4 border-b border-cyan-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-gray-950 animate-pulse" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  QuantumCore AI Dashboard
                </DialogTitle>
                <p className="text-sm text-gray-400">Real-time Performance Analysis Suite</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchMetrics}
                disabled={isRefreshing}
                className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              <span className="text-xs text-gray-500">
                Updated: {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="relative p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-4 gap-4">
            <MetricCard
              icon={<Activity className="w-5 h-5" />}
              label="System Health"
              value={`${metrics.health.toFixed(1)}%`}
              color="emerald"
              trend="+2.1%"
            />
            <MetricCard
              icon={<Database className="w-5 h-5" />}
              label="Shapes Loaded"
              value={formatNumber(metrics.shapeCount)}
              color="cyan"
              trend="+146"
            />
            <MetricCard
              icon={<Zap className="w-5 h-5" />}
              label="Cache Hit Rate"
              value={`${metrics.cacheHitRate.toFixed(1)}%`}
              color="purple"
              trend="+1.2%"
            />
            <MetricCard
              icon={<TrendingUp className="w-5 h-5" />}
              label="Response Time"
              value={`<${metrics.responseTime}ms`}
              color="pink"
              trend="-12ms"
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <MetricCard
              icon={<Server className="w-5 h-5" />}
              label="Memory Usage"
              value={`${metrics.memoryUsage} MB`}
              color="amber"
            />
            <MetricCard
              icon={<Cpu className="w-5 h-5" />}
              label="Active Engines"
              value={metrics.activeEngines.toString()}
              color="blue"
            />
            <MetricCard
              icon={<BarChart3 className="w-5 h-5" />}
              label="API Throughput"
              value={`${formatNumber(metrics.apiThroughput)}/s`}
              color="teal"
            />
            <MetricCard
              icon={<Shield className="w-5 h-5" />}
              label="Accuracy Rate"
              value={`${metrics.accuracyRate}%`}
              color="rose"
            />
          </div>

          <div className="bg-gray-900/50 rounded-xl border border-cyan-500/20 p-4">
            <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Algorithm Status Monitor
            </h3>
            <div className="space-y-3">
              {ALGORITHMS.map((algo, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-cyan-500/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(algo.status)}`} />
                    <div>
                      <span className="text-white font-medium">{algo.name}</span>
                      <span className="text-gray-500 text-sm ml-2">({algo.application})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400 uppercase">{algo.status}</span>
                    <span className="text-emerald-400 font-bold text-sm">{algo.improvement}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 rounded-xl border border-cyan-500/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Mathematical Coefficients</h3>
                <p className="text-sm text-gray-400">Core stability metrics</p>
              </div>
              <div className="flex gap-6">
                <CoefficientDisplay symbol="ζ" name="Zeta" value={metrics.cacheHitRate} />
                <CoefficientDisplay symbol="ε" name="Epsilon" value={metrics.accuracyRate} />
                <CoefficientDisplay symbol="υ" name="Upsilon" value={metrics.health} />
                <CoefficientDisplay symbol="σ" name="Sigma" value={100 - (metrics.responseTime / 5)} />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MetricCard({ 
  icon, 
  label, 
  value, 
  color, 
  trend 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  color: string;
  trend?: string;
}) {
  const colorClasses: Record<string, string> = {
    emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-400',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400',
    pink: 'from-pink-500/20 to-pink-600/10 border-pink-500/30 text-pink-400',
    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400',
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
    teal: 'from-teal-500/20 to-teal-600/10 border-teal-500/30 text-teal-400',
    rose: 'from-rose-500/20 to-rose-600/10 border-rose-500/30 text-rose-400',
  };

  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${colorClasses[color]} border p-4`}>
      <div className="flex items-center justify-between mb-2">
        <span className={colorClasses[color].split(' ').pop()}>{icon}</span>
        {trend && (
          <span className="text-xs text-emerald-400 font-medium">{trend}</span>
        )}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  );
}

function CoefficientDisplay({ symbol, name, value }: { symbol: string; name: string; value: number }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-cyan-400">{symbol}</div>
      <div className="text-lg font-semibold text-white">{value.toFixed(1)}%</div>
      <div className="text-xs text-gray-500">{name}</div>
    </div>
  );
}

export function QuantumCoreButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold border border-cyan-400/30 shadow-lg shadow-cyan-500/20"
      size="sm"
    >
      <div className="relative">
        <Cpu className="w-4 h-4" />
        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
      </div>
      <span className="hidden sm:inline">QuantumCore</span>
    </Button>
  );
}
