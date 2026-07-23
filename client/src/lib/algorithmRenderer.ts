/**
 * ALGORITHM RENDERER
 * Renders mathematical algorithms from semantic mappings
 * © 2025 UUON Foundation Inc.
 */

import { SEMANTIC_ALGORITHM_MAPPINGS, AlgorithmMapping } from './semanticAlgorithmMapping';
import { SurfaceParameters } from '../types/math';
// Assuming THREE is available in the environment, e.g., via an import or global
// If not, you would need to add `import * as THREE from 'three';` here.
// For the purpose of this exercise, we'll assume it's available.
declare var THREE: any; // Declare THREE to satisfy TypeScript if not imported

export interface AlgorithmRenderResult {
  vertices: Float32Array;
  normals: Float32Array;
  indices: Uint16Array;
  metadata: {
    algorithm: string;
    emoji_source: string;
    complexity: number;
    vertex_count: number;
  };
}

export class AlgorithmRenderer {

  /**
   * Render algorithm from emoji semantic mapping
   */
  static renderFromEmoji(emoji: string, customParams?: Partial<SurfaceParameters>): AlgorithmRenderResult | null {
    const mapping = SEMANTIC_ALGORITHM_MAPPINGS[emoji];
    if (!mapping) return null;

    const params = { ...mapping.parameters, ...customParams };

    switch (mapping.primary_algorithm) {
      case 'fluid_dynamics_navier_stokes':
        return this.renderFluidDynamics(mapping, params);
      case 'maxwell_equations_electromagnetic':
        return this.renderElectromagneticField(mapping, params);
      case 'korteweg_de_vries_solitons':
        return this.renderSolitonWaves(mapping, params);
      case 'stellar_structure_equations':
        return this.renderStellarStructure(mapping, params);
      case 'schrodinger_time_dependent':
        return this.renderQuantumWaveFunction(mapping, params);
      case 'cardioid_polar_equation':
        return this.renderCardioid(mapping, params);
      case 'golden_spiral_phyllotaxis':
        return this.renderGoldenSpiral(mapping, params);
      case 'rankine_vortex_model':
        return this.renderVortexField(mapping, params);
      case 'distant_matters_triforce': // Added case for the new algorithm
        return this.renderDistantMattersTriForce(mapping, params);
      case 'euclidean_distance_field': // Added case for Euclidean distance
        return this.renderEuclideanDistanceField(mapping, params);
      case 'manhattan_distance_field': // Added case for Manhattan distance
        return this.renderManhattanDistanceField(mapping, params);
      default:
        return this.renderGenericAlgorithm(mapping, params);
    }
  }

  /**
   * Fluid dynamics visualization (🔥 fire)
   */
  private static renderFluidDynamics(mapping: AlgorithmMapping, params: any): AlgorithmRenderResult {
    const segments = 64;
    const vertices: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];

    // Generate turbulent flame surface using Navier-Stokes approximation
    for (let u = 0; u <= segments; u++) {
      for (let v = 0; v <= segments; v++) {
        const uu = u / segments;
        const vv = v / segments;

        const theta = uu * Math.PI * 2;
        const height = vv * (params.a ?? 2.5);

        // Turbulence simulation
        const turbulence = params.turbulence || 0.8;
        const flicker = Math.sin(theta * 8) * Math.cos(height * 6) * turbulence;
        const base_radius = (params.b ?? 1.8) * (1 - vv * 0.7);
        const radius = base_radius + flicker * 0.3;

        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);
        const z = height + Math.sin(theta * (params.d ?? 15)) * (params.c ?? 0.3);

        vertices.push(x, y, z);

        // Calculate normals
        const nx = Math.cos(theta);
        const ny = Math.sin(theta);
        const nz = 0.1;
        const length = Math.sqrt(nx*nx + ny*ny + nz*nz);
        normals.push(nx/length, ny/length, nz/length);
      }
    }

    // Generate indices for triangulation
    for (let u = 0; u < segments; u++) {
      for (let v = 0; v < segments; v++) {
        const i1 = u * (segments + 1) + v;
        const i2 = i1 + 1;
        const i3 = (u + 1) * (segments + 1) + v;
        const i4 = i3 + 1;

        indices.push(i1, i2, i3, i2, i4, i3);
      }
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
      metadata: {
        algorithm: mapping.primary_algorithm,
        emoji_source: mapping.emoji,
        complexity: mapping.complexity_level,
        vertex_count: vertices.length / 3
      }
    };
  }

  /**
   * Electromagnetic field visualization (⚡ lightning)
   */
  private static renderElectromagneticField(mapping: AlgorithmMapping, params: any): AlgorithmRenderResult {
    const vertices: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];

    // Generate electromagnetic field lines
    const field_lines = 12;
    const points_per_line = 64;

    for (let line = 0; line < field_lines; line++) {
      const angle = (line / field_lines) * Math.PI * 2;

      for (let point = 0; point <= points_per_line; point++) {
        const t = point / points_per_line;
        const field_strength = params.electric_field || 2.0;

        // Electric field spiral
        const x = (params.a ?? 3.0) * t * Math.cos(angle + t * Math.PI * 4);
        const y = (params.a ?? 3.0) * t * Math.sin(angle + t * Math.PI * 4);
        const z = (params.c ?? 8.0) * t + Math.sin(t * Math.PI * 6) * field_strength * 0.3;

        vertices.push(x, y, z);

        // Field direction normals
        const nx = -Math.sin(angle + t * Math.PI * 4);
        const ny = Math.cos(angle + t * Math.PI * 4);
        const nz = 0.2;
        normals.push(nx, ny, nz);

        if (point > 0) {
          const i = line * (points_per_line + 1) + point;
          indices.push(i - 1, i);
        }
      }
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
      metadata: {
        algorithm: mapping.primary_algorithm,
        emoji_source: mapping.emoji,
        complexity: mapping.complexity_level,
        vertex_count: vertices.length / 3
      }
    };
  }

  /**
   * Cardioid heart shape (❤️)
   */
  private static renderCardioid(mapping: AlgorithmMapping, params: any): AlgorithmRenderResult {
    const segments = 128;
    const vertices: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];

    // Generate 3D cardioid surface
    for (let u = 0; u <= segments; u++) {
      for (let v = 0; v <= segments/4; v++) {
        const theta = (u / segments) * Math.PI * 2;
        const phi = (v / (segments/4)) * Math.PI;

        // Cardioid equation: r = a(1 + cos θ)
        const a = params.a ?? 1.6;
        const r = a * (1 + Math.cos(theta));

        // 3D heart surface
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi) - a * 0.5;

        vertices.push(x, y, z);

        // Surface normals
        const nx = Math.sin(phi) * Math.cos(theta);
        const ny = Math.sin(phi) * Math.sin(theta);
        const nz = Math.cos(phi);
        normals.push(nx, ny, nz);
      }
    }

    // Generate triangular mesh indices
    for (let u = 0; u < segments; u++) {
      for (let v = 0; v < segments/4; v++) {
        const i1 = u * (segments/4 + 1) + v;
        const i2 = i1 + 1;
        const i3 = (u + 1) * (segments/4 + 1) + v;
        const i4 = i3 + 1;

        indices.push(i1, i2, i3, i2, i4, i3);
      }
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
      metadata: {
        algorithm: mapping.primary_algorithm,
        emoji_source: mapping.emoji,
        complexity: mapping.complexity_level,
        vertex_count: vertices.length / 3
      }
    };
  }

  /**
   * Distant Matters Tri-Force visualization
   */
  private static renderDistantMattersTriForce(mapping: AlgorithmMapping, params: any): AlgorithmRenderResult {
    const segments = 64;
    const vertices: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];
    const colors: number[] = [];

    const radius = params.radius || 2;
    const height_scale = params.height_scale || 1.5; // Modulation for overall height
    const minkowski_q = Math.max(1, params.minkowski_q || 3); // Minkowski parameter
    const color_intensity = params.color_intensity || 0.3; // Intensity for distance-based coloring

    let vertexIndex = 0;

    // Create three interlocked triangular patterns representing the three distance functions
    for (let pattern = 0; pattern < 3; pattern++) {
      const angle_offset = (pattern * Math.PI * 2) / 3;
      // Define colors for each pattern: Red, Green, Blue
      const color = pattern === 0 ? [1, color_intensity, color_intensity] :
                    pattern === 1 ? [color_intensity, 1, color_intensity] :
                    [color_intensity, color_intensity, 1];

      for (let i = 0; i <= segments; i++) {
        for (let j = 0; j <= segments; j++) {
          const theta = (i / segments) * Math.PI * 2 + angle_offset;
          const phi = (j / segments) * Math.PI;

          // Base spherical coordinates
          let x = Math.sin(phi) * Math.cos(theta);
          let y = Math.sin(phi) * Math.sin(theta);
          let z = Math.cos(phi);

          // Apply distance function modulations
          let distance_factor = 1;

          if (pattern === 0) { // Euclidean
            const euclidean_dist = Math.sqrt(x*x + y*y + z*z);
            distance_factor = 1 + color_intensity * Math.sin(euclidean_dist * (params.euclidean_freq || 10));
          } else if (pattern === 1) { // Manhattan
            const manhattan_dist = Math.abs(x) + Math.abs(y) + Math.abs(z);
            distance_factor = 1 + color_intensity * Math.cos(manhattan_dist * (params.manhattan_freq || 8));
          } else { // Minkowski
            const minkowski_dist = Math.pow(Math.pow(Math.abs(x), minkowski_q) +
                                          Math.pow(Math.abs(y), minkowski_q) +
                                          Math.pow(Math.abs(z), minkowski_q), 1/minkowski_q);
            distance_factor = 1 + color_intensity * Math.sin(minkowski_dist * (params.minkowski_freq || 6));
          }

          // Apply tri-force triangular shaping (makes the overall shape more triangular)
          const triangular_factor = Math.abs(Math.sin(theta * 3)) * 0.5 + 0.5;
          distance_factor *= triangular_factor;

          // Scale and position vertices
          const current_radius = radius * distance_factor;
          x *= current_radius;
          y *= current_radius;
          // Z-axis modulation based on parameter 'u' (if provided, else default) and theta
          z *= height_scale * (params.z_mod || 1.0) + Math.sin(theta * (params.z_phase || 15)) * (params.z_amp || 0.5);

          vertices.push(x, y, z);
          colors.push(color[0], color[1], color[2]);

          // Generate indices for triangulation
          if (i < segments && j < segments) {
            const idx0 = vertexIndex + i * (segments + 1) + j;
            const idx1 = vertexIndex + (i + 1) * (segments + 1) + j;
            const idx2 = vertexIndex + (i + 1) * (segments + 1) + (j + 1);
            const idx3 = vertexIndex + i * (segments + 1) + (j + 1);

            indices.push(idx0, idx1, idx3);
            indices.push(idx1, idx2, idx3);
          }
        }
      }
      vertexIndex += (segments + 1) * (segments + 1);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setIndex(indices);
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    // Convert to AlgorithmRenderResult format
    return {
      vertices: geometry.getAttribute('position').array as Float32Array,
      normals: geometry.getAttribute('normal').array as Float32Array,
      indices: geometry.getIndex() as Uint16Array,
      metadata: {
        algorithm: mapping.primary_algorithm,
        emoji_source: mapping.emoji,
        complexity: mapping.complexity_level,
        vertex_count: vertices.length / 3
      }
    };
  }

  /**
   * Euclidean distance field visualization
   */
  private static renderEuclideanDistanceField(mapping: AlgorithmMapping, params: any): AlgorithmRenderResult {
    const segments = 64;
    const vertices: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];

    const radius_scale = params.radius_scale || 1.5;
    const freq_x = params.freq_x || 4;
    const freq_y = params.freq_y || 4;
    const amplitude = params.amplitude || 0.8;
    const decay = params.decay || 0.5;

    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const u = i / segments;
        const v = j / segments;

        const x = (u - 0.5) * 4;
        const y = (v - 0.5) * 4;

        // Euclidean distance from center
        const euclidean_dist = Math.sqrt(x*x + y*y);

        // Height based on distance field
        const height_factor = amplitude * Math.sin(euclidean_dist * freq_x) * Math.exp(-euclidean_dist * decay);
        const z = height_factor;

        vertices.push(x, y, z);

        // Normals for a flat plane modulated by height
        const nx = 0; // Simplified normals for this plane-based visualization
        const ny = 0;
        const nz = 1;
        normals.push(nx, ny, nz);

        // Generate indices
        if (i < segments && j < segments) {
          const i1 = i * (segments + 1) + j;
          const i2 = i1 + 1;
          const i3 = (i + 1) * (segments + 1) + j;
          const i4 = i3 + 1;

          indices.push(i1, i2, i3, i2, i4, i3);
        }
      }
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
      metadata: {
        algorithm: mapping.primary_algorithm,
        emoji_source: mapping.emoji,
        complexity: mapping.complexity_level,
        vertex_count: vertices.length / 3
      }
    };
  }

  /**
   * Manhattan distance field visualization
   */
  private static renderManhattanDistanceField(mapping: AlgorithmMapping, params: any): AlgorithmRenderResult {
    const segments = 64;
    const vertices: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];

    const amplitude = params.amplitude || 0.8;
    const freq = params.freq || 4;
    const decay = params.decay || 0.5;

    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const u = i / segments;
        const v = j / segments;

        const x = (u - 0.5) * 4;
        const y = (v - 0.5) * 4;

        // Manhattan distance (L1 norm)
        const manhattan_dist = Math.abs(x) + Math.abs(y);

        // Height based on distance field with characteristic diamond pattern
        const height_factor = amplitude * Math.cos(manhattan_dist * freq) * Math.exp(-manhattan_dist * decay);
        const z = height_factor;

        vertices.push(x, y, z);

        // Normals for a flat plane modulated by height
        const nx = 0; // Simplified normals
        const ny = 0;
        const nz = 1;
        normals.push(nx, ny, nz);

        // Generate indices
        if (i < segments && j < segments) {
          const i1 = i * (segments + 1) + j;
          const i2 = i1 + 1;
          const i3 = (i + 1) * (segments + 1) + j;
          const i4 = i3 + 1;

          indices.push(i1, i2, i3, i2, i4, i3);
        }
      }
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
      metadata: {
        algorithm: mapping.primary_algorithm,
        emoji_source: mapping.emoji,
        complexity: mapping.complexity_level,
        vertex_count: vertices.length / 3
      }
    };
  }


  /**
   * Generic algorithm renderer for unsupported algorithms
   */
  private static renderGenericAlgorithm(mapping: AlgorithmMapping, params: any): AlgorithmRenderResult {
    // Simple sphere as fallback
    const segments = 32;
    const vertices: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];

    for (let u = 0; u <= segments; u++) {
      for (let v = 0; v <= segments; v++) {
        const theta = (u / segments) * Math.PI;
        const phi = (v / segments) * Math.PI * 2;

        const radius = params.a ?? 1.0;
        const x = radius * Math.sin(theta) * Math.cos(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(theta);

        vertices.push(x, y, z);
        normals.push(x/radius, y/radius, z/radius);
      }
    }

    for (let u = 0; u < segments; u++) {
      for (let v = 0; v < segments; v++) {
        const i1 = u * (segments + 1) + v;
        const i2 = i1 + 1;
        const i3 = (u + 1) * (segments + 1) + v;
        const i4 = i3 + 1;

        indices.push(i1, i2, i3, i2, i4, i3);
      }
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
      metadata: {
        algorithm: 'generic_fallback',
        emoji_source: mapping.emoji,
        complexity: 1,
        vertex_count: vertices.length / 3
      }
    };
  }

  // Additional algorithm implementations would go here...
  private static renderSolitonWaves(mapping: AlgorithmMapping, params: any): AlgorithmRenderResult {
    return this.renderGenericAlgorithm(mapping, params);
  }

  private static renderStellarStructure(mapping: AlgorithmMapping, params: any): AlgorithmRenderResult {
    return this.renderGenericAlgorithm(mapping, params);
  }

  private static renderQuantumWaveFunction(mapping: AlgorithmMapping, params: any): AlgorithmRenderResult {
    return this.renderGenericAlgorithm(mapping, params);
  }

  private static renderGoldenSpiral(mapping: AlgorithmMapping, params: any): AlgorithmRenderResult {
    return this.renderGenericAlgorithm(mapping, params);
  }

  private static renderVortexField(mapping: AlgorithmMapping, params: any): AlgorithmRenderResult {
    return this.renderGenericAlgorithm(mapping, params);
  }
  // F-H4: Finite point validation helper
  private static isFinitePoint(x: number, y: number, z: number): boolean {
  return Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z);
}

// F-H4: Safe vertex insertion with fallback
private static addVertex(vertices: number[], x: number, y: number, z: number, lastValid: [number, number, number] | null): [number, number, number] {
  if (this.isFinitePoint(x, y, z)) {
    vertices.push(x, y, z);
    return [x, y, z];
  } else {
    // Use last valid point instead of [0,0,0]
    if (lastValid) {
      vertices.push(lastValid[0], lastValid[1], lastValid[2]);
      return lastValid;
    }
    // Fallback to origin only if no prior valid point
    vertices.push(0, 0, 0);
    return [0, 0, 0];
  }
}
}
