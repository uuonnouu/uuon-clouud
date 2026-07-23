import { SurfaceParameters } from '../types/math';

/**
 * Group Theory Visualizations
 * Mathematical symmetry groups and their geometric manifestations
 * 
 * **Converted to ParametricSurface interface for production use**
 */

export interface ParametricSurface {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

export const GROUP_THEORY: Record<string, ParametricSurface> = {
  // Perfect Icosahedron - 20 triangular faces with icosahedral symmetry group I_h
  icosahedron_group: {
    name: "⬡ Icosahedral Group (I_h) - Group Theory",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 0.1;
      const c = params.c ?? 1;
      const d = params.d ?? 1;
      const e = params.e ?? 0.1;
      const f = params.f ?? 1;
      const g = params.g ?? 1;
      const h = params.h ?? 0.1;
      const i = params.i ?? 1;
      const j = params.j ?? 1;
      
      // Golden ratio φ = (1 + √5) / 2 ≈ 1.618034
      const phi = (1 + Math.sqrt(5)) / 2;
      
      // Icosahedron vertices using golden ratio coordinates
      const vertices = [
        // Rectangle in xy-plane
        [1, phi, 0], [-1, phi, 0], [1, -phi, 0], [-1, -phi, 0],
        // Rectangle in yz-plane  
        [0, 1, phi], [0, -1, phi], [0, 1, -phi], [0, -1, -phi],
        // Rectangle in zx-plane
        [phi, 0, 1], [-phi, 0, 1], [phi, 0, -1], [-phi, 0, -1]
      ];
      
      // Face triangulation for 20 triangular faces
      const faceIndex = Math.floor(u * 20) % 20;
      const faceProgress = (u * 20) % 1;
      
      // Icosahedral face connections (each face is an equilateral triangle)
      const faces = [
        [0, 1, 4], [1, 9, 4], [4, 9, 5], [5, 9, 11], [5, 11, 2],
        [11, 7, 2], [7, 3, 2], [3, 2, 6], [2, 6, 8], [6, 8, 10],
        [8, 10, 1], [1, 10, 0], [0, 10, 6], [6, 7, 0], [7, 0, 3],
        [3, 0, 1], [3, 1, 9], [9, 1, 4], [4, 5, 8], [8, 5, 2]
      ];
      
      let x = 0, y = 0, z = 0;
      
      if (faceIndex < faces.length) {
        const face = faces[faceIndex];
        // Barycentric coordinates for triangle interpolation
        const s = Math.sqrt(faceProgress);
        const t = v;
        const u_coord = 1 - s;
        const v_coord = s * (1 - t);
        const w_coord = s * t;
        
        const v1 = vertices[face[0]];
        const v2 = vertices[face[1]];
        const v3 = vertices[face[2]];
        
        x = u_coord * v1[0] + v_coord * v2[0] + w_coord * v3[0];
        y = u_coord * v1[1] + v_coord * v2[1] + w_coord * v3[1];
        z = u_coord * v1[2] + v_coord * v2[2] + w_coord * v3[2];
        
        // Apply scale and perturbations
        x = a * x + b * Math.sin(c * u + d * v) * 0.05;
        y = a * y + e * Math.cos(f * u + g * v) * 0.05;
        z = a * z + h * Math.sin(i * u + j * v) * 0.03;
      }
      
      return [x, y, z];
    },
    defaultParams: {
      a: 1, b: 0.1, c: 1, d: 1, e: 0.1, f: 1, g: 1, h: 0.1, i: 1, j: 1,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 40, vSegments: 40
    }
  },

  // Perfect Dodecahedron - 12 pentagonal faces with golden ratio proportions
  dodecahedron_group: {
    name: "⬢ Dodecahedral Group (I_h) - Group Theory",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 0.1;
      const c = params.c ?? 1;
      const d = params.d ?? 1;
      const e = params.e ?? 0.1;
      const f = params.f ?? 1;
      const g = params.g ?? 1;
      const h = params.h ?? 0.1;
      const i = params.i ?? 1;
      const j = params.j ?? 1;
      
      const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
      const invPhi = 1 / phi; // ≈ 0.618034
      
      // Dodecahedron vertices (20 vertices)
      const vertices = [
        // Cube vertices
        [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
        [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1],
        // Golden ratio rectangles
        [0, invPhi, phi], [0, invPhi, -phi], [0, -invPhi, phi], [0, -invPhi, -phi],
        [invPhi, phi, 0], [invPhi, -phi, 0], [-invPhi, phi, 0], [-invPhi, -phi, 0],
        [phi, 0, invPhi], [phi, 0, -invPhi], [-phi, 0, invPhi], [-phi, 0, -invPhi]
      ];
      
      // Pentagon face index (12 pentagonal faces)
      const faceIndex = Math.floor(u * 12) % 12;
      const faceProgress = (u * 12) % 1;
      
      // Pentagonal faces of dodecahedron
      const pentagonFaces = [
        [0, 16, 2, 10, 8], [0, 8, 4, 14, 12], [16, 17, 1, 9, 11],
        [1, 12, 14, 5, 9], [2, 13, 15, 6, 10], [3, 11, 9, 5, 19],
        [3, 19, 18, 6, 15], [4, 8, 10, 6, 18], [7, 15, 13, 17, 19],
        [7, 19, 5, 14, 4], [1, 17, 13, 2, 16], [0, 12, 1, 16, 17]
      ];
      
      let x = 0, y = 0, z = 0;
      
      if (faceIndex < pentagonFaces.length) {
        const face = pentagonFaces[faceIndex];
        // Regular pentagon parametrization
        const angle = v * 2 * Math.PI;
        const radius = faceProgress;
        
        // Pentagon center calculation
        let centerX = 0, centerY = 0, centerZ = 0;
        for (let idx = 0; idx < 5; idx++) {
          centerX += vertices[face[idx]][0];
          centerY += vertices[face[idx]][1];
          centerZ += vertices[face[idx]][2];
        }
        centerX /= 5;
        centerY /= 5;
        centerZ /= 5;
        
        // Pentagon vertex interpolation
        const vertexIndex = Math.floor(angle / (2 * Math.PI / 5)) % 5;
        const angleInSegment = (angle % (2 * Math.PI / 5)) / (2 * Math.PI / 5);
        
        const v1 = vertices[face[vertexIndex]];
        const v2 = vertices[face[(vertexIndex + 1) % 5]];
        
        const edgeX = v1[0] + angleInSegment * (v2[0] - v1[0]);
        const edgeY = v1[1] + angleInSegment * (v2[1] - v1[1]);
        const edgeZ = v1[2] + angleInSegment * (v2[2] - v1[2]);
        
        x = centerX + radius * (edgeX - centerX);
        y = centerY + radius * (edgeY - centerY);
        z = centerZ + radius * (edgeZ - centerZ);
        
        // Apply scale and perturbations
        x = a * x + b * Math.sin(c * u + d * v) * 0.04;
        y = a * y + e * Math.cos(f * u + g * v) * 0.04;
        z = a * z + h * Math.sin(i * u + j * v) * 0.03;
      }
      
      return [x, y, z];
    },
    defaultParams: {
      a: 1, b: 0.1, c: 1, d: 1, e: 0.1, f: 1, g: 1, h: 0.1, i: 1, j: 1,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 36, vSegments: 36
    }
  },

  // Cubic Bravais Lattice - Simple cubic crystal structure
  cubic_lattice: {
    name: "◻ Simple Cubic Lattice - Group Theory",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 3;
      const c = params.c ?? 3;
      const d = params.d ?? 3;
      const e = params.e ?? 0.1;
      const f = params.f ?? 1;
      const g = params.g ?? 1;
      const h = params.h ?? 0.1;
      const i = params.i ?? 1;
      const j = params.j ?? 1;
      const k = params.k ?? 0.1;
      const l = params.l ?? 1;
      const m = params.m ?? 1;
      
      // Lattice parameter 'a' controls unit cell size
      const latticeParam = a;
      
      // Generate lattice points in 3D grid
      const nx = Math.floor(u * b + 1); // Number of unit cells in x
      const ny = Math.floor(v * c + 1); // Number of unit cells in y
      const nz = Math.floor((u + v) * d + 1); // Number of unit cells in z
      
      // Lattice point coordinates
      const x = (nx % Math.floor(b + 1)) * latticeParam + e * Math.sin(f * u + g * v) * 0.1;
      const y = (ny % Math.floor(c + 1)) * latticeParam + h * Math.cos(i * u + j * v) * 0.1;
      const z = (nz % Math.floor(d + 1)) * latticeParam + k * Math.sin(l * u + m * v) * 0.08;
      
      return [x, y, z];
    },
    defaultParams: {
      a: 1, b: 3, c: 3, d: 3, e: 0.1, f: 1, g: 1, h: 0.1, i: 1, j: 1, k: 0.1, l: 1, m: 1,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 32, vSegments: 32
    }
  },

  // Face-Centered Cubic (FCC) Lattice - Close-packed crystal structure
  fcc_lattice: {
    name: "◈ Face-Centered Cubic (FCC) - Group Theory",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 3;
      const c = params.c ?? 3;
      const d = params.d ?? 3;
      const e = params.e ?? 0.1;
      const f = params.f ?? 1;
      const g = params.g ?? 1;
      const h = params.h ?? 0.1;
      const i = params.i ?? 1;
      const j = params.j ?? 1;
      const k = params.k ?? 0.1;
      const l = params.l ?? 1;
      const m = params.m ?? 1;
      
      const latticeParam = a;
      
      // FCC basis vectors: (0,0,0), (1/2,1/2,0), (1/2,0,1/2), (0,1/2,1/2)
      const basisPoints = [
        [0, 0, 0],
        [0.5, 0.5, 0],
        [0.5, 0, 0.5],
        [0, 0.5, 0.5]
      ];
      
      const unitCellX = Math.floor(u * b);
      const unitCellY = Math.floor(v * c);
      const unitCellZ = Math.floor((u + v) * d);
      
      const basisIndex = Math.floor((u * 4) % 4);
      const basis = basisPoints[basisIndex];
      
      const x = (unitCellX + basis[0]) * latticeParam + e * Math.sin(f * u + g * v) * 0.05;
      const y = (unitCellY + basis[1]) * latticeParam + h * Math.cos(i * u + j * v) * 0.05;
      const z = (unitCellZ + basis[2]) * latticeParam + k * Math.sin(l * u + m * v) * 0.04;
      
      return [x, y, z];
    },
    defaultParams: {
      a: 1, b: 3, c: 3, d: 3, e: 0.1, f: 1, g: 1, h: 0.1, i: 1, j: 1, k: 0.1, l: 1, m: 1,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 32, vSegments: 32
    }
  },

  // Hexagonal Close-Packed (HCP) Lattice - Alternative close-packed structure
  hcp_lattice: {
    name: "⬢ Hexagonal Close-Packed (HCP) - Group Theory",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 3;
      const c = params.c ?? 1.633;
      const d = params.d ?? 3;
      const e = params.e ?? 0.1;
      const f = params.f ?? 1;
      const g = params.g ?? 1;
      const h = params.h ?? 0.1;
      const i = params.i ?? 1;
      const j = params.j ?? 1;
      const k = params.k ?? 0.1;
      const l = params.l ?? 1;
      const m = params.m ?? 1;
      
      const latticeParam = a;
      const cOverA = c; // c/a ratio for hexagonal lattice
      
      // Hexagonal basis vectors
      const basisPoints = [
        [0, 0, 0],
        [1/3, 2/3, 0.5]
      ];
      
      const unitCellX = Math.floor(u * b);
      const unitCellY = Math.floor(v * b); // Hexagonal, so same as x
      const unitCellZ = Math.floor((u + v) * d);
      
      const basisIndex = Math.floor((u * 2) % 2);
      const basis = basisPoints[basisIndex];
      
      // Hexagonal coordinate transformation
      const x = (unitCellX + basis[0]) * latticeParam + 
                (unitCellY + basis[1]) * latticeParam * 0.5 + 
                e * Math.sin(f * u + g * v) * 0.04;
      const y = (unitCellY + basis[1]) * latticeParam * Math.sqrt(3) / 2 + 
                h * Math.cos(i * u + j * v) * 0.04;
      const z = (unitCellZ + basis[2]) * latticeParam * cOverA + 
                k * Math.sin(l * u + m * v) * 0.03;
      
      return [x, y, z];
    },
    defaultParams: {
      a: 1, b: 3, c: 1.633, d: 3, e: 0.1, f: 1, g: 1, h: 0.1, i: 1, j: 1, k: 0.1, l: 1, m: 1,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 32, vSegments: 32
    }
  }
};

/**
 * Get group theory information for display
 */
export function getGroupTheoryInfo(type: string): {
  name: string;
  description: string;
  symmetryGroup: string;
  order: number | string;
  elements: string;
} {
  const info = {
    icosahedron_group: {
      name: "Icosahedral Group (I_h)",
      description: "Perfect icosahedron with 20 triangular faces and golden ratio proportions",
      symmetryGroup: "Icosahedral symmetry I_h",
      order: 120,
      elements: "60 rotations + 60 reflections, 5-fold and 3-fold rotation axes"
    },
    dodecahedron_group: {
      name: "Dodecahedral Group (I_h)",
      description: "Perfect dodecahedron with 12 pentagonal faces and golden ratio geometry",
      symmetryGroup: "Icosahedral symmetry I_h",
      order: 120,
      elements: "60 rotations + 60 reflections, dual to icosahedron"
    },
    cubic_lattice: {
      name: "Simple Cubic Lattice",
      description: "Basic cubic crystal structure with lattice points at cube corners",
      symmetryGroup: "Cubic point group O_h",
      order: 48,
      elements: "24 rotations + 24 reflections, primitive cubic unit cell"
    },
    fcc_lattice: {
      name: "Face-Centered Cubic (FCC)",
      description: "Close-packed cubic structure with atoms at face centers",
      symmetryGroup: "Cubic point group O_h",
      order: 48,
      elements: "4 atoms per unit cell, coordination number 12"
    },
    hcp_lattice: {
      name: "Hexagonal Close-Packed (HCP)",
      description: "Alternative close-packed structure with hexagonal symmetry",
      symmetryGroup: "Hexagonal point group D_{6h}",
      order: 24,
      elements: "2 atoms per unit cell, coordination number 12"
    }
  };

  return (info as any)[type] || {
    name: "Unknown Group Structure",
    description: "Mathematical symmetry group",
    symmetryGroup: "Unknown symmetry",
    order: "Unknown",
    elements: "Group elements"
  };
}
