/**
 * UNIVERSAL GEOMETRIC TRANSFORMATION SYSTEM
 * Applies parameters D-M consistently across ALL 344 shapes
 * SYMMETRIC BEHAVIOR: Parameters from -180 to 180 produce mirror morphing
 * © 2025 UUON Foundation Inc. - Proprietary
 */

import { SurfaceParameters } from '../types/math';
import * as THREE from 'three';

export interface TransformationResult {
  position: [number, number, number];
  scale: number;
  rotation: number;
}

/**
 * Normalize parameter to symmetric range with sign preservation
 * This ensures -180 to 180 produces mirrored/symmetric behavior
 */
function normalizeSymmetric(value: number, maxRange: number = 180): number {
  // Clamp to valid range
  const clamped = Math.max(-maxRange, Math.min(maxRange, value));
  // Normalize to -1 to 1 for symmetric operations
  return clamped / maxRange;
}

/**
 * Apply symmetric transformation - ensures f(-x) = -f(x) or f(-x) = f(x) depending on type
 * oddSymmetry: true = f(-x) = -f(x), false = f(-x) = f(x)
 */
function symmetricTransform(value: number, normalized: number, oddSymmetry: boolean = true): number {
  if (oddSymmetry) {
    // Odd function: sign(x) * |transform|
    return Math.sign(normalized) * Math.abs(value);
  }
  // Even function: same magnitude regardless of sign
  return Math.abs(value);
}

/**
 * Apply universal D-M transformations to any 3D coordinate
 * This ensures ALL shapes respond to D-M parameters identically
 * SYMMETRIC: Parameters produce mirrored behavior from -180 to 180
 */
export function applyUniversalTransformations(
  basePosition: [number, number, number],
  u: number,
  v: number,
  params: SurfaceParameters
): [number, number, number] {
  let [x, y, z] = basePosition;

  // Extract transformation parameters - NO fallback defaults, user values of 0 are respected
  const d = params.d !== undefined ? params.d : 0;  // TWIST
  const e = params.e !== undefined ? params.e : 0;  // WAVE
  const f = params.f !== undefined ? params.f : 0;  // RIPPLE
  const g = params.g !== undefined ? params.g : 0;  // FREQUENCY (for waves/ripples)
  const h = params.h !== undefined ? params.h : 0;  // AMPLITUDE (for waves/ripples)
  const i = params.i !== undefined ? params.i : 0;  // BULGE
  const j = params.j !== undefined ? params.j : 0;  // PINCH
  const k = params.k !== undefined ? params.k : 0;  // FLARE
  const l = params.l !== undefined ? params.l : 0;  // TAPER
  const m = params.m !== undefined ? params.m : 0;  // MIRROR/SYMMETRY
  
  // Normalize all parameters to -1 to 1 range for symmetric behavior
  const dNorm = normalizeSymmetric(d);
  const eNorm = normalizeSymmetric(e);
  const fNorm = normalizeSymmetric(f);
  const gNorm = normalizeSymmetric(g);
  const hNorm = normalizeSymmetric(h);
  const iNorm = normalizeSymmetric(i);
  const jNorm = normalizeSymmetric(j);
  const kNorm = normalizeSymmetric(k);
  const lNorm = normalizeSymmetric(l);
  const mNorm = normalizeSymmetric(m);

  // MORPHING PREVENTION: Skip D parameter transforms if morphing is unwanted
  // Use 0.00001 threshold to match 5-decimal precision system
  const EPSILON = 0.00001;
  const preventMorphing = Math.abs(d) < EPSILON;

  // Skip if all transformation parameters are zero (performance optimization)
  // Use 5-decimal precision threshold to eliminate "mushy" dead zones
  const hasAnyTransformation = Math.abs(d) > EPSILON || Math.abs(e) > EPSILON || 
                                Math.abs(f) > EPSILON || Math.abs(g) > EPSILON ||
                                Math.abs(h) > EPSILON || Math.abs(i) > EPSILON || 
                                Math.abs(j) > EPSILON || Math.abs(k) > EPSILON || 
                                Math.abs(l) > EPSILON || Math.abs(m) > 0.5;

  if (!hasAnyTransformation) {
    return [x, y, z];
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // EXPANSION PARAMETERS (D-M): Morphing, Collapsing, Tessellation, Opening
  // All designed to EXPAND and OPEN shapes, not shrink them
  // ═══════════════════════════════════════════════════════════════════════════

  // D: PARAMETRIC MORPHING - Smooth surface deformation that expands outward
  if (Math.abs(d) > EPSILON) {
    const dist = Math.sqrt(x * x + y * y + z * z);
    const morphFactor = dNorm * 0.3;
    const phase = u * Math.PI * 2 + v * Math.PI;
    const morphOffset = morphFactor * (1 + Math.sin(phase) * 0.5);
    const expansion = 1 + dNorm * 0.08 * Math.sin(dist * 2);
    x *= expansion;
    y *= expansion;
    z += morphOffset;
  }

  // E: COLLAPSING/IMPLODING - Creates bowl/crater effect, expands outer regions
  if (Math.abs(e) > EPSILON) {
    const centerDist = Math.sqrt((u - 0.5) * (u - 0.5) + (v - 0.5) * (v - 0.5));
    const collapseRing = eNorm * 0.4 * Math.exp(-centerDist * 3) * (1 - centerDist * 2);
    const dist = Math.sqrt(x * x + y * y);
    const collapse = eNorm * 0.15 * Math.exp(-dist * 0.5);
    x *= (1 + collapse * 0.5);
    y *= (1 + collapse * 0.5);
    z += collapseRing - collapse * dist;
  }

  // F: TESSELLATION - Subdivision patterns that break surface into expanding facets
  if (Math.abs(f) > EPSILON) {
    const freq = 3 + Math.abs(fNorm) * 2;
    const tessU = Math.abs(Math.sin(u * Math.PI * freq));
    const tessV = Math.abs(Math.sin(v * Math.PI * freq));
    const tessOffset = fNorm * 0.25 * tessU * tessV;
    const facetFreq = 4;
    const facetX = Math.round(x * facetFreq) / facetFreq;
    const facetY = Math.round(y * facetFreq) / facetFreq;
    const offset = fNorm * 0.1;
    x += offset * Math.sign(x - facetX);
    y += offset * Math.sign(y - facetY);
    z += tessOffset;
  }

  // G: EXPANSION/OPENING - Radial outward growth that opens the shape
  if (Math.abs(g) > EPSILON) {
    const dist = Math.sqrt(x * x + y * y + z * z);
    const expand = 1 + gNorm * 0.15 * (1 + Math.sin(dist * 3) * 0.3);
    const angle = u * Math.PI * 2;
    const bloom = gNorm * 0.35 * (1 + Math.cos(angle * 5) * 0.3) * Math.pow(v, 0.5);
    x *= expand;
    y *= expand;
    z = z * expand + bloom;
  }

  // H: UNFOLDING - Separates surfaces like opening a flower or book
  if (Math.abs(h) > EPSILON) {
    const petalAngle = u * Math.PI * 2;
    const petalPhase = Math.floor(petalAngle / (Math.PI / 3)) * (Math.PI / 3);
    const unfold = hNorm * 0.4 * Math.abs(Math.sin(petalAngle - petalPhase)) * (0.5 + v * 0.5);
    const unfoldAngle = hNorm * 0.2 * Math.sign(x);
    const newX = x * Math.cos(unfoldAngle) + z * Math.sin(unfoldAngle) * Math.abs(x);
    const newZ = -x * Math.sin(unfoldAngle) * 0.5 + z * Math.cos(unfoldAngle);
    x = newX;
    z = newZ + unfold;
  }

  // I: INFLATION - Volumetric expansion like blowing up a balloon
  if (Math.abs(i) > EPSILON) {
    const dist = Math.sqrt(x * x + y * y + z * z);
    const inflate = 1 + iNorm * 0.2 / Math.max(dist, 0.1);
    const inflation = iNorm * 0.5 * Math.sin(v * Math.PI) * (1 + Math.cos(u * Math.PI * 2) * 0.2);
    x *= inflate;
    y *= inflate;
    z = z * inflate + inflation;
  }

  // J: EXTRUSION - Pulls surfaces outward along normals
  if (Math.abs(j) > EPSILON) {
    const dist = Math.sqrt(x * x + y * y + z * z);
    const extrudePattern = Math.sin(u * Math.PI) * Math.sin(v * Math.PI);
    const extrude = jNorm * 0.2;
    if (dist > 0.01) {
      const dirX = x / dist;
      const dirY = y / dist;
      const dirZ = z / dist;
      x += dirX * extrude;
      y += dirY * extrude;
      z += dirZ * extrude + jNorm * 0.45 * Math.pow(extrudePattern, 2);
    }
  }

  // K: BLOOMING - Radial spreading like flower petals opening
  if (Math.abs(k) > EPSILON) {
    const angle = Math.atan2(y, x);
    const dist = Math.sqrt(x * x + y * y);
    const petals = 6;
    const petalAngle = u * Math.PI * 2;
    const petalShape = Math.pow(Math.abs(Math.cos(petalAngle * petals / 2)), 0.7);
    const bloom = kNorm * 0.4 * petalShape * v;
    const bloomTwist = kNorm * 0.1 * dist;
    const newAngle = angle + bloomTwist;
    const expand = 1 + kNorm * 0.15;
    x = dist * expand * Math.cos(newAngle);
    y = dist * expand * Math.sin(newAngle);
    z = z * (1 + kNorm * 0.1) + bloom;
  }

  // L: RADIAL EXPANSION - Uniform outward growth from center axis
  if (Math.abs(l) > EPSILON) {
    const dist = Math.sqrt(x * x + y * y);
    const ripples = 3;
    const rippleDist = v * ripples;
    const rippleWave = Math.sin(rippleDist * Math.PI * 2) * Math.exp(-rippleDist * 0.3);
    const radialExpand = 1 + lNorm * 0.2 * (1 + Math.sin(z * 2) * 0.3);
    x *= radialExpand;
    y *= radialExpand;
    z += lNorm * 0.35 * rippleWave;
  }

  // M: SURFACE OPENING - Creates apertures/holes that widen the structure
  if (Math.abs(m) > EPSILON) {
    const numHoles = 4;
    const holeU = (u * numHoles) % 1 - 0.5;
    const holeV = (v * numHoles) % 1 - 0.5;
    const holeDist = Math.sqrt(holeU * holeU + holeV * holeV);
    const aperture = mNorm * 0.3 * Math.exp(-holeDist * 8) * (1 - holeDist * 2);
    const freq = 3;
    const gridX = Math.sin(x * freq * Math.PI);
    const gridY = Math.sin(y * freq * Math.PI);
    const opening = mNorm * 0.1 * gridX * gridY;
    const expand = 1 + Math.abs(mNorm) * 0.08;
    x = x * expand + opening * 0.5;
    y = y * expand + opening * 0.5;
    z = z * expand + aperture;
  }

  // N-W EXTENDED TRANSFORMATIONS (Added for rifle-grade precision control)
  // Extract N-W parameters
  const n = params.n !== undefined ? params.n : 0;  // TOPOLOGY
  const o = params.o !== undefined ? params.o : 0;  // CURVATURE
  const p = params.p !== undefined ? params.p : 0;  // HARMONIC
  const q = params.q !== undefined ? params.q : 0;  // PHASE
  const r = params.r !== undefined ? params.r : 0;  // SPIRAL
  const s = params.s !== undefined ? params.s : 0;  // KNOT
  const t = params.t !== undefined ? params.t : 0;  // PHI SCALE
  const paramU = params.u !== undefined ? params.u : 0;  // PHI ROTATE
  const paramV = params.v !== undefined ? params.v : 0;  // FRACTAL DEPTH
  const w = params.w !== undefined ? params.w : 0;  // NOISE AMPLITUDE
  
  // Normalize N-W
  const nNorm = normalizeSymmetric(n);
  const oNorm = normalizeSymmetric(o);
  const pNorm = normalizeSymmetric(p);
  const qNorm = normalizeSymmetric(q);
  const rNorm = normalizeSymmetric(r);
  const sNorm = normalizeSymmetric(s);
  const tNorm = normalizeSymmetric(t);
  const uuNorm = normalizeSymmetric(paramU);
  const vvNorm = normalizeSymmetric(paramV);
  const wNorm = normalizeSymmetric(w);

  // N: TOPOLOGY - Handles or genus modifications
  if (Math.abs(n) > 0.001) {
    const topoFactor = nNorm * 3.0;
    const holeRadius = Math.sqrt(x * x + y * y);
    if (holeRadius > 0.1) {
      z += topoFactor * Math.sin(holeRadius * Math.PI * 2);
    }
  }

  // O: CURVATURE - Gaussian curvature modulation
  if (Math.abs(o) > 0.001) {
    const curveFactor = oNorm * 2.0;
    const distFromCenter = Math.sqrt(x * x + y * y);
    z += curveFactor * (1 - distFromCenter) * distFromCenter;
  }

  // P: HARMONIC - Spherical harmonic displacement
  if (Math.abs(p) > 0.001) {
    const harmonicOrder = Math.max(1, Math.floor(Math.abs(pNorm) * 8));
    const harmonicAmp = pNorm * 2.0;
    x += harmonicAmp * Math.sin(harmonicOrder * u * Math.PI * 2) * Math.cos(harmonicOrder * v * Math.PI);
    y += harmonicAmp * Math.cos(harmonicOrder * u * Math.PI * 2) * Math.sin(harmonicOrder * v * Math.PI);
  }

  // Q: PHASE - Phase shift for wave interactions
  if (Math.abs(q) > 0.001) {
    const phaseShift = qNorm * Math.PI * 2;
    const phaseRadius = Math.sqrt(x * x + y * y);
    const phaseAngle = Math.atan2(y, x) + phaseShift * Math.sin(v * Math.PI);
    x = phaseRadius * Math.cos(phaseAngle);
    y = phaseRadius * Math.sin(phaseAngle);
  }

  // R: SPIRAL - Logarithmic spiral overlay
  if (Math.abs(r) > 0.001) {
    const spiralK = rNorm * 0.5;
    const spiralAngle = Math.atan2(y, x);
    const spiralRadius = Math.sqrt(x * x + y * y);
    const newRadius = spiralRadius * Math.exp(spiralK * spiralAngle);
    const clampedNewRadius = Math.max(0.01, Math.min(100, newRadius));
    x = clampedNewRadius * Math.cos(spiralAngle);
    y = clampedNewRadius * Math.sin(spiralAngle);
  }

  // S: KNOT - Trefoil/torus knot modulation
  if (Math.abs(s) > 0.001) {
    const knotP = Math.max(1, Math.floor(Math.abs(sNorm) * 5) + 2);
    const knotQ = knotP + 1;
    const knotAmp = sNorm * 2.0;
    z += knotAmp * Math.sin(knotP * u * Math.PI * 2) * Math.cos(knotQ * v * Math.PI * 2);
  }

  // T: PHI SCALE - Golden ratio based scaling
  if (Math.abs(t) > 0.001) {
    const phi = (1 + Math.sqrt(5)) / 2;
    const phiScale = 1 + tNorm * (phi - 1);
    x *= phiScale;
    y *= phiScale;
    z *= phiScale;
  }

  // U: PHI ROTATE - Golden angle rotation
  if (Math.abs(paramU) > 0.001) {
    const goldenAngle = (Math.PI * 2) / ((1 + Math.sqrt(5)) / 2);
    const rotAngle = uuNorm * goldenAngle * 2;
    const cosR = Math.cos(rotAngle);
    const sinR = Math.sin(rotAngle);
    const xRot = x * cosR - y * sinR;
    const yRot = x * sinR + y * cosR;
    x = xRot;
    y = yRot;
  }

  // V: FRACTAL DEPTH - Self-similar detail addition
  if (Math.abs(paramV) > 0.001) {
    const fractalDepth = Math.max(1, Math.floor(Math.abs(vvNorm) * 5));
    let fractalOffset = 0;
    for (let fd = 1; fd <= fractalDepth; fd++) {
      const scale = Math.pow(0.5, fd);
      fractalOffset += vvNorm * scale * Math.sin((x + y + z) * fd * Math.PI * 2);
    }
    z += fractalOffset;
  }

  // W: NOISE - Controlled chaos/noise injection
  if (Math.abs(w) > 0.001) {
    const noiseAmp = wNorm * 1.5;
    const noiseX = Math.sin(x * 7.3 + y * 13.1 + z * 17.7) * noiseAmp;
    const noiseY = Math.sin(x * 11.2 + y * 19.3 + z * 23.5) * noiseAmp;
    const noiseZ = Math.sin(x * 5.7 + y * 7.9 + z * 11.3) * noiseAmp;
    x += noiseX;
    y += noiseY;
    z += noiseZ;
  }

  // Final safety: Clamp coordinates to prevent extreme positions
  const MAX_COORD = 1000;
  x = Math.max(-MAX_COORD, Math.min(MAX_COORD, x));
  y = Math.max(-MAX_COORD, Math.min(MAX_COORD, y));
  z = Math.max(-MAX_COORD, Math.min(MAX_COORD, z));

  // Check for NaN or Infinity
  if (!isFinite(x) || !isFinite(y) || !isFinite(z)) {
    console.warn('⚠️ Transformation produced invalid coordinates, returning origin');
    return [0, 0, 0];
  }

  return [x, y, z];
}

/**
 * Apply transformations to a mesh directly (for real-time preview)
 */
export function applyTransformationsToMesh(
  mesh: { geometry: THREE.BufferGeometry },
  params: SurfaceParameters
): void {
  const geometry = mesh.geometry as THREE.BufferGeometry;
  const positions = geometry.attributes.position;

  if (!positions) return;

  const array = positions.array as Float32Array;
  const uSegments = params.uSegments || 64;
  const vSegments = params.vSegments || 48;

  // Store original positions if not already stored
  if (!(geometry.userData as any).originalPositions) {
    (geometry.userData as any).originalPositions = new Float32Array(array);
  }

  const original = (geometry.userData as any).originalPositions;

  for (let i = 0; i < original.length; i += 3) {
    const idx = Math.floor(i / 3);
    const u = (idx % (uSegments + 1)) / uSegments;
    const v = Math.floor(idx / (uSegments + 1)) / vSegments;

    const basePos: [number, number, number] = [
      original[i],
      original[i + 1],
      original[i + 2]
    ];

    const [x, y, z] = applyUniversalTransformations(basePos, u, v, params);

    array[i] = x;
    array[i + 1] = y;
    array[i + 2] = z;
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();
}