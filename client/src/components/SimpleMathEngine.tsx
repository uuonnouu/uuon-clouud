
import React, { useState, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Complete Mathematical Shape Library
const MATH_SHAPES = {
  sphere: {
    name: "🌍 Sphere",
    equation: (u, v, params) => {
      const { a = 1, b = 1, c = 1 } = params;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      return [
        a * Math.sin(phi) * Math.cos(theta),
        b * Math.sin(phi) * Math.sin(theta),
        c * Math.cos(phi)
      ];
    },
    defaults: { a: 2, b: 2, c: 2, uSegments: 64, vSegments: 32 }
  },

  torus: {
    name: "🍩 Torus",
    equation: (u, v, params) => {
      const { a = 2, b = 0.8 } = params;
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      return [
        (a + b * Math.cos(phi)) * Math.cos(theta),
        (a + b * Math.cos(phi)) * Math.sin(theta),
        b * Math.sin(phi)
      ];
    },
    defaults: { a: 2, b: 0.8, uSegments: 64, vSegments: 32 }
  },

  klein_bottle: {
    name: "🍶 Klein Bottle",
    equation: (u, v, params) => {
      const { a = 2, b = 1 } = params;
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      const r = a + b * Math.cos(phi/2) * Math.sin(theta) - b * Math.sin(phi/2) * Math.sin(2*theta);
      return [
        r * Math.cos(phi),
        r * Math.sin(phi),
        b * Math.sin(phi/2) * Math.sin(theta) + b * Math.cos(phi/2) * Math.sin(2*theta)
      ];
    },
    defaults: { a: 2, b: 1, uSegments: 64, vSegments: 32 }
  },

  mobius_strip: {
    name: "🔄 Möbius Strip",
    equation: (u, v, params) => {
      const { a = 2, b = 0.5 } = params;
      const theta = u * 2 * Math.PI;
      const width = b * (v - 0.5);
      return [
        (a + width * Math.cos(theta/2)) * Math.cos(theta),
        (a + width * Math.cos(theta/2)) * Math.sin(theta),
        width * Math.sin(theta/2)
      ];
    },
    defaults: { a: 2, b: 0.5, uSegments: 64, vSegments: 16 }
  },

  helicoid: {
    name: "🌪️ Helicoid",
    equation: (u, v, params) => {
      const { a = 1, b = 2 } = params;
      const rho = u * 2;
      const theta = v * 2 * Math.PI;
      return [
        rho * Math.cos(theta),
        rho * Math.sin(theta),
        a * theta + b * Math.sin(rho)
      ];
    },
    defaults: { a: 1, b: 2, uSegments: 64, vSegments: 32 }
  },

  catenoid: {
    name: "⏳ Catenoid",
    equation: (u, v, params) => {
      const { a = 1, b = 2 } = params;
      const theta = u * 2 * Math.PI;
      const z = b * (v - 0.5);
      const radius = a * Math.cosh(z / a);
      return [
        radius * Math.cos(theta),
        radius * Math.sin(theta),
        z
      ];
    },
    defaults: { a: 1, b: 2, uSegments: 64, vSegments: 32 }
  },

  trefoil_knot: {
    name: "🪢 Trefoil Knot",
    equation: (u, v, params) => {
      const { a = 1, b = 0.3 } = params;
      const t = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      const x0 = Math.sin(t) + 2 * Math.sin(2*t);
      const y0 = Math.cos(t) - 2 * Math.cos(2*t);
      const z0 = -Math.sin(3*t);
      const normal = [Math.cos(3*t), Math.sin(3*t), 0];
      return [
        a * x0 + b * normal[0] * Math.cos(phi),
        a * y0 + b * normal[1] * Math.cos(phi),
        a * z0 + b * Math.sin(phi)
      ];
    },
    defaults: { a: 1, b: 0.3, uSegments: 128, vSegments: 16 }
  },

  dna_helix: {
    name: "🧬 DNA Double Helix",
    equation: (u, v, params) => {
      const { a = 1, b = 3, c = 0.5 } = params;
      const t = u * b * Math.PI;
      const strand = Math.floor(v * 2);
      const phase = strand * Math.PI;
      return [
        a * Math.cos(t + phase),
        a * Math.sin(t + phase),
        c * t
      ];
    },
    defaults: { a: 1, b: 3, c: 0.5, uSegments: 128, vSegments: 2 }
  },

  schwarzschild_spacetime: {
    name: "🕳️ Black Hole Spacetime",
    equation: (u, v, params) => {
      const { a = 2, b = 1 } = params;
      const r = a + u * 5;
      const theta = v * Math.PI;
      const phi = u * 2 * Math.PI;
      const warp = 1 - (b / r);
      return [
        r * Math.sin(theta) * Math.cos(phi) * Math.sqrt(Math.abs(warp)),
        r * Math.sin(theta) * Math.sin(phi) * Math.sqrt(Math.abs(warp)),
        r * Math.cos(theta) * warp
      ];
    },
    defaults: { a: 2, b: 1, uSegments: 64, vSegments: 32 }
  },

  quantum_wave: {
    name: "⚛️ Quantum Wave Function",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 3 } = params;
      const x = a * (u - 0.5) * 4;
      const y = a * (v - 0.5) * 4;
      const psi = Math.exp(-(x*x + y*y)/2) * Math.cos(c * Math.sqrt(x*x + y*y));
      return [x, y, b * psi];
    },
    defaults: { a: 2, b: 1, c: 3, uSegments: 64, vSegments: 64 }
  }
};

// Parametric Surface Renderer
function ParametricSurface({ shapeId, parameters, visualMode, colorMode }) {
  const shape = MATH_SHAPES[shapeId];
  if (!shape) return null;

  const geometry = useMemo(() => {
    const { uSegments = 32, vSegments = 32 } = shape.defaults;
    const vertices = [];
    const indices = [];
    const colors = [];

    // Generate vertices
    for (let i = 0; i <= vSegments; i++) {
      for (let j = 0; j <= uSegments; j++) {
        const u = j / uSegments;
        const v = i / vSegments;
        
        try {
          const [x, y, z] = shape.equation(u, v, { ...shape.defaults, ...parameters });
          vertices.push(x, y, z);

          // Generate colors based on position
          const r = colorMode === 'height' ? (z + 2) / 4 : Math.sin(u * Math.PI);
          const g = colorMode === 'rainbow' ? Math.cos(v * Math.PI) : 0.5;
          const b = colorMode === 'position' ? (x + y) / 4 + 0.5 : Math.cos(u * v * Math.PI);
          colors.push(Math.max(0, Math.min(1, r)), Math.max(0, Math.min(1, g)), Math.max(0, Math.min(1, b)));
        } catch (error) {
          vertices.push(0, 0, 0);
          colors.push(0.5, 0.5, 0.5);
        }
      }
    }

    // Generate indices
    for (let i = 0; i < vSegments; i++) {
      for (let j = 0; j < uSegments; j++) {
        const a = i * (uSegments + 1) + j;
        const b = a + uSegments + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setIndex(indices);
    geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geom.computeVertexNormals();
    return geom;
  }, [shapeId, parameters, colorMode]);

  const material = useMemo(() => {
    if (visualMode === 'wireframe') {
      return new THREE.MeshBasicMaterial({ 
        wireframe: true, 
        vertexColors: true,
        transparent: true,
        opacity: 0.8
      });
    } else if (visualMode === 'points') {
      return new THREE.PointsMaterial({ 
        size: 0.05, 
        vertexColors: true,
        transparent: true,
        opacity: 0.9
      });
    } else {
      return new THREE.MeshPhongMaterial({ 
        vertexColors: true,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
        shininess: 100
      });
    }
  }, [visualMode]);

  if (visualMode === 'points') {
    return <points geometry={geometry} material={material} />;
  } else {
    return <mesh geometry={geometry} material={material} castShadow receiveShadow />;
  }
}

// Lighting Setup
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.8} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, -10, -5]} intensity={0.3} />
    </>
  );
}

// Control Panel
function ControlPanel({ 
  selectedShape, 
  onShapeChange, 
  parameters, 
  onParameterChange, 
  visualMode, 
  onVisualModeChange,
  colorMode,
  onColorModeChange
}) {
  return (
    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm p-4 rounded-lg border border-cyan-500/50 max-w-xs">
      <h2 className="text-cyan-400 font-bold text-lg mb-4">Math Visualizer</h2>
      
      {/* Shape Selection */}
      <div className="mb-4">
        <label className="text-white text-sm font-medium mb-2 block">Shape</label>
        <select 
          value={selectedShape} 
          onChange={(e) => onShapeChange(e.target.value)}
          className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
        >
          {Object.entries(MATH_SHAPES).map(([key, shape]) => (
            <option key={key} value={key}>{shape.name}</option>
          ))}
        </select>
      </div>

      {/* Parameters */}
      <div className="mb-4">
        <label className="text-white text-sm font-medium mb-2 block">Parameter A: {parameters.a?.toFixed(1)}</label>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={parameters.a || 1}
          onChange={(e) => onParameterChange({ ...parameters, a: parseFloat(e.target.value) })}
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <label className="text-white text-sm font-medium mb-2 block">Parameter B: {parameters.b?.toFixed(1)}</label>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={parameters.b || 1}
          onChange={(e) => onParameterChange({ ...parameters, b: parseFloat(e.target.value) })}
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <label className="text-white text-sm font-medium mb-2 block">Parameter C: {parameters.c?.toFixed(1)}</label>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={parameters.c || 1}
          onChange={(e) => onParameterChange({ ...parameters, c: parseFloat(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Visualization Mode */}
      <div className="mb-4">
        <label className="text-white text-sm font-medium mb-2 block">Visual Mode</label>
        <select 
          value={visualMode} 
          onChange={(e) => onVisualModeChange(e.target.value)}
          className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
        >
          <option value="surface">Surface</option>
          <option value="wireframe">Wireframe</option>
          <option value="points">Points</option>
        </select>
      </div>

      {/* Color Mode */}
      <div className="mb-4">
        <label className="text-white text-sm font-medium mb-2 block">Color Mode</label>
        <select 
          value={colorMode} 
          onChange={(e) => onColorModeChange(e.target.value)}
          className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
        >
          <option value="height">Height</option>
          <option value="rainbow">Rainbow</option>
          <option value="position">Position</option>
        </select>
      </div>
    </div>
  );
}

// Main Component
export default function SimpleMathEngine() {
  const [selectedShape, setSelectedShape] = useState('sphere');
  const [parameters, setParameters] = useState({ a: 2, b: 1, c: 1 });
  const [visualMode, setVisualMode] = useState('surface');
  const [colorMode, setColorMode] = useState('height');

  const handleShapeChange = (shapeId) => {
    setSelectedShape(shapeId);
    setParameters(MATH_SHAPES[shapeId].defaults);
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Control Panel */}
      <ControlPanel
        selectedShape={selectedShape}
        onShapeChange={handleShapeChange}
        parameters={parameters}
        onParameterChange={setParameters}
        visualMode={visualMode}
        onVisualModeChange={setVisualMode}
        colorMode={colorMode}
        onColorModeChange={setColorMode}
      />

      {/* 3D Canvas */}
      <Canvas 
        camera={{ position: [5, 5, 5], fov: 60 }}
        shadows
      >
        <Lighting />
        
        <ParametricSurface 
          shapeId={selectedShape}
          parameters={parameters}
          visualMode={visualMode}
          colorMode={colorMode}
        />
        
        <OrbitControls 
          enablePan 
          enableZoom 
          enableRotate 
          dampingFactor={0.1}
          enableDamping
        />
        
        <gridHelper args={[10, 10, '#333333', '#333333']} />
        <axesHelper args={[2]} />
      </Canvas>

      {/* Info Display */}
      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm p-3 rounded-lg border border-cyan-500/50">
        <h3 className="text-cyan-400 font-semibold text-sm mb-2">Current Shape</h3>
        <p className="text-white text-sm">{MATH_SHAPES[selectedShape].name}</p>
        <div className="mt-2 text-xs text-gray-300">
          <div>A: {parameters.a?.toFixed(1)}</div>
          <div>B: {parameters.b?.toFixed(1)}</div>
          <div>C: {parameters.c?.toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
}
