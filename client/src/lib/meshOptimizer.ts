export type MeshType = 'triangle' | 'quad' | 'hex' | 'mixed' | 'voronoi' | 'tetrahedral';

export interface MeshRecommendation {
  meshType: MeshType;
  reason: string;
  tessellationDensity: 'low' | 'medium' | 'high' | 'ultra';
  adaptiveRefinement: boolean;
}

export function selectOptimalMesh(shapeType: string): MeshRecommendation {
  const shapeLower = shapeType.toLowerCase();
  
  if (shapeLower.includes('sphere') || shapeLower.includes('ball')) {
    return {
      meshType: 'triangle',
      reason: 'Spherical surfaces require triangular mesh for uniform curvature',
      tessellationDensity: 'high',
      adaptiveRefinement: true
    };
  }
  
  if (shapeLower.includes('cube') || shapeLower.includes('box') || 
      shapeLower.includes('rectangular') || shapeLower.includes('prism')) {
    return {
      meshType: 'quad',
      reason: 'Cubic/box shapes benefit from quad topology for clean edges',
      tessellationDensity: 'medium',
      adaptiveRefinement: false
    };
  }
  
  if (shapeLower.includes('torus') || shapeLower.includes('klein') || 
      shapeLower.includes('mobius')) {
    return {
      meshType: 'triangle',
      reason: 'Topological surfaces need triangular mesh for curved manifolds',
      tessellationDensity: 'high',
      adaptiveRefinement: true
    };
  }
  
  if (shapeLower.includes('cylinder') || shapeLower.includes('cone') || 
      shapeLower.includes('tube')) {
    return {
      meshType: 'mixed',
      reason: 'Cylindrical shapes use mixed mesh: quads on curved surface, triangles at caps',
      tessellationDensity: 'medium',
      adaptiveRefinement: true
    };
  }
  
  if (shapeLower.includes('plane') || shapeLower.includes('square') || 
      shapeLower.includes('grid') || shapeLower.includes('patch')) {
    return {
      meshType: 'quad',
      reason: 'Planar surfaces optimized with regular quad grid',
      tessellationDensity: 'medium',
      adaptiveRefinement: false
    };
  }
  
  if (shapeLower.includes('fractal') || shapeLower.includes('chaos') || 
      shapeLower.includes('strange_attractor') || shapeLower.includes('mandelbrot')) {
    return {
      meshType: 'triangle',
      reason: 'Fractal geometry requires adaptive triangular mesh for irregular detail',
      tessellationDensity: 'ultra',
      adaptiveRefinement: true
    };
  }
  
  if (shapeLower.includes('cell') || shapeLower.includes('tissue') || 
      shapeLower.includes('organoid') || shapeLower.includes('neural') ||
      shapeLower.includes('biological')) {
    return {
      meshType: 'voronoi',
      reason: 'Biological structures benefit from Voronoi tessellation matching organic cell patterns',
      tessellationDensity: 'high',
      adaptiveRefinement: true
    };
  }
  
  if (shapeLower.includes('tpms') || shapeLower.includes('gyroid') || 
      shapeLower.includes('schwarz') || shapeLower.includes('scaffold')) {
    return {
      meshType: 'triangle',
      reason: 'TPMS surfaces require high-density triangular mesh for minimal surface curvature',
      tessellationDensity: 'ultra',
      adaptiveRefinement: true
    };
  }
  
  if (shapeLower.includes('polyhedron') || shapeLower.includes('hedron') || 
      shapeLower.includes('icosahedron') || shapeLower.includes('dodecahedron')) {
    return {
      meshType: 'triangle',
      reason: 'Polyhedral surfaces naturally decompose into triangular faces',
      tessellationDensity: 'low',
      adaptiveRefinement: false
    };
  }
  
  if (shapeLower.includes('knot') || shapeLower.includes('trefoil') || 
      shapeLower.includes('torus_knot')) {
    return {
      meshType: 'triangle',
      reason: 'Knot topology requires triangular mesh for complex curvature and twisting',
      tessellationDensity: 'high',
      adaptiveRefinement: true
    };
  }
  
  if (shapeLower.includes('hypercube') || shapeLower.includes('tesseract') || 
      shapeLower.includes('4d') || shapeLower.includes('dimensional')) {
    return {
      meshType: 'quad',
      reason: 'Higher-dimensional projections maintain structure with quad mesh',
      tessellationDensity: 'medium',
      adaptiveRefinement: true
    };
  }
  
  if (shapeLower.includes('parametric') || shapeLower.includes('surface')) {
    return {
      meshType: 'quad',
      reason: 'Parametric surfaces aligned to UV coordinates work best with quad topology',
      tessellationDensity: 'medium',
      adaptiveRefinement: true
    };
  }
  
  return {
    meshType: 'triangle',
    reason: 'Default triangular mesh provides universal flexibility for unknown geometry',
    tessellationDensity: 'medium',
    adaptiveRefinement: true
  };
}

export function calculateSegmentCount(
  meshType: MeshType, 
  density: 'low' | 'medium' | 'high' | 'ultra'
): { uSegments: number; vSegments: number } {
  const baseSegments = {
    low: 16,
    medium: 32,
    high: 64,
    ultra: 128
  };
  
  const base = baseSegments[density];
  
  if (meshType === 'quad') {
    return { uSegments: base, vSegments: base };
  }
  
  if (meshType === 'triangle') {
    return { uSegments: Math.floor(base * 1.5), vSegments: base };
  }
  
  if (meshType === 'voronoi') {
    return { uSegments: Math.floor(base * 1.2), vSegments: Math.floor(base * 1.2) };
  }
  
  return { uSegments: base, vSegments: base };
}
