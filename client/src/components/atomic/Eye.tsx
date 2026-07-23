import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EyeProps {
  position?: [number, number, number];
  scale?: number;
}

export default function Eye({ position = [0, 0, 0], scale = 1 }: EyeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const irisRef = useRef<THREE.Mesh>(null);
  const lightRaysRef = useRef<THREE.Points>(null);

  const lightRays = useMemo(() => {
    const count = 150;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const t = i / count;
      
      positions[i3] = 0;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = t * 2 - 1;

      const brightness = 1 - t;
      colors[i3] = brightness;
      colors[i3 + 1] = brightness;
      colors[i3 + 2] = brightness * 0.8;

      sizes[i] = (1 - t) * 0.1;
    }

    return { positions, colors, sizes };
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (irisRef.current) {
      const pupilDilation = 0.15 + Math.sin(time * 0.5) * 0.05;
      irisRef.current.scale.set(pupilDilation, pupilDilation, 1);
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Sclera (white of eye) */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#FFFFFF"
          roughness={0.3}
          metalness={0.1}
          emissive="#CCCCCC"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Cornea (clear front covering) */}
      <mesh position={[0, 0, 0.8]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#E8F4F8"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.2}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Iris */}
      <mesh position={[0, 0, 0.92]} ref={irisRef}>
        <circleGeometry args={[0.4, 32]} />
        <meshStandardMaterial
          color="#4169E1"
          roughness={0.4}
          metalness={0.3}
          emissive="#1144AA"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Iris texture pattern */}
      {Array.from({ length: 16 }, (_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 0.25,
              Math.sin(angle) * 0.25,
              0.93
            ]}
            rotation={[0, 0, angle]}
          >
            <boxGeometry args={[0.02, 0.2, 0.01]} />
            <meshBasicMaterial
              color="#2255CC"
              transparent
              opacity={0.6}
            />
          </mesh>
        );
      })}

      {/* Pupil */}
      <mesh position={[0, 0, 0.94]}>
        <circleGeometry args={[0.15, 32]} />
        <meshBasicMaterial
          color="#000000"
        />
      </mesh>

      {/* Lens */}
      <mesh position={[0, 0, 0.3]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color="#F0F8FF"
          transparent
          opacity={0.4}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Retina (back of eye) */}
      <mesh position={[0, 0, -0.7]} rotation={[0, Math.PI, 0]}>
        <sphereGeometry args={[0.9, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#8B0000"
          roughness={0.8}
          metalness={0.1}
          emissive="#440000"
          emissiveIntensity={0.3}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Optic Nerve */}
      <mesh position={[0, -0.2, -1.2]} rotation={[Math.PI / 6, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.6, 16]} />
        <meshStandardMaterial
          color="#FFFFE0"
          roughness={0.6}
          metalness={0.2}
          emissive="#AAAA66"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Blood vessels on retina */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 0.3,
              Math.sin(angle) * 0.3,
              -0.65
            ]}
            rotation={[Math.PI / 4, angle, 0]}
          >
            <cylinderGeometry args={[0.01, 0.01, 0.5, 8]} />
            <meshStandardMaterial
              color="#DC143C"
              emissive="#661111"
              emissiveIntensity={0.5}
            />
          </mesh>
        );
      })}

      {/* Light rays entering pupil */}
      <points ref={lightRaysRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={lightRays.positions.length / 3}
            array={lightRays.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={lightRays.colors.length / 3}
            array={lightRays.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={lightRays.sizes.length}
            array={lightRays.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 2]} intensity={2} color="#ffffff" distance={8} />
    </group>
  );
}
