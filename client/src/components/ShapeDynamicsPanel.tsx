/**
 * Shape Dynamics Panel
 * 
 * Interactive popup displaying comprehensive mathematical properties
 * of the current 3D shape including volume, mass, surface area,
 * curvature, and topological invariants.
 */

import React, { useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import {
  computeShapeDynamics,
  formatDynamicsValue,
  getPropertyDescription,
  MATERIAL_PRESETS,
  type ShapeDynamicsResult,
  type MaterialProperties
} from '../lib/shapeDynamicsEngine';

interface ShapeDynamicsPanelProps {
  geometry: THREE.BufferGeometry | null;
  shapeName: string;
  isOpen: boolean;
  onClose: () => void;
  scale?: number;
}

export function ShapeDynamicsPanel({
  geometry,
  shapeName,
  isOpen,
  onClose,
  scale = 1
}: ShapeDynamicsPanelProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialProperties>(MATERIAL_PRESETS[1]); // Water default
  const [customDensity, setCustomDensity] = useState<number>(1000);
  const [isComputing, setIsComputing] = useState(false);
  const [dynamics, setDynamics] = useState<ShapeDynamicsResult | null>(null);
  const [activeTab, setActiveTab] = useState<'physical' | 'geometric' | 'topological'>('physical');

  // Compute dynamics when geometry or material changes
  useEffect(() => {
    if (!geometry || !isOpen) return;

    setIsComputing(true);
    
    // Use setTimeout to prevent UI blocking
    const timer = setTimeout(() => {
      try {
        const density = selectedMaterial.name === 'Custom' ? customDensity : selectedMaterial.density;
        const result = computeShapeDynamics(geometry, density, scale);
        setDynamics(result);
      } catch (error) {
        console.error('Shape dynamics computation error:', error);
      } finally {
        setIsComputing(false);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [geometry, selectedMaterial, customDensity, scale, isOpen]);

  if (!isOpen) return null;

  const coordinateIcon = {
    cartesian: '📐',
    cylindrical: '🔄',
    spherical: '🌐'
  }[dynamics?.coordinateSystem || 'cartesian'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-purple-500/30 rounded-xl shadow-2xl w-[600px] max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 px-6 py-4 border-b border-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Shape Dynamics
              </h2>
              <p className="text-purple-300 text-sm mt-1">
                {shapeName} {coordinateIcon}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Material Selector */}
        <div className="px-6 py-3 bg-gray-800/50 border-b border-gray-700">
          <label className="text-xs text-gray-400 uppercase tracking-wide">Material</label>
          <div className="flex items-center gap-3 mt-1">
            <select
              value={selectedMaterial.name}
              onChange={(e) => {
                const mat = MATERIAL_PRESETS.find(m => m.name === e.target.value);
                if (mat) setSelectedMaterial(mat);
              }}
              className="flex-1 bg-gray-700 text-white rounded px-3 py-2 text-sm border border-gray-600 focus:border-purple-500 focus:outline-none"
            >
              {MATERIAL_PRESETS.map(mat => (
                <option key={mat.name} value={mat.name}>
                  {mat.name} ({mat.density.toLocaleString()} kg/m³)
                </option>
              ))}
            </select>
            {selectedMaterial.name === 'Custom' && (
              <input
                type="number"
                value={customDensity}
                onChange={(e) => setCustomDensity(parseFloat(e.target.value) || 1)}
                className="w-32 bg-gray-700 text-white rounded px-3 py-2 text-sm border border-gray-600 focus:border-purple-500 focus:outline-none"
                placeholder="kg/m³"
              />
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          {[
            { id: 'physical', label: 'Physical', icon: '⚖️' },
            { id: 'geometric', label: 'Geometric', icon: '📐' },
            { id: 'topological', label: 'Topological', icon: '🔗' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-900/30 text-purple-300 border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[400px]">
          {isComputing ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
              <span className="ml-4 text-gray-300">Computing dynamics...</span>
            </div>
          ) : dynamics ? (
            <>
              {activeTab === 'physical' && (
                <div className="space-y-4">
                  <PropertyCard
                    icon="📦"
                    label="Volume"
                    value={formatDynamicsValue(dynamics.volume, 'm³')}
                    description={getPropertyDescription('volume')}
                  />
                  <PropertyCard
                    icon="🎨"
                    label="Surface Area"
                    value={formatDynamicsValue(dynamics.surfaceArea, 'm²')}
                    description={getPropertyDescription('surfaceArea')}
                  />
                  <PropertyCard
                    icon="⚖️"
                    label="Mass"
                    value={formatDynamicsValue(dynamics.mass, 'kg')}
                    description={getPropertyDescription('mass')}
                  />
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">⚙️</span>
                      <h4 className="font-semibold text-white">Center of Mass</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-gray-700/50 rounded p-2 text-center">
                        <div className="text-xs text-gray-400">X</div>
                        <div className="text-purple-300 font-mono">{dynamics.centerOfMass.x.toFixed(1)}</div>
                      </div>
                      <div className="bg-gray-700/50 rounded p-2 text-center">
                        <div className="text-xs text-gray-400">Y</div>
                        <div className="text-purple-300 font-mono">{dynamics.centerOfMass.y.toFixed(1)}</div>
                      </div>
                      <div className="bg-gray-700/50 rounded p-2 text-center">
                        <div className="text-xs text-gray-400">Z</div>
                        <div className="text-purple-300 font-mono">{dynamics.centerOfMass.z.toFixed(1)}</div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{getPropertyDescription('centerOfMass')}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">🔄</span>
                      <h4 className="font-semibold text-white">Moment of Inertia Tensor</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-2 font-mono text-sm">
                      <div className="bg-gray-700/50 rounded p-2 text-center">
                        <div className="text-xs text-gray-400">Ixx</div>
                        <div className="text-blue-300">{dynamics.momentOfInertia.Ixx.toExponential(2)}</div>
                      </div>
                      <div className="bg-gray-700/50 rounded p-2 text-center">
                        <div className="text-xs text-gray-400">Ixy</div>
                        <div className="text-blue-300">{dynamics.momentOfInertia.Ixy.toExponential(2)}</div>
                      </div>
                      <div className="bg-gray-700/50 rounded p-2 text-center">
                        <div className="text-xs text-gray-400">Ixz</div>
                        <div className="text-blue-300">{dynamics.momentOfInertia.Ixz.toExponential(2)}</div>
                      </div>
                      <div className="bg-gray-700/50 rounded p-2 text-center">
                        <div className="text-xs text-gray-400">Ixy</div>
                        <div className="text-blue-300">{dynamics.momentOfInertia.Ixy.toExponential(2)}</div>
                      </div>
                      <div className="bg-gray-700/50 rounded p-2 text-center">
                        <div className="text-xs text-gray-400">Iyy</div>
                        <div className="text-blue-300">{dynamics.momentOfInertia.Iyy.toExponential(2)}</div>
                      </div>
                      <div className="bg-gray-700/50 rounded p-2 text-center">
                        <div className="text-xs text-gray-400">Iyz</div>
                        <div className="text-blue-300">{dynamics.momentOfInertia.Iyz.toExponential(2)}</div>
                      </div>
                      <div className="bg-gray-700/50 rounded p-2 text-center">
                        <div className="text-xs text-gray-400">Ixz</div>
                        <div className="text-blue-300">{dynamics.momentOfInertia.Ixz.toExponential(2)}</div>
                      </div>
                      <div className="bg-gray-700/50 rounded p-2 text-center">
                        <div className="text-xs text-gray-400">Iyz</div>
                        <div className="text-blue-300">{dynamics.momentOfInertia.Iyz.toExponential(2)}</div>
                      </div>
                      <div className="bg-gray-700/50 rounded p-2 text-center">
                        <div className="text-xs text-gray-400">Izz</div>
                        <div className="text-blue-300">{dynamics.momentOfInertia.Izz.toExponential(2)}</div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{getPropertyDescription('momentOfInertia')}</p>
                  </div>
                </div>
              )}

              {activeTab === 'geometric' && (
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">📏</span>
                      <h4 className="font-semibold text-white">Bounding Box</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-gray-700/50 rounded p-2 text-center">
                        <div className="text-xs text-gray-400">Width (X)</div>
                        <div className="text-green-300 font-mono">{dynamics.boundingBox.dimensions.width.toFixed(1)}</div>
                      </div>
                      <div className="bg-gray-700/50 rounded p-2 text-center">
                        <div className="text-xs text-gray-400">Height (Y)</div>
                        <div className="text-green-300 font-mono">{dynamics.boundingBox.dimensions.height.toFixed(1)}</div>
                      </div>
                      <div className="bg-gray-700/50 rounded p-2 text-center">
                        <div className="text-xs text-gray-400">Depth (Z)</div>
                        <div className="text-green-300 font-mono">{dynamics.boundingBox.dimensions.depth.toFixed(1)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <PropertyCard
                    icon="🌀"
                    label="Gaussian Curvature (K)"
                    value={formatDynamicsValue(dynamics.curvature.gaussian)}
                    description={getPropertyDescription('gaussian')}
                    badge={dynamics.curvature.gaussian > 0 ? 'Elliptic' : dynamics.curvature.gaussian < 0 ? 'Hyperbolic' : 'Parabolic'}
                  />
                  <PropertyCard
                    icon="📈"
                    label="Mean Curvature (H)"
                    value={formatDynamicsValue(dynamics.curvature.mean)}
                    description={getPropertyDescription('mean')}
                  />
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">〰️</span>
                      <h4 className="font-semibold text-white">Principal Curvatures</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-700/50 rounded p-3 text-center">
                        <div className="text-xs text-gray-400">κ₁ (max)</div>
                        <div className="text-yellow-300 font-mono text-lg">{dynamics.curvature.principalK1.toFixed(2)}</div>
                      </div>
                      <div className="bg-gray-700/50 rounded p-3 text-center">
                        <div className="text-xs text-gray-400">κ₂ (min)</div>
                        <div className="text-yellow-300 font-mono text-lg">{dynamics.curvature.principalK2.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg p-4 border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{coordinateIcon}</span>
                      <h4 className="font-semibold text-white">Optimal Coordinate System</h4>
                    </div>
                    <p className="text-purple-300 capitalize">{dynamics.coordinateSystem}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Detected based on shape symmetry for simplified calculations
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'topological' && (
                <div className="space-y-4">
                  <PropertyCard
                    icon="χ"
                    label="Euler Characteristic (χ)"
                    value={dynamics.topology.eulerCharacteristic.toString()}
                    description={getPropertyDescription('eulerCharacteristic')}
                    badge={dynamics.topology.eulerCharacteristic === 2 ? 'Sphere-like' : dynamics.topology.eulerCharacteristic === 0 ? 'Torus-like' : 'Complex'}
                  />
                  <PropertyCard
                    icon="🕳️"
                    label="Genus (g)"
                    value={dynamics.topology.genus.toString()}
                    description={getPropertyDescription('genus')}
                    badge={dynamics.topology.genus === 0 ? 'No holes' : `${dynamics.topology.genus} hole${dynamics.topology.genus > 1 ? 's' : ''}`}
                  />
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">🔺</span>
                      <h4 className="font-semibold text-white">Mesh Statistics</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-gray-700/50 rounded p-3 text-center">
                        <div className="text-xs text-gray-400">Vertices (V)</div>
                        <div className="text-cyan-300 font-mono text-lg">{dynamics.topology.vertices.toLocaleString()}</div>
                      </div>
                      <div className="bg-gray-700/50 rounded p-3 text-center">
                        <div className="text-xs text-gray-400">Edges (E)</div>
                        <div className="text-cyan-300 font-mono text-lg">{dynamics.topology.edges.toLocaleString()}</div>
                      </div>
                      <div className="bg-gray-700/50 rounded p-3 text-center">
                        <div className="text-xs text-gray-400">Faces (F)</div>
                        <div className="text-cyan-300 font-mono text-lg">{dynamics.topology.faces.toLocaleString()}</div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3 text-center">
                      V - E + F = {dynamics.topology.vertices} - {dynamics.topology.edges} + {dynamics.topology.faces} = {dynamics.topology.eulerCharacteristic}
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-gray-400">
              No geometry available for analysis
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-800/50 border-t border-gray-700 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {dynamics && (
              <>Computed in {dynamics.computationTime.toFixed(1)}ms</>
            )}
          </div>
          <div className="text-xs text-gray-500">
            Triple Integration • Differential Geometry
          </div>
        </div>
      </div>
    </div>
  );
}

// Property Card Component
function PropertyCard({
  icon,
  label,
  value,
  description,
  badge
}: {
  icon: string;
  label: string;
  value: string;
  description: string;
  badge?: string;
}) {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <h4 className="font-semibold text-white">{label}</h4>
        </div>
        {badge && (
          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
            {badge}
          </span>
        )}
      </div>
      <div className="text-2xl font-mono text-purple-300 mb-2">{value}</div>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}

export default ShapeDynamicsPanel;
