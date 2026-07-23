import { SurfaceParameters } from '../types/math';

/**
 * VORONOI & TESSELLATION SYSTEMS LIBRARY
 * 
 * Space-partitioning algorithms that divide space into regions based on
 * distance to seed points, creating organic territorial boundaries and
 * natural-looking cellular patterns.
 * 
 * Voronoi diagrams are fundamental to computational geometry, appearing in
 * crystallography, biology, architecture, and material science.
 * 
 * Product of UUON Foundation Inc.
 * Author: Phillip A. Ruiz III
 */

export interface ParametricSurface {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

// Clean defaults helper
function getCleanDefaults(overrides: Partial<SurfaceParameters> = {}): Partial<SurfaceParameters> {
  return {
    a: 1, b: 1, c: 1, d: 1,
    e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
    n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
    uMin: 0, uMax: 1, vMin: 0, vMax: 1,
    uSegments: 96, vSegments: 72,
    ...overrides
  };
}

export const VORONOI_SYSTEMS: Record<string, ParametricSurface> = {
  
  // 2D/3D VORONOI DIAGRAM: Classic space partitioning
  voronoi_diagram_3d: {
    name: "🔷 3D Voronoi Diagram - Cellular Space Division",
    equation: (u, v, params) => {
      const a = params.a ?? 4.0;     // Grid size (number of cells)
      const b = params.b ?? 1.0;     // Height amplitude
      const c = params.c ?? 1.0;     // Surface smoothness
      const d = params.d ?? 1.0;     // Cell boundary sharpness
      const g = params.g ?? 0;       // Turbulence (jitter seed points)
      const h = params.h ?? 1;       // Recursion (subdivision levels)
      const i = params.i ?? 0;       // Phase coupling (neighbor influence)
      const j = params.j ?? 0;       // Entropy (random height variation)
      const t = params.t ?? 0;       // Time for animation
      
      const gridSize = Math.max(2, Math.min(10, Math.floor(a)));
      const subdivisions = Math.max(1, Math.min(3, Math.floor(h)));
      const cellScale = 1.0 / (gridSize * subdivisions);
      
      // Map UV to world space with time-based wave motion
      const safeT = Math.max(0, t || 0);
      const waveX = Math.sin(safeT * 0.5 + u * Math.PI * 2) * 0.05;
      const waveY = Math.cos(safeT * 0.4 + v * Math.PI * 2) * 0.05;
      const x = u * 2 - 1 + waveX;
      const y = v * 2 - 1 + waveY;
      
      // Generate seed points with optional jitter
      const seeds: Array<[number, number, number]> = [];
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const seedX = (row / (gridSize - 1)) * 2 - 1;
          const seedY = (col / (gridSize - 1)) * 2 - 1;
          
          // Apply turbulence jitter
          const jitterX = g > 0 ? (Math.sin(row * 12.9898 + col * 78.233) * 2 - 1) * g * 0.3 : 0;
          const jitterY = g > 0 ? (Math.cos(row * 43.758 + col * 91.347) * 2 - 1) * g * 0.3 : 0;
          
          // Random height for each seed (using entropy parameter j)
          const seedHash = Math.sin(row * 12.9898 + col * 78.233) * 43758.5453;
          const seedHeight = (seedHash - Math.floor(seedHash)) * (0.5 + j * 0.5);
          
          seeds.push([seedX + jitterX, seedY + jitterY, seedHeight]);
        }
      }
      
      // Find closest and second-closest seeds
      let minDist1 = Infinity;
      let minDist2 = Infinity;
      let closestIndex = 0;
      
      for (let k = 0; k < seeds.length; k++) {
        const dx = x - seeds[k][0];
        const dy = y - seeds[k][1];
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < minDist1) {
          minDist2 = minDist1;
          minDist1 = dist;
          closestIndex = k;
        } else if (dist < minDist2) {
          minDist2 = dist;
        }
      }
      
      // Cell height based on closest seed
      const cellHeight = seeds[closestIndex][2] * b;
      
      // Edge detection (distance between closest and second-closest)
      const edgeDist = minDist2 - minDist1;
      const edgeWeight = Math.pow(Math.max(0, Math.min(1, edgeDist * d * 10)), c);
      
      // Phase coupling: blend neighboring cell heights
      let finalHeight = cellHeight;
      if (i > 0) {
        const neighborContribution = Math.sin(minDist1 * 10 + t * 0.6) * i * 0.3;
        finalHeight += neighborContribution;
      }
      
      // Harmonic breathing animation on height
      const breathe = Math.sin(t * 0.8) * 0.1 + 1.0;
      
      // Surface modulation at cell boundaries
      const z = finalHeight * (1 - edgeWeight * 0.5) * breathe;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 4, b: 1.0, c: 1.0, d: 1.0, uSegments: 64, vSegments: 64 })
  },

  // WEIGHTED VORONOI: Power diagrams with variable cell influence
  weighted_voronoi: {
    name: "⚖️ Weighted Voronoi - Power Diagram",
    equation: (u, v, params) => {
      const a = params.a ?? 5.0;     // Number of sites
      const b = params.b ?? 1.5;     // Height amplitude
      const c = params.c ?? 1.0;     // Weight variation
      const d = params.d ?? 1.0;     // Power exponent (1=linear, 2=quadratic)
      const g = params.g ?? 0;       // Turbulence
      const h = params.h ?? 1;       // Recursion (hierarchical subdivision)
      const j = params.j ?? 0.3;     // Entropy (weight randomization)
      const t = params.t ?? 0;       // Time for animation
      
      const siteCount = Math.max(3, Math.min(12, Math.floor(a)));
      
      // Orbital rotation animation
      const rotation = t * 0.3;
      const cosR = Math.cos(rotation);
      const sinR = Math.sin(rotation);
      const xRot = (u * 2 - 1) * cosR - (v * 2 - 1) * sinR;
      const yRot = (u * 2 - 1) * sinR + (v * 2 - 1) * cosR;
      const x = xRot;
      const y = yRot;
      
      // Generate weighted sites
      const sites: Array<[number, number, number]> = [];
      for (let siteIdx = 0; siteIdx < siteCount; siteIdx++) {
        const angle = (siteIdx / siteCount) * Math.PI * 2;
        const radius = 0.6 + (Math.sin(siteIdx * 2.4) * 0.2);
        
        let siteX = Math.cos(angle) * radius;
        let siteY = Math.sin(angle) * radius;
        
        // Turbulence jitter
        if (g > 0) {
          siteX += (Math.sin(siteIdx * 12.9898) * 2 - 1) * g * 0.2;
          siteY += (Math.cos(siteIdx * 78.233) * 2 - 1) * g * 0.2;
        }
        
        // Weight: combination of fixed pattern and entropy
        const baseWeight = c * (0.5 + Math.sin(siteIdx * 1.5) * 0.5);
        const randomWeight = (Math.sin(siteIdx * 91.347) * 0.5 + 0.5) * j;
        const weight = baseWeight + randomWeight;
        
        sites.push([siteX, siteY, weight]);
      }
      
      // Find closest site using weighted distance (power diagram)
      let minWeightedDist = Infinity;
      let closestWeight = 1;
      
      for (let k = 0; k < sites.length; k++) {
        const dx = x - sites[k][0];
        const dy = y - sites[k][1];
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Power distance: dist^d - weight
        const weightedDist = Math.pow(dist, d) - sites[k][2];
        
        if (weightedDist < minWeightedDist) {
          minWeightedDist = weightedDist;
          closestWeight = sites[k][2];
        }
      }
      
      // Height based on weighted distance with pulsing animation
      const pulse = Math.sin(t * 0.7) * 0.15 + 1.0;
      const z = ((closestWeight * b) - (minWeightedDist * 0.1)) * pulse;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 5, b: 1.5, c: 1.0, d: 1.0, j: 0.3, uSegments: 64, vSegments: 64 })
  },

  // CENTROIDAL VORONOI TESSELLATION: Lloyd's relaxation
  centroidal_voronoi: {
    name: "⬡ Centroidal Voronoi - Lloyd's Relaxation",
    equation: (u, v, params) => {
      const a = params.a ?? 6.0;     // Initial site count
      const b = params.b ?? 1.0;     // Height variation
      const c = params.c ?? 1.0;     // Relaxation smoothness
      const h = params.h ?? 3;       // Recursion (relaxation iterations)
      const g = params.g ?? 0;       // Turbulence
      const i = params.i ?? 0.5;     // Phase coupling (cell harmony)
      const t = params.t ?? 0;       // Time for animation
      
      const siteCount = Math.max(4, Math.min(10, Math.floor(a)));
      const iterations = Math.max(1, Math.min(5, Math.floor(h)));
      
      // Wave-like deformation
      const waveAmp = 0.08;
      const x = u * 2 - 1 + Math.sin(v * Math.PI * 3 + t * 0.6) * waveAmp;
      const y = v * 2 - 1 + Math.cos(u * Math.PI * 3 + t * 0.5) * waveAmp;
      
      // Initialize sites randomly
      let sites: Array<[number, number]> = [];
      for (let k = 0; k < siteCount; k++) {
        const initX = (Math.sin(k * 12.9898) * 2 - 1) * 0.8;
        const initY = (Math.cos(k * 78.233) * 2 - 1) * 0.8;
        sites.push([initX, initY]);
      }
      
      // Lloyd's relaxation: move each site to centroid of its Voronoi cell
      for (let iter = 0; iter < iterations; iter++) {
        const newSites: Array<[number, number]> = [];
        
        for (let k = 0; k < siteCount; k++) {
          let sumX = 0, sumY = 0, count = 0;
          
          // Sample points in space and assign to nearest site
          const samples = 20;
          for (let sx = 0; sx < samples; sx++) {
            for (let sy = 0; sy < samples; sy++) {
              const testX = (sx / samples) * 2 - 1;
              const testY = (sy / samples) * 2 - 1;
              
              // Find closest site
              let minDist = Infinity;
              let closestSite = 0;
              for (let s = 0; s < siteCount; s++) {
                const dx = testX - sites[s][0];
                const dy = testY - sites[s][1];
                const dist = dx * dx + dy * dy;
                if (dist < minDist) {
                  minDist = dist;
                  closestSite = s;
                }
              }
              
              // If this point belongs to current site, accumulate for centroid
              if (closestSite === k) {
                sumX += testX;
                sumY += testY;
                count++;
              }
            }
          }
          
          // Move site to centroid (with relaxation factor)
          if (count > 0) {
            const centroidX = sumX / count;
            const centroidY = sumY / count;
            const relaxFactor = c * 0.8;
            newSites.push([
              sites[k][0] * (1 - relaxFactor) + centroidX * relaxFactor,
              sites[k][1] * (1 - relaxFactor) + centroidY * relaxFactor
            ]);
          } else {
            newSites.push(sites[k]);
          }
        }
        
        sites = newSites;
      }
      
      // Apply turbulence to final sites
      if (g > 0) {
        sites = sites.map(([sx, sy], idx) => [
          sx + (Math.sin(idx * 12.9898) * 2 - 1) * g * 0.1,
          sy + (Math.cos(idx * 78.233) * 2 - 1) * g * 0.1
        ]);
      }
      
      // Calculate distance field
      let minDist = Infinity;
      let secondMinDist = Infinity;
      let closestIdx = 0;
      
      for (let k = 0; k < sites.length; k++) {
        const dx = x - sites[k][0];
        const dy = y - sites[k][1];
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < minDist) {
          secondMinDist = minDist;
          minDist = dist;
          closestIdx = k;
        } else if (dist < secondMinDist) {
          secondMinDist = dist;
        }
      }
      
      // Height based on cell index with phase coupling and time-based ripples
      const ripple = Math.sin(minDist * 8 - t * 1.2) * 0.15 + 1.0;
      const cellHeight = (Math.sin(closestIdx * 2.1 + t * 0.4) * 0.5 + 0.5) * b;
      const edgeBlend = Math.pow(Math.max(0, (secondMinDist - minDist) * 5), i);
      const z = cellHeight * edgeBlend * ripple;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 6, b: 1.0, c: 1.0, h: 3, i: 0.5, uSegments: 64, vSegments: 64 })
  },

  // HEXAGONAL TILING: Perfect honeycomb pattern
  hexagonal_tiling: {
    name: "🍯 Hexagonal Tiling - Honeycomb Pattern",
    equation: (u, v, params) => {
      const a = params.a ?? 6.0;     // Hexagon size (cells per unit)
      const b = params.b ?? 0.8;     // Height variation
      const c = params.c ?? 1.0;     // Edge sharpness
      const d = params.d ?? 0.1;     // Gap width
      const g = params.g ?? 0;       // Turbulence (deform hexagons)
      const i = params.i ?? 0.3;     // Phase coupling (wave propagation)
      const j = params.j ?? 0;       // Entropy (height randomization)
      const t = params.t ?? 0;       // Time for animation
      
      const scale = a;
      const x = u * 2 - 1;
      const y = v * 2 - 1;
      
      // Hexagonal grid calculation
      // Using axial coordinates for perfect hexagons
      const hexWidth = 2.0 / scale;
      const hexHeight = Math.sqrt(3) / scale;
      
      // Convert to hex coordinates
      const q = (x * 2/3) / hexWidth;
      const r = ((-x / 3) + (Math.sqrt(3)/3) * y) / hexHeight;
      
      // Round to nearest hex
      let qi = Math.round(q);
      let ri = Math.round(r);
      const si = Math.round(-q - r);
      
      const qDiff = Math.abs(qi - q);
      const rDiff = Math.abs(ri - r);
      const sDiff = Math.abs(si - (-q - r));
      
      if (qDiff > rDiff && qDiff > sDiff) {
        qi = -ri - si;
      } else if (rDiff > sDiff) {
        ri = -qi - si;
      }
      
      // Convert back to world coordinates
      const hexX = hexWidth * (3/2 * qi);
      const hexY = hexHeight * (Math.sqrt(3)/2 * qi + Math.sqrt(3) * ri);
      
      // Apply turbulence deformation
      let finalHexX = hexX;
      let finalHexY = hexY;
      if (g > 0) {
        const hash = Math.sin(qi * 12.9898 + ri * 78.233) * 43758.5453;
        finalHexX += (hash - Math.floor(hash) - 0.5) * g * hexWidth * 0.3;
        finalHexY += (Math.cos(qi * 43.758 + ri * 91.347) - 0.5) * g * hexHeight * 0.3;
      }
      
      // Distance from hex center
      const dx = x - finalHexX;
      const dy = y - finalHexY;
      const distFromCenter = Math.sqrt(dx * dx + dy * dy);
      
      // Hexagon has radius of hexWidth
      const hexRadius = hexWidth * 0.5;
      const innerDist = distFromCenter / hexRadius;
      
      // Edge falloff
      const edgeFactor = Math.pow(Math.max(0, 1 - innerDist), c);
      const gapFactor = innerDist < (1 - d) ? 1 : 0;
      
      // Cell height with phase coupling (creates wave patterns)
      const cellHash = Math.sin(qi * 2.4 + ri * 3.7) * 0.5 + 0.5;
      const baseHeight = cellHash * b;
      
      // Add entropy variation
      const randomHeight = (Math.sin(qi * 91.347 + ri * 12.9898) * 0.5 + 0.5) * j * 0.3;
      
      // Phase coupling: propagate waves through cells with time animation
      const wavePhase = (qi + ri) * i * Math.PI + t * 0.9;
      const waveHeight = Math.sin(wavePhase) * i * 0.2;
      
      // Harmonic breathing on entire surface
      const harmonicBreath = Math.sin(t * 0.5 + distFromCenter * 2) * 0.12 + 1.0;
      
      const z = (baseHeight + randomHeight + waveHeight) * edgeFactor * gapFactor * harmonicBreath;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 6, b: 0.8, c: 1.0, d: 0.1, i: 0.3, uSegments: 64, vSegments: 64 })
  },

  // PENROSE TILING: Aperiodic golden ratio pattern
  penrose_tiling: {
    name: "✨ Penrose Tiling - Aperiodic Pattern",
    equation: (u, v, params) => {
      const a = params.a ?? 5.0;     // Subdivision scale
      const b = params.b ?? 1.0;     // Height variation
      const c = params.c ?? 1.0;     // Tile boundary sharpness
      const h = params.h ?? 2;       // Recursion (subdivision depth)
      const g = params.g ?? 0;       // Turbulence
      const i = params.i ?? 0.4;     // Phase coupling (tile harmony)
      const t = params.t ?? 0;       // Time for animation
      
      const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
      const scale = a * 0.3;
      const depth = Math.max(1, Math.min(4, Math.floor(h)));
      
      // Golden spiral rotation animation
      const goldenRotation = t * phi * 0.15;
      const cosG = Math.cos(goldenRotation);
      const sinG = Math.sin(goldenRotation);
      const xRot = (u * 2 - 1) * cosG - (v * 2 - 1) * sinG;
      const yRot = (u * 2 - 1) * sinG + (v * 2 - 1) * cosG;
      const x = xRot;
      const y = yRot;
      
      // Penrose rhombus tiling using pentagonal symmetry
      // Two types: thin rhombus (36°) and thick rhombus (72°)
      
      // Five-fold rotational symmetry
      const angle = Math.atan2(y, x);
      const radius = Math.sqrt(x * x + y * y);
      
      // Decompose into 5-fold sectors
      const sectorAngle = (Math.PI * 2) / 5;
      const sector = Math.floor(angle / sectorAngle);
      const localAngle = angle - sector * sectorAngle;
      
      // Within each sector, create rhombus pattern
      const rotatedX = radius * Math.cos(localAngle);
      const rotatedY = radius * Math.sin(localAngle);
      
      // Golden ratio subdivision
      const tileSize = scale / Math.pow(phi, depth - 1);
      
      // Grid coordinates
      const gridX = rotatedX / tileSize;
      const gridY = rotatedY / (tileSize * phi);
      
      // Determine tile type based on position
      const ix = Math.floor(gridX);
      const iy = Math.floor(gridY);
      const fx = gridX - ix;
      const fy = gridY - iy;
      
      // Penrose matching rules (simplified)
      const tileHash = Math.sin(ix * 12.9898 + iy * 78.233 + sector * 45.678) * 43758.5453;
      const tileType = (tileHash - Math.floor(tileHash)) > (1 / phi) ? 0 : 1; // thin or thick
      
      // Distance to tile boundary
      const tileAngle = tileType === 0 ? 36 : 72; // degrees
      const angleRad = tileAngle * Math.PI / 180;
      
      // Simplified rhombus distance
      const dx = Math.abs(fx - 0.5);
      const dy = Math.abs(fy - 0.5);
      const distToBoundary = Math.min(dx, dy, Math.abs(dx * Math.cos(angleRad) + dy * Math.sin(angleRad)));
      
      // Edge sharpness
      const edgeFactor = Math.pow(distToBoundary * 2, c);
      
      // Apply turbulence
      let finalX = x;
      let finalY = y;
      if (g > 0) {
        finalX += (Math.sin(ix * 12.9898 + iy * 78.233) * 2 - 1) * g * tileSize * 0.2;
        finalY += (Math.cos(ix * 43.758 + iy * 91.347) * 2 - 1) * g * tileSize * 0.2;
      }
      
      // Height based on tile type and position with golden ratio pulsing
      const baseHeight = tileType === 0 ? 0.6 : 1.0;
      const phasePattern = Math.sin((ix + iy) * i * Math.PI + t * phi * 0.7) * 0.3;
      const goldenPulse = Math.sin(t * phi * 0.6) * 0.15 + 1.0;
      const z = (baseHeight + phasePattern) * b * edgeFactor * goldenPulse;
      
      return [finalX, finalY, z];
    },
    defaultParams: getCleanDefaults({ a: 5, b: 1.0, c: 1.0, h: 2, i: 0.4, uSegments: 64, vSegments: 64 })
  },

  // DELAUNAY TRIANGULATION: Dual of Voronoi diagram
  delaunay_triangulation: {
    name: "△ Delaunay Triangulation - Optimal Triangular Mesh",
    equation: (u, v, params) => {
      const a = params.a ?? 8;       // Number of seed points
      const b = params.b ?? 1.5;     // Triangle height variation
      const c = params.c ?? 1.0;     // Edge sharpness
      const d = params.d ?? 0.8;     // Circumcircle influence
      const g = params.g ?? 0;       // Turbulence
      const t = params.t ?? 0;       // Time for animation
      
      const pointCount = Math.max(5, Math.min(16, Math.floor(a)));
      
      const x = (u * 2 - 1) * 4;
      const y = (v * 2 - 1) * 4;
      
      // Generate seed points with optional jitter
      const points: Array<[number, number, number]> = [];
      for (let i = 0; i < pointCount; i++) {
        const angle = (i / pointCount) * Math.PI * 2 + t * 0.4;
        const radius = 1.5 + Math.sin(i * 2.7 + t * 0.5) * 0.5;
        
        let px = Math.cos(angle) * radius;
        let py = Math.sin(angle) * radius;
        
        if (g > 0) {
          px += (Math.sin(i * 12.9898) * 2 - 1) * g * 0.3;
          py += (Math.cos(i * 78.233) * 2 - 1) * g * 0.3;
        }
        
        const height = Math.sin(i * 3.14) * 0.5 + 0.5;
        points.push([px, py, height]);
      }
      
      // Find three nearest points (forming Delaunay triangle)
      const distances = points.map((p, i) => ({
        idx: i,
        dist: Math.sqrt((x - p[0]) ** 2 + (y - p[1]) ** 2),
        point: p
      })).sort((a, b) => a.dist - b.dist);
      
      const p1 = distances[0];
      const p2 = distances[1];
      const p3 = distances[2];
      
      // Barycentric coordinates for point in triangle
      const denom = (p2.point[1] - p3.point[1]) * (p1.point[0] - p3.point[0]) + 
                   (p3.point[0] - p2.point[0]) * (p1.point[1] - p3.point[1]);
      
      const w1 = ((p2.point[1] - p3.point[1]) * (x - p3.point[0]) + 
                 (p3.point[0] - p2.point[0]) * (y - p3.point[1])) / denom;
      const w2 = ((p3.point[1] - p1.point[1]) * (x - p3.point[0]) + 
                 (p1.point[0] - p3.point[0]) * (y - p3.point[1])) / denom;
      const w3 = 1 - w1 - w2;
      
      // Delaunay property: empty circumcircle criterion
      // Interpolate height based on barycentric coordinates
      const triangleHeight = w1 * p1.point[2] + w2 * p2.point[2] + w3 * p3.point[2];
      
      // Edge distance for sharpness
      const edgeDist = Math.min(Math.abs(w1), Math.abs(w2), Math.abs(w3));
      const edgeFactor = Math.pow(Math.max(0, edgeDist * 3), c);
      
      // Circumcircle visualization
      const circumInfluence = Math.exp(-p1.dist * d) + Math.exp(-p2.dist * d) + Math.exp(-p3.dist * d);
      
      const z = (triangleHeight * b + circumInfluence * 0.3) * edgeFactor;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 8, b: 1.5, c: 1.0, d: 0.8, uSegments: 72, vSegments: 72 })
  },

  // CONSTRAINED DELAUNAY: Delaunay with boundary constraints
  constrained_delaunay: {
    name: "▽ Constrained Delaunay - Boundary-Aware Triangulation",
    equation: (u, v, params) => {
      const a = params.a ?? 1.5;     // Boundary radius
      const b = params.b ?? 1.0;     // Interior height
      const c = params.c ?? 2.0;     // Constraint penalty
      const d = params.d ?? 10;      // Boundary segments
      const g = params.g ?? 0.3;     // Edge variation
      const t = params.t ?? 0;       // Time for animation
      
      const segments = Math.max(6, Math.min(20, Math.floor(d)));
      
      const x = (u * 2 - 1) * a;
      const y = (v * 2 - 1) * a;
      
      const angle = Math.atan2(y, x);
      const radius = Math.sqrt(x * x + y * y);
      
      // Constrained boundary (polygon with n sides)
      const segmentAngle = (Math.PI * 2) / segments;
      const currentSegment = Math.floor((angle + Math.PI) / segmentAngle);
      const segmentStart = currentSegment * segmentAngle - Math.PI;
      const segmentEnd = segmentStart + segmentAngle;
      
      // Distance to constraint edge
      const midAngle = (segmentStart + segmentEnd) / 2 + Math.sin(t * 0.6 + currentSegment) * g;
      const boundaryRadius = a * (0.9 + Math.cos(currentSegment * 2.3 + t * 0.4) * g);
      const boundaryX = Math.cos(midAngle) * boundaryRadius;
      const boundaryY = Math.sin(midAngle) * boundaryRadius;
      
      const distToEdge = Math.sqrt((x - boundaryX) ** 2 + (y - boundaryY) ** 2);
      
      // Constraint penalty: forces triangulation to respect boundary
      const constraintPenalty = distToEdge > a * 0.1 ? Math.exp(-distToEdge * c) : 1.0;
      
      // Interior triangulation height with radial waves
      const interiorPattern = Math.sin(radius * 5 + t * 0.8) * Math.cos(angle * 3);
      const baseHeight = (1 - radius / a) * b;
      
      const z = (baseHeight + interiorPattern * 0.3) * constraintPenalty;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1.5, b: 1.0, c: 2.0, d: 10, g: 0.3, uSegments: 80, vSegments: 80 })
  },

  // FORTUNE'S ALGORITHM: Sweep-line Voronoi construction
  fortunes_algorithm_sweep: {
    name: "⚡ Fortune's Algorithm - Sweep-Line Voronoi",
    equation: (u, v, params) => {
      const a = params.a ?? 7;       // Number of sites
      const b = params.b ?? 1.5;     // Height amplitude
      const c = params.c ?? 1.0;     // Sweep line speed
      const d = params.d ?? 1.0;     // Beach line curvature
      const t = params.t ?? 0;       // Time (represents sweep line position)
      
      const siteCount = Math.max(4, Math.min(12, Math.floor(a)));
      
      const x = (u * 2 - 1) * 3;
      const y = (v * 2 - 1) * 3;
      
      // Sweep line moves from bottom to top
      const sweepLineY = -3 + (t * c) % 6;
      
      // Generate sites
      const sites: Array<[number, number, number]> = [];
      for (let i = 0; i < siteCount; i++) {
        const siteX = (Math.sin(i * 12.9898) * 2 - 1) * 2.5;
        const siteY = (Math.cos(i * 78.233) * 2 - 1) * 2.5;
        const siteHeight = Math.sin(i * 2.4) * 0.5 + 0.5;
        sites.push([siteX, siteY, siteHeight]);
      }
      
      // Beach line: parabolic arcs for sites above sweep line
      let minDist = Infinity;
      let closestHeight = 0;
      let activeSites = 0;
      
      for (let i = 0; i < siteCount; i++) {
        const [sx, sy, sh] = sites[i];
        
        // Only process sites above sweep line
        if (sy < sweepLineY) {
          activeSites++;
          
          // Parabolic distance (beach line formula)
          const focus = sy;
          const directrix = sweepLineY;
          const parabolicDist = Math.sqrt((x - sx) ** 2 + (y - focus) ** 2) - Math.abs(y - directrix);
          
          if (parabolicDist < minDist) {
            minDist = parabolicDist;
            closestHeight = sh;
          }
        }
      }
      
      // Beach line curvature visualization
      const beachLineEffect = y < sweepLineY ? Math.exp(-Math.abs(y - sweepLineY) * d) : 0;
      
      // Height based on closest site with beach line modulation
      const z = (closestHeight * b + beachLineEffect * 0.5) * (activeSites > 0 ? 1 : 0.2);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 7, b: 1.5, c: 1.0, d: 1.0, uSegments: 72, vSegments: 72 })
  },

  // GABRIEL GRAPH: Superset of Delaunay, geometric proximity
  gabriel_graph: {
    name: "◇ Gabriel Graph - Proximity Network",
    equation: (u, v, params) => {
      const a = params.a ?? 10;      // Number of vertices
      const b = params.b ?? 1.5;     // Edge height
      const c = params.c ?? 0.8;     // Gabriel circle radius factor
      const d = params.d ?? 1.0;     // Connection strength
      const t = params.t ?? 0;       // Time for network evolution
      
      const vertexCount = Math.max(5, Math.min(15, Math.floor(a)));
      
      const x = (u * 2 - 1) * 4;
      const y = (v * 2 - 1) * 4;
      
      // Generate vertices
      const vertices: Array<[number, number]> = [];
      for (let i = 0; i < vertexCount; i++) {
        const angle = (i / vertexCount) * Math.PI * 2 + Math.sin(t * 0.5 + i) * 0.4;
        const radius = 2 + Math.cos(i * 1.7 + t * 0.3) * 0.7;
        vertices.push([Math.cos(angle) * radius, Math.sin(angle) * radius]);
      }
      
      // Gabriel graph property: edge (p,q) exists if no other vertex 
      // lies within circle with diameter pq
      let connectionStrength = 0;
      
      for (let i = 0; i < vertexCount; i++) {
        for (let j = i + 1; j < vertexCount; j++) {
          const [px, py] = vertices[i];
          const [qx, qy] = vertices[j];
          
          // Midpoint of edge
          const mx = (px + qx) / 2;
          const my = (py + qy) / 2;
          
          // Gabriel circle radius (half distance between points)
          const circleRadius = Math.sqrt((qx - px) ** 2 + (qy - py) ** 2) / 2;
          
          // Distance from current point to Gabriel circle center
          const distToMid = Math.sqrt((x - mx) ** 2 + (y - my) ** 2);
          
          // Check if point is within Gabriel circle
          if (distToMid < circleRadius * c) {
            const influence = Math.exp(-distToMid / circleRadius) * d;
            connectionStrength += influence;
          }
        }
      }
      
      const z = connectionStrength * b;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 10, b: 1.5, c: 0.8, d: 1.0, uSegments: 72, vSegments: 72 })
  },

  // NATURAL NEIGHBOR INTERPOLATION: Voronoi-based smooth interpolation
  natural_neighbor_interpolation: {
    name: "🌊 Natural Neighbor - Sibson Interpolation",
    equation: (u, v, params) => {
      const a = params.a ?? 8;       // Number of data points
      const b = params.b ?? 2.0;     // Height range
      const c = params.c ?? 1.2;     // Smoothness factor
      const d = params.d ?? 1.0;     // Weighted influence
      const t = params.t ?? 0;       // Time for data evolution
      
      const dataCount = Math.max(5, Math.min(12, Math.floor(a)));
      
      const x = (u * 2 - 1) * 3;
      const y = (v * 2 - 1) * 3;
      
      // Generate data points with known values
      const dataPoints: Array<[number, number, number]> = [];
      for (let i = 0; i < dataCount; i++) {
        const angle = (i / dataCount) * Math.PI * 2 + t * 0.3;
        const radius = 1.5 + Math.sin(i * 2.1 + t * 0.4) * 0.5;
        const value = Math.sin(i * 1.8 + t * 0.5) * 0.5 + 0.5;
        dataPoints.push([Math.cos(angle) * radius, Math.sin(angle) * radius, value]);
      }
      
      // Sibson coordinates (natural neighbor weights)
      // Based on ratio of Voronoi cell areas
      const weights: number[] = [];
      let totalWeight = 0;
      
      for (let i = 0; i < dataCount; i++) {
        const [px, py, pv] = dataPoints[i];
        const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
        
        // Natural neighbor weight (inverse distance with smoothing)
        const weight = Math.exp(-Math.pow(dist / c, 2)) * d;
        weights.push(weight);
        totalWeight += weight;
      }
      
      // Normalize and interpolate
      let interpolatedValue = 0;
      for (let i = 0; i < dataCount; i++) {
        const normalizedWeight = weights[i] / (totalWeight + 1e-10);
        interpolatedValue += normalizedWeight * dataPoints[i][2];
      }
      
      // Smooth, continuous interpolation
      const z = interpolatedValue * b;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 8, b: 2.0, c: 1.2, d: 1.0, uSegments: 80, vSegments: 80 })
  },

  // POWER CRUST: 3D surface reconstruction from point cloud
  power_crust_reconstruction: {
    name: "🔮 Power Crust - Surface Reconstruction",
    equation: (u, v, params) => {
      const a = params.a ?? 12;      // Sample density
      const b = params.b ?? 1.8;     // Surface height
      const c = params.c ?? 1.0;     // Medial axis distance
      const d = params.d ?? 0.7;     // Power distance weight
      const g = params.g ?? 0.2;     // Surface roughness
      const t = params.t ?? 0;       // Time for reconstruction evolution
      
      const sampleDensity = Math.max(8, Math.min(20, Math.floor(a)));
      
      const x = (u * 2 - 1) * 2.5;
      const y = (v * 2 - 1) * 2.5;
      
      // Underlying surface: sphere with deformations
      const radius = Math.sqrt(x * x + y * y);
      const angle = Math.atan2(y, x);
      
      // Generate point cloud samples on surface
      const samples: Array<[number, number, number, number]> = [];
      for (let i = 0; i < sampleDensity; i++) {
        for (let j = 0; j < sampleDensity; j++) {
          const su = i / sampleDensity;
          const sv = j / sampleDensity;
          const sAngle = su * Math.PI * 2;
          const sRadius = 1.5 + Math.sin(sv * Math.PI + t * 0.4) * g;
          
          const sx = Math.cos(sAngle) * sRadius;
          const sy = Math.sin(sAngle) * sRadius;
          const sz = Math.cos(sv * Math.PI * 2 + t * 0.3) * 0.5;
          const sr = 0.1; // Pole radius for power diagram
          
          samples.push([sx, sy, sz, sr]);
        }
      }
      
      // Power distance: dist^2 - radius^2
      let minPowerDist = Infinity;
      let reconstructedHeight = 0;
      
      for (let i = 0; i < samples.length; i++) {
        const [sx, sy, sz, sr] = samples[i];
        const dist = Math.sqrt((x - sx) ** 2 + (y - sy) ** 2);
        const powerDist = dist * dist - sr * sr;
        
        if (powerDist < minPowerDist) {
          minPowerDist = powerDist;
          reconstructedHeight = sz;
        }
      }
      
      // Medial axis approximation
      const medialDist = Math.exp(-minPowerDist * c) * d;
      
      const z = reconstructedHeight * b + medialDist;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 12, b: 1.8, c: 1.0, d: 0.7, g: 0.2, uSegments: 64, vSegments: 64 })
  }
};
