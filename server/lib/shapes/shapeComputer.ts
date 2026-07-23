/**
 * SERVER-SIDE PARAMETRIC SURFACE COMPUTATION
 * © 2025 UUON Foundation Inc. - Proprietary
 * SECURITY: Shape computation happens server-side for optimization
 */

// Lazy-loaded to prevent all 2,650+ shape libraries from being required at server startup
let _unifiedShapes: Record<string, any> | null = null;
async function getUnifiedShapes() {
  if (!_unifiedShapes) {
    const mod = await import('../../../client/src/lib/unifiedShapes');
    _unifiedShapes = (mod as any).default || (mod as any).UNIFIED_SHAPES || mod;
  }
  return _unifiedShapes!;
}

export interface SurfaceComputeRequest {
  shapeId: string;
  parameters: Record<string, number>;
  uSegments: number;
  vSegments: number;
  uMin: number;
  uMax: number;
  vMin: number;
  vMax: number;
}

export interface SurfaceComputeResult {
  success: boolean;
  shapeId?: string;
  vertices?: number[];
  normals?: number[];
  uvs?: number[];
  indices?: number[];
  vertexCount?: number;
  triangleCount?: number;
  error?: string;
}

/**
 * Compute parametric surface geometry on server
 * Returns vertex data ready for Three.js BufferGeometry
 */
export async function computeSurfaceGeometry(request: SurfaceComputeRequest): Promise<SurfaceComputeResult> {
  const {
    shapeId,
    parameters,
    uSegments,
    vSegments,
    uMin,
    uMax,
    vMin,
    vMax
  } = request;

  // INVERSE FISH-BOWL SPACE MODEL - Mathematical Framework Integration
  if (shapeId === 'unified_mega_formula') {
    const { INVERSE_FISHBOWL_SPACE } = await import('../../../client/src/lib/inverseFishBowlSpace');
    const shapeFunction = INVERSE_FISHBOWL_SPACE.unified_mega_formula;

    if (!shapeFunction) {
      throw new Error(`Inverse Fish-Bowl Space function not found`);
    }

    const vertices: number[] = [];
    const indices: number[] = [];
    let vertexIndex = 0;

    // Helper function to calculate normals using finite differences
    const calculateNormal = async (equation: (u: number, v: number, params: any) => number[], u: number, v: number, params: any): Promise<number[]> => {
      const epsilon = 0.0001;

      // Calculate points for tangent vectors
      const p1 = equation(u - epsilon, v, params);
      const p2 = equation(u + epsilon, v, params);
      const p3 = equation(u, v - epsilon, params);
      const p4 = equation(u, v + epsilon, params);

      // Tangent vectors
      const tu = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
      const tv = [p3[0] - p4[0], p3[1] - p4[1], p3[2] - p4[2]];

      // Cross product for normal
      const nx = tu[1] * tv[2] - tu[2] * tv[1];
      const ny = tu[2] * tv[0] - tu[0] * tv[2];
      const nz = tu[0] * tv[1] - tu[1] * tv[0];

      // Normalize
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      if (len > 0) {
        return [nx / len, ny / len, nz / len];
      } else {
        return [0, 0, 1]; // Default to up if length is zero
      }
    };

    const uStep = (uMax - uMin) / uSegments;
    const vStep = (vMax - vMin) / vSegments;

    for (let i = 0; i <= uSegments; i++) {
      for (let j = 0; j <= vSegments; j++) {
        const u = uMin + i * uStep;
        const v = vMin + j * vStep;

        const point = shapeFunction(u, v, parameters); // Use parameters directly here
        vertices.push(point[0], point[1], point[2]);

        if (i < uSegments && j < vSegments) {
          const a = vertexIndex;
          const b = vertexIndex + 1;
          const c = vertexIndex + vSegments + 1;
          const d = vertexIndex + vSegments + 2;

          indices.push(a, b, c, b, d, c);
        }
        vertexIndex++;
      }
    }

    // Compute normals for the unified_mega_formula
    const normals: number[] = [];
    for (let i = 0; i <= uSegments; i++) {
      for (let j = 0; j <= vSegments; j++) {
        const u = uMin + i * uStep;
        const v = vMin + j * vStep;
        const normal = await calculateNormal(shapeFunction, u, v, parameters);
        normals.push(normal[0], normal[1], normal[2]);
      }
    }

    return {
      success: true,
      shapeId,
      vertices,
      normals,
      indices,
      vertexCount: vertices.length / 3,
      triangleCount: indices.length / 3
    };
  }

  const UNIFIED_SHAPES = await getUnifiedShapes();
  const shape = UNIFIED_SHAPES[shapeId];

  if (!shape) {
    return {
      success: false,
      error: `Shape '${shapeId}' not found`
    };
  }

  try {
    // Merge default parameters with user parameters
    // Filter to only numeric parameters (a-z)
    const numericParams: Record<string, number> = {};
    for (const key in parameters) {
      if (typeof parameters[key] === 'number') {
        numericParams[key] = parameters[key];
      }
    }

    const fullParams = {
      ...shape.defaultParams,
      ...numericParams,
      uMin,
      uMax,
      vMin,
      vMax,
      uSegments,
      vSegments
    } as any;

    // Compute vertices
    const vertices: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const uStep = (uMax - uMin) / uSegments;
    const vStep = (vMax - vMin) / vSegments;

    // Generate vertices
    for (let i = 0; i <= vSegments; i++) {
      const v = vMin + i * vStep;

      for (let j = 0; j <= uSegments; j++) {
        const u = uMin + j * uStep;

        // Call shape equation
        const [x, y, z] = shape.equation(u, v, fullParams);

        // Validate coordinates
        if (!isFinite(x) || !isFinite(y) || !isFinite(z)) {
          console.warn(`Invalid coordinate at u=${u}, v=${v}: [${x}, ${y}, ${z}]`);
          vertices.push(0, 0, 0);
        } else {
          vertices.push(x, y, z);
        }

        // UV coordinates
        uvs.push(j / uSegments, 1 - (i / vSegments));
      }
    }

    // Compute normals (simple finite difference approximation)
    for (let i = 0; i <= vSegments; i++) {
      for (let j = 0; j <= uSegments; j++) {
        const idx = (i * (uSegments + 1) + j) * 3;

        // Get neighboring vertices for normal calculation
        const jPrev = Math.max(0, j - 1);
        const jNext = Math.min(uSegments, j + 1);
        const iPrev = Math.max(0, i - 1);
        const iNext = Math.min(vSegments, i + 1);

        const idxPrevU = (i * (uSegments + 1) + jPrev) * 3;
        const idxNextU = (i * (uSegments + 1) + jNext) * 3;
        const idxPrevV = (iPrev * (uSegments + 1) + j) * 3;
        const idxNextV = (iNext * (uSegments + 1) + j) * 3;

        // Tangent vectors
        const tu = [
          vertices[idxNextU] - vertices[idxPrevU],
          vertices[idxNextU + 1] - vertices[idxPrevU + 1],
          vertices[idxNextU + 2] - vertices[idxPrevU + 2]
        ];

        const tv = [
          vertices[idxNextV] - vertices[idxPrevV],
          vertices[idxNextV + 1] - vertices[idxPrevV + 1],
          vertices[idxNextV + 2] - vertices[idxPrevV + 2]
        ];

        // Cross product for normal
        const nx = tu[1] * tv[2] - tu[2] * tv[1];
        const ny = tu[2] * tv[0] - tu[0] * tv[2];
        const nz = tu[0] * tv[1] - tu[1] * tv[0];

        // Normalize
        const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
        if (len > 0) {
          normals.push(nx / len, ny / len, nz / len);
        } else {
          normals.push(0, 0, 1);
        }
      }
    }

    // Generate indices for triangles
    for (let i = 0; i < vSegments; i++) {
      for (let j = 0; j < uSegments; j++) {
        const a = i * (uSegments + 1) + j;
        const b = a + uSegments + 1;
        const c = a + 1;
        const d = b + 1;

        // Two triangles per quad
        indices.push(a, b, c);
        indices.push(c, b, d);
      }
    }

    return {
      success: true,
      shapeId,
      vertices,
      normals,
      uvs,
      indices,
      vertexCount: vertices.length / 3,
      triangleCount: indices.length / 3
    };

  } catch (error: any) {
    console.error(`Error computing shape '${shapeId}':`, error);
    return {
      success: false,
      error: error.message
    };
  }
}