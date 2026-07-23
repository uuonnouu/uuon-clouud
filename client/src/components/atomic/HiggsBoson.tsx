import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HiggsBosonProps {
  position?: [number, number, number];
  scale?: number;
}

export default function HiggsBoson({ position = [0, 0, 0], scale = 1 }: HiggsBosonProps) {
  const groupRef = useRef<THREE.Group>(null);
  const fieldRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const fieldParticles = useMemo(() => {
    const count = 1000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const masses = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 2 + Math.random() * 6;
      
      positions[i3] = Math.sin(phi) * Math.cos(theta) * radius;
      positions[i3 + 1] = Math.sin(phi) * Math.sin(theta) * radius;
      positions[i3 + 2] = Math.cos(phi) * radius;

      const mass = Math.random();
      masses[i] = mass;

      const brightness = 0.6 + mass * 0.4;
      colors[i3] = brightness * 0.4;
      colors[i3 + 1] = brightness * 0.7;
      colors[i3 + 2] = brightness;

      sizes[i] = 0.3 + mass * 1.5;
    }

    return { positions, colors, sizes, masses };
  }, []);

  const higgsField = useMemo(() => {
    const layers = [];
    for (let i = 0; i < 8; i++) {
      const radius = 1 + i * 0.6;
      layers.push({
        radius,
        speed: 0.5 + i * 0.1,
        phase: i * Math.PI / 4,
      });
    }
    return layers;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.1;
    }

    if (fieldRef.current) {
      fieldRef.current.children.forEach((sphere, i) => {
        const scale = 1 + Math.sin(time * higgsField[i].speed + higgsField[i].phase) * 0.2;
        sphere.scale.set(scale, scale, scale);
        
        const mesh = sphere as THREE.Mesh;
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.opacity = 0.15 + Math.sin(time * higgsField[i].speed + higgsField[i].phase) * 0.05;
      });
    }

    if (particlesRef.current) {
      const sizes = particlesRef.current.geometry.attributes.size.array as Float32Array;
      
      for (let i = 0; i < sizes.length; i++) {
        const mass = fieldParticles.masses[i];
        const interaction = Math.sin(time * 2 + i * 0.1) * 0.3;
        sizes[i] = (0.3 + mass * 1.5) * (1 + interaction);
      }
      
      particlesRef.current.geometry.attributes.size.needsUpdate = true;
      particlesRef.current.rotation.y = time * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Central Higgs boson */}
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial
          color="#6633ff"
          emissive="#6633ff"
          emissiveIntensity={1.5}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Energy shell */}
      {[0.9, 1.2, 1.5].map((radius, i) => (
        <mesh key={i}>
          <sphereGeometry args={[radius, 32, 32]} />
          <meshBasicMaterial
            color="#8844ff"
            transparent
            opacity={0.3 - i * 0.08}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Higgs field layers */}
      <group ref={fieldRef}>
        {higgsField.map((layer, i) => (
          <mesh key={i}>
            <sphereGeometry args={[layer.radius, 32, 32]} />
            <meshBasicMaterial
              color="#4488ff"
              transparent
              opacity={0.15}
              blending={THREE.AdditiveBlending}
              wireframe
            />
          </mesh>
        ))}
      </group>

      {/* Field particles gaining mass */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={fieldParticles.positions.length / 3}
            array={fieldParticles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={fieldParticles.colors.length / 3}
            array={fieldParticles.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={fieldParticles.sizes.length}
            array={fieldParticles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.5}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Field excitation waves */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[0, 0, 0]}
            rotation={[Math.PI / 3, 0, angle]}
          >
            <torusGeometry args={[3, 0.05, 8, 32]} />
            <meshBasicMaterial
              color="#6699ff"
              transparent
              opacity={0.4}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}

      {/* Decay products */}
      {[
        { pos: [2, 1, 1], color: '#ff4488' },
        { pos: [-2, -1, 1], color: '#ff4488' },
        { pos: [1, 2, -1], color: '#44ff88' },
        { pos: [-1, -2, -1], color: '#44ff88' },
      ].map((particle, i) => (
        <mesh key={i} position={particle.pos as [number, number, number]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshBasicMaterial
            color={particle.color}
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={3} color="#6633ff" distance={12} />
    </group>
  );
}
