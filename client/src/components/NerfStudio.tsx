import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  Upload, FileCheck, AlertTriangle, CheckCircle, 
  Eye, Layers, Grid3X3, Cpu, Shield, Download,
  Play, Pause, RotateCcw, Maximize2, Info, Zap
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { positionalEncoding } from '../lib/neuralRepresentationsEngine';

interface NerfFileData {
  version: string;
  type: 'nerf' | 'sdf' | 'hybrid';
  encoding: {
    type: 'fourier' | 'hashgrid';
    levels: number;
    features: number[][];
  };
  network: {
    weights: number[][][];
    biases?: number[][];
    activations?: string[];
  };
  bounds?: {
    min: [number, number, number];
    max: [number, number, number];
  };
  metadata?: {
    shapeId: string;
    shapeName: string;
    parameters?: Record<string, number>;
    exportDate: string;
    algorithm?: string;
  };
  security?: {
    cryptographicHash: string;
    verificationCode: string;
    timestamp: string;
    author: string;
    organization: string;
    copyright: string;
    license: string;
    integrityVersion: string;
  };
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  score: number;
  details: {
    hasVersion: boolean;
    hasEncoding: boolean;
    hasNetwork: boolean;
    hasBounds: boolean;
    hasMetadata: boolean;
    hasSecurity: boolean;
    encodingLevels: number;
    networkLayers: number;
    featureCount: number;
    hashValid: boolean;
  };
}

function validateNerfFile(data: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const hasVersion = !!data?.version;
  const hasEncoding = !!data?.encoding?.type && Array.isArray(data?.encoding?.features);
  const hasNetwork = !!data?.network?.weights && Array.isArray(data?.network?.weights);
  const hasBounds = !!data?.bounds?.min && !!data?.bounds?.max;
  const hasMetadata = !!data?.metadata?.shapeId;
  const hasSecurity = !!data?.security?.cryptographicHash;
  
  if (!hasVersion) errors.push('Missing version field');
  if (!hasEncoding) errors.push('Missing or invalid encoding structure');
  if (!hasNetwork) errors.push('Missing or invalid network weights');
  
  if (!hasBounds) warnings.push('No bounds defined - using defaults');
  if (!hasMetadata) warnings.push('No metadata - shape origin unknown');
  if (!hasSecurity) warnings.push('No security fingerprint - cannot verify integrity');
  
  const encodingLevels = data?.encoding?.levels || 0;
  const networkLayers = data?.network?.weights?.length || 0;
  const featureCount = data?.encoding?.features?.reduce((acc: number, f: number[]) => acc + f.length, 0) || 0;
  
  if (encodingLevels < 4) warnings.push('Low encoding levels may reduce detail');
  if (encodingLevels > 16) warnings.push('High encoding levels may impact performance');
  
  let score = 0;
  if (hasVersion) score += 10;
  if (hasEncoding) score += 25;
  if (hasNetwork) score += 25;
  if (hasBounds) score += 15;
  if (hasMetadata) score += 15;
  if (hasSecurity) score += 10;
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    score,
    details: {
      hasVersion,
      hasEncoding,
      hasNetwork,
      hasBounds,
      hasMetadata,
      hasSecurity,
      encodingLevels,
      networkLayers,
      featureCount,
      hashValid: hasSecurity
    }
  };
}

function NerfPointCloud({ 
  nerfData, 
  sampleDensity = 32,
  showDensity = true,
  colorMode = 'encoding'
}: { 
  nerfData: NerfFileData; 
  sampleDensity?: number;
  showDensity?: boolean;
  colorMode?: 'encoding' | 'position' | 'density';
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const [rotation, setRotation] = useState(0);
  
  const { positions, colors } = useMemo(() => {
    const pos: number[] = [];
    const col: number[] = [];
    
    const bounds = nerfData.bounds || { min: [-1, -1, -1], max: [1, 1, 1] };
    const [minX, minY, minZ] = bounds.min;
    const [maxX, maxY, maxZ] = bounds.max;
    
    const features = nerfData.encoding.features;
    const levels = nerfData.encoding.levels || 10;
    
    for (let xi = 0; xi < sampleDensity; xi++) {
      for (let yi = 0; yi < sampleDensity; yi++) {
        for (let zi = 0; zi < sampleDensity; zi++) {
          const x = minX + (xi / (sampleDensity - 1)) * (maxX - minX);
          const y = minY + (yi / (sampleDensity - 1)) * (maxY - minY);
          const z = minZ + (zi / (sampleDensity - 1)) * (maxZ - minZ);
          
          const encoded = positionalEncoding(x, y, z, Math.min(levels, 6));
          
          let density = 0;
          if (features && features.length > 0) {
            const featureIdx = Math.floor((xi * sampleDensity * sampleDensity + yi * sampleDensity + zi) % features.length);
            const feature = features[featureIdx];
            if (feature && feature.length > 0) {
              const sampleIdx = Math.floor((xi + yi + zi) % feature.length);
              density = Math.abs(feature[sampleIdx] || 0);
            }
          }
          
          if (!showDensity || density > 0.01) {
            pos.push(x, y, z);
            
            if (colorMode === 'encoding') {
              const hue = (encoded[0] + 1) * 180;
              const sat = 0.8;
              const light = 0.5 + density * 0.3;
              const color = new THREE.Color().setHSL(hue / 360, sat, light);
              col.push(color.r, color.g, color.b);
            } else if (colorMode === 'position') {
              col.push(
                (x - minX) / (maxX - minX),
                (y - minY) / (maxY - minY),
                (z - minZ) / (maxZ - minZ)
              );
            } else {
              const intensity = Math.min(1, density * 5);
              col.push(intensity * 0.2, intensity * 0.8, intensity);
            }
          }
        }
      }
    }
    
    return {
      positions: new Float32Array(pos),
      colors: new Float32Array(col)
    };
  }, [nerfData, sampleDensity, showDensity, colorMode]);
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

function NetworkVisualization({ nerfData }: { nerfData: NerfFileData }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const networkStructure = useMemo(() => {
    const layers: { nodes: number; connections: number }[] = [];
    const weights = nerfData.network.weights;
    
    if (weights && weights.length > 0) {
      for (let i = 0; i < weights.length; i++) {
        const layer = weights[i];
        const inputNodes = layer.length;
        const outputNodes = layer[0]?.length || 0;
        layers.push({ nodes: inputNodes, connections: inputNodes * outputNodes });
      }
      const lastLayer = weights[weights.length - 1];
      if (lastLayer && lastLayer[0]) {
        layers.push({ nodes: lastLayer[0].length, connections: 0 });
      }
    }
    
    return layers;
  }, [nerfData]);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });
  
  return (
    <group ref={groupRef}>
      {networkStructure.map((layer, layerIdx) => {
        const xPos = (layerIdx - networkStructure.length / 2) * 0.8;
        const nodePositions: [number, number, number][] = [];
        
        for (let i = 0; i < Math.min(layer.nodes, 16); i++) {
          const yPos = (i - Math.min(layer.nodes, 16) / 2) * 0.15;
          nodePositions.push([xPos, yPos, 0]);
        }
        
        return (
          <group key={layerIdx}>
            {nodePositions.map((pos, nodeIdx) => (
              <mesh key={nodeIdx} position={pos}>
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshStandardMaterial 
                  color={layerIdx === 0 ? '#00ffff' : layerIdx === networkStructure.length - 1 ? '#ff00ff' : '#4488ff'}
                  emissive={layerIdx === 0 ? '#003333' : layerIdx === networkStructure.length - 1 ? '#330033' : '#001133'}
                />
              </mesh>
            ))}
            {layerIdx < networkStructure.length - 1 && (
              <Html position={[xPos + 0.4, -1.5, 0]} center>
                <div className="text-xs text-cyan-400 bg-black/50 px-1 rounded">
                  {layer.connections} conn
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

function FeatureHeatmap({ features }: { features: number[][] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !features || features.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    
    const maxFeatures = features.length;
    const maxValues = Math.max(...features.map(f => f.length));
    
    const cellWidth = width / maxValues;
    const cellHeight = height / maxFeatures;
    
    for (let fi = 0; fi < maxFeatures; fi++) {
      const feature = features[fi];
      for (let vi = 0; vi < feature.length; vi++) {
        const value = feature[vi];
        const normalized = (value + 0.2) / 0.4;
        const hue = normalized * 240;
        ctx.fillStyle = `hsl(${hue}, 80%, 50%)`;
        ctx.fillRect(vi * cellWidth, fi * cellHeight, cellWidth, cellHeight);
      }
    }
  }, [features]);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={256} 
      height={64} 
      className="w-full h-16 rounded border border-cyan-500/30"
    />
  );
}

export default function NerfStudio() {
  const [nerfData, setNerfData] = useState<NerfFileData | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [viewMode, setViewMode] = useState<'pointcloud' | 'network' | 'split'>('pointcloud');
  const [sampleDensity, setSampleDensity] = useState(24);
  const [showDensityFilter, setShowDensityFilter] = useState(true);
  const [colorMode, setColorMode] = useState<'encoding' | 'position' | 'density'>('encoding');
  const [isPlaying, setIsPlaying] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  
  const handleFileSelect = useCallback((file: File) => {
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content) as NerfFileData;
        setNerfData(data);
        setValidation(validateNerfFile(data));
      } catch (error) {
        setValidation({
          valid: false,
          errors: ['Failed to parse file - invalid JSON format'],
          warnings: [],
          score: 0,
          details: {
            hasVersion: false,
            hasEncoding: false,
            hasNetwork: false,
            hasBounds: false,
            hasMetadata: false,
            hasSecurity: false,
            encodingLevels: 0,
            networkLayers: 0,
            featureCount: 0,
            hashValid: false
          }
        });
        setNerfData(null);
      }
    };
    reader.readAsText(file);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.nerf') || file.name.endsWith('.json'))) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);
  
  const resetStudio = useCallback(() => {
    setNerfData(null);
    setValidation(null);
    setFileName('');
  }, []);

  return (
    <div className="h-full flex flex-col bg-black text-white">
      <div className="p-3 border-b border-cyan-500/30 bg-gradient-to-r from-cyan-900/20 to-purple-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-cyan-400">NeRF Studio</h2>
            <Badge variant="outline" className="text-xs border-cyan-500/50 text-cyan-300">
              Neural Radiance Field Validator
            </Badge>
          </div>
          {nerfData && (
            <Button variant="ghost" size="sm" onClick={resetStudio} className="text-cyan-400 hover:text-cyan-300">
              <RotateCcw className="w-4 h-4 mr-1" /> Reset
            </Button>
          )}
        </div>
      </div>
      
      {!nerfData ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <div
            className={`w-full max-w-xl border-2 border-dashed rounded-xl p-12 text-center transition-all ${
              dragOver 
                ? 'border-cyan-400 bg-cyan-400/10 scale-105' 
                : 'border-cyan-500/30 hover:border-cyan-500/50 hover:bg-cyan-500/5'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <Upload className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
            <h3 className="text-xl font-bold text-cyan-300 mb-2">Upload NeRF File</h3>
            <p className="text-gray-400 mb-6">
              Drag & drop a .nerf or .json file here, or click to browse
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".nerf,.json"
              onChange={handleInputChange}
              className="hidden"
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-cyan-600 hover:bg-cyan-500 text-white"
            >
              <Upload className="w-4 h-4 mr-2" /> Select File
            </Button>
            <div className="mt-6 text-sm text-gray-500">
              Supported formats: .nerf, .json (Δmension Neural Export)
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 relative">
            <Canvas className="bg-black">
              <PerspectiveCamera makeDefault position={[3, 2, 3]} />
              <OrbitControls enableDamping autoRotate={isPlaying} autoRotateSpeed={0.5} />
              <ambientLight intensity={0.3} />
              <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
              
              {(viewMode === 'pointcloud' || viewMode === 'split') && (
                <NerfPointCloud 
                  nerfData={nerfData}
                  sampleDensity={sampleDensity}
                  showDensity={showDensityFilter}
                  colorMode={colorMode}
                />
              )}
              
              {(viewMode === 'network' || viewMode === 'split') && (
                <group position={viewMode === 'split' ? [2, 0, 0] : [0, 0, 0]}>
                  <NetworkVisualization nerfData={nerfData} />
                </group>
              )}
              
              <gridHelper args={[4, 20, '#333', '#222']} />
              <axesHelper args={[2]} />
            </Canvas>
            
            <div className="absolute bottom-4 left-4 flex gap-2">
              <Button
                size="sm"
                variant={isPlaying ? "default" : "outline"}
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-black/50 border-cyan-500/50"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'pointcloud' ? "default" : "outline"}
                onClick={() => setViewMode('pointcloud')}
                className="bg-black/50 border-cyan-500/50"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'network' ? "default" : "outline"}
                onClick={() => setViewMode('network')}
                className="bg-black/50 border-cyan-500/50"
              >
                <Cpu className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'split' ? "default" : "outline"}
                onClick={() => setViewMode('split')}
                className="bg-black/50 border-cyan-500/50"
              >
                <Layers className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="w-80 border-l border-cyan-500/30 bg-black/50 overflow-hidden flex flex-col">
            <Tabs defaultValue="validation" className="flex-1 flex flex-col">
              <TabsList className="m-2 bg-cyan-900/20">
                <TabsTrigger value="validation" className="text-xs">Validation</TabsTrigger>
                <TabsTrigger value="details" className="text-xs">Details</TabsTrigger>
                <TabsTrigger value="controls" className="text-xs">Controls</TabsTrigger>
              </TabsList>
              
              <ScrollArea className="flex-1">
                <TabsContent value="validation" className="p-3 m-0">
                  <Card className="bg-black/50 border-cyan-500/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        {validation?.valid ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                        )}
                        <span className={validation?.valid ? 'text-green-400' : 'text-red-400'}>
                          {validation?.valid ? 'Valid NeRF File' : 'Validation Failed'}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Quality Score</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-cyan-500 to-green-500 transition-all"
                              style={{ width: `${validation?.score || 0}%` }}
                            />
                          </div>
                          <span className="text-cyan-400 font-bold">{validation?.score}%</span>
                        </div>
                      </div>
                      
                      <Separator className="bg-cyan-500/20" />
                      
                      <div className="space-y-2">
                        <div className="text-sm text-gray-300 font-medium">Structure Check</div>
                        {[
                          { key: 'hasVersion', label: 'Version', icon: FileCheck },
                          { key: 'hasEncoding', label: 'Encoding', icon: Zap },
                          { key: 'hasNetwork', label: 'Network', icon: Cpu },
                          { key: 'hasBounds', label: 'Bounds', icon: Maximize2 },
                          { key: 'hasMetadata', label: 'Metadata', icon: Info },
                          { key: 'hasSecurity', label: 'Security', icon: Shield },
                        ].map(({ key, label, icon: Icon }) => (
                          <div key={key} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <Icon className="w-3 h-3 text-gray-500" />
                              <span className="text-gray-400">{label}</span>
                            </div>
                            {validation?.details[key as keyof typeof validation.details] ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-yellow-400" />
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {validation?.errors && validation.errors.length > 0 && (
                        <div className="space-y-1 pt-2">
                          <div className="text-sm text-red-400 font-medium">Errors</div>
                          {validation.errors.map((err, i) => (
                            <div key={i} className="text-xs text-red-300 bg-red-900/20 p-2 rounded">
                              {err}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {validation?.warnings && validation.warnings.length > 0 && (
                        <div className="space-y-1 pt-2">
                          <div className="text-sm text-yellow-400 font-medium">Warnings</div>
                          {validation.warnings.map((warn, i) => (
                            <div key={i} className="text-xs text-yellow-300 bg-yellow-900/20 p-2 rounded">
                              {warn}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="details" className="p-3 m-0 space-y-3">
                  <Card className="bg-black/50 border-cyan-500/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-cyan-400">File Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Filename</span>
                        <span className="text-cyan-300 truncate max-w-32">{fileName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Version</span>
                        <span className="text-cyan-300">{nerfData.version}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type</span>
                        <Badge variant="outline" className="text-xs">{nerfData.type}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-black/50 border-cyan-500/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-cyan-400">Encoding</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type</span>
                        <span className="text-cyan-300">{nerfData.encoding.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Levels</span>
                        <span className="text-cyan-300">{nerfData.encoding.levels}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Features</span>
                        <span className="text-cyan-300">
                          {nerfData.encoding.features.length} × {nerfData.encoding.features[0]?.length || 0}
                        </span>
                      </div>
                      <div className="pt-2">
                        <div className="text-gray-400 mb-1">Feature Heatmap</div>
                        <FeatureHeatmap features={nerfData.encoding.features} />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-black/50 border-cyan-500/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-cyan-400">Network</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Layers</span>
                        <span className="text-cyan-300">{nerfData.network.weights.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Input Dim</span>
                        <span className="text-cyan-300">{nerfData.network.weights[0]?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Output Dim</span>
                        <span className="text-cyan-300">{nerfData.network.weights[0]?.[0]?.length || 0}</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {nerfData.metadata && (
                    <Card className="bg-black/50 border-cyan-500/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-cyan-400">Metadata</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Shape ID</span>
                          <span className="text-cyan-300 truncate max-w-32">{nerfData.metadata.shapeId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Shape Name</span>
                          <span className="text-cyan-300 truncate max-w-32">{nerfData.metadata.shapeName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Export Date</span>
                          <span className="text-cyan-300">{new Date(nerfData.metadata.exportDate).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {nerfData.security && (
                    <Card className="bg-black/50 border-green-500/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-green-400 flex items-center gap-2">
                          <Shield className="w-4 h-4" /> Security
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Verification</span>
                          <span className="text-green-300 font-mono">{nerfData.security.verificationCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Author</span>
                          <span className="text-green-300">{nerfData.security.author}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">License</span>
                          <span className="text-green-300">{nerfData.security.license}</span>
                        </div>
                        <div className="pt-2">
                          <div className="text-gray-400 mb-1">Hash</div>
                          <div className="font-mono text-xs text-green-300 bg-green-900/20 p-2 rounded break-all">
                            {nerfData.security.cryptographicHash.slice(0, 32)}...
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="controls" className="p-3 m-0 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-cyan-400">Sample Density</Label>
                    <div className="flex items-center gap-3">
                      <Slider
                        value={[sampleDensity]}
                        onValueChange={([v]) => setSampleDensity(v)}
                        min={8}
                        max={48}
                        step={4}
                        className="flex-1"
                      />
                      <span className="text-sm text-cyan-300 w-8">{sampleDensity}³</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-cyan-400">Density Filter</Label>
                    <Switch
                      checked={showDensityFilter}
                      onCheckedChange={setShowDensityFilter}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm text-cyan-400">Color Mode</Label>
                    <div className="flex gap-2">
                      {(['encoding', 'position', 'density'] as const).map((mode) => (
                        <Button
                          key={mode}
                          size="sm"
                          variant={colorMode === mode ? 'default' : 'outline'}
                          onClick={() => setColorMode(mode)}
                          className="text-xs flex-1"
                        >
                          {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <Separator className="bg-cyan-500/20" />
                  
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400">Preview Stats</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-cyan-900/20 p-2 rounded">
                        <div className="text-gray-400">Points</div>
                        <div className="text-cyan-300 font-bold">{Math.pow(sampleDensity, 3).toLocaleString()}</div>
                      </div>
                      <div className="bg-cyan-900/20 p-2 rounded">
                        <div className="text-gray-400">Memory</div>
                        <div className="text-cyan-300 font-bold">
                          {(Math.pow(sampleDensity, 3) * 24 / 1024).toFixed(1)} KB
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}
