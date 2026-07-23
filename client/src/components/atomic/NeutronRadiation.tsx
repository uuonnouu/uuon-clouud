import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Neutron from './Neutron';

export default function NeutronRadiation({ scale = 2 }: { scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      groupRef.current.rotation.y = t * 0.3;
      groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.3;
    }
  });
  
  return (
    <group>
      <group ref={groupRef}>
        <Neutron position={[0, 0, 0]} scale={scale} />
        
        <mesh>
          <sphereGeometry args={[scale * 2.5, 32, 32]} />
          <meshBasicMaterial
            color="#44ddcc"
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>
        
        <mesh>
          <sphereGeometry args={[scale * 1.8, 32, 32]} />
          <meshBasicMaterial
            color="#66ffee"
            transparent
            opacity={0.15}
          />
        </mesh>
      </group>
      
      <pointLight color="#44ddcc" intensity={12} distance={8} />
    </group>
  );
}
