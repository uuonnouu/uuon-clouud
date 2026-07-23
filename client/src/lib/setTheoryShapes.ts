/**
 * SET THEORY SHAPES - Mathematical Set Visualizations
 * **Product of UUON Foundation, no undocumented reproduction or any use without written consent.**
 * **Author: Phillip A. Ruiz III, Organization: UUON Foundation Inc.**
 * 
 * Mathematical 3D representations of fundamental set theory concepts:
 * - Null Set/Empty Set (∅)
 * - Singleton Set ({a})
 * - Finite Set ({1, 2, ..., n})
 * - Infinite Set ({1, 2, 3, ...})
 * - Subset (A ⊆ B)
 * - Power Set P(A)
 * - Universal Set (U)
 * - Equivalent Sets (|A| = |B|)
 * - Equal Sets (A = B)
 * - Super Set (A ⊇ B)
 */

import { SurfaceParameters } from '../types/math';

export interface ParametricSurface {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

export const SET_THEORY_SHAPES: Record<string, ParametricSurface> = {

  // ============================================================================
  // NULL SET / EMPTY SET (∅)
  // Mathematical Definition: A set containing no elements, denoted ∅ or {}
  // Cardinality: |∅| = 0
  // Visualization: A hollow boundary sphere with void interior - represents "nothing"
  // ============================================================================
  null_set_empty: {
    name: "∅ Null Set (Empty Set) - The Void",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 2;
      const c = params.c ?? 2;
      const d = params.d ?? 0;
      const time = params.time || 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // Create hollow boundary - only the shell exists, interior is void
      // Using parametric sphere equation: x = r*sin(φ)*cos(θ), y = r*sin(φ)*sin(θ), z = r*cos(φ)
      const radius = a;
      
      // Pulsating void effect - the empty set "breathes" showing absence
      const voidPulse = 1 + 0.05 * Math.sin(time * 2);
      
      // Thin shell boundary - represents the set notation {} with nothing inside
      // Mathematical: ∀x: x ∉ ∅ (for all x, x is not an element of empty set)
      const shellThickness = 0.02;
      const boundaryFactor = voidPulse;
      
      // Create ethereal dashed boundary effect
      const dashPattern = Math.sin(10 * theta) * Math.sin(8 * phi);
      const visibility = dashPattern > 0 ? 1 : 0.3;
      
      const x = a * boundaryFactor * Math.sin(phi) * Math.cos(theta) * visibility;
      const y = b * boundaryFactor * Math.sin(phi) * Math.sin(theta) * visibility;
      const z = c * boundaryFactor * Math.cos(phi) * visibility;
      
      // Twist transformation for visual interest
      const twist = d * 0.05;
      const xTwist = x * Math.cos(twist * z) - y * Math.sin(twist * z);
      const yTwist = x * Math.sin(twist * z) + y * Math.cos(twist * z);
      
      return [xTwist, yTwist, z];
    },
    defaultParams: { a: 2, b: 2, c: 2, d: 0, uSegments: 64, vSegments: 32 }
  },

  // ============================================================================
  // SINGLETON SET ({a})
  // Mathematical Definition: A set containing exactly one element
  // Cardinality: |{a}| = 1
  // Visualization: A single prominent sphere representing the sole element
  // ============================================================================
  singleton_set: {
    name: "{a} Singleton Set - One Element",
    equation: (u, v, params) => {
      const a = params.a ?? 1.5;
      const b = params.b ?? 1.5;
      const c = params.c ?? 1.5;
      const d = params.d ?? 0;
      const e = params.e ?? 0;
      const time = params.time || 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // Single element sphere - THE unique element of the singleton
      // Mathematical: ∃!x: x ∈ {a} (there exists exactly one x in the set)
      const elementRadius = a * 0.5;
      
      // Pulsating glow effect - emphasizes uniqueness
      const uniquePulse = 1 + 0.1 * Math.sin(time * 3);
      
      // The single element with a subtle "halo" boundary
      const r = elementRadius * uniquePulse;
      
      // Add subtle orbital ring to show set boundary
      const boundaryIntensity = 0.15 * Math.sin(4 * theta);
      
      let x = r * Math.sin(phi) * Math.cos(theta);
      let y = r * Math.sin(phi) * Math.sin(theta);
      let z = r * Math.cos(phi);
      
      // Add boundary ring at equator
      if (Math.abs(phi - Math.PI/2) < 0.2) {
        const ringExpand = 1 + boundaryIntensity;
        x *= ringExpand;
        y *= ringExpand;
      }
      
      // Scale and transform
      x *= b / a;
      y *= c / a;
      
      // Rotation effect
      const rotation = d * 0.02 + time * 0.1;
      const xRot = x * Math.cos(rotation) - y * Math.sin(rotation);
      const yRot = x * Math.sin(rotation) + y * Math.cos(rotation);
      
      return [xRot, yRot, z];
    },
    defaultParams: { a: 1.5, b: 1.5, c: 1.5, d: 0, uSegments: 48, vSegments: 24 }
  },

  // ============================================================================
  // FINITE SET ({1, 2, ..., n})
  // Mathematical Definition: A set with a countable, limited number of elements
  // Cardinality: |A| = n where n ∈ ℕ
  // Visualization: Multiple discrete spheres arranged in a structured pattern
  // ============================================================================
  finite_set: {
    name: "{1,2,...,n} Finite Set - Bounded Elements",
    equation: (u, v, params) => {
      const a = params.a ?? 3;
      const b = params.b ?? 3;
      const c = params.c ?? 3;
      const d = params.d ?? 5; // Number of elements (n)
      const time = params.time || 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // n discrete elements arranged in 3D space
      // Mathematical: A = {x₁, x₂, ..., xₙ} where |A| = n
      const n = Math.max(3, Math.round(Math.abs(d) + 3));
      
      // Map u to select which element we're rendering
      const elementIndex = Math.floor(u * n) % n;
      const localU = (u * n) % 1;
      
      // Each element is a small sphere at a specific position
      // Golden angle distribution for optimal sphere packing
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      const elementTheta = elementIndex * goldenAngle;
      const elementPhi = Math.acos(1 - 2 * (elementIndex + 0.5) / n);
      
      // Position of this element's center in the finite set space
      const orbitRadius = a * 0.7;
      const centerX = orbitRadius * Math.sin(elementPhi) * Math.cos(elementTheta);
      const centerY = orbitRadius * Math.sin(elementPhi) * Math.sin(elementTheta);
      const centerZ = orbitRadius * Math.cos(elementPhi);
      
      // Each element sphere
      const elementRadius = a * 0.15;
      const localTheta = localU * 2 * Math.PI;
      const localPhi = v * Math.PI;
      
      const x = centerX + elementRadius * Math.sin(localPhi) * Math.cos(localTheta);
      const y = centerY + elementRadius * Math.sin(localPhi) * Math.sin(localTheta);
      const z = centerZ + elementRadius * Math.cos(localPhi);
      
      // Outer boundary shell (faint)
      const boundaryEffect = 0.1 * Math.sin(8 * theta) * Math.sin(6 * phi);
      
      return [x * (1 + boundaryEffect), y * (1 + boundaryEffect), z];
    },
    defaultParams: { a: 3, b: 3, c: 3, d: 5, uSegments: 96, vSegments: 48 }
  },

  // ============================================================================
  // INFINITE SET ({1, 2, 3, ...})
  // Mathematical Definition: A set with unlimited elements, countably or uncountably infinite
  // Cardinality: |A| = ℵ₀ (aleph-null for countable) or |A| = 𝔠 (continuum for uncountable)
  // Visualization: Expanding spiral that extends infinitely, converging pattern
  // ============================================================================
  infinite_set: {
    name: "{1,2,3,...} Infinite Set - Unbounded Elements",
    equation: (u, v, params) => {
      const a = params.a ?? 4;
      const b = params.b ?? 4;
      const c = params.c ?? 2;
      const d = params.d ?? 0;
      const time = params.time || 0;
      
      // Infinite spiral - elements continue forever
      // Mathematical: ℕ = {1, 2, 3, 4, ...} is countably infinite (|ℕ| = ℵ₀)
      const theta = u * 8 * Math.PI; // Multiple revolutions
      const t = v; // Radial expansion parameter
      
      // Archimedean spiral expanding outward - represents infinite continuation
      // r(θ) = a + bθ (Archimedean spiral equation)
      const spiralGrowth = 0.2 + t * 3;
      const r = spiralGrowth;
      
      // Create discrete "beads" on the spiral representing elements
      const beadFrequency = 20;
      const beadAmplitude = 0.1 * Math.sin(beadFrequency * theta);
      
      // 3D spiral in space
      const x = a * r * Math.cos(theta) * (1 + beadAmplitude);
      const y = b * r * Math.sin(theta) * (1 + beadAmplitude);
      
      // Z increases showing infinite progression into "higher dimensions"
      const z = c * (t - 0.5) + 0.5 * Math.sin(4 * theta + time * 0.5);
      
      // Fade effect at edges - suggests continuation beyond view
      const fadeIn = Math.min(1, t * 4);
      const fadeOut = Math.min(1, (1 - t) * 4);
      const fade = fadeIn * fadeOut;
      
      return [x * fade, y * fade, z];
    },
    defaultParams: { a: 4, b: 4, c: 2, d: 0, uSegments: 128, vSegments: 64 }
  },

  // ============================================================================
  // SUBSET (A ⊆ B)
  // Mathematical Definition: Set A is a subset of B if every element of A is also in B
  // ∀x: (x ∈ A → x ∈ B)
  // Visualization: Nested spheres showing A contained within B
  // ============================================================================
  subset_relation: {
    name: "A ⊆ B Subset - Containment Relation",
    equation: (u, v, params) => {
      const a = params.a ?? 3;
      const b = params.b ?? 3;
      const c = params.c ?? 3;
      const d = params.d ?? 0;
      const time = params.time || 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // Two nested structures: inner set A ⊆ outer set B
      // Mathematical: A ⊆ B ⟺ ∀x(x ∈ A → x ∈ B)
      
      // Determine which sphere we're rendering based on v
      const isInnerSet = v < 0.5;
      const localPhi = (isInnerSet ? v * 2 : (v - 0.5) * 2) * Math.PI;
      
      // Outer set B (superset) - larger sphere
      const outerRadius = a;
      // Inner set A (subset) - smaller sphere, offset slightly
      const innerRadius = a * 0.5;
      const innerOffset = a * 0.15;
      
      let x, y, z;
      
      if (isInnerSet) {
        // Subset A - smaller, inside B
        x = innerRadius * Math.sin(localPhi) * Math.cos(theta) + innerOffset;
        y = innerRadius * Math.sin(localPhi) * Math.sin(theta);
        z = innerRadius * Math.cos(localPhi);
      } else {
        // Superset B - larger, contains A
        // Make it semi-transparent by creating a mesh pattern
        const meshPattern = (Math.sin(8 * theta) + Math.sin(8 * localPhi)) * 0.5;
        const meshFactor = 0.8 + 0.2 * meshPattern;
        
        x = outerRadius * Math.sin(localPhi) * Math.cos(theta) * meshFactor;
        y = outerRadius * Math.sin(localPhi) * Math.sin(theta) * meshFactor;
        z = outerRadius * Math.cos(localPhi) * meshFactor;
      }
      
      // Pulsating containment visualization
      const pulse = 1 + 0.03 * Math.sin(time * 2);
      
      return [x * pulse, y * pulse, z * pulse];
    },
    defaultParams: { a: 3, b: 3, c: 3, d: 0, uSegments: 96, vSegments: 96 }
  },

  // ============================================================================
  // POWER SET P(A)
  // Mathematical Definition: Set of all subsets of A, including ∅ and A itself
  // Cardinality: |P(A)| = 2^|A|
  // Visualization: Hierarchical tree/lattice structure showing subset relationships
  // ============================================================================
  power_set: {
    name: "P(A) Power Set - All Subsets",
    equation: (u, v, params) => {
      const a = params.a ?? 4;
      const b = params.b ?? 4;
      const c = params.c ?? 4;
      const d = params.d ?? 3; // Base set size (|A|)
      const time = params.time || 0;
      
      // Power set has 2^n elements for a set of n elements
      // Mathematical: P(A) = {X : X ⊆ A}
      const baseSetSize = Math.max(2, Math.min(5, Math.round(d)));
      const powerSetSize = Math.pow(2, baseSetSize);
      
      // Create Hasse diagram - lattice structure of subset relations
      // Each level represents subsets of same cardinality
      const theta = u * 2 * Math.PI;
      
      // Map v to levels (0 = ∅, 1 = singletons, ..., n = A)
      const level = Math.floor(v * (baseSetSize + 1));
      const localV = (v * (baseSetSize + 1)) % 1;
      
      // Number of subsets at each level = C(n, k) binomial coefficient
      const binomial = (n: number, k: number): number => {
        if (k > n || k < 0) return 0;
        if (k === 0 || k === n) return 1;
        let result = 1;
        for (let i = 0; i < k; i++) {
          result = result * (n - i) / (i + 1);
        }
        return Math.round(result);
      };
      
      const subsetsAtLevel = binomial(baseSetSize, level);
      const subsetIndex = Math.floor(localV * subsetsAtLevel);
      
      // Position in 3D lattice
      const levelHeight = (level / baseSetSize - 0.5) * c * 2;
      const angleOffset = (subsetIndex / subsetsAtLevel) * 2 * Math.PI;
      const radius = a * 0.3 * Math.sqrt(subsetsAtLevel) / Math.sqrt(baseSetSize);
      
      // Create node sphere at this position
      const nodeRadius = 0.15;
      const localTheta = u * 2 * Math.PI;
      const localPhi = localV * Math.PI;
      
      const centerX = radius * Math.cos(angleOffset);
      const centerY = radius * Math.sin(angleOffset);
      const centerZ = levelHeight;
      
      const x = centerX + nodeRadius * Math.sin(localPhi) * Math.cos(localTheta);
      const y = centerY + nodeRadius * Math.sin(localPhi) * Math.sin(localTheta);
      const z = centerZ + nodeRadius * Math.cos(localPhi);
      
      // Add connecting lines effect (edges in Hasse diagram)
      const edgeEffect = 0.1 * Math.sin(time + level);
      
      return [x * (1 + edgeEffect), y * (1 + edgeEffect), z];
    },
    defaultParams: { a: 4, b: 4, c: 4, d: 3, uSegments: 96, vSegments: 64 }
  },

  // ============================================================================
  // UNIVERSAL SET (U)
  // Mathematical Definition: The set containing all elements under consideration
  // All sets are subsets of U: ∀A: A ⊆ U
  // Visualization: Large encompassing sphere/boundary containing everything
  // ============================================================================
  universal_set: {
    name: "U Universal Set - The Domain",
    equation: (u, v, params) => {
      const a = params.a ?? 5;
      const b = params.b ?? 5;
      const c = params.c ?? 5;
      const d = params.d ?? 0;
      const e = params.e ?? 0;
      const time = params.time || 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // Universal set - contains ALL elements of discourse
      // Mathematical: ∀A in context: A ⊆ U, and A ∪ Aᶜ = U
      
      // Large outer boundary
      const universeRadius = a;
      
      // Create textured surface showing it contains "everything"
      // Multiple smaller elements inside
      const innerElements = 7;
      const elementLayer = Math.floor(v * 2);
      
      let x, y, z;
      
      if (elementLayer === 0) {
        // Inner diverse elements - representing various sets within U
        const elementTheta = theta * innerElements;
        const elementPhi = (v * 2) * Math.PI;
        const smallRadius = a * 0.12;
        const orbitRadius = a * 0.5;
        
        // Distribute elements in 3D
        const ex = orbitRadius * Math.sin(elementPhi * 2) * Math.cos(elementTheta);
        const ey = orbitRadius * Math.sin(elementPhi * 2) * Math.sin(elementTheta);
        const ez = orbitRadius * Math.cos(elementPhi * 2);
        
        x = ex + smallRadius * Math.sin(elementPhi) * Math.cos(theta);
        y = ey + smallRadius * Math.sin(elementPhi) * Math.sin(theta);
        z = ez + smallRadius * Math.cos(elementPhi);
      } else {
        // Outer universal boundary
        const localPhi = (v - 0.5) * 2 * Math.PI;
        
        // Cosmic texture on boundary
        const cosmicWave = 0.05 * (
          Math.sin(5 * theta) * Math.sin(4 * localPhi) +
          Math.sin(3 * theta + time * 0.5) * Math.cos(6 * localPhi)
        );
        
        const r = universeRadius * (1 + cosmicWave);
        x = r * Math.sin(localPhi) * Math.cos(theta);
        y = r * Math.sin(localPhi) * Math.sin(theta);
        z = r * Math.cos(localPhi);
      }
      
      // Rotation for visual dynamics
      const rotation = d * 0.01 + time * 0.05;
      const xRot = x * Math.cos(rotation) - y * Math.sin(rotation);
      const yRot = x * Math.sin(rotation) + y * Math.cos(rotation);
      
      return [xRot, yRot, z];
    },
    defaultParams: { a: 5, b: 5, c: 5, d: 0, uSegments: 128, vSegments: 64 }
  },

  // ============================================================================
  // EQUIVALENT SETS (|A| = |B|)
  // Mathematical Definition: Two sets with the same cardinality (bijection exists)
  // A ~ B ⟺ ∃f: A → B where f is bijective
  // Visualization: Two separate structures with visible mapping connections
  // ============================================================================
  equivalent_sets: {
    name: "|A| = |B| Equivalent Sets - Same Cardinality",
    equation: (u, v, params) => {
      const a = params.a ?? 3;
      const b = params.b ?? 3;
      const c = params.c ?? 2;
      const d = params.d ?? 4; // Number of elements
      const time = params.time || 0;
      
      const theta = u * 2 * Math.PI;
      
      // Two sets with same cardinality - bijection exists
      // Mathematical: |A| = |B| ⟺ there exists a one-to-one correspondence
      const n = Math.max(3, Math.round(Math.abs(d)));
      
      // Determine which set and which element
      const isSetA = v < 0.4;
      const isMapping = v >= 0.4 && v < 0.6;
      const localV = isSetA ? v / 0.4 : (isMapping ? (v - 0.4) / 0.2 : (v - 0.6) / 0.4);
      
      const elementIndex = Math.floor(localV * n);
      const elementAngle = (elementIndex / n) * 2 * Math.PI;
      
      let x, y, z;
      const setRadius = a * 0.8;
      const elementRadius = a * 0.12;
      
      if (isSetA) {
        // Set A on the left
        const centerX = -a * 0.6 + setRadius * 0.5 * Math.cos(elementAngle);
        const centerY = setRadius * 0.5 * Math.sin(elementAngle);
        const centerZ = 0;
        
        const localPhi = (localV * n - elementIndex) * Math.PI;
        x = centerX + elementRadius * Math.sin(localPhi) * Math.cos(theta);
        y = centerY + elementRadius * Math.sin(localPhi) * Math.sin(theta);
        z = centerZ + elementRadius * Math.cos(localPhi);
      } else if (isMapping) {
        // Bijection mapping lines connecting corresponding elements
        const t = localV;
        const startAngle = (Math.floor(t * n) / n) * 2 * Math.PI;
        
        const startX = -a * 0.6 + setRadius * 0.5 * Math.cos(startAngle);
        const startY = setRadius * 0.5 * Math.sin(startAngle);
        const endX = a * 0.6 + setRadius * 0.5 * Math.cos(startAngle);
        const endY = setRadius * 0.5 * Math.sin(startAngle);
        
        const interpT = (t * n) % 1;
        x = startX + (endX - startX) * interpT;
        y = startY + (endY - startY) * interpT;
        z = 0.1 * Math.sin(Math.PI * interpT); // Arc up for visibility
      } else {
        // Set B on the right (same structure, different position)
        const centerX = a * 0.6 + setRadius * 0.5 * Math.cos(elementAngle);
        const centerY = setRadius * 0.5 * Math.sin(elementAngle);
        const centerZ = 0;
        
        const localPhi = ((localV * n) % 1) * Math.PI;
        x = centerX + elementRadius * Math.sin(localPhi) * Math.cos(theta);
        y = centerY + elementRadius * Math.sin(localPhi) * Math.sin(theta);
        z = centerZ + elementRadius * Math.cos(localPhi);
      }
      
      // Pulsating to show the bijection "flow"
      const pulse = 1 + 0.03 * Math.sin(time * 3 + elementIndex);
      
      return [x * pulse, y * pulse, z];
    },
    defaultParams: { a: 3, b: 3, c: 2, d: 4, uSegments: 128, vSegments: 64 }
  },

  // ============================================================================
  // EQUAL SETS (A = B)
  // Mathematical Definition: Two sets containing exactly the same elements
  // A = B ⟺ (A ⊆ B ∧ B ⊆ A)
  // Visualization: Overlapping identical structures (perfectly superimposed)
  // ============================================================================
  equal_sets: {
    name: "A = B Equal Sets - Identical Elements",
    equation: (u, v, params) => {
      const a = params.a ?? 2.5;
      const b = params.b ?? 2.5;
      const c = params.c ?? 2.5;
      const d = params.d ?? 0;
      const time = params.time || 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // Equal sets - same elements means same structure
      // Mathematical: A = B ⟺ ∀x(x ∈ A ↔ x ∈ B)
      
      // Base set shape with multiple elements
      const n = 5; // Number of distinct elements
      const elementIndex = Math.floor(u * n);
      const localU = (u * n) % 1;
      
      // Golden spiral positions for elements
      const goldenRatio = (1 + Math.sqrt(5)) / 2;
      const elementAngle = elementIndex * 2 * Math.PI / goldenRatio;
      const elementRadius = 0.3 + 0.1 * elementIndex;
      
      const centerX = a * 0.5 * elementRadius * Math.cos(elementAngle);
      const centerY = a * 0.5 * elementRadius * Math.sin(elementAngle);
      const centerZ = (elementIndex - n/2) * 0.3;
      
      const sphereRadius = a * 0.15;
      const localTheta = localU * 2 * Math.PI;
      const localPhi = v * Math.PI;
      
      let x = centerX + sphereRadius * Math.sin(localPhi) * Math.cos(localTheta);
      let y = centerY + sphereRadius * Math.sin(localPhi) * Math.sin(localTheta);
      let z = centerZ + sphereRadius * Math.cos(localPhi);
      
      // "Double outline" effect showing both A and B are identical
      // Two overlapping traces that perfectly coincide
      const doubleTrace = 1 + 0.02 * Math.sin(12 * theta + time * 2);
      
      // Add set boundary
      const boundary = 0.05 * Math.sin(6 * theta) * Math.sin(4 * phi);
      
      x *= doubleTrace * (1 + boundary);
      y *= doubleTrace * (1 + boundary);
      z *= doubleTrace;
      
      return [x, y, z];
    },
    defaultParams: { a: 2.5, b: 2.5, c: 2.5, d: 0, uSegments: 96, vSegments: 48 }
  },

  // ============================================================================
  // SUPER SET (A ⊇ B)
  // Mathematical Definition: Set A contains all elements of set B (B ⊆ A)
  // A ⊇ B ⟺ ∀x(x ∈ B → x ∈ A)
  // Visualization: Larger outer container with smaller inner subset
  // ============================================================================
  super_set: {
    name: "A ⊇ B Super Set - Contains Subset",
    equation: (u, v, params) => {
      const a = params.a ?? 4;
      const b = params.b ?? 4;
      const c = params.c ?? 4;
      const d = params.d ?? 0;
      const time = params.time || 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // Superset A contains subset B plus additional elements
      // Mathematical: A ⊇ B means B ⊆ A
      
      // Determine layer: 0 = subset B, 1 = additional A elements, 2 = boundary
      const layer = Math.floor(v * 3);
      const localV = (v * 3) % 1;
      const localPhi = localV * Math.PI;
      
      let x, y, z;
      
      if (layer === 0) {
        // Subset B - inner cluster
        const subsetRadius = a * 0.3;
        const offset = a * 0.1;
        
        x = subsetRadius * Math.sin(localPhi) * Math.cos(theta) + offset;
        y = subsetRadius * Math.sin(localPhi) * Math.sin(theta);
        z = subsetRadius * Math.cos(localPhi);
      } else if (layer === 1) {
        // Additional elements in A but not in B (A \ B)
        const additionalCount = 4;
        const elementIndex = Math.floor(localV * additionalCount);
        const elementAngle = elementIndex * 2 * Math.PI / additionalCount + Math.PI/4;
        
        const orbitRadius = a * 0.55;
        const elementRadius = a * 0.12;
        
        const centerX = orbitRadius * Math.cos(elementAngle);
        const centerY = orbitRadius * Math.sin(elementAngle);
        const centerZ = 0.3 * Math.sin(elementAngle * 2);
        
        const localTheta2 = ((localV * additionalCount) % 1) * 2 * Math.PI;
        const localPhi2 = v * 3 * Math.PI;
        
        x = centerX + elementRadius * Math.sin(localPhi2) * Math.cos(localTheta2);
        y = centerY + elementRadius * Math.sin(localPhi2) * Math.sin(localTheta2);
        z = centerZ + elementRadius * Math.cos(localPhi2);
      } else {
        // Superset A boundary (outer shell)
        const outerRadius = a * 0.9;
        const meshWave = 0.03 * (Math.sin(6 * theta) + Math.sin(5 * localPhi));
        
        x = outerRadius * (1 + meshWave) * Math.sin(localPhi) * Math.cos(theta);
        y = outerRadius * (1 + meshWave) * Math.sin(localPhi) * Math.sin(theta);
        z = outerRadius * (1 + meshWave) * Math.cos(localPhi);
      }
      
      // Containment pulse effect
      const pulse = 1 + 0.02 * Math.sin(time * 2);
      
      return [x * pulse, y * pulse, z * pulse];
    },
    defaultParams: { a: 4, b: 4, c: 4, d: 0, uSegments: 128, vSegments: 96 }
  },

  // ============================================================================
  // VENN DIAGRAM - Set Operations Visualization
  // Shows intersection (A ∩ B), union (A ∪ B), and difference (A \ B)
  // ============================================================================
  venn_diagram_sets: {
    name: "A ∩ B Venn Diagram - Set Operations",
    equation: (u, v, params) => {
      const a = params.a ?? 3;
      const b = params.b ?? 3;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const time = params.time || 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // Two overlapping circles (3D spheres) - classic Venn diagram
      // Shows: A ∩ B (intersection), A ∪ B (union), A \ B (difference)
      
      const setRadius = a * 0.6;
      const overlap = a * 0.3; // How much sets overlap
      
      // Determine which region
      const region = Math.floor(v * 2);
      const localPhi = (v * 2 - region) * Math.PI;
      
      let x, y, z;
      
      if (region === 0) {
        // Set A (left circle)
        const centerX = -overlap * 0.5;
        x = centerX + setRadius * Math.sin(localPhi) * Math.cos(theta);
        y = setRadius * Math.sin(localPhi) * Math.sin(theta);
        z = c * 0.5 * Math.cos(localPhi);
      } else {
        // Set B (right circle)
        const centerX = overlap * 0.5;
        x = centerX + setRadius * Math.sin(localPhi) * Math.cos(theta);
        y = setRadius * Math.sin(localPhi) * Math.sin(theta);
        z = c * 0.5 * Math.cos(localPhi);
      }
      
      // Highlight intersection region
      const intersectionGlow = Math.abs(x) < overlap * 0.3 ? 1.1 : 1.0;
      
      // Animation
      const pulse = 1 + 0.02 * Math.sin(time * 2);
      
      return [x * pulse * intersectionGlow, y * pulse, z];
    },
    defaultParams: { a: 3, b: 3, c: 1, d: 0, uSegments: 96, vSegments: 64 }
  },

  // ============================================================================
  // COMPLEMENT SET (Aᶜ = U \ A)
  // Mathematical Definition: All elements in U that are not in A
  // Visualization: Universal set with a void where A would be
  // ============================================================================
  complement_set: {
    name: "Aᶜ Complement Set - Elements Not in A",
    equation: (u, v, params) => {
      const a = params.a ?? 4;
      const b = params.b ?? 4;
      const c = params.c ?? 4;
      const d = params.d ?? 0;
      const time = params.time || 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // Complement: Aᶜ = U \ A = {x ∈ U : x ∉ A}
      // Show universal set with a "hole" where A is
      
      const universeRadius = a;
      const holeRadius = a * 0.4;
      const holeOffset = a * 0.2;
      
      // Parametric point on universe sphere
      let x = universeRadius * Math.sin(phi) * Math.cos(theta);
      let y = universeRadius * Math.sin(phi) * Math.sin(theta);
      let z = universeRadius * Math.cos(phi);
      
      // Calculate distance from hole center
      const holeX = holeOffset;
      const holeY = 0;
      const holeZ = 0;
      const distToHole = Math.sqrt(
        Math.pow(x - holeX, 2) + 
        Math.pow(y - holeY, 2) + 
        Math.pow(z - holeZ, 2)
      );
      
      // Create void effect near the hole (set A)
      if (distToHole < holeRadius * 1.5) {
        // Push surface away from hole center - creates complement cavity
        const pushFactor = Math.max(0.3, distToHole / holeRadius);
        const pushDir = {
          x: (x - holeX) / distToHole,
          y: (y - holeY) / distToHole,
          z: (z - holeZ) / distToHole
        };
        
        x = holeX + pushDir.x * holeRadius * 1.5;
        y = holeY + pushDir.y * holeRadius * 1.5;
        z = holeZ + pushDir.z * holeRadius * 1.5;
      }
      
      // Textured boundary
      const texture = 0.03 * Math.sin(8 * theta) * Math.sin(6 * phi);
      
      // Animation
      const pulse = 1 + 0.02 * Math.sin(time * 1.5);
      
      return [x * pulse * (1 + texture), y * pulse * (1 + texture), z * pulse];
    },
    defaultParams: { a: 4, b: 4, c: 4, d: 0, uSegments: 96, vSegments: 64 }
  }
};

console.log(`📐 Loaded ${Object.keys(SET_THEORY_SHAPES).length} Set Theory visualizations ∅∪∩⊆⊇`);
