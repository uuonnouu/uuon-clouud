import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

interface DNAHelixProps {
  scale: number;
  position: [number, number, number];
  timeOffset: number;
  harmonicFrequency: number;
}

export function DNADoubleHelix({ scale, position, timeOffset, harmonicFrequency }: DNAHelixProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  const helixGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const points2: THREE.Vector3[] = [];
    const segments = 100; // Reduced from 200 for better performance
    const height = 10 * scale;
    const radius = 0.8 * scale;
    const pitch = 3.4; // DNA pitch in arbitrary units (represents 3.4nm)
    
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments);
      const angle = t * Math.PI * 2 * (height / pitch);
      const y = (t - 0.5) * height;
      
      // First strand
      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      points.push(new THREE.Vector3(x1, y, z1));
      
      // Second strand (180 degrees offset)
      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;
      points2.push(new THREE.Vector3(x2, y, z2));
    }
    
    return {
      strand1: points,
      strand2: points2,
      basePairs: points.map((p, i) => ({ p1: p, p2: points2[i] }))
    };
  }, [scale]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime() + timeOffset;
      // Subtle rotation showing the helix structure
      groupRef.current.rotation.y = time * 0.1 * harmonicFrequency;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* First strand - phosphate backbone */}
      <Line
        points={helixGeometry.strand1}
        color="#4ECDC4"
        lineWidth={3}
      />
      
      {/* Second strand - phosphate backbone */}
      <Line
        points={helixGeometry.strand2}
        color="#FF6B6B"
        lineWidth={3}
      />
      
      {/* Base pairs connecting the strands */}
      {helixGeometry.basePairs.filter((_, i) => i % 4 === 0).map((pair, i) => (
        <Line
          key={i}
          points={[pair.p1, pair.p2]}
          color="#95E1D3"
          lineWidth={2}
        />
      ))}
    </group>
  );
}

interface ChromatinFiberProps {
  position: [number, number, number];
  scale: number;
  timeOffset: number;
  timeScale?: number;
}

export function ChromatinFiber({ position, scale, timeOffset, timeScale = 1 }: ChromatinFiberProps) {
  const groupRef = useRef<THREE.Group>(null);
  const nucleosomeCount = 12; // Reduced from 24 for better performance
  
  const nucleosomes = useMemo(() => {
    const items = [];
    const phi = 1.618033988749; // Golden ratio
    const radius = 1.2 * scale;
    const height = 12 * scale;
    
    for (let i = 0; i < nucleosomeCount; i++) {
      const t = i / nucleosomeCount;
      const angle = t * Math.PI * 2 * 3; // 3 turns
      const y = (t - 0.5) * height;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      items.push({
        position: [x, y, z] as [number, number, number],
        rotation: angle,
        scale: 0.15 * scale * (1 + Math.sin(t * Math.PI * 2) * 0.2)
      });
    }
    return items;
  }, [scale, nucleosomeCount]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = (clock.getElapsedTime() + timeOffset) * timeScale;
      groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Nucleosomes (histones with DNA wrapped) */}
      {nucleosomes.map((nucleo, i) => (
        <group key={i} position={nucleo.position}>
          {/* Histone core */}
          <mesh>
            <cylinderGeometry args={[nucleo.scale, nucleo.scale, nucleo.scale * 0.8, 8]} />
            <meshPhongMaterial color="#C77DFF" emissive="#C77DFF" emissiveIntensity={0.2} />
          </mesh>
          
          {/* DNA wrapping around histone */}
          <mesh rotation={[0, nucleo.rotation, 0]}>
            <torusGeometry args={[nucleo.scale * 1.2, nucleo.scale * 0.15, 8, 16]} />
            <meshPhongMaterial color="#7209B7" />
          </mesh>
        </group>
      ))}
      
      {/* Connecting fiber */}
      <mesh>
        <cylinderGeometry args={[scale * 0.05, scale * 0.05, 12 * scale, 8]} />
        <meshPhongMaterial color="#560BAD" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

interface OpticNeuralPathwayProps {
  position: [number, number, number];
  scale: number;
  timeScale?: number;
}

export function OpticNeuralPathway({ position, scale, timeScale = 1 }: OpticNeuralPathwayProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  const pathwayGeometry = useMemo(() => {
    const leftPath: THREE.Vector3[] = [];
    const rightPath: THREE.Vector3[] = [];
    const segments = 40; // Reduced from 60 for better performance
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const y = t * 8 * scale;
      
      // Left optic nerve path - starts left, crosses to RIGHT hemisphere at chiasma
      let x, z;
      if (t < 0.4) {
        // Before chiasma - left eye
        x = -1.5 * scale;
        z = 0;
      } else if (t < 0.6) {
        // Crossing at chiasma - crosses from left to RIGHT
        const crossT = (t - 0.4) / 0.2;
        x = -1.5 * scale + crossT * 2.2 * scale; // Cross from -1.5 to +0.7
        z = Math.sin(crossT * Math.PI) * 0.5 * scale;
      } else {
        // After chiasma - RIGHT hemisphere (contralateral)
        x = 0.7 * scale;
        z = (t - 0.6) * 2 * scale;
      }
      leftPath.push(new THREE.Vector3(x, y - 4 * scale, z));
      
      // Right optic nerve path - starts right, crosses to LEFT hemisphere at chiasma
      if (t < 0.4) {
        // Before chiasma - right eye
        x = 1.5 * scale;
        z = 0;
      } else if (t < 0.6) {
        // Crossing at chiasma - crosses from right to LEFT
        const crossT = (t - 0.4) / 0.2;
        x = 1.5 * scale - crossT * 2.2 * scale; // Cross from +1.5 to -0.7
        z = Math.sin(crossT * Math.PI) * 0.5 * scale;
      } else {
        // After chiasma - LEFT hemisphere (contralateral)
        x = -0.7 * scale;
        z = (t - 0.6) * 2 * scale;
      }
      rightPath.push(new THREE.Vector3(x, y - 4 * scale, z));
    }
    
    return {
      left: leftPath,
      right: rightPath
    };
  }, [scale]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime() * timeScale;
      // Subtle pulsing to show signal transmission
      groupRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.02);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Left optic nerve */}
      <Line
        points={pathwayGeometry.left}
        color="#FFD700"
        lineWidth={4}
      />
      
      {/* Right optic nerve */}
      <Line
        points={pathwayGeometry.right}
        color="#FFA500"
        lineWidth={4}
      />
      
      {/* Eyeballs at origin */}
      <mesh position={[-1.5 * scale, -4 * scale, 0]}>
        <sphereGeometry args={[0.4 * scale, 16, 16]} />
        <meshPhongMaterial color="#FFFFFF" emissive="#88CCFF" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[1.5 * scale, -4 * scale, 0]}>
        <sphereGeometry args={[0.4 * scale, 16, 16]} />
        <meshPhongMaterial color="#FFFFFF" emissive="#88CCFF" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Optic chiasma (crossing point) */}
      <mesh position={[0, -4 * scale + 3.2 * scale, 0.25 * scale]}>
        <torusGeometry args={[0.6 * scale, 0.15 * scale, 8, 16]} />
        <meshPhongMaterial color="#FF6B35" emissive="#FF6B35" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Lateral geniculate nucleus (LGN) nodes */}
      <mesh position={[-0.7 * scale, -4 * scale + 6 * scale, 1.5 * scale]}>
        <sphereGeometry args={[0.25 * scale, 12, 12]} />
        <meshPhongMaterial color="#9B59B6" emissive="#9B59B6" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0.7 * scale, -4 * scale + 6 * scale, 1.5 * scale]}>
        <sphereGeometry args={[0.25 * scale, 12, 12]} />
        <meshPhongMaterial color="#9B59B6" emissive="#9B59B6" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

interface HarmonicResonanceFieldProps {
  scale: number;
  frequency: number;
  timeScale: number;
}

export function HarmonicResonanceField({ scale, frequency, timeScale }: HarmonicResonanceFieldProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 300; // Reduced from 1000 for better performance
  
  // Store immutable base positions
  const basePositions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const phi = 1.618033988749;
    
    for (let i = 0; i < particleCount; i++) {
      // Golden ratio distribution in spherical coordinates
      const theta = Math.acos(2 * (i / particleCount) - 1);
      const phiAngle = (i * phi * 2 * Math.PI) % (2 * Math.PI);
      const r = 8 * scale * Math.cbrt(i / particleCount);
      
      positions[i * 3] = r * Math.sin(theta) * Math.cos(phiAngle);
      positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phiAngle);
      positions[i * 3 + 2] = r * Math.cos(theta);
    }
    return positions;
  }, [scale, particleCount]);
  
  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(basePositions), 3));
    return geometry;
  }, [basePositions]);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      const time = clock.getElapsedTime() * timeScale;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Use immutable base positions
        const baseX = basePositions[i3];
        const baseY = basePositions[i3 + 1];
        const baseZ = basePositions[i3 + 2];
        
        // Wave interference pattern
        const dist = Math.sqrt(baseX * baseX + baseY * baseY + baseZ * baseZ);
        const wave = Math.sin(dist * frequency - time * 2) * 0.1;
        
        // Apply wave to base positions (not cumulative)
        positions[i3] = baseX;
        positions[i3 + 1] = baseY + wave;
        positions[i3 + 2] = baseZ;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.rotation.y = time * 0.05;
    }
  });

  return (
    <points ref={particlesRef} geometry={particleGeometry}>
      <pointsMaterial
        size={0.05}
        color="#00FFFF"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

interface FractalBiosystemSceneProps {
  timeScale?: number;
  harmonicFrequency?: number;
}

export default function FractalBiosystemScene({ 
  timeScale = 1, 
  harmonicFrequency = 1 
}: FractalBiosystemSceneProps) {
  return (
    <group>
      {/* Multi-scale DNA hierarchy */}
      <DNADoubleHelix 
        scale={1} 
        position={[-6, 0, 0]} 
        timeOffset={0} 
        harmonicFrequency={harmonicFrequency * timeScale}
      />
      <ChromatinFiber 
        position={[-3, 0, 0]} 
        scale={0.8} 
        timeOffset={Math.PI / 3}
        timeScale={timeScale}
      />
      
      {/* Condensed chromatin structure */}
      <ChromatinFiber 
        position={[0, 0, 0]} 
        scale={1.2} 
        timeOffset={Math.PI / 2}
        timeScale={timeScale}
      />
      
      {/* Neural pathway structure */}
      <OpticNeuralPathway 
        position={[5, 0, 0]} 
        scale={1}
        timeScale={timeScale}
      />
      
      {/* Harmonic resonance field connecting everything */}
      <HarmonicResonanceField 
        scale={1} 
        frequency={harmonicFrequency}
        timeScale={timeScale}
      />
      
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} color="#FFFFFF" />
      <directionalLight position={[-10, -10, -5]} intensity={0.4} color="#4ECDC4" />
      <pointLight position={[0, 0, 0]} intensity={1} color="#C77DFF" distance={20} />
    </group>
  );
}
