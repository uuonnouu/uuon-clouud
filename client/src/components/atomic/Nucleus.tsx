import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Proton from './Proton';
import Neutron from './Neutron';

interface NucleusProps {
  protonCount: number;
  neutronCount: number;
  showInternals?: boolean;
  scale?: number;
}

export default function Nucleus({ protonCount, neutronCount, showInternals = false, scale = 1 }: NucleusProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  const nucleonPositions = useMemo(() => {
    const positions: Array<{ type: 'proton' | 'neutron', position: [number, number, number] }> = [];
    const totalNucleons = protonCount + neutronCount;
    const nucleonRadius = 0.5 * scale;
    const clusterRadius = Math.cbrt(totalNucleons) * nucleonRadius * 1.2;
    
    for (let i = 0; i < protonCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / totalNucleons);
      const theta = Math.sqrt(totalNucleons * Math.PI) * phi;
      
      const x = clusterRadius * Math.sin(phi) * Math.cos(theta);
      const y = clusterRadius * Math.sin(phi) * Math.sin(theta);
      const z = clusterRadius * Math.cos(phi);
      
      positions.push({ type: 'proton', position: [x, y, z] });
    }
    
    for (let i = 0; i < neutronCount; i++) {
      const index = protonCount + i;
      const phi = Math.acos(-1 + (2 * index) / totalNucleons);
      const theta = Math.sqrt(totalNucleons * Math.PI) * phi;
      
      const x = clusterRadius * Math.sin(phi) * Math.cos(theta);
      const y = clusterRadius * Math.sin(phi) * Math.sin(theta);
      const z = clusterRadius * Math.cos(phi);
      
      positions.push({ type: 'neutron', position: [x, y, z] });
    }
    
    return positions;
  }, [protonCount, neutronCount, scale]);
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
      groupRef.current.rotation.x += 0.002;
    }
  });
  
  return (
    <group ref={groupRef}>
      {nucleonPositions.map((nucleon, index) => (
        nucleon.type === 'proton' ? (
          <Proton
            key={`proton-${index}`}
            position={nucleon.position}
            showInternals={showInternals}
            scale={scale}
          />
        ) : (
          <Neutron
            key={`neutron-${index}`}
            position={nucleon.position}
            showInternals={showInternals}
            scale={scale}
          />
        )
      ))}
    </group>
  );
}
