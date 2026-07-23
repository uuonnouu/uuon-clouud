import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Nucleus from './Nucleus';

export default function ElectronCloud({ scale = 3 }: { scale?: number }) {
  const cloudRef = useRef<THREE.Points>(null);
  const innerCloudRef = useRef<THREE.Points>(null);
  
  const { positions, colors, sizes } = useMemo(() => {
    const count = 8000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    const color = new THREE.Color();
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const r = Math.pow(Math.random(), 0.3) * scale * 2.5;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      const intensity = 1 - (r / (scale * 2.5));
      color.setHSL(0.55 + Math.random() * 0.1, 0.8, 0.5 + intensity * 0.3);
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      sizes[i] = Math.random() * 0.08 + 0.02;
    }
    
    return { positions, colors, sizes };
  }, [scale]);
  
  const { innerPositions, innerColors, innerSizes } = useMemo(() => {
    const count = 3000;
    const innerPositions = new Float32Array(count * 3);
    const innerColors = new Float32Array(count * 3);
    const innerSizes = new Float32Array(count);
    
    const color = new THREE.Color();
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const r = Math.pow(Math.random(), 0.5) * scale * 1.2;
      
      innerPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      innerPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      innerPositions[i * 3 + 2] = r * Math.cos(phi);
      
      color.setHSL(0.15, 0.9, 0.6);
      
      innerColors[i * 3] = color.r;
      innerColors[i * 3 + 1] = color.g;
      innerColors[i * 3 + 2] = color.b;
      
      innerSizes[i] = Math.random() * 0.1 + 0.05;
    }
    
    return { innerPositions, innerColors, innerSizes };
  }, [scale]);
  
  useFrame((state) => {
    if (cloudRef.current) {
      cloudRef.current.rotation.y += 0.001;
      cloudRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
    }
    if (innerCloudRef.current) {
      innerCloudRef.current.rotation.y -= 0.002;
    }
  });
  
  return (
    <group>
      <Nucleus protonCount={6} neutronCount={6} showInternals={false} scale={0.3 * scale} />
      
      <points ref={cloudRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={sizes.length}
            array={sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      <points ref={innerCloudRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={innerPositions.length / 3}
            array={innerPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={innerColors.length / 3}
            array={innerColors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={innerSizes.length}
            array={innerSizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
