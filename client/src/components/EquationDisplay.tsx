import React from 'react';
import { SurfaceParameters } from '../types/math';
import { X } from 'lucide-react';

interface EquationDisplayProps {
  shapeName: string;
  parameters: SurfaceParameters;
  show: boolean;
  onToggle: () => void;
}

export default function EquationDisplay({ shapeName, parameters, show, onToggle }: EquationDisplayProps) {
  if (!show) {
    return (
      <button
        onClick={onToggle}
        className="fixed top-20 left-4 z-50 bg-black/80 hover:bg-black/90 text-white px-3 py-2 rounded-lg border border-purple-500/30 text-xs font-mono transition-colors"
        title="Show Mathematical Equations"
      >
        📐 Show Equations
      </button>
    );
  }

  const formatParam = (value: number | undefined): string => {
    if (value === undefined) return '1.00000';
    return value.toFixed(5);
  };

  return (
    <div className="fixed top-20 left-4 z-50 bg-black/90 backdrop-blur-sm text-white p-4 rounded-lg border border-purple-500/50 max-w-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-purple-300">📐 Parametric Equations</h3>
        <button 
          onClick={onToggle}
          className="text-gray-400 hover:text-white transition-colors"
          title="Hide equations"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="text-xs text-gray-300 mb-2 font-medium">
          {shapeName}
        </div>

        <div className="bg-purple-900/20 p-3 rounded border border-purple-500/30">
          <div className="font-mono text-xs space-y-1">
            <div className="text-purple-200">
              <span className="text-blue-300">x</span>(u,v) = f<sub>x</sub>(u, v, a, b, c, ...)
            </div>
            <div className="text-purple-200">
              <span className="text-green-300">y</span>(u,v) = f<sub>y</sub>(u, v, a, b, c, ...)
            </div>
            <div className="text-purple-200">
              <span className="text-yellow-300">z</span>(u,v) = f<sub>z</sub>(u, v, a, b, c, ...)
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-gray-400 font-semibold mb-1">Active Parameters:</div>
          <div className="grid grid-cols-2 gap-1 text-xs font-mono">
            <div className="flex justify-between bg-blue-900/20 px-2 py-1 rounded">
              <span className="text-blue-300">a (X-scale):</span>
              <span className="text-white">{formatParam(parameters.a)}</span>
            </div>
            <div className="flex justify-between bg-green-900/20 px-2 py-1 rounded">
              <span className="text-green-300">b (Y-scale):</span>
              <span className="text-white">{formatParam(parameters.b)}</span>
            </div>
            <div className="flex justify-between bg-yellow-900/20 px-2 py-1 rounded">
              <span className="text-yellow-300">c (Z-scale):</span>
              <span className="text-white">{formatParam(parameters.c)}</span>
            </div>
            <div className="flex justify-between bg-purple-900/20 px-2 py-1 rounded">
              <span className="text-purple-300">d (Depth):</span>
              <span className="text-white">{formatParam(parameters.d)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-gray-400 font-semibold mb-1">Transformations:</div>
          <div className="grid grid-cols-3 gap-1 text-xs font-mono">
            {parameters.g !== 0 && (
              <div className="bg-orange-900/20 px-2 py-1 rounded text-center">
                <div className="text-orange-300">g: {formatParam(parameters.g)}</div>
              </div>
            )}
            {parameters.h !== 0 && (
              <div className="bg-orange-900/20 px-2 py-1 rounded text-center">
                <div className="text-orange-300">h: {formatParam(parameters.h)}</div>
              </div>
            )}
            {parameters.i !== 0 && (
              <div className="bg-orange-900/20 px-2 py-1 rounded text-center">
                <div className="text-orange-300">i: {formatParam(parameters.i)}</div>
              </div>
            )}
            {parameters.j !== 0 && (
              <div className="bg-orange-900/20 px-2 py-1 rounded text-center">
                <div className="text-orange-300">j: {formatParam(parameters.j)}</div>
              </div>
            )}
            {parameters.k !== 0 && (
              <div className="bg-orange-900/20 px-2 py-1 rounded text-center">
                <div className="text-orange-300">k: {formatParam(parameters.k)}</div>
              </div>
            )}
            {parameters.l !== 0 && (
              <div className="bg-orange-900/20 px-2 py-1 rounded text-center">
                <div className="text-orange-300">l: {formatParam(parameters.l)}</div>
              </div>
            )}
            {parameters.m !== 0 && (
              <div className="bg-orange-900/20 px-2 py-1 rounded text-center">
                <div className="text-orange-300">m: {formatParam(parameters.m)}</div>
              </div>
            )}
          </div>
        </div>

        <div className="text-xs text-gray-500 pt-2 border-t border-purple-500/20">
          Domain: u ∈ [{formatParam(parameters.uMin)}, {formatParam(parameters.uMax)}], 
          v ∈ [{formatParam(parameters.vMin)}, {formatParam(parameters.vMax)}]
        </div>
      </div>
    </div>
  );
}
