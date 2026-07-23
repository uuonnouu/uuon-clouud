import { useState, useEffect } from 'react';
import { getEnergySystemStatus, ENERGY_SYSTEM_EXPLANATION } from '../lib/crossLearningEngine';

interface EnergyStatus {
  totalEnergy: number;
  lastConversion: number;
  nextConversion: number;
  tokensGenerated: number;
  conversionRate: string;
  isActive: boolean;
}

export function EnergySystemExplanation() {
  const [status, setStatus] = useState<EnergyStatus | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
      try {
        const energyStatus = getEnergySystemStatus();
        setStatus(energyStatus);
      } catch (e) {
        console.warn('Energy system not ready');
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp: number) => {
    if (!timestamp) return 'Never';
    const seconds = Math.max(0, Math.floor((timestamp - Date.now()) / 1000));
    return seconds > 0 ? `${seconds}s` : 'Now';
  };

  return (
    <div className="bg-gray-900/90 border border-gray-700 rounded-lg p-4 text-white">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">⚡</span>
          <h3 className="font-semibold">{ENERGY_SYSTEM_EXPLANATION.title}</h3>
          {status?.isActive && (
            <span className="text-xs bg-green-600 px-2 py-0.5 rounded-full">Active</span>
          )}
        </div>
        <span className="text-gray-400">{isExpanded ? '▼' : '▶'}</span>
      </div>

      {status && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div className="bg-gray-800 rounded p-2">
            <div className="text-gray-400 text-xs">Current Energy</div>
            <div className="text-lg font-bold text-yellow-400">
              {status.totalEnergy.toFixed(2)}
            </div>
          </div>
          <div className="bg-gray-800 rounded p-2">
            <div className="text-gray-400 text-xs">Tokens Generated</div>
            <div className="text-lg font-bold text-green-400">
              {status.tokensGenerated}
            </div>
          </div>
          <div className="bg-gray-800 rounded p-2">
            <div className="text-gray-400 text-xs">Next Conversion</div>
            <div className="text-sm font-medium text-blue-400">
              {formatTime(status.nextConversion)}
            </div>
          </div>
          <div className="bg-gray-800 rounded p-2">
            <div className="text-gray-400 text-xs">Rate</div>
            <div className="text-sm font-medium text-purple-400">
              {status.conversionRate}
            </div>
          </div>
        </div>
      )}

      {isExpanded && (
        <div className="mt-4 space-y-4 text-sm">
          <p className="text-gray-300">{ENERGY_SYSTEM_EXPLANATION.summary}</p>

          <div>
            <h4 className="font-semibold text-yellow-400 mb-2">How It Works</h4>
            <ul className="space-y-1">
              {ENERGY_SYSTEM_EXPLANATION.howItWorks.map((item, i) => (
                <li key={i} className="text-gray-300 flex gap-2">
                  <span className="text-green-400">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-yellow-400 mb-2">Energy Sources</h4>
            <div className="grid grid-cols-2 gap-1">
              {Object.entries(ENERGY_SYSTEM_EXPLANATION.energySources).map(([action, value]) => (
                <div key={action} className="flex justify-between text-gray-300 bg-gray-800/50 px-2 py-1 rounded">
                  <span>{action}</span>
                  <span className="text-green-400">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-yellow-400 mb-2">Conversion Rates</h4>
            <div className="space-y-1">
              {Object.entries(ENERGY_SYSTEM_EXPLANATION.conversionRates).map(([key, value]) => (
                <div key={key} className="flex justify-between text-gray-300">
                  <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                  <span className="text-blue-400">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-yellow-400 mb-2">Benefits</h4>
            <ul className="space-y-1">
              {ENERGY_SYSTEM_EXPLANATION.benefits.map((benefit, i) => (
                <li key={i} className="text-gray-300 flex gap-2">
                  <span className="text-purple-400">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnergySystemExplanation;
