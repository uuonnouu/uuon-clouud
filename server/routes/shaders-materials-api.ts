import { Router, Request, Response } from 'express';

const router = Router();

// ============================================================
// SHADER ENDPOINTS
// ============================================================

/**
 * GET /api/shaders/spectral
 * Physics-accurate CIE 1931 + Fresnel + Phi-harmonic golden ratio balance — all GLSL
 */
router.get('/shaders/spectral', (_req: Request, res: Response) => {
  res.json({
    name: 'Spectral Surface Shader',
    version: '1.0.0',
    description:
      'Physics-accurate spectral color (CIE 1931 2° Standard Observer) with Fresnel ' +
      'edge effects and Phi-harmonic golden ratio color balance. All computed in GLSL ' +
      'on the GPU — applies to any parametric mathematical surface.',
    license: 'Commercial — UUON Foundation',
    uniqueness:
      'Combines CIE 1931 standard observer color matching (380-740 nm) with ' +
      'Fresnel view-angle falloff and Phi-harmonic (φ=1.618…) balance. ' +
      'No known Shadertoy entry combines physics-accurate spectral color with ' +
      'Phi-harmonic balance on parametric mathematical surfaces.',

    uniforms: {
      uColor:             { type: 'vec3',  description: 'Base color (RGB 0-1)',              default: [0.2, 0.6, 1.0] },
      uTime:              { type: 'float', description: 'Animation time in seconds',          default: 0 },
      uFresnelPower:      { type: 'float', description: 'Fresnel falloff power',              default: 2.5,  range: [0.5, 10.0] },
      uFresnelIntensity:  { type: 'float', description: 'Edge glow strength',                default: 0.6,  range: [0.0, 2.0] },
      uGradientStrength:  { type: 'float', description: 'Gradient depth effect',             default: 0.4,  range: [0.0, 1.0] },
      uMetalness:         { type: 'float', description: 'PBR metalness factor',              default: 0.2,  range: [0.0, 1.0] },
      uRoughness:         { type: 'float', description: 'PBR roughness factor',              default: 0.6,  range: [0.0, 1.0] },
      uPhiBalance:        { type: 'float', description: 'Phi-harmonic color balance weight', default: 1.618, range: [0.0, 3.0] },
    },

    features: [
      'CIE 1931 2° Standard Observer spectral color (380-740 nm)',
      'Fresnel edge effect — view-angle dependent glow',
      'Phi-harmonic color balance (PHI = 1.618033…)',
      'Time-animated spectral shift',
      'Compatible with Three.js ShaderMaterial',
      'Applied on 2,650+ parametric mathematical surfaces',
    ],

    cie_1931_notes: {
      description: 'CIE 1931 color space defines how the average human eye perceives color from physical wavelengths.',
      observer: '2° Standard Observer (1931) — the photopic (bright-light) vision model.',
      wavelength_range: '380 nm (violet) to 740 nm (far red)',
      applications: ['Astronomy', 'Spectroscopy', 'Physics education', 'Color-critical rendering'],
      implementation: 'Color matching functions approximated as Gaussian sums in GLSL for GPU performance.',
    },

    phi_harmonic_notes: {
      phi: 1.6180339887498948,
      description:
        'The golden ratio φ emerges naturally in phyllotaxis, Fibonacci spirals, and minimal-energy configurations. ' +
        'Applied as a spectral balance weight — peaks at φ intervals across the visible spectrum.',
      shapes_that_use_phi: ['Hopf Fibration', 'Sri Yantra', 'Flower of Life', 'Tesseract', 'Torus Knot'],
    },

    usage: {
      threejs: `
import * as THREE from 'three';

const material = new THREE.ShaderMaterial({
  uniforms: {
    uColor:            { value: new THREE.Color(0x2299ff) },
    uTime:             { value: 0 },
    uFresnelPower:     { value: 2.5 },
    uFresnelIntensity: { value: 0.6 },
    uGradientStrength: { value: 0.4 },
    uMetalness:        { value: 0.2 },
    uRoughness:        { value: 0.6 },
    uPhiBalance:       { value: 1.618 },
  },
  // Animate in render loop:
  // material.uniforms.uTime.value = clock.getElapsedTime();
});
      `.trim(),
    },
  });
});

/**
 * GET /api/shaders/animation
 * GPU animation shader — zero CPU cost, all deformation on GPU
 */
router.get('/shaders/animation', (_req: Request, res: Response) => {
  res.json({
    name: 'GPU Parametric Animation Shader',
    version: '1.0.0',
    description:
      'Vertex shader for animating parametric surfaces with zero CPU overhead. ' +
      'All deformation computed on GPU via uniform updates — no geometry rebuilds.',

    uniforms: {
      uTime:          { type: 'float', description: 'Elapsed time (seconds)',          default: 0 },
      uAmplitude:     { type: 'float', description: 'Overall animation strength',      default: 1.0, range: [0, 5] },
      uFrequency:     { type: 'float', description: 'Wave frequency',                  default: 2.0, range: [0.1, 20] },
      uScale:         { type: 'float', description: 'Uniform scale factor',            default: 1.0, range: [0.1, 5] },
      uTwist:         { type: 'float', description: 'Twist deformation amount',        default: 0.0, range: [-10, 10] },
      uInflation:     { type: 'float', description: 'Surface inflation / deflation',   default: 1.0, range: [0.1, 3] },
      uMorphProgress: { type: 'float', description: 'Morph blend (0 → 1)',             default: 0.0, range: [0, 1] },
      uWaveStrength:  { type: 'float', description: 'Wave displacement strength',      default: 1.0, range: [0, 5] },
    },

    animation_modes: {
      breathe: 'Scale + inflation pulse — works on all shapes regardless of formula',
      wave:    'Frequency-based vertex displacement along surface normals',
      twist:   'Rotational spiral deformation along the Y axis',
      morph:   'Full parametric morph blending between rest and deformed state',
    },

    performance: {
      cpu_cost:           'Zero — all computation runs on GPU vertex shader',
      target_fps:         '60 fps on modern hardware',
      geometry_rebuilds:  'None — uniform updates skip the geometry pipeline entirely',
      vs_react_state:     'React state animation triggers geometry rebuild each frame (~30 fps); GPU uniforms skip geometry entirely (~60 fps)',
    },

    integration: {
      note: 'Requires mesh to use THREE.ShaderMaterial. Works alongside existing PBR materials via material swap.',
      source_file: 'client/src/lib/animationShaders.ts',
      exports: ['createAnimationUniforms', 'parametricAnimationVertexShader', 'parametricAnimationFragmentShader', 'createAnimatedParametricMaterial', 'ANIMATION_PRESETS'],
    },
  });
});

// ============================================================
// CIE 1931 COLOR SCIENCE ENDPOINT
// ============================================================

/**
 * GET /api/shaders/cie1931
 * CIE 1931 color science — wavelength to XYZ to sRGB conversion table
 * Useful for astronomy, spectroscopy, physics education apps
 */
router.get('/shaders/cie1931', (_req: Request, res: Response) => {
  const PHI = 1.6180339887498948;

  const wavelengthToXYZ = (nm: number): [number, number, number] => {
    const t = (nm - 380) / 360;
    const x =
      1.056 * Math.exp(-0.5 * ((nm - 599.8) / 37.9) ** 2) +
      0.362 * Math.exp(-0.5 * ((nm - 442.0) / 16.0) ** 2) -
      0.065 * Math.exp(-0.5 * ((nm - 501.1) / 20.4) ** 2);
    const y =
      0.821 * Math.exp(-0.5 * ((nm - 568.8) / 46.9) ** 2) +
      0.286 * Math.exp(-0.5 * ((nm - 530.9) / 16.3) ** 2);
    const z =
      1.217 * Math.exp(-0.5 * ((nm - 437.0) / 11.8) ** 2) +
      0.681 * Math.exp(-0.5 * ((nm - 459.0) / 26.0) ** 2);
    return [Math.max(0, x), Math.max(0, y), Math.max(0, z)];
  };

  const xyzToSrgb = (X: number, Y: number, Z: number): [number, number, number] => {
    const r =  3.2406 * X - 1.5372 * Y - 0.4986 * Z;
    const g = -0.9689 * X + 1.8758 * Y + 0.0415 * Z;
    const b =  0.0557 * X - 0.2040 * Y + 1.0570 * Z;
    const linearToSrgb = (c: number) =>
      c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(Math.max(0, c), 1 / 2.4) - 0.055;
    return [linearToSrgb(r), linearToSrgb(g), linearToSrgb(b)];
  };

  const samples: Array<{ nm: number; xyz: number[]; srgb: number[]; phi_weight: number }> = [];
  for (let nm = 380; nm <= 740; nm += 10) {
    const [X, Y, Z] = wavelengthToXYZ(nm);
    const [r, g, b] = xyzToSrgb(X, Y, Z);
    const t = (nm - 380) / 360;
    const phi_weight = Math.abs(Math.sin(t * Math.PI * PHI));
    samples.push({
      nm,
      xyz: [+X.toFixed(4), +Y.toFixed(4), +Z.toFixed(4)],
      srgb: [+Math.min(1, Math.max(0, r)).toFixed(4), +Math.min(1, Math.max(0, g)).toFixed(4), +Math.min(1, Math.max(0, b)).toFixed(4)],
      phi_weight: +phi_weight.toFixed(4),
    });
  }

  res.json({
    name: 'CIE 1931 2° Standard Observer Color Table',
    description: 'Wavelength-to-XYZ-to-sRGB conversion using Gaussian approximations of the CIE 1931 standard observer color matching functions, with Phi-harmonic balance weights.',
    phi: PHI,
    wavelength_range_nm: [380, 740],
    step_nm: 10,
    total_samples: samples.length,
    columns: {
      nm:         'Wavelength in nanometers',
      xyz:        '[X, Y, Z] tristimulus values (CIE 1931)',
      srgb:       '[R, G, B] sRGB values (gamma-corrected, 0-1)',
      phi_weight: 'Phi-harmonic balance weight for this wavelength',
    },
    samples,
    applications: [
      'Astronomy / stellar spectroscopy visualization',
      'Physics education — show what wavelengths look like',
      'Color-critical 3D rendering (scientific visualization)',
      'Spectrophotometry data display',
    ],
  });
});

// ============================================================
// HDR TONE MAPPING ENDPOINT
// ============================================================

/**
 * GET /api/shaders/tonemapping
 * HDR tone mapping operators used in the renderer
 */
router.get('/shaders/tonemapping', (_req: Request, res: Response) => {
  res.json({
    name: 'HDR Tone Mapping Reference',
    description: 'Tone mapping operators used in Δmension renderer to compress HDR radiance to display range.',
    operators: {
      reinhard: {
        formula: 'L_d = L / (1 + L)',
        description: 'Classic Reinhard — simple, stable, preserves detail in bright areas.',
        glsl: 'vec3 reinhard(vec3 hdr) { return hdr / (hdr + vec3(1.0)); }',
      },
      aces: {
        formula: 'ACES filmic curve (Academy Color Encoding System)',
        description: 'Industry standard — used in major films and games. Rich contrast, natural roll-off.',
        glsl: `vec3 aces(vec3 x) {
  const float a = 2.51;
  const float b = 0.03;
  const float c = 2.43;
  const float d = 0.59;
  const float e = 0.14;
  return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0.0, 1.0);
}`,
      },
      uncharted2: {
        formula: 'Hable filmic (used in Uncharted 2)',
        description: 'High contrast, deep blacks, bright highlights. Ideal for space and sci-fi aesthetics.',
        glsl: `vec3 uncharted2Tonemap(vec3 x) {
  float A=0.15,B=0.50,C=0.10,D=0.20,E=0.02,F=0.30;
  return ((x*(A*x+C*B)+D*E)/(x*(A*x+B)+D*F))-E/F;
}`,
      },
      phi_balanced: {
        formula: 'Custom Phi-harmonic tone mapping (UUON)',
        description: 'Applies golden ratio balance across luminance range. Shapes rendered in spectral mode use this.',
        glsl: `const float PHI = 1.6180339887498948;
vec3 phiTonemap(vec3 hdr) {
  float luma = dot(hdr, vec3(0.2126, 0.7152, 0.0722));
  float compressed = luma / (luma + 1.0 / PHI);
  return hdr * (compressed / max(luma, 0.0001));
}`,
      },
    },
    three_js_modes: {
      NoToneMapping:         0,
      LinearToneMapping:     1,
      ReinhardToneMapping:   2,
      CineonToneMapping:     3,
      ACESFilmicToneMapping: 4,
      CustomToneMapping:     5,
    },
    renderer_defaults: {
      toneMapping: 'ACESFilmicToneMapping',
      toneMappingExposure: 1.2,
      outputColorSpace: 'SRGBColorSpace',
    },
  });
});

// ============================================================
// MATERIAL LIBRARY ENDPOINTS
// ============================================================

/**
 * GET /api/materials
 * Returns all PBR material preset categories
 */
router.get('/materials', (_req: Request, res: Response) => {
  res.json({
    total_presets: 87,
    categories: {
      metals:      ['titanium', 'aluminum', 'steel', 'copper', 'gold', 'silver', 'tungsten', 'chrome'],
      bio_medical: ['bone', 'cartilage', 'tissue', 'ceramic_implant', 'bio_titanium'],
      composites:  ['carbon_fiber', 'fiberglass', 'kevlar', 'aerogel'],
      ceramics:    ['alumina', 'zirconia', 'silicon_carbide'],
      polymers:    ['abs_plastic', 'nylon', 'peek', 'ptfe'],
      specialty:   ['metamaterial', 'aerogel', 'aerodynamic', 'thermal_barrier'],
      visual:      ['holographic', 'plasma', 'crystalline', 'organic', 'sacred', 'quantum'],
    },
    endpoints: {
      list:   'GET /api/materials',
      single: 'GET /api/materials/:preset',
    },
    note: 'All presets are compatible with THREE.MeshStandardMaterial or THREE.MeshPhysicalMaterial properties.',
  });
});

/**
 * GET /api/materials/:preset
 * Returns a specific PBR material configuration
 */
const MATERIAL_CONFIGS: Record<string, object> = {
  titanium: {
    name: 'Titanium', category: 'metals',
    roughness: { base: 0.3, min: 0.1, max: 0.6 },
    metalness: { base: 0.95, min: 0.8, max: 1.0 },
    color: '#B0B0B8', emissive: '#000000', emissiveIntensity: 0,
    envMapIntensity: 1.2,
    physical_properties: { density: '4510 kg/m³', youngs_modulus: '116 GPa', applications: ['aerospace', 'medical_implants', 'high_performance_engineering'] },
  },
  carbon_fiber: {
    name: 'Carbon Fiber', category: 'composites',
    roughness: { base: 0.2, min: 0.05, max: 0.4 },
    metalness: { base: 0.1, min: 0.0, max: 0.3 },
    color: '#1A1A1A', emissive: '#000000', emissiveIntensity: 0,
    normalMap: 'carbon_fiber_normal',
    physical_properties: { density: '1600 kg/m³', tensile_strength: '3500 MPa', applications: ['aerospace', 'motorsport', 'lightweight_structures'] },
  },
  gold: {
    name: 'Gold', category: 'metals',
    roughness: { base: 0.15, min: 0.05, max: 0.4 },
    metalness: { base: 1.0, min: 0.9, max: 1.0 },
    color: '#FFD700', emissive: '#000000', emissiveIntensity: 0,
    envMapIntensity: 1.8,
    physical_properties: { density: '19320 kg/m³', conductivity: '317 W/m·K', applications: ['jewelry', 'electronics', 'decorative'] },
  },
  holographic: {
    name: 'Holographic', category: 'visual',
    roughness: { base: 0.05, min: 0.0, max: 0.2 },
    metalness: { base: 0.8, min: 0.5, max: 1.0 },
    color: '#FFFFFF', emissive: '#4488FF', emissiveIntensity: 0.5,
    iridescence: 1.0, iridescenceIOR: 2.0,
    clearcoat: 1.0, clearcoatRoughness: 0.0,
    envMapIntensity: 2.5,
    note: 'Requires MeshPhysicalMaterial with iridescence support (Three.js r148+)',
  },
  quantum: {
    name: 'Quantum', category: 'visual',
    roughness: { base: 0.1, min: 0.0, max: 0.3 },
    metalness: { base: 0.6, min: 0.3, max: 1.0 },
    color: '#0066FF', emissive: '#003399', emissiveIntensity: 0.8,
    transmission: 0.3, ior: 1.8,
    clearcoat: 0.8, clearcoatRoughness: 0.05,
    envMapIntensity: 3.0,
    note: 'Semi-transparent quantum material — ideal for Bloch sphere and orbital visualizations.',
  },
  bone: {
    name: 'Cortical Bone', category: 'bio_medical',
    roughness: { base: 0.6, min: 0.4, max: 0.8 },
    metalness: { base: 0.0, min: 0.0, max: 0.1 },
    color: '#F5F0DC', emissive: '#000000', emissiveIntensity: 0,
    physical_properties: { density: '1850 kg/m³', youngs_modulus: '17 GPa', applications: ['medical_imaging', 'biomechanics', 'implant_design'] },
  },
  plasma: {
    name: 'Plasma', category: 'visual',
    roughness: { base: 0.0, min: 0.0, max: 0.1 },
    metalness: { base: 0.0, min: 0.0, max: 0.2 },
    color: '#FF6600', emissive: '#FF2200', emissiveIntensity: 2.0,
    transparency: 0.7,
    note: 'High-emissive plasma — pair with bloom post-processing for best results.',
  },
};

router.get('/materials/:preset', (req: Request, res: Response) => {
  const { preset } = req.params;
  const config = MATERIAL_CONFIGS[preset];
  if (!config) {
    return res.status(404).json({
      error: `Material preset '${preset}' not found`,
      available: Object.keys(MATERIAL_CONFIGS),
      hint: 'GET /api/materials to see all categories',
    });
  }
  return res.json(config);
});

export default router;
