/**
 * PHYSICS CONTROL PANEL
 * Toggle and configure physics-based animations for scientific demonstrations
 * © 2025 UUON Foundation Inc.
 */

import React from 'react';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Activity, Zap, Wind, Orbit, Heart, Atom, Sparkles, Mountain, Gauge } from 'lucide-react';

interface PhysicsControlPanelProps {
  physicsEnabled: boolean;
  onPhysicsToggle: (enabled: boolean) => void;
  physicsConfig: {
    timeStep: number;
    dampingFactor: number;
    gravityStrength: number;
    displayForces: boolean;
    displayTrails: boolean;
    colorMode: 'energy' | 'velocity' | 'temperature' | 'phase' | 'none';
  };
  onConfigChange: (config: any) => void;
  currentCategory?: string;
}

export default function PhysicsControlPanel({
  physicsEnabled,
  onPhysicsToggle,
  physicsConfig,
  onConfigChange,
  currentCategory = 'static'
}: PhysicsControlPanelProps) {
  
  const categoryIcons: Record<string, any> = {
    wave: Wind,
    molecular: Atom,
    cellular: Activity,
    attractor: Orbit,
    anatomical: Heart,
    quantum: Zap,
    fractal: Mountain,
    astrophysical: Sparkles,
    crystalline: Sparkles,
    mechanical: Gauge,
    static: Activity
  };

  const CategoryIcon = categoryIcons[currentCategory] || Activity;

  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 rounded-xl border-2 border-blue-500/30 p-4 shadow-2xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-blue-500/20">
        <div className="flex items-center gap-2">
          <CategoryIcon className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-bold text-blue-300">Physics Simulation</h3>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="physics-toggle" className="text-sm text-gray-300">
            {physicsEnabled ? 'Active' : 'Paused'}
          </Label>
          <Switch
            id="physics-toggle"
            checked={physicsEnabled}
            onCheckedChange={onPhysicsToggle}
            className="data-[state=checked]:bg-blue-500"
          />
        </div>
      </div>

      {physicsEnabled && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${physicsEnabled ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Category: {currentCategory}
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              {currentCategory === 'wave' && 'Wave propagation with interference patterns'}
              {currentCategory === 'molecular' && 'Brownian motion with thermal vibration'}
              {currentCategory === 'cellular' && 'Fluid dynamics with Stokes drag'}
              {currentCategory === 'attractor' && 'Chaotic trajectory with Lorenz equations'}
              {currentCategory === 'anatomical' && 'Cardiac pulsation at 72 BPM'}
              {currentCategory === 'quantum' && 'Probability clouds with uncertainty'}
              {currentCategory === 'fractal' && 'Logistic growth with reaction-diffusion'}
              {currentCategory === 'astrophysical' && 'Orbital mechanics with gravity'}
              {currentCategory === 'crystalline' && 'Light refraction with dispersion'}
              {currentCategory === 'mechanical' && 'Gradient descent optimization'}
              {currentCategory === 'static' && 'No physics simulation'}
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-gray-800/30 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <Label className="text-sm text-gray-300">Time Step</Label>
                <span className="text-xs text-blue-400 bg-gray-800 px-2 py-1 rounded font-mono">
                  {physicsConfig.timeStep.toFixed(3)}s
                </span>
              </div>
              <Slider
                value={[physicsConfig.timeStep]}
                onValueChange={([value]) => onConfigChange({ ...physicsConfig, timeStep: value })}
                min={0.008}
                max={0.033}
                step={0.001}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Faster (8ms)</span>
                <span>Slower (33ms)</span>
              </div>
            </div>

            <div className="bg-gray-800/30 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <Label className="text-sm text-gray-300">Damping</Label>
                <span className="text-xs text-blue-400 bg-gray-800 px-2 py-1 rounded font-mono">
                  {(physicsConfig.dampingFactor * 100).toFixed(1)}%
                </span>
              </div>
              <Slider
                value={[physicsConfig.dampingFactor]}
                onValueChange={([value]) => onConfigChange({ ...physicsConfig, dampingFactor: value })}
                min={0.8}
                max={1.0}
                step={0.01}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>High Friction</span>
                <span>No Friction</span>
              </div>
            </div>

            <div className="bg-gray-800/30 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <Label className="text-sm text-gray-300">Gravity</Label>
                <span className="text-xs text-blue-400 bg-gray-800 px-2 py-1 rounded font-mono">
                  {physicsConfig.gravityStrength.toFixed(1)} m/s²
                </span>
              </div>
              <Slider
                value={[physicsConfig.gravityStrength]}
                onValueChange={([value]) => onConfigChange({ ...physicsConfig, gravityStrength: value })}
                min={0}
                max={20}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Zero G</span>
                <span>Strong (20 m/s²)</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-lg p-3 space-y-2">
            <Label className="text-sm text-gray-300 block mb-2">Display Options</Label>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Force Vectors</span>
              <Switch
                checked={physicsConfig.displayForces}
                onCheckedChange={(checked) => onConfigChange({ ...physicsConfig, displayForces: checked })}
                className="data-[state=checked]:bg-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Particle Trails</span>
              <Switch
                checked={physicsConfig.displayTrails}
                onCheckedChange={(checked) => onConfigChange({ ...physicsConfig, displayTrails: checked })}
                className="data-[state=checked]:bg-blue-500"
              />
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-lg p-3">
            <Label className="text-sm text-gray-300 block mb-2">Color Mapping</Label>
            <div className="grid grid-cols-2 gap-2">
              {(['energy', 'velocity', 'temperature', 'phase', 'none'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => onConfigChange({ ...physicsConfig, colorMode: mode })}
                  className={`text-xs px-3 py-2 rounded transition-all ${
                    physicsConfig.colorMode === mode
                      ? 'bg-blue-500 text-white font-semibold'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {!physicsEnabled && (
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-400">
            Enable physics to see scientific simulations
          </p>
        </div>
      )}
    </div>
  );
}
