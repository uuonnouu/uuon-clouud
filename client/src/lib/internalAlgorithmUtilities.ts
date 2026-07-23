/**
 * INTERNAL ALGORITHM UTILITIES
 * Centralized reusable algorithms extracted from shape libraries
 * 
 * These algorithms were previously embedded in individual shape files
 * but provide cross-codebase benefits when exposed as utilities.
 * 
 * Categories:
 * 1. Sequence Alignment (Needleman-Wunsch, Smith-Waterman, Levenshtein)
 * 2. Signal Processing (Fourier, Gaussian, Convolution)
 * 3. Interpolation (Bezier, Spline, LERP, SLERP)
 * 4. Vector/Matrix Operations
 * 5. Physics Utilities (Spring-Damper, Collision)
 * 6. Optimization (Gradient Descent, Simulated Annealing)
 * 7. Pattern Matching (Modular Arithmetic, Hashing)
 * 
 * © 2025 UUON Foundation Inc.
 */

// ============================================================================
// 1. SEQUENCE ALIGNMENT ALGORITHMS
// ============================================================================

/**
 * Needleman-Wunsch Global Sequence Alignment
 * Used in: DNA matching, protein comparison, text similarity
 * 
 * Returns alignment score matrix for visualization
 */
export function needlemanWunsch(
  seq1: string,
  seq2: string,
  matchScore: number = 1,
  mismatchPenalty: number = -1,
  gapPenalty: number = -2
): { matrix: number[][]; alignment: { seq1: string; seq2: string } } {
  const m = seq1.length;
  const n = seq2.length;
  
  const matrix: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) matrix[i][0] = i * gapPenalty;
  for (let j = 0; j <= n; j++) matrix[0][j] = j * gapPenalty;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const match = matrix[i - 1][j - 1] + (seq1[i - 1] === seq2[j - 1] ? matchScore : mismatchPenalty);
      const deleteGap = matrix[i - 1][j] + gapPenalty;
      const insertGap = matrix[i][j - 1] + gapPenalty;
      matrix[i][j] = Math.max(match, deleteGap, insertGap);
    }
  }
  
  let alignedSeq1 = '';
  let alignedSeq2 = '';
  let i = m, j = n;
  
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && matrix[i][j] === matrix[i - 1][j - 1] + (seq1[i - 1] === seq2[j - 1] ? matchScore : mismatchPenalty)) {
      alignedSeq1 = seq1[i - 1] + alignedSeq1;
      alignedSeq2 = seq2[j - 1] + alignedSeq2;
      i--; j--;
    } else if (i > 0 && matrix[i][j] === matrix[i - 1][j] + gapPenalty) {
      alignedSeq1 = seq1[i - 1] + alignedSeq1;
      alignedSeq2 = '-' + alignedSeq2;
      i--;
    } else {
      alignedSeq1 = '-' + alignedSeq1;
      alignedSeq2 = seq2[j - 1] + alignedSeq2;
      j--;
    }
  }
  
  return { matrix, alignment: { seq1: alignedSeq1, seq2: alignedSeq2 } };
}

/**
 * Smith-Waterman Local Sequence Alignment
 * Finds best matching subsequences (more tolerant than Needleman-Wunsch)
 */
export function smithWaterman(
  seq1: string,
  seq2: string,
  matchScore: number = 2,
  mismatchPenalty: number = -1,
  gapPenalty: number = -1
): { matrix: number[][]; maxScore: number; position: [number, number] } {
  const m = seq1.length;
  const n = seq2.length;
  
  const matrix: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  let maxScore = 0;
  let maxI = 0, maxJ = 0;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const match = matrix[i - 1][j - 1] + (seq1[i - 1] === seq2[j - 1] ? matchScore : mismatchPenalty);
      const deleteGap = matrix[i - 1][j] + gapPenalty;
      const insertGap = matrix[i][j - 1] + gapPenalty;
      matrix[i][j] = Math.max(0, match, deleteGap, insertGap);
      
      if (matrix[i][j] > maxScore) {
        maxScore = matrix[i][j];
        maxI = i;
        maxJ = j;
      }
    }
  }
  
  return { matrix, maxScore, position: [maxI, maxJ] };
}

/**
 * Levenshtein Edit Distance
 * Minimum edits (insert, delete, substitute) to transform one string to another
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(0));
  
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  
  return matrix[a.length][b.length];
}

// ============================================================================
// 2. SIGNAL PROCESSING ALGORITHMS
// ============================================================================

/**
 * 1D Discrete Fourier Transform
 * Converts signal from time domain to frequency domain
 */
export function discreteFourierTransform(signal: number[]): { real: number[]; imag: number[] } {
  const N = signal.length;
  const real: number[] = new Array(N).fill(0);
  const imag: number[] = new Array(N).fill(0);
  
  for (let k = 0; k < N; k++) {
    for (let n = 0; n < N; n++) {
      const angle = (2 * Math.PI * k * n) / N;
      real[k] += signal[n] * Math.cos(angle);
      imag[k] -= signal[n] * Math.sin(angle);
    }
  }
  
  return { real, imag };
}

/**
 * Inverse Discrete Fourier Transform
 * Converts from frequency domain back to time domain
 */
export function inverseFourierTransform(real: number[], imag: number[]): number[] {
  const N = real.length;
  const signal: number[] = new Array(N).fill(0);
  
  for (let n = 0; n < N; n++) {
    for (let k = 0; k < N; k++) {
      const angle = (2 * Math.PI * k * n) / N;
      signal[n] += real[k] * Math.cos(angle) - imag[k] * Math.sin(angle);
    }
    signal[n] /= N;
  }
  
  return signal;
}

/**
 * 1D Gaussian Blur / Smoothing
 * Applies Gaussian kernel for noise reduction
 */
export function gaussianBlur1D(signal: number[], sigma: number = 1): number[] {
  const kernelSize = Math.ceil(sigma * 6) | 1;
  const halfSize = Math.floor(kernelSize / 2);
  const kernel: number[] = [];
  
  let sum = 0;
  for (let i = -halfSize; i <= halfSize; i++) {
    const value = Math.exp(-(i * i) / (2 * sigma * sigma));
    kernel.push(value);
    sum += value;
  }
  kernel.forEach((_, i) => kernel[i] /= sum);
  
  const result: number[] = new Array(signal.length).fill(0);
  for (let i = 0; i < signal.length; i++) {
    for (let j = 0; j < kernel.length; j++) {
      const idx = i + j - halfSize;
      if (idx >= 0 && idx < signal.length) {
        result[i] += signal[idx] * kernel[j];
      }
    }
  }
  
  return result;
}

/**
 * 2D Gaussian Kernel Generator
 * Creates convolution kernel for 2D image processing
 */
export function gaussianKernel2D(size: number, sigma: number): number[][] {
  const kernel: number[][] = [];
  const halfSize = Math.floor(size / 2);
  let sum = 0;
  
  for (let y = -halfSize; y <= halfSize; y++) {
    const row: number[] = [];
    for (let x = -halfSize; x <= halfSize; x++) {
      const value = Math.exp(-(x * x + y * y) / (2 * sigma * sigma));
      row.push(value);
      sum += value;
    }
    kernel.push(row);
  }
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      kernel[y][x] /= sum;
    }
  }
  
  return kernel;
}

/**
 * 1D Convolution
 * Applies filter kernel to signal
 */
export function convolve1D(signal: number[], kernel: number[]): number[] {
  const result: number[] = new Array(signal.length).fill(0);
  const halfKernel = Math.floor(kernel.length / 2);
  
  for (let i = 0; i < signal.length; i++) {
    for (let j = 0; j < kernel.length; j++) {
      const idx = i + j - halfKernel;
      if (idx >= 0 && idx < signal.length) {
        result[i] += signal[idx] * kernel[j];
      }
    }
  }
  
  return result;
}

// ============================================================================
// 3. INTERPOLATION ALGORITHMS
// ============================================================================

/**
 * Linear Interpolation (LERP)
 * Smoothly blend between two values
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Spherical Linear Interpolation (SLERP)
 * For quaternion/rotation interpolation
 */
export function slerp(
  q1: [number, number, number, number],
  q2: [number, number, number, number],
  t: number
): [number, number, number, number] {
  let dot = q1[0] * q2[0] + q1[1] * q2[1] + q1[2] * q2[2] + q1[3] * q2[3];
  
  if (dot < 0) {
    q2 = [-q2[0], -q2[1], -q2[2], -q2[3]];
    dot = -dot;
  }
  
  if (dot > 0.9995) {
    return [
      lerp(q1[0], q2[0], t),
      lerp(q1[1], q2[1], t),
      lerp(q1[2], q2[2], t),
      lerp(q1[3], q2[3], t)
    ];
  }
  
  const theta0 = Math.acos(dot);
  const theta = theta0 * t;
  const sinTheta = Math.sin(theta);
  const sinTheta0 = Math.sin(theta0);
  
  const s0 = Math.cos(theta) - dot * sinTheta / sinTheta0;
  const s1 = sinTheta / sinTheta0;
  
  return [
    s0 * q1[0] + s1 * q2[0],
    s0 * q1[1] + s1 * q2[1],
    s0 * q1[2] + s1 * q2[2],
    s0 * q1[3] + s1 * q2[3]
  ];
}

/**
 * Cubic Bezier Interpolation
 * Smooth curve through control points
 */
export function cubicBezier(
  p0: [number, number, number],
  p1: [number, number, number],
  p2: [number, number, number],
  p3: [number, number, number],
  t: number
): [number, number, number] {
  const t2 = t * t;
  const t3 = t2 * t;
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  
  return [
    mt3 * p0[0] + 3 * mt2 * t * p1[0] + 3 * mt * t2 * p2[0] + t3 * p3[0],
    mt3 * p0[1] + 3 * mt2 * t * p1[1] + 3 * mt * t2 * p2[1] + t3 * p3[1],
    mt3 * p0[2] + 3 * mt2 * t * p1[2] + 3 * mt * t2 * p2[2] + t3 * p3[2]
  ];
}

/**
 * Catmull-Rom Spline Interpolation
 * Smooth curve that passes through all control points
 */
export function catmullRom(
  p0: [number, number, number],
  p1: [number, number, number],
  p2: [number, number, number],
  p3: [number, number, number],
  t: number,
  tension: number = 0.5
): [number, number, number] {
  const t2 = t * t;
  const t3 = t2 * t;
  
  const result: [number, number, number] = [0, 0, 0];
  
  for (let i = 0; i < 3; i++) {
    const v0 = (p2[i] - p0[i]) * tension;
    const v1 = (p3[i] - p1[i]) * tension;
    
    result[i] = (2 * t3 - 3 * t2 + 1) * p1[i] +
                (t3 - 2 * t2 + t) * v0 +
                (-2 * t3 + 3 * t2) * p2[i] +
                (t3 - t2) * v1;
  }
  
  return result;
}

/**
 * Hermite Spline Interpolation
 * Uses position and tangent at endpoints
 */
export function hermiteSpline(
  p0: number,
  m0: number,
  p1: number,
  m1: number,
  t: number
): number {
  const t2 = t * t;
  const t3 = t2 * t;
  
  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;
  
  return h00 * p0 + h10 * m0 + h01 * p1 + h11 * m1;
}

/**
 * Smoothstep - Smooth Hermite interpolation
 * Commonly used for smooth transitions
 */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Smootherstep - Even smoother (Ken Perlin's improvement)
 */
export function smootherstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

// ============================================================================
// 4. VECTOR / MATRIX OPERATIONS
// ============================================================================

export type Vec3 = [number, number, number];
export type Mat3 = [Vec3, Vec3, Vec3];
export type Mat4 = [[number, number, number, number], [number, number, number, number], [number, number, number, number], [number, number, number, number]];

/**
 * Vector Operations
 */
export const vec3 = {
  add: (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  subtract: (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  scale: (v: Vec3, s: number): Vec3 => [v[0] * s, v[1] * s, v[2] * s],
  dot: (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  cross: (a: Vec3, b: Vec3): Vec3 => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ],
  length: (v: Vec3): number => Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]),
  normalize: (v: Vec3): Vec3 => {
    const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    return len > 0 ? [v[0] / len, v[1] / len, v[2] / len] : [0, 0, 0];
  },
  distance: (a: Vec3, b: Vec3): number => {
    const dx = a[0] - b[0], dy = a[1] - b[1], dz = a[2] - b[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  },
  lerp: (a: Vec3, b: Vec3, t: number): Vec3 => [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t
  ],
  reflect: (v: Vec3, n: Vec3): Vec3 => {
    const d = 2 * (v[0] * n[0] + v[1] * n[1] + v[2] * n[2]);
    return [v[0] - d * n[0], v[1] - d * n[1], v[2] - d * n[2]];
  }
};

/**
 * Rodrigues Rotation Formula
 * Rotate vector around arbitrary axis
 */
export function rodriguesRotation(v: Vec3, axis: Vec3, angle: number): Vec3 {
  const k = vec3.normalize(axis);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  
  const vCosTheta = vec3.scale(v, cos);
  const kCrossV = vec3.cross(k, v);
  const kCrossVSin = vec3.scale(kCrossV, sin);
  const kDotV = vec3.dot(k, v);
  const kScale = vec3.scale(k, kDotV * (1 - cos));
  
  return vec3.add(vec3.add(vCosTheta, kCrossVSin), kScale);
}

/**
 * Numerical Gradient (Finite Differences)
 * Approximate gradient of function at point
 */
export function numericalGradient(
  f: (x: number[]) => number,
  x: number[],
  h: number = 1e-5
): number[] {
  const gradient: number[] = [];
  
  for (let i = 0; i < x.length; i++) {
    const xPlus = [...x];
    const xMinus = [...x];
    xPlus[i] += h;
    xMinus[i] -= h;
    gradient.push((f(xPlus) - f(xMinus)) / (2 * h));
  }
  
  return gradient;
}

/**
 * Numerical Hessian (Second Derivatives)
 * Approximate Hessian matrix of function at point
 */
export function numericalHessian(
  f: (x: number[]) => number,
  x: number[],
  h: number = 1e-4
): number[][] {
  const n = x.length;
  const hessian: number[][] = Array(n).fill(null).map(() => Array(n).fill(0));
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      const xPP = [...x], xPM = [...x], xMP = [...x], xMM = [...x];
      xPP[i] += h; xPP[j] += h;
      xPM[i] += h; xPM[j] -= h;
      xMP[i] -= h; xMP[j] += h;
      xMM[i] -= h; xMM[j] -= h;
      
      const value = (f(xPP) - f(xPM) - f(xMP) + f(xMM)) / (4 * h * h);
      hessian[i][j] = value;
      hessian[j][i] = value;
    }
  }
  
  return hessian;
}

// ============================================================================
// 5. PHYSICS UTILITIES
// ============================================================================

/**
 * Spring-Damper System
 * Smooth physics-based interpolation
 */
export function springDamper(
  current: number,
  target: number,
  velocity: number,
  stiffness: number = 100,
  damping: number = 10,
  dt: number = 1/60
): { position: number; velocity: number } {
  const displacement = target - current;
  const springForce = displacement * stiffness;
  const dampingForce = -velocity * damping;
  const acceleration = springForce + dampingForce;
  
  const newVelocity = velocity + acceleration * dt;
  const newPosition = current + newVelocity * dt;
  
  return { position: newPosition, velocity: newVelocity };
}

/**
 * Critical Damping Calculator
 * Calculate damping for no oscillation
 */
export function criticalDamping(mass: number, stiffness: number): number {
  return 2 * Math.sqrt(mass * stiffness);
}

/**
 * Sphere-Sphere Collision Detection
 */
export function sphereCollision(
  p1: Vec3, r1: number,
  p2: Vec3, r2: number
): { collides: boolean; penetration: number; normal: Vec3 } {
  const distance = vec3.distance(p1, p2);
  const sumRadii = r1 + r2;
  const collides = distance < sumRadii;
  
  return {
    collides,
    penetration: collides ? sumRadii - distance : 0,
    normal: vec3.normalize(vec3.subtract(p2, p1))
  };
}

/**
 * AABB (Axis-Aligned Bounding Box) Collision
 */
export function aabbCollision(
  min1: Vec3, max1: Vec3,
  min2: Vec3, max2: Vec3
): boolean {
  return (
    min1[0] <= max2[0] && max1[0] >= min2[0] &&
    min1[1] <= max2[1] && max1[1] >= min2[1] &&
    min1[2] <= max2[2] && max1[2] >= min2[2]
  );
}

/**
 * Ray-Sphere Intersection
 */
export function raySphereIntersection(
  rayOrigin: Vec3,
  rayDir: Vec3,
  sphereCenter: Vec3,
  sphereRadius: number
): { hits: boolean; t: number } {
  const oc = vec3.subtract(rayOrigin, sphereCenter);
  const a = vec3.dot(rayDir, rayDir);
  const b = 2 * vec3.dot(oc, rayDir);
  const c = vec3.dot(oc, oc) - sphereRadius * sphereRadius;
  const discriminant = b * b - 4 * a * c;
  
  if (discriminant < 0) {
    return { hits: false, t: -1 };
  }
  
  const t = (-b - Math.sqrt(discriminant)) / (2 * a);
  return { hits: t >= 0, t };
}

// ============================================================================
// 6. OPTIMIZATION ALGORITHMS
// ============================================================================

/**
 * Gradient Descent Optimizer
 */
export function gradientDescent(
  f: (x: number[]) => number,
  x0: number[],
  learningRate: number = 0.01,
  maxIterations: number = 1000,
  tolerance: number = 1e-6
): { solution: number[]; iterations: number; converged: boolean } {
  let x = [...x0];
  let prevValue = f(x);
  
  for (let i = 0; i < maxIterations; i++) {
    const gradient = numericalGradient(f, x);
    x = x.map((xi, j) => xi - learningRate * gradient[j]);
    
    const value = f(x);
    if (Math.abs(value - prevValue) < tolerance) {
      return { solution: x, iterations: i + 1, converged: true };
    }
    prevValue = value;
  }
  
  return { solution: x, iterations: maxIterations, converged: false };
}

/**
 * Simulated Annealing Optimizer
 * Global optimization that can escape local minima
 */
export function simulatedAnnealing(
  f: (x: number[]) => number,
  x0: number[],
  temperature: number = 100,
  coolingRate: number = 0.995,
  maxIterations: number = 10000
): { solution: number[]; energy: number } {
  let current = [...x0];
  let currentEnergy = f(current);
  let best = [...current];
  let bestEnergy = currentEnergy;
  let temp = temperature;
  
  for (let i = 0; i < maxIterations; i++) {
    const neighbor = current.map(x => x + (Math.random() - 0.5) * temp * 0.1);
    const neighborEnergy = f(neighbor);
    
    const delta = neighborEnergy - currentEnergy;
    if (delta < 0 || Math.random() < Math.exp(-delta / temp)) {
      current = neighbor;
      currentEnergy = neighborEnergy;
      
      if (currentEnergy < bestEnergy) {
        best = [...current];
        bestEnergy = currentEnergy;
      }
    }
    
    temp *= coolingRate;
  }
  
  return { solution: best, energy: bestEnergy };
}

// ============================================================================
// 7. PATTERN MATCHING & MODULAR ARITHMETIC
// ============================================================================

/**
 * Safe Modulo (always positive result)
 */
export function safeModulo(x: number, m: number): number {
  if (m === 0) return 0;
  return ((x % m) + m) % m;
}

/**
 * Extended Euclidean Algorithm
 * Returns GCD and Bezout coefficients
 */
export function extendedEuclidean(a: number, b: number): { gcd: number; x: number; y: number } {
  if (b === 0) {
    return { gcd: a, x: 1, y: 0 };
  }
  
  const { gcd, x, y } = extendedEuclidean(b, a % b);
  return { gcd, x: y, y: x - Math.floor(a / b) * y };
}

/**
 * Modular Exponentiation (Fast Power)
 * Computes (base^exp) mod m efficiently
 */
export function modPow(base: number, exp: number, m: number): number {
  let result = 1;
  base = base % m;
  
  while (exp > 0) {
    if (exp % 2 === 1) {
      result = (result * base) % m;
    }
    exp = Math.floor(exp / 2);
    base = (base * base) % m;
  }
  
  return result;
}

/**
 * Linear Regression
 * Fits line y = mx + b to data points
 */
export function linearRegression(points: [number, number][]): { slope: number; intercept: number; r2: number } {
  const n = points.length;
  if (n < 2) return { slope: 0, intercept: 0, r2: 0 };
  
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
  
  for (const [x, y] of points) {
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
    sumY2 += y * y;
  }
  
  const denominator = n * sumX2 - sumX * sumX;
  if (Math.abs(denominator) < 1e-10) {
    return { slope: 0, intercept: sumY / n, r2: 0 };
  }
  
  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;
  
  const ssRes = points.reduce((sum, [x, y]) => {
    const predicted = slope * x + intercept;
    return sum + (y - predicted) ** 2;
  }, 0);
  
  const meanY = sumY / n;
  const ssTot = points.reduce((sum, [, y]) => sum + (y - meanY) ** 2, 0);
  
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 0;
  
  return { slope, intercept, r2 };
}

/**
 * Polynomial Regression
 * Fits polynomial of degree n to data points
 */
export function polynomialRegression(points: [number, number][], degree: number): number[] {
  const n = points.length;
  const matrix: number[][] = [];
  const rhs: number[] = [];
  
  for (let i = 0; i <= degree; i++) {
    const row: number[] = [];
    for (let j = 0; j <= degree; j++) {
      let sum = 0;
      for (const [x] of points) {
        sum += Math.pow(x, i + j);
      }
      row.push(sum);
    }
    matrix.push(row);
    
    let rhsSum = 0;
    for (const [x, y] of points) {
      rhsSum += y * Math.pow(x, i);
    }
    rhs.push(rhsSum);
  }
  
  return solveLinearSystem(matrix, rhs);
}

/**
 * Solve Linear System (Gaussian Elimination)
 */
function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = A.length;
  const aug: number[][] = A.map((row, i) => [...row, b[i]]);
  
  for (let col = 0; col < n; col++) {
    let maxRow = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) {
        maxRow = row;
      }
    }
    [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];
    
    if (Math.abs(aug[col][col]) < 1e-10) continue;
    
    for (let row = col + 1; row < n; row++) {
      const factor = aug[row][col] / aug[col][col];
      for (let j = col; j <= n; j++) {
        aug[row][j] -= factor * aug[col][j];
      }
    }
  }
  
  const x: number[] = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = aug[i][n];
    for (let j = i + 1; j < n; j++) {
      sum -= aug[i][j] * x[j];
    }
    x[i] = Math.abs(aug[i][i]) > 1e-10 ? sum / aug[i][i] : 0;
  }
  
  return x;
}

// ============================================================================
// 8. JACOBIAN MATRIX & COORDINATE TRANSFORMATION ALGORITHMS
// ============================================================================

/**
 * 3x3 Matrix Type for Jacobian calculations
 */
export type Matrix3x3 = [[number, number, number], [number, number, number], [number, number, number]];

/**
 * Jacobian Matrix Result
 */
export interface JacobianResult {
  matrix: Matrix3x3;
  determinant: number;
  inverse: Matrix3x3 | null;
  eigenvalues: [number, number, number] | null;
}

/**
 * Compute 3x3 Matrix Determinant
 * det(A) = a(ei-fh) - b(di-fg) + c(dh-eg)
 */
export function matrix3x3Determinant(m: Matrix3x3): number {
  const [[a, b, c], [d, e, f], [g, h, i]] = m;
  return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
}

/**
 * Compute 3x3 Matrix Inverse (if determinant != 0)
 */
export function matrix3x3Inverse(m: Matrix3x3): Matrix3x3 | null {
  const det = matrix3x3Determinant(m);
  if (Math.abs(det) < 1e-10) return null;
  
  const [[a, b, c], [d, e, f], [g, h, i]] = m;
  const invDet = 1 / det;
  
  return [
    [(e * i - f * h) * invDet, (c * h - b * i) * invDet, (b * f - c * e) * invDet],
    [(f * g - d * i) * invDet, (a * i - c * g) * invDet, (c * d - a * f) * invDet],
    [(d * h - e * g) * invDet, (b * g - a * h) * invDet, (a * e - b * d) * invDet]
  ];
}

/**
 * Matrix Multiplication 3x3
 */
export function matrix3x3Multiply(a: Matrix3x3, b: Matrix3x3): Matrix3x3 {
  const result: Matrix3x3 = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  return result;
}

/**
 * Cascading Coordinate Jacobian
 * For transformations: u = x+y+z, uv = y+z, uvw = z
 * 
 * This specific transformation represents a cascading sum system where:
 * - u captures the total sum (x+y+z)
 * - uv captures partial sum (y+z)  
 * - uvw captures single variable (z)
 * 
 * The Jacobian ∂(x,y,z)/∂(u,v,w) for this system = 1
 */
export function cascadingCoordinateJacobian(u: number, v: number, w: number): JacobianResult {
  // Given: u = x+y+z, uv = y+z, uvw = z
  // Solving: x = u - uv, y = uv - uvw, z = uvw
  // 
  // ∂x/∂u = 1 - v,  ∂x/∂v = -u,     ∂x/∂w = 0
  // ∂y/∂u = v - vw, ∂y/∂v = u - uw, ∂y/∂w = -uv
  // ∂z/∂u = vw,     ∂z/∂v = uw,     ∂z/∂w = uv
  
  const matrix: Matrix3x3 = [
    [1 - v,      -u,         0],
    [v - v * w,  u - u * w,  -u * v],
    [v * w,      u * w,      u * v]
  ];
  
  const determinant = matrix3x3Determinant(matrix);
  const inverse = matrix3x3Inverse(matrix);
  
  return { matrix, determinant, inverse, eigenvalues: null };
}

/**
 * General Jacobian for Parametric Surfaces
 * Computes ∂(x,y,z)/∂(u,v) for a parametric surface
 * 
 * @param equation - Parametric surface equation (u,v) -> [x,y,z]
 * @param u - U parameter value
 * @param v - V parameter value
 * @param h - Step size for numerical differentiation
 */
export function parametricSurfaceJacobian(
  equation: (u: number, v: number) => [number, number, number],
  u: number,
  v: number,
  h: number = 0.0001
): { du: [number, number, number]; dv: [number, number, number]; normal: [number, number, number]; area: number } {
  const [x0, y0, z0] = equation(u, v);
  const [xu, yu, zu] = equation(u + h, v);
  const [xv, yv, zv] = equation(u, v + h);
  
  // Partial derivatives
  const du: [number, number, number] = [(xu - x0) / h, (yu - y0) / h, (zu - z0) / h];
  const dv: [number, number, number] = [(xv - x0) / h, (yv - y0) / h, (zv - z0) / h];
  
  // Cross product for surface normal
  const normal: [number, number, number] = [
    du[1] * dv[2] - du[2] * dv[1],
    du[2] * dv[0] - du[0] * dv[2],
    du[0] * dv[1] - du[1] * dv[0]
  ];
  
  // Surface area element (magnitude of cross product)
  const area = Math.sqrt(normal[0] ** 2 + normal[1] ** 2 + normal[2] ** 2);
  
  return { du, dv, normal, area };
}

/**
 * Spherical to Cartesian Jacobian
 * (r, θ, φ) -> (x, y, z)
 * x = r·sin(θ)·cos(φ), y = r·sin(θ)·sin(φ), z = r·cos(θ)
 * Determinant = r²·sin(θ)
 */
export function sphericalJacobian(r: number, theta: number, phi: number): JacobianResult {
  const sinT = Math.sin(theta);
  const cosT = Math.cos(theta);
  const sinP = Math.sin(phi);
  const cosP = Math.cos(phi);
  
  const matrix: Matrix3x3 = [
    [sinT * cosP,    r * cosT * cosP,  -r * sinT * sinP],
    [sinT * sinP,    r * cosT * sinP,   r * sinT * cosP],
    [cosT,          -r * sinT,          0]
  ];
  
  const determinant = r * r * sinT;
  const inverse = matrix3x3Inverse(matrix);
  
  return { matrix, determinant, inverse, eigenvalues: null };
}

/**
 * Cylindrical to Cartesian Jacobian
 * (r, θ, z) -> (x, y, z)
 * x = r·cos(θ), y = r·sin(θ), z = z
 * Determinant = r
 */
export function cylindricalJacobian(r: number, theta: number, z: number): JacobianResult {
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);
  
  const matrix: Matrix3x3 = [
    [cosT,  -r * sinT,  0],
    [sinT,   r * cosT,  0],
    [0,      0,         1]
  ];
  
  const determinant = r;
  const inverse = matrix3x3Inverse(matrix);
  
  return { matrix, determinant, inverse, eigenvalues: null };
}

/**
 * Toroidal Jacobian
 * (u, v) -> torus with major radius R and minor radius a
 * x = (R + a·cos(v))·cos(u)
 * y = (R + a·cos(v))·sin(u) 
 * z = a·sin(v)
 */
export function toroidalJacobian(R: number, a: number, u: number, v: number): { 
  partials: { xu: number; yu: number; zu: number; xv: number; yv: number; zv: number };
  areaElement: number;
} {
  const cosU = Math.cos(u);
  const sinU = Math.sin(u);
  const cosV = Math.cos(v);
  const sinV = Math.sin(v);
  
  const r = R + a * cosV;
  
  const xu = -r * sinU;
  const yu = r * cosU;
  const zu = 0;
  
  const xv = -a * sinV * cosU;
  const yv = -a * sinV * sinU;
  const zv = a * cosV;
  
  // Area element: |∂r/∂u × ∂r/∂v| = a(R + a·cos(v))
  const areaElement = a * r;
  
  return { partials: { xu, yu, zu, xv, yv, zv }, areaElement };
}

/**
 * Volume Scaling Jacobian
 * For transformation u=yz/x, v=zx/y, w=xy/z
 * J = 4 (as per mathematical proof)
 */
export function volumeScalingJacobian(x: number, y: number, z: number): JacobianResult {
  if (Math.abs(x) < 1e-10 || Math.abs(y) < 1e-10 || Math.abs(z) < 1e-10) {
    return {
      matrix: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
      determinant: 0,
      inverse: null,
      eigenvalues: null
    };
  }
  
  // u = yz/x, v = zx/y, w = xy/z
  // ∂u/∂x = -yz/x², ∂u/∂y = z/x, ∂u/∂z = y/x
  // ∂v/∂x = z/y, ∂v/∂y = -zx/y², ∂v/∂z = x/y
  // ∂w/∂x = y/z, ∂w/∂y = x/z, ∂w/∂z = -xy/z²
  
  const matrix: Matrix3x3 = [
    [-y * z / (x * x), z / x,           y / x],
    [z / y,            -z * x / (y * y), x / y],
    [y / z,            x / z,            -x * y / (z * z)]
  ];
  
  const determinant = matrix3x3Determinant(matrix);
  const inverse = matrix3x3Inverse(matrix);
  
  return { matrix, determinant, inverse, eigenvalues: null };
}

/**
 * Transform Point Using Jacobian
 * Applies coordinate transformation based on Jacobian matrix
 */
export function transformWithJacobian(
  point: [number, number, number],
  jacobian: Matrix3x3
): [number, number, number] {
  return [
    jacobian[0][0] * point[0] + jacobian[0][1] * point[1] + jacobian[0][2] * point[2],
    jacobian[1][0] * point[0] + jacobian[1][1] * point[1] + jacobian[1][2] * point[2],
    jacobian[2][0] * point[0] + jacobian[2][1] * point[1] + jacobian[2][2] * point[2]
  ];
}

/**
 * Compute Surface Curvature from Jacobian
 * Uses first and second fundamental forms
 */
export function surfaceCurvature(
  du: [number, number, number],
  dv: [number, number, number],
  duu: [number, number, number],
  duv: [number, number, number],
  dvv: [number, number, number]
): { gaussian: number; mean: number; principal: [number, number] } {
  // First fundamental form coefficients
  const E = du[0] * du[0] + du[1] * du[1] + du[2] * du[2];
  const F = du[0] * dv[0] + du[1] * dv[1] + du[2] * dv[2];
  const G = dv[0] * dv[0] + dv[1] * dv[1] + dv[2] * dv[2];
  
  // Surface normal
  const n: [number, number, number] = [
    du[1] * dv[2] - du[2] * dv[1],
    du[2] * dv[0] - du[0] * dv[2],
    du[0] * dv[1] - du[1] * dv[0]
  ];
  const nLen = Math.sqrt(n[0] ** 2 + n[1] ** 2 + n[2] ** 2);
  if (nLen > 0) {
    n[0] /= nLen; n[1] /= nLen; n[2] /= nLen;
  }
  
  // Second fundamental form coefficients
  const L = duu[0] * n[0] + duu[1] * n[1] + duu[2] * n[2];
  const M = duv[0] * n[0] + duv[1] * n[1] + duv[2] * n[2];
  const N = dvv[0] * n[0] + dvv[1] * n[1] + dvv[2] * n[2];
  
  const denom = E * G - F * F;
  if (Math.abs(denom) < 1e-10) {
    return { gaussian: 0, mean: 0, principal: [0, 0] };
  }
  
  // Gaussian curvature K = (LN - M²) / (EG - F²)
  const gaussian = (L * N - M * M) / denom;
  
  // Mean curvature H = (EN + GL - 2FM) / (2(EG - F²))
  const mean = (E * N + G * L - 2 * F * M) / (2 * denom);
  
  // Principal curvatures k1, k2
  const discriminant = Math.sqrt(Math.max(0, mean * mean - gaussian));
  const principal: [number, number] = [mean + discriminant, mean - discriminant];
  
  return { gaussian, mean, principal };
}

// ============================================================================
// EXPORTS SUMMARY
// ============================================================================

console.log('🔧 Internal Algorithm Utilities loaded:');
console.log('   📊 Sequence Alignment: Needleman-Wunsch, Smith-Waterman, Levenshtein');
console.log('   🌊 Signal Processing: DFT, IDFT, Gaussian Blur, Convolution');
console.log('   📈 Interpolation: LERP, SLERP, Bezier, Catmull-Rom, Hermite');
console.log('   🧮 Vector/Matrix: vec3 ops, Rodrigues rotation, Gradient, Hessian');
console.log('   ⚡ Physics: Spring-Damper, Collision Detection, Ray Intersection');
console.log('   🎯 Optimization: Gradient Descent, Simulated Annealing');
console.log('   🔢 Pattern: Safe Modulo, Modular Exponentiation, Regression');
console.log('   🧬 Jacobian: Coordinate Transforms, Surface Curvature, Volume Scaling');
