/**
 * INTERACTIVE PHYSICS CONTROL PANEL
 * UI controls for real-time physics simulation settings
 * 
 * © 2025 UUON Foundation Inc.
 */

import React from 'react';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { 
  Hand, 
  RotateCcw, 
  Gauge, 
  ArrowDown, 
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';
import { getMaterialPhysics } from '../hooks/useInteractivePhysics';

interface InteractivePhysicsConfig {
  enabled: boolean;
  gravity: number;
  groundLevel: number;
  throwMultiplier: number;
}

interface InteractivePhysicsPanelProps {
  config: InteractivePhysicsConfig;
  onConfigChange: (config: InteractivePhysicsConfig) => void;
  onReset: () => void;
  materialId: string;
  physicsState: {
    position: { x: number; y: number; z: number };
    velocity: { x: number; y: number; z: number };
    isGrabbed: boolean;
    isSettled: boolean;
  } | null;
}

export default function InteractivePhysicsPanel({
  config,
  onConfigChange,
  onReset,
  materialId,
  physicsState
}: InteractivePhysicsPanelProps) {
  const materialProps = getMaterialPhysics(materialId);
  
  const speed = physicsState 
    ? Math.sqrt(
        physicsState.velocity.x ** 2 + 
        physicsState.velocity.y ** 2 + 
        physicsState.velocity.z ** 2
      )
    : 0;

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 rounded-xl border-2 border-purple-500/30 p-4 shadow-2xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-purple-500/20">
        <div className="flex items-center gap-2">
          <Hand className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-bold text-purple-300">Interactive Physics</h3>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="interactive-toggle" className="text-sm text-gray-300">
            {config.enabled ? 'Active' : 'Disabled'}
          </Label>
          <Switch
            id="interactive-toggle"
            checked={config.enabled}
            onCheckedChange={(enabled) => onConfigChange({ ...config, enabled })}
            className="data-[state=checked]:bg-purple-500"
          />
        </div>
      </div>

      {config.enabled && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${
                physicsState?.isGrabbed 
                  ? 'bg-yellow-400 animate-pulse' 
                  : physicsState?.isSettled 
                    ? 'bg-green-400' 
                    : 'bg-blue-400 animate-pulse'
              }`} />
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Status: {physicsState?.isGrabbed ? 'Grabbed' : physicsState?.isSettled ? 'Settled' : 'Moving'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                <span>Speed: {speed.toFixed(2)} m/s</span>
              </div>
              <div className="flex items-center gap-1">
                <Gauge className="w-3 h-3" />
                <span>Mass: {materialProps.mass.toFixed(1)} kg</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700">
            <Label className="text-sm text-gray-300 block mb-2">Material Properties</Label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-900/50 rounded p-2">
                <span className="text-gray-500">Bounce:</span>
                <span className="text-purple-300 ml-1">{(materialProps.restitution * 100).toFixed(0)}%</span>
              </div>
              <div className="bg-gray-900/50 rounded p-2">
                <span className="text-gray-500">Friction:</span>
                <span className="text-purple-300 ml-1">{(materialProps.friction * 100).toFixed(0)}%</span>
              </div>
              <div className="bg-gray-900/50 rounded p-2">
                <span className="text-gray-500">Drag:</span>
                <span className="text-purple-300 ml-1">{(materialProps.drag * 100).toFixed(1)}%</span>
              </div>
              <div className="bg-gray-900/50 rounded p-2">
                <span className="text-gray-500">Material:</span>
                <span className="text-purple-300 ml-1 capitalize">{materialId}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-gray-800/30 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <ArrowDown className="w-4 h-4 text-purple-400" />
                  <Label className="text-sm text-gray-300">Gravity</Label>
                </div>
                <span className="text-xs text-purple-400 bg-gray-800 px-2 py-1 rounded font-mono">
                  {config.gravity.toFixed(1)} m/s²
                </span>
              </div>
              <Slider
                value={[config.gravity]}
                onValueChange={([value]) => onConfigChange({ ...config, gravity: value })}
                min={0}
                max={30}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Zero G</span>
                <span>Moon (1.6)</span>
                <span>Earth (9.8)</span>
                <span>Strong</span>
              </div>
            </div>

            <div className="bg-gray-800/30 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <Label className="text-sm text-gray-300">Throw Power</Label>
                </div>
                <span className="text-xs text-purple-400 bg-gray-800 px-2 py-1 rounded font-mono">
                  {config.throwMultiplier.toFixed(1)}x
                </span>
              </div>
              <Slider
                value={[config.throwMultiplier]}
                onValueChange={([value]) => onConfigChange({ ...config, throwMultiplier: value })}
                min={1}
                max={20}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Gentle</span>
                <span>Normal</span>
                <span>Strong</span>
              </div>
            </div>

            <div className="bg-gray-800/30 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <Label className="text-sm text-gray-300">Ground Level</Label>
                <span className="text-xs text-purple-400 bg-gray-800 px-2 py-1 rounded font-mono">
                  {config.groundLevel.toFixed(1)}
                </span>
              </div>
              <Slider
                value={[config.groundLevel]}
                onValueChange={([value]) => onConfigChange({ ...config, groundLevel: value })}
                min={-10}
                max={0}
                step={0.5}
                className="w-full"
              />
            </div>
          </div>

          <Button
            onClick={onReset}
            variant="outline"
            className="w-full bg-purple-500/20 border-purple-500/50 text-purple-300 hover:bg-purple-500/30"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Position
          </Button>

          <div className="bg-gray-800/30 rounded-lg p-3 border border-dashed border-purple-500/30">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-400 leading-relaxed">
                <strong className="text-purple-300">Drag</strong> the shape to grab it, 
                <strong className="text-purple-300"> release</strong> to throw. 
                Physics respond based on material properties - gems bounce high, 
                metals are heavy, energy forms float.
              </p>
            </div>
          </div>
        </div>
      )}

      {!config.enabled && (
        <div className="text-center py-8">
          <Hand className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-400">
            Enable to drag and throw shapes with realistic physics
          </p>
        </div>
      )}
    </div>
  );
}
