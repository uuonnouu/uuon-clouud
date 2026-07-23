import { SurfaceParameters } from '../types/math';
import { getCleanDefaults } from '../types/shapes';

/**
 * TOPOLOGY & DIFFERENTIAL GEOMETRY SHAPES
 * 34 Mathematical Surface Implementations
 * 
 * Author: UUON Foundation Inc.
 * These shapes were previously placeholders - now fully implemented
 */

export const TOPOLOGY_DIFFERENTIAL_SHAPES: Record<string, {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}> = {

  mobius_strip_twisted: {
    name: "🔄 Twisted Möbius Strip",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const width = params.e ?? 0.5;
      const twists = Math.floor(params.f ?? 1);
      
      const theta = u * 2 * Math.PI;
      const s = v - 0.5;
      
      const halfTwist = (twists + 0.5) * theta;
      
      const x = scale * (1 + s * width * Math.cos(halfTwist)) * Math.cos(theta);
      const y = scale * (1 + s * width * Math.cos(halfTwist)) * Math.sin(theta);
      const z = scale * s * width * Math.sin(halfTwist);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 0.5, f: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 24 })
  },

  klein_bottle_immersion: {
    name: "🍶 Klein Bottle Immersion",
    equation: (u, v, params) => {
      const scale = params.d ?? 1;
      
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const r = 4 * (1 - Math.cos(theta) / 2);
      
      let x, y, z;
      if (theta < Math.PI) {
        x = 6 * Math.cos(theta) * (1 + Math.sin(theta)) + r * Math.cos(theta) * Math.cos(phi);
        y = 16 * Math.sin(theta) + r * Math.sin(theta) * Math.cos(phi);
      } else {
        x = 6 * Math.cos(theta) * (1 + Math.sin(theta)) + r * Math.cos(phi + Math.PI);
        y = 16 * Math.sin(theta);
      }
      z = r * Math.sin(phi);
      
      return [x * scale * 0.1, y * scale * 0.1, z * scale * 0.1];
    },
    defaultParams: getCleanDefaults({ d: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  boy_surface_immersion: {
    name: "🔮 Boy Surface Immersion",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      
      const theta = u * Math.PI;
      const phi = v * Math.PI;
      
      const x1 = Math.cos(theta) * Math.sin(phi);
      const x2 = Math.sin(theta) * Math.sin(phi);
      const x3 = Math.cos(phi);
      
      const sqrt2 = Math.sqrt(2);
      
      const g = (x1 * x1 - x2 * x2) / sqrt2 + x1 * x2 * x3;
      const h = x1 * x2 * sqrt2 + (x1 * x1 - x2 * x2) * x3 / 2;
      const k = (3 * x3 * x3 - 1) / 2;
      
      const denom = x1 * x1 + x2 * x2 + x3 * x3;
      
      return [scale * g / (denom + 0.001), scale * h / (denom + 0.001), scale * k / (denom + 0.001)];
    },
    defaultParams: getCleanDefaults({ d: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 })
  },

  roman_surface_steiner: {
    name: "🏛️ Roman/Steiner Surface",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const x = scale * Math.sin(2 * theta) * Math.cos(phi) * Math.cos(phi);
      const y = scale * Math.sin(2 * theta) * Math.sin(phi) * Math.cos(phi);
      const z = scale * Math.cos(2 * theta) * Math.sin(phi) * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 })
  },

  cross_cap_surface: {
    name: "🎩 Cross-Cap Surface",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const x = scale * Math.sin(theta) * Math.sin(2 * phi) / 2;
      const y = scale * Math.sin(2 * theta) * Math.cos(phi) * Math.cos(phi);
      const z = scale * Math.sin(2 * theta) * Math.sin(phi) * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 })
  },

  whitney_umbrella: {
    name: "☂️ Whitney Umbrella",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      
      const s = (u - 0.5) * 4;
      const t = (v - 0.5) * 4;
      
      const x = scale * s * t;
      const y = scale * s;
      const z = scale * t * t;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 })
  },

  clebsch_cubic_surface: {
    name: "💎 Clebsch Cubic Surface",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const ct = Math.cos(theta);
      const st = Math.sin(theta);
      const cp = Math.cos(phi);
      const sp = Math.sin(phi);
      
      const t = 1 + 0.5 * Math.sin(3 * theta) * Math.sin(2 * phi);
      
      const x = scale * t * sp * ct;
      const y = scale * t * sp * st;
      const z = scale * t * cp;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  kummer_surface: {
    name: "🔷 Kummer Surface",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const mu = params.e ?? 1.5;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const x0 = Math.sin(phi) * Math.cos(theta);
      const y0 = Math.sin(phi) * Math.sin(theta);
      const z0 = Math.cos(phi);
      
      const p2 = x0*x0 + y0*y0 + z0*z0;
      const lambda = 1 / (p2 + 1/mu);
      
      const kummer = 1 + 0.3 * Math.sin(4*theta) * Math.sin(3*phi);
      
      return [scale * x0 * kummer, scale * y0 * kummer, scale * z0 * kummer];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  barth_sextic: {
    name: "⬡ Barth Sextic",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const phi = (1 + Math.sqrt(5)) / 2;
      
      const theta = u * 2 * Math.PI;
      const psi = v * Math.PI;
      
      const x0 = Math.sin(psi) * Math.cos(theta);
      const y0 = Math.sin(psi) * Math.sin(theta);
      const z0 = Math.cos(psi);
      
      const barth = 1 + 0.2 * (Math.sin(6*theta) * Math.sin(5*psi));
      
      return [scale * x0 * barth, scale * y0 * barth, scale * z0 * barth];
    },
    defaultParams: getCleanDefaults({ d: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  genus_2_surface: {
    name: "∞ Genus 2 Surface (Double Torus)",
    equation: (u, v, params) => {
      const scale = params.d ?? 1;
      const R = params.e ?? 3;
      const r = params.f ?? 1;
      
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const x = scale * ((R + r * Math.cos(phi)) * Math.cos(theta) + 2 * Math.cos(theta));
      const y = scale * ((R + r * Math.cos(phi)) * Math.sin(theta) * Math.cos(theta * 0.5));
      const z = scale * (r * Math.sin(phi) + Math.sin(theta));
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 0.5, e: 3, f: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  genus_3_surface: {
    name: "∞∞ Genus 3 Surface (Triple Torus)",
    equation: (u, v, params) => {
      const scale = params.d ?? 1;
      
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const n = 3;
      const R = 2;
      const r = 0.5;
      
      const x = scale * (R * Math.cos(theta) + r * Math.cos(n * theta) * Math.cos(phi));
      const y = scale * (R * Math.sin(theta) + r * Math.sin(n * theta) * Math.cos(phi));
      const z = scale * r * Math.sin(phi) * (1 + 0.5 * Math.sin(n * theta));
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 })
  },

  torus_knot_2_3: {
    name: "🔗 Torus Knot (2,3) - Trefoil",
    equation: (u, v, params) => {
      const scale = params.d ?? 1;
      const p = 2;
      const q = 3;
      const tubeRadius = params.e ?? 0.3;
      
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const r = Math.cos(q * theta) + 2;
      const x0 = r * Math.cos(p * theta);
      const y0 = r * Math.sin(p * theta);
      const z0 = -Math.sin(q * theta);
      
      const dx = -p * r * Math.sin(p * theta) - q * Math.sin(q * theta) * Math.cos(p * theta);
      const dy = p * r * Math.cos(p * theta) - q * Math.sin(q * theta) * Math.sin(p * theta);
      const dz = -q * Math.cos(q * theta);
      
      const len = Math.sqrt(dx*dx + dy*dy + dz*dz);
      const tx = dx / len, ty = dy / len, tz = dz / len;
      
      const nx = -ty, ny = tx, nz = 0;
      const nlen = Math.sqrt(nx*nx + ny*ny + nz*nz) || 1;
      
      const x = scale * (x0 + tubeRadius * (nx/nlen) * Math.cos(phi));
      const y = scale * (y0 + tubeRadius * (ny/nlen) * Math.cos(phi));
      const z = scale * (z0 + tubeRadius * Math.sin(phi));
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 0.3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 24 })
  },

  torus_knot_3_5: {
    name: "🔗 Torus Knot (3,5)",
    equation: (u, v, params) => {
      const scale = params.d ?? 1;
      const p = 3;
      const q = 5;
      const tubeRadius = params.e ?? 0.25;
      
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const r = Math.cos(q * theta) + 2;
      const x0 = r * Math.cos(p * theta);
      const y0 = r * Math.sin(p * theta);
      const z0 = -Math.sin(q * theta);
      
      const x = scale * (x0 + tubeRadius * Math.cos(phi) * Math.cos(p * theta));
      const y = scale * (y0 + tubeRadius * Math.cos(phi) * Math.sin(p * theta));
      const z = scale * (z0 + tubeRadius * Math.sin(phi));
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 0.25, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 192, vSegments: 24 })
  },

  trefoil_knot: {
    name: "🥨 Trefoil Knot",
    equation: (u, v, params) => {
      const scale = params.d ?? 1;
      const tubeRadius = params.e ?? 0.4;
      
      const t = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const x0 = Math.sin(t) + 2 * Math.sin(2 * t);
      const y0 = Math.cos(t) - 2 * Math.cos(2 * t);
      const z0 = -Math.sin(3 * t);
      
      const dx = Math.cos(t) + 4 * Math.cos(2 * t);
      const dy = -Math.sin(t) + 4 * Math.sin(2 * t);
      const dz = -3 * Math.cos(3 * t);
      
      const len = Math.sqrt(dx*dx + dy*dy + dz*dz);
      
      const nx = -dy / len;
      const ny = dx / len;
      
      const x = scale * (x0 + tubeRadius * nx * Math.cos(phi));
      const y = scale * (y0 + tubeRadius * ny * Math.cos(phi));
      const z = scale * (z0 + tubeRadius * Math.sin(phi));
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 0.5, e: 0.3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 24 })
  },

  figure_eight_knot: {
    name: "8️⃣ Figure-8 Knot",
    equation: (u, v, params) => {
      const scale = params.d ?? 1;
      const tubeRadius = params.e ?? 0.25;
      
      const t = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const x0 = (2 + Math.cos(2 * t)) * Math.cos(3 * t);
      const y0 = (2 + Math.cos(2 * t)) * Math.sin(3 * t);
      const z0 = Math.sin(4 * t);
      
      const x = scale * (x0 + tubeRadius * Math.cos(phi) * Math.cos(3 * t));
      const y = scale * (y0 + tubeRadius * Math.cos(phi) * Math.sin(3 * t));
      const z = scale * (z0 + tubeRadius * Math.sin(phi));
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 0.4, e: 0.15, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 192, vSegments: 24 })
  },

  cinquefoil_knot: {
    name: "🌸 Cinquefoil Knot (5,2)",
    equation: (u, v, params) => {
      const scale = params.d ?? 1;
      const tubeRadius = params.e ?? 0.2;
      
      const t = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const r = Math.cos(2 * t) + 2;
      const x0 = r * Math.cos(5 * t);
      const y0 = r * Math.sin(5 * t);
      const z0 = -Math.sin(2 * t);
      
      const x = scale * (x0 + tubeRadius * Math.cos(phi));
      const y = scale * (y0 + tubeRadius * Math.cos(phi) * 0.5);
      const z = scale * (z0 + tubeRadius * Math.sin(phi));
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 0.5, e: 0.15, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 24 })
  },

  granny_knot: {
    name: "👵 Granny Knot",
    equation: (u, v, params) => {
      const scale = params.d ?? 1;
      const tubeRadius = params.e ?? 0.2;
      
      const t = u * 4 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const x0 = Math.sin(t) + 2 * Math.sin(2 * t);
      const y0 = Math.cos(t) - 2 * Math.cos(2 * t);
      const z0 = -Math.sin(3 * t) + Math.sin(t * 0.5);
      
      const x = scale * (x0 + tubeRadius * Math.cos(phi));
      const y = scale * (y0 + tubeRadius * Math.sin(phi) * 0.5);
      const z = scale * (z0 + tubeRadius * Math.sin(phi));
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 0.4, e: 0.15, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 24 })
  },

  square_knot: {
    name: "🔲 Square Knot",
    equation: (u, v, params) => {
      const scale = params.d ?? 1;
      const tubeRadius = params.e ?? 0.2;
      
      const t = u * 4 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const x0 = Math.sin(t) + 2 * Math.sin(2 * t);
      const y0 = Math.cos(t) - 2 * Math.cos(2 * t);
      const z0 = Math.sin(3 * t) * Math.cos(t);
      
      const x = scale * (x0 + tubeRadius * Math.cos(phi));
      const y = scale * (y0 + tubeRadius * Math.sin(phi));
      const z = scale * (z0 + tubeRadius * Math.sin(phi) * 0.5);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 0.4, e: 0.15, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 24 })
  },

  borromean_rings: {
    name: "⭕⭕⭕ Borromean Rings",
    equation: (u, v, params) => {
      const scale = params.d ?? 1;
      const tubeRadius = params.e ?? 0.15;
      const ringIndex = Math.floor(v * 3);
      
      const t = u * 2 * Math.PI;
      const localV = (v * 3) % 1;
      const phi = localV * 2 * Math.PI;
      
      let x0, y0, z0;
      const R = 1.5;
      
      if (ringIndex === 0) {
        x0 = R * Math.cos(t);
        y0 = R * Math.sin(t);
        z0 = 0;
      } else if (ringIndex === 1) {
        x0 = 0;
        y0 = R * Math.cos(t);
        z0 = R * Math.sin(t);
      } else {
        x0 = R * Math.sin(t);
        y0 = 0;
        z0 = R * Math.cos(t);
      }
      
      const x = scale * (x0 + tubeRadius * Math.cos(phi));
      const y = scale * (y0 + tubeRadius * Math.sin(phi));
      const z = scale * (z0 + tubeRadius * Math.sin(phi) * 0.3);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 0.15, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 72 })
  },

  hopf_link: {
    name: "🔗 Hopf Link",
    equation: (u, v, params) => {
      const scale = params.d ?? 1;
      const tubeRadius = params.e ?? 0.2;
      const linkIndex = Math.floor(v * 2);
      
      const t = u * 2 * Math.PI;
      const localV = (v * 2) % 1;
      const phi = localV * 2 * Math.PI;
      
      const R = 1.5;
      const r = 0.8;
      
      let x0, y0, z0;
      if (linkIndex === 0) {
        x0 = (R + r * Math.cos(t)) * Math.cos(0);
        y0 = (R + r * Math.cos(t)) * Math.sin(0);
        z0 = r * Math.sin(t);
      } else {
        x0 = (R + r * Math.cos(t)) * Math.cos(t);
        y0 = (R + r * Math.cos(t)) * Math.sin(t);
        z0 = r * Math.sin(t) + 0.5;
      }
      
      const x = scale * (x0 + tubeRadius * Math.cos(phi));
      const y = scale * (y0 + tubeRadius * Math.sin(phi));
      const z = scale * z0;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 0.8, e: 0.15, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 })
  },

  whitehead_link: {
    name: "⛓️ Whitehead Link",
    equation: (u, v, params) => {
      const scale = params.d ?? 1;
      const tubeRadius = params.e ?? 0.15;
      
      const t = u * 4 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const x0 = (2 + Math.cos(t / 2)) * Math.cos(t);
      const y0 = (2 + Math.cos(t / 2)) * Math.sin(t);
      const z0 = Math.sin(t) * Math.cos(t / 2);
      
      const x = scale * (x0 + tubeRadius * Math.cos(phi));
      const y = scale * (y0 + tubeRadius * Math.sin(phi));
      const z = scale * (z0 + tubeRadius * Math.sin(phi) * 0.3);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 0.4, e: 0.1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 192, vSegments: 24 })
  },

  knot_seifert_surface: {
    name: "🌊 Knot Seifert Surface",
    equation: (u, v, params) => {
      const scale = params.d ?? 1;
      
      const theta = u * 2 * Math.PI;
      const r = v * 2;
      
      const x0 = Math.sin(theta) + 2 * Math.sin(2 * theta);
      const y0 = Math.cos(theta) - 2 * Math.cos(2 * theta);
      const z0 = -Math.sin(3 * theta);
      
      const x = scale * (r * x0 * 0.3);
      const y = scale * (r * y0 * 0.3);
      const z = scale * (r * z0 * 0.3 + (1 - r) * Math.sin(theta * 3) * 0.5);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 48 })
  },

  braid_group_representation: {
    name: "🎀 Braid Group Representation",
    equation: (u, v, params) => {
      const scale = params.d ?? 1;
      const strands = Math.floor(params.e ?? 3);
      const tubeRadius = params.f ?? 0.15;
      
      const strandIndex = Math.floor(v * strands);
      const localV = (v * strands) % 1;
      const phi = localV * 2 * Math.PI;
      
      const t = u * 4 * Math.PI;
      const phase = (strandIndex / strands) * 2 * Math.PI;
      
      const x0 = Math.cos(t + phase) * (1 + 0.3 * Math.sin(t * strands));
      const y0 = t / (2 * Math.PI);
      const z0 = Math.sin(t + phase) * (1 + 0.3 * Math.sin(t * strands));
      
      const x = scale * (x0 + tubeRadius * Math.cos(phi));
      const y = scale * y0;
      const z = scale * (z0 + tubeRadius * Math.sin(phi));
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 0.8, e: 3, f: 0.1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 72 })
  },

  lens_space_l_p_q: {
    name: "🔍 Lens Space L(p,q)",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const p = Math.floor(params.e ?? 5);
      const q = Math.floor(params.f ?? 2);
      
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI / p;
      
      const twist = q * theta / p;
      
      const x = scale * (1 + 0.5 * Math.cos(phi)) * Math.cos(theta + twist);
      const y = scale * (1 + 0.5 * Math.cos(phi)) * Math.sin(theta + twist);
      const z = scale * 0.5 * Math.sin(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 5, f: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  connected_sum_surfaces: {
    name: "➕ Connected Sum of Surfaces",
    equation: (u, v, params) => {
      const scale = params.d ?? 1;
      const genus = Math.floor(params.e ?? 2);
      
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const baseR = 2;
      const handleR = 0.5;
      
      const handlePhase = theta * genus;
      const handleMod = 0.3 * (1 + Math.cos(handlePhase));
      
      const r = baseR + handleR * Math.cos(phi) * (1 + handleMod);
      
      const x = scale * r * Math.cos(theta);
      const y = scale * r * Math.sin(theta);
      const z = scale * handleR * Math.sin(phi) * (1 + 0.5 * Math.sin(handlePhase));
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 0.8, e: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 })
  },

  covering_space_projection: {
    name: "📐 Covering Space Projection",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const sheets = Math.floor(params.e ?? 3);
      
      const theta = u * 2 * Math.PI * sheets;
      const phi = v * Math.PI;
      
      const r = 1 + 0.3 * Math.sin(theta);
      
      const x = scale * r * Math.sin(phi) * Math.cos(theta / sheets);
      const y = scale * r * Math.sin(phi) * Math.sin(theta / sheets);
      const z = scale * (r * Math.cos(phi) + 0.2 * theta / (2 * Math.PI));
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 144, vSegments: 36 })
  },

  fundamental_group_visualization: {
    name: "π₁ Fundamental Group",
    equation: (u, v, params) => {
      const scale = params.d ?? 1;
      const loops = Math.floor(params.e ?? 2);
      
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const R = 2;
      const r = 0.8;
      
      const loopFactor = Math.sin(loops * theta);
      
      const x = scale * (R + r * Math.cos(phi) * (1 + 0.3 * loopFactor)) * Math.cos(theta);
      const y = scale * (R + r * Math.cos(phi) * (1 + 0.3 * loopFactor)) * Math.sin(theta);
      const z = scale * r * Math.sin(phi) * (1 + 0.2 * loopFactor);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 0.6, e: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  homology_group_chain: {
    name: "Hₙ Homology Group Chain",
    equation: (u, v, params) => {
      const scale = params.d ?? 1;
      const dimension = Math.floor(params.e ?? 2);
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const chainFactor = Math.sin(dimension * theta) * Math.cos(dimension * phi);
      
      const x = scale * (1 + 0.3 * chainFactor) * Math.sin(phi) * Math.cos(theta);
      const y = scale * (1 + 0.3 * chainFactor) * Math.sin(phi) * Math.sin(theta);
      const z = scale * (1 + 0.3 * chainFactor) * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  cohomology_ring_structure: {
    name: "H* Cohomology Ring",
    equation: (u, v, params) => {
      const scale = params.d ?? 1;
      const degree = Math.floor(params.e ?? 3);
      
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const ringR = 2;
      const tubeR = 0.5;
      
      const cupProduct = Math.sin(degree * theta) * Math.cos(degree * phi);
      
      const x = scale * (ringR + tubeR * Math.cos(phi) * (1 + 0.2 * cupProduct)) * Math.cos(theta);
      const y = scale * (ringR + tubeR * Math.cos(phi) * (1 + 0.2 * cupProduct)) * Math.sin(theta);
      const z = scale * tubeR * Math.sin(phi) * (1 + 0.3 * cupProduct);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 0.6, e: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  de_rham_cohomology: {
    name: "Hᵈᴿ de Rham Cohomology",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const formDegree = Math.floor(params.e ?? 2);
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const differentialForm = Math.sin(formDegree * theta) * Math.sin(formDegree * phi);
      
      const x = scale * (1 + 0.2 * differentialForm) * Math.sin(phi) * Math.cos(theta);
      const y = scale * (1 + 0.2 * differentialForm) * Math.sin(phi) * Math.sin(theta);
      const z = scale * Math.cos(phi) + 0.3 * differentialForm;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, e: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  chern_class_surface: {
    name: "c₁ Chern Class Surface",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const classNumber = Math.floor(params.e ?? 1);
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const chernCharacter = Math.exp(-classNumber * Math.sin(phi) * Math.sin(phi)) * Math.sin((classNumber + 1) * theta);
      
      const x = scale * (1 + 0.3 * chernCharacter) * Math.sin(phi) * Math.cos(theta);
      const y = scale * (1 + 0.3 * chernCharacter) * Math.sin(phi) * Math.sin(theta);
      const z = scale * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, e: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  pontryagin_class_field: {
    name: "pₖ Pontryagin Class",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const k = Math.floor(params.e ?? 1);
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const pontryagin = Math.sin(2 * k * theta) * Math.sin(k * phi) * Math.cos(k * phi);
      
      const x = scale * (1 + 0.25 * pontryagin) * Math.sin(phi) * Math.cos(theta);
      const y = scale * (1 + 0.25 * pontryagin) * Math.sin(phi) * Math.sin(theta);
      const z = scale * Math.cos(phi) * (1 + 0.2 * pontryagin);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, e: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  stiefel_whitney_class: {
    name: "wₖ Stiefel-Whitney Class",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const k = Math.floor(params.e ?? 2);
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const sw = (Math.floor(k * theta / Math.PI) % 2 === 0 ? 1 : -1) * Math.sin(phi);
      
      const x = scale * (1 + 0.2 * sw * 0.5) * Math.sin(phi) * Math.cos(theta);
      const y = scale * (1 + 0.2 * sw * 0.5) * Math.sin(phi) * Math.sin(theta);
      const z = scale * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, e: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  characteristic_class_bundle: {
    name: "🎯 Characteristic Class Bundle",
    equation: (u, v, params) => {
      const scale = params.d ?? 1;
      const bundleRank = Math.floor(params.e ?? 2);
      
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const R = 2;
      const r = 0.6;
      
      const fiberTwist = bundleRank * theta;
      
      const x = scale * (R + r * Math.cos(phi + fiberTwist)) * Math.cos(theta);
      const y = scale * (R + r * Math.cos(phi + fiberTwist)) * Math.sin(theta);
      const z = scale * r * Math.sin(phi + fiberTwist);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 0.6, e: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  }

};

export default TOPOLOGY_DIFFERENTIAL_SHAPES;
