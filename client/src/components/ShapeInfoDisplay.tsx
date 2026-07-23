import React from 'react';
import { SurfaceParameters } from '../types/math';
import { getShapeInfo, getShapeMathBasis, getShapeDescription } from '../lib/shapeInfo';
import { getSensitivityColor, getSensitivityBgColor } from '../lib/shapeSensitivityEngine';

function formatSensitivityLabel(level: string): string {
  const labels: Record<string, string> = {
    stable: '🟢 Stable',
    responsive: '🔵 Responsive',
    sensitive: '🟡 Sensitive',
    chaotic: '🔴 Chaotic'
  };
  return labels[level] || level;
}

interface ShapeInfoDisplayProps {
  parameters: SurfaceParameters;
  className?: string;
}

export default function ShapeInfoDisplay({ parameters, className = "" }: ShapeInfoDisplayProps) {
  const shapeInfo = getShapeInfo(parameters.type, parameters);
  const mathBasis = getShapeMathBasis(parameters.type);
  const description = getShapeDescription(parameters.type);
  
  const sensitivityColor = getSensitivityColor(shapeInfo.sensitivity);
  const sensitivityBg = getSensitivityBgColor(shapeInfo.sensitivity);

  return (
    <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90vw] max-w-7xl bg-black/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-cyan-300 text-white z-10 ${className}`}>
      <div className="flex items-center justify-between space-x-4 text-xs">
        <div className="flex items-center space-x-3 flex-shrink-0 font-mono">
          <span className="text-cyan-300 font-bold">{shapeInfo.name}</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] ${sensitivityBg} ${sensitivityColor}`}>
            {formatSensitivityLabel(shapeInfo.sensitivity)}
          </span>
        </div>

        <div className="flex-1 text-blue-300 font-mono text-center truncate px-2" title={mathBasis}>
          <span className="text-gray-400 text-[10px]">Formula: </span>
          {mathBasis}
        </div>

        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="text-gray-400 max-w-[150px] truncate text-[10px]" title={description}>
            {description}
          </div>
          <div className="text-green-300 font-mono whitespace-nowrap text-[10px]">
            UV: [{parameters.uMin.toFixed(1)}, {parameters.uMax.toFixed(1)}] × [{parameters.vMin.toFixed(1)}, {parameters.vMax.toFixed(1)}]
          </div>
          <div className="text-purple-300 font-mono whitespace-nowrap text-[10px]">
            {parameters.uSegments}×{parameters.vSegments}
          </div>
        </div>
      </div>
    </div>
  );
}
