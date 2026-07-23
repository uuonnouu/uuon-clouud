import { SurfaceParameters } from "../types/math";
import { getSurfaceEquation } from "./parametricSurfacesClean";
import { getFixedDomain } from "./fixedMathematicalDomains";
import { applyUniversalEffects } from "./universalParameterEffects";
import * as THREE from 'three';

export interface SurfaceData {
  vertices: number[];
  normals: number[];
  uvs: number[];
  indices: number[];
}

// Surface complexity calculation for performance optimization
export function calculateSurfaceComplexity(type: string, segments: number): number {
  const baseComplexity = segments * 0.01;

  const complexityMultipliers: Record<string, number> = {
    'klein_bottle': 3.0,
    'trefoil_knot': 2.8,
    'tesseract_4d': 2.5,
    'cell_600': 2.2,
    'hyperbolic_paraboloid': 2.0,
    'riemann_surface': 1.8,
    'default': 1.0
  };

  const multiplier = complexityMultipliers[type] || complexityMultipliers['default'];
  return Math.min(baseComplexity * multiplier, 10.0);
}

export function generateParametricSurface(parameters: SurfaceParameters): SurfaceData {
  // Adaptive Level of Detail system - no hard limits!
  const complexity = parameters.uSegments * parameters.vSegments;
  const deviceMemory = (navigator as any).deviceMemory || 4; // GB
  const maxComplexity = deviceMemory * 50000; // Scale with device capability

  let uSegments = parameters.uSegments;
  let vSegments = parameters.vSegments;

  if (complexity > maxComplexity) {
    const scaleFactor = Math.sqrt(maxComplexity / complexity);
    uSegments = Math.floor(uSegments * scaleFactor);
    vSegments = Math.floor(vSegments * scaleFactor);
  }

  // Ensure minimum quality
  uSegments = Math.max(uSegments, 10);
  vSegments = Math.max(vSegments, 10);

  // Use safe parameters
  const safeParams = {
    ...parameters,
    uSegments: uSegments,
    vSegments: vSegments
  };
  
  // UV Domain: Allow user control for surface unfolding effects
  // CRITICAL FIX: Prevent UV domain collapse causing division by zero or NaN
  let { uMin, uMax, vMin, vMax } = safeParams;
  
  // Sanitize UV domain values - prevent NaN, Infinity, and undefined
  uMin = isFinite(uMin) ? uMin : 0;
  uMax = isFinite(uMax) ? uMax : Math.PI * 2;
  vMin = isFinite(vMin) ? vMin : 0;
  vMax = isFinite(vMax) ? vMax : Math.PI * 2;
  
  // Prevent UV domain collapse (uMin === uMax causes division by zero)
  const MIN_UV_RANGE = 0.001; // Minimum 0.1% range to prevent collapse
  if (Math.abs(uMax - uMin) < MIN_UV_RANGE) {
    uMax = uMin + MIN_UV_RANGE;
  }
  if (Math.abs(vMax - vMin) < MIN_UV_RANGE) {
    vMax = vMin + MIN_UV_RANGE;
  }
  
  // Prevent extreme UV ranges that cause overflow (limit to ±1000)
  const MAX_UV_RANGE = 1000;
  uMin = Math.max(-MAX_UV_RANGE, Math.min(MAX_UV_RANGE, uMin));
  uMax = Math.max(-MAX_UV_RANGE, Math.min(MAX_UV_RANGE, uMax));
  vMin = Math.max(-MAX_UV_RANGE, Math.min(MAX_UV_RANGE, vMin));
  vMax = Math.max(-MAX_UV_RANGE, Math.min(MAX_UV_RANGE, vMax));
  const { a, b, c, d, e, f, g, h, i: iParam, j: jParam, k, l, m, n, o, p, q, r, s, t, u: uParam, v: vParam, w, type, customEquation } = safeParams;

  const equation = getSurfaceEquation(type);

  const vertices: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  // Use user-specified UV domain for geometry generation (allows surface unfolding)
  const uStep = (uMax - uMin) / uSegments;
  const vStep = (vMax - vMin) / vSegments;

  // Generate vertices and UVs
  for (let i = 0; i <= vSegments; i++) {
    // Use user-controlled UV domain
    const v = vMin + i * vStep;

    for (let j = 0; j <= uSegments; j++) {
      // Use user-controlled UV domain
      const u = uMin + j * uStep;

      try {
        if (!equation?.equation) {
          vertices.push(0, 0, 0);
          continue;
        }
        
        const params: SurfaceParameters = { 
          a, b, c, d, e, f, g, h, i: iParam, j: jParam, k, l, m, n, o, p, q, r, s, t, u: uParam, v: vParam, w,
          x: 0, y: 0, z: 0, type,
          // Pass user UV domain for surface unfolding
          uMin, uMax, vMin, vMax,
          uSegments, vSegments, customEquation,
          // Enable pure axis mode for clean a,b,c control
          pureAxisMode: true
        };
        
        // Get base coordinates from equation
        const baseResult = equation.equation(u, v, params);
        const baseCoords: [number, number, number] = Array.isArray(baseResult) ? baseResult as [number, number, number] : [0, 0, 0];
        
        // CRITICAL: Apply universal parameter effects (a-m) to the base coordinates
        const [x, y, z] = applyUniversalEffects(baseCoords, u, v, params, true);

        // Validate the computed values
        if (isFinite(x) && isFinite(y) && isFinite(z)) {
          vertices.push(x, y, z);
        } else {
          // Fallback to origin if computation fails
          vertices.push(0, 0, 0);
        }

        // UV coordinates
        uvs.push(j / uSegments, i / vSegments);
      } catch (error) {
        // Fallback for computation errors
        vertices.push(0, 0, 0);
        uvs.push(j / uSegments, i / vSegments);
      }
    }
  }

  // Generate indices for triangular faces
  for (let i = 0; i < vSegments; i++) {
    for (let j = 0; j < uSegments; j++) {
      const a = i * (uSegments + 1) + j;
      const b = a + uSegments + 1;
      const c = a + 1;
      const d = b + 1;

      // Two triangles per quad
      indices.push(a, b, c);
      indices.push(b, d, c);
    }
  }

  // Calculate normals using cross product
  const computedNormals = computeNormals(vertices, indices);
  normals.push(...computedNormals);

  // Apply auto-scale normalization if enabled
  if (safeParams.autoScale) {
    const targetScale = safeParams.targetScale ?? 3;
    normalizeVertices(vertices, targetScale);
  }

  return {
    vertices,
    normals,
    uvs,
    indices
  };
}

// Normalize vertices to fit within a target scale (bounding box)
function normalizeVertices(vertices: number[], targetScale: number): void {
  if (vertices.length === 0) return;
  
  // Find bounding box
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;
  
  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i], y = vertices[i + 1], z = vertices[i + 2];
    if (isFinite(x) && isFinite(y) && isFinite(z)) {
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z);
    }
  }
  
  // Calculate current size
  const sizeX = maxX - minX;
  const sizeY = maxY - minY;
  const sizeZ = maxZ - minZ;
  const maxSize = Math.max(sizeX, sizeY, sizeZ);
  
  if (maxSize <= 0 || !isFinite(maxSize)) return;
  
  // Calculate scale factor to fit in target size
  const scaleFactor = (targetScale * 2) / maxSize;
  
  // Calculate center for centering the mesh
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const centerZ = (minZ + maxZ) / 2;
  
  // Apply normalization: center and scale
  for (let i = 0; i < vertices.length; i += 3) {
    vertices[i] = (vertices[i] - centerX) * scaleFactor;
    vertices[i + 1] = (vertices[i + 1] - centerY) * scaleFactor;
    vertices[i + 2] = (vertices[i + 2] - centerZ) * scaleFactor;
  }
}

function computeNormals(vertices: number[], indices: number[]): number[] {
  const normals = new Array(vertices.length).fill(0);
  const EPSILON = 1e-8; // Threshold for detecting degenerate triangles

  // Calculate face normals and accumulate vertex normals
  for (let i = 0; i < indices.length; i += 3) {
    const i1 = indices[i] * 3;
    const i2 = indices[i + 1] * 3;
    const i3 = indices[i + 2] * 3;

    // Get vertices
    const v1 = [vertices[i1], vertices[i1 + 1], vertices[i1 + 2]];
    const v2 = [vertices[i2], vertices[i2 + 1], vertices[i2 + 2]];
    const v3 = [vertices[i3], vertices[i3 + 1], vertices[i3 + 2]];

    // Calculate edges
    const edge1 = [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]];
    const edge2 = [v3[0] - v1[0], v3[1] - v1[1], v3[2] - v1[2]];

    // Check for degenerate edges (pole singularities cause zero-length edges)
    const edge1Len = Math.sqrt(edge1[0] * edge1[0] + edge1[1] * edge1[1] + edge1[2] * edge1[2]);
    const edge2Len = Math.sqrt(edge2[0] * edge2[0] + edge2[1] * edge2[1] + edge2[2] * edge2[2]);
    
    // Skip degenerate triangles (prevents NaN normals at sphere poles)
    if (edge1Len < EPSILON || edge2Len < EPSILON) {
      continue;
    }

    // Calculate cross product (normal)
    const normal = [
      edge1[1] * edge2[2] - edge1[2] * edge2[1],
      edge1[2] * edge2[0] - edge1[0] * edge2[2],
      edge1[0] * edge2[1] - edge1[1] * edge2[0]
    ];

    // Normalize - check for degenerate cross product (collinear edges)
    const length = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]);
    if (length < EPSILON) {
      continue; // Skip collinear/degenerate triangles
    }
    
    normal[0] /= length;
    normal[1] /= length;
    normal[2] /= length;

    // Accumulate normals for each vertex
    for (const idx of [i1, i2, i3]) {
      normals[idx] += normal[0];
      normals[idx + 1] += normal[1];
      normals[idx + 2] += normal[2];
    }
  }

  // Normalize accumulated normals
  for (let i = 0; i < normals.length; i += 3) {
    const length = Math.sqrt(normals[i] * normals[i] + normals[i + 1] * normals[i + 1] + normals[i + 2] * normals[i + 2]);
    if (length > EPSILON) {
      normals[i] /= length;
      normals[i + 1] /= length;
      normals[i + 2] /= length;
    } else {
      // For vertices with no valid normals (poles), compute analytical normal from position
      // Assuming the surface is roughly centered at origin, the outward normal is the normalized position
      const px = vertices[i], py = vertices[i + 1], pz = vertices[i + 2];
      const pLen = Math.sqrt(px * px + py * py + pz * pz);
      if (pLen > EPSILON) {
        normals[i] = px / pLen;
        normals[i + 1] = py / pLen;
        normals[i + 2] = pz / pLen;
      } else {
        // Absolute fallback: use up vector
        normals[i] = 0;
        normals[i + 1] = 1;
        normals[i + 2] = 0;
      }
    }
  }

  return normals;
}

// SurfaceGenerator class wrapper for component usage
export class SurfaceGenerator {
  private knownShapeTypes: Set<string> = new Set([
    'sphere', 'torus', 'mobius_strip', 'klein_bottle', 'trefoil_knot',
    'seashell', 'hyperbolic_paraboloid', 'riemann_surface', 'tesseract_4d',
    'dini_surface', 'enneper_surface', 'boy_surface', 'roman_surface',
    'steiner_surface', 'crosscap', 'figure_eight_knot', 'cinquefoil_knot',
    'catenoid', 'helicoid', 'gyroid', 'scherk_surface', 'costa_surface',
    'hyperboloid', 'pseudosphere', 'astroidal_ellipsoid', 'superegg',
    'superformula', 'heart', 'parametric_torus', 'twisted_torus',
    'kuen_surface', 'bour_surface', 'breather_surface', 'bohemian_dome'
  ]);

  generate(parameters: any): SurfaceData {
    return generateParametricSurface(parameters);
  }
  
  generateSurface(parameters: any): THREE.BufferGeometry {
    const data = generateParametricSurface(parameters);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(data.vertices, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(data.normals, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(data.uvs, 2));
    geometry.setIndex(data.indices);
    return geometry;
  }
  
  hasShapeType(type: string): boolean {
    const unifiedShapes = (globalThis as any).UNIFIED_SHAPES;
    const hasInUnified = unifiedShapes && typeof unifiedShapes === 'object' && type in unifiedShapes;
    return this.knownShapeTypes.has(type) || hasInUnified || true;
  }
  
  calculateComplexity(type: string, segments: number): number {
    return calculateSurfaceComplexity(type, segments);
  }
}