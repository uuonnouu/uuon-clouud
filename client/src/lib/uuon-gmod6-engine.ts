
/**
 * UUON G MOD 6 MATHEMATICAL ENGINE
 * Modulo-6 based mathematical patterns and cycles for enhanced geometric visualization
 * © 2024 UUON Foundation Inc. All Rights Reserved.
 */

import * as THREE from 'three';
import { SurfaceParameters } from '../types/math';

export interface GMod6State {
  id: number; // 0, 1, 2, 3, 4, 5
  name: string;
  phase: number; // 0 to 2π radians
  hexDirection: THREE.Vector3;
  colorValue: THREE.Color;
}

export interface GMod6Config {
  cycleSpeed: number;
  amplitudeFactor: number;
  phaseOffset: number;
  enableHexGeometry: boolean;
  enableColorCycling: boolean;
  enableRotationalSymmetry: boolean;
}

/**
 * Core G Mod 6 Engine - Creates six-state looping systems
 */
export class UUONGMod6Engine {
  private states: GMod6State[];
  private currentTime: number = 0;
  
  constructor() {
    this.states = this.initializeStates();
  }

  private initializeStates(): GMod6State[] {
    const states: GMod6State[] = [];
    
    for (let i = 0; i < 6; i++) {
      const phase = (i * Math.PI) / 3; // 60-degree increments
      const hexDirection = new THREE.Vector3(
        Math.cos(phase),
        Math.sin(phase),
        0
      );
      
      // Six distinct colors cycling through hue spectrum
      const hue = i / 6;
      const colorValue = new THREE.Color().setHSL(hue, 0.8, 0.6);
      
      states.push({
        id: i,
        name: `State_${i}`,
        phase: phase,
        hexDirection: hexDirection,
        colorValue: colorValue
      });
    }
    
    return states;
  }

  /**
   * Get current state based on g value
   */
  getCurrentState(g: number): GMod6State {
    const stateIndex = Math.floor(g) % 6;
    return this.states[stateIndex];
  }

  /**
   * Get smooth interpolation between states
   */
  getInterpolatedState(g: number): {
    primaryState: GMod6State;
    secondaryState: GMod6State;
    interpolationFactor: number;
  } {
    const primaryIndex = Math.floor(g) % 6;
    const secondaryIndex = (primaryIndex + 1) % 6;
    const interpolationFactor = g - Math.floor(g);
    
    return {
      primaryState: this.states[primaryIndex],
      secondaryState: this.states[secondaryIndex],
      interpolationFactor
    };
  }

  /**
   * Generate modulo-6 enhanced surface parameters
   */
  enhanceParametersWithGMod6(
    baseParams: SurfaceParameters, 
    config: GMod6Config
  ): SurfaceParameters {
    const enhanced = { ...baseParams };
    
    // Apply G Mod 6 cycling to key parameters
    const gValue = enhanced.g || 1;
    const currentState = this.getCurrentState(gValue * config.cycleSpeed + config.phaseOffset);
    
    if (config.enableHexGeometry) {
      // Apply hexagonal geometry influences
      enhanced.h = (enhanced.h || 4) + currentState.hexDirection.x * config.amplitudeFactor;
      enhanced.i = (enhanced.i || 1) + currentState.hexDirection.y * config.amplitudeFactor;
    }
    
    if (config.enableRotationalSymmetry) {
      // Apply 60-degree rotational symmetry
      enhanced.r = currentState.phase;
    }
    
    if (config.enableColorCycling) {
      // Enhance color parameters based on state
      enhanced.colorPhase = currentState.id / 6;
    }
    
    return enhanced;
  }

  /**
   * Update engine time for animations
   */
  updateTime(deltaTime: number): void {
    this.currentTime += deltaTime;
  }

  /**
   * Get time-based G value for continuous cycling
   */
  getTimeBasedG(frequency: number = 1): number {
    return (this.currentTime * frequency) % 6;
  }
}

/**
 * G MOD 6 SURFACE IMPLEMENTATIONS
 * Mathematical surfaces that leverage modulo-6 behavior
 */

export const GMOD6_SURFACES = {
  uuon_hexagonal_wave: {
    name: 'UUON Hexagonal Wave',
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const g = params.g ?? 1;
      const state = Math.floor(g) % 6;
      const phase = (state * Math.PI) / 3;
      
      const hexRadius = params.a ?? 2;
      const waveAmplitude = params.b ?? 1;
      
      // Hexagonal base with modulo-6 wave patterns
      const hexX = hexRadius * Math.cos(u + phase);
      const hexY = hexRadius * Math.sin(u + phase);
      const hexZ = waveAmplitude * Math.sin(6 * v + state * Math.PI / 3);
      
      return [hexX, hexY, hexZ];
    }
  },

  uuon_sixphase_cycle: {
    name: 'UUON Six-Phase Cycle',
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const g = params.g ?? 1;
      const state = Math.floor(g) % 6;
      const interpolation = g - Math.floor(g);
      
      const radius = params.a ?? 2;
      const height = params.b ?? 1;
      
      // Six-phase breathing/pulsing surface
      const phaseMultiplier = 1 + 0.3 * Math.sin(state * Math.PI / 3 + interpolation * Math.PI / 3);
      
      const x = radius * phaseMultiplier * Math.cos(u) * Math.sin(v);
      const y = radius * phaseMultiplier * Math.sin(u) * Math.sin(v);
      const z = height * phaseMultiplier * Math.cos(v);
      
      return [x, y, z];
    }
  },

  uuon_rotational_symmetry: {
    name: 'UUON Rotational Symmetry',
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const g = params.g ?? 1;
      const state = Math.floor(g) % 6;
      const rotationPhase = (state * Math.PI) / 3;
      
      const radius = params.a ?? 2;
      const twist = params.c ?? 1;
      
      // Apply 60-degree rotational symmetry
      const rotatedU = u + rotationPhase;
      const symmetryFactor = Math.cos(6 * rotatedU) * 0.2 + 1;
      
      const x = radius * symmetryFactor * Math.cos(rotatedU) * Math.sin(v);
      const y = radius * symmetryFactor * Math.sin(rotatedU) * Math.sin(v);
      const z = twist * Math.sin(6 * v + rotationPhase);
      
      return [x, y, z];
    }
  },

  uuon_topology_selector: {
    name: 'UUON Topology Selector',
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const g = params.g ?? 1;
      const state = Math.floor(g) % 6;
      const blend = g - Math.floor(g);
      
      const scale = params.a ?? 2;
      
      // Six different topologies based on state
      let x, y, z;
      
      switch (state) {
        case 0: // Sphere
          x = scale * Math.cos(u) * Math.sin(v);
          y = scale * Math.sin(u) * Math.sin(v);
          z = scale * Math.cos(v);
          break;
        case 1: // Cube (approximation)
          x = scale * Math.sign(Math.cos(u)) * Math.pow(Math.abs(Math.cos(u)), 0.5);
          y = scale * Math.sign(Math.sin(u)) * Math.pow(Math.abs(Math.sin(u)), 0.5);
          z = scale * Math.sign(Math.cos(v)) * Math.pow(Math.abs(Math.cos(v)), 0.5);
          break;
        case 2: // Cylinder
          x = scale * Math.cos(u);
          y = scale * Math.sin(u);
          z = scale * (v - 0.5) * 2;
          break;
        case 3: // Torus
          const R = scale * 0.8;
          const r = scale * 0.3;
          x = (R + r * Math.cos(v)) * Math.cos(u);
          y = (R + r * Math.cos(v)) * Math.sin(u);
          z = r * Math.sin(v);
          break;
        case 4: // Plane wave
          x = scale * (u - 0.5) * 2;
          y = scale * (v - 0.5) * 2;
          z = scale * 0.3 * Math.sin(4 * u) * Math.sin(4 * v);
          break;
        case 5: // Tetrahedron (approximation)
          const t = Math.sin(u * 2 * Math.PI) * Math.sin(v * Math.PI);
          x = scale * t * Math.cos(u * 2 * Math.PI);
          y = scale * t * Math.sin(u * 2 * Math.PI);
          z = scale * Math.cos(v * Math.PI);
          break;
        default:
          x = y = z = 0;
      }
      
      return [x, y, z];
    }
  },

  uuon_hexagonal_lattice: {
    name: 'UUON Hexagonal Lattice',
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const g = params.g ?? 1;
      const state = Math.floor(g) % 6;
      const phase = (state * Math.PI) / 3;
      
      const latticeSize = params.a ?? 2;
      const elevation = params.b ?? 1;
      
      // Hexagonal lattice with modulo-6 elevation pattern
      const hexU = u * 6; // Scale for lattice
      const hexV = v * 6;
      
      const latticeX = latticeSize * (hexU + 0.5 * hexV);
      const latticeY = latticeSize * (Math.sqrt(3) / 2 * hexV);
      
      // Elevation based on hexagonal pattern and G state
      const hexPattern = Math.cos(latticeX + phase) + Math.cos(latticeY + phase) + 
                        Math.cos(-latticeX + latticeY + phase);
      const latticeZ = elevation * hexPattern / 3;
      
      return [latticeX, latticeY, latticeZ];
    }
  },

  uuon_pattern_generator: {
    name: 'UUON Pattern Generator',
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const g = params.g ?? 1;
      const state = Math.floor(g) % 6;
      
      const patternScale = params.a ?? 2;
      const complexity = params.c ?? 1;
      
      // Generate repeating patterns based on modulo-6
      const patternU = u * (state + 1) * complexity;
      const patternV = v * (state + 1) * complexity;
      
      const pattern1 = Math.sin(patternU) * Math.cos(patternV);
      const pattern2 = Math.cos(patternU + Math.PI/3) * Math.sin(patternV + Math.PI/3);
      const pattern3 = Math.sin(patternU + 2*Math.PI/3) * Math.cos(patternV + 2*Math.PI/3);
      
      const x = patternScale * (u - 0.5) * 2;
      const y = patternScale * (v - 0.5) * 2;
      const z = patternScale * 0.3 * (pattern1 + pattern2 + pattern3) / 3;
      
      return [x, y, z];
    }
  }
};

/**
 * G MOD 6 ANIMATION SYSTEM
 */
export class GMod6AnimationSystem {
  private engine: UUONGMod6Engine;
  private animationSpeed: number;
  
  constructor(engine: UUONGMod6Engine, speed: number = 1) {
    this.engine = engine;
    this.animationSpeed = speed;
  }

  /**
   * Generate animation keyframes based on G Mod 6 cycle
   */
  generateKeyframes(baseParams: SurfaceParameters): Array<{ time: number, parameters: SurfaceParameters }> {
    const keyframes = [];
    
    for (let i = 0; i < 6; i++) {
      const time = i / 6; // 0 to 1 over 6 states
      const g = i;
      
      const params = { ...baseParams, g };
      const state = this.engine.getCurrentState(g);
      
      // Apply state-specific parameter modifications
      params.h = (params.h ?? 4) + state.hexDirection.x * 0.5;
      params.i = (params.i ?? 1) + state.hexDirection.y * 0.5;
      params.j = (params.j ?? 0.7) + state.phase / (2 * Math.PI) * 0.3;
      
      keyframes.push({ time, parameters: params });
    }
    
    return keyframes;
  }

  /**
   * Get current animation parameters based on time
   */
  getAnimationParameters(
    baseParams: SurfaceParameters, 
    currentTime: number
  ): SurfaceParameters {
    const g = (currentTime * this.animationSpeed) % 6;
    const interpolated = this.engine.getInterpolatedState(g);
    
    const params = { ...baseParams };
    
    // Smooth interpolation between states
    const factor = interpolated.interpolationFactor;
    const primary = interpolated.primaryState;
    const secondary = interpolated.secondaryState;
    
    params.g = g;
    params.h = (params.h ?? 4) + 
      (primary.hexDirection.x * (1 - factor) + secondary.hexDirection.x * factor) * 0.5;
    params.i = (params.i ?? 1) + 
      (primary.hexDirection.y * (1 - factor) + secondary.hexDirection.y * factor) * 0.5;
    
    return params;
  }
}

// Export the engine instance for global use
export const gmod6Engine = new UUONGMod6Engine();
export const gmod6Animator = new GMod6AnimationSystem(gmod6Engine);

/**
 * Integration with existing UUON system
 */
export function integrateGMod6WithUUON() {
  console.log('🔄 G Mod 6 Mathematical Engine initialized - Six-state looping system active');
  console.log('📐 Hexagonal geometry, rotational symmetry, and pattern generation ready');
  console.log('🎯 Modulo-6 cycles available for all mathematical visualizations');
}
