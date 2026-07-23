import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GravitationalLensingProps {
  position?: [number, number, number];
  scale?: number;
}

export default function GravitationalLensing({ position = [0, 0, 0], scale = 1 }: GravitationalLensingProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const raysRef = useRef<THREE.Group>(null);
  const lensedStarsRef = useRef<THREE.Points>(null);

  const starfield = useMemo(() => {
    const count = 800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 8 + Math.random() * 12;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      const brightness = 0.6 + Math.random() * 0.4;
      colors[i3] = brightness;
      colors[i3 + 1] = brightness * 0.95;
      colors[i3 + 2] = brightness * 0.9;

      sizes[i] = Math.random() * 2 + 0.5;
    }

    return { positions, colors, sizes };
  }, []);

  const lensedLight = useMemo(() => {
    const count = 300;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const angle = (i / count) * Math.PI * 2;
      const ringRadius = 3.5 + (Math.random() - 0.5) * 0.8;
      
      positions[i3] = Math.cos(angle) * ringRadius;
      positions[i3 + 1] = Math.sin(angle) * ringRadius * 0.3;
      positions[i3 + 2] = (Math.random() - 0.5) * 0.5;

      const brightness = 0.8 + Math.random() * 0.2;
      colors[i3] = brightness;
      colors[i3 + 1] = brightness * 0.9;
      colors[i3 + 2] = brightness * 0.7;

      sizes[i] = Math.random() * 3 + 1;
    }

    return { positions, colors, sizes };
  }, []);

  const lightRays = useMemo(() => {
    const rays = [];
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const startRadius = 3.5;
      const endRadius = 10;
      
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(
          Math.cos(angle) * startRadius,
          Math.sin(angle) * startRadius * 0.3,
          0
        ),
        new THREE.Vector3(
          Math.cos(angle + 0.3) * (startRadius + endRadius) / 2,
          Math.sin(angle + 0.3) * (startRadius + endRadius) / 2 * 0.3,
          (Math.random() - 0.5) * 2
        ),
        new THREE.Vector3(
          Math.cos(angle + 0.5) * endRadius,
          Math.sin(angle + 0.5) * endRadius * 0.3,
          (Math.random() - 0.5) * 3
        )
      );
      
      rays.push(curve);
    }
    return rays;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (ringsRef.current) {
      ringsRef.current.rotation.z = time * 0.1;
    }

    if (lensedStarsRef.current) {
      lensedStarsRef.current.rotation.z = time * 0.05;
    }

    if (raysRef.current) {
      raysRef.current.children.forEach((ray, i) => {
        const material = (ray as THREE.Line).material as THREE.LineBasicMaterial;
        material.opacity = 0.3 + Math.sin(time * 2 + i * 0.5) * 0.2;
      });
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Background starfield */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={starfield.positions.length / 3}
            array={starfield.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={starfield.colors.length / 3}
            array={starfield.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={starfield.sizes.length}
            array={starfield.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Central massive object (black hole/galaxy) */}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color="#1a0f2e"
          emissive="#4a2f6e"
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Event horizon glow */}
      <mesh>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial
          color="#6633ff"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Lensed light rings (Einstein rings) */}
      <group ref={ringsRef}>
        <points ref={lensedStarsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={lensedLight.positions.length / 3}
              array={lensedLight.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={lensedLight.colors.length / 3}
              array={lensedLight.colors}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-size"
              count={lensedLight.sizes.length}
              array={lensedLight.sizes}
              itemSize={1}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.3}
            vertexColors
            transparent
            opacity={0.9}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
          />
        </points>

        {/* Glowing ring tubes */}
        {[3.2, 3.5, 3.8].map((radius, i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[radius, 0.05, 8, 64]} />
            <meshBasicMaterial
              color={i === 1 ? "#ffdd88" : "#ffaa55"}
              transparent
              opacity={i === 1 ? 0.8 : 0.5}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>

      {/* Bent light rays */}
      <group ref={raysRef}>
        {lightRays.map((curve, i) => {
          const points = curve.getPoints(32);
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          
          return (
            <primitive key={i} object={new THREE.Line(geometry, new THREE.LineBasicMaterial({
              color: '#ffcc66',
              transparent: true,
              opacity: 0.4,
              blending: THREE.AdditiveBlending,
            }))} />
          );
        })}
      </group>

      {/* Distortion grid effect */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <ringGeometry args={[2, 8, 64, 16]} />
        <meshBasicMaterial
          color="#4488ff"
          transparent
          opacity={0.1}
          wireframe
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#6633ff" distance={8} />
    </group>
  );
}
