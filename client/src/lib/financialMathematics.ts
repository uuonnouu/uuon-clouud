import { SurfaceParameters } from '../types/math';
import { ParametricSurface } from '../types/shapes';

/**
 * FINANCIAL MATHEMATICS & MACHINE LEARNING ALGORITHMS
 * High-value commercial and research applications
 * Author: UUON Foundation Inc.
 */

export const FINANCIAL_MATHEMATICS: Record<string, ParametricSurface> = {
  
  // ============================================================================
  // BLACK-SCHOLES OPTION PRICING
  // ============================================================================
  
  black_scholes_surface: {
    name: "💰 Black-Scholes Option Pricing Surface",
    equation: (u, v, params) => {
      const { a = 100, b = 0.2, c = 0.05 } = params;
      const S = a * (u + 0.1); // Stock price
      const T = v * 2; // Time to maturity
      const K = a; // Strike price
      const sigma = b; // Volatility
      const r = c; // Risk-free rate
      
      const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T + 0.001));
      const d2 = d1 - sigma * Math.sqrt(T + 0.001);
      
      // Call option price
      const normCDF = (x: number) => 0.5 * (1 + Math.tanh(x / Math.sqrt(2)));
      const callPrice = S * normCDF(d1) - K * Math.exp(-r * T) * normCDF(d2);
      
      return [S / 50 - 1, T, callPrice / 20];
    },
    defaultParams: { a: 100, b: 0.2, c: 0.05, uMin: 0, uMax: 2, vMin: 0, vMax: 1, uSegments: 64, vSegments: 48 }
  },

  volatility_surface: {
    name: "📊 Implied Volatility Surface",
    equation: (u, v, params) => {
      const { a = 1, b = 0.3, c = 0.1 } = params;
      const strike = a * (u * 2 + 0.5); // Strike prices
      const maturity = v * 3; // Time to maturity
      
      // Volatility smile effect
      const moneyness = Math.log(strike / a);
      const vol = b + c * (moneyness * moneyness) + 0.05 * Math.sin(maturity * 2);
      
      return [moneyness * 2, maturity, vol * 3];
    },
    defaultParams: { a: 1, b: 0.3, c: 0.1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 48 }
  },

  // ============================================================================
  // CRYPTOCURRENCY & MARKET DYNAMICS
  // ============================================================================
  
  crypto_price_fractal: {
    name: "₿ Cryptocurrency Price Fractal",
    equation: (u, v, params) => {
      const { a = 1, b = 0.5, c = 3 } = params;
      const time = u * 10;
      const freq = v * 5;
      
      // Multi-scale price dynamics
      const trend = Math.exp(b * time / 10);
      const cycles = Math.sin(freq * time) + 0.5 * Math.sin(2 * freq * time);
      const volatility = a * (1 + 0.3 * Math.sin(c * time));
      
      const price = trend * (1 + 0.2 * cycles) * volatility;
      
      return [time - 5, freq - 2.5, price];
    },
    defaultParams: { a: 1, b: 0.5, c: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 64 }
  },

  monte_carlo_risk: {
    name: "🎲 Monte Carlo Risk Analysis",
    equation: (u, v, params) => {
      const { a = 1, b = 0.15, c = 100 } = params;
      const scenario = u * c;
      const timeStep = v * 10;
      
      // Geometric Brownian Motion
      const drift = a * 0.1;
      const diffusion = b * Math.sqrt(timeStep + 0.1);
      const randomWalk = Math.sin(scenario * 0.1) * Math.cos(timeStep * 0.2);
      
      const value = a * Math.exp((drift - 0.5 * b * b) * timeStep + diffusion * randomWalk);
      
      return [scenario / 50 - 1, timeStep, value];
    },
    defaultParams: { a: 1, b: 0.15, c: 100, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 64 }
  },

  // ============================================================================
  // MACHINE LEARNING VISUALIZATION
  // ============================================================================
  
  neural_loss_landscape: {
    name: "🧠 Neural Network Loss Landscape",
    equation: (u, v, params) => {
      const { a = 2, b = 1.5, c = 0.5 } = params;
      const w1 = a * (u - 0.5) * 4;
      const w2 = a * (v - 0.5) * 4;
      
      // Loss function with local minima and global minimum
      const loss = b * (Math.pow(w1 * w1 + w2 * w2 - c, 2) / 4 + 
                   0.3 * Math.sin(w1 * 3) * Math.cos(w2 * 3) +
                   0.1 * (w1 * w1 + w2 * w2));
      
      return [w1, w2, loss];
    },
    defaultParams: { a: 2, b: 1.5, c: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 96 }
  },

  gradient_descent_path: {
    name: "⬇️ Gradient Descent Optimization",
    equation: (u, v, params) => {
      const { a = 2, b = 0.1, c = 5 } = params;
      const iteration = u * 50;
      const dimension = v * Math.PI * 2;
      
      // Optimization trajectory
      const x = a * Math.exp(-b * iteration) * Math.cos(dimension);
      const y = a * Math.exp(-b * iteration) * Math.sin(dimension);
      const loss = Math.exp(-b * iteration) * (1 + 0.2 * Math.sin(c * iteration));
      
      return [x, y, loss * 2];
    },
    defaultParams: { a: 2, b: 0.1, c: 5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 32 }
  },

  attention_mechanism: {
    name: "👁️ Transformer Attention Heatmap",
    equation: (u, v, params) => {
      const { a = 1, b = 8, c = 0.5 } = params;
      const query = u * 10;
      const key = v * 10;
      
      // Attention scores with multi-head pattern
      const similarity = Math.exp(-c * Math.pow(query - key, 2));
      const multiHead = (Math.sin(query * b) + Math.cos(key * b)) / 2;
      const attention = a * similarity * (1 + 0.3 * multiHead);
      
      return [query - 5, key - 5, attention];
    },
    defaultParams: { a: 1, b: 8, c: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  // ============================================================================
  // CRYPTOGRAPHIC ALGORITHMS
  // ============================================================================
  
  elliptic_curve_crypto: {
    name: "🔐 Elliptic Curve Cryptography",
    equation: (u, v, params) => {
      const { a = 2, b = 3, c = 5 } = params;
      const theta = u * 2 * Math.PI;
      const t = v * 4 - 2;
      
      // Elliptic curve: y^2 = x^3 + ax + b
      const x = t;
      const ySquared = Math.pow(t, 3) + a * t + b;
      const y = Math.sqrt(Math.abs(ySquared)) * Math.sign(Math.sin(theta));
      
      const radius = 0.3 + 0.1 * Math.cos(c * theta);
      const ringX = (1 + radius) * Math.cos(theta);
      const ringY = (1 + radius) * Math.sin(theta);
      
      return [ringX + x * 0.2, ringY + y * 0.2, t];
    },
    defaultParams: { a: 2, b: 3, c: 5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 48 }
  },

  hash_avalanche_effect: {
    name: "# SHA-256 Avalanche Visualization",
    equation: (u, v, params) => {
      const { a = 1, b = 256, c = 0.5 } = params;
      const bitPosition = Math.floor(u * b);
      const inputChange = v * 8;
      
      // Avalanche effect: small input change -> large output change
      const avalanche = Math.abs(Math.sin(bitPosition * 0.1 + inputChange) + 
                                 Math.cos(bitPosition * 0.2 - inputChange * 0.5));
      const cascade = a * avalanche * (1 + c * Math.sin(bitPosition * inputChange * 0.01));
      
      return [bitPosition / 128 - 1, inputChange - 4, cascade];
    },
    defaultParams: { a: 1, b: 256, c: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 64 }
  },

  blockchain_merkle_tree: {
    name: "⛓️ Blockchain Merkle Tree Structure",
    equation: (u, v, params) => {
      const { a = 2, b = 4, c = 0.3 } = params;
      const depth = v * b;
      const position = u * Math.pow(2, Math.floor(depth));
      
      // Binary tree structure
      const x = a * (position / Math.pow(2, Math.floor(depth)) - 0.5) * 4;
      const y = -depth;
      const hash = c * Math.sin(position * 10 + depth * 5);
      
      return [x, y + 2, hash];
    },
    defaultParams: { a: 2, b: 4, c: 0.3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  // ============================================================================
  // INFORMATION THEORY & ENTROPY
  // ============================================================================
  
  shannon_entropy_surface: {
    name: "📡 Shannon Information Entropy",
    equation: (u, v, params) => {
      const { a = 1, b = 2, c = 0.5 } = params;
      const p1 = u; // Probability distribution
      const p2 = 1 - u;
      const scale = v * b;
      
      // Shannon entropy: -Σ p*log(p)
      const entropy = p1 > 0.001 && p2 > 0.001 ? 
                     -(p1 * Math.log2(p1) + p2 * Math.log2(p2)) : 0;
      
      const surface = a * entropy * scale * (1 + c * Math.sin(u * Math.PI * 4));
      
      return [u * 2 - 1, v * 2 - 1, surface];
    },
    defaultParams: { a: 1, b: 2, c: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 48 }
  },

  kolmogorov_complexity: {
    name: "🔢 Kolmogorov Complexity Landscape",
    equation: (u, v, params) => {
      const { a = 2, b = 3, c = 0.7 } = params;
      const pattern = u * 10;
      const iteration = v * 10;
      
      // Approximation of algorithmic complexity
      const periodicPart = Math.abs(Math.sin(pattern));
      const chaoticPart = Math.abs(Math.sin(pattern * b) * Math.cos(iteration * c));
      const complexity = a * (periodicPart + chaoticPart) / 2;
      
      return [pattern - 5, iteration - 5, complexity];
    },
    defaultParams: { a: 2, b: 3, c: 0.7, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 96 }
  },

  quantum_information_flow: {
    name: "⚛️ Quantum Information Flow",
    equation: (u, v, params) => {
      const { a = 1.5, b = 5, c = 0.3 } = params;
      const qubit1 = u * Math.PI * 2;
      const qubit2 = v * Math.PI * 2;
      
      // Quantum state entanglement visualization
      const amplitude = a * Math.sqrt(Math.abs(Math.cos(qubit1) * Math.sin(qubit2)));
      const phase = b * (qubit1 + qubit2);
      const flow = amplitude * (1 + c * Math.cos(phase));
      
      return [Math.cos(qubit1) * 2, Math.sin(qubit2) * 2, flow];
    },
    defaultParams: { a: 1.5, b: 5, c: 0.3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  }
};
