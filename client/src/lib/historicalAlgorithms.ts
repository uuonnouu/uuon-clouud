import { SurfaceParameters } from '../types/math';

export interface ParametricSurface {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

function getCleanDefaults(overrides: Partial<SurfaceParameters> = {}): Partial<SurfaceParameters> {
  return {
    a: 1, b: 1, c: 1, d: 1,
    e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
    n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
    uMin: 0, uMax: 1, vMin: 0, vMax: 1,
    uSegments: 96, vSegments: 72,
    ...overrides
  };
}

export const HISTORICAL_ALGORITHMS: Record<string, ParametricSurface> = {
  
  // EUCLIDEAN ALGORITHM (300 BCE) - GCD as descending spiral
  euclidean_algorithm: {
    name: "📐 Euclidean Algorithm (300 BCE) - Greatest Common Divisor",
    equation: (u, v, params) => {
      const a = Math.max(1, Math.abs(params.a ?? 48));  // First number
      const b = Math.max(1, Math.abs(params.b ?? 18));  // Second number
      const c = params.c ?? 1.5;  // Spiral scale
      const d = params.d ?? 1.0;  // Height per step
      const e = params.e ?? 0;    // Rotation speed
      
      let num1 = Math.floor(a);
      let num2 = Math.floor(b);
      
      // Ensure num1 >= num2
      if (num2 > num1) {
        [num1, num2] = [num2, num1];
      }
      
      // Trace GCD algorithm steps
      const steps: Array<[number, number]> = [[num1, num2]];
      let tempNum1 = num1;
      let tempNum2 = num2;
      
      while (tempNum2 !== 0) {
        const remainder = tempNum1 % tempNum2;
        tempNum1 = tempNum2;
        tempNum2 = remainder;
        steps.push([tempNum1, tempNum2]);
      }
      
      // Map u to step progression
      const maxSteps = steps.length;
      const currentStep = Math.min(Math.floor(u * maxSteps), maxSteps - 1);
      const [val1, val2] = steps[currentStep];
      
      // Create descending spiral
      const angle = currentStep * Math.PI * 0.5 + v * Math.PI * 2 + e;
      const radius = (val1 / num1) * c;
      const height = currentStep * d;
      
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const z = height;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 48, b: 18, c: 1.5, d: 1.0, e: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 64, vSegments: 32 
    })
  },

  // SIEVE OF ERATOSTHENES (240 BCE) - Prime numbers rising from grid
  sieve_eratosthenes: {
    name: "🔢 Sieve of Eratosthenes (240 BCE) - Prime Number Discovery",
    equation: (u, v, params) => {
      const a = Math.max(5, Math.min(100, Math.floor(params.a ?? 30))); // Max number
      const b = params.b ?? 1.5;  // Prime height
      const c = params.c ?? 0.3;  // Composite height
      const d = params.d ?? 5;    // Grid size
      const e = params.e ?? 0;    // Animation time
      
      const gridSize = Math.max(3, Math.floor(d));
      const maxNum = Math.floor(a);
      
      // Sieve of Eratosthenes algorithm
      const isPrime = new Array(maxNum + 1).fill(true);
      isPrime[0] = isPrime[1] = false;
      
      for (let i = 2; i * i <= maxNum; i++) {
        if (isPrime[i]) {
          for (let j = i * i; j <= maxNum; j += i) {
            isPrime[j] = false;
          }
        }
      }
      
      // Map UV to grid position
      const col = Math.floor(u * gridSize);
      const row = Math.floor(v * gridSize);
      const number = row * gridSize + col + 1;
      
      // Position in grid
      const x = (col / (gridSize - 1)) * 2 - 1;
      const y = (row / (gridSize - 1)) * 2 - 1;
      
      // Height based on primality
      let z = 0;
      if (number <= maxNum) {
        if (isPrime[number]) {
          z = b; // Primes rise high
        } else {
          z = c; // Composites stay low
        }
        
        // Animate discovery with time
        const discoverTime = Math.sqrt(number) / Math.sqrt(maxNum);
        const animProgress = Math.max(0, Math.min(1, e - discoverTime));
        z *= animProgress;
      }
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 30, b: 1.5, c: 0.3, d: 6, e: 1,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 64, vSegments: 64 
    })
  },

  // BABYLONIAN METHOD (1800 BCE) - Square root convergence
  babylonian_square_root: {
    name: "🔺 Babylonian Method (1800 BCE) - Square Root Convergence",
    equation: (u, v, params) => {
      const a = Math.max(1, params.a ?? 2);   // Number to find sqrt of
      const b = params.b ?? 1.5;  // Spiral radius
      const c = params.c ?? 1.0;  // Height per iteration
      const d = params.d ?? 10;   // Max iterations
      const e = params.e ?? 0;    // Rotation offset
      
      const target = a;
      const maxIter = Math.max(1, Math.min(20, Math.floor(d)));
      
      // Babylonian method: x_new = (x + n/x) / 2
      let guess = target; // Start with the number itself
      const convergence: number[] = [guess];
      
      for (let i = 0; i < maxIter; i++) {
        guess = (guess + target / guess) / 2;
        convergence.push(guess);
      }
      
      // Map u to iteration
      const currentIter = Math.min(Math.floor(u * convergence.length), convergence.length - 1);
      const currentGuess = convergence[currentIter];
      const error = Math.abs(currentGuess - Math.sqrt(target));
      
      // Create convergence spiral
      const angle = currentIter * Math.PI * 0.8 + v * Math.PI * 2 + e;
      const radius = b * (1 + error);
      const height = currentIter * c;
      
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const z = height;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 2, b: 1.5, c: 1.0, d: 10, e: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 48, vSegments: 32 
    })
  },

  // NEWTON-RAPHSON METHOD - Root finding convergence surface
  newton_raphson: {
    name: "🎯 Newton-Raphson (1669) - Root Finding Method",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;  // Function coefficient (x^2 - a = 0)
      const b = params.b ?? 2.0;  // Initial guess
      const c = params.c ?? 1.2;  // Spiral scale
      const d = params.d ?? 8;    // Max iterations
      const e = params.e ?? 0;    // Rotation speed
      
      // Normalize u,v for symmetric polar behavior across full -100 to 100 range
      // Use direct mapping that produces visible geometry immediately
      const uNorm = Math.abs(u) / Math.PI; // Scale to usable range
      const vNorm = v / Math.PI;
      
      const target = Math.max(0.1, Math.abs(a));
      let xVal = Math.max(0.1, Math.abs(b));
      const maxIter = Math.max(1, Math.min(15, Math.floor(Math.abs(d))));
      
      const iterates: number[] = [xVal];
      
      // Newton-Raphson: x_new = x - f(x)/f'(x)
      // For f(x) = x^2 - a: x_new = (x + a/x) / 2
      for (let i = 0; i < maxIter; i++) {
        xVal = (xVal + target / xVal) / 2;
        iterates.push(xVal);
      }
      
      // Use continuous u mapping for smooth surface
      const iterFraction = Math.abs(uNorm) % iterates.length;
      const currentIter = Math.floor(iterFraction);
      const nextIter = Math.min(currentIter + 1, iterates.length - 1);
      const blend = iterFraction - currentIter;
      
      const currentX = iterates[Math.max(0, currentIter)] * (1 - blend) + 
                       iterates[Math.max(0, nextIter)] * blend;
      const error = Math.abs(currentX * currentX - target);
      
      // Convergence spiral with symmetric polar behavior
      const angle = uNorm * Math.PI * 0.6 + vNorm * Math.PI * 2 + e;
      const radius = Math.abs(c) * (1 + error * 0.5 + Math.abs(uNorm) * 0.1);
      const height = uNorm * 0.8;
      
      // Apply sign from original u for symmetric displacement
      const signU = u >= 0 ? 1 : -1;
      
      return [
        signU * radius * Math.cos(angle),
        radius * Math.sin(angle),
        height
      ];
    },
    defaultParams: getCleanDefaults({ 
      a: 2, b: 2.0, c: 1.2, d: 8, e: 0,
      uMin: -6.28318, uMax: 6.28318, vMin: -6.28318, vMax: 6.28318,
      uSegments: 64, vSegments: 48 
    })
  },

  // FIBONACCI SPIRAL - Enhanced with growth rate
  fibonacci_spiral_enhanced: {
    name: "🌀 Fibonacci Spiral (1202) - Golden Ratio Growth",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;  // Scale
      const b = params.b ?? 1.618; // Golden ratio (phi)
      const c = params.c ?? 0.5;  // Thickness
      const d = params.d ?? 4;    // Revolutions
      const e = params.e ?? 0;    // Vertical growth
      
      const phi = Math.max(1.5, Math.min(2, b));
      const revolutions = Math.max(1, Math.min(8, d));
      
      // Fibonacci growth: r = a * phi^(theta/2π)
      const theta = u * revolutions * Math.PI * 2;
      const radius = a * Math.pow(phi, theta / (Math.PI * 2));
      
      // Tube around spiral
      const tubeAngle = v * Math.PI * 2;
      const tubeRadius = c * (1 + u * 0.3);
      
      const x = radius * Math.cos(theta) + tubeRadius * Math.cos(tubeAngle) * Math.cos(theta);
      const y = radius * Math.sin(theta) + tubeRadius * Math.cos(tubeAngle) * Math.sin(theta);
      const z = theta * e + tubeRadius * Math.sin(tubeAngle);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 0.5, b: 1.618, c: 0.3, d: 4, e: 0.2,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 32 
    })
  },

  // KEPLER'S PLANETARY MOTION - Elliptical orbit
  kepler_planetary_motion: {
    name: "🪐 Kepler's Laws (1609) - Planetary Ellipse",
    equation: (u, v, params) => {
      const a = Math.max(0.5, params.a ?? 2.0);  // Semi-major axis
      const b = Math.max(0, Math.min(0.9, params.b ?? 0.5)); // Eccentricity
      const c = params.c ?? 0.15; // Orbit thickness
      const d = params.d ?? 1;    // Number of orbits
      const e = params.e ?? 0;    // Orbital inclination
      
      const eccentricity = b;
      const semiMajor = a;
      const semiMinor = semiMajor * Math.sqrt(1 - eccentricity * eccentricity);
      
      // Elliptical orbit
      const theta = u * d * Math.PI * 2;
      const r = (semiMajor * (1 - eccentricity * eccentricity)) / 
                (1 + eccentricity * Math.cos(theta));
      
      // Tube around orbit
      const tubeAngle = v * Math.PI * 2;
      const tubeRadius = c;
      
      // Orbital plane with inclination
      const x = r * Math.cos(theta) + tubeRadius * Math.cos(tubeAngle) * Math.cos(theta);
      const y = r * Math.sin(theta) * Math.cos(e) + tubeRadius * Math.cos(tubeAngle) * Math.sin(theta);
      const z = r * Math.sin(theta) * Math.sin(e) + tubeRadius * Math.sin(tubeAngle);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 2.0, b: 0.5, c: 0.15, d: 1, e: 0.3,
      uSegments: 128, vSegments: 24 
    })
  },

  // DIFFUSION PROCESS - Heat spreading from center
  diffusion_heat_equation: {
    name: "🌡️ Diffusion Process - Heat Equation Solution",
    equation: (u, v, params) => {
      const a = params.a ?? 2.0;  // Domain size
      const b = params.b ?? 1.0;  // Initial heat amplitude
      const c = params.c ?? 0.5;  // Diffusion coefficient
      const d = params.d ?? 1.0;  // Time
      const e = params.e ?? 0;    // Number of modes
      
      const x = (u * 2 - 1) * a;
      const y = (v * 2 - 1) * a;
      const r = Math.sqrt(x * x + y * y);
      const t = Math.max(0.1, d);
      
      // Gaussian diffusion solution: u(x,y,t) = (1/(4πDt)) * exp(-r²/(4Dt))
      const D = Math.max(0.1, c);
      const heat = (b / (4 * Math.PI * D * t)) * Math.exp(-r * r / (4 * D * t));
      
      // Add wave modes for richer pattern
      const modes = Math.floor(Math.max(0, Math.min(5, e)));
      let waveTerm = 0;
      for (let n = 1; n <= modes; n++) {
        waveTerm += Math.sin(n * r) * Math.exp(-n * n * D * t) / n;
      }
      
      const z = heat + waveTerm * 0.2;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 2.0, b: 1.0, c: 0.5, d: 1.0, e: 3,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 96 
    })
  },

  // CRYSTAL LATTICE GROWTH - FCC/BCC/HCP structures
  crystal_lattice_fcc: {
    name: "💎 Crystal Lattice - Face-Centered Cubic",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;  // Lattice constant
      const b = Math.floor(Math.max(2, Math.min(6, params.b ?? 3))); // Unit cells
      const c = params.c ?? 0.15; // Atom radius
      const d = params.d ?? 0;    // Growth time
      const e = params.e ?? 0;    // Lattice defects
      
      const latticeSize = b;
      const atomsPerCell = 4; // FCC: corner + face centers
      
      // Map u,v to lattice positions
      const totalAtoms = latticeSize * latticeSize * latticeSize * atomsPerCell;
      const atomIndex = Math.floor(u * totalAtoms);
      
      const cellIndex = Math.floor(atomIndex / atomsPerCell);
      const atomType = atomIndex % atomsPerCell;
      
      const cellX = cellIndex % latticeSize;
      const cellY = Math.floor(cellIndex / latticeSize) % latticeSize;
      const cellZ = Math.floor(cellIndex / (latticeSize * latticeSize));
      
      // FCC positions (corner + face centers)
      let atomPos: [number, number, number] = [0, 0, 0];
      switch(atomType) {
        case 0: atomPos = [0, 0, 0]; break;      // Corner
        case 1: atomPos = [0.5, 0.5, 0]; break;  // XY face
        case 2: atomPos = [0.5, 0, 0.5]; break;  // XZ face
        case 3: atomPos = [0, 0.5, 0.5]; break;  // YZ face
      }
      
      // World position
      const x = (cellX + atomPos[0]) * a - (latticeSize * a) / 2;
      const y = (cellY + atomPos[1]) * a - (latticeSize * a) / 2;
      const z = (cellZ + atomPos[2]) * a - (latticeSize * a) / 2;
      
      // Atom sphere (simplified as point with radius)
      const sphereAngle = v * Math.PI * 2;
      const sphereRadius = c;
      
      return [
        x + sphereRadius * Math.cos(sphereAngle),
        y + sphereRadius * Math.sin(sphereAngle),
        z
      ];
    },
    defaultParams: getCleanDefaults({ 
      a: 0.8, b: 3, c: 0.15, d: 0, e: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 64, vSegments: 16 
    })
  },

  // BINARY TREE TRAVERSAL - Tree structure with paths
  binary_tree_traversal: {
    name: "🌲 Binary Tree - Algorithmic Traversal",
    equation: (u, v, params) => {
      const a = params.a ?? 2.0;  // Tree width
      const b = params.b ?? 1.5;  // Height per level
      const c = Math.floor(Math.max(1, Math.min(5, params.c ?? 4))); // Depth
      const d = params.d ?? 0.2;  // Branch thickness
      const e = params.e ?? 0;    // Traversal animation
      
      const depth = c;
      const totalNodes = Math.pow(2, depth + 1) - 1;
      
      // Map u to node index
      const nodeIndex = Math.floor(u * totalNodes);
      const level = Math.floor(Math.log2(nodeIndex + 1));
      const posInLevel = nodeIndex - (Math.pow(2, level) - 1);
      const nodesInLevel = Math.pow(2, level);
      
      // Position in tree
      const x = (posInLevel / Math.max(1, nodesInLevel - 1) - 0.5) * a * (depth - level + 1);
      const y = level * b;
      const z = 0;
      
      // Branch tube
      const tubeAngle = v * Math.PI * 2;
      const tubeRadius = d;
      
      return [
        x + tubeRadius * Math.cos(tubeAngle),
        y,
        tubeRadius * Math.sin(tubeAngle)
      ];
    },
    defaultParams: getCleanDefaults({ 
      a: 2.0, b: 1.5, c: 4, d: 0.2, e: 0,
      uSegments: 64, vSegments: 16 
    })
  },

  // QUICKSORT VISUALIZATION - Partition tree
  quicksort_partition_tree: {
    name: "⚡ QuickSort (1959) - Partition Tree",
    equation: (u, v, params) => {
      const a = Math.floor(Math.max(4, Math.min(32, params.a ?? 16))); // Array size
      const b = params.b ?? 2.0;  // Width
      const c = params.c ?? 1.0;  // Height per level
      const d = params.d ?? 0.15; // Element size
      const e = params.e ?? 0;    // Sort progress
      
      const arraySize = a;
      const maxDepth = Math.ceil(Math.log2(arraySize));
      
      // Create array to sort
      const array: number[] = [];
      for (let i = 0; i < arraySize; i++) {
        array.push(i);
      }
      
      // Map u,v to array element and partition level
      const elementIndex = Math.floor(u * arraySize);
      const partitionLevel = Math.floor(v * maxDepth);
      
      // Position based on partition structure
      const x = (elementIndex / arraySize - 0.5) * b;
      const y = partitionLevel * c;
      const value = array[elementIndex] / arraySize;
      const z = value * 1.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 16, b: 2.0, c: 1.0, d: 0.15, e: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 64, vSegments: 32 
    })
  },

  // DNA REPLICATION - Nature's original algorithm
  dna_replication_algorithm: {
    name: "🧬 DNA Replication - Nature's Algorithm",
    equation: (u, v, params) => {
      const a = params.a ?? 2.0;  // Helix radius
      const b = params.b ?? 4.0;  // Helix pitch
      const c = params.c ?? 1.0;  // Number of turns
      const d = params.d ?? 0.15; // Base pair width
      const e = params.e ?? 0;    // Replication fork position
      
      const turns = Math.max(0.5, c);
      const theta = u * turns * Math.PI * 2;
      const forkPos = Math.max(0, Math.min(1, e));
      
      // Double helix
      const radius = a;
      const pitch = b;
      const z = (u - 0.5) * pitch;
      
      // Two strands
      const strand = v < 0.5 ? 0 : 1;
      const strandOffset = strand * Math.PI;
      
      // Replication fork - strands separate
      const separation = u > forkPos ? (u - forkPos) * 1.5 : 0;
      const effectiveRadius = radius + separation;
      
      const x = effectiveRadius * Math.cos(theta + strandOffset);
      const y = effectiveRadius * Math.sin(theta + strandOffset);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 4.0, c: 3, d: 0.15, e: 0.7,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 128, vSegments: 32 
    })
  },

  // ═══════════════════════════════════════════════════════════════════
  // FUNDAMENTAL PHYSICS EQUATIONS - The Pillars of Physical Law
  // ═══════════════════════════════════════════════════════════════════

  // EINSTEIN E=mc² (1905) - Energy-Mass Equivalence
  einstein_mass_energy: {
    name: "⚛️ Einstein E=mc² (1905) - Energy-Mass Equivalence",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;  // Mass magnitude
      const b = params.b ?? 3.0;  // Speed of light (c)
      const c = params.c ?? 2.0;  // Energy spiral radius
      const d = params.d ?? 1.5;  // Spiral height
      const e = params.e ?? 1.0;  // Time evolution
      
      const mass = Math.abs(a);
      const lightSpeed = Math.abs(b);
      const energy = mass * lightSpeed * lightSpeed; // E = mc²
      
      // Energy radiating outward from mass center
      const theta = u * Math.PI * 2 * e;
      const radius = c * Math.sqrt(energy) * v;
      const height = d * v * energy;
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = height;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 3.0, c: 2.0, d: 1.5, e: 1.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 48 
    })
  },

  // EINSTEIN VARIANT 1: E/m = c² - Energy per unit mass
  einstein_energy_per_mass: {
    name: "⚛️ Einstein E/m=c² - Energy Per Unit Mass",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;  // Mass
      const b = params.b ?? 3.0;  // Speed of light (c)
      const c = params.c ?? 2.0;  // Visualization scale
      const d = params.d ?? 1.5;  // Height factor
      const e = params.e ?? 1.0;  // Animation
      
      const mass = Math.max(0.1, Math.abs(a));
      const lightSpeed = Math.abs(b);
      const energyPerMass = (lightSpeed * lightSpeed); // E/m = c²
      
      // Constant energy density surface
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const radius = c * Math.cbrt(energyPerMass) * e;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi) * d;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 3.0, c: 2.0, d: 1.5, e: 1.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 64 
    })
  },

  // EINSTEIN VARIANT 2: m = E/c² - Mass from energy
  einstein_mass_from_energy: {
    name: "⚛️ Einstein m=E/c² - Mass Condensed from Energy",
    equation: (u, v, params) => {
      const a = params.a ?? 10.0; // Energy magnitude
      const b = params.b ?? 3.0;  // Speed of light (c)
      const c = params.c ?? 1.5;  // Condensation factor
      const d = params.d ?? 2.0;  // Spiral tightness
      const e = params.e ?? 1.0;  // Time
      
      const energy = Math.abs(a);
      const lightSpeed = Math.abs(b);
      const mass = energy / (lightSpeed * lightSpeed); // m = E/c²
      
      // Energy condensing into mass (inward spiral)
      const theta = u * d * Math.PI * 2;
      const inwardRadius = c * (1 - v) * Math.sqrt(energy);
      const height = mass * v * e * 3;
      
      const x = inwardRadius * Math.cos(theta);
      const y = inwardRadius * Math.sin(theta);
      const z = height;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 10.0, b: 3.0, c: 1.5, d: 2.0, e: 1.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 64 
    })
  },

  // EINSTEIN VARIANT 3: E = m(cc) - Multiplicative form
  einstein_multiplicative_form: {
    name: "⚛️ Einstein E=m(c×c) - Light Multiplied",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;  // Mass
      const b = params.b ?? 3.0;  // Speed of light (c)
      const c = params.c ?? 1.8;  // Grid scale
      const d = params.d ?? 1.2;  // Height
      const e = params.e ?? 1.0;  // Phase
      
      const mass = Math.abs(a);
      const lightSpeed = Math.abs(b);
      const c1 = lightSpeed;
      const c2 = lightSpeed;
      const energy = mass * c1 * c2; // E = m(c×c)
      
      // Grid showing multiplication of c with itself
      const gridU = Math.floor(u * 10) / 10;
      const gridV = Math.floor(v * 10) / 10;
      
      const x = (gridU - 0.5) * c * c1;
      const y = (gridV - 0.5) * c * c2;
      const z = mass * gridU * gridV * d * energy / 10 + Math.sin(e * Math.PI * 2 * u) * 0.3;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 3.0, c: 1.8, d: 1.2, e: 1.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 80, vSegments: 80 
    })
  },

  // EINSTEIN VARIANT 4: E = m|c|² - Absolute magnitude form
  einstein_absolute_magnitude: {
    name: "⚛️ Einstein E=m|c|² - Absolute Light Magnitude",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;  // Mass
      const b = params.b ?? 3.0;  // Speed of light magnitude
      const c = params.c ?? 2.0;  // Sphere radius
      const d = params.d ?? 1.5;  // Energy shell thickness
      const e = params.e ?? 1.0;  // Pulsation
      
      const mass = Math.abs(a);
      const lightMagnitude = Math.abs(b); // |c|
      const energy = mass * lightMagnitude * lightMagnitude; // E = m|c|²
      
      // Spherical energy shell (magnitude is always positive)
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const pulse = 1 + Math.sin(e * Math.PI * 2) * 0.1;
      const radius = c * Math.sqrt(energy) * pulse;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 3.0, c: 2.0, d: 1.5, e: 1.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 64 
    })
  },

  // EINSTEIN VARIANT 5: E = m(c⊗c) - Tensor product form
  einstein_tensor_product: {
    name: "⚛️ Einstein E=m(c⊗c) - Tensor Field Form",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;  // Mass
      const b = params.b ?? 3.0;  // Light speed
      const c = params.c ?? 2.0;  // Field strength
      const d = params.d ?? 1.5;  // Curvature
      const e = params.e ?? 1.0;  // Field lines
      
      const mass = Math.abs(a);
      const lightSpeed = Math.abs(b);
      
      // Tensor product creates field (like spacetime curvature)
      const theta = u * e * Math.PI * 2;
      const fieldStrength = v;
      
      // Field lines showing c⊗c tensor structure
      const radius = c * (1 + fieldStrength * lightSpeed / 3);
      const curvature = mass * lightSpeed * lightSpeed * fieldStrength * d;
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = -curvature / (radius + 1); // Gravitational well curvature
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 3.0, c: 2.0, d: 1.5, e: 3.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 64 
    })
  },

  // EINSTEIN VARIANT 6: E = mc·c - Dot product form
  einstein_dot_product: {
    name: "⚛️ Einstein E=mc·c - Directional Symmetry",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;  // Mass
      const b = params.b ?? 3.0;  // Light vector magnitude
      const c = params.c ?? 2.0;  // Visualization scale
      const d = params.d ?? 1.5;  // Angle variation
      const e = params.e ?? 1.0;  // Rotation
      
      const mass = Math.abs(a);
      const lightVec = Math.abs(b);
      
      // Dot product c·c = |c|²cos(θ) where θ=0 for parallel vectors
      const angle = v * Math.PI * d; // Vary angle
      const dotProduct = lightVec * lightVec * Math.cos(angle);
      const energy = mass * Math.abs(dotProduct);
      
      // Symmetric double cone showing directional alignment
      const theta = u * Math.PI * 2;
      const radius = c * Math.sin(angle);
      const height = c * Math.cos(angle) * energy / 10 * Math.sign(Math.cos(angle));
      
      const x = radius * Math.cos(theta + e * Math.PI);
      const y = radius * Math.sin(theta + e * Math.PI);
      const z = height;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 3.0, c: 2.0, d: 1.5, e: 1.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 64 
    })
  },

  // EINSTEIN VARIANT 7: E = mc^c - Logarithmic/symbolic variant
  einstein_exponential_form: {
    name: "⚛️ Einstein E=mc^c - Logarithmic Cosmology",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;  // Mass
      const b = params.b ?? 2.0;  // Light constant (smaller for c^c)
      const c = params.c ?? 1.5;  // Scale factor
      const d = params.d ?? 2.0;  // Exponential growth
      const e = params.e ?? 1.0;  // Time
      
      const mass = Math.abs(a);
      const lightConst = Math.max(1.1, Math.min(2.5, Math.abs(b))); // Limit to prevent overflow
      const energy = mass * Math.pow(lightConst, lightConst); // E = mc^c (exponential)
      
      // Logarithmic spiral showing exponential energy growth
      const theta = u * d * Math.PI * 2;
      const exponentialRadius = c * Math.log(1 + v * energy);
      const height = v * Math.sqrt(energy) * e;
      
      const x = exponentialRadius * Math.cos(theta);
      const y = exponentialRadius * Math.sin(theta);
      const z = height;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 2.0, c: 1.5, d: 2.0, e: 1.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 128, vSegments: 64 
    })
  },

  // RELATIVISTIC ENERGY-MOMENTUM E²=(mc²)²+(pc)² - Energy Space Geometry
  relativistic_energy_momentum: {
    name: "🌌 Relativistic Energy E²=(mc²)²+(pc)² - Energy Space",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;  // Rest mass energy (mc²)
      const b = params.b ?? 1.5;  // Momentum (pc)
      const c = params.c ?? 2.0;  // Scale factor
      const d = params.d ?? 0.5;  // Rotation
      const e = params.e ?? 1.0;  // Animation
      
      // E² = (mc²)² + (pc)²  -- Pythagorean relation in energy space
      const restEnergy = Math.abs(a);
      const momentum = Math.abs(b) * u; // Momentum varies with u
      const totalEnergy = Math.sqrt(restEnergy * restEnergy + momentum * momentum);
      
      // Visualize as cone in energy-momentum space
      const theta = v * Math.PI * 2;
      const radius = momentum * c;
      const height = totalEnergy * c * e;
      
      const x = radius * Math.cos(theta + d);
      const y = radius * Math.sin(theta + d);
      const z = height;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.5, c: 2.0, d: 0.5, e: 1.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 64 
    })
  },

  // QUANTUM E=hf - Wave-Particle Duality
  quantum_energy_frequency: {
    name: "🌊 Quantum E=hf - Wave-Particle Duality",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;  // Planck constant (h)
      const b = params.b ?? 5.0;  // Frequency (f)
      const c = params.c ?? 1.5;  // Amplitude
      const d = params.d ?? 3.0;  // Wave packets
      const e = params.e ?? 1.0;  // Time phase
      
      const planck = Math.abs(a);
      const frequency = Math.abs(b);
      const energy = planck * frequency; // E = hf
      
      // Wave packets showing quantized energy
      const waveNumber = d;
      const phase = e * Math.PI * 2;
      const wavelength = 1 / frequency;
      
      // Particle position (quantized)
      const particlePos = Math.floor(u * waveNumber) / waveNumber;
      
      // Wave function
      const x = (u - 0.5) * 4;
      const wavePhase = u * frequency * Math.PI * 2 + phase;
      const envelope = Math.exp(-Math.pow((u - particlePos) / wavelength, 2));
      const y = c * Math.sin(wavePhase + v * Math.PI * 2) * envelope;
      const z = energy * v;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 5.0, c: 1.5, d: 3.0, e: 1.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 128, vSegments: 32 
    })
  },

  // THERMAL ENERGY E=(3/2)kT - Statistical Mechanics
  thermal_energy_boltzmann: {
    name: "🌡️ Thermal Energy E=(3/2)kT - Statistical Mechanics",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;   // Boltzmann constant (k)
      const b = params.b ?? 300.0; // Temperature (T)
      const c = params.c ?? 2.0;   // Distribution spread
      const d = params.d ?? 1.5;   // Height scale
      const e = params.e ?? 1.0;   // Molecular motion
      
      const boltzmann = Math.abs(a);
      const temperature = Math.abs(b);
      const avgEnergy = (3/2) * boltzmann * temperature; // E = (3/2)kT
      
      // Maxwell-Boltzmann distribution of molecular velocities
      const velocity = (u - 0.5) * 4 * c;
      const probability = Math.exp(-velocity * velocity / (2 * avgEnergy));
      
      // 3D velocity space
      const theta = v * Math.PI * 2;
      const radius = Math.abs(velocity) * c;
      const height = probability * d * avgEnergy + Math.sin(e * theta) * 0.2;
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = height;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 300.0, c: 2.0, d: 1.5, e: 1.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 64 
    })
  },

  // NEWTON F=ma - Classical Force Law
  newton_force_acceleration: {
    name: "🍎 Newton F=ma (1687) - Classical Force Law",
    equation: (u, v, params) => {
      const a = params.a ?? 2.0;  // Mass
      const b = params.b ?? 1.5;  // Acceleration magnitude
      const c = params.c ?? 2.0;  // Trajectory scale
      const d = params.d ?? 1.0;  // Time steps
      const e = params.e ?? 1.0;  // Force direction
      
      const mass = Math.abs(a);
      const accel = b;
      const force = mass * accel; // F = ma
      
      // Parabolic trajectory under constant force
      const time = u * d;
      const angle = e * Math.PI / 4;
      
      // Position under constant acceleration
      const x = c * time * Math.cos(angle);
      const y = c * time * Math.sin(angle);
      const z = -0.5 * accel * time * time + force * v; // y = y₀ + v₀t - ½at²
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 2.0, b: 1.5, c: 2.0, d: 1.0, e: 1.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 48 
    })
  },

  // MOMENTUM F=dp/dt - General Force Law
  momentum_force_law: {
    name: "💨 Momentum F=dp/dt - General Force Law",
    equation: (u, v, params) => {
      const a = params.a ?? 2.0;  // Initial momentum
      const b = params.b ?? 1.5;  // Force magnitude
      const c = params.c ?? 2.0;  // Spiral radius
      const d = params.d ?? 3.0;  // Spiral pitch
      const e = params.e ?? 1.0;  // Time evolution
      
      const p0 = a;
      const force = b;
      
      // dp/dt = F, so p(t) = p₀ + F·t
      const time = u * e;
      const momentum = p0 + force * time;
      
      // Momentum flow as spiral
      const theta = time * Math.PI * 2;
      const radius = c * Math.sqrt(Math.abs(momentum));
      const height = time * d;
      
      const x = radius * Math.cos(theta + v * Math.PI * 2);
      const y = radius * Math.sin(theta + v * Math.PI * 2);
      const z = height;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 2.0, b: 1.5, c: 2.0, d: 3.0, e: 1.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 64 
    })
  },

  // WORK-ENERGY W=∫F·dx - Energy Transfer
  work_energy_theorem: {
    name: "⚡ Work-Energy W=∫F·dx - Energy Transfer",
    equation: (u, v, params) => {
      const a = params.a ?? 2.0;  // Force magnitude
      const b = params.b ?? 3.0;  // Path length
      const c = params.c ?? 1.5;  // Energy accumulation
      const d = params.d ?? 2.0;  // Path curvature
      const e = params.e ?? 1.0;  // Work direction
      
      const force = a;
      const distance = u * b;
      const work = force * distance; // W = F·d (simplified)
      
      // Path through space where work is done
      const theta = distance * Math.PI / d;
      const radius = 1 + v * 0.5;
      
      const x = radius * Math.cos(theta * e);
      const y = radius * Math.sin(theta * e);
      const z = work * c * v; // Energy increases along path
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 2.0, b: 3.0, c: 1.5, d: 2.0, e: 1.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 48 
    })
  },

  // GRAVITATIONAL FORCE F=G(m₁m₂)/r² - Universal Gravitation
  gravitational_force_law: {
    name: "🌍 Gravitational F=G(m₁m₂)/r² - Universal Gravitation",
    equation: (u, v, params) => {
      const a = params.a ?? 10.0; // Mass 1
      const b = params.b ?? 5.0;  // Mass 2
      const c = params.c ?? 1.0;  // Gravitational constant (G)
      const d = params.d ?? 3.0;  // Field range
      const e = params.e ?? 1.0;  // Potential well depth
      
      const m1 = Math.abs(a);
      const m2 = Math.abs(b);
      const G = Math.abs(c);
      
      // Distance from center
      const r = Math.max(0.1, v * d);
      const force = G * m1 * m2 / (r * r); // F = G(m₁m₂)/r²
      
      // Gravitational field lines and potential well
      const theta = u * Math.PI * 2;
      const radius = r;
      const depth = -e * force / (r + 0.5); // Potential well
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = depth;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 10.0, b: 5.0, c: 1.0, d: 3.0, e: 1.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 64 
    })
  },

  // LORENTZ FORCE F=q(E+v×B) - Electromagnetic Force
  lorentz_electromagnetic_force: {
    name: "⚡ Lorentz F=q(E+v×B) - Electromagnetic Force",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;  // Charge (q)
      const b = params.b ?? 2.0;  // Electric field (E)
      const c = params.c ?? 1.5;  // Magnetic field (B)
      const d = params.d ?? 3.0;  // Velocity magnitude
      const e = params.e ?? 1.0;  // Time evolution
      
      const charge = a;
      const electricField = b;
      const magneticField = c;
      const velocity = d;
      
      // Charged particle trajectory in crossed E and B fields
      const time = u * e;
      const theta = time * Math.PI * 2;
      
      // Helical motion from magnetic force + drift from electric force
      const cyclotronFreq = charge * magneticField;
      const radius = velocity / Math.abs(cyclotronFreq);
      const drift = electricField / magneticField * time;
      
      const x = radius * Math.cos(cyclotronFreq * time) + drift;
      const y = radius * Math.sin(cyclotronFreq * time);
      const z = velocity * time * v;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 2.0, c: 1.5, d: 3.0, e: 1.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 128, vSegments: 32 
    })
  },

  // BOUSTROPHEDON - Ancient Greek Bidirectional Writing Pattern (5th Century BCE)
  boustrophedon_pattern: {
    name: "📜 Boustrophedon (5th C. BCE) - Ox-Turn Writing Pattern",
    equation: (u, v, params) => {
      const a = params.a ?? 8;    // Number of lines/rows
      const b = params.b ?? 3.0;  // Width scale
      const c = params.c ?? 0.5;  // Line spacing
      const d = params.d ?? 0.3;  // Letter wave amplitude
      const e = params.e ?? 6;    // Letters per line
      const f = params.f ?? 0.2;  // Mirror offset for alternating lines
      
      const numLines = Math.max(2, Math.floor(a));
      const width = Math.abs(b);
      const spacing = Math.abs(c);
      
      // Which line (row) we're on
      const lineIndex = Math.floor(v * numLines);
      const lineProgress = (v * numLines) % 1;
      
      // Boustrophedon: alternate direction each line (like ox plowing)
      const isReversed = lineIndex % 2 === 1;
      
      // Progress along the line (0 to 1), reversed on odd lines
      let xProgress = u;
      if (isReversed) {
        xProgress = 1 - u;
      }
      
      // X position: horizontal progress across line
      const x = (xProgress - 0.5) * width * 2;
      
      // Y position: vertical line stacking
      const y = (lineIndex - numLines / 2) * spacing;
      
      // Z: wave pattern representing letter forms
      // Mirrored on reversed lines (as ancient Greek letters were mirrored)
      const letterFreq = e * Math.PI * 2;
      const mirrorFactor = isReversed ? -1 : 1;
      const letterWave = d * Math.sin(u * letterFreq) * mirrorFactor;
      
      // Add slight depth variation for 3D effect
      const depthWave = 0.1 * Math.cos(u * letterFreq * 0.5 + lineIndex);
      const z = letterWave + depthWave + f * (isReversed ? 1 : 0);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 8, b: 3.0, c: 0.5, d: 0.3, e: 6, f: 0.2,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 128, vSegments: 64 
    })
  },

  // GORTYN CODE TABLET - Ancient Greek Legal Inscription Surface
  gortyn_code_tablet: {
    name: "🏛️ Gortyn Code (450 BCE) - Ancient Legal Inscription",
    equation: (u, v, params) => {
      const a = params.a ?? 4.0;  // Tablet width
      const b = params.b ?? 5.0;  // Tablet height  
      const c = params.c ?? 0.3;  // Inscription depth
      const d = params.d ?? 12;   // Columns of text
      const e = params.e ?? 0.1;  // Weathering/erosion
      const f = params.f ?? 0.05; // Crack patterns
      
      const width = Math.abs(a);
      const height = Math.abs(b);
      const depth = Math.abs(c);
      
      // Base tablet surface
      const x = (u - 0.5) * width * 2;
      const y = (v - 0.5) * height * 2;
      
      // Boustrophedon text columns (alternating direction inscriptions)
      const columns = Math.max(1, Math.floor(d));
      const columnIndex = Math.floor(u * columns);
      const isReversed = columnIndex % 2 === 1;
      
      // Inscription grooves
      const textFreq = columns * Math.PI * 4;
      const inscriptionDepth = depth * Math.sin(u * textFreq) * Math.cos(v * textFreq * 0.7);
      
      // Weathering and age effects
      const erosion = e * (Math.sin(u * 15) * Math.sin(v * 12) + 
                          Math.cos(u * 23 + v * 17) * 0.5);
      
      // Ancient stone cracks
      const cracks = f * (Math.abs(Math.sin(u * 47 + v * 31)) < 0.1 ? -0.3 : 0);
      
      // Combined surface with inscriptions
      const z = inscriptionDepth + erosion + cracks;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 4.0, b: 5.0, c: 0.3, d: 12, e: 0.1, f: 0.05,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 256, vSegments: 256 
    })
  }

};

export const HISTORICAL_ALGORITHMS_COUNT = Object.keys(HISTORICAL_ALGORITHMS).length;
