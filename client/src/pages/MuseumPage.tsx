import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

interface ShapeData {
  id: string;
  name: string;
  category: string;
  equation?: string;
  parameters?: string[];
  complexity?: number;
}

const CATEGORIES = [
  { id: 'all', name: 'All Shapes', icon: '🌐', count: 2677 },
  { id: 'parametric-surfaces', name: 'Parametric Surfaces', icon: '📐', count: 245 },
  { id: 'quantum', name: 'Quantum Mechanics', icon: '⚛️', count: 312 },
  { id: 'topology', name: 'Topology', icon: '🔗', count: 189 },
  { id: 'hyperdimensional', name: 'Hyperdimensional', icon: '🌀', count: 156 },
  { id: 'physics', name: 'Physics', icon: '🔬', count: 287 },
  { id: 'fractals', name: 'Fractals & Chaos', icon: '🦋', count: 143 },
  { id: 'minimal-surfaces', name: 'Minimal Surfaces', icon: '🫧', count: 98 },
  { id: 'wave-forms', name: 'Wave Forms', icon: '🌊', count: 183 },
  { id: 'geodesic', name: 'Geodesic Structures', icon: '⚫', count: 67 },
  { id: 'lattice', name: 'Lattice Structures', icon: '🔷', count: 124 },
  { id: 'tpms', name: 'TPMS Structures', icon: '🧬', count: 27 },
  { id: 'medical', name: 'Medical Imaging', icon: '🏥', count: 45 },
  { id: 'architecture', name: 'Architecture', icon: '🏛️', count: 89 },
  { id: 'ancient', name: 'Ancient Civilizations', icon: '🔺', count: 41 },
  { id: 'consciousness', name: 'Consciousness Math', icon: '🧠', count: 15 },
];

const SAMPLE_SHAPES: ShapeData[] = [
  { id: 'sphere', name: 'Sphere', category: 'parametric-surfaces', equation: 'x² + y² + z² = r²', parameters: ['A', 'B', 'C'], complexity: 1 },
  { id: 'torus', name: 'Torus', category: 'parametric-surfaces', equation: '(c - √(x² + y²))² + z² = a²', parameters: ['A', 'B', 'C', 'D'], complexity: 2 },
  { id: 'klein-bottle', name: 'Klein Bottle', category: 'topology', equation: 'Non-orientable surface', parameters: ['A', 'B', 'C', 'D', 'E'], complexity: 4 },
  { id: 'mobius-strip', name: 'Möbius Strip', category: 'topology', equation: 'Single-sided surface', parameters: ['A', 'B', 'C'], complexity: 3 },
  { id: 'tesseract', name: 'Tesseract', category: 'hyperdimensional', equation: '4D hypercube projection', parameters: ['A', 'B', 'C', 'D', 'W'], complexity: 5 },
  { id: 'lorenz-attractor', name: 'Lorenz Attractor', category: 'fractals', equation: 'dx/dt = σ(y-x)', parameters: ['A', 'B', 'C', 'D', 'E', 'F'], complexity: 4 },
  { id: 'schrodinger-orbital', name: 'Schrödinger Orbital', category: 'quantum', equation: 'ĤΨ = EΨ', parameters: ['A', 'B', 'C', 'N', 'L', 'M'], complexity: 5 },
  { id: 'gyroid', name: 'Gyroid TPMS', category: 'tpms', equation: 'sin(x)cos(y) + sin(y)cos(z) + sin(z)cos(x) = 0', parameters: ['A', 'B', 'C'], complexity: 4 },
  { id: 'schwarzschild', name: 'Schwarzschild Metric', category: 'physics', equation: 'ds² = -(1-rs/r)dt² + ...', parameters: ['A', 'B', 'C', 'M'], complexity: 5 },
  { id: 'dna-helix', name: 'DNA Double Helix', category: 'medical', equation: 'Parametric helix pair', parameters: ['A', 'B', 'C', 'D'], complexity: 3 },
  { id: 'golden-spiral', name: 'Golden Spiral', category: 'parametric-surfaces', equation: 'r = ae^(bθ)', parameters: ['A', 'B', 'T', 'U'], complexity: 2 },
  { id: 'mandelbrot-3d', name: 'Mandelbrot 3D', category: 'fractals', equation: 'z_{n+1} = z_n² + c', parameters: ['A', 'B', 'C', 'V', 'W'], complexity: 5 },
];

export default function MuseumPage() {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [shapes, setShapes] = useState<ShapeData[]>(SAMPLE_SHAPES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      const found = CATEGORIES.find(c => c.name.toLowerCase() === cat.toLowerCase());
      if (found) setSelectedCategory(found.id);
    }
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    fetch('/api/shapes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setShapes(data.slice(0, 100));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredShapes = useMemo(() => {
    return shapes.filter(shape => {
      const matchesSearch = !searchTerm || 
        shape.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shape.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || shape.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [shapes, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/dmension-logo.png" alt="Δmension" className="w-8 h-8" />
            <span className="text-xl font-bold">Shape Museum</span>
          </Link>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search shapes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-cyan-500 focus:outline-none w-64"
            />
            <Link to="/showcase" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold transition">
              Showcase
            </Link>
            <Link to="/" className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold transition">
              Launch App
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          <aside className="w-64 flex-shrink-0">
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <div className="space-y-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition ${
                    selectedCategory === cat.id 
                      ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30' 
                      : 'hover:bg-gray-800 text-gray-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span className="text-sm">{cat.name}</span>
                  </span>
                  <span className="text-xs text-gray-500">{cat.count}</span>
                </button>
              ))}
            </div>
          </aside>

          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">
                  {selectedCategory === 'all' ? 'All Shapes' : CATEGORIES.find(c => c.id === selectedCategory)?.name}
                </h1>
                <p className="text-gray-400">
                  {filteredShapes.length} shapes • Click to view specifications
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredShapes.map((shape, i) => (
                  <Link
                    key={shape.id || i}
                    to={`/shape/${shape.id}`}
                    className="group p-5 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-cyan-500/50 transition-all hover:-translate-y-1"
                  >
                    <div className="h-40 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                      <div className="text-6xl opacity-30 group-hover:opacity-50 transition">
                        {CATEGORIES.find(c => c.id === shape.category)?.icon || '📐'}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold mb-1 group-hover:text-cyan-400 transition">{shape.name}</h3>
                    <p className="text-sm text-gray-400 mb-2">{shape.category.replace(/-/g, ' ')}</p>
                    {shape.equation && (
                      <code className="text-xs text-cyan-300/70 font-mono block truncate">{shape.equation}</code>
                    )}
                    <div className="flex gap-1 mt-3">
                      {shape.parameters?.slice(0, 5).map(p => (
                        <span key={p} className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-400">{p}</span>
                      ))}
                      {shape.parameters && shape.parameters.length > 5 && (
                        <span className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-400">+{shape.parameters.length - 5}</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {filteredShapes.length === 0 && !loading && (
              <div className="text-center py-20 text-gray-400">
                <p className="text-xl mb-2">No shapes found</p>
                <p className="text-sm">Try adjusting your search or category filter</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
