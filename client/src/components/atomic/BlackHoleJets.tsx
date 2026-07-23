import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function BlackHoleJets({ scale = 3 }: { scale?: number }) {
  const diskRef = useRef<THREE.Group>(null);
  const jetsRef = useRef<THREE.Group>(null);
  const eventHorizonRef = useRef<THREE.Mesh>(null);
  
  const jetParticles = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    const color1 = new THREE.Color('#4488ff');
    const color2 = new THREE.Color('#88ccff');
    
    for (let i = 0; i < count; i++) {
      const isTopJet = i < count / 2;
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * scale * 0.5;
      const height = (Math.random() * scale * 5 + scale * 2) * (isTopJet ? 1 : -1);
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      const color = Math.random() > 0.5 ? color1 : color2;
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      sizes[i] = Math.random() * 0.15 + 0.08;
    }
    
    return { positions, colors, sizes };
  }, [scale]);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (diskRef.current) {
      diskRef.current.rotation.y += 0.01;
    }
    
    if (jetsRef.current) {
      jetsRef.current.rotation.y += 0.005;
    }
    
    if (eventHorizonRef.current) {
      const pulse = Math.sin(t * 2) * 0.05 + 1;
      eventHorizonRef.current.scale.setScalar(pulse);
    }
  });
  
  return (
    <group>
      <mesh ref={eventHorizonRef}>
        <sphereGeometry args={[scale * 1.2, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      <mesh>
        <sphereGeometry args={[scale * 1.22, 64, 64]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>
      
      <group ref={diskRef} rotation={[Math.PI / 6, 0, 0]}>
        {[1.8, 2.3, 2.8, 3.3].map((radius, i) => (
          <mesh key={i}>
            <torusGeometry args={[scale * radius, 0.12, 16, 64]} />
            <meshPhysicalMaterial
              color={i < 2 ? '#ffaa44' : '#ff6622'}
              emissive={i < 2 ? '#ff8844' : '#ff4422'}
              emissiveIntensity={2.5 - i * 0.4}
              transparent
              opacity={0.7 - i * 0.1}
            />
          </mesh>
        ))}
      </group>
      
      <group ref={jetsRef}>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={jetParticles.positions.length / 3}
              array={jetParticles.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={jetParticles.colors.length / 3}
              array={jetParticles.colors}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-size"
              count={jetParticles.sizes.length}
              array={jetParticles.sizes}
              itemSize={1}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.18}
            vertexColors
            transparent
            opacity={0.7}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
        
        {[-1, 1].map((dir, idx) => (
          <mesh
            key={idx}
            position={[0, dir * scale * 3.5, 0]}
            rotation={[0, 0, 0]}
          >
            <coneGeometry args={[scale * 0.4, scale * 6, 8]} />
            <meshPhysicalMaterial
              color="#6699ff"
              emissive="#4488ff"
              emissiveIntensity={2.0}
              transparent
              opacity={0.4}
            />
          </mesh>
        ))}
      </group>
      
      <pointLight color="#ff8844" intensity={20} distance={20} />
      <pointLight position={[0, scale * 5, 0]} color="#6699ff" intensity={15} distance={15} />
      <pointLight position={[0, -scale * 5, 0]} color="#6699ff" intensity={15} distance={15} />
    </group>
  );
}
