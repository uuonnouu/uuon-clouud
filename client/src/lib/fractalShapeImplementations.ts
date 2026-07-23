import { FRACTAL_FORMULAS, iterateFractal } from './fractalFormulaExtensions';

export interface FractalShapeDefinition {
  id: string;
  name: string;
  formula: string;
  category: string;
  description: string;
  getPosition: (u: number, v: number, params: Record<string, number>) => [number, number, number];
  externalModel?: string; // Path to external GLB model if applicable
}

function createFractalSurface(
  formulaId: string,
  u: number, 
  v: number, 
  params: Record<string, number>
): [number, number, number] {
  const formula = FRACTAL_FORMULAS.find(f => f.id === formulaId);
  if (!formula) return [u * 10, 0, v * 10];

  const scale = params.a ?? 2;
  const height = params.b ?? 5;
  const iterations = Math.floor((params.c ?? 50));
  
  const cx = (u - 0.5) * 4;
  const cy = (v - 0.5) * 4;
  
  const result = iterateFractal(formula, cx, cy, iterations);
  const escapeFactor = result.escaped ? result.iterations / iterations : 0;
  
  const x = cx * scale;
  const y = escapeFactor * height;
  const z = cy * scale;
  
  return [x, y, z];
}

export const FRACTAL_SHAPE_IMPLEMENTATIONS: Record<string, FractalShapeDefinition> = {
  fractal_mandelbrot_z2: {
    id: 'fractal_mandelbrot_z2',
    name: 'Mandelbrot Classic (z² + c)',
    formula: 'z² + c',
    category: 'fractal-iterations',
    description: 'Classic Mandelbrot set as 3D heightmap',
    getPosition: (u, v, p) => createFractalSurface('z2c', u, v, p)
  },
  fractal_cubic_z3: {
    id: 'fractal_cubic_z3',
    name: 'Cubic Mandelbrot (z³ + c)',
    formula: 'z³ + c',
    category: 'fractal-iterations',
    description: 'Cubic Mandelbrot with tri-symmetry spirals',
    getPosition: (u, v, p) => createFractalSurface('z3c', u, v, p)
  },
  fractal_quartic_z4: {
    id: 'fractal_quartic_z4',
    name: 'Quartic Floral (z⁴ + c)',
    formula: 'z⁴ + c',
    category: 'fractal-iterations',
    description: 'Four-fold floral symmetry',
    getPosition: (u, v, p) => createFractalSurface('z4c', u, v, p)
  },
  fractal_quintic_z5: {
    id: 'fractal_quintic_z5',
    name: 'Quintic Snowflake (z⁵ + c)',
    formula: 'z⁵ + c',
    category: 'fractal-iterations',
    description: 'Pentagonal snowflake symmetry',
    getPosition: (u, v, p) => createFractalSurface('z5c', u, v, p)
  },
  fractal_hexic_z6: {
    id: 'fractal_hexic_z6',
    name: 'Hexic Radiant (z⁶ + c)',
    formula: 'z⁶ + c',
    category: 'fractal-iterations',
    description: 'Six-fold star shapes',
    getPosition: (u, v, p) => createFractalSurface('z6c', u, v, p)
  },
  fractal_septic_z7: {
    id: 'fractal_septic_z7',
    name: 'Septic Vortex (z⁷ + c)',
    formula: 'z⁷ + c',
    category: 'fractal-iterations',
    description: 'Seven-fold vortex ropes',
    getPosition: (u, v, p) => createFractalSurface('z7c', u, v, p)
  },
  fractal_octagonal_z8: {
    id: 'fractal_octagonal_z8',
    name: 'Octagonal Mandala (z⁸ + c)',
    formula: 'z⁸ + c',
    category: 'fractal-iterations',
    description: 'Octagonal mandala patterns',
    getPosition: (u, v, p) => createFractalSurface('z8c', u, v, p)
  },
  fractal_burning_ship: {
    id: 'fractal_burning_ship',
    name: 'Burning Ship (|z|² + c)',
    formula: '|z|² + c',
    category: 'fractal-iterations',
    description: 'Jagged, fiery burning ship fractal',
    getPosition: (u, v, p) => createFractalSurface('absz2c', u, v, p)
  },
  fractal_trig_chaos: {
    id: 'fractal_trig_chaos',
    name: 'Trigonometric Chaos (z² + sin(z) + c)',
    formula: 'z² + sin(z) + c',
    category: 'fractal-iterations',
    description: 'Wave-like ripple patterns',
    getPosition: (u, v, p) => createFractalSurface('z2sinc', u, v, p)
  },
  fractal_hyper_spike: {
    id: 'fractal_hyper_spike',
    name: 'Hyper Spike (z² + tan(z) + c)',
    formula: 'z² + tan(z) + c',
    category: 'fractal-iterations',
    description: 'Sharp ridges and spikes',
    getPosition: (u, v, p) => createFractalSurface('z2tanc', u, v, p)
  },
  fractal_exponential: {
    id: 'fractal_exponential',
    name: 'Exponential Burst (eᶻ + c)',
    formula: 'eᶻ + c',
    category: 'fractal-iterations',
    description: 'Energy explosion patterns',
    getPosition: (u, v, p) => createFractalSurface('ezc', u, v, p)
  },
  fractal_spiral_jets: {
    id: 'fractal_spiral_jets',
    name: 'Spiral Jets (z·eᶻ + c)',
    formula: 'z·eᶻ + c',
    category: 'fractal-iterations',
    description: 'Swirling jet stream effects',
    getPosition: (u, v, p) => createFractalSurface('zezc', u, v, p)
  },
  fractal_logarithmic: {
    id: 'fractal_logarithmic',
    name: 'Logarithmic Shell (log(z²+1) + c)',
    formula: 'log(z²+1) + c',
    category: 'fractal-iterations',
    description: 'Spiraling shell formations',
    getPosition: (u, v, p) => createFractalSurface('logz2c', u, v, p)
  },
  fractal_self_feeding: {
    id: 'fractal_self_feeding',
    name: 'Self-Feeding (z² + z + c)',
    formula: 'z² + z + c',
    category: 'fractal-iterations',
    description: 'Dense fractal forests',
    getPosition: (u, v, p) => createFractalSurface('z2zc', u, v, p)
  },
  fractal_hyperbolic_flame: {
    id: 'fractal_hyperbolic_flame',
    name: 'Hyperbolic Flame (sinh(z) + c)',
    formula: 'sinh(z) + c',
    category: 'fractal-iterations',
    description: 'Smooth flame flow patterns',
    getPosition: (u, v, p) => createFractalSurface('sinhc', u, v, p)
  },
  fractal_energy_decay: {
    id: 'fractal_energy_decay',
    name: 'Energy Decay Field',
    formula: 'z² + γ·e^(-|z|) + c',
    category: 'fractal-iterations',
    description: 'Fading energy patterns',
    getPosition: (u, v, p) => createFractalSurface('decay', u, v, p)
  },
  fractal_wave_interference: {
    id: 'fractal_wave_interference',
    name: 'Wave Interference Field',
    formula: 'z² + μ·sin(|z|²) + c',
    category: 'fractal-iterations',
    description: 'Wave interference patterns',
    getPosition: (u, v, p) => createFractalSurface('wave', u, v, p)
  },
  fractal_potential_well: {
    id: 'fractal_potential_well',
    name: 'Potential Well Map',
    formula: 'z² + λ/(|z|+1) + c',
    category: 'fractal-iterations',
    description: 'Gravitational well visualization',
    getPosition: (u, v, p) => createFractalSurface('potential', u, v, p)
  },
  
  // ============ EXTERNAL GLB/OBJ MODELS ============
  fractal_skin_tanh_wave: {
    id: 'fractal_skin_tanh_wave',
    name: '🌊 Fractal Skin TANH Wave 64x64',
    formula: 'tanh(z) wave surface',
    category: 'fractal-iterations',
    description: 'High-resolution 64x64 fractal skin with hyperbolic tangent wave deformation',
    externalModel: '/models/fractalskin-tanh-wave.glb',
    getPosition: (u, v, p) => {
      const scale = p.a || 2;
      const freq = p.b || 3;
      const amp = p.c || 0.5;
      const x = (u - 0.5) * scale * 10;
      const z = (v - 0.5) * scale * 10;
      const wave1 = Math.tanh(Math.sin(u * Math.PI * freq) * 2);
      const wave2 = Math.tanh(Math.cos(v * Math.PI * freq) * 2);
      const y = (wave1 + wave2) * amp * scale;
      return [x, y, z];
    }
  },
  
  fractal_skin_vector_field: {
    id: 'fractal_skin_vector_field',
    name: '🔀 Fractal Skin Vector Field 256x256',
    formula: 'vector field surface',
    category: 'fractal-iterations',
    description: 'Ultra high-resolution 256x256 fractal skin with vector field deformation patterns',
    externalModel: '/models/fractalskin-vector-field.glb',
    getPosition: (u, v, p) => {
      const scale = p.a || 2;
      const x = (u - 0.5) * scale * 10;
      const z = (v - 0.5) * scale * 10;
      const vx = Math.sin(u * Math.PI * 4) * Math.cos(v * Math.PI * 2);
      const vy = Math.cos(u * Math.PI * 2) * Math.sin(v * Math.PI * 4);
      const y = (vx + vy) * (p.b || 0.5) * scale;
      return [x, y, z];
    }
  },
  
  fractal_skin_tangent_wave: {
    id: 'fractal_skin_tangent_wave',
    name: '📐 Fractal Skin Tangent Wave 256x256',
    formula: 'tan(z) wave surface',
    category: 'fractal-iterations',
    description: 'Ultra high-resolution 256x256 fractal skin with tangent wave deformation',
    externalModel: '/models/fractalskin-tangent-wave.obj',
    getPosition: (u, v, p) => {
      const scale = p.a || 2;
      const freq = p.b || 3;
      const x = (u - 0.5) * scale * 10;
      const z = (v - 0.5) * scale * 10;
      const tan1 = Math.tan(Math.min(1.5, u * Math.PI * freq * 0.3));
      const tan2 = Math.tan(Math.min(1.5, v * Math.PI * freq * 0.3));
      const y = (tan1 + tan2) * (p.c || 0.2) * scale * 0.1;
      return [x, y, z];
    }
  },
  
  fractal_skin_mandelbrot: {
    id: 'fractal_skin_mandelbrot',
    name: '🌀 Fractal Skin Mandelbrot 256x256',
    formula: 'z² + c Mandelbrot surface',
    category: 'fractal-iterations',
    description: 'Ultra high-resolution 256x256 Mandelbrot fractal heightmap surface',
    externalModel: '/models/fractalskin-mandelbrot.obj',
    getPosition: (u, v, p) => {
      const scale = p.a || 2;
      const x = (u - 0.5) * scale * 10;
      const z = (v - 0.5) * scale * 10;
      // Mandelbrot iteration approximation
      let zr = 0, zi = 0;
      const cr = (u - 0.5) * 3, ci = (v - 0.5) * 3;
      let iter = 0;
      while (zr*zr + zi*zi < 4 && iter < 20) {
        const temp = zr*zr - zi*zi + cr;
        zi = 2*zr*zi + ci;
        zr = temp;
        iter++;
      }
      const y = iter / 20 * (p.b || 1) * scale;
      return [x, y, z];
    }
  },
  
  fractal_skin_spherical_h: {
    id: 'fractal_skin_spherical_h',
    name: '🔵 Fractal Skin Spherical H 256x256',
    formula: 'spherical harmonic surface',
    category: 'fractal-iterations',
    description: 'Ultra high-resolution 256x256 spherical harmonic fractal surface',
    externalModel: '/models/fractalskin-spherical-h.obj',
    getPosition: (u, v, p) => {
      const scale = p.a || 2;
      const x = (u - 0.5) * scale * 10;
      const z = (v - 0.5) * scale * 10;
      // Spherical harmonic approximation
      const r = Math.sqrt(x*x + z*z) / scale;
      const theta = Math.atan2(z, x);
      const y = Math.sin(r * Math.PI) * Math.cos(theta * 3) * (p.b || 1) * scale * 0.3;
      return [x, y, z];
    }
  },

  // ============ AI-GENERATED ARCHETYPAL MODELS ============
  sphinx_giza: {
    id: 'sphinx_giza',
    name: '🦁 Great Sphinx of Giza (AI Model)',
    formula: 'AI-generated 3D model',
    category: 'ancient-civilizations',
    description: 'AI-generated 3D model of the Great Sphinx of Giza — lion body with human pharaoh head, nemes headdress, outstretched paws.',
    externalModel: '/models/sphinx_giza.glb',
    getPosition: (u, v, p) => {
      const scale = p.a ?? 5;
      const lenPos = u;
      const angle = v * 2 * Math.PI;
      const totalLen = scale * 3.65;
      let cx = 0, cy = 0, rw = 1, rh = 0.7;
      if (lenPos < 0.08) {
        const t = lenPos / 0.08;
        cx = -totalLen * 0.5 + lenPos * totalLen; cy = scale * 0.3; rw = scale * 0.15 * t; rh = scale * 0.12 * t;
      } else if (lenPos < 0.3) {
        const t = (lenPos - 0.08) / 0.22;
        cx = -totalLen * 0.5 + lenPos * totalLen; cy = scale * (0.3 + t * 0.1); rw = scale * (0.15 + t * 0.35); rh = scale * (0.12 + t * 0.23);
      } else if (lenPos < 0.62) {
        const t = (lenPos - 0.3) / 0.32;
        cx = -totalLen * 0.5 + lenPos * totalLen; cy = scale * 0.4; rw = scale * 0.5; rh = scale * 0.35;
      } else if (lenPos < 0.73) {
        const t = (lenPos - 0.62) / 0.11;
        cx = -totalLen * 0.5 + lenPos * totalLen; cy = scale * (0.4 + t * 0.5); rw = scale * (0.5 - t * 0.18); rh = scale * (0.35 + t * 0.08);
      } else if (lenPos < 0.83) {
        const t = (lenPos - 0.73) / 0.10;
        cx = -totalLen * 0.5 + lenPos * totalLen; cy = scale * (0.9 + t * 0.3); rw = scale * (0.32 - t * 0.12); rh = scale * (0.35 - t * 0.05);
      } else {
        const t = (lenPos - 0.83) / 0.17;
        cx = -totalLen * 0.5 + lenPos * totalLen; cy = scale * (1.2 + t * 0.05);
        rw = scale * (0.22 + Math.sin(t * Math.PI) * 0.13); rh = scale * (0.30 - t * 0.04);
      }
      return [cx, cy + rh * Math.sin(angle), rw * Math.cos(angle)];
    }
  },

  eye_of_ra: {
    id: 'eye_of_ra',
    name: '☀️ Eye of Ra — Solar Eye (AI Model)',
    formula: 'AI-generated 3D model',
    category: 'ancient-civilizations',
    description: 'AI-generated 3D model of the Eye of Ra — ancient Egyptian solar eye hieroglyph with almond eye, pupil, teardrop tail and cobra uraeus.',
    externalModel: '/models/eye_of_ra.glb',
    getPosition: (u, v, p) => {
      const scale = p.a ?? 4;
      const t = u * 2 * Math.PI;
      const depth = v * scale * 0.15;
      // Almond/eye shape: pointed at both ends
      const eyeX = Math.cos(t) * scale * 1.2;
      const eyeY = Math.sin(t) * scale * 0.45 * (1 - Math.pow(Math.cos(t), 2) * 0.2);
      // Egyptian kohl tail extending lower-right
      const tailFactor = Math.max(0, Math.cos(t - Math.PI * 1.5)) * scale * 0.3;
      return [eyeX, eyeY - tailFactor, depth];
    }
  }
};

export function getFractalShapesList(): Array<{ id: string; name: string; formula: string }> {
  return Object.values(FRACTAL_SHAPE_IMPLEMENTATIONS).map(s => ({
    id: s.id,
    name: s.name,
    formula: s.formula
  }));
}

export function generateFractalGeometry(
  shapeId: string,
  uSegments: number,
  vSegments: number,
  params: Record<string, number>
): { positions: Float32Array; normals: Float32Array; uvs: Float32Array; indices: Uint32Array } {
  const shape = FRACTAL_SHAPE_IMPLEMENTATIONS[shapeId];
  if (!shape) {
    return {
      positions: new Float32Array(0),
      normals: new Float32Array(0),
      uvs: new Float32Array(0),
      indices: new Uint32Array(0)
    };
  }

  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let j = 0; j <= vSegments; j++) {
    const v = j / vSegments;
    for (let i = 0; i <= uSegments; i++) {
      const u = i / uSegments;
      const [x, y, z] = shape.getPosition(u, v, params);
      
      positions.push(x, y, z);
      uvs.push(u, v);
      
      const eps = 0.001;
      const [px1, py1, pz1] = shape.getPosition(u + eps, v, params);
      const [px2, py2, pz2] = shape.getPosition(u, v + eps, params);
      
      const du = [px1 - x, py1 - y, pz1 - z];
      const dv = [px2 - x, py2 - y, pz2 - z];
      
      const nx = du[1] * dv[2] - du[2] * dv[1];
      const ny = du[2] * dv[0] - du[0] * dv[2];
      const nz = du[0] * dv[1] - du[1] * dv[0];
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      
      normals.push(nx / len, ny / len, nz / len);
    }
  }

  for (let j = 0; j < vSegments; j++) {
    for (let i = 0; i < uSegments; i++) {
      const a = j * (uSegments + 1) + i;
      const b = a + 1;
      const c = a + uSegments + 1;
      const d = c + 1;
      
      indices.push(a, b, d, a, d, c);
    }
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    uvs: new Float32Array(uvs),
    indices: new Uint32Array(indices)
  };
}

console.log(`🔮 Fractal Iteration Shapes loaded: ${Object.keys(FRACTAL_SHAPE_IMPLEMENTATIONS).length} visualizations`);
console.log(`   📐 Polynomial: z² to z⁸ iterations`);
console.log(`   🔥 Burning Ship & absolute-value variants`);
console.log(`   🌊 Trigonometric: sin, tan, sinh chaos`);
console.log(`   ⚡ Exponential & logarithmic dynamics`);
console.log(`   🔬 Physics-inspired: decay, wave, potential`);
