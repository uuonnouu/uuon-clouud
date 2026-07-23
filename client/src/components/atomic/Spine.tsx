import React, { useRef } from 'react';
import * as THREE from 'three';

interface SpineProps {
  position?: [number, number, number];
  scale?: number;
}

export default function Spine({ position = [0, 0, 0], scale = 1 }: SpineProps) {
  const groupRef = useRef<THREE.Group>(null);

  const vertebrae = [
    // Cervical (7) - neck
    ...Array.from({ length: 7 }, (_, i) => ({ y: 2.5 - i * 0.35, size: 0.15, color: '#F5DEB3' })),
    // Thoracic (12) - upper/mid back
    ...Array.from({ length: 12 }, (_, i) => ({ y: 0.05 - i * 0.32, size: 0.18, color: '#DEB887' })),
    // Lumbar (5) - lower back
    ...Array.from({ length: 5 }, (_, i) => ({ y: -3.79 - i * 0.38, size: 0.22, color: '#D2B48C' })),
    // Sacrum
    { y: -5.7, size: 0.25, color: '#BC8F8F' },
  ];

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Spinal cord */}
      <mesh>
        <cylinderGeometry args={[0.08, 0.08, 8.5, 16]} />
        <meshStandardMaterial
          color="#FFFACD"
          roughness={0.5}
          metalness={0.2}
          emissive="#888855"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Vertebrae */}
      {vertebrae.map((vertebra, i) => (
        <group key={i} position={[0, vertebra.y, 0]}>
          {/* Vertebral body */}
          <mesh>
            <cylinderGeometry args={[vertebra.size, vertebra.size, 0.25, 16]} />
            <meshStandardMaterial
              color={vertebra.color}
              roughness={0.7}
              metalness={0.1}
              emissive="#554433"
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* Vertebral arch */}
          <mesh position={[0, 0, -vertebra.size * 0.7]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[vertebra.size * 0.6, vertebra.size * 0.15, 8, 16, Math.PI]} />
            <meshStandardMaterial
              color={vertebra.color}
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>

          {/* Spinous process (back projection) */}
          <mesh position={[0, 0, -vertebra.size * 1.3]} rotation={[Math.PI / 4, 0, 0]}>
            <boxGeometry args={[vertebra.size * 0.3, vertebra.size * 0.8, vertebra.size * 0.2]} />
            <meshStandardMaterial
              color={vertebra.color}
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>

          {/* Transverse processes (side projections) */}
          <mesh position={[-vertebra.size * 0.9, 0, -vertebra.size * 0.5]} rotation={[0, 0, Math.PI / 6]}>
            <boxGeometry args={[vertebra.size * 0.6, vertebra.size * 0.2, vertebra.size * 0.2]} />
            <meshStandardMaterial
              color={vertebra.color}
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>
          <mesh position={[vertebra.size * 0.9, 0, -vertebra.size * 0.5]} rotation={[0, 0, -Math.PI / 6]}>
            <boxGeometry args={[vertebra.size * 0.6, vertebra.size * 0.2, vertebra.size * 0.2]} />
            <meshStandardMaterial
              color={vertebra.color}
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>
        </group>
      ))}

      {/* Intervertebral discs */}
      {vertebrae.slice(0, -1).map((vertebra, i) => (
        <mesh key={`disc-${i}`} position={[0, vertebra.y - 0.125, 0]}>
          <cylinderGeometry args={[vertebra.size * 0.95, vertebra.size * 0.95, 0.08, 16]} />
          <meshStandardMaterial
            color="#F0E68C"
            roughness={0.8}
            metalness={0.1}
            emissive="#665533"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}

      {/* Spinal nerves */}
      {vertebrae.slice(0, 24).map((vertebra, i) => (
        <React.Fragment key={`nerve-${i}`}>
          <mesh position={[-0.15, vertebra.y, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.015, 0.015, 0.5, 8]} />
            <meshStandardMaterial
              color="#FFFFE0"
              emissive="#AAAA66"
              emissiveIntensity={0.4}
            />
          </mesh>
          <mesh position={[0.15, vertebra.y, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <cylinderGeometry args={[0.015, 0.015, 0.5, 8]} />
            <meshStandardMaterial
              color="#FFFFE0"
              emissive="#AAAA66"
              emissiveIntensity={0.4}
            />
          </mesh>
        </React.Fragment>
      ))}

      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 2]} intensity={1.5} color="#ddbb88" distance={10} />
    </group>
  );
}
