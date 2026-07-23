/**
 * EFV — Energy-Frequency-Variation Unified Shape System
 * 
 * A formal analytical framework for constructing and controlling dynamic geometric systems.
 * Three orthogonal parameters:
 *   - Energy (E): Magnitude of transformation
 *   - Frequency (F): Rate of transformation  
 *   - Variation (V): Structural diversity of system states
 * 
 * Single-Shape Principle: All formulas operate on one shared geometric state.
 * © 2025 UUON Foundation Inc.
 */

import { SurfaceParameters, ParametricSurface } from "../types/math";

const DEFAULT_PARAMS: SurfaceParameters = {
  type: 'efv_amplitude_wave' as any,
  a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1,
  k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1,
  u: 1, v: 1, w: 1, x: 1, y: 1, z: 1,
  uMin: 0, uMax: Math.PI * 2, vMin: 0, vMax: Math.PI,
  uSegments: 80, vSegments: 40,
  customEquation: { x: 'u', y: 'v', z: '0' }
};

function getDefaults(overrides: Partial<SurfaceParameters> = {}): SurfaceParameters {
  return { ...DEFAULT_PARAMS, ...overrides };
}

export const EFV_SHAPES: Record<string, ParametricSurface> = {
  efv_amplitude_operator: {
    name: "⚡ EFV Amplitude Operator",
    description: "Energy component: E = ||Δx||. Controls displacement magnitude and deformation strength without altering topology. Foundational transformation intensity.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const energy = params.d ?? 2;
      const baseRadius = params.e ?? 3;
      const displacement = params.f ?? 0.5;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const amplitudeField = energy * displacement * Math.sin(3 * theta) * Math.sin(2 * phi);
      const r = baseRadius + amplitudeField;
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + 0.2 * amplitudeField;
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 2, e: 3, f: 0.5 })
  },

  efv_frequency_modulator: {
    name: "🔄 EFV Frequency Modulator",
    description: "Frequency component: F = 1/Δt or n_iterations. Controls transformation rate, determining smoothness, repetition, and harmonic layering across the surface.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const frequency = params.d ?? 5;
      const harmonics = params.e ?? 3;
      const baseScale = params.f ?? 3;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      let harmonicSum = 0;
      for (let k = 1; k <= harmonics; k++) {
        harmonicSum += (1 / k) * Math.sin(frequency * k * theta + k * phi);
      }
      
      const r = baseScale * (1 + 0.2 * harmonicSum);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + 0.3 * harmonicSum;
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 5, e: 3, f: 3 })
  },

  efv_variation_entropy: {
    name: "🎲 EFV Variation Entropy",
    description: "Variation component: V = Var(C) or H(C) entropy. Controls diversity of form, phase offset, and branching probability. Introduces complexity without destabilizing base shape.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const entropyLevel = params.d ?? 2;
      const branchProbability = params.e ?? 0.5;
      const baseScale = params.f ?? 3;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const pseudoRandom = Math.sin(u * 17.3 + v * 31.7) * Math.cos(u * 23.1 - v * 13.9);
      const variation = entropyLevel * branchProbability * pseudoRandom;
      
      const r = baseScale * (1 + 0.15 * variation);
      const phaseOffset = 0.3 * variation;
      
      const x = r * Math.sin(phi + phaseOffset) * Math.cos(theta);
      const y = r * Math.sin(phi + phaseOffset) * Math.sin(theta);
      const z = r * Math.cos(phi) + 0.2 * variation;
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 2, e: 0.5, f: 3 })
  },

  efv_composite_transformation: {
    name: "🌀 EFV Composite Transformation",
    description: "Full EFV pipeline: x_final = x_0 + E·Σ[sin(2πF_k·t + φ_k(V))·d_ik]. All components fold into one resolved geometry through cumulative transformation.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const energy = params.d ?? 1.5;
      const frequency = params.e ?? 3;
      const variation = params.f ?? 0.5;
      const harmonicCount = params.g ?? 4;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const t = u;
      
      let transformSum = 0;
      for (let k = 1; k <= harmonicCount; k++) {
        const phaseOffset = variation * Math.sin(k * theta + k * phi);
        transformSum += Math.sin(2 * Math.PI * frequency * k * t + phaseOffset);
      }
      transformSum *= energy / harmonicCount;
      
      const baseR = 3;
      const r = baseR + 0.5 * transformSum;
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + 0.3 * transformSum;
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 1.5, e: 3, f: 0.5, g: 4 })
  },

  efv_configuration_space: {
    name: "📐 EFV Configuration Space",
    description: "G_final = Φ(G_0; {E}, {F}, {V}). The complete set model showing how base mesh transforms through coordinated EFV control parameters into stable geometric form.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const configEnergy = params.d ?? 2;
      const configFreq = params.e ?? 4;
      const configVar = params.f ?? 1;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const energyField = configEnergy * Math.sin(2 * theta) * Math.sin(phi);
      const freqField = Math.sin(configFreq * theta) * Math.cos(configFreq * phi);
      const varField = configVar * Math.sin(u * 7 + v * 11) * 0.5;
      
      const configSpace = energyField * 0.3 + freqField * 0.2 + varField * 0.1;
      const r = 3 + configSpace;
      
      const x = r * Math.sin(phi) * Math.cos(theta + configSpace * 0.1);
      const y = r * Math.sin(phi) * Math.sin(theta + configSpace * 0.1);
      const z = r * Math.cos(phi) + 0.2 * configSpace;
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 2, e: 4, f: 1 })
  },

  efv_emergent_stability: {
    name: "✨ EFV Emergent Stability",
    description: "Conceptual closure: Complexity emerges through controlled composition rather than fragmentation. Unified mathematical behaviors resolve to one coherent spatial result.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const stabilityFactor = params.d ?? 3;
      const emergenceRate = params.e ?? 2;
      const coherence = params.f ?? 1;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const layerCount = 5;
      let emergentField = 0;
      for (let layer = 1; layer <= layerCount; layer++) {
        const layerWeight = Math.exp(-layer / emergenceRate);
        emergentField += layerWeight * Math.sin(layer * theta) * Math.cos(layer * phi);
      }
      emergentField *= coherence / layerCount;
      
      const stability = stabilityFactor * (1 - 0.5 * Math.abs(emergentField));
      const r = stability * (1 + 0.15 * emergentField);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + 0.25 * emergentField;
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 3, e: 2, f: 1 })
  },

  efv_direction_field: {
    name: "🧭 EFV Direction Field",
    description: "Direction component d_ik from the EFV formula. Normals, curls, and lattice vectors that guide transformation. The geometric pathways of energy flow.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const fieldStrength = params.d ?? 2;
      const curlIntensity = params.e ?? 1;
      const latticeScale = params.f ?? 3;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const normalX = Math.sin(phi) * Math.cos(theta);
      const normalY = Math.sin(phi) * Math.sin(theta);
      const normalZ = Math.cos(phi);
      
      const curlX = -curlIntensity * Math.sin(theta) * Math.sin(2 * phi);
      const curlY = curlIntensity * Math.cos(theta) * Math.sin(2 * phi);
      const curlZ = curlIntensity * Math.cos(2 * phi);
      
      const x = latticeScale * normalX + 0.3 * fieldStrength * curlX;
      const y = latticeScale * normalY + 0.3 * fieldStrength * curlY;
      const z = latticeScale * normalZ + 0.3 * fieldStrength * curlZ;
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 2, e: 1, f: 3 })
  },

  efv_bounded_variation: {
    name: "🔒 EFV Bounded Variation",
    description: "Controlled variation ensuring stability. Variation parameter V is bounded to prevent geometric fragmentation while allowing expressive complexity.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const variationBound = params.d ?? 1;
      const boundStrength = params.e ?? 3;
      const baseScale = params.f ?? 3;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const rawVariation = Math.sin(5 * theta + 3 * phi) + 
                          0.5 * Math.sin(7 * theta - 2 * phi) +
                          0.25 * Math.sin(11 * theta + 5 * phi);
      
      const boundedVariation = variationBound * Math.tanh(rawVariation / boundStrength);
      
      const r = baseScale * (1 + 0.2 * boundedVariation);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + 0.15 * boundedVariation;
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 1, e: 3, f: 3 })
  }
};

export const EFV_SHAPE_COUNT = Object.keys(EFV_SHAPES).length;

console.log(`⚡ EFV (Energy-Frequency-Variation) Shapes loaded: ${EFV_SHAPE_COUNT} shapes`);
console.log(`   🔋 Energy: Amplitude/displacement operators`);
console.log(`   🔄 Frequency: Temporal/iterative harmonic layers`);
console.log(`   🎲 Variation: Entropy and structural diversity`);
console.log(`   🌀 Single-Shape Principle: All formulas → one geometry`);
