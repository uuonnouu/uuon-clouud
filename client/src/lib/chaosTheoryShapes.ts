import { SurfaceParameters } from '../types/math';
import { getCleanDefaults } from '../types/shapes';

export interface ParametricSurface {
  name: string;
  description?: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

/**
 * CHAOS THEORY SHAPES LIBRARY
 * 
 * Core Chaos Theory Equations visualized as parametric 3D surfaces:
 * - Logistic Map (discrete dynamical system)
 * - Lyapunov Exponent (chaos measurement)
 * - Lorenz Attractor (atmospheric convection)
 * - Rössler Attractor (continuous chaos)
 * - Fractal Dimensions (Hausdorff, Box-Counting, Correlation)
 * - Hénon Map (discrete chaos)
 * - Van der Pol Oscillator (relaxation oscillator)
 * - Duffing Equation (forced oscillator)
 * - Feigenbaum Constants (period-doubling universality)
 * 
 * All shapes exhibit sensitive dependence on initial conditions,
 * strange attractors, and deterministic yet unpredictable behavior.
 */

export const CHAOS_THEORY_SHAPES: Record<string, ParametricSurface> = {

  // ============================================================================
  // LOGISTIC MAP - Discrete Dynamical System
  // x_{n+1} = rx_n(1 - x_n)
  // Shows period-doubling route to chaos as parameter r increases
  // ============================================================================
  logistic_map: {
    name: "📈 Logistic Map - Period Doubling Route to Chaos",
    description: "x_{n+1} = rx_n(1 - x_n) - Discrete dynamical system showing bifurcation cascade",
    equation: (u, v, params) => {
      const scale = params.a ?? 1;
      const r = 2.5 + (params.b ?? 1) * 1.5; // r parameter: 2.5 to 4.0
      const iterations = Math.floor(20 + (params.c ?? 1) * 10);
      
      // u controls initial x0, v controls r parameter variation
      let x = 0.1 + u * 0.8; // Initial condition x0
      const rLocal = r + v * 0.5;
      
      // Iterate logistic map
      for (let i = 0; i < iterations; i++) {
        x = rLocal * x * (1 - x);
      }
      
      // Map to 3D surface - bifurcation diagram style
      const xCoord = (u - 0.5) * 10 * scale;
      const yCoord = (v - 0.5) * 10 * scale;
      const zCoord = x * 5 * scale;
      
      return [xCoord, yCoord, zCoord];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 64, vSegments: 64
    })
  },

  // ============================================================================
  // LYAPUNOV EXPONENT SURFACE
  // λ = lim_{n→∞} (1/n) Σ ln|f'(x_i)|
  // Positive λ indicates chaotic behavior
  // ============================================================================
  lyapunov_exponent: {
    name: "λ Lyapunov Exponent - Chaos Measurement Surface",
    description: "λ = lim (1/n) Σ ln|f'(x_i)| - Measures sensitivity to initial conditions",
    equation: (u, v, params) => {
      const scale = params.a ?? 1;
      const rBase = 2.5 + (params.b ?? 1) * 1.5;
      const iterations = Math.floor(50 + (params.c ?? 1) * 50);
      
      // r varies with u, compute Lyapunov exponent at each point
      const r = rBase + u * 1.5;
      let x = 0.5; // Fixed initial condition
      let lyapunov = 0;
      
      // Transient iterations
      for (let i = 0; i < 100; i++) {
        x = r * x * (1 - x);
      }
      
      // Compute Lyapunov exponent
      for (let i = 0; i < iterations; i++) {
        const derivative = Math.abs(r * (1 - 2 * x));
        if (derivative > 0) {
          lyapunov += Math.log(derivative);
        }
        x = r * x * (1 - x);
      }
      lyapunov /= iterations;
      
      // Map to 3D: x=r parameter, y=v variation, z=Lyapunov exponent
      const xCoord = (u - 0.5) * 10 * scale;
      const yCoord = (v - 0.5) * 10 * scale;
      const zCoord = lyapunov * 2 * scale;
      
      return [xCoord, yCoord, zCoord];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 64, vSegments: 64
    })
  },

  // ============================================================================
  // LORENZ ATTRACTOR - Atmospheric Convection
  // dx/dt = σ(y - x), dy/dt = x(ρ - z) - y, dz/dt = xy - βz
  // The famous "butterfly effect" attractor
  // ============================================================================
  lorenz_attractor: {
    name: "🦋 Lorenz Attractor - Butterfly Effect",
    description: "dx/dt=σ(y-x), dy/dt=x(ρ-z)-y, dz/dt=xy-βz - Atmospheric convection chaos",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 0.15;
      const sigma = 10 * (params.b ?? 1);
      const rho = 28 * (params.c ?? 1);
      const beta = 8/3;
      
      // Initial conditions based on u,v
      let x = -8 + u * 16;
      let y = -8 + v * 16;
      let z = 25;
      
      const dt = 0.01;
      const steps = 200;
      
      // Integrate Lorenz system
      for (let i = 0; i < steps; i++) {
        const dx = sigma * (y - x);
        const dy = x * (rho - z) - y;
        const dz = x * y - beta * z;
        
        x += dx * dt;
        y += dy * dt;
        z += dz * dt;
      }
      
      return [x * scale, y * scale, (z - 25) * scale];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 64, vSegments: 64
    })
  },

  // ============================================================================
  // LORENZ STRANGE ATTRACTOR TRAJECTORY
  // Full 3D trajectory visualization of the iconic double-scroll
  // ============================================================================
  lorenz_trajectory: {
    name: "🌀 Lorenz Strange Attractor Trajectory",
    description: "Complete trajectory of the Lorenz system forming the iconic butterfly wings",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 0.12;
      const sigma = 10 * (params.b ?? 1);
      const rho = 28 * (params.c ?? 1);
      const beta = 8/3;
      
      // Use u as time parameter for trajectory
      const t = u * 40; // Time evolution
      const perturbation = v * 0.01; // Small perturbation for surface
      
      let x = 1 + perturbation;
      let y = 1;
      let z = 1;
      
      const dt = 0.01;
      const steps = Math.floor(t / dt);
      
      for (let i = 0; i < steps; i++) {
        const dx = sigma * (y - x);
        const dy = x * (rho - z) - y;
        const dz = x * y - beta * z;
        
        x += dx * dt;
        y += dy * dt;
        z += dz * dt;
      }
      
      // Add thickness based on v
      const thickness = Math.sin(v * Math.PI * 2) * 0.5;
      
      return [x * scale + thickness, y * scale, (z - 25) * scale];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 200, vSegments: 20
    })
  },

  // ============================================================================
  // RÖSSLER ATTRACTOR
  // dx/dt = -y - z, dy/dt = x + ay, dz/dt = b + z(x - c)
  // Simpler chaos than Lorenz but equally important
  // ============================================================================
  rossler_attractor: {
    name: "🌊 Rössler Attractor - Continuous Chaos",
    description: "dx/dt=-y-z, dy/dt=x+ay, dz/dt=b+z(x-c) - Spiral chaos attractor",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 0.3;
      const a = 0.2 * (params.b ?? 1);
      const b = 0.2;
      const c = 5.7 * (params.c ?? 1);
      
      // Initial conditions
      let x = -1 + u * 2;
      let y = -1 + v * 2;
      let z = 0;
      
      const dt = 0.02;
      const steps = 300;
      
      // Integrate Rössler system
      for (let i = 0; i < steps; i++) {
        const dx = -y - z;
        const dy = x + a * y;
        const dz = b + z * (x - c);
        
        x += dx * dt;
        y += dy * dt;
        z += dz * dt;
      }
      
      return [x * scale, y * scale, z * scale * 0.3];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 64, vSegments: 64
    })
  },

  // ============================================================================
  // RÖSSLER SPIRAL TRAJECTORY
  // Full spiral trajectory of the Rössler system
  // ============================================================================
  rossler_spiral: {
    name: "🔄 Rössler Spiral - Folding Chaos",
    description: "Rössler attractor trajectory showing stretching and folding dynamics",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 0.25;
      const a = 0.2 * (params.b ?? 1);
      const b = 0.2;
      const c = 5.7 * (params.c ?? 1);
      
      const t = u * 100;
      const offset = v * 0.1;
      
      let x = 0.1 + offset;
      let y = 0.1;
      let z = 0.1;
      
      const dt = 0.02;
      const steps = Math.floor(t / dt);
      
      for (let i = 0; i < steps; i++) {
        const dx = -y - z;
        const dy = x + a * y;
        const dz = b + z * (x - c);
        
        x += dx * dt;
        y += dy * dt;
        z += dz * dt;
      }
      
      const ribbon = Math.sin(v * Math.PI * 2) * 0.3;
      
      return [x * scale, y * scale + ribbon, z * scale * 0.3];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 250, vSegments: 15
    })
  },

  // ============================================================================
  // HAUSDORFF DIMENSION FRACTAL
  // D_H = lim_{ε→0} [log N(ε) / log(1/ε)]
  // Self-similar fractal structure
  // ============================================================================
  hausdorff_fractal: {
    name: "📐 Hausdorff Dimension Fractal",
    description: "D_H = lim[log N(ε) / log(1/ε)] - Self-similar fractal structure",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 4;
      const iterations = Math.floor(4 + (params.b ?? 1) * 3);
      const dimension = 1.5 + (params.c ?? 1) * 0.5; // Fractal dimension parameter
      
      let x = (u - 0.5) * 2;
      let y = (v - 0.5) * 2;
      let z = 0;
      
      // Sierpinski-like iteration with dimension control
      for (let i = 0; i < iterations; i++) {
        const scaleFactor = Math.pow(0.5, 1 / dimension);
        const angle = i * Math.PI / 3;
        
        // Fold and scale
        x = Math.abs(x) - scaleFactor;
        y = Math.abs(y) - scaleFactor;
        
        // Rotate
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const nx = x * cosA - y * sinA;
        const ny = x * sinA + y * cosA;
        x = nx;
        y = ny;
        
        z += Math.sin(x * y * 5) * Math.pow(0.6, i);
      }
      
      return [x * scale, y * scale, z * scale];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 64, vSegments: 64
    })
  },

  // ============================================================================
  // BOX-COUNTING DIMENSION SURFACE
  // D_box = lim_{ε→0} [log N(ε) / log(1/ε)]
  // Grid-based fractal analysis visualization
  // ============================================================================
  box_counting_fractal: {
    name: "📦 Box-Counting Dimension Surface",
    description: "D_box = lim[log N(ε) / log(1/ε)] - Grid-based fractal measurement",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 5;
      const levels = Math.floor(3 + (params.b ?? 1) * 4);
      const roughness = (params.c ?? 1);
      
      let z = 0;
      const x = (u - 0.5) * 2;
      const y = (v - 0.5) * 2;
      
      // Multi-scale box counting inspired surface
      for (let level = 0; level < levels; level++) {
        const boxSize = Math.pow(2, -level);
        const freq = Math.pow(2, level);
        const amplitude = Math.pow(0.5, level * roughness);
        
        // Quantize to boxes then add fractal detail
        const qx = Math.floor(x / boxSize) * boxSize;
        const qy = Math.floor(y / boxSize) * boxSize;
        
        z += amplitude * Math.sin(qx * freq * Math.PI * 4 + qy * freq * Math.PI * 3);
      }
      
      return [x * scale, y * scale, z * scale];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 64, vSegments: 64
    })
  },

  // ============================================================================
  // CORRELATION DIMENSION ATTRACTOR
  // D_2 = lim_{r→0} [log C(r) / log r]
  // Based on point correlation analysis
  // ============================================================================
  correlation_dimension: {
    name: "🔗 Correlation Dimension Attractor",
    description: "D_2 = lim[log C(r) / log r] - Point correlation fractal",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 4;
      const correlationPower = (params.b ?? 1) * 2;
      const complexity = (params.c ?? 1) * 3;
      
      // Generate correlated points structure
      const theta = u * Math.PI * 4 * complexity;
      const phi = v * Math.PI * 2;
      
      // Correlation-based radius variation
      const r0 = 1;
      const correlation = Math.pow(Math.sin(theta * 3) * Math.cos(phi * 2), 2);
      const r = r0 * (1 + correlationPower * correlation);
      
      // Add fractal correlation layers
      let x = r * Math.cos(theta) * Math.sin(phi);
      let y = r * Math.sin(theta) * Math.sin(phi);
      let z = r * Math.cos(phi);
      
      // Apply correlation-dimension scaling
      const d2 = 1.5 + 0.5 * Math.sin(theta + phi);
      const scaleMod = Math.pow(r, d2 - 2);
      
      return [x * scale * scaleMod, y * scale * scaleMod, z * scale];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 64, vSegments: 64
    })
  },

  // ============================================================================
  // HÉNON MAP - Discrete 2D Chaos
  // x_{n+1} = 1 - ax_n² + y_n
  // y_{n+1} = bx_n
  // ============================================================================
  henon_map: {
    name: "🗺️ Hénon Map - Discrete Strange Attractor",
    description: "x_{n+1} = 1 - ax² + y, y_{n+1} = bx - Quadratic area-preserving map",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 3;
      const aParam = 1.4 * (params.b ?? 1); // Classic value: 1.4
      const bParam = 0.3 * (params.c ?? 1); // Classic value: 0.3
      
      // Initial conditions from u,v
      let x = -1.5 + u * 3;
      let y = -0.5 + v;
      
      const iterations = 100;
      
      // Iterate Hénon map
      for (let i = 0; i < iterations; i++) {
        const xNew = 1 - aParam * x * x + y;
        const yNew = bParam * x;
        x = xNew;
        y = yNew;
        
        // Bound check to prevent explosion
        if (Math.abs(x) > 100 || Math.abs(y) > 100) {
          x = 0;
          y = 0;
          break;
        }
      }
      
      // Map to 3D - height based on final state
      const xCoord = (u - 0.5) * 10 * scale;
      const yCoord = (v - 0.5) * 10 * scale;
      const zCoord = (x * 0.5 + y * 0.5) * scale;
      
      return [xCoord, yCoord, zCoord];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 200, vSegments: 200
    })
  },

  // ============================================================================
  // HÉNON ATTRACTOR BASIN
  // Basin of attraction visualization
  // ============================================================================
  henon_basin: {
    name: "🌐 Hénon Attractor Basin",
    description: "Basin of attraction for the Hénon map - shows escape time",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 5;
      const aParam = 1.4 * (params.b ?? 1);
      const bParam = 0.3 * (params.c ?? 1);
      
      let x = -2 + u * 4;
      let y = -2 + v * 4;
      
      let escapeTime = 0;
      const maxIter = 50;
      
      for (let i = 0; i < maxIter; i++) {
        const xNew = 1 - aParam * x * x + y;
        const yNew = bParam * x;
        x = xNew;
        y = yNew;
        
        if (Math.abs(x) > 10 || Math.abs(y) > 10) {
          escapeTime = i;
          break;
        }
        escapeTime = maxIter;
      }
      
      return [
        (u - 0.5) * 10 * scale,
        (v - 0.5) * 10 * scale,
        (escapeTime / maxIter) * 3 * scale
      ];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 64, vSegments: 64
    })
  },

  // ============================================================================
  // VAN DER POL OSCILLATOR
  // d²x/dt² - μ(1 - x²)dx/dt + x = 0
  // Relaxation oscillator with limit cycle
  // ============================================================================
  van_der_pol: {
    name: "📡 Van der Pol Oscillator",
    description: "d²x/dt² - μ(1-x²)dx/dt + x = 0 - Relaxation oscillator limit cycle",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 2;
      const mu = 1 + (params.b ?? 1) * 2; // Nonlinearity parameter
      const time = (params.c ?? 1) * 30;
      
      // Use u as time, v as initial condition perturbation
      const t = u * time;
      const x0 = 2 * (v - 0.5);
      
      // Initial conditions
      let x = x0 + 0.1;
      let dxdt = 0;
      
      const dt = 0.01;
      const steps = Math.floor(t / dt);
      
      // Integrate Van der Pol equation
      for (let i = 0; i < steps; i++) {
        const d2xdt2 = mu * (1 - x * x) * dxdt - x;
        dxdt += d2xdt2 * dt;
        x += dxdt * dt;
      }
      
      // Phase space representation (x, dx/dt, t)
      return [x * scale, dxdt * scale * 0.5, (v - 0.5) * 10 * scale];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 64, vSegments: 32
    })
  },

  // ============================================================================
  // VAN DER POL LIMIT CYCLE
  // Beautiful closed orbit in phase space
  // ============================================================================
  van_der_pol_limit_cycle: {
    name: "⭕ Van der Pol Limit Cycle",
    description: "Stable periodic orbit of the Van der Pol oscillator in phase space",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 2;
      const mu = 1 + (params.b ?? 1) * 3;
      
      // Parametric time around limit cycle
      const t = u * 50;
      const thickness = v * 0.3;
      
      let x = 0.1;
      let dxdt = 0;
      
      const dt = 0.01;
      const steps = Math.floor(t / dt);
      
      for (let i = 0; i < steps; i++) {
        const d2xdt2 = mu * (1 - x * x) * dxdt - x;
        dxdt += d2xdt2 * dt;
        x += dxdt * dt;
      }
      
      // Create tube around trajectory
      const normal = Math.sin(v * Math.PI * 2);
      const binormal = Math.cos(v * Math.PI * 2);
      
      return [
        x * scale + normal * thickness,
        dxdt * scale * 0.5 + binormal * thickness,
        u * 5 * scale
      ];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 200, vSegments: 16
    })
  },

  // ============================================================================
  // DUFFING EQUATION - Forced Oscillator
  // d²x/dt² + δdx/dt + αx + βx³ = γcos(ωt)
  // Shows chaos in forced nonlinear oscillator
  // ============================================================================
  duffing_oscillator: {
    name: "〰️ Duffing Oscillator - Forced Chaos",
    description: "d²x/dt² + δdx/dt + αx + βx³ = γcos(ωt) - Nonlinear forced oscillator",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 2;
      const delta = 0.3 * (params.b ?? 1);  // Damping
      const gamma = 0.5 * (params.c ?? 1);  // Forcing amplitude
      const alpha = -1;  // Linear stiffness (negative for double-well)
      const beta = 1;    // Nonlinear stiffness
      const omega = 1.2; // Forcing frequency
      
      const time = u * 100;
      const x0 = (v - 0.5) * 2;
      
      let x = x0;
      let dxdt = 0;
      let t = 0;
      
      const dt = 0.02;
      const steps = Math.floor(time / dt);
      
      for (let i = 0; i < steps; i++) {
        const forcing = gamma * Math.cos(omega * t);
        const d2xdt2 = -delta * dxdt - alpha * x - beta * x * x * x + forcing;
        dxdt += d2xdt2 * dt;
        x += dxdt * dt;
        t += dt;
      }
      
      return [x * scale, dxdt * scale * 0.5, (v - 0.5) * 10 * scale];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 64, vSegments: 48
    })
  },

  // ============================================================================
  // DUFFING STRANGE ATTRACTOR
  // Poincaré section of the Duffing equation
  // ============================================================================
  duffing_attractor: {
    name: "🎭 Duffing Strange Attractor",
    description: "Poincaré section showing chaotic dynamics of Duffing oscillator",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 3;
      const delta = 0.2 * (params.b ?? 1);
      const gamma = 0.35 * (params.c ?? 1);
      const alpha = -1;
      const beta = 1;
      const omega = 1;
      
      let x = -1 + u * 2;
      let dxdt = -1 + v * 2;
      let t = 0;
      
      const dt = 0.01;
      const period = 2 * Math.PI / omega;
      const periods = 50;
      
      // Integrate for many periods
      for (let i = 0; i < periods * period / dt; i++) {
        const forcing = gamma * Math.cos(omega * t);
        const d2xdt2 = -delta * dxdt - alpha * x - beta * x * x * x + forcing;
        dxdt += d2xdt2 * dt;
        x += dxdt * dt;
        t += dt;
        
        if (Math.abs(x) > 50 || Math.abs(dxdt) > 50) {
          x = 0;
          dxdt = 0;
          break;
        }
      }
      
      return [
        (u - 0.5) * 8 * scale,
        (v - 0.5) * 8 * scale,
        (x * 0.3 + dxdt * 0.2) * scale
      ];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 64, vSegments: 64
    })
  },

  // ============================================================================
  // FEIGENBAUM BIFURCATION DIAGRAM
  // δ ≈ 4.669... (rate of period doubling)
  // α ≈ 2.502... (scaling of bifurcation diagram)
  // ============================================================================
  feigenbaum_bifurcation: {
    name: "🌿 Feigenbaum Bifurcation Diagram",
    description: "δ ≈ 4.669, α ≈ 2.502 - Universal constants of period-doubling cascade",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 5;
      const rMin = 2.5 + (params.b ?? 1) * 0.5;
      const rMax = 4.0;
      
      // r parameter varies along u
      const r = rMin + u * (rMax - rMin);
      
      // Multiple initial conditions via v
      let x = 0.1 + v * 0.05;
      
      // Transient iterations
      for (let i = 0; i < 200; i++) {
        x = r * x * (1 - x);
      }
      
      // Record stable values
      let zAccum = 0;
      for (let i = 0; i < 50; i++) {
        x = r * x * (1 - x);
        zAccum += x;
      }
      zAccum /= 50;
      
      return [
        (u - 0.5) * 10 * scale,
        (v - 0.5) * 10 * scale,
        (zAccum - 0.5) * 4 * scale
      ];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 300, vSegments: 50
    })
  },

  // ============================================================================
  // FEIGENBAUM SCALING SURFACE
  // Self-similar scaling structure at bifurcation points
  // ============================================================================
  feigenbaum_scaling: {
    name: "📏 Feigenbaum Scaling Surface",
    description: "Self-similar structure showing δ=4.669... and α=2.502... universality",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 4;
      const delta = 4.669201609; // Feigenbaum delta
      const alpha = 2.502907875; // Feigenbaum alpha
      const levels = Math.floor(3 + (params.b ?? 1) * 3);
      
      let x = (u - 0.5) * 2;
      let y = (v - 0.5) * 2;
      let z = 0;
      
      // Apply Feigenbaum scaling at multiple levels
      for (let n = 0; n < levels; n++) {
        const scaleN = Math.pow(alpha, -n);
        const periodN = Math.pow(delta, n);
        
        // Bifurcation-like pattern
        z += scaleN * Math.sin(x * periodN * Math.PI * 2) * 
             Math.cos(y * periodN * Math.PI * 1.5);
        
        // Scale down for next level (self-similarity)
        x *= alpha;
        y *= alpha;
      }
      
      return [
        (u - 0.5) * 10 * scale,
        (v - 0.5) * 10 * scale,
        z * scale
      ];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 64, vSegments: 64
    })
  },

  // ============================================================================
  // CHAOS TRANSITION SURFACE
  // Visualizes the edge of chaos - order to chaos transition
  // ============================================================================
  chaos_transition: {
    name: "🌓 Chaos Transition Surface",
    description: "Edge of chaos - transition zone between order and chaos",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 4;
      const chaosParam = (params.b ?? 1) * 2;
      const complexity = (params.c ?? 1) * 3;
      
      // r parameter controls chaos level
      const r = 2.5 + u * 1.5;
      let x = 0.5;
      
      // Compute Lyapunov exponent
      let lyap = 0;
      for (let i = 0; i < 100; i++) {
        const deriv = Math.abs(r * (1 - 2 * x));
        if (deriv > 0) lyap += Math.log(deriv);
        x = r * x * (1 - x);
      }
      lyap /= 100;
      
      // Blend ordered and chaotic behavior
      const orderContrib = Math.sin(u * Math.PI * 8) * Math.cos(v * Math.PI * 8);
      const chaosContrib = Math.sin(u * v * 50 * chaosParam) * 
                          Math.cos((u + v) * 30 * chaosParam);
      
      // Sigmoid transition based on Lyapunov
      const sigmoid = 1 / (1 + Math.exp(-lyap * 5));
      const z = orderContrib * (1 - sigmoid) + chaosContrib * sigmoid;
      
      return [
        (u - 0.5) * 10 * scale,
        (v - 0.5) * 10 * scale,
        z * complexity * scale
      ];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 64, vSegments: 64
    })
  },

  // ============================================================================
  // STRANGE ATTRACTOR COMPOSITE
  // Blend of multiple chaotic systems
  // ============================================================================
  strange_attractor_composite: {
    name: "✨ Strange Attractor Composite",
    description: "Unified visualization combining Lorenz, Rössler, and Hénon dynamics",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 0.2;
      const blend = (params.b ?? 1);
      const iterations = Math.floor(100 + (params.c ?? 1) * 100);
      
      // Initialize all three systems
      let lx = 1, ly = 1, lz = 1; // Lorenz
      let rx = 0.1, ry = 0.1, rz = 0.1; // Rössler
      let hx = 0, hy = 0; // Hénon
      
      const dt = 0.01;
      
      // Integrate all systems
      for (let i = 0; i < iterations; i++) {
        // Lorenz
        const ldx = 10 * (ly - lx);
        const ldy = lx * (28 - lz) - ly;
        const ldz = lx * ly - (8/3) * lz;
        lx += ldx * dt;
        ly += ldy * dt;
        lz += ldz * dt;
        
        // Rössler
        const rdx = -ry - rz;
        const rdy = rx + 0.2 * ry;
        const rdz = 0.2 + rz * (rx - 5.7);
        rx += rdx * dt;
        ry += rdy * dt;
        rz += rdz * dt;
        
        // Hénon (scaled time)
        if (i % 10 === 0) {
          const hxNew = 1 - 1.4 * hx * hx + hy;
          const hyNew = 0.3 * hx;
          hx = hxNew;
          hy = hyNew;
        }
      }
      
      // Blend based on u,v position
      const w1 = (1 - u) * (1 - v);
      const w2 = u * (1 - v);
      const w3 = u * v;
      
      const x = (lx * w1 + rx * 2 * w2 + hx * 10 * w3) * scale * blend;
      const y = (ly * w1 + ry * 2 * w2 + hy * 10 * w3) * scale * blend;
      const z = ((lz - 25) * w1 + rz * 0.5 * w2) * scale * blend;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 64, vSegments: 64
    })
  },

  // ============================================================================
  // SENSITIVE DEPENDENCE SURFACE
  // Shows exponential divergence of nearby trajectories
  // ============================================================================
// ============================================================================
  // MASTER EQUATION: S_{n+1} = f(S_n) + δ
  // The universal formula for system stability analysis
  // Stable: |∂f/∂S| < 1 or δ ≠ 0 → converges
  // Unstable: S_{n+1} = f(S_n) with undefined S_0 → infinite loop
  // ============================================================================
  
  master_equation_stable: {
    name: "✅ Master Equation (Safe Loop)",
    description: "S_{n+1} = f(S_n) + δ, |∂f/∂S| < 1 → System converges to fixed point",
    equation: (u, v, params) => {
      const scale = params.a ?? 1;
      const feedbackGain = Math.min(0.95, Math.abs(params.b ?? 0.7)); // |∂f/∂S| < 1
      const damping = params.c ?? 0.5; // δ stabilizer term
      const iterations = Math.floor(Math.abs(v) * 30);
      
      const theta = u * Math.PI * 2;
      
      // Damped feedback: converges when |gain| < 1
      const dampingFactor = Math.pow(feedbackGain, iterations);
      const stabilizer = damping * (1 - dampingFactor); // δ contribution
      
      // Spiral converging to center (fixed point)
      const radius = (1 + stabilizer) * dampingFactor * 3;
      const height = iterations * 0.15;
      
      return [
        radius * Math.cos(theta + iterations * 0.3) * scale,
        height * scale,
        radius * Math.sin(theta + iterations * 0.3) * scale
      ];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 0.7, c: 0.5, x: 1, y: 1, z: 1,
      uSegments: 64, vSegments: 64
    })
  },

  master_equation_unstable: {
    name: "❌ Master Equation (Unsafe Loop)",
    description: "S_{n+1} = f(S_n), no δ, |∂f/∂S| ≥ 1 → System diverges to infinity",
    equation: (u, v, params) => {
      const scale = params.a ?? 1;
      const feedbackGain = Math.max(1.05, Math.abs(params.b ?? 1.3)); // |∂f/∂S| ≥ 1
      const iterations = Math.floor(Math.abs(v) * 15);
      
      const theta = u * Math.PI * 2;
      
      // Unstable feedback: grows when |gain| >= 1
      const growthFactor = Math.min(Math.pow(feedbackGain, iterations), 8); // Cap for viz
      
      // Spiral diverging outward (runaway)
      const radius = growthFactor * 0.5;
      const height = iterations * 0.25;
      
      return [
        radius * Math.cos(theta + iterations * 0.2) * scale,
        height * scale,
        radius * Math.sin(theta + iterations * 0.2) * scale
      ];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1.3, c: 0, x: 1, y: 1, z: 1,
      uSegments: 64, vSegments: 64
    })
  },

  // ============================================================================
  // SELF-REFERENCE EQUATION: x = f(x)
  // Fixed point analysis and stability
  // ============================================================================
  
  self_reference_fixed_point: {
    name: "🔄 Self-Reference Fixed Point",
    description: "x = f(x) → x* = f(x*) - Self-referential equation with stable fixed point",
    equation: (u, v, params) => {
      const scale = params.a ?? 1;
      const attractorStrength = params.b ?? 1;
      const basinWidth = params.c ?? 2;
      
      const r = Math.abs(v) * basinWidth;
      const theta = u * Math.PI * 2;
      
      // Potential well shape: fixed point at center
      const depth = attractorStrength * 2 * Math.exp(-r * r / (basinWidth * basinWidth));
      
      return [
        r * Math.cos(theta) * scale * 2,
        (-depth + r * r * 0.1) * scale,
        r * Math.sin(theta) * scale * 2
      ];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 2, x: 1, y: 1, z: 1,
      uSegments: 64, vSegments: 64
    })
  },

  recurrence_relation: {
    name: "📐 Recurrence Relation",
    description: "x_{n+1} = f(x_n) - Each state depends on previous; stability depends on f",
    equation: (u, v, params) => {
      const scale = params.a ?? 1;
      const contractionRate = Math.min(0.9, Math.abs(params.b ?? 0.8));
      const levels = Math.floor(10 + (params.c ?? 1) * 10);
      
      const theta = u * Math.PI * 2;
      const level = Math.abs(v) * levels;
      
      // Contracting sequence visualization
      const radius = 2 * Math.pow(contractionRate, level);
      
      return [
        radius * Math.cos(theta + level * 0.4) * scale * 2,
        level * 0.3 * scale,
        radius * Math.sin(theta + level * 0.4) * scale * 2
      ];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 0.8, c: 1, x: 1, y: 1, z: 1,
      uSegments: 64, vSegments: 64
    })
  },

  divergent_recursion: {
    name: "📈 Divergent Recursion",
    description: "x_{n+1} = x_n + c - Unbounded linear recurrence producing runaway growth",
    equation: (u, v, params) => {
      const scale = params.a ?? 1;
      const growthRate = params.b ?? 0.3;
      const levels = Math.floor(10 + (params.c ?? 1) * 5);
      
      const theta = u * Math.PI * 2;
      const level = Math.abs(v) * levels;
      
      // Linear growth (unbounded)
      const radius = 0.5 + level * growthRate;
      
      return [
        radius * Math.cos(theta) * scale,
        level * 0.5 * scale,
        radius * Math.sin(theta) * scale
      ];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 0.3, c: 1, x: 1, y: 1, z: 1,
      uSegments: 64, vSegments: 64
    })
  },

  // ============================================================================
  // FEEDBACK SYSTEMS: y = Gy
  // Positive (G≥1) vs Negative (G<1) feedback
  // ============================================================================
  
  positive_feedback_runaway: {
    name: "⚠️ Positive Feedback (G ≥ 1)",
    description: "y = Gy with G ≥ 1 → Runaway amplification, system instability",
    equation: (u, v, params) => {
      const scale = params.a ?? 1;
      const gain = Math.max(1.05, params.b ?? 1.5); // G ≥ 1
      const time = Math.abs(v) * 5;
      
      const theta = u * Math.PI * 2;
      
      // Exponential growth
      const growth = Math.min(Math.pow(gain, time), 10);
      const radius = growth * 0.3;
      
      return [
        radius * Math.cos(theta) * scale * 2,
        time * scale,
        radius * Math.sin(theta) * scale * 2
      ];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1.5, c: 1, x: 1, y: 1, z: 1,
      uSegments: 64, vSegments: 64
    })
  },

  negative_feedback_stable: {
    name: "🛡️ Negative Feedback (G < 1)",
    description: "y = Gy with G < 1 → Damped convergence, system stability",
    equation: (u, v, params) => {
      const scale = params.a ?? 1;
      const gain = Math.min(0.95, Math.abs(params.b ?? 0.6)); // G < 1
      const time = Math.abs(v) * 5;
      
      const theta = u * Math.PI * 2;
      
      // Exponential decay toward limit
      const decay = Math.pow(gain, time);
      const radius = 2 * (1 - decay) + 0.1;
      
      return [
        radius * Math.cos(theta) * scale * 2,
        time * scale,
        radius * Math.sin(theta) * scale * 2
      ];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 0.6, c: 1, x: 1, y: 1, z: 1,
      uSegments: 64, vSegments: 64
    })
  },

  // ============================================================================
  // LYAPUNOV STABILITY: |f'(x*)| < 1
  // Stable vs unstable fixed points
  // ============================================================================
  
  lyapunov_stable_basin: {
    name: "🟢 Lyapunov Stable Basin",
    description: "|f'(x*)| < 1 → Perturbations decay, fixed point is stable",
    equation: (u, v, params) => {
      const scale = params.a ?? 1;
      const stability = Math.min(0.9, Math.abs(params.b ?? 0.7)); // |f'| < 1
      const basinSize = params.c ?? 2;
      
      const x = (u - 0.5) * basinSize * 2;
      const y = (v - 0.5) * basinSize * 2;
      const r = Math.sqrt(x * x + y * y);
      
      // Stable potential well
      const z = -Math.exp(-r * r / (basinSize * basinSize)) * stability * 2;
      
      return [x * scale * 2, z * scale, y * scale * 2];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 0.7, c: 2, x: 1, y: 1, z: 1,
      uSegments: 64, vSegments: 64
    })
  },

  lyapunov_unstable_saddle: {
    name: "🔴 Lyapunov Unstable Saddle",
    description: "|f'(x*)| > 1 → Perturbations grow, saddle point instability",
    equation: (u, v, params) => {
      const scale = params.a ?? 1;
      const instability = Math.max(1.1, params.b ?? 1.5); // |f'| > 1
      
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      
      // Hyperbolic saddle: unstable in one direction
      const z = (x * x - y * y) * instability * 0.3;
      
      return [x * scale, z * scale, y * scale];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1.5, c: 1, x: 1, y: 1, z: 1,
      uSegments: 64, vSegments: 64
    })
  },

  // ============================================================================
  // DELAY DIFFERENTIAL: ẋ(t) = f(x(t - τ))
  // Time delay prevents instantaneous self-dependence
  // ============================================================================
  
  delay_differential: {
    name: "⏱️ Delay Differential Spiral",
    description: "ẋ(t) = f(x(t - τ)) - Time delay prevents instantaneous self-reference",
    equation: (u, v, params) => {
      const scale = params.a ?? 1;
      const delay = params.b ?? 1; // τ delay
      const coupling = params.c ?? 2;
      
      const t = u * Math.PI * 6;
      const s = Math.abs(v) * 3;
      
      // Delayed phase creates helical structure
      const delayPhase = t - delay * s;
      const radius = 1 + 0.5 * Math.sin(delayPhase * coupling);
      
      return [
        radius * Math.cos(t) * scale * 2,
        s * scale,
        radius * Math.sin(t) * scale * 2
      ];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 2, x: 1, y: 1, z: 1,
      uSegments: 64, vSegments: 64
    })
  },

  // ============================================================================
  // CAUSALITY: t_cause < t_effect
  // Light cone showing causal ordering constraints
  // ============================================================================
  
  causality_light_cone: {
    name: "🔦 Causality Light Cone",
    description: "t_cause < t_effect - Causal ordering prevents future state reference",
    equation: (u, v, params) => {
      const scale = params.a ?? 1;
      const coneAngle = params.b ?? 1;
      
      const theta = u * Math.PI * 2;
      const t = (v - 0.5) * 4; // Time from -2 to +2
      
      // Light cone: radius = |t|
      const radius = Math.abs(t) * coneAngle;
      
      return [
        radius * Math.cos(theta) * scale,
        t * scale * 2,
        radius * Math.sin(theta) * scale
      ];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 64, vSegments: 64
    })
  },

  // ============================================================================
  // WELL-FOUNDED RECURSION: f(n) → f(n-1) → ... → base case
  // Terminating recursion toward base case
  // ============================================================================
  
  well_founded_recursion: {
    name: "🎯 Well-Founded Recursion",
    description: "f(n) → f(n-1) → ... → base case - Recursion that terminates",
    equation: (u, v, params) => {
      const scale = params.a ?? 1;
      const reductionRate = params.b ?? 1;
      const totalDepth = Math.floor(10 + (params.c ?? 1) * 10);
      
      const theta = u * Math.PI * 2;
      const depth = Math.abs(v) * totalDepth;
      
      // Radius decreases as we approach base case
      const radius = 2 * Math.exp(-depth * reductionRate / totalDepth);
      
      return [
        radius * Math.cos(theta + depth * 0.5) * scale * 2,
        -depth * 0.3 * scale, // Descending
        radius * Math.sin(theta + depth * 0.5) * scale * 2
      ];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 64, vSegments: 64
    })
  },

  stack_overflow_tower: {
    name: "💥 Stack Overflow (No Base Case)",
    description: "f(n) → f(n) → ∞ - Infinite recursion without termination condition",
    equation: (u, v, params) => {
      const scale = params.a ?? 1;
      const instability = params.b ?? 1;
      
      const theta = u * Math.PI * 2;
      const height = Math.abs(v) * 8;
      
      // Constant radius, infinite height (stack frames)
      const wobble = 0.2 * Math.sin(height * 5);
      const radius = 1 + wobble * instability;
      
      return [
        radius * Math.cos(theta) * scale,
        height * scale,
        radius * Math.sin(theta) * scale
      ];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 64, vSegments: 64
    })
  },

  // ============================================================================
  // ENTROPY: dS/dt ≥ 0
  // Second law of thermodynamics
  // ============================================================================
  
  entropy_growth: {
    name: "♨️ Entropy Growth (dS/dt ≥ 0)",
    description: "Second Law: Without dissipation, systems accumulate disorder",
    equation: (u, v, params) => {
      const scale = params.a ?? 1;
      const entropyRate = params.b ?? 1;
      
      const theta = u * Math.PI * 2;
      const time = Math.abs(v);
      
      // Gaussian spreading over time
      const sigma = 0.5 + time * entropyRate;
      const r = time * 2.5;
      const height = Math.exp(-r * r / (2 * sigma * sigma)) / (sigma + 0.1);
      
      return [
        r * Math.cos(theta) * scale,
        height * scale * 2,
        r * Math.sin(theta) * scale
      ];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 64, vSegments: 64
    })
  },

  // ============================================================================
  // TEMPORAL DEAD ZONE (TDZ)
  // Use(x) before Init(x) → crash
  // ============================================================================
  
  temporal_dead_zone: {
    name: "⛔ Temporal Dead Zone (TDZ)",
    description: "Use(x) before Init(x) → Undefined state access causes failure",
    equation: (u, v, params) => {
      const scale = params.a ?? 1;
      const tdzWidth = params.b ?? 0.5;
      
      const theta = u * Math.PI * 2;
      const t = (v - 0.5) * 4; // Time from -2 to +2
      
      // Dead zone is a void before t=0
      const radius = (t < 0) ? 0.2 * tdzWidth : 1 + 0.5 * (1 - Math.exp(-t));
      
      return [
        radius * Math.cos(theta) * scale * 2,
        t * scale,
        radius * Math.sin(theta) * scale * 2
      ];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 0.5, c: 1, x: 1, y: 1, z: 1,
      uSegments: 64, vSegments: 64
    })
  },

  sensitive_dependence: {
    name: "🔀 Sensitive Dependence Surface",
    description: "Butterfly effect visualization - exponential divergence of trajectories",
    equation: (u, v, params) => {
      const scale = (params.a ?? 1) * 3;
      const sensitivity = (params.b ?? 1) * 2;
      const time = (params.c ?? 1) * 20;
      
      // Two nearby initial conditions
      const epsilon = 0.0001 * sensitivity;
      let x1 = 1, y1 = 1, z1 = 1;
      let x2 = 1 + epsilon, y2 = 1, z2 = 1;
      
      const dt = 0.01;
      const steps = Math.floor(u * time / dt);
      
      // Integrate Lorenz for both
      for (let i = 0; i < steps; i++) {
        // First trajectory
        const dx1 = 10 * (y1 - x1);
        const dy1 = x1 * (28 - z1) - y1;
        const dz1 = x1 * y1 - (8/3) * z1;
        x1 += dx1 * dt;
        y1 += dy1 * dt;
        z1 += dz1 * dt;
        
        // Second trajectory
        const dx2 = 10 * (y2 - x2);
        const dy2 = x2 * (28 - z2) - y2;
        const dz2 = x2 * y2 - (8/3) * z2;
        x2 += dx2 * dt;
        y2 += dy2 * dt;
        z2 += dz2 * dt;
      }
      
      // Distance between trajectories
      const distance = Math.sqrt((x2-x1)**2 + (y2-y1)**2 + (z2-z1)**2);
      const divergence = Math.log(1 + distance);
      
      // Surface based on divergence
      return [
        (u - 0.5) * 10 * scale,
        (v - 0.5) * 10 * scale,
        divergence * (1 + v) * scale
      ];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 64, vSegments: 48
    })
  }
};

export const CHAOS_THEORY_SHAPE_COUNT = Object.keys(CHAOS_THEORY_SHAPES).length;
