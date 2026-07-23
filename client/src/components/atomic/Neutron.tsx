import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Quark from './Quark';

interface NeutronProps {
  position: [number, number, number];
  showInternals?: boolean;
  scale?: number;
}

export default function Neutron({ position, showInternals = false, scale = 1 }: NeutronProps) {
  const groupRef = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  
  const radius = 0.5 * scale;
  const quarkDistance = 0.2 * scale;
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
    }
    if (shellRef.current && showInternals) {
      const pulse = Math.sin(state.clock.elapsedTime * 3 + 1.5) * 0.05 + 0.95;
      shellRef.current.scale.setScalar(pulse);
    }
  });
  
  return (
    <group ref={groupRef} position={position}>
      <mesh ref={shellRef}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshPhysicalMaterial
          color="#44ddcc"
          emissive="#22aa99"
          emissiveIntensity={0.4}
          roughness={0.3}
          metalness={0.7}
          transparent
          opacity={showInternals ? 0.3 : 0.9}
          transmission={showInternals ? 0.7 : 0}
          thickness={0.5}
        />
      </mesh>
      
      <pointLight
        color="#44ddcc"
        intensity={3.5}
        distance={3}
      />
      
      {showInternals && (
        <>
          <Quark position={[quarkDistance, 0, 0]} color="red" type="up" scale={scale * 0.15} />
          <Quark position={[-quarkDistance * 0.5, quarkDistance * 0.866, 0]} color="green" type="down" scale={scale * 0.15} />
          <Quark position={[-quarkDistance * 0.5, -quarkDistance * 0.866, 0]} color="blue" type="down" scale={scale * 0.15} />
          
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={6}
                array={new Float32Array([
                  quarkDistance, 0, 0,
                  -quarkDistance * 0.5, quarkDistance * 0.866, 0,
                  -quarkDistance * 0.5, quarkDistance * 0.866, 0,
                  -quarkDistance * 0.5, -quarkDistance * 0.866, 0,
                  -quarkDistance * 0.5, -quarkDistance * 0.866, 0,
                  quarkDistance, 0, 0,
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#ffffff" opacity={0.3} transparent />
          </line>
        </>
      )}
    </group>
  );
}
