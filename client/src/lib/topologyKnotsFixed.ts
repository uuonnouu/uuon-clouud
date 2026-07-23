/**
 * Topology & Knot Theory Visualizations
 * Advanced topological structures and knot invariants
 */

import { SurfaceEquation } from './parametricSurfaces';

export const TOPOLOGY_KNOTS: Record<string, SurfaceEquation> = {
  // Klein Bottle - Non-orientable surface with self-intersection
  klein_bottle: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, timeParam, uParam, vParam, w) => {
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      // Klein bottle parametrization (figure-8 immersion)
      const R = a * (2 + Math.cos(theta / 2) * Math.sin(phi) - Math.sin(theta / 2) * Math.sin(2 * phi));
      return R * Math.cos(theta) + b * Math.sin(c * u + d * v) * 0.05;
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, timeParam, uParam, vParam, w) => {
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const R = a * (2 + Math.cos(theta / 2) * Math.sin(phi) - Math.sin(theta / 2) * Math.sin(2 * phi));
      return R * Math.sin(theta) + e * Math.cos(f * u + g * v) * 0.05;
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, timeParam, uParam, vParam, w) => {
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      return h * (Math.sin(theta / 2) * Math.sin(phi) + Math.cos(theta / 2) * Math.sin(2 * phi)) + 
             i * Math.sin(j * u + k * v) * 0.04;
    }
  },

  // Trefoil Knot - Simplest non-trivial knot (3_1 knot)
  trefoil_knot: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, timeParam, uParam, vParam, w) => {
      const knot_t = u * 2 * Math.PI;
      const tube_angle = v * 2 * Math.PI;
      
      // Trefoil knot parametric curve
      const trefoil_x = a * Math.sin(knot_t) + b * Math.sin(3 * knot_t);
      const tube_radius = c + d * Math.cos(tube_angle);
      
      // Tube normal (simplified)
      const normal_x = Math.cos(tube_angle) * e;
      
      return trefoil_x + tube_radius * normal_x + f * Math.sin(g * u + h * v) * 0.05;
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, timeParam, uParam, vParam, w) => {
      const knot_t = u * 2 * Math.PI;
      const tube_angle = v * 2 * Math.PI;
      
      const trefoil_y = a * Math.cos(knot_t) - b * Math.cos(3 * knot_t);
      const tube_radius = c + d * Math.cos(tube_angle);
      const normal_y = Math.sin(tube_angle) * e;
      
      return trefoil_y + tube_radius * normal_y + i * Math.cos(j * u + k * v) * 0.05;
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, timeParam, uParam, vParam, w) => {
      const knot_t = u * 2 * Math.PI;
      const tube_angle = v * 2 * Math.PI;
      
      const trefoil_z = l * Math.sin(3 * knot_t);
      const tube_radius = c + d * Math.cos(tube_angle);
      const binormal_z = m;
      
      return trefoil_z + tube_radius * binormal_z * Math.cos(tube_angle) + 
             n * Math.sin(o * u + p * v) * 0.04;
    }
  },

  // Figure-8 Knot - Another fundamental knot with crossing number 4
  figure8_knot: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, timeParam, uParam, vParam, w) => {
      const knot_t = u * 2 * Math.PI;
      const tube_angle = v * 2 * Math.PI;
      
      // Figure-8 knot: more complex than trefoil
      const figure8_x = a * ((2 + Math.cos(2 * knot_t)) * Math.cos(3 * knot_t));
      const tube_radius = b + c * Math.cos(tube_angle);
      
      // Tube normal (simplified approximation)
      const normal_x = Math.cos(tube_angle) * d;
      
      return figure8_x + tube_radius * normal_x + e * Math.sin(f * u + g * v) * 0.04;
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, timeParam, uParam, vParam, w) => {
      const knot_t = u * 2 * Math.PI;
      const tube_angle = v * 2 * Math.PI;
      
      const figure8_y = a * ((2 + Math.cos(2 * knot_t)) * Math.sin(3 * knot_t));
      const tube_radius = b + c * Math.cos(tube_angle);
      const normal_y = Math.sin(tube_angle) * d;
      
      return figure8_y + tube_radius * normal_y + h * Math.cos(i * u + j * v) * 0.04;
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, timeParam, uParam, vParam, w) => {
      const knot_t = u * 2 * Math.PI;
      const tube_angle = v * 2 * Math.PI;
      
      const figure8_z = k * Math.sin(4 * knot_t);
      const tube_radius = b + c * Math.cos(tube_angle);
      const binormal_z = l;
      
      return figure8_z + tube_radius * binormal_z * Math.cos(tube_angle) + 
             m * Math.sin(n * u + o * v) * 0.03;
    }
  },

  // Genus-2 Surface - Double torus with two handles
  genus2_surface: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, timeParam, uParam, vParam, w) => {
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      // Double torus surface (simplified representation)
      const R1 = a + b * Math.cos(phi);
      const R2 = a + b * Math.cos(phi + Math.PI);
      
      // Two torus components
      const x1 = (R1 + c) * Math.cos(theta);
      const x2 = (R2 - c) * Math.cos(theta + Math.PI);
      
      return d * (x1 + x2) / 2 + e * Math.sin(f * u + g * v) * 0.1;
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, timeParam, uParam, vParam, w) => {
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const R1 = a + b * Math.cos(phi);
      const R2 = a + b * Math.cos(phi + Math.PI);
      
      const y1 = (R1 + c) * Math.sin(theta);
      const y2 = (R2 - c) * Math.sin(theta + Math.PI);
      
      return d * (y1 + y2) / 2 + h * Math.cos(i * u + j * v) * 0.1;
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, timeParam, uParam, vParam, w) => {
      const phi = v * 2 * Math.PI;
      
      // Combined height from both torus components
      const z1 = b * Math.sin(phi);
      const z2 = b * Math.sin(phi + Math.PI);
      
      return k * (z1 + z2) / 2 + l * Math.sin(m * u + n * v) * 0.08;
    }
  },

  // Genus-3 Surface - Triple torus with three handles
  genus3_surface: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, timeParam, uParam, vParam, w) => {
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      // Triple torus surface (simplified representation)
      const R1 = a + b * Math.cos(phi);
      const R2 = a + b * Math.cos(phi + 2 * Math.PI / 3);
      const R3 = a + b * Math.cos(phi + 4 * Math.PI / 3);
      
      // Three torus components arranged symmetrically
      const x1 = (R1 + c) * Math.cos(theta);
      const x2 = (R2 + c) * Math.cos(theta + 2 * Math.PI / 3);
      const x3 = (R3 + c) * Math.cos(theta + 4 * Math.PI / 3);
      
      return d * (x1 + x2 + x3) / 3 + e * Math.sin(f * u + g * v) * 0.12;
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, timeParam, uParam, vParam, w) => {
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const R1 = a + b * Math.cos(phi);
      const R2 = a + b * Math.cos(phi + 2 * Math.PI / 3);
      const R3 = a + b * Math.cos(phi + 4 * Math.PI / 3);
      
      const y1 = (R1 + c) * Math.sin(theta);
      const y2 = (R2 + c) * Math.sin(theta + 2 * Math.PI / 3);
      const y3 = (R3 + c) * Math.sin(theta + 4 * Math.PI / 3);
      
      return d * (y1 + y2 + y3) / 3 + h * Math.cos(i * u + j * v) * 0.12;
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, timeParam, uParam, vParam, w) => {
      const phi = v * 2 * Math.PI;
      
      // Combined height from all three torus components
      const z1 = b * Math.sin(phi);
      const z2 = b * Math.sin(phi + 2 * Math.PI / 3);
      const z3 = b * Math.sin(phi + 4 * Math.PI / 3);
      
      return k * (z1 + z2 + z3) / 3 + l * Math.sin(m * u + n * v) * 0.1;
    }
  },

  // Fiber Bundle - Base space with twisted fiber structure
  fiber_bundle: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, timeParam, uParam, vParam, w) => {
      const base_u = u * Math.PI;
      const fiber_v = v * 2 * Math.PI;
      
      // Base space coordinates (sphere-like)
      const base_x = a * Math.sin(base_u) * Math.cos(base_u);
      
      // Fiber coordinates with twist
      const twist_angle = b * base_u;
      const fiber_x = c * Math.cos(fiber_v + twist_angle);
      
      return base_x + fiber_x + d * Math.sin(e * u + f * v) * 0.1;
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, timeParam, uParam, vParam, w) => {
      const base_u = u * Math.PI;
      const fiber_v = v * 2 * Math.PI;
      
      const base_y = a * Math.sin(base_u) * Math.sin(base_u);
      
      const twist_angle = b * base_u;
      const fiber_y = c * Math.sin(fiber_v + twist_angle);
      
      return base_y + fiber_y + g * Math.cos(h * u + i * v) * 0.1;
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, timeParam, uParam, vParam, w) => {
      const base_u = u * Math.PI;
      
      // Base space height
      const base_z = j * Math.cos(base_u);
      
      // Fiber contribution to height
      const fiber_z = k * Math.sin(l * u + m * v);
      
      return base_z + fiber_z + n * Math.sin(o * u + p * v) * 0.08;
    }
  },

  // Homotopy Deformation - Continuous transformations between topological spaces
  homotopy_deformation: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, timeParam, uParam, vParam, w) => {
      const space_u = u * 2 * Math.PI;
      const space_v = v * 2 * Math.PI;
      
      // Deformation parameter (could be time-based)
      const deform_t = timeParam || 0.5;
      
      // Initial shape (sphere-like)
      const shape1_x = a * Math.sin(space_u) * Math.cos(space_v);
      
      // Target shape (torus-like)
      const R = b + c * Math.cos(space_v);
      const shape2_x = R * Math.cos(space_u);
      
      // Homotopy interpolation
      return (1 - deform_t) * shape1_x + deform_t * shape2_x + 
             d * Math.sin(e * u + f * v) * 0.1;
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, timeParam, uParam, vParam, w) => {
      const space_u = u * 2 * Math.PI;
      const space_v = v * 2 * Math.PI;
      
      const deform_t = timeParam || 0.5;
      
      const shape1_y = a * Math.sin(space_u) * Math.sin(space_v);
      
      const R = b + c * Math.cos(space_v);
      const shape2_y = R * Math.sin(space_u);
      
      return (1 - deform_t) * shape1_y + deform_t * shape2_y + 
             g * Math.cos(h * u + i * v) * 0.1;
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, timeParam, uParam, vParam, w) => {
      const space_v = v * 2 * Math.PI;
      
      const deform_t = timeParam || 0.5;
      
      const shape1_z = a * Math.cos(space_v);
      const shape2_z = j * Math.sin(space_v);
      
      return (1 - deform_t) * shape1_z + deform_t * shape2_z + 
             k * Math.sin(l * u + m * v) * 0.08;
    }
  }
};

/**
 * Get topology and knot theory information for display
 */
export function getTopologyKnotInfo(type: string): {
  name: string;
  type: string;
  vertices: number;
  geometry: string;
  mathematical_basis: string;
  parameters: string[];
} {
  const topologyInfo: Record<string, any> = {
    klein_bottle: {
      name: "Klein Bottle",
      type: "Non-orientable Surface",
      vertices: "Self-intersecting",
      geometry: "4D embedding in 3D with figure-8 immersion",
      mathematical_basis: "Topology: non-orientable surface with χ = 0",
      parameters: ["a: Klein radius", "b,e: Perturbation", "h: Z-scale", "c,d,f,g,i,j,k: Harmonics"]
    },
    trefoil_knot: {
      name: "Trefoil Knot",
      type: "Prime Knot",
      vertices: "Continuous curve",
      geometry: "3D knot with 3-fold rotational symmetry",
      mathematical_basis: "Knot theory: 3₁ knot, crossing number = 3",
      parameters: ["a,b: Knot amplitude", "c,d: Tube radius", "e: Normal scale", "f,g,h,i,j,k,l,m,n,o,p: Tube harmonics"]
    },
    figure8_knot: {
      name: "Figure-8 Knot",
      type: "Hyperbolic Knot",
      vertices: "Continuous curve",
      geometry: "3D knot with hyperbolic structure",
      mathematical_basis: "Knot theory: 4₁ knot, crossing number = 4",
      parameters: ["a: Knot scale", "b,c: Tube parameters", "d: Normal", "e,f,g,h,i,j,k,l,m,n,o: Harmonics"]
    },
    genus2_surface: {
      name: "Genus-2 Surface",
      type: "Closed Surface",
      vertices: "Double torus",
      geometry: "Orientable surface with 2 handles",
      mathematical_basis: "Topology: χ = 2 - 2g = -2, genus g = 2",
      parameters: ["a,b: Torus radii", "c: Handle separation", "d: Scale", "e,f,g,h,i,j,k,l,m,n: Surface harmonics"]
    },
    genus3_surface: {
      name: "Genus-3 Surface",
      type: "Closed Surface",
      vertices: "Triple torus",
      geometry: "Orientable surface with 3 handles",
      mathematical_basis: "Topology: χ = 2 - 2g = -4, genus g = 3",
      parameters: ["a,b: Torus radii", "c: Handle spacing", "d: Scale", "e,f,g,h,i,j,k,l,m,n: Surface harmonics"]
    },
    fiber_bundle: {
      name: "Fiber Bundle",
      type: "Bundle Structure",
      vertices: "Base × Fiber",
      geometry: "Total space with projection map π: E → B",
      mathematical_basis: "Bundle theory: twisted product structure",
      parameters: ["a: Base scale", "b: Twist parameter", "c: Fiber radius", "d,e,f,g,h,i,j,k,l,m,n,o,p: Bundle harmonics"]
    },
    homotopy_deformation: {
      name: "Homotopy Deformation",
      type: "Continuous Map",
      vertices: "Variable",
      geometry: "Continuous family of maps F: X × I → Y",
      mathematical_basis: "Homotopy theory: path between topological spaces",
      parameters: ["a: Initial shape", "b,c: Target parameters", "d,e,f,g,h,i,j,k,l,m: Deformation harmonics"]
    }
  };

  return topologyInfo[type] || {
    name: "Unknown Topology",
    type: "Undefined",
    vertices: 0,
    geometry: "Not defined",
    mathematical_basis: "Unknown",
    parameters: []
  };
}