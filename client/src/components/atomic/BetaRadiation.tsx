import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function BetaRadiation({ scale = 3 }: { scale?: number }) {
  const particleRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Mesh>(null);
  
  const trailGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-scale * 2, 0, 0),
      new THREE.Vector3(-scale, scale * 0.5, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(scale, -scale * 0.5, 0),
      new THREE.Vector3(scale * 2, 0, 0),
    ]);
    
    return new THREE.TubeGeometry(curve, 64, 0.08, 8, false);
  }, [scale]);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (particleRef.current) {
      const progress = (Math.sin(t * 0.5) + 1) / 2;
      const x = (progress - 0.5) * scale * 4;
      const y = Math.sin(progress * Math.PI) * scale * 0.5;
      
      particleRef.current.position.set(x, y, 0);
      
      const pulse = Math.sin(t * 5) * 0.2 + 1;
      particleRef.current.scale.setScalar(pulse);
    }
  });
  
  return (
    <group>
      <mesh ref={trailRef} geometry={trailGeometry}>
        <meshPhysicalMaterial
          color="#4488ff"
          emissive="#4488ff"
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.2 * scale, 16, 16]} />
        <meshPhysicalMaterial
          color="#66aaff"
          emissive="#4488ff"
          emissiveIntensity={2.0}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      
      <mesh position={[0, 0, -0.3]}>
        <sphereGeometry args={[0.3 * scale, 16, 16]} />
        <meshBasicMaterial
          color="#4488ff"
          transparent
          opacity={0.3}
        />
      </mesh>
      
      <pointLight color="#4488ff" intensity={20} distance={10} />
    </group>
  );
}
