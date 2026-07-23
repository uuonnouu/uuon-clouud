import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function GammaRadiation({ scale = 3 }: { scale?: number }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const raysRef = useRef<THREE.Group>(null);
  const burstRef = useRef<THREE.Points>(null);
  
  const burstParticles = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    const color1 = new THREE.Color('#ff44ff');
    const color2 = new THREE.Color('#ff88ff');
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.pow(Math.random(), 0.3) * scale * 2;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      const color = Math.random() > 0.5 ? color1 : color2;
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      sizes[i] = Math.random() * 0.15 + 0.05;
    }
    
    return { positions, colors, sizes };
  }, [scale]);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (coreRef.current) {
      const pulse = Math.sin(t * 4) * 0.3 + 1;
      coreRef.current.scale.setScalar(pulse);
    }
    
    if (raysRef.current) {
      raysRef.current.rotation.z += 0.02;
    }
    
    if (burstRef.current) {
      const expansion = Math.sin(t * 2) * 0.5 + 1;
      burstRef.current.scale.setScalar(expansion);
    }
  });
  
  return (
    <group>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.3 * scale, 32, 32]} />
        <meshPhysicalMaterial
          color="#ff66ff"
          emissive="#ff44ff"
          emissiveIntensity={3.0}
          roughness={0.0}
          metalness={1.0}
        />
      </mesh>
      
      <group ref={raysRef}>
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * scale * 0.8,
                Math.sin(angle) * scale * 0.8,
                0
              ]}
              rotation={[0, 0, angle]}
            >
              <coneGeometry args={[0.15 * scale, scale * 1.5, 8]} />
              <meshPhysicalMaterial
                color="#ff88ff"
                emissive="#ff44ff"
                emissiveIntensity={2.0}
                transparent
                opacity={0.7}
              />
            </mesh>
          );
        })}
      </group>
      
      <points ref={burstRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={burstParticles.positions.length / 3}
            array={burstParticles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={burstParticles.colors.length / 3}
            array={burstParticles.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={burstParticles.sizes.length}
            array={burstParticles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      <pointLight color="#ff44ff" intensity={30} distance={12} />
    </group>
  );
}
