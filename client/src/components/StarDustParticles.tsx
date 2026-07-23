import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

interface StarDustParticlesProps {
  enabled?: boolean;
  count?: number;
  size?: number;
  speed?: number;
  color?: string;
  radius?: number;
  radiatingFromCenter?: boolean;
  seed?: number;
}

export default function StarDustParticles({
  enabled = true,
  count = 500,
  size = 0.02,
  speed = 0.5,
  color = '#ffffff',
  radius = 5,
  radiatingFromCenter = true,
  seed = 42
}: StarDustParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const velocitiesRef = useRef<Float32Array | null>(null);
  
  const [positions, initialVelocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const seedBase = seed + i * 3;
      
      if (radiatingFromCenter) {
        const theta = seededRandom(seedBase) * Math.PI * 2;
        const phi = Math.acos(2 * seededRandom(seedBase + 1) - 1);
        const r = seededRandom(seedBase + 2) * radius * 0.3;
        
        pos[i3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i3 + 2] = r * Math.cos(phi);
        
        const vr = 0.01 + seededRandom(seedBase + 3) * 0.02;
        vel[i3] = vr * Math.sin(phi) * Math.cos(theta);
        vel[i3 + 1] = vr * Math.sin(phi) * Math.sin(theta);
        vel[i3 + 2] = vr * Math.cos(phi);
      } else {
        pos[i3] = (seededRandom(seedBase) - 0.5) * radius * 2;
        pos[i3 + 1] = (seededRandom(seedBase + 1) - 0.5) * radius * 2;
        pos[i3 + 2] = (seededRandom(seedBase + 2) - 0.5) * radius * 2;
        
        vel[i3] = (seededRandom(seedBase + 3) - 0.5) * 0.01;
        vel[i3 + 1] = (seededRandom(seedBase + 4) - 0.5) * 0.01;
        vel[i3 + 2] = (seededRandom(seedBase + 5) - 0.5) * 0.01;
      }
    }
    
    return [pos, vel];
  }, [count, radius, radiatingFromCenter, seed]);
  
  velocitiesRef.current = initialVelocities;
  
  const colors = useMemo(() => {
    const cols = new Float32Array(count * 3);
    const baseColor = new THREE.Color(color);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const brightness = 0.7 + seededRandom(seed + i * 11) * 0.3;
      cols[i3] = baseColor.r * brightness;
      cols[i3 + 1] = baseColor.g * brightness;
      cols[i3 + 2] = baseColor.b * brightness;
    }
    
    return cols;
  }, [count, color, seed]);
  
  useFrame((state, delta) => {
    if (!enabled || !pointsRef.current || !velocitiesRef.current) return;
    
    const geometry = pointsRef.current.geometry;
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const positions = posAttr.array as Float32Array;
    const velocities = velocitiesRef.current;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      positions[i3] += velocities[i3] * speed;
      positions[i3 + 1] += velocities[i3 + 1] * speed;
      positions[i3 + 2] += velocities[i3 + 2] * speed;
      
      const dist = Math.sqrt(
        positions[i3] ** 2 + 
        positions[i3 + 1] ** 2 + 
        positions[i3 + 2] ** 2
      );
      
      if (dist > radius) {
        const respawnSeed = seed + i * 7 + Math.floor(state.clock.elapsedTime * 10);
        if (radiatingFromCenter) {
          const theta = seededRandom(respawnSeed) * Math.PI * 2;
          const phi = Math.acos(2 * seededRandom(respawnSeed + 1) - 1);
          const r = seededRandom(respawnSeed + 2) * 0.2;
          
          positions[i3] = r * Math.sin(phi) * Math.cos(theta);
          positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
          positions[i3 + 2] = r * Math.cos(phi);
        } else {
          positions[i3] = (seededRandom(respawnSeed) - 0.5) * radius * 2;
          positions[i3 + 1] = (seededRandom(respawnSeed + 1) - 0.5) * radius * 2;
          positions[i3 + 2] = (seededRandom(respawnSeed + 2) - 0.5) * radius * 2;
        }
      }
    }
    
    posAttr.needsUpdate = true;
  });
  
  if (!enabled) return null;
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

export function createStarDustGeometryForExport(
  count: number = 500,
  size: number = 0.02,
  color: string = '#ffffff',
  radius: number = 5
): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const baseColor = new THREE.Color(color);
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = Math.random() * radius;
    
    positions[i3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = r * Math.cos(phi);
    
    const brightness = 0.7 + Math.random() * 0.3;
    colors[i3] = baseColor.r * brightness;
    colors[i3 + 1] = baseColor.g * brightness;
    colors[i3 + 2] = baseColor.b * brightness;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  return geometry;
}

export { StarDustParticles };
