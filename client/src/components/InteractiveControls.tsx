import React, { useRef, useState, useCallback } from 'react';
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

// Import necessary modules for enhanced protection
import { SurfaceParameters } from '../types/math';
import { getCleanSurface } from '../lib/cleanMathEngine';
import { protectionEngine } from '../lib/antiReverseEngineering';

interface InteractiveControlsProps {
  children: React.ReactNode;
  enablePivoting?: boolean;
  enableRotation?: boolean;
  enableScaling?: boolean;
  onTransformChange?: (transform: {
    position: THREE.Vector3;
    rotation: THREE.Euler;
    scale: THREE.Vector3;
  }) => void;
}

export default function InteractiveControls({
  children,
  enablePivoting = true,
  enableRotation = true,
  enableScaling = true,
  onTransformChange
}: InteractiveControlsProps) {
  const meshRef = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastPointer, setLastPointer] = useState({ x: 0, y: 0 });
  const [pivotPoint] = useState(new THREE.Vector3(0, 0, 0));
  const [lastClickTime, setLastClickTime] = useState(0);
  const [isResetting, setIsResetting] = useState(false);

  // Track transform state using quaternions for smooth rotation
  const [position, setPosition] = useState(new THREE.Vector3(0, 0, 0));
  const [quaternion, setQuaternion] = useState(new THREE.Quaternion());
  const [scale, setScale] = useState(new THREE.Vector3(1, 1, 1));

  // Store initial transform state for reset
  const initialPosition = new THREE.Vector3(0, 0, 0);
  const initialQuaternion = new THREE.Quaternion();
  const initialScale = new THREE.Vector3(1, 1, 1);

  // Reset transform to initial state
  const resetTransform = useCallback(() => {
    if (!meshRef.current) return;

    setIsResetting(true);

    meshRef.current.position.copy(initialPosition);
    meshRef.current.quaternion.copy(initialQuaternion);
    meshRef.current.scale.copy(initialScale);

    setPosition(initialPosition.clone());
    setQuaternion(initialQuaternion.clone());
    setScale(initialScale.clone());

    // Hide reset indicator after 500ms
    setTimeout(() => setIsResetting(false), 500);
  }, []);

  // Handle pointer down with double-click detection (drag disabled)
  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();

    const currentTime = Date.now();
    const timeDiff = currentTime - lastClickTime;

    // Double-click detection (within 400ms for better precision)
    if (timeDiff < 400 && timeDiff > 50) {
      resetTransform();
      setLastClickTime(0); // Reset to prevent triple-click issues
      return;
    }

    setLastClickTime(currentTime);
    // Drag functionality disabled
    // setIsDragging(true);
    // setDragStart({ x: e.clientX, y: e.clientY });
    // setLastPointer({ x: e.clientX, y: e.clientY });
  }, [lastClickTime, resetTransform]);

  // Handle pointer move (drag disabled)
  const handlePointerMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    // Drag functionality disabled
    // if (!isDragging || !meshRef.current) return;
    e.stopPropagation();

    const deltaX = (e.clientX - lastPointer.x) * 0.01;
    const deltaY = (e.clientY - lastPointer.y) * 0.01;

    if (enablePivoting && e.buttons === 1 && !e.shiftKey && !e.altKey && !e.ctrlKey) {
      // Left mouse button - pivotal movement around center using quaternions
      const yQuaternion = new THREE.Quaternion();
      const xQuaternion = new THREE.Quaternion();
      const xAxis = new THREE.Vector3(1, 0, 0);
      const yAxis = new THREE.Vector3(0, 1, 0);

      // Create incremental rotations
      yQuaternion.setFromAxisAngle(yAxis, deltaX);
      xQuaternion.setFromAxisAngle(xAxis, deltaY);

      // Apply rotations to current quaternion
      const newQuaternion = quaternion.clone();
      newQuaternion.multiplyQuaternions(yQuaternion, newQuaternion);
      newQuaternion.multiplyQuaternions(xQuaternion, newQuaternion);
      newQuaternion.normalize();

      setQuaternion(newQuaternion);
      meshRef.current.quaternion.copy(newQuaternion);
    } 
    else if (enableRotation && e.buttons === 1 && e.shiftKey) {
      // Shift + left mouse - free rotation around Z axis
      const zQuaternion = new THREE.Quaternion();
      const zAxis = new THREE.Vector3(0, 0, 1);

      zQuaternion.setFromAxisAngle(zAxis, deltaX);

      const newQuaternion = quaternion.clone();
      newQuaternion.multiplyQuaternions(zQuaternion, newQuaternion);
      newQuaternion.normalize();

      setQuaternion(newQuaternion);
      meshRef.current.quaternion.copy(newQuaternion);
    }
    else if (enablePivoting && e.buttons === 2) {
      // Right mouse button - translation
      meshRef.current.position.x += deltaX;
      meshRef.current.position.y -= deltaY;

      setPosition(meshRef.current.position.clone());
    }

    setLastPointer({ x: e.clientX, y: e.clientY });
  }, [isDragging, lastPointer, enablePivoting, enableRotation, quaternion]); // Added quaternion dependency

  // Handle pointer up
  const handlePointerUp = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  // Handle wheel for scaling
  const handleWheel = useCallback((e: ThreeEvent<WheelEvent>) => {
    if (!meshRef.current || !enableScaling) return;
    e.stopPropagation();

    const scaleFactor = e.deltaY > 0 ? 0.85 : 1.15; // Increased sensitivity
    const newScale = scale.clone().multiplyScalar(scaleFactor);

    // Clamp scale to reasonable limits
    newScale.clampScalar(0.1, 10);
    setScale(newScale);

    meshRef.current.scale.copy(newScale);
  }, [enableScaling, scale]);

  // Update transform callback
  useFrame(() => {
    if (onTransformChange && meshRef.current) {
      onTransformChange({
        position: meshRef.current.position,
        rotation: meshRef.current.rotation,
        scale: meshRef.current.scale
      });
    }
  });

  return (
    <group
      ref={meshRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
    >
      {children}

      {/* Visual indicators for interaction - drag disabled */}
      {false && (
        <>
          {/* Pivot point indicator */}
          <mesh position={pivotPoint}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#ff6b6b" transparent opacity={0.7} />
          </mesh>

          {/* Rotation rings */}
          <group>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[2, 0.02, 8, 32]} />
              <meshBasicMaterial color="#4ecdc4" transparent opacity={0.3} />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[2, 0.02, 8, 32]} />
              <meshBasicMaterial color="#45b7d1" transparent opacity={0.3} />
            </mesh>
            <mesh>
              <torusGeometry args={[2, 0.02, 8, 32]} />
              <meshBasicMaterial color="#f9ca24" transparent opacity={0.3} />
            </mesh>
          </group>
        </>
      )}

      {/* Reset indicator - Enhanced visibility */}
      {isResetting && (
        <group>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.2, 20, 20]} />
            <meshBasicMaterial color="#00ff00" transparent opacity={0.9} />
          </mesh>
          {/* Pulsing ring for better visibility */}
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.3, 0.02, 8, 16]} />
            <meshBasicMaterial color="#00ff00" transparent opacity={0.6} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[0.25, 0.02, 8, 16]} />
            <meshBasicMaterial color="#00ff00" transparent opacity={0.6} />
          </mesh>
        </group>
      )}
    </group>
  );
}