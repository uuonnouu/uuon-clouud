import type { SurfaceParameters } from '../types/math';

export interface ParametricSurface {
  name: string;
  description?: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

function getCleanDefaults(overrides: Partial<SurfaceParameters> = {}): Partial<SurfaceParameters> {
  return {
    a: 1, b: 1, c: 1, d: 0,
    e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
    n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
    uMin: 0, uMax: 1, vMin: 0, vMax: 1,
    uSegments: 96, vSegments: 72,
    ...overrides
  };
}

function generateSequence(
  operation: (a: number, b: number, c?: number) => number,
  initial: number[],
  length: number,
  isTribonacci = false,
  useLog = false
): number[] {
  const sequence = [...initial];
  
  for (let i = initial.length; i < length; i++) {
    if (isTribonacci && sequence.length >= 3) {
      const next = operation(sequence[i-3], sequence[i-2], sequence[i-1]);
      sequence.push(next);
    } else if (sequence.length >= 2) {
      const next = operation(sequence[i-2], sequence[i-1]);
      sequence.push(next);
    }
  }
  
  if (useLog) {
    return sequence.map(v => Math.log10(Math.abs(v) + 1));
  }
  
  return sequence;
}

export const SEQUENCE_PATTERNS: Record<string, ParametricSurface> = {

  fibonacci_spiral: {
    name: "🌀 Fibonacci Addition",
    description: "Classic Fibonacci sequence: aₙ = aₙ₋₁ + aₙ₋₂. Ratio → φ ≈ 1.618",
    equation: (u, v, params) => {
      const scale = params.a ?? 5;
      const height = params.c ?? 3;
      const turns = params.d ?? 8;
      
      const sequence = generateSequence((a, b) => a + b, [1, 1], 50);
      const maxVal = Math.max(...sequence);
      
      const angle = u * turns * Math.PI * 2;
      const t = Math.floor(u * (sequence.length - 1));
      const radius = (sequence[t] / maxVal) * scale;
      
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const z = Math.sin(v * Math.PI * 2) * height + (sequence[t] / maxVal) * height;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 5, c: 3, d: 8, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 48 })
  },

  multiplicative_fibonacci: {
    name: "💥 Multiplicative Fibonacci",
    description: "Explosive growth: aₙ = aₙ₋₁ × aₙ₋₂",
    equation: (u, v, params) => {
      const scale = params.a ?? 8;
      const height = params.c ?? 5;
      const turns = params.d ?? 6;
      
      const sequence = generateSequence((a, b) => a * b, [1, 2], 15, false, true);
      const maxVal = Math.max(...sequence);
      
      const angle = u * turns * Math.PI * 2;
      const t = Math.floor(u * (sequence.length - 1));
      const radius = (sequence[t] / maxVal) * scale;
      
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const z = (sequence[t] / maxVal) * height * Math.sin(v * Math.PI * 2);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 8, c: 5, d: 6, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 })
  },

  subtractive_sequence: {
    name: "🔄 Subtractive Sequence",
    description: "Periodic cycles: aₙ = aₙ₋₁ - aₙ₋₂",
    equation: (u, v, params) => {
      const scale = params.a ?? 6;
      const height = params.c ?? 4;
      const freq = params.d ?? 10;
      
      const sequence = generateSequence((a, b) => a - b, [10, 5], 60);
      const maxVal = Math.max(...sequence.map(Math.abs));
      
      const angle = u * freq * Math.PI * 2;
      const t = Math.floor(u * (sequence.length - 1));
      const value = sequence[t] / maxVal;
      
      const x = scale * Math.cos(angle) * (1 + value * 0.5);
      const y = scale * Math.sin(angle) * (1 + value * 0.5);
      const z = value * height * Math.cos(v * Math.PI * 2);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 6, c: 4, d: 10, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 48 })
  },

  division_sequence: {
    name: "⚡ Division Sequence",
    description: "Unstable convergence: aₙ = aₙ₋₁ / aₙ₋₂",
    equation: (u, v, params) => {
      const scale = params.a ?? 7;
      const height = params.c ?? 4;
      const chaos = params.d ?? 5;
      
      const sequence = generateSequence((a, b) => b !== 0 ? a / b : 0.001, [100, 10], 50);
      const maxVal = Math.max(...sequence.map(Math.abs));
      
      const angle = u * chaos * Math.PI * 2;
      const t = Math.floor(u * (sequence.length - 1));
      const value = Math.abs(sequence[t]) / maxVal;
      
      const x = scale * Math.cos(angle) * value;
      const y = scale * Math.sin(angle) * value;
      const z = height * Math.sin(v * Math.PI * 2) * value;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 7, c: 4, d: 5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 })
  },

  square_root_sequence: {
    name: "📉 Square Root Sequence",
    description: "Slow convergence: aₙ = √(|aₙ₋₁| + |aₙ₋₂|)",
    equation: (u, v, params) => {
      const scale = params.a ?? 6;
      const height = params.c ?? 3;
      const smooth = params.d ?? 8;
      
      const sequence = generateSequence((a, b) => Math.sqrt(Math.abs(a) + Math.abs(b)), [1, 4], 50);
      const maxVal = Math.max(...sequence);
      
      const angle = u * smooth * Math.PI * 2;
      const t = Math.floor(u * (sequence.length - 1));
      const value = sequence[t] / maxVal;
      
      const x = scale * Math.cos(angle) * (1 + value);
      const y = scale * Math.sin(angle) * (1 + value);
      const z = value * height * Math.sin(v * Math.PI * 2);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 6, c: 3, d: 8, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 48 })
  },

  geometric_mean_sequence: {
    name: "📊 Geometric Mean",
    description: "Smooth growth: aₙ = √(aₙ₋₁ × aₙ₋₂)",
    equation: (u, v, params) => {
      const scale = params.a ?? 7;
      const height = params.c ?? 4;
      const turns = params.d ?? 7;
      
      const sequence = generateSequence((a, b) => Math.sqrt(Math.abs(a * b)), [1, 4], 50);
      const maxVal = Math.max(...sequence);
      
      const angle = u * turns * Math.PI * 2;
      const t = Math.floor(u * (sequence.length - 1));
      const value = sequence[t] / maxVal;
      
      const radius = scale * value;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const z = height * Math.cos(v * Math.PI * 2) * value;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 7, c: 4, d: 7, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 })
  },

  harmonic_mean_sequence: {
    name: "🎵 Harmonic Mean",
    description: "Always smaller: aₙ = 2(aₙ₋₁×aₙ₋₂)/(aₙ₋₁+aₙ₋₂)",
    equation: (u, v, params) => {
      const scale = params.a ?? 6;
      const height = params.c ?? 3;
      const wave = params.d ?? 9;
      
      const sequence = generateSequence((a, b) => {
        const ha = Math.abs(a);
        const hb = Math.abs(b);
        return (ha + hb) !== 0 ? (2 * ha * hb) / (ha + hb) : 0.001;
      }, [1, 4], 50);
      const maxVal = Math.max(...sequence);
      
      const angle = u * wave * Math.PI * 2;
      const t = Math.floor(u * (sequence.length - 1));
      const value = sequence[t] / maxVal;
      
      const x = scale * Math.cos(angle) * (0.5 + value);
      const y = scale * Math.sin(angle) * (0.5 + value);
      const z = height * Math.sin(v * Math.PI * 2) * value;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 6, c: 3, d: 9, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 })
  },

  modulo_sequence: {
    name: "🔢 Modulo Sequence",
    description: "Bounded periodic: aₙ = (aₙ₋₁ + aₙ₋₂) mod 20 + 1",
    equation: (u, v, params) => {
      const scale = params.a ?? 5;
      const height = params.c ?? 4;
      const periods = params.d ?? 12;
      
      const sequence = generateSequence((a, b) => (Math.abs(a) + Math.abs(b)) % 20 + 1, [1, 1], 80);
      const maxVal = 21;
      
      const angle = u * periods * Math.PI * 2;
      const t = Math.floor(u * (sequence.length - 1));
      const value = sequence[t] / maxVal;
      
      const x = scale * Math.cos(angle) * (1 + value * 0.8);
      const y = scale * Math.sin(angle) * (1 + value * 0.8);
      const z = value * height * Math.cos(v * Math.PI);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 5, c: 4, d: 12, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 48 })
  },

  sine_wave_sequence: {
    name: "🌊 Sine Wave Sequence",
    description: "Trigonometric chaos: aₙ = |sin(aₙ₋₁)×10 + cos(aₙ₋₂)×10|",
    equation: (u, v, params) => {
      const scale = params.a ?? 6;
      const height = params.c ?? 5;
      const chaos = params.d ?? 15;
      
      const sequence = generateSequence((a, b) => Math.abs(Math.sin(a) * 10 + Math.cos(b) * 10), [0, Math.PI/4], 60);
      const maxVal = Math.max(...sequence);
      
      const angle = u * chaos * Math.PI * 2;
      const t = Math.floor(u * (sequence.length - 1));
      const value = sequence[t] / maxVal;
      
      const x = scale * Math.cos(angle) * value;
      const y = scale * Math.sin(angle) * value;
      const z = height * Math.sin(v * Math.PI * 2) * value;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 6, c: 5, d: 15, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 64 })
  },

  logarithmic_sequence: {
    name: "📈 Logarithmic Sequence",
    description: "Extremely slow: aₙ = ln(|aₙ₋₁|+1) + ln(|aₙ₋₂|+1)",
    equation: (u, v, params) => {
      const scale = params.a ?? 8;
      const height = params.c ?? 3;
      const turns = params.d ?? 10;
      
      const sequence = generateSequence((a, b) => Math.log(Math.abs(a) + 1) + Math.log(Math.abs(b) + 1), [1, 2], 50);
      const maxVal = Math.max(...sequence);
      
      const angle = u * turns * Math.PI * 2;
      const t = Math.floor(u * (sequence.length - 1));
      const value = sequence[t] / maxVal;
      
      const radius = scale * (0.3 + value * 0.7);
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const z = value * height * Math.sin(v * Math.PI * 2);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 8, c: 3, d: 10, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 })
  },

  max_min_sequence: {
    name: "⚖️ Max-Min Sequence",
    description: "Difference: aₙ = max(aₙ₋₁,aₙ₋₂) - min(aₙ₋₁,aₙ₋₂)",
    equation: (u, v, params) => {
      const scale = params.a ?? 7;
      const height = params.c ?? 4;
      const wave = params.d ?? 8;
      
      const sequence = generateSequence((a, b) => Math.max(Math.abs(a), Math.abs(b)) - Math.min(Math.abs(a), Math.abs(b)), [10, 3], 50);
      const maxVal = Math.max(...sequence);
      
      const angle = u * wave * Math.PI * 2;
      const t = Math.floor(u * (sequence.length - 1));
      const value = sequence[t] / (maxVal + 1);
      
      const x = scale * Math.cos(angle) * (0.5 + value);
      const y = scale * Math.sin(angle) * (0.5 + value);
      const z = value * height * Math.cos(v * Math.PI * 2);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 7, c: 4, d: 8, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 })
  },

  absolute_difference: {
    name: "➖ Absolute Difference",
    description: "Always positive: aₙ = ||aₙ₋₁| - |aₙ₋₂||",
    equation: (u, v, params) => {
      const scale = params.a ?? 6;
      const height = params.c ?? 3;
      const spiral = params.d ?? 11;
      
      const sequence = generateSequence((a, b) => Math.abs(Math.abs(a) - Math.abs(b)), [10, 6], 60);
      const maxVal = Math.max(...sequence);
      
      const angle = u * spiral * Math.PI * 2;
      const t = Math.floor(u * (sequence.length - 1));
      const value = sequence[t] / (maxVal + 1);
      
      const radius = scale * (0.2 + value);
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const z = value * height * Math.sin(v * Math.PI * 2);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 6, c: 3, d: 11, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 48 })
  },

  tribonacci_sequence: {
    name: "🔺 Tribonacci (3-term)",
    description: "Sums three terms: aₙ = aₙ₋₁ + aₙ₋₂ + aₙ₋₃. Ratio → 1.839",
    equation: (u, v, params) => {
      const scale = params.a ?? 7;
      const height = params.c ?? 4;
      const turns = params.d ?? 7;
      
      const sequence = generateSequence((a, b, c) => (c !== undefined ? a + b + c : a + b), [0, 0, 1], 40, true);
      const maxVal = Math.max(...sequence);
      
      const angle = u * turns * Math.PI * 2;
      const t = Math.floor(u * (sequence.length - 1));
      const value = sequence[t] / maxVal;
      
      const radius = scale * value;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const z = value * height * Math.cos(v * Math.PI * 2);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 7, c: 4, d: 7, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 })
  },

  exponential_fibonacci: {
    name: "⚡ Exponential Fibonacci",
    description: "Chaotic exponents: aₙ = aₙ₋₁^(aₙ₋₂ mod 3)",
    equation: (u, v, params) => {
      const scale = params.a ?? 6;
      const height = params.c ?? 5;
      const chaos = params.d ?? 10;
      
      const sequence = generateSequence((a, b) => Math.pow(Math.abs(a), Math.abs(b) % 3), [1.5, 2], 20, false, true);
      const maxVal = Math.max(...sequence);
      
      const angle = u * chaos * Math.PI * 2;
      const t = Math.floor(u * (sequence.length - 1));
      const value = sequence[t] / maxVal;
      
      const x = scale * Math.cos(angle) * value;
      const y = scale * Math.sin(angle) * value;
      const z = value * height * Math.sin(v * Math.PI * 2);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 6, c: 5, d: 10, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 })
  },

  xor_binary_sequence: {
    name: "🔲 XOR Binary Sequence",
    description: "Bitwise XOR: aₙ = floor(aₙ₋₁) XOR floor(aₙ₋₂)",
    equation: (u, v, params) => {
      const scale = params.a ?? 8;
      const height = params.c ?? 4;
      const digital = params.d ?? 16;
      
      const sequence = generateSequence((a, b) => (Math.floor(Math.abs(a)) ^ Math.floor(Math.abs(b))) + 1, [1, 2], 64);
      const maxVal = Math.max(...sequence);
      
      const angle = u * digital * Math.PI * 2;
      const t = Math.floor(u * (sequence.length - 1));
      const value = sequence[t] / maxVal;
      
      const x = scale * Math.cos(angle) * (0.3 + value * 0.7);
      const y = scale * Math.sin(angle) * (0.3 + value * 0.7);
      const z = Math.floor(value * 8) * (height / 8) * Math.sign(Math.cos(v * Math.PI * 2));
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 8, c: 4, d: 16, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 32 })
  },

  chebyshev_recurrence: {
    name: "📐 Chebyshev Recurrence",
    description: "Linear recurrence: aₙ = 2aₙ₋₁ - aₙ₋₂",
    equation: (u, v, params) => {
      const scale = params.a ?? 7;
      const height = params.c ?? 4;
      const linear = params.d ?? 8;
      
      const sequence = generateSequence((a, b) => 2 * a - b, [1, 2], 50);
      const maxVal = Math.max(...sequence.map(Math.abs));
      
      const angle = u * linear * Math.PI * 2;
      const t = Math.floor(u * (sequence.length - 1));
      const value = sequence[t] / maxVal;
      
      const x = scale * Math.cos(angle) * Math.abs(value);
      const y = scale * Math.sin(angle) * Math.abs(value);
      const z = value * height * Math.cos(v * Math.PI * 2);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 7, c: 4, d: 8, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 })
  },

  catalan_like_sequence: {
    name: "🔶 Catalan-like Sequence",
    description: "Inspired by Catalan: aₙ = (2(2aₙ₋₁-1)×aₙ₋₂)/(aₙ₋₁+1)",
    equation: (u, v, params) => {
      const scale = params.a ?? 6;
      const height = params.c ?? 3;
      const complexity = params.d ?? 9;
      
      const sequence = generateSequence((a, b) => (2 * (2 * Math.abs(a) - 1) * Math.abs(b)) / (Math.abs(a) + 1) || 1, [1, 1], 40);
      const maxVal = Math.max(...sequence);
      
      const angle = u * complexity * Math.PI * 2;
      const t = Math.floor(u * (sequence.length - 1));
      const value = sequence[t] / maxVal;
      
      const radius = scale * value;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const z = value * height * Math.sin(v * Math.PI * 2);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 6, c: 3, d: 9, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 })
  },

  collatz_inspired: {
    name: "🎲 Collatz-Inspired",
    description: "Collatz rules: aₙ = (sum even) ? sum/2 : 3×sum+1",
    equation: (u, v, params) => {
      const scale = params.a ?? 7;
      const height = params.c ?? 5;
      const chaos = params.d ?? 12;
      
      const sequence = generateSequence((a, b) => {
        const sum = Math.abs(a) + Math.abs(b);
        return sum % 2 === 0 ? sum / 2 : 3 * sum + 1;
      }, [1, 2], 50);
      const maxVal = Math.max(...sequence);
      
      const angle = u * chaos * Math.PI * 2;
      const t = Math.floor(u * (sequence.length - 1));
      const value = sequence[t] / maxVal;
      
      const x = scale * Math.cos(angle) * value;
      const y = scale * Math.sin(angle) * value;
      const z = value * height * Math.sin(v * Math.PI * 2);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 7, c: 5, d: 12, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 64 })
  },

  hilbert_curve_3d: {
    name: "📈 Hilbert Curve 3D",
    description: "Space-filling fractal curve in 3D - approaches every point in a cube",
    equation: (u, v, params) => {
      const scale = params.a ?? 4;
      const depth = Math.floor(params.b ?? 4);
      const height = params.c ?? 2;
      
      const n = Math.pow(2, depth);
      const d = Math.floor(u * n * n * n);
      
      let x = 0, y = 0, z = 0;
      let rx, ry, rz, s;
      let t = d;
      
      for (s = 1; s < n; s *= 2) {
        rx = 1 & (t / 2);
        ry = 1 & (t ^ rx);
        rz = 1 & (t / 4);
        
        if (ry === 0) {
          if (rx === 1) { x = s - 1 - x; y = s - 1 - y; }
          [x, y] = [y, x];
        }
        if (rz === 0) {
          if (rx === 1) { x = s - 1 - x; z = s - 1 - z; }
          [x, z] = [z, x];
        }
        
        x += s * rx;
        y += s * ry;
        z += s * rz;
        t = Math.floor(t / 8);
      }
      
      const tube = v * Math.PI * 2;
      const tubeRadius = 0.15;
      
      return [
        scale * (x / n - 0.5 + tubeRadius * Math.cos(tube)),
        scale * (y / n - 0.5 + tubeRadius * Math.sin(tube)),
        scale * (z / n - 0.5) + height * Math.sin(u * Math.PI * 4)
      ];
    },
    defaultParams: getCleanDefaults({ a: 4, b: 4, c: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 256, vSegments: 16 })
  },

  gaussian_distribution_3d: {
    name: "📊 Gaussian Distribution 3D",
    description: "Bell curve probability density: f(x) = (1/σ√2π)exp(-(x-μ)²/2σ²)",
    equation: (u, v, params) => {
      const scale = params.a ?? 4;
      const sigma = Math.max(0.1, params.b ?? 1);
      const height = params.c ?? 3;
      const mu = params.d ?? 0;
      
      const x = (u - 0.5) * scale * 3;
      const y = (v - 0.5) * scale * 3;
      
      const r2 = Math.pow(x - mu, 2) + Math.pow(y - mu, 2);
      const gaussian = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-r2 / (2 * sigma * sigma));
      const z = gaussian * height * 10;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 4, b: 1, c: 3, d: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 96 })
  },

  fourier_series_surface: {
    name: "🎵 Fourier Series Surface",
    description: "Superposition of sine waves: f(x) = Σ(aₙcos(nx) + bₙsin(nx))",
    equation: (u, v, params) => {
      const scale = params.a ?? 4;
      const harmonics = Math.floor(params.b ?? 5);
      const amplitude = params.c ?? 1;
      
      const x = (u - 0.5) * scale * 2 * Math.PI;
      const y = (v - 0.5) * scale * 2 * Math.PI;
      
      let z = 0;
      for (let n = 1; n <= harmonics; n++) {
        const an = 1 / n;
        const bn = 1 / (n * n);
        z += an * Math.cos(n * x) + bn * Math.sin(n * y);
      }
      z *= amplitude;
      
      return [x / Math.PI, y / Math.PI, z];
    },
    defaultParams: getCleanDefaults({ a: 4, b: 5, c: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 96 })
  },

  wave_packet_3d: {
    name: "🌊 Wave Packet 3D",
    description: "Quantum wave packet: Ψ(x,t) = A·exp(-x²/4σ²)·exp(ikx-iωt)",
    equation: (u, v, params) => {
      const scale = params.a ?? 4;
      const sigma = Math.max(0.1, params.b ?? 1);
      const k = params.c ?? 5;
      const omega = params.d ?? 0;
      
      const x = (u - 0.5) * scale * 4;
      const y = (v - 0.5) * scale * 4;
      
      const r2 = x * x + y * y;
      const envelope = Math.exp(-r2 / (4 * sigma * sigma));
      const phase = k * x - omega;
      const realPart = envelope * Math.cos(phase);
      
      return [x, y, realPart * scale * 0.5];
    },
    defaultParams: getCleanDefaults({ a: 4, b: 1, c: 5, d: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 128 })
  },

  riemann_zeta_surface: {
    name: "ζ Riemann Zeta Surface",
    description: "Riemann zeta: ζ(s) = Σ(1/n^s), visualized on critical strip",
    equation: (u, v, params) => {
      const scale = params.a ?? 3;
      const terms = Math.floor(params.b ?? 50);
      const amplitude = params.c ?? 2;
      
      const sigma = u * 2;
      const t = (v - 0.5) * 40;
      
      let realSum = 0;
      let imagSum = 0;
      
      for (let n = 1; n <= terms; n++) {
        const nPowSigma = Math.pow(n, -sigma);
        const logN = Math.log(n);
        realSum += nPowSigma * Math.cos(-t * logN);
        imagSum += nPowSigma * Math.sin(-t * logN);
      }
      
      const magnitude = Math.sqrt(realSum * realSum + imagSum * imagSum);
      
      return [
        scale * sigma,
        scale * t / 10,
        Math.min(amplitude * magnitude, 10)
      ];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 50, c: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 128 })
  }
};
