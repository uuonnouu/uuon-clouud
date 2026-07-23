import { ParametricSurface, getCleanDefaults } from '../types/shapes';
import { SurfaceParameters } from '../types/math';
import { piPhiEngine } from './piPhiConstantsEngine';

// Enhanced mathematical constants with extended precision
export const MATHEMATICAL_CONSTANTS: Record<string, ParametricSurface> = {

  golden_ratio: {
    name: "🌟 φ Golden Ratio (1.618) - Fundamental Proportion",
    equation: (u, v, params) => {
      const a = params.a ?? 5;
      const b = params.b ?? 5;
      const c = params.c ?? 3;

      const phi = 1.6180339887;
      const angle = u * Math.PI * 2;
      const spiralRadius = Math.pow(phi, v * 3);

      const x = a * spiralRadius * Math.cos(angle) / 5;
      const y = b * spiralRadius * Math.sin(angle) / 5;
      const z = c * (v - 0.5) * phi * 2;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 5, b: 5, c: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 64 })
  },

  pi_constant: {
    name: "🔄 π Circular Constant (3.142) - Cyclic/Rotational Phenomena",
    equation: (u, v, params) => {
      const a = params.a ?? 6;
      const b = params.b ?? 6;
      const c = params.c ?? 4;

      const pi = Math.PI;
      const theta = u * pi * 2;
      const phi = v * pi * 2;

      const majorRadius = pi;
      const minorRadius = pi * 0.3;

      const x = a * (majorRadius + minorRadius * Math.cos(phi)) * Math.cos(theta);
      const y = b * (majorRadius + minorRadius * Math.cos(phi)) * Math.sin(theta);
      const z = c * minorRadius * Math.sin(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 6, b: 6, c: 4, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 64 })
  },

  eulers_number: {
    name: "e Euler's Number (2.718)",
    equation: (u, v, params) => {
      const a = params.a ?? 5;
      const b = params.b ?? 5;
      const c = params.c ?? 4;

      const e = Math.E;
      const t = v * 2 * Math.PI;
      const spiralAngle = u * Math.PI * 4;

      const radius = Math.exp(t / e);

      const x = a * radius * Math.cos(spiralAngle) * 0.5;
      const y = b * radius * Math.sin(spiralAngle) * 0.5;
      const z = c * t * e * 0.3;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 5, b: 5, c: 4, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 64 })
  },

  pythagoras_constant: {
    name: "√2 Pythagoras (1.414)",
    equation: (u, v, params) => {
      const a = params.a ?? 5;
      const b = params.b ?? 5;
      const c = params.c ?? 3;

      const sqrt2 = Math.sqrt(2);
      const gridX = Math.floor(u * 4) / 4;
      const gridY = Math.floor(v * 4) / 4;

      const localU = (u * 4) % 1;
      const localV = (v * 4) % 1;

      const x = a * (gridX + localU * sqrt2 - 1);
      const y = b * (gridY + localV * sqrt2 - 1);
      const z = c * Math.sin((gridX + gridY) * Math.PI) * sqrt2 * 0.5;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 5, b: 5, c: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 })
  },

  sqrt_three: {
    name: "√3 Constant (1.732)",
    equation: (u, v, params) => {
      const a = params.a ?? 5;
      const b = params.b ?? 5;
      const c = params.c ?? 3;

      const sqrt3 = Math.sqrt(3);
      const hexAngle = Math.floor(u * 6);
      const localU = (u * 6) % 1;

      const angle = (hexAngle + localU) * Math.PI / 3;
      const radius = sqrt3 * (1 - v * 0.5);

      const x = a * radius * Math.cos(angle);
      const y = b * radius * Math.sin(angle);
      const z = c * v * sqrt3;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 5, b: 5, c: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 })
  },

  sqrt_five: {
    name: "√5 Constant (2.236)",
    equation: (u, v, params) => {
      const a = params.a ?? 6;
      const b = params.b ?? 6;
      const c = params.c ?? 4;

      const sqrt5 = Math.sqrt(5);
      const pentAngle = Math.floor(u * 5);
      const localU = (u * 5) % 1;

      const angle = (pentAngle + localU) * Math.PI * 2 / 5;
      const radius = sqrt5 * Math.cos(v * Math.PI / 2);

      const x = a * radius * Math.cos(angle);
      const y = b * radius * Math.sin(angle);
      const z = c * sqrt5 * Math.sin(v * Math.PI / 2);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 6, b: 6, c: 4, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 64 })
  },

  euler_mascheroni: {
    name: "γ Euler-Mascheroni (0.577)",
    equation: (u, v, params) => {
      const a = params.a ?? 4;
      const b = params.b ?? 4;
      const c = params.c ?? 2;

      const gamma = 0.5772156649;
      const harmonicSum = Math.log(1 + v) - v;

      const angle = u * Math.PI * 2;
      const radius = (gamma + harmonicSum) * 8;

      const x = a * radius * Math.cos(angle);
      const y = b * radius * Math.sin(angle);
      const z = c * harmonicSum * 10;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 4, b: 4, c: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 })
  },

  catalan_constant: {
    name: "G Catalan (0.916)",
    equation: (u, v, params) => {
      const a = params.a ?? 5;
      const b = params.b ?? 5;
      const c = params.c ?? 3;

      const G = 0.9159655942;
      const series = Math.pow(-1, Math.floor(v * 10)) / Math.pow(2 * Math.floor(v * 10) + 1, 2);

      const angle = u * Math.PI * 2;
      const radius = G * 5 * (1 + series);

      const x = a * radius * Math.cos(angle);
      const y = b * radius * Math.sin(angle);
      const z = c * v * G * 5;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 5, b: 5, c: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 64 })
  },

  apery_constant: {
    name: "ζ(3) Apéry (1.202)",
    equation: (u, v, params) => {
      const a = params.a ?? 5;
      const b = params.b ?? 5;
      const c = params.c ?? 3;

      const zeta3 = 1.2020569032;
      const cubePattern = Math.pow(v, 3);

      const angle = u * Math.PI * 2;
      const radius = zeta3 * 4 * (1 + cubePattern * 0.5);

      const x = a * radius * Math.cos(angle);
      const y = b * radius * Math.sin(angle);
      const z = c * cubePattern * zeta3 * 4;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 5, b: 5, c: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 64 })
  },

  khinchin_constant: {
    name: "K₀ Khinchin (2.685)",
    equation: (u, v, params) => {
      const a = params.a ?? 6;
      const b = params.b ?? 6;
      const c = params.c ?? 4;

      const K0 = 2.6854520010;
      const continuedFraction = 1 / (1 + v);

      const angle = u * Math.PI * 2;
      const radius = K0 * continuedFraction * 5;

      const x = a * radius * Math.cos(angle);
      const y = b * radius * Math.sin(angle);
      const z = c * Math.log(1 + v) * K0;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 6, b: 6, c: 4, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 64 })
  },

  feigenbaum_delta: {
    name: "δ Feigenbaum Delta (4.669)",
    equation: (u, v, params) => {
      const a = params.a ?? 7;
      const b = params.b ?? 7;
      const c = params.c ?? 5;

      const delta = 4.6692016091;
      const bifurcations = Math.floor(v * delta);
      const chaos = Math.sin(u * Math.PI * 2 * Math.pow(2, bifurcations));

      const angle = u * Math.PI * 2;
      const radius = delta * 0.6 * (1 + chaos * 0.3);

      const x = a * radius * Math.cos(angle);
      const y = b * radius * Math.sin(angle);
      const z = c * bifurcations * 0.5;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 7, b: 7, c: 5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 64 })
  },

  feigenbaum_alpha: {
    name: "α Feigenbaum Alpha (2.503)",
    equation: (u, v, params) => {
      const a = params.a ?? 6;
      const b = params.b ?? 6;
      const c = params.c ?? 4;

      const alpha = 2.5029078751;
      const scaling = Math.pow(alpha, -v);

      const angle = u * Math.PI * 2;
      const radius = alpha * scaling * 3;

      const x = a * radius * Math.cos(angle);
      const y = b * radius * Math.sin(angle);
      const z = c * (1 - scaling) * alpha * 2;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 6, b: 6, c: 4, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 64 })
  },

  conway_constant: {
    name: "λ Conway (1.303)",
    equation: (u, v, params) => {
      const a = params.a ?? 5;
      const b = params.b ?? 5;
      const c = params.c ?? 3;

      const lambda = 1.3035772691;
      const lookAndSay = Math.floor(Math.pow(lambda, v * 5));

      const angle = u * Math.PI * 2;
      const radius = lambda * 3 * Math.log(1 + lookAndSay);

      const x = a * radius * Math.cos(angle);
      const y = b * radius * Math.sin(angle);
      const z = c * v * lambda * 3;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 5, b: 5, c: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 })
  },

  mills_constant: {
    name: "θ Mills (1.306)",
    equation: (u, v, params) => {
      const a = params.a ?? 5;
      const b = params.b ?? 5;
      const c = params.c ?? 3;

      const theta = 1.3063778838;
      const primeLayer = Math.floor(Math.pow(theta, Math.pow(3, v * 3)));

      const angle = u * Math.PI * 2;
      const radius = theta * 3 * Math.log(1 + primeLayer % 100);

      const x = a * radius * Math.cos(angle);
      const y = b * radius * Math.sin(angle);
      const z = c * v * theta * 4;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 5, b: 5, c: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 })
  },

  fine_structure: {
    name: "α Fine-Structure (0.00729)",
    equation: (u, v, params) => {
      const a = params.a ?? 4;
      const b = params.b ?? 4;
      const c = params.c ?? 2;

      const alpha_fs = 0.0072973525693;
      const quantumWave = Math.sin(u * Math.PI * 137.036);

      const angle = u * Math.PI * 2;
      const radius = (alpha_fs * 1000 + quantumWave * 0.5);

      const x = a * radius * Math.cos(angle);
      const y = b * radius * Math.sin(angle);
      const z = c * v * alpha_fs * 1000;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 4, b: 4, c: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 137, vSegments: 64 })
  },

  ramanujan_soldner: {
    name: "μ Ramanujan-Soldner (1.451)",
    equation: (u, v, params) => {
      const a = params.a ?? 5;
      const b = params.b ?? 5;
      const c = params.c ?? 3;

      const mu = 1.4513692349;
      const logIntegral = Math.log(Math.log(2 + v * 10));

      const angle = u * Math.PI * 2;
      const radius = mu * 3 * (1 + logIntegral * 0.2);

      const x = a * radius * Math.cos(angle);
      const y = b * radius * Math.sin(angle);
      const z = c * logIntegral * mu;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 5, b: 5, c: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 })
  },

  plastic_number: {
    name: "ρ Plastic Number (1.325)",
    equation: (u, v, params) => {
      const a = params.a ?? 5;
      const b = params.b ?? 5;
      const c = params.c ?? 3;

      const rho = 1.3247179572;
      const plasticSpiral = Math.pow(rho, v * 2);

      const angle = u * Math.PI * 2;
      const radius = plasticSpiral * 2;

      const x = a * radius * Math.cos(angle);
      const y = b * radius * Math.sin(angle);
      const z = c * v * rho * 2;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 5, b: 5, c: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 64 })
  },

  silver_ratio: {
    name: "δ_S Silver Ratio (2.414)",
    equation: (u, v, params) => {
      const a = params.a ?? 6;
      const b = params.b ?? 6;
      const c = params.c ?? 4;

      const delta_s = 1 + Math.sqrt(2);
      const octagonAngle = Math.floor(u * 8);
      const localU = (u * 8) % 1;

      const angle = (octagonAngle + localU) * Math.PI / 4;
      const radius = delta_s * Math.cos(v * Math.PI / 2);

      const x = a * radius * Math.cos(angle);
      const y = b * radius * Math.sin(angle);
      const z = c * delta_s * Math.sin(v * Math.PI / 2);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 6, b: 6, c: 4, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 64 })
  },

  bronze_ratio: {
    name: "σ Bronze Ratio (3.303)",
    equation: (u, v, params) => {
      const a = params.a ?? 6;
      const b = params.b ?? 6;
      const c = params.c ?? 4;

      const sigma = (3 + Math.sqrt(13)) / 2;
      const bronzeSpiral = Math.pow(sigma, v * 0.8) / 3;

      const angle = u * Math.PI * 2;

      const x = a * bronzeSpiral * Math.cos(angle);
      const y = b * bronzeSpiral * Math.sin(angle);
      const z = c * v * sigma * 0.5;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 6, b: 6, c: 4, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 64 })
  },

  supergolden_ratio: {
    name: "ψ Supergolden (1.465)",
    equation: (u, v, params) => {
      const a = params.a ?? 5;
      const b = params.b ?? 5;
      const c = params.c ?? 3;

      const psi = 1.4655712318;
      const superSpiral = Math.pow(psi, v * 2.5) / 2;

      const angle = u * Math.PI * 2;

      const x = a * superSpiral * Math.cos(angle);
      const y = b * superSpiral * Math.sin(angle);
      const z = c * v * psi * 2;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 5, b: 5, c: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 64 })
  },

  glaisher_kinkelin: {
    name: "A Glaisher-Kinkelin (1.282)",
    equation: (u, v, params) => {
      const a = params.a ?? 5;
      const b = params.b ?? 5;
      const c = params.c ?? 3;

      const A = 1.2824271291;
      const productPattern = Math.exp(v * A);

      const angle = u * Math.PI * 2;
      const radius = A * productPattern * 0.8;

      const x = a * radius * Math.cos(angle);
      const y = b * radius * Math.sin(angle);
      const z = c * v * A * 3;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 5, b: 5, c: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 })
  },

  meissel_mertens: {
    name: "M Meissel-Mertens (0.262)",
    equation: (u, v, params) => {
      const a = params.a ?? 4;
      const b = params.b ?? 4;
      const c = params.c ?? 2;

      const M = 0.2614972128;
      const primeSum = Math.log(Math.log(2 + v * 20));

      const angle = u * Math.PI * 2;
      const radius = (M * 20 + primeSum);

      const x = a * radius * Math.cos(angle);
      const y = b * radius * Math.sin(angle);
      const z = c * primeSum * 2;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 4, b: 4, c: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 })
  },

  twin_prime: {
    name: "C₂ Twin Prime (0.660)",
    equation: (u, v, params) => {
      const a = params.a ?? 4;
      const b = params.b ?? 4;
      const c = params.c ?? 3;

      const C2 = 0.6601618158;
      const twinPattern = Math.sin(v * Math.PI * 10) * 0.3;

      const angle = u * Math.PI * 2;
      const radius = C2 * 8 * (1 + twinPattern);

      const x = a * radius * Math.cos(angle);
      const y = b * radius * Math.sin(angle);
      const z = c * v * C2 * 8;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 4, b: 4, c: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 64 })
  },

  landau_ramanujan: {
    name: "K Landau-Ramanujan (0.764)",
    equation: (u, v, params) => {
      const a = params.a ?? 5;
      const b = params.b ?? 5;
      const c = params.c ?? 3;

      const K_lr = 0.7642236536;
      const sumOfSquares = 1 / Math.sqrt(1 + v * 4);

      const angle = u * Math.PI * 2;
      const radius = K_lr * 8 * sumOfSquares;

      const x = a * radius * Math.cos(angle);
      const y = b * radius * Math.sin(angle);
      const z = c * (1 - sumOfSquares) * K_lr * 5;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 5, b: 5, c: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 64 })
  },

  tribonacci_constant: {
    name: "T Tribonacci (1.839)",
    equation: (u, v, params) => {
      const a = params.a ?? 5;
      const b = params.b ?? 5;
      const c = params.c ?? 3;

      const T = 1.8393972059;
      const triSpiral = Math.pow(T, v * 2) / 3;

      const angle = u * Math.PI * 2;
      const triModulation = Math.sin(v * Math.PI * 3) * 0.2;

      const x = a * triSpiral * Math.cos(angle) * (1 + triModulation);
      const y = b * triSpiral * Math.sin(angle) * (1 + triModulation);
      const z = c * v * T * 1.5;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 5, b: 5, c: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 64 })
  },

  pell_constant: {
    name: "P Pell (2.414)",
    equation: (u, v, params) => {
      const a = params.a ?? 6;
      const b = params.b ?? 6;
      const c = params.c ?? 4;

      const P = 1 + Math.sqrt(2);
      const pellSequence = Math.pow(P, v * 1.5) / 2;

      const angle = u * Math.PI * 2;

      const x = a * pellSequence * Math.cos(angle);
      const y = b * pellSequence * Math.sin(angle);
      const z = c * v * P;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 6, b: 6, c: 4, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 64 })
  },

  omega_constant: {
    name: "Ω Omega (0.567)",
    equation: (u, v, params) => {
      const a = params.a ?? 4;
      const b = params.b ?? 4;
      const c = params.c ?? 2;

      const omega = 0.5671432904;
      const lambertW = omega * Math.exp(omega * v);

      const angle = u * Math.PI * 2;
      const radius = lambertW * 5;

      const x = a * radius * Math.cos(angle);
      const y = b * radius * Math.sin(angle);
      const z = c * v * omega * 10;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 4, b: 4, c: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 })
  },

  champernowne_constant: {
    name: "C₁₀ Champernowne (0.123)",
    equation: (u, v, params) => {
      const a = params.a ?? 4;
      const b = params.b ?? 4;
      const c = params.c ?? 2;

      const C10 = 0.1234567891;
      const digitPattern = Math.floor(v * 100) % 10;

      const angle = u * Math.PI * 2;
      const radius = C10 * 50 + digitPattern * 0.5;

      const x = a * radius * Math.cos(angle);
      const y = b * radius * Math.sin(angle);
      const z = c * digitPattern;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 4, b: 4, c: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 100, vSegments: 64 })
  },

  phi_times_pi: {
    name: "⚡ φ×π Multiplicative Resonance (5.083) - Energy/Wave Dynamics",
    equation: (u, v, params) => {
      const a = params.a ?? 7;
      const b = params.b ?? 7;
      const c = params.c ?? 5;

      const phi = 1.6180339887;
      const pi = Math.PI;
      const constant = phi * pi;

      const theta = u * pi * 2;
      const waveAmplitude = Math.sin(v * pi * 3) * Math.cos(theta * constant);
      const energyRadius = constant * (1 + waveAmplitude * 0.3);

      const x = a * energyRadius * Math.cos(theta);
      const y = b * energyRadius * Math.sin(theta);
      const z = c * waveAmplitude * constant * 0.5;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 7, b: 7, c: 5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 96 })
  },

  phi_plus_pi: {
    name: "📈 φ+π Additive Harmony (4.760) - Growth/Expansion Systems",
    equation: (u, v, params) => {
      const a = params.a ?? 7;
      const b = params.b ?? 7;
      const c = params.c ?? 5;

      const phi = 1.6180339887;
      const pi = Math.PI;
      const constant = phi + pi;

      const angle = u * pi * 2;
      const growthSpiral = Math.pow(constant, v * 0.6);

      const expansionFactor = 1 + Math.sin(v * pi * 2) * 0.2;

      const x = a * growthSpiral * Math.cos(angle) * expansionFactor;
      const y = b * growthSpiral * Math.sin(angle) * expansionFactor;
      const z = c * v * constant;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 7, b: 7, c: 5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 96 })
  },

  phi_median_pi: {
    name: "⚖️ φ⊙π Median Balance (3.351) - Equilibrium States",
    equation: (u, v, params) => {
      const a = params.a ?? 6;
      const b = params.b ?? 6;
      const c = params.c ?? 4;

      const phi = 1.6180339887;
      const pi = Math.PI;
      const constant = (phi + pi) / 2;

      const theta = u * pi * 2;
      const balanceOscillation = Math.sin(v * pi) * Math.cos(v * pi);
      const radius = constant * (1 + balanceOscillation * 0.4);

      const x = a * radius * Math.cos(theta);
      const y = b * radius * Math.sin(theta);
      const z = c * constant * Math.sin(v * pi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 6, b: 6, c: 4, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 96 })
  },

  phi_mean_pi: {
    name: "📊 φ∅π Mean Integration (3.327) - Statistical/Average Behaviors",
    equation: (u, v, params) => {
      const a = params.a ?? 6;
      const b = params.b ?? 6;
      const c = params.c ?? 4;

      const phi = 1.6180339887;
      const pi = Math.PI;
      const constant = Math.sqrt(phi * pi);

      const angle = u * pi * 2;
      const statisticalWave = Math.exp(-Math.pow(v - 0.5, 2) * 4);
      const radius = constant * (1 + statisticalWave * 0.5);

      const x = a * radius * Math.cos(angle);
      const y = b * radius * Math.sin(angle);
      const z = c * statisticalWave * constant;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 6, b: 6, c: 4, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 96 })
  },

  phi_divide_pi: {
    name: "📏 φ/π Proportional Ratio (1.942) - Scaling/Dimensional Relations",
    equation: (u, v, params) => {
      const a = params.a ?? 5;
      const b = params.b ?? 5;
      const c = params.c ?? 3;

      const phi = 1.6180339887;
      const pi = Math.PI;
      const constant = phi / pi;

      const fractalLevel = Math.floor(v * 5);
      const scaleFactor = Math.pow(constant, fractalLevel);

      const angle = u * pi * 2;
      const radius = scaleFactor * 8;

      const x = a * radius * Math.cos(angle);
      const y = b * radius * Math.sin(angle);
      const z = c * fractalLevel * constant * 2;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 5, b: 5, c: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 80 })
  },

  phi_minus_pi: {
    name: "⚡ φ-π Differential Gap (1.524) - Tension/Contrast Dynamics",
    equation: (u, v, params) => {
      const a = params.a ?? 5;
      const b = params.b ?? 5;
      const c = params.c ?? 3;

      const phi = 1.6180339887;
      const pi = Math.PI;
      const constant = Math.abs(phi - pi);

      const angle = u * pi * 2;
      const tensionWave = Math.sin(v * pi * 4) * Math.cos(u * pi * 8);
      const radius = constant * 3 * (1 + tensionWave);

      const x = a * radius * Math.cos(angle);
      const y = b * radius * Math.sin(angle);
      const z = c * tensionWave * constant * 2;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 5, b: 5, c: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 96 })
  },

  phi_power_pi: {
    name: "🌌 φ⊕π Total Synthesis (13.308) - Cosmic/Universal Scale",
    equation: (u, v, params) => {
      const a = params.a ?? 10;
      const b = params.b ?? 10;
      const c = params.c ?? 8;

      const phi = 1.6180339887;
      const pi = Math.PI;
      const constant = Math.pow(phi, pi);

      const cosmicAngle = u * pi * 2;
      const galaxySpiral = Math.log(1 + v * constant) / 2;
      const radius = galaxySpiral;

      const expansionPulse = Math.sin(v * pi * 2) * 0.15;

      const x = a * radius * Math.cos(cosmicAngle) * (1 + expansionPulse);
      const y = b * radius * Math.sin(cosmicAngle) * (1 + expansionPulse);
      const z = c * v * Math.log(constant);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 10, b: 10, c: 8, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 96 })
  }
};

export const DERIVED_CONSTANTS = {
  PHI_SQUARED: 2.618033988749895,
  PHI_CUBED: 4.23606797749979,
  PHI_TO_PI: Math.pow(1.618033988749, Math.PI),
  PHI_TIMES_PI: 1.618033988749 * Math.PI,
  PHI_PLUS_PI: 1.618033988749 + Math.PI,
  PHI_MEDIAN_PI: (1.618033988749 + Math.PI) / 2,
  PHI_MEAN_PI: Math.sqrt(1.618033988749 * Math.PI),
  PHI_OVER_PI: 1.618033988749 / Math.PI,
  PHI_MINUS_PI: Math.abs(1.618033988749 - Math.PI)
};