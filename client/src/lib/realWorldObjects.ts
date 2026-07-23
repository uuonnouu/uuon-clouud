/**
 * Real-World Objects and Recognizable Shapes
 * Natural forms, letters, numbers, and everyday objects
 */

import { SurfaceEquation } from './parametricSurfaces';

export const REAL_WORLD_OBJECTS: Record<string, SurfaceEquation> = {
  // Sun - Radial sphere with solar flares
  sun: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // Base sphere with solar flares
      const radius = a + b * Math.sin(8 * theta + c * phi) * Math.sin(6 * phi + d * theta) * 0.3;
      const flare_intensity = e * Math.sin(f * theta) * Math.sin(g * phi) * 0.5;
      
      return (radius + flare_intensity) * Math.sin(phi) * Math.cos(theta);
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const radius = a + b * Math.sin(8 * theta + c * phi) * Math.sin(6 * phi + d * theta) * 0.3;
      const flare_intensity = e * Math.sin(f * theta) * Math.sin(g * phi) * 0.5;
      
      return (radius + flare_intensity) * Math.sin(phi) * Math.sin(theta);
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const radius = a + b * Math.sin(8 * theta + c * phi) * Math.sin(6 * phi + d * theta) * 0.3;
      const corona_height = h * Math.sin(i * theta + j * phi) * 0.4;
      
      return (radius + corona_height) * Math.cos(phi);
    }
  },

  // Sunflower - Fibonacci spiral pattern with petals
  sunflower: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const spiral_angle = u * 2 * Math.PI * 8; // Multiple spirals
      const radius_from_center = v * a;
      
      // Fibonacci spiral pattern (golden angle ≈ 137.5°)
      const golden_angle = 2.39996323; // 137.5° in radians
      const petal_angle = spiral_angle + radius_from_center * golden_angle;
      
      // Petal shape modulation
      const petal_width = b * (1 + c * Math.sin(d * petal_angle)) * Math.exp(-radius_from_center / e);
      
      return radius_from_center * Math.cos(petal_angle) + petal_width * Math.cos(petal_angle + Math.PI/2);
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const spiral_angle = u * 2 * Math.PI * 8;
      const radius_from_center = v * a;
      
      const golden_angle = 2.39996323;
      const petal_angle = spiral_angle + radius_from_center * golden_angle;
      
      const petal_width = b * (1 + c * Math.sin(d * petal_angle)) * Math.exp(-radius_from_center / e);
      
      return radius_from_center * Math.sin(petal_angle) + petal_width * Math.sin(petal_angle + Math.PI/2);
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const radius_from_center = v * a;
      const spiral_angle = u * 2 * Math.PI * 8;
      
      // Center disk height
      const center_height = f * Math.exp(-radius_from_center / g);
      
      // Petal curvature
      const petal_curve = h * Math.sin(i * spiral_angle) * Math.exp(-radius_from_center / j);
      
      return center_height + petal_curve;
    }
  },

  // Letter A - 3D extruded typography
  letter_A: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const profile_u = u * 2 - 1; // -1 to 1
      const depth_v = (v - 0.5) * c; // Extrusion depth
      
      // Letter A profile using mathematical curves
      let profile_x = 0;
      
      if (profile_u < -0.6) {
        // Left leg of A
        profile_x = a * (-0.6 + (profile_u + 0.6) * 0.8);
      } else if (profile_u > 0.6) {
        // Right leg of A
        profile_x = a * (0.6 + (profile_u - 0.6) * 0.8);
      } else {
        // Middle crossbar region
        const crossbar_height = 0.3;
        if (Math.abs(profile_u) < 0.4 && Math.abs(profile_u) > 0.1) {
          profile_x = a * profile_u * 0.7; // Crossbar
        } else {
          profile_x = a * profile_u * 0.9; // Main body
        }
      }
      
      return profile_x + d * Math.sin(e * u) * 0.02;
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const profile_u = u * 2 - 1;
      const depth_v = (v - 0.5) * c;
      
      // Letter A height profile
      let profile_y = 0;
      
      if (Math.abs(profile_u) > 0.8) {
        // Base of legs
        profile_y = -b * 0.8;
      } else if (Math.abs(profile_u) > 0.1 && Math.abs(profile_u) < 0.4) {
        // Crossbar area
        profile_y = -b * 0.2;
      } else {
        // Peak area
        profile_y = b * (0.8 - Math.abs(profile_u) * 2);
      }
      
      return profile_y + f * Math.sin(g * u) * 0.02;
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const depth_v = (v - 0.5) * c;
      
      // Beveled edges
      const bevel = h * Math.min(v, 1 - v) * 0.1;
      
      return depth_v + bevel + i * Math.sin(j * u + k * v) * 0.01;
    }
  },

  // Number 3 - Curved numeral with mathematical precision
  number_3: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const profile_u = u * 2 - 1; // -1 to 1 vertical
      const depth_v = (v - 0.5) * c;
      
      // Number 3 profile - two curves
      const upper_curve = profile_u > 0;
      const curve_center_y = upper_curve ? 0.5 : -0.5;
      const curve_radius = 0.4;
      
      // Distance from curve center
      const dist_from_center = Math.abs(profile_u - curve_center_y);
      
      let profile_x = 0;
      if (dist_from_center < curve_radius) {
        // On the curve
        const curve_x = Math.sqrt(curve_radius * curve_radius - dist_from_center * dist_from_center);
        profile_x = a * curve_x;
      } else {
        // Straight sections
        profile_x = a * 0.3;
      }
      
      return profile_x + d * Math.sin(e * u) * 0.02;
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const profile_u = u * 2 - 1;
      
      // Vertical position for number 3
      return b * profile_u + f * Math.sin(g * u) * 0.02;
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const depth_v = (v - 0.5) * c;
      
      // Rounded edges
      const edge_round = h * Math.min(v, 1 - v) * 0.15;
      
      return depth_v + edge_round + i * Math.sin(j * u + k * v) * 0.01;
    }
  },

  // Apple - Natural fruit shape
  apple: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // Apple-like ellipsoid with indent at top
      const radius = a * (1 - b * Math.pow(Math.cos(phi), 4)) * (1 + c * Math.sin(phi));
      const apple_indent = d * Math.exp(-Math.pow((phi - 0.2) / e, 2)) * Math.cos(2 * theta);
      
      return (radius - apple_indent) * Math.sin(phi) * Math.cos(theta);
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const radius = a * (1 - b * Math.pow(Math.cos(phi), 4)) * (1 + c * Math.sin(phi));
      const apple_indent = d * Math.exp(-Math.pow((phi - 0.2) / e, 2)) * Math.cos(2 * theta);
      
      return (radius - apple_indent) * Math.sin(phi) * Math.sin(theta);
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const phi = v * Math.PI;
      
      // Apple height with stem area
      const radius = a * (1 - b * Math.pow(Math.cos(phi), 4)) * (1 + c * Math.sin(phi));
      const stem_bump = f * Math.exp(-Math.pow((phi - 0.1) / g, 2));
      
      return (radius + stem_bump) * Math.cos(phi);
    }
  },

  // Star shape - 5-pointed star
  star_3d: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const angle = u * 2 * Math.PI;
      const depth_v = (v - 0.5) * c;
      
      // 5-pointed star shape
      const star_points = 5;
      const inner_radius = a * 0.4;
      const outer_radius = a;
      
      const sector_angle = (2 * Math.PI) / star_points;
      const local_angle = (angle % sector_angle) - sector_angle / 2;
      
      // Interpolate between inner and outer radius
      const radius_factor = Math.abs(local_angle) / (sector_angle / 2);
      const current_radius = outer_radius + (inner_radius - outer_radius) * radius_factor;
      
      return current_radius * Math.cos(angle) + d * Math.sin(e * angle) * 0.05;
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const angle = u * 2 * Math.PI;
      const depth_v = (v - 0.5) * c;
      
      const star_points = 5;
      const inner_radius = a * 0.4;
      const outer_radius = a;
      
      const sector_angle = (2 * Math.PI) / star_points;
      const local_angle = (angle % sector_angle) - sector_angle / 2;
      
      const radius_factor = Math.abs(local_angle) / (sector_angle / 2);
      const current_radius = outer_radius + (inner_radius - outer_radius) * radius_factor;
      
      return current_radius * Math.sin(angle) + f * Math.cos(g * angle) * 0.05;
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const depth_v = (v - 0.5) * c;
      const angle = u * 2 * Math.PI;
      
      // Star thickness with beveled edges
      const bevel = h * Math.min(v, 1 - v) * 0.2;
      const star_curve = i * Math.sin(j * angle * 5) * 0.1; // 5-point modulation
      
      return depth_v + bevel + star_curve;
    }
  }
};

/**
 * Get real-world object information for display
 */
export function getRealWorldObjectInfo(type: string): {
  name: string;
  type: string;
  vertices: number | string;
  geometry: string;
  mathematical_basis: string;
  parameters: string[];
} {
  const objectInfo: Record<string, any> = {
    sun: {
      name: "Sun",
      type: "Stellar Object",
      vertices: "Spherical with flares",
      geometry: "Radial sphere with solar corona and surface perturbations",
      mathematical_basis: "Spherical harmonics with stochastic surface modeling",
      parameters: ["a: Base radius", "b,c,d: Flare intensity", "e,f,g: Corona patterns", "h,i,j: Solar activity"]
    },
    sunflower: {
      name: "Sunflower",
      type: "Botanical Form",
      vertices: "Fibonacci spiral",
      geometry: "Golden angle spiral with petal distribution (φ ≈ 1.618)",
      mathematical_basis: "Fibonacci sequence: F(n) = F(n-1) + F(n-2), golden ratio spiral",
      parameters: ["a: Flower radius", "b,c,d,e: Petal characteristics", "f,g: Center disk", "h,i,j: Curvature"]
    },
    letter_A: {
      name: "Letter A",
      type: "Typography",
      vertices: "Extruded profile",
      geometry: "3D extruded letterform with beveled edges",
      mathematical_basis: "Parametric extrusion of 2D typographic outline",
      parameters: ["a: Width", "b: Height", "c: Depth", "d,e,f,g: Edge details", "h,i,j,k: Beveling"]
    },
    number_3: {
      name: "Number 3",
      type: "Numeral",
      vertices: "Curved profile",
      geometry: "3D extruded numeral with rounded curves",
      mathematical_basis: "Composite curve extrusion with circular arc segments",
      parameters: ["a: Width", "b: Height", "c: Depth", "d,e,f,g: Curve definition", "h,i,j,k: Rounding"]
    },
    apple: {
      name: "Apple",
      type: "Natural Form",
      vertices: "Organic surface",
      geometry: "Modified ellipsoid with characteristic apple indent and stem",
      mathematical_basis: "Deformed sphere with Gaussian perturbations for natural shape",
      parameters: ["a: Size", "b,c: Shape factors", "d,e: Stem indent", "f,g: Stem bump", "h,i,j: Surface detail"]
    },
    star_3d: {
      name: "3D Star",
      type: "Geometric Star",
      vertices: "5-pointed",
      geometry: "Regular pentagram with 3D extrusion and beveled edges",
      mathematical_basis: "Regular star polygon with alternating radii and depth extrusion",
      parameters: ["a: Outer radius", "b: Inner ratio", "c: Thickness", "d,e,f,g: Edge modulation", "h,i,j: Beveling"]
    }
  };

  return objectInfo[type] || {
    name: "Unknown Object",
    type: "Undefined",
    vertices: 0,
    geometry: "Not defined",
    mathematical_basis: "Unknown",
    parameters: []
  };
}