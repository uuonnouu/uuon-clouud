/**
 * INVERSE FISH-BOWL SPACE MODEL
 * Mathematical visualization of inverse-lens geometric projection
 * 
 * Based on the theory that space functions as an inverse-lens geometric projection
 * where large-scale objects appear huge because the space medium stretches and 
 * flattens actual small-scale structures.
 * 
 * Root words: Optic, Geo, Fract, Meta, Holo, Scale, Curv, Proj, Dimen, Chron, Ener
 */

import { SurfaceParameters } from '../types/math';

const PHI = 1.618033988749895; // Golden ratio

/**
 * ALGORITHM 1: OPTIC-CURV PROJECTION (Inverted Lens Sphere)
 * Root words: optic + curv + lent + proj + geo
 * 
 * Space bends observational lines. Small structures appear large due to inverse curvature.
 * Formula: Ω_curv = 1 / sqrt(1 - k(x²+y²+z²))
 */
export const optic_curv_projection = {
  name: "Optic-Curv Projection (Inverted Lens Sphere)",
  equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
    const { d = 2, e = 2, f = 2, g = 0.1 } = params;
    
    // Spherical coordinates
    const theta = u * Math.PI * 2;
    const phi = v * Math.PI;
    
    // Base sphere
    const r = d;
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    
    // Curvature constant k (controlled by g parameter)
    const k = g;
    
    // Apply inverse lens curvature distortion
    const rSq = x*x + y*y + z*z;
    const denominator = Math.sqrt(Math.max(0.001, 1 - k * rSq));
    const omega = 1 / denominator;
    
    // Scale by curvature factor
    return [
      x * omega * e,
      y * omega * e,
      z * omega * f
    ];
  },
  defaultParams: {
    a: 1,
    b: 1,
    c: 1,
    d: 2,
    e: 1,
    f: 1,
    g: 0.1, // k curvature constant
    uMin: 0,
    uMax: 1,
    vMin: 0,
    vMax: 1,
    uSegments: 64,
    vSegments: 32
  }
};

/**
 * ALGORITHM 2: HOLO-FRACT SCALE (Fractal Tetra-Net)
 * Root words: holo + fract + scale + dimen
 * 
 * Whole-scale patterns repeat at micro-scale and mega-scale.
 * Formula: Λ_fract(r) = r^(-φ)
 */
export const holo_fract_scale = {
  name: "Holo-Fract Scale (Fractal Tetra-Net)",
  equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
    const { d = 3, e = 1, f = 1, g = 0.5, h = 3 } = params;
    
    // Create tetrahedral lattice structure
    const theta = u * Math.PI * 2;
    const phi = v * Math.PI;
    
    const x = Math.sin(phi) * Math.cos(theta);
    const y = Math.sin(phi) * Math.sin(theta);
    const z = Math.cos(phi);
    
    // Radial distance
    const r = Math.sqrt(x*x + y*y + z*z) + 0.1;
    
    // Apply fractal scaling: r^(-φ)
    const lambda = Math.pow(r, -PHI * g);
    
    // Add tetrahedral modulation (h controls frequency)
    const tetraMod = 1 + e * 0.2 * (
      Math.sin(h * x) + 
      Math.sin(h * y) + 
      Math.sin(h * z)
    );
    
    return [
      d * x * lambda * tetraMod,
      d * y * lambda * tetraMod,
      d * z * lambda * tetraMod * f
    ];
  },
  defaultParams: {
    a: 1,
    b: 1,
    c: 1,
    d: 3,
    e: 1,
    f: 1,
    g: 0.5, // φ power factor
    h: 3,   // tetrahedral frequency
    uMin: 0,
    uMax: 1,
    vMin: 0,
    vMax: 1,
    uSegments: 64,
    vSegments: 32
  }
};

/**
 * ALGORITHM 3: META-TOPO DISTORTION (Hyperbolic Warp Plane)
 * Root words: meta + topos + curv + geo
 * 
 * The shape of the space medium defines apparent size.
 * Formula: Σ_topo = sqrt(1 + αx² + βy² + γz²)
 */
export const meta_topo_distortion = {
  name: "Meta-Topo Distortion (Hyperbolic Warp Plane)",
  equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
    const { d = 4, e = 1, f = 1, g = 0.3, h = 0.3, i = 0.3 } = params;
    
    // Base plane coordinates
    const x = (u - 0.5) * d;
    const y = (v - 0.5) * d;
    
    // Anisotropic topo-warp factors (α, β, γ)
    const alpha = g;
    const beta = h;
    const gamma = i;
    
    // Calculate z using hyperbolic distortion
    const z = Math.sqrt(1 + alpha * x*x + beta * y*y);
    
    // Apply topological distortion
    const sigma = Math.sqrt(1 + alpha * x*x + beta * y*y + gamma * z*z);
    
    return [
      x * e,
      y * e,
      z * sigma * f
    ];
  },
  defaultParams: {
    a: 1,
    b: 1,
    c: 1,
    d: 4,
    e: 1,
    f: 1,
    g: 0.3, // α - anisotropic factor
    h: 0.3, // β - anisotropic factor
    i: 0.3, // γ - anisotropic factor
    uMin: 0,
    uMax: 1,
    vMin: 0,
    vMax: 1,
    uSegments: 64,
    vSegments: 64
  }
};

/**
 * ALGORITHM 4: CHRON-GEO PATH EXTENSION (Curved Light-Tube)
 * Root words: chron + geo + proj
 * 
 * Light-paths elongate through curved space.
 * Formula: Γ_chron(t) = 1 + δt
 */
export const chron_geo_path_extension = {
  name: "Chron-Geo Path Extension (Curved Light-Tube)",
  equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
    const { d = 5, e = 0.5, f = 1, g = 0.5, h = 2 } = params;
    
    // Parametric tube
    const t = u; // time/path parameter
    const theta = v * Math.PI * 2;
    
    // Time-stretch coefficient δ
    const delta = g;
    
    // Chronological extension: 1 + δt
    const gamma = 1 + delta * t;
    
    // Curved path (helix with time extension)
    const pathRadius = e;
    const x = t * d * gamma;
    const y = pathRadius * Math.cos(theta * gamma) * Math.cos(h * t);
    const z = pathRadius * Math.sin(theta * gamma) * Math.sin(h * t);
    
    return [
      x,
      y * f,
      z * f
    ];
  },
  defaultParams: {
    a: 1,
    b: 1,
    c: 1,
    d: 5,
    e: 0.5,
    f: 1,
    g: 0.5, // δ - time-stretch coefficient
    h: 2,   // curvature frequency
    uMin: 0,
    uMax: 1,
    vMin: 0,
    vMax: 1,
    uSegments: 128,
    vSegments: 32
  }
};

/**
 * ALGORITHM 5: ENER-CURV DENSITY FIELD (Density Lattice Field)
 * Root words: ener + curv + scale
 * 
 * Energy density modifies curvature. Curvature modifies perceived scale.
 * Formula: ρ_ener = exp[-η(x²+y²+z²)]
 */
export const ener_curv_density_field = {
  name: "Ener-Curv Density Field (Density Lattice Field)",
  equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
    const { d = 3, e = 1, f = 1, g = 0.2, h = 4 } = params;
    
    // Lattice coordinates
    const theta = u * Math.PI * 2;
    const phi = v * Math.PI;
    
    const x = Math.sin(phi) * Math.cos(theta);
    const y = Math.sin(phi) * Math.sin(theta);
    const z = Math.cos(phi);
    
    // Energy-density curvature factor η
    const eta = g;
    
    // Calculate energy density: exp[-η(x²+y²+z²)]
    const rSq = x*x + y*y + z*z;
    const rho = Math.exp(-eta * rSq);
    
    // Create lattice field modulation
    const latticeMod = 1 + e * 0.3 * (
      Math.cos(h * x) * Math.cos(h * y) +
      Math.cos(h * y) * Math.cos(h * z) +
      Math.cos(h * z) * Math.cos(h * x)
    );
    
    // Apply density field scaling
    const scale = d * (1 + rho);
    
    return [
      x * scale * latticeMod,
      y * scale * latticeMod,
      z * scale * latticeMod * f
    ];
  },
  defaultParams: {
    a: 1,
    b: 1,
    c: 1,
    d: 3,
    e: 1,
    f: 1,
    g: 0.2, // η - energy density factor
    h: 4,   // lattice frequency
    uMin: 0,
    uMax: 1,
    vMin: 0,
    vMax: 1,
    uSegments: 64,
    vSegments: 32
  }
};

/**
 * UNIFIED MEGA-FORMULA - COMPLETE IMPLEMENTATION
 * Combines all 5 sub-algorithms with master projection operator
 * 
 * S(x,y,z,t) = Φ_proj[Ω_curv · Λ_fract · Σ_topo · Γ_chron · ρ_ener]
 * 
 * EXPANDED FORM:
 * S(x,y,z,t) = Q / (1 + μQ)
 * Where Q = Ω_curv · Λ_fract · Σ_topo · Γ_chron · ρ_ener
 * 
 * Individual Components:
 * - Ω_curv = 1/√(1 - k(x²+y²+z²))     [Optic-Curv Projection]
 * - Λ_fract = r^(-φ)                   [Holo-Fract Scale]
 * - Σ_topo = √(1 + αx² + βy² + γz²)   [Meta-Topo Distortion]
 * - Γ_chron = 1 + δt                   [Chron-Geo Path Extension]
 * - ρ_ener = exp[-η(x²+y²+z²)]        [Ener-Curv Density Field]
 * 
 * Master Projection Operator: Φ_proj(Q) = Q / (1 + μQ)
 * Creates inverse fish-bowl magnification effect
 */
export const unified_mega_formula = {
  name: "S(x,y,z,t) - Unified Mega-Formula (Complete Inverse Fish-Bowl Space)",
  equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
    // PARAMETER MAPPING - Complete Mathematical Framework
    // a/b/c reserved for axis scaling (always 1)
    const baseScale = params.d ?? 2.0;           // Base spatial scaling
    const modulation = params.e ?? 1.0;          // Surface modulation amplitude
    const zScale = params.f ?? 1.0;              // Z-axis scaling factor
    const kCurv = params.g ?? 0.15;              // k: Curvature constant (Ω_curv)
    const phiFract = params.h ?? 0.5;            // Phi fractal power (Λ_fract)
    const alphaTopoX = params.i ?? 0.3;          // α: X-topo factor (Σ_topo)
    const deltaTime = params.j ?? 0.5;           // δ: Time-stretch coefficient (Γ_chron)
    const etaEnergy = params.k ?? 0.2;           // η: Energy density factor (ρ_ener)
    const muProjection = params.l ?? 0.1;        // μ: Projection coefficient (Φ_proj)
    const latticeFreq = params.m ?? 3.0;         // Lattice visualization frequency
    const betaTopoY = params.n ?? 0.3;           // β: Y-topo factor (Σ_topo)
    const gammaTopoZ = params.o ?? 0.3;          // γ: Z-topo factor (Σ_topo)
    const timeParam = params.time ?? 0.0;        // t: Time evolution parameter
    
    // COORDINATE SYSTEM - Spherical coordinates for unified space
    const theta = u * Math.PI * 2;     // Azimuthal angle [0, 2π]
    const phi = v * Math.PI;           // Polar angle [0, π]
    
    // BASE SPATIAL COORDINATES
    const x = Math.sin(phi) * Math.cos(theta);
    const y = Math.sin(phi) * Math.sin(theta);
    const z = Math.cos(phi);
    
    const t = timeParam; // Time evolution parameter
    const rSq = x*x + y*y + z*z;  // Radial distance squared
    const r = Math.sqrt(rSq) + 0.001; // Radial distance (avoid singularity)
    
    // ═══════════════════════════════════════════════════════════
    // COMPONENT 1: OPTIC-CURV PROJECTION
    // Ω_curv = 1/√(1 - k(x²+y²+z²))
    // ═══════════════════════════════════════════════════════════
    const omega_curv = 1.0 / Math.sqrt(Math.max(0.001, 1.0 - kCurv * rSq));
    
    // ═══════════════════════════════════════════════════════════
    // COMPONENT 2: HOLO-FRACT SCALE  
    // Λ_fract(r) = r^(-φ)
    // ═══════════════════════════════════════════════════════════
    const lambda_fract = Math.pow(r, -PHI * phiFract);
    
    // ═══════════════════════════════════════════════════════════
    // COMPONENT 3: META-TOPO DISTORTION
    // Σ_topo = √(1 + αx² + βy² + γz²)
    // ═══════════════════════════════════════════════════════════
    const sigma_topo = Math.sqrt(1.0 + alphaTopoX * x*x + betaTopoY * y*y + gammaTopoZ * z*z);
    
    // ═══════════════════════════════════════════════════════════
    // COMPONENT 4: CHRON-GEO PATH EXTENSION
    // Γ_chron(t) = 1 + δt
    // ═══════════════════════════════════════════════════════════
    const gamma_chron = 1.0 + deltaTime * t;
    
    // ═══════════════════════════════════════════════════════════
    // COMPONENT 5: ENER-CURV DENSITY FIELD
    // ρ_ener = exp[-η(x²+y²+z²)]
    // ═══════════════════════════════════════════════════════════
    const rho_ener = Math.exp(-etaEnergy * rSq);
    
    // ═══════════════════════════════════════════════════════════
    // UNIFIED COMPUTATION: Q = Ω_curv · Λ_fract · Σ_topo · Γ_chron · ρ_ener
    // ═══════════════════════════════════════════════════════════
    const Q = omega_curv * lambda_fract * sigma_topo * gamma_chron * rho_ener;
    
    // ═══════════════════════════════════════════════════════════
    // MASTER PROJECTION OPERATOR: Φ_proj(Q) = Q / (1 + μQ)
    // Creates inverse fish-bowl magnification effect
    // ═══════════════════════════════════════════════════════════
    const phi_proj = Q / (1.0 + muProjection * Q);
    
    // VISUAL ENHANCEMENT - Lattice modulation for surface detail
    const latticeMod = 1.0 + modulation * 0.2 * Math.sin(latticeFreq * theta) * Math.sin(latticeFreq * phi);
    
    // FINAL SCALE COMPUTATION
    const finalScale = baseScale * phi_proj * latticeMod;
    
    // RETURN COORDINATES WITH COMPLETE MATHEMATICAL FRAMEWORK
    return [
      x * finalScale,
      y * finalScale,
      z * finalScale * zScale
    ];
  },
  defaultParams: {
    a: 1.0,  // X-axis scaling (reserved)
    b: 1.0,  // Y-axis scaling (reserved)
    c: 1.0,  // Z-axis scaling (reserved)
    d: 2.0,  // Base spatial scaling
    e: 1.0,  // Surface modulation amplitude
    f: 1.0,  // Z-direction scaling factor
    g: 0.15, // k: Curvature constant (Ω_curv)
    h: 0.5,  // Phi fractal power factor (Λ_fract)
    i: 0.3,  // α: X-direction topo factor (Σ_topo)
    j: 0.5,  // δ: Time-stretch coefficient (Γ_chron)
    k: 0.2,  // η: Energy density factor (ρ_ener)
    l: 0.1,  // μ: Projection coefficient (Φ_proj)
    m: 3.0,  // Lattice visualization frequency
    n: 0.3,  // β: Y-direction topo factor (Σ_topo)
    o: 0.3,  // γ: Z-direction topo factor (Σ_topo)
    time: 0.0, // t: Time evolution parameter
    uMin: 0,
    uMax: 1,
    vMin: 0,
    vMax: 1,
    uSegments: 96,
    vSegments: 48
  }
};

export const INVERSE_FISHBOWL_SPACE = {
  optic_curv_projection,
  holo_fract_scale,
  meta_topo_distortion,
  chron_geo_path_extension,
  ener_curv_density_field,
  unified_mega_formula
};
