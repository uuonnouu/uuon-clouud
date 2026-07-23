import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function BlackHoleEdge({ scale = 3 }: { scale?: number }) {
  const diskRef = useRef<THREE.Group>(null);
  const eventHorizonRef = useRef<THREE.Mesh>(null);
  
  const diskParticles = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = scale * (1.5 + Math.random() * 2.5);
      const height = (Math.random() - 0.5) * scale * 0.3;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      const distFactor = (radius - scale * 1.5) / (scale * 2.5);
      const color = new THREE.Color();
      color.setHSL(0.08 - distFactor * 0.05, 1.0, 0.6 - distFactor * 0.2);
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      sizes[i] = Math.random() * 0.12 + 0.05;
    }
    
    return { positions, colors, sizes };
  }, [scale]);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (diskRef.current) {
      diskRef.current.rotation.y += 0.015;
    }
    
    if (eventHorizonRef.current) {
      const pulse = Math.sin(t * 2) * 0.05 + 1;
      eventHorizonRef.current.scale.setScalar(pulse);
    }
  });
  
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh ref={eventHorizonRef}>
        <sphereGeometry args={[scale * 1.2, 64, 64]} />
        <meshBasicMaterial
          color="#000000"
          side={THREE.FrontSide}
        />
      </mesh>
      
      <mesh>
        <sphereGeometry args={[scale * 1.22, 64, 64]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.4}
          side={THREE.BackSide}
        />
      </mesh>
      
      <group ref={diskRef}>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={diskParticles.positions.length / 3}
              array={diskParticles.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={diskParticles.colors.length / 3}
              array={diskParticles.colors}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-size"
              count={diskParticles.sizes.length}
              array={diskParticles.sizes}
              itemSize={1}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.15}
            vertexColors
            transparent
            opacity={0.8}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      </group>
      
      <pointLight color="#ff8844" intensity={25} distance={20} />
    </group>
  );
}
