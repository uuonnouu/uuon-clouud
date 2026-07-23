
import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { unifiedFormulaIntegration } from '../lib/unifiedFormulaIntegration';
import { SurfaceParameters } from '../types/math';

interface UniversalFormulaRendererProps {
  formulaKey: string;
  parameters: SurfaceParameters;
  visualizationMode: 'solid' | 'wireframe' | 'points';
  colorMode: string;
  animate?: boolean;
}

export default function UniversalFormulaRenderer({
  formulaKey,
  parameters,
  visualizationMode,
  colorMode,
  animate = false
}: UniversalFormulaRendererProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Generate geometry when formula or parameters change
  useEffect(() => {
    const generateGeometry = async () => {
      try {
        setError(null);
        
        const meshData = await unifiedFormulaIntegration.render3D(formulaKey, parameters);
        
        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.Float32BufferAttribute(meshData.vertices, 3));
        geom.setAttribute('normal', new THREE.Float32BufferAttribute(meshData.normals, 3));
        geom.setAttribute('uv', new THREE.Float32BufferAttribute(meshData.uvs, 2));
        geom.setIndex(meshData.indices);
        
        // Compute bounding sphere for proper camera framing
        geom.computeBoundingSphere();
        
        setGeometry(geom);
      } catch (err) {
        console.error('Failed to generate geometry:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        
        // Fallback to simple cube
        const fallbackGeom = new THREE.BoxGeometry(1, 1, 1);
        setGeometry(fallbackGeom);
      }
    };

    generateGeometry();
  }, [formulaKey, parameters]);

  // Animation loop
  useFrame((state) => {
    if (!meshRef.current || !animate) return;
    
    meshRef.current.rotation.y += 0.01;
    meshRef.current.rotation.x += 0.005;
  });

  // Create material based on visualization mode
  const material = React.useMemo(() => {
    const getColor = () => {
      switch (colorMode) {
        case 'neon_green': return '#00ff00';
        case 'neon_blue': return '#00ffff';
        case 'neon_pink': return '#ff00ff';
        case 'plasma': return '#8b00ff';
        case 'gold': return '#ffd700';
        case 'silver': return '#c0c0c0';
        default: return '#00ff88';
      }
    };

    const color = new THREE.Color(getColor());

    switch (visualizationMode) {
      case 'wireframe':
        return new THREE.MeshBasicMaterial({
          color,
          wireframe: true,
          transparent: true,
          opacity: 0.8
        });
      
      case 'points':
        return new THREE.PointsMaterial({
          color,
          size: 0.05,
          transparent: true,
          opacity: 0.8
        });
      
      default:
        return new THREE.MeshStandardMaterial({
          color,
          metalness: 0.3,
          roughness: 0.4,
          emissive: color.clone().multiplyScalar(0.05),
          side: THREE.DoubleSide
        });
    }
  }, [visualizationMode, colorMode]);

  if (error) {
    return (
      <group>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ff0000" wireframe />
        </mesh>
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial color="#ff0000" />
        </mesh>
      </group>
    );
  }

  if (!geometry) {
    return (
      <mesh>
        <sphereGeometry args={[0.5]} />
        <meshStandardMaterial color="#666" wireframe />
      </mesh>
    );
  }

  if (visualizationMode === 'points') {
    return <points ref={meshRef as any} geometry={geometry} material={material} />;
  }

  return <mesh ref={meshRef} geometry={geometry} material={material} castShadow receiveShadow />;
}
