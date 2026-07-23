/**
 * PHYSICS-BASED ANIMATION HOOK
 * 
 * Replaces passive rotation with active physical simulation
 * Each shape demonstrates its underlying scientific principle
 * 
 * © 2025 UUON Foundation Inc.
 */

import { useEffect, useRef, useState } from 'react';
import { SurfaceParameters } from '../types/math';
import {
  PhysicsState,
  PhysicsConfig,
  DEFAULT_PHYSICS_CONFIG,
  detectPhysicsCategory,
  createPhysicsState,
  integrateRK4,
  mapStateToColor
} from '../lib/physicsEngine';
import { getPhysicsSimulator } from '../lib/physicsCategories';

export interface PhysicsAnimationState {
  isActive: boolean;
  physicsState: PhysicsState;
  config: PhysicsConfig;
  category: string;
  visualColor: string; // Hex color based on physics state
}

export function usePhysicsAnimation(
  parameters: SurfaceParameters,
  enabled: boolean = true
) {
  const [animationState, setAnimationState] = useState<PhysicsAnimationState>(() => {
    const category = detectPhysicsCategory(parameters.type);
    const physicsState = createPhysicsState(category);
    
    return {
      isActive: enabled,
      physicsState,
      config: DEFAULT_PHYSICS_CONFIG,
      category,
      visualColor: '#ffffff'
    };
  });
  
  const animationFrameRef = useRef<number>();
  const lastFrameTimeRef = useRef<number>(0);
  
  // Initialize physics on shape type change
  useEffect(() => {
    const category = detectPhysicsCategory(parameters.type);
    const physicsState = createPhysicsState(category);
    
    setAnimationState(prev => ({
      ...prev,
      physicsState,
      category
    }));
  }, [parameters.type]);
  
  // Main physics loop
  useEffect(() => {
    if (!animationState.isActive || animationState.config.pausePhysics) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }
    
    lastFrameTimeRef.current = performance.now();
    
    const animate = (currentTime: number) => {
      if (!animationState.isActive || animationState.config.pausePhysics) {
        return;
      }
      
      const deltaTime = (currentTime - lastFrameTimeRef.current) / 1000;
      lastFrameTimeRef.current = currentTime;
      
      // Get physics simulator for this shape category
      const simulator = getPhysicsSimulator(animationState.category);
      
      // Run physics substeps for stability
      let newState = animationState.physicsState;
      const substepDt = deltaTime / animationState.config.substeps;
      
      for (let i = 0; i < animationState.config.substeps; i++) {
        // Run category-specific physics
        newState = simulator(newState, parameters, animationState.config, substepDt);
        
        // Apply damping
        newState.velocity.multiplyScalar(animationState.config.dampingFactor);
        
        // Integrate using RK4 for smooth motion
        if (animationState.category !== 'static' && animationState.category !== 'attractor') {
          newState = integrateRK4(newState, newState.forces, substepDt);
        }
      }
      
      // Update visual color based on physics state
      const color = mapStateToColor(newState, animationState.config.colorMode);
      const visualColor = '#' + color.getHexString();
      
      setAnimationState(prev => ({
        ...prev,
        physicsState: newState,
        visualColor
      }));
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animationState.isActive, animationState.config, animationState.category, parameters]);
  
  // Control functions
  const togglePhysics = () => {
    setAnimationState(prev => ({
      ...prev,
      isActive: !prev.isActive
    }));
  };
  
  const updateConfig = (newConfig: Partial<PhysicsConfig>) => {
    setAnimationState(prev => ({
      ...prev,
      config: { ...prev.config, ...newConfig }
    }));
  };
  
  const resetPhysics = () => {
    const category = detectPhysicsCategory(parameters.type);
    const physicsState = createPhysicsState(category);
    
    setAnimationState(prev => ({
      ...prev,
      physicsState
    }));
  };
  
  return {
    animationState,
    togglePhysics,
    updateConfig,
    resetPhysics,
    // Physics data accessors for rendering
    getPhysicsData: () => ({
      position: animationState.physicsState.position,
      velocity: animationState.physicsState.velocity,
      energy: animationState.physicsState.energy,
      phase: animationState.physicsState.phase,
      temperature: animationState.physicsState.temperature,
      customData: animationState.physicsState.customData
    })
  };
}

/**
 * Get physics-driven parameter modifiers
 * These are applied as offsets to user parameters without overwriting them
 */
export function getPhysicsModifiers(state: PhysicsAnimationState): Partial<SurfaceParameters> {
  const { physicsState, category } = state;
  
  switch (category) {
    case 'wave': {
      // Wave oscillation affects surface deformation
      const waveData = physicsState.customData.get('wave');
      return {
        e: Math.sin(physicsState.phase) * 0.5,  // Frequency modulation
        f: Math.cos(physicsState.phase * 0.7) * 0.3  // Amplitude variation
      };
    }
    
    case 'molecular': {
      // Thermal vibration affects bond angles
      const molData = physicsState.customData.get('molecular');
      return {
        d: Math.sin(physicsState.time * 2) * 0.2,  // Torsional twist
        e: Math.cos(physicsState.time * 3) * 0.15  // Bond stretching
      };
    }
    
    case 'cellular': {
      // Brownian motion affects position jitter
      const cellData = physicsState.customData.get('cellular');
      return {
        d: physicsState.velocity.x * 0.1,
        e: physicsState.velocity.y * 0.1
      };
    }
    
    case 'attractor': {
      // Trajectory tracing - no parameter modification needed
      // Position is directly updated in physics state
      return {};
    }
    
    case 'anatomical': {
      // Pulsating/contracting motion
      const anatomyData = physicsState.customData.get('anatomical');
      const phase = anatomyData?.contractionPhase || 0;
      const contraction = Math.sin(phase * Math.PI * 2) * 0.3;
      return {
        a: 1 + contraction,  // Radius expansion/contraction
        d: phase * 2  // Peristaltic wave
      };
    }
    
    case 'quantum': {
      // Probability cloud fluctuation
      const quantumData = physicsState.customData.get('quantum');
      return {
        e: Math.sin(physicsState.phase) * quantumData?.probabilityDensity || 0,
        f: Math.cos(physicsState.phase * 1.3) * 0.2
      };
    }
    
    default:
      return {};
  }
}
