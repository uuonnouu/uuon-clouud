import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import UUONTokenPanel from './UUONTokenPanel';
import { EnergySystemExplanation } from './EnergySystemExplanation';
import { 
  getCrossLearningMetrics, 
  saveCurrentEnergy, 
  loadSavedEnergy, 
  exportEnergySnapshot,
  downloadEnergyFile,
  createEnergyContainer 
} from '../lib/crossLearningEngine';
import { sdkClient } from '../lib/unifiedSDKClient';

const ENERGY_TIERS = [
  { name: 'Spark', capacity: 100, color: 'text-gray-400', benefit: 'Basic energy storage' },
  { name: 'Flame', capacity: 250, color: 'text-orange-400', benefit: 'Enhanced shape resolution' },
  { name: 'Blaze', capacity: 500, color: 'text-yellow-400', benefit: 'Unlock fractal dimensions' },
  { name: 'Inferno', capacity: 1000, color: 'text-red-400', benefit: 'Maximum render quality' },
  { name: 'Supernova', capacity: 2500, color: 'text-purple-400', benefit: 'Hyperdimensional access' },
  { name: 'Cosmic', capacity: 10000, color: 'text-cyan-400', benefit: 'Universal consciousness' },
];

interface MintedToken {
  tokenId: string;
  tokenName: string;
  shapeType: string;
  energy: number;
  mintedAt: number;
}

async function mintTokenToDatabase(tokenName: string, shapeType: string, parameters: Record<string, number>, energy: number): Promise<MintedToken | null> {
  try {
    const result = await sdkClient.mintToken({
      shapeType,
      tokenName,
      parameters,
      baseEnergy: energy,
      mathematicalProperties: {
        tier: energy >= 10000 ? 'cosmic' : energy >= 2500 ? 'supernova' : energy >= 1000 ? 'inferno' : 'standard',
        mintedFrom: 'energy_storage_panel'
      }
    });
    
    if (!result.success) {
      console.error('Token minting failed:', result.error);
      return null;
    }
    
    if (result.data?.success) {
      console.log('Token minted successfully:', result.data.token);
      return {
        tokenId: result.data.token.tokenId,
        tokenName,
        shapeType,
        energy,
        mintedAt: Date.now()
      };
    }
    return null;
  } catch (error) {
    console.error('Token minting error:', error);
    return null;
  }
}

async function fetchTokenStats(): Promise<{ totalTokens: number; totalEnergy: number; latestBlock: number } | null> {
  try {
    const result = await sdkClient.getTokenStats();
    if (!result.success) return null;
    return result.data?.success ? result.data.stats : null;
  } catch {
    return null;
  }
}

export default function EnergyStoragePanel() {
  const [metrics, setMetrics] = useState(getCrossLearningMetrics());
  const [storageName, setStorageName] = useState('');
  const [containerCapacity, setContainerCapacity] = useState(() => {
    const saved = localStorage.getItem('energy_container_capacity');
    return saved ? parseInt(saved) : 100;
  });
  const [container, setContainer] = useState(createEnergyContainer(containerCapacity));
  const [savedSnapshots, setSavedSnapshots] = useState<string[]>([]);
  const [mintedTokens, setMintedTokens] = useState<MintedToken[]>([]);
  const [isMinting, setIsMinting] = useState(false);
  const [tokenStats, setTokenStats] = useState<{ totalTokens: number; totalEnergy: number; latestBlock: number } | null>(null);

  const currentTier = ENERGY_TIERS.reduce((acc, tier) => 
    containerCapacity >= tier.capacity ? tier : acc, ENERGY_TIERS[0]);
  const nextTier = ENERGY_TIERS.find(t => t.capacity > containerCapacity);

  const expandCapacity = (newCapacity: number) => {
    setContainerCapacity(newCapacity);
    localStorage.setItem('energy_container_capacity', String(newCapacity));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(getCrossLearningMetrics());
      setContainer(createEnergyContainer(containerCapacity));
    }, 1000);

    const snapshots: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('energy_')) {
        snapshots.push(key.replace('energy_', ''));
      }
    }
    setSavedSnapshots(snapshots);

    fetchTokenStats().then(stats => stats && setTokenStats(stats));

    return () => clearInterval(interval);
  }, [containerCapacity]);

  const handleSaveEnergy = () => {
    if (storageName.trim()) {
      saveCurrentEnergy(storageName.trim());
      setSavedSnapshots(prev => [...prev, storageName.trim()]);
      setStorageName('');
    }
  };

  const handleMintToken = async () => {
    if (!storageName.trim()) return;
    
    setIsMinting(true);
    
    // First sync accumulated tokens to database
    try {
      const { syncTokenBatch } = await import('../lib/crossLearningEngine');
      await syncTokenBatch();
    } catch (error) {
      console.error('Token batch sync failed:', error);
    }
    
    const token = await mintTokenToDatabase(
      storageName.trim(),
      'energy_shape',
      { a: 1, b: 1, c: 1, energy: metrics.totalEnergy },
      metrics.totalEnergy
    );
    
    if (token) {
      setMintedTokens(prev => [token, ...prev].slice(0, 10));
      setStorageName('');
      fetchTokenStats().then(stats => stats && setTokenStats(stats));
    }
    setIsMinting(false);
  };

  const handleLoadEnergy = (name: string) => {
    if (loadSavedEnergy(name)) {
      setMetrics(getCrossLearningMetrics());
    }
  };

  const handleDownloadEnergy = () => {
    downloadEnergyFile('quantum_mathematical_energy');
  };

  return (
    <div className="w-full space-y-4 p-3 bg-slate-950 rounded-lg border border-slate-700">
      {/* Header */}
      <div className="pb-2 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white">⚡ Energy Storage</span>
          <Badge variant="outline" className="bg-yellow-900 text-yellow-200 border-yellow-600">
            {metrics.totalEnergy.toFixed(2)} Units
          </Badge>
        </div>
        <p className="text-xs text-slate-400 mt-1">Mathematical field energy capture and storage</p>
      </div>
      
      {/* Energy System Explanation */}
      <EnergySystemExplanation />
      
      {/* Current Energy Status */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
          <div className="text-xs text-slate-400">Total Energy</div>
          <div className="text-xl font-bold text-yellow-300">
            {metrics.totalEnergy.toFixed(2)}
          </div>
        </div>
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
          <div className="text-xs text-slate-400">Connections</div>
          <div className="text-xl font-bold text-blue-300">
            {metrics.connectionCount}
          </div>
        </div>
      </div>

      {/* Energy Tier Badge */}
      <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
        <div className="flex justify-between items-center">
          <div>
            <span className={`text-sm font-bold ${currentTier.color}`}>
              🔥 {currentTier.name} Tier
            </span>
            <div className="text-xs text-slate-400">{currentTier.benefit}</div>
          </div>
          {nextTier && (
            <div className="text-right">
              <div className="text-[10px] text-slate-500">Next: {nextTier.name}</div>
              <Button 
                size="sm" 
                variant="outline"
                className={`text-[10px] h-6 px-2 ${nextTier.color} border-slate-600 bg-slate-800 hover:bg-slate-700`}
                onClick={() => expandCapacity(nextTier.capacity)}
              >
                Expand to {nextTier.capacity}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Energy Container */}
      <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-slate-300">Energy Container</span>
          <span className="text-slate-300">{container.stored.toFixed(1)} / {containerCapacity}</span>
        </div>
        <Progress 
          value={Math.min(100, (container.stored / containerCapacity) * 100)} 
          className="h-2"
        />
        <div className="text-[10px] text-slate-400 flex justify-between">
          <span>Efficiency: {(container.efficiency * 100).toFixed(1)}%</span>
          {container.overflow > 0 && (
            <span className="text-yellow-300">
              ⚡ Overflow: {container.overflow.toFixed(1)}
            </span>
          )}
        </div>
      </div>

      {/* Token Stats from Database */}
      {tokenStats && (
        <div className="bg-slate-900 p-3 rounded-lg border border-purple-700 space-y-2">
          <div className="text-xs font-medium text-purple-300">Database Token Ledger</div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-800 p-2 rounded">
              <div className="text-lg font-bold text-purple-400">{tokenStats.totalTokens}</div>
              <div className="text-[10px] text-slate-400">Tokens</div>
            </div>
            <div className="bg-slate-800 p-2 rounded">
              <div className="text-lg font-bold text-yellow-400">{tokenStats.totalEnergy.toFixed(1)}</div>
              <div className="text-[10px] text-slate-400">Energy</div>
            </div>
            <div className="bg-slate-800 p-2 rounded">
              <div className="text-lg font-bold text-cyan-400">{tokenStats.latestBlock}</div>
              <div className="text-[10px] text-slate-400">Block</div>
            </div>
          </div>
        </div>
      )}

      {/* Mint Token to Database */}
      <div className="bg-slate-900 p-3 rounded-lg border border-emerald-700 space-y-2">
        <label className="text-xs font-medium text-emerald-300">Mint Token to Blockchain Ledger</label>
        <div className="flex gap-2">
          <Input
            placeholder="Enter token name..."
            value={storageName}
            onChange={(e) => setStorageName(e.target.value)}
            className="h-8 text-xs bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
          />
          <Button 
            onClick={handleMintToken} 
            disabled={!storageName.trim() || isMinting}
            size="sm"
            className="h-8 bg-emerald-700 hover:bg-emerald-600 text-white"
          >
            {isMinting ? '⏳' : '🪙'} Mint
          </Button>
        </div>
        <div className="text-[10px] text-slate-400">
          Saves token with SHA-256 hash chain, ULID ID, and energy signature to database
        </div>
      </div>

      {/* Recently Minted Tokens */}
      {mintedTokens.length > 0 && (
        <div className="bg-slate-900 p-3 rounded-lg border border-emerald-700 space-y-2">
          <label className="text-xs font-medium text-emerald-300">Recently Minted Tokens</label>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {mintedTokens.map((token) => (
              <div key={token.tokenId} className="flex justify-between items-center p-2 bg-slate-800 rounded border border-slate-700">
                <div>
                  <span className="text-xs text-white">{token.tokenName}</span>
                  <span className="text-[10px] text-slate-500 ml-2">ID: {token.tokenId.slice(0, 8)}...</span>
                </div>
                <Badge className="text-[10px] bg-yellow-900 text-yellow-200">
                  {token.energy.toFixed(1)} ⚡
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Energy State (Local) */}
      <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 space-y-2">
        <label className="text-xs font-medium text-slate-300">Save Energy Snapshot (Local)</label>
        <div className="flex gap-2">
          <Input
            placeholder="Enter snapshot name..."
            value={storageName}
            onChange={(e) => setStorageName(e.target.value)}
            className="h-8 text-xs bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
          />
          <Button 
            onClick={handleSaveEnergy} 
            disabled={!storageName.trim()}
            size="sm"
            className="h-8 bg-green-700 hover:bg-green-600 text-white"
          >
            💾 Save
          </Button>
        </div>
      </div>

      {/* Saved Snapshots */}
      {savedSnapshots.length > 0 && (
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 space-y-2">
          <label className="text-xs font-medium text-slate-300">Saved Energy Snapshots</label>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {savedSnapshots.map((name) => (
              <div key={name} className="flex justify-between items-center p-2 bg-slate-800 rounded border border-slate-700">
                <span className="text-xs text-white">{name}</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 text-[10px] bg-slate-700 border-slate-600 hover:bg-slate-600"
                  onClick={() => handleLoadEnergy(name)}
                >
                  📁 Load
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 space-y-2">
        <label className="text-xs font-medium text-slate-300">Export Energy Data</label>
        <div className="flex gap-2">
          <Button 
            onClick={handleDownloadEnergy} 
            size="sm"
            className="flex-1 h-8 text-xs bg-blue-700 hover:bg-blue-600"
          >
            📊 Download JSON
          </Button>
          <Button 
            onClick={() => {
              const csv = exportEnergySnapshot();
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `energy_${Date.now()}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            variant="outline" 
            size="sm"
            className="flex-1 h-8 text-xs bg-slate-800 border-slate-600 hover:bg-slate-700"
          >
            📈 Download CSV
          </Button>
        </div>
      </div>

      {/* UUON Token Economy Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full h-10 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-lg border border-emerald-500">
            💎 View UUON Token Economy
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-950 border-emerald-600">
          <DialogHeader>
            <DialogTitle className="text-emerald-300 text-lg">💎 UUON Token Economy Dashboard</DialogTitle>
          </DialogHeader>
          <UUONTokenPanel />
        </DialogContent>
      </Dialog>

      {/* Energy Composition Info */}
      <div className="bg-slate-900 p-3 rounded-lg border border-blue-800">
        <div className="text-xs font-medium text-blue-300 mb-2">Energy Composition</div>
        <div className="text-[10px] text-slate-300 space-y-1">
          <div>• Mathematical Field Energy (kinetic + potential)</div>
          <div>• Harmonic Resonance between shapes</div>
          <div>• Quantum computational states</div>
          <div>• Cross-learning connection strength</div>
        </div>
      </div>
    </div>
  );
}
