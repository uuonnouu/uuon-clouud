import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Photon({ scale = 3 }: { scale?: number }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const raysRef = useRef<THREE.Group>(null);
  const waveRef = useRef<THREE.Group>(null);
  
  const rayPositions = useMemo(() => {
    const positions = [];
    const count = 24;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      positions.push({ angle, length: Math.random() * 0.5 + 0.5 });
    }
    return positions;
  }, []);
  
  const particleCloud = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    const color = new THREE.Color('#ffee44');
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.pow(Math.random(), 0.5) * scale * 0.8;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
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
      const pulse = Math.sin(t * 4) * 0.2 + 1;
      coreRef.current.scale.setScalar(pulse);
    }
    
    if (raysRef.current) {
      raysRef.current.rotation.z += 0.015;
    }
    
    if (waveRef.current) {
      waveRef.current.rotation.y = t * 0.5;
    }
  });
  
  return (
    <group>
      <mesh ref={coreRef}>
        <sphereGeometry args={[scale * 0.4, 32, 32]} />
        <meshPhysicalMaterial
          color="#ffff66"
          emissive="#ffee44"
          emissiveIntensity={3.0}
          roughness={0.0}
          metalness={1.0}
        />
      </mesh>
      
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCloud.positions.length / 3}
            array={particleCloud.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCloud.colors.length / 3}
            array={particleCloud.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={particleCloud.sizes.length}
            array={particleCloud.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      <group ref={raysRef}>
        {rayPositions.map((ray, i) => (
          <mesh
            key={i}
            position={[
              Math.cos(ray.angle) * scale * 0.5,
              Math.sin(ray.angle) * scale * 0.5,
              0
            ]}
            rotation={[0, 0, ray.angle]}
          >
            <coneGeometry args={[0.08 * scale, scale * 2.5 * ray.length, 6]} />
            <meshPhysicalMaterial
              color="#ffff88"
              emissive="#ffee44"
              emissiveIntensity={2.0}
              transparent
              opacity={0.6}
            />
          </mesh>
        ))}
      </group>
      
      <group ref={waveRef}>
        {[0, Math.PI / 2].map((offset, idx) => (
          <mesh key={idx} rotation={[0, offset, 0]}>
            <torusGeometry args={[scale * 1.5, 0.08, 8, 32]} />
            <meshPhysicalMaterial
              color="#ffff44"
              emissive="#ffee44"
              emissiveIntensity={1.5}
              transparent
              opacity={0.5}
            />
          </mesh>
        ))}
      </group>
      
      <pointLight color="#ffff44" intensity={40} distance={15} />
    </group>
  );
}
