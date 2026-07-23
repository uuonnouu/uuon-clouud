import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WormholeProps {
  position?: [number, number, number];
  scale?: number;
}

export default function Wormhole({ position = [0, 0, 0], scale = 1 }: WormholeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const tunnelRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);

  const tunnelGeometry = useMemo(() => {
    const geometry = new THREE.CylinderGeometry(2.5, 2.5, 10, 64, 40, true);
    const positions = geometry.attributes.position;

    for (let i = 0; i < positions.count; i++) {
      const y = positions.getY(i);
      const x = positions.getX(i);
      const z = positions.getZ(i);
      
      const radius = Math.sqrt(x * x + z * z);
      const distanceFromCenter = Math.abs(y);
      const pinch = 1 - Math.exp(-distanceFromCenter * 0.4) * 0.6;
      
      positions.setX(i, x * pinch);
      positions.setZ(i, z * pinch);
    }

    geometry.computeVertexNormals();
    return geometry;
  }, []);

  const portalParticles = useMemo(() => {
    const count = 600;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 2.5;
      const y = (Math.random() - 0.5) * 10;
      
      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = y;
      positions[i3 + 2] = Math.sin(angle) * radius;

      const hue = (Math.abs(y) / 5) * 0.6;
      colors[i3] = 0.4 + hue;
      colors[i3 + 1] = 0.6 + hue * 0.5;
      colors[i3 + 2] = 1.0;

      sizes[i] = Math.random() * 2 + 0.5;
      velocities[i] = 0.5 + Math.random() * 1.5;
    }

    return { positions, colors, sizes, velocities };
  }, []);

  const rings = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      y: -5 + i * 0.5,
      radius: 2.5 - Math.exp(-Math.abs(i - 10) * 0.4) * 1.2,
      rotation: i * 0.2,
    }));
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.z = time * 0.1;
    }

    if (tunnelRef.current) {
      const material = tunnelRef.current.material as THREE.MeshStandardMaterial;
      if (material.emissiveIntensity !== undefined) {
        material.emissiveIntensity = 0.5 + Math.sin(time * 2) * 0.3;
      }
    }

    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        ring.rotation.z = time * 0.5 + i * 0.3;
      });
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Tunnel structure */}
      <mesh ref={tunnelRef} geometry={tunnelGeometry} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          color="#2244aa"
          emissive="#4488ff"
          emissiveIntensity={0.6}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          wireframe
        />
      </mesh>

      {/* Solid inner tunnel */}
      <mesh geometry={tunnelGeometry} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          color="#001133"
          emissive="#2266aa"
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Rotating energy rings */}
      <group ref={ringsRef}>
        {rings.map((ring, i) => (
          <mesh key={i} position={[0, ring.y, 0]} rotation={[Math.PI / 2, 0, ring.rotation]}>
            <torusGeometry args={[ring.radius, 0.08, 12, 48]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? "#66ccff" : "#ff66cc"}
              transparent
              opacity={0.6}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>

      {/* Portal entrances */}
      <mesh position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 2.5, 64]} />
        <meshBasicMaterial
          color="#88ccff"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, -5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 2.5, 64]} />
        <meshBasicMaterial
          color="#ff88cc"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Swirling particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={portalParticles.positions.length / 3}
            array={portalParticles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={portalParticles.colors.length / 3}
            array={portalParticles.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={portalParticles.sizes.length}
            array={portalParticles.sizes}
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

      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 0]} intensity={3} color="#66ccff" distance={12} />
      <pointLight position={[0, -5, 0]} intensity={3} color="#ff66cc" distance={12} />
    </group>
  );
}
