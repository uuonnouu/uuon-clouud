/**
 * UV MORPHING CONTROLS
 * Powerful real-time shape morphing using UV domain parameters
 */

import React, { useState, useEffect } from 'react';
import { SurfaceParameters } from '../types/math';
import {
  applyUVMorphing,
  applyEarthTimeMorphing,
  getEarthTimeParameters,
  UVMorphConfig
} from '../lib/uvMorphingEngine';
import { Button } from './ui/button';
import { Label } from './ui/label';

interface UVMorphingControlsProps {
  parameters: SurfaceParameters;
  onParameterChange: (newParams: Partial<SurfaceParameters>) => void;
}

export default function UVMorphingControls({
  parameters,
  onParameterChange
}: UVMorphingControlsProps) {
  const [morphMode, setMorphMode] = useState<UVMorphConfig['mode'] | 'none'>('none');
  const [intensity, setIntensity] = useState<number>(0.5);
  const [frequency, setFrequency] = useState<number>(1.0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [phase, setPhase] = useState<number>(0);
  const [earthTimeActive, setEarthTimeActive] = useState<boolean>(false);

  // Animation loop for time-based morphing
  useEffect(() => {
    if (!isAnimating) return;
    
    const interval = setInterval(() => {
      setPhase(p => (p + 0.01) % 1);
      
      if (morphMode !== 'none') {
        const morphConfig: UVMorphConfig = {
          mode: morphMode,
          intensity,
          frequency,
          phase
        };
        
        const morphed = applyUVMorphing(parameters, morphConfig);
        onParameterChange(morphed);
      }
    }, 50); // 20 FPS morphing
    
    return () => clearInterval(interval);
  }, [isAnimating, morphMode, intensity, frequency, phase]);

  // Earth time integration
  useEffect(() => {
    if (!earthTimeActive) return;
    
    const interval = setInterval(() => {
      const morphed = applyEarthTimeMorphing(parameters);
      onParameterChange(morphed);
    }, 1000); // Update every second
    
    return () => clearInterval(interval);
  }, [earthTimeActive, parameters]);

  const morphModes: Array<{ id: UVMorphConfig['mode'], name: string, icon: string, desc: string }> = [
    { id: 'twist', name: 'Twist', icon: '🌀', desc: 'Spiral twisting' },
    { id: 'wave', name: 'Wave', icon: '🌊', desc: 'Undulating waves' },
    { id: 'spiral', name: 'Spiral', icon: '🔄', desc: 'Vortex spiral' },
    { id: 'ripple', name: 'Ripple', icon: '💧', desc: 'Concentric ripples' },
    { id: 'vortex', name: 'Vortex', icon: '🌪️', desc: 'Spiraling vortex' },
    { id: 'breathe', name: 'Breathe', icon: '💨', desc: 'Pulsating' },
    { id: 'unfold', name: 'Unfold', icon: '📖', desc: 'Surface unwrap' },
    { id: 'fold', name: 'Fold', icon: '📦', desc: 'Surface compress' }
  ];

  const earthTime = getEarthTimeParameters();

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-sm p-4 rounded-lg border-2 border-purple-500/40">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wide">
          ⚡ UV Morphing Engine
        </h3>
        <Button
          onClick={() => setIsAnimating(!isAnimating)}
          size="sm"
          className={`h-7 text-xs font-bold ${
            isAnimating 
              ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isAnimating ? '⏸ Stop' : '▶ Animate'}
        </Button>
      </div>

      {/* Earth Time Integration */}
      <div className="mb-3 p-3 bg-blue-900/40 rounded-lg border border-blue-500/30">
        <div className="flex items-center justify-between mb-2">
          <Label className="text-xs font-bold text-blue-300">
            🌍 Earth Time-Aware Morphing
          </Label>
          <Button
            onClick={() => setEarthTimeActive(!earthTimeActive)}
            size="sm"
            className={`h-6 text-[10px] font-bold ${
              earthTimeActive 
                ? 'bg-blue-500' 
                : 'bg-gray-600'
            }`}
          >
            {earthTimeActive ? 'ACTIVE' : 'OFF'}
          </Button>
        </div>
        
        {earthTimeActive && (
          <div className="grid grid-cols-2 gap-2 text-[10px] mt-2">
            <div className="bg-black/30 p-1.5 rounded">
              <div className="text-gray-400">Time</div>
              <div className="text-cyan-300 font-mono font-bold">
                {earthTime.hourOfDay.toFixed(1)}h
              </div>
            </div>
            <div className="bg-black/30 p-1.5 rounded">
              <div className="text-gray-400">Day</div>
              <div className="text-cyan-300 font-mono font-bold">
                {earthTime.dayOfYear}/365
              </div>
            </div>
            <div className="bg-black/30 p-1.5 rounded">
              <div className="text-gray-400">Season</div>
              <div className="text-yellow-300 font-bold">
                {earthTime.season.toUpperCase()}
              </div>
            </div>
            <div className="bg-black/30 p-1.5 rounded">
              <div className="text-gray-400">Tide</div>
              <div className="text-blue-300 font-mono font-bold">
                {(earthTime.tideStrength * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Morph Mode Selection */}
      <div className="mb-3">
        <Label className="text-xs font-semibold text-purple-300 mb-2 block">
          Morph Mode
        </Label>
        <div className="grid grid-cols-4 gap-1.5">
          {morphModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setMorphMode(mode.id)}
              className={`
                px-2 py-2 rounded-lg border-2 transition-all
                ${morphMode === mode.id
                  ? 'border-purple-400 bg-purple-500/30 shadow-lg shadow-purple-500/30'
                  : 'border-gray-600 bg-gray-700/50 hover:border-purple-500/50'
                }
              `}
              title={mode.desc}
            >
              <div className="text-lg">{mode.icon}</div>
              <div className="text-[9px] font-bold text-white mt-0.5">
                {mode.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Intensity Control */}
      <div className="mb-3 bg-black/30 p-3 rounded-lg">
        <div className="flex items-center justify-between mb-1">
          <Label className="text-xs font-bold text-orange-400">
            🔥 Intensity
          </Label>
          <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded font-mono">
            {(intensity * 100).toFixed(0)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={intensity}
          onChange={(e) => setIntensity(parseFloat(e.target.value))}
          className="w-full h-2 bg-gradient-to-r from-gray-700 via-orange-500 to-red-600 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Frequency Control */}
      <div className="mb-3 bg-black/30 p-3 rounded-lg">
        <div className="flex items-center justify-between mb-1">
          <Label className="text-xs font-bold text-cyan-400">
            📡 Frequency
          </Label>
          <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded font-mono">
            {frequency.toFixed(2)}Hz
          </span>
        </div>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={frequency}
          onChange={(e) => setFrequency(parseFloat(e.target.value))}
          className="w-full h-2 bg-gradient-to-r from-blue-700 via-cyan-500 to-green-500 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={() => {
            setMorphMode('none');
            setIsAnimating(false);
            setEarthTimeActive(false);
          }}
          size="sm"
          className="h-8 text-xs font-bold bg-red-600/80 hover:bg-red-700"
        >
          🛑 Reset All
        </Button>
        <Button
          onClick={() => {
            setIntensity(0.8);
            setFrequency(2.0);
            setIsAnimating(true);
          }}
          size="sm"
          className="h-8 text-xs font-bold bg-purple-600/80 hover:bg-purple-700"
        >
          ⚡ Max Power
        </Button>
      </div>

      {/* Status Display */}
      {morphMode !== 'none' && (
        <div className="mt-3 p-2 bg-purple-900/40 rounded border border-purple-500/30 text-[10px] text-purple-200">
          <div className="font-bold text-purple-300 mb-1">Active Morph:</div>
          <div>{morphModes.find(m => m.id === morphMode)?.desc}</div>
          {isAnimating && (
            <div className="mt-1 text-green-300">🟢 Animating at 20 FPS</div>
          )}
        </div>
      )}

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(168, 85, 247, 0.8);
        }
        
        input[type="range"]::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(168, 85, 247, 0.8);
        }
      `}</style>
    </div>
  );
}
