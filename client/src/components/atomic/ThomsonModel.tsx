import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ThomsonModel({ scale = 3 }: { scale?: number }) {
  const sphereRef = useRef<THREE.Mesh>(null);
  
  const particlePositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    const count = 12;
    const radius = scale * 0.6;
    
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      positions.push([x, y, z]);
    }
    
    return positions;
  }, [scale]);
  
  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.003;
    }
  });
  
  return (
    <group>
      <mesh ref={sphereRef}>
        <sphereGeometry args={[scale, 64, 64]} />
        <meshPhysicalMaterial
          color="#ff9999"
          emissive="#ff6666"
          emissiveIntensity={0.3}
          roughness={0.4}
          metalness={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {particlePositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.15 * scale, 16, 16]} />
          <meshPhysicalMaterial
            color="#4444ff"
            emissive="#6666ff"
            emissiveIntensity={1.0}
            roughness={0.2}
            metalness={0.8}
          />
          <pointLight color="#6666ff" intensity={2} distance={2} />
        </mesh>
      ))}
      
      <ambientLight intensity={0.5} />
    </group>
  );
}
