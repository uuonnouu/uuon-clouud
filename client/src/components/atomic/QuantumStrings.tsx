import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface QuantumStringsProps {
  position?: [number, number, number];
  scale?: number;
}

export default function QuantumStrings({ position = [0, 0, 0], scale = 1 }: QuantumStringsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const stringsRef = useRef<THREE.Group>(null);

  const strings = useMemo(() => {
    const stringData = [];
    
    for (let i = 0; i < 20; i++) {
      const points = [];
      const numPoints = 50;
      
      const baseAngle = (i / 20) * Math.PI * 2;
      const baseRadius = 2 + Math.random() * 3;
      
      for (let j = 0; j < numPoints; j++) {
        const t = j / numPoints;
        const angle = baseAngle + t * Math.PI * 4;
        const radius = baseRadius + Math.sin(t * Math.PI * 6) * 0.5;
        const height = (t - 0.5) * 8 + Math.sin(t * Math.PI * 8) * 0.8;
        
        points.push(new THREE.Vector3(
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        ));
      }
      
      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.02, 8, false);
      
      const hue = Math.random();
      const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
      
      stringData.push({
        geometry: tubeGeometry,
        color,
        speed: 0.5 + Math.random() * 1.0,
        phase: Math.random() * Math.PI * 2,
      });
    }
    
    return stringData;
  }, []);

  const quantumFoam = useMemo(() => {
    const count = 600;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = Math.random() * 6;
      
      positions[i3] = Math.sin(phi) * Math.cos(theta) * radius;
      positions[i3 + 1] = (Math.random() - 0.5) * 8;
      positions[i3 + 2] = Math.sin(phi) * Math.sin(theta) * radius;

      const hue = Math.random();
      const color = new THREE.Color().setHSL(hue, 0.7, 0.6);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * 1.5 + 0.3;
    }

    return { positions, colors, sizes };
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.1;
    }

    if (stringsRef.current) {
      stringsRef.current.children.forEach((mesh, i) => {
        const stringMesh = mesh as THREE.Mesh;
        const material = stringMesh.material as THREE.MeshBasicMaterial;
        
        const vibration = Math.sin(time * strings[i].speed + strings[i].phase);
        material.opacity = 0.7 + vibration * 0.2;
        
        stringMesh.rotation.x = time * 0.3 + i * 0.1;
        stringMesh.rotation.z = time * 0.2 + i * 0.15;
      });
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Vibrating quantum strings */}
      <group ref={stringsRef}>
        {strings.map((string, i) => (
          <mesh key={i} geometry={string.geometry}>
            <meshBasicMaterial
              color={string.color}
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>

      {/* Quantum foam particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={quantumFoam.positions.length / 3}
            array={quantumFoam.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={quantumFoam.colors.length / 3}
            array={quantumFoam.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={quantumFoam.sizes.length}
            array={quantumFoam.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Central Planck-scale nexus */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={2.0}
          roughness={0}
          metalness={1}
        />
      </mesh>

      {/* Energy shell */}
      {[0.5, 0.7, 0.9].map((radius, i) => (
        <mesh key={i}>
          <sphereGeometry args={[radius, 32, 32]} />
          <meshBasicMaterial
            color={new THREE.Color().setHSL(i * 0.2, 0.8, 0.7)}
            transparent
            opacity={0.2 - i * 0.05}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" distance={10} />
    </group>
  );
}
