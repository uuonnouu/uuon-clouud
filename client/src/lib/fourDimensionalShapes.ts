import { ParametricSurface, getCleanDefaults } from '../types/shapes';
import { SurfaceParameters } from '../types/math';
import { EnhancedProjections, Point4D, Point3D } from './enhancedProjections';

// Helper function to generate solid cube faces for 4D polytopes
function generateCubeFace(faceIndex: number, u: number, v: number, fixedCoord: number, fixedAxis: 'x' | 'y' | 'z' | 'w'): Point4D {
  // Convert u,v to cube face coordinates (-1 to 1)
  const a = u * 2 - 1;
  const b = v * 2 - 1;
  
  // Generate point based on which axis is fixed
  let point: Point4D = { x: 0, y: 0, z: 0, w: 0 };
  
  if (fixedAxis === 'w') {
    // 6 faces of a 3D cube in 4D with w fixed
    switch(faceIndex % 6) {
      case 0: point = { x: a, y: b, z: 1, w: fixedCoord }; break;   // front
      case 1: point = { x: a, y: b, z: -1, w: fixedCoord }; break;  // back
      case 2: point = { x: 1, y: a, z: b, w: fixedCoord }; break;   // right
      case 3: point = { x: -1, y: a, z: b, w: fixedCoord }; break;  // left
      case 4: point = { x: a, y: 1, z: b, w: fixedCoord }; break;   // top
      case 5: point = { x: a, y: -1, z: b, w: fixedCoord }; break;  // bottom
    }
  } else if (fixedAxis === 'x') {
    switch(faceIndex % 6) {
      case 0: point = { x: fixedCoord, y: a, z: b, w: 1 }; break;
      case 1: point = { x: fixedCoord, y: a, z: b, w: -1 }; break;
      case 2: point = { x: fixedCoord, y: 1, z: a, w: b }; break;
      case 3: point = { x: fixedCoord, y: -1, z: a, w: b }; break;
      case 4: point = { x: fixedCoord, y: a, z: 1, w: b }; break;
      case 5: point = { x: fixedCoord, y: a, z: -1, w: b }; break;
    }
  } else if (fixedAxis === 'y') {
    switch(faceIndex % 6) {
      case 0: point = { x: a, y: fixedCoord, z: b, w: 1 }; break;
      case 1: point = { x: a, y: fixedCoord, z: b, w: -1 }; break;
      case 2: point = { x: 1, y: fixedCoord, z: a, w: b }; break;
      case 3: point = { x: -1, y: fixedCoord, z: a, w: b }; break;
      case 4: point = { x: a, y: fixedCoord, z: 1, w: b }; break;
      case 5: point = { x: a, y: fixedCoord, z: -1, w: b }; break;
    }
  } else { // z
    switch(faceIndex % 6) {
      case 0: point = { x: a, y: b, z: fixedCoord, w: 1 }; break;
      case 1: point = { x: a, y: b, z: fixedCoord, w: -1 }; break;
      case 2: point = { x: 1, y: a, z: fixedCoord, w: b }; break;
      case 3: point = { x: -1, y: a, z: fixedCoord, w: b }; break;
      case 4: point = { x: a, y: 1, z: fixedCoord, w: b }; break;
      case 5: point = { x: a, y: -1, z: fixedCoord, w: b }; break;
    }
  }
  
  return point;
}

export const FOUR_DIMENSIONAL_SHAPES: Record<string, ParametricSurface> = {

  tesseract_4d: {
    name: "🔷 Tesseract (4D Hypercube) - Movie Style",
    equation: (u, v, params) => {
      const a = params.a ?? 3;
      const time = params.e ?? 0;
      const perspective = params.f ?? 5; // 4D viewing distance
      
      // Enhanced rotation in 4D space - multiple plane rotations
      const rotXY = time * 0.3;
      const rotXZ = time * 0.2;
      const rotXW = time * 0.15; // 4D rotation!
      const rotYZ = time * 0.1;
      const rotYW = time * 0.25;
      const rotZW = time * 0.35;
      
      // Create all 16 vertices of tesseract
      const vertices4D: Point4D[] = [];
      for (let i = 0; i < 16; i++) {
        const x = ((i & 1) * 2 - 1) * a;
        const y = (((i >> 1) & 1) * 2 - 1) * a;
        const z = (((i >> 2) & 1) * 2 - 1) * a;
        const w = (((i >> 3) & 1) * 2 - 1) * a;
        vertices4D.push({ x, y, z, w });
      }
      
      // Apply 4D rotations (6 planes of rotation in 4D)
      const rotated = vertices4D.map(v => {
        let { x, y, z, w } = v;
        
        // XY plane rotation
        let newX = x * Math.cos(rotXY) - y * Math.sin(rotXY);
        let newY = x * Math.sin(rotXY) + y * Math.cos(rotXY);
        x = newX; y = newY;
        
        // XZ plane rotation
        newX = x * Math.cos(rotXZ) - z * Math.sin(rotXZ);
        let newZ = x * Math.sin(rotXZ) + z * Math.cos(rotXZ);
        x = newX; z = newZ;
        
        // XW plane rotation (this is the key 4D effect!)
        newX = x * Math.cos(rotXW) - w * Math.sin(rotXW);
        let newW = x * Math.sin(rotXW) + w * Math.cos(rotXW);
        x = newX; w = newW;
        
        // YZ plane rotation
        newY = y * Math.cos(rotYZ) - z * Math.sin(rotYZ);
        newZ = y * Math.sin(rotYZ) + z * Math.cos(rotYZ);
        y = newY; z = newZ;
        
        // YW plane rotation
        newY = y * Math.cos(rotYW) - w * Math.sin(rotYW);
        newW = y * Math.sin(rotYW) + w * Math.cos(rotYW);
        y = newY; w = newW;
        
        // ZW plane rotation
        newZ = z * Math.cos(rotZW) - w * Math.sin(rotZW);
        newW = z * Math.sin(rotZW) + w * Math.cos(rotZW);
        z = newZ; w = newW;
        
        return { x, y, z, w };
      });
      
      // Map u,v to surface interpolation between vertices
      const edgeIndex = Math.floor(u * 32) % 32; // 32 edges in tesseract
      const t = (u * 32) % 1;
      const s = v;
      
      // Select two vertices for this edge
      const v1 = rotated[edgeIndex % 16];
      const v2 = rotated[(edgeIndex + 1) % 16];
      
      // Interpolate between vertices
      const point4D = {
        x: v1.x + (v2.x - v1.x) * t,
        y: v1.y + (v2.y - v1.y) * t,
        z: v1.z + (v2.z - v1.z) * t,
        w: v1.w + (v2.w - v1.w) * t + s * 0.3 * Math.sin(time * 4) // Surface variation
      };
      
      // 4D to 3D projection (perspective projection from 4D)
      const scale4D = perspective / (perspective + point4D.w);
      
      return [
        point4D.x * scale4D,
        point4D.y * scale4D,
        point4D.z * scale4D
      ];
    },
    defaultParams: getCleanDefaults({ a: 3, e: 0, uSegments: 64, vSegments: 48 })
  },

  four_sphere_hypersphere: {
    name: "🌐 4D Hypersphere (S³)",
    equation: (u, v, params) => {
      const a = params.a ?? 3;
      const time = params.e ?? 0;
      
      const phi = u * Math.PI;
      const theta = v * 2 * Math.PI;
      const psi = time * Math.PI * 0.2;
      
      const point4D: Point4D = {
        x: Math.cos(phi) * Math.cos(theta) * Math.cos(psi),
        y: Math.cos(phi) * Math.cos(theta) * Math.sin(psi),
        z: Math.cos(phi) * Math.sin(theta),
        w: Math.sin(phi)
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.3, 0.4, 0.3);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * point3D.x, a * point3D.y, a * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 3, e: 0, uSegments: 96, vSegments: 96 })
  },

  duocylinder_4d_torus: {
    name: "🍩 Duocylinder (4D Torus)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 2;
      const time = params.e ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const point4D: Point4D = {
        x: a * Math.cos(theta),
        y: a * Math.sin(theta),
        z: b * Math.cos(phi),
        w: b * Math.sin(phi)
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.4, 0.5, 0.4);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [point3D.x, point3D.y, point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 2, e: 0, uSegments: 96, vSegments: 96 })
  },

  five_cell_4d_simplex: {
    name: "🔺 5-Cell (4D Simplex)",
    equation: (u, v, params) => {
      const a = params.a ?? 3;
      const time = params.e ?? 0;
      
      // 5 vertices of the 5-cell (4D simplex)
      const vertices4D: Point4D[] = [
        { x: 1, y: 1, z: 1, w: 1 },
        { x: 1, y: -1, z: -1, w: 1 },
        { x: -1, y: 1, z: -1, w: 1 },
        { x: -1, y: -1, z: 1, w: 1 },
        { x: 0, y: 0, z: 0, w: -Math.sqrt(5) }
      ];
      
      // 10 triangular faces (tetrahedral cells have 4 faces each, 5 cells = 10 faces total for boundary)
      const faces = [
        [0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3], // tetrahedron without vertex 4
        [0, 1, 4], [0, 2, 4], [0, 3, 4],            // faces including vertex 4
        [1, 2, 4], [1, 3, 4], [2, 3, 4]             // remaining faces
      ];
      
      // Select face based on u, then interpolate within triangle using v
      const faceIndex = Math.floor(u * 10) % 10;
      const face = faces[faceIndex];
      const localU = (u * 10) % 1;
      
      // Barycentric interpolation for solid triangle faces
      const bary1 = localU;
      const bary2 = v * (1 - localU);
      const bary3 = 1 - bary1 - bary2;
      
      const v0 = vertices4D[face[0]];
      const v1 = vertices4D[face[1]];
      const v2 = vertices4D[face[2]];
      
      const point4D: Point4D = {
        x: bary1 * v0.x + bary2 * v1.x + bary3 * v2.x,
        y: bary1 * v0.y + bary2 * v1.y + bary3 * v2.y,
        z: bary1 * v0.z + bary2 * v1.z + bary3 * v2.z,
        w: bary1 * v0.w + bary2 * v1.w + bary3 * v2.w
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.4, 0.4, 0.3);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'perspective', 3);
      
      return [a * point3D.x, a * point3D.y, a * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 3, e: 0, uSegments: 128, vSegments: 64 })
  },

  sixteen_cell_cross_polytope: {
    name: "❖ 16-Cell (4D Cross-Polytope)",
    equation: (u, v, params) => {
      const a = params.a ?? 3;
      const time = params.e ?? 0;
      
      // 8 vertices of the 16-cell (cross polytope)
      const vertices4D: Point4D[] = [
        { x: 1, y: 0, z: 0, w: 0 }, { x: -1, y: 0, z: 0, w: 0 },
        { x: 0, y: 1, z: 0, w: 0 }, { x: 0, y: -1, z: 0, w: 0 },
        { x: 0, y: 0, z: 1, w: 0 }, { x: 0, y: 0, z: -1, w: 0 },
        { x: 0, y: 0, z: 0, w: 1 }, { x: 0, y: 0, z: 0, w: -1 }
      ];
      
      // 16 tetrahedral cells, each with 4 triangular faces = 32 triangular faces total
      // But boundary has 24 triangular faces
      const faces = [
        [0, 2, 4], [0, 2, 5], [0, 2, 6], [0, 2, 7],
        [0, 3, 4], [0, 3, 5], [0, 3, 6], [0, 3, 7],
        [1, 2, 4], [1, 2, 5], [1, 2, 6], [1, 2, 7],
        [1, 3, 4], [1, 3, 5], [1, 3, 6], [1, 3, 7],
        [0, 4, 6], [0, 4, 7], [0, 5, 6], [0, 5, 7],
        [1, 4, 6], [1, 4, 7], [1, 5, 6], [1, 5, 7]
      ];
      
      const faceIndex = Math.floor(u * faces.length) % faces.length;
      const face = faces[faceIndex];
      const localU = (u * faces.length) % 1;
      
      // Barycentric interpolation for solid triangle faces
      const bary1 = localU;
      const bary2 = v * (1 - localU);
      const bary3 = 1 - bary1 - bary2;
      
      const v0 = vertices4D[face[0]];
      const v1 = vertices4D[face[1]];
      const v2 = vertices4D[face[2]];
      
      const point4D: Point4D = {
        x: bary1 * v0.x + bary2 * v1.x + bary3 * v2.x,
        y: bary1 * v0.y + bary2 * v1.y + bary3 * v2.y,
        z: bary1 * v0.z + bary2 * v1.z + bary3 * v2.z,
        w: bary1 * v0.w + bary2 * v1.w + bary3 * v2.w
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.5, 0.5, 0.4);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * point3D.x, a * point3D.y, a * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 3, e: 0, uSegments: 128, vSegments: 64 })
  },

  twentyfour_cell: {
    name: "🔶 24-Cell (Self-Dual 4-Polytope)",
    equation: (u, v, params) => {
      const a = params.a ?? 3;
      const time = params.e ?? 0;
      
      const vertices4D: Point4D[] = [];
      
      for (let i = -1; i <= 1; i += 2) {
        for (let j = -1; j <= 1; j += 2) {
          vertices4D.push({ x: i, y: j, z: 0, w: 0 });
          vertices4D.push({ x: i, y: 0, z: j, w: 0 });
          vertices4D.push({ x: i, y: 0, z: 0, w: j });
          vertices4D.push({ x: 0, y: i, z: j, w: 0 });
          vertices4D.push({ x: 0, y: i, z: 0, w: j });
          vertices4D.push({ x: 0, y: 0, z: i, w: j });
        }
      }
      
      const faceIndex = Math.floor(u * 24) % 24;
      const localU = (u * 24) % 1;
      const localV = v;
      
      const center = vertices4D[faceIndex];
      const radius = 0.5;
      const angle = localV * 2 * Math.PI;
      
      const point4D: Point4D = {
        x: center.x + radius * Math.cos(angle) * (1 - localU),
        y: center.y + radius * Math.sin(angle) * (1 - localU),
        z: center.z + radius * Math.cos(angle + Math.PI/3) * (1 - localU),
        w: center.w + radius * Math.sin(angle + Math.PI/3) * (1 - localU)
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.4, 0.6, 0.4);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * point3D.x, a * point3D.y, a * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 3, e: 0, uSegments: 128, vSegments: 64 })
  },

  onetwenty_cell: {
    name: "🌟 120-Cell (Dodecahedral Tessellation)",
    equation: (u, v, params) => {
      const a = params.a ?? 3;
      const time = params.e ?? 0;
      const phi = (1 + Math.sqrt(5)) / 2;
      
      const vertices4D: Point4D[] = [
        { x: 0.5, y: 0.5, z: 0.5, w: 0.5 },
        { x: 0.5, y: 0.5, z: 0.5, w: -0.5 },
        { x: 0, y: 1/phi, z: phi, w: 0 },
        { x: 0, y: 1/phi, z: -phi, w: 0 },
        { x: 1, y: 0, z: 0, w: 0 },
        { x: phi, y: 0, z: 1/phi, w: 0 },
      ];
      
      for (let i = 0; i < 6; i++) {
        const v = vertices4D[i];
        vertices4D.push({ x: v.x, y: v.y, z: v.z, w: -v.w });
        vertices4D.push({ x: v.x, y: v.y, z: -v.z, w: v.w });
        vertices4D.push({ x: v.x, y: -v.y, z: v.z, w: v.w });
        vertices4D.push({ x: -v.x, y: v.y, z: v.z, w: v.w });
      }
      
      const index = Math.floor(u * vertices4D.length) % vertices4D.length;
      const vertex = vertices4D[index];
      const angle = v * 2 * Math.PI;
      const radius = 0.3;
      
      const point4D: Point4D = {
        x: vertex.x + radius * Math.cos(angle),
        y: vertex.y + radius * Math.sin(angle),
        z: vertex.z + radius * Math.cos(angle + Math.PI/4),
        w: vertex.w + radius * Math.sin(angle + Math.PI/4)
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.3, 0.4, 0.3);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * point3D.x, a * point3D.y, a * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 3, e: 0, uSegments: 128, vSegments: 64 })
  },

  sixhundred_cell: {
    name: "💎 600-Cell (Icosahedral Tessellation)",
    equation: (u, v, params) => {
      const a = params.a ?? 3;
      const time = params.e ?? 0;
      const phi = (1 + Math.sqrt(5)) / 2;
      
      const vertices4D: Point4D[] = [
        { x: 0.5, y: 0.5, z: 0.5, w: 0.5 },
        { x: 0, y: 0, z: 1/phi, w: phi },
        { x: 0, y: 1/phi, z: phi, w: 0 },
        { x: 1/phi, y: phi, z: 0, w: 0 },
        { x: phi, y: 0, z: 0, w: 1/phi }
      ];
      
      for (let i = 0; i < 5; i++) {
        const v = vertices4D[i];
        for (let sx = -1; sx <= 1; sx += 2) {
          for (let sy = -1; sy <= 1; sy += 2) {
            for (let sz = -1; sz <= 1; sz += 2) {
              for (let sw = -1; sw <= 1; sw += 2) {
                vertices4D.push({ 
                  x: v.x * sx, 
                  y: v.y * sy, 
                  z: v.z * sz, 
                  w: v.w * sw 
                });
              }
            }
          }
        }
      }
      
      const index = Math.floor(u * Math.min(120, vertices4D.length)) % Math.min(120, vertices4D.length);
      const vertex = vertices4D[index];
      const angle = v * 2 * Math.PI;
      const radius = 0.15;
      
      const point4D: Point4D = {
        x: vertex.x + radius * Math.cos(angle),
        y: vertex.y + radius * Math.sin(angle),
        z: vertex.z + radius * Math.cos(angle + Math.PI/3),
        w: vertex.w + radius * Math.sin(angle + Math.PI/3)
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.3, 0.5, 0.3);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * point3D.x, a * point3D.y, a * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 3, e: 0, uSegments: 128, vSegments: 96 })
  },

  klein_bottle_4d: {
    name: "🫙 Klein Bottle (4D Immersion)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const r = 2 + Math.cos(phi/2) * Math.sin(theta) - Math.sin(phi/2) * Math.sin(2*theta);
      
      const point4D: Point4D = {
        x: r * Math.cos(phi),
        y: r * Math.sin(phi),
        z: Math.sin(phi/2) * Math.sin(theta) + Math.cos(phi/2) * Math.sin(2*theta),
        w: Math.cos(theta)
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.3, 0.4, 0.3);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'perspective', 3);
      
      return [a * point3D.x, a * point3D.y, a * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, e: 0, uSegments: 96, vSegments: 96 })
  },

  hopf_fibration: {
    name: "∞ Hopf Fibration (S³ → S²)",
    equation: (u, v, params) => {
      const a = params.a ?? 3;
      const time = params.e ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const psi = time * 2 * Math.PI * 0.1;
      
      const z1_real = Math.cos(phi/2) * Math.cos(theta);
      const z1_imag = Math.cos(phi/2) * Math.sin(theta);
      const z2_real = Math.sin(phi/2) * Math.cos(psi);
      const z2_imag = Math.sin(phi/2) * Math.sin(psi);
      
      const point4D: Point4D = {
        x: z1_real,
        y: z1_imag,
        z: z2_real,
        w: z2_imag
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.2, 0.3, 0.2);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * point3D.x, a * point3D.y, a * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 3, e: 0, uSegments: 128, vSegments: 96 })
  },

  clifford_torus_4d: {
    name: "🔁 Clifford Torus (Flat 4D Torus)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 2;
      const time = params.e ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const point4D: Point4D = {
        x: a * Math.cos(theta),
        y: a * Math.sin(theta),
        z: b * Math.cos(phi),
        w: b * Math.sin(phi)
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.4, 0.5, 0.4);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      const scale = 1 / (1 + 0.3 * Math.sin(time));
      return [scale * point3D.x, scale * point3D.y, scale * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 2, e: 0, uSegments: 96, vSegments: 96 })
  },

  hyperboloid_4d: {
    name: "📐 4D Hyperboloid (Two-Sheet)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      
      const u_param = u * 2 * Math.PI;
      const v_param = (v - 0.5) * 4;
      const t_param = time * Math.PI * 0.1;
      
      const point4D: Point4D = {
        x: Math.cosh(v_param) * Math.cos(u_param),
        y: Math.cosh(v_param) * Math.sin(u_param),
        z: Math.sinh(v_param) * Math.cos(t_param),
        w: Math.sinh(v_param) * Math.sin(t_param)
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.3, 0.4, 0.3);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'perspective', 4);
      
      return [a * point3D.x, a * point3D.y, a * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, e: 0, uSegments: 96, vSegments: 64 })
  },

  lissajous_knot_4d: {
    name: "🎼 4D Lissajous Knot",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      
      const t = v * 2 * Math.PI;
      const n1 = 3, n2 = 4, n3 = 7, n4 = 8;
      const phi1 = 0, phi2 = Math.PI/4, phi3 = Math.PI/2, phi4 = Math.PI;
      
      const point4D: Point4D = {
        x: Math.cos(n1 * t + phi1),
        y: Math.cos(n2 * t + phi2),
        z: Math.cos(n3 * t + phi3),
        w: Math.cos(n4 * t + phi4)
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.5 + u * 0.2, 0.6, 0.4);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      const thickness = 0.1 + 0.05 * Math.sin(u * 10);
      return [a * point3D.x, a * point3D.y, a * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, e: 0, uSegments: 128, vSegments: 32 })
  },

  duoprism_square_triangle: {
    name: "⬛🔺 Duoprism (Square × Triangle)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      
      const i = Math.floor(u * 4);
      const j = Math.floor(v * 3);
      const localU = (u * 4) % 1;
      const localV = (v * 3) % 1;
      
      const theta1 = (i + localU) * 2 * Math.PI / 4;
      const theta2 = (j + localV) * 2 * Math.PI / 3;
      
      const point4D: Point4D = {
        x: Math.cos(theta1),
        y: Math.sin(theta1),
        z: Math.cos(theta2),
        w: Math.sin(theta2)
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.4, 0.5, 0.3);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * point3D.x, a * point3D.y, a * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, e: 0, uSegments: 96, vSegments: 72 })
  },

  mobius_strip_4d: {
    name: "🔄 4D Möbius Strip",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      
      const u_param = u * 2 * Math.PI;
      const v_param = (v - 0.5) * 0.5;
      
      const point4D: Point4D = {
        x: (1 + v_param * Math.cos(u_param / 2)) * Math.cos(u_param),
        y: (1 + v_param * Math.cos(u_param / 2)) * Math.sin(u_param),
        z: v_param * Math.sin(u_param / 2),
        w: v_param * Math.sin(u_param / 3)
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.3, 0.4, 0.3);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'perspective', 3);
      
      return [a * point3D.x, a * point3D.y, a * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, e: 0, uSegments: 128, vSegments: 32 })
  },

  penrose_tiling_4d: {
    name: "🔷 4D Penrose Tiling Polytope",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      const phi = (1 + Math.sqrt(5)) / 2;
      
      const gridSize = 5;
      const i = Math.floor(u * gridSize);
      const j = Math.floor(v * gridSize);
      const localU = (u * gridSize) % 1;
      const localV = (v * gridSize) % 1;
      
      const point4D: Point4D = {
        x: i + localU * phi,
        y: j + localV * phi,
        z: (i * phi + j) % 3,
        w: (i + j * phi) % 3
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.2, 0.3, 0.2);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'orthographic');
      
      return [a * 0.3 * point3D.x, a * 0.3 * point3D.y, a * 0.3 * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, e: 0, uSegments: 96, vSegments: 96 })
  },

  // ============================================================================
  // 4D HOPF FIBRATION - S³ → S² Map
  // Maps points from the 3-sphere to the 2-sphere with circular fibers
  // ============================================================================
  hopf_fibration_4d: {
    name: "🌀 4D Hopf Fibration - S³ → S²",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      const fiberDensity = params.b ?? 1;
      
      // Parameterize S² (base space)
      const eta = u * Math.PI;
      const xi = v * 2 * Math.PI;
      
      // Fiber parameter along the circle
      const t = time * 0.5 + u * fiberDensity * 2 * Math.PI;
      
      // Complex coordinates z₁, z₂ on S³
      const z1Re = Math.cos(eta/2) * Math.cos(t);
      const z1Im = Math.cos(eta/2) * Math.sin(t);
      const z2Re = Math.sin(eta/2) * Math.cos(xi + t);
      const z2Im = Math.sin(eta/2) * Math.sin(xi + t);
      
      const point4D: Point4D = {
        x: z1Re,
        y: z1Im,
        z: z2Re,
        w: z2Im
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.3, 0.4, 0.3);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * point3D.x, a * point3D.y, a * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, e: 0, uSegments: 128, vSegments: 64 })
  },

  // ============================================================================
  // 4D STEREOGRAPHIC PROJECTION SURFACE
  // Inverse stereographic projection from ℝ³ to S³
  // ============================================================================
  stereographic_projection_4d: {
    name: "🔮 4D Stereographic Projection Surface",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      const range = params.b ?? 3;
      
      // Map u,v to ℝ³ coordinates
      const uCoord = (u - 0.5) * 2 * range;
      const vCoord = (v - 0.5) * 2 * range;
      const wCoord = Math.sin(u * Math.PI * 2 + time) * range * 0.5;
      
      // Inverse stereographic projection: ℝ³ → S³
      const normSq = uCoord*uCoord + vCoord*vCoord + wCoord*wCoord;
      const denom = 1 + normSq;
      
      const point4D: Point4D = {
        x: 2 * uCoord / denom,
        y: 2 * vCoord / denom,
        z: 2 * wCoord / denom,
        w: (normSq - 1) / denom
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.25, 0.35, 0.25);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'perspective', 4);
      
      return [a * point3D.x, a * point3D.y, a * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 3, e: 0, uSegments: 96, vSegments: 96 })
  },

  // ============================================================================
  // 4D SPINOR FIBRATION - SO(4) → S³ × S³
  // Quaternion representation of 4D rotations
  // ============================================================================
  spinor_fibration_4d: {
    name: "🔄 4D Spinor Fibration - SO(4)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      
      // Quaternion parameters
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const psi = time * 0.3;
      
      // First quaternion q₁
      const q1w = Math.cos(theta/2) * Math.cos(phi/2);
      const q1x = Math.sin(theta/2) * Math.cos(phi/2);
      const q1y = Math.cos(theta/2) * Math.sin(phi/2);
      const q1z = Math.sin(theta/2) * Math.sin(phi/2);
      
      // Apply rotation in 4D
      const point4D: Point4D = {
        x: q1w * Math.cos(psi) - q1x * Math.sin(psi),
        y: q1x * Math.cos(psi) + q1w * Math.sin(psi),
        z: q1y * Math.cos(psi * 0.7) - q1z * Math.sin(psi * 0.7),
        w: q1z * Math.cos(psi * 0.7) + q1y * Math.sin(psi * 0.7)
      };
      
      const [rot1, rot2] = EnhancedProjections.animatedRotation(time * 0.2, 0.5, 0.4);
      const point3D = EnhancedProjections.rotateAndProject(point4D, rot1, rot2, 'stereographic');
      
      return [a * point3D.x, a * point3D.y, a * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, e: 0, uSegments: 128, vSegments: 64 })
  },

  // ============================================================================
  // 4D ROMAN SURFACE (Boy's Surface in 4D)
  // Non-orientable surface immersion in 4D without self-intersections
  // ============================================================================
  roman_surface_4d: {
    name: "🎭 4D Roman Surface (Boy's Surface)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      // Homogeneous coordinates on ℝP²
      const x1 = Math.sin(theta) * Math.cos(phi);
      const x2 = Math.sin(theta) * Math.sin(phi);
      const x3 = Math.cos(theta);
      
      const normSq = x1*x1 + x2*x2 + x3*x3;
      const norm4 = normSq * normSq;
      
      // Roman surface parametrization extended to 4D
      const point4D: Point4D = {
        x: (2 * x1 * x2 * (x1*x1 - x2*x2)) / norm4,
        y: (2 * x1 * x3 * (x1*x1 - x3*x3)) / norm4,
        z: (2 * x2 * x3 * (x2*x2 - x3*x3)) / norm4,
        w: (x1*x1*x1*x1 - x2*x2*x2*x2 - x3*x3*x3*x3 + 2*x1*x1*x2*x2 - 2*x1*x1*x3*x3) / norm4
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.25, 0.4, 0.3);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * 2 * point3D.x, a * 2 * point3D.y, a * 2 * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, e: 0, uSegments: 96, vSegments: 96 })
  },

  // ============================================================================
  // 4D QUATERNIONIC PROJECTIVE LINE (ℍP¹)
  // 4D sphere with quaternionic structure
  // ============================================================================
  quaternionic_projective_line: {
    name: "🔷 Quaternionic Projective Line ℍP¹",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const psi = time * 0.2;
      
      // Quaternion coordinates q₁, q₂
      const q1Norm = Math.cos(phi);
      const q2Norm = Math.sin(phi);
      
      // Real parts of q₁q̄₂
      const normSq = q1Norm*q1Norm + q2Norm*q2Norm;
      
      const point4D: Point4D = {
        x: 2 * q1Norm * q2Norm * Math.cos(theta + psi) / normSq,
        y: 2 * q1Norm * q2Norm * Math.sin(theta + psi) / normSq,
        z: 2 * q1Norm * q2Norm * Math.cos(theta * 2 + psi * 0.5) / normSq,
        w: (q1Norm*q1Norm - q2Norm*q2Norm) / normSq
      };
      
      const [rot1, rot2] = EnhancedProjections.animatedRotation(time * 0.3, 0.45, 0.35);
      const point3D = EnhancedProjections.rotateAndProject(point4D, rot1, rot2, 'stereographic');
      
      return [a * point3D.x, a * point3D.y, a * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, e: 0, uSegments: 96, vSegments: 48 })
  },

  // ============================================================================
  // 4D TWISTED CUBIC - Rational Normal Curve
  // Degree-3 Veronese embedding in 4D projective space
  // ============================================================================
  twisted_cubic_4d: {
    name: "🌀 4D Twisted Cubic - Veronese Curve",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      const thickness = params.b ?? 0.15;
      
      const t = u * 2 * Math.PI;
      const r = Math.cos(t);
      const s = Math.sin(t);
      
      // Homogeneous coordinates [s³ : s²t : st² : t³]
      // Normalized to create the twisted cubic curve
      const norm = Math.pow(r*r + s*s, 1.5);
      
      const point4D: Point4D = {
        x: s * s * s / norm,
        y: s * s * r / norm,
        z: s * r * r / norm,
        w: r * r * r / norm
      };
      
      // Add thickness using v parameter for surface rendering
      const offset = (v - 0.5) * thickness;
      point4D.x += offset * Math.cos(t * 2 + time);
      point4D.y += offset * Math.sin(t * 2 + time);
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.35, 0.5, 0.4);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * 2 * point3D.x, a * 2 * point3D.y, a * 2 * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 0.15, e: 0, uSegments: 128, vSegments: 24 })
  },

  // ============================================================================
  // 4D BORROMEAN RINGS - Topologically Unlinked in 4D
  // Three circles pairwise unlinked in 4D but linked in 3D projections
  // ============================================================================
  borromean_rings_4d: {
    name: "⭕⭕⭕ 4D Borromean Rings",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      const ringRadius = params.b ?? 1;
      const tubeRadius = params.c ?? 0.1;
      
      // Select which ring based on u
      const ringIndex = Math.floor(u * 3) % 3;
      const localU = (u * 3) % 1;
      const t = localU * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      let point4D: Point4D = { x: 0, y: 0, z: 0, w: 0 };
      
      // Three orthogonal circles in 4D
      if (ringIndex === 0) {
        // C₁: (cos(t), sin(t), 0, 0) - XY plane
        point4D = {
          x: ringRadius * Math.cos(t) + tubeRadius * Math.cos(phi) * Math.cos(t),
          y: ringRadius * Math.sin(t) + tubeRadius * Math.cos(phi) * Math.sin(t),
          z: tubeRadius * Math.sin(phi),
          w: 0
        };
      } else if (ringIndex === 1) {
        // C₂: (0, 0, cos(t), sin(t)) - ZW plane
        point4D = {
          x: tubeRadius * Math.sin(phi),
          y: 0,
          z: ringRadius * Math.cos(t) + tubeRadius * Math.cos(phi) * Math.cos(t),
          w: ringRadius * Math.sin(t) + tubeRadius * Math.cos(phi) * Math.sin(t)
        };
      } else {
        // C₃: (cos(t), 0, sin(t), 0) - XZ plane
        point4D = {
          x: ringRadius * Math.cos(t) + tubeRadius * Math.cos(phi) * Math.cos(t),
          y: tubeRadius * Math.sin(phi),
          z: ringRadius * Math.sin(t) + tubeRadius * Math.cos(phi) * Math.sin(t),
          w: 0
        };
      }
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.3, 0.4, 0.35);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * point3D.x, a * point3D.y, a * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 0.1, e: 0, uSegments: 192, vSegments: 32 })
  },

  // ============================================================================
  // 4D KUMMER SURFACE - Quartic with 16 Singular Points
  // Related to Jacobian of genus-2 curves, becomes K3 after resolving singularities
  // ============================================================================
  kummer_surface_4d: {
    name: "💎 4D Kummer Surface - 16 Nodes",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      const k = params.b ?? 0.5; // Kummer parameter
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      // Kummer surface parametrization
      const x1 = Math.sin(theta) * Math.cos(phi);
      const x2 = Math.sin(theta) * Math.sin(phi);
      const x3 = Math.cos(theta);
      const x4 = Math.sin(2 * theta) * Math.sin(phi + time * 0.2);
      
      // Apply Kummer quartic constraint
      const sum4 = Math.pow(x1, 4) + Math.pow(x2, 4) + Math.pow(x3, 4) + Math.pow(x4, 4);
      const sum2Sq = Math.pow(x1*x1 + x2*x2 + x3*x3 + x4*x4, 2);
      const scale = 1 / (1 + Math.abs(sum4 - k * sum2Sq) * 0.5);
      
      const point4D: Point4D = {
        x: x1 * scale,
        y: x2 * scale,
        z: x3 * scale,
        w: x4 * scale
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.2, 0.35, 0.3);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * 2 * point3D.x, a * 2 * point3D.y, a * 2 * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 0.5, e: 0, uSegments: 96, vSegments: 96 })
  },

  // ============================================================================
  // 4D SEIFERT SURFACE - Spanning Surface for 4D Knot
  // Orientable surface bounded by a 4D knot
  // ============================================================================
  seifert_surface_4d: {
    name: "🎀 4D Seifert Surface - Knot Boundary",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      const p = params.b ?? 3; // Trefoil parameters
      const q = params.c ?? 2;
      
      // Trefoil knot boundary in 4D
      const t = u * 2 * Math.PI;
      const s = v; // Spanning parameter
      
      // Knot coordinates
      const knotX = (2 + Math.cos(p * t)) * Math.cos(q * t);
      const knotY = (2 + Math.cos(p * t)) * Math.sin(q * t);
      const knotZ = Math.sin(p * t);
      const knotW = Math.sin(p * t + time * 0.3) * 0.5;
      
      // Span from center to knot
      const point4D: Point4D = {
        x: s * knotX + (1 - s) * Math.cos(t * 2 + time * 0.1) * 0.5,
        y: s * knotY + (1 - s) * Math.sin(t * 2 + time * 0.1) * 0.5,
        z: s * knotZ,
        w: s * knotW + (1 - s) * Math.sin(t * 3) * 0.3
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.25, 0.4, 0.35);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * 0.5 * point3D.x, a * 0.5 * point3D.y, a * 0.5 * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 3, c: 2, e: 0, uSegments: 128, vSegments: 64 })
  },

  // ============================================================================
  // 4D CALABI-YAU MANIFOLD - String Theory Space
  // Complex 2D surface essential in string theory compactification
  // ============================================================================
  calabi_yau_4d: {
    name: "🎻 4D Calabi-Yau Manifold - String Space",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      const n = params.b ?? 4; // Exponent (quartic = 4)
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const psi = time * 0.15;
      
      // Simplified Calabi-Yau: x₁ⁿ + x₂ⁿ + x₃ⁿ + x₄ⁿ = 0 in complex projective space
      // Using trigonometric parameterization
      const x1Re = Math.cos(theta) * Math.sin(phi);
      const x1Im = Math.sin(theta) * Math.sin(phi);
      const x2Re = Math.cos(phi) * Math.cos(psi);
      const x2Im = Math.cos(phi) * Math.sin(psi);
      
      // Ricci-flat constraint approximation
      const constraint = Math.pow(x1Re, n) + Math.pow(x1Im, n) + Math.pow(x2Re, n) + Math.pow(x2Im, n);
      const scale = 1 / (1 + Math.abs(constraint) * 0.1);
      
      const point4D: Point4D = {
        x: x1Re * scale,
        y: x1Im * scale,
        z: x2Re * scale,
        w: x2Im * scale
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.2, 0.4, 0.35);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * 2 * point3D.x, a * 2 * point3D.y, a * 2 * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 4, e: 0, uSegments: 96, vSegments: 96 })
  },

  // ============================================================================
  // 4D MODULAR SURFACE KNOTS - Number Theory Meets Topology
  // Knots following modular group transformations
  // ============================================================================
  "modular-surface-knots_4d": {
    name: "🔢 4D Modular Surface Knots",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      const modularLevel = params.b ?? 3;
      
      const t = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      // Modular group action: z → (az+b)/(cz+d)
      const modA = Math.cos(modularLevel * t);
      const modB = Math.sin(modularLevel * t);
      const modC = Math.sin(modularLevel * t + Math.PI/4);
      const modD = Math.cos(modularLevel * t + Math.PI/4);
      
      const zRe = Math.cos(phi) * 0.5;
      const zIm = Math.sin(phi) * 0.5 + 0.5;
      
      // Apply modular transformation
      const denom = (modC * zRe + modD) * (modC * zRe + modD) + (modC * zIm) * (modC * zIm);
      const wRe = ((modA * zRe + modB) * (modC * zRe + modD) + modA * modC * zIm * zIm) / denom;
      const wIm = (modA * zIm * (modC * zRe + modD) - (modA * zRe + modB) * modC * zIm) / denom;
      
      const point4D: Point4D = {
        x: wRe,
        y: wIm,
        z: Math.sin(t * modularLevel + time * 0.2),
        w: Math.cos(t * modularLevel * 0.5 + time * 0.1)
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.2, 0.35, 0.3);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * point3D.x, a * point3D.y, a * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 3, e: 0, uSegments: 128, vSegments: 64 })
  },

  // ============================================================================
  // 4D RICCI FLOW SINGULARITIES - Geometric Evolution
  // Visualization of singularity formation in 4D Einstein manifolds
  // ============================================================================
  ricci_flow_4d: {
    name: "🌊 4D Ricci Flow Singularities",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      const flowTime = params.b ?? 1;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // Initial sphere that develops singularities under Ricci flow
      // ∂g/∂t = -2Ric(g)
      const singularityTime = 1 - flowTime * 0.9;
      const radius = Math.max(0.1, singularityTime);
      
      // Add neck pinching behavior
      const neckFactor = 1 + 2 * (1 - singularityTime) * Math.sin(phi * 2) * Math.sin(phi * 2);
      
      const point4D: Point4D = {
        x: radius * Math.sin(phi) * Math.cos(theta) / neckFactor,
        y: radius * Math.sin(phi) * Math.sin(theta) / neckFactor,
        z: radius * Math.cos(phi),
        w: (1 - singularityTime) * Math.sin(2 * phi) * Math.sin(2 * theta + time * 0.3)
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.15, 0.3, 0.25);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * 2 * point3D.x, a * 2 * point3D.y, a * 2 * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, e: 0, uSegments: 96, vSegments: 96 })
  },

  // ============================================================================
  // 4D HYPERBOLIC LIMIT SETS - Fractal Boundaries
  // Kleinian groups acting on ∂H⁴
  // ============================================================================
  hyperbolic_limit_sets_4d: {
    name: "🌀 4D Hyperbolic Limit Sets",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      const iterations = Math.floor(params.b ?? 5);
      
      let x = (u - 0.5) * 4;
      let y = (v - 0.5) * 4;
      let z = Math.sin(u * Math.PI * 2) * 2;
      let w = Math.cos(v * Math.PI * 2) * 2;
      
      // Iterate hyperbolic group action
      for (let i = 0; i < iterations; i++) {
        const r2 = x*x + y*y + z*z + w*w;
        if (r2 > 0.0001) {
          // Inversion through sphere
          const invScale = 1 / r2;
          x *= invScale;
          y *= invScale;
          z *= invScale;
          w *= invScale;
        }
        // Apply rotation
        const angle = time * 0.1 + i * 0.5;
        const tempX = x * Math.cos(angle) - y * Math.sin(angle);
        y = x * Math.sin(angle) + y * Math.cos(angle);
        x = tempX;
        
        const tempZ = z * Math.cos(angle * 0.7) - w * Math.sin(angle * 0.7);
        w = z * Math.sin(angle * 0.7) + w * Math.cos(angle * 0.7);
        z = tempZ;
        
        // Translation
        x += 0.5;
      }
      
      const point4D: Point4D = { x, y, z, w };
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.2, 0.4, 0.3);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      const scale = 0.3;
      return [a * scale * point3D.x, a * scale * point3D.y, a * scale * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 5, e: 0, uSegments: 96, vSegments: 96 })
  },

  // ============================================================================
  // 4D INSTANTON MODULI SPACES - Yang-Mills Solutions
  // ADHM construction visualization
  // ============================================================================
  instanton_moduli_4d: {
    name: "⚡ 4D Instanton Moduli Spaces",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      const charge = params.b ?? 1; // Instanton charge
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // Self-dual Yang-Mills connection on S⁴
      // F = *F (self-duality condition)
      const r = 1 + 0.3 * Math.sin(charge * theta) * Math.sin(charge * phi);
      
      const point4D: Point4D = {
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        w: 0.5 * Math.sin(2 * charge * theta) * Math.sin(2 * charge * phi + time * 0.2)
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.25, 0.45, 0.35);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * point3D.x, a * point3D.y, a * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, e: 0, uSegments: 96, vSegments: 96 })
  },

  // ============================================================================
  // 4D CELLULAR AUTOMATA - Hypercubic Evolution
  // Game of Life patterns in 4D
  // ============================================================================
  cellular_automata_4d: {
    name: "🎮 4D Cellular Automata - Hypercubic Life",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      const generation = Math.floor(params.b ?? 5);
      
      // Map to 4D grid coordinates
      const gridSize = 8;
      const i = Math.floor(u * gridSize);
      const j = Math.floor(v * gridSize);
      const k = (i + j) % gridSize;
      const l = Math.abs(i - j) % gridSize;
      
      // Simple 4D cellular automaton rule
      let alive = 0;
      for (let g = 0; g < generation; g++) {
        // Count neighbors in 4D (80 neighbors for hypercube)
        const neighborSum = Math.sin(i * 0.7 + g * 0.3 + time * 0.1) + 
                           Math.sin(j * 0.5 + g * 0.4) +
                           Math.sin(k * 0.6 + g * 0.2) +
                           Math.sin(l * 0.8 + g * 0.5);
        alive = (neighborSum > 0.5) ? 1 : 0;
      }
      
      const scale = 0.15 + alive * 0.15;
      const point4D: Point4D = {
        x: (i - gridSize/2) * 0.3 + scale * Math.cos(time * 0.5),
        y: (j - gridSize/2) * 0.3 + scale * Math.sin(time * 0.5),
        z: (k - gridSize/2) * 0.3,
        w: (l - gridSize/2) * 0.3
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.15, 0.3, 0.25);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'orthographic');
      
      return [a * point3D.x, a * point3D.y, a * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 5, e: 0, uSegments: 64, vSegments: 64 })
  },

  // ============================================================================
  // 4D MINIMAL SURFACES - Zero Mean Curvature
  // Surfaces satisfying Plateau problem in 4D
  // ============================================================================
  minimal_surface_4d: {
    name: "✨ 4D Minimal Surface - Zero Curvature",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      const harmonic = params.b ?? 1;
      
      // Minimal surface uses harmonic coordinates
      // Δx = Δy = Δz = Δw = 0
      const theta = u * 2 * Math.PI;
      const s = (v - 0.5) * 2;
      
      // Weierstrass representation extended to 4D
      const point4D: Point4D = {
        x: Math.cosh(s * harmonic) * Math.cos(theta),
        y: Math.cosh(s * harmonic) * Math.sin(theta),
        z: s * harmonic,
        w: Math.sinh(s * harmonic * 0.5) * Math.sin(theta * 2 + time * 0.2)
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.2, 0.35, 0.3);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * 0.5 * point3D.x, a * 0.5 * point3D.y, a * 0.5 * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, e: 0, uSegments: 96, vSegments: 64 })
  },

  // ============================================================================
  // 4D EXOTIC SMOOTH STRUCTURES - Unique to Dimension 4
  // Visualizing diffeomorphism classes of ℝ⁴
  // ============================================================================
  exotic_smooth_4d: {
    name: "🌌 4D Exotic Smooth Structure - Unique R⁴",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      const exoticParam = params.b ?? 1;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // Standard sphere with exotic twist
      // Homeomorphic but not diffeomorphic structure
      const r = 1;
      const twist = exoticParam * Math.sin(3 * theta) * Math.sin(2 * phi);
      
      const point4D: Point4D = {
        x: r * Math.sin(phi) * Math.cos(theta) * (1 + 0.2 * twist),
        y: r * Math.sin(phi) * Math.sin(theta) * (1 + 0.2 * twist),
        z: r * Math.cos(phi) * (1 + 0.1 * twist),
        w: twist * 0.5 * Math.sin(time * 0.3)
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.15, 0.3, 0.25);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * 1.5 * point3D.x, a * 1.5 * point3D.y, a * 1.5 * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, e: 0, uSegments: 96, vSegments: 96 })
  },

  // ============================================================================
  // 4D ZIMMER PROGRAM OBJECTS - Higher-Rank Lattice Actions
  // Fundamental questions about rigidity in dimension 4
  // ============================================================================
  zimmer_program_4d: {
    name: "📐 4D Zimmer Program - Lattice Actions",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      const rank = params.b ?? 2;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // Higher-rank lattice action visualization
      // Γ ⊂ G with ℝ-rank(G) ≥ 2
      const latticeX = Math.floor(theta * rank) / rank;
      const latticeY = Math.floor(phi * rank) / rank;
      
      const point4D: Point4D = {
        x: Math.sin(phi) * Math.cos(theta) + 0.1 * Math.sin(rank * theta),
        y: Math.sin(phi) * Math.sin(theta) + 0.1 * Math.sin(rank * phi),
        z: Math.cos(phi),
        w: 0.2 * Math.sin(rank * (theta + phi) + time * 0.2)
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.15, 0.35, 0.28);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * point3D.x, a * point3D.y, a * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 2, e: 0, uSegments: 96, vSegments: 96 })
  },

  // ============================================================================
  // 4D PERFECTOID SPACES - p-adic Geometry
  // Scholze's tilting correspondence visualization
  // ============================================================================
  "perfectoid-space_4d": {
    name: "💠 4D Perfectoid Space - p-adic Geometry",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      const p = Math.floor(params.b ?? 5); // Prime for p-adic
      
      // p-adic valuation structure
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // Layered structure from p-adic valuation
      const pLevel = Math.floor(Math.abs(Math.sin(theta * p) * Math.sin(phi * p)) * p) / p;
      
      const point4D: Point4D = {
        x: Math.sin(phi) * Math.cos(theta) * (1 + 0.2 * pLevel),
        y: Math.sin(phi) * Math.sin(theta) * (1 + 0.2 * pLevel),
        z: Math.cos(phi) * (1 + 0.1 * pLevel),
        w: pLevel * Math.sin(time * 0.2)
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.18, 0.32, 0.27);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * 1.2 * point3D.x, a * 1.2 * point3D.y, a * 1.2 * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 5, e: 0, uSegments: 96, vSegments: 96 })
  },

  // ============================================================================
  // 4D QUANTUM HALL DROPLET - Topological Phases
  // Laughlin wavefunctions in 4D phase space
  // ============================================================================
  "quantum-hall-droplet_4d": {
    name: "💧 4D Quantum Hall Droplet",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      const m = params.b ?? 3; // Filling fraction parameter
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // Laughlin wavefunction structure in 4D
      // Ψ = ∏(z_i - z_j)^m e^(-¼∑|z|²)
      const z1Re = Math.cos(theta) * Math.sin(phi);
      const z1Im = Math.sin(theta) * Math.sin(phi);
      const z2Re = Math.cos(phi);
      const z2Im = Math.sin(theta) * Math.cos(phi);
      
      const gaussianWeight = Math.exp(-0.25 * (z1Re*z1Re + z1Im*z1Im + z2Re*z2Re + z2Im*z2Im));
      const correlationFactor = Math.pow(Math.sqrt((z1Re-z2Re)*(z1Re-z2Re) + (z1Im-z2Im)*(z1Im-z2Im)) + 0.1, m * 0.3);
      
      const waveScale = gaussianWeight * correlationFactor;
      
      const point4D: Point4D = {
        x: z1Re * waveScale,
        y: z1Im * waveScale,
        z: z2Re * waveScale,
        w: z2Im * waveScale + Math.sin(time * 0.2) * 0.1
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.15, 0.35, 0.3);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * 2 * point3D.x, a * 2 * point3D.y, a * 2 * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 3, e: 0, uSegments: 96, vSegments: 96 })
  },

  // ============================================================================
  // 4D SEIBERG-WITTEN MONOPOLES - Exotic 4-Manifolds
  // Solutions to SW equations revealing unique 4D structures
  // ============================================================================
  seiberg_witten_monopole_4d: {
    name: "🧲 4D Seiberg-Witten Monopole",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      const monopoleCharge = params.b ?? 1;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // Dirac equation on 4-manifold with Spinᶜ structure
      const r = 1 + 0.3 * Math.sin(monopoleCharge * theta) * Math.cos(monopoleCharge * phi);
      
      // Seiberg-Witten equations: D_A ψ = 0, F_A⁺ = σ(ψ,ψ)
      const spinorMag = Math.sin(2 * phi) * Math.cos(theta - time * 0.1);
      
      const point4D: Point4D = {
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        w: spinorMag * monopoleCharge * 0.3
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.2, 0.38, 0.32);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * point3D.x, a * point3D.y, a * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, e: 0, uSegments: 96, vSegments: 96 })
  },

  // ============================================================================
  // 4D PERCOLATION CLUSTER BOUNDARY - Critical Dimension
  // Universal scaling at upper critical dimension d=4
  // ============================================================================
  percolation_cluster_4d: {
    name: "🔗 4D Percolation Cluster - Critical Scaling",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      const p = params.b ?? 0.5; // Percolation probability (critical ≈ 0.16 for 4D)
      
      // Fractal cluster boundary at critical point
      const iterations = 6;
      let x = (u - 0.5) * 2;
      let y = (v - 0.5) * 2;
      let z = 0;
      let w = 0;
      
      for (let i = 0; i < iterations; i++) {
        const threshold = Math.sin(x * 10 + i) * Math.cos(y * 10 + i * 0.7);
        if (threshold > (1 - 2*p)) {
          z += 0.2 * Math.sin(x * 5 + time * 0.1);
          w += 0.2 * Math.cos(y * 5 + time * 0.15);
        }
        x = x * 1.3 + 0.1 * threshold;
        y = y * 1.3 + 0.1 * threshold;
      }
      
      const point4D: Point4D = { x: x * 0.3, y: y * 0.3, z, w };
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.12, 0.28, 0.22);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'orthographic');
      
      return [a * 0.5 * point3D.x, a * 0.5 * point3D.y, a * 0.5 * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 0.5, e: 0, uSegments: 96, vSegments: 96 })
  },

  // ============================================================================
  // 4D PRIMITIVES WITH SELECTABLE PROJECTIONS
  // Educational shapes demonstrating different 4D→3D projection methods
  // Parameter 'g' selects projection: 0=Stereographic, 1=Orthographic, 2=Perspective
  // ============================================================================

  hypersphere_projectable: {
    name: "🌐 4-Sphere with Selectable Projection",
    description: "4D hypersphere x²+y²+z²+w²=r⁴. Surface volume=2π²r³, Hypervolume=(π²/2)r⁴. Parameter G selects projection method.",
    equation: (u, v, params) => {
      const a = params.a ?? 3;
      const time = params.e ?? 0;
      const projType = Math.floor(params.g ?? 0) % 3;
      const projNames: ('stereographic' | 'orthographic' | 'perspective')[] = ['stereographic', 'orthographic', 'perspective'];
      
      const phi = u * Math.PI;
      const theta = v * 2 * Math.PI;
      const psi = (params.h ?? 0) * Math.PI / 180;
      
      const point4D: Point4D = {
        x: Math.sin(phi) * Math.sin(theta) * Math.cos(psi),
        y: Math.sin(phi) * Math.sin(theta) * Math.sin(psi),
        z: Math.sin(phi) * Math.cos(theta),
        w: Math.cos(phi)
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.3, 0.4, 0.3);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, projNames[projType], 2.5);
      
      return [a * point3D.x, a * point3D.y, a * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 3, e: 0, g: 0, h: 0, uSegments: 96, vSegments: 96 })
  },

  tesseract_projectable: {
    name: "🔷 Tesseract with Selectable Projection",
    description: "8-cell hypercube: 16 vertices, 32 edges, 24 faces, 8 cubic cells. Parameter G selects projection method.",
    equation: (u, v, params) => {
      const a = params.a ?? 3;
      const time = params.e ?? 0;
      const projType = Math.floor(params.g ?? 0) % 3;
      const projNames: ('stereographic' | 'orthographic' | 'perspective')[] = ['stereographic', 'orthographic', 'perspective'];
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.5, 0.3, 0.2);
      
      const cellIndex = Math.floor(u * 8) % 8;
      const localU = (u * 8) % 1;
      const faceU = (localU * 6) % 1;
      const faceIndex = Math.floor(localU * 6) % 6;
      
      let point4D: Point4D = { x: 0, y: 0, z: 0, w: 0 };
      switch(cellIndex) {
        case 0: point4D = generateCubeFace(faceIndex, faceU, v, -1, 'w'); break;
        case 1: point4D = generateCubeFace(faceIndex, faceU, v, 1, 'w'); break;
        case 2: point4D = generateCubeFace(faceIndex, faceU, v, -1, 'x'); break;
        case 3: point4D = generateCubeFace(faceIndex, faceU, v, 1, 'x'); break;
        case 4: point4D = generateCubeFace(faceIndex, faceU, v, -1, 'y'); break;
        case 5: point4D = generateCubeFace(faceIndex, faceU, v, 1, 'y'); break;
        case 6: point4D = generateCubeFace(faceIndex, faceU, v, -1, 'z'); break;
        case 7: point4D = generateCubeFace(faceIndex, faceU, v, 1, 'z'); break;
      }
      
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, projNames[projType], 2.5);
      return [a * point3D.x, a * point3D.y, a * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 3, e: 0, g: 0, uSegments: 192, vSegments: 96 })
  },

  sixteen_cell_projectable: {
    name: "❖ 16-Cell with Selectable Projection",
    description: "4D cross-polytope dual to tesseract: 8 vertices at unit distances along axes. Parameter G selects projection.",
    equation: (u, v, params) => {
      const a = params.a ?? 3;
      const time = params.e ?? 0;
      const projType = Math.floor(params.g ?? 0) % 3;
      const projNames: ('stereographic' | 'orthographic' | 'perspective')[] = ['stereographic', 'orthographic', 'perspective'];
      
      const vertices4D: Point4D[] = [
        { x: 1, y: 0, z: 0, w: 0 }, { x: -1, y: 0, z: 0, w: 0 },
        { x: 0, y: 1, z: 0, w: 0 }, { x: 0, y: -1, z: 0, w: 0 },
        { x: 0, y: 0, z: 1, w: 0 }, { x: 0, y: 0, z: -1, w: 0 },
        { x: 0, y: 0, z: 0, w: 1 }, { x: 0, y: 0, z: 0, w: -1 }
      ];
      
      const faces = [
        [0, 2, 4], [0, 2, 5], [0, 2, 6], [0, 2, 7],
        [0, 3, 4], [0, 3, 5], [0, 3, 6], [0, 3, 7],
        [1, 2, 4], [1, 2, 5], [1, 2, 6], [1, 2, 7],
        [1, 3, 4], [1, 3, 5], [1, 3, 6], [1, 3, 7],
        [0, 4, 6], [0, 4, 7], [0, 5, 6], [0, 5, 7],
        [1, 4, 6], [1, 4, 7], [1, 5, 6], [1, 5, 7]
      ];
      
      const faceIndex = Math.floor(u * faces.length) % faces.length;
      const face = faces[faceIndex];
      const localU = (u * faces.length) % 1;
      
      const bary1 = localU, bary2 = v * (1 - localU), bary3 = 1 - bary1 - bary2;
      const v0 = vertices4D[face[0]], v1 = vertices4D[face[1]], v2 = vertices4D[face[2]];
      
      const point4D: Point4D = {
        x: bary1 * v0.x + bary2 * v1.x + bary3 * v2.x,
        y: bary1 * v0.y + bary2 * v1.y + bary3 * v2.y,
        z: bary1 * v0.z + bary2 * v1.z + bary3 * v2.z,
        w: bary1 * v0.w + bary2 * v1.w + bary3 * v2.w
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.5, 0.5, 0.4);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, projNames[projType], 2.5);
      
      return [a * point3D.x, a * point3D.y, a * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 3, e: 0, g: 0, uSegments: 128, vSegments: 64 })
  },

  twentyfour_cell_projectable: {
    name: "🔶 24-Cell with Selectable Projection",
    description: "Unique to 4D: 24 vertices, self-dual. Important for 4D rotations. Parameter G selects projection.",
    equation: (u, v, params) => {
      const a = params.a ?? 3;
      const time = params.e ?? 0;
      const projType = Math.floor(params.g ?? 0) % 3;
      const projNames: ('stereographic' | 'orthographic' | 'perspective')[] = ['stereographic', 'orthographic', 'perspective'];
      
      const vertices4D: Point4D[] = [];
      for (let i = -1; i <= 1; i += 2) {
        for (let j = -1; j <= 1; j += 2) {
          vertices4D.push({ x: i, y: j, z: 0, w: 0 });
          vertices4D.push({ x: i, y: 0, z: j, w: 0 });
          vertices4D.push({ x: i, y: 0, z: 0, w: j });
          vertices4D.push({ x: 0, y: i, z: j, w: 0 });
          vertices4D.push({ x: 0, y: i, z: 0, w: j });
          vertices4D.push({ x: 0, y: 0, z: i, w: j });
        }
      }
      
      const faceIndex = Math.floor(u * 24) % 24;
      const localU = (u * 24) % 1;
      const center = vertices4D[faceIndex];
      const radius = 0.5;
      const angle = v * 2 * Math.PI;
      
      const point4D: Point4D = {
        x: center.x + radius * Math.cos(angle) * (1 - localU),
        y: center.y + radius * Math.sin(angle) * (1 - localU),
        z: center.z + radius * Math.cos(angle + Math.PI/3) * (1 - localU),
        w: center.w + radius * Math.sin(angle + Math.PI/3) * (1 - localU)
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.4, 0.6, 0.4);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, projNames[projType], 2.5);
      
      return [a * point3D.x, a * point3D.y, a * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 3, e: 0, g: 0, uSegments: 128, vSegments: 64 })
  },

  // ============================================================================
  // 4D ROTATION DEMONSTRATION
  // Visualizes XY-ZW double rotation with independent angle controls
  // ============================================================================

  double_rotation_4d: {
    name: "🔄 4D Double Rotation (XY-ZW Planes)",
    description: "Demonstrates 4D rotation in two orthogonal planes. θ₁ (param D) rotates XY, θ₂ (param F) rotates ZW.",
    equation: (u, v, params) => {
      const a = params.a ?? 3;
      const theta1 = (params.d ?? 0) * Math.PI / 180;
      const theta2 = (params.f ?? 0) * Math.PI / 180;
      const projType = Math.floor(params.g ?? 0) % 3;
      const projNames: ('stereographic' | 'orthographic' | 'perspective')[] = ['stereographic', 'orthographic', 'perspective'];
      
      const phi = u * Math.PI;
      const psi = v * 2 * Math.PI;
      
      let x = Math.sin(phi) * Math.cos(psi);
      let y = Math.sin(phi) * Math.sin(psi);
      let z = Math.cos(phi) * Math.cos(psi * 0.5);
      let w = Math.cos(phi) * Math.sin(psi * 0.5);
      
      const cosT1 = Math.cos(theta1), sinT1 = Math.sin(theta1);
      const newX = x * cosT1 - y * sinT1;
      const newY = x * sinT1 + y * cosT1;
      x = newX; y = newY;
      
      const cosT2 = Math.cos(theta2), sinT2 = Math.sin(theta2);
      const newZ = z * cosT2 - w * sinT2;
      const newW = z * sinT2 + w * cosT2;
      z = newZ; w = newW;
      
      const point4D: Point4D = { x, y, z, w };
      let point3D: Point3D;
      
      if (projType === 0) {
        point3D = EnhancedProjections.stereographicProjection(point4D);
      } else if (projType === 1) {
        point3D = EnhancedProjections.orthographicProjection(point4D);
      } else {
        point3D = EnhancedProjections.perspectiveProjection(point4D, 2.5);
      }
      
      return [a * point3D.x, a * point3D.y, a * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 3, d: 0, f: 0, g: 0, uSegments: 64, vSegments: 64 })
  },

  // ============================================================================
  // PROJECTION COMPARISON - Side-by-side visualization
  // ============================================================================

  projection_comparison_4d: {
    name: "📐 4D Projection Comparison",
    description: "Visualizes how 4D hypersphere appears under all three projections simultaneously (split into thirds).",
    equation: (u, v, params) => {
      const a = params.a ?? 3;
      const time = params.e ?? 0;
      
      const section = Math.floor(u * 3);
      const localU = (u * 3) % 1;
      
      const phi = localU * Math.PI;
      const theta = v * 2 * Math.PI;
      const psi = time * 0.3;
      
      const point4D: Point4D = {
        x: Math.sin(phi) * Math.cos(theta) * Math.cos(psi),
        y: Math.sin(phi) * Math.cos(theta) * Math.sin(psi),
        z: Math.sin(phi) * Math.sin(theta),
        w: Math.cos(phi)
      };
      
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.2, 0.3, 0.2);
      const rotated = EnhancedProjections.rotateSO4(point4D, q1, q2);
      
      let point3D: Point3D;
      let offset: number;
      
      if (section === 0) {
        point3D = EnhancedProjections.stereographicProjection(rotated);
        offset = -3;
      } else if (section === 1) {
        point3D = EnhancedProjections.orthographicProjection(rotated);
        offset = 0;
      } else {
        point3D = EnhancedProjections.perspectiveProjection(rotated, 2.5);
        offset = 3;
      }
      
      return [a * point3D.x + offset, a * point3D.y, a * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 1.5, e: 0, uSegments: 192, vSegments: 64 })
  }

};
