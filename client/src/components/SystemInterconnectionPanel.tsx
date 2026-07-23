import React, { useState, useEffect } from 'react';
import { Activity, Eye, EyeOff, Network } from 'lucide-react';
import { orchestrator } from '../lib/systemIntegrationOrchestrator';

export default function SystemInterconnectionPanel() {
  const [report, setReport] = useState('');
  const [visible, setVisible] = useState(false);
  const [systemState, setSystemState] = useState<any>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    const updateState = () => {
      setSystemState(orchestrator.getState());
      setReport(orchestrator.getSystemReport());
    };

    updateState();

    if (autoRefresh) {
      const interval = setInterval(updateState, 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        setVisible(v => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timeout = setTimeout(() => setVisible(false), 30000);
    return () => clearTimeout(timeout);
  }, [visible, systemState]);

  if (!visible) {
    return null;
  }

  const getStatusIcon = (status: boolean) => status ? '✅' : '❌';
  const getStatusColor = (status: boolean) => status ? 'text-green-400' : 'text-red-400';

  return (
    <div className="fixed bottom-4 right-4 w-[500px] max-h-[80vh] bg-black/95 border border-purple-500/50 rounded-lg shadow-2xl z-50 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Network className="w-4 h-4 text-purple-400" />
          <span className="text-white font-semibold text-sm">Δmension System Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`p-1 rounded ${autoRefresh ? 'text-green-400' : 'text-gray-400'}`}
            title="Toggle auto-refresh"
          >
            {autoRefresh ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            onClick={() => orchestrator.runSystemCheck()}
            className="text-blue-400 hover:text-blue-300 p-1 rounded"
            title="Run system check"
          >
            <Activity className="w-4 h-4" />
          </button>
          <button
            onClick={() => setVisible(false)}
            className="text-gray-400 hover:text-white text-lg"
          >
            ×
          </button>
        </div>
      </div>

      {/* Quick Status */}
      {systemState && (
        <div className="p-3 grid grid-cols-3 gap-2 text-xs border-b border-gray-700">
          <div className={`text-center p-2 rounded ${getStatusColor(systemState.backend.connected)}`}>
            <div className="font-semibold">Backend</div>
            <div>{getStatusIcon(systemState.backend.connected)}</div>
          </div>
          <div className="text-center p-2 rounded text-yellow-400">
            <div className="font-semibold">Shapes</div>
            <div>{systemState.integration.shapesImplemented}/{systemState.integration.shapesRegistered}</div>
          </div>
          <div className={`text-center p-2 rounded ${systemState.frontend.fps >= 30 ? 'text-green-400' : 'text-red-400'}`}>
            <div className="font-semibold">Performance</div>
            <div>{systemState.frontend.fps} FPS</div>
          </div>
        </div>
      )}
      

      {/* Detailed Report */}
      <div className="p-3 max-h-[400px] overflow-auto">
        <pre className="text-green-400 font-mono text-xs whitespace-pre-wrap leading-relaxed">
          {report}
        </pre>
      </div>

      {/* Actions */}
      <div className="p-3 border-t border-gray-700 flex gap-2">
        <button
          onClick={() => orchestrator.runSystemCheck()}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded text-xs transition-colors flex items-center justify-center gap-1"
        >
          <Activity className="w-3 h-3" />
          System Check
        </button>
        <button
          onClick={() => {
            const report = orchestrator.getSystemReport();
            navigator.clipboard.writeText(report);
            console.log('System report copied to clipboard');
          }}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-1 px-2 rounded text-xs transition-colors"
        >
          Copy Report
        </button>
      </div>

      {/* Help Text */}
      <div className="px-3 pb-2 text-xs text-gray-400 text-center">
        Press Ctrl+Shift+I to toggle • Auto-hides after 30s
      </div>
    </div>
  );
}