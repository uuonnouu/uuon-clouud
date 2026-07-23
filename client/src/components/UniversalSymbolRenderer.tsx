import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { sdkClient } from '../lib/unifiedSDKClient';

interface SymbolData {
  symbol: string;
  unicode: string;
  draw_js: string;
  html: string;
  latex: string;
  python_safe: string;
  json_safe: string;
  description: string;
  category: string;
  aliases: string[];
  "3d": {
    method: string;
    mesh?: string;
    geometry_type?: string;
    parameters?: Record<string, number>;
  };
}

interface Symbol3DData {
  vertices: number[];
  indices: number[];
  normals: number[];
  uvs: number[];
  metadata: {
    symbol: string;
    method: string;
    vertex_count: number;
    triangle_count: number;
  };
}

interface UniversalSymbolRendererProps {
  symbolName: string;
  renderMode: '2d' | '3d' | 'both';
  size?: number;
  color?: string;
  interactive?: boolean;
  onSymbolLoad?: (data: SymbolData) => void;
  onError?: (error: string) => void;
}

// Symbol to geometry generation - creates 3D mesh from symbol character
const generateGeometryFromSymbol = (symbol: string): { type: string; symbol: string; vertices?: number[]; indices?: number[] } => {
  console.log(`Generating geometry for: ${symbol}`);
  
  // Generate actual geometry based on symbol unicode codepoint
  const codePoint = symbol.codePointAt(0) || 0;
  const normalized = (codePoint % 360) / 360; // Normalize to 0-1
  
  // Generate parametric vertices based on symbol
  const vertices: number[] = [];
  const segments = 32;
  
  for (let i = 0; i <= segments; i++) {
    const u = (i / segments) * Math.PI * 2;
    for (let j = 0; j <= segments; j++) {
      const v = (j / segments) * Math.PI;
      
      // Create unique geometry based on symbol codepoint
      const r = 1 + 0.3 * Math.sin(normalized * 10 + u * 3);
      const x = r * Math.sin(v) * Math.cos(u);
      const y = r * Math.sin(v) * Math.sin(u);
      const z = r * Math.cos(v) + normalized * 0.5;
      
      vertices.push(x, y, z);
    }
  }
  
  return { 
    type: 'parametric_surface', 
    symbol,
    vertices
  };
};

// 3D Symbol Mesh Component
function Symbol3DMesh({ symbol3dData }: { symbol3dData: Symbol3DData }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = React.useMemo(() => {
    const geom = new THREE.BufferGeometry();

    geom.setAttribute('position', new THREE.Float32BufferAttribute(symbol3dData.vertices, 3));
    geom.setAttribute('normal', new THREE.Float32BufferAttribute(symbol3dData.normals, 3));

    if (symbol3dData.uvs.length > 0) {
      geom.setAttribute('uv', new THREE.Float32BufferAttribute(symbol3dData.uvs, 2));
    }

    if (symbol3dData.indices.length > 0) {
      geom.setIndex(symbol3dData.indices);
    }

    return geom;
  }, [symbol3dData]);

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial 
        color="#00ff88" 
        metalness={0.7}
        roughness={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function UniversalSymbolRenderer({ 
  symbolName, 
  renderMode = 'both', 
  size = 1.0,
  color = '#00ff88',
  interactive = true,
  onSymbolLoad,
  onError 
}: UniversalSymbolRendererProps) {
  const [symbolData, setSymbolData] = useState<SymbolData | null>(null);
  const [symbol3dData, setSymbol3dData] = useState<Symbol3DData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load symbol data from back-end
  useEffect(() => {
    const loadSymbol = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch symbol metadata
        const symbolResult = await sdkClient.legacyCall(`/api/uuon-symbol/${symbolName}`, 'GET');
        if (!symbolResult.success) {
          throw new Error(`Symbol ${symbolName} not found`);
        }

        const symbol = symbolResult.data?.data;
        setSymbolData(symbol);
        onSymbolLoad?.(symbol);

        // If 3D rendering requested, fetch 3D data
        if (renderMode === '3d' || renderMode === 'both') {
          const render3dResult = await sdkClient.legacyCall(`/api/uuon-symbol/${symbolName}/render3d`, 'POST', {
            method: symbol["3d"].method,
            parameters: symbol["3d"].parameters,
            quality: 'medium'
          });

          if (!render3dResult.success) {
            throw new Error('Failed to generate 3D representation');
          }

          setSymbol3dData(render3dResult.data?.["3d_data"]);
        }

      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMsg);
        onError?.(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (symbolName) {
      loadSymbol();
    }
  }, [symbolName, renderMode, onSymbolLoad, onError]);

  // Unicode-aware text processing
  const processTextInput = (text: string) => {
    // Unicode-aware grapheme cluster processing
    const graphemes = parseTextToGraphemes(text);
  
    return graphemes.map(grapheme => ({
      symbol: grapheme,
      geometry: generateGeometryFromSymbol(grapheme),
      isComplexUnicode: grapheme.length > 1
    }));
  };
  
  const parseTextToGraphemes = (text: string): string[] => {
    const graphemes: string[] = [];
    let index = 0;
  
    while (index < text.length) {
      const nextBreak = findNextUnicodeBreak(text, index);
      const grapheme = text.slice(index, nextBreak);
      if (grapheme.trim()) {
        graphemes.push(grapheme);
      }
      index = nextBreak;
    }
  
    return graphemes;
  };
  
  const findNextUnicodeBreak = (str: string, start: number): number => {
    if (start >= str.length) return str.length;
  
    let end = start + 1;
  
    // Handle complex Unicode sequences
    while (end < str.length) {
      const current = str.codePointAt(end - 1);
      const next = str.codePointAt(end);
  
      if (current && next && shouldContinueGrapheme(current, next)) {
        end++;
      } else {
        break;
      }
    }
  
    return end;
  };
  
  const shouldContinueGrapheme = (current: number, next: number): boolean => {
    // Simplified grapheme continuation rules
    return (next >= 0x300 && next <= 0x36F) ||     // Combining diacriticals
           (next >= 0x1AB0 && next <= 0x1AFF) ||   // Extended combining marks
           (next >= 0x1DC0 && next <= 0x1DFF) ||   // Combining marks supplement
           (next === 0x200D) ||                    // Zero-width joiner
           (next >= 0xFE00 && next <= 0xFE0F);     // Variation selectors
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        <span className="ml-3 text-cyan-400">Loading symbol...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
        <h3 className="text-red-400 font-bold mb-2">Symbol Load Error</h3>
        <p className="text-red-300 text-sm">{error}</p>
      </div>
    );
  }

  if (!symbolData) {
    return null;
  }

  return (
    <div className="universal-symbol-renderer">
      {/* 2D Symbol Display */}
      {(renderMode === '2d' || renderMode === 'both') && (
        <div className="symbol-2d-container mb-4">
          <div className="bg-gray-900/80 rounded-lg p-4 border border-cyan-500/30">
            <div className="flex items-center gap-4 mb-3">
              <div 
                className="symbol-glyph text-6xl"
                style={{ 
                  color,
                  fontSize: `${size * 3}rem`,
                  fontFamily: 'serif'
                }}
                dangerouslySetInnerHTML={{ __html: symbolData.html }}
              />
              <div>
                <h3 className="text-cyan-400 font-bold text-lg">{symbolData.symbol}</h3>
                <p className="text-gray-300 text-sm">{symbolData.description}</p>
                <p className="text-gray-500 text-xs">Category: {symbolData.category}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-800/50 p-2 rounded">
                <span className="text-blue-300">Unicode:</span>
                <div className="text-white font-mono">{symbolData.unicode}</div>
              </div>
              <div className="bg-gray-800/50 p-2 rounded">
                <span className="text-green-300">LaTeX:</span>
                <div className="text-white font-mono">{symbolData.latex}</div>
              </div>
              <div className="bg-gray-800/50 p-2 rounded">
                <span className="text-yellow-300">JavaScript:</span>
                <div className="text-white font-mono">{symbolData.draw_js}</div>
              </div>
              <div className="bg-gray-800/50 p-2 rounded">
                <span className="text-purple-300">Python:</span>
                <div className="text-white font-mono">{symbolData.python_safe}</div>
              </div>
            </div>

            {symbolData.aliases.length > 0 && (
              <div className="mt-3 pt-2 border-t border-gray-700">
                <span className="text-gray-400 text-xs">Aliases: </span>
                <span className="text-gray-300 text-xs">{symbolData.aliases.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3D Symbol Display */}
      {(renderMode === '3d' || renderMode === 'both') && symbol3dData && (
        <div className="symbol-3d-container h-96 bg-gray-900/80 rounded-lg border border-cyan-500/30 overflow-hidden">
          <div className="h-full">
            <Canvas
              camera={{ position: [3, 3, 3], fov: 50 }}
              gl={{ antialias: true, alpha: false }}
            >
              <ambientLight intensity={0.4} />
              <directionalLight position={[10, 10, 5]} intensity={0.8} />
              <pointLight position={[-10, -10, -10]} intensity={0.3} color="#0088ff" />

              <Symbol3DMesh symbol3dData={symbol3dData} />

              {interactive && (
                <OrbitControls 
                  enableZoom={true}
                  enablePan={true}
                  enableRotate={true}
                  maxDistance={10}
                  minDistance={1}
                />
              )}

              <gridHelper args={[10, 10, "#333", "#333"]} />
            </Canvas>
          </div>

          <div className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-1 text-xs">
            <span className="text-cyan-300">3D Method: </span>
            <span className="text-white">{symbolData["3d"].method}</span>
            <span className="text-gray-400 ml-2">
              {symbol3dData.metadata.vertex_count} vertices, {symbol3dData.metadata.triangle_count} triangles
            </span>
          </div>
        </div>
      )}
    </div>
  );
}