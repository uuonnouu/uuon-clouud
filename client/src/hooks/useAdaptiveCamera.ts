import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface AdaptiveCameraConfig {
  minDistanceMultiplier?: number;
  maxDistanceMultiplier?: number;
  zoomSpeedBase?: number;
}

export function useAdaptiveCamera(
  meshRef: React.RefObject<THREE.Mesh | THREE.Group>,
  config: AdaptiveCameraConfig = {}
) {
  const { camera, controls } = useThree();
  const orbitControlsRef = useRef<any>(controls);
  
  const {
    minDistanceMultiplier = 0.5,
    maxDistanceMultiplier = 8,
    zoomSpeedBase = 0.8
  } = config;

  useEffect(() => {
    if (!meshRef.current || !orbitControlsRef.current) return;

    const mesh = meshRef.current;
    
    // Calculate bounding box and size
    const box = new THREE.Box3().setFromObject(mesh);
    const size = box.getSize(new THREE.Vector3());
    const objectSize = size.length();
    const center = box.getCenter(new THREE.Vector3());

    // Adaptive distance limits based on object size
    const minDistance = Math.max(0.1, objectSize * minDistanceMultiplier);
    const maxDistance = objectSize * maxDistanceMultiplier;
    
    // Logarithmic zoom speed scaling
    // Small objects (< 1): slower zoom (0.3-0.6)
    // Normal objects (1-10): normal zoom (0.8-1.2)
    // Large objects (> 10): faster zoom (1.5-3.0)
    const zoomSpeed = objectSize < 1 
      ? zoomSpeedBase * 0.4
      : objectSize > 10
        ? zoomSpeedBase * Math.log10(objectSize + 1)
        : zoomSpeedBase;

    // Update OrbitControls
    if (orbitControlsRef.current) {
      orbitControlsRef.current.minDistance = minDistance;
      orbitControlsRef.current.maxDistance = maxDistance;
      orbitControlsRef.current.zoomSpeed = zoomSpeed;
      orbitControlsRef.current.target.copy(center);
      orbitControlsRef.current.update();
    }

    console.log('📷 Adaptive camera updated:', {
      objectSize: objectSize.toFixed(2),
      minDistance: minDistance.toFixed(2),
      maxDistance: maxDistance.toFixed(2),
      zoomSpeed: zoomSpeed.toFixed(2),
      center: center.toArray().map(v => v.toFixed(2))
    });

  }, [meshRef, camera, minDistanceMultiplier, maxDistanceMultiplier, zoomSpeedBase]);

  return null;
}
