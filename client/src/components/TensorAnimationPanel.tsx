import React from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type TensorAnimType = 'spin' | 'precession' | 'tumble' | 'stable' | 'gyroscope' | 'tensor';
type DynamicsMode = 'rigid' | 'soft';

interface TensorAnimationPanelProps {
  isAnimating: boolean;
  animationType: TensorAnimType;
  animationVelocity: number;
  breatheIntensity: number;
  dynamicsMode: DynamicsMode;
  onToggle: () => void;
  onTypeChange: (type: TensorAnimType) => void;
  onVelocityChange: (velocity: number) => void;
  onBreatheIntensityChange: (intensity: number) => void;
  onDynamicsModeChange: (mode: DynamicsMode) => void;
}

const ANIM_MODES: { value: TensorAnimType; label: string; description: string }[] = [
  { value: 'tensor',     label: '🧮 Tensor Spin',   description: 'Principal-axis orientation tour with inertia tensor' },
  { value: 'gyroscope',  label: '🌀 Gyroscope',     description: 'Gyroscopic precession through principal axes' },
  { value: 'spin',       label: '💫 Breathe Spin',  description: 'Radial breathing + Y-rotation' },
  { value: 'precession', label: '🔄 Precession',    description: 'Axial precession with surface waves' },
  { value: 'tumble',     label: '🎲 Tumble',        description: 'Multi-axis chaotic rotation' },
  { value: 'stable',     label: '⚓ Stable',        description: 'Low-energy standing-wave morph' },
];

export default function TensorAnimationPanel({
  isAnimating,
  animationType,
  animationVelocity,
  breatheIntensity,
  dynamicsMode,
  onToggle,
  onTypeChange,
  onVelocityChange,
  onBreatheIntensityChange,
  onDynamicsModeChange,
}: TensorAnimationPanelProps) {
  const currentMode = ANIM_MODES.find(m => m.value === animationType) ?? ANIM_MODES[0];

  return (
    <div className="space-y-2 bg-gray-800/50 p-3 rounded-lg border-2 border-teal-500/20">
      <Label className="text-xs font-semibold text-teal-400 uppercase tracking-wide flex items-center gap-1">
        🧮 Animation
      </Label>

      <div className="flex gap-2 items-center">
        <Button
          size="sm"
          onClick={onToggle}
          className={`h-8 text-xs font-bold flex-1 ${
            isAnimating
              ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 border-red-500/40'
              : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 border-teal-500/40'
          } border text-white`}
        >
          {isAnimating ? '⏸ Stop' : '▶ Animate'}
        </Button>

        <Select
          value={animationType}
          onValueChange={(v) => onTypeChange(v as TensorAnimType)}
        >
          <SelectTrigger className="h-8 text-xs bg-gray-800/90 border border-teal-500/30 text-teal-200 flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border border-teal-500/30 text-teal-200">
            {ANIM_MODES.map(m => (
              <SelectItem key={m.value} value={m.value} className="text-xs">
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isAnimating && (
        <div className="space-y-2">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <Label className="text-xs text-cyan-400">Speed</Label>
              <span className="text-cyan-200 font-mono text-xs">{animationVelocity.toFixed(1)}×</span>
            </div>
            <Slider
              value={[animationVelocity]}
              onValueChange={(v) => onVelocityChange(v[0])}
              min={0.1}
              max={3.0}
              step={0.1}
              className="w-full"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <Label className="text-xs text-purple-400">Breathe Intensity</Label>
              <span className="text-purple-200 font-mono text-xs">{Math.round(breatheIntensity * 100)}%</span>
            </div>
            <Slider
              value={[breatheIntensity]}
              onValueChange={(v) => onBreatheIntensityChange(v[0])}
              min={0.0}
              max={1.0}
              step={0.05}
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-xs text-amber-400 flex-1">Dynamics Mode</Label>
            <div className="flex gap-1">
              <button
                onClick={() => onDynamicsModeChange('soft')}
                className={`px-2 py-1 text-[10px] rounded border transition-colors ${
                  dynamicsMode === 'soft'
                    ? 'bg-amber-600/80 border-amber-500 text-white'
                    : 'bg-gray-700/50 border-gray-600 text-gray-400 hover:border-amber-500/50'
                }`}
              >
                🌊 Soft
              </button>
              <button
                onClick={() => onDynamicsModeChange('rigid')}
                className={`px-2 py-1 text-[10px] rounded border transition-colors ${
                  dynamicsMode === 'rigid'
                    ? 'bg-amber-600/80 border-amber-500 text-white'
                    : 'bg-gray-700/50 border-gray-600 text-gray-400 hover:border-amber-500/50'
                }`}
              >
                🪨 Rigid
              </button>
            </div>
          </div>

          <p className="text-[10px] text-teal-300/60">{currentMode.description}</p>
        </div>
      )}
    </div>
  );
}
