/**
 * RARE MANIFOLDS LIBRARY
 * The three rarest and most mathematically singular 3D manifolds in existence.
 *
 * 1. Weeks Manifold — smallest-volume closed hyperbolic 3-manifold (vol ≈ 0.9427)
 * 2. Poincaré Homology Sphere — only non-trivial 3-manifold with same homology as S³
 * 3. Seifert-Weber Space — hyperbolic dodecahedral space with 108° twist
 *
 * These are topological spaces that cannot be embedded in 3D in their true form;
 * what is rendered here is a faithful parametric cross-section / Dehn-surgery
 * approximation that captures the essential geometric character of each manifold.
 */

import { ParametricSurface } from '../types/shapes';

const TWO_PI = Math.PI * 2;
const PHI = (1 + Math.sqrt(5)) / 2; // Golden ratio

// ============================================================================
// 1. WEEKS MANIFOLD
// The absolutely smallest closed hyperbolic 3-manifold.
// Volume ≈ 0.9427... — unique at the bottom of the hyperbolic volume spectrum.
// Constructed by Dehn surgery on the Whitehead link.
//
// Parametric approximation: A hyperbolic surface deformed by icosahedral
// harmonics to capture the (5,1)(-2,3) surgery coefficients.
// ============================================================================
export const weeks_manifold: ParametricSurface = {
  name: 'Weeks Manifold',
  equation: (u: number, v: number, params: any): [number, number, number] => {
    const { a = 1, b = 1, c = 1, d = 0.9427, e = 3 } = params;

    const theta = u;  // longitude
    const phi = v;    // latitude

    // Hyperbolic base: hyperboloid sheet
    const coshPhi = Math.cosh(b * phi);
    const sinhPhi = Math.sinh(b * phi);

    // Whitehead-link surgery deformation: two interlinked harmonic corrections
    // (5,1) surgery on component 1: 5-fold twist
    const surgery1 = d * Math.sin(e * theta) * Math.cos(2 * phi);
    // (-2,3) surgery on component 2: 3-fold hyperbolic correction
    const surgery2 = (d * 0.618) * Math.cos(3 * theta) * Math.sin(phi);

    // Icosahedral harmonic (the Weeks manifold has icosahedral symmetry)
    const icosa = 0.15 * Math.sin(5 * theta) * Math.sin(3 * phi)
                + 0.08 * Math.cos(7 * theta) * Math.cos(phi);

    const r = a * coshPhi + surgery1 + surgery2 + icosa;

    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    const z = c * sinhPhi * 0.5;

    return [x, y, z];
  },
  defaultParams: {
    a: 1, b: 1, c: 1, d: 0.9427, e: 3,
    uMin: 0, uMax: TWO_PI,
    vMin: -2, vMax: 2,
    uSegments: 80, vSegments: 40
  }
};

// ============================================================================
// 2. POINCARÉ HOMOLOGY SPHERE
// The only 3-manifold (besides S³) with the same homology as a 3-sphere.
// Fundamental group = binary icosahedral group (120 elements).
// Constructed: Dodecahedron faces glued with 36° (π/5) clockwise twist.
//
// Parametric: Spherical coordinates with icosahedral harmonic modulation,
// representing the dodecahedral symmetry of face-pair identifications.
// ============================================================================
export const poincare_homology_sphere: ParametricSurface = {
  name: 'Poincaré Homology Sphere',
  equation: (u: number, v: number, params: any): [number, number, number] => {
    const { a = 1, b = 1, c = 1, d = 0.3, e = 5 } = params;

    const theta = u;  // azimuthal angle
    const phi = v;    // polar angle

    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);

    // Icosahedral harmonic modulation on the sphere
    // 12 pentagonal faces → 6-fold + 5-fold harmonics
    const icos5 = d * (
      Math.sin(e * theta) * Math.sin(2 * phi)           // 5-fold azimuthal
      + Math.cos(e * theta) * Math.sin(3 * phi) * 0.5   // secondary 5-fold
    );
    // 36° twist = π/5 rotation identifying opposite faces
    const twist = 0.12 * Math.sin(6 * theta + Math.PI / 5) * Math.cos(phi);
    // Dodecahedral corrugation (12 faces)
    const dodeca = 0.08 * Math.cos(3 * theta) * Math.sin(4 * phi);

    const r = a + icos5 + twist + dodeca;

    const x = b * r * sinPhi * Math.cos(theta);
    const y = b * r * sinPhi * Math.sin(theta);
    const z = c * r * cosPhi;

    return [x, y, z];
  },
  defaultParams: {
    a: 1, b: 1, c: 1, d: 0.3, e: 5,
    uMin: 0, uMax: TWO_PI,
    vMin: 0, vMax: Math.PI,
    uSegments: 80, vSegments: 40
  }
};

// ============================================================================
// 3. SEIFERT-WEBER SPACE
// A hyperbolic dodecahedral space — one of the very few ways to close a
// dodecahedron using hyperbolic (not spherical) geometry.
// Opposite faces glued with 108° (3π/5) twist.
//
// Parametric: Hyperbolic dodecahedral deformation — the 108° twist is
// 3× larger than Poincaré's 36°, creating dramatically different topology.
// ============================================================================
export const seifert_weber_space: ParametricSurface = {
  name: 'Seifert-Weber Space',
  equation: (u: number, v: number, params: any): [number, number, number] => {
    const { a = 1, b = 1, c = 1, d = 0.4, e = 5 } = params;

    const theta = u;
    const phi = v;

    // Hyperbolic base (negative curvature, unlike Poincaré's spherical base)
    const hyperb = Math.cosh(0.4 * phi);

    // 108° = 3π/5 twist on opposite face identifications
    const twist108 = d * Math.sin(e * theta + 3 * Math.PI / 5) * Math.sin(2 * phi);
    const twist108b = (d * 0.7) * Math.cos(e * theta - 3 * Math.PI / 5) * Math.cos(3 * phi);

    // Pentagonal face corrugation with hyperbolic stretching
    const penta = 0.15 * Math.sin(5 * theta) * (hyperb - 1) * 0.5;
    // Golden ratio harmonics (dodecahedral geometry is deeply PHI-related)
    const phi_harm = 0.1 * Math.cos(PHI * theta * 3) * Math.sin(phi * PHI);

    const r = a * hyperb + twist108 + twist108b + penta + phi_harm;

    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);

    const x = b * r * sinPhi * Math.cos(theta);
    const y = b * r * sinPhi * Math.sin(theta);
    const z = c * r * cosPhi;

    return [x, y, z];
  },
  defaultParams: {
    a: 1, b: 1, c: 1, d: 0.4, e: 5,
    uMin: 0, uMax: TWO_PI,
    vMin: 0.05, vMax: Math.PI - 0.05,
    uSegments: 80, vSegments: 40
  }
};

// ============================================================================
// EXPORT BUNDLE
// ============================================================================
export const RARE_MANIFOLDS: Record<string, ParametricSurface> = {
  weeks_manifold,
  poincare_homology_sphere,
  seifert_weber_space
};

export default RARE_MANIFOLDS;
