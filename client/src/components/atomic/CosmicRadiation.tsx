import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CosmicRadiation({ scale = 3 }: { scale?: number }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const raysGroupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleData = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * scale * 3;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * 0.05;
      velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * 0.05;
      velocities[i * 3 + 2] = Math.cos(phi) * 0.05;
      
      const hue = Math.random() * 0.3 + 0.7;
      const color = new THREE.Color().setHSL(hue, 1.0, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      sizes[i] = Math.random() * 0.2 + 0.05;
    }
    
    return { positions, colors, sizes, velocities };
  }, [scale]);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (coreRef.current) {
      const pulse = Math.sin(t * 3) * 0.4 + 1.2;
      coreRef.current.scale.setScalar(pulse);
    }
    
    if (raysGroupRef.current) {
      raysGroupRef.current.rotation.z += 0.01;
    }
    
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3] += particleData.velocities[i * 3];
        positions[i * 3 + 1] += particleData.velocities[i * 3 + 1];
        positions[i * 3 + 2] += particleData.velocities[i * 3 + 2];
        
        const distance = Math.sqrt(
          positions[i * 3] ** 2 +
          positions[i * 3 + 1] ** 2 +
          positions[i * 3 + 2] ** 2
        );
        
        if (distance > scale * 3) {
          positions[i * 3] *= 0.1;
          positions[i * 3 + 1] *= 0.1;
          positions[i * 3 + 2] *= 0.1;
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <group>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.4 * scale, 32, 32]} />
        <meshPhysicalMaterial
          color="#ff88ff"
          emissive="#ff44ff"
          emissiveIntensity={4.0}
          roughness={0.0}
          metalness={1.0}
        />
      </mesh>
      
      <group ref={raysGroupRef}>
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i / 24) * Math.PI * 2;
          const elevation = ((i % 3) - 1) * 0.5;
          
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * scale * 1.2,
                Math.sin(angle) * scale * 1.2,
                elevation * scale
              ]}
              rotation={[elevation, 0, angle]}
            >
              <coneGeometry args={[0.2 * scale, scale * 2.5, 8]} />
              <meshPhysicalMaterial
                color="#ffaaff"
                emissive="#ff66ff"
                emissiveIntensity={2.5}
                transparent
                opacity={0.6}
              />
            </mesh>
          );
        })}
      </group>
      
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleData.positions.length / 3}
            array={particleData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleData.colors.length / 3}
            array={particleData.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={particleData.sizes.length}
            array={particleData.sizes}
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
      
      <pointLight color="#ff66ff" intensity={40} distance={15} />
    </group>
  );
}
