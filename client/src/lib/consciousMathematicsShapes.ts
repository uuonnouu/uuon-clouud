
import type { SurfaceParameters } from '../types/math';

/**
 * CONSCIOUS MATHEMATICS VISUALIZATION SHAPES
 * Exploring how abstract mathematical concepts map onto consciousness
 * Based on the intersection of constants, chaos, and infinities in human experience
 */

export interface ConsciousMathShape {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
  description: string;
}

function getDefaults(overrides: Partial<SurfaceParameters> = {}): Partial<SurfaceParameters> {
  return {
    a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 0, h: 0, i: 0,
    uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 48,
    ...overrides
  };
}

export const CONSCIOUS_MATHEMATICS_SHAPES: Record<string, ConsciousMathShape> = {
  
  consciousness_constants_core: {
    name: "🧠 Consciousness Constants - Core Identity",
    description: "Your fundamental traits and values that remain stable across contexts - like π appearing everywhere, these are the unchanging patterns of who you are.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const identity_strength = params.d ?? 2;
      const persistence = params.e ?? 3.14159; // π as identity constant
      const core_stability = params.f ?? 2.71828; // e as growth constant
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // Core identity manifold - stable across all transformations
      const r = identity_strength * (1 + 0.1 * Math.sin(persistence * theta) * Math.cos(core_stability * phi));
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + 0.2 * Math.sin(persistence * theta + core_stability * phi);
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 2, e: 3.14159, f: 2.71828 })
  },

  consciousness_chaos_butterfly: {
    name: "🦋 Consciousness Chaos - Butterfly Effect",
    description: "How small moments cascade into life-changing consequences. Your brain as a chaotic system - deterministic yet utterly unpredictable.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const sensitivity = params.d ?? 10; // Sensitivity to initial conditions
      const cascade_strength = params.e ?? 0.5;
      const unpredictability = params.f ?? 1.5;
      
      const theta = u * 2 * Math.PI;
      const t = v;
      
      // Lorenz-like attractor representing consciousness dynamics
      const x_chaos = Math.sin(sensitivity * theta + t * unpredictability);
      const y_chaos = Math.cos(sensitivity * theta + t * unpredictability);
      const z_chaos = t * 4 - 2;
      
      // Butterfly wing pattern from small perturbations
      const wing_amplitude = cascade_strength * Math.exp(-Math.abs(z_chaos));
      const wing_x = wing_amplitude * Math.sin(3 * theta) * (1 + 0.3 * x_chaos);
      const wing_y = wing_amplitude * Math.cos(2 * theta) * (1 + 0.3 * y_chaos);
      
      const x = 2 * x_chaos + wing_x;
      const y = 2 * y_chaos + wing_y;
      const z = z_chaos + 0.5 * Math.sin(sensitivity * theta) * wing_amplitude;
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 10, e: 0.5, f: 1.5 })
  },

  consciousness_infinity_recursion: {
    name: "∞ Consciousness Infinity - Recursive Self-Awareness",
    description: "Thinking about thinking about thinking... The infinite depth of consciousness and the boundless potential before choice collapses possibility.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const recursion_depth = params.d ?? 5;
      const self_awareness = params.e ?? 3;
      const infinite_potential = params.f ?? 2;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // Recursive spiral representing layers of consciousness
      let recursive_x = 0, recursive_y = 0, recursive_z = 0;
      for (let n = 1; n <= recursion_depth; n++) {
        const scale = 1 / Math.pow(n, 0.7);
        const phase = n * infinite_potential;
        recursive_x += scale * Math.sin(n * theta + phase) * Math.sin(phi);
        recursive_y += scale * Math.cos(n * theta + phase) * Math.sin(phi);
        recursive_z += scale * Math.cos(n * phi + phase);
      }
      
      // Self-awareness feedback loop
      const awareness_factor = 1 + 0.3 * Math.sin(self_awareness * (recursive_x + recursive_y));
      
      const x = recursive_x * awareness_factor;
      const y = recursive_y * awareness_factor;
      const z = recursive_z * awareness_factor + (phi - Math.PI/2) * 2;
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 5, e: 3, f: 2 })
  },

  consciousness_strange_attractor: {
    name: "🌀 Consciousness Strange Attractor - Behavioral Patterns",
    description: "Despite chaos, you orbit around familiar patterns. Like the Lorenz attractor - never repeating yet beautifully bounded behavior.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const pattern_strength = params.d ?? 2.5;
      const bounded_chaos = params.e ?? 1;
      const return_tendency = params.f ?? 0.8;
      
      const theta = u * 2 * Math.PI;
      const evolution = v * 6; // Time evolution parameter
      
      // Strange attractor in personality space
      const attractor_x = pattern_strength * Math.sin(theta + evolution * 0.1);
      const attractor_y = pattern_strength * Math.cos(theta + evolution * 0.15);
      const attractor_z = bounded_chaos * Math.sin(evolution);
      
      // Chaotic perturbations that never fully escape the attractor
      const chaos_x = return_tendency * Math.sin(7 * theta + evolution) * Math.exp(-evolution * 0.1);
      const chaos_y = return_tendency * Math.cos(5 * theta + evolution) * Math.exp(-evolution * 0.1);
      const chaos_z = return_tendency * Math.sin(3 * evolution) * 0.5;
      
      const x = attractor_x + chaos_x;
      const y = attractor_y + chaos_y;
      const z = attractor_z + chaos_z;
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 2.5, e: 1, f: 0.8 })
  },

  consciousness_black_hole_self: {
    name: "⚫ Consciousness Black Hole - The Observing Self",
    description: "The mysterious center of consciousness that experiences everything but can never be fully observed - like nothing escaping a black hole's event horizon.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const event_horizon = params.d ?? 2;
      const gravitational_pull = params.e ?? 3;
      const mystery_depth = params.f ?? 1.5;
      
      const theta = u * 2 * Math.PI;
      const r = v * event_horizon * 2; // Distance from consciousness center
      
      // Event horizon of the self - can't see inside
      if (r < event_horizon * 0.8) {
        // Inside event horizon - pure mystery
        const x = mystery_depth * Math.sin(theta) * r / event_horizon;
        const y = mystery_depth * Math.cos(theta) * r / event_horizon;
        const z = -mystery_depth * (1 - r / event_horizon);
        return [x, y, z];
      } else {
        // Outside event horizon - warped spacetime of consciousness
        const warp = gravitational_pull / (r + 0.1);
        const spiral = theta + warp * 2;
        
        const x = r * Math.cos(spiral) * (1 + 0.2 * warp);
        const y = r * Math.sin(spiral) * (1 + 0.2 * warp);
        const z = warp * Math.sin(4 * theta) - 1;
        
        return [x, y, z];
      }
    },
    defaultParams: getDefaults({ d: 2, e: 3, f: 1.5 })
  },

  consciousness_free_will_paradox: {
    name: "🎭 Free Will Paradox - Deterministic Freedom",
    description: "Are you the constants, the chaos, or the infinite observer? A deterministic system that feels unpredictable, experiencing itself as freedom.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const determinism = params.d ?? 2;
      const freedom_feeling = params.e ?? 1.5;
      const paradox_tension = params.f ?? 3;
      
      const theta = u * 2 * Math.PI;
      const choice_space = v;
      
      // Deterministic layer - the "physics" of the system
      const det_x = determinism * Math.cos(theta) * Math.sin(choice_space * Math.PI);
      const det_y = determinism * Math.sin(theta) * Math.sin(choice_space * Math.PI);
      const det_z = determinism * Math.cos(choice_space * Math.PI);
      
      // Freedom layer - the experienced unpredictability
      const free_x = freedom_feeling * Math.sin(paradox_tension * theta + choice_space);
      const free_y = freedom_feeling * Math.cos(paradox_tension * theta + choice_space);
      const free_z = freedom_feeling * Math.sin(choice_space * 4);
      
      // The paradox - both exist simultaneously
      const x = det_x + 0.3 * free_x;
      const y = det_y + 0.3 * free_y;
      const z = det_z + 0.2 * free_z;
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 2, e: 1.5, f: 3 })
  }
};

export const CONSCIOUS_MATHEMATICS_COUNT = Object.keys(CONSCIOUS_MATHEMATICS_SHAPES).length;

console.log(`🧠 Conscious Mathematics Shapes loaded: ${CONSCIOUS_MATHEMATICS_COUNT} visualizations`);
console.log(`   ⚖️ Constants: Core identity patterns that persist`);
console.log(`   🦋 Chaos: Butterfly effects in consciousness`);
console.log(`   ∞ Infinities: Recursive self-awareness depths`);
console.log(`   🌀 Strange Attractors: Bounded behavioral patterns`);
console.log(`   ⚫ Black Hole Self: The unobservable observer`);
console.log(`   🎭 Free Will: The deterministic-freedom paradox`);
