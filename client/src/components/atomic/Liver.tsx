import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LiverProps {
  position?: [number, number, number];
  scale?: number;
}

export default function Liver({ position = [0, 0, 0], scale = 1 }: LiverProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (groupRef.current) {
      const pulse = Math.sin(time * 2) * 0.02 + 1;
      groupRef.current.scale.set(scale * pulse, scale, scale);
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Right Lobe (larger) */}
      <mesh position={[0.4, 0, 0]}>
        <boxGeometry args={[1.6, 1.2, 0.8]} />
        <meshStandardMaterial
          color="#8B4513"
          roughness={0.7}
          metalness={0.2}
          emissive="#442211"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Left Lobe (smaller) */}
      <mesh position={[-0.6, 0.1, 0]}>
        <boxGeometry args={[0.9, 1, 0.7]} />
        <meshStandardMaterial
          color="#8B4513"
          roughness={0.7}
          metalness={0.2}
          emissive="#442211"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Caudate Lobe */}
      <mesh position={[0, -0.5, -0.3]}>
        <boxGeometry args={[0.5, 0.4, 0.3]} />
        <meshStandardMaterial
          color="#A0522D"
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Quadrate Lobe */}
      <mesh position={[-0.2, -0.4, 0.4]}>
        <boxGeometry args={[0.4, 0.35, 0.3]} />
        <meshStandardMaterial
          color="#A0522D"
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Portal Vein */}
      <mesh position={[0, -0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 1.5, 12]} />
        <meshStandardMaterial
          color="#8B0000"
          emissive="#440000"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Hepatic Artery */}
      <mesh position={[0.2, -0.25, 0.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 1.2, 10]} />
        <meshStandardMaterial
          color="#DC143C"
          emissive="#661111"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Bile Duct */}
      <mesh position={[-0.1, -0.6, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 10]} />
        <meshStandardMaterial
          color="#9ACD32"
          emissive="#556622"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Gallbladder */}
      <mesh position={[-0.3, -0.7, 0.3]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#228B22"
          roughness={0.4}
          metalness={0.3}
          emissive="#114411"
          emissiveIntensity={0.4}
        />
      </mesh>

      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 2]} intensity={1.5} color="#aa6633" distance={8} />
    </group>
  );
}
