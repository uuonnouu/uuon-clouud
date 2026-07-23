import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Nucleus from './Nucleus';
import Electron from './Electron';

export default function BohrModel({ scale = 3 }: { scale?: number }) {
  const shell1Ref = useRef<THREE.Group>(null);
  const shell2Ref = useRef<THREE.Group>(null);
  const shell3Ref = useRef<THREE.Group>(null);
  
  const createShellRing = (radius: number, segments = 128) => {
    const points = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ));
    }
    return points;
  };
  
  useFrame(() => {
    if (shell1Ref.current) shell1Ref.current.rotation.y += 0.025;
    if (shell2Ref.current) shell2Ref.current.rotation.y += 0.018;
    if (shell3Ref.current) shell3Ref.current.rotation.y += 0.012;
  });
  
  return (
    <group>
      <Nucleus protonCount={7} neutronCount={7} showInternals={false} scale={0.35 * scale} />
      
      <group ref={shell1Ref}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[scale * 1.2, 0.02, 16, 100]} />
          <meshBasicMaterial color="#88ccff" transparent opacity={0.6} />
        </mesh>
        <Electron position={[scale * 1.2, 0, 0]} scale={scale * 0.25} />
        <Electron position={[-scale * 1.2, 0, 0]} scale={scale * 0.25} />
      </group>
      
      <group ref={shell2Ref}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[scale * 2.0, 0.02, 16, 100]} />
          <meshBasicMaterial color="#88ccff" transparent opacity={0.5} />
        </mesh>
        <Electron position={[scale * 2.0, 0, 0]} scale={scale * 0.25} />
        <Electron position={[0, 0, scale * 2.0]} scale={scale * 0.25} />
        <Electron position={[-scale * 2.0, 0, 0]} scale={scale * 0.25} />
        <Electron position={[0, 0, -scale * 2.0]} scale={scale * 0.25} />
      </group>
      
      <group ref={shell3Ref}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[scale * 2.8, 0.02, 16, 100]} />
          <meshBasicMaterial color="#88ccff" transparent opacity={0.4} />
        </mesh>
        <Electron position={[scale * 2.8, 0, 0]} scale={scale * 0.25} />
      </group>
    </group>
  );
}
