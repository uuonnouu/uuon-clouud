// Non-Euclidean Geometries - Clean Implementation
import { SurfaceEquation } from "./parametricSurfaces";

export const NON_EUCLIDEAN_GEOMETRIES: Record<string, SurfaceEquation> = {
  
  // HYPERBOLIC GEOMETRY
  
  pseudosphere: {
    x: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const theta = u * Math.PI * 2 * d;
      const tractrix_param = v * Math.PI * 0.98 + 0.01;
      const sech_val = 1 / Math.cosh(tractrix_param);
      const radius = a * sech_val * e;
      return radius * Math.cos(theta) * b * f;
    },
    y: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const theta = u * Math.PI * 2 * d;
      const tractrix_param = v * Math.PI * 0.98 + 0.01;
      const sech_val = 1 / Math.cosh(tractrix_param);
      const radius = a * sech_val * e;
      return radius * Math.sin(theta) * b * g;
    },
    z: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const tractrix_param = v * Math.PI * 0.98 + 0.01;
      const z_tractrix = tractrix_param - Math.tanh(tractrix_param);
      return a * z_tractrix * c * h;
    }
  },

  hyperbolic_paraboloid: {
    x: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const u_scaled = (u - 0.5) * a * d;
      return u_scaled * b * e;
    },
    y: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const v_scaled = (v - 0.5) * a * e;
      return v_scaled * b * f;
    },
    z: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const u_scaled = (u - 0.5) * a * d;
      const v_scaled = (v - 0.5) * a * e;
      const x_term = Math.pow(u_scaled, 2) / (g * g);
      const y_term = Math.pow(v_scaled, 2) / (h * h);
      return (x_term - y_term) * c * i;
    }
  },

  hyperbolic_pentagon: {
    x: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const angle = u * Math.PI * 2;
      const radius = v * a * e;
      const hyperbolic_radius = radius > 0.001 ? Math.sinh(radius * d) / (radius * d) * radius : radius;
      const sides = 5;
      const vertex_angle = Math.floor(angle / (Math.PI * 2 / sides)) * (Math.PI * 2 / sides);
      const local_angle = angle - vertex_angle;
      const hyperbolic_interp = Math.tanh(local_angle * sides * f) * g;
      const final_angle = vertex_angle + hyperbolic_interp;
      return hyperbolic_radius * Math.cos(final_angle) * b * h;
    },
    y: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const angle = u * Math.PI * 2;
      const radius = v * a * e;
      const hyperbolic_radius = radius > 0.001 ? Math.sinh(radius * d) / (radius * d) * radius : radius;
      const sides = 5;
      const vertex_angle = Math.floor(angle / (Math.PI * 2 / sides)) * (Math.PI * 2 / sides);
      const local_angle = angle - vertex_angle;
      const hyperbolic_interp = Math.tanh(local_angle * sides * f) * g;
      const final_angle = vertex_angle + hyperbolic_interp;
      return hyperbolic_radius * Math.sin(final_angle) * b * i;
    },
    z: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const radius = v * a * e;
      const hyperbolic_curvature = -Math.pow(radius * d, 2) / (2 * j * j);
      return hyperbolic_curvature * c * k;
    }
  },

  hyperbolic_tiling: {
    x: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const angle = u * Math.PI * 2;
      const radial_dist = v * 0.98;
      const poincare_r = radial_dist * a * e;
      const x_poincare = poincare_r * Math.cos(angle);
      const y_poincare = poincare_r * Math.sin(angle);
      const tiling_scale = d * 3;
      const pattern_x = Math.floor(x_poincare * tiling_scale) * f;
      const pattern_y = Math.floor(y_poincare * tiling_scale) * g;
      const disk_factor = 1 / (1 - poincare_r * poincare_r);
      return (x_poincare + Math.sin(pattern_x + pattern_y) * 0.1 * h) * disk_factor * b * i;
    },
    y: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const angle = u * Math.PI * 2;
      const radial_dist = v * 0.98;
      const poincare_r = radial_dist * a * e;
      const x_poincare = poincare_r * Math.cos(angle);
      const y_poincare = poincare_r * Math.sin(angle);
      const tiling_scale = d * 3;
      const pattern_x = Math.floor(x_poincare * tiling_scale) * f;
      const pattern_y = Math.floor(y_poincare * tiling_scale) * g;
      const disk_factor = 1 / (1 - poincare_r * poincare_r);
      return (y_poincare + Math.cos(pattern_x + pattern_y) * 0.1 * h) * disk_factor * b * j;
    },
    z: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const radial_dist = v * 0.98;
      const poincare_r = radial_dist * a * e;
      const hyperbolic_height = -Math.log(1 - poincare_r * poincare_r) * c * k;
      return hyperbolic_height;
    }
  },

  // SPHERICAL GEOMETRY
  
  spherical_triangle: {
    x: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const phi = u * Math.PI * 2;
      const theta_range = v * Math.PI * d;
      const vertex1 = { phi: 0, theta: Math.PI / 6 * e };
      const vertex2 = { phi: Math.PI * 2/3 * f, theta: Math.PI / 6 * e };
      const vertex3 = { phi: Math.PI * 4/3 * g, theta: Math.PI / 2 * h };
      let current_vertex = vertex1;
      if (phi > Math.PI * 2/3 && phi <= Math.PI * 4/3) current_vertex = vertex2;
      else if (phi > Math.PI * 4/3) current_vertex = vertex3;
      const spherical_theta = current_vertex.theta + theta_range;
      const spherical_phi = current_vertex.phi + (phi % (Math.PI * 2/3)) * i;
      const radius = a;
      return radius * Math.sin(spherical_theta) * Math.cos(spherical_phi) * b * j;
    },
    y: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const phi = u * Math.PI * 2;
      const theta_range = v * Math.PI * d;
      const vertex1 = { phi: 0, theta: Math.PI / 6 * e };
      const vertex2 = { phi: Math.PI * 2/3 * f, theta: Math.PI / 6 * e };
      const vertex3 = { phi: Math.PI * 4/3 * g, theta: Math.PI / 2 * h };
      let current_vertex = vertex1;
      if (phi > Math.PI * 2/3 && phi <= Math.PI * 4/3) current_vertex = vertex2;
      else if (phi > Math.PI * 4/3) current_vertex = vertex3;
      const spherical_theta = current_vertex.theta + theta_range;
      const spherical_phi = current_vertex.phi + (phi % (Math.PI * 2/3)) * i;
      const radius = a;
      return radius * Math.sin(spherical_theta) * Math.sin(spherical_phi) * b * k;
    },
    z: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const phi = u * Math.PI * 2;
      const theta_range = v * Math.PI * d;
      const vertex1 = { phi: 0, theta: Math.PI / 6 * e };
      const vertex2 = { phi: Math.PI * 2/3 * f, theta: Math.PI / 6 * e };
      const vertex3 = { phi: Math.PI * 4/3 * g, theta: Math.PI / 2 * h };
      let current_vertex = vertex1;
      if (phi > Math.PI * 2/3 && phi <= Math.PI * 4/3) current_vertex = vertex2;
      else if (phi > Math.PI * 4/3) current_vertex = vertex3;
      const spherical_theta = current_vertex.theta + theta_range;
      const radius = a;
      return radius * Math.cos(spherical_theta) * c * l;
    }
  },

  spherical_polygon: {
    x: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const sides = Math.floor(d * 8) + 3;
      const angle = u * Math.PI * 2;
      const radial_param = v;
      const vertex_angle = Math.floor(angle / (Math.PI * 2 / sides)) * (Math.PI * 2 / sides);
      const interp_param = (angle - vertex_angle) / (Math.PI * 2 / sides);
      const slerp_angle = vertex_angle + interp_param * (Math.PI * 2 / sides);
      const latitude = Math.PI / 4 + Math.sin(slerp_angle * sides) * Math.PI / 6 * e;
      const adjusted_latitude = latitude * (1 - radial_param * 0.5 * f);
      const radius = a;
      return radius * Math.sin(adjusted_latitude) * Math.cos(slerp_angle) * b * g;
    },
    y: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const sides = Math.floor(d * 8) + 3;
      const angle = u * Math.PI * 2;
      const radial_param = v;
      const vertex_angle = Math.floor(angle / (Math.PI * 2 / sides)) * (Math.PI * 2 / sides);
      const interp_param = (angle - vertex_angle) / (Math.PI * 2 / sides);
      const slerp_angle = vertex_angle + interp_param * (Math.PI * 2 / sides);
      const latitude = Math.PI / 4 + Math.sin(slerp_angle * sides) * Math.PI / 6 * e;
      const adjusted_latitude = latitude * (1 - radial_param * 0.5 * f);
      const radius = a;
      return radius * Math.sin(adjusted_latitude) * Math.sin(slerp_angle) * b * h;
    },
    z: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const sides = Math.floor(d * 8) + 3;
      const angle = u * Math.PI * 2;
      const radial_param = v;
      const vertex_angle = Math.floor(angle / (Math.PI * 2 / sides)) * (Math.PI * 2 / sides);
      const interp_param = (angle - vertex_angle) / (Math.PI * 2 / sides);
      const slerp_angle = vertex_angle + interp_param * (Math.PI * 2 / sides);
      const latitude = Math.PI / 4 + Math.sin(slerp_angle * sides) * Math.PI / 6 * e;
      const adjusted_latitude = latitude * (1 - radial_param * 0.5 * f);
      const radius = a;
      return radius * Math.cos(adjusted_latitude) * c * i;
    }
  },

  // MINKOWSKI SPACETIME GEOMETRY
  
  minkowski_hyperboloid: {
    x: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const theta = u * Math.PI * 2;
      const tau = (v - 0.5) * d * e;
      const spatial_radius = Math.sqrt(1 + tau * tau) * a * f;
      return spatial_radius * Math.cos(theta) * b * g;
    },
    y: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const theta = u * Math.PI * 2;
      const tau = (v - 0.5) * d * e;
      const spatial_radius = Math.sqrt(1 + tau * tau) * a * f;
      return spatial_radius * Math.sin(theta) * b * h;
    },
    z: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const tau = (v - 0.5) * d * e;
      return tau * a * c * i;
    }
  },

  light_cone: {
    x: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const angle = u * Math.PI * 2;
      const timeCoord = (v - 0.5) * a * d;
      const light_speed = e;
      const spatial_radius = Math.abs(timeCoord) * light_speed * f;
      return spatial_radius * Math.cos(angle) * b * g;
    },
    y: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const angle = u * Math.PI * 2;
      const timeCoord = (v - 0.5) * a * d;
      const light_speed = e;
      const spatial_radius = Math.abs(timeCoord) * light_speed * f;
      return spatial_radius * Math.sin(angle) * b * h;
    },
    z: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const timeCoord = (v - 0.5) * a * d;
      return timeCoord * c * i;
    }
  },

  spacetime_geodesic: {
    x: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const properTime = u * a * d;
      const curvature = v * e;
      const initial_velocity_x = f;
      const curvature_effect = Math.sin(properTime * curvature) * g;
      return (initial_velocity_x * properTime + curvature_effect) * b * h;
    },
    y: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const properTime = u * a * d;
      const curvature = v * e;
      const initial_velocity_y = g;
      const curvature_effect = Math.cos(properTime * curvature) * h;
      return (initial_velocity_y * properTime + curvature_effect) * b * i;
    },
    z: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, tParam = 1, uParam = 1, vParam = 1, w = 1) => {
      const properTime = u * a * d;
      const curvature = v * e;
      const time_dilation = Math.sqrt(1 - Math.pow(Math.tanh(properTime * j), 2));
      return properTime * time_dilation * c * k;
    }
  }
};

export default NON_EUCLIDEAN_GEOMETRIES;