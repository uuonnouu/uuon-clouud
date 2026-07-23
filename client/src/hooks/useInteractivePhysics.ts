/**
 * INTERACTIVE PHYSICS HOOK
 * Real-time physics simulation with drag-and-drop manipulation
 * Objects respond to gravity, bounce, and friction based on material properties
 * 
 * © 2025 UUON Foundation Inc.
 */

import { useRef, useState, useCallback, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export interface MaterialPhysicsProperties {
  mass: number;
  restitution: number; // Bounciness (0-1)
  friction: number;    // Surface friction (0-1)
  drag: number;        // Air resistance (0-1)
}

export interface InteractivePhysicsState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  angularVelocity: THREE.Vector3;
  rotation: THREE.Euler;
  isGrabbed: boolean;
  isSettled: boolean;
}

export interface InteractivePhysicsConfig {
  enabled: boolean;
  gravity: number;
  groundLevel: number;
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    minZ: number;
    maxZ: number;
  };
  throwMultiplier: number;
  settleThreshold: number;
}

const DEFAULT_CONFIG: InteractivePhysicsConfig = {
  enabled: true,
  gravity: 9.8,
  groundLevel: -3,
  bounds: {
    minX: -10,
    maxX: 10,
    minY: -5,
    maxY: 10,
    minZ: -10,
    maxZ: 10
  },
  throwMultiplier: 8,
  settleThreshold: 0.01
};

const MATERIAL_PHYSICS: Record<string, MaterialPhysicsProperties> = {
  gold: { mass: 19.3, restitution: 0.2, friction: 0.3, drag: 0.01 },
  silver: { mass: 10.5, restitution: 0.25, friction: 0.35, drag: 0.01 },
  copper: { mass: 8.9, restitution: 0.3, friction: 0.4, drag: 0.01 },
  bronze: { mass: 8.8, restitution: 0.28, friction: 0.38, drag: 0.01 },
  titanium: { mass: 4.5, restitution: 0.35, friction: 0.45, drag: 0.01 },
  diamond: { mass: 3.5, restitution: 0.9, friction: 0.1, drag: 0.005 },
  opal: { mass: 2.1, restitution: 0.4, friction: 0.25, drag: 0.02 },
  ruby: { mass: 4.0, restitution: 0.85, friction: 0.15, drag: 0.008 },
  sapphire: { mass: 4.0, restitution: 0.85, friction: 0.15, drag: 0.008 },
  emerald: { mass: 2.8, restitution: 0.65, friction: 0.2, drag: 0.012 },
  amethyst: { mass: 2.6, restitution: 0.7, friction: 0.22, drag: 0.015 },
  alexandrite: { mass: 3.7, restitution: 0.75, friction: 0.18, drag: 0.01 },
  plasma: { mass: 0.001, restitution: 0.95, friction: 0.01, drag: 0.001 },
  lightning: { mass: 0.001, restitution: 0.99, friction: 0.005, drag: 0.0 },
  neon: { mass: 0.01, restitution: 0.8, friction: 0.05, drag: 0.002 },
  aurora: { mass: 0.005, restitution: 0.85, friction: 0.02, drag: 0.001 },
  wood: { mass: 0.7, restitution: 0.3, friction: 0.6, drag: 0.05 },
  marble: { mass: 2.7, restitution: 0.4, friction: 0.4, drag: 0.02 },
  granite: { mass: 2.75, restitution: 0.35, friction: 0.5, drag: 0.02 },
  leather: { mass: 0.9, restitution: 0.2, friction: 0.7, drag: 0.08 },
  voronoi: { mass: 1.0, restitution: 0.5, friction: 0.4, drag: 0.03 },
  perlin: { mass: 1.0, restitution: 0.5, friction: 0.4, drag: 0.03 },
  fractal: { mass: 0.8, restitution: 0.6, friction: 0.35, drag: 0.025 },
  hexagonal: { mass: 1.2, restitution: 0.45, friction: 0.42, drag: 0.028 },
  truchet: { mass: 1.1, restitution: 0.48, friction: 0.38, drag: 0.026 },
  cellular: { mass: 0.9, restitution: 0.55, friction: 0.36, drag: 0.024 },
  mandelbrot: { mass: 0.7, restitution: 0.65, friction: 0.3, drag: 0.02 },
  fibonacci: { mass: 1.0, restitution: 0.5, friction: 0.4, drag: 0.03 },
  penrose: { mass: 1.1, restitution: 0.52, friction: 0.42, drag: 0.028 },
  delaunay: { mass: 1.0, restitution: 0.5, friction: 0.4, drag: 0.03 },
  default: { mass: 1.0, restitution: 0.5, friction: 0.4, drag: 0.03 }
};

export function getMaterialPhysics(materialId: string): MaterialPhysicsProperties {
  return MATERIAL_PHYSICS[materialId.toLowerCase()] || MATERIAL_PHYSICS.default;
}

export function useInteractivePhysics(
  meshRef: React.RefObject<THREE.Mesh | THREE.Group>,
  materialId: string = 'default',
  config: Partial<InteractivePhysicsConfig> = {}
) {
  const { camera, gl, size } = useThree();
  const fullConfig = { ...DEFAULT_CONFIG, ...config };
  
  const [state, setState] = useState<InteractivePhysicsState>({
    position: new THREE.Vector3(0, 0, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    angularVelocity: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Euler(0, 0, 0),
    isGrabbed: false,
    isSettled: true
  });
  
  const dragStartRef = useRef<THREE.Vector3 | null>(null);
  const previousPositionRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const previousTimeRef = useRef<number>(0);
  const velocityHistoryRef = useRef<THREE.Vector3[]>([]);
  const materialProps = getMaterialPhysics(materialId);
  
  const getPointerPosition = useCallback((event: PointerEvent): THREE.Vector3 => {
    const rect = gl.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    const vector = new THREE.Vector3(x, y, 0.5);
    vector.unproject(camera);
    
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    return camera.position.clone().add(dir.multiplyScalar(distance));
  }, [camera, gl, size]);
  
  const handlePointerDown = useCallback((event: THREE.Event) => {
    if (!fullConfig.enabled || !meshRef.current) return;
    
    const pointerEvent = event as unknown as { nativeEvent: PointerEvent };
    const worldPos = getPointerPosition(pointerEvent.nativeEvent);
    
    dragStartRef.current = worldPos.clone();
    previousPositionRef.current = worldPos.clone();
    previousTimeRef.current = performance.now();
    velocityHistoryRef.current = [];
    
    setState(prev => ({
      ...prev,
      isGrabbed: true,
      isSettled: false,
      velocity: new THREE.Vector3(0, 0, 0)
    }));
  }, [fullConfig.enabled, meshRef, getPointerPosition]);
  
  const handlePointerMove = useCallback((event: THREE.Event) => {
    if (!state.isGrabbed || !meshRef.current || !dragStartRef.current) return;
    
    const pointerEvent = event as unknown as { nativeEvent: PointerEvent };
    const worldPos = getPointerPosition(pointerEvent.nativeEvent);
    const currentTime = performance.now();
    const dt = (currentTime - previousTimeRef.current) / 1000;
    
    if (dt > 0) {
      const instantVelocity = worldPos.clone().sub(previousPositionRef.current).divideScalar(dt);
      velocityHistoryRef.current.push(instantVelocity);
      if (velocityHistoryRef.current.length > 5) {
        velocityHistoryRef.current.shift();
      }
    }
    
    meshRef.current.position.copy(worldPos);
    previousPositionRef.current = worldPos.clone();
    previousTimeRef.current = currentTime;
    
    setState(prev => ({
      ...prev,
      position: worldPos.clone()
    }));
  }, [state.isGrabbed, meshRef, getPointerPosition]);
  
  const handlePointerUp = useCallback(() => {
    if (!state.isGrabbed || !meshRef.current) return;
    
    let releaseVelocity = new THREE.Vector3(0, 0, 0);
    if (velocityHistoryRef.current.length > 0) {
      releaseVelocity = velocityHistoryRef.current.reduce(
        (acc, v) => acc.add(v),
        new THREE.Vector3(0, 0, 0)
      ).divideScalar(velocityHistoryRef.current.length);
      releaseVelocity.multiplyScalar(fullConfig.throwMultiplier);
      releaseVelocity.clampLength(0, 50);
    }
    
    dragStartRef.current = null;
    velocityHistoryRef.current = [];
    
    setState(prev => ({
      ...prev,
      isGrabbed: false,
      velocity: releaseVelocity
    }));
  }, [state.isGrabbed, meshRef, fullConfig.throwMultiplier]);
  
  useFrame((_, delta) => {
    if (!fullConfig.enabled || !meshRef.current || state.isGrabbed) return;
    
    const dt = Math.min(delta, 0.033);
    
    if (state.isSettled) return;
    
    let newVelocity = state.velocity.clone();
    let newAngularVelocity = state.angularVelocity.clone();
    let newPosition = meshRef.current.position.clone();
    let newRotation = meshRef.current.rotation.clone();
    let settled = false;
    
    newVelocity.y -= fullConfig.gravity * dt * materialProps.mass * 0.1;
    newVelocity.multiplyScalar(1 - materialProps.drag);
    newPosition.add(newVelocity.clone().multiplyScalar(dt));
    
    const { bounds, groundLevel } = fullConfig;
    
    if (newPosition.y <= groundLevel) {
      newPosition.y = groundLevel;
      
      if (Math.abs(newVelocity.y) > 0.5) {
        newVelocity.y = -newVelocity.y * materialProps.restitution;
        newAngularVelocity.x += newVelocity.x * 0.5;
        newAngularVelocity.z += newVelocity.z * 0.5;
      } else {
        newVelocity.y = 0;
      }
      
      newVelocity.x *= (1 - materialProps.friction);
      newVelocity.z *= (1 - materialProps.friction);
    }
    
    if (newPosition.x < bounds.minX) {
      newPosition.x = bounds.minX;
      newVelocity.x = -newVelocity.x * materialProps.restitution;
    } else if (newPosition.x > bounds.maxX) {
      newPosition.x = bounds.maxX;
      newVelocity.x = -newVelocity.x * materialProps.restitution;
    }
    
    if (newPosition.z < bounds.minZ) {
      newPosition.z = bounds.minZ;
      newVelocity.z = -newVelocity.z * materialProps.restitution;
    } else if (newPosition.z > bounds.maxZ) {
      newPosition.z = bounds.maxZ;
      newVelocity.z = -newVelocity.z * materialProps.restitution;
    }
    
    if (newPosition.y > bounds.maxY) {
      newPosition.y = bounds.maxY;
      newVelocity.y = -newVelocity.y * materialProps.restitution * 0.5;
    }
    
    newAngularVelocity.multiplyScalar(0.98);
    newRotation.x += newAngularVelocity.x * dt;
    newRotation.y += newAngularVelocity.y * dt;
    newRotation.z += newAngularVelocity.z * dt;
    
    if (
      newVelocity.length() < fullConfig.settleThreshold &&
      newAngularVelocity.length() < fullConfig.settleThreshold &&
      Math.abs(newPosition.y - groundLevel) < 0.01
    ) {
      settled = true;
      newVelocity.set(0, 0, 0);
      newAngularVelocity.set(0, 0, 0);
    }
    
    meshRef.current.position.copy(newPosition);
    meshRef.current.rotation.copy(newRotation);
    
    setState({
      position: newPosition,
      velocity: newVelocity,
      angularVelocity: newAngularVelocity,
      rotation: newRotation,
      isGrabbed: false,
      isSettled: settled
    });
  });
  
  const reset = useCallback(() => {
    if (!meshRef.current) return;
    
    meshRef.current.position.set(0, 0, 0);
    meshRef.current.rotation.set(0, 0, 0);
    
    setState({
      position: new THREE.Vector3(0, 0, 0),
      velocity: new THREE.Vector3(0, 0, 0),
      angularVelocity: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Euler(0, 0, 0),
      isGrabbed: false,
      isSettled: true
    });
  }, [meshRef]);
  
  const applyImpulse = useCallback((force: THREE.Vector3) => {
    setState(prev => ({
      ...prev,
      velocity: prev.velocity.clone().add(force.divideScalar(materialProps.mass)),
      isSettled: false
    }));
  }, [materialProps.mass]);
  
  const applyTorque = useCallback((torque: THREE.Vector3) => {
    setState(prev => ({
      ...prev,
      angularVelocity: prev.angularVelocity.clone().add(torque),
      isSettled: false
    }));
  }, []);
  
  return {
    state,
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerLeave: handlePointerUp
    },
    controls: {
      reset,
      applyImpulse,
      applyTorque
    },
    materialProps
  };
}

export default useInteractivePhysics;
