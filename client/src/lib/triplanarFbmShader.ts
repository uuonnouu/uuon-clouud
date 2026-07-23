/**
 * TRIPLANAR fBm SHADER INJECTION
 *
 * Replaces UV-based DataTexture lookup with world-space triplanar projection
 * + Fractional Brownian Motion (fBm) detail layer + domain warping for the
 * 10 topological procedural patterns.
 *
 * Injection strategy (required by GLSL spec):
 *   • All function definitions  → prepended to the fragment shader at global scope
 *   • Varying declarations      → prepended to both vertex and fragment shaders
 *   • Sampling / assignment     → replaces #include <map_fragment> (inside main)
 *
 * Using material.onBeforeCompile so the compiled program cache is keyed per
 * {pattern, fBmLayers, domainWarp} via customProgramCacheKey.
 */

import * as THREE from 'three';

/** Pattern IDs that activate triplanar GLSL treatment */
export const TRIPLANAR_PATTERN_IDS = new Set([
  'voronoi', 'cellular', 'fractal', 'hexagonal', 'truchet',
  'mandelbrot', 'fibonacci', 'penrose', 'delaunay', 'perlin_noise',
]);

// ---------------------------------------------------------------------------
// GLSL GLOBAL SCOPE — utilities + per-pattern core function
// Injected at the TOP of the fragment shader (before void main).
// All identifiers carry the _tp_ prefix to avoid collisions with Three.js.
// ---------------------------------------------------------------------------

const COMMON_GLSL_GLOBALS = /* glsl */`
// ---- Triplanar fBm shared utilities ----
float _tp_hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float _tp_noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(_tp_hash(i),                _tp_hash(i + vec2(1.0, 0.0)), u.x),
    mix(_tp_hash(i + vec2(0.0,1.0)), _tp_hash(i + vec2(1.0,1.0)), u.x),
    u.y) * 2.0 - 1.0;
}
float _tp_fbm(vec2 p, int octaves) {
  float v = 0.0, a = 0.5, freq = 1.0;
  for (int i = 0; i < 6; i++) {
    if (i >= octaves) break;
    v += a * _tp_noise(p * freq);
    freq *= 2.0; a *= 0.5;
  }
  return v;
}
vec2 _tp_warp(vec2 p, float s) {
  if (s < 0.001) return p;
  vec2 q = vec2(_tp_fbm(p, 3), _tp_fbm(p + vec2(5.2, 1.3), 3));
  return p + s * q;
}
`;

// Per-pattern core — each defines float _tp_core(vec2 p).
// Lives at global scope; called from the sampling block inside main().
const PATTERN_CORES: Record<string, string> = {

  voronoi: /* glsl */`
float _tp_core(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p); float d = 8.0;
  for (int x = -1; x <= 1; x++) for (int y = -1; y <= 1; y++) {
    vec2 nb = vec2(float(x),float(y));
    vec2 h  = vec2(_tp_hash(i+nb), _tp_hash(i+nb+vec2(3.7,1.1)));
    vec2 r  = nb + h - f;
    d = min(d, dot(r,r));
  }
  return clamp(1.0 - sqrt(d), 0.0, 1.0);
}`,

  cellular: /* glsl */`
float _tp_core(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  float d1 = 8.0, d2 = 8.0;
  for (int x = -1; x <= 1; x++) for (int y = -1; y <= 1; y++) {
    vec2 nb = vec2(float(x),float(y));
    vec2 r  = nb + vec2(_tp_hash(i+nb), _tp_hash(i+nb+vec2(2.3,5.7))) - f;
    float d = dot(r,r);
    if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; }
  }
  return clamp((sqrt(d2) - sqrt(d1)) * 1.5, 0.0, 1.0);
}`,

  fractal: /* glsl */`
float _tp_core(vec2 p) {
  float v = 0.0, a = 0.5;
  vec2 q = p * 0.8;
  for (int i = 0; i < 6; i++) {
    v += a * abs(sin(q.x * 3.14159) * cos(q.y * 3.14159));
    q = q * 2.0 + vec2(0.31, 0.17); a *= 0.5;
  }
  return clamp(v, 0.0, 1.0);
}`,

  hexagonal: /* glsl */`
float _tp_core(vec2 p) {
  p *= 2.0; p.x *= 0.5773503; p.y += p.x * 0.5;
  vec2 f = fract(p);
  float d = min(min(
    length(f - vec2(0.5,0.5)),
    length(f - vec2(0.0,0.5))),
    length(f - vec2(1.0,0.5)));
  return 1.0 - smoothstep(0.3, 0.48, d);
}`,

  truchet: /* glsl */`
float _tp_core(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  float s = step(0.5, _tp_hash(i));
  float r = (s > 0.5)
    ? min(length(f - vec2(1.0,0.0)) - 0.5, length(f - vec2(0.0,1.0)) - 0.5)
    : min(length(f - vec2(0.0,0.0)) - 0.5, length(f - vec2(1.0,1.0)) - 0.5);
  return clamp(1.0 - abs(r) * 6.0, 0.0, 1.0);
}`,

  mandelbrot: /* glsl */`
float _tp_core(vec2 p) {
  p = p * 0.5 - vec2(0.5, 0.0);
  vec2 z = vec2(0.0); float n = 0.0;
  for (int i = 0; i < 32; i++) {
    z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + p;
    if (dot(z,z) > 4.0) break;
    n += 1.0;
  }
  return clamp(n / 32.0, 0.0, 1.0);
}`,

  fibonacci: /* glsl */`
float _tp_core(vec2 p) {
  float r = length(p);
  float theta = atan(p.y, p.x);
  return clamp((sin(r * 6.0 - theta * 3.0) + sin(r * 1.6180339887 * 8.0)) * 0.5 + 0.5, 0.0, 1.0);
}`,

  penrose: /* glsl */`
float _tp_core(vec2 p) {
  float v = 0.0;
  for (int k = 0; k < 5; k++) {
    float a = float(k) * 1.2566370614;
    v += cos(dot(p * 1.6180339887, vec2(cos(a), sin(a))) * 4.0);
  }
  return clamp(v / 5.0 * 0.5 + 0.5, 0.0, 1.0);
}`,

  delaunay: /* glsl */`
float _tp_core(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  float d1 = 8.0, d2 = 8.0;
  for (int x = -1; x <= 1; x++) for (int y = -1; y <= 1; y++) {
    vec2 nb = vec2(float(x),float(y));
    vec2 r  = nb + vec2(_tp_hash(i+nb), _tp_hash(i+nb+vec2(1.7,3.3))) - f;
    float d = dot(r,r);
    if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; }
  }
  return clamp(1.0 - (sqrt(d2) - sqrt(d1)) * 3.0, 0.0, 1.0);
}`,

  perlin_noise: /* glsl */`
float _tp_core(vec2 p) {
  return clamp(_tp_noise(p) * 0.5 + 0.5, 0.0, 1.0);
}`,
};

// ---------------------------------------------------------------------------
// Build the two injection strings for a given pattern + settings
// ---------------------------------------------------------------------------

/**
 * Global-scope GLSL block: utilities + pattern core function.
 * Prepended to the fragment shader BEFORE void main().
 */
function buildGlobalGLSL(pattern: string): string {
  const core = PATTERN_CORES[pattern] ?? PATTERN_CORES['voronoi'];
  return `// === Triplanar fBm globals [${pattern}] ===\n${COMMON_GLSL_GLOBALS}\n${core}\n`;
}

/**
 * main()-scope GLSL block: triplanar blend + fBm detail + diffuseColor assignment.
 * Replaces #include <map_fragment> (which sits inside void main()).
 */
function buildMapReplacementGLSL(fBmLayers: number, domainWarp: number): string {
  const layers = Math.max(1, Math.min(6, Math.round(fBmLayers)));
  const warp   = domainWarp.toFixed(3);
  return /* glsl */`
  // --- Triplanar fBm sampling (inside main) ---
  {
    vec3 _tp_wts = pow(abs(vWorldNormal_tp), vec3(8.0));
    _tp_wts /= (_tp_wts.x + _tp_wts.y + _tp_wts.z + 1e-4);

    const float _tp_scale = 2.5;
    vec2 _tp_uvX = _tp_warp(vWorldPos_tp.yz * _tp_scale, ${warp});
    vec2 _tp_uvY = _tp_warp(vWorldPos_tp.xz * _tp_scale, ${warp});
    vec2 _tp_uvZ = _tp_warp(vWorldPos_tp.xy * _tp_scale, ${warp});

    float _tp_pX = clamp(_tp_core(_tp_uvX) + _tp_fbm(_tp_uvX * 1.5, ${layers}) * 0.25, 0.0, 1.0);
    float _tp_pY = clamp(_tp_core(_tp_uvY) + _tp_fbm(_tp_uvY * 1.5, ${layers}) * 0.25, 0.0, 1.0);
    float _tp_pZ = clamp(_tp_core(_tp_uvZ) + _tp_fbm(_tp_uvZ * 1.5, ${layers}) * 0.25, 0.0, 1.0);

    float _tp_val = _tp_pX * _tp_wts.x + _tp_pY * _tp_wts.y + _tp_pZ * _tp_wts.z;

    diffuseColor.rgb *= mix(vec3(0.5), vec3(_tp_val * 1.8), 0.65);
  }
`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Inject triplanar fBm into a MeshPhysicalMaterial via onBeforeCompile.
 *
 * • Removes the DataTexture map (triplanar replaces it entirely).
 * • Global-scope GLSL (function defs) is prepended to the fragment shader top.
 * • Sampling code replaces #include <map_fragment> which lives inside main().
 * • customProgramCacheKey ensures the program is recompiled when options change.
 */
export function injectTriplanarFbm(
  material: THREE.MeshPhysicalMaterial,
  options: { pattern: string; fBmLayers: number; domainWarp: number }
): void {
  const { pattern, fBmLayers, domainWarp } = options;

  // Remove DataTexture — triplanar replaces it
  material.map = null;

  const cacheKey = `triplanar_${pattern}_fbm${Math.round(fBmLayers)}_warp${domainWarp.toFixed(2)}`;
  material.customProgramCacheKey = () => cacheKey;

  const globalGLSL      = buildGlobalGLSL(pattern);
  const mapReplacement  = buildMapReplacementGLSL(fBmLayers, domainWarp);
  const varyingDecls    = 'varying vec3 vWorldPos_tp;\nvarying vec3 vWorldNormal_tp;\n';

  material.onBeforeCompile = (shader) => {
    // ---- Vertex shader ----
    // 1. Declare varyings at global scope
    shader.vertexShader = varyingDecls + shader.vertexShader;
    // 2. Populate varyings after Three.js computes worldpos
    shader.vertexShader = shader.vertexShader.replace(
      '#include <worldpos_vertex>',
      `#include <worldpos_vertex>
vWorldPos_tp    = (modelMatrix * vec4(transformed, 1.0)).xyz;
vWorldNormal_tp = normalize(mat3(transpose(inverse(modelMatrix))) * normal);`
    );

    // ---- Fragment shader ----
    // 1. Prepend varying decls + ALL function definitions at global scope
    //    (before void main — safe because these are standard function defs)
    shader.fragmentShader = varyingDecls + globalGLSL + shader.fragmentShader;

    // 2. Replace map_fragment (inside main) with sampling-only code — no defs here
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      mapReplacement
    );
  };

  material.needsUpdate = true;
}
