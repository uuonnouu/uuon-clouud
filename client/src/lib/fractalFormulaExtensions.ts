export interface FractalFormula {
  id: string;
  name: string;
  formula: string;
  category: string;
  description: string;
  visualEffect: string;
  compute: (z: { re: number; im: number }, c: { re: number; im: number }, params?: Record<string, number>) => { re: number; im: number };
}

export const FORMULA_CATEGORIES = {
  polynomial: 'Polynomial Extensions',
  hybrid: 'Polynomial Hybrids',
  absolute: 'Burning Ship Variants',
  trigonometric: 'Trigonometric',
  exponential: 'Exponential/Logarithmic',
  rational: 'Rational/Division',
  physics: 'Physics-Inspired'
} as const;

function complexMul(a: { re: number; im: number }, b: { re: number; im: number }): { re: number; im: number } {
  return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re };
}

function complexPow(z: { re: number; im: number }, n: number): { re: number; im: number } {
  const r = Math.sqrt(z.re * z.re + z.im * z.im);
  const theta = Math.atan2(z.im, z.re);
  const rn = Math.pow(r, n);
  return { re: rn * Math.cos(n * theta), im: rn * Math.sin(n * theta) };
}

function complexExp(z: { re: number; im: number }): { re: number; im: number } {
  const expRe = Math.exp(z.re);
  return { re: expRe * Math.cos(z.im), im: expRe * Math.sin(z.im) };
}

function complexSin(z: { re: number; im: number }): { re: number; im: number } {
  return {
    re: Math.sin(z.re) * Math.cosh(z.im),
    im: Math.cos(z.re) * Math.sinh(z.im)
  };
}

function complexCos(z: { re: number; im: number }): { re: number; im: number } {
  return {
    re: Math.cos(z.re) * Math.cosh(z.im),
    im: -Math.sin(z.re) * Math.sinh(z.im)
  };
}

function complexTan(z: { re: number; im: number }): { re: number; im: number } {
  const s = complexSin(z);
  const c = complexCos(z);
  const denom = c.re * c.re + c.im * c.im;
  if (denom < 1e-10) return { re: 0, im: 0 };
  return { re: (s.re * c.re + s.im * c.im) / denom, im: (s.im * c.re - s.re * c.im) / denom };
}

function complexLog(z: { re: number; im: number }): { re: number; im: number } {
  const r = Math.sqrt(z.re * z.re + z.im * z.im);
  if (r < 1e-10) return { re: -10, im: 0 };
  return { re: Math.log(r), im: Math.atan2(z.im, z.re) };
}

function complexSinh(z: { re: number; im: number }): { re: number; im: number } {
  return {
    re: Math.sinh(z.re) * Math.cos(z.im),
    im: Math.cosh(z.re) * Math.sin(z.im)
  };
}

function complexCosh(z: { re: number; im: number }): { re: number; im: number } {
  return {
    re: Math.cosh(z.re) * Math.cos(z.im),
    im: Math.sinh(z.re) * Math.sin(z.im)
  };
}

export const FRACTAL_FORMULAS: FractalFormula[] = [
  // Polynomial Extensions
  { id: 'z2c', name: 'Classic Mandelbrot', formula: 'z² + c', category: 'polynomial', description: 'Standard quadratic iteration', visualEffect: 'Traditional Mandelbrot shape', compute: (z, c) => ({ re: z.re * z.re - z.im * z.im + c.re, im: 2 * z.re * z.im + c.im }) },
  { id: 'z3c', name: 'Cubic Star', formula: 'z³ + c', category: 'polynomial', description: 'Third power iteration', visualEffect: 'Triple-arm spirals', compute: (z, c) => { const p = complexPow(z, 3); return { re: p.re + c.re, im: p.im + c.im }; } },
  { id: 'z4c', name: 'Quartic Floral', formula: 'z⁴ + c', category: 'polynomial', description: 'Fourth power extension', visualEffect: 'Four-fold flowers', compute: (z, c) => { const p = complexPow(z, 4); return { re: p.re + c.re, im: p.im + c.im }; } },
  { id: 'z5c', name: 'Quintic Snowflake', formula: 'z⁵ + c', category: 'polynomial', description: 'Fifth power behavior', visualEffect: 'Pentagonal symmetry', compute: (z, c) => { const p = complexPow(z, 5); return { re: p.re + c.re, im: p.im + c.im }; } },
  { id: 'z6c', name: 'Hexic Radiant', formula: 'z⁶ + c', category: 'polynomial', description: 'Sixth-power expansion', visualEffect: 'Six-fold star shapes', compute: (z, c) => { const p = complexPow(z, 6); return { re: p.re + c.re, im: p.im + c.im }; } },
  { id: 'z7c', name: 'Septic Vortex', formula: 'z⁷ + c', category: 'polynomial', description: 'Seventh power twists', visualEffect: 'Vortex ropes', compute: (z, c) => { const p = complexPow(z, 7); return { re: p.re + c.re, im: p.im + c.im }; } },
  { id: 'z8c', name: 'Octagonal Mandala', formula: 'z⁸ + c', category: 'polynomial', description: 'Eighth power symmetry', visualEffect: 'Octagonal mandalas', compute: (z, c) => { const p = complexPow(z, 8); return { re: p.re + c.re, im: p.im + c.im }; } },
  { id: 'zfrac', name: 'Fractional Power', formula: 'z^(1.5) + c', category: 'polynomial', description: 'Non-integer power', visualEffect: 'Organic distortions', compute: (z, c) => { const p = complexPow(z, 1.5); return { re: p.re + c.re, im: p.im + c.im }; } },
  
  // Hybrid Polynomial
  { id: 'z2zc', name: 'Self-Feeding', formula: 'z² + z + c', category: 'hybrid', description: 'Adds linear feedback', visualEffect: 'Dense fractal forests', compute: (z, c) => ({ re: z.re * z.re - z.im * z.im + z.re + c.re, im: 2 * z.re * z.im + z.im + c.im }) },
  { id: 'z2z3c', name: 'Mixed Power', formula: 'z² + 0.3z³ + c', category: 'hybrid', description: 'Fuses quadratic and cubic', visualEffect: 'Rich turbulence', compute: (z, c) => { const z2 = { re: z.re * z.re - z.im * z.im, im: 2 * z.re * z.im }; const z3 = complexPow(z, 3); return { re: z2.re + 0.3 * z3.re + c.re, im: z2.im + 0.3 * z3.im + c.im }; } },
  { id: 'z4z2c', name: 'Ripple Stacked', formula: 'z⁴ + z² + c', category: 'hybrid', description: 'Layered quartic', visualEffect: 'Ring-like contours', compute: (z, c) => { const z4 = complexPow(z, 4); const z2 = { re: z.re * z.re - z.im * z.im, im: 2 * z.re * z.im }; return { re: z4.re + z2.re + c.re, im: z4.im + z2.im + c.im }; } },
  
  // Absolute Value / Burning Ship
  { id: 'absz2c', name: 'Burning Ship', formula: '|z|² + c', category: 'absolute', description: 'Absolute magnitude iteration', visualEffect: 'Jagged, fiery shapes', compute: (z, c) => ({ re: Math.abs(z.re) * Math.abs(z.re) - z.im * z.im + c.re, im: 2 * Math.abs(z.re) * Math.abs(z.im) + c.im }) },
  { id: 'absz3c', name: 'Cubic Burning', formula: '|z|³ + c', category: 'absolute', description: 'Cubic burning towers', visualEffect: 'Angular pyramids', compute: (z, c) => { const p = complexPow({ re: Math.abs(z.re), im: Math.abs(z.im) }, 3); return { re: p.re + c.re, im: p.im + c.im }; } },
  
  // Trigonometric
  { id: 'z2sinc', name: 'Trig Chaos', formula: 'z² + sin(z) + c', category: 'trigonometric', description: 'Quadratic with sine waves', visualEffect: 'Wave-like ripples', compute: (z, c) => { const z2 = { re: z.re * z.re - z.im * z.im, im: 2 * z.re * z.im }; const s = complexSin(z); return { re: z2.re + s.re + c.re, im: z2.im + s.im + c.im }; } },
  { id: 'z2tanc', name: 'Hyper Spike', formula: 'z² + tan(z) + c', category: 'trigonometric', description: 'Tangent singularities', visualEffect: 'Sharp ridges', compute: (z, c) => { const z2 = { re: z.re * z.re - z.im * z.im, im: 2 * z.re * z.im }; const t = complexTan(z); return { re: z2.re + t.re + c.re, im: z2.im + t.im + c.im }; } },
  { id: 'z2cosc', name: 'Cosine Wave', formula: 'z² + cos(z) + c', category: 'trigonometric', description: 'Gentle oscillations', visualEffect: 'Circular ripples', compute: (z, c) => { const z2 = { re: z.re * z.re - z.im * z.im, im: 2 * z.re * z.im }; const co = complexCos(z); return { re: z2.re + co.re + c.re, im: z2.im + co.im + c.im }; } },
  { id: 'sinhc', name: 'Hyperbolic Flame', formula: 'sinh(z) + c', category: 'trigonometric', description: 'Hyperbolic sine dynamics', visualEffect: 'Smooth flame flow', compute: (z, c) => { const s = complexSinh(z); return { re: s.re + c.re, im: s.im + c.im }; } },
  
  // Exponential / Logarithmic
  { id: 'ezc', name: 'Exponential Burst', formula: 'eᶻ + c', category: 'exponential', description: 'Exponential growth', visualEffect: 'Energy explosions', compute: (z, c) => { const e = complexExp(z); return { re: e.re + c.re, im: e.im + c.im }; } },
  { id: 'zezc', name: 'Spiral Jets', formula: 'z·eᶻ + c', category: 'exponential', description: 'Multiplied exponential', visualEffect: 'Swirling jet streams', compute: (z, c) => { const e = complexExp(z); const m = complexMul(z, e); return { re: m.re + c.re, im: m.im + c.im }; } },
  { id: 'logz2c', name: 'Logarithmic Shell', formula: 'log(z²+1) + c', category: 'exponential', description: 'Logarithmic compression', visualEffect: 'Spiraling shells', compute: (z, c) => { const z2p1 = { re: z.re * z.re - z.im * z.im + 1, im: 2 * z.re * z.im }; const l = complexLog(z2p1); return { re: l.re + c.re, im: l.im + c.im }; } },
  
  // Rational
  { id: 'z2cz', name: 'Reciprocal Turbulence', formula: 'z² + c/z', category: 'rational', description: 'Reciprocal tension', visualEffect: 'Vortex-like features', compute: (z, c) => { const z2 = { re: z.re * z.re - z.im * z.im, im: 2 * z.re * z.im }; const denom = z.re * z.re + z.im * z.im; if (denom < 1e-10) return z2; return { re: z2.re + (c.re * z.re + c.im * z.im) / denom, im: z2.im + (c.im * z.re - c.re * z.im) / denom }; } },
  { id: 'zinv', name: 'Mirror Imbalance', formula: 'z + 1/z + c', category: 'rational', description: 'Self-inversion', visualEffect: 'Mirror symmetry', compute: (z, c) => { const denom = z.re * z.re + z.im * z.im; if (denom < 1e-10) return { re: z.re + c.re, im: z.im + c.im }; return { re: z.re + z.re / denom + c.re, im: z.im - z.im / denom + c.im }; } },
  
  // Three-Formula Hybrid Extensions - Advanced Combinations
  { id: 'wave_energy_hybrid', name: 'Wave-Energy Mandala', formula: 'z² + sin(z) + e^z + c', category: 'hybrid', description: 'Quadratic + waves + exponential bursts', visualEffect: 'Living mandalas with energy jets', compute: (z, c) => { const z2 = { re: z.re * z.re - z.im * z.im, im: 2 * z.re * z.im }; const sinZ = complexSin(z); const expZ = complexExp(z); return { re: z2.re + sinZ.re + expZ.re + c.re, im: z2.im + sinZ.im + expZ.im + c.im }; } },
  
  { id: 'spike_shell_armor', name: 'Spike-Shell Architecture', formula: 'z³ + tan(z) + log(z²+1) + c', category: 'hybrid', description: 'Cubic symmetry + tangent spikes + log shells', visualEffect: 'Armored spiral structures with defensive spikes', compute: (z, c) => { const z3 = complexPow(z, 3); const tanZ = complexTan(z); const z2p1 = { re: z.re * z.re - z.im * z.im + 1, im: 2 * z.re * z.im }; const logZ = complexLog(z2p1); return { re: z3.re + tanZ.re + logZ.re + c.re, im: z3.im + tanZ.im + logZ.im + c.im }; } },
  
  { id: 'crystal_flame_fusion', name: 'Crystal-Flame Hybrid', formula: 'z⁵ + z·e^z + sinh(z) + c', category: 'hybrid', description: 'Pentagonal + exponential spirals + hyperbolic flames', visualEffect: 'Crystalline structures with flame energy flows', compute: (z, c) => { const z5 = complexPow(z, 5); const expZ = complexExp(z); const zExpZ = complexMul(z, expZ); const sinhZ = complexSinh(z); return { re: z5.re + zExpZ.re + sinhZ.re + c.re, im: z5.im + zExpZ.im + sinhZ.im + c.im }; } },
  
  { id: 'bio_organic_tissue', name: 'Bio-Organic Fractal Tissue', formula: '(z²+z³) + sin(z²) + e^(z/2) + c', category: 'hybrid', description: 'Dual polynomial + wave interference + soft divergence', visualEffect: 'Living tissue-like fractals with organic growth', compute: (z, c) => { const z2 = { re: z.re * z.re - z.im * z.im, im: 2 * z.re * z.im }; const z3 = complexPow(z, 3); const z2_for_sin = z2; const sinZ2 = complexSin(z2_for_sin); const zHalf = { re: z.re * 0.5, im: z.im * 0.5 }; const expZHalf = complexExp(zHalf); return { re: z2.re + z3.re + sinZ2.re + expZHalf.re + c.re, im: z2.im + z3.im + sinZ2.im + expZHalf.im + c.im }; } },
  
  // Physics-Inspired
  { id: 'decay', name: 'Energy Decay', formula: 'z² + γ·e^(-|z|) + c', category: 'physics', description: 'Exponential decay field', visualEffect: 'Fading energy patterns', compute: (z, c, p = { gamma: 0.5 }) => { const z2 = { re: z.re * z.re - z.im * z.im, im: 2 * z.re * z.im }; const r = Math.sqrt(z.re * z.re + z.im * z.im); const decay = p.gamma * Math.exp(-r); return { re: z2.re + decay + c.re, im: z2.im + c.im }; } },
  { id: 'wave', name: 'Wave Interference', formula: 'z² + μ·sin(|z|²) + c', category: 'physics', description: 'Wave interference field', visualEffect: 'Interference patterns', compute: (z, c, p = { mu: 0.5 }) => { const z2 = { re: z.re * z.re - z.im * z.im, im: 2 * z.re * z.im }; const r2 = z.re * z.re + z.im * z.im; const wave = p.mu * Math.sin(r2); return { re: z2.re + wave + c.re, im: z2.im + c.im }; } },
  { id: 'potential', name: 'Potential Well', formula: 'z² + λ/(|z|+1) + c', category: 'physics', description: 'Potential-well mapping', visualEffect: 'Gravitational wells', compute: (z, c, p = { lambda: 0.5 }) => { const z2 = { re: z.re * z.re - z.im * z.im, im: 2 * z.re * z.im }; const r = Math.sqrt(z.re * z.re + z.im * z.im); const pot = p.lambda / (r + 1); return { re: z2.re + pot + c.re, im: z2.im + c.im }; } }
];

export const MATHEMATICAL_CONSTANTS = {
  pi: { value: Math.PI, symbol: 'π', name: 'Pi' },
  phi: { value: (1 + Math.sqrt(5)) / 2, symbol: 'φ', name: 'Golden Ratio' },
  e: { value: Math.E, symbol: 'e', name: "Euler's Number" },
  sqrt2: { value: Math.SQRT2, symbol: '√2', name: 'Square Root of 2' },
  sqrt3: { value: Math.sqrt(3), symbol: '√3', name: 'Square Root of 3' },
  sqrt5: { value: Math.sqrt(5), symbol: '√5', name: 'Square Root of 5' },
  tau: { value: 2 * Math.PI, symbol: 'τ', name: 'Tau (2π)' },
  silverRatio: { value: 1 + Math.SQRT2, symbol: 'δₛ', name: 'Silver Ratio' },
  plasticNumber: { value: 1.324718, symbol: 'ρ', name: 'Plastic Number' }
} as const;

export type ConstantKey = keyof typeof MATHEMATICAL_CONSTANTS;

export function applyConstantTransform(value: number, constant: ConstantKey, operation: 'multiply' | 'divide' | 'power' | 'root' | 'add' | 'modulo'): number {
  const c = MATHEMATICAL_CONSTANTS[constant].value;
  switch (operation) {
    case 'multiply': return value * c;
    case 'divide': return value / c;
    case 'power': return Math.pow(value, c);
    case 'root': return Math.pow(value, 1 / c);
    case 'add': return value + c;
    case 'modulo': return value % c;
    default: return value;
  }
}

export function getFormulasByCategory(category: keyof typeof FORMULA_CATEGORIES): FractalFormula[] {
  return FRACTAL_FORMULAS.filter(f => f.category === category);
}

export function iterateFractal(
  formula: FractalFormula,
  cx: number,
  cy: number,
  maxIterations: number = 100,
  escapeRadius: number = 4
): { iterations: number; escaped: boolean; finalZ: { re: number; im: number } } {
  let z = { re: 0, im: 0 };
  const c = { re: cx, im: cy };
  
  for (let i = 0; i < maxIterations; i++) {
    z = formula.compute(z, c);
    const r2 = z.re * z.re + z.im * z.im;
    
    if (r2 > escapeRadius * escapeRadius || !isFinite(r2)) {
      return { iterations: i, escaped: true, finalZ: z };
    }
  }
  
  return { iterations: maxIterations, escaped: false, finalZ: z };
}

export function generateFractalHeightmap(
  formula: FractalFormula,
  resolution: number,
  bounds: { xMin: number; xMax: number; yMin: number; yMax: number },
  maxIterations: number = 50
): Float32Array {
  const data = new Float32Array(resolution * resolution);
  const xRange = bounds.xMax - bounds.xMin;
  const yRange = bounds.yMax - bounds.yMin;
  
  for (let j = 0; j < resolution; j++) {
    for (let i = 0; i < resolution; i++) {
      const cx = bounds.xMin + (i / (resolution - 1)) * xRange;
      const cy = bounds.yMin + (j / (resolution - 1)) * yRange;
      
      const result = iterateFractal(formula, cx, cy, maxIterations);
      data[j * resolution + i] = result.escaped 
        ? result.iterations / maxIterations 
        : 0;
    }
  }
  
  return data;
}
