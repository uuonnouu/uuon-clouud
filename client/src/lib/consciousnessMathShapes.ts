import { SurfaceParameters } from '../types/math';
import { getCleanDefaults } from '../types/shapes';

export interface ParametricSurface {
  name: string;
  description?: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

/**
 * CONSCIOUSNESS MATHEMATICS SHAPES
 * 
 * Mathematical concepts mapped onto human consciousness and cognition:
 * 
 * CONSTANTS: Core Identity
 * - Fundamental traits that remain stable across contexts
 * - The "you-ness" that persists through life changes
 * 
 * CHAOS: The Unpredictability of Consciousness  
 * - Sensitivity to initial conditions
 * - How small moments cascade into life-changing consequences
 * - The butterfly effect in decisions and relationships
 * 
 * INFINITIES: The Boundless and Unresolvable
 * - Recursive self-awareness (thinking about thinking)
 * - The bottomless depth of consciousness
 * - Unlimited potential before choices are made
 * 
 * Based on: "How abstract mathematical concepts map onto human consciousness"
 */

export const CONSCIOUSNESS_MATH_SHAPES: Record<string, ParametricSurface> = {

  // ============================================================================
  // CORE IDENTITY CONSTANTS
  // Mathematical constants (π, e, φ) as the unchanging "you-ness"
  // ============================================================================
  core_identity_constants: {
    name: "🧬 Core Identity Constants - The Unchanging You",
    description: "π, e, φ as fundamental personality traits that persist through all life changes",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 3;
      const piInfluence = (params.b ?? 1);
      const phiInfluence = (params.c ?? 1);
      
      const PI = Math.PI;
      const PHI = 1.618033988749895;
      const E = Math.E;
      
      const theta = u * PI * 2;
      const phi = v * PI;
      
      const r = 1 + 
        0.3 * piInfluence * Math.sin(PI * theta) +
        0.2 * phiInfluence * Math.cos(PHI * phi * 2) +
        0.15 * Math.sin(E * theta * phi);
      
      const x = r * Math.sin(phi) * Math.cos(theta) * scale;
      const y = r * Math.sin(phi) * Math.sin(theta) * scale;
      const z = r * Math.cos(phi) * scale;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 100, vSegments: 100
    })
  },

  // ============================================================================
  // BEHAVIORAL STRANGE ATTRACTOR
  // Despite chaos, you orbit around familiar patterns
  // ============================================================================
  behavioral_strange_attractor: {
    name: "🌀 Behavioral Strange Attractor - Familiar Patterns",
    description: "Despite unpredictability, consciousness orbits recognizable ways of being",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 0.15;
      const habitStrength = (params.b ?? 1) * 1.5;
      const novelty = (params.c ?? 1);
      
      const sigma = 10 * habitStrength;
      const rho = 28;
      const beta = 8/3;
      
      let x = 1 + v * 0.1;
      let y = 1;
      let z = 1;
      
      const dt = 0.01;
      const steps = Math.floor(u * 200);
      
      for (let i = 0; i < steps; i++) {
        const dx = sigma * (y - x);
        const dy = x * (rho - z) - y;
        const dz = x * y - beta * z;
        
        x += dx * dt * novelty;
        y += dy * dt;
        z += dz * dt;
      }
      
      return [x * scale, y * scale, (z - 25) * scale];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 200, vSegments: 30
    })
  },

  // ============================================================================
  // CONSCIOUSNESS DEPTH RECURSION
  // Thinking about thinking about thinking... endlessly
  // ============================================================================
  consciousness_recursion: {
    name: "♾️ Consciousness Depth - Recursive Self-Awareness",
    description: "Thinking about thinking about thinking... the infinite regress of self-observation",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 4;
      const recursionDepth = Math.floor(4 + (params.b ?? 1) * 4);
      const awarenessSpread = (params.c ?? 1);
      
      let x = (u - 0.5) * 2;
      let y = (v - 0.5) * 2;
      let z = 0;
      
      for (let level = 0; level < recursionDepth; level++) {
        const levelScale = Math.pow(0.6, level);
        const angle = level * Math.PI / 4;
        
        const obsX = x * Math.cos(angle) - y * Math.sin(angle);
        const obsY = x * Math.sin(angle) + y * Math.cos(angle);
        
        z += levelScale * Math.sin(obsX * 3 * awarenessSpread) * 
             Math.cos(obsY * 3 * awarenessSpread);
        
        x = obsX * 0.7;
        y = obsY * 0.7;
      }
      
      return [
        (u - 0.5) * 10 * scale,
        (v - 0.5) * 10 * scale,
        z * 2 * scale
      ];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 150, vSegments: 150
    })
  },

  // ============================================================================
  // TRAUMA BLACK HOLE
  // An experience so dense it warps psychological spacetime
  // ============================================================================
  trauma_black_hole: {
    name: "🕳️ Trauma Black Hole - Warped Psychological Spacetime",
    description: "Experience so dense with meaning it pulls all thoughts toward it",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 5;
      const traumaMass = (params.b ?? 1) * 2;
      const healingProgress = (params.c ?? 1);
      
      const theta = u * Math.PI * 2;
      const r = v * 3 + 0.3;
      
      const schwarzschild = traumaMass * 0.5;
      const warpFactor = 1 - schwarzschild / (r + 0.1);
      const warp = Math.max(0.1, warpFactor);
      
      const healingLift = healingProgress * 0.5 * Math.log(1 + r);
      
      const x = r * Math.cos(theta) * warp * scale;
      const y = r * Math.sin(theta) * warp * scale;
      const z = (-Math.log(r + 0.1) * traumaMass + healingLift) * scale;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 100, vSegments: 80
    })
  },

  // ============================================================================
  // EVENT HORIZON OF SELF
  // Aspects of yourself you can never fully observe
  // ============================================================================
  self_event_horizon: {
    name: "🔮 Self Event Horizon - The Unobservable Within",
    description: "The boundary beyond which self-knowledge cannot escape",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 4;
      const horizonRadius = (params.b ?? 1) * 1.5;
      const consciousnessDepth = (params.c ?? 1);
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const r = horizonRadius + 0.5 * Math.sin(phi * 3) * Math.cos(theta * 2);
      
      const distortion = Math.exp(-Math.pow(phi - Math.PI/2, 2) * 2);
      const rWarped = r * (1 + distortion * consciousnessDepth * 0.3);
      
      const x = rWarped * Math.sin(phi) * Math.cos(theta) * scale;
      const y = rWarped * Math.sin(phi) * Math.sin(theta) * scale;
      const z = rWarped * Math.cos(phi) * scale * (1 - distortion * 0.3);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 100, vSegments: 100
    })
  },

  // ============================================================================
  // BUTTERFLY EFFECT LIFE PATH
  // Small moments cascading into life-changing consequences
  // ============================================================================
  butterfly_effect_life: {
    name: "🦋 Butterfly Effect Life Path - Cascading Moments",
    description: "How a chance conversation or split-second decision changes everything",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 3;
      const sensitivity = (params.b ?? 1) * 2;
      const timeScale = (params.c ?? 1) * 30;
      
      const epsilon = 0.0001 * (1 + v);
      
      let x1 = 1, y1 = 1, z1 = 1;
      let x2 = 1 + epsilon, y2 = 1, z2 = 1;
      
      const dt = 0.01;
      const steps = Math.floor(u * timeScale / dt);
      
      for (let i = 0; i < steps; i++) {
        const sigma = 10 * sensitivity;
        const rho = 28;
        const beta = 8/3;
        
        const dx1 = sigma * (y1 - x1);
        const dy1 = x1 * (rho - z1) - y1;
        const dz1 = x1 * y1 - beta * z1;
        x1 += dx1 * dt;
        y1 += dy1 * dt;
        z1 += dz1 * dt;
        
        const dx2 = sigma * (y2 - x2);
        const dy2 = x2 * (rho - z2) - y2;
        const dz2 = x2 * y2 - beta * z2;
        x2 += dx2 * dt;
        y2 += dy2 * dt;
        z2 += dz2 * dt;
      }
      
      const divergence = Math.sqrt((x2-x1)**2 + (y2-y1)**2 + (z2-z1)**2);
      
      const blend = v;
      const x = (x1 * (1-blend) + x2 * blend) * 0.1 * scale;
      const y = (y1 * (1-blend) + y2 * blend) * 0.1 * scale;
      const z = (z1 * (1-blend) + z2 * blend - 25) * 0.1 * scale + divergence * 0.1;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 150, vSegments: 50
    })
  },

  // ============================================================================
  // POTENTIAL INFINITY FIELD
  // The infinite possibilities before a choice is made
  // ============================================================================
  potential_infinity_field: {
    name: "∞ Potential Infinity Field - Uncollapsed Possibilities",
    description: "All possible futures exist until the moment of choice",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 5;
      const possibilityDensity = (params.b ?? 1) * 3;
      const choiceMoment = (params.c ?? 1);
      
      const theta = u * Math.PI * 4;
      const r = v * 2;
      
      let z = 0;
      for (let n = 1; n <= 8; n++) {
        const amplitude = 1 / n * possibilityDensity;
        z += amplitude * Math.sin(n * theta + n * r * 2);
      }
      
      const collapse = Math.exp(-choiceMoment * r * 2);
      z *= (1 - collapse) + collapse * 0.1;
      
      const x = r * Math.cos(theta) * scale;
      const y = r * Math.sin(theta) * scale;
      
      return [x, y, z * scale];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 150, vSegments: 80
    })
  },

  // ============================================================================
  // FREE WILL PARADOX SURFACE
  // Deterministic yet unpredictable, experienced as freedom
  // ============================================================================
  free_will_paradox: {
    name: "⚖️ Free Will Paradox - Determined Yet Free",
    description: "Constants + Chaos + Infinity = the experience of choice",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 4;
      const determinism = (params.b ?? 1);
      const freedom = (params.c ?? 1);
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const rDeterministic = 1 + 0.3 * Math.sin(3 * theta) * Math.cos(2 * phi);
      
      const chaotic = Math.sin(theta * 7 + phi * 11) * 
                     Math.cos(theta * 13 - phi * 5) * 0.2;
      
      const r = rDeterministic * determinism + chaotic * freedom;
      
      const x = r * Math.sin(phi) * Math.cos(theta) * scale;
      const y = r * Math.sin(phi) * Math.sin(theta) * scale;
      const z = r * Math.cos(phi) * scale;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 120, vSegments: 120
    })
  },

  // ============================================================================
  // EMERGENT COMPLEXITY SURFACE
  // Simple rules + chaotic dynamics = human complexity
  // ============================================================================
  emergent_complexity: {
    name: "🌱 Emergent Complexity - Simple Rules to Rich Life",
    description: "Simple constants + chaotic dynamics = the staggering complexity of being",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 4;
      const ruleSimplicity = (params.b ?? 1);
      const complexityEmergence = (params.c ?? 1) * 5;
      
      let x = (u - 0.5) * 2;
      let y = (v - 0.5) * 2;
      let z = 0;
      
      const iterations = Math.floor(5 + complexityEmergence);
      for (let i = 0; i < iterations; i++) {
        const angle = i * Math.PI / 6 * ruleSimplicity;
        const nx = Math.abs(x) - Math.sin(angle);
        const ny = Math.abs(y) - Math.cos(angle);
        
        z += Math.sin(x * y * (i + 1)) * Math.pow(0.7, i);
        
        x = nx;
        y = ny;
      }
      
      return [
        (u - 0.5) * 10 * scale,
        (v - 0.5) * 10 * scale,
        z * scale
      ];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 180, vSegments: 180
    })
  },

  // ============================================================================
  // OBSESSION GRAVITY WELL
  // Something that captures so much mental gravity everything orbits it
  // ============================================================================
  obsession_gravity_well: {
    name: "🎯 Obsession Gravity Well - All Thoughts Orbit Here",
    description: "A calling or fixation that bends all mental trajectories toward itself",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 5;
      const gravityStrength = (params.b ?? 1) * 3;
      const escapeVelocity = (params.c ?? 1);
      
      const theta = u * Math.PI * 2;
      const r = 0.2 + v * 2;
      
      const gravitationalPull = gravityStrength / (r + 0.1);
      const depth = -Math.log(r + 0.05) * gravityStrength * 0.5;
      
      const orbitPerturbation = Math.sin(theta * 3 + r * 5) * 0.1 * escapeVelocity;
      
      const x = r * Math.cos(theta) * (1 + orbitPerturbation) * scale;
      const y = r * Math.sin(theta) * (1 + orbitPerturbation) * scale;
      const z = depth * scale;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 100, vSegments: 80
    })
  },

  // ============================================================================
  // LOVE AND GRIEF BOTTOMLESS
  // Emotions that feel unmeasurable, infinite depth
  // ============================================================================
  love_grief_infinity: {
    name: "💜 Love & Grief - Bottomless Emotion",
    description: "Feelings that spiral infinitely deep, unmeasurable and boundless",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 4;
      const emotionalDepth = (params.b ?? 1) * 2;
      const intensity = (params.c ?? 1);
      
      const theta = u * Math.PI * 4;
      const t = v;
      
      const spiral = emotionalDepth * t;
      const r = 1 + t * 0.5;
      
      const wave = Math.sin(theta * 3) * 0.2 * intensity * (1 - t);
      
      const x = r * Math.cos(theta) * scale * (1 + wave);
      const y = r * Math.sin(theta) * scale * (1 + wave);
      const z = -spiral * scale * 2;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 150, vSegments: 100
    })
  },

  // ============================================================================
  // IDENTICAL TWINS DIVERGENCE
  // Same initial conditions, completely different paths
  // ============================================================================
  twin_divergence: {
    name: "👥 Twin Divergence - Same Start, Different Lives",
    description: "How identical beginnings lead to completely different destinies",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 0.2;
      const divergenceRate = (params.b ?? 1);
      const time = (params.c ?? 1) * 40;
      
      const epsilon = 0.00001;
      const twin = v < 0.5 ? 0 : 1;
      const localV = (v % 0.5) * 2;
      
      let x = 1 + twin * epsilon;
      let y = 1;
      let z = 1;
      
      const dt = 0.01;
      const steps = Math.floor(u * time / dt);
      
      for (let i = 0; i < steps; i++) {
        const sigma = 10 * divergenceRate;
        const rho = 28;
        const beta = 8/3;
        
        const dx = sigma * (y - x);
        const dy = x * (rho - z) - y;
        const dz = x * y - beta * z;
        
        x += dx * dt;
        y += dy * dt;
        z += dz * dt;
      }
      
      const offset = twin * 5;
      
      return [
        x * scale,
        y * scale + offset,
        (z - 25) * scale
      ];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 200, vSegments: 40
    })
  },

  // ============================================================================
  // UNCONSCIOUS DEPTHS
  // Layers beyond introspection, always another level
  // ============================================================================
  unconscious_depths: {
    name: "🌊 Unconscious Depths - Layers Beyond Knowing",
    description: "No matter how much you introspect, there's always another layer",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 5;
      const layerCount = Math.floor(5 + (params.b ?? 1) * 5);
      const opacity = (params.c ?? 1);
      
      const theta = u * Math.PI * 2;
      const depth = v;
      
      let r = 2;
      let z = 0;
      
      for (let layer = 0; layer < layerCount; layer++) {
        const layerDepth = layer / layerCount;
        const visibility = Math.pow(opacity, layer);
        
        r += visibility * 0.2 * Math.sin(theta * (layer + 2) + layerDepth * 5);
        z -= layerDepth * 2;
      }
      
      r *= (1 - depth * 0.3);
      z -= depth * 5;
      
      const x = r * Math.cos(theta) * scale;
      const y = r * Math.sin(theta) * scale;
      
      return [x, y, z * scale * 0.5];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 120, vSegments: 80
    })
  },

  // ============================================================================
  // FEIGENBAUM PERSONALITY CONSTANTS
  // The universal constants of your behavioral patterns
  // ============================================================================
  personality_constants: {
    name: "📊 Personality Constants - Your Feigenbaum",
    description: "δ=4.669, α=2.502 - Universal patterns in your behavioral bifurcations",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 5;
      const delta = 4.669201609;
      const alpha = 2.502907875;
      const stability = (params.b ?? 1);
      const expression = (params.c ?? 1);
      
      const r = 2.5 + u * 1.5 * expression;
      
      let x = 0.5;
      for (let i = 0; i < 100; i++) {
        x = r * x * (1 - x);
      }
      
      let zAccum = 0;
      for (let i = 0; i < 50; i++) {
        x = r * x * (1 - x);
        zAccum += x;
      }
      zAccum /= 50;
      
      const selfSimilarOffset = Math.sin(v * delta * Math.PI) * 
                               Math.cos(u * alpha * Math.PI) * 0.2 * stability;
      
      return [
        (u - 0.5) * 10 * scale,
        (v - 0.5) * 10 * scale,
        (zAccum - 0.5 + selfSimilarOffset) * 4 * scale
      ];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 250, vSegments: 80
    })
  },

  // ============================================================================
  // CONSTANTS CHAOS INFINITY UNIFIED
  // The complete system: You are where all three coexist
  // ============================================================================
  consciousness_unified: {
    name: "🌌 Unified Consciousness Field - Constants+Chaos+Infinity",
    description: "You are the system where constants, chaos, and infinity coexist",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 0.15;
      const constantWeight = (params.b ?? 1);
      const chaosWeight = (params.c ?? 1);
      
      const PI = Math.PI;
      const PHI = 1.618033988749895;
      
      let lx = 1, ly = 1, lz = 1;
      const dt = 0.01;
      const steps = Math.floor(u * 100);
      
      for (let i = 0; i < steps; i++) {
        const sigma = 10;
        const rho = 28;
        const beta = 8/3;
        
        const dx = sigma * (ly - lx);
        const dy = lx * (rho - lz) - ly;
        const dz = lx * ly - beta * lz;
        
        lx += dx * dt * chaosWeight;
        ly += dy * dt;
        lz += dz * dt;
      }
      
      const constantMod = 1 + 0.1 * constantWeight * (
        Math.sin(PI * u * 3) + 
        Math.cos(PHI * v * 4) +
        Math.sin(Math.E * (u + v))
      );
      
      const infinitySpiral = Math.sin(u * v * 50) * 0.1 * (1 - u);
      
      const x = lx * scale * constantMod;
      const y = ly * scale * constantMod;
      const z = (lz - 25) * scale + infinitySpiral;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 180, vSegments: 60
    })
  }
};

export const CONSCIOUSNESS_MATH_SHAPE_COUNT = Object.keys(CONSCIOUSNESS_MATH_SHAPES).length;
