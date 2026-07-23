
import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Search, Filter, Info, Play, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { unifiedFormulaIntegration, FormulaMetadata } from '../lib/unifiedFormulaIntegration';
import { SurfaceParameters } from '../types/math';

interface FormulaExplorerProps {
  onFormulaSelect?: (formula: FormulaMetadata) => void;
}

// 3D Preview Component
function FormulaPreview({ formula, parameters }: { formula: FormulaMetadata; parameters: SurfaceParameters }) {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    const generateGeometry = async () => {
      try {
        const meshData = await unifiedFormulaIntegration.render3D(
          formula.name.toLowerCase().replace(/\s+/g, '_'),
          parameters
        );

        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.Float32BufferAttribute(meshData.vertices, 3));
        geom.setAttribute('normal', new THREE.Float32BufferAttribute(meshData.normals, 3));
        geom.setAttribute('uv', new THREE.Float32BufferAttribute(meshData.uvs, 2));
        geom.setIndex(meshData.indices);

        setGeometry(geom);
      } catch (error) {
        console.error('Failed to generate geometry:', error);
      }
    };

    generateGeometry();
  }, [formula, parameters]);

  if (!geometry) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#666" wireframe />
      </mesh>
    );
  }

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial 
        color="#00ff88" 
        metalness={0.3}
        roughness={0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Formula Card Component
function FormulaCard({ 
  formula, 
  onSelect, 
  onPreview 
}: { 
  formula: FormulaMetadata; 
  onSelect: () => void;
  onPreview: () => void;
}) {
  const getComplexityColor = (complexity: string) => {
    const colors = {
      basic: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-orange-100 text-orange-800',
      research: 'bg-red-100 text-red-800'
    };
    return colors[complexity as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg line-clamp-2">{formula.name}</h3>
        <Badge className={getComplexityColor(formula.complexity)}>
          {formula.complexity}
        </Badge>
      </div>
      
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {formula.description}
      </p>
      
      <div className="flex gap-2 mb-3">
        <Badge variant="outline">{formula.category}</Badge>
        {formula.subcategory && (
          <Badge variant="outline">{formula.subcategory}</Badge>
        )}
      </div>
      
      <div className="text-xs text-gray-500 mb-3">
        Parameters: {formula.parameterInfo.active.join(', ') || 'None'}
      </div>
      
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={onPreview}>
          <Play className="w-4 h-4 mr-1" />
          Preview
        </Button>
        <Button size="sm" onClick={onSelect}>
          <Download className="w-4 h-4 mr-1" />
          Use Formula
        </Button>
      </div>
    </Card>
  );
}

export default function FormulaExplorer({ onFormulaSelect }: FormulaExplorerProps) {
  const [formulas, setFormulas] = useState<FormulaMetadata[]>([]);
  const [filteredFormulas, setFilteredFormulas] = useState<FormulaMetadata[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedComplexity, setSelectedComplexity] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [previewFormula, setPreviewFormula] = useState<FormulaMetadata | null>(null);
  const [previewParams, setPreviewParams] = useState<SurfaceParameters>({
    type: 'sphere' as any,
    a: 2, b: 2, c: 2, d: 0, e: 0, f: 0,
    g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
    uMin: 0, uMax: 1, vMin: 0, vMax: 1,
    uSegments: 32, vSegments: 32
  });

  useEffect(() => {
    const initializeFormulas = async () => {
      await unifiedFormulaIntegration.initialize();
      
      const allFormulas = Array.from(unifiedFormulaIntegration.getAllFormulas().values());
      const formulaStats = unifiedFormulaIntegration.getFormulaStats();
      const formulaCategories = unifiedFormulaIntegration.getCategories();
      
      setFormulas(allFormulas);
      setFilteredFormulas(allFormulas);
      setStats(formulaStats);
      setCategories(formulaCategories);
    };

    initializeFormulas();
  }, []);

  useEffect(() => {
    let filtered = formulas;

    // Apply search filter
    if (searchQuery) {
      filtered = unifiedFormulaIntegration.searchFormulas(searchQuery);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(f => f.category === selectedCategory);
    }

    // Apply complexity filter
    if (selectedComplexity !== 'all') {
      filtered = filtered.filter(f => f.complexity === selectedComplexity);
    }

    setFilteredFormulas(filtered);
  }, [searchQuery, selectedCategory, selectedComplexity, formulas]);

  return (
    <div className="h-screen flex">
      {/* Left Panel - Formula Browser */}
      <div className="w-1/2 border-r bg-gray-50 flex flex-col">
        <div className="p-4 border-b bg-white">
          <h1 className="text-2xl font-bold mb-4">Formula Explorer</h1>
          
          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-blue-500">Total Formulas</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{Object.keys(stats.byCategory).length}</div>
                <div className="text-sm text-green-500">Categories</div>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search formulas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
              ))}
            </select>

            <select
              value={selectedComplexity}
              onChange={(e) => setSelectedComplexity(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Complexity</option>
              <option value="basic">Basic</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="research">Research</option>
            </select>
          </div>

          <div className="text-sm text-gray-500">
            Showing {filteredFormulas.length} of {formulas.length} formulas
          </div>
        </div>

        {/* Formula List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid gap-4">
            {filteredFormulas.map((formula, index) => (
              <FormulaCard
                key={`${formula.category}-${index}`}
                formula={formula}
                onSelect={() => onFormulaSelect?.(formula)}
                onPreview={() => setPreviewFormula(formula)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - 3D Preview */}
      <div className="w-1/2 flex flex-col">
        <div className="p-4 border-b bg-white">
          <h2 className="text-xl font-bold">3D Preview</h2>
          {previewFormula && (
            <div className="mt-2">
              <h3 className="font-semibold">{previewFormula.name}</h3>
              <p className="text-sm text-gray-600">{previewFormula.description}</p>
            </div>
          )}
        </div>

        <div className="flex-1">
          <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} />
            <pointLight position={[-10, -10, -10]} intensity={0.3} />

            {previewFormula ? (
              <FormulaPreview formula={previewFormula} parameters={previewParams} />
            ) : (
              <mesh>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial color="#666" wireframe />
              </mesh>
            )}

            <OrbitControls enableZoom enablePan enableRotate />
            <gridHelper args={[10, 10]} />
            <axesHelper args={[2]} />
          </Canvas>
        </div>

        {/* Parameter Controls */}
        {previewFormula && (
          <div className="p-4 border-t bg-white max-h-48 overflow-y-auto">
            <h3 className="font-semibold mb-2">Parameters</h3>
            <div className="grid grid-cols-2 gap-2">
              {previewFormula.parameterInfo.active.slice(0, 6).map(param => (
                <div key={param} className="flex items-center gap-2">
                  <label className="text-sm w-8">{param}:</label>
                  <input
                    type="range"
                    min={previewFormula.parameterInfo.ranges[param]?.[0] || -5}
                    max={previewFormula.parameterInfo.ranges[param]?.[1] || 5}
                    step="0.1"
                    value={previewParams[param as keyof SurfaceParameters] as number || 1}
                    onChange={(e) => setPreviewParams(prev => ({
                      ...prev,
                      [param]: parseFloat(e.target.value)
                    }))}
                    className="flex-1"
                  />
                  <span className="text-xs w-12 text-right">
                    {((previewParams[param as keyof SurfaceParameters] as number) || 1).toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
