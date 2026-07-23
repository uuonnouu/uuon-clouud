/**
 * The 9 Biggest Gaps in Cosmic History - Mathematical Visualizations
 * Based on BigThink analysis - Scientific framework for understanding cosmic mysteries
 * 
 * Each gap represents a fundamental question in cosmology with mathematical formulations
 */

export interface SurfaceParameters {
  a: number; b: number; c: number; d: number;
  e: number; f: number; g: number; h: number;
  i: number; j: number; k: number; l: number; m: number;
  uMin: number; uMax: number; vMin: number; vMax: number;
  uSegments: number; vSegments: number;
  [key: string]: number;
}

export interface ParametricSurface {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

function getCleanDefaults(overrides: Partial<SurfaceParameters> = {}): Partial<SurfaceParameters> {
  return {
    a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
    uMin: 0, uMax: 1, vMin: 0, vMax: 1,
    uSegments: 64, vSegments: 64,
    ...overrides
  };
}

export const COSMIC_HISTORY_GAPS: Record<string, ParametricSurface> = {
  // ═══════════════════════════════════════════════════════════════════════════
  // GAP 1: PRE-INFLATIONARY PHYSICS - The Ultimate Origin
  // ═══════════════════════════════════════════════════════════════════════════
  
  scalar_field_inflation: {
    name: '🌌 Scalar Field Inflation - Inflaton φ(x,t) = φ₀ + δφ(x,t)',
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.d ?? 2.0;
      const b = params.e ?? 1.5;
      const c = params.f ?? 1.0;
      
      const phi0 = a;
      const deltaPhi = b * Math.sin(u * Math.PI * 2 * 3) * Math.cos(v * Math.PI * 2 * 2);
      const phi = phi0 + deltaPhi;
      const potential = c * Math.pow(phi - 1, 2);
      
      const x = u * Math.PI * 2 * Math.cos(v * Math.PI * 2) * (1 + 0.3 * phi);
      const y = u * Math.PI * 2 * Math.sin(v * Math.PI * 2) * (1 + 0.3 * phi);
      const z = potential + 0.5 * deltaPhi;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2.0, e: 1.5, f: 1.0 })
  },

  quantum_foam_structure: {
    name: '🫧 Quantum Foam Structure - Planck-scale Δx·Δt ≥ ℓₚ·tₚ',
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.d ?? 1.0;
      const b = params.e ?? 0.5;
      const foamIntensity = params.f ?? 2.0;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const foam = b * (
        Math.sin(theta * 7 + phi * 5) * 0.3 +
        Math.cos(theta * 11 - phi * 3) * 0.2 +
        Math.sin(theta * 13 + phi * 7) * 0.15
      );
      
      const r = a + foam * foamIntensity * 0.1;
      
      return [
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(phi)
      ];
    },
    defaultParams: getCleanDefaults({ d: 1.0, e: 0.5, f: 2.0, uSegments: 96, vSegments: 48 })
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GAP 2: INFLATIONARY MECHANISMS - The Flavor Problem
  // ═══════════════════════════════════════════════════════════════════════════

  cosmic_inflation_exponential: {
    name: '📈 Cosmic Inflation Exponential - a(t) = a₀·e^(Ht)',
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.d ?? 1.0;
      const H = params.e ?? 0.5;
      const time = params.f ?? 2.0;
      
      const uScaled = (u - 0.5) * 2;
      const theta = v * Math.PI * 2;
      
      const scaleFactor = a * Math.exp(H * uScaled * time);
      const expansion = Math.min(scaleFactor, 5);
      
      return [
        expansion * Math.cos(theta) * Math.cos(uScaled),
        expansion * Math.sin(theta) * Math.cos(uScaled),
        expansion * Math.sin(uScaled) * 0.5
      ];
    },
    defaultParams: getCleanDefaults({ d: 1.0, e: 0.5, f: 2.0 })
  },

  primordial_gravitational_waves: {
    name: '🌊 Primordial Gravitational Waves - B-mode h_ij',
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const amplitude = params.d ?? 0.5;
      const k = params.e ?? 3.0;
      const omega = params.f ?? 1.0;
      
      const uScaled = (u - 0.5) * Math.PI * 2;
      const vScaled = (v - 0.5) * Math.PI * 2;
      
      const plusMode = amplitude * Math.cos(k * uScaled - omega * vScaled);
      const crossMode = amplitude * Math.sin(k * uScaled - omega * vScaled);
      
      return [
        uScaled + plusMode * 0.3 * Math.cos(vScaled),
        vScaled + crossMode * 0.3 * Math.sin(uScaled),
        (plusMode + crossMode) * 0.5
      ];
    },
    defaultParams: getCleanDefaults({ d: 0.5, e: 3.0, f: 1.0 })
  },

  inflaton_potential_landscape: {
    name: '⛰️ Inflaton Potential Landscape - V(φ) slow-roll',
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const m = params.d ?? 1.0;
      const lambda = params.e ?? 0.1;
      const modelMix = params.f ?? 0.5;
      
      const phi = (u - 0.5) * 4;
      const theta = v * Math.PI * 2;
      
      const V_quadratic = 0.5 * m * m * phi * phi;
      const V_quartic = 0.25 * lambda * Math.pow(phi, 4);
      const V = (1 - modelMix) * V_quadratic + modelMix * V_quartic;
      
      return [
        phi * Math.cos(theta),
        phi * Math.sin(theta),
        Math.min(V, 3)
      ];
    },
    defaultParams: getCleanDefaults({ d: 1.0, e: 0.1, f: 0.5 })
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GAP 3: BARYOGENESIS - The Matter-Antimatter Asymmetry
  // ═══════════════════════════════════════════════════════════════════════════

  electroweak_phase_transition: {
    name: '⚡ Electroweak Phase Transition - Higgs V(φ)',
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const mu = params.d ?? 1.0;
      const lambda = params.e ?? 0.5;
      const temp = params.f ?? 0.8;
      
      const phi = (u - 0.5) * 4;
      const theta = v * Math.PI * 2;
      
      const muEff = mu * mu * (1 - temp);
      const potential = -muEff * phi * phi + lambda * Math.pow(phi, 4);
      
      return [
        phi * Math.cos(theta) * (1 + 0.1 * Math.sin(theta * 3)),
        phi * Math.sin(theta) * (1 + 0.1 * Math.cos(theta * 3)),
        potential
      ];
    },
    defaultParams: getCleanDefaults({ d: 1.0, e: 0.5, f: 0.8 })
  },

  sphaleron_transitions: {
    name: '🔄 Sphaleron Transitions - Γ ∝ α_w⁵T⁴',
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const alpha = params.d ?? 0.03;
      const T = params.e ?? 100;
      const rate = params.f ?? 1.0;
      
      const gamma = Math.pow(alpha, 5) * Math.pow(T / 100, 4) * rate;
      const saddleHeight = 2 * (1 - gamma * 0.1);
      
      const phi1 = (u - 0.5) * 4;
      const phi2 = (v - 0.5) * 4;
      
      const energy = Math.pow(phi1, 2) - Math.pow(phi2, 2) + saddleHeight * Math.exp(-phi1*phi1 - phi2*phi2);
      
      return [phi1, phi2, energy * 0.5];
    },
    defaultParams: getCleanDefaults({ d: 0.03, e: 100, f: 1.0 })
  },

  cp_violation_mechanisms: {
    name: '⚖️ CP Violation - ηB ≈ 6×10⁻¹⁰',
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const cpPhase = params.d ?? 1.0;
      const asymmetry = params.e ?? 0.1;
      const strength = params.f ?? 1.5;
      
      const delta = cpPhase * Math.PI / 4;
      const uScaled = (u - 0.5) * Math.PI * 2;
      const vScaled = (v - 0.5) * Math.PI * 2;
      
      const matter = (1 + asymmetry) * Math.sin(uScaled + delta);
      const antimatter = (1 - asymmetry) * Math.sin(uScaled - delta);
      
      return [uScaled, vScaled, strength * (matter - antimatter) * Math.cos(vScaled)];
    },
    defaultParams: getCleanDefaults({ d: 1.0, e: 0.1, f: 1.5 })
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GAP 4: DARK MATTER NATURE - The Invisible Majority
  // ═══════════════════════════════════════════════════════════════════════════

  dark_matter_halo_structure: {
    name: '🌑 Dark Matter Halo - NFW ρ(r) = ρₛ/[(r/rₛ)(1+r/rₛ)²]',
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const rhoS = params.d ?? 1.0;
      const rS = params.e ?? 1.0;
      const scale = params.f ?? 2.0;
      
      const r = (u * 2 + 0.05) * scale;
      const theta = v * Math.PI * 2;
      
      const x_ratio = r / rS;
      const rho = rhoS / (x_ratio * Math.pow(1 + x_ratio, 2));
      const displayRho = Math.min(rho, 3);
      
      return [r * Math.cos(theta), r * Math.sin(theta), displayRho];
    },
    defaultParams: getCleanDefaults({ d: 1.0, e: 1.0, f: 2.0 })
  },

  wimp_dark_matter_detection: {
    name: '🔬 WIMP Detection - ⟨σv⟩ ≈ 3×10⁻²⁶ cm³/s',
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const sigmaV = params.d ?? 3;
      const mass = params.e ?? 100;
      const coupling = params.f ?? 0.1;
      
      const r = u * 3;
      const theta = v * Math.PI * 2;
      
      const logSigma = Math.log10(sigmaV + 1);
      const excluded = coupling * Math.exp(-r * r / 2) * Math.sin(theta * 2);
      
      return [
        r * Math.cos(theta),
        r * Math.sin(theta),
        logSigma * (1 + excluded) * 0.5
      ];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 100, f: 0.1 })
  },

  axion_field_oscillations: {
    name: '🌀 Axion Field - θ̈ + 3Hθ̇ + m_a²sin(θ) = 0',
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const mass = params.d ?? 1.0;
      const amplitude = params.e ?? 1.0;
      const decay = params.f ?? 0.1;
      
      const t = u * Math.PI * 2;
      const phi = v * Math.PI * 2;
      
      const theta = amplitude * Math.cos(mass * t * 5) * Math.exp(-decay * t);
      const thetaDot = -amplitude * mass * 5 * Math.sin(mass * t * 5) * Math.exp(-decay * t);
      
      return [t, theta * Math.cos(phi), theta * Math.sin(phi) + thetaDot * 0.1];
    },
    defaultParams: getCleanDefaults({ d: 1.0, e: 1.0, f: 0.1, uSegments: 96, vSegments: 48 })
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GAP 5: DARK ENERGY DYNAMICS - The Accelerating Universe
  // ═══════════════════════════════════════════════════════════════════════════

  phantom_dark_energy: {
    name: '👻 Phantom Dark Energy - w < -1 Big Rip',
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const w = params.d ?? -1.1;
      const rhoDE = params.e ?? 1.0;
      const time = params.f ?? 1.0;
      
      const t = u * 2;
      const theta = v * Math.PI * 2;
      
      const wClamped = Math.min(w, -1.01);
      const scaleFactor = Math.pow(Math.max(1 + time * t, 0.1), -2 / (3 * (1 + wClamped)));
      const clampedScale = Math.min(Math.max(scaleFactor, 0.1), 5);
      
      return [
        clampedScale * Math.cos(theta) * (1 + 0.2 * Math.sin(t * 3)),
        clampedScale * Math.sin(theta) * (1 + 0.2 * Math.cos(t * 3)),
        t * rhoDE * 0.5
      ];
    },
    defaultParams: getCleanDefaults({ d: -1.1, e: 1.0, f: 1.0 })
  },

  quintessence_field: {
    name: '✨ Quintessence - ρ_φ = ½φ̇² + V(φ)',
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const phiDot = params.d ?? 0.1;
      const V0 = params.e ?? 1.0;
      const alpha = params.f ?? 0.5;
      
      const phi = (u - 0.5) * 4;
      const theta = v * Math.PI * 2;
      
      const V = V0 * Math.exp(-alpha * phi);
      const kinetic = 0.5 * phiDot * phiDot;
      
      return [
        phi * Math.cos(theta),
        phi * Math.sin(theta),
        V + kinetic * Math.sin(theta * 2)
      ];
    },
    defaultParams: getCleanDefaults({ d: 0.1, e: 1.0, f: 0.5 })
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GAP 6: FIRST STARS AND GALAXIES - Cosmic Dawn
  // ═══════════════════════════════════════════════════════════════════════════

  primordial_star_formation: {
    name: '⭐ Primordial Stars - Jeans M_J = (5kT/Gm_H)^(3/2)',
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const temperature = params.d ?? 1.0;
      const density = params.e ?? 1.0;
      const mass = params.f ?? 1.0;
      
      const r = (u - 0.5) * 4;
      const theta = v * Math.PI * 2;
      
      const jeansRadius = Math.sqrt(temperature / (density + 0.001)) * 0.5;
      const collapse = Math.exp(-r * r / (2 * jeansRadius * jeansRadius));
      
      return [
        r * Math.cos(theta) * (1 - 0.3 * collapse),
        r * Math.sin(theta) * (1 - 0.3 * collapse),
        collapse * mass * 2
      ];
    },
    defaultParams: getCleanDefaults({ d: 1.0, e: 1.0, f: 1.0 })
  },

  cosmic_web_filaments: {
    name: '🕸️ Cosmic Web Filaments - δ(x) density perturbations',
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const amplitude = params.d ?? 1.0;
      const k1 = params.e ?? 2.0;
      const k2 = params.f ?? 3.0;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const delta = amplitude * (
        Math.sin(k1 * theta) * Math.cos(k2 * phi) +
        0.5 * Math.sin(k2 * theta + k1 * phi) +
        0.3 * Math.cos(k1 * theta - k2 * phi)
      );
      
      const r = 2 + 0.5 * delta;
      
      return [
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(phi)
      ];
    },
    defaultParams: getCleanDefaults({ d: 1.0, e: 2.0, f: 3.0, vSegments: 32 })
  },

  reionization_bubbles: {
    name: '💫 Reionization Bubbles - R_ion ionization fronts',
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const numPhotons = params.d ?? 1.0;
      const nH = params.e ?? 1.0;
      const time = params.f ?? 1.0;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const Rion = Math.pow(3 * numPhotons / (4 * Math.PI * nH + 0.001), 1/3) * time;
      const bubbleR = Math.min(Rion * 2, 3);
      
      return [
        bubbleR * Math.cos(theta) * Math.sin(phi) * (1 + 0.2 * Math.sin(theta * 5 + phi * 3)),
        bubbleR * Math.sin(theta) * Math.sin(phi) * (1 + 0.2 * Math.cos(theta * 3 + phi * 5)),
        bubbleR * Math.cos(phi) * (1 + 0.1 * Math.sin(theta * 4))
      ];
    },
    defaultParams: getCleanDefaults({ d: 1.0, e: 1.0, f: 1.0, vSegments: 32 })
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GAP 7: SUPERMASSIVE BLACK HOLE FORMATION - The Mass Problem
  // ═══════════════════════════════════════════════════════════════════════════

  supermassive_black_hole_formation: {
    name: '🕳️ SMBH Formation - M(t) = M₀·e^(t/t_Sal)',
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const M0 = params.d ?? 100;
      const tSal = params.e ?? 45;
      const time = params.f ?? 1.0;
      
      const theta = v * Math.PI * 2;
      
      const growthFactor = Math.exp((time * u) / (tSal * 0.01));
      const mass = M0 * Math.min(growthFactor, 1e4);
      const rs = 2 * Math.log10(mass + 1) * 0.1;
      
      return [
        (rs + 0.5) * Math.cos(theta) * Math.sin(u * Math.PI),
        (rs + 0.5) * Math.sin(theta) * Math.sin(u * Math.PI),
        Math.log10(mass + 1) * 0.3
      ];
    },
    defaultParams: getCleanDefaults({ d: 100, e: 45, f: 1.0 })
  },

  quasar_accretion_disk: {
    name: '💿 Quasar Accretion Disk - L_Edd Eddington limit',
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const mass = params.d ?? 1.0;
      const accretionRate = params.e ?? 0.1;
      const spin = params.f ?? 0.9;
      
      const r = u * 3 + 0.5;
      const phi = v * Math.PI * 2;
      
      const diskHeight = 0.1 * Math.exp(-Math.pow(r - 2, 2)) * accretionRate * (1 + spin * 0.5);
      
      return [
        r * Math.cos(phi),
        r * Math.sin(phi),
        diskHeight * Math.sin(phi * 2 + r)
      ];
    },
    defaultParams: getCleanDefaults({ d: 1.0, e: 0.1, f: 0.9 })
  },

  primordial_black_hole_merger: {
    name: '💥 PBH Merger - Chirp h(t) gravitational waves',
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const m1 = params.d ?? 30;
      const m2 = params.e ?? 30;
      const distance = params.f ?? 100;
      
      const chirpMass = Math.pow(m1 * m2, 0.6) / Math.pow(m1 + m2 + 0.001, 0.2);
      const f = 0.1 + u * 0.9;
      const amplitude = chirpMass / (distance + 0.001) * Math.pow(f, -7/6) * 0.1;
      
      const phase = 2 * Math.PI * f * v * 4;
      const hPlus = amplitude * Math.cos(phase);
      const hCross = amplitude * Math.sin(phase);
      
      return [u * 2, hPlus, hCross];
    },
    defaultParams: getCleanDefaults({ d: 30, e: 30, f: 100, vSegments: 128 })
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GAP 8: GALAXY FORMATION EFFICIENCY - The Missing Satellite Problem
  // ═══════════════════════════════════════════════════════════════════════════

  galaxy_formation_simulation: {
    name: '🌀 Galaxy Formation - Press-Schechter f(M)',
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const deltaC = params.d ?? 1.686;
      const sigma0 = params.e ?? 1.0;
      const alpha = params.f ?? -0.5;
      
      const M = Math.exp((u - 0.25) * 4);
      const sigma = sigma0 * Math.pow(M, alpha / 3);
      
      const f = Math.sqrt(2 / Math.PI) * Math.abs(alpha / 3) * deltaC / (sigma * sigma + 0.001) * 
                Math.exp(-deltaC * deltaC / (2 * sigma * sigma + 0.001));
      
      return [
        (u - 0.25) * 4,
        Math.log10(f + 1e-10) + 5,
        (v - 0.5) * Math.sin(u * 2)
      ];
    },
    defaultParams: getCleanDefaults({ d: 1.686, e: 1.0, f: -0.5, vSegments: 32 })
  },

  stellar_feedback_mechanisms: {
    name: '💥 Stellar Feedback - ε_SN supernova outflows',
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const E_SN = params.d ?? 1.0;
      const M_bar = params.e ?? 1.0;
      const velocity = params.f ?? 1.0;
      
      const epsilon = E_SN / (M_bar + 0.001);
      const r = u * 3 + 0.5;
      const theta = v * Math.PI * 2;
      
      const outflowZ = epsilon * r * Math.exp(-r * r / 4) * velocity;
      const diskR = r * (1 - 0.3 * Math.exp(-r));
      
      return [
        diskR * Math.cos(theta),
        diskR * Math.sin(theta),
        outflowZ * Math.sin(theta * 2 + r)
      ];
    },
    defaultParams: getCleanDefaults({ d: 1.0, e: 1.0, f: 1.0 })
  },

  dwarf_galaxy_evolution: {
    name: '🔹 Dwarf Galaxy - L ∝ v_max⁴ Tully-Fisher',
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const vMax = params.d ?? 50;
      const stellarMass = params.e ?? 1.0;
      const feedback = params.f ?? 0.5;
      
      const L = Math.pow(vMax / 50, 4);
      const r = u * L * 0.1 + 0.3;
      const theta = v * Math.PI * 2;
      
      const surfaceBrightness = Math.exp(-r / (0.5 + feedback)) * stellarMass;
      
      return [
        r * Math.cos(theta),
        r * Math.sin(theta),
        surfaceBrightness * (1 + 0.2 * Math.sin(theta * 3))
      ];
    },
    defaultParams: getCleanDefaults({ d: 50, e: 1.0, f: 0.5 })
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GAP 9: FINE-TUNING AND ANTHROPIC PRINCIPLES - The Multiverse Question
  // ═══════════════════════════════════════════════════════════════════════════

  fine_tuning_parameters: {
    name: '🎯 Fine Tuning - α = e²/4πε₀ℏc ≈ 1/137',
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const alpha = params.d ?? 1.0;
      const lambda_ratio = params.e ?? 1.0;
      const sensitivity = params.f ?? 1.0;
      
      const uScaled = (u - 0.5) * 4;
      const vScaled = (v - 0.5) * 4;
      
      const alphaVariation = alpha * (1 + 0.1 * Math.sin(uScaled * 5));
      const lambdaVariation = lambda_ratio * Math.sin(vScaled * 3);
      
      const habitability = Math.exp(-sensitivity * Math.pow(alphaVariation - 1, 2)) *
                           Math.exp(-sensitivity * Math.pow(lambdaVariation, 2) * 0.1);
      
      return [uScaled, vScaled, habitability * 2];
    },
    defaultParams: getCleanDefaults({ d: 1.0, e: 1.0, f: 1.0 })
  }
};

export const COSMIC_GAP_NAMES = [
  'Pre-Inflationary Physics',
  'Inflationary Mechanisms',
  'Baryogenesis',
  'Dark Matter Nature',
  'Dark Energy Dynamics',
  'First Stars and Galaxies',
  'SMBH Formation',
  'Galaxy Formation Efficiency',
  'Fine-Tuning and Anthropic'
];

export function getCosmicGapShapes(): string[] {
  return Object.keys(COSMIC_HISTORY_GAPS);
}

export function getShapesByGap(gapNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9): string[] {
  const gapNames: Record<number, string[]> = {
    1: ['scalar_field_inflation', 'quantum_foam_structure'],
    2: ['cosmic_inflation_exponential', 'primordial_gravitational_waves', 'inflaton_potential_landscape'],
    3: ['electroweak_phase_transition', 'sphaleron_transitions', 'cp_violation_mechanisms'],
    4: ['dark_matter_halo_structure', 'wimp_dark_matter_detection', 'axion_field_oscillations'],
    5: ['phantom_dark_energy', 'quintessence_field'],
    6: ['primordial_star_formation', 'cosmic_web_filaments', 'reionization_bubbles'],
    7: ['supermassive_black_hole_formation', 'quasar_accretion_disk', 'primordial_black_hole_merger'],
    8: ['galaxy_formation_simulation', 'stellar_feedback_mechanisms', 'dwarf_galaxy_evolution'],
    9: ['fine_tuning_parameters']
  };
  return gapNames[gapNumber] || [];
}

console.log(`🌌 Loaded ${Object.keys(COSMIC_HISTORY_GAPS).length} Cosmic History Gap visualizations across 9 fundamental mysteries`);
