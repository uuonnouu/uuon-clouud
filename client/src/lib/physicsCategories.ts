/**
 * CATEGORY-SPECIFIC PHYSICS SYSTEMS for Δmension
 *
 * Each category implements its own physics behavior that demonstrates
 * the underlying scientific principles
 *
 * © 2025 UUON Foundation Inc.
 */

import * as THREE from 'three';
import { PhysicsState, PhysicsConfig } from './physicsEngine';
import { SurfaceParameters } from '../types/math';

// ============================================================================
// WAVE PHYSICS - Electromagnetic, Sound, Ocean, Brain Waves
// ============================================================================

export interface WaveState {
  amplitude: number;
  frequency: number;
  wavelength: number;
  waveSpeed: number;
  propagationDirection: THREE.Vector3;
  interferencePattern: number;
}

export function simulateWavePhysics(
  state: PhysicsState,
  params: SurfaceParameters,
  config: PhysicsConfig,
  dt: number
): PhysicsState {
  // Extract or initialize wave-specific data
  let waveData = state.customData.get('wave') as WaveState | undefined;

  if (!waveData) {
    waveData = {
      amplitude: params.a ?? 1.0,
      frequency: params.e ?? 2.0,
      wavelength: params.b ?? 1.0,
      waveSpeed: 2.0,
      propagationDirection: new THREE.Vector3(1, 0, 0),
      interferencePattern: 0
    };
  }

  // Update wave phase based on time
  const newPhase = (state.phase + waveData.frequency * dt) % (Math.PI * 2);

  // Wave equation: ψ(x,t) = A·sin(kx - ωt + φ)
  const k = (2 * Math.PI) / waveData.wavelength; // Wave number
  const omega = waveData.frequency * 2 * Math.PI;  // Angular frequency

  // Compute wave displacement
  const waveDisplacement = waveData.amplitude * Math.sin(k * state.position.x - omega * state.time + state.phase);

  // Apply interference patterns (superposition)
  const interference1 = Math.sin(k * state.position.x - omega * state.time);
  const interference2 = Math.sin(k * state.position.x + omega * state.time + Math.PI / 4);
  waveData.interferencePattern = interference1 + interference2;

  // Update position based on wave propagation
  const waveVelocity = waveData.propagationDirection.clone().multiplyScalar(waveData.waveSpeed);

  // Energy in wave: E = (1/2)·m·ω²·A²
  const energy = 0.5 * state.mass * omega * omega * waveData.amplitude * waveData.amplitude;

  state.customData.set('wave', waveData);

  return {
    ...state,
    phase: newPhase,
    velocity: waveVelocity,
    energy: energy,
    time: state.time + dt,
    // Oscillating position for wave visualization
    position: new THREE.Vector3(
      state.position.x,
      waveDisplacement,
      state.position.z
    )
  };
}

// ============================================================================
// MOLECULAR DYNAMICS - DNA, Proteins, Molecular Machines
// ============================================================================

export interface MolecularState {
  bondStrength: number;
  bondLength: number;
  torsionAngle: number;
  thermalEnergy: number;
  hydrogenBonds: number;
}

export function simulateMolecularPhysics(
  state: PhysicsState,
  params: SurfaceParameters,
  config: PhysicsConfig,
  dt: number
): PhysicsState {
  let molData = state.customData.get('molecular') as MolecularState | undefined;

  if (!molData) {
    molData = {
      bondStrength: 1.0,
      bondLength: params.b ?? 3.4, // DNA base pair distance
      torsionAngle: 0,
      thermalEnergy: state.temperature * 0.01, // kT approximation
      hydrogenBonds: 3 // Typical for DNA base pairs
    };
  }

  // Thermal vibration (Brownian motion at molecular scale)
  const kT = state.temperature * 1.38e-23; // Boltzmann constant × temperature
  const thermalAmplitude = Math.sqrt(kT / state.mass) * 0.1;

  const thermalVibration = new THREE.Vector3(
    (Math.random() - 0.5) * thermalAmplitude,
    (Math.random() - 0.5) * thermalAmplitude,
    (Math.random() - 0.5) * thermalAmplitude
  );

  // Torsional rotation (DNA twist)
  molData.torsionAngle += dt * 0.5; // Slow helical twist

  // Van der Waals forces (weak, short-range)
  const vdw_force = new THREE.Vector3(0, 0, 0);
  const distance = state.position.length();
  if (distance > 0) {
    // Lennard-Jones potential: F = -dU/dr
    const sigma = molData.bondLength;
    const epsilon = molData.bondStrength;
    const force_magnitude = 24 * epsilon * (2 * Math.pow(sigma / distance, 12) - Math.pow(sigma / distance, 6)) / distance;
    vdw_force.copy(state.position.clone().normalize().multiplyScalar(-force_magnitude));
  }

  // Hydrogen bonding energy
  const h_bond_energy = molData.hydrogenBonds * 20; // kJ/mol approximation

  state.customData.set('molecular', molData);

  // Apply thermal vibration to velocity
  const newVelocity = state.velocity.clone().add(thermalVibration);

  // Apply damping (viscosity of cellular environment)
  newVelocity.multiplyScalar(config.dampingFactor);

  return {
    ...state,
    velocity: newVelocity,
    forces: vdw_force,
    energy: h_bond_energy + molData.thermalEnergy,
    time: state.time + dt
  };
}

// ============================================================================
// CELLULAR FLUID DYNAMICS - Cells, Viruses, Organelles
// ============================================================================

export interface CellularState {
  radius: number;
  viscosity: number;
  diffusionCoefficient: number;
  collisionElasticity: number;
}

export function simulateCellularPhysics(
  state: PhysicsState,
  params: SurfaceParameters,
  config: PhysicsConfig,
  dt: number
): PhysicsState {
  let cellData = state.customData.get('cellular') as CellularState | undefined;

  if (!cellData) {
    cellData = {
      radius: params.a ?? 1.0,
      viscosity: 0.001, // Water viscosity (Pa·s)
      diffusionCoefficient: 1e-9, // Typical for small proteins (m²/s)
      collisionElasticity: 0.8
    };
  }

  // Brownian motion - random walk from thermal fluctuations
  const brownianForce = new THREE.Vector3(
    (Math.random() - 0.5) * 2,
    (Math.random() - 0.5) * 2,
    (Math.random() - 0.5) * 2
  ).multiplyScalar(Math.sqrt(2 * cellData.diffusionCoefficient / dt));

  // Stokes drag force: F = -6πηrv (for sphere in fluid)
  const dragCoefficient = 6 * Math.PI * cellData.viscosity * cellData.radius;
  const dragForce = state.velocity.clone().multiplyScalar(-dragCoefficient);

  // Buoyancy force (if in gravitational field)
  const buoyancy = new THREE.Vector3(0, state.mass * config.gravityStrength * 0.1, 0);

  // Total force
  const totalForce = new THREE.Vector3()
    .add(brownianForce)
    .add(dragForce)
    .add(buoyancy);

  // Cell deformation under shear stress (simple model)
  const shearRate = state.velocity.length() / cellData.radius;
  const deformation = Math.min(shearRate * 0.01, 0.3); // Max 30% deformation

  state.customData.set('cellular', { ...cellData, radius: params.a * (1 + deformation) });

  return {
    ...state,
    forces: totalForce,
    time: state.time + dt
  };
}

// ============================================================================
// CHAOS ATTRACTORS - Lorenz, Rössler, Strange Attractors
// ============================================================================

export interface AttractorState {
  sigma: number;
  rho: number;
  beta: number;
  trajectoryPoints: THREE.Vector3[];
  maxTrailLength: number;
}

export function simulateAttractorPhysics(
  state: PhysicsState,
  params: SurfaceParameters,
  config: PhysicsConfig,
  dt: number
): PhysicsState {
  let attractorData = state.customData.get('attractor') as AttractorState | undefined;

  if (!attractorData) {
    attractorData = {
      sigma: 10,      // Lorenz sigma parameter
      rho: 28,        // Lorenz rho parameter
      beta: 8/3,      // Lorenz beta parameter
      trajectoryPoints: [],
      maxTrailLength: 200
    };
  }

  // Lorenz attractor differential equations:
  // dx/dt = σ(y - x)
  // dy/dt = x(ρ - z) - y
  // dz/dt = xy - βz

  const x = state.position.x;
  const y = state.position.y;
  const z = state.position.z;

  const dx = attractorData.sigma * (y - x);
  const dy = x * (attractorData.rho - z) - y;
  const dz = x * y - attractorData.beta * z;

  const newVelocity = new THREE.Vector3(dx, dy, dz);
  const newPosition = state.position.clone().add(newVelocity.clone().multiplyScalar(dt * 0.01));

  // Store trajectory for trail rendering
  attractorData.trajectoryPoints.push(newPosition.clone());
  if (attractorData.trajectoryPoints.length > attractorData.maxTrailLength) {
    attractorData.trajectoryPoints.shift();
  }

  state.customData.set('attractor', attractorData);

  // Energy is constant in ideal attractor (conservative system)
  const energy = x * x + y * y + z * z;

  return {
    ...state,
    position: newPosition,
    velocity: newVelocity,
    energy: energy,
    time: state.time + dt
  };
}

// ============================================================================
// ANATOMICAL FLOW - Heart, Blood Vessels, Organs
// ============================================================================

export interface AnatomicalState {
  heartRate: number;        // BPM
  bloodPressure: number;    // mmHg
  flowVelocity: number;     // m/s
  contractionPhase: number; // 0-1 (systole to diastole)
}

export function simulateAnatomicalPhysics(
  state: PhysicsState,
  params: SurfaceParameters,
  config: PhysicsConfig,
  dt: number
): PhysicsState {
  let anatomyData = state.customData.get('anatomical') as AnatomicalState | undefined;

  if (!anatomyData) {
    anatomyData = {
      heartRate: 72,          // Normal resting heart rate
      bloodPressure: 120,     // Systolic pressure
      flowVelocity: 0.3,      // Average aortic velocity
      contractionPhase: 0
    };
  }

  // Cardiac cycle period (seconds)
  const cyclePeriod = 60 / anatomyData.heartRate;

  // Update contraction phase
  anatomyData.contractionPhase = (state.time % cyclePeriod) / cyclePeriod;

  // Systole (contraction): 0 to 0.3
  // Diastole (relaxation): 0.3 to 1.0
  let contractionStrength = 0;
  if (anatomyData.contractionPhase < 0.3) {
    // Systole - smooth contraction
    contractionStrength = Math.sin(anatomyData.contractionPhase / 0.3 * Math.PI);
  }

  // Pressure wave: P(t) = P_sys + (P_dias - P_sys) * relaxation
  const systolic = anatomyData.bloodPressure;
  const diastolic = systolic * 0.67; // Typical ratio
  const currentPressure = systolic * contractionStrength + diastolic * (1 - contractionStrength);

  // Flow velocity (Poiseuille's law approximation)
  const pressureGradient = currentPressure / 1000; // Simplified
  anatomyData.flowVelocity = pressureGradient * 10;

  // Pulsating motion
  const pulsation = new THREE.Vector3(
    0,
    0,
    contractionStrength * 0.2 // Rhythmic z-axis expansion
  );

  state.customData.set('anatomical', anatomyData);

  return {
    ...state,
    velocity: new THREE.Vector3(anatomyData.flowVelocity, 0, 0),
    position: state.position.clone().add(pulsation),
    energy: currentPressure * 0.01,
    time: state.time + dt
  };
}

// ============================================================================
// QUANTUM MECHANICS - Orbitals, Superposition, Probability Clouds
// ============================================================================

export interface QuantumState {
  energyLevel: number;
  principalQuantumNumber: number;
  orbitalAngularMomentum: number;
  probabilityDensity: number;
}

export function simulateQuantumPhysics(
  state: PhysicsState,
  params: SurfaceParameters,
  config: PhysicsConfig,
  dt: number
): PhysicsState {
  let quantumData = state.customData.get('quantum') as QuantumState | undefined;

  if (!quantumData) {
    quantumData = {
      energyLevel: 1,
      principalQuantumNumber: 2,
      orbitalAngularMomentum: 1,
      probabilityDensity: 0
    };
  }

  // Quantum phase evolution: ψ(t) = ψ(0) * exp(-iEt/ℏ)
  const hbar = 1.054e-34; // Reduced Planck constant
  const energy = quantumData.energyLevel * 13.6; // eV (hydrogen-like)
  const phaseEvolution = (energy * state.time) / hbar;

  // Probability density (Born rule): ρ = |ψ|²
  const r = state.position.length();
  const n = quantumData.principalQuantumNumber;
  const a0 = 1; // Bohr radius (scaled)

  // Simplified radial probability for hydrogen orbital
  quantumData.probabilityDensity = Math.pow(r / (n * a0), 2) * Math.exp(-r / (n * a0));

  // Orbital fluctuations (uncertainty principle)
  const deltaX = Math.sqrt(hbar) * 0.1;
  const fluctuation = new THREE.Vector3(
    (Math.random() - 0.5) * deltaX,
    (Math.random() - 0.5) * deltaX,
    (Math.random() - 0.5) * deltaX
  );

  state.customData.set('quantum', quantumData);

  return {
    ...state,
    phase: phaseEvolution % (Math.PI * 2),
    position: state.position.clone().add(fluctuation),
    energy: energy,
    time: state.time + dt
  };
}

// ============================================================================
// FRACTAL & GENERATIVE GROWTH - L-Systems, Differential Growth
// ============================================================================

export interface FractalState {
  iterationDepth: number;
  growthRate: number;
  branchingProbability: number;
  currentSize: number;
}

export function simulateFractalPhysics(
  state: PhysicsState,
  params: SurfaceParameters,
  config: PhysicsConfig,
  dt: number
): PhysicsState {
  let fractalData = state.customData.get('fractal') as FractalState | undefined;

  if (!fractalData) {
    fractalData = {
      iterationDepth: 0,
      growthRate: 0.1,
      branchingProbability: 0.7,
      currentSize: 0.1
    };
  }

  // Growth over time (logistic growth model)
  const maxSize = params.a ?? 2.0;
  const growthFactor = fractalData.growthRate * (1 - fractalData.currentSize / maxSize);
  fractalData.currentSize += growthFactor * dt;

  // Iteration advancement (discrete steps)
  const iterationPeriod = 1.0; // 1 second per iteration
  if (state.time % iterationPeriod < dt) {
    fractalData.iterationDepth = Math.min(fractalData.iterationDepth + 1, 8);
  }

  // Reaction-diffusion for pattern formation
  const laplacian = Math.sin(state.position.x * 2) * Math.cos(state.position.y * 2);
  const reactionTerm = fractalData.currentSize * (1 - fractalData.currentSize);
  const diffusionTerm = laplacian * 0.1;

  state.customData.set('fractal', fractalData);

  return {
    ...state,
    energy: fractalData.iterationDepth * 10,
    time: state.time + dt
  };
}

// ============================================================================
// ASTROPHYSICAL N-BODY GRAVITY
// ============================================================================

export interface AstrophysicalState {
  gravitationalConstant: number;
  orbitalVelocity: number;
  orbitalRadius: number;
  accretionRate: number;
}

export function simulateAstrophysicalPhysics(
  state: PhysicsState,
  params: SurfaceParameters,
  config: PhysicsConfig,
  dt: number
): PhysicsState {
  let astroData = state.customData.get('astrophysical') as AstrophysicalState | undefined;

  if (!astroData) {
    astroData = {
      gravitationalConstant: 6.67e-11,
      orbitalVelocity: 1.0,
      orbitalRadius: params.a ?? 2.0,
      accretionRate: 0.01
    };
  }

  // Gravitational force toward center: F = -GMm/r²
  const r = state.position.length();
  const centralMass = 1000.0; // Massive central object

  let gravityForce = new THREE.Vector3(0, 0, 0);
  if (r > 0.01) {
    const forceMagnitude = astroData.gravitationalConstant * centralMass * state.mass / (r * r);
    gravityForce = state.position.clone().normalize().multiplyScalar(-forceMagnitude * 1e10);
  }

  // Orbital motion (tangential velocity)
  const tangent = new THREE.Vector3(-state.position.y, state.position.x, 0).normalize();
  const orbitalSpeed = Math.sqrt(astroData.gravitationalConstant * centralMass / Math.max(r, 0.1)) * 1e5;
  const orbitalVel = tangent.multiplyScalar(orbitalSpeed);

  // Accretion disk rotation
  const angularVelocity = orbitalSpeed / r;
  const rotationAngle = angularVelocity * dt;

  state.customData.set('astrophysical', astroData);

  return {
    ...state,
    forces: gravityForce,
    velocity: orbitalVel,
    phase: (state.phase + rotationAngle) % (Math.PI * 2),
    time: state.time + dt
  };
}

// ============================================================================
// CRYSTALLINE & DIAMOND - Light Refraction
// ============================================================================

export interface CrystallineState {
  refractiveIndex: number;
  lightRays: Array<{origin: THREE.Vector3, direction: THREE.Vector3}>;
  internalReflections: number;
  dispersion: number;
}

export function simulateCrystallinePhysics(
  state: PhysicsState,
  params: SurfaceParameters,
  config: PhysicsConfig,
  dt: number
): PhysicsState {
  let crystalData = state.customData.get('crystalline') as CrystallineState | undefined;

  if (!crystalData) {
    crystalData = {
      refractiveIndex: 2.42, // Diamond refractive index
      lightRays: [],
      internalReflections: 0,
      dispersion: 0.044 // Diamond dispersion
    };
  }

  // Simulate light ray entering crystal
  const incidentAngle = Math.PI / 4; // 45 degrees
  const refractedAngle = Math.asin(Math.sin(incidentAngle) / crystalData.refractiveIndex);

  // Critical angle for total internal reflection
  const criticalAngle = Math.asin(1 / crystalData.refractiveIndex);

  // Count reflections (sparkle effect)
  if (Math.random() < 0.1) {
    crystalData.internalReflections++;
    if (crystalData.internalReflections > 10) crystalData.internalReflections = 0;
  }

  // Dispersion (rainbow effect)
  const wavelengthPhase = state.time * 2;
  const dispersedAngle = refractedAngle + Math.sin(wavelengthPhase) * crystalData.dispersion;

  state.customData.set('crystalline', crystalData);

  // Energy based on number of reflections (brilliance)
  return {
    ...state,
    energy: crystalData.internalReflections * 5,
    phase: dispersedAngle,
    time: state.time + dt
  };
}

// ============================================================================
// MECHANICAL & AI OPTIMIZATION - Gradient Descent
// ============================================================================

export interface MechanicalState {
  lossLandscapePosition: THREE.Vector2;
  gradientDirection: THREE.Vector2;
  learningRate: number;
  momentum: THREE.Vector2;
}

export function simulateMechanicalPhysics(
  state: PhysicsState,
  params: SurfaceParameters,
  config: PhysicsConfig,
  dt: number
): PhysicsState {
  let mechData = state.customData.get('mechanical') as MechanicalState | undefined;

  if (!mechData) {
    mechData = {
      lossLandscapePosition: new THREE.Vector2(
        Math.random() * 4 - 2,
        Math.random() * 4 - 2
      ),
      gradientDirection: new THREE.Vector2(0, 0),
      learningRate: 0.1,
      momentum: new THREE.Vector2(0, 0)
    };
  }

  // Loss landscape: L(x,y) = x² + y² (simple quadratic bowl)
  const x = mechData.lossLandscapePosition.x;
  const y = mechData.lossLandscapePosition.y;

  // Gradient: ∇L = (2x, 2y)
  mechData.gradientDirection.set(2 * x, 2 * y);

  // SGD with momentum: v = βv - η∇L, x = x + v
  const beta = 0.9;
  mechData.momentum.multiplyScalar(beta);
  mechData.momentum.sub(mechData.gradientDirection.clone().multiplyScalar(mechData.learningRate));

  mechData.lossLandscapePosition.add(mechData.momentum.clone().multiplyScalar(dt));

  // Loss value (energy)
  const loss = x * x + y * y;

  state.customData.set('mechanical', mechData);

  return {
    ...state,
    position: new THREE.Vector3(
      mechData.lossLandscapePosition.x,
      mechData.lossLandscapePosition.y,
      -loss * 0.1 // Z represents loss depth
    ),
    energy: loss,
    time: state.time + dt
  };
}

// ============================================================================
// PHYSICS SYSTEM ROUTER
// ============================================================================

export type PhysicsSimulator = (
  state: PhysicsState,
  params: SurfaceParameters,
  config: PhysicsConfig,
  dt: number
) => PhysicsState;

export function getPhysicsSimulator(category: string): PhysicsSimulator {
  switch (category) {
    case 'wave':
      return simulateWavePhysics;
    case 'molecular':
      return simulateMolecularPhysics;
    case 'cellular':
      return simulateCellularPhysics;
    case 'attractor':
      return simulateAttractorPhysics;
    case 'anatomical':
      return simulateAnatomicalPhysics;
    case 'quantum':
      return simulateQuantumPhysics;
    case 'fractal':
      return simulateFractalPhysics;
    case 'astrophysical':
      return simulateAstrophysicalPhysics;
    case 'crystalline':
      return simulateCrystallinePhysics;
    case 'mechanical':
      return simulateMechanicalPhysics;
    default:
      // Static shapes - no physics, just return state
      return (state) => ({ ...state, time: state.time + 0.016 });
  }
}