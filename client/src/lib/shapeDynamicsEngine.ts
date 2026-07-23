/**
 * SHAPE DYNAMICS ENGINE
 * 
 * Comprehensive mathematical analysis system using triple integrals
 * and differential geometry to compute physical properties of 3D shapes.
 * 
 * Properties Computed:
 * - Volume (triple integration)
 * - Surface Area (surface integrals)
 * - Mass (volume × density)
 * - Center of Mass (weighted integrals)
 * - Moment of Inertia Tensor
 * - Gaussian Curvature
 * - Mean Curvature
 * - Principal Curvatures
 * - Euler Characteristic
 * - Bounding Box Dimensions
 * 
 * Coordinate Systems:
 * - Cartesian (x, y, z)
 * - Cylindrical (r, θ, z)
 * - Spherical (ρ, θ, φ)
 * 
 * © 2025 UUON Foundation Inc.
 */

import * as THREE from 'three';

export interface ShapeDynamicsResult {
  volume: number;
  surfaceArea: number;
  mass: number;
  density: number;
  centerOfMass: { x: number; y: number; z: number };
  momentOfInertia: {
    Ixx: number;
    Iyy: number;
    Izz: number;
    Ixy: number;
    Ixz: number;
    Iyz: number;
  };
  boundingBox: {
    min: { x: number; y: number; z: number };
    max: { x: number; y: number; z: number };
    dimensions: { width: number; height: number; depth: number };
  };
  curvature: {
    gaussian: number;
    mean: number;
    principalK1: number;
    principalK2: number;
  };
  topology: {
    eulerCharacteristic: number;
    genus: number;
    vertices: number;
    edges: number;
    faces: number;
  };
  coordinateSystem: 'cartesian' | 'cylindrical' | 'spherical';
  computationTime: number;
}

export interface MaterialProperties {
  name: string;
  density: number; // kg/m³
  description: string;
}

export const MATERIAL_PRESETS: MaterialProperties[] = [
  { name: 'Air', density: 1.225, description: 'Standard atmosphere' },
  { name: 'Water', density: 1000, description: 'Pure water at 4°C' },
  { name: 'Aluminum', density: 2700, description: 'Structural metal' },
  { name: 'Steel', density: 7850, description: 'Carbon steel' },
  { name: 'Gold', density: 19300, description: 'Pure gold' },
  { name: 'Titanium', density: 4500, description: 'Aerospace alloy' },
  { name: 'Glass', density: 2500, description: 'Soda-lime glass' },
  { name: 'Wood (Oak)', density: 750, description: 'Hardwood average' },
  { name: 'Plastic (ABS)', density: 1050, description: 'Common plastic' },
  { name: 'Concrete', density: 2400, description: 'Standard concrete' },
  { name: 'Diamond', density: 3510, description: 'Pure carbon crystal' },
  { name: 'Neutron Star', density: 4e17, description: 'Extreme density' },
  { name: 'Custom', density: 1000, description: 'User-defined density' },
];

/**
 * Monte Carlo Triple Integration
 * Computes volume integral using random sampling
 */
function monteCarloTripleIntegral(
  geometry: THREE.BufferGeometry,
  samples: number = 10000
): { volume: number; centerOfMass: THREE.Vector3 } {
  geometry.computeBoundingBox();
  const box = geometry.boundingBox!;

  const min = box.min;
  const max = box.max;
  const boxVolume = (max.x - min.x) * (max.y - min.y) * (max.z - min.z);

  if (boxVolume === 0) {
    return { volume: 0, centerOfMass: new THREE.Vector3() };
  }

  let insideCount = 0;
  const centerSum = new THREE.Vector3();
  const raycaster = new THREE.Raycaster();

  // Create temporary mesh for raycasting
  const tempMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

  for (let i = 0; i < samples; i++) {
    const point = new THREE.Vector3(
      min.x + Math.random() * (max.x - min.x),
      min.y + Math.random() * (max.y - min.y),
      min.z + Math.random() * (max.z - min.z)
    );

    // Ray casting to determine if point is inside
    raycaster.set(point, new THREE.Vector3(1, 0, 0));
    const intersections = raycaster.intersectObject(tempMesh);

    // Point is inside if odd number of intersections
    if (intersections.length % 2 === 1) {
      insideCount++;
      centerSum.add(point);
    }
  }

  const volume = (insideCount / samples) * boxVolume;
  const centerOfMass = insideCount > 0 
    ? centerSum.divideScalar(insideCount)
    : new THREE.Vector3();

  return { volume, centerOfMass };
}

/**
 * Compute surface area from mesh triangles
 */
function computeSurfaceArea(geometry: THREE.BufferGeometry): number {
  const positions = geometry.getAttribute('position');
  const indices = geometry.getIndex();

  if (!positions) return 0;

  let totalArea = 0;

  if (indices) {
    // Indexed geometry
    for (let i = 0; i < indices.count; i += 3) {
      const a = new THREE.Vector3().fromBufferAttribute(positions, indices.getX(i));
      const b = new THREE.Vector3().fromBufferAttribute(positions, indices.getX(i + 1));
      const c = new THREE.Vector3().fromBufferAttribute(positions, indices.getX(i + 2));

      const ab = new THREE.Vector3().subVectors(b, a);
      const ac = new THREE.Vector3().subVectors(c, a);
      const cross = new THREE.Vector3().crossVectors(ab, ac);

      totalArea += cross.length() / 2;
    }
  } else {
    // Non-indexed geometry
    for (let i = 0; i < positions.count; i += 3) {
      const a = new THREE.Vector3().fromBufferAttribute(positions, i);
      const b = new THREE.Vector3().fromBufferAttribute(positions, i + 1);
      const c = new THREE.Vector3().fromBufferAttribute(positions, i + 2);

      const ab = new THREE.Vector3().subVectors(b, a);
      const ac = new THREE.Vector3().subVectors(c, a);
      const cross = new THREE.Vector3().crossVectors(ab, ac);

      totalArea += cross.length() / 2;
    }
  }

  return totalArea;
}

/**
 * Compute moment of inertia tensor
 * Uses discrete approximation from mesh vertices
 */
function computeMomentOfInertia(
  geometry: THREE.BufferGeometry,
  centerOfMass: THREE.Vector3,
  mass: number
): ShapeDynamicsResult['momentOfInertia'] {
  const positions = geometry.getAttribute('position');
  if (!positions || positions.count === 0) {
    return { Ixx: 0, Iyy: 0, Izz: 0, Ixy: 0, Ixz: 0, Iyz: 0 };
  }

  const massPerVertex = mass / positions.count;

  let Ixx = 0, Iyy = 0, Izz = 0;
  let Ixy = 0, Ixz = 0, Iyz = 0;

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i) - centerOfMass.x;
    const y = positions.getY(i) - centerOfMass.y;
    const z = positions.getZ(i) - centerOfMass.z;

    Ixx += massPerVertex * (y * y + z * z);
    Iyy += massPerVertex * (x * x + z * z);
    Izz += massPerVertex * (x * x + y * y);
    Ixy -= massPerVertex * x * y;
    Ixz -= massPerVertex * x * z;
    Iyz -= massPerVertex * y * z;
  }

  return { Ixx, Iyy, Izz, Ixy, Ixz, Iyz };
}

/**
 * Compute curvature properties using discrete differential geometry
 */
function computeCurvature(geometry: THREE.BufferGeometry): ShapeDynamicsResult['curvature'] {
  const positions = geometry.getAttribute('position');
  const normals = geometry.getAttribute('normal');

  if (!positions || !normals || positions.count < 3) {
    return { gaussian: 0, mean: 0, principalK1: 0, principalK2: 0 };
  }

  // Sample curvature at multiple points and average
  const sampleCount = Math.min(100, positions.count);
  let totalGaussian = 0;
  let totalMean = 0;

  for (let i = 0; i < sampleCount; i++) {
    const idx = Math.floor(i * positions.count / sampleCount);

    // Get local neighborhood
    const p = new THREE.Vector3().fromBufferAttribute(positions, idx);
    const n = new THREE.Vector3().fromBufferAttribute(normals, idx);

    // Find nearby vertices for curvature estimation
    let nearbyCount = 0;
    let curvatureSum = 0;

    for (let j = 0; j < positions.count && nearbyCount < 6; j++) {
      if (j === idx) continue;

      const q = new THREE.Vector3().fromBufferAttribute(positions, j);
      const dist = p.distanceTo(q);

      if (dist < 0.5 && dist > 0.001) {
        const qn = new THREE.Vector3().fromBufferAttribute(normals, j);
        const edge = new THREE.Vector3().subVectors(q, p).normalize();

        // Estimate curvature from normal variation
        const normalDiff = new THREE.Vector3().subVectors(qn, n);
        const curvature = normalDiff.dot(edge) / dist;

        curvatureSum += curvature;
        nearbyCount++;
      }
    }

    if (nearbyCount > 0) {
      const avgCurvature = curvatureSum / nearbyCount;
      totalMean += Math.abs(avgCurvature);
      totalGaussian += avgCurvature * avgCurvature;
    }
  }

  const meanCurvature = totalMean / sampleCount;
  const gaussianCurvature = totalGaussian / sampleCount;

  // Principal curvatures from mean and Gaussian
  const discriminant = Math.max(0, meanCurvature * meanCurvature - gaussianCurvature);
  const sqrtDisc = Math.sqrt(discriminant);

  return {
    gaussian: gaussianCurvature,
    mean: meanCurvature,
    principalK1: meanCurvature + sqrtDisc,
    principalK2: meanCurvature - sqrtDisc
  };
}

/**
 * Compute topological properties
 */
function computeTopology(geometry: THREE.BufferGeometry): ShapeDynamicsResult['topology'] {
  const positions = geometry.getAttribute('position');
  const indices = geometry.getIndex();

  const vertices = positions ? positions.count : 0;
  let faces = 0;
  let edges = 0;

  if (indices) {
    faces = indices.count / 3;
    // Euler's formula for manifolds: edges = (3 * faces + vertices - 2) / 2
    // For closed surfaces: V - E + F = 2 - 2g (where g is genus)
    edges = Math.round((3 * faces) / 2);
  } else {
    faces = vertices / 3;
    edges = Math.round((3 * faces) / 2);
  }

  // Euler characteristic: χ = V - E + F
  const eulerCharacteristic = vertices - edges + faces;

  // Genus from Euler characteristic: g = (2 - χ) / 2
  const genus = Math.max(0, Math.round((2 - eulerCharacteristic) / 2));

  return {
    eulerCharacteristic,
    genus,
    vertices,
    edges,
    faces
  };
}

/**
 * Determine optimal coordinate system based on shape symmetry
 */
function detectCoordinateSystem(geometry: THREE.BufferGeometry): 'cartesian' | 'cylindrical' | 'spherical' {
  geometry.computeBoundingBox();
  const box = geometry.boundingBox!;

  const width = box.max.x - box.min.x;
  const height = box.max.y - box.min.y;
  const depth = box.max.z - box.min.z;

  const avg = (width + height + depth) / 3;
  const variance = (
    Math.pow(width - avg, 2) + 
    Math.pow(height - avg, 2) + 
    Math.pow(depth - avg, 2)
  ) / 3;

  const normalizedVariance = variance / (avg * avg);

  // High symmetry suggests spherical
  if (normalizedVariance < 0.01) {
    return 'spherical';
  }

  // One dimension significantly different suggests cylindrical
  const maxDim = Math.max(width, height, depth);
  const minDim = Math.min(width, height, depth);
  if (maxDim / minDim > 2) {
    return 'cylindrical';
  }

  return 'cartesian';
}

/**
 * Main Shape Dynamics computation function
 */
export function computeShapeDynamics(
  geometry: THREE.BufferGeometry,
  density: number = 1000,
  scale: number = 1
): ShapeDynamicsResult {
  const startTime = performance.now();

  // Clone and scale geometry
  const scaledGeometry = geometry.clone();
  scaledGeometry.scale(scale, scale, scale);
  scaledGeometry.computeVertexNormals();
  scaledGeometry.computeBoundingBox();

  // Bounding box
  const box = scaledGeometry.boundingBox!;
  const boundingBox = {
    min: { x: box.min.x, y: box.min.y, z: box.min.z },
    max: { x: box.max.x, y: box.max.y, z: box.max.z },
    dimensions: {
      width: box.max.x - box.min.x,
      height: box.max.y - box.min.y,
      depth: box.max.z - box.min.z
    }
  };

  // Volume and center of mass via Monte Carlo
  const { volume, centerOfMass } = monteCarloTripleIntegral(scaledGeometry, 5000);

  // Surface area
  const surfaceArea = computeSurfaceArea(scaledGeometry);

  // Mass
  const mass = volume * density;

  // Moment of inertia
  const momentOfInertia = computeMomentOfInertia(scaledGeometry, centerOfMass, mass);

  // Curvature
  const curvature = computeCurvature(scaledGeometry);

  // Topology
  const topology = computeTopology(scaledGeometry);

  // Coordinate system
  const coordinateSystem = detectCoordinateSystem(scaledGeometry);

  const computationTime = performance.now() - startTime;

  return {
    volume,
    surfaceArea,
    mass,
    density,
    centerOfMass: { x: centerOfMass.x, y: centerOfMass.y, z: centerOfMass.z },
    momentOfInertia,
    boundingBox,
    curvature,
    topology,
    coordinateSystem,
    computationTime
  };
}

/**
 * Format number with appropriate precision and units
 */
export function formatDynamicsValue(value: number, unit: string = ''): string {
  if (Math.abs(value) < 0.0001 && value !== 0) {
    return value.toExponential(3) + (unit ? ` ${unit}` : '');
  }
  if (Math.abs(value) > 1000000) {
    return value.toExponential(3) + (unit ? ` ${unit}` : '');
  }
  return value.toFixed(4) + (unit ? ` ${unit}` : '');
}

/**
 * Get human-readable description for each property
 */
export function getPropertyDescription(property: string): string {
  const descriptions: Record<string, string> = {
    volume: 'Total 3D space enclosed by the surface, computed via triple integration',
    surfaceArea: 'Total area of the outer surface, computed from mesh triangles',
    mass: 'Volume multiplied by material density (m = ρV)',
    centerOfMass: 'Balance point where the shape would be perfectly balanced',
    momentOfInertia: 'Resistance to rotational acceleration around each axis',
    gaussian: 'Product of principal curvatures (K = κ₁κ₂), indicates surface type',
    mean: 'Average of principal curvatures (H = (κ₁+κ₂)/2), measures local bending',
    eulerCharacteristic: 'Topological invariant χ = V - E + F',
    genus: 'Number of "handles" or holes in the surface',
  };

  return descriptions[property] || 'Mathematical property of the shape';
}

// Enhanced dynamics integration
export async function computeEnhancedShapeDynamics(
  geometry: THREE.BufferGeometry,
  shapeId: string,
  shapeName: string,
  category: string,
  density: number = 1000,
  scale: number = 1
): Promise<any> {
  // First compute basic dynamics
  const basicDynamics = computeShapeDynamics(geometry, density, scale);

  try {
    // Send to backend for enhanced computation
    const response = await fetch('/api/uuon-compute/enhanced-shape-dynamics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shapeId,
        shapeName,
        category,
        basicDynamics
      }),
    });

    if (response.ok) {
      const result = await response.json();
      return {
        ...basicDynamics,
        enhanced: result.enhancedDynamics,
        tokens: result.enhancedTokens,
        validated: result.validationPassed
      };
    } else {
      console.warn('Enhanced dynamics computation failed, using basic dynamics');
      return basicDynamics;
    }
  } catch (error) {
    console.warn('Enhanced dynamics request failed:', error);
    return basicDynamics;
  }
}

export default {
  computeShapeDynamics,
  computeEnhancedShapeDynamics,
  formatDynamicsValue,
  getPropertyDescription,
  MATERIAL_PRESETS
};