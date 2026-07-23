import React, { useState, useRef, useCallback } from 'react';
import { SurfaceParameters } from '../types/math';
import { PARAMETER_RANGES, validateParameterRange } from '../lib/parameterProcessor';
import { PARAMETER_SPECS } from '../lib/parameterAuthority';
import ActiveParameterIndicators from './ActiveParameterIndicators';
import { 
  getShapeSensitivity, 
  applyDampening, 
  getDampenedSliderStep,
  getSensitivityColor,
  getSensitivityBgColor,
  SensitivityLevel
} from '../lib/shapeSensitivityEngine';

interface ComprehensiveParameterPanelProps {
  parameters: SurfaceParameters;
  onParameterChange: (newParams: Partial<SurfaceParameters>) => void;
  currentShape?: string;
  onShapeChange?: (shape: string) => void;
  onReset?: () => void;
}

const SENSITIVITY_LABELS: Record<SensitivityLevel, string> = {
  stable: '🟢 Stable - Full slider range',
  responsive: '🔵 Responsive - Moderate sensitivity',
  sensitive: '🟡 Sensitive - Careful adjustments recommended',
  chaotic: '🔴 Chaotic - Parameters dampened for stability'
};

const getParameterLabel = (paramName: string): string => {
  const labelMap: Record<string, string> = {
    'rotation': 'Rotate',
    'frequency': 'Freq',
    'amplitude': 'Amp',
    'rotationX': 'RotX',
    'rotationY': 'RotY',
    'rotationZ': 'RotZ',
    'a': 'A', 'b': 'B', 'c': 'C',
    'd': 'PHI (φ)', 'e': 'PI (π)', 'f': 'O(n)', 'g': 'TESS', 'h': 'MIR-X', 'i': 'MIR-Y', 'j': 'MIR-Z', 'k': 'INT', 'l': 'EXT', 'm': 'SMOOTH',
    'n': 'N',
    'o': 'O', 'p': 'P', 'q': 'Q',
    'r': 'R', 's': 'S', 't': 'T', 'u': 'U', 'v': 'V', 'w': 'W'
  };
  return labelMap[paramName] || paramName.toUpperCase();
};

export default function ComprehensiveParameterPanel({
  parameters,
  onParameterChange,
  currentShape,
  onShapeChange,
  onReset
}: ComprehensiveParameterPanelProps) {
  const previousValues = useRef<Record<string, number>>({});
  const shapeType = parameters.type || 'sphere';
  const sensitivityProfile = getShapeSensitivity(shapeType);
  
  const handleSliderChange = useCallback((param: keyof SurfaceParameters, value: number) => {
    const prevValue = previousValues.current[param] ?? value;
    
    let finalValue: number;
    if (sensitivityProfile.level === 'chaotic' || sensitivityProfile.level === 'sensitive') {
      finalValue = applyDampening(value, prevValue, shapeType);
    } else {
      finalValue = value;
    }
    
    const validatedValue = validateParameterRange(param as any, finalValue);
    previousValues.current[param] = validatedValue;
    onParameterChange({ [param]: validatedValue });
  }, [shapeType, sensitivityProfile.level, onParameterChange]);

  const createSlider = (param: keyof SurfaceParameters) => {
    const range = PARAMETER_RANGES[param as keyof typeof PARAMETER_RANGES];
    if (!range) return null;

    const value = parameters[param] !== undefined ? Number(parameters[param]) : range.default;
    // Use 4-decimal precision from PARAMETER_SPECS if available
    const paramSpec = PARAMETER_SPECS[param as keyof typeof PARAMETER_SPECS];
    const step = paramSpec?.step ?? 0.0001;

    // Special handling for 'g' parameter for G Mod 6
    if (param === 'g') {
      const gValue = parameters.g !== undefined ? Number(parameters.g) : range.default;
      const gStep = 0.0001; // 4-decimal precision for G Mod 6
      const gMax = 6; // Specific max for G Mod 6

      return (
        <div key={param} className="mb-3 p-2 bg-gray-900 rounded-lg border border-gray-700">
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-200">
              G Mod 6 Cycle (g)
            </label>
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
              {gValue.toFixed(5)} (State: {Math.floor(gValue) % 6})
            </span>
          </div>
          <input
            type="range"
            min={range.min}
            max={gMax}
            step={gStep}
            value={gValue}
            onChange={(e) => handleSliderChange(param, parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="gmod6-state-indicator mt-2">
            <div className="state-dots flex justify-between">
              {[0, 1, 2, 3, 4, 5].map(state => (
                <div
                  key={state}
                  className={`state-dot w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-all duration-300 ${Math.floor(gValue) % 6 === state ? 'active bg-green-500 text-white shadow-md' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                  style={{
                    backgroundColor: Math.floor(gValue) % 6 === state ? `hsl(${state * 60}, 80%, 60%)` : `hsl(${state * 60}, 30%, 40%)`
                  }}
                  onClick={() => handleSliderChange(param, state)} // Allow clicking on state to jump
                >
                  {state}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Default slider creation for other parameters with 4-decimal precision
    return (
      <div key={param} className="mb-3 p-2 bg-gray-900 rounded-lg border border-gray-700">
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium text-gray-200">
            {getParameterLabel(param)} • {range.label}
          </label>
          <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
            {value.toFixed(5)}
          </span>
        </div>
        <input
          type="range"
          min={range.min}
          max={range.max}
          step={step}
          value={value}
          onChange={(e) => handleSliderChange(param, parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{range.min}</span>
          <span>{range.max}</span>
        </div>
      </div>
    );
  };

  // Group parameters by category
  // STANDBY: D-Z parameters temporarily disabled to fix shape rendering
  const geometryParams = ['a', 'b', 'c'] as const; // Only core A, B, C active
  // const geometryParamsStandby = ['d', 'e', 'f', 'h', 'i', 'j', 'k', 'l', 'm', 'n'] as const; // STANDBY
  // const visualParams = ['o', 'p', 'q'] as const; // STANDBY
  // const simulationParams = ['r', 's', 't', 'u', 'v', 'w'] as const; // STANDBY

  const sensitivityColor = getSensitivityColor(sensitivityProfile.level);
  const sensitivityBg = getSensitivityBgColor(sensitivityProfile.level);

  return (
    <div className="max-h-96 overflow-y-auto bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-bold text-green-400 mb-2">
        🎛️ 26-Parameter Control System
      </h3>
      
      <div className={`mb-4 p-2 rounded-lg border ${sensitivityBg} border-opacity-50`}>
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${sensitivityColor}`}>
            {SENSITIVITY_LABELS[sensitivityProfile.level]}
          </span>
          <span className="text-xs text-gray-400">
            Damping: {sensitivityProfile.dampingFactor}x
          </span>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Recommended: {sensitivityProfile.recommendedScale.charAt(0).toUpperCase() + sensitivityProfile.recommendedScale.slice(1)} scale
        </div>
      </div>

      <ActiveParameterIndicators parameters={parameters} />

      {/* TRANSFORM CONTROLS - Rotation, Flip, Auto-Scale - MOVED TO TOP FOR VISIBILITY */}
      <div className="mb-6 p-3 bg-gradient-to-r from-pink-900/40 to-purple-900/40 rounded-lg border-2 border-pink-500/50">
        <h4 className="text-md font-semibold text-pink-400 mb-3">
          🔄 Transform Controls - Rotate, Flip & Scale
        </h4>
        <div className="text-xs text-gray-400 mb-2">
          Rotate shape around axes, flip/mirror, and auto-normalize size
        </div>

        {/* Rotation Controls */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="p-2 bg-gray-900 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-gray-200">Rot X</label>
              <span className="text-xs text-gray-400">{(parameters.rotationX ?? 0)}°</span>
            </div>
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={parameters.rotationX ?? 0}
              onChange={(e) => onParameterChange({ rotationX: parseFloat(e.target.value) })}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <div className="p-2 bg-gray-900 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-gray-200">Rot Y</label>
              <span className="text-xs text-gray-400">{(parameters.rotationY ?? 0)}°</span>
            </div>
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={parameters.rotationY ?? 0}
              onChange={(e) => onParameterChange({ rotationY: parseFloat(e.target.value) })}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <div className="p-2 bg-gray-900 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-gray-200">Rot Z</label>
              <span className="text-xs text-gray-400">{(parameters.rotationZ ?? 0)}°</span>
            </div>
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={parameters.rotationZ ?? 0}
              onChange={(e) => onParameterChange({ rotationZ: parseFloat(e.target.value) })}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>

        {/* Flip/Mirror Toggles */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <button
            onClick={() => onParameterChange({ flipX: !parameters.flipX })}
            className={`p-2 rounded-lg border text-xs font-medium transition-all ${
              parameters.flipX 
                ? 'bg-pink-600 border-pink-400 text-white' 
                : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
            }`}
          >
            ↔ Flip X
          </button>
          <button
            onClick={() => onParameterChange({ flipY: !parameters.flipY })}
            className={`p-2 rounded-lg border text-xs font-medium transition-all ${
              parameters.flipY 
                ? 'bg-pink-600 border-pink-400 text-white' 
                : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
            }`}
          >
            ↕ Flip Y
          </button>
          <button
            onClick={() => onParameterChange({ flipZ: !parameters.flipZ })}
            className={`p-2 rounded-lg border text-xs font-medium transition-all ${
              parameters.flipZ 
                ? 'bg-pink-600 border-pink-400 text-white' 
                : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
            }`}
          >
            ⬌ Flip Z
          </button>
        </div>

        {/* Auto-Scale Toggle */}
        <div className="p-2 bg-gray-900 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-200">Auto-Scale</label>
            <button
              onClick={() => onParameterChange({ autoScale: !parameters.autoScale })}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                parameters.autoScale 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {parameters.autoScale ? 'ON' : 'OFF'}
            </button>
          </div>
          {parameters.autoScale && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-gray-400">Target Scale</label>
                <span className="text-xs text-gray-400">{(parameters.targetScale ?? 3).toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={10}
                step={0.1}
                value={parameters.targetScale ?? 3}
                onChange={(e) => onParameterChange({ targetScale: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          )}
        </div>
      </div>

      {/* CORE GEOMETRY PARAMETERS (A-C) - Primary Shape Controls */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-blue-400 mb-3">
          🔷 Core Parameters (A, B, C)
        </h4>
        <div className="text-xs text-gray-400 mb-2">
          <strong>A:</strong> X-axis scale | <strong>B:</strong> Y-axis scale | <strong>C:</strong> Z-axis scale
        </div>
        {geometryParams.map(param => createSlider(param as keyof SurfaceParameters))}
      </div>

      {/* STANDBY: D-Z parameters hidden to fix shape rendering
      <div className="mb-6">
        <h4 className="text-md font-semibold text-purple-400 mb-3">
          🟣 G Mod 6 Parameter (g) - Periodic Behavior Control
        </h4>
        {createSlider('g' as keyof SurfaceParameters)}
      </div>

      <div className="mb-6">
        <h4 className="text-md font-semibold text-pink-400 mb-3">
          🎨 Visual Parameters (O-Q)
        </h4>
        {visualParams.map(param => createSlider(param as keyof SurfaceParameters))}
      </div>

      <div className="mb-6">
        <h4 className="text-md font-semibold text-orange-400 mb-3">
          ⚡ Simulation Parameters (R-W)
        </h4>
        {simulationParams.map(param => createSlider(param as keyof SurfaceParameters))}
      </div>
      */}

      {/* Parametric Domain Controls */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-cyan-400 mb-3">
          📐 Parametric Domain (U & V Range)
        </h4>
        <div className="text-xs text-gray-400 mb-2">
          Control the sampling range for parametric surface generation (separate from A/B/C geometry)
        </div>

        <div className="mb-3 p-2 bg-gray-900 rounded-lg border border-gray-700">
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-200">U Min (°)</label>
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
              {Math.round(parameters.uMin ?? 0)}°
            </span>
          </div>
          <input
            type="range"
            min={-180}
            max={180}
            step={1}
            value={parameters.uMin ?? 0}
            onChange={(e) => onParameterChange({ uMin: parseFloat(e.target.value) })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div className="mb-3 p-2 bg-gray-900 rounded-lg border border-gray-700">
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-200">U Max (°)</label>
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
              {Math.round(parameters.uMax ?? 1)}°
            </span>
          </div>
          <input
            type="range"
            min={-180}
            max={180}
            step={1}
            value={parameters.uMax ?? 1}
            onChange={(e) => onParameterChange({ uMax: parseFloat(e.target.value) })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div className="mb-3 p-2 bg-gray-900 rounded-lg border border-gray-700">
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-200">V Min (°)</label>
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
              {Math.round(parameters.vMin ?? 0)}°
            </span>
          </div>
          <input
            type="range"
            min={-180}
            max={180}
            step={1}
            value={parameters.vMin ?? 0}
            onChange={(e) => onParameterChange({ vMin: parseFloat(e.target.value) })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div className="mb-3 p-2 bg-gray-900 rounded-lg border border-gray-700">
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-200">V Max (°)</label>
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
              {Math.round(parameters.vMax ?? 1)}°
            </span>
          </div>
          <input
            type="range"
            min={-180}
            max={180}
            step={1}
            value={parameters.vMax ?? 1}
            onChange={(e) => onParameterChange({ vMax: parseFloat(e.target.value) })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      <div className="mt-6 p-3 bg-cyan-900/30 rounded-lg border border-cyan-500/30">
        <div className="text-xs text-cyan-200">
          💡 <strong>Key Difference:</strong><br />
          • <strong>A/B/C</strong> (Geometry) = Control shape SIZE and DIMENSIONS<br />
          • <strong>U/V Range</strong> (Parametric) = Control surface SAMPLING range<br />
          These are independent controls with different purposes!
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #00ff88;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #00ff88;
          cursor: pointer;
          border: none;
        }
        .gmod6-state-indicator .state-dots {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
        }
        .gmod6-state-indicator .state-dot {
          transition: background-color 0.3s ease, transform 0.3s ease;
        }
        .gmod6-state-indicator .state-dot.active {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
}