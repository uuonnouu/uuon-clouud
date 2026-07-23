
// anatomy-engine-v2.ts
// Upgraded: supports "parametric", "mesh", and "hybrid" anatomy shapes.
// Exports async loaders, deformation appliers, and a model manifest (mapping to your systems).

/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader"; // types only
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export type SurfaceParameters = {
  a?: number;
  b?: number;
  c?: number;
  d?: number;
  e?: number;
  f?: number;
  time?: number;
  uSegments?: number;
  vSegments?: number;
  foldAmount?: number;
  heartbeat?: number;
  breathing?: number;
};

export type DeformationFunction = (
  position: { x: number; y: number; z: number },
  normal: { x: number; y: number; z: number } | null,
  uv: { u: number; v: number } | null,
  params: SurfaceParameters,
  vertexIndex?: number
) => { x: number; y: number; z: number };

export interface AnatomyStructure {
  id: string; // unique key
  name: string;
  system?: string;
  type: "parametric" | "mesh" | "hybrid";
  // for parametric:
  equation?: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams?: Partial<SurfaceParameters>;
  // for mesh/hybrid:
  meshURL?: string; // relative path or URL to .glb/.gltf
  // for hybrid:
  deformationFunction?: DeformationFunction;
  description?: string;
  metadata?: Record<string, any>;
}

/* ---------------------------
   Registry: keep your existing procedural shapes, but add mesh entries
   --------------------------- */
export const HUMAN_ANATOMY_SHAPES: Record<string, AnatomyStructure> = {
  // Example: keep your parametric heart (converted to parametric type)
  heart_4_chambers_parametric: {
    id: "heart_4_chambers_parametric",
    name: "Heart (Parametric)",
    system: "Cardiovascular",
    type: "parametric",
    description: "Original parametric approximation (keeps legacy behavior).",
    equation: (u, v, params) => {
      const d = params.d ?? 1;
      const scale = d;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const heartX = scale * (1 + Math.cos(theta)) * Math.cos(theta) * 0.5;
      const heartY = scale * (1 + Math.cos(theta)) * Math.sin(theta) * 0.5;
      const heartZ = scale * Math.sin(phi) * 0.3;
      const septalWall = 0.05 * scale * Math.sin(theta * 4);
      const atrialSeparation = phi < Math.PI * 0.6 ? 0.1 * scale * Math.sin(theta * 2) : 0;
      if (phi < Math.PI * 0.6) {
        return [heartX * 0.8 + atrialSeparation, heartY * 0.8, heartZ + scale * 0.3];
      } else {
        return [heartX + septalWall, heartY, heartZ - scale * 0.2];
      }
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1, uSegments: 128, vSegments: 64 },
  },

  // Example: mesh-based heart (preferred realistic)
  heart_4_chambers_mesh: {
    id: "heart_4_chambers_mesh",
    name: "Heart (Real Mesh)",
    system: "Cardiovascular",
    type: "mesh",
    meshURL: "models/heart_4_chambers.glb",
    defaultParams: { a: 1, b: 1, c: 1, d: 1 },
    description: "Medical-grade heart mesh (GLB).",
  },

  // Hybrid example: real mesh + heartbeat deformation
  heart_4_chambers_hybrid: {
    id: "heart_4_chambers_hybrid",
    name: "Heart (Hybrid: mesh + heartbeat)",
    system: "Cardiovascular",
    type: "hybrid",
    meshURL: "models/heart_4_chambers.glb",
    deformationFunction: heartbeatDeformer,
    defaultParams: { heartbeat: 1.0, a: 1, b: 1, c: 1, d: 1 },
    description: "Real mesh with procedural heartbeat deformation.",
  },

  // Add other parametric entries or mesh entries...
  cerebral_cortex_parametric: {
    id: "cerebral_cortex_parametric",
    name: "Cerebral Cortex (Parametric)",
    system: "Nervous",
    type: "parametric",
    equation: (u, v, params) => {
      const d = params.d ?? 1;
      const scale = d;
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      let baseRadius = scale * Math.sin(theta);
      const frontBack = 1 + 0.15 * Math.cos(phi);
      const leftRight = 1 + 0.08 * Math.sin(phi);
      const primaryFolds = 0.08 * scale * Math.sin(theta * 6) * Math.cos(phi * 8);
      const secondaryFolds = 0.05 * scale * Math.sin(theta * 12) * Math.sin(phi * 15);
      const fineFolds = 0.02 * scale * Math.sin(theta * 20) * Math.cos(phi * 25);
      const sulcalDepth = theta < Math.PI * 0.3 ? 0.6 : theta > Math.PI * 0.7 ? 0.8 : 1.0;
      const totalFolds = (primaryFolds + secondaryFolds + fineFolds) * sulcalDepth;
      baseRadius *= frontBack * leftRight;
      const radius = baseRadius + totalFolds;
      return [radius * Math.cos(phi), radius * Math.sin(phi), scale * Math.cos(theta)];
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1, uSegments: 128, vSegments: 128 },
  },

  // Cortex mesh (hybrid recommended)
  cerebral_cortex_mesh: {
    id: "cerebral_cortex_mesh",
    name: "Cerebral Cortex (Mesh)",
    system: "Nervous",
    type: "mesh",
    meshURL: "models/cerebral_cortex_left.glb",
    defaultParams: { a: 1, b: 1, c: 1, d: 1 },
    description: "Left hemisphere cortex mesh; pair with right hemisphere mesh.",
  },

  // ... continue adding shapes or map to the manifest below
};

/* ---------------------------
   Loader utilities
   --------------------------- */

const gltfLoader = new GLTFLoader();

export async function loadGLTF(url: string): Promise<GLTF> {
  return new Promise((resolve, reject) => {
    gltfLoader.load(
      url,
      (gltf) => resolve(gltf),
      undefined,
      (err) => reject(err)
    );
  });
}

/**
 * Convert THREE.BufferGeometry to vertices + indices arrays (float32 / uint32)
 */
export function geometryToArrays(
  geometry: THREE.BufferGeometry
): { vertices: number[]; indices: number[] } {
  const pos = geometry.getAttribute("position");
  const indexAttr = geometry.getIndex();
  const vertices: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i < pos.count; i++) {
    vertices.push(pos.getX(i), pos.getY(i), pos.getZ(i));
  }
  if (indexAttr) {
    for (let i = 0; i < indexAttr.count; i++) {
      indices.push(indexAttr.getX(i));
    }
  } else {
    // generate triangle indices if none provided
    for (let i = 0; i < pos.count; i += 3) {
      indices.push(i, i + 1, i + 2);
    }
  }
  return { vertices, indices };
}

/* ---------------------------
   Deformation examples
   --------------------------- */

/**
 * Heartbeat deformer: small radial displacement based on heartbeat param and time
 */
export function heartbeatDeformer(
  position,
  normal,
  uv,
  params,
  vertexIndex = 0
) {
  const t = params.time ?? 0;
  const heartbeat = params.heartbeat ?? 1.0; // scaling of amplitude
  const freq = 1.2; // beats per second (t in seconds)
  const pulse = Math.sin(t * Math.PI * 2 * freq + (vertexIndex % 7) * 0.2) * 0.5 + 0.5;
  const amp = 0.003 * heartbeat * pulse; // small mm-scale deformation (units consistent with mesh)
  if (normal) {
    return {
      x: position.x + normal.x * amp,
      y: position.y + normal.y * amp,
      z: position.z + normal.z * amp,
    };
  }
  // fallback radial from origin
  const len = Math.sqrt(position.x * position.x + position.y * position.y + position.z * position.z) || 1;
  return {
    x: position.x + (position.x / len) * amp,
    y: position.y + (position.y / len) * amp,
    z: position.z + (position.z / len) * amp,
  };
}

/**
 * Cortex fold deformer: amplifies normal displacement based on uv or position to accentuate gyri/sulci
 */
export function cortexFoldDeformer(position, normal, uv, params) {
  const foldAmount = params.foldAmount ?? 1.0;
  // uv-driven or position-driven pseudo noise:
  const u = uv?.u ?? (Math.abs(position.x) % 1);
  const v = uv?.v ?? (Math.abs(position.y) % 1);
  const fold = Math.sin(u * 20 + v * 15) * 0.002 * foldAmount;
  if (normal) {
    return {
      x: position.x + normal.x * fold,
      y: position.y + normal.y * fold,
      z: position.z + normal.z * fold,
    };
  }
  return { x: position.x, y: position.y, z: position.z };
}

/* ---------------------------
   Mesh application functions
   --------------------------- */

/**
 * Apply deformationFunction to a THREE.BufferGeometry in-place.
 * Mutates position attribute.
 */
export function applyDeformationToGeometry(
  geometry: THREE.BufferGeometry,
  deformation: DeformationFunction,
  params: SurfaceParameters = {}
) {
  const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
  const normalAttr = geometry.getAttribute("normal") as THREE.BufferAttribute | undefined;
  const uvAttr = geometry.getAttribute("uv") as THREE.BufferAttribute | undefined;

  // ensure position is not shared (make a copy)
  const posArray = pos.array as Float32Array;
  for (let i = 0; i < pos.count; i++) {
    const x = posArray[i * 3 + 0];
    const y = posArray[i * 3 + 1];
    const z = posArray[i * 3 + 2];
    const normal = normalAttr
      ? { x: normalAttr.getX(i), y: normalAttr.getY(i), z: normalAttr.getZ(i) }
      : null;
    const uv = uvAttr ? { u: uvAttr.getX(i), v: uvAttr.getY(i) } : null;
    const newPos = deformation({ x, y, z }, normal, uv, params, i);
    posArray[i * 3 + 0] = newPos.x;
    posArray[i * 3 + 1] = newPos.y;
    posArray[i * 3 + 2] = newPos.z;
  }
  pos.needsUpdate = true;
  geometry.computeVertexNormals();
}

/* ---------------------------
   Mesh generation / main API
   --------------------------- */

/**
 * Generate parametric mesh synchronously (as before), returns arrays.
 */
export function generateParametricMesh(
  shape: AnatomyStructure,
  params: SurfaceParameters = {}
): { vertices: number[]; indices: number[] } | null {
  if (!shape.equation) return null;
  const merged = { ...(shape.defaultParams ?? {}), ...params } as SurfaceParameters;
  const uSegments = Math.max(2, merged.uSegments ?? 32);
  const vSegments = Math.max(2, merged.vSegments ?? 32);
  const vertices: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= uSegments; i++) {
    for (let j = 0; j <= vSegments; j++) {
      const u = i / uSegments;
      const v = j / vSegments;
      const [x, y, z] = shape.equation!(u, v, merged);
      vertices.push(x, y, z);
    }
  }
  for (let i = 0; i < uSegments; i++) {
    for (let j = 0; j < vSegments; j++) {
      const a = i * (vSegments + 1) + j;
      const b = a + vSegments + 1;
      const c = a + 1;
      const d = b + 1;
      indices.push(a, b, c);
      indices.push(b, d, c);
    }
  }
  return { vertices, indices };
}

/**
 * Generate mesh for a shape.
 * - parametric -> synchronous arrays
 * - mesh/hybrid -> async loads glTF, optionally applies deformation, returns arrays
 */
export async function generateMesh(
  shapeId: string,
  params: SurfaceParameters = {}
): Promise<{ vertices: number[]; indices: number[] } | null> {
  const shape = getShapeById(shapeId);
  if (!shape) return null;

  if (shape.type === "parametric") {
    return generateParametricMesh(shape, params);
  }

  if (!shape.meshURL) {
    console.warn(`[AnatomyEngine] shape ${shapeId} is missing meshURL`);
    return null;
  }

  // load glTF
  const gltf = await loadGLTF(shape.meshURL);
  // pick the first mesh geometry in the scene for simplicity (you can adapt to named nodes)
  let geometry: THREE.BufferGeometry | null = null;
  gltf.scene.traverse((node) => {
    const mesh = node as THREE.Mesh;
    if ((mesh as any).isMesh && !geometry) {
      geometry = (mesh as THREE.Mesh).geometry.clone() as THREE.BufferGeometry;
    }
  });
  if (!geometry) return null;

  // hybrid: apply deformation
  if (shape.type === "hybrid" && shape.deformationFunction) {
    applyDeformationToGeometry(geometry, shape.deformationFunction, params);
  }
  // convert to arrays and return
  return geometryToArrays(geometry);
}

/* ---------------------------
   Registry helpers
   --------------------------- */

export function getShapeById(id: string): AnatomyStructure | undefined {
  return HUMAN_ANATOMY_SHAPES[id];
}

export function getSystemShapes(systemName: string): AnatomyStructure[] {
  return Object.values(HUMAN_ANATOMY_SHAPES).filter((s) => s.system === systemName);
}

export function getAllSystems(): string[] {
  const set = new Set<string>();
  Object.values(HUMAN_ANATOMY_SHAPES).forEach((s) => { if (s.system) set.add(s.system); });
  return Array.from(set);
}

/* ---------------------------
   Usage examples (async usage recommended)
   --------------------------- */

// Example usage (Three.js environment):
// (async () => {
//   const meshData = await generateMesh('heart_4_chambers_hybrid', { time: performance.now() / 1000, heartbeat: 1.2 });
//   console.log('vertices', meshData?.vertices.length / 3);
// })();

export default HUMAN_ANATOMY_SHAPES;
