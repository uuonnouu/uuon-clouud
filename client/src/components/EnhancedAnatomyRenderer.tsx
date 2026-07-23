
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { generateMesh, getShapeById, getAllSystems, getSystemShapes } from '../lib/anatomy-engine-v2';
import { SurfaceParameters } from '../types/math';

interface EnhancedAnatomyRendererProps {
  shapeId: string;
  parameters: SurfaceParameters;
  animate?: boolean;
}

function AnatomyMesh({ shapeId, parameters, animate }: EnhancedAnatomyRendererProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Enhanced parameters with time for animations
  const animatedParams = useMemo(() => ({
    ...parameters,
    time: animate ? performance.now() / 1000 : 0,
  }), [parameters, animate]);

  // Generate geometry when shape or parameters change
  useEffect(() => {
    const generateGeometry = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const shape = getShapeById(shapeId);
        if (!shape) {
          throw new Error(`Shape not found: ${shapeId}`);
        }

        console.log(`🔬 Generating ${shape.type} anatomy: ${shape.name}`);
        
        const meshData = await generateMesh(shapeId, animatedParams);
        if (!meshData) {
          throw new Error(`Failed to generate mesh for ${shapeId}`);
        }

        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.Float32BufferAttribute(meshData.vertices, 3));
        geom.setIndex(meshData.indices);
        geom.computeVertexNormals();
        geom.computeBoundingSphere();

        setGeometry(geom);
        console.log(`✅ Generated ${shape.type} mesh: ${meshData.vertices.length / 3} vertices`);
      } catch (err) {
        console.error('❌ Anatomy generation error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    generateGeometry();
  }, [shapeId, animatedParams]);

  // Animation loop for hybrid shapes with deformations
  useFrame((state) => {
    if (!meshRef.current || !animate) return;
    
    // Update time parameter for deformations
    const shape = getShapeById(shapeId);
    if (shape?.type === 'hybrid') {
      // Trigger re-generation for hybrid shapes (could be optimized)
      // In production, you'd want to update geometry in-place for better performance
    }
  });

  if (isLoading) {
    return (
      <mesh>
        <sphereGeometry args={[0.5, 16, 12]} />
        <meshBasicMaterial color="#444" wireframe />
      </mesh>
    );
  }

  if (error) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#ff4444" />
      </mesh>
    );
  }

  if (!geometry) return null;

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        color="#ffaa88"
        metalness={0.1}
        roughness={0.8}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function EnhancedAnatomyRenderer(props: EnhancedAnatomyRendererProps) {
  return (
    <div className="w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.3} color="#4488ff" />
        
        <AnatomyMesh {...props} />
        
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        
        <gridHelper args={[10, 10, '#333333', '#111111']} />
      </Canvas>
      
      {/* Shape info overlay */}
      <div className="absolute top-2 left-2 bg-black/70 text-white text-sm p-2 rounded">
        <div>Shape: {getShapeById(props.shapeId)?.name}</div>
        <div>Type: {getShapeById(props.shapeId)?.type}</div>
        <div>System: {getShapeById(props.shapeId)?.system}</div>
      </div>
    </div>
  );
}

// Export utilities for use in other components
export { getAllSystems, getSystemShapes, getShapeById };
