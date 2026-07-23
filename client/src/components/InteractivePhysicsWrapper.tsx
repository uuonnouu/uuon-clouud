/**
 * INTERACTIVE PHYSICS WRAPPER
 * Wraps any 3D object with interactive physics capabilities
 * Enables drag-and-drop with realistic physics response
 * 
 * © 2025 UUON Foundation Inc.
 */

import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { useInteractivePhysics, InteractivePhysicsConfig } from '../hooks/useInteractivePhysics';

interface InteractivePhysicsWrapperProps {
  children: React.ReactNode;
  materialId?: string;
  config?: Partial<InteractivePhysicsConfig>;
  onStateChange?: (state: {
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    isGrabbed: boolean;
    isSettled: boolean;
  }) => void;
  enabled?: boolean;
}

export interface InteractivePhysicsRef {
  reset: () => void;
  applyImpulse: (force: THREE.Vector3) => void;
  applyTorque: (torque: THREE.Vector3) => void;
  getState: () => {
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    isGrabbed: boolean;
    isSettled: boolean;
  };
}

const InteractivePhysicsWrapper = forwardRef<InteractivePhysicsRef, InteractivePhysicsWrapperProps>(
  ({ children, materialId = 'default', config = {}, onStateChange, enabled = true }, ref) => {
    const groupRef = useRef<THREE.Group>(null);
    
    const { state, handlers, controls, materialProps } = useInteractivePhysics(
      groupRef,
      materialId,
      { ...config, enabled }
    );
    
    useImperativeHandle(ref, () => ({
      reset: controls.reset,
      applyImpulse: controls.applyImpulse,
      applyTorque: controls.applyTorque,
      getState: () => ({
        position: state.position.clone(),
        velocity: state.velocity.clone(),
        isGrabbed: state.isGrabbed,
        isSettled: state.isSettled
      })
    }), [controls, state]);
    
    React.useEffect(() => {
      if (onStateChange) {
        onStateChange({
          position: state.position,
          velocity: state.velocity,
          isGrabbed: state.isGrabbed,
          isSettled: state.isSettled
        });
      }
    }, [state, onStateChange]);
    
    return (
      <group
        ref={groupRef}
        {...handlers}
      >
        {children}
        
        {state.isGrabbed && (
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color="#00ff88" transparent opacity={0.8} />
          </mesh>
        )}
        
        {!state.isSettled && !state.isGrabbed && state.velocity.length() > 0.5 && (
          <arrowHelper
            args={[
              state.velocity.clone().normalize(),
              new THREE.Vector3(0, 0, 0),
              Math.min(state.velocity.length() * 0.1, 2),
              0xff4444,
              0.2,
              0.1
            ]}
          />
        )}
      </group>
    );
  }
);

InteractivePhysicsWrapper.displayName = 'InteractivePhysicsWrapper';

export default InteractivePhysicsWrapper;
