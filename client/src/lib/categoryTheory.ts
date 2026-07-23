import { SurfaceParameters } from '../types/math';

/**
 * Category Theory Visualizations
 * Abstract mathematical structures representing categories, functors, and natural transformations
 * 
 * **Converted to ParametricSurface interface for production use**
 */

export interface ParametricSurface {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

export const CATEGORY_THEORY: Record<string, ParametricSurface> = {
  // Functor Mappings - Morphism preservation between categories
  functor_mapping: {
    name: "🔗 Functor Mapping - Category Theory",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 2;
      const c = params.c ?? 0.1;
      const d = params.d ?? 1;
      const e = params.e ?? 1;
      const f = params.f ?? 3;
      const g = params.g ?? 0;
      const h = params.h ?? 1;
      const i = params.i ?? 0.1;
      const j = params.j ?? 1;
      const k = params.k ?? 1;
      const l = params.l ?? 2;
      const m = params.m ?? 1;
      const n = params.n ?? 2;
      const o = params.o ?? 0.05;
      const p = params.p ?? 1;
      const q = params.q ?? 1;
      
      const categoryA = Math.floor(u * 2); // Two categories
      const morphismIndex = Math.floor(v * 6); // Six morphisms per category
      
      let x = 0, y = 0, z = 0;
      
      if (categoryA === 0) {
        // Source category - objects as nodes
        const objectPositions = [
          [0, 0], [a, 0], [a * 2, 0],  // Objects A, B, C
          [0, b], [a, b], [a * 2, b]   // Objects D, E, F
        ];
        
        const objIndex = morphismIndex % 6;
        const pos = objectPositions[objIndex];
        
        // Morphism arrows between objects
        const t_param = v * 6 - Math.floor(v * 6);
        const nextIndex = (objIndex + 1) % 6;
        const nextPos = objectPositions[nextIndex];
        
        x = pos[0] + t_param * (nextPos[0] - pos[0]) + c * Math.sin(d * u + e * v) * 0.1;
        y = pos[1] + t_param * (nextPos[1] - pos[1]) + d * Math.cos(c * u + e * v) * 0.1;
      } else {
        // Target category - functorially mapped objects
        const mappedPositions = [
          [f, g], [f + a * h, g], [f + a * 2 * h, g],
          [f, g + b * h], [f + a * h, g + b * h], [f + a * 2 * h, g + b * h]
        ];
        
        const objIndex = morphismIndex % 6;
        const pos = mappedPositions[objIndex];
        
        const t_param = v * 6 - Math.floor(v * 6);
        const nextIndex = (objIndex + 1) % 6;
        const nextPos = mappedPositions[nextIndex];
        
        x = pos[0] + t_param * (nextPos[0] - pos[0]) + i * Math.sin(j * u + k * v) * 0.08;
        y = pos[1] + t_param * (nextPos[1] - pos[1]) + j * Math.cos(i * u + k * v) * 0.08;
      }
      
      // Height separation between source and target categories
      const baseHeight = categoryA * l;
      
      // Functor "bridge" connecting categories
      const bridgeHeight = m * Math.sin(Math.PI * u) * Math.exp(-Math.abs(u - 0.5) * n);
      
      z = baseHeight + bridgeHeight + o * Math.sin(p * u + q * v) * 0.05;
      
      return [x, y, z];
    },
    defaultParams: {
      a: 2, b: 2, c: 0.1, d: 1, e: 1, f: 3, g: 0, h: 1, i: 0.1, j: 1, k: 1, l: 2, m: 1, n: 2, o: 0.05, p: 1, q: 1,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 36, vSegments: 36
    }
  },

  // Natural Transformations - Component-wise transformations between functors
  natural_transformation: {
    name: "🔀 Natural Transformation - Category Theory",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 1;
      const e = params.e ?? 1;
      const f = params.f ?? 0.5;
      const g = params.g ?? 1;
      const h = params.h ?? 1;
      const i = params.i ?? 1;
      const j = params.j ?? 1;
      const k = params.k ?? 1;
      const l = params.l ?? 1;
      const m = params.m ?? 2;
      const n = params.n ?? 1;
      const o = params.o ?? 0.06;
      const p = params.p ?? 1;
      const q = params.q ?? 1;
      
      // Two parallel functors F and G
      const functorLayer = Math.floor(v * 2); // F or G
      const objectIndex = Math.floor(u * 4); // 4 objects in category
      
      // Base category objects
      const baseObjects = [
        [0, 0], [a, 0], [a, a], [0, a]
      ];
      
      const obj = baseObjects[objectIndex % 4];
      
      let x = 0, y = 0, z = 0;
      
      if (functorLayer === 0) {
        // Functor F mapping
        x = obj[0] + b * functorLayer + c * Math.sin(d * u + e * v) * 0.1;
        y = obj[1] + d * Math.cos(c * u + e * v) * 0.1;
      } else {
        // Functor G mapping  
        x = obj[0] + b * functorLayer + f * (1 + g * Math.cos(h * u)) + i * Math.sin(j * u + k * v) * 0.08;
        y = obj[1] + g * (1 + h * Math.sin(i * u)) + j * Math.cos(k * u + l * v) * 0.08;
      }
      
      // Natural transformation components connect F and G
      const componentHeight = functorLayer * m;
      
      // Natural transformation "arrows" between functors
      const transformationFlow = n * v * (1 - v) * 4; // Parabolic flow between layers
      
      z = componentHeight + transformationFlow + o * Math.sin(p * u + q * v) * 0.06;
      
      return [x, y, z];
    },
    defaultParams: {
      a: 2, b: 1, c: 1, d: 1, e: 1, f: 0.5, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 2, n: 1, o: 0.06, p: 1, q: 1,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 32, vSegments: 32
    }
  },

  // Adjoint Functors - Left/right adjoint relationship structures
  adjoint_functors: {
    name: "⚖️ Adjoint Functors - Category Theory",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 0.5;
      const c = params.c ?? 1;
      const d = params.d ?? 1;
      const e = params.e ?? 1;
      const f = params.f ?? 1;
      const g = params.g ?? 1;
      const h = params.h ?? 3;
      const i = params.i ?? 1;
      const j = params.j ?? 0.5;
      const k = params.k ?? 1;
      const l = params.l ?? 1;
      const m = params.m ?? 0.1;
      const n = params.n ?? 1;
      const o = params.o ?? 1;
      const p = params.p ?? 1;
      const q = params.q ?? 2;
      const r = params.r ?? 2;
      const s = params.s ?? 1;
      const t = params.t ?? 0.1;
      
      // Left adjoint F ⊣ Right adjoint G
      const adjointSide = Math.floor(u * 2); // Left or right adjoint
      const unitCounit = Math.floor(v * 2); // Unit or counit
      
      let x = 0, y = 0, z = 0;
      
      if (adjointSide === 0) {
        // Left adjoint F: C → D
        const categoryC = [
          [-a, 0], [0, 0], [a, 0]  // Objects in category C
        ];
        
        const objIndex = Math.floor((u * 2 - adjointSide) * 3) % 3;
        const pos = categoryC[objIndex];
        
        // Unit transformation: Id_C → GF
        const unitTransform = unitCounit * b * Math.sin(c * u + d * v);
        
        x = pos[0] + unitTransform + e * Math.sin(f * u + g * v) * 0.1;
        y = pos[1] + unitTransform + f * Math.cos(e * u + g * v) * 0.1;
      } else {
        // Right adjoint G: D → C
        const categoryD = [
          [-a + h, i], [h, i], [a + h, i]  // Objects in category D
        ];
        
        const objIndex = Math.floor((u * 2 - adjointSide) * 3) % 3;
        const pos = categoryD[objIndex];
        
        // Counit transformation: FG → Id_D
        const counitTransform = (1 - unitCounit) * j * Math.cos(k * u + l * v);
        
        x = pos[0] + counitTransform + m * Math.sin(n * u + o * v) * 0.08;
        y = pos[1] + counitTransform + n * Math.cos(m * u + o * v) * 0.08;
      }
      
      // Adjunction creates "spiral" connection between left and right adjoints
      const adjunctionSpiral = p * u * Math.sin(q * v * 2 * Math.PI);
      
      // Height based on which adjoint and which transformation
      const baseHeight = adjointSide * r + unitCounit * s * 0.5;
      
      z = baseHeight + adjunctionSpiral + t * Math.sin(u * v * Math.PI) * 0.1;
      
      return [x, y, z];
    },
    defaultParams: {
      a: 2, b: 0.5, c: 1, d: 1, e: 1, f: 1, g: 1, h: 3, i: 1, j: 0.5, k: 1, l: 1, m: 0.1, n: 1, o: 1, p: 1, q: 2, r: 2, s: 1, t: 0.1,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 36, vSegments: 36
    }
  }
};

/**
 * Get category theory information for display
 */
export function getCategoryTheoryInfo(type: string): {
  name: string;
  description: string;
  concept: string;
  applications: string;
  structure: string;
} {
  const info = {
    functor_mapping: {
      name: "Functor Mapping",
      description: "Structure-preserving mapping between categories that preserves morphism composition",
      concept: "F: C → D preserves identity morphisms and composition",
      applications: "Abstract algebra, topology, computer science type theory",
      structure: "Objects mapped to objects, morphisms to morphisms"
    },
    natural_transformation: {
      name: "Natural Transformation",
      description: "Systematic way of transforming one functor into another while preserving categorical structure",
      concept: "Component-wise transformation between parallel functors F, G: C → D",
      applications: "Homological algebra, algebraic topology, programming language semantics",
      structure: "Natural components form commutative squares"
    },
    adjoint_functors: {
      name: "Adjoint Functors",
      description: "Pair of functors F ⊣ G where F is left adjoint to G, expressing optimal approximation",
      concept: "Hom(F(A), B) ≅ Hom(A, G(B)) naturally in A and B",
      applications: "Algebraic geometry, logic, optimization theory",
      structure: "Unit-counit adjunction with triangle identities"
    }
  };

  return (info as any)[type] || {
    name: "Unknown Category Theory Structure",
    description: "Abstract categorical construction",
    concept: "Category theory concept",
    applications: "Mathematical foundations",
    structure: "Categorical structure"
  };
}
