import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HeartProps {
  position?: [number, number, number];
  scale?: number;
}

export default function Heart({ position = [0, 0, 0], scale = 1 }: HeartProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bloodFlowRef = useRef<THREE.Points>(null);

  const heartShape = useMemo(() => {
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    shape.moveTo(x, y);
    shape.bezierCurveTo(x, y - 0.3, x - 0.5, y - 0.5, x - 0.5, y - 0.8);
    shape.bezierCurveTo(x - 0.5, y - 1.2, x, y - 1.5, x, y - 2);
    shape.bezierCurveTo(x, y - 1.5, x + 0.5, y - 1.2, x + 0.5, y - 0.8);
    shape.bezierCurveTo(x + 0.5, y - 0.5, x, y - 0.3, x, y);
    
    const extrudeSettings = {
      depth: 0.8,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelSegments: 5
    };
    
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  const bloodParticles = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 1.5;
      const height = (Math.random() - 0.5) * 2;
      
      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = height;
      positions[i3 + 2] = Math.sin(angle) * radius;

      const isOxygenated = i < count / 2;
      if (isOxygenated) {
        colors[i3] = 0.9;
        colors[i3 + 1] = 0.1;
        colors[i3 + 2] = 0.1;
      } else {
        colors[i3] = 0.4;
        colors[i3 + 1] = 0.1;
        colors[i3 + 2] = 0.3;
      }

      sizes[i] = Math.random() * 0.15 + 0.05;
      
      velocities[i3] = (Math.random() - 0.5) * 0.5;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.5;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.5;
    }

    return { positions, colors, sizes, velocities };
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    if (groupRef.current) {
      const beat = Math.sin(time * 3) * 0.05 + 1;
      groupRef.current.scale.set(scale * beat, scale * beat, scale * beat);
    }

    if (bloodFlowRef.current) {
      const positions = bloodFlowRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length / 3; i++) {
        const i3 = i * 3;
        
        positions[i3] += bloodParticles.velocities[i3] * delta;
        positions[i3 + 1] += bloodParticles.velocities[i3 + 1] * delta;
        positions[i3 + 2] += bloodParticles.velocities[i3 + 2] * delta;

        const distance = Math.sqrt(
          positions[i3] ** 2 +
          positions[i3 + 1] ** 2 +
          positions[i3 + 2] ** 2
        );

        if (distance > 2) {
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * 1.5;
          positions[i3] = Math.cos(angle) * radius;
          positions[i3 + 1] = (Math.random() - 0.5) * 2;
          positions[i3 + 2] = Math.sin(angle) * radius;
        }
      }
      
      bloodFlowRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={[Math.PI, 0, 0]}>
      {/* Main heart body */}
      <mesh geometry={heartShape}>
        <meshStandardMaterial
          color="#8B0000"
          roughness={0.4}
          metalness={0.2}
          emissive="#440000"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Left ventricle */}
      <mesh position={[-0.3, -1, 0.4]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color="#A52A2A"
          roughness={0.3}
          metalness={0.3}
          emissive="#550000"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Right ventricle */}
      <mesh position={[0.3, -1, 0.4]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color="#8B4789"
          roughness={0.3}
          metalness={0.3}
          emissive="#442244"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Aorta */}
      <mesh position={[0, 0.2, 0.4]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.15, 0.2, 1, 16]} />
        <meshStandardMaterial
          color="#DC143C"
          roughness={0.3}
          metalness={0.3}
          emissive="#660011"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Pulmonary artery */}
      <mesh position={[0.2, 0.2, 0.4]} rotation={[0, 0, -Math.PI / 6]}>
        <cylinderGeometry args={[0.12, 0.15, 0.8, 16]} />
        <meshStandardMaterial
          color="#663399"
          roughness={0.3}
          metalness={0.3}
          emissive="#331166"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Blood flow particles */}
      <points ref={bloodFlowRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={bloodParticles.positions.length / 3}
            array={bloodParticles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={bloodParticles.colors.length / 3}
            array={bloodParticles.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={bloodParticles.sizes.length}
            array={bloodParticles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Coronary arteries */}
      {[0, 0.5, 1, 1.5, 2, 2.5].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(angle) * 0.6,
            -0.5 - i * 0.2,
            0.4 + Math.sin(angle) * 0.3
          ]}
          rotation={[0, angle, Math.PI / 4]}
        >
          <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
          <meshStandardMaterial
            color="#FF6347"
            emissive="#882222"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 2]} intensity={2} color="#ff4444" distance={8} />
    </group>
  );
}
