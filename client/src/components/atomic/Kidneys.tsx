import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface KidneysProps {
  position?: [number, number, number];
  scale?: number;
}

export default function Kidneys({ position = [0, 0, 0], scale = 1 }: KidneysProps) {
  const groupRef = useRef<THREE.Group>(null);
  const urineRef = useRef<THREE.Points>(null);

  const kidneyShape = useMemo(() => {
    return new THREE.CapsuleGeometry(0.4, 1, 16, 32);
  }, []);

  const urineParticles = useMemo(() => {
    const count = 300;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const isLeft = i < count / 2;
      const xOffset = isLeft ? -0.8 : 0.8;
      
      positions[i3] = xOffset + (Math.random() - 0.5) * 0.6;
      positions[i3 + 1] = (Math.random() - 0.5) * 1.5;
      positions[i3 + 2] = (Math.random() - 0.5) * 0.6;

      const brightness = 0.9 + Math.random() * 0.1;
      colors[i3] = brightness;
      colors[i3 + 1] = brightness * 0.95;
      colors[i3 + 2] = brightness * 0.5;

      sizes[i] = Math.random() * 0.08 + 0.03;
    }

    return { positions, colors, sizes };
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (urineRef.current) {
      const positions = urineRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length / 3; i++) {
        const i3 = i * 3;
        positions[i3 + 1] -= 0.01;
        
        if (positions[i3 + 1] < -1) {
          const isLeft = i < positions.length / 6;
          positions[i3] = (isLeft ? -0.8 : 0.8) + (Math.random() - 0.5) * 0.6;
          positions[i3 + 1] = 0.8;
          positions[i3 + 2] = (Math.random() - 0.5) * 0.6;
        }
      }
      
      urineRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Left Kidney */}
      <group position={[-0.8, 0, 0]}>
        <mesh geometry={kidneyShape}>
          <meshStandardMaterial
            color="#8B4726"
            roughness={0.7}
            metalness={0.2}
            emissive="#442211"
            emissiveIntensity={0.3}
          />
        </mesh>
        
        {/* Renal Cortex */}
        <mesh>
          <capsuleGeometry args={[0.35, 0.9, 16, 32]} />
          <meshStandardMaterial
            color="#A0603D"
            roughness={0.6}
            metalness={0.2}
            emissive="#553322"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Renal Pelvis */}
        <mesh position={[0.25, 0, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial
            color="#CD853F"
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>
      </group>

      {/* Right Kidney */}
      <group position={[0.8, -0.2, 0]}>
        <mesh geometry={kidneyShape}>
          <meshStandardMaterial
            color="#8B4726"
            roughness={0.7}
            metalness={0.2}
            emissive="#442211"
            emissiveIntensity={0.3}
          />
        </mesh>
        
        {/* Renal Cortex */}
        <mesh>
          <capsuleGeometry args={[0.35, 0.9, 16, 32]} />
          <meshStandardMaterial
            color="#A0603D"
            roughness={0.6}
            metalness={0.2}
            emissive="#553322"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Renal Pelvis */}
        <mesh position={[-0.25, 0, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial
            color="#CD853F"
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>
      </group>

      {/* Left Ureter */}
      <mesh position={[-0.5, -0.7, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <cylinderGeometry args={[0.05, 0.05, 1.5, 12]} />
        <meshStandardMaterial
          color="#DEB887"
          roughness={0.6}
          metalness={0.2}
          emissive="#664433"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Right Ureter */}
      <mesh position={[0.5, -0.9, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.05, 0.05, 1.5, 12]} />
        <meshStandardMaterial
          color="#DEB887"
          roughness={0.6}
          metalness={0.2}
          emissive="#664433"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Renal Arteries */}
      <mesh position={[-0.5, 0, -0.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.8, 12]} />
        <meshStandardMaterial
          color="#DC143C"
          emissive="#661111"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[0.5, -0.2, -0.1]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.8, 12]} />
        <meshStandardMaterial
          color="#DC143C"
          emissive="#661111"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Filtration particles */}
      <points ref={urineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={urineParticles.positions.length / 3}
            array={urineParticles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={urineParticles.colors.length / 3}
            array={urineParticles.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={urineParticles.sizes.length}
            array={urineParticles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 2]} intensity={1.5} color="#cc8844" distance={8} />
    </group>
  );
}
