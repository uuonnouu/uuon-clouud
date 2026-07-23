// ============================================================================
// HISTORICAL DOCUMENTATION - DO NOT USE FOR NEW SHAPES
// ============================================================================
// This file is kept for historical reference only.
// ALL NEW SHAPES must be added to: client/src/lib/unifiedShapes.ts
// ============================================================================

// Non-Euclidean Geometry Implementation
import { SurfaceEquation } from "./parametricSurfaces";

// Non-Euclidean mathematical structures with proper geometric foundations
export const NON_EUCLIDEAN_SHAPES: Record<string, SurfaceEquation> = {
  
  // HYPERBOLIC GEOMETRY SECTION
  
  // Pseudosphere - Surface of constant negative curvature (K = -1)
  pseudosphere: {
    x: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
      // Pseudosphere parametric equations: tractrix surface of revolution
      const theta = u * Math.PI * 2 * d; // Azimuthal angle
      const t_param = v * Math.PI * 0.98 + 0.01; // Avoid singularity at t=0
      
      // Tractrix curve: x = sech(t), y = t - tanh(t)
      const sech_t = 1 / Math.cosh(t_param);
      const radius = a * sech_t * e;
      
      return radius * Math.cos(theta) * b * f;
    },
    y: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
      const theta = u * Math.PI * 2 * d;
      const t_param = v * Math.PI * 0.98 + 0.01;
      
      const sech_t = 1 / Math.cosh(t_param);
      const radius = a * sech_t * e;
      
      return radius * Math.sin(theta) * b * g;
    },
    z: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
      const t_param = v * Math.PI * 0.98 + 0.01;
      
      // Z-coordinate of tractrix: z = t - tanh(t)
      const z_tractrix = t_param - Math.tanh(t_param);
      return a * z_tractrix * c * h;
    }
  },

  // Hyperbolic Paraboloid (Saddle Surface) - Negative Gaussian curvature
  hyperbolic_paraboloid: {
    x: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
      const u_scaled = (u - 0.5) * a * d;
      return u_scaled * b * e;
    },
    y: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
      const v_scaled = (v - 0.5) * a * e;
      return v_scaled * b * f;
    },
    z: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
      const u_scaled = (u - 0.5) * a * d;
      const v_scaled = (v - 0.5) * a * e;
      
      // Hyperbolic paraboloid: z = x²/a² - y²/b²
      const x_term = Math.pow(u_scaled, 2) / (g * g);
      const y_term = Math.pow(v_scaled, 2) / (h * h);
      
      return (x_term - y_term) * c * i;
    }
  },

  // Hyperbolic Pentagon - Regular pentagon in hyperbolic space
  hyperbolic_pentagon: {
    x: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
      const angle = u * Math.PI * 2;
      const radius = v * a * e;
      
      // Hyperbolic distance scaling: sinh(r)/r for hyperbolic geometry
      const hyperbolic_radius = radius > 0.001 ? Math.sinh(radius * d) / (radius * d) * radius : radius;
      
      // Pentagon vertices in hyperbolic space
      const sides = 5;
      const vertex_angle = Math.floor(angle / (Math.PI * 2 / sides)) * (Math.PI * 2 / sides);
      const local_angle = angle - vertex_angle;
      
      // Hyperbolic interpolation between vertices
      const hyperbolic_interpolation = Math.tanh(local_angle * sides * f) * g;
      const final_angle = vertex_angle + hyperbolic_interpolation;
      
      return hyperbolic_radius * Math.cos(final_angle) * b * h;
    },
    y: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
      const angle = u * Math.PI * 2;
      const radius = v * a * e;
      
      const hyperbolic_radius = radius > 0.001 ? Math.sinh(radius * d) / (radius * d) * radius : radius;
      
      const sides = 5;
      const vertex_angle = Math.floor(angle / (Math.PI * 2 / sides)) * (Math.PI * 2 / sides);
      const local_angle = angle - vertex_angle;
      
      const hyperbolic_interpolation = Math.tanh(local_angle * sides * f) * g;
      const final_angle = vertex_angle + hyperbolic_interpolation;
      
      return hyperbolic_radius * Math.sin(final_angle) * b * i;
    },
    z: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
      const radius = v * a * e;
      
      // Hyperbolic curvature effect on Z-coordinate
      const hyperbolic_curvature = -Math.pow(radius * d, 2) / (2 * j * j); // Negative curvature
      return hyperbolic_curvature * c * k;
    }
  },

  // Hyperbolic Tiling Pattern - Poincaré disk model
  hyperbolic_tiling: {
    x: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
      const angle = u * Math.PI * 2;
      const radial_dist = v * 0.98; // Stay within unit disk
      
      // Poincaré disk model coordinates
      const poincare_radius = radial_dist * a * e;
      const x_poincare = poincare_radius * Math.cos(angle);
      const y_poincare = poincare_radius * Math.sin(angle);
      
      // Hyperbolic tiling pattern (7,3) heptagonal tiling
      const tiling_scale = d * 3;
      const pattern_x = Math.floor(x_poincare * tiling_scale) * f;
      const pattern_y = Math.floor(y_poincare * tiling_scale) * g;
      
      // Hyperbolic distance distortion
      const disk_factor = 1 / (1 - poincare_radius * poincare_radius);
      
      return (x_poincare + Math.sin(pattern_x + pattern_y) * 0.1 * h) * disk_factor * b * i;
    },
    y: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
      const angle = u * Math.PI * 2;
      const radial_dist = v * 0.98;
      
      const poincare_radius_y = radial_dist * a * e;
      const x_poincare_y = poincare_radius_y * Math.cos(angle);
      const y_poincare_y = poincare_radius_y * Math.sin(angle);
      
      const tiling_scale = d * 3;
      const pattern_x = Math.floor(x_poincare_y * tiling_scale) * f;
      const pattern_y = Math.floor(y_poincare_y * tiling_scale) * g;
      
      const disk_factor = 1 / (1 - poincare_radius_y * poincare_radius_y);
      
      return (y_poincare_y + Math.cos(pattern_x + pattern_y) * 0.1 * h) * disk_factor * b * j;
    },
    z: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, pParam = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const radial_dist = v * 0.98;
      const poincare_radius_z = radial_dist * a * e;
      
      // Embed tiling in 3D with hyperbolic curvature
      const hyperbolic_height = -Math.log(1 - poincare_radius_z * poincare_radius_z) * c * k;
      return hyperbolic_height;
    }
  },

  // SPHERICAL GEOMETRY SECTION
  
  // Spherical Triangle - Triangle on sphere surface with curved edges
  spherical_triangle: {
    x: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
      // Spherical triangle with vertices at specific spherical coordinates
      const phi = u * Math.PI * 2; // Longitude
      const theta_range = v * Math.PI * d; // Latitude range
      
      // Three vertices of spherical triangle
      const vertex1 = { phi: 0, theta: Math.PI / 6 * e };
      const vertex2 = { phi: Math.PI * 2/3 * f, theta: Math.PI / 6 * e };
      const vertex3 = { phi: Math.PI * 4/3 * g, theta: Math.PI / 2 * h };
      
      // Spherical interpolation (slerp) between vertices
      let current_vertex = vertex1;
      if (phi > Math.PI * 2/3 && phi <= Math.PI * 4/3) {
        current_vertex = vertex2;
      } else if (phi > Math.PI * 4/3) {
        current_vertex = vertex3;
      }
      
      const spherical_theta = current_vertex.theta + theta_range;
      const spherical_phi = current_vertex.phi + (phi % (Math.PI * 2/3)) * i;
      
      // Convert spherical to Cartesian coordinates
      const radius = a;
      return radius * Math.sin(spherical_theta) * Math.cos(spherical_phi) * b * j;
    },
    y: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
      const phi = u * Math.PI * 2;
      const theta_range = v * Math.PI * d;
      
      const vertex1 = { phi: 0, theta: Math.PI / 6 * e };
      const vertex2 = { phi: Math.PI * 2/3 * f, theta: Math.PI / 6 * e };
      const vertex3 = { phi: Math.PI * 4/3 * g, theta: Math.PI / 2 * h };
      
      let current_vertex = vertex1;
      if (phi > Math.PI * 2/3 && phi <= Math.PI * 4/3) {
        current_vertex = vertex2;
      } else if (phi > Math.PI * 4/3) {
        current_vertex = vertex3;
      }
      
      const spherical_theta = current_vertex.theta + theta_range;
      const spherical_phi = current_vertex.phi + (phi % (Math.PI * 2/3)) * i;
      
      const radius = a;
      return radius * Math.sin(spherical_theta) * Math.sin(spherical_phi) * b * k;
    },
    z: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
      const phi = u * Math.PI * 2;
      const theta_range = v * Math.PI * d;
      
      const vertex1 = { phi: 0, theta: Math.PI / 6 * e };
      const vertex2 = { phi: Math.PI * 2/3 * f, theta: Math.PI / 6 * e };
      const vertex3 = { phi: Math.PI * 4/3 * g, theta: Math.PI / 2 * h };
      
      let current_vertex = vertex1;
      if (phi > Math.PI * 2/3 && phi <= Math.PI * 4/3) {
        current_vertex = vertex2;
      } else if (phi > Math.PI * 4/3) {
        current_vertex = vertex3;
      }
      
      const spherical_theta = current_vertex.theta + theta_range;
      
      const radius = a;
      return radius * Math.cos(spherical_theta) * c * l;
    }
  },

  // Spherical Polygon - N-sided polygon on sphere surface
  spherical_polygon: {
    x: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
      const sides = Math.floor(d * 8) + 3; // 3-11 sided polygon
      const angle = u * Math.PI * 2;
      const radial_param = v;
      
      // Spherical polygon vertices distributed on sphere
      const vertex_angle = Math.floor(angle / (Math.PI * 2 / sides)) * (Math.PI * 2 / sides);
      const next_vertex_angle = vertex_angle + (Math.PI * 2 / sides);
      
      // Spherical linear interpolation along great circle
      const interpolation_param = (angle - vertex_angle) / (Math.PI * 2 / sides);
      const slerp_angle = vertex_angle + interpolation_param * (Math.PI * 2 / sides);
      
      // Vary latitude based on polygon structure
      const latitude = Math.PI / 4 + Math.sin(slerp_angle * sides) * Math.PI / 6 * e;
      const adjusted_latitude = latitude * (1 - radial_param * 0.5 * f);
      
      const radius = a;
      return radius * Math.sin(adjusted_latitude) * Math.cos(slerp_angle) * b * g;
    },
    y: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, pParam = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const sides = Math.floor(d * 8) + 3;
      const angle = u * Math.PI * 2;
      const radial_param = v;
      
      const vertex_angle = Math.floor(angle / (Math.PI * 2 / sides)) * (Math.PI * 2 / sides);
      const interpolation_param_y = (angle - vertex_angle) / (Math.PI * 2 / sides);
      const slerp_angle = vertex_angle + interpolation_param_y * (Math.PI * 2 / sides);
      
      const latitude = Math.PI / 4 + Math.sin(slerp_angle * sides) * Math.PI / 6 * e;
      const adjusted_latitude = latitude * (1 - radial_param * 0.5 * f);
      
      const radius = a;
      return radius * Math.sin(adjusted_latitude) * Math.sin(slerp_angle) * b * h;
    },
    z: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, pParam = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const sides = Math.floor(d * 8) + 3;
      const angle = u * Math.PI * 2;
      const radial_param = v;
      
      const vertex_angle = Math.floor(angle / (Math.PI * 2 / sides)) * (Math.PI * 2 / sides);
      const interpolation_param_z = (angle - vertex_angle) / (Math.PI * 2 / sides);
      const slerp_angle = vertex_angle + interpolation_param_z * (Math.PI * 2 / sides);
      
      const latitude = Math.PI / 4 + Math.sin(slerp_angle * sides) * Math.PI / 6 * e;
      const adjusted_latitude = latitude * (1 - radial_param * 0.5 * f);
      
      const radius = a;
      return radius * Math.cos(adjusted_latitude) * c * i;
    }
  },

  // MINKOWSKI SPACETIME GEOMETRY SECTION
  
  // Minkowski Hyperboloid - Spacetime geometric solid
  minkowski_hyperboloid: {
    x: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, pParam = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const theta = u * Math.PI * 2; // Spatial angle
      const tau = (v - 0.5) * d * e; // Proper time parameter
      
      // Minkowski metric: ds² = -c²dt² + dx² + dy² + dz²
      // Hyperboloid of one sheet in spacetime
      const time_component = tau;
      const spatial_radius = Math.sqrt(1 + tau * tau) * a * f; // Hyperbolic radius
      
      return spatial_radius * Math.cos(theta) * b * g;
    },
    y: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, pParam = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const theta = u * Math.PI * 2;
      const tau = (v - 0.5) * d * e;
      
      const spatial_radius = Math.sqrt(1 + tau * tau) * a * f;
      
      return spatial_radius * Math.sin(theta) * b * h;
    },
    z: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, pParam = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const tau = (v - 0.5) * d * e;
      
      // Time-like coordinate projected to Z
      return tau * a * c * i; // Represents time dimension
    }
  },

  // Light Cone Structure - Fundamental spacetime geometry
  light_cone: {
    x: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, pParam = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const angle = u * Math.PI * 2;
      const timeCoord = (v - 0.5) * a * d; // Time coordinate
      
      // Light cone constraint: x² + y² = c²t²
      // For light rays: spatial distance = c * time
      const light_speed = e; // Speed of light parameter
      const spatial_radius = Math.abs(timeCoord) * light_speed * f;
      
      return spatial_radius * Math.cos(angle) * b * g;
    },
    y: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, pParam = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const angle = u * Math.PI * 2;
      const timeCoord = (v - 0.5) * a * d;
      
      const light_speed = e;
      const spatial_radius = Math.abs(timeCoord) * light_speed * f;
      
      return spatial_radius * Math.sin(angle) * b * h;
    },
    z: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, pParam = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const timeCoord = (v - 0.5) * a * d;
      
      // Time coordinate (future/past light cone)
      return timeCoord * c * i;
    }
  },

  // Spacetime Geodesic - Curved paths in spacetime
  spacetime_geodesic: {
    x: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, pParam = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const properTime = u * a * d; // Proper time parameter
      const curvature = v * e; // Spacetime curvature parameter
      
      // Geodesic path with spacetime curvature
      // x(τ) = initial_velocity * τ + curvature_effect
      const initial_velocity_x = f;
      const curvature_effect = Math.sin(properTime * curvature) * g;
      
      return (initial_velocity_x * properTime + curvature_effect) * b * h;
    },
    y: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, pParam = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const properTime = u * a * d;
      const curvature = v * e;
      
      const initial_velocity_y = g;
      const curvature_effect = Math.cos(properTime * curvature) * h;
      
      return (initial_velocity_y * properTime + curvature_effect) * b * i;
    },
    z: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, pParam = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const properTime = u * a * d;
      const curvature = v * e;
      
      // Time dilation effect
      const time_dilation = Math.sqrt(1 - Math.pow(Math.tanh(properTime * j), 2));
      
      return properTime * time_dilation * c * k;
    }
  }
};

// Export for integration with main shape library
export default NON_EUCLIDEAN_SHAPES;