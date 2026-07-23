import type { ParametricSurface } from './surfaceGenerator';

export const RUBIKS_CUBE_DYNAMICS_SHAPES: Record<string, ParametricSurface> = {
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CORE CUBE GEOMETRY
  // The 3×3×3 structure with face, edge, and corner cubies
  // ═══════════════════════════════════════════════════════════════════════════
  
  rubiks_cube_lattice: {
    name: "Rubik's Cube Lattice",
    formula: "3×3×3 cubie arrangement with gaps",
    description: "The fundamental 27-cubie lattice structure. Each small cube (cubie) has a fixed position but can rotate with its face.",
    category: "rubiks-cube-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 0.1, e: 1, f: 0, g: 3, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const scale = (params.a ?? 1) * 2;
      const gap = (params.d ?? 0.1) * 0.2;
      const size = Math.floor((params.g ?? 3));
      
      const i = Math.floor(u * size);
      const j = Math.floor(v * size);
      const k = Math.floor((u + v) * size / 2) % size;
      
      const cubieSize = scale / size;
      const offset = (size - 1) / 2;
      
      const localU = (u * size) % 1;
      const localV = (v * size) % 1;
      
      const x = ((i - offset) * (cubieSize + gap) + (localU - 0.5) * cubieSize * 0.9) * (params.x ?? 1);
      const y = ((j - offset) * (cubieSize + gap) + (localV - 0.5) * cubieSize * 0.9) * (params.y ?? 1);
      const z = ((k - offset) * (cubieSize + gap)) * (params.z ?? 1);
      
      return { x, y, z };
    }
  },

  rubiks_cube_face: {
    name: "Rubik's Cube Face",
    formula: "Single face with 9 colored squares",
    description: "One face of the cube showing the 3×3 grid of colored stickers. The fundamental unit of cube state.",
    category: "rubiks-cube-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 0.05, e: 0, f: 0, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const scale = (params.a ?? 1) * 2;
      const gap = (params.d ?? 0.05) * 0.3;
      const faceOffset = (params.e ?? 0) * 2;
      
      const i = Math.floor(u * 3);
      const j = Math.floor(v * 3);
      const localU = (u * 3) % 1;
      const localV = (v * 3) % 1;
      
      const stickerSize = scale / 3;
      
      const x = ((i - 1) * (stickerSize + gap) + (localU - 0.5) * stickerSize * 0.9) * (params.x ?? 1);
      const y = ((j - 1) * (stickerSize + gap) + (localV - 0.5) * stickerSize * 0.9) * (params.y ?? 1);
      const z = (scale / 2 + faceOffset) * (params.z ?? 1);
      
      return { x, y, z };
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ROTATION DYNAMICS
  // Face rotations, slice moves, and their compositions
  // ═══════════════════════════════════════════════════════════════════════════

  rubiks_face_rotation: {
    name: "Rubik's Face Rotation",
    formula: "R(θ) = rotation matrix around face normal",
    description: "Visualization of a single face rotation. The 9 stickers rotate 90° while the rest of the cube stays fixed.",
    category: "rubiks-cube-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 0.5, e: 0, f: 1, g: 0, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const scale = (params.a ?? 1) * 2;
      const rotationAngle = (params.d ?? 0.5) * Math.PI / 2;
      const axis = Math.floor((params.f ?? 1) * 3) % 3;
      
      const i = Math.floor(u * 3) - 1;
      const j = Math.floor(v * 3) - 1;
      const localU = (u * 3) % 1 - 0.5;
      const localV = (v * 3) % 1 - 0.5;
      
      let x = i * 0.7 + localU * 0.6;
      let y = j * 0.7 + localV * 0.6;
      let z = 1;
      
      const cos = Math.cos(rotationAngle);
      const sin = Math.sin(rotationAngle);
      
      if (axis === 0) {
        const newY = y * cos - z * sin;
        const newZ = y * sin + z * cos;
        y = newY; z = newZ;
      } else if (axis === 1) {
        const newX = x * cos + z * sin;
        const newZ = -x * sin + z * cos;
        x = newX; z = newZ;
      } else {
        const newX = x * cos - y * sin;
        const newY = x * sin + y * cos;
        x = newX; y = newY;
      }
      
      return { 
        x: x * scale * (params.x ?? 1), 
        y: y * scale * (params.y ?? 1), 
        z: z * scale * (params.z ?? 1) 
      };
    }
  },

  rubiks_rotation_orbit: {
    name: "Rubik's Rotation Orbit",
    formula: "Circular path traced by cubie during rotation",
    description: "The circular orbit traced by corner and edge cubies during face rotations. Corners move in larger arcs than edges.",
    category: "rubiks-cube-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 1.414, e: 1, f: 4, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const scale = (params.a ?? 1);
      const radius = (params.d ?? 1.414);
      const orbitType = (params.e ?? 1);
      const rotations = (params.f ?? 4);
      
      const theta = u * Math.PI * 2 * rotations;
      const layer = v;
      
      const r = radius * (orbitType > 0.5 ? 1 : 0.707);
      
      const x = r * Math.cos(theta) * scale * (params.x ?? 1);
      const y = r * Math.sin(theta) * scale * (params.y ?? 1);
      const z = (layer * 2 - 1) * scale * (params.z ?? 1);
      
      return { x, y, z };
    }
  },

  rubiks_slice_move: {
    name: "Rubik's Slice Move",
    formula: "M, E, S slice rotations (middle layers)",
    description: "Middle layer slice moves - rotating the layer between two faces. Creates different permutation patterns than face moves.",
    category: "rubiks-cube-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 0.5, e: 0, f: 1, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const scale = (params.a ?? 1) * 2;
      const rotationAngle = (params.d ?? 0.5) * Math.PI / 2;
      const sliceType = Math.floor((params.f ?? 1) * 3) % 3;
      
      const i = Math.floor(u * 3) - 1;
      const j = Math.floor(v * 3) - 1;
      const localU = (u * 3) % 1 - 0.5;
      const localV = (v * 3) % 1 - 0.5;
      
      let x = i * 0.7 + localU * 0.6;
      let y = j * 0.7 + localV * 0.6;
      let z = 0;
      
      const cos = Math.cos(rotationAngle);
      const sin = Math.sin(rotationAngle);
      
      if (sliceType === 0) {
        const newY = y * cos - z * sin;
        const newZ = y * sin + z * cos;
        y = newY; z = newZ;
      } else if (sliceType === 1) {
        const newX = x * cos + z * sin;
        const newZ = -x * sin + z * cos;
        x = newX; z = newZ;
      } else {
        const newX = x * cos - y * sin;
        const newY = x * sin + y * cos;
        x = newX; y = newY;
      }
      
      return { 
        x: x * scale * (params.x ?? 1), 
        y: y * scale * (params.y ?? 1), 
        z: z * scale * (params.z ?? 1) 
      };
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GROUP THEORY VISUALIZATIONS
  // The Rubik's Cube group has 43 quintillion elements
  // ═══════════════════════════════════════════════════════════════════════════

  rubiks_permutation_cycle: {
    name: "Rubik's Permutation Cycle",
    formula: "σ = (a b c d) - 4-cycle permutation",
    description: "Visualization of permutation cycles in the cube group. Face rotations create 4-cycles of corners and edges.",
    category: "rubiks-cube-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 4, e: 1, f: 0, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const scale = (params.a ?? 1) * 2;
      const cycleLength = Math.floor((params.d ?? 4));
      const radius = (params.e ?? 1) * 1.5;
      
      const elementIndex = Math.floor(u * cycleLength);
      const theta = (elementIndex / cycleLength) * Math.PI * 2;
      const nextTheta = ((elementIndex + 1) / cycleLength) * Math.PI * 2;
      
      const t = (u * cycleLength) % 1;
      const interpTheta = theta * (1 - t) + nextTheta * t;
      
      const x = radius * Math.cos(interpTheta) * scale * (params.x ?? 1);
      const y = radius * Math.sin(interpTheta) * scale * (params.y ?? 1);
      const z = v * scale * 0.5 * (params.z ?? 1);
      
      return { x, y, z };
    }
  },

  rubiks_cayley_graph: {
    name: "Rubik's Cayley Graph",
    formula: "Graph of group elements connected by generators",
    description: "Cayley graph visualization where nodes are cube states and edges are moves. The full graph has 43 quintillion nodes!",
    category: "rubiks-cube-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 6, e: 2, f: 12, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const scale = (params.a ?? 1) * 2;
      const generators = Math.floor((params.d ?? 6));
      const depth = Math.floor((params.e ?? 2));
      const branches = (params.f ?? 12);
      
      const level = Math.floor(v * depth);
      const branchIndex = Math.floor(u * Math.pow(generators, level));
      
      const angle = (branchIndex / Math.pow(generators, level)) * Math.PI * 2;
      const radius = (level + 1) * 0.5;
      
      const x = radius * Math.cos(angle) * scale * (params.x ?? 1);
      const y = radius * Math.sin(angle) * scale * (params.y ?? 1);
      const z = level * 0.5 * scale * (params.z ?? 1);
      
      return { x, y, z };
    }
  },

  rubiks_group_orbit: {
    name: "Rubik's Group Orbit",
    formula: "Orbit of cubie under group action",
    description: "The orbit of a single cubie position under all possible moves. Shows reachability and symmetry.",
    category: "rubiks-cube-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 8, e: 12, f: 24, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const scale = (params.a ?? 1) * 2;
      const corners = Math.floor((params.d ?? 8));
      const edges = Math.floor((params.e ?? 12));
      
      const totalPositions = corners + edges;
      const posIndex = Math.floor(u * totalPositions);
      const isCorner = posIndex < corners;
      
      let x, y, z;
      if (isCorner) {
        const cornerAngle = (posIndex / corners) * Math.PI * 2;
        const cornerRadius = 1.732;
        x = cornerRadius * Math.cos(cornerAngle);
        y = cornerRadius * Math.sin(cornerAngle);
        z = (posIndex % 2) * 2 - 1;
      } else {
        const edgeIndex = posIndex - corners;
        const edgeAngle = (edgeIndex / edges) * Math.PI * 2;
        const edgeRadius = 1.414;
        x = edgeRadius * Math.cos(edgeAngle);
        y = edgeRadius * Math.sin(edgeAngle);
        z = Math.sin(edgeAngle * 2) * 0.5;
      }
      
      const orientation = v * Math.PI * 2;
      const cosO = Math.cos(orientation * 0.3);
      const sinO = Math.sin(orientation * 0.3);
      const newX = x * cosO - y * sinO;
      const newY = x * sinO + y * cosO;
      
      return { 
        x: newX * scale * (params.x ?? 1), 
        y: newY * scale * (params.y ?? 1), 
        z: z * scale * (params.z ?? 1) 
      };
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE SPACE AND SOLVING
  // God's Number = 20 (maximum moves to solve any position)
  // ═══════════════════════════════════════════════════════════════════════════

  rubiks_state_space: {
    name: "Rubik's State Space",
    formula: "43,252,003,274,489,856,000 possible states",
    description: "Abstract visualization of the cube's state space. Each point represents one of 43 quintillion possible configurations.",
    category: "rubiks-cube-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 20, e: 10, f: 0, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const scale = (params.a ?? 1) * 3;
      const godNumber = (params.d ?? 20);
      const resolution = (params.e ?? 10);
      
      const moveDistance = Math.floor(u * godNumber);
      const stateAngle = v * Math.PI * 2;
      const branchAngle = u * Math.PI * 8;
      
      const radius = moveDistance / godNumber * 2;
      const spiral = radius * Math.cos(branchAngle * 3);
      
      const x = (radius * Math.cos(stateAngle) + spiral * 0.2) * scale * (params.x ?? 1);
      const y = (radius * Math.sin(stateAngle) + spiral * 0.2) * scale * (params.y ?? 1);
      const z = (moveDistance / godNumber - 0.5) * scale * (params.z ?? 1);
      
      return { x, y, z };
    }
  },

  rubiks_solve_path: {
    name: "Rubik's Solve Path",
    formula: "Optimal path through state space to solved state",
    description: "Trajectory through state space representing a solving algorithm. Shortest paths have at most 20 moves (God's Number).",
    category: "rubiks-cube-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 15, e: 0.5, f: 6, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const scale = (params.a ?? 1) * 2;
      const moveCount = Math.floor((params.d ?? 15));
      const scrambleFactor = (params.e ?? 0.5);
      const moves = (params.f ?? 6);
      
      const step = u * moveCount;
      const progress = step / moveCount;
      
      const scrambleRadius = scrambleFactor * (1 - progress) * 2;
      const theta = step * 0.7;
      const phi = step * 1.1;
      
      const spiralIn = Math.exp(-progress * 2);
      
      const x = scrambleRadius * spiralIn * Math.cos(theta) * scale * (params.x ?? 1);
      const y = scrambleRadius * spiralIn * Math.sin(theta) * scale * (params.y ?? 1);
      const z = (v - 0.5 + Math.sin(phi) * spiralIn * 0.3) * scale * (params.z ?? 1);
      
      return { x, y, z };
    }
  },

  rubiks_gods_number: {
    name: "Rubik's God's Number",
    formula: "Maximum 20 moves to solve any configuration",
    description: "Visualization showing that any cube state can be solved in at most 20 moves. The 'diameter' of the Cayley graph.",
    category: "rubiks-cube-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 20, e: 1, f: 0, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const scale = (params.a ?? 1) * 2;
      const godNumber = (params.d ?? 20);
      
      const distance = Math.floor(u * godNumber);
      const theta = v * Math.PI * 2;
      
      const shellRadius = distance / godNumber;
      const density = Math.pow(18, Math.min(distance, 10)) / Math.pow(18, 10);
      const perturbation = density * 0.1 * Math.sin(theta * 12 + distance);
      
      const x = (shellRadius + perturbation) * Math.cos(theta) * scale * (params.x ?? 1);
      const y = (shellRadius + perturbation) * Math.sin(theta) * scale * (params.y ?? 1);
      const z = (distance / godNumber - 0.5) * scale * (params.z ?? 1);
      
      return { x, y, z };
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CUBIE ORIENTATIONS
  // Corner orientation (3 states) and edge orientation (2 states)
  // ═══════════════════════════════════════════════════════════════════════════

  rubiks_corner_orientation: {
    name: "Rubik's Corner Orientation",
    formula: "3 possible orientations per corner (0, 120°, 240°)",
    description: "Each corner cubie can be in one of 3 orientations. Total corner orientations: 3^7 = 2187 (8th is determined).",
    category: "rubiks-cube-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 8, e: 3, f: 0, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const scale = (params.a ?? 1) * 2;
      const numCorners = Math.floor((params.d ?? 8));
      const orientations = Math.floor((params.e ?? 3));
      
      const cornerIndex = Math.floor(u * numCorners);
      const orientIndex = Math.floor(v * orientations);
      
      const baseAngle = (cornerIndex / numCorners) * Math.PI * 2;
      const orientAngle = (orientIndex / orientations) * Math.PI * 2 / 3;
      
      const radius = 1.5;
      const x = radius * Math.cos(baseAngle) * scale * (params.x ?? 1);
      const y = radius * Math.sin(baseAngle) * scale * (params.y ?? 1);
      
      const twistRadius = 0.3;
      const zBase = (cornerIndex % 2) * 2 - 1;
      const z = (zBase + twistRadius * Math.sin(orientAngle)) * scale * (params.z ?? 1);
      
      return { x, y, z };
    }
  },

  rubiks_edge_orientation: {
    name: "Rubik's Edge Orientation",
    formula: "2 possible orientations per edge (flipped or not)",
    description: "Each edge cubie can be flipped or not. Total edge orientations: 2^11 = 2048 (12th is determined).",
    category: "rubiks-cube-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 12, e: 2, f: 0, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const scale = (params.a ?? 1) * 2;
      const numEdges = Math.floor((params.d ?? 12));
      const orientations = Math.floor((params.e ?? 2));
      
      const edgeIndex = Math.floor(u * numEdges);
      const orientIndex = Math.floor(v * orientations);
      
      const baseAngle = (edgeIndex / numEdges) * Math.PI * 2;
      const flipAngle = orientIndex * Math.PI;
      
      const radius = 1.2;
      const x = radius * Math.cos(baseAngle) * scale * (params.x ?? 1);
      const y = radius * Math.sin(baseAngle) * scale * (params.y ?? 1);
      
      const flipOffset = Math.sin(flipAngle) * 0.3;
      const z = (Math.sin(baseAngle * 2) * 0.5 + flipOffset) * scale * (params.z ?? 1);
      
      return { x, y, z };
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ALGORITHM PATTERNS
  // Common solving algorithms visualized as movement patterns
  // ═══════════════════════════════════════════════════════════════════════════

  rubiks_commutator: {
    name: "Rubik's Commutator",
    formula: "[A, B] = A B A' B' - Commutator pattern",
    description: "Commutator moves: do A, do B, undo A, undo B. Fundamental building block of advanced solving.",
    category: "rubiks-cube-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 4, e: 1, f: 0, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const scale = (params.a ?? 1) * 2;
      const movePhase = u * 4;
      const phaseIndex = Math.floor(movePhase);
      const t = movePhase % 1;
      
      const rotations = [
        { axis: 0, dir: 1 },
        { axis: 1, dir: 1 },
        { axis: 0, dir: -1 },
        { axis: 1, dir: -1 }
      ];
      
      const current = rotations[phaseIndex % 4];
      const angle = t * Math.PI / 2 * current.dir;
      
      let x = v * 2 - 1;
      let y = 0.5;
      let z = 0.5;
      
      if (current.axis === 0) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const newY = y * cos - z * sin;
        const newZ = y * sin + z * cos;
        y = newY; z = newZ;
      } else {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const newX = x * cos + z * sin;
        const newZ = -x * sin + z * cos;
        x = newX; z = newZ;
      }
      
      return { 
        x: x * scale * (params.x ?? 1), 
        y: y * scale * (params.y ?? 1), 
        z: z * scale * (params.z ?? 1) 
      };
    }
  },

  rubiks_conjugate: {
    name: "Rubik's Conjugate",
    formula: "A B A' - Conjugate (setup-move-undo)",
    description: "Conjugate moves: setup A, do B, undo A. Moves pieces to different positions for the same algorithm effect.",
    category: "rubiks-cube-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 3, e: 1, f: 0.5, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const scale = (params.a ?? 1) * 2;
      const movePhase = u * 3;
      const phaseIndex = Math.floor(movePhase);
      const t = movePhase % 1;
      
      const setupAngle = (params.f ?? 0.5) * Math.PI / 2;
      
      let angle;
      if (phaseIndex === 0) {
        angle = t * setupAngle;
      } else if (phaseIndex === 1) {
        angle = setupAngle;
      } else {
        angle = setupAngle * (1 - t);
      }
      
      const x = Math.cos(angle + v * Math.PI * 2) * scale * (params.x ?? 1);
      const y = Math.sin(angle + v * Math.PI * 2) * scale * (params.y ?? 1);
      const z = (phaseIndex === 1 ? Math.sin(t * Math.PI) : 0) * scale * (params.z ?? 1);
      
      return { x, y, z };
    }
  },

  rubiks_sexy_move: {
    name: "Rubik's Sexy Move",
    formula: "R U R' U' - The famous 'sexy move' algorithm",
    description: "The most common algorithm trigger: Right, Up, Right-inverse, Up-inverse. Cycles 3 corners.",
    category: "rubiks-cube-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 4, e: 6, f: 0, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const scale = (params.a ?? 1) * 2;
      const repetitions = Math.floor((params.e ?? 6));
      
      const totalMoves = 4 * repetitions;
      const moveIndex = Math.floor(u * totalMoves);
      const localT = (u * totalMoves) % 1;
      
      const moveType = moveIndex % 4;
      
      const axes = [0, 1, 0, 1];
      const directions = [1, 1, -1, -1];
      
      const axis = axes[moveType];
      const dir = directions[moveType];
      const angle = localT * Math.PI / 2 * dir;
      
      let x = 0.5, y = 0.5, z = v * 2 - 1;
      
      if (axis === 0) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const newY = y * cos - z * sin;
        const newZ = y * sin + z * cos;
        y = newY; z = newZ;
      } else {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const newX = x * cos - y * sin;
        const newY = x * sin + y * cos;
        x = newX; y = newY;
      }
      
      return { 
        x: x * scale * (params.x ?? 1), 
        y: y * scale * (params.y ?? 1), 
        z: z * scale * (params.z ?? 1) 
      };
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SYMMETRY AND SUBGROUPS
  // The cube has 48 symmetries, various interesting subgroups
  // ═══════════════════════════════════════════════════════════════════════════

  rubiks_symmetry_group: {
    name: "Rubik's Symmetry Group",
    formula: "48 symmetries of the cube (rotations and reflections)",
    description: "The symmetry group of the cube has 48 elements - 24 rotations and 24 reflection-rotations.",
    category: "rubiks-cube-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 24, e: 2, f: 0, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const scale = (params.a ?? 1) * 2;
      const rotations = Math.floor((params.d ?? 24));
      const reflection = (params.e ?? 2) > 1;
      
      const symIndex = Math.floor(u * rotations);
      
      const faceRotations = Math.floor(symIndex / 4);
      const quarterTurns = symIndex % 4;
      
      const faceAngle = (faceRotations / 6) * Math.PI * 2;
      const turnAngle = quarterTurns * Math.PI / 2;
      
      let x = Math.cos(v * Math.PI * 2);
      let y = Math.sin(v * Math.PI * 2);
      let z = Math.sin(faceAngle);
      
      const cos = Math.cos(turnAngle);
      const sin = Math.sin(turnAngle);
      const newX = x * cos - y * sin;
      const newY = x * sin + y * cos;
      x = newX; y = newY;
      
      if (reflection) {
        x = -x;
      }
      
      return { 
        x: x * scale * (params.x ?? 1), 
        y: y * scale * (params.y ?? 1), 
        z: z * scale * (params.z ?? 1) 
      };
    }
  },

  rubiks_subgroup_structure: {
    name: "Rubik's Subgroup Structure",
    formula: "Lattice of subgroups of the Rubik's group",
    description: "Subgroup lattice showing how smaller groups embed in the full Rubik's cube group.",
    category: "rubiks-cube-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 6, e: 4, f: 0, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const scale = (params.a ?? 1) * 2;
      const levels = Math.floor((params.d ?? 6));
      const branching = Math.floor((params.e ?? 4));
      
      const level = Math.floor(v * levels);
      const nodeIndex = Math.floor(u * Math.pow(branching, level));
      
      const nodesAtLevel = Math.pow(branching, level);
      const angle = (nodeIndex / nodesAtLevel) * Math.PI * 2;
      const radius = (level + 1) / levels * 2;
      
      const x = radius * Math.cos(angle) * scale * (params.x ?? 1);
      const y = radius * Math.sin(angle) * scale * (params.y ?? 1);
      const z = (level / levels - 0.5) * scale * 2 * (params.z ?? 1);
      
      return { x, y, z };
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SCRAMBLE DYNAMICS
  // Random vs structured scramble patterns
  // ═══════════════════════════════════════════════════════════════════════════

  rubiks_scramble_entropy: {
    name: "Rubik's Scramble Entropy",
    formula: "Entropy growth during scrambling",
    description: "How randomness increases with each move during scrambling. Maximum entropy reached around 20 moves.",
    category: "rubiks-cube-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 25, e: 0.9, f: 0, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const scale = (params.a ?? 1) * 2;
      const maxMoves = Math.floor((params.d ?? 25));
      const entropyRate = (params.e ?? 0.9);
      
      const moveNum = u * maxMoves;
      const entropy = 1 - Math.pow(entropyRate, moveNum);
      
      const randomAngle = v * Math.PI * 2 + moveNum * 0.7;
      const randomRadius = entropy * 2;
      
      const x = randomRadius * Math.cos(randomAngle) * scale * (params.x ?? 1);
      const y = randomRadius * Math.sin(randomAngle) * scale * (params.y ?? 1);
      const z = (entropy - 0.5) * scale * (params.z ?? 1);
      
      return { x, y, z };
    }
  },

  rubiks_pattern_cube: {
    name: "Rubik's Pattern Cube",
    formula: "Superflip, checkerboard, and other patterns",
    description: "Special cube patterns that look ordered but require many moves to achieve. Superflip needs 20 moves!",
    category: "rubiks-cube-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 0, e: 6, f: 0, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const scale = (params.a ?? 1) * 2;
      const patternType = Math.floor((params.d ?? 0) * 4) % 4;
      const faces = Math.floor((params.e ?? 6));
      
      const faceIndex = Math.floor(u * faces);
      const i = Math.floor(v * 3);
      const j = Math.floor(u * faces * 3) % 3;
      
      let pattern;
      if (patternType === 0) {
        pattern = (i + j) % 2;
      } else if (patternType === 1) {
        pattern = (i + j + faceIndex) % 2;
      } else if (patternType === 2) {
        pattern = (i === 1 && j === 1) ? 1 : 0;
      } else {
        pattern = ((i + j) % 2) * ((faceIndex % 2) * 2 - 1);
      }
      
      const faceAngle = (faceIndex / faces) * Math.PI * 2;
      const x = (Math.cos(faceAngle) * 1.5 + (i - 1) * 0.3) * scale * (params.x ?? 1);
      const y = (Math.sin(faceAngle) * 1.5 + (j - 1) * 0.3) * scale * (params.y ?? 1);
      const z = (pattern * 0.5) * scale * (params.z ?? 1);
      
      return { x, y, z };
    }
  }
};

console.log(`🎲 Rubik's Cube Dynamics Shapes loaded: ${Object.keys(RUBIKS_CUBE_DYNAMICS_SHAPES).length} shapes`);
console.log(`   🧊 Core Geometry: Lattice, faces, cubies`);
console.log(`   🔄 Rotation Dynamics: Face moves, slice moves, orbits`);
console.log(`   📊 Group Theory: Permutations, Cayley graph, orbits`);
console.log(`   🎯 State Space: 43 quintillion states, God's Number = 20`);
console.log(`   🔧 Algorithms: Commutators, conjugates, sexy move`);
console.log(`   ✨ Symmetry: 48-element symmetry group, subgroups`);

export default RUBIKS_CUBE_DYNAMICS_SHAPES;
