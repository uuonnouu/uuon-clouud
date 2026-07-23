import * as THREE from 'three';

export interface GeometryValidation {
  isManifold: boolean;
  isWatertight: boolean;
  hasConsistentNormals: boolean;
  hasValidTopology: boolean;
  eulerCharacteristic: number;
  genus: number;
  boundaryCount: number;
  vertexCount: number;
  faceCount: number;
  edgeCount: number;
  issues: string[];
}

export interface PhysicalQuantities {
  mass: number;
  centerOfMass: { x: number; y: number; z: number };
  inertiaTensor: {
    Ixx: number; Iyy: number; Izz: number;
    Ixy: number; Ixz: number; Iyz: number;
  };
  volume: number;
  surfaceArea: number;
  density: number;
  boundingBox: { min: THREE.Vector3; max: THREE.Vector3; size: THREE.Vector3 };
  boundingSphere: { center: THREE.Vector3; radius: number };
}

export interface MathematicalQuantities {
  metricTensor: number[][];
  gaussianCurvature: number;
  meanCurvature: number;
  principalCurvatures: { k1: number; k2: number };
  laplacian: number[];
  gradientField: THREE.Vector3[];
  divergence: number;
  curl: THREE.Vector3;
  eigenvalues: { curvature: number[]; inertia: number[] };
  dimensionalSignatures: { projection2D: number; projection1D: number; projection0D: number };
}

export interface VisualizationParams {
  preferredCameraPosition: THREE.Vector3;
  normalizationScale: number;
  rotationProfile: { x: number; y: number; z: number };
  lightingResponse: string;
  shadingRecommendation: string;
  colorHarmonicPreset: string;
}

export interface ShapeTokenData {
  geometryId: string;
  physical: PhysicalQuantities;
  mathematical: MathematicalQuantities;
  visualization: VisualizationParams;
  validation: GeometryValidation;
  versionChecksum: string;
  timestamp: string;
  randomSeed: number;
  exportConfiguration: Record<string, any>;
  stabilityMetrics: { overallStability: number; rotationalStability: number };
  symmetryClassifiers: string[];
  hash: string;
}

export interface ProcessingResult {
  success: boolean;
  validation: GeometryValidation;
  physical: PhysicalQuantities;
  mathematical: MathematicalQuantities;
  visualization: VisualizationParams;
  token: ShapeTokenData;
  processingTimeMs: number;
}

class PhysicalGeometryProcessor {
  private density: number = 1000;

  validateGeometry(geometry: THREE.BufferGeometry): GeometryValidation {
    const issues: string[] = [];
    const positions = geometry.getAttribute('position');
    const indices = geometry.getIndex();
    
    const vertexCount = positions ? positions.count : 0;
    const faceCount = indices ? indices.count / 3 : vertexCount / 3;
    
    let edgeCount = 0;
    const edgeSet = new Set<string>();
    
    if (indices) {
      for (let i = 0; i < indices.count; i += 3) {
        const a = indices.getX(i);
        const b = indices.getX(i + 1);
        const c = indices.getX(i + 2);
        
        const edges = [
          [Math.min(a, b), Math.max(a, b)],
          [Math.min(b, c), Math.max(b, c)],
          [Math.min(c, a), Math.max(c, a)]
        ];
        
        edges.forEach(([v1, v2]) => {
          edgeSet.add(`${v1}-${v2}`);
        });
      }
      edgeCount = edgeSet.size;
    } else {
      edgeCount = faceCount * 3 / 2;
    }

    const eulerCharacteristic = vertexCount - edgeCount + faceCount;
    const genus = (2 - eulerCharacteristic) / 2;
    
    let isManifold = true;
    let boundaryCount = 0;
    
    if (indices) {
      const edgeFaceCount = new Map<string, number>();
      
      for (let i = 0; i < indices.count; i += 3) {
        const a = indices.getX(i);
        const b = indices.getX(i + 1);
        const c = indices.getX(i + 2);
        
        [[a, b], [b, c], [c, a]].forEach(([v1, v2]) => {
          const key = `${Math.min(v1, v2)}-${Math.max(v1, v2)}`;
          edgeFaceCount.set(key, (edgeFaceCount.get(key) || 0) + 1);
        });
      }
      
      edgeFaceCount.forEach((count, edge) => {
        if (count === 1) boundaryCount++;
        if (count > 2) {
          isManifold = false;
          issues.push(`Non-manifold edge: ${edge} shared by ${count} faces`);
        }
      });
    }

    const isWatertight = boundaryCount === 0 && isManifold;
    
    let hasConsistentNormals = true;
    const normals = geometry.getAttribute('normal');
    if (normals) {
      for (let i = 0; i < normals.count; i++) {
        const nx = normals.getX(i);
        const ny = normals.getY(i);
        const nz = normals.getZ(i);
        const length = Math.sqrt(nx * nx + ny * ny + nz * nz);
        if (Math.abs(length - 1) > 0.01) {
          hasConsistentNormals = false;
          issues.push(`Non-unit normal at vertex ${i}`);
          break;
        }
      }
    } else {
      issues.push('No normals defined');
      hasConsistentNormals = false;
    }

    const hasValidTopology = isManifold && (genus >= 0);
    
    if (!isManifold) issues.push('Geometry is non-manifold');
    if (!isWatertight) issues.push(`Geometry has ${boundaryCount} boundary edges`);
    if (genus < 0) issues.push('Invalid topology (negative genus)');

    return {
      isManifold,
      isWatertight,
      hasConsistentNormals,
      hasValidTopology,
      eulerCharacteristic,
      genus: Math.max(0, genus),
      boundaryCount,
      vertexCount,
      faceCount,
      edgeCount,
      issues
    };
  }

  computePhysicalQuantities(geometry: THREE.BufferGeometry): PhysicalQuantities {
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    
    const boundingBox = {
      min: geometry.boundingBox?.min.clone() || new THREE.Vector3(),
      max: geometry.boundingBox?.max.clone() || new THREE.Vector3(),
      size: new THREE.Vector3()
    };
    boundingBox.size.subVectors(boundingBox.max, boundingBox.min);
    
    const boundingSphere = {
      center: geometry.boundingSphere?.center.clone() || new THREE.Vector3(),
      radius: geometry.boundingSphere?.radius || 1
    };

    const { volume, surfaceArea, centerOfMass } = this.computeVolumeAndSurfaceArea(geometry);
    
    const mass = volume * this.density;
    
    const inertiaTensor = this.computeInertiaTensor(geometry, centerOfMass, this.density);

    return {
      mass,
      centerOfMass,
      inertiaTensor,
      volume,
      surfaceArea,
      density: this.density,
      boundingBox,
      boundingSphere
    };
  }

  private computeVolumeAndSurfaceArea(geometry: THREE.BufferGeometry): {
    volume: number;
    surfaceArea: number;
    centerOfMass: { x: number; y: number; z: number };
  } {
    const positions = geometry.getAttribute('position');
    const indices = geometry.getIndex();
    
    let volume = 0;
    let surfaceArea = 0;
    let centerOfMass = { x: 0, y: 0, z: 0 };
    let totalMass = 0;
    
    const getVertex = (index: number): THREE.Vector3 => {
      return new THREE.Vector3(
        positions.getX(index),
        positions.getY(index),
        positions.getZ(index)
      );
    };
    
    const processFace = (a: number, b: number, c: number) => {
      const v0 = getVertex(a);
      const v1 = getVertex(b);
      const v2 = getVertex(c);
      
      const signedVolume = v0.dot(v1.clone().cross(v2)) / 6;
      volume += signedVolume;
      
      const edge1 = v1.clone().sub(v0);
      const edge2 = v2.clone().sub(v0);
      const faceArea = edge1.cross(edge2).length() / 2;
      surfaceArea += faceArea;
      
      const faceCentroid = {
        x: (v0.x + v1.x + v2.x) / 3,
        y: (v0.y + v1.y + v2.y) / 3,
        z: (v0.z + v1.z + v2.z) / 3
      };
      
      const faceMass = faceArea;
      centerOfMass.x += faceCentroid.x * faceMass;
      centerOfMass.y += faceCentroid.y * faceMass;
      centerOfMass.z += faceCentroid.z * faceMass;
      totalMass += faceMass;
    };
    
    if (indices) {
      for (let i = 0; i < indices.count; i += 3) {
        processFace(indices.getX(i), indices.getX(i + 1), indices.getX(i + 2));
      }
    } else {
      for (let i = 0; i < positions.count; i += 3) {
        processFace(i, i + 1, i + 2);
      }
    }
    
    if (totalMass > 0) {
      centerOfMass.x /= totalMass;
      centerOfMass.y /= totalMass;
      centerOfMass.z /= totalMass;
    }
    
    return { volume: Math.abs(volume), surfaceArea, centerOfMass };
  }

  private computeInertiaTensor(
    geometry: THREE.BufferGeometry,
    centerOfMass: { x: number; y: number; z: number },
    density: number
  ): PhysicalQuantities['inertiaTensor'] {
    const positions = geometry.getAttribute('position');
    const indices = geometry.getIndex();
    
    let Ixx = 0, Iyy = 0, Izz = 0;
    let Ixy = 0, Ixz = 0, Iyz = 0;
    
    const getVertex = (index: number): THREE.Vector3 => {
      return new THREE.Vector3(
        positions.getX(index) - centerOfMass.x,
        positions.getY(index) - centerOfMass.y,
        positions.getZ(index) - centerOfMass.z
      );
    };
    
    const processFace = (a: number, b: number, c: number) => {
      const v0 = getVertex(a);
      const v1 = getVertex(b);
      const v2 = getVertex(c);
      
      const edge1 = v1.clone().sub(v0);
      const edge2 = v2.clone().sub(v0);
      const faceArea = edge1.cross(edge2).length() / 2;
      
      const cx = (v0.x + v1.x + v2.x) / 3;
      const cy = (v0.y + v1.y + v2.y) / 3;
      const cz = (v0.z + v1.z + v2.z) / 3;
      
      const dm = faceArea * density;
      
      Ixx += dm * (cy * cy + cz * cz);
      Iyy += dm * (cx * cx + cz * cz);
      Izz += dm * (cx * cx + cy * cy);
      Ixy -= dm * cx * cy;
      Ixz -= dm * cx * cz;
      Iyz -= dm * cy * cz;
    };
    
    if (indices) {
      for (let i = 0; i < indices.count; i += 3) {
        processFace(indices.getX(i), indices.getX(i + 1), indices.getX(i + 2));
      }
    } else {
      for (let i = 0; i < positions.count; i += 3) {
        processFace(i, i + 1, i + 2);
      }
    }
    
    return { Ixx, Iyy, Izz, Ixy, Ixz, Iyz };
  }

  computeMathematicalQuantities(geometry: THREE.BufferGeometry): MathematicalQuantities {
    const positions = geometry.getAttribute('position');
    const normals = geometry.getAttribute('normal');
    
    const metricTensor = this.computeMetricTensor(geometry);
    const { gaussian, mean, k1, k2 } = this.computeCurvatures(geometry);
    const laplacian = this.computeLaplacian(geometry);
    const gradientField = this.computeGradientField(geometry);
    const { divergence, curl } = this.computeDivergenceAndCurl(gradientField);
    const eigenvalues = this.computeEigenvalues(metricTensor, { Ixx: 1, Iyy: 1, Izz: 1 });
    const dimensionalSignatures = this.computeDimensionalSignatures(geometry);

    return {
      metricTensor,
      gaussianCurvature: gaussian,
      meanCurvature: mean,
      principalCurvatures: { k1, k2 },
      laplacian,
      gradientField,
      divergence,
      curl,
      eigenvalues,
      dimensionalSignatures
    };
  }

  private computeMetricTensor(geometry: THREE.BufferGeometry): number[][] {
    const positions = geometry.getAttribute('position');
    
    let gxx = 0, gxy = 0, gxz = 0;
    let gyy = 0, gyz = 0, gzz = 0;
    let count = 0;
    
    for (let i = 0; i < positions.count - 1; i++) {
      const dx = positions.getX(i + 1) - positions.getX(i);
      const dy = positions.getY(i + 1) - positions.getY(i);
      const dz = positions.getZ(i + 1) - positions.getZ(i);
      
      gxx += dx * dx;
      gxy += dx * dy;
      gxz += dx * dz;
      gyy += dy * dy;
      gyz += dy * dz;
      gzz += dz * dz;
      count++;
    }
    
    if (count > 0) {
      gxx /= count; gxy /= count; gxz /= count;
      gyy /= count; gyz /= count; gzz /= count;
    }
    
    return [
      [gxx, gxy, gxz],
      [gxy, gyy, gyz],
      [gxz, gyz, gzz]
    ];
  }

  private computeCurvatures(geometry: THREE.BufferGeometry): {
    gaussian: number;
    mean: number;
    k1: number;
    k2: number;
  } {
    const positions = geometry.getAttribute('position');
    const normals = geometry.getAttribute('normal');
    
    if (!normals || positions.count < 3) {
      return { gaussian: 0, mean: 0, k1: 0, k2: 0 };
    }
    
    let totalGaussian = 0;
    let totalMean = 0;
    let sampleCount = 0;
    
    const indices = geometry.getIndex();
    const adjacency = new Map<number, Set<number>>();
    
    if (indices) {
      for (let i = 0; i < indices.count; i += 3) {
        const a = indices.getX(i);
        const b = indices.getX(i + 1);
        const c = indices.getX(i + 2);
        
        [a, b, c].forEach(v => {
          if (!adjacency.has(v)) adjacency.set(v, new Set());
        });
        
        adjacency.get(a)!.add(b).add(c);
        adjacency.get(b)!.add(a).add(c);
        adjacency.get(c)!.add(a).add(b);
      }
    }
    
    const sampleSize = Math.min(100, positions.count);
    const step = Math.max(1, Math.floor(positions.count / sampleSize));
    
    for (let i = 0; i < positions.count; i += step) {
      const neighbors = adjacency.get(i);
      if (!neighbors || neighbors.size < 3) continue;
      
      const p = new THREE.Vector3(
        positions.getX(i),
        positions.getY(i),
        positions.getZ(i)
      );
      const n = new THREE.Vector3(
        normals.getX(i),
        normals.getY(i),
        normals.getZ(i)
      );
      
      let curvatureSum = 0;
      let normalVariation = 0;
      
      neighbors.forEach(j => {
        const q = new THREE.Vector3(
          positions.getX(j),
          positions.getY(j),
          positions.getZ(j)
        );
        const nj = new THREE.Vector3(
          normals.getX(j),
          normals.getY(j),
          normals.getZ(j)
        );
        
        const edge = q.clone().sub(p);
        const edgeLength = edge.length();
        
        if (edgeLength > 0.0001) {
          const normalDiff = nj.clone().sub(n);
          curvatureSum += normalDiff.length() / edgeLength;
          normalVariation += 1 - n.dot(nj);
        }
      });
      
      const avgCurvature = curvatureSum / neighbors.size;
      const avgVariation = normalVariation / neighbors.size;
      
      totalMean += avgCurvature;
      totalGaussian += avgCurvature * avgVariation;
      sampleCount++;
    }
    
    const mean = sampleCount > 0 ? totalMean / sampleCount : 0;
    const gaussian = sampleCount > 0 ? totalGaussian / sampleCount : 0;
    
    const discriminant = mean * mean - gaussian;
    const sqrtDisc = Math.sqrt(Math.max(0, discriminant));
    const k1 = mean + sqrtDisc;
    const k2 = mean - sqrtDisc;
    
    return { gaussian, mean, k1, k2 };
  }

  private computeLaplacian(geometry: THREE.BufferGeometry): number[] {
    const positions = geometry.getAttribute('position');
    const indices = geometry.getIndex();
    
    const laplacian: number[] = new Array(positions.count).fill(0);
    const adjacency = new Map<number, Set<number>>();
    
    if (indices) {
      for (let i = 0; i < indices.count; i += 3) {
        const a = indices.getX(i);
        const b = indices.getX(i + 1);
        const c = indices.getX(i + 2);
        
        [a, b, c].forEach(v => {
          if (!adjacency.has(v)) adjacency.set(v, new Set());
        });
        
        adjacency.get(a)!.add(b).add(c);
        adjacency.get(b)!.add(a).add(c);
        adjacency.get(c)!.add(a).add(b);
      }
    }
    
    for (let i = 0; i < positions.count; i++) {
      const neighbors = adjacency.get(i);
      if (!neighbors || neighbors.size === 0) continue;
      
      const pi = new THREE.Vector3(
        positions.getX(i),
        positions.getY(i),
        positions.getZ(i)
      );
      
      let sumDiff = 0;
      neighbors.forEach(j => {
        const pj = new THREE.Vector3(
          positions.getX(j),
          positions.getY(j),
          positions.getZ(j)
        );
        sumDiff += pj.distanceTo(pi);
      });
      
      laplacian[i] = sumDiff / neighbors.size - 1;
    }
    
    return laplacian;
  }

  private computeGradientField(geometry: THREE.BufferGeometry): THREE.Vector3[] {
    const positions = geometry.getAttribute('position');
    const normals = geometry.getAttribute('normal');
    const gradients: THREE.Vector3[] = [];
    
    for (let i = 0; i < positions.count; i++) {
      if (normals) {
        gradients.push(new THREE.Vector3(
          normals.getX(i),
          normals.getY(i),
          normals.getZ(i)
        ));
      } else {
        gradients.push(new THREE.Vector3(0, 1, 0));
      }
    }
    
    return gradients;
  }

  private computeDivergenceAndCurl(gradientField: THREE.Vector3[]): {
    divergence: number;
    curl: THREE.Vector3;
  } {
    let divergence = 0;
    const curl = new THREE.Vector3(0, 0, 0);
    
    if (gradientField.length < 2) {
      return { divergence, curl };
    }
    
    for (let i = 1; i < gradientField.length; i++) {
      const prev = gradientField[i - 1];
      const curr = gradientField[i];
      
      divergence += (curr.x - prev.x) + (curr.y - prev.y) + (curr.z - prev.z);
      
      curl.x += (curr.z - prev.z) - (curr.y - prev.y);
      curl.y += (curr.x - prev.x) - (curr.z - prev.z);
      curl.z += (curr.y - prev.y) - (curr.x - prev.x);
    }
    
    divergence /= gradientField.length;
    curl.divideScalar(gradientField.length);
    
    return { divergence, curl };
  }

  private computeEigenvalues(
    metricTensor: number[][],
    inertia: { Ixx: number; Iyy: number; Izz: number }
  ): { curvature: number[]; inertia: number[] } {
    const trace = metricTensor[0][0] + metricTensor[1][1] + metricTensor[2][2];
    const det = 
      metricTensor[0][0] * (metricTensor[1][1] * metricTensor[2][2] - metricTensor[1][2] * metricTensor[2][1]) -
      metricTensor[0][1] * (metricTensor[1][0] * metricTensor[2][2] - metricTensor[1][2] * metricTensor[2][0]) +
      metricTensor[0][2] * (metricTensor[1][0] * metricTensor[2][1] - metricTensor[1][1] * metricTensor[2][0]);
    
    const p1 = trace / 3;
    const p2 = Math.cbrt(det);
    
    const curvatureEigenvalues = [p1 - p2, p1, p1 + p2].sort((a, b) => a - b);
    
    const inertiaEigenvalues = [inertia.Ixx, inertia.Iyy, inertia.Izz].sort((a, b) => a - b);
    
    return {
      curvature: curvatureEigenvalues,
      inertia: inertiaEigenvalues
    };
  }

  private computeDimensionalSignatures(geometry: THREE.BufferGeometry): {
    projection2D: number;
    projection1D: number;
    projection0D: number;
  } {
    geometry.computeBoundingBox();
    const box = geometry.boundingBox!;
    const size = new THREE.Vector3();
    box.getSize(size);
    
    const dims = [size.x, size.y, size.z].sort((a, b) => b - a);
    const maxDim = dims[0] || 1;
    
    return {
      projection2D: (dims[0] * dims[1]) / (maxDim * maxDim),
      projection1D: dims[0] / maxDim,
      projection0D: 1
    };
  }

  computeVisualizationParams(
    geometry: THREE.BufferGeometry,
    physical: PhysicalQuantities,
    mathematical: MathematicalQuantities
  ): VisualizationParams {
    const radius = physical.boundingSphere.radius;
    const center = physical.boundingSphere.center;
    
    const cameraDistance = radius * 3;
    const preferredCameraPosition = new THREE.Vector3(
      center.x + cameraDistance * 0.7,
      center.y + cameraDistance * 0.5,
      center.z + cameraDistance * 0.7
    );
    
    const normalizationScale = 10 / radius;
    
    const inertiaValues = [
      physical.inertiaTensor.Ixx,
      physical.inertiaTensor.Iyy,
      physical.inertiaTensor.Izz
    ];
    const minInertiaIndex = inertiaValues.indexOf(Math.min(...inertiaValues));
    const rotationProfile = {
      x: minInertiaIndex === 0 ? 1 : 0,
      y: minInertiaIndex === 1 ? 1 : 0,
      z: minInertiaIndex === 2 ? 1 : 0
    };
    
    const avgCurvature = Math.abs(mathematical.meanCurvature);
    let lightingResponse = 'standard';
    let shadingRecommendation = 'smooth';
    let colorHarmonicPreset = 'holographic';
    
    if (avgCurvature > 1) {
      lightingResponse = 'high_contrast';
      shadingRecommendation = 'flat';
      colorHarmonicPreset = 'plasma';
    } else if (avgCurvature < 0.1) {
      lightingResponse = 'soft';
      shadingRecommendation = 'smooth';
      colorHarmonicPreset = 'metallic';
    }
    
    return {
      preferredCameraPosition,
      normalizationScale,
      rotationProfile,
      lightingResponse,
      shadingRecommendation,
      colorHarmonicPreset
    };
  }

  detectSymmetryGroups(geometry: THREE.BufferGeometry): string[] {
    const symmetries: string[] = [];
    const positions = geometry.getAttribute('position');
    
    geometry.computeBoundingBox();
    const center = new THREE.Vector3();
    geometry.boundingBox!.getCenter(center);
    
    let sphericalSymmetry = true;
    let cylindricalSymmetry = true;
    const tolerance = 0.05;
    
    const distances: number[] = [];
    const zValues: number[] = [];
    
    for (let i = 0; i < Math.min(positions.count, 500); i++) {
      const x = positions.getX(i) - center.x;
      const y = positions.getY(i) - center.y;
      const z = positions.getZ(i) - center.z;
      
      distances.push(Math.sqrt(x * x + y * y + z * z));
      zValues.push(z);
    }
    
    const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
    const distanceVariance = distances.reduce((sum, d) => sum + (d - avgDistance) ** 2, 0) / distances.length;
    
    if (distanceVariance / (avgDistance * avgDistance) < tolerance) {
      symmetries.push('SO(3)');
      symmetries.push('spherical');
    }
    
    const xyDistances: number[] = [];
    for (let i = 0; i < Math.min(positions.count, 500); i++) {
      const x = positions.getX(i) - center.x;
      const y = positions.getY(i) - center.y;
      xyDistances.push(Math.sqrt(x * x + y * y));
    }
    
    const avgXYDistance = xyDistances.reduce((a, b) => a + b, 0) / xyDistances.length;
    const xyVariance = xyDistances.reduce((sum, d) => sum + (d - avgXYDistance) ** 2, 0) / xyDistances.length;
    
    if (xyVariance / (avgXYDistance * avgXYDistance) < tolerance && !symmetries.includes('SO(3)')) {
      symmetries.push('S1');
      symmetries.push('cylindrical');
      symmetries.push('rotational_z');
    }
    
    const checkReflection = (axis: 'x' | 'y' | 'z'): boolean => {
      let matches = 0;
      const sampleSize = Math.min(100, positions.count);
      
      for (let i = 0; i < sampleSize; i++) {
        const idx = Math.floor(i * positions.count / sampleSize);
        const x = positions.getX(idx) - center.x;
        const y = positions.getY(idx) - center.y;
        const z = positions.getZ(idx) - center.z;
        
        const reflected = { x, y, z };
        reflected[axis] = -reflected[axis];
        
        for (let j = 0; j < positions.count; j++) {
          const px = positions.getX(j) - center.x;
          const py = positions.getY(j) - center.y;
          const pz = positions.getZ(j) - center.z;
          
          const dist = Math.sqrt(
            (px - reflected.x) ** 2 +
            (py - reflected.y) ** 2 +
            (pz - reflected.z) ** 2
          );
          
          if (dist < avgDistance * 0.1) {
            matches++;
            break;
          }
        }
      }
      
      return matches / sampleSize > 0.8;
    };
    
    if (checkReflection('x')) symmetries.push('mirror_x');
    if (checkReflection('y')) symmetries.push('mirror_y');
    if (checkReflection('z')) symmetries.push('mirror_z');
    
    if (symmetries.includes('mirror_x') && symmetries.includes('mirror_y') && symmetries.includes('mirror_z')) {
      symmetries.push('Oh');
      symmetries.push('cubic');
    }
    
    if (symmetries.length === 0) {
      symmetries.push('C1');
      symmetries.push('asymmetric');
    }
    
    return symmetries;
  }

  computeHash(data: any): string {
    const str = JSON.stringify(data);
    let hash = 0;
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    const positiveHash = Math.abs(hash);
    return positiveHash.toString(16).padStart(16, '0');
  }

  processGeometry(
    geometry: THREE.BufferGeometry,
    shapeId: string,
    exportConfig: Record<string, any> = {}
  ): ProcessingResult {
    const startTime = performance.now();
    
    const validation = this.validateGeometry(geometry);
    const physical = this.computePhysicalQuantities(geometry);
    const mathematical = this.computeMathematicalQuantities(geometry);
    const visualization = this.computeVisualizationParams(geometry, physical, mathematical);
    const symmetryClassifiers = this.detectSymmetryGroups(geometry);
    
    const stabilityMetrics = {
      overallStability: Math.min(1, 1 / (1 + Math.abs(mathematical.meanCurvature))),
      rotationalStability: this.computeRotationalStability(physical.inertiaTensor)
    };
    
    const tokenData: ShapeTokenData = {
      geometryId: shapeId,
      physical,
      mathematical,
      visualization,
      validation,
      versionChecksum: '2.0.0',
      timestamp: new Date().toISOString(),
      randomSeed: Math.random(),
      exportConfiguration: exportConfig,
      stabilityMetrics,
      symmetryClassifiers,
      hash: ''
    };
    
    tokenData.hash = this.computeHash(tokenData);
    
    const processingTimeMs = performance.now() - startTime;
    
    console.log(`📐 Physical-Geometry processed: ${shapeId} in ${processingTimeMs.toFixed(1)}ms`);
    console.log(`   Validation: ${validation.issues.length === 0 ? '✅ PASS' : `⚠️ ${validation.issues.length} issues`}`);
    console.log(`   Symmetries: ${symmetryClassifiers.join(', ')}`);
    console.log(`   Hash: ${tokenData.hash}`);
    
    return {
      success: validation.issues.length < 5,
      validation,
      physical,
      mathematical,
      visualization,
      token: tokenData,
      processingTimeMs
    };
  }

  private computeRotationalStability(inertia: PhysicalQuantities['inertiaTensor']): number {
    const values = [inertia.Ixx, inertia.Iyy, inertia.Izz].sort((a, b) => a - b);
    const min = values[0];
    const max = values[2];
    
    if (max === 0) return 1;
    
    const ratio = min / max;
    return ratio;
  }

  setDensity(density: number): void {
    this.density = density;
  }
}

export const physicalGeometryProcessor = new PhysicalGeometryProcessor();

export default {
  processGeometry: (geometry: THREE.BufferGeometry, shapeId: string, exportConfig?: Record<string, any>) =>
    physicalGeometryProcessor.processGeometry(geometry, shapeId, exportConfig),
  validateGeometry: (geometry: THREE.BufferGeometry) =>
    physicalGeometryProcessor.validateGeometry(geometry),
  computePhysicalQuantities: (geometry: THREE.BufferGeometry) =>
    physicalGeometryProcessor.computePhysicalQuantities(geometry),
  computeMathematicalQuantities: (geometry: THREE.BufferGeometry) =>
    physicalGeometryProcessor.computeMathematicalQuantities(geometry),
  detectSymmetryGroups: (geometry: THREE.BufferGeometry) =>
    physicalGeometryProcessor.detectSymmetryGroups(geometry),
  setDensity: (density: number) =>
    physicalGeometryProcessor.setDensity(density)
};
