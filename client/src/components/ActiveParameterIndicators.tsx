import React from 'react';
import { SurfaceParameters } from '../types/math';

interface ActiveParameterIndicatorsProps {
  parameters: SurfaceParameters;
}

const PARAMETER_DESCRIPTIONS: Record<string, { name: string; color: string }> = {
  'd': { name: 'Twist/Phase', color: 'bg-purple-500' },
  'e': { name: 'Wave Freq', color: 'bg-blue-500' },
  'f': { name: 'Bulge', color: 'bg-red-500' },
  'g': { name: 'Pinch', color: 'bg-yellow-500' },
  'h': { name: 'Morph', color: 'bg-green-500' },
  'i': { name: 'Facet', color: 'bg-pink-500' },
  'j': { name: 'Tilt', color: 'bg-indigo-500' },
  'k': { name: 'Ripple', color: 'bg-orange-500' },
  'l': { name: 'Spiral', color: 'bg-cyan-500' },
  'm': { name: 'Bend', color: 'bg-teal-500' },
};

export default function ActiveParameterIndicators({ parameters }: ActiveParameterIndicatorsProps) {
  const activeParams = Object.entries(PARAMETER_DESCRIPTIONS)
    .filter(([key]) => {
      const value = parameters[key as keyof SurfaceParameters];
      return typeof value === 'number' && Math.abs(value) > 0.01;
    })
    .map(([key, desc]) => ({
      key,
      ...desc,
      value: parameters[key as keyof SurfaceParameters] as number
    }));

  if (activeParams.length === 0) {
    return (
      <div className="mb-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-600 animate-pulse"></div>
          <span className="text-sm text-gray-400">
            No active transformations (D-M at zero)
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 p-3 bg-gray-900 rounded-lg border border-green-500/30">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
        <span className="text-sm font-semibold text-green-400">
          Active Transformations ({activeParams.length})
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {activeParams.map(({ key, name, color, value }) => (
          <div
            key={key}
            className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-full border border-gray-700"
          >
            <div className={`w-2 h-2 rounded-full ${color}`}></div>
            <span className="text-xs font-medium text-gray-200">
              {key.toUpperCase()}: {name}
            </span>
            <span className="text-xs text-gray-400">
              {value.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 text-xs text-gray-500">
        💡 Adjust D-M parameters to see dramatic geometric transformations
      </div>
    </div>
  );
}
