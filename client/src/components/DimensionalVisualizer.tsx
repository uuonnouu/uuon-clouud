import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { createMultiDimensionalGrid, getExtendedLetterValue } from "../lib/letterPatterns";

interface DimensionalVisualizerProps {
  dimensions: string[];
  complexity: number;
}

function DimensionalPoints({ points }: { points: Array<{ position: number[]; value: number; pattern: string }> }) {
  const geometry = useMemo(() => {
    const positions = new Float32Array(points.length * 3);
    const colors = new Float32Array(points.length * 3);
    
    points.forEach((point, i) => {
      // Map multi-dimensional position to 3D space
      const x = point.position[0] || 0;
      const y = point.position[1] || 0;
      const z = point.position[2] || 0;
      
      positions[i * 3] = (x - 2) * 2;
      positions[i * 3 + 1] = (y - 2) * 2;
      positions[i * 3 + 2] = (z - 2) * 2;
      
      // Color based on value magnitude
      const intensity = Math.min(point.value / 1000, 1);
      colors[i * 3] = intensity; // R
      colors[i * 3 + 1] = 0.5; // G
      colors[i * 3 + 2] = 1 - intensity; // B
    });
    
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    return geom;
  }, [points]);

  return (
    <points geometry={geometry}>
      <pointsMaterial size={0.2} vertexColors transparent opacity={0.8} />
    </points>
  );
}

function DimensionalConnections({ points }: { points: Array<{ position: number[]; value: number; pattern: string }> }) {
  const lines = useMemo(() => {
    const lineGeometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const colors: number[] = [];
    
    // Connect points based on dimensional relationships
    for (let i = 0; i < points.length - 1; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const point1 = points[i];
        const point2 = points[j];
        
        // Only connect if values are harmonically related
        const ratio = point1.value / point2.value;
        if (ratio > 0.5 && ratio < 2.0) {
          const x1 = (point1.position[0] || 0 - 2) * 2;
          const y1 = (point1.position[1] || 0 - 2) * 2;
          const z1 = (point1.position[2] || 0 - 2) * 2;
          
          const x2 = (point2.position[0] || 0 - 2) * 2;
          const y2 = (point2.position[1] || 0 - 2) * 2;
          const z2 = (point2.position[2] || 0 - 2) * 2;
          
          positions.push(x1, y1, z1, x2, y2, z2);
          
          // Color based on harmonic ratio
          const harmonic = Math.abs(ratio - 1);
          colors.push(harmonic, 1 - harmonic, 0.5, harmonic, 1 - harmonic, 0.5);
        }
      }
    }
    
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    return lineGeometry;
  }, [points]);

  return (
    <lineSegments geometry={lines}>
      <lineBasicMaterial vertexColors transparent opacity={0.3} />
    </lineSegments>
  );
}

export default function DimensionalVisualizer({ dimensions, complexity }: DimensionalVisualizerProps) {
  const gridPoints = useMemo(() => {
    if (dimensions.length === 0) return [];
    return createMultiDimensionalGrid(dimensions, 5);
  }, [dimensions, complexity]);

  return (
    <div className="w-full h-64 bg-black rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [10, 10, 10], fov: 50 }}
        style={{ background: 'linear-gradient(to bottom, #0a0a0a, #1a1a1a)' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.7} />
        
        {gridPoints.length > 0 && (
          <>
            <DimensionalPoints points={gridPoints} />
            <DimensionalConnections points={gridPoints} />
          </>
        )}
        
        <OrbitControls enableZoom enablePan enableRotate />
        
        {/* Reference grid */}
        <gridHelper args={[10, 10]} />
      </Canvas>
      
      <div className="absolute bottom-2 left-2 text-white text-xs">
        {gridPoints.length} dimensional points | {dimensions.join('')} pattern
      </div>
    </div>
  );
}