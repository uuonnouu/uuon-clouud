import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TimeDilationProps {
  position?: [number, number, number];
  scale?: number;
}

export default function TimeDilation({ position = [0, 0, 0], scale = 1 }: TimeDilationProps) {
  const groupRef = useRef<THREE.Group>(null);
  const clockRingsRef = useRef<THREE.Group>(null);
  const gridRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const spacetimeGrid = useMemo(() => {
    const size = 16;
    const divisions = 32;
    const geometry = new THREE.PlaneGeometry(size, size, divisions, divisions);
    return geometry;
  }, []);

  const clockParticles = useMemo(() => {
    const count = 400;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const angle = (i / count) * Math.PI * 2;
      const ringIndex = Math.floor(i / 50);
      const radius = 2 + ringIndex * 0.8;
      
      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = (Math.random() - 0.5) * 0.3;
      positions[i3 + 2] = Math.sin(angle) * radius;

      const brightness = 0.7 + Math.random() * 0.3;
      colors[i3] = brightness * 0.4;
      colors[i3 + 1] = brightness * 0.8;
      colors[i3 + 2] = brightness;

      sizes[i] = Math.random() * 1.5 + 0.5;
    }

    return { positions, colors, sizes };
  }, []);

  const timeRipples = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      radius: 1.5 + i * 0.8,
      speed: 1 + i * 0.2,
      offset: i * Math.PI / 4,
    }));
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (gridRef.current) {
      const positions = gridRef.current.geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const distance = Math.sqrt(x * x + y * y);
        
        const curvature = Math.exp(-distance * 0.3) * Math.sin(time * 2 + distance * 0.5) * 1.5;
        positions.setZ(i, -curvature);
      }
      positions.needsUpdate = true;
      gridRef.current.geometry.computeVertexNormals();
    }

    if (clockRingsRef.current) {
      clockRingsRef.current.children.forEach((ring, i) => {
        const speed = 1 / (1 + i * 0.3);
        ring.rotation.z = time * speed;
        
        const mesh = ring as THREE.Mesh;
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.opacity = 0.4 + Math.sin(time * 2 + i) * 0.2;
      });
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Curved spacetime grid */}
      <mesh ref={gridRef} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -2, 0]} geometry={spacetimeGrid}>
        <meshStandardMaterial
          color="#4499ff"
          wireframe
          transparent
          opacity={0.5}
          emissive="#2277cc"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Central massive object causing dilation */}
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color="#2244aa"
          emissive="#4488ff"
          emissiveIntensity={1.0}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          color="#6699ff"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Clock rings showing time dilation */}
      <group ref={clockRingsRef}>
        {timeRipples.map((ripple, i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[ripple.radius, 0.06, 8, 64]} />
            <meshBasicMaterial
              color="#66ddff"
              transparent
              opacity={0.5}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>

      {/* Clock markings (hours) */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 3.5;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              0,
              Math.sin(angle) * radius
            ]}
          >
            <boxGeometry args={[0.15, 0.4, 0.15]} />
            <meshBasicMaterial
              color="#88ccff"
              transparent
              opacity={0.7}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}

      {/* Time particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={clockParticles.positions.length / 3}
            array={clockParticles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={clockParticles.colors.length / 3}
            array={clockParticles.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={clockParticles.sizes.length}
            array={clockParticles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Clock hands */}
      <mesh rotation={[0, 0, Math.PI / 4]} position={[0, 0.01, 0]}>
        <boxGeometry args={[0.1, 2, 0.1]} />
        <meshBasicMaterial
          color="#ffcc66"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh rotation={[0, 0, -Math.PI / 6]} position={[0, 0.02, 0]}>
        <boxGeometry args={[0.08, 1.5, 0.08]} />
        <meshBasicMaterial
          color="#ff8866"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={3} color="#4488ff" distance={10} />
    </group>
  );
}
