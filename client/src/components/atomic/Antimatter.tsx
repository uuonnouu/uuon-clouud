import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AntimatterProps {
  position?: [number, number, number];
  scale?: number;
}

export default function Antimatter({ position = [0, 0, 0], scale = 1 }: AntimatterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const particleRef = useRef<THREE.Group>(null);
  const antiparticleRef = useRef<THREE.Group>(null);
  const annihilationRef = useRef<THREE.Group>(null);

  const annihilationParticles = useMemo(() => {
    const count = 300;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = 0;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = 0;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = 1 + Math.random() * 2;
      
      velocities[i3] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      velocities[i3 + 2] = Math.cos(phi) * speed;

      const brightness = 0.8 + Math.random() * 0.2;
      colors[i3] = brightness;
      colors[i3 + 1] = brightness * 0.8;
      colors[i3 + 2] = brightness * 0.3;

      sizes[i] = Math.random() * 2 + 0.5;
    }

    return { positions, colors, sizes, velocities };
  }, []);

  const orbitRadius = 2;

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    if (particleRef.current && antiparticleRef.current) {
      const angle = time * 2;
      
      particleRef.current.position.x = Math.cos(angle) * orbitRadius;
      particleRef.current.position.z = Math.sin(angle) * orbitRadius;
      
      antiparticleRef.current.position.x = Math.cos(angle + Math.PI) * orbitRadius;
      antiparticleRef.current.position.z = Math.sin(angle + Math.PI) * orbitRadius;
    }

    if (annihilationRef.current) {
      const points = annihilationRef.current.children[0] as THREE.Points;
      if (points && points.geometry) {
        const positions = points.geometry.attributes.position.array as Float32Array;
        
        for (let i = 0; i < positions.length / 3; i++) {
          const i3 = i * 3;
          
          positions[i3] += annihilationParticles.velocities[i3] * delta;
          positions[i3 + 1] += annihilationParticles.velocities[i3 + 1] * delta;
          positions[i3 + 2] += annihilationParticles.velocities[i3 + 2] * delta;

          const distance = Math.sqrt(
            positions[i3] ** 2 +
            positions[i3 + 1] ** 2 +
            positions[i3 + 2] ** 2
          );

          if (distance > 8) {
            positions[i3] = 0;
            positions[i3 + 1] = 0;
            positions[i3 + 2] = 0;
          }
        }
        
        points.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Matter particle (electron) with glow */}
      <group ref={particleRef}>
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial
            color="#4488ff"
            emissive="#4488ff"
            emissiveIntensity={1.2}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshBasicMaterial
            color="#6699ff"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Antimatter particle (positron) with glow */}
      <group ref={antiparticleRef}>
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial
            color="#ff4488"
            emissive="#ff4488"
            emissiveIntensity={1.2}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshBasicMaterial
            color="#ff6699"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Orbital path */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[orbitRadius, 0.02, 8, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Central annihilation zone */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial
          color="#ffff88"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Gamma ray burst particles */}
      <group ref={annihilationRef}>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={annihilationParticles.positions.length / 3}
              array={annihilationParticles.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={annihilationParticles.colors.length / 3}
              array={annihilationParticles.colors}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-size"
              count={annihilationParticles.sizes.length}
              array={annihilationParticles.sizes}
              itemSize={1}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.2}
            vertexColors
            transparent
            opacity={0.9}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>

      {/* Energy rings showing annihilation waves */}
      {[0.8, 1.2, 1.6].map((radius, i) => (
        <mesh key={i}>
          <sphereGeometry args={[radius, 32, 32]} />
          <meshBasicMaterial
            color="#ffaa66"
            transparent
            opacity={0.15 - i * 0.04}
            blending={THREE.AdditiveBlending}
            wireframe
          />
        </mesh>
      ))}

      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#ffaa66" distance={10} />
    </group>
  );
}
