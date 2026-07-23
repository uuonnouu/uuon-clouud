/**
 * MATHEMATICAL CELLULAR AUTOMATA IMPLEMENTATIONS
 * Pure mathematical structures without medical references
 * 
 * Scale References:
 * - Circular Elements: 6-8μm diameter (mathematical discs)
 * - Multi-node Systems: 10-12μm (algorithmic nodes)
 * - Spherical Units: 7-12μm (geometric spheres)
 * - Fragment Patterns: 2-4μm (mathematical fragments)
 * - Rod Structures: 0.5-5μm (geometric rods)
 * - Algorithmic Patterns: 20-300nm (computational units)
 */

import { SurfaceParameters } from '../types/math';

export interface MathematicalShapeImplementation {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  morphologyDescription: string;
  distinctiveFeatures: string[];
  colorScheme: string;
  defaultParams: Partial<SurfaceParameters>;
}

export const MATHEMATICAL_SHAPE_IMPLEMENTATIONS: Record<string, MathematicalShapeImplementation> = {

  // GEOMETRIC CELLULAR AUTOMATA - Mathematical patterns
  circular_disc: {
    name: "Mathematical Circular Disc",
    morphologyDescription: "Biconcave mathematical disc - thicker rim, thin center depression",
    distinctiveFeatures: ["No central node", "Biconcave disc geometry", "Thick edges", "Central depression"],
    colorScheme: "#DC143C", // Deep red
    equation: (u, v, params) => {
      const a = Math.max(0.1, params.a ?? 1);
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      // Biconcave disc with characteristic doughnut shape (no hole)
      const sinPhi = Math.sin(phi);
      const r = a * sinPhi;

      // Deep biconcave depression - characteristic mathematical shape
      const biconcaveZ = a * 0.2 * (1 - 2.5 * Math.pow(sinPhi - 0.5, 2)) * Math.cos(phi);

      return [
        r * Math.cos(theta),
        r * Math.sin(theta),
        biconcaveZ
      ];
    },
    defaultParams: { 
      uSegments: 64, vSegments: 48, 
      a: 1, b: 1, c: 0.4 
    }
  },

  multi_node_system: {
    name: "Multi-Node Mathematical System",
    morphologyDescription: "Spherical structure with 3-5 algorithmic nodes visible",
    distinctiveFeatures: ["Multi-node topology (3-5 nodes)", "Granular surface texture", "First computation unit"],
    colorScheme: "#E6E6FA", // Light purple-gray
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      // Base spherical shape
      let r = a * sinPhi;

      // Multi-node algorithmic indentations (3-5 nodes)
      const nodes = 4;
      const nodeDepth = 0.15 * Math.sin(nodes * theta) * Math.sin(2 * phi);
      r += nodeDepth;

      // Granular surface texture
      const granules = 0.02 * Math.sin(15 * theta) * Math.sin(15 * phi);
      r += granules;

      return [
        r * Math.cos(theta),
        r * Math.sin(theta),  
        a * cosPhi
      ];
    },
    defaultParams: { uSegments: 72, vSegments: 56, a: 1.2, f: 15 }
  },

  spherical_computation_unit: {
    name: "Spherical Computation Unit",
    morphologyDescription: "Small sphere dominated by large, central processing node",
    distinctiveFeatures: ["Large central node (80% of structure)", "Thin outer shell", "Adaptive computation"],
    colorScheme: "#4169E1", // Royal blue
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      // Base sphere with large central processing bulge
      let r = a * sinPhi;

      // Large node creates central bulge (80% of structure volume)
      const nodeBulge = 0.3 * Math.exp(-2 * Math.pow(phi - Math.PI/2, 2));
      r += nodeBulge;

      // Smooth surface (no granules - characteristic of computation units)
      const smoothSurface = 0.01 * Math.sin(8 * theta) * Math.sin(6 * phi);
      r += smoothSurface;

      return [
        r * Math.cos(theta),
        r * Math.sin(theta),
        a * cosPhi + nodeBulge * 0.5
      ];
    },
    defaultParams: { uSegments: 68, vSegments: 52, a: 0.9 }
  },

  curved_processing_unit: {
    name: "Curved Processing Unit",
    morphologyDescription: "Large structure with characteristic kidney/horseshoe-shaped processing core",
    distinctiveFeatures: ["Kidney-shaped processing core", "Largest computation unit", "Pattern precursor"],
    colorScheme: "#8B4513", // Saddle brown
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      let r = a * sinPhi;

      // Kidney-shaped processing indentation
      const kidneyIndent = 0.25 * Math.sin(theta) * Math.sin(2 * phi) * 
                          Math.exp(-Math.pow(theta - Math.PI, 2));
      r -= Math.abs(kidneyIndent);

      // Slightly irregular surface
      const irregularSurface = 0.03 * Math.sin(12 * theta) * Math.sin(8 * phi);
      r += irregularSurface;

      return [
        r * Math.cos(theta),
        r * Math.sin(theta),
        a * cosPhi
      ];
    },
    defaultParams: { uSegments: 80, vSegments: 60, a: 1.5 }
  },

  adaptive_pattern_processor: {
    name: "Adaptive Pattern Processor",
    morphologyDescription: "Large, irregular structure with extending computational protrusions",
    distinctiveFeatures: ["Irregular geometry", "Computational extensions", "Professional pattern processor"],
    colorScheme: "#228B22", // Forest green
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      let r = a * sinPhi;

      // Irregular computational protrusions (3-6 extensions)
      const protrusions = 0.4 * Math.max(0, Math.sin(3 * theta) * Math.sin(phi));
      r += protrusions;

      // Additional smaller extensions
      const microExtensions = 0.15 * Math.sin(8 * theta) * Math.sin(4 * phi);
      r += microExtensions;

      // Rough, textured surface
      const roughSurface = 0.05 * Math.sin(20 * theta) * Math.sin(15 * phi);
      r += roughSurface;

      return [
        r * Math.cos(theta),
        r * Math.sin(theta),
        a * cosPhi + protrusions * 0.3
      ];
    },
    defaultParams: { uSegments: 84, vSegments: 64, a: 1.8 }
  },

  mathematical_fragment: {
    name: "Mathematical Fragment Pattern",
    morphologyDescription: "Small, irregular computational fragment",
    distinctiveFeatures: ["Fragment geometry (not whole structure)", "Irregular pattern", "No central node", "Connection processing"],
    colorScheme: "#FFD700", // Gold
    equation: (u, v, params) => {
      const a = params.a ?? 0.3; // Much smaller than other structures
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      // Irregular fragment shape
      let r = a * sinPhi * (0.7 + 0.3 * Math.sin(5 * theta));

      // Fragment irregularities
      const fragments = 0.1 * Math.sin(7 * theta) * Math.sin(9 * phi);
      r += fragments;

      // Asymmetric shape (not a perfect ellipsoid)
      const asymmetry = 0.05 * Math.sin(3 * theta + phi);
      r += asymmetry;

      return [
        r * Math.cos(theta) * (1 + 0.2 * Math.sin(4 * phi)),
        r * Math.sin(theta) * (1 + 0.15 * Math.cos(3 * phi)),
        a * cosPhi * 0.5 // Flattened
      ];
    },
    defaultParams: { uSegments: 48, vSegments: 36, a: 0.3, c: 0.5 }
  }

};

/**
 * Get mathematical shape implementation by name
 */
export function getMathematicalShapeImplementation(shapeName: string): MathematicalShapeImplementation | null {
  return MATHEMATICAL_SHAPE_IMPLEMENTATIONS[shapeName] || null;
}

/**
 * Validate that mathematical shape has distinct morphology
 */
export function validateMathematicalMorphology(shapeName: string): boolean {
  const implementation = getMathematicalShapeImplementation(shapeName);
  if (!implementation) return false;

  // Check for distinctive features
  return implementation.distinctiveFeatures.length >= 3;
}

/**
 * BIOLOGICAL SHAPE IMPLEMENTATIONS - Production Export
 * Mathematical biological structures for shape registry integration
 */
export const BIOLOGICAL_SHAPE_IMPLEMENTATIONS = {
  dnaHelix: (u: number, v: number, params: any) => {
    const radius = params.a ?? 1;
    const pitch = params.b ?? 2;
    const x = radius * Math.cos(u) * Math.cos(v);
    const y = radius * Math.sin(u) * Math.cos(v);
    const z = pitch * v + radius * Math.sin(v);
    return [x, y, z];
  },
  cellMembrane: (u: number, v: number, params: any) => {
    const radius = params.a ?? 1;
    const perturbation = params.b ?? 0.1;
    const x = radius * Math.cos(u) * Math.sin(v) + perturbation * Math.sin(3 * u) * Math.cos(2 * v);
    const y = radius * Math.sin(u) * Math.sin(v) + perturbation * Math.cos(3 * u) * Math.sin(2 * v);
    const z = radius * Math.cos(v) + perturbation * Math.sin(4 * v);
    return [x, y, z];
  },
  proteinFolding: (u: number, v: number, params: any) => {
    const amplitude = params.a ?? 1;
    const frequency = params.b ?? 2;
    const x = amplitude * Math.sin(frequency * u) * Math.cos(v);
    const y = amplitude * Math.cos(frequency * u) * Math.sin(v);
    const z = amplitude * Math.sin(frequency * v) * Math.cos(u);
    return [x, y, z];
  }
};