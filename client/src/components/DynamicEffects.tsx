import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface DynamicEffectsProps {
  particleCount?: number;
  animationSpeed?: number;
  bloomIntensity?: number;
  enabled?: boolean;
}

function ParticleField({ count = 1000, speed = 1 }: { count: number; speed: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const baselineY = new Float32Array(count); // Cache baseline Y positions
    
    for (let i = 0; i < count; i++) {
      // Distribute particles in a sphere around the mathematical object
      const radius = Math.random() * 15 + 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Cache baseline Y position
      baselineY[i] = positions[i * 3 + 1];
      
      // Create color variation based on position
      const hue = (Math.atan2(positions[i * 3 + 1], positions[i * 3]) + Math.PI) / (2 * Math.PI);
      const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return { positions, colors, baselineY };
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.getElapsedTime() * speed;
      pointsRef.current.rotation.y = time * 0.05;
      pointsRef.current.rotation.x = time * 0.02;
      
      // Animate particle positions for dynamic movement using baseline to prevent drift
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        const particleIdx = i / 3;
        const baseY = particles.baselineY[particleIdx];
        positions[i + 1] = baseY + Math.sin(time + i * 0.1) * 0.1;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={particles.positions}
          count={particles.positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={particles.colors}
          count={particles.colors.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function EnergyRings({ speed = 1 }: { speed: number }) {
  const ringsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ringsRef.current) {
      const time = state.clock.getElapsedTime() * speed;
      ringsRef.current.rotation.z = time * 0.3;
      ringsRef.current.rotation.x = time * 0.1;
    }
  });

  return (
    <group ref={ringsRef}>
      {[...Array(3)].map((_, i) => (
        <mesh key={i} rotation={[0, 0, (i * Math.PI) / 3]}>
          <torusGeometry args={[3 + i * 0.5, 0.02, 16, 100]} />
          <meshBasicMaterial
            color={`hsl(${120 + i * 60}, 80%, 60%)`}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

function MathematicalGrid({ opacity = 0.3 }: { opacity: number }) {
  const gridRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (gridRef.current) {
      const time = state.clock.getElapsedTime();
      gridRef.current.rotation.y = time * 0.02;
    }
  });

  const gridLines = useMemo(() => {
    const lines = [];
    const gridSize = 20;
    const divisions = 40;
    
    // Create mathematical coordinate system
    for (let i = 0; i <= divisions; i++) {
      const position = (i / divisions - 0.5) * gridSize;
      
      // X-axis lines
      lines.push(
        <line key={`x-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={new Float32Array([
                -gridSize/2, 0, position,
                gridSize/2, 0, position
              ])}
              count={2}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#333333" transparent opacity={opacity} />
        </line>
      );
      
      // Z-axis lines
      lines.push(
        <line key={`z-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={new Float32Array([
                position, 0, -gridSize/2,
                position, 0, gridSize/2
              ])}
              count={2}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#333333" transparent opacity={opacity} />
        </line>
      );
    }
    
    return lines;
  }, [opacity]);

  return (
    <group ref={gridRef} position={[0, -5, 0]}>
      {gridLines}
    </group>
  );
}

export default function DynamicEffects({
  particleCount = 800,
  animationSpeed = 1.0,
  bloomIntensity = 0.3,
  enabled = true
}: DynamicEffectsProps) {
  if (!enabled) return null;

  return (
    <>
      {/* Particle field for ambient atmosphere */}
      <ParticleField count={particleCount} speed={animationSpeed} />
      
      {/* Energy rings for visual enhancement */}
      <EnergyRings speed={animationSpeed} />
      
      {/* Enhanced mathematical grid */}
      <MathematicalGrid opacity={0.2} />
      
      {/* Ambient lighting with color cycling */}
      <ambientLight intensity={0.1 + bloomIntensity * 0.3} />
      
      {/* Dynamic point lights */}
      <pointLight
        position={[5, 5, 5]}
        intensity={0.5 + bloomIntensity}
        color={`hsl(${Date.now() * 0.01 % 360}, 70%, 60%)`}
      />
      <pointLight
        position={[-5, -5, 5]}
        intensity={0.3 + bloomIntensity * 0.5}
        color={`hsl(${(Date.now() * 0.01 + 180) % 360}, 70%, 60%)`}
      />
    </>
  );
}