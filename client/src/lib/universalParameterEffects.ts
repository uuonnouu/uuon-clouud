import { SurfaceParameters } from '../types/math';

/**
 * Universal Parameter Effects System
 * Ensures all 26 parameters (a-w) provide meaningful 3D morphing capabilities
 */

export interface ParameterEffect {
  scaling: (value: number, base: number) => number;
  morphing: (value: number, u: number, v: number) => number;
  twisting: (value: number, position: [number, number, number]) => [number, number, number];
  extension: (value: number, coordinate: number, axis: 'x' | 'y' | 'z') => number;
}

// Universal parameter effects that apply to any 3D shape
export const UNIVERSAL_PARAMETER_EFFECTS = {
  
  // Primary Scaling Parameters (a-f)
  a: {
    scaling: (value: number, base: number) => base * (1 + value * 0.5), // Primary size scaling
    morphing: (value: number, u: number, v: number) => value * Math.sin(u * Math.PI) * 0.3,
    twisting: (value: number, pos: [number, number, number]) => {
      const twist = value * 0.1;
      const [x, y, z] = pos;
      return [
        x * Math.cos(twist * z) - y * Math.sin(twist * z),
        x * Math.sin(twist * z) + y * Math.cos(twist * z),
        z
      ];
    },
    extension: (value: number, coord: number) => coord + value * Math.sin(coord * 0.5) * 0.2
  },

  b: {
    scaling: (value: number, base: number) => base * (1 + value * 0.3), // Secondary size scaling
    morphing: (value: number, u: number, v: number) => value * Math.cos(v * Math.PI) * 0.3,
    twisting: (value: number, pos: [number, number, number]) => {
      const twist = value * 0.08;
      const [x, y, z] = pos;
      return [x, y * Math.cos(twist * x) - z * Math.sin(twist * x), y * Math.sin(twist * x) + z * Math.cos(twist * x)];
    },
    extension: (value: number, coord: number) => coord * (1 + value * 0.1)
  },

  c: {
    scaling: (value: number, base: number) => base + value * 0.5, // Additive scaling
    morphing: (value: number, u: number, v: number) => value * Math.sin(u * v * Math.PI) * 0.2,
    twisting: (value: number, pos: [number, number, number]) => {
      const [x, y, z] = pos;
      const twist = value * 0.05;
      return [x * Math.cos(twist * y) + z * Math.sin(twist * y), y, -x * Math.sin(twist * y) + z * Math.cos(twist * y)];
    },
    extension: (value: number, coord: number) => coord + value * Math.cos(coord * 2) * 0.1
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 10 DRAMATIC MORPHING PARAMETERS (D-M): OPENING/CLOSING ANGULAR TRANSFORMS
  // Creates substantial 360°/180°/90°/45° opening and closing effects
  // Range: -180 to 180 maps to dramatic angular deformations
  // ═══════════════════════════════════════════════════════════════════════════

  // D: APERTURE OPENING (360°) - Full circular opening/closing like camera iris
  d: {
    scaling: (value: number, base: number) => base * (1 + Math.abs(value) * 0.005),
    morphing: (value: number, u: number, v: number) => {
      // Creates radial opening effect - shape opens from center like flower
      const angle = (value / 180) * Math.PI; // -π to π range
      const radialFactor = Math.sin(v * Math.PI) * angle;
      return radialFactor * 0.8; // Strong visible effect
    },
    twisting: (value: number, pos: [number, number, number]) => {
      const [x, y, z] = pos;
      // Full 360° spiral twist based on height
      const twistAngle = (value / 180) * Math.PI * z; // Full rotation over height
      const cosT = Math.cos(twistAngle);
      const sinT = Math.sin(twistAngle);
      return [x * cosT - y * sinT, x * sinT + y * cosT, z];
    },
    extension: (value: number, coord: number) => {
      const openFactor = (value / 180) * Math.PI;
      return coord * (1 + Math.sin(openFactor) * 0.5);
    }
  },

  // E: RADIAL BLOOM (180°) - Hemisphere opening like umbrella or flower bloom
  e: {
    scaling: (value: number, base: number) => {
      const bloomFactor = 1 + (value / 180) * 0.8; // -0.2 to 1.8 range
      return base * Math.max(0.2, bloomFactor);
    },
    morphing: (value: number, u: number, v: number) => {
      // Hemisphere bloom - opens outward from center
      const bloomAngle = (value / 180) * Math.PI; // -π to π
      const radialOpen = Math.sin(v * Math.PI * 0.5) * bloomAngle;
      return radialOpen * 0.7;
    },
    twisting: (value: number, pos: [number, number, number]) => {
      const [x, y, z] = pos;
      // Radial expansion/contraction - opens like umbrella
      const bloomFactor = 1 + (value / 180) * 0.8;
      const dist = Math.sqrt(x * x + y * y);
      const heightFactor = (z + 1) * 0.5; // 0 at bottom, 1 at top
      const expand = 1 + (bloomFactor - 1) * heightFactor;
      return [x * expand, y * expand, z * (1 + (bloomFactor - 1) * 0.3)];
    },
    extension: (value: number, coord: number) => coord * (1 + (value / 180) * 0.6)
  },

  // F: QUADRANT FOLD (90°) - Quarter-turn folding like origami
  f: {
    scaling: (value: number, base: number) => base,
    morphing: (value: number, u: number, v: number) => {
      // 90° fold effect - creates creases and folds
      const foldAngle = (value / 180) * (Math.PI / 2); // -π/4 to π/4
      const fold = Math.sin(u * Math.PI * 2) * Math.cos(v * Math.PI * 2) * foldAngle;
      return fold * 1.2;
    },
    twisting: (value: number, pos: [number, number, number]) => {
      const [x, y, z] = pos;
      // 90° quadrant rotation based on position
      const foldAngle = (value / 180) * (Math.PI / 2);
      // Fold different quadrants differently
      const quadrant = Math.sign(x) * Math.sign(y);
      const localFold = foldAngle * quadrant;
      const cosF = Math.cos(localFold);
      const sinF = Math.sin(localFold);
      return [x, y * cosF - z * sinF, y * sinF + z * cosF];
    },
    extension: (value: number, coord: number) => {
      const foldFactor = (value / 180) * (Math.PI / 2);
      return coord + Math.sin(coord * 4) * foldFactor * 0.4;
    }
  },

  // G: PETAL SPLAY (45°) - Eighth-turn delicate opening like petals
  g: {
    scaling: (value: number, base: number) => base * (1 + Math.abs(value / 180) * 0.3),
    morphing: (value: number, u: number, v: number) => {
      // 45° petal-like opening
      const petalAngle = (value / 180) * (Math.PI / 4);
      const petalPattern = Math.sin(u * Math.PI * 4) * petalAngle;
      return petalPattern * 0.6 * Math.sin(v * Math.PI);
    },
    twisting: (value: number, pos: [number, number, number]) => {
      const [x, y, z] = pos;
      // 45° angular splay - tips open outward
      const splayAngle = (value / 180) * (Math.PI / 4);
      const dist = Math.sqrt(x * x + y * y);
      const theta = Math.atan2(y, x);
      const newDist = dist * (1 + splayAngle * 0.5 * (z + 1));
      return [newDist * Math.cos(theta), newDist * Math.sin(theta), z];
    },
    extension: (value: number, coord: number) => {
      return coord * (1 + (value / 180) * 0.4 * Math.abs(coord));
    }
  },

  // H: ACCORDION COMPRESS (180°) - Vertical opening/closing like accordion bellows
  h: {
    scaling: (value: number, base: number) => base,
    morphing: (value: number, u: number, v: number) => {
      // Accordion wave pattern - creates pleats
      const compressAngle = (value / 180) * Math.PI;
      const pleats = Math.sin(v * Math.PI * 6) * compressAngle * 0.15;
      return pleats;
    },
    twisting: (value: number, pos: [number, number, number]) => {
      const [x, y, z] = pos;
      // Vertical compression/expansion like accordion
      const compressFactor = 1 + (value / 180) * 0.9; // 0.1 to 1.9
      const waveOffset = Math.sin(z * Math.PI * 4) * (value / 180) * 0.3;
      return [x + waveOffset, y + waveOffset, z * compressFactor];
    },
    extension: (value: number, coord: number) => {
      const compress = (value / 180);
      return coord * (1 + compress * 0.7) + Math.sin(coord * 8) * compress * 0.2;
    }
  },

  // I: SHUTTER SPLIT (90°) - Opening like window shutters or double doors
  i: {
    scaling: (value: number, base: number) => base,
    morphing: (value: number, u: number, v: number) => {
      // Split opening - left and right halves open
      const splitAngle = (value / 180) * (Math.PI / 2);
      const side = u < 0.5 ? -1 : 1;
      return side * splitAngle * Math.sin(v * Math.PI) * 0.5;
    },
    twisting: (value: number, pos: [number, number, number]) => {
      const [x, y, z] = pos;
      // Shutter opening - opposite sides rotate opposite directions
      const shutterAngle = (value / 180) * (Math.PI / 2);
      const side = x >= 0 ? 1 : -1;
      const localAngle = side * shutterAngle;
      const cosS = Math.cos(localAngle);
      const sinS = Math.sin(localAngle);
      // Rotate around vertical axis (Y)
      return [x * cosS + z * sinS * side, y, -x * sinS * side + z * cosS];
    },
    extension: (value: number, coord: number) => {
      const split = (value / 180) * (Math.PI / 2);
      return coord + Math.sign(coord) * Math.abs(split) * 0.4;
    }
  },

  // J: STARPOINT EXTENSION (360°) - Star tips extend/retract dramatically
  j: {
    scaling: (value: number, base: number) => base * (1 + Math.abs(value / 180) * 0.4),
    morphing: (value: number, u: number, v: number) => {
      // Star point pattern - tips extend outward
      const starAngle = (value / 180) * Math.PI;
      const tips = 6; // 6-pointed star
      const starPattern = Math.cos(u * Math.PI * tips) * starAngle;
      return starPattern * 0.5 * Math.sin(v * Math.PI);
    },
    twisting: (value: number, pos: [number, number, number]) => {
      const [x, y, z] = pos;
      // Star tip extension along normals
      const extendFactor = (value / 180);
      const dist = Math.sqrt(x * x + y * y + z * z) + 0.01;
      const nx = x / dist, ny = y / dist, nz = z / dist;
      // Create spiky extensions based on angle
      const theta = Math.atan2(y, x);
      const spike = Math.pow(Math.cos(theta * 5), 2) * extendFactor * 0.8;
      return [x + nx * spike, y + ny * spike, z + nz * spike * 0.5];
    },
    extension: (value: number, coord: number) => {
      const extend = (value / 180);
      return coord * (1 + Math.pow(Math.cos(coord * 5), 2) * extend * 0.6);
    }
  },

  // K: TUMBLE ROTATION (180°) - Multi-axis tumbling rotation
  k: {
    scaling: (value: number, base: number) => base,
    morphing: (value: number, u: number, v: number) => {
      // Tumble creates warped surface from rotation
      const tumbleAngle = (value / 180) * Math.PI;
      const tumble = Math.sin(u * Math.PI + tumbleAngle) * Math.cos(v * Math.PI);
      return tumble * 0.4;
    },
    twisting: (value: number, pos: [number, number, number]) => {
      const [x, y, z] = pos;
      // Combined X and Y axis rotation - tumbling effect
      const angle = (value / 180) * Math.PI;
      const cosA = Math.cos(angle * 0.5);
      const sinA = Math.sin(angle * 0.5);
      // First rotate around X
      const y1 = y * cosA - z * sinA;
      const z1 = y * sinA + z * cosA;
      // Then rotate around Y
      const x2 = x * cosA + z1 * sinA;
      const z2 = -x * sinA + z1 * cosA;
      return [x2, y1, z2];
    },
    extension: (value: number, coord: number) => coord
  },

  // L: DOME VAULT (90°) - Ceiling/dome opening upward or collapsing
  l: {
    scaling: (value: number, base: number) => base * (1 + (value / 180) * 0.5),
    morphing: (value: number, u: number, v: number) => {
      // Dome vault - top opens up like observatory
      const vaultAngle = (value / 180) * (Math.PI / 2);
      const dome = Math.cos(Math.sqrt((u - 0.5) ** 2 + (v - 0.5) ** 2) * Math.PI * 2);
      return dome * vaultAngle * 0.6;
    },
    twisting: (value: number, pos: [number, number, number]) => {
      const [x, y, z] = pos;
      // Dome opening - top expands, bottom stays
      const vaultFactor = (value / 180);
      const heightRatio = (z + 1) * 0.5; // 0 at bottom, 1 at top
      const expansion = 1 + vaultFactor * heightRatio * 0.8;
      const lift = vaultFactor * heightRatio * heightRatio * 0.6;
      return [x * expansion, y * expansion, z + lift];
    },
    extension: (value: number, coord: number) => {
      const vault = (value / 180) * (Math.PI / 2);
      return coord * (1 + Math.sin(vault) * 0.5);
    }
  },

  // M: FRACTAL UNFOLD (45°) - Recursive opening at multiple scales
  m: {
    scaling: (value: number, base: number) => base,
    morphing: (value: number, u: number, v: number) => {
      // Multi-scale fractal opening
      const unfoldAngle = (value / 180) * (Math.PI / 4);
      let fractal = Math.sin(u * Math.PI * 2) * Math.sin(v * Math.PI * 2);
      fractal += 0.5 * Math.sin(u * Math.PI * 4) * Math.sin(v * Math.PI * 4);
      fractal += 0.25 * Math.sin(u * Math.PI * 8) * Math.sin(v * Math.PI * 8);
      return fractal * unfoldAngle * 0.8;
    },
    twisting: (value: number, pos: [number, number, number]) => {
      const [x, y, z] = pos;
      // Fractal unfolding at multiple scales
      const unfold = (value / 180) * (Math.PI / 4);
      let fractalDisp = Math.sin(x * 3) * Math.sin(y * 3) * Math.sin(z * 3);
      fractalDisp += 0.5 * Math.sin(x * 6) * Math.sin(y * 6) * Math.sin(z * 6);
      const d = unfold * fractalDisp * 0.4;
      const dist = Math.sqrt(x * x + y * y + z * z) + 0.01;
      return [x + x / dist * d, y + y / dist * d, z + z / dist * d];
    },
    extension: (value: number, coord: number) => {
      const unfold = (value / 180) * (Math.PI / 4);
      const fractal = Math.sin(coord * 3) + 0.5 * Math.sin(coord * 6) + 0.25 * Math.sin(coord * 12);
      return coord + unfold * fractal * 0.3;
    }
  },

  n: {
    scaling: (value: number, base: number) => base,
    morphing: (value: number, u: number, v: number) => value * Math.cos(v * 8) * 0.2, // High frequency Y
    twisting: (value: number, pos: [number, number, number]) => {
      const [x, y, z] = pos;
      const fold = value * 0.05;
      return [x, y * Math.cos(fold * x) - z * Math.sin(fold * x), 
              y * Math.sin(fold * x) + z * Math.cos(fold * x)];
    },
    extension: (value: number, coord: number) => coord + value * Math.tan(coord * 2) * 0.03
  },

  o: {
    scaling: (value: number, base: number) => base,
    morphing: (value: number, u: number, v: number) => value * Math.sin(u * v * 8) * 0.15, // XY interaction
    twisting: (value: number, pos: [number, number, number]) => {
      const [x, y, z] = pos;
      const bulge = 1 + value * Math.exp(-((x*x + y*y) / 4)) * 0.2;
      return [x * bulge, y * bulge, z];
    },
    extension: (value: number, coord: number) => coord + value * Math.sin(coord * 10) * 0.04
  },

  p: {
    scaling: (value: number, base: number) => base,
    morphing: (value: number, u: number, v: number) => value * Math.cos(u * 3) * Math.sin(v * 5) * 0.18,
    twisting: (value: number, pos: [number, number, number]) => {
      const [x, y, z] = pos;
      const taper = 1 + value * z * 0.1;
      return [x * taper, y * taper, z];
    },
    extension: (value: number, coord: number) => coord * (1 + value * Math.cos(coord * 7) * 0.06)
  },

  q: {
    scaling: (value: number, base: number) => base,
    morphing: (value: number, u: number, v: number) => value * Math.sin(u * 5) * Math.cos(v * 4) * 0.16,
    twisting: (value: number, pos: [number, number, number]) => {
      const [x, y, z] = pos;
      const twist = value * 0.03 * (x + y);
      return [x * Math.cos(twist) - y * Math.sin(twist),
              x * Math.sin(twist) + y * Math.cos(twist), z];
    },
    extension: (value: number, coord: number) => coord + value * Math.sin(coord * coord * 0.1) * 0.05
  },

  r: {
    scaling: (value: number, base: number) => base,
    morphing: (value: number, u: number, v: number) => value * Math.tan(u * 2) * Math.sin(v * 6) * 0.1,
    twisting: (value: number, pos: [number, number, number]) => {
      const [x, y, z] = pos;
      const helix = value * 0.02;
      const theta = Math.atan2(y, x) + helix * z;
      const radius = Math.sqrt(x*x + y*y) * (1 + helix);
      return [radius * Math.cos(theta), radius * Math.sin(theta), z];
    },
    extension: (value: number, coord: number) => coord * (1 + value * Math.sin(coord * 12) * 0.04)
  },

  // Advanced Transformation Parameters (s-w)
  s: {
    scaling: (value: number, base: number) => base,
    morphing: (value: number, u: number, v: number) => value * Math.sin(u * 10) * 0.15, // Ultra high frequency
    twisting: (value: number, pos: [number, number, number]) => {
      const [x, y, z] = pos;
      const stretch = 1 + value * Math.sin(z * 3) * 0.2;
      return [x, y * stretch, z];
    },
    extension: (value: number, coord: number) => coord + value * Math.cos(coord * 15) * 0.03
  },

  t: {
    scaling: (value: number, base: number) => base,
    morphing: (value: number, u: number, v: number) => value * Math.cos(v * 10) * 0.15,
    twisting: (value: number, pos: [number, number, number]) => {
      const [x, y, z] = pos;
      const squeeze = 1 + value * Math.cos(x * 4) * 0.15;
      return [x * squeeze, y, z];
    },
    extension: (value: number, coord: number) => coord * (1 + value * Math.tan(coord * 0.3) * 0.02)
  },

  u: {
    scaling: (value: number, base: number) => base,
    morphing: (value: number, u: number, v: number) => value * Math.sin(u * v * 10) * 0.12,
    twisting: (value: number, pos: [number, number, number]) => {
      const [x, y, z] = pos;
      const bend = value * 0.04;
      return [x + bend * z * z, y, z];
    },
    extension: (value: number, coord: number) => coord + value * Math.sin(coord * 20) * 0.025
  },

  v: {
    scaling: (value: number, base: number) => base,
    morphing: (value: number, u: number, v: number) => value * Math.cos(u * 7) * Math.sin(v * 9) * 0.12,
    twisting: (value: number, pos: [number, number, number]) => {
      const [x, y, z] = pos;
      const warp = value * 0.03;
      return [x, y + warp * x * z, z];
    },
    extension: (value: number, coord: number) => coord * (1 + value * Math.cos(coord * 25) * 0.02)
  },

  w: {
    scaling: (value: number, base: number) => base,
    morphing: (value: number, u: number, v: number) => value * Math.sin(u * 12) * Math.cos(v * 8) * 0.1,
    twisting: (value: number, pos: [number, number, number]) => {
      const [x, y, z] = pos;
      const complexity = value * 0.02;
      return [
        x + complexity * Math.sin(y * 3) * Math.cos(z * 2),
        y + complexity * Math.cos(x * 3) * Math.sin(z * 2),
        z + complexity * Math.sin(x * 2) * Math.cos(y * 2)
      ];
    },
    extension: (value: number, coord: number) => coord + value * Math.sin(coord * coord * 0.05) * 0.02
  }
};

/**
 * Apply pure axis scaling for a, b, c parameters only
 */
export function applyPureAxisScaling(
  position: [number, number, number],
  parameters: SurfaceParameters
): [number, number, number] {
  let [x, y, z] = position;
  
  // Pure axis control - ONLY scaling, no morphing/twisting/extension
  const a = parameters.a || 1; // X-axis scaling
  const b = parameters.b || 1; // Y-axis scaling  
  const c = parameters.c || 1; // Z-axis scaling
  
  // Simple multiplicative scaling per axis
  x *= a;
  y *= b;
  z *= c;
  
  return [x, y, z];
}

/**
 * Apply universal parameter effects to any 3D coordinate
 * Now with pure axis mode for a,b,c
 */
export function applyUniversalEffects(
  position: [number, number, number],
  u: number,
  v: number,
  parameters: SurfaceParameters,
  pureAxisMode: boolean = true
): [number, number, number] {
  let [x, y, z] = position;
  
  if (pureAxisMode) {
    // UNIVERSAL MORPHING MODE: Every shape morphs with every parameter
    // A cube can become whatever it wants to be - chaos is allowed!
    
    // First apply pure axis scaling for a, b, c
    [x, y, z] = applyPureAxisScaling([x, y, z], parameters);
    
    // Extract ALL 26 parameters - every one creates visible effects
    const d = parameters.d || 0;
    const e = parameters.e || 0;
    const f = parameters.f || 0;
    const g = parameters.g || 0;
    const h = parameters.h || 0;
    const iParam = parameters.i || 0;
    const jParam = parameters.j || 0;
    const k = parameters.k || 0;
    const l = parameters.l || 0;
    const m = parameters.m || 0;
    const n = parameters.n || 0;
    const o = parameters.o || 0;
    const p = parameters.p || 0;
    const q = parameters.q || 0;
    const r = parameters.r || 0;
    const s = parameters.s || 0;
    const t = parameters.t || 0;
    const uParam = parameters.u || 0;
    const vParam = parameters.v || 0;
    const w = parameters.w || 0;
    
    // STRONG multiplier for visible effects (was 0.05-0.1, now 0.3-0.5)
    const MORPH_STRENGTH = 0.35;
    const TWIST_STRENGTH = 0.25;
    const WAVE_STRENGTH = 0.4;
    
    // D: TORSION - Helical twist around Z axis
    const dTwist = d * TWIST_STRENGTH * 0.02;
    if (dTwist !== 0) {
      const angle = dTwist * (z + 1);
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const newX = x * cos - y * sin;
      const newY = x * sin + y * cos;
      x = newX;
      y = newY;
    }
    
    // E: RADIAL BULGE - Expand/compress from center
    if (e !== 0) {
      const bulge = 1 + e * MORPH_STRENGTH * 0.02;
      x *= bulge;
      y *= bulge;
    }
    
    // F: WAVE RIPPLES - Sinusoidal surface waves
    if (f !== 0) {
      z += f * WAVE_STRENGTH * 0.02 * Math.sin(u * 4 + v * 4);
    }
    
    // G: INVERSION - Inside-out topology
    if (g !== 0) {
      const dist = Math.sqrt(x * x + y * y + z * z) + 0.1;
      const factor = 1 + g * MORPH_STRENGTH * 0.015 * (1 / dist - 0.5);
      x *= factor;
      y *= factor;
      z *= factor;
    }
    
    // H: TAPER - Progressive cone/wedge scaling
    if (h !== 0) {
      const taper = 1 + h * MORPH_STRENGTH * 0.02 * (z + 1);
      x *= taper;
      y *= taper;
    }
    
    // I: SYMMETRY DISTORTION - Asymmetric warping
    if (iParam !== 0) {
      const distort = iParam * MORPH_STRENGTH * 0.015 * Math.sin(Math.atan2(y, x) * 3);
      x *= (1 + distort);
      y *= (1 - distort);
    }
    
    // J: STELLULAR EXTRUSION - Spiky star effect
    if (jParam !== 0) {
      const dist = Math.sqrt(x * x + y * y + z * z) + 0.01;
      const extrude = jParam * MORPH_STRENGTH * 0.02 * Math.sin(u * 6) * Math.sin(v * 6);
      x += (x / dist) * extrude;
      y += (y / dist) * extrude;
      z += (z / dist) * extrude;
    }
    
    // K: GYRATION - Multi-axis rotation
    if (k !== 0) {
      const angle = k * TWIST_STRENGTH * 0.02;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const newY = y * cosA - z * sinA;
      const newZ = y * sinA + z * cosA;
      y = newY;
      z = newZ;
    }
    
    // L: CURVATURE ENVELOPE - Gaussian bell curve
    if (l !== 0) {
      const dist = Math.sqrt(x * x + y * y);
      const curve = 1 + l * MORPH_STRENGTH * 0.015 * Math.exp(-dist * 0.3);
      x *= curve;
      y *= curve;
      z += l * MORPH_STRENGTH * 0.01 * (1 - dist * 0.5);
    }
    
    // M: FRACTAL NOISE - Multi-frequency perturbation
    if (m !== 0) {
      const fractal = Math.sin(x * 4) * Math.sin(y * 4) * Math.sin(z * 4) +
                     0.5 * Math.sin(x * 8) * Math.sin(y * 8) * Math.sin(z * 8);
      const d = m * MORPH_STRENGTH * 0.012 * fractal;
      x += d;
      y += d;
      z += d;
    }
    
    // N: HIGH FREQUENCY Y-WAVE - Rippling along Y
    if (n !== 0) {
      y += n * WAVE_STRENGTH * 0.025 * Math.cos(v * 8);
      const fold = n * TWIST_STRENGTH * 0.03;
      const newY = y * Math.cos(fold * x) - z * Math.sin(fold * x);
      const newZ = y * Math.sin(fold * x) + z * Math.cos(fold * x);
      y = newY;
      z = newZ;
    }
    
    // O: XY INTERACTION - Coupled oscillation
    if (o !== 0) {
      const interaction = o * WAVE_STRENGTH * 0.02 * Math.sin(u * v * 8);
      x += interaction;
      y += interaction * 0.8;
      const bulge = 1 + o * MORPH_STRENGTH * 0.015 * Math.exp(-((x * x + y * y) / 4));
      x *= bulge;
      y *= bulge;
    }
    
    // P: HARMONIC BLEND - Multi-frequency modulation
    if (p !== 0) {
      z += p * WAVE_STRENGTH * 0.022 * Math.cos(u * 3) * Math.sin(v * 5);
      const taper = 1 + p * MORPH_STRENGTH * 0.015 * z;
      x *= taper;
      y *= taper;
    }
    
    // Q: COMPOUND TWIST - XY plane spiraling
    if (q !== 0) {
      const twist = q * TWIST_STRENGTH * 0.025 * (x + y);
      const cosT = Math.cos(twist);
      const sinT = Math.sin(twist);
      const newX = x * cosT - y * sinT;
      const newY = x * sinT + y * cosT;
      x = newX;
      y = newY;
    }
    
    // R: HELIX WRAP - Spiral around Z
    if (r !== 0) {
      const theta = Math.atan2(y, x) + r * TWIST_STRENGTH * 0.02 * z;
      const radius = Math.sqrt(x * x + y * y) * (1 + r * MORPH_STRENGTH * 0.01);
      x = radius * Math.cos(theta);
      y = radius * Math.sin(theta);
    }
    
    // S: Y-STRETCH - Vertical oscillating stretch
    if (s !== 0) {
      const stretch = 1 + s * MORPH_STRENGTH * 0.025 * Math.sin(z * 4);
      y *= stretch;
      x += s * WAVE_STRENGTH * 0.018 * Math.sin(u * 10);
    }
    
    // T: X-SQUEEZE - Horizontal compression waves
    if (t !== 0) {
      const squeeze = 1 + t * MORPH_STRENGTH * 0.02 * Math.cos(x * 4);
      x *= squeeze;
      z += t * WAVE_STRENGTH * 0.018 * Math.cos(v * 10);
    }
    
    // U: PARABOLIC BEND - Quadratic curvature
    if (uParam !== 0) {
      x += uParam * MORPH_STRENGTH * 0.03 * z * z;
      y += uParam * WAVE_STRENGTH * 0.015 * Math.sin(u * v * 10);
    }
    
    // V: COMPLEX MODULATION - Multi-harmonic surface
    if (vParam !== 0) {
      const wave = vParam * WAVE_STRENGTH * 0.018 * Math.cos(u * 7) * Math.sin(v * 9);
      x += wave;
      y += wave * 0.7;
      z += wave * 0.5;
    }
    
    // W: CHAOS FIELD - Maximum entropy morphing
    if (w !== 0) {
      const chaos = w * MORPH_STRENGTH * 0.025;
      x += chaos * Math.sin(y * 5 + z * 3);
      y += chaos * Math.cos(x * 4 + z * 2);
      z += chaos * Math.sin(x * 3 + y * 4);
    }
  } else {
    // Original complex mode - apply all parameter effects progressively
    Object.entries(UNIVERSAL_PARAMETER_EFFECTS).forEach(([paramName, effect]) => {
      const paramValue = parameters[paramName as keyof SurfaceParameters] as number || 0;
      
      if (Math.abs(paramValue) > 0.001) {
        // Apply scaling effects
        x = effect.scaling(paramValue, x);
        y = effect.scaling(paramValue, y);
        z = effect.scaling(paramValue, z);
        
        // Apply morphing effects
        const morphOffset = effect.morphing(paramValue, u, v);
        x += morphOffset * 0.3;
        y += morphOffset * 0.2;
        z += morphOffset * 0.1;
        
        // Apply twisting transformation
        [x, y, z] = effect.twisting(paramValue, [x, y, z]);
        
        // Apply extension effects
        x = effect.extension(paramValue, x);
        y = effect.extension(paramValue, y);
        z = effect.extension(paramValue, z);
      }
    });
  }
  
  return [x, y, z];
}

/**
 * Enhanced surface equation that applies universal parameter effects
 * With pure axis mode enabled by default
 */
export function enhanceWithUniversalEffects(
  originalEquation: (u: number, v: number, params: SurfaceParameters) => [number, number, number],
  params: SurfaceParameters,
  pureAxisMode: boolean = true
) {
  return (u: number, v: number): [number, number, number] => {
    // Get base coordinates from original equation
    const basePosition = originalEquation(u, v, params);
    
    // Apply universal parameter effects with pure axis mode
    return applyUniversalEffects(basePosition, u, v, params, pureAxisMode);
  };
}