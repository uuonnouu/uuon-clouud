import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WhiteHoleProps {
  position?: [number, number, number];
  scale?: number;
}

export default function WhiteHole({ position = [0, 0, 0], scale = 1 }: WhiteHoleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ejectionRef = useRef<THREE.Points>(null);
  const ringsRef = useRef<THREE.Group>(null);

  const ejectaParticles = useMemo(() => {
    const count = 800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = Math.random() * 0.5;
      
      positions[i3] = Math.sin(phi) * Math.cos(theta) * radius;
      positions[i3 + 1] = Math.sin(phi) * Math.sin(theta) * radius;
      positions[i3 + 2] = Math.cos(phi) * radius;

      const direction = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]).normalize();
      const speed = 2 + Math.random() * 3;
      velocities[i3] = direction.x * speed;
      velocities[i3 + 1] = direction.y * speed;
      velocities[i3 + 2] = direction.z * speed;

      const brightness = 0.8 + Math.random() * 0.2;
      colors[i3] = brightness;
      colors[i3 + 1] = brightness * 0.95;
      colors[i3 + 2] = brightness * 0.9;

      sizes[i] = Math.random() * 2.5 + 0.5;
    }

    return { positions, colors, sizes, velocities };
  }, []);

  const expansionRings = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      radius: 0.5 + i * 0.6,
      delay: i * 0.15,
      speed: 2 + i * 0.1,
    }));
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    if (ejectionRef.current) {
      const positions = ejectionRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length / 3; i++) {
        const i3 = i * 3;
        
        positions[i3] += ejectaParticles.velocities[i3] * delta;
        positions[i3 + 1] += ejectaParticles.velocities[i3 + 1] * delta;
        positions[i3 + 2] += ejectaParticles.velocities[i3 + 2] * delta;

        const distance = Math.sqrt(
          positions[i3] ** 2 +
          positions[i3 + 1] ** 2 +
          positions[i3 + 2] ** 2
        );

        if (distance > 10) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          const radius = Math.random() * 0.5;
          
          positions[i3] = Math.sin(phi) * Math.cos(theta) * radius;
          positions[i3 + 1] = Math.sin(phi) * Math.sin(theta) * radius;
          positions[i3 + 2] = Math.cos(phi) * radius;
        }
      }
      
      ejectionRef.current.geometry.attributes.position.needsUpdate = true;
    }

    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        const scale = 1 + Math.sin(time * expansionRings[i].speed - expansionRings[i].delay) * 0.5;
        ring.scale.set(scale, scale, 1);
        
        const mesh = ring as THREE.Mesh;
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.opacity = Math.max(0, 0.8 - Math.sin(time * expansionRings[i].speed - expansionRings[i].delay) * 0.5);
      });
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Central bright core */}
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={2.0}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Intense glow layers */}
      {[1.2, 1.6, 2.0].map((radius, i) => (
        <mesh key={i}>
          <sphereGeometry args={[radius, 32, 32]} />
          <meshBasicMaterial
            color={i === 0 ? "#ffffaa" : i === 1 ? "#ffff88" : "#ffff66"}
            transparent
            opacity={0.4 - i * 0.1}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Expansion rings */}
      <group ref={ringsRef}>
        {expansionRings.map((ring, i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[ring.radius, 0.08, 8, 48]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.7}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>

      {/* Ejected particles */}
      <points ref={ejectionRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={ejectaParticles.positions.length / 3}
            array={ejectaParticles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={ejectaParticles.colors.length / 3}
            array={ejectaParticles.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={ejectaParticles.sizes.length}
            array={ejectaParticles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.25}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Radial light beams */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 1.5,
              0,
              Math.sin(angle) * 1.5
            ]}
            rotation={[0, angle, 0]}
          >
            <coneGeometry args={[0.3, 8, 8]} />
            <meshBasicMaterial
              color="#ffffcc"
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}

      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={5} color="#ffffff" distance={15} />
    </group>
  );
}
