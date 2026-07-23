/**
 * PRECISION PARAMETER CONTROL
 * Rifle-grade parameter tuning with:
 * - 2 parameters per row (grid layout)
 * - Step sizes from PARAMETER_SPECS
 * - Fine/Coarse precision toggle (Shift key = 5x finer)
 * - 60Hz throttled updates for smooth manipulation
 * - Visual feedback for precision mode
 */

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { PARAMETER_SPECS, ParameterKey, useParameterAuthority } from "../lib/parameterAuthority";

interface ParameterControlProps {
  paramKey: ParameterKey;
  value: number;
  onChange: (key: ParameterKey, value: number) => void;
  label?: string;
  color?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// PARAMETER LABELS - D-M: 10 Advanced Morphing Controls (Topology-Transforming)
// ═══════════════════════════════════════════════════════════════════════════
const PARAM_LABELS: Record<ParameterKey, { short: string; desc: string; color: string }> = {
  // A-C: Global Scale (blue)
  a: { short: 'A', desc: 'X Scale', color: 'text-blue-400' },
  b: { short: 'B', desc: 'Y Scale', color: 'text-blue-400' },
  c: { short: 'C', desc: 'Z Scale', color: 'text-blue-400' },
  
  // D-M: 10 ADVANCED MORPHING CONTROLS - Dramatic topology transformations
  d: { short: 'D', desc: 'Torsion φ', color: 'text-purple-400' },   // Helical spiral twist
  e: { short: 'E', desc: 'Bulge β', color: 'text-purple-300' },     // Radial bulge/pinch
  f: { short: 'F', desc: 'Wave ω', color: 'text-cyan-400' },        // Fourier harmonic waves
  g: { short: 'G', desc: 'Invert ι', color: 'text-red-400' },       // Sphere inversion flip
  h: { short: 'H', desc: 'Taper τ', color: 'text-orange-400' },     // Pyramid/funnel taper
  i: { short: 'I', desc: 'Mirror σ', color: 'text-pink-400' },      // Symmetry plane mirror
  j: { short: 'J', desc: 'Stellar ε', color: 'text-yellow-400' },   // Spiky star extrusion
  k: { short: 'K', desc: 'Gyro γ', color: 'text-amber-400' },       // Gyroscopic multi-spin
  l: { short: 'L', desc: 'Curve κ', color: 'text-emerald-400' },    // Curvature envelope
  m: { short: 'M', desc: 'Fractal δ', color: 'text-violet-400' },   // Recursive fractal
  
  // N-O: Minimal Surfaces (pink)
  n: { short: 'N', desc: 'Minimal', color: 'text-pink-400' },
  o: { short: 'O', desc: 'Topology', color: 'text-pink-400' },
  
  // P-Q: Waveforms (cyan)
  p: { short: 'P', desc: 'Wave-A', color: 'text-cyan-400' },
  q: { short: 'Q', desc: 'Wave-B', color: 'text-cyan-400' },
  
  // R-S: Twist/Special (red)
  r: { short: 'R', desc: 'Twist-A', color: 'text-red-400' },
  s: { short: 'S', desc: 'Twist-B', color: 'text-red-400' },
  
  // T-U: Golden Ratio (amber)
  t: { short: 'T', desc: 'Phi-A', color: 'text-amber-400' },
  u: { short: 'U', desc: 'Phi-B', color: 'text-amber-400' },
  
  // V-W: Fractals (violet)
  v: { short: 'V', desc: 'Fractal', color: 'text-violet-400' },
  w: { short: 'W', desc: 'Noise', color: 'text-violet-400' },
  
  // X-Y-Z: Axis Offsets (emerald)
  x: { short: 'X', desc: 'X Offset', color: 'text-emerald-400' },
  y: { short: 'Y', desc: 'Y Offset', color: 'text-emerald-400' },
  z: { short: 'Z', desc: 'Z Offset', color: 'text-emerald-400' },
  
  // UV Domain & Mesh (gray)
  uMin: { short: 'uMin', desc: 'U Min', color: 'text-gray-400' },
  uMax: { short: 'uMax', desc: 'U Max', color: 'text-gray-400' },
  vMin: { short: 'vMin', desc: 'V Min', color: 'text-gray-400' },
  vMax: { short: 'vMax', desc: 'V Max', color: 'text-gray-400' },
  uSegments: { short: 'uSeg', desc: 'U Segments', color: 'text-gray-400' },
  vSegments: { short: 'vSeg', desc: 'V Segments', color: 'text-gray-400' },
};

function SingleParameterControl({ paramKey, value, onChange, label, color }: ParameterControlProps) {
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const throttleRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  
  const spec = PARAMETER_SPECS[paramKey];
  const paramLabel = PARAM_LABELS[paramKey];
  
  const baseStep = spec.step;
  const fineStep = baseStep / 5;
  const currentStep = isShiftPressed ? fineStep : baseStep;
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setIsShiftPressed(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setIsShiftPressed(false);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  
  const handleChange = useCallback((newValue: number[]) => {
    const val = newValue[0];
    setLocalValue(val);
    
    const now = performance.now();
    const elapsed = now - lastUpdateRef.current;
    
    if (elapsed >= 16.67) {
      onChange(paramKey, val);
      lastUpdateRef.current = now;
    } else {
      if (throttleRef.current) {
        cancelAnimationFrame(throttleRef.current);
      }
      throttleRef.current = requestAnimationFrame(() => {
        onChange(paramKey, val);
        lastUpdateRef.current = performance.now();
      });
    }
  }, [paramKey, onChange]);
  
  const handleReset = useCallback(() => {
    const defaultVal = spec.default;
    setLocalValue(defaultVal);
    onChange(paramKey, defaultVal);
  }, [paramKey, spec.default, onChange]);
  
  const isModified = Math.abs(localValue - spec.default) > 0.5;
  // Use whole numbers for A, B, C (step = 1)
  const precision = spec.step >= 1 ? 0 : Math.max(0, -Math.floor(Math.log10(spec.step)));
  
  return (
    <div className="space-y-1 p-2 bg-gray-900/50 rounded-lg border border-gray-700/50">
      <div className="flex justify-between items-center">
        <Label className={`text-[10px] uppercase font-bold ${paramLabel.color} tracking-wide flex items-center gap-1`}>
          {paramLabel.short} • {paramLabel.desc}
          {isModified && <span className="text-cyan-400 text-xs">●</span>}
          {isShiftPressed && <span className="text-yellow-400 text-[8px] ml-1">FINE</span>}
        </Label>
        <span className="text-[9px] text-gray-500">
          step: {currentStep.toFixed(4)}
        </span>
      </div>
      
      <Slider
        value={[localValue]}
        onValueChange={handleChange}
        min={spec.min}
        max={spec.max}
        step={currentStep}
        className="w-full"
      />
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400 font-mono">
          {localValue.toFixed(precision)}
        </span>
        {isModified && (
          <button 
            onClick={handleReset}
            className="text-[10px] text-cyan-400 hover:text-cyan-300 underline"
            title={`Reset to ${spec.default}`}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

interface PrecisionParameterGridProps {
  parameters: Record<string, number>;
  onChange: (key: string, value: number) => void;
  parameterKeys?: ParameterKey[];
  columns?: 2 | 3;
}

export default function PrecisionParameterGrid({ 
  parameters, 
  onChange, 
  parameterKeys,
  columns = 2 
}: PrecisionParameterGridProps) {
  // FULL A-M PARAMETERS: Core (A-C) + Expansion (D-M)
  const coreKeys: ParameterKey[] = ['a', 'b', 'c'];
  const expansionKeys: ParameterKey[] = ['d', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'];
  const allKeys: ParameterKey[] = parameterKeys || [...coreKeys, ...expansionKeys];
  
  const handleChange = useCallback((key: ParameterKey, value: number) => {
    onChange(key, value);
  }, [onChange]);
  
  const gridClass = columns === 2 ? 'grid-cols-2' : 'grid-cols-3';
  
  return (
    <div className="space-y-3">
      {/* Core Parameters A-C */}
      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <Label className="text-xs font-medium text-blue-400">
            Core Scale (A-C)
          </Label>
          <span className="text-[9px] text-gray-500">
            SHIFT = fine precision
          </span>
        </div>
        <div className={`grid ${gridClass} gap-2`}>
          {coreKeys.map((key) => (
            <SingleParameterControl
              key={key}
              paramKey={key}
              value={parameters[key] ?? PARAMETER_SPECS[key].default}
              onChange={handleChange}
            />
          ))}
        </div>
      </div>
      
      {/* Advanced Morphing Parameters D-M */}
      <div className="space-y-2 border-t border-gray-700/50 pt-3">
        <div className="flex justify-between items-center px-1">
          <Label className="text-xs font-medium text-purple-400">
            Morphing Controls (D-M)
          </Label>
          <span className="text-[9px] text-purple-300/60">
            Torsion • Bulge • Invert • Fractal
          </span>
        </div>
        <div className={`grid ${gridClass} gap-2`}>
          {expansionKeys.map((key) => (
            <SingleParameterControl
              key={key}
              paramKey={key}
              value={parameters[key] ?? PARAMETER_SPECS[key].default}
              onChange={handleChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function PrecisionParameterRow({ 
  param1, 
  param2,
  parameters,
  onChange 
}: { 
  param1: ParameterKey; 
  param2: ParameterKey;
  parameters: Record<string, number>;
  onChange: (key: string, value: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <SingleParameterControl
        paramKey={param1}
        value={parameters[param1] ?? PARAMETER_SPECS[param1].default}
        onChange={onChange}
      />
      <SingleParameterControl
        paramKey={param2}
        value={parameters[param2] ?? PARAMETER_SPECS[param2].default}
        onChange={onChange}
      />
    </div>
  );
}

export { SingleParameterControl };
