import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

interface ShapeSpec {
  id: string;
  name: string;
  category: string;
  equation?: string;
  description?: string;
  parameters?: Record<string, { default: number; min: number; max: number; description: string }>;
  complexity?: number;
  uvDomain?: { uMin: number; uMax: number; vMin: number; vMax: number };
  materials?: string[];
  exportFormats?: string[];
}

export default function ShapeDetailPage() {
  const { shapeId } = useParams<{ shapeId: string }>();
  const [shape, setShape] = useState<ShapeSpec | null>(null);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState<Record<string, number>>({
    A: 1, B: 1, C: 1, D: 0, E: 0, F: 0
  });

  useEffect(() => {
    setLoading(true);
    fetch(`/api/shapes/${shapeId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.id) {
          setShape(data);
          if (data.parameters) {
            const defaults: Record<string, number> = {};
            Object.entries(data.parameters).forEach(([key, val]: [string, any]) => {
              defaults[key] = val.default || 1;
            });
            setParams(prev => ({ ...prev, ...defaults }));
          }
        } else {
          setShape({
            id: shapeId || 'unknown',
            name: shapeId?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Shape',
            category: 'parametric-surfaces',
            equation: 'Parametric surface equation',
            description: 'A mathematical surface with full A-Z parameter control. This shape responds to parameter adjustments in real-time.',
            parameters: {
              A: { default: 1, min: -360, max: 360, description: 'Primary scale/transform' },
              B: { default: 1, min: -360, max: 360, description: 'Secondary scale/transform' },
              C: { default: 1, min: -360, max: 360, description: 'Tertiary scale/transform' },
              D: { default: 0, min: -360, max: 360, description: 'Foundational curve parameter' },
              E: { default: 0, min: -360, max: 360, description: 'Secondary curve parameter' },
              F: { default: 0, min: -360, max: 360, description: 'Surface of revolution' },
            },
            complexity: 3,
            uvDomain: { uMin: 0, uMax: 6.28318, vMin: 0, vMax: 3.14159 },
            materials: ['Default', 'Titanium', 'Glass', 'Carbon Fiber'],
            exportFormats: ['GLB', 'PLY', 'NeRF', 'Animated GLB']
          });
        }
      })
      .catch(() => {
        setShape({
          id: shapeId || 'unknown',
          name: shapeId?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Shape',
          category: 'parametric-surfaces',
          description: 'Mathematical parametric surface with real-time parameter control.',
          complexity: 3,
        });
      })
      .finally(() => setLoading(false));
  }, [shapeId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!shape) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Shape Not Found</h1>
          <Link to="/museum" className="text-cyan-400 hover:underline">← Back to Museum</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/museum" className="text-gray-400 hover:text-white transition">
              ← Museum
            </Link>
            <span className="text-gray-600">/</span>
            <span className="font-semibold">{shape.name}</span>
          </div>
          <Link 
            to={`/app?shape=${shape.id}`}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold transition"
          >
            Open in App
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="aspect-square bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 flex items-center justify-center mb-6">
              <div className="text-center">
                <div className="text-8xl mb-4 opacity-50">📐</div>
                <p className="text-gray-500">3D Preview</p>
                <Link 
                  to={`/app?shape=${shape.id}`}
                  className="mt-4 inline-block px-4 py-2 bg-cyan-600/20 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-600/30 transition"
                >
                  View Interactive Model
                </Link>
              </div>
            </div>

            <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-800">
              <h3 className="font-bold mb-4">Test Parameters</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(params).slice(0, 6).map(([key, value]) => (
                  <div key={key}>
                    <label className="text-sm text-gray-400 flex justify-between mb-1">
                      <span>{key}</span>
                      <span>{value.toFixed(1)}</span>
                    </label>
                    <input
                      type="range"
                      min="-10"
                      max="10"
                      step="0.1"
                      value={value}
                      onChange={(e) => setParams(p => ({ ...p, [key]: parseFloat(e.target.value) }))}
                      className="w-full accent-cyan-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <span className="px-3 py-1 bg-cyan-600/20 text-cyan-400 text-sm rounded-full">
                {shape.category?.replace(/-/g, ' ')}
              </span>
              <h1 className="text-4xl font-bold mt-3 mb-2">{shape.name}</h1>
              <p className="text-gray-400">{shape.description}</p>
            </div>

            {shape.equation && (
              <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                <h3 className="text-sm text-gray-400 mb-2">Equation</h3>
                <code className="text-cyan-300 font-mono text-lg">{shape.equation}</code>
              </div>
            )}

            <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
              <h3 className="text-sm text-gray-400 mb-3">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-gray-500">Complexity</span>
                  <div className="flex gap-1 mt-1">
                    {[1,2,3,4,5].map(n => (
                      <div key={n} className={`w-4 h-4 rounded ${n <= (shape.complexity || 3) ? 'bg-cyan-500' : 'bg-gray-700'}`} />
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Parameters</span>
                  <div className="text-lg font-bold">{shape.parameters ? Object.keys(shape.parameters).length : 6}</div>
                </div>
              </div>
            </div>

            {shape.uvDomain && (
              <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                <h3 className="text-sm text-gray-400 mb-3">UV Domain</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">U Range:</span>
                    <span className="ml-2">[{shape.uvDomain.uMin.toFixed(2)}, {shape.uvDomain.uMax.toFixed(2)}]</span>
                  </div>
                  <div>
                    <span className="text-gray-500">V Range:</span>
                    <span className="ml-2">[{shape.uvDomain.vMin.toFixed(2)}, {shape.uvDomain.vMax.toFixed(2)}]</span>
                  </div>
                </div>
              </div>
            )}

            {shape.materials && (
              <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                <h3 className="text-sm text-gray-400 mb-3">Available Materials</h3>
                <div className="flex flex-wrap gap-2">
                  {shape.materials.map(mat => (
                    <span key={mat} className="px-3 py-1 bg-gray-800 rounded-lg text-sm">{mat}</span>
                  ))}
                </div>
              </div>
            )}

            {shape.exportFormats && (
              <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                <h3 className="text-sm text-gray-400 mb-3">Export Formats</h3>
                <div className="flex flex-wrap gap-2">
                  {shape.exportFormats.map(fmt => (
                    <span key={fmt} className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-lg text-sm">{fmt}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Link 
                to={`/app?shape=${shape.id}`}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-center hover:from-cyan-400 hover:to-blue-500 transition"
              >
                Open in Full App
              </Link>
              <Link 
                to="/museum"
                className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-xl font-bold hover:bg-gray-700 transition"
              >
                Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
