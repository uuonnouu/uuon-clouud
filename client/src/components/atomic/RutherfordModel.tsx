import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Nucleus from './Nucleus';
import Electron from './Electron';

export default function RutherfordModel({ scale = 3 }: { scale?: number }) {
  const orbitRef1 = useRef<THREE.Group>(null);
  const orbitRef2 = useRef<THREE.Group>(null);
  const orbitRef3 = useRef<THREE.Group>(null);
  
  const createOrbitPath = (radius: number, segments = 128) => {
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
    if (orbitRef1.current) orbitRef1.current.rotation.y += 0.02;
    if (orbitRef2.current) orbitRef2.current.rotation.y -= 0.015;
    if (orbitRef3.current) orbitRef3.current.rotation.y += 0.01;
  });
  
  return (
    <group>
      <Nucleus protonCount={6} neutronCount={6} showInternals={false} scale={0.4 * scale} />
      
      <group ref={orbitRef1}>
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={129}
              array={new Float32Array(createOrbitPath(scale * 1.5).flatMap(v => [v.x, v.y, v.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#ffcc44" opacity={0.3} transparent />
        </line>
        <Electron position={[scale * 1.5, 0, 0]} scale={scale * 0.3} />
      </group>
      
      <group ref={orbitRef2} rotation={[Math.PI / 3, 0, 0]}>
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={129}
              array={new Float32Array(createOrbitPath(scale * 2.2).flatMap(v => [v.x, v.y, v.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#ffcc44" opacity={0.3} transparent />
        </line>
        <Electron position={[scale * 2.2, 0, 0]} scale={scale * 0.3} />
        <Electron position={[-scale * 2.2, 0, 0]} scale={scale * 0.3} />
      </group>
      
      <group ref={orbitRef3} rotation={[-Math.PI / 4, 0, Math.PI / 6]}>
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={129}
              array={new Float32Array(createOrbitPath(scale * 2.8).flatMap(v => [v.x, v.y, v.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#ffcc44" opacity={0.3} transparent />
        </line>
        <Electron position={[scale * 2.8, 0, 0]} scale={scale * 0.3} />
      </group>
    </group>
  );
}
