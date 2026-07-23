import React, { useState, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { generateCustomParametricSurface, MATHEMATICAL_EXPRESSIONS, CustomEquation, evaluateExpression, generateFieldLines, VectorField } from '../lib/customEquations';

interface CustomPlotProps {
  onClose?: () => void;
}

export default function CustomPlot({ onClose }: CustomPlotProps) {
  const [equation, setEquation] = useState<CustomEquation>(MATHEMATICAL_EXPRESSIONS.gaussian_wave);
  const [uSegments, setUSegments] = useState(50);
  const [vSegments, setVSegments] = useState(50);
  const [selectedPreset, setSelectedPreset] = useState('gaussian_wave');
  const [visualMode, setVisualMode] = useState<'surface' | 'wireframe' | 'enhanced_wireframe' | 'neon_wireframe' | 'points'>('wireframe');
  const [colorMode, setColorMode] = useState('height');

  const handlePresetChange = useCallback((preset: string) => {
    setSelectedPreset(preset);
    if (MATHEMATICAL_EXPRESSIONS[preset]) {
      setEquation(MATHEMATICAL_EXPRESSIONS[preset]);
    }
  }, []);

  const handleEquationChange = useCallback((field: keyof CustomEquation, value: string | number) => {
    setEquation(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Generate surface data
  const surfaceData = useMemo(() => {
    try {
      return generateCustomParametricSurface({
        equation,
        uSegments,
        vSegments,
        name: selectedPreset
      });
    } catch (error) {
      console.warn('Error generating surface:', error);
      return null;
    }
  }, [equation, uSegments, vSegments, selectedPreset]);

  // Custom parametric surface component
  function CustomParametricSurface() {
    if (!surfaceData) return null;

    const geometry = useMemo(() => {
      const geom = new THREE.BufferGeometry();
      geom.setIndex(Array.from(surfaceData.indices));
      geom.setAttribute('position', new THREE.Float32BufferAttribute(surfaceData.vertices, 3));
      geom.setAttribute('normal', new THREE.Float32BufferAttribute(surfaceData.normals, 3));
      geom.setAttribute('uv', new THREE.Float32BufferAttribute(surfaceData.uvs, 2));

      // Generate colors based on height or other properties
      const colors = new Float32Array(surfaceData.vertices.length);
      for (let i = 0; i < surfaceData.vertices.length; i += 3) {
        const z = surfaceData.vertices[i + 2];
        const normalizedZ = Math.max(0, Math.min(1, (z + 2) / 4)); // Normalize height

        if (colorMode === 'height') {
          // Height-based coloring (blue to red gradient)
          colors[i] = normalizedZ; // R
          colors[i + 1] = 0.3; // G
          colors[i + 2] = 1 - normalizedZ; // B
        } else if (colorMode === 'quantum') {
          // Quantum-like coloring
          const phase = z * Math.PI;
          colors[i] = Math.sin(phase) * 0.5 + 0.5; // R
          colors[i + 1] = Math.cos(phase) * 0.5 + 0.5; // G
          colors[i + 2] = Math.sin(phase * 2) * 0.5 + 0.5; // B
        } else {
          // Default neon green
          colors[i] = 0;
          colors[i + 1] = 1;
          colors[i + 2] = 0.5;
        }
      }
      geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      return geom;
    }, [surfaceData, colorMode]);

    const material = useMemo(() => {
      if (visualMode === 'wireframe') {
        return new THREE.MeshBasicMaterial({
          wireframe: true,
          color: 0x00ffcc, // Enhanced cyan wireframe
          transparent: true,
          opacity: 0.95
        });
      } else if (visualMode === 'enhanced_wireframe') {
        // Enhanced wireframe with subtle surface and edge highlighting
        return new THREE.MeshLambertMaterial({
          color: 0x003366,
          transparent: true,
          opacity: 0.2,
          wireframe: false,
          side: THREE.DoubleSide,
          emissive: 0x001144
        });
      } else if (visualMode === 'neon_wireframe') {
        // Neon glowing wireframe effect
        return new THREE.MeshBasicMaterial({
          wireframe: true,
          color: 0x00ff88,
          transparent: true,
          opacity: 1.0
        });
      } else if (visualMode === 'points') {
        return new THREE.PointsMaterial({
          size: 0.08,
          vertexColors: true,
          transparent: true,
          opacity: 0.9,
          sizeAttenuation: true
        });
      } else {
        return new THREE.MeshLambertMaterial({
          vertexColors: true,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
          emissive: 0x001122 // Subtle glow effect
        });
      }
    }, [visualMode]);

    if (visualMode === 'points') {
      return <points geometry={geometry} material={material} />;
    } else {
      return <mesh geometry={geometry} material={material} />;
    }
  }

  function Lights() {
    return (
      <>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />
      </>
    );
  }

  return (
    <div className="w-full h-screen bg-gray-900 text-white flex">
      {/* Control Panel */}
      <Card className="w-96 p-4 bg-gray-800 border-gray-600 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-cyan-400">Custom Math Plot</h2>
            {onClose && (
              <Button onClick={onClose} variant="outline" size="sm">
                Back
              </Button>
            )}
          </div>

          {/* Preset Selection */}
          <div>
            <Label className="text-cyan-300 font-semibold">Mathematical Expression Presets</Label>
            <Select value={selectedPreset} onValueChange={handlePresetChange}>
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="gaussian_wave">Gaussian Wave</SelectItem>
                <SelectItem value="hydrogen_orbital">Hydrogen Orbital</SelectItem>
                <SelectItem value="monkey_saddle">Monkey Saddle</SelectItem>
                <SelectItem value="klein_bottle_4d">Klein Bottle 4D</SelectItem>
                <SelectItem value="gravity_well">Gravity Well</SelectItem>
                <SelectItem value="standing_wave">Standing Wave</SelectItem>
                <SelectItem value="dipole_field">Dipole Field</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Equations */}
          <div className="space-y-2">
            <Label className="text-cyan-300 font-semibold">Parametric Equations</Label>
            <div>
              <Label className="text-yellow-300 text-sm font-medium">X(u,v) =</Label>
              <Textarea
                value={equation.x}
                onChange={(e) => handleEquationChange('x', e.target.value)}
                className="bg-gray-700 border-gray-600 font-mono text-sm text-white"
                rows={2}
              />
            </div>
            <div>
              <Label className="text-yellow-300 text-sm font-medium">Y(u,v) =</Label>
              <Textarea
                value={equation.y}
                onChange={(e) => handleEquationChange('y', e.target.value)}
                className="bg-gray-700 border-gray-600 font-mono text-sm text-white"
                rows={2}
              />
            </div>
            <div>
              <Label className="text-yellow-300 text-sm font-medium">Z(u,v) =</Label>
              <Textarea
                value={equation.z}
                onChange={(e) => handleEquationChange('z', e.target.value)}
                className="bg-gray-700 border-gray-600 font-mono text-sm text-white"
                rows={2}
              />
            </div>
          </div>

          {/* Parameter Ranges */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-green-300 text-sm font-medium">U Min</Label>
              <Input
                type="number"
                value={equation.uMin ?? -2}
                onChange={(e) => handleEquationChange('uMin', parseFloat(e.target.value))}
                className="bg-gray-700 border-gray-600 text-white"
                step="0.1"
              />
            </div>
            <div>
              <Label className="text-green-300 text-sm font-medium">U Max</Label>
              <Input
                type="number"
                value={equation.uMax ?? 2}
                onChange={(e) => handleEquationChange('uMax', parseFloat(e.target.value))}
                className="bg-gray-700 border-gray-600 text-white"
                step="0.1"
              />
            </div>
            <div>
              <Label className="text-green-300 text-sm font-medium">V Min</Label>
              <Input
                type="number"
                value={equation.vMin ?? -2}
                onChange={(e) => handleEquationChange('vMin', parseFloat(e.target.value))}
                className="bg-gray-700 border-gray-600 text-white"
                step="0.1"
              />
            </div>
            <div>
              <Label className="text-green-300 text-sm font-medium">V Max</Label>
              <Input
                type="number"
                value={equation.vMax ?? 2}
                onChange={(e) => handleEquationChange('vMax', parseFloat(e.target.value))}
                className="bg-gray-700 border-gray-600 text-white"
                step="0.1"
              />
            </div>
          </div>

          {/* Resolution Controls */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-sm">U Segments: {uSegments}</Label>
              <Input
                type="range"
                min="10"
                max="100"
                value={uSegments}
                onChange={(e) => setUSegments(parseInt(e.target.value))}
                className="bg-gray-700"
              />
            </div>
            <div>
              <Label className="text-sm">V Segments: {vSegments}</Label>
              <Input
                type="range"
                min="10"
                max="100"
                value={vSegments}
                onChange={(e) => setVSegments(parseInt(e.target.value))}
                className="bg-gray-700"
              />
            </div>
          </div>

          {/* Visualization Mode */}
          <div>
            <Label>Visualization Mode</Label>
            <Select value={visualMode} onValueChange={(value: any) => setVisualMode(value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="wireframe">Wireframe (Preferred)</SelectItem>
                <SelectItem value="enhanced_wireframe">Enhanced Wireframe</SelectItem>
                <SelectItem value="neon_wireframe">Neon Wireframe</SelectItem>
                <SelectItem value="surface">Surface</SelectItem>
                <SelectItem value="points">Points</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Color Mode */}
          <div>
            <Label>Color Mode</Label>
            <Select value={colorMode} onValueChange={setColorMode}>
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="height">Height Gradient</SelectItem>
                <SelectItem value="quantum">Quantum Phase</SelectItem>
                <SelectItem value="neon">Neon Green</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Math Function Reference */}
          <div className="text-xs text-gray-400 space-y-1">
            <div className="font-semibold">Available Functions:</div>
            <div>sin, cos, tan, sqrt, exp, log, abs, pow</div>
            <div>sinh, cosh, tanh, atan2, PI, E</div>
            <div>Variables: u, v (parameters)</div>
          </div>
        </div>
      </Card>

      {/* 3D Visualization */}
      <div className="flex-1">
        <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
          <Lights />
          <CustomParametricSurface />
          <OrbitControls enablePan enableZoom enableRotate />
          <gridHelper args={[10, 10]} />
          <axesHelper args={[2]} />
        </Canvas>
      </div>
    </div>
  );
}