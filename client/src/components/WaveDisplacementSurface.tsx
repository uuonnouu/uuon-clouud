import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type WaveType = 'sine' | 'cosine' | 'noise' | 'ripple';

interface WaveDisplacementSurfaceProps {
  enabled?: boolean;
  width?: number;
  height?: number;
  segments?: number;
  amplitude?: number;
  frequency?: number;
  waveType?: WaveType;
  color?: string;
  wireframe?: boolean;
  animated?: boolean;
  doubleSided?: boolean;
}

function deterministicHash(n: number): number {
  const h = Math.sin(n * 127.1 + n * 311.7) * 43758.5453;
  return h - Math.floor(h);
}

function simpleNoise3D(x: number, y: number, z: number): number {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const Z = Math.floor(z) & 255;
  
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const zf = z - Math.floor(z);
  
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const w = zf * zf * (3 - 2 * zf);
  
  const a = deterministicHash(X + Y * 57 + Z * 113);
  const b = deterministicHash(X + 1 + Y * 57 + Z * 113);
  const c = deterministicHash(X + (Y + 1) * 57 + Z * 113);
  const d = deterministicHash(X + 1 + (Y + 1) * 57 + Z * 113);
  const e = deterministicHash(X + Y * 57 + (Z + 1) * 113);
  const f = deterministicHash(X + 1 + Y * 57 + (Z + 1) * 113);
  const g = deterministicHash(X + (Y + 1) * 57 + (Z + 1) * 113);
  const h = deterministicHash(X + 1 + (Y + 1) * 57 + (Z + 1) * 113);
  
  const k1 = a + u * (b - a) + v * (c - a) + u * v * (a - b - c + d);
  const k2 = e + u * (f - e) + v * (g - e) + u * v * (e - f - g + h);
  
  return (k1 + w * (k2 - k1)) * 2 - 1;
}

function calculateDisplacement(
  x: number, 
  y: number, 
  time: number, 
  waveType: WaveType, 
  frequency: number, 
  amplitude: number
): number {
  switch (waveType) {
    case 'sine':
      return Math.sin(x * frequency + time) * Math.sin(y * frequency + time) * amplitude;
    case 'cosine':
      return Math.cos(x * frequency + time) * Math.cos(y * frequency + time) * amplitude;
    case 'noise':
      return simpleNoise3D(x * frequency * 0.5, y * frequency * 0.5, time * 0.5) * amplitude;
    case 'ripple':
      const dist = Math.sqrt(x * x + y * y);
      return Math.sin(dist * frequency - time * 2) * amplitude * Math.exp(-dist * 0.1);
    default:
      return 0;
  }
}

export default function WaveDisplacementSurface({
  enabled = true,
  width = 10,
  height = 10,
  segments = 128,
  amplitude = 0.5,
  frequency = 2,
  waveType = 'sine',
  color = '#4488ff',
  wireframe = false,
  animated = true,
  doubleSided = true
}: WaveDisplacementSurfaceProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const originalPositions = useRef<Float32Array | null>(null);
  
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(width, height, segments, segments);
    originalPositions.current = new Float32Array(geo.attributes.position.array);
    return geo;
  }, [width, height, segments]);
  
  useFrame((state) => {
    if (!enabled || !meshRef.current || !originalPositions.current) return;
    
    const geo = meshRef.current.geometry;
    const positions = geo.attributes.position.array as Float32Array;
    const original = originalPositions.current;
    const time = animated ? state.clock.elapsedTime : 0;
    
    for (let i = 0; i < positions.length; i += 3) {
      const x = original[i];
      const y = original[i + 1];
      
      const displacement = calculateDisplacement(x, y, time, waveType, frequency, amplitude);
      
      positions[i] = original[i];
      positions[i + 1] = original[i + 1];
      positions[i + 2] = original[i + 2] + displacement;
    }
    
    geo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();
  });
  
  useEffect(() => {
    if (!meshRef.current || !originalPositions.current) return;
    
    const geo = meshRef.current.geometry;
    const positions = geo.attributes.position.array as Float32Array;
    const original = originalPositions.current;
    
    for (let i = 0; i < positions.length; i += 3) {
      const x = original[i];
      const y = original[i + 1];
      
      const displacement = calculateDisplacement(x, y, 0, waveType, frequency, amplitude);
      
      positions[i] = original[i];
      positions[i + 1] = original[i + 1];
      positions[i + 2] = original[i + 2] + displacement;
    }
    
    geo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();
  }, [waveType, frequency, amplitude, enabled]);
  
  if (!enabled) return null;
  
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial
        color={color}
        wireframe={wireframe}
        side={doubleSided ? THREE.DoubleSide : THREE.FrontSide}
        metalness={0.3}
        roughness={0.6}
      />
    </mesh>
  );
}

export function createDisplacedGeometryForExport(
  width: number = 10,
  height: number = 10,
  segments: number = 128,
  amplitude: number = 0.5,
  frequency: number = 2,
  waveType: WaveType = 'sine',
  time: number = 0
): THREE.BufferGeometry {
  const geometry = new THREE.PlaneGeometry(width, height, segments, segments);
  const positions = geometry.attributes.position.array as Float32Array;
  
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    
    const displacement = calculateDisplacement(x, y, time, waveType, frequency, amplitude);
    positions[i + 2] = displacement;
  }
  
  geometry.attributes.position.needsUpdate = true;
  geometry.computeVertexNormals();
  
  geometry.rotateX(-Math.PI / 2);
  
  return geometry;
}

export { WaveDisplacementSurface, calculateDisplacement };
