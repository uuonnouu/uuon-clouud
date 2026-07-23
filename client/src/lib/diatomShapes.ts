import { SurfaceParameters } from '../types/math';
import { getCleanDefaults } from '../types/shapes';

export interface ParametricSurface {
  name: string;
  description?: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

/**
 * DIATOM SHAPES LIBRARY
 * Mathematical models of microscopic silica-shelled algae (Bacillariophyta)
 * 
 * Diatoms are single-celled organisms that build intricate glass houses (frustules)
 * from dissolved silica. They've been engineering masterpieces for 200+ million years.
 * 
 * Ernst Haeckel (1904) and Victorian naturalists recognized diatoms as proof of 
 * nature's mathematical precision - living geometry demonstrating universal design.
 * 
 * Key structural features modeled:
 * - Frustule: The silica shell composed of two overlapping valves
 * - Costae: Radial ribs providing structural reinforcement
 * - Striae: Fine parallel lines or rows of pores
 * - Areolae: Regular hexagonal pore networks for gas/nutrient exchange
 * - Raphe: Central slit in pennate diatoms for gliding motility
 * 
 * Engineering principles encoded:
 * - Radial symmetry for stress distribution
 * - Perforated structures for strength without weight
 * - Hierarchical organization from nano to micro scale
 * - Optimal surface area to volume ratios
 */

export const DIATOM_SHAPES: Record<string, ParametricSurface> = {

  // ============================================================================
  // RADIAL CENTRIC DIATOM - Circular with radial symmetry
  // Examples: Coscinodiscus, Thalassiosira, Cyclotella
  // ============================================================================
  radial_centric_diatom: {
    name: "🔬 Radial Centric Diatom",
    description: "Circular diatom with radiating patterns from center - the classic disc-shaped frustule with costae and striae patterns. Found in planktonic marine environments.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;    // outer radius
      const b = params.b ?? 0.1;    // inner valve thickness
      const c = params.c ?? 12.0;   // number of radial chambers/costae
      const d = params.d ?? 0.15;   // chamber depth modulation
      const e = params.e ?? 2.0;    // radial pattern frequency
      const f = params.f ?? 0.05;   // surface texture scale

      const theta = u * 2 * Math.PI;
      const r = v * a;
      
      // Radial chamber structure (costae)
      const radialPattern = 1 + d * Math.sin(c * theta);
      
      // Annular rings (striae)
      const annularRings = 1 + f * Math.sin(e * r / a * 20 * Math.PI);
      
      // Valve curvature (slight dome)
      const valveHeight = b * (1 - (r / a) ** 2) * radialPattern * annularRings;
      
      const x = r * radialPattern * Math.cos(theta);
      const y = r * radialPattern * Math.sin(theta);
      const z = valveHeight;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 0.1, c: 12.0, d: 0.15, e: 2.0, f: 0.05,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 120, vSegments: 60 
    })
  },

  // ============================================================================
  // PENNATE DIATOM - Elongated bilateral symmetry
  // Examples: Navicula, Pinnularia, Nitzschia
  // ============================================================================
  pennate_diatom: {
    name: "🔬 Pennate Diatom",
    description: "Boat-shaped diatom with bilateral symmetry, transverse striae, and raphe structure. These motile diatoms glide along surfaces in benthic environments.",
    equation: (u, v, params) => {
      const a = params.a ?? 2.0;    // length
      const b = params.b ?? 0.8;    // width
      const c = params.c ?? 0.15;   // valve height
      const d = params.d ?? 15.0;   // number of transverse striae
      const e = params.e ?? 0.08;   // striae depth
      const f = params.f ?? 0.3;    // raphe (central slit) width

      // Normalize to elliptical cross-section
      const s = (u - 0.5) * 2;  // -1 to 1
      const t = (v - 0.5) * 2;  // -1 to 1
      
      // Elliptical boundary
      const ellipseBound = (s * s) / (a * a) + (t * t) / (b * b);
      if (ellipseBound > 1) return [s * a, t * b, 0]; // flat outside boundary
      
      // Transverse striae (ribs perpendicular to long axis)
      const striaePattern = 1 + e * Math.sin(d * Math.PI * s);
      
      // Raphe (central longitudinal slit)
      const raphe = Math.abs(t) < f ? 0.5 : 1.0;
      
      // Valve curvature (boat-like)
      const valveCurvature = c * (1 - ellipseBound) * striaePattern * raphe;
      
      const x = s * a;
      const y = t * b;
      const z = valveCurvature;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 2.0, b: 0.8, c: 0.15, d: 15.0, e: 0.08, f: 0.3,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 80, vSegments: 40 
    })
  },

  // ============================================================================
  // POLYGONAL DIATOM - Geometric tessellation patterns
  // Examples: Triceratium, Lithodesmium, Hydrosera (triangular/polygonal forms)
  // ============================================================================
  polygonal_diatom: {
    name: "🔬 Polygonal Diatom",
    description: "Triangular, pentagonal, or hexagonal diatom forms with areolae pore networks and vertex reinforcement. Demonstrates discrete rotational symmetry.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;    // circumradius
      const b = params.b ?? 0.12;   // valve depth
      const c = params.c ?? 3.0;    // number of sides (3=triangle, 5=pentagon, 6=hexagon)
      const d = params.d ?? 8.0;    // areolae (pore) density
      const e = params.e ?? 0.06;   // areolae depth
      const f = params.f ?? 0.15;   // edge reinforcement thickness

      const sides = Math.max(3, Math.floor(c));
      const theta = u * 2 * Math.PI;
      const r = v * a;
      
      // Polygonal shape construction
      const anglePerSide = (2 * Math.PI) / sides;
      
      // Distance from polygon edge (creates flat faces)
      const edgeDist = Math.cos(anglePerSide / 2);
      const adjustedR = r / edgeDist;
      
      // Areolae pattern (hexagonal pore network)
      const hexPattern = Math.sin(d * r * Math.PI) * Math.cos(d * theta * 3);
      const areolae = 1 + e * Math.max(0, hexPattern);
      
      // Edge reinforcement (costae at vertices)
      const edgeWeight = Math.cos(sides * theta / 2);
      const edgeReinforce = 1 + f * Math.max(0, edgeWeight);
      
      // Valve curvature with pore structure
      const valveHeight = b * (1 - (r / a) ** 1.5) * areolae * edgeReinforce;
      
      // Project onto polygon
      const x = adjustedR * Math.cos(theta);
      const y = adjustedR * Math.sin(theta);
      const z = valveHeight;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 0.12, c: 3.0, d: 8.0, e: 0.06, f: 0.15,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 90, vSegments: 45 
    })
  },

  // ============================================================================
  // COLONIAL CHAIN DIATOM - Connected frustules forming chains
  // Examples: Chaetoceros, Skeletonema, Thalassiosira (chain-forming)
  // ============================================================================
  colonial_chain_diatom: {
    name: "🔬 Colonial Chain Diatom",
    description: "Chain-forming diatoms connected by silica spines or mucilage threads. Modeled as linked frustule units with connecting structures.",
    equation: (u, v, params) => {
      const a = params.a ?? 0.4;    // cell radius
      const b = params.b ?? 0.08;   // valve height
      const c = params.c ?? 5.0;    // number of cells in chain
      const d = params.d ?? 0.15;   // spine length
      const e = params.e ?? 0.03;   // spine thickness
      const f = params.f ?? 8.0;    // costae count per cell

      const cells = Math.max(2, Math.floor(c));
      const chainLength = cells * 2 * a + (cells - 1) * d;
      
      // Position along chain
      const chainPos = u * chainLength - chainLength / 2;
      const cellSpacing = 2 * a + d;
      const cellIndex = Math.floor((chainPos + chainLength / 2) / cellSpacing);
      const localPos = (chainPos + chainLength / 2) - cellIndex * cellSpacing;
      
      const theta = v * 2 * Math.PI;
      
      // Determine if in cell or spine region
      const inCell = localPos < 2 * a && cellIndex < cells;
      
      if (inCell) {
        const cellCenter = localPos - a;
        const rNorm = Math.abs(cellCenter) / a;
        const rCell = a * Math.sqrt(Math.max(0, 1 - rNorm * rNorm));
        
        // Radial costae
        const costae = 1 + 0.05 * Math.sin(f * theta);
        
        const x = chainPos;
        const y = rCell * costae * Math.cos(theta);
        const z = rCell * costae * Math.sin(theta) + b * (1 - rNorm);
        
        return [x, y, z];
      } else {
        // Connecting spine
        const spinePos = (localPos - 2 * a) / d;
        const x = chainPos;
        const y = e * Math.cos(theta);
        const z = e * Math.sin(theta);
        
        return [x, y, z];
      }
    },
    defaultParams: getCleanDefaults({ 
      a: 0.4, b: 0.08, c: 5.0, d: 0.15, e: 0.03, f: 8.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 150, vSegments: 40 
    })
  },

  // ============================================================================
  // STELLATE DIATOM - Star-shaped with radiating arms
  // Examples: Asterionella, Asteromphalus
  // ============================================================================
  stellate_diatom: {
    name: "🔬 Stellate Diatom",
    description: "Star-shaped diatom with radiating arms extending from central body. Demonstrates optimal surface area for nutrient uptake.",
    equation: (u, v, params) => {
      const a = params.a ?? 0.3;    // central body radius
      const b = params.b ?? 1.0;    // arm length
      const c = params.c ?? 6.0;    // number of arms
      const d = params.d ?? 0.15;   // arm width
      const e = params.e ?? 0.08;   // valve depth
      const f = params.f ?? 10.0;   // striae density

      const arms = Math.max(3, Math.floor(c));
      const theta = u * 2 * Math.PI;
      const rNorm = v;
      
      // Star shape function
      const armAngle = (2 * Math.PI) / arms;
      const currentArm = Math.floor(theta / armAngle + 0.5);
      const armCenterAngle = currentArm * armAngle;
      const angleFromArm = Math.abs(theta - armCenterAngle);
      
      // Arm profile (smooth transition from center to tips)
      const armProfile = Math.exp(-angleFromArm * arms / 2);
      const r = a + (b - a) * rNorm * armProfile;
      
      // Striae pattern along arms
      const striae = 1 + 0.03 * Math.sin(f * rNorm * Math.PI);
      
      // Valve curvature
      const valveHeight = e * (1 - rNorm * 0.8) * striae;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = valveHeight;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 0.3, b: 1.0, c: 6.0, d: 0.15, e: 0.08, f: 10.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 120, vSegments: 60 
    })
  },

  // ============================================================================
  // FRUSTULE COMPLETE - Full 3D diatom with both valves
  // Two overlapping valves creating the complete silica shell
  // ============================================================================
  diatom_frustule_complete: {
    name: "🔬 Complete Diatom Frustule",
    description: "Full 3D model showing both overlapping valves (epitheca and hypotheca) with girdle bands. The complete silica house of a living diatom.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;    // radius
      const b = params.b ?? 0.4;    // total height (both valves)
      const c = params.c ?? 8.0;    // costae count
      const d = params.d ?? 0.08;   // valve curvature
      const e = params.e ?? 0.03;   // girdle band height
      const f = params.f ?? 12.0;   // areolae density

      const theta = u * 2 * Math.PI;
      const vPos = v * 2 - 1;  // -1 to 1 (bottom to top)
      
      // Radial pattern with costae
      const costae = 1 + 0.05 * Math.sin(c * theta);
      
      // Areolae (pore) texture
      const areolae = 1 + 0.02 * Math.sin(f * theta) * Math.sin(f * Math.abs(vPos) * 10);
      
      // Valve shape (two domes with girdle)
      let r, z;
      const absV = Math.abs(vPos);
      
      if (absV > 0.7) {
        // Valve region (curved dome)
        const valvePos = (absV - 0.7) / 0.3;
        r = a * Math.sqrt(1 - valvePos * valvePos * 0.3) * costae * areolae;
        z = vPos * b / 2 + Math.sign(vPos) * d * valvePos * valvePos;
      } else {
        // Girdle region (cylindrical)
        r = a * costae * areolae;
        z = vPos * b / 2;
      }
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 0.4, c: 8.0, d: 0.08, e: 0.03, f: 12.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 100, vSegments: 50 
    })
  },

  // ============================================================================
  // COSCINODISCUS - Classic disc diatom with hexagonal areolae
  // One of the most studied and beautiful centric diatoms
  // ============================================================================
  coscinodiscus_diatom: {
    name: "🔬 Coscinodiscus",
    description: "Classic disc-shaped centric diatom with hexagonal areolae pattern. One of the most beautiful and well-studied diatom genera.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.2;    // radius
      const b = params.b ?? 0.1;    // dome height
      const c = params.c ?? 6.0;    // areolae rings
      const d = params.d ?? 24.0;   // areolae per ring
      const e = params.e ?? 0.04;   // areolae depth
      const f = params.f ?? 0.92;   // areolae opening ratio

      const theta = u * 2 * Math.PI;
      const rNorm = v;
      const r = rNorm * a;
      
      // Hexagonal areolae pattern
      const ringNum = Math.floor(rNorm * c);
      const areolaeInRing = Math.max(6, Math.floor(d * (ringNum + 1) / c));
      const localAngle = theta * areolaeInRing / (2 * Math.PI);
      const areolaeCenter = Math.round(localAngle);
      const distFromCenter = Math.abs(localAngle - areolaeCenter);
      
      // Create pore openings
      const poreDepth = distFromCenter < f / 2 ? e * (1 - 2 * distFromCenter / f) : 0;
      
      // Gentle dome shape
      const dome = b * (1 - rNorm * rNorm);
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = dome - poreDepth;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.2, b: 0.1, c: 6.0, d: 24.0, e: 0.04, f: 0.92,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 150, vSegments: 75 
    })
  },

  // ============================================================================
  // NAVICULA - Classic boat-shaped pennate diatom
  // The archetypal naviculoid diatom with clear bilateral symmetry
  // ============================================================================
  navicula_diatom: {
    name: "🔬 Navicula",
    description: "Archetypal boat-shaped pennate diatom with prominent raphe and transverse striae. The genus name means 'little ship' in Latin.",
    equation: (u, v, params) => {
      const a = params.a ?? 2.5;    // length (apical axis)
      const b = params.b ?? 0.6;    // width (transapical axis)
      const c = params.c ?? 0.12;   // valve height
      const d = params.d ?? 20.0;   // striae density
      const e = params.e ?? 0.05;   // striae depth
      const f = params.f ?? 0.08;   // raphe width

      // Navicular (boat) outline using superellipse
      const s = (u - 0.5) * 2;  // -1 to 1 apical
      const t = (v - 0.5) * 2;  // -1 to 1 transapical
      
      // Pointed ends (higher exponent = pointier)
      const exponent = 2.5;
      const navicularBound = Math.pow(Math.abs(s), exponent) + Math.pow(Math.abs(t) * a / b, exponent);
      
      if (navicularBound > 1) {
        return [s * a, t * b, 0];
      }
      
      // Central area (wider near middle)
      const centralArea = Math.exp(-s * s * 4);
      const effectiveWidth = b * (0.8 + 0.2 * centralArea);
      
      // Transverse striae
      const striae = 1 + e * Math.sin(d * Math.PI * s);
      
      // Raphe (central longitudinal line)
      const rapheDepression = Math.abs(t) < f ? 0.3 : 1.0;
      
      // Valve curvature
      const boundValue = Math.pow(Math.abs(s), exponent) + Math.pow(Math.abs(t) * a / effectiveWidth, exponent);
      const valveCurve = c * Math.max(0, 1 - boundValue) * striae * rapheDepression;
      
      const x = s * a;
      const y = t * effectiveWidth;
      const z = valveCurve;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 2.5, b: 0.6, c: 0.12, d: 20.0, e: 0.05, f: 0.08,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 100, vSegments: 50 
    })
  },

  // ============================================================================
  // TRICERATIUM - Triangular diatom with horns
  // Distinctive three-cornered form with elevated processes
  // ============================================================================
  triceratium_diatom: {
    name: "🔬 Triceratium",
    description: "Three-cornered diatom with elevated horn-like processes at each vertex. Classic example of triangular diatom symmetry.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;    // base size
      const b = params.b ?? 0.3;    // horn height
      const c = params.c ?? 0.08;   // valve height
      const d = params.d ?? 0.15;   // horn radius
      const e = params.e ?? 6.0;    // areolae density
      const f = params.f ?? 0.04;   // areolae depth

      const theta = u * 2 * Math.PI;
      const rNorm = v;
      
      // Triangular base (3-fold symmetry)
      const triAngle = theta * 3;
      const triRadius = a * (1 + 0.2 * Math.cos(3 * theta));
      const r = rNorm * triRadius;
      
      // Horn positions at vertices
      const hornAngles = [0, 2 * Math.PI / 3, 4 * Math.PI / 3];
      let hornInfluence = 0;
      
      for (const hornAngle of hornAngles) {
        const angleDist = Math.abs(theta - hornAngle);
        const minAngleDist = Math.min(angleDist, 2 * Math.PI - angleDist);
        if (minAngleDist < 0.5 && rNorm > 0.7) {
          const hornFactor = Math.exp(-minAngleDist * 6) * ((rNorm - 0.7) / 0.3);
          hornInfluence = Math.max(hornInfluence, hornFactor);
        }
      }
      
      // Areolae pattern
      const areolae = 1 + f * Math.sin(e * r * Math.PI) * Math.cos(e * theta * 3);
      
      // Combine base valve with horns
      const baseHeight = c * (1 - rNorm * 0.5) * areolae;
      const z = baseHeight + b * hornInfluence;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 0.3, c: 0.08, d: 0.15, e: 6.0, f: 0.04,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 120, vSegments: 60 
    })
  },

  // ============================================================================
  // ARACHNOIDISCUS - Spider-web pattern diatom
  // Intricate radial pattern resembling spider web
  // ============================================================================
  arachnoidiscus_diatom: {
    name: "🔬 Arachnoidiscus",
    description: "Spider-web patterned diatom with intricate radial and concentric silica ribbing. Named for its arachnid-like appearance.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;    // radius
      const b = params.b ?? 0.08;   // dome height
      const c = params.c ?? 16.0;   // radial ribs
      const d = params.d ?? 8.0;    // concentric rings
      const e = params.e ?? 0.03;   // rib height
      const f = params.f ?? 0.5;    // web pattern intensity

      const theta = u * 2 * Math.PI;
      const rNorm = v;
      const r = rNorm * a;
      
      // Radial ribs (like spider web spokes)
      const radialRibs = Math.abs(Math.sin(c * theta / 2));
      
      // Concentric rings (like spider web circles)
      const concentricRings = Math.abs(Math.sin(d * rNorm * Math.PI));
      
      // Web pattern (intersection of radial and concentric)
      const webPattern = f * radialRibs + (1 - f) * concentricRings;
      const webHeight = e * webPattern;
      
      // Gentle dome
      const dome = b * (1 - rNorm * rNorm);
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = dome + webHeight;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 0.08, c: 16.0, d: 8.0, e: 0.03, f: 0.5,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 150, vSegments: 75 
    })
  },

  // ============================================================================
  // THALASSIOSIRA - Model organism centric diatom
  // Reference: Nees et al. 2013 - Used in nanoimprint lithography research
  // ============================================================================
  thalassiosira_diatom: {
    name: "🔬 Thalassiosira",
    description: "Marine centric diatom used in NIL (nanoimprint lithography) research. Features fultoportulae (strutted processes) and precise nanopore arrays. Reference organism in Nees 2013 biomimetic replication study.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;    // radius
      const b = params.b ?? 0.12;   // valve curvature
      const c = params.c ?? 18.0;   // areolae rings (pore rows)
      const d = params.d ?? 6.0;    // fultoportulae count (strutted processes)
      const e = params.e ?? 0.05;   // pore depth
      const f = params.f ?? 0.08;   // process height

      const theta = u * 2 * Math.PI;
      const rNorm = v;
      const r = rNorm * a;
      
      // Precise hexagonal areolae pattern (nanopore array)
      // Following Nees et al. research on natural diatom templates
      const ringIndex = Math.floor(rNorm * c);
      const poresPerRing = 6 + ringIndex * 6;  // Hexagonal packing
      const poreAngle = (theta * poresPerRing) / (2 * Math.PI);
      const porePhase = poreAngle - Math.floor(poreAngle);
      
      // Pore opening function (smooth hexagonal pores)
      const poreDist = Math.abs(porePhase - 0.5) * 2;
      const poreDepth = poreDist < 0.7 ? e * (1 - poreDist / 0.7) : 0;
      
      // Fultoportulae (strutted processes) near margin
      let processHeight = 0;
      if (rNorm > 0.85) {
        const processAngle = theta * d / (2 * Math.PI);
        const nearProcess = Math.abs(processAngle - Math.round(processAngle));
        if (nearProcess < 0.08) {
          processHeight = f * (1 - nearProcess / 0.08) * ((rNorm - 0.85) / 0.15);
        }
      }
      
      // Valve dome with central depression (typical of Thalassiosira)
      const valve = b * (1 - rNorm * rNorm) * (0.8 + 0.2 * Math.cos(rNorm * Math.PI));
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = valve - poreDepth + processHeight;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 0.12, c: 18.0, d: 6.0, e: 0.05, f: 0.08,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 180, vSegments: 90 
    })
  },

  // ============================================================================
  // PINNULARIA - Large pennate diatom with prominent raphe
  // Classic research specimen with clear structural features
  // ============================================================================
  pinnularia_diatom: {
    name: "🔬 Pinnularia",
    description: "Large pennate freshwater diatom with prominent central raphe and widely-spaced transverse striae. Excellent for microscopy studies due to clear structural features.",
    equation: (u, v, params) => {
      const a = params.a ?? 2.8;    // length
      const b = params.b ?? 0.5;    // width
      const c = params.c ?? 0.14;   // valve height
      const d = params.d ?? 12.0;   // striae count (coarser than Navicula)
      const e = params.e ?? 0.06;   // striae depth
      const f = params.f ?? 0.12;   // raphe groove depth

      const s = (u - 0.5) * 2;  // -1 to 1 apical
      const t = (v - 0.5) * 2;  // -1 to 1 transapical
      
      // Pinnularia has rounded ends (not as pointed as Navicula)
      const exponent = 2.0;
      const boundary = Math.pow(Math.abs(s), exponent) + Math.pow(Math.abs(t) * a / b, exponent);
      
      if (boundary > 1) {
        return [s * a, t * b, 0];
      }
      
      // Wide central area expanding toward center
      const centralExpansion = 1 + 0.15 * Math.exp(-s * s * 2);
      const effectiveWidth = b * centralExpansion;
      
      // Coarse transverse striae (characteristic of Pinnularia)
      const striae = 1 + e * Math.sin(d * Math.PI * s);
      
      // Prominent raphe groove (deeper than Navicula)
      const rapheWidth = 0.1;
      const rapheFactor = Math.abs(t) < rapheWidth ? 
        1 - f * Math.cos(Math.abs(t) / rapheWidth * Math.PI / 2) : 1;
      
      // Central nodule (thickening at raphe center)
      const centralNodule = Math.exp(-s * s * 8 - t * t * 20) * 0.02;
      
      const valveHeight = c * Math.max(0, 1 - boundary) * striae * rapheFactor + centralNodule;
      
      const x = s * a;
      const y = t * effectiveWidth;
      const z = valveHeight;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 2.8, b: 0.5, c: 0.14, d: 12.0, e: 0.06, f: 0.12,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 100, vSegments: 50 
    })
  },

  // ============================================================================
  // NIL BIOMIMETIC TEMPLATE - Artificial diatom-inspired nanostructure
  // Based on Nees et al. 2013 - 3D laser lithography approach
  // ============================================================================
  nil_diatom_template: {
    name: "🔬 NIL Diatom Template",
    description: "Artificial diatom-inspired template for nanoimprint lithography (NIL). Based on Nees et al. 2013 two-photon polymerization method for precise 3D micro/nanostructure fabrication.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;    // template radius
      const b = params.b ?? 0.15;   // template height
      const c = params.c ?? 24.0;   // nanopillar count radially
      const d = params.d ?? 8.0;    // nanopillar rings
      const e = params.e ?? 0.04;   // pillar height
      const f = params.f ?? 0.6;    // pillar spacing factor

      const theta = u * 2 * Math.PI;
      const rNorm = v;
      const r = rNorm * a;
      
      // Regular hexagonal nanopillar array (3DLL fabricated)
      // More precise than natural diatoms - designed geometry
      const ringNum = Math.floor(rNorm * d);
      const pillarsInRing = Math.max(6, Math.floor(c * (ringNum + 1) / d));
      const pillarAngle = (theta * pillarsInRing) / (2 * Math.PI);
      const nearestPillar = Math.round(pillarAngle);
      const angleDist = Math.abs(pillarAngle - nearestPillar);
      
      // Ring position distance
      const ringCenter = (ringNum + 0.5) / d;
      const radialDist = Math.abs(rNorm - ringCenter) * d;
      
      // Pillar height (sharp, well-defined - characteristic of laser writing)
      const pillarRadius = f * 0.5 / pillarsInRing;
      const distFromPillar = Math.sqrt(angleDist * angleDist + radialDist * radialDist * 0.1);
      const pillarHeight = distFromPillar < pillarRadius ? 
        e * (1 - distFromPillar / pillarRadius) : 0;
      
      // Base template (flat or slight dome)
      const base = b * 0.1 * (1 - rNorm * rNorm);
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = base + pillarHeight;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 0.15, c: 24.0, d: 8.0, e: 0.04, f: 0.6,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 200, vSegments: 100 
    })
  }
};

export const DIATOM_SHAPE_COUNT = Object.keys(DIATOM_SHAPES).length;

export const DIATOM_CATEGORY = {
  id: 'diatoms',
  name: '🔬 Diatoms (Biomimetic Architecture)',
  icon: '🔬',
  description: 'Mathematical models of microscopic silica-shelled algae (Bacillariophyta). 200+ million years of optimized engineering: radial symmetry, perforated structures, hierarchical organization. Victorian naturalists like Ernst Haeckel recognized these as living geometry proving universal design principles.',
  engineDynamics: {
    primaryType: 'biological' as const,
    symmetryOrder: 12,
    influenceFactors: ['silica frustule', 'radial symmetry', 'hierarchical patterns', 'biomimetic engineering']
  },
  shapes: Object.keys(DIATOM_SHAPES)
};
