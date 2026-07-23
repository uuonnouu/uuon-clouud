/**
 * CORE PHYSICS ENGINE for Δmension
 * 
 * Replaces passive rotation with active physical simulation
 * Each shape demonstrates the mathematical/scientific principle it embodies
 * 
 * © 2025 UUON Foundation Inc.
 */

import * as THREE from 'three';
import { SurfaceParameters } from '../types/math';

// ============================================================================
// PHYSICS STATE - Tracks dynamic properties for each shape
// ============================================================================

export interface PhysicsState {
  // Core dynamics
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
  forces: THREE.Vector3;
  
  // Physical properties
  mass: number;
  charge: number;
  temperature: number;
  energy: number;
  
  // Animation state
  time: number;
  phase: number;
  
  // Category-specific data
  customData: Map<string, any>;
}

export interface PhysicsConfig {
  timeStep: number;           // Simulation timestep (default: 0.016 for 60fps)
  substeps: number;           // Physics iterations per frame (default: 4)
  dampingFactor: number;      // Energy dissipation (0-1, default: 0.98)
  gravityStrength: number;    // Gravity magnitude (default: 9.8)
  
  // Display options
  displayForces: boolean;     // Show force vectors
  displayTrails: boolean;     // Show particle history
  displayFields: boolean;     // Show field overlays
  
  // Color mapping
  colorMode: 'energy' | 'velocity' | 'temperature' | 'phase' | 'none';
  
  // Control
  pausePhysics: boolean;
}

// Default configuration
export const DEFAULT_PHYSICS_CONFIG: PhysicsConfig = {
  timeStep: 0.016,
  substeps: 4,
  dampingFactor: 0.98,
  gravityStrength: 9.8,
  displayForces: true,
  displayTrails: true,
  displayFields: false,
  colorMode: 'energy',
  pausePhysics: false
};

// ============================================================================
// RK4 INTEGRATOR - Runge-Kutta 4th order for smooth physics
// ============================================================================

interface DerivativeState {
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
}

/**
 * Compute derivatives for RK4 integration
 */
function computeDerivative(
  state: PhysicsState,
  dt: number,
  derivative: DerivativeState,
  forces: THREE.Vector3
): DerivativeState {
  const newVel = state.velocity.clone().add(derivative.acceleration.clone().multiplyScalar(dt));
  const newAccel = forces.clone().divideScalar(state.mass);
  
  return {
    velocity: newVel,
    acceleration: newAccel
  };
}

/**
 * RK4 integration step - provides smooth, stable physics
 */
export function integrateRK4(state: PhysicsState, forces: THREE.Vector3, dt: number): PhysicsState {
  const initialDerivative: DerivativeState = {
    velocity: state.velocity.clone(),
    acceleration: forces.clone().divideScalar(state.mass)
  };
  
  // RK4 coefficients
  const k1 = computeDerivative(state, 0, initialDerivative, forces);
  const k2 = computeDerivative(state, dt * 0.5, k1, forces);
  const k3 = computeDerivative(state, dt * 0.5, k2, forces);
  const k4 = computeDerivative(state, dt, k3, forces);
  
  // Weighted average
  const newVelocity = state.velocity.clone();
  newVelocity.add(k1.acceleration.clone().multiplyScalar(dt / 6));
  newVelocity.add(k2.acceleration.clone().multiplyScalar(dt / 3));
  newVelocity.add(k3.acceleration.clone().multiplyScalar(dt / 3));
  newVelocity.add(k4.acceleration.clone().multiplyScalar(dt / 6));
  
  const newPosition = state.position.clone();
  newPosition.add(k1.velocity.clone().multiplyScalar(dt / 6));
  newPosition.add(k2.velocity.clone().multiplyScalar(dt / 3));
  newPosition.add(k3.velocity.clone().multiplyScalar(dt / 3));
  newPosition.add(k4.velocity.clone().multiplyScalar(dt / 6));
  
  return {
    ...state,
    position: newPosition,
    velocity: newVelocity,
    acceleration: forces.clone().divideScalar(state.mass),
    forces: forces.clone()
  };
}

/**
 * Simple Euler integration (faster but less accurate)
 * Use for non-critical physics or performance-constrained scenarios
 */
export function integrateEuler(state: PhysicsState, forces: THREE.Vector3, dt: number): PhysicsState {
  const acceleration = forces.clone().divideScalar(state.mass);
  const newVelocity = state.velocity.clone().add(acceleration.clone().multiplyScalar(dt));
  const newPosition = state.position.clone().add(newVelocity.clone().multiplyScalar(dt));
  
  return {
    ...state,
    position: newPosition,
    velocity: newVelocity,
    acceleration,
    forces: forces.clone()
  };
}

// ============================================================================
// CATEGORY DETECTION - Map shapes to physics systems
// ============================================================================

export type PhysicsCategory = 
  | 'wave'           // Wave algorithms (EM, sound, ocean, brain, quantum)
  | 'molecular'      // DNA, proteins, molecular machines
  | 'cellular'       // Cells, viruses, organelles, biobots
  | 'attractor'      // Chaos systems (Lorenz, Rössler, etc.)
  | 'anatomical'     // Human anatomy (heart, vessels, organs)
  | 'quantum'        // Quantum mechanics (orbitals, superposition)
  | 'fractal'        // L-systems, differential growth, generative
  | 'astrophysical'  // Gravity, black holes, galaxies
  | 'crystalline'    // Crystal lattices, diamond cuts
  | 'mechanical'     // Gears, turbines, optimization
  | 'static';        // No physics (basic geometry)

export function detectPhysicsCategory(shapeType: string): PhysicsCategory {
  const type = shapeType.toLowerCase();
  
  // Wave phenomena
  if (type.includes('wave') || type.includes('electromagnetic') || type.includes('sound') ||
      type.includes('ocean') || type.includes('brain') || type.includes('seismic') ||
      type.includes('gravitational_wave') || type.includes('cardiac_wave')) {
    return 'wave';
  }
  
  // Molecular structures
  if (type.includes('dna') || type.includes('helix') || type.includes('protein') ||
      type.includes('alpha_helix') || type.includes('beta_sheet') || type.includes('coiled_coil') ||
      type.includes('nucleotide') || type.includes('backbone') || type.includes('polymer')) {
    return 'molecular';
  }
  
  // Cellular biology
  if (type.includes('cell') || type.includes('virus') || type.includes('bacteria') ||
      type.includes('mitochondria') || type.includes('nucleus') || type.includes('ribosome') ||
      type.includes('biobot') || type.includes('organelle') || type.includes('tissue')) {
    return 'cellular';
  }
  
  // Chaos attractors
  if (type.includes('lorenz') || type.includes('rossler') || type.includes('attractor') ||
      type.includes('strange') || type.includes('chaos')) {
    return 'attractor';
  }
  
  // Anatomical systems
  if (type.includes('heart') || type.includes('cardiac') || type.includes('blood') ||
      type.includes('vessel') || type.includes('artery') || type.includes('lung') ||
      type.includes('brain') || type.includes('anatomy') || type.includes('muscle')) {
    return 'anatomical';
  }
  
  // Quantum mechanics
  if (type.includes('quantum') || type.includes('orbital') || type.includes('hydrogen') ||
      type.includes('bloch') || type.includes('superposition') || type.includes('entanglement') ||
      type.includes('qubit')) {
    return 'quantum';
  }
  
  // Fractal & generative
  if (type.includes('fractal') || type.includes('l_tree') || type.includes('mandelbrot') ||
      type.includes('julia') || type.includes('growth') || type.includes('coral') ||
      type.includes('lichen') || type.includes('perlin') || type.includes('noise')) {
    return 'fractal';
  }
  
  // Astrophysical
  if (type.includes('black_hole') || type.includes('galaxy') || type.includes('star') ||
      type.includes('gravity') || type.includes('asteroid') || type.includes('planet') ||
      type.includes('nebula') || type.includes('wormhole')) {
    return 'astrophysical';
  }
  
  // Crystalline
  if (type.includes('diamond') || type.includes('crystal') || type.includes('lattice') ||
      type.includes('quartz') || type.includes('gem')) {
    return 'crystalline';
  }
  
  // Mechanical
  if (type.includes('gear') || type.includes('turbine') || type.includes('impeller') ||
      type.includes('ai_') || type.includes('optimizer') || type.includes('gradient')) {
    return 'mechanical';
  }
  
  return 'static';
}

// ============================================================================
// PHYSICS STATE FACTORY
// ============================================================================

export function createPhysicsState(category: PhysicsCategory): PhysicsState {
  const baseState: PhysicsState = {
    position: new THREE.Vector3(0, 0, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    acceleration: new THREE.Vector3(0, 0, 0),
    forces: new THREE.Vector3(0, 0, 0),
    mass: 1.0,
    charge: 0.0,
    temperature: 300, // Kelvin (room temp)
    energy: 0.0,
    time: 0.0,
    phase: 0.0,
    customData: new Map()
  };
  
  // Category-specific initialization
  switch (category) {
    case 'molecular':
      return { ...baseState, temperature: 310, mass: 0.1 }; // Body temp, light mass
      
    case 'cellular':
      return { ...baseState, mass: 2.0, temperature: 310 }; // Heavier, biological
      
    case 'wave':
      return { ...baseState, mass: 0.01, phase: Math.random() * Math.PI * 2 }; // Light, random phase
      
    case 'quantum':
      return { ...baseState, mass: 0.001, energy: 1.0 }; // Very light, quantum energy
      
    case 'astrophysical':
      return { ...baseState, mass: 1000.0 }; // Heavy celestial objects
      
    default:
      return baseState;
  }
}

// ============================================================================
// COLOR MAPPING - Physics state to visual hue
// ============================================================================

export function mapStateToColor(state: PhysicsState, mode: PhysicsConfig['colorMode']): THREE.Color {
  switch (mode) {
    case 'energy': {
      const normalized = Math.min(state.energy / 10, 1);
      return new THREE.Color().setHSL(0.6 - normalized * 0.6, 1, 0.5); // Blue (low) to red (high)
    }
    
    case 'velocity': {
      const speed = state.velocity.length();
      const normalized = Math.min(speed / 10, 1);
      return new THREE.Color().setHSL(0.3 + normalized * 0.3, 1, 0.5); // Green to yellow
    }
    
    case 'temperature': {
      const normalized = (state.temperature - 200) / 300; // 200K to 500K range
      return new THREE.Color().setHSL(0.6 - normalized * 0.6, 0.8, 0.5); // Blue (cold) to red (hot)
    }
    
    case 'phase': {
      const hue = (state.phase / (Math.PI * 2)) % 1;
      return new THREE.Color().setHSL(hue, 1, 0.5); // Full spectrum based on phase
    }
    
    case 'none':
    default:
      return new THREE.Color(0xffffff);
  }
}
