import React, { useState, useEffect } from 'react';
import { SurfaceParameters } from '../types/math';
import { getCleanSurface } from '../lib/cleanMathEngine';

interface MathematicalOverlayProps {
  parameters: SurfaceParameters;
  isVisible: boolean;
  position: { x: number; y: number; z: number };
}

export default function MathematicalOverlay({ parameters, isVisible, position }: MathematicalOverlayProps) {
  const [currentEquation, setCurrentEquation] = useState<string>('');
  const [scaleAnalysis, setScaleAnalysis] = useState<any>({});
  const [decimalPrecision, setDecimalPrecision] = useState<any>({});

  // **Product of UUON Foundation, no undocumented reproduction or any use without written consent.**
  // **Author: Phillip A. Ruiz III, Organization: UUON Foundation Inc.**
  // **Contact: www.uuonfoundation.com, phi1@uuonfoundation.com, @uuon.foundation**

  useEffect(() => {
    if (!parameters.type) return;

    const surface = getCleanSurface(parameters.type);
    if (surface) {
      // Extract equation function as string
      const equationString = surface.equation.toString();
      setCurrentEquation(equationString);

      // Analyze scale
      analyzeScale();
      analyzeDecimalPrecision();
    }
  }, [parameters]);

  const analyzeScale = () => {
    const dimensions = {
      a: parameters.a || 1,
      b: parameters.b || 1,
      c: parameters.c || 1
    };

    const maxDimension = Math.max(dimensions.a, dimensions.b, dimensions.c);
    const volume = dimensions.a * dimensions.b * dimensions.c;

    let scaleType = '';
    let unitType = '';
    
    if (maxDimension < 0.001) {
      scaleType = 'MICRO';
      unitType = 'micrometers (μm)';
    } else if (maxDimension < 1) {
      scaleType = 'MESO';
      unitType = 'millimeters (mm)';
    } else if (maxDimension < 1000) {
      scaleType = 'MACRO';
      unitType = 'meters (m)';
    } else {
      scaleType = 'COSMIC';
      unitType = 'kilometers (km)';
    }

    setScaleAnalysis({
      type: scaleType,
      unit: unitType,
      maxDimension,
      volume,
      depth: Math.abs(position.z),
      surfaceArea: 2 * (dimensions.a * dimensions.b + dimensions.b * dimensions.c + dimensions.a * dimensions.c)
    });
  };

  const analyzeDecimalPrecision = () => {
    const precision: Record<string, any> = {};
    Object.entries(parameters).forEach(([key, value]) => {
      if (typeof value === 'number') {
        const decimalPlaces = value.toString().split('.')[1]?.length || 0;
        const significantDigits = value.toPrecision(10);
        precision[key] = {
          value,
          decimalPlaces,
          significantDigits,
          exponentialForm: value.toExponential(5)
        };
      }
    });
    setDecimalPrecision(precision);
  };

  const extractParametricEquations = (eq: string) => {
    const formatExpr = (expr: string) => {
      return expr
        .replace(/Math\./g, '')
        .replace(/params\./g, '')
        .replace(/\s+/g, ' ')
        .trim();
    };

    // Smart comma-splitting that respects bracket depth
    const splitComponents = (str: string): string[] => {
      const components: string[] = [];
      let current = '';
      let depth = 0;
      
      for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (char === '(' || char === '[' || char === '{') depth++;
        if (char === ')' || char === ']' || char === '}') depth--;
        
        if (char === ',' && depth === 0) {
          components.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      if (current.trim()) components.push(current.trim());
      return components;
    };

    // Build variable lookup map from const/let assignments
    const varMap: Record<string, string> = {};
    const varMatches = eq.matchAll(/(?:const|let)\s+(\w+)\s*=\s*([^;]+);/g);
    for (const match of varMatches) {
      varMap[match[1]] = match[2];
    }

    // Resolve variable name to its expression
    const resolveVar = (name: string): string => {
      const trimmed = name.trim();
      // If it's just a variable name and we have it in our map, use the expression
      if (/^\w+$/.test(trimmed) && varMap[trimmed]) {
        return varMap[trimmed];
      }
      return trimmed;
    };
    
    // Strategy 1: Extract from return statement [x, y, z] with bracket-aware parsing
    const returnMatch = eq.match(/return\s*\[([^\]]+(?:\][^\]]*)*)\]/);
    if (returnMatch) {
      const components = splitComponents(returnMatch[1]);
      if (components.length >= 3) {
        return {
          x: formatExpr(resolveVar(components[0])),
          y: formatExpr(resolveVar(components[1])),
          z: formatExpr(resolveVar(components[2]))
        };
      }
    }
    
    // Strategy 2: Extract from const/let assignments
    if (varMap.x || varMap.y || varMap.z) {
      return {
        x: varMap.x ? formatExpr(varMap.x) : 'u',
        y: varMap.y ? formatExpr(varMap.y) : 'v',
        z: varMap.z ? formatExpr(varMap.z) : '0'
      };
    }
    
    // Fallback
    return {
      x: 'u',
      y: 'v',
      z: '0'
    };
  };

  const formatEquation = (eq: string) => {
    return eq
      .replace(/Math\./g, '')
      .replace(/params\./g, '')
      .replace(/const /g, '')
      .replace(/return \[([^\]]+)\];/, 'r⃗ = [$1]')
      .slice(0, 200) + '...';
  };

  if (!isVisible) return null;

  const equations = extractParametricEquations(currentEquation);

  return (
    <div className="fixed top-4 left-4 w-96 bg-black/90 text-green-400 p-4 rounded-lg border border-green-500 font-mono text-xs z-50 backdrop-blur-sm">
      {/* UUON Foundation Header */}
      <div className="text-center mb-3 border-b border-green-500 pb-2">
        <div className="text-yellow-400 font-bold">🔮 UUON FOUNDATION MATHEMATICAL ENGINE</div>
        <div className="text-xs text-gray-300">Product of UUON Foundation Inc. | phi1@uuonfoundation.com</div>
      </div>

      {/* Live Parametric Equations - ACTUAL MATH */}
      <div className="mb-4">
        <div className="text-cyan-400 font-bold mb-1">📐 PARAMETRIC EQUATIONS:</div>
        <div className="bg-gray-900 p-3 rounded border border-cyan-500/30 text-[11px] space-y-2">
          <div>
            <span className="text-yellow-400 font-bold">x(u,v) = </span>
            <span className="text-green-300">{equations.x}</span>
          </div>
          <div>
            <span className="text-yellow-400 font-bold">y(u,v) = </span>
            <span className="text-green-300">{equations.y}</span>
          </div>
          <div>
            <span className="text-yellow-400 font-bold">z(u,v) = </span>
            <span className="text-green-300">{equations.z}</span>
          </div>
          <div className="text-gray-400 text-[9px] mt-2 pt-2 border-t border-gray-700">
            Shape: {parameters.type.replace(/_/g, ' ').toUpperCase()}
          </div>
        </div>
      </div>

      {/* Real-Time Parameter Tracking */}
      <div className="mb-4">
        <div className="text-purple-400 font-bold mb-1">⚡ LIVE PARAMETER FEED:</div>
        <div className="grid grid-cols-4 gap-1 text-[9px]">
          {Object.entries(parameters).filter(([k, v]) => typeof v === 'number' && ['a', 'b', 'c', 'd', 'e', 'f'].includes(k)).map(([key, value]) => (
            <div key={key} className="bg-purple-900/30 p-1 rounded">
              <span className="text-purple-300">{key.toUpperCase()}:</span>
              <div className="text-white font-bold">{(value as number).toFixed(1)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scale Analysis */}
      <div className="mb-4">
        <div className="text-orange-400 font-bold mb-1">📏 SCALE ANALYSIS:</div>
        <div className="bg-orange-900/20 p-2 rounded space-y-1">
          <div className="flex justify-between">
            <span className="text-orange-300">Scale Type:</span>
            <span className="text-white font-bold">{scaleAnalysis.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-orange-300">Unit System:</span>
            <span className="text-white">{scaleAnalysis.unitType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-orange-300">Max Dimension:</span>
            <span className="text-white">{scaleAnalysis.maxDimension?.toExponential(3)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-orange-300">Volume:</span>
            <span className="text-white">{scaleAnalysis.volume?.toExponential(3)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-orange-300">Z-Depth:</span>
            <span className="text-white">{scaleAnalysis.depth?.toExponential(3)}</span>
          </div>
        </div>
      </div>

      {/* Decimal Precision Analysis */}
      <div className="mb-4">
        <div className="text-pink-400 font-bold mb-1">🔬 PRECISION ANALYSIS:</div>
        <div className="bg-pink-900/20 p-2 rounded text-[9px] max-h-24 overflow-y-auto">
          {Object.entries(decimalPrecision).slice(0, 6).map(([key, data]: [string, any]) => (
            <div key={key} className="flex justify-between items-center mb-1">
              <span className="text-pink-300">{key}:</span>
              <div className="text-right">
                <div className="text-white">{data.exponentialForm}</div>
                <div className="text-gray-400">{data.decimalPlaces} decimals</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* π-φ Constants Reference */}
      <div className="mb-4">
        <div className="text-blue-400 font-bold mb-1">🌌 π-φ CONSTANTS ACTIVE:</div>
        <div className="bg-blue-900/20 p-2 rounded text-[9px] space-y-1">
          <div className="flex justify-between">
            <span className="text-blue-300">φ⊕π (Cosmic):</span>
            <span className="text-white">13.30827755</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-300">φ×π (Energy):</span>
            <span className="text-white">5.08331419</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-300">φ+π (Growth):</span>
            <span className="text-white">4.75965421</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-300">φ-π (Tension):</span>
            <span className="text-white">-1.52383158</span>
          </div>
        </div>
      </div>

      {/* Three-Formula Hybrid Extensions Guide */}
      {(parameters.type === 'wave_energy_hybrid' || parameters.type === 'spike_shell_armor' || 
        parameters.type === 'crystal_flame_fusion' || parameters.type === 'bio_organic_tissue') && (
        <div className="mb-4">
          <div className="text-cyan-400 font-bold mb-1">🧬 HYBRID FORMULA ANALYSIS:</div>
          <div className="bg-cyan-900/20 p-2 rounded text-[9px] space-y-1">
            <div className="text-cyan-300 font-bold">THREE-FORMULA MATHEMATICAL COMBINATION:</div>
            <div className="text-gray-300">Advanced formulations combining multiple mathematical domains:</div>
            {parameters.type === 'wave_energy_hybrid' && (
              <>
                <div className="text-white">• <span className="text-purple-400">z²:</span> Polynomial stability foundation</div>
                <div className="text-white">• <span className="text-blue-400">sin(z):</span> Wave chaos and oscillations</div>
                <div className="text-white">• <span className="text-orange-400">e^z:</span> Exponential energy bursts</div>
                <div className="text-gray-400 mt-2">Creates living mandalas with energy jets - biomimetic patterns</div>
              </>
            )}
            {parameters.type === 'spike_shell_armor' && (
              <>
                <div className="text-white">• <span className="text-cyan-400">z³:</span> Cubic symmetry structure</div>
                <div className="text-white">• <span className="text-red-400">tan(z):</span> Defensive spike formation</div>
                <div className="text-white">• <span className="text-green-400">log(z²+1):</span> Logarithmic shell compression</div>
                <div className="text-gray-400 mt-2">Armored spiral architecture - bio-defensive geometry</div>
              </>
            )}
            {parameters.type === 'crystal_flame_fusion' && (
              <>
                <div className="text-white">• <span className="text-purple-400">z⁵:</span> Pentagonal crystal lattice</div>
                <div className="text-white">• <span className="text-orange-400">z·e^z:</span> Exponential spiral jets</div>
                <div className="text-white">• <span className="text-red-400">sinh(z):</span> Hyperbolic flame expansion</div>
                <div className="text-gray-400 mt-2">Crystal-flame hybrid structures - energy dynamics</div>
              </>
            )}
            {parameters.type === 'bio_organic_tissue' && (
              <>
                <div className="text-white">• <span className="text-green-400">(z²+z³):</span> Dual polynomial growth</div>
                <div className="text-white">• <span className="text-blue-400">sin(z²):</span> Wave interference patterns</div>
                <div className="text-white">• <span className="text-pink-400">e^(z/2):</span> Soft exponential divergence</div>
                <div className="text-gray-400 mt-2">Living tissue fractals - organic growth simulation</div>
              </>
            )}
            <div className="text-yellow-300 mt-2 pt-2 border-t border-gray-700 font-bold">Enhanced by UUON Foundation Three-Formula Hybrid Extensions</div>
          </div>
        </div>
      )}

      {/* Einstein Equation Shape Determination Guide */}
      {parameters.type?.includes('einstein') && (
        <div className="mb-4">
          <div className="text-yellow-400 font-bold mb-1">⚛️ SHAPE DETERMINATION METHODOLOGY:</div>
          <div className="bg-yellow-900/20 p-2 rounded text-[9px] space-y-1">
            <div className="text-yellow-300 font-bold">WHY E=mc² CREATES DIFFERENT SHAPES:</div>
            <div className="text-gray-300">Each variant maps the same physics equation onto 3D space differently:</div>
            <div className="text-white">• <span className="text-green-400">Energy Spiral:</span> E=mc² as radial energy propagation</div>
            <div className="text-white">• <span className="text-blue-400">Density Sphere:</span> E/m=c² as uniform energy density</div>
            <div className="text-white">• <span className="text-orange-400">Compression Cone:</span> m=E/c² as energy-to-mass conversion</div>
            <div className="text-white">• <span className="text-purple-400">Multiplicative Grid:</span> E×m=m²c² as algebraic structure</div>
            <div className="text-white">• <span className="text-cyan-400">Dual Shell:</span> |E|=|m|c² as matter/antimatter symmetry</div>
            <div className="text-white">• <span className="text-red-400">Curved Field:</span> E⊗m as spacetime curvature tensor</div>
            <div className="text-white">• <span className="text-pink-400">Direction Cone:</span> E·m as vector alignment angles</div>
            <div className="text-white">• <span className="text-green-300">Exponential Spiral:</span> Ee^k as relativistic corrections</div>
            <div className="text-white">• <span className="text-blue-300">Hyperboloid:</span> E²=(pc)²+(mc²)² as momentum-energy space</div>
            <div className="text-gray-400 mt-2">The SHAPE reveals the mathematical relationship's geometric structure when visualized as a continuous 3D surface.</div>
          </div>
        </div>
      )}

      {/* Mathematical Status */}
      <div className="text-center">
        <div className="text-green-400 font-bold animate-pulse">
          ● LIVE MATHEMATICAL COMPUTATION ACTIVE
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Research-Grade Mathematical Precision
        </div>
      </div>
    </div>
  );
}