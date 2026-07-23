import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface QuarkProps {
  position: [number, number, number];
  color: 'red' | 'green' | 'blue';
  type: 'up' | 'down';
  scale?: number;
}

export default function Quark({ position, color, type, scale = 0.15 }: QuarkProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const colorMap = {
    red: '#ff2244',
    green: '#22ff44',
    blue: '#4422ff'
  };
  
  const emissiveIntensity = type === 'up' ? 0.8 : 0.6;
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1;
      meshRef.current.scale.setScalar(scale * pulse);
    }
  });
  
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[scale, 16, 16]} />
      <meshPhysicalMaterial
        color={colorMap[color]}
        emissive={colorMap[color]}
        emissiveIntensity={emissiveIntensity}
        roughness={0.2}
        metalness={0.8}
        transparent
        opacity={0.95}
      />
      <pointLight
        color={colorMap[color]}
        intensity={2}
        distance={1}
      />
    </mesh>
  );
}
