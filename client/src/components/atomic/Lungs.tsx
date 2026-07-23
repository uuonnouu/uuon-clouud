import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LungsProps {
  position?: [number, number, number];
  scale?: number;
}

export default function Lungs({ position = [0, 0, 0], scale = 1 }: LungsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const oxygenRef = useRef<THREE.Points>(null);

  const airParticles = useMemo(() => {
    const count = 400;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const isLeft = i < count / 2;
      const xOffset = isLeft ? -0.8 : 0.8;
      
      positions[i3] = xOffset + (Math.random() - 0.5) * 0.8;
      positions[i3 + 1] = (Math.random() - 0.5) * 2;
      positions[i3 + 2] = (Math.random() - 0.5) * 0.8;

      const brightness = 0.7 + Math.random() * 0.3;
      colors[i3] = brightness * 0.5;
      colors[i3 + 1] = brightness * 0.9;
      colors[i3 + 2] = brightness;

      sizes[i] = Math.random() * 0.12 + 0.04;
    }

    return { positions, colors, sizes };
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (groupRef.current) {
      const breathe = Math.sin(time * 1.5) * 0.08 + 1;
      groupRef.current.scale.set(scale * breathe, scale, scale);
    }

    if (oxygenRef.current) {
      const positions = oxygenRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length / 3; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(time * 2 + i) * 0.01;
      }
      
      oxygenRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Left Lung */}
      <group position={[-0.8, 0, 0]}>
        {/* Upper lobe */}
        <mesh position={[0, 0.6, 0]}>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshStandardMaterial
            color="#FFC1CC"
            roughness={0.7}
            metalness={0.1}
            emissive="#664444"
            emissiveIntensity={0.2}
          />
        </mesh>
        {/* Lower lobe */}
        <mesh position={[0, -0.5, 0]}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial
            color="#FFB6C1"
            roughness={0.7}
            metalness={0.1}
            emissive="#664444"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* Right Lung */}
      <group position={[0.8, 0, 0]}>
        {/* Upper lobe */}
        <mesh position={[0, 0.7, 0]}>
          <sphereGeometry args={[0.65, 32, 32]} />
          <meshStandardMaterial
            color="#FFC1CC"
            roughness={0.7}
            metalness={0.1}
            emissive="#664444"
            emissiveIntensity={0.2}
          />
        </mesh>
        {/* Middle lobe */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial
            color="#FFB0BB"
            roughness={0.7}
            metalness={0.1}
            emissive="#664444"
            emissiveIntensity={0.2}
          />
        </mesh>
        {/* Lower lobe */}
        <mesh position={[0, -0.6, 0]}>
          <sphereGeometry args={[0.75, 32, 32]} />
          <meshStandardMaterial
            color="#FFB6C1"
            roughness={0.7}
            metalness={0.1}
            emissive="#664444"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* Trachea */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1, 16]} />
        <meshStandardMaterial
          color="#E6C8C8"
          roughness={0.6}
          metalness={0.2}
          emissive="#665555"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Left Bronchus */}
      <mesh position={[-0.5, 0.9, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.1, 0.12, 0.8, 12]} />
        <meshStandardMaterial
          color="#D8B8B8"
          roughness={0.6}
          metalness={0.2}
          emissive="#554444"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Right Bronchus */}
      <mesh position={[0.5, 0.9, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.1, 0.12, 0.8, 12]} />
        <meshStandardMaterial
          color="#D8B8B8"
          roughness={0.6}
          metalness={0.2}
          emissive="#554444"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Bronchioles */}
      {[-0.8, 0.8].map((xPos, lungIndex) =>
        Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 0.4;
          return (
            <mesh
              key={`${lungIndex}-${i}`}
              position={[
                xPos + Math.cos(angle) * radius,
                Math.sin(angle) * 0.5,
                Math.sin(angle) * 0.3
              ]}
              rotation={[angle, 0, Math.PI / 6]}
            >
              <cylinderGeometry args={[0.02, 0.04, 0.4, 8]} />
              <meshStandardMaterial
                color="#C8A8A8"
                emissive="#443333"
                emissiveIntensity={0.4}
              />
            </mesh>
          );
        })
      )}

      {/* Oxygen particles */}
      <points ref={oxygenRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={airParticles.positions.length / 3}
            array={airParticles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={airParticles.colors.length / 3}
            array={airParticles.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={airParticles.sizes.length}
            array={airParticles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 2]} intensity={1.5} color="#88ccff" distance={8} />
    </group>
  );
}
