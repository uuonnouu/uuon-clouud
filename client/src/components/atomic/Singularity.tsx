import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SingularityProps {
  position?: [number, number, number];
  scale?: number;
}

export default function Singularity({ position = [0, 0, 0], scale = 1 }: SingularityProps) {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const waveRef = useRef<THREE.Group>(null);

  const spiralParticles = useMemo(() => {
    const count = 1000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const t = i / count;
      const radius = t * 8;
      const angle = t * Math.PI * 12;
      const height = (t - 0.5) * 6;
      
      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = height;
      positions[i3 + 2] = Math.sin(angle) * radius;

      const brightness = 1 - t * 0.7;
      colors[i3] = brightness;
      colors[i3 + 1] = brightness * 0.7;
      colors[i3 + 2] = brightness * 0.9;

      sizes[i] = (1 - t) * 2.5 + 0.2;
    }

    return { positions, colors, sizes };
  }, []);

  const energyWaves = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      radius: 0.2 + i * 0.4,
      height: (i - 7) * 0.4,
      speed: 1 + i * 0.05,
    }));
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.5;
    }

    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length / 3; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const z = positions[i3 + 2];
        const distance = Math.sqrt(x * x + z * z);
        const angle = Math.atan2(z, x);
        
        const newAngle = angle - 0.01 / (1 + distance * 0.5);
        const newRadius = distance * 0.995;
        
        if (newRadius > 0.1) {
          positions[i3] = Math.cos(newAngle) * newRadius;
          positions[i3 + 2] = Math.sin(newAngle) * newRadius;
        } else {
          const t = Math.random();
          const radius = t * 8;
          const resetAngle = t * Math.PI * 12;
          positions[i3] = Math.cos(resetAngle) * radius;
          positions[i3 + 2] = Math.sin(resetAngle) * radius;
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    if (waveRef.current) {
      waveRef.current.children.forEach((wave, i) => {
        const scale = 1 + Math.sin(time * energyWaves[i].speed + i) * 0.3;
        wave.scale.set(scale, 1, scale);
        
        const mesh = wave as THREE.Mesh;
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.opacity = 0.5 + Math.sin(time * energyWaves[i].speed + i) * 0.3;
      });
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Infinitesimal point */}
      <mesh>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={3.0}
          roughness={0}
          metalness={1}
        />
      </mesh>

      {/* Intense energy shell */}
      {[0.3, 0.5, 0.7].map((radius, i) => (
        <mesh key={i}>
          <sphereGeometry args={[radius, 32, 32]} />
          <meshBasicMaterial
            color={i === 0 ? "#ff00ff" : i === 1 ? "#ff66ff" : "#ff99ff"}
            transparent
            opacity={0.6 - i * 0.15}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Energy waves */}
      <group ref={waveRef}>
        {energyWaves.map((wave, i) => (
          <mesh key={i} position={[0, wave.height, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[wave.radius, 0.03, 8, 48]} />
            <meshBasicMaterial
              color="#ff44ff"
              transparent
              opacity={0.6}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>

      {/* Spiraling matter/energy */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={spiralParticles.positions.length / 3}
            array={spiralParticles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={spiralParticles.colors.length / 3}
            array={spiralParticles.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={spiralParticles.sizes.length}
            array={spiralParticles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.2}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Spacetime distortion rays */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[0, 0, 0]}
            rotation={[Math.PI / 2, 0, angle]}
          >
            <coneGeometry args={[0.05, 6, 8]} />
            <meshBasicMaterial
              color="#ff88ff"
              transparent
              opacity={0.25}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}

      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={4} color="#ff00ff" distance={12} />
    </group>
  );
}
