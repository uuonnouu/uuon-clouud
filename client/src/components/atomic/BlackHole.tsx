import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function BlackHole({ scale = 3 }: { scale?: number }) {
  const diskRef = useRef<THREE.Group>(null);
  const eventHorizonRef = useRef<THREE.Mesh>(null);
  
  const accretionDiskLayers = useMemo(() => {
    const layers = [];
    const layerCount = 8;
    
    for (let i = 0; i < layerCount; i++) {
      const radius = scale * (1.5 + i * 0.3);
      const color = new THREE.Color();
      const t = i / layerCount;
      color.setHSL(0.08 - t * 0.05, 1.0, 0.5 + t * 0.2);
      
      layers.push({
        radius,
        color: color.getHex(),
        opacity: 0.8 - t * 0.3,
        emissiveIntensity: 2.5 - t * 1.0
      });
    }
    
    return layers;
  }, [scale]);
  
  const starfield = useMemo(() => {
    const count = 1000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 20 + Math.random() * 30;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      const brightness = Math.random();
      colors[i * 3] = brightness;
      colors[i * 3 + 1] = brightness;
      colors[i * 3 + 2] = brightness;
      
      sizes[i] = Math.random() * 0.1 + 0.05;
    }
    
    return { positions, colors, sizes };
  }, []);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (diskRef.current) {
      diskRef.current.rotation.y += 0.01;
    }
    
    if (eventHorizonRef.current) {
      const pulse = Math.sin(t * 2) * 0.05 + 1;
      eventHorizonRef.current.scale.setScalar(pulse);
    }
  });
  
  return (
    <group>
      {/* Distorted starfield background */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={starfield.positions.length / 3}
            array={starfield.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={starfield.colors.length / 3}
            array={starfield.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={starfield.sizes.length}
            array={starfield.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      {/* Spacetime distortion rings - visual gravity wells */}
      {[2, 3, 4, 5, 6].map((radius, i) => (
        <mesh key={`distortion-${i}`} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[scale * radius, 0.05, 8, 64]} />
          <meshBasicMaterial
            color="#4488ff"
            transparent
            opacity={0.1 - i * 0.015}
            wireframe
          />
        </mesh>
      ))}

      {/* Movie-style photon sphere */}
      <mesh>
        <sphereGeometry args={[scale * 1.8, 64, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.05}
          wireframe
        />
      </mesh>
      
      {/* Absolute event horizon - pitch black */}
      <mesh ref={eventHorizonRef}>
        <sphereGeometry args={[scale * 1.2, 64, 64]} />
        <meshBasicMaterial
          color="#000000"
          side={THREE.FrontSide}
        />
      </mesh>
      
      {/* Hawking radiation glow */}
      <mesh>
        <sphereGeometry args={[scale * 1.21, 64, 64]} />
        <meshPhysicalMaterial
          color="#ff6600"
          emissive="#ff4400"
          emissiveIntensity={2.5}
          transparent
          opacity={0.4}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Enhanced cinematic accretion disk */}
      <group ref={diskRef} rotation={[Math.PI / 6, 0, 0]}>
        {accretionDiskLayers.map((layer, i) => (
          <mesh key={i}>
            <torusGeometry args={[layer.radius, 0.2, 16, 64]} />
            <meshPhysicalMaterial
              color={layer.color}
              emissive={layer.color}
              emissiveIntensity={layer.emissiveIntensity * 1.5}
              transparent
              opacity={layer.opacity}
              roughness={0.1}
              metalness={0.8}
            />
          </mesh>
        ))}
        
        {/* Hot spots in accretion disk */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = scale * (2.5 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.3);
          return (
            <mesh key={`hotspot-${i}`} 
                  position={[
                    Math.cos(angle) * radius,
                    Math.sin(state.clock.elapsedTime * 3 + i) * 0.2,
                    Math.sin(angle) * radius
                  ]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshBasicMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={5}
              />
            </mesh>
          );
        })}
      </group>

      {/* Gravitational lensing effect */}
      <mesh>
        <sphereGeometry args={[scale * 8, 32, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.02}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Multiple light sources for dramatic effect */}
      <pointLight color="#ff8844" intensity={25} distance={25} />
      <pointLight position={[0, scale * 3, 0]} color="#ffffff" intensity={15} distance={30} />
      <directionalLight position={[10, 10, 10]} intensity={0.5} color="#4488ff" />
    </group>
  );
}
