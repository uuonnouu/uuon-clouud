import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SpacetimeGrainProps {
  position?: [number, number, number];
  scale?: number;
}

export default function SpacetimeGrain({ position = [0, 0, 0], scale = 1 }: SpacetimeGrainProps) {
  const groupRef = useRef<THREE.Group>(null);
  const foamRef = useRef<THREE.Points>(null);

  const planckGrain = useMemo(() => {
    const count = 1500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);

    const spacing = 0.5;
    const gridSize = 12;
    let index = 0;

    for (let x = -gridSize; x <= gridSize && index < count; x++) {
      for (let y = -gridSize; y <= gridSize && index < count; y++) {
        for (let z = -gridSize; z <= gridSize && index < count; z++) {
          const i3 = index * 3;
          
          const jitter = 0.1;
          positions[i3] = x * spacing + (Math.random() - 0.5) * jitter;
          positions[i3 + 1] = y * spacing + (Math.random() - 0.5) * jitter;
          positions[i3 + 2] = z * spacing + (Math.random() - 0.5) * jitter;

          const distance = Math.sqrt(
            positions[i3] ** 2 +
            positions[i3 + 1] ** 2 +
            positions[i3 + 2] ** 2
          );
          const brightness = 0.4 + Math.random() * 0.6;
          const hue = (distance / (gridSize * spacing)) * 0.3;
          
          colors[i3] = brightness * (1 - hue);
          colors[i3 + 1] = brightness * (0.8 + hue);
          colors[i3 + 2] = brightness;

          sizes[index] = 0.15 + Math.random() * 0.15;
          phases[index] = Math.random() * Math.PI * 2;
          
          index++;
        }
      }
    }

    return { positions, colors, sizes, phases, count: index };
  }, []);

  const connections = useMemo(() => {
    const lines = [];
    const connectionCount = 200;
    
    for (let i = 0; i < connectionCount; i++) {
      const idx1 = Math.floor(Math.random() * planckGrain.count) * 3;
      const idx2 = Math.floor(Math.random() * planckGrain.count) * 3;
      
      const p1 = new THREE.Vector3(
        planckGrain.positions[idx1],
        planckGrain.positions[idx1 + 1],
        planckGrain.positions[idx1 + 2]
      );
      const p2 = new THREE.Vector3(
        planckGrain.positions[idx2],
        planckGrain.positions[idx2 + 1],
        planckGrain.positions[idx2 + 2]
      );
      
      if (p1.distanceTo(p2) < 1.5) {
        lines.push({ p1, p2 });
      }
    }
    
    return lines;
  }, [planckGrain]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.x = time * 0.05;
      groupRef.current.rotation.y = time * 0.08;
    }

    if (foamRef.current) {
      const sizes = foamRef.current.geometry.attributes.size.array as Float32Array;
      
      for (let i = 0; i < sizes.length; i++) {
        const phase = planckGrain.phases[i];
        const flicker = 0.15 + Math.sin(time * 8 + phase) * 0.1;
        sizes[i] = flicker;
      }
      
      foamRef.current.geometry.attributes.size.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Planck-scale foam particles */}
      <points ref={foamRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={planckGrain.count}
            array={planckGrain.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={planckGrain.count}
            array={planckGrain.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={planckGrain.count}
            array={planckGrain.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Quantum connections */}
      {connections.map((line, i) => {
        const points = [line.p1, line.p2];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        return (
          <primitive
            key={i}
            object={new THREE.Line(geometry, new THREE.LineBasicMaterial({
              color: '#4488ff',
              transparent: true,
              opacity: 0.15,
              blending: THREE.AdditiveBlending,
            }))}
          />
        );
      })}

      {/* Central reference cube */}
      <mesh>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#66aaff"
          emissiveIntensity={1.0}
          wireframe
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Bounding grid */}
      <mesh>
        <boxGeometry args={[12, 12, 12]} />
        <meshBasicMaterial
          color="#2266aa"
          wireframe
          transparent
          opacity={0.1}
        />
      </mesh>

      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#66aaff" distance={15} />
    </group>
  );
}
