/**
 * CLIENT-SIDE SERVICE FOR SERVER-COMPUTED GEOMETRY
 * Fetches parametric surface geometry from server to protect algorithms
 */

import * as THREE from 'three';

export interface SurfaceGeometryRequest {
  shapeId: string;
  parameters?: Record<string, number>;
  uSegments?: number;
  vSegments?: number;
  uMin?: number;
  uMax?: number;
  vMin?: number;
  vMax?: number;
}

export interface SurfaceGeometryResponse {
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

// Placeholder for API_BASE and ComputeParams/ComputeResult types, assuming they are defined elsewhere
declare const API_BASE: string;
interface ComputeParams {
  [key: string]: any;
}
interface ComputeResult {
  [key: string]: any;
}

/**
 * Fetch computed geometry from server
 */
export async function fetchSurfaceGeometry(
  request: SurfaceGeometryRequest
): Promise<THREE.BufferGeometry | null> {
  try {
    const response = await fetch('/api/uuon-compute/surface', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Server computation error:', error);
      return null;
    }

    const data: SurfaceGeometryResponse = await response.json();

    if (!data.success || !data.vertices || !data.indices) {
      console.error('Invalid geometry response:', data);
      return null;
    }

    // Construct Three.js BufferGeometry from server data
    const geometry = new THREE.BufferGeometry();

    // Set vertices
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(data.vertices, 3)
    );

    // Set normals if provided
    if (data.normals) {
      geometry.setAttribute(
        'normal',
        new THREE.Float32BufferAttribute(data.normals, 3)
      );
    } else {
      geometry.computeVertexNormals();
    }

    // Set UVs if provided
    if (data.uvs) {
      geometry.setAttribute(
        'uv',
        new THREE.Float32BufferAttribute(data.uvs, 2)
      );
    }

    // Set indices
    geometry.setIndex(data.indices);

    console.log(`✅ Loaded ${data.shapeId}: ${data.vertexCount} vertices, ${data.triangleCount} triangles`);

    return geometry;

  } catch (error) {
    console.error('Failed to fetch surface geometry:', error);
    return null;
  }
}

/**
 * Cache for computed geometries to avoid repeated server calls
 */
class GeometryCache {
  private cache = new Map<string, THREE.BufferGeometry>();
  private maxSize = 50;

  getCacheKey(request: SurfaceGeometryRequest): string {
    return `${request.shapeId}_${JSON.stringify(request.parameters)}_${request.uSegments}_${request.vSegments}_${request.uMin}_${request.uMax}_${request.vMin}_${request.vMax}`;
  }

  get(request: SurfaceGeometryRequest): THREE.BufferGeometry | null {
    const key = this.getCacheKey(request);
    return this.cache.get(key) || null;
  }

  set(request: SurfaceGeometryRequest, geometry: THREE.BufferGeometry): void {
    const key = this.getCacheKey(request);

    // Simple LRU: remove oldest if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        const oldGeometry = this.cache.get(firstKey);
        oldGeometry?.dispose();
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, geometry);
  }

  clear(): void {
    this.cache.forEach(geometry => geometry.dispose());
    this.cache.clear();
  }
}

const geometryCache = new GeometryCache();

/**
 * Fetch geometry with caching
 */
export async function fetchCachedSurfaceGeometry(
  request: SurfaceGeometryRequest
): Promise<THREE.BufferGeometry | null> {
  // Check cache first
  const cached = geometryCache.get(request);
  if (cached) {
    console.log(`📦 Cache hit for ${request.shapeId}`);
    return cached.clone();
  }

  // Fetch from server
  const geometry = await fetchSurfaceGeometry(request);

  if (geometry) {
    geometryCache.set(request, geometry);
  }

  return geometry;
}

/**
 * Clear geometry cache (call when memory is needed)
 */
export function clearGeometryCache(): void {
  geometryCache.clear();
}

/**
 * CLIENT-SIDE SERVICE FOR SERVER-COMPUTED GEOMETRY
 * Optimized with request deduplication and caching
 */
const pendingRequests = new Map<string, Promise<ComputeResult>>();
const requestCache = new Map<string, { result: ComputeResult; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

export const surfaceComputeService = {
  async computeSurface(params: ComputeParams): Promise<ComputeResult> {
    // Create request fingerprint for deduplication
    const requestKey = JSON.stringify(params);

    // Check cache first
    const cached = requestCache.get(requestKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log('🎯 Using cached computation result');
      return cached.result;
    }

    // Check if request is already pending
    if (pendingRequests.has(requestKey)) {
      console.log('⏳ Deduplicating concurrent request');
      return pendingRequests.get(requestKey)!;
    }

    try {
      // Create and cache the pending request
      const requestPromise = this.executeRequest(params);
      pendingRequests.set(requestKey, requestPromise);

      const result = await requestPromise;

      // Cache the result
      requestCache.set(requestKey, {
        result,
        timestamp: Date.now()
      });

      return result;
    } finally {
      // Clean up pending request
      pendingRequests.delete(requestKey);

      // Cleanup old cache entries
      this.cleanupCache();
    }
  },

  async executeRequest(params: ComputeParams): Promise<ComputeResult> {
    const response = await fetch(`${API_BASE}/compute/surface`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  cleanupCache(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    requestCache.forEach((cached, key) => {
      if (now - cached.timestamp > CACHE_DURATION) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => requestCache.delete(key));
  }
};