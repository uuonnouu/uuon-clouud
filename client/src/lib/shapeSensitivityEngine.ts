/**
 * SHAPE SENSITIVITY ENGINE
 * Classifies shapes by their mathematical complexity and parameter sensitivity
 * Provides parameter dampening for chaotic shapes to prevent visual glitches
 * 
 * Sensitivity Levels:
 * - stable (1.0): Basic shapes - parameters have linear, predictable effects
 * - responsive (0.5): Moderate complexity - some non-linear behavior
 * - sensitive (0.25): High complexity - significant non-linear effects
 * - chaotic (0.1): Extreme complexity - small changes create large visual shifts
 * 
 * © 2025 UUON Foundation Inc.
 */

export type SensitivityLevel = 'stable' | 'responsive' | 'sensitive' | 'chaotic';

export interface ShapeSensitivityProfile {
  level: SensitivityLevel;
  dampingFactor: number;
  interpolationSpeed: number;
  recommendedScale: 'micro' | 'meso' | 'macro';
  formula: string;
  category: string;
  parameterNotes: string;
}

const DAMPING_FACTORS: Record<SensitivityLevel, number> = {
  stable: 1.0,
  responsive: 0.5,
  sensitive: 0.25,
  chaotic: 0.1
};

const INTERPOLATION_SPEEDS: Record<SensitivityLevel, number> = {
  stable: 1.0,
  responsive: 0.8,
  sensitive: 0.5,
  chaotic: 0.3
};

const SHAPE_FORMULAS: Record<string, { formula: string; sensitivity: SensitivityLevel; category: string }> = {
  sphere: { formula: 'x = r·sin(φ)·cos(θ), y = r·sin(φ)·sin(θ), z = r·cos(φ)', sensitivity: 'stable', category: 'basic' },
  cube: { formula: 'Parametric box: [-a,a] × [-b,b] × [-c,c]', sensitivity: 'stable', category: 'basic' },
  torus: { formula: 'x = (R + r·cos(v))·cos(u), y = (R + r·cos(v))·sin(u), z = r·sin(v)', sensitivity: 'stable', category: 'basic' },
  cylinder: { formula: 'x = r·cos(θ), y = r·sin(θ), z = h', sensitivity: 'stable', category: 'basic' },
  cone: { formula: 'x = (1-t)·r·cos(θ), y = (1-t)·r·sin(θ), z = h·t', sensitivity: 'stable', category: 'basic' },
  
  shape_of_universe: { formula: 'Ψ(u,v) = Σ[φⁿ·sin(nπu)·cos(mπv)] + Λ·∫∫ρ(u,v)dA', sensitivity: 'chaotic', category: 'cosmology' },
  
  lorenz_attractor: { formula: 'dx/dt = σ(y-x), dy/dt = x(ρ-z)-y, dz/dt = xy-βz', sensitivity: 'chaotic', category: 'chaos' },
  lorenz_butterfly_surface: { formula: 'Lorenz system: σ=10, ρ=28, β=8/3', sensitivity: 'chaotic', category: 'chaos' },
  rossler_attractor: { formula: 'dx/dt = -y-z, dy/dt = x+ay, dz/dt = b+z(x-c)', sensitivity: 'chaotic', category: 'chaos' },
  strange_attractor: { formula: 'Chaotic trajectory in phase space', sensitivity: 'chaotic', category: 'chaos' },
  julia_fractal: { formula: 'z_{n+1} = z_n² + c, |c| = const', sensitivity: 'chaotic', category: 'fractal' },
  mandelbrot_fractal: { formula: 'z_{n+1} = z_n² + c, c = pixel', sensitivity: 'chaotic', category: 'fractal' },
  mandelbulb: { formula: 'r^n(sin(nθ)cos(nφ), sin(nθ)sin(nφ), cos(nθ))', sensitivity: 'chaotic', category: 'fractal' },
  
  klein_bottle: { formula: 'Non-orientable surface with self-intersection', sensitivity: 'sensitive', category: 'topology' },
  mobius_strip: { formula: 'x = (1+v/2·cos(u/2))·cos(u), y = (1+v/2·cos(u/2))·sin(u), z = v/2·sin(u/2)', sensitivity: 'responsive', category: 'topology' },
  trefoil_knot: { formula: 'x = sin(t)+2sin(2t), y = cos(t)-2cos(2t), z = -sin(3t)', sensitivity: 'sensitive', category: 'topology' },
  figure_eight_knot: { formula: '4₁ knot: (2+cos(2t))cos(3t)', sensitivity: 'sensitive', category: 'topology' },
  
  dna_double_helix: { formula: 'Helical pair: r(t) = R·(cos(ωt), sin(ωt), kt)', sensitivity: 'responsive', category: 'biology' },
  protein_fold: { formula: 'α-helix backbone: φ=-57°, ψ=-47°', sensitivity: 'sensitive', category: 'biology' },
  ribosome_structure: { formula: '3D ribosomal subunit topology', sensitivity: 'sensitive', category: 'biology' },
  cell_membrane: { formula: 'Lipid bilayer: amphiphilic arrangement', sensitivity: 'responsive', category: 'biology' },
  mitochondria: { formula: 'Double membrane with cristae folding', sensitivity: 'sensitive', category: 'biology' },
  
  hydrogen_orbital: { formula: 'ψ_{nlm} = R_{nl}(r)·Y_l^m(θ,φ)', sensitivity: 'sensitive', category: 'quantum' },
  electron_cloud: { formula: '|ψ|² probability density', sensitivity: 'sensitive', category: 'quantum' },
  wave_function: { formula: 'iℏ∂ψ/∂t = Ĥψ (Schrödinger equation)', sensitivity: 'chaotic', category: 'quantum' },
  schrodinger_harmonic: { formula: 'ψ_n = H_n(x)·e^{-x²/2}', sensitivity: 'sensitive', category: 'quantum' },
  bloch_sphere: { formula: '|ψ⟩ = cos(θ/2)|0⟩ + e^{iφ}sin(θ/2)|1⟩', sensitivity: 'responsive', category: 'quantum' },
  quantum_entanglement: { formula: '|ψ⟩ = (|00⟩ + |11⟩)/√2', sensitivity: 'chaotic', category: 'quantum' },
  
  schwarzschild_metric: { formula: 'ds² = -(1-rs/r)dt² + (1-rs/r)⁻¹dr² + r²dΩ²', sensitivity: 'chaotic', category: 'relativity' },
  kerr_black_hole: { formula: 'Rotating black hole: a = J/Mc', sensitivity: 'chaotic', category: 'relativity' },
  spacetime_curvature: { formula: 'Rμν - ½gμνR = 8πGTμν', sensitivity: 'chaotic', category: 'relativity' },
  gravitational_wave: { formula: 'h_+ = A(1+cos²i)cos(2πft)', sensitivity: 'sensitive', category: 'relativity' },
  wormhole: { formula: 'Einstein-Rosen bridge: ds² throat', sensitivity: 'chaotic', category: 'relativity' },
  
  elliptic_curve: { formula: 'y² = x³ + ax + b (mod p)', sensitivity: 'sensitive', category: 'cryptography' },
  aes_sbox: { formula: 'GF(2⁸) substitution with affine transform', sensitivity: 'responsive', category: 'cryptography' },
  sha256_round: { formula: 'Σ₀, Σ₁, Ch, Maj bitwise functions', sensitivity: 'sensitive', category: 'cryptography' },
  rsa_modular: { formula: 'c = m^e mod n, m = c^d mod n', sensitivity: 'responsive', category: 'cryptography' },
  
  gradient_descent: { formula: 'θ_{t+1} = θ_t - η∇L(θ)', sensitivity: 'sensitive', category: 'ml' },
  neural_network: { formula: 'y = σ(Wx + b), σ = activation', sensitivity: 'sensitive', category: 'ml' },
  loss_surface: { formula: 'L(θ) = 1/n Σ(y - ŷ)²', sensitivity: 'chaotic', category: 'ml' },
  transformer_attention: { formula: 'Attention(Q,K,V) = softmax(QK^T/√d)V', sensitivity: 'chaotic', category: 'ml' },
  cnn_feature_map: { formula: '(f * g)(t) = ∫f(τ)g(t-τ)dτ', sensitivity: 'sensitive', category: 'ml' },
  
  calabi_yau: { formula: 'Ricci-flat Kähler manifold', sensitivity: 'chaotic', category: '4d' },
  tesseract: { formula: '4D hypercube: 8 cubic cells', sensitivity: 'sensitive', category: '4d' },
  hypersphere: { formula: 'x² + y² + z² + w² = r²', sensitivity: 'sensitive', category: '4d' },
  penrose_tiling: { formula: 'Aperiodic rhombus tiles: φ ratio', sensitivity: 'chaotic', category: '4d' },
  
  golden_spiral: { formula: 'r = ae^{bθ}, b = ln(φ)/(π/2)', sensitivity: 'stable', category: 'math' },
  fibonacci_surface: { formula: 'F_n = F_{n-1} + F_{n-2}', sensitivity: 'responsive', category: 'math' },
  euler_identity: { formula: 'e^{iπ} + 1 = 0', sensitivity: 'stable', category: 'math' },
  riemann_zeta: { formula: 'ζ(s) = Σ 1/n^s', sensitivity: 'chaotic', category: 'math' },
  
  maxwell_field: { formula: '∇×E = -∂B/∂t, ∇×B = μ₀J + μ₀ε₀∂E/∂t', sensitivity: 'sensitive', category: 'physics' },
  higgs_field: { formula: 'V(φ) = μ²|φ|² + λ|φ|⁴', sensitivity: 'chaotic', category: 'physics' },
  yang_mills: { formula: 'F_μν = ∂_μA_ν - ∂_νA_μ + g[A_μ,A_ν]', sensitivity: 'chaotic', category: 'physics' },
  
  bekenstein_hawking_entropy: { formula: 'S = kA/4l_p²', sensitivity: 'chaotic', category: 'entropy' },
  entropy_production_flow: { formula: 'dS/dt = Σ J_i X_i ≥ 0', sensitivity: 'sensitive', category: 'entropy' },
  boltzmann_entropy: { formula: 'S = k_B ln(W)', sensitivity: 'responsive', category: 'entropy' },
  
  heart_anatomy: { formula: 'Cardiac chambers: 4-chambered pump', sensitivity: 'responsive', category: 'anatomy' },
  brain_cortex: { formula: 'Folded surface: gyri and sulci', sensitivity: 'sensitive', category: 'anatomy' },
  lung_bronchi: { formula: 'Fractal branching: L-system', sensitivity: 'chaotic', category: 'anatomy' },
  
  supernova_remnant: { formula: 'Expanding shell: r = vt + r₀', sensitivity: 'sensitive', category: 'astronomy' },
  galaxy_spiral: { formula: 'Logarithmic spiral: r = ae^{bθ}', sensitivity: 'responsive', category: 'astronomy' },
  neutron_star: { formula: 'Degenerate matter: ρ ~ 10¹⁷ kg/m³', sensitivity: 'chaotic', category: 'astronomy' },
  
  m_theory_11d_membrane: { formula: 'M-brane: 11-dimensional supergravity', sensitivity: 'chaotic', category: 'string' },
  string_vibration: { formula: 'S = -T∫d²σ√(-h)h^{ab}∂_aX^μ∂_bX_μ', sensitivity: 'chaotic', category: 'string' },
  
  voxel_terrain: { formula: 'Perlin noise: f(x) = Σ p^i·noise(2^i·x)', sensitivity: 'sensitive', category: 'procedural' },
  simplex_noise: { formula: 'Simplex lattice interpolation', sensitivity: 'sensitive', category: 'procedural' }
};

const CATEGORY_PATTERNS: Record<string, { sensitivity: SensitivityLevel; pattern: RegExp }[]> = {
  chaotic: [
    { sensitivity: 'chaotic', pattern: /fractal|mandel|julia|chaos|strange|attractor|turbulent|entropy|quantum.*gravity|string.*theory|m.*theory|calabi|black.*hole|wormhole|singularity|higgs|yang.*mills|riemann.*zeta|loss.*surface|transformer/i },
  ],
  sensitive: [
    { sensitivity: 'sensitive', pattern: /quantum|orbital|wave.*function|schrodinger|topology|knot|klein|mobius|protein|dna|neural|gradient|maxwell|field.*theory|tesseract|hyper|4d|encryption|hash|curve.*crypto/i },
  ],
  responsive: [
    { sensitivity: 'responsive', pattern: /spiral|helix|torus.*knot|cell|membrane|fibonacci|biology|anatomy|galaxy|modulo|wave|oscillat/i },
  ],
  stable: [
    { sensitivity: 'stable', pattern: /sphere|cube|cylinder|cone|plane|box|prism|pyramid|basic|simple|regular/i },
  ]
};

export function getShapeSensitivity(shapeType: string): ShapeSensitivityProfile {
  const shapeLower = shapeType.toLowerCase();
  
  if (SHAPE_FORMULAS[shapeLower]) {
    const info = SHAPE_FORMULAS[shapeLower];
    return {
      level: info.sensitivity,
      dampingFactor: DAMPING_FACTORS[info.sensitivity],
      interpolationSpeed: INTERPOLATION_SPEEDS[info.sensitivity],
      recommendedScale: getRecommendedScale(info.category),
      formula: info.formula,
      category: info.category,
      parameterNotes: getParameterNotes(info.sensitivity)
    };
  }
  
  for (const [_, patterns] of Object.entries(CATEGORY_PATTERNS)) {
    for (const { sensitivity, pattern } of patterns) {
      if (pattern.test(shapeLower)) {
        return {
          level: sensitivity,
          dampingFactor: DAMPING_FACTORS[sensitivity],
          interpolationSpeed: INTERPOLATION_SPEEDS[sensitivity],
          recommendedScale: inferScaleFromShape(shapeLower),
          formula: inferFormula(shapeLower),
          category: inferCategory(shapeLower),
          parameterNotes: getParameterNotes(sensitivity)
        };
      }
    }
  }
  
  return {
    level: 'responsive',
    dampingFactor: 0.5,
    interpolationSpeed: 0.8,
    recommendedScale: 'meso',
    formula: `Parametric surface: r(u,v) = [x(u,v), y(u,v), z(u,v)]`,
    category: 'general',
    parameterNotes: 'Moderate parameter sensitivity'
  };
}

function getRecommendedScale(category: string): 'micro' | 'meso' | 'macro' {
  switch (category) {
    case 'quantum':
    case 'cryptography':
    case 'fractal':
      return 'micro';
    case 'biology':
    case 'anatomy':
    case 'ml':
    case 'topology':
      return 'meso';
    case 'cosmology':
    case 'relativity':
    case 'astronomy':
    case 'string':
    case 'entropy':
      return 'macro';
    default:
      return 'meso';
  }
}

function getParameterNotes(sensitivity: SensitivityLevel): string {
  switch (sensitivity) {
    case 'stable':
      return 'Parameters have linear, predictable effects. Full slider range recommended.';
    case 'responsive':
      return 'Moderate sensitivity. Parameters respond proportionally with some curvature.';
    case 'sensitive':
      return 'High sensitivity. Small parameter changes can create significant visual effects.';
    case 'chaotic':
      return 'Extreme sensitivity. Parameters dampened to prevent visual instability.';
  }
}

function inferFormula(shapeType: string): string {
  const shapeLower = shapeType.toLowerCase();
  
  if (shapeLower.includes('spiral')) return 'r = ae^{bθ} (logarithmic spiral)';
  if (shapeLower.includes('helix')) return 'r(t) = (cos(t), sin(t), kt)';
  if (shapeLower.includes('wave')) return 'z = A·sin(kx - ωt)';
  if (shapeLower.includes('torus')) return '(R + r·cos(v))·cos(u), (R + r·cos(v))·sin(u), r·sin(v)';
  if (shapeLower.includes('surface')) return 'z = f(x, y) parametric surface';
  if (shapeLower.includes('field')) return '∇ · F = ρ, ∇ × F = J';
  if (shapeLower.includes('manifold')) return 'M^n embedded in ℝ^{n+k}';
  if (shapeLower.includes('fractal')) return 'z_{n+1} = f(z_n) iterated function';
  if (shapeLower.includes('tensor')) return 'T^{μν} = ∂^μφ∂^νφ - g^{μν}L';
  if (shapeLower.includes('quantum')) return 'ψ(x,t) = ⟨x|ψ(t)⟩';
  if (shapeLower.includes('entropy')) return 'S = -k_B Σ p_i ln(p_i)';
  if (shapeLower.includes('gravity')) return 'G_μν = 8πG T_μν';
  
  return `Mathematical parametric surface: ${shapeType.replace(/_/g, ' ')}`;
}

function inferCategory(shapeType: string): string {
  const shapeLower = shapeType.toLowerCase();
  
  if (/quantum|orbital|wave.*function|bloch|entangle/i.test(shapeLower)) return 'quantum';
  if (/dna|protein|cell|membrane|bio|ribosome/i.test(shapeLower)) return 'biology';
  if (/brain|heart|lung|anatomy|organ/i.test(shapeLower)) return 'anatomy';
  if (/fractal|mandel|julia|chaos/i.test(shapeLower)) return 'fractal';
  if (/galaxy|star|cosmic|universe|black.*hole/i.test(shapeLower)) return 'cosmology';
  if (/crypto|aes|sha|rsa|elliptic.*curve/i.test(shapeLower)) return 'cryptography';
  if (/neural|gradient|loss|cnn|rnn|transformer/i.test(shapeLower)) return 'ml';
  if (/knot|klein|mobius|manifold|topology/i.test(shapeLower)) return 'topology';
  if (/einstein|relativity|spacetime|metric/i.test(shapeLower)) return 'relativity';
  if (/entropy|thermodynamic|boltzmann/i.test(shapeLower)) return 'entropy';
  if (/string|m.*theory|brane/i.test(shapeLower)) return 'string';
  if (/4d|hyper|tesseract|polytope/i.test(shapeLower)) return '4d';
  
  return 'mathematical';
}

function inferScaleFromShape(shapeType: string): 'micro' | 'meso' | 'macro' {
  const category = inferCategory(shapeType);
  return getRecommendedScale(category);
}

export function applyDampening(
  value: number, 
  previousValue: number, 
  shapeType: string
): number {
  const profile = getShapeSensitivity(shapeType);
  const dampingFactor = profile.dampingFactor;
  const interpolationSpeed = profile.interpolationSpeed;
  
  const dampedDelta = (value - previousValue) * dampingFactor;
  const newValue = previousValue + dampedDelta * interpolationSpeed;
  
  return newValue;
}

export function getDampenedSliderStep(
  baseStep: number,
  shapeType: string
): number {
  const profile = getShapeSensitivity(shapeType);
  return baseStep / profile.dampingFactor;
}

export function getSmoothedValue(
  targetValue: number,
  currentValue: number,
  shapeType: string,
  deltaTime: number = 0.016
): number {
  const profile = getShapeSensitivity(shapeType);
  const speed = profile.interpolationSpeed * 10;
  const t = 1 - Math.exp(-speed * deltaTime);
  return currentValue + (targetValue - currentValue) * t;
}

export function getShapeFormula(shapeType: string): string {
  const shapeLower = shapeType.toLowerCase();
  
  if (SHAPE_FORMULAS[shapeLower]) {
    return SHAPE_FORMULAS[shapeLower].formula;
  }
  
  return inferFormula(shapeType);
}

export function getAllSensitivityLevels(): Record<SensitivityLevel, string> {
  return {
    stable: 'Basic shapes with linear parameter response (damping: 1.0x)',
    responsive: 'Moderate complexity with proportional response (damping: 0.5x)',
    sensitive: 'High complexity requiring careful parameter adjustment (damping: 0.25x)',
    chaotic: 'Extreme sensitivity - parameters heavily dampened (damping: 0.1x)'
  };
}

export function getSensitivityColor(level: SensitivityLevel): string {
  switch (level) {
    case 'stable': return 'text-green-400';
    case 'responsive': return 'text-blue-400';
    case 'sensitive': return 'text-yellow-400';
    case 'chaotic': return 'text-red-400';
  }
}

export function getSensitivityBgColor(level: SensitivityLevel): string {
  switch (level) {
    case 'stable': return 'bg-green-500/20';
    case 'responsive': return 'bg-blue-500/20';
    case 'sensitive': return 'bg-yellow-500/20';
    case 'chaotic': return 'bg-red-500/20';
  }
}
