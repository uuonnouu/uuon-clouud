import * as THREE from 'three';

/**
 * Faceted Diamond Geometry Generator
 * Creates real 3D gemstone models with discrete facet planes
 * Based on professional gemological cutting standards
 */

export interface DiamondCutParams {
  diameter?: number;
  crownHeight?: number;    // % of diameter (typically 0.16)
  crownAngle?: number;     // degrees (typically 34.5)
  tableSize?: number;      // % of diameter (typically 0.53-0.55)
  pavilionDepth?: number;  // % of diameter (typically 0.43)
  pavilionAngle?: number;  // degrees (typically 40.75)
  girdleThickness?: number; // % of diameter (typically 0.02)
  numSides?: number;       // For octagonal/square cuts
}

/**
 * Generate Round Brilliant Cut Diamond - 58 Facets
 * Industry standard: Table + 8 star + 8 bezel + 16 upper girdle + 8 pavilion main + 16 lower girdle + 1 culet
 */
export function generateRoundBrilliant(params: DiamondCutParams = {}): THREE.BufferGeometry {
  const {
    diameter = 1.0,
    crownHeight = 0.16,
    crownAngle = 34.5 * Math.PI / 180,
    tableSize = 0.53,
    pavilionDepth = 0.43,
    pavilionAngle = 40.75 * Math.PI / 180,
    girdleThickness = 0.02
  } = params;

  const radius = diameter / 2;
  const tableRadius = radius * tableSize;
  const crownHeightActual = diameter * crownHeight;
  const pavilionDepthActual = diameter * pavilionDepth;
  const girdleHeight = diameter * girdleThickness / 2;

  const vertices: number[] = [];
  const indices: number[] = [];
  const numGirdleFacets = 16; // Upper and lower girdle facets

  // Central vertices
  const tableCenter = [0, crownHeightActual, 0];
  const culetPoint = [0, -pavilionDepthActual, 0];

  vertices.push(...tableCenter); // Index 0
  vertices.push(...culetPoint);  // Index 1

  // Table edge vertices (8 points for star facets)
  const tablePoints: number[][] = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    tablePoints.push([
      tableRadius * Math.cos(angle),
      crownHeightActual,
      tableRadius * Math.sin(angle)
    ]);
    vertices.push(...tablePoints[i]);
  }
  const tableStartIndex = 2;

  // Crown bezel points (between table and girdle)
  const bezelPoints: number[][] = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const bezelRadius = tableRadius + (radius - tableRadius) * 0.5;
    bezelPoints.push([
      bezelRadius * Math.cos(angle),
      girdleHeight,
      bezelRadius * Math.sin(angle)
    ]);
    vertices.push(...bezelPoints[i]);
  }
  const bezelStartIndex = tableStartIndex + 8;

  // Girdle points (widest part)
  const girdlePoints: number[][] = [];
  for (let i = 0; i < numGirdleFacets; i++) {
    const angle = (i / numGirdleFacets) * Math.PI * 2;
    girdlePoints.push([
      radius * Math.cos(angle),
      0,
      radius * Math.sin(angle)
    ]);
    vertices.push(...girdlePoints[i]);
  }
  const girdleStartIndex = bezelStartIndex + 8;

  // Pavilion main points (below girdle)
  const pavilionPoints: number[][] = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const pavilionRadius = radius * 0.6;
    pavilionPoints.push([
      pavilionRadius * Math.cos(angle),
      -pavilionDepthActual * 0.5,
      pavilionRadius * Math.sin(angle)
    ]);
    vertices.push(...pavilionPoints[i]);
  }
  const pavilionStartIndex = girdleStartIndex + numGirdleFacets;

  // Create table facet (octagon)
  for (let i = 0; i < 8; i++) {
    const next = (i + 1) % 8;
    indices.push(0, tableStartIndex + i, tableStartIndex + next);
  }

  // Create star facets (8 triangular facets)
  for (let i = 0; i < 8; i++) {
    const next = (i + 1) % 8;
    indices.push(
      tableStartIndex + i,
      bezelStartIndex + i,
      tableStartIndex + next
    );
  }

  // Create bezel facets (kite-shaped, split into triangles)
  for (let i = 0; i < 8; i++) {
    const next = (i + 1) % 8;
    const girdleIdx1 = girdleStartIndex + (i * 2);
    const girdleIdx2 = girdleStartIndex + (i * 2 + 1) % numGirdleFacets;
    
    indices.push(bezelStartIndex + i, girdleIdx1, girdleIdx2);
    indices.push(bezelStartIndex + i, girdleIdx2, bezelStartIndex + next);
  }

  // Create upper girdle facets (16 triangular facets connecting bezel to girdle)
  for (let i = 0; i < numGirdleFacets; i++) {
    const bezelIdx = bezelStartIndex + Math.floor(i / 2);
    const nextBezel = bezelStartIndex + ((Math.floor(i / 2) + 1) % 8);
    const girdleIdx = girdleStartIndex + i;
    const nextGirdle = girdleStartIndex + ((i + 1) % numGirdleFacets);
    
    // Create triangle for every other girdle point to bezel point
    if (i % 2 === 0) {
      indices.push(bezelIdx, girdleIdx, nextGirdle);
    } else {
      indices.push(bezelIdx, nextGirdle, nextBezel);
    }
  }

  // Create pavilion main facets
  for (let i = 0; i < 8; i++) {
    const girdleIdx1 = girdleStartIndex + (i * 2);
    const girdleIdx2 = girdleStartIndex + ((i * 2 + 1) % numGirdleFacets);
    
    indices.push(pavilionStartIndex + i, girdleIdx1, girdleIdx2);
  }

  // Create lower girdle facets
  for (let i = 0; i < 8; i++) {
    const next = (i + 1) % 8;
    const girdleIdx = girdleStartIndex + (i * 2 + 1) % numGirdleFacets;
    
    indices.push(
      pavilionStartIndex + i,
      girdleIdx,
      pavilionStartIndex + next
    );
  }

  // Create culet facets (8 triangles to point)
  for (let i = 0; i < 8; i++) {
    const next = (i + 1) % 8;
    indices.push(1, pavilionStartIndex + next, pavilionStartIndex + i);
  }

  // Build geometry
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  
  // Compute flat normals for faceted appearance (discrete planes)
  geometry.computeVertexNormals();
  
  // Convert to non-indexed geometry with duplicated vertices for true flat shading
  const nonIndexed = geometry.toNonIndexed();
  nonIndexed.computeVertexNormals();
  
  return nonIndexed;
}

/**
 * Generate Princess Cut Diamond - Square Brilliant
 */
export function generatePrincessCut(params: DiamondCutParams = {}): THREE.BufferGeometry {
  const {
    diameter = 1.0,
    crownHeight = 0.14,
    pavilionDepth = 0.45,
    tableSize = 0.60
  } = params;

  const size = diameter / 2;
  const tableSize2 = size * tableSize;
  const crownH = diameter * crownHeight;
  const pavilionD = diameter * pavilionDepth;

  const vertices: number[] = [];
  const indices: number[] = [];

  // Table center
  vertices.push(0, crownH, 0); // Index 0

  // Table corners (square)
  const tableCorners = [
    [-tableSize2, crownH, -tableSize2],
    [tableSize2, crownH, -tableSize2],
    [tableSize2, crownH, tableSize2],
    [-tableSize2, crownH, tableSize2]
  ];
  tableCorners.forEach(p => vertices.push(...p));

  // Girdle corners (square at widest)
  const girdleCorners = [
    [-size, 0, -size],
    [size, 0, -size],
    [size, 0, size],
    [-size, 0, size]
  ];
  girdleCorners.forEach(p => vertices.push(...p));

  // Culet (point at bottom)
  vertices.push(0, -pavilionD, 0); // Index 9

  // Table facet
  for (let i = 0; i < 4; i++) {
    indices.push(0, 1 + i, 1 + ((i + 1) % 4));
  }

  // Crown facets (table to girdle)
  for (let i = 0; i < 4; i++) {
    const next = (i + 1) % 4;
    indices.push(1 + i, 5 + i, 1 + next);
    indices.push(1 + next, 5 + i, 5 + next);
  }

  // Pavilion facets (girdle to culet)
  for (let i = 0; i < 4; i++) {
    const next = (i + 1) % 4;
    indices.push(9, 5 + next, 5 + i);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  
  // Convert to non-indexed geometry with duplicated vertices for true flat shading
  const nonIndexed = geometry.toNonIndexed();
  nonIndexed.computeVertexNormals();
  
  return nonIndexed;
}

/**
 * Generate Emerald Cut - Rectangular Step Cut
 */
export function generateEmeraldCut(params: DiamondCutParams = {}): THREE.BufferGeometry {
  const {
    diameter = 1.0,
    crownHeight = 0.12,
    pavilionDepth = 0.42
  } = params;

  const length = diameter * 1.35; // 1.35:1 ratio
  const width = diameter;
  const crownH = diameter * crownHeight;
  const pavilionD = diameter * pavilionDepth;
  const numSteps = 4;

  const vertices: number[] = [];
  const indices: number[] = [];

  // Create step-cut terraces
  for (let step = 0; step <= numSteps; step++) {
    const ratio = step / numSteps;
    const stepWidth = width * (0.5 + ratio * 0.5) / 2;
    const stepLength = length * (0.5 + ratio * 0.5) / 2;
    const stepHeight = crownH * (1 - ratio);

    // Four corners of this step
    const corners = [
      [-stepLength, stepHeight, -stepWidth],
      [stepLength, stepHeight, -stepWidth],
      [stepLength, stepHeight, stepWidth],
      [-stepLength, stepHeight, stepWidth]
    ];
    
    const startIdx = vertices.length / 3;
    corners.forEach(p => vertices.push(...p));

    // Connect to previous step
    if (step > 0) {
      const prevStart = startIdx - 4;
      for (let i = 0; i < 4; i++) {
        const next = (i + 1) % 4;
        indices.push(prevStart + i, startIdx + i, startIdx + next);
        indices.push(prevStart + i, startIdx + next, prevStart + next);
      }
    }
  }

  // Pavilion (simple pyramid)
  const girdleStart = vertices.length / 3 - 4;
  vertices.push(0, -pavilionD, 0); // Culet
  const culetIdx = vertices.length / 3 - 1;

  for (let i = 0; i < 4; i++) {
    const next = (i + 1) % 4;
    indices.push(culetIdx, girdleStart + next, girdleStart + i);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  
  // Convert to non-indexed geometry with duplicated vertices for true flat shading
  const nonIndexed = geometry.toNonIndexed();
  nonIndexed.computeVertexNormals();
  
  return nonIndexed;
}

/**
 * Generate Oval Cut - Elliptical Brilliant
 */
export function generateOvalCut(params: DiamondCutParams = {}): THREE.BufferGeometry {
  const brilliant = generateRoundBrilliant(params);
  
  // Scale to create ellipse
  const positions = brilliant.attributes.position.array as Float32Array;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i] *= 1.3; // Stretch X axis
  }
  
  brilliant.attributes.position.needsUpdate = true;
  brilliant.computeVertexNormals();
  
  return brilliant;
}

/**
 * Generate Marquise Cut - Football/Navette Shape
 */
export function generateMarquiseCut(params: DiamondCutParams = {}): THREE.BufferGeometry {
  const brilliant = generateRoundBrilliant(params);
  
  // Scale and pinch ends
  const positions = brilliant.attributes.position.array as Float32Array;
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const z = positions[i + 2];
    const angle = Math.atan2(z, x);
    const pointedness = Math.abs(Math.cos(angle)); // Sharper at ends
    
    positions[i] *= (1.8 * (1 + pointedness * 0.5)); // Elongate
    positions[i + 2] *= (0.7 * (1 - pointedness * 0.3)); // Pinch
  }
  
  brilliant.attributes.position.needsUpdate = true;
  brilliant.computeVertexNormals();
  
  return brilliant;
}

/**
 * Generate Pear Cut - Teardrop Shape
 */
export function generatePearCut(params: DiamondCutParams = {}): THREE.BufferGeometry {
  const brilliant = generateRoundBrilliant(params);
  
  // Asymmetric scaling for pear shape
  const positions = brilliant.attributes.position.array as Float32Array;
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const z = positions[i + 2];
    const angle = Math.atan2(z, x);
    
    // One side round, one side pointed
    const roundness = (Math.cos(angle) + 1) / 2; // 0 to 1
    positions[i] *= (1.4 * (0.6 + roundness * 0.6));
  }
  
  brilliant.attributes.position.needsUpdate = true;
  brilliant.computeVertexNormals();
  
  return brilliant;
}

/**
 * Generate Heart Cut
 */
export function generateHeartCut(params: DiamondCutParams = {}): THREE.BufferGeometry {
  const {
    diameter = 1.0,
    crownHeight = 0.14,
    pavilionDepth = 0.40
  } = params;

  const size = diameter / 2;
  const crownH = diameter * crownHeight;
  const pavilionD = diameter * pavilionDepth;
  const numPoints = 32;

  const vertices: number[] = [];
  const indices: number[] = [];

  // Heart shape parametric curve
  vertices.push(0, crownH, 0); // Table center (index 0)

  // Table edge (heart shape)
  for (let i = 0; i < numPoints; i++) {
    const t = (i / numPoints) * Math.PI * 2 - Math.PI;
    const r = size * 0.8;
    
    // Heart parametric equations
    const x = r * Math.pow(Math.sin(t), 3);
    const z = r * (Math.cos(t) - 0.4 * Math.cos(2 * t)) * 0.9;
    
    vertices.push(x, crownH, z);
  }

  // Girdle (slightly larger)
  for (let i = 0; i < numPoints; i++) {
    const t = (i / numPoints) * Math.PI * 2 - Math.PI;
    const r = size;
    
    const x = r * Math.pow(Math.sin(t), 3);
    const z = r * (Math.cos(t) - 0.4 * Math.cos(2 * t)) * 0.9;
    
    vertices.push(x, 0, z);
  }

  // Culet
  vertices.push(0, -pavilionD, 0);
  const culetIdx = (numPoints * 2) + 1;

  // Table facets
  for (let i = 0; i < numPoints; i++) {
    const next = (i + 1) % numPoints;
    indices.push(0, 1 + i, 1 + next);
  }

  // Crown facets
  for (let i = 0; i < numPoints; i++) {
    const next = (i + 1) % numPoints;
    const tableIdx = 1 + i;
    const nextTable = 1 + next;
    const girdleIdx = 1 + numPoints + i;
    const nextGirdle = 1 + numPoints + next;
    
    indices.push(tableIdx, girdleIdx, nextTable);
    indices.push(nextTable, girdleIdx, nextGirdle);
  }

  // Pavilion facets
  for (let i = 0; i < numPoints; i++) {
    const next = (i + 1) % numPoints;
    const girdleIdx = 1 + numPoints + i;
    const nextGirdle = 1 + numPoints + next;
    
    indices.push(culetIdx, nextGirdle, girdleIdx);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  
  // Convert to non-indexed geometry with duplicated vertices for true flat shading
  const nonIndexed = geometry.toNonIndexed();
  nonIndexed.computeVertexNormals();
  
  return nonIndexed;
}

/**
 * Generate Asscher Cut - Square Emerald with Step Terraces
 */
export function generateAsscherCut(params: DiamondCutParams = {}): THREE.BufferGeometry {
  const emerald = generateEmeraldCut(params);
  
  // Square the geometry (emerald is rectangular)
  const positions = emerald.attributes.position.array as Float32Array;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i] *= (1.0 / 1.35); // Make square instead of rectangular
  }
  
  emerald.attributes.position.needsUpdate = true;
  emerald.computeVertexNormals();
  
  return emerald;
}
