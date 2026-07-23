/**
 * UV ENVIRONMENTAL PRESETS - QUICK ACCESS PANEL
 * One-click switching between Cosmic, Earth, and Neural environments
 */

import React, { useState } from 'react';
import { SurfaceParameters } from '../types/math';
import {
  UV_ENVIRONMENTAL_PRESETS,
  UVPreset,
  applyUVPreset,
  applyMeshTension,
  MeshTensionConfig
} from '../lib/uvEnvironmentalPresets';

interface UVEnvironmentalPresetsProps {
  parameters: SurfaceParameters;
  onParameterChange: (newParams: Partial<SurfaceParameters>) => void;
}

export default function UVEnvironmentalPresets({
  parameters,
  onParameterChange
}: UVEnvironmentalPresetsProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [meshTension, setMeshTension] = useState<number>(0.5);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const handlePresetClick = (preset: UVPreset) => {
    const newParams = applyUVPreset(parameters, preset);
    onParameterChange(newParams);
    setSelectedPreset(preset.name);
    
    console.log(`🌍 Applied ${preset.name} environmental preset:`, {
      uRange: `${preset.uMin.toFixed(2)} → ${preset.uMax.toFixed(2)}`,
      vRange: `${preset.vMin.toFixed(2)} → ${preset.vMax.toFixed(2)}`,
      segments: `${preset.uSegments}×${preset.vSegments}`,
      scale: preset.environmentalContext.scale
    });
  };

  const handleTensionChange = (tension: number) => {
    setMeshTension(tension);
    
    const tensionConfig: MeshTensionConfig = {
      tension,
      preserveTopology: true,
      smoothingIterations: Math.floor(tension * 5)
    };
    
    const newParams = applyMeshTension(parameters, tensionConfig);
    onParameterChange(newParams);
    
    console.log(`🔧 Applied mesh tension: ${(tension * 100).toFixed(0)}%`);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-cyan-500/30">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-cyan-400">
          🌐 Environmental UV Presets
        </h3>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-gray-400 hover:text-cyan-400 transition-colors"
        >
          {showAdvanced ? '▼' : '▶'} Advanced
        </button>
      </div>

      {/* Quick Preset Buttons */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {UV_ENVIRONMENTAL_PRESETS.map((preset) => {
          const isActive = selectedPreset === preset.name;
          
          return (
            <button
              key={preset.name}
              onClick={() => handlePresetClick(preset)}
              className={`
                relative px-3 py-4 rounded-lg border-2 transition-all duration-200
                ${isActive 
                  ? 'border-cyan-400 bg-cyan-500/20 shadow-lg shadow-cyan-500/20' 
                  : 'border-gray-600 bg-gray-700/50 hover:border-cyan-500/50 hover:bg-cyan-500/10'
                }
              `}
            >
              <div className="text-2xl mb-1">{preset.icon}</div>
              <div className="text-xs font-bold text-white">{preset.name}</div>
              <div className="text-[10px] text-gray-400 mt-1">
                {preset.environmentalContext.scale}
              </div>
              
              {isActive && (
                <div className="absolute top-1 right-1">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Current UV Display */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-[11px]">
        <div className="bg-gray-900/70 p-2 rounded border border-gray-700">
          <div className="text-gray-400 mb-1">U Domain</div>
          <div className="text-cyan-400 font-mono">
            {(parameters.uMin ?? 0).toFixed(2)} → {(parameters.uMax ?? 1).toFixed(2)}
          </div>
        </div>
        <div className="bg-gray-900/70 p-2 rounded border border-gray-700">
          <div className="text-gray-400 mb-1">V Domain</div>
          <div className="text-cyan-400 font-mono">
            {(parameters.vMin ?? 0).toFixed(2)} → {(parameters.vMax ?? 1).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Mesh Tension Control */}
      <div className="bg-gray-900/50 p-3 rounded-lg border border-orange-500/30">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-orange-400">
            ⚡ Mesh Tension
          </label>
          <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded">
            {(meshTension * 100).toFixed(0)}%
          </span>
        </div>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={meshTension}
          onChange={(e) => handleTensionChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, 
              #ef4444 0%, 
              #f59e0b ${meshTension * 50}%, 
              #10b981 ${meshTension * 100}%
            )`
          }}
        />
        
        <div className="flex justify-between text-[10px] text-gray-500 mt-1">
          <span>Relaxed</span>
          <span>Tight</span>
        </div>
      </div>

      {/* Advanced Details */}
      {showAdvanced && (
        <div className="mt-3 p-3 bg-gray-900/80 rounded-lg border border-gray-700 text-[11px] space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Segments:</span>
            <span className="text-green-400 font-mono">
              {parameters.uSegments ?? 64}×{parameters.vSegments ?? 48}
            </span>
          </div>
          
          {selectedPreset && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-400">Environment:</span>
                <span className="text-cyan-400">
                  {UV_ENVIRONMENTAL_PRESETS.find(p => p.name === selectedPreset)
                    ?.environmentalContext.scale}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Curvature:</span>
                <span className="text-purple-400">
                  {UV_ENVIRONMENTAL_PRESETS.find(p => p.name === selectedPreset)
                    ?.environmentalContext.curvature.toFixed(1)}x
                </span>
              </div>
            </>
          )}
          
          <div className="pt-2 border-t border-gray-700 text-gray-500">
            💡 UV controls surface sampling density, independent from A/B/C geometry scale
          </div>
        </div>
      )}

      {/* Preset Descriptions */}
      <div className="mt-3 text-[10px] text-gray-400 space-y-1">
        {UV_ENVIRONMENTAL_PRESETS.map((preset) => (
          <div key={preset.name} className="flex items-start gap-2">
            <span className="mt-0.5">{preset.icon}</span>
            <div>
              <span className="font-semibold text-gray-300">{preset.name}:</span>{' '}
              {preset.description}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          box-shadow: 0 0 8px rgba(6, 182, 212, 0.8);
        }
        
        input[type="range"]::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 8px rgba(6, 182, 212, 0.8);
        }
      `}</style>
    </div>
  );
}
