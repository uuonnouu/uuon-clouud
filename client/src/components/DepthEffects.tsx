import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface DepthEffectsProps {
  fogColor?: number;
  fogDensity?: number;
}

export default function DepthEffects({ 
  fogColor = 0x000000, 
  fogDensity = 0.015 
}: DepthEffectsProps) {
  const { scene, gl } = useThree();
  
  useEffect(() => {
    scene.fog = new THREE.FogExp2(fogColor, fogDensity);
    
    return () => {
      scene.fog = null;
    };
  }, [scene, fogColor, fogDensity]);
  
  return null;
}
