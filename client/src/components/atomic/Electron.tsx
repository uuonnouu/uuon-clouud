import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ElectronProps {
  position: [number, number, number];
  scale?: number;
  showTrail?: boolean;
}

export default function Electron({ position, scale = 1, showTrail = false }: ElectronProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  const radius = 0.15 * scale;
  
  useFrame((state) => {
    if (meshRef.current && glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 5) * 0.15 + 1;
      meshRef.current.scale.setScalar(pulse);
      glowRef.current.scale.setScalar(pulse * 1.5);
    }
  });
  
  return (
    <group position={position}>
      <mesh ref={glowRef}>
        <sphereGeometry args={[radius * 2, 16, 16]} />
        <meshBasicMaterial
          color="#ffdd44"
          transparent
          opacity={0.2}
        />
      </mesh>
      
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 16, 16]} />
        <meshPhysicalMaterial
          color="#ffff66"
          emissive="#ffdd44"
          emissiveIntensity={1.5}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      
      <pointLight
        color="#ffff66"
        intensity={5}
        distance={2}
      />
      
      {showTrail && (
        <mesh>
          <sphereGeometry args={[radius * 0.5, 8, 8]} />
          <meshBasicMaterial
            color="#ffdd44"
            transparent
            opacity={0.4}
          />
        </mesh>
      )}
    </group>
  );
}
