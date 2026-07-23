import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BrainProps {
  position?: [number, number, number];
  scale?: number;
}

export default function Brain({ position = [0, 0, 0], scale = 1 }: BrainProps) {
  const groupRef = useRef<THREE.Group>(null);
  const neuralRef = useRef<THREE.Points>(null);

  const neuralSignals = useMemo(() => {
    const count = 800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 0.5 + Math.random() * 1.5;
      
      positions[i3] = Math.sin(phi) * Math.cos(theta) * radius;
      positions[i3 + 1] = Math.cos(phi) * radius + 0.3;
      positions[i3 + 2] = Math.sin(phi) * Math.sin(theta) * radius;

      const brightness = 0.7 + Math.random() * 0.3;
      colors[i3] = brightness * 0.3;
      colors[i3 + 1] = brightness * 0.8;
      colors[i3 + 2] = brightness;

      sizes[i] = Math.random() * 0.15 + 0.05;
    }

    return { positions, colors, sizes };
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (neuralRef.current) {
      const sizes = neuralRef.current.geometry.attributes.size.array as Float32Array;
      
      for (let i = 0; i < sizes.length; i++) {
        const pulse = Math.sin(time * 4 + i * 0.1) * 0.05 + 0.1;
        sizes[i] = pulse;
      }
      
      neuralRef.current.geometry.attributes.size.needsUpdate = true;
      neuralRef.current.rotation.y = time * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Left Hemisphere */}
      <mesh position={[-0.6, 0.5, 0]}>
        <sphereGeometry args={[1, 32, 32, 0, Math.PI]} />
        <meshStandardMaterial
          color="#FFC0CB"
          roughness={0.8}
          metalness={0.1}
          emissive="#884466"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Right Hemisphere */}
      <mesh position={[0.6, 0.5, 0]} rotation={[0, Math.PI, 0]}>
        <sphereGeometry args={[1, 32, 32, 0, Math.PI]} />
        <meshStandardMaterial
          color="#FFB6C1"
          roughness={0.8}
          metalness={0.1}
          emissive="#884466"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Corpus Callosum */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.3, 0.2, 0.8]} />
        <meshStandardMaterial
          color="#FFFFFF"
          roughness={0.6}
          metalness={0.2}
          emissive="#666688"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Cerebellum */}
      <mesh position={[0, -0.3, -0.7]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial
          color="#E6B8B8"
          roughness={0.7}
          metalness={0.1}
          emissive="#664444"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Brain Stem */}
      <mesh position={[0, -0.9, -0.3]}>
        <cylinderGeometry args={[0.25, 0.3, 0.8, 16]} />
        <meshStandardMaterial
          color="#D8BFD8"
          roughness={0.6}
          metalness={0.2}
          emissive="#665566"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Frontal Lobe indicators */}
      <mesh position={[0, 0.8, 0.7]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color="#FF69B4"
          transparent
          opacity={0.6}
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      {/* Brain wrinkles/sulci */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const height = -0.3 + Math.random() * 1.5;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 0.95,
              height,
              Math.sin(angle) * 0.95
            ]}
            rotation={[Math.random() * Math.PI, angle, 0]}
          >
            <torusGeometry args={[0.15, 0.03, 8, 16]} />
            <meshStandardMaterial
              color="#CC8899"
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>
        );
      })}

      {/* Neural activity particles */}
      <points ref={neuralRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={neuralSignals.positions.length / 3}
            array={neuralSignals.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={neuralSignals.colors.length / 3}
            array={neuralSignals.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={neuralSignals.sizes.length}
            array={neuralSignals.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      <ambientLight intensity={0.4} />
      <pointLight position={[2, 2, 2]} intensity={1.5} color="#ff88cc" distance={8} />
      <pointLight position={[-2, 2, 2]} intensity={1.5} color="#8888ff" distance={8} />
    </group>
  );
}
