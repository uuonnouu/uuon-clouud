import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SurfaceParameters, VisualizationMode } from "../types/math";
import { generateParametricSurface } from "../lib/surfaceGenerator";

interface QuantumRendererProps {
  parameters: SurfaceParameters;
  visualMode: VisualizationMode;
  colorMode: string;
  staticMode?: boolean; // CPU optimization mode
}

export default function QuantumRenderer({ 
  parameters, 
  visualMode, 
  colorMode, 
  staticMode = false 
}: QuantumRendererProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(0);

  const energy = Math.abs(parameters.a) + Math.abs(parameters.b) + Math.abs(parameters.c);

  // Generate surface data with memoization for performance
  const { geometry, material } = useMemo(() => {
    const surfaceData = generateParametricSurface(parameters);
    const positions = new Float32Array(surfaceData.vertices);
    const normals = new Float32Array(surfaceData.normals);
    const indices = new Uint16Array(surfaceData.indices);

    // Create geometry
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    geom.setIndex(new THREE.BufferAttribute(indices, 1));

    // Calculate energy before using it
    const energy = Math.abs(parameters.a) + Math.abs(parameters.b) + Math.abs(parameters.c);

    // Enhanced quantum color generation
    const colors = generateQuantumColors(positions, parameters, colorMode, energy);
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    let mat: THREE.Material;

    // Use MeshBasicMaterial for all energy levels to prevent lighting-based color shifts
    // This keeps colors uniform and consistent regardless of geometry or lighting changes
    mat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: energy > 1000 ? 0.9 : energy > 100 ? 0.85 : 0.8,
      side: THREE.DoubleSide
    });

    return { geometry: geom, material: mat };
  }, [parameters, colorMode]);

  // Minimal animation - only if not in static mode
  // Removed heavy breathing effect, keeping shapes stable
  useFrame(() => {
    if (staticMode) return;
    // No automatic animations - user controls all movement
  });

  if (visualMode === "points") {
    return (
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial
          size={energy > 500 ? 0.15 : 0.1}
          vertexColors
          transparent
          opacity={0.8}
        />
      </points>
    );
  }

  if (visualMode === "wireframe") {
    return (
      <lineSegments ref={linesRef} geometry={geometry}>
        <lineBasicMaterial 
          vertexColors 
          transparent 
          opacity={0.7}
        />
      </lineSegments>
    );
  }

  return (
    <mesh 
      ref={meshRef} 
      geometry={geometry} 
      material={material}
      visible={true}
      scale={[1, 1, 1]}
      castShadow
      receiveShadow
    />
  );
}

function generateQuantumColors(positions: Float32Array, parameters: SurfaceParameters, colorMode: string, energy: number): Float32Array {
  const colors = new Float32Array(positions.length);

  // Use precise neon colors for wireframe optimization
  let baseColor: [number, number, number];

  switch (colorMode) {
    case "neon_green":
      baseColor = [0.0, 1.0, 0.0]; // TRUE neon green (#00FF00)
      break;
    case "neon_magenta":
      baseColor = [1.0, 0.0, 1.0]; // TRUE neon magenta (#FF00FF)  
      break;
    case "neon_orange":
      baseColor = [1.0, 0.5, 0.0]; // TRUE neon orange (#FF8000)
      break;
    case "electric_blue":
      baseColor = [0.0, 0.5, 1.0]; // TRUE electric blue (#0080FF)
      break;
    default:
      baseColor = [0.0, 1.0, 0.0]; // Default to neon green
  }

  for (let i = 0; i < positions.length; i += 3) {
    const vertex = [positions[i], positions[i + 1], positions[i + 2]];
    const height = vertex[2];
    const distance = Math.sqrt(vertex[0] ** 2 + vertex[1] ** 2);

    let color: [number, number, number];

    switch (colorMode) {
      case "quantum":
        color = getQuantumColor(distance, height, energy);
        break;
      case "electron":
        color = getElectronColor(vertex, energy);
        break;
      case "photon":
        color = getPhotonColor(vertex, energy);
        break;
      case "plasma":
        const t = (height + distance) * 0.5;
        if (energy > 1000) {
          color = getQuantumColor(t, height, energy);
        } else {
          color = hslToRgb(0.8 - t * 0.3, 1, 0.8 + Math.sin(energy * 0.01) * 0.3);
        }
        break;
      case "rainbow":
        const angle = Math.atan2(vertex[1], vertex[0]);
        const hue = (angle + Math.PI) / (2 * Math.PI);
        if (energy > 100) {
          color = getElectronColor(vertex, energy);
        } else {
          color = hslToRgb(hue, 1, 0.5 + Math.sin(distance * 0.1) * 0.2);
        }
        break;
      default:
        const normalizedHeight = (height + 5) / 10;
        const energyPulse = Math.sin(energy * 0.001) * 0.1 + 0.9;
        color = hslToRgb(0.6 + normalizedHeight * 0.4, 0.8 * energyPulse, 0.5 + normalizedHeight * 0.3);
    }

    colors[i] = color[0];
    colors[i + 1] = color[1];
    colors[i + 2] = color[2];
  }

  return colors;
}

function getQuantumColor(value: number, depth: number, energy: number): [number, number, number] {
  const phase = (value + energy) * Math.PI * 2;
  const intensity = Math.sin(phase) * 0.4 + 0.9; // Boosted base intensity

  const r = Math.sin(phase * 1.1 + depth) * 0.5 + 0.8; // Enhanced brightness
  const g = Math.sin(phase * 1.3 + depth * 1.2) * 0.6 + 0.7;
  const b = Math.sin(phase * 1.7 + depth * 0.8) * 0.7 + 0.9;

  return [r * intensity, g * intensity, b * intensity];
}

function getElectronColor(position: number[], energy: number): [number, number, number] {
  const distance = Math.sqrt(position[0]**2 + position[1]**2 + position[2]**2);
  const orbital = Math.sin(distance * energy * 0.1) * 0.5 + 0.5;

  if (energy > 10) {
    return [0.9 + orbital * 0.3, 0.95 + orbital * 0.2, 1.0];
  } else {
    return [1.0, 0.6 + orbital * 0.6, orbital * 0.5];
  }
}

function getPhotonColor(position: number[], energy: number): [number, number, number] {
  const wave = Math.sin(energy * 0.01 + position[0] * 0.1) * 0.5 + 0.5;
  const frequency = energy * 0.001;

  // Simulate electromagnetic spectrum with enhanced brightness
  if (frequency > 0.5) {
    // High frequency = blue/violet - enhanced
    return [0.8 + wave * 0.5, 0.6 + wave * 0.5, 1.0];
  } else {
    // Low frequency = red/orange - enhanced
    return [1.0, 0.7 + wave * 0.7, 0.4 + wave * 0.6];
  }
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h * 6) % 2 - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;
  if (h < 1/6) { r = c; g = x; b = 0; }
  else if (h < 2/6) { r = x; g = c; b = 0; }
  else if (h < 3/6) { r = 0; g = c; b = x; }
  else if (h < 4/6) { r = 0; g = x; b = c; }
  else if (h < 5/6) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }

  return [r + m, g + m, b + m];
}