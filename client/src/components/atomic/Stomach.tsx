import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StomachProps {
  position?: [number, number, number];
  scale?: number;
}

export default function Stomach({ position = [0, 0, 0], scale = 1 }: StomachProps) {
  const groupRef = useRef<THREE.Group>(null);
  const acidRef = useRef<THREE.Points>(null);

  const stomachCurve = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.8, 0),
      new THREE.Vector3(-0.3, 0.5, 0),
      new THREE.Vector3(-0.5, 0, 0),
      new THREE.Vector3(-0.4, -0.5, 0),
      new THREE.Vector3(0, -0.8, 0),
      new THREE.Vector3(0.3, -0.6, 0),
      new THREE.Vector3(0.4, -0.2, 0),
      new THREE.Vector3(0.3, 0.3, 0),
      new THREE.Vector3(0, 0.8, 0),
    ]);
    
    return new THREE.TubeGeometry(curve, 64, 0.4, 16, true);
  }, []);

  const acidParticles = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 0.6;
      positions[i3 + 1] = (Math.random() - 0.5) * 1.2;
      positions[i3 + 2] = (Math.random() - 0.5) * 0.6;

      const brightness = 0.8 + Math.random() * 0.2;
      colors[i3] = brightness * 0.9;
      colors[i3 + 1] = brightness * 0.9;
      colors[i3 + 2] = brightness * 0.3;

      sizes[i] = Math.random() * 0.08 + 0.03;
    }

    return { positions, colors, sizes };
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (groupRef.current) {
      const digest = Math.sin(time * 1.2) * 0.05 + 1;
      groupRef.current.scale.set(scale, scale * digest, scale);
    }

    if (acidRef.current) {
      acidRef.current.rotation.y = time * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Main stomach body */}
      <mesh geometry={stomachCurve}>
        <meshStandardMaterial
          color="#E6B8B8"
          roughness={0.8}
          metalness={0.1}
          emissive="#664444"
          emissiveIntensity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Fundus (top part) */}
      <mesh position={[-0.2, 0.7, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color="#D8A8A8"
          roughness={0.8}
          metalness={0.1}
          emissive="#664444"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Pylorus (exit to small intestine) */}
      <mesh position={[0.4, -0.4, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.15, 0.1, 0.3, 16]} />
        <meshStandardMaterial
          color="#C89898"
          roughness={0.7}
          metalness={0.2}
          emissive="#554444"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Esophageal opening */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.2, 16]} />
        <meshStandardMaterial
          color="#C89898"
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Gastric acid particles */}
      <points ref={acidRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={acidParticles.positions.length / 3}
            array={acidParticles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={acidParticles.colors.length / 3}
            array={acidParticles.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={acidParticles.sizes.length}
            array={acidParticles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Rugae (stomach folds) */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 0.35,
              Math.sin(i * 0.5) * 0.4,
              Math.sin(angle) * 0.35
            ]}
            rotation={[0, angle, 0]}
          >
            <boxGeometry args={[0.05, 0.8, 0.1]} />
            <meshStandardMaterial
              color="#B88888"
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>
        );
      })}

      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 2]} intensity={1.5} color="#ffcc88" distance={8} />
    </group>
  );
}
