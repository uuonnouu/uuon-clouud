import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GravitationalWavesProps {
  position?: [number, number, number];
  scale?: number;
}

export default function GravitationalWaves({ position = [0, 0, 0], scale = 1 }: GravitationalWavesProps) {
  const groupRef = useRef<THREE.Group>(null);
  const wavesRef = useRef<THREE.Group>(null);
  const gridRef = useRef<THREE.Mesh>(null);

  const waveRings = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      radius: 2 + i * 0.8,
      delay: i * 0.3,
      speed: 1 - i * 0.05,
    }));
  }, []);

  const spacetimeGrid = useMemo(() => {
    const size = 20;
    const divisions = 40;
    const geometry = new THREE.PlaneGeometry(size, size, divisions, divisions);
    const positions = geometry.attributes.position;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const distance = Math.sqrt(x * x + y * y);
      const wave = Math.sin(distance * 0.5) * 0.3;
      positions.setZ(i, wave);
    }

    geometry.computeVertexNormals();
    return geometry;
  }, []);

  const rippleParticles = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 10;
      
      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = Math.sin(angle) * radius;
      positions[i3 + 2] = (Math.random() - 0.5) * 2;

      const brightness = 0.6 + Math.random() * 0.4;
      colors[i3] = brightness * 0.5;
      colors[i3 + 1] = brightness * 0.9;
      colors[i3 + 2] = brightness;

      sizes[i] = Math.random() * 2 + 0.5;
    }

    return { positions, colors, sizes };
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (gridRef.current) {
      const positions = gridRef.current.geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const distance = Math.sqrt(x * x + y * y);
        const wave = Math.sin(distance * 0.5 - time * 2) * Math.exp(-distance * 0.08) * 0.5;
        positions.setZ(i, wave);
      }
      positions.needsUpdate = true;
      gridRef.current.geometry.computeVertexNormals();
    }

    if (wavesRef.current) {
      wavesRef.current.children.forEach((ring, i) => {
        const mesh = ring as THREE.Mesh;
        const scale = 1 + Math.sin(time * waveRings[i].speed - waveRings[i].delay) * 0.3;
        mesh.scale.set(scale, scale, 1);
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.opacity = 0.3 + Math.sin(time * waveRings[i].speed - waveRings[i].delay) * 0.2;
      });
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Spacetime grid showing curvature */}
      <mesh ref={gridRef} rotation={[-Math.PI / 3, 0, 0]} position={[0, -2, 0]} geometry={spacetimeGrid}>
        <meshStandardMaterial
          color="#4488ff"
          wireframe
          transparent
          opacity={0.4}
          emissive="#2266cc"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Binary system creating waves */}
      <group rotation={[0, 0, 0]}>
        <mesh position={[1.5, 0, 0]}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial
            color="#8844ff"
            emissive="#6622cc"
            emissiveIntensity={1.2}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
        <mesh position={[-1.5, 0, 0]}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial
            color="#ff4488"
            emissive="#cc2266"
            emissiveIntensity={1.2}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
        {/* Connection between masses */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 3, 16]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.2}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Propagating wave rings */}
      <group ref={wavesRef}>
        {waveRings.map((wave, i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[wave.radius, 0.04, 8, 64]} />
            <meshBasicMaterial
              color="#66ccff"
              transparent
              opacity={0.4}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>

      {/* Ripple particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={rippleParticles.positions.length / 3}
            array={rippleParticles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={rippleParticles.colors.length / 3}
            array={rippleParticles.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={rippleParticles.sizes.length}
            array={rippleParticles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          vertexColors
          transparent
          opacity={0.5}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      <ambientLight intensity={0.4} />
      <pointLight position={[0, 5, 0]} intensity={2} color="#66ccff" distance={15} />
    </group>
  );
}
