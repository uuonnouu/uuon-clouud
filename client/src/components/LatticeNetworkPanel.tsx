
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Network, Zap, Hash } from 'lucide-react';
import LatticeNetworkEngine from '../lib/latticeNetworkEngine';
import { SurfaceParameters } from '../types/math';

interface LatticeNetworkPanelProps {
  latticeEngine: LatticeNetworkEngine | null;
  onLatticeEngineCreate: (engine: LatticeNetworkEngine) => void;
  currentParameters: SurfaceParameters;
  scene?: THREE.Scene;
}

export default function LatticeNetworkPanel({
  latticeEngine,
  onLatticeEngineCreate,
  currentParameters,
  scene
}: LatticeNetworkPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'design' | 'energy' | 'crypto'>('design');
  
  // Lattice parameters
  const [latticeParams, setLatticeParams] = useState({
    type: 'hybrid' as 'hybrid' | 'uniform' | 'gradient' | 'quantum',
    angle: 30,
    thickness: 0.15,
    density: 6,
    size: 3,
    spacing: 8
  });
  
  // Matter-energy algorithm parameters
  const [algorithmParams, setAlgorithmParams] = useState({
    name: 'planck-resonance' as 'planck-resonance' | 'quantum-foam' | 'torsion-field',
    dimensionConstant: 4.0,
    energyFlux: 1.0,
    matterDensity: 0.5,
    fieldCoupling: 'standard' as 'weak' | 'standard' | 'strong' | 'resonant'
  });
  
  // Spatial tokenization
  const [spatialParams, setSpatialParams] = useState({
    latitude: 0,
    longitude: 0,
    dimensionalOffset: 0.0,
    autoDetectLocation: false
  });
  
  const [status, setStatus] = useState('Ready to initialize lattice network');

  // Initialize lattice engine when scene is available
  useEffect(() => {
    if (scene && !latticeEngine) {
      const engine = new LatticeNetworkEngine(scene);
      onLatticeEngineCreate(engine);
      setStatus('Lattice network engine initialized');
    }
  }, [scene, latticeEngine, onLatticeEngineCreate]);

  const handleGenerateLattice = () => {
    if (!latticeEngine) return;
    
    setStatus('Generating mathematical lattice network...');
    
    // Get available mathematical objects from your 502+ catalog
    const availableShapes = [
      'sphere', 'torus', 'klein_bottle', 'mobius_strip', 'hypersphere',
      'mandelbrot_surface', 'julia_set', 'riemann_zeta_critical_line',
      'einstein_field_equations', 'schrodinger_wave_function'
    ]; // Sample from your catalog
    
    try {
      latticeEngine.generateMathematicalLattice(latticeParams, availableShapes);
      setStatus(`Lattice generated with ${availableShapes.length} mathematical objects`);
    } catch (error) {
      setStatus('Error generating lattice: ' + (error as Error).message);
    }
  };

  const handleApplyAlgorithm = () => {
    if (!latticeEngine) return;
    
    setStatus(`Applying ${algorithmParams.name} algorithm...`);
    
    try {
      latticeEngine.applyMatterEnergyAlgorithm(algorithmParams);
      setStatus(`${algorithmParams.name} algorithm applied successfully`);
    } catch (error) {
      setStatus('Error applying algorithm: ' + (error as Error).message);
    }
  };

  const handleGenerateTokens = async () => {
    if (!latticeEngine) return;
    
    setStatus('Generating spatial cryptographic tokens...');
    
    try {
      if (spatialParams.autoDetectLocation && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            setSpatialParams(prev => ({ ...prev, latitude: lat, longitude: lon }));
            
            await latticeEngine.generateSpatialTokens(lat, lon, spatialParams.dimensionalOffset);
            setStatus(`Spatial tokens generated for coordinates (${lat.toFixed(4)}, ${lon.toFixed(4)})`);
          },
          (error) => {
            console.error('Geolocation error:', error);
            setStatus('Location detection failed, using default coordinates');
            latticeEngine.generateSpatialTokens(0, 0, spatialParams.dimensionalOffset);
          }
        );
      } else {
        await latticeEngine.generateSpatialTokens(
          spatialParams.latitude, 
          spatialParams.longitude, 
          spatialParams.dimensionalOffset
        );
        setStatus('Spatial tokens generated for specified coordinates');
      }
    } catch (error) {
      setStatus('Error generating tokens: ' + (error as Error).message);
    }
  };

  if (!isExpanded) {
    return (
      <div className="bg-black/40 rounded-lg p-3 border border-purple-500/30">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center justify-between text-purple-400 hover:text-purple-300"
        >
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4" />
            <span className="font-semibold">Lattice Network Engine</span>
          </div>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-black/40 rounded-lg p-4 border border-purple-500/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-purple-400" />
          <h3 className="text-purple-400 font-bold text-sm">LATTICE NETWORK ENGINE</h3>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-purple-400 hover:text-purple-300"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-4">
        {[
          { id: 'design', label: 'Design', icon: Network },
          { id: 'energy', label: 'Energy', icon: Zap },
          { id: 'crypto', label: 'Crypto', icon: Hash }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-3 h-3" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Design Tab */}
      {activeTab === 'design' && (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-purple-300 mb-1 block">Lattice Type</label>
            <select
              value={latticeParams.type}
              onChange={(e) => setLatticeParams(prev => ({ 
                ...prev, 
                type: e.target.value as any 
              }))}
              className="w-full p-2 text-xs bg-gray-800/50 border border-gray-600 rounded text-white"
            >
              <option value="hybrid">Hybrid Pattern</option>
              <option value="uniform">Uniform Pattern</option>
              <option value="gradient">Angle Gradient</option>
              <option value="quantum">Quantum Probability</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-purple-300 mb-1 block">
              Network Size: {latticeParams.size}
            </label>
            <input
              type="range"
              min="2"
              max="5"
              value={latticeParams.size}
              onChange={(e) => setLatticeParams(prev => ({ 
                ...prev, 
                size: parseInt(e.target.value) 
              }))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-xs text-purple-300 mb-1 block">
              Node Spacing: {latticeParams.spacing}
            </label>
            <input
              type="range"
              min="5"
              max="15"
              value={latticeParams.spacing}
              onChange={(e) => setLatticeParams(prev => ({ 
                ...prev, 
                spacing: parseInt(e.target.value) 
              }))}
              className="w-full"
            />
          </div>

          <button
            onClick={handleGenerateLattice}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
          >
            Generate Mathematical Lattice
          </button>
        </div>
      )}

      {/* Energy Tab */}
      {activeTab === 'energy' && (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-purple-300 mb-1 block">Matter-Energy Algorithm</label>
            <select
              value={algorithmParams.name}
              onChange={(e) => setAlgorithmParams(prev => ({ 
                ...prev, 
                name: e.target.value as any 
              }))}
              className="w-full p-2 text-xs bg-gray-800/50 border border-gray-600 rounded text-white"
            >
              <option value="planck-resonance">Planck Resonance</option>
              <option value="quantum-foam">Quantum Foam</option>
              <option value="torsion-field">Torsion Field</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-purple-300 mb-1 block">
              Dimensional Constant: {algorithmParams.dimensionConstant.toFixed(1)}
            </label>
            <input
              type="range"
              min="3"
              max="7"
              step="0.1"
              value={algorithmParams.dimensionConstant}
              onChange={(e) => setAlgorithmParams(prev => ({ 
                ...prev, 
                dimensionConstant: parseFloat(e.target.value) 
              }))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-xs text-purple-300 mb-1 block">
              Energy Flux: {algorithmParams.energyFlux.toFixed(1)}
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={algorithmParams.energyFlux}
              onChange={(e) => setAlgorithmParams(prev => ({ 
                ...prev, 
                energyFlux: parseFloat(e.target.value) 
              }))}
              className="w-full"
            />
          </div>

          <button
            onClick={handleApplyAlgorithm}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
          >
            Apply Algorithm
          </button>
        </div>
      )}

      {/* Crypto Tab */}
      {activeTab === 'crypto' && (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-purple-300 mb-1 flex items-center gap-2">
              <input
                type="checkbox"
                checked={spatialParams.autoDetectLocation}
                onChange={(e) => setSpatialParams(prev => ({ 
                  ...prev, 
                  autoDetectLocation: e.target.checked 
                }))}
                className="w-3 h-3"
              />
              Auto-detect Location
            </label>
          </div>

          {!spatialParams.autoDetectLocation && (
            <>
              <div>
                <label className="text-xs text-purple-300 mb-1 block">Latitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={spatialParams.latitude}
                  onChange={(e) => setSpatialParams(prev => ({ 
                    ...prev, 
                    latitude: parseFloat(e.target.value) || 0 
                  }))}
                  className="w-full p-2 text-xs bg-gray-800/50 border border-gray-600 rounded text-white"
                />
              </div>

              <div>
                <label className="text-xs text-purple-300 mb-1 block">Longitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={spatialParams.longitude}
                  onChange={(e) => setSpatialParams(prev => ({ 
                    ...prev, 
                    longitude: parseFloat(e.target.value) || 0 
                  }))}
                  className="w-full p-2 text-xs bg-gray-800/50 border border-gray-600 rounded text-white"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-xs text-purple-300 mb-1 block">
              Dimensional Offset: {spatialParams.dimensionalOffset.toFixed(3)}
            </label>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.001"
              value={spatialParams.dimensionalOffset}
              onChange={(e) => setSpatialParams(prev => ({ 
                ...prev, 
                dimensionalOffset: parseFloat(e.target.value) 
              }))}
              className="w-full"
            />
          </div>

          <button
            onClick={handleGenerateTokens}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
          >
            Generate Spatial Tokens
          </button>
        </div>
      )}

      {/* Status */}
      <div className="mt-4 p-2 bg-gray-900/50 rounded border border-gray-700">
        <div className="text-xs text-cyan-400 font-medium">Status:</div>
        <div className="text-xs text-gray-300">{status}</div>
      </div>
    </div>
  );
}
