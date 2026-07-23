import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Proton from './Proton';
import Neutron from './Neutron';

export default function AlphaRadiation({ scale = 2 }: { scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  const particleSpacing = 0.6 * scale;
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.02;
      groupRef.current.rotation.x += 0.01;
      
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      groupRef.current.position.z = pulse;
    }
    
    if (glowRef.current) {
      const glowPulse = Math.sin(state.clock.elapsedTime * 3) * 0.2 + 1;
      glowRef.current.scale.setScalar(glowPulse);
    }
  });
  
  return (
    <group>
      <mesh ref={glowRef}>
        <sphereGeometry args={[scale * 2, 32, 32]} />
        <meshBasicMaterial
          color="#ff4444"
          transparent
          opacity={0.15}
        />
      </mesh>
      
      <group ref={groupRef}>
        <Proton position={[particleSpacing / 2, particleSpacing / 2, 0]} scale={scale * 0.8} />
        <Proton position={[-particleSpacing / 2, -particleSpacing / 2, 0]} scale={scale * 0.8} />
        <Neutron position={[particleSpacing / 2, -particleSpacing / 2, 0]} scale={scale * 0.8} />
        <Neutron position={[-particleSpacing / 2, particleSpacing / 2, 0]} scale={scale * 0.8} />
      </group>
      
      <pointLight color="#ff4444" intensity={15} distance={8} />
    </group>
  );
}
