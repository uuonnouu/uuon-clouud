/**
 * Shape Animation Demo Component
 * 
 * Demonstrates how shapes move in 3D space based on their
 * physical properties (moment of inertia, principal axes, stability).
 * 
 * NOT an export - a live demonstration on the canvas showing
 * physics-based rotation and movement.
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { computeShapeDynamics, type ShapeDynamicsResult } from '../lib/shapeDynamicsEngine';

interface ShapeAnimationDemoProps {
  geometry: THREE.BufferGeometry | null;
  isAnimating: boolean;
  animationType: 'spin' | 'precession' | 'tumble' | 'stable' | 'gyroscope';
  angularVelocity: number;
}

interface AnimationState {
  rotation: THREE.Euler;
  angularMomentum: THREE.Vector3;
  principalMoments: [number, number, number];
  principalAxes: [THREE.Vector3, THREE.Vector3, THREE.Vector3];
  stabilityIndex: number;
  gyroscopicRatio: number;
  optimalSpinAxis: THREE.Vector3;
}

export function useShapeAnimation(
  geometry: THREE.BufferGeometry | null,
  meshRef: React.RefObject<THREE.Mesh>,
  isAnimating: boolean,
  animationType: 'spin' | 'precession' | 'tumble' | 'stable' | 'gyroscope' = 'spin',
  angularVelocity: number = 1
) {
  const animationState = useRef<AnimationState>({
    rotation: new THREE.Euler(),
    angularMomentum: new THREE.Vector3(0, 1, 0),
    principalMoments: [1, 1, 1],
    principalAxes: [
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 1)
    ],
    stabilityIndex: 1,
    gyroscopicRatio: 1,
    optimalSpinAxis: new THREE.Vector3(0, 1, 0)
  });

  const timeRef = useRef(0);

  useEffect(() => {
    if (!geometry) return;

    try {
      const dynamics = computeShapeDynamics(geometry, 1000, 1);
      
      const { Ixx, Iyy, Izz, Ixy, Ixz, Iyz } = dynamics.momentOfInertia;
      const moments: [number, number, number] = [
        Math.abs(Ixx) || 1,
        Math.abs(Iyy) || 1,
        Math.abs(Izz) || 1
      ].sort((a, b) => a - b) as [number, number, number];

      const [I1, I2, I3] = moments;
      const stabilityIndex = I2 > 0.001 ? (I3 - I1) / I2 : 0;
      const gyroscopicRatio = I1 > 0.001 ? I3 / I1 : 1;

      let optimalAxis = new THREE.Vector3(0, 1, 0);
      const minMomentIndex = [Ixx, Iyy, Izz].indexOf(Math.min(Ixx, Iyy, Izz));
      if (minMomentIndex === 0) optimalAxis = new THREE.Vector3(1, 0, 0);
      else if (minMomentIndex === 2) optimalAxis = new THREE.Vector3(0, 0, 1);

      animationState.current = {
        ...animationState.current,
        principalMoments: moments,
        stabilityIndex,
        gyroscopicRatio,
        optimalSpinAxis: optimalAxis
      };
    } catch (error) {
      console.warn('Animation dynamics computation failed:', error);
    }
  }, [geometry]);

  useFrame((state, delta) => {
    if (!isAnimating || !meshRef.current) return;

    timeRef.current += delta;
    const t = timeRef.current;
    const omega = angularVelocity;
    const { principalMoments, stabilityIndex, gyroscopicRatio, optimalSpinAxis } = animationState.current;
    const [I1, I2, I3] = principalMoments;

    switch (animationType) {
      case 'spin':
        meshRef.current.rotation.x = optimalSpinAxis.x * omega * t;
        meshRef.current.rotation.y = optimalSpinAxis.y * omega * t;
        meshRef.current.rotation.z = optimalSpinAxis.z * omega * t;
        break;

      case 'precession':
        const precessionRate = omega * 0.3;
        const nutationRate = omega * (1 + stabilityIndex * 0.5);
        const tiltAngle = 0.3 + stabilityIndex * 0.2;
        
        meshRef.current.rotation.x = Math.sin(t * precessionRate) * tiltAngle;
        meshRef.current.rotation.y = t * nutationRate;
        meshRef.current.rotation.z = Math.cos(t * precessionRate) * tiltAngle;
        break;

      case 'tumble':
        const tumbleScale = 1 / (gyroscopicRatio + 0.1);
        meshRef.current.rotation.x = t * omega * tumbleScale * 0.7;
        meshRef.current.rotation.y = t * omega * tumbleScale * 1.1;
        meshRef.current.rotation.z = t * omega * tumbleScale * 0.5;
        break;

      case 'stable':
        const wobbleAmount = Math.max(0.01, 0.1 - stabilityIndex * 0.08);
        meshRef.current.rotation.x = Math.sin(t * omega * 3) * wobbleAmount;
        meshRef.current.rotation.y = t * omega;
        meshRef.current.rotation.z = Math.cos(t * omega * 3) * wobbleAmount;
        break;

      case 'gyroscope':
        const gyroStability = Math.min(1, gyroscopicRatio / 3);
        const torqueEffect = (1 - gyroStability) * 0.3;
        
        meshRef.current.rotation.x = Math.sin(t * omega * 0.5) * torqueEffect;
        meshRef.current.rotation.y = t * omega * (1 + gyroStability);
        meshRef.current.rotation.z = Math.cos(t * omega * 0.5) * torqueEffect * 0.5;
        break;
    }
  });

  return {
    animationState: animationState.current,
    reset: () => {
      timeRef.current = 0;
      if (meshRef.current) {
        meshRef.current.rotation.set(0, 0, 0);
      }
    }
  };
}

interface AnimationControlButtonProps {
  isAnimating: boolean;
  onToggle: () => void;
  animationType: string;
  onTypeChange: (type: 'spin' | 'precession' | 'tumble' | 'stable' | 'gyroscope') => void;
  angularVelocity: number;
  onVelocityChange: (velocity: number) => void;
}

export function AnimationControlButton({
  isAnimating,
  onToggle,
  animationType,
  onTypeChange,
  angularVelocity,
  onVelocityChange
}: AnimationControlButtonProps) {
  const [showControls, setShowControls] = useState(false);

  const animationTypes = [
    { id: 'spin', label: 'Wave Unfold', icon: '🌊', desc: 'Micro→Macro with wave dynamics' },
    { id: 'precession', label: 'Fluid Flow', icon: '💧', desc: 'Vortex flow with viscosity' },
    { id: 'tumble', label: 'Turbulence', icon: '🌀', desc: 'Chaotic multi-frequency waves' },
    { id: 'stable', label: 'Breathing', icon: '💫', desc: 'Harmonic expansion/contraction' },
    { id: 'gyroscope', label: 'Full Domain', icon: '🔮', desc: 'Point→Micro→Meso→Macro traverse' }
  ] as const;

  return (
    <div className="relative">
      <button
        onClick={() => setShowControls(!showControls)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          isAnimating
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
        }`}
        title="Physics Animation Demo"
      >
        <span className="text-lg">{isAnimating ? '⏸️' : '▶️'}</span>
        <span>🎬 Animate</span>
      </button>

      {showControls && (
        <div className="absolute bottom-full left-0 mb-2 w-72 bg-gray-900 border border-purple-500/30 rounded-xl shadow-xl p-4 z-50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-semibold text-sm">Physics Animation Demo</h4>
            <button
              onClick={() => setShowControls(false)}
              className="text-gray-400 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>

          <div className="mb-3">
            <label className="text-xs text-gray-400 uppercase tracking-wide mb-1 block">
              Animation Type
            </label>
            <div className="grid grid-cols-1 gap-1">
              {animationTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => onTypeChange(type.id)}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${
                    animationType === type.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <span>{type.icon}</span>
                  <span className="font-medium">{type.label}</span>
                  <span className="text-gray-400 ml-auto text-[10px]">{type.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="text-xs text-gray-400 uppercase tracking-wide mb-1 block">
              Angular Velocity: {angularVelocity.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={angularVelocity}
              onChange={(e) => onVelocityChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <button
            onClick={onToggle}
            className={`w-full py-2 rounded-lg font-medium transition-colors ${
              isAnimating
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isAnimating ? '⏹️ Stop Animation' : '▶️ Start Animation'}
          </button>

          <p className="text-[10px] text-gray-500 mt-2 text-center">
            Demonstrates physics-based movement using computed inertia tensor
          </p>
        </div>
      )}
    </div>
  );
}

export default {
  useShapeAnimation,
  AnimationControlButton
};
