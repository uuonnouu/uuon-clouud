import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ElectromagneticRadiation({ scale = 3 }: { scale?: number }) {
  const waveRef1 = useRef<THREE.Mesh>(null);
  const waveRef2 = useRef<THREE.Mesh>(null);
  
  const waveGeometry = useMemo(() => {
    const points = [];
    const segments = 128;
    const length = scale * 6;
    
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments - 0.5) * length;
      const y = Math.sin((i / segments) * Math.PI * 4) * scale * 0.8;
      points.push(new THREE.Vector3(x, y, 0));
    }
    
    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(curve, 128, 0.08, 8, false);
  }, [scale]);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (waveRef1.current) {
      waveRef1.current.position.x = Math.sin(t * 2) * scale * 0.5;
    }
    
    if (waveRef2.current) {
      waveRef2.current.position.x = Math.sin(t * 2 + Math.PI) * scale * 0.5;
    }
  });
  
  return (
    <group>
      <mesh ref={waveRef1} geometry={waveGeometry}>
        <meshPhysicalMaterial
          color="#4488ff"
          emissive="#4488ff"
          emissiveIntensity={1.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      <mesh ref={waveRef2} geometry={waveGeometry} rotation={[0, 0, Math.PI / 2]}>
        <meshPhysicalMaterial
          color="#ff8844"
          emissive="#ff8844"
          emissiveIntensity={1.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      <arrowHelper
        args={[
          new THREE.Vector3(1, 0, 0),
          new THREE.Vector3(-scale * 3, 0, 0),
          scale * 6,
          0xffffff,
          0.3,
          0.2
        ]}
      />
      
      <pointLight color="#6688ff" intensity={15} distance={10} />
    </group>
  );
}
