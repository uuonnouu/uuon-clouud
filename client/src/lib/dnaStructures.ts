/**
 * DNA MOLECULAR STRUCTURES
 * Mathematically accurate parametric representations of DNA forms
 * 
 * Reference Data:
 * - B-DNA (Watson-Crick): 10.5 bp/turn, 3.4nm pitch, right-handed helix
 * - A-DNA: 11 bp/turn, 2.8nm pitch, wider and shorter
 * - Z-DNA: 12 bp/turn, 4.56nm pitch, left-handed helix
 * - Base pair dimensions: A-T (2 hydrogen bonds), G-C (3 hydrogen bonds)
 * - Sugar-phosphate backbone radius: ~1nm from helix axis
 * 
 * DNA GEOMETRIC CODE (2025 Discovery):
 * - 3D structural memory system beyond ATGC sequence
 * - Loop formation creates topological memory domains (TADs)
 * - Golden ratio harmonic patterns in helical geometry
 * - Epigenetic probability states stabilized by geometric folding
 */

import { SurfaceParameters } from '../types/math';

export interface DNAStructure {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
  description?: string;
}

const PHI = (1 + Math.sqrt(5)) / 2; // Golden ratio

export const DNA_STRUCTURES: Record<string, DNAStructure> = {

  // ========================================
  // DNA GEOMETRIC CODE - 3D MEMORY SYSTEM
  // ========================================
  
  dna_geometric_code: {
    name: "🧬 DNA Geometric Code - 3D Memory System",
    description: "3D structural memory beyond ATGC - loop domains (TADs), golden ratio harmonics, epigenetic states",
    equation: (u, v, params) => {
      const a = params.a ?? 2;         // Domain radius
      const b = params.b ?? 1;         // Loop formation intensity
      const c = params.c ?? 0.5;       // Memory node strength
      
      // Polymer model - DNA as flexible chain with bending energy
      const theta = u * Math.PI * 4;    // Bending angle
      const bendingStiffness = 0.5 + c * 0.5;
      
      // Loop formation (TAD model) - creates memory domains
      const loopLength = a * (1 + b * Math.sin(v * Math.PI * 2));
      const loopEnergy = Math.pow(loopLength - a, 2) * 0.5;
      
      // Geometric encoding with golden ratio harmonics
      const phiAngle = v * PHI * Math.PI * 2;
      const helixAngle = u * Math.PI * 8 + phiAngle;
      
      // Epigenetic probability - energy determines open/closed state
      const energyState = Math.exp(-loopEnergy);
      const memoryFactor = 0.5 + energyState * 0.5;
      
      // Main DNA backbone with geometric folding
      const x = loopLength * Math.cos(helixAngle) * memoryFactor;
      const y = loopLength * Math.sin(helixAngle) * memoryFactor;
      
      // Z-axis shows loop formation and bending
      const baseLine = u * a * 3;
      const loopHeight = b * Math.sin(v * Math.PI * 2) * a;
      const bendingEffect = Math.cos(theta) * bendingStiffness * c;
      const z = baseLine + loopHeight + bendingEffect;
      
      return [x, y, z];
    },
    defaultParams: {
      a: 2,    // Domain radius
      b: 1,    // Loop formation intensity
      c: 0.5,  // Memory node strength
      uMin: 0,
      uMax: 1,
      vMin: 0,
      vMax: 1,
      uSegments: 80,
      vSegments: 60
    }
  },

  // ========================================
  // CLASSIC DOUBLE HELIX FORMS
  // ========================================

  dna_double_helix: {
    name: "DNA Double Helix (B-DNA)",
    description: "Classic Watson-Crick right-handed double helix with base pairs",
    equation: (u, v, params) => {
      const a = params.a ?? 1;        // Helix radius
      const b = params.b ?? Math.PI;  // Pitch (height per complete turn) - π creates mathematical harmony
      const c = params.c ?? 0.15;     // Base pair thickness
      const d = params.d ?? 0;        // Time/animation parameter
      const turns = params.e ?? 3;    // Number of complete turns to display
      
      // Map u to height along helix
      const height = u * turns * b;
      
      // Helical angle (36° per base pair, 10.5 bp per turn)
      const angle = u * turns * 2 * Math.PI + d * Math.PI;
      
      // v determines which strand (0-0.5 = strand 1, 0.5-1 = strand 2)
      const isStrand1 = v < 0.5;
      const localV = (v % 0.5) * 2; // Normalize to 0-1
      
      if (isStrand1) {
        // First strand (phosphate backbone)
        const x = a * Math.cos(angle);
        const y = a * Math.sin(angle);
        const z = height;
        
        // Add base pair extending inward
        const basePairExtension = localV * (a * 0.8);
        return [
          x - basePairExtension * Math.cos(angle),
          y - basePairExtension * Math.sin(angle),
          z
        ];
      } else {
        // Second strand (180° offset for antiparallel)
        const oppositeAngle = angle + Math.PI;
        const x = a * Math.cos(oppositeAngle);
        const y = a * Math.sin(oppositeAngle);
        const z = height;
        
        // Add base pair extending inward
        const basePairExtension = localV * (a * 0.8);
        return [
          x - basePairExtension * Math.cos(oppositeAngle),
          y - basePairExtension * Math.sin(oppositeAngle),
          z
        ];
      }
    },
    defaultParams: { 
      a: 1, b: 3.4, c: 0.15, d: 0, e: 3,
      uSegments: 128, vSegments: 64,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1
    }
  },

  b_form_dna_helix: {
    name: "B-form DNA Helix",
    description: "B-form DNA - the standard Watson-Crick right-handed double helix under physiological conditions. 10.5 bp/turn, 3.4nm pitch, 2.0nm diameter, base pairs nearly perpendicular to axis (0-6° tilt)",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;       // Radius (~1.0nm = 10Å)
      const b = params.b ?? 3.4;       // Pitch per turn (3.4nm = 34Å)
      const d = params.d ?? 0;         // Animation/phase offset
      const turns = params.e ?? 3;     // Number of complete turns to display
      
      // B-form specific: 10.5 base pairs per turn
      // Rise per base pair: 0.324nm (Δz = P/n_bp = 3.4/10.5)
      // Angular rotation per base pair: 34.3° (2π/10.5 = 0.598 rad)
      
      const height = u * turns * b;
      // Right-handed helix (positive angle progression)
      const angle = u * turns * 2 * Math.PI + d * Math.PI;
      
      const isStrand1 = v < 0.5;
      const localV = (v % 0.5) * 2;
      
      // B-form base pairs are nearly perpendicular to helix axis (0-6° tilt)
      const tilt = 0.05; // ~3° slight tilt
      
      if (isStrand1) {
        // First strand (5' to 3' direction)
        const x = a * Math.cos(angle);
        const y = a * Math.sin(angle);
        const z = height;
        
        // Base pair extending inward toward center
        const basePairExtension = localV * (a * 0.8);
        return [
          x - basePairExtension * Math.cos(angle) * Math.cos(tilt),
          y - basePairExtension * Math.sin(angle) * Math.cos(tilt),
          z + basePairExtension * Math.sin(tilt)
        ];
      } else {
        // Second strand (3' to 5' direction, antiparallel)
        const oppositeAngle = angle + Math.PI;
        const x = a * Math.cos(oppositeAngle);
        const y = a * Math.sin(oppositeAngle);
        const z = height;
        
        // Base pair extending inward
        const basePairExtension = localV * (a * 0.8);
        return [
          x - basePairExtension * Math.cos(oppositeAngle) * Math.cos(tilt),
          y - basePairExtension * Math.sin(oppositeAngle) * Math.cos(tilt),
          z + basePairExtension * Math.sin(tilt)
        ];
      }
    },
    defaultParams: { 
      a: 1.0, b: 3.4, d: 0, e: 3,
      uSegments: 128, vSegments: 64,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1
    }
  },

  a_dna_helix: {
    name: "A-form DNA Helix",
    description: "A-form DNA conformation - right-handed helix, wider and shorter than B-form, 11 base pairs per turn, ~20° base tilt, found in dehydrated conditions",
    equation: (u, v, params) => {
      const a = params.a ?? 1.2;      // Wider radius than B-DNA
      const b = params.b ?? 2.8;      // Shorter pitch (compressed)
      const d = params.d ?? 0;
      const turns = params.e ?? 3;
      
      const height = u * turns * b;
      const angle = u * turns * 2 * Math.PI + d * Math.PI;
      
      const isStrand1 = v < 0.5;
      const localV = (v % 0.5) * 2;
      
      // A-DNA has tilted base pairs (~20° from perpendicular)
      const tilt = 0.35; // Radians (~20°)
      
      if (isStrand1) {
        const x = a * Math.cos(angle);
        const y = a * Math.sin(angle);
        const z = height;
        
        const basePairExtension = localV * (a * 0.7);
        const tiltOffset = basePairExtension * Math.sin(tilt);
        
        return [
          x - basePairExtension * Math.cos(angle) * Math.cos(tilt),
          y - basePairExtension * Math.sin(angle) * Math.cos(tilt),
          z + tiltOffset
        ];
      } else {
        const oppositeAngle = angle + Math.PI;
        const x = a * Math.cos(oppositeAngle);
        const y = a * Math.sin(oppositeAngle);
        const z = height;
        
        const basePairExtension = localV * (a * 0.7);
        const tiltOffset = basePairExtension * Math.sin(tilt);
        
        return [
          x - basePairExtension * Math.cos(oppositeAngle) * Math.cos(tilt),
          y - basePairExtension * Math.sin(oppositeAngle) * Math.cos(tilt),
          z + tiltOffset
        ];
      }
    },
    defaultParams: { 
      a: 1.2, b: 2.8, d: 0, e: 3,
      uSegments: 128, vSegments: 64
    }
  },

  z_dna_helix: {
    name: "Z-form DNA Helix (Left-Handed)",
    description: "Z-form DNA conformation - left-handed helix with characteristic zig-zag backbone, 12 bp per turn, 4.56nm pitch, found in alternating purine-pyrimidine sequences",
    equation: (u, v, params) => {
      const a = params.a ?? 0.9;      // Slightly narrower
      const b = params.b ?? 4.56;     // Longer pitch
      const d = params.d ?? 0;
      const turns = params.e ?? 3;
      
      const height = u * turns * b;
      // NEGATIVE angle for left-handed helix
      const angle = -u * turns * 2 * Math.PI + d * Math.PI;
      
      const isStrand1 = v < 0.5;
      const localV = (v % 0.5) * 2;
      
      // Zig-zag backbone (characteristic of Z-DNA)
      const zigzag = 0.2 * Math.sin(u * turns * 12 * 2 * Math.PI); // 12 bp per turn
      
      if (isStrand1) {
        const x = (a + zigzag) * Math.cos(angle);
        const y = (a + zigzag) * Math.sin(angle);
        const z = height;
        
        const basePairExtension = localV * (a * 0.85);
        return [
          x - basePairExtension * Math.cos(angle),
          y - basePairExtension * Math.sin(angle),
          z
        ];
      } else {
        const oppositeAngle = angle + Math.PI;
        const x = (a + zigzag) * Math.cos(oppositeAngle);
        const y = (a + zigzag) * Math.sin(oppositeAngle);
        const z = height;
        
        const basePairExtension = localV * (a * 0.85);
        return [
          x - basePairExtension * Math.cos(oppositeAngle),
          y - basePairExtension * Math.sin(oppositeAngle),
          z
        ];
      }
    },
    defaultParams: { 
      a: 0.9, b: 4.56, d: 0, e: 3,
      uSegments: 128, vSegments: 64
    }
  },

  // ========================================
  // BASE PAIR STRUCTURES
  // ========================================

  adenine_thymine_pair: {
    name: "Adenine-Thymine Base Pair (A-T)",
    description: "A-T base pair with 2 hydrogen bonds",
    equation: (u, v, params) => {
      const a = params.a ?? 1;        // Width of base pair
      const b = params.b ?? 0.34;     // Thickness
      const c = params.c ?? 0.5;      // Purine/pyrimidine size ratio
      
      // u: along the base pair (0 = adenine side, 1 = thymine side)
      // v: around the perimeter of the bases
      
      const theta = v * 2 * Math.PI;
      
      // Create two hexagonal bases with connecting hydrogen bonds
      if (u < 0.4) {
        // Adenine (purine - larger, double ring)
        const radius = 0.4 * a;
        const x = u * a;
        const y = radius * Math.cos(theta);
        const z = radius * Math.sin(theta) * b;
        return [x, y, z];
      } else if (u > 0.6) {
        // Thymine (pyrimidine - smaller, single ring)
        const radius = 0.3 * a;
        const x = u * a;
        const y = radius * Math.cos(theta);
        const z = radius * Math.sin(theta) * b;
        return [x, y, z];
      } else {
        // Hydrogen bonds connecting them (2 bonds for A-T)
        const bondNum = Math.floor(v * 2) % 2;
        const offset = (bondNum - 0.5) * 0.3;
        const t = (u - 0.4) / 0.2; // 0 to 1 across bond region
        return [
          0.4 * a + t * 0.2 * a,
          offset,
          0
        ];
      }
    },
    defaultParams: { 
      a: 1, b: 0.34, c: 0.5,
      uSegments: 64, vSegments: 32
    }
  },

  guanine_cytosine_pair: {
    name: "Guanine-Cytosine Base Pair (G-C)",
    description: "G-C base pair with 3 hydrogen bonds (stronger)",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 0.34;
      
      const theta = v * 2 * Math.PI;
      
      if (u < 0.4) {
        // Guanine (purine - larger)
        const radius = 0.42 * a;
        const x = u * a;
        const y = radius * Math.cos(theta);
        const z = radius * Math.sin(theta) * b;
        return [x, y, z];
      } else if (u > 0.6) {
        // Cytosine (pyrimidine - smaller)
        const radius = 0.32 * a;
        const x = u * a;
        const y = radius * Math.cos(theta);
        const z = radius * Math.sin(theta) * b;
        return [x, y, z];
      } else {
        // 3 hydrogen bonds for G-C (stronger pairing)
        const bondNum = Math.floor(v * 3) % 3;
        const offset = (bondNum - 1) * 0.25;
        const t = (u - 0.4) / 0.2;
        return [
          0.4 * a + t * 0.2 * a,
          offset,
          0
        ];
      }
    },
    defaultParams: { 
      a: 1, b: 0.34,
      uSegments: 64, vSegments: 32
    }
  },

  // ========================================
  // STRUCTURAL COMPONENTS
  // ========================================

  sugar_phosphate_backbone: {
    name: "Sugar-Phosphate Backbone",
    description: "The structural backbone of DNA strand",
    equation: (u, v, params) => {
      const a = params.a ?? 1;        // Helix radius
      const b = params.b ?? 3.4;      // Pitch
      const c = params.c ?? 0.15;     // Backbone thickness
      const d = params.d ?? 0;
      const turns = params.e ?? 3;
      
      const height = u * turns * b;
      const angle = u * turns * 2 * Math.PI + d * Math.PI;
      
      // v creates the tubular backbone
      const tubeAngle = v * 2 * Math.PI;
      const tubeRadius = c;
      
      const centerX = a * Math.cos(angle);
      const centerY = a * Math.sin(angle);
      
      // Create tube around the helical path
      const x = centerX + tubeRadius * Math.cos(tubeAngle) * Math.cos(angle);
      const y = centerY + tubeRadius * Math.cos(tubeAngle) * Math.sin(angle);
      const z = height + tubeRadius * Math.sin(tubeAngle);
      
      return [x, y, z];
    },
    defaultParams: { 
      a: 1, b: 3.4, c: 0.15, d: 0, e: 3,
      uSegments: 128, vSegments: 16
    }
  },

  nucleotide: {
    name: "Single Nucleotide",
    description: "Phosphate group + deoxyribose sugar + nitrogenous base",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      const theta = v * 2 * Math.PI;
      
      // Three components stacked vertically
      if (u < 0.33) {
        // Phosphate group (PO4, tetrahedral)
        const t = u / 0.33;
        const radius = 0.3 * scale * (1 - 0.5 * t);
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);
        const z = -scale + t * 0.5 * scale;
        return [x, y, z];
      } else if (u < 0.66) {
        // Deoxyribose sugar (5-carbon ring)
        const t = (u - 0.33) / 0.33;
        const pentagonAngle = v * 2 * Math.PI + t * 2 * Math.PI / 5;
        const radius = 0.4 * scale;
        const x = radius * Math.cos(pentagonAngle);
        const y = radius * Math.sin(pentagonAngle);
        const z = -0.5 * scale + t * 0.5 * scale;
        return [x, y, z];
      } else {
        // Nitrogenous base (hexagonal ring)
        const t = (u - 0.66) / 0.34;
        const hexagonAngle = v * 2 * Math.PI;
        const radius = 0.5 * scale;
        const x = radius * Math.cos(hexagonAngle);
        const y = radius * Math.sin(hexagonAngle);
        const z = t * scale;
        return [x, y, z];
      }
    },
    defaultParams: { 
      a: 1,
      uSegments: 64, vSegments: 32
    }
  },

  dna_supercoil: {
    name: "DNA Supercoiling",
    description: "Tertiary structure - DNA wound upon itself",
    equation: (u, v, params) => {
      const a = params.a ?? 1;        // Primary helix radius
      const b = params.b ?? 3.4;      // Primary pitch
      const c = params.c ?? 3;        // Supercoil radius
      const d = params.d ?? 0;
      const turns = params.e ?? 3;
      const superTurns = params.f ?? 1.5; // Number of supercoil turns
      
      // Primary helix angle
      const primaryAngle = u * turns * 2 * Math.PI + d * Math.PI;
      const height = u * turns * b;
      
      // Supercoil angle (helix of helices)
      const superAngle = u * superTurns * 2 * Math.PI;
      
      // Position on supercoil
      const superX = c * Math.cos(superAngle);
      const superY = c * Math.sin(superAngle);
      
      const isStrand1 = v < 0.5;
      const localV = (v % 0.5) * 2;
      
      if (isStrand1) {
        const x = superX + a * Math.cos(primaryAngle);
        const y = superY + a * Math.sin(primaryAngle);
        const z = height;
        
        const basePairExtension = localV * (a * 0.8);
        return [
          x - basePairExtension * Math.cos(primaryAngle),
          y - basePairExtension * Math.sin(primaryAngle),
          z
        ];
      } else {
        const oppositeAngle = primaryAngle + Math.PI;
        const x = superX + a * Math.cos(oppositeAngle);
        const y = superY + a * Math.sin(oppositeAngle);
        const z = height;
        
        const basePairExtension = localV * (a * 0.8);
        return [
          x - basePairExtension * Math.cos(oppositeAngle),
          y - basePairExtension * Math.sin(oppositeAngle),
          z
        ];
      }
    },
    defaultParams: { 
      a: 0.5, b: 3.4, c: 3, d: 0, e: 5, f: 1.5,
      uSegments: 192, vSegments: 64
    }
  },

  chromatin_fiber: {
    name: "Chromatin Fiber (DNA + Histones)",
    description: "DNA wrapped around histone octamers (nucleosomes)",
    equation: (u, v, params) => {
      const a = params.a ?? 1;        // Nucleosome radius
      const b = params.b ?? 2;        // Spacing between nucleosomes
      const turns = params.e ?? 5;    // Number of nucleosomes
      const d = params.d ?? 0;
      
      // Which nucleosome (discrete positions)
      const nucleosomeIndex = Math.floor(u * turns);
      const localU = (u * turns) % 1;
      
      const theta = v * 2 * Math.PI;
      
      // Position along the fiber
      const fiberZ = nucleosomeIndex * b;
      
      // DNA wraps 1.65 turns around each nucleosome
      const wrapAngle = localU * 1.65 * 2 * Math.PI + d * Math.PI;
      
      // Histone core (cylinder)
      const coreRadius = a * 0.6;
      const dnaRadius = a;
      
      if (v < 0.5) {
        // Histone core
        const r = coreRadius + (v * 2) * 0.2 * a;
        return [
          r * Math.cos(theta),
          r * Math.sin(theta),
          fiberZ + (localU - 0.5) * 0.5
        ];
      } else {
        // DNA wrapped around core
        const localV = (v - 0.5) * 2;
        return [
          dnaRadius * Math.cos(wrapAngle),
          dnaRadius * Math.sin(wrapAngle),
          fiberZ + localU * 0.6 - 0.3
        ];
      }
    },
    defaultParams: { 
      a: 1, b: 2, d: 0, e: 5,
      uSegments: 128, vSegments: 48
    }
  },

  // Simplified DNA for quick visualization
  dna_simple_helix: {
    name: "DNA Simple Helix (Fast Render)",
    description: "Simplified double helix for quick visualization",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 3.4;
      const turns = params.e ?? 3;
      const d = params.d ?? 0;
      
      const height = u * turns * b;
      const angle = u * turns * 2 * Math.PI + d * Math.PI;
      
      // Two intertwined helices
      const helixNum = Math.floor(v * 2);
      const offset = helixNum * Math.PI;
      
      const x = a * Math.cos(angle + offset);
      const y = a * Math.sin(angle + offset);
      const z = height;
      
      return [x, y, z];
    },
    defaultParams: { 
      a: 1, b: 3.4, d: 0, e: 3,
      uSegments: 128, vSegments: 2
    }
  },

  // ========================================
  // RNA STRUCTURES
  // ========================================

  rna_single_helix: {
    name: "RNA Single Helix (A-form)",
    description: "Single-stranded RNA in A-form helix configuration",
    equation: (u, v, params) => {
      const a = params.a ?? 0.9;       // Radius
      const b = params.b ?? 2.8;       // Pitch (A-form, shorter than B-DNA)
      const c = params.c ?? 0.12;      // Strand thickness
      const d = params.d ?? 0;
      const turns = params.e ?? 3;
      
      const height = u * turns * b;
      const angle = u * turns * 2 * Math.PI + d * Math.PI;
      
      // Single helix with tubular strand
      const tubeAngle = v * 2 * Math.PI;
      const centerX = a * Math.cos(angle);
      const centerY = a * Math.sin(angle);
      
      const x = centerX + c * Math.cos(tubeAngle) * Math.cos(angle);
      const y = centerY + c * Math.cos(tubeAngle) * Math.sin(angle);
      const z = height + c * Math.sin(tubeAngle);
      
      return [x, y, z];
    },
    defaultParams: { 
      a: 0.9, b: 2.8, c: 0.12, d: 0, e: 3,
      uSegments: 128, vSegments: 12
    }
  },

  trna_cloverleaf: {
    name: "tRNA (Transfer RNA) Cloverleaf",
    description: "Classic cloverleaf structure with acceptor stem and anticodon loop",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // u determines which part of the structure (0-1)
      // 4 major regions: acceptor stem, D-arm, anticodon arm, T-arm
      
      if (u < 0.25) {
        // Acceptor stem (vertical)
        const t = u / 0.25;
        const theta = v * 2 * Math.PI;
        const radius = 0.15 * scale;
        return [
          radius * Math.cos(theta),
          radius * Math.sin(theta),
          t * 2 * scale
        ];
      } else if (u < 0.5) {
        // D-arm (left loop)
        const t = (u - 0.25) / 0.25;
        const angle = Math.PI + t * Math.PI;
        const loopRadius = 0.6 * scale;
        const theta = v * 2 * Math.PI;
        const tubeRadius = 0.12 * scale;
        return [
          -loopRadius * Math.cos(angle) + tubeRadius * Math.cos(theta),
          loopRadius * Math.sin(angle) + tubeRadius * Math.sin(theta),
          1.2 * scale
        ];
      } else if (u < 0.75) {
        // Anticodon arm (bottom loop)
        const t = (u - 0.5) / 0.25;
        const angle = t * Math.PI;
        const loopRadius = 0.7 * scale;
        const theta = v * 2 * Math.PI;
        const tubeRadius = 0.12 * scale;
        return [
          loopRadius * Math.cos(angle) + tubeRadius * Math.cos(theta),
          loopRadius * Math.sin(angle) + tubeRadius * Math.sin(theta),
          0.3 * scale
        ];
      } else {
        // T-arm (right loop)
        const t = (u - 0.75) / 0.25;
        const angle = t * Math.PI;
        const loopRadius = 0.6 * scale;
        const theta = v * 2 * Math.PI;
        const tubeRadius = 0.12 * scale;
        return [
          loopRadius * Math.cos(angle) + tubeRadius * Math.cos(theta),
          -loopRadius * Math.sin(angle) + tubeRadius * Math.sin(theta),
          1.2 * scale
        ];
      }
    },
    defaultParams: { 
      a: 1,
      uSegments: 128, vSegments: 12
    }
  },

  mrna_strand: {
    name: "mRNA (Messenger RNA)",
    description: "Single-stranded messenger RNA with codon regions",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 5;        // Length
      const c = params.c ?? 0.15;     // Strand thickness
      const d = params.d ?? 0;
      
      // Meandering single strand (not perfectly straight)
      const x = u * b;
      const meander = 0.3 * Math.sin(u * 8 * Math.PI + d * Math.PI);
      
      const tubeAngle = v * 2 * Math.PI;
      const y = meander + c * Math.cos(tubeAngle);
      const z = c * Math.sin(tubeAngle);
      
      return [x, y, z];
    },
    defaultParams: { 
      a: 1, b: 5, c: 0.15, d: 0,
      uSegments: 96, vSegments: 12
    }
  },

  rrna_complex: {
    name: "rRNA (Ribosomal RNA)",
    description: "Complex folded ribosomal RNA structure",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Complex folded structure with multiple loops
      const mainAngle = u * 6 * Math.PI;
      const radius = scale * (0.5 + 0.3 * Math.sin(u * 12 * Math.PI));
      
      const x = radius * Math.cos(mainAngle);
      const y = radius * Math.sin(mainAngle);
      const z = scale * Math.sin(u * 8 * Math.PI);
      
      // Add tube thickness
      const tubeAngle = v * 2 * Math.PI;
      const tubeRadius = 0.1 * scale;
      
      return [
        x + tubeRadius * Math.cos(tubeAngle) * Math.cos(mainAngle),
        y + tubeRadius * Math.cos(tubeAngle) * Math.sin(mainAngle),
        z + tubeRadius * Math.sin(tubeAngle)
      ];
    },
    defaultParams: { 
      a: 1,
      uSegments: 192, vSegments: 12
    }
  },

  microrna: {
    name: "microRNA",
    description: "Small regulatory RNA (~22 nucleotides)",
    equation: (u, v, params) => {
      const a = params.a ?? 0.5;
      const scale = a;
      
      // Short hairpin structure
      const stemLength = 0.3;
      const loopRadius = 0.3 * scale;
      
      if (u < stemLength) {
        // Stem region (short helix)
        const t = u / stemLength;
        const angle = t * Math.PI;
        const theta = v * 2 * Math.PI;
        const radius = 0.1 * scale;
        return [
          radius * Math.cos(theta),
          radius * Math.sin(theta),
          t * scale
        ];
      } else if (u < 0.7) {
        // Loop region
        const t = (u - stemLength) / (0.7 - stemLength);
        const angle = t * Math.PI;
        const theta = v * 2 * Math.PI;
        const tubeRadius = 0.08 * scale;
        return [
          loopRadius * Math.cos(angle) + tubeRadius * Math.cos(theta),
          loopRadius * Math.sin(angle) + tubeRadius * Math.sin(theta),
          scale + tubeRadius * 0.5
        ];
      } else {
        // Return stem
        const t = (u - 0.7) / 0.3;
        const angle = Math.PI + t * Math.PI;
        const theta = v * 2 * Math.PI;
        const radius = 0.1 * scale;
        return [
          radius * Math.cos(theta),
          radius * Math.sin(theta),
          (1 - t) * scale
        ];
      }
    },
    defaultParams: { 
      a: 0.5,
      uSegments: 64, vSegments: 12
    }
  },

  // ========================================
  // CHROMOSOMAL STRUCTURES
  // ========================================

  metaphase_chromosome: {
    name: "Metaphase Chromosome (X-shape)",
    description: "Condensed chromosome with sister chromatids joined at centromere",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Two sister chromatids forming X-shape
      const chromatidNum = Math.floor(v * 2);
      const localV = (v * 2) % 1;
      
      // Each chromatid is a tapered cylinder
      const armLength = scale * 2;
      
      if (chromatidNum === 0) {
        // First chromatid
        if (u < 0.5) {
          // Upper arm
          const t = u / 0.5;
          const radius = 0.2 * scale * (1 - 0.5 * t);
          const theta = localV * 2 * Math.PI;
          return [
            radius * Math.cos(theta) - 0.1 * scale,
            radius * Math.sin(theta),
            t * armLength
          ];
        } else {
          // Lower arm
          const t = (u - 0.5) / 0.5;
          const radius = 0.2 * scale * (1 - 0.5 * t);
          const theta = localV * 2 * Math.PI;
          return [
            radius * Math.cos(theta) - 0.1 * scale,
            radius * Math.sin(theta),
            -t * armLength
          ];
        }
      } else {
        // Second chromatid (mirror)
        if (u < 0.5) {
          const t = u / 0.5;
          const radius = 0.2 * scale * (1 - 0.5 * t);
          const theta = localV * 2 * Math.PI;
          return [
            radius * Math.cos(theta) + 0.1 * scale,
            radius * Math.sin(theta),
            t * armLength
          ];
        } else {
          const t = (u - 0.5) / 0.5;
          const radius = 0.2 * scale * (1 - 0.5 * t);
          const theta = localV * 2 * Math.PI;
          return [
            radius * Math.cos(theta) + 0.1 * scale,
            radius * Math.sin(theta),
            -t * armLength
          ];
        }
      }
    },
    defaultParams: { 
      a: 1,
      uSegments: 64, vSegments: 24
    }
  },

  telomere: {
    name: "Telomere (Chromosome Cap)",
    description: "Repetitive DNA sequences (TTAGGG) forming protective cap",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 2;        // Length
      const d = params.d ?? 0;
      
      // Tightly packed loops at chromosome end
      const numLoops = 6;
      const loopIndex = Math.floor(u * numLoops);
      const localU = (u * numLoops) % 1;
      
      const angle = localU * 2 * Math.PI + d * Math.PI;
      const loopRadius = 0.3 * a;
      const spacing = b / numLoops;
      
      const x = loopRadius * Math.cos(angle);
      const y = loopRadius * Math.sin(angle);
      const z = loopIndex * spacing;
      
      // Add strand thickness
      const tubeAngle = v * 2 * Math.PI;
      const tubeRadius = 0.08 * a;
      
      return [
        x + tubeRadius * Math.cos(tubeAngle) * Math.cos(angle),
        y + tubeRadius * Math.cos(tubeAngle) * Math.sin(angle),
        z + tubeRadius * Math.sin(tubeAngle)
      ];
    },
    defaultParams: { 
      a: 1, b: 2, d: 0,
      uSegments: 128, vSegments: 12
    }
  },

  centromere: {
    name: "Centromere",
    description: "Constricted region where sister chromatids join",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Constricted cylinder with kinetochore proteins
      const theta = v * 2 * Math.PI;
      const z = (u - 0.5) * 2 * scale;
      
      // Radius varies (narrow in middle)
      const radius = scale * 0.3 * (1 + 0.5 * Math.abs(u - 0.5) / 0.5);
      
      // Add kinetochore bumps
      const bumps = 0.1 * scale * Math.sin(v * 8 * 2 * Math.PI) * (1 - 2 * Math.abs(u - 0.5));
      
      return [
        (radius + bumps) * Math.cos(theta),
        (radius + bumps) * Math.sin(theta),
        z
      ];
    },
    defaultParams: { 
      a: 1,
      uSegments: 64, vSegments: 32
    }
  },

  // ========================================
  // DNA/RNA MACHINERY
  // ========================================

  replication_fork: {
    name: "DNA Replication Fork",
    description: "Y-shaped structure where DNA unwinds and replicates",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Three branches: parent DNA and two daughter strands
      if (u < 0.33) {
        // Parent double helix (unreplicated)
        const t = u / 0.33;
        const angle = t * 2 * Math.PI;
        const strandNum = Math.floor(v * 2);
        const offset = strandNum * Math.PI;
        
        const radius = 0.3 * scale;
        return [
          radius * Math.cos(angle + offset),
          radius * Math.sin(angle + offset) - scale,
          t * scale
        ];
      } else {
        // Daughter strands (branching)
        const branchNum = Math.floor((v * 2) % 2);
        const t = (u - 0.33) / 0.67;
        const angle = t * 2 * Math.PI;
        
        const xOffset = branchNum === 0 ? -0.5 * scale : 0.5 * scale;
        const radius = 0.25 * scale;
        
        return [
          radius * Math.cos(angle) + xOffset * t,
          radius * Math.sin(angle),
          scale + t * scale
        ];
      }
    },
    defaultParams: { 
      a: 1,
      uSegments: 96, vSegments: 16
    }
  },

  transcription_bubble: {
    name: "Transcription Bubble",
    description: "Unwound DNA region during RNA synthesis",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // DNA with unwound bubble region
      const angle = u * 4 * Math.PI;
      
      // Radius varies (larger in bubble region)
      let radius = 0.3 * scale;
      if (u > 0.3 && u < 0.7) {
        // Bubble region - unwound
        const bubbleT = (u - 0.3) / 0.4;
        radius = 0.6 * scale * (1 + 0.5 * Math.sin(bubbleT * Math.PI));
      }
      
      const strandNum = Math.floor(v * 2);
      const offset = strandNum * Math.PI;
      
      const x = radius * Math.cos(angle + offset);
      const y = radius * Math.sin(angle + offset);
      const z = u * 4 * scale;
      
      return [x, y, z];
    },
    defaultParams: { 
      a: 1,
      uSegments: 128, vSegments: 8
    }
  },

  rna_polymerase: {
    name: "RNA Polymerase Complex",
    description: "Enzyme that transcribes DNA to RNA",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Large protein complex (roughly spherical with cleft)
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const sinPhi = Math.sin(phi);
      let radius = scale * sinPhi;
      
      // Active site cleft
      const cleftDepth = 0.3 * scale * Math.sin(4 * theta) * Math.sin(2 * phi);
      radius -= cleftDepth;
      
      return [
        radius * Math.cos(theta),
        radius * Math.sin(theta),
        scale * Math.cos(phi)
      ];
    },
    defaultParams: { 
      a: 1,
      uSegments: 64, vSegments: 48
    }
  },

  spliceosome: {
    name: "Spliceosome",
    description: "RNA splicing machinery complex",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Multi-protein complex with RNA components
      const numSubunits = 5;
      const subunitIndex = Math.floor(u * numSubunits);
      const localU = (u * numSubunits) % 1;
      
      const ringAngle = (subunitIndex / numSubunits) * 2 * Math.PI;
      const ringRadius = scale * 0.8;
      
      // Each subunit is a small sphere
      const theta = localU * 2 * Math.PI;
      const phi = v * Math.PI;
      const subunitRadius = 0.3 * scale;
      
      const centerX = ringRadius * Math.cos(ringAngle);
      const centerY = ringRadius * Math.sin(ringAngle);
      
      return [
        centerX + subunitRadius * Math.sin(phi) * Math.cos(theta),
        centerY + subunitRadius * Math.sin(phi) * Math.sin(theta),
        subunitRadius * Math.cos(phi)
      ];
    },
    defaultParams: { 
      a: 1,
      uSegments: 80, vSegments: 40
    }
  },

  // ========================================
  // GENETIC ELEMENTS
  // ========================================

  plasmid: {
    name: "Plasmid (Circular DNA)",
    description: "Small circular DNA molecule in bacteria",
    equation: (u, v, params) => {
      const a = params.a ?? 1;        // Ring radius
      const b = params.b ?? 0.15;     // DNA strand thickness
      const d = params.d ?? 0;
      const supercoiling = params.c ?? 0.2;  // Amount of supercoiling
      
      // Circular DNA with supercoiling twist
      const mainAngle = u * 2 * Math.PI;
      const twistAngle = u * 12 * 2 * Math.PI + d * Math.PI;
      
      // Base circle
      const radius = a + supercoiling * Math.sin(u * 20 * 2 * Math.PI);
      const x = radius * Math.cos(mainAngle);
      const y = radius * Math.sin(mainAngle);
      
      // Double helix around the circle
      const strandNum = Math.floor(v * 2);
      const offset = strandNum * Math.PI;
      const helixRadius = b;
      
      const dx = helixRadius * Math.cos(twistAngle + offset) * Math.cos(mainAngle + Math.PI/2);
      const dy = helixRadius * Math.cos(twistAngle + offset) * Math.sin(mainAngle + Math.PI/2);
      const dz = helixRadius * Math.sin(twistAngle + offset);
      
      return [x + dx, y + dy, dz];
    },
    defaultParams: { 
      a: 1, b: 0.15, c: 0.2, d: 0,
      uSegments: 128, vSegments: 8
    }
  },

  viral_capsid_dna: {
    name: "Viral Capsid with DNA",
    description: "Icosahedral virus capsid containing genetic material",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Outer icosahedral capsid
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // Approximate icosahedron with modified sphere
      const sinPhi = Math.sin(phi);
      let radius = scale * sinPhi;
      
      // Icosahedral facets
      const facets = 0.1 * scale * (
        Math.abs(Math.sin(5 * theta) * Math.sin(5 * phi))
      );
      radius -= facets;
      
      // Inner DNA (if v < 0.3, show packaged DNA)
      if (v < 0.3) {
        const innerRadius = 0.7 * scale * (v / 0.3);
        return [
          innerRadius * Math.cos(theta) * sinPhi,
          innerRadius * Math.sin(theta) * sinPhi,
          innerRadius * Math.cos(phi)
        ];
      }
      
      return [
        radius * Math.cos(theta),
        radius * Math.sin(theta),
        scale * Math.cos(phi)
      ];
    },
    defaultParams: { 
      a: 1,
      uSegments: 80, vSegments: 60
    }
  },

  crispr_cas9: {
    name: "CRISPR-Cas9 Complex",
    description: "Gene editing machinery with guide RNA and target DNA",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Cas9 protein (bilobed structure)
      if (u < 0.5) {
        // Recognition lobe
        const t = u / 0.5;
        const theta = t * 2 * Math.PI;
        const phi = v * Math.PI;
        const radius = 0.8 * scale * Math.sin(phi);
        
        return [
          radius * Math.cos(theta) - 0.5 * scale,
          radius * Math.sin(theta),
          0.8 * scale * Math.cos(phi)
        ];
      } else {
        // Nuclease lobe
        const t = (u - 0.5) / 0.5;
        const theta = t * 2 * Math.PI;
        const phi = v * Math.PI;
        const radius = 0.7 * scale * Math.sin(phi);
        
        return [
          radius * Math.cos(theta) + 0.5 * scale,
          radius * Math.sin(theta),
          0.7 * scale * Math.cos(phi)
        ];
      }
    },
    defaultParams: { 
      a: 1,
      uSegments: 96, vSegments: 72
    }
  },

  histone_octamer: {
    name: "Histone Octamer Core",
    description: "8 histone proteins forming nucleosome core",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // 8 proteins arranged as disc
      const proteinIndex = Math.floor(u * 8);
      const localU = (u * 8) % 1;
      
      const ringAngle = (proteinIndex / 8) * 2 * Math.PI;
      const ringRadius = 0.7 * scale;
      
      // Each histone is a small ellipsoid
      const theta = localU * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const proteinRadiusXY = 0.25 * scale;
      const proteinRadiusZ = 0.4 * scale;
      
      const centerX = ringRadius * Math.cos(ringAngle);
      const centerY = ringRadius * Math.sin(ringAngle);
      
      return [
        centerX + proteinRadiusXY * Math.sin(phi) * Math.cos(theta),
        centerY + proteinRadiusXY * Math.sin(phi) * Math.sin(theta),
        proteinRadiusZ * Math.cos(phi)
      ];
    },
    defaultParams: { 
      a: 1,
      uSegments: 128, vSegments: 48
    }
  },

  g_quadruplex: {
    name: "G-Quadruplex DNA",
    description: "Four-stranded DNA structure (guanine-rich sequences)",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 2;        // Height
      const scale = a;
      
      // Four parallel or antiparallel strands
      const strandNum = Math.floor(v * 4);
      const localV = (v * 4) % 1;
      
      // Position of each strand in square arrangement
      const positions = [
        [scale * 0.4, scale * 0.4],
        [scale * 0.4, -scale * 0.4],
        [-scale * 0.4, -scale * 0.4],
        [-scale * 0.4, scale * 0.4]
      ];
      
      const [xOffset, yOffset] = positions[strandNum];
      
      // Vertical strand with slight twist
      const height = u * b;
      const twist = 0.1 * Math.sin(u * 4 * Math.PI);
      
      const tubeAngle = localV * 2 * Math.PI;
      const tubeRadius = 0.12 * scale;
      
      return [
        xOffset + twist + tubeRadius * Math.cos(tubeAngle),
        yOffset + tubeRadius * Math.sin(tubeAngle),
        height
      ];
    },
    defaultParams: { 
      a: 1, b: 2,
      uSegments: 64, vSegments: 32
    }
  },

  dna_helix_detailed: {
    name: "DNA Helix Detailed (Discrete Base Pairs)",
    description: "DNA double helix with discrete base pair positioning for A, T, C, G identification",
    equation: (u, v, params) => {
      const a = params.a ?? 1;        // Helix radius
      const b = params.b ?? Math.PI;  // Pitch (height per complete turn) - Using π for mathematical elegance
      const c = params.c ?? 0.15;     // Tube radius for backbone
      const d = params.d ?? 0;        // Animation/rotation parameter
      const basePairsPerTurn = 10.5;  // Scientific: ~10.5 base pairs per turn
      const totalBasePairs = params.e ?? 30;  // Total number of base pairs to display
      
      // DISCRETE BASE PAIR POSITIONING
      const basePairIndex = Math.floor(u * totalBasePairs);
      const basePairFraction = basePairIndex / totalBasePairs;
      
      const turnNumber = basePairIndex / basePairsPerTurn;
      const anglePerBasePair = (2 * Math.PI) / basePairsPerTurn;
      const helixAngle = basePairIndex * anglePerBasePair + d * Math.PI;
      const height = basePairFraction * (totalBasePairs / basePairsPerTurn) * b;
      
      if (v < 0.25) {
        // STRAND 1 BACKBONE
        const tubeAngle = (v / 0.25) * 2 * Math.PI;
        const centerX = a * Math.cos(helixAngle);
        const centerY = a * Math.sin(helixAngle);
        
        return [
          centerX + c * Math.cos(tubeAngle) * Math.cos(helixAngle),
          centerY + c * Math.cos(tubeAngle) * Math.sin(helixAngle),
          height + c * Math.sin(tubeAngle)
        ];
      } else if (v < 0.5) {
        // BASE PAIR CONNECTION
        const t = (v - 0.25) / 0.25;
        const x1 = a * Math.cos(helixAngle);
        const y1 = a * Math.sin(helixAngle);
        const x2 = a * Math.cos(helixAngle + Math.PI);
        const y2 = a * Math.sin(helixAngle + Math.PI);
        
        const x = x1 + (x2 - x1) * t;
        const y = y1 + (y2 - y1) * t;
        
        const baseTypes = ['A', 'T', 'G', 'C'];
        const baseType = baseTypes[basePairIndex % 4];
        const basePairThickness = baseType === 'G' || baseType === 'C' ? 0.05 : 0.03;
        
        return [x, y, height + basePairThickness * Math.sin(t * Math.PI)];
      } else if (v < 0.75) {
        // STRAND 2 BACKBONE
        const tubeAngle = ((v - 0.5) / 0.25) * 2 * Math.PI;
        const oppositeAngle = helixAngle + Math.PI;
        const centerX = a * Math.cos(oppositeAngle);
        const centerY = a * Math.sin(oppositeAngle);
        
        return [
          centerX + c * Math.cos(tubeAngle) * Math.cos(oppositeAngle),
          centerY + c * Math.cos(tubeAngle) * Math.sin(oppositeAngle),
          height + c * Math.sin(tubeAngle)
        ];
      } else {
        // BASE PAIR MARKERS
        const t = (v - 0.75) / 0.25;
        const markerRadius = 0.08;
        const markerAngle = t * 2 * Math.PI;
        
        const centerX = a * 0.5 * Math.cos(helixAngle + Math.PI * 0.5);
        const centerY = a * 0.5 * Math.sin(helixAngle + Math.PI * 0.5);
        
        return [
          centerX + markerRadius * Math.cos(markerAngle),
          centerY + markerRadius * Math.sin(markerAngle),
          height
        ];
      }
    },
    defaultParams: { 
      a: 1, b: 3.4, c: 0.12, d: 0, e: 30,
      uSegments: 120, vSegments: 64
    }
  },

  protein_alpha_helix: {
    name: "Protein α-Helix (Peptide Folding)",
    description: "Right-handed α-helix with 3.6 residues per turn, based on DNA helical template",
    equation: (u, v, params) => {
      const a = params.a ?? 1;          // Helix radius (Scientific: ~0.23 nm)
      const b = params.b ?? 0.54;       // Pitch per residue (Scientific: 0.54 nm rise per residue)
      const c = params.c ?? 0.08;       // Tube radius for backbone
      const residuesPerTurn = 3.6;      // Scientific: 3.6 amino acids per turn
      const totalResidues = params.e ?? 20;
      
      const residueIndex = Math.floor(u * totalResidues);
      const residueFraction = residueIndex / totalResidues;
      const anglePerResidue = (2 * Math.PI) / residuesPerTurn;
      const helixAngle = residueIndex * anglePerResidue;
      const height = residueFraction * totalResidues * b;
      
      // Torsion angles (ψ, φ) for α-helix: φ = -60°, ψ = -45°
      const phi = -60 * Math.PI / 180;
      const psi = -45 * Math.PI / 180;
      
      const tubeAngle = v * 2 * Math.PI;
      const centerX = a * Math.cos(helixAngle);
      const centerY = a * Math.sin(helixAngle);
      
      return [
        centerX + c * Math.cos(tubeAngle),
        centerY + c * Math.sin(tubeAngle),
        height
      ];
    },
    defaultParams: { 
      a: 1, b: 0.54, c: 0.08, e: 20,
      uSegments: 80, vSegments: 16
    }
  },

  protein_beta_sheet: {
    name: "Protein β-Sheet (Extended Conformation)",
    description: "Extended β-strand forming pleated sheet structure",
    equation: (u, v, params) => {
      const a = params.a ?? 1;          // Sheet width
      const b = params.b ?? 0.35;       // Residue spacing (Scientific: 0.35 nm between residues)
      const c = params.c ?? 0.2;        // Pleating amplitude
      const strands = params.e ?? 4;    // Number of parallel strands
      
      const strandIndex = Math.floor(v * strands);
      const localV = (v * strands) % 1;
      const strandOffset = (strandIndex - strands / 2) * 0.5;
      
      // Pleating creates up-down pattern
      const pleatPhase = Math.sin(u * Math.PI * 10);
      
      return [
        u * a * 2 - a,
        strandOffset + localV * 0.1,
        pleatPhase * c
      ];
    },
    defaultParams: { 
      a: 1, b: 0.35, c: 0.2, e: 4,
      uSegments: 64, vSegments: 32
    }
  },

  chromatin_superhelix: {
    name: "Chromatin Fiber (Nested Super-Helix)",
    description: "30nm chromatin fiber - DNA wrapped around nucleosomes in super-helical arrangement",
    equation: (u, v, params) => {
      const a = params.a ?? 1;          // Primary helix radius
      const b = params.b ?? 3.4;        // Primary pitch
      const nucleosomeSpacing = 6;      // Nucleosomes per turn
      const phi = 1.618033988749895;    // Golden ratio for geometric progression
      
      // Primary helix (DNA)
      const primaryAngle = u * 2 * Math.PI * 3;
      const primaryHeight = u * b * 3;
      
      // Secondary helix (nucleosome wrapping)
      const nucleosomeAngle = v * 2 * Math.PI;
      const nucleosomeRadius = a * 0.3;
      
      // Tertiary modulation (chromatin compaction)
      const superHelixPhase = Math.sin(u * nucleosomeSpacing * Math.PI);
      const compactionRadius = a * (1 + superHelixPhase * 0.2);
      
      const x = compactionRadius * Math.cos(primaryAngle) + nucleosomeRadius * Math.cos(nucleosomeAngle);
      const y = compactionRadius * Math.sin(primaryAngle) + nucleosomeRadius * Math.sin(nucleosomeAngle);
      const z = primaryHeight;
      
      return [x, y, z];
    },
    defaultParams: { 
      a: 1, b: 3.4,
      uSegments: 128, vSegments: 32
    }
  },

  carbon_nanotube: {
    name: "Carbon Nanotube (Chiral Lattice)",
    description: "Carbon nanotube with helical symmetry based on DNA pitch-radius ratio",
    equation: (u, v, params) => {
      const a = params.a ?? 1;          // Tube radius (Scientific: 0.7-2 nm)
      const b = params.b ?? 0.34;       // Lattice spacing (Scientific: 0.34 nm graphene layer spacing)
      const chirality = params.e ?? 5;  // Chiral index (n,m) - here simplified to n
      
      // Helical pattern based on chirality
      const helixAngle = u * 2 * Math.PI * chirality;
      const height = u * b * 10;
      
      // Hexagonal lattice pattern on surface
      const latticePattern = Math.sin(v * Math.PI * 6) * Math.cos(u * Math.PI * 12) * 0.05;
      
      const tubeAngle = v * 2 * Math.PI;
      const effectiveRadius = a + latticePattern;
      
      return [
        effectiveRadius * Math.cos(tubeAngle + helixAngle * 0.1),
        effectiveRadius * Math.sin(tubeAngle + helixAngle * 0.1),
        height
      ];
    },
    defaultParams: { 
      a: 1, b: 0.34, e: 5,
      uSegments: 96, vSegments: 48
    }
  },

  microtubule_structure: {
    name: "Microtubule (13-Protofilament)",
    description: "Cellular microtubule with 13 protofilaments in helical arrangement",
    equation: (u, v, params) => {
      const a = params.a ?? 1;          // Outer radius (Scientific: ~12 nm outer diameter)
      const b = params.b ?? 0.8;        // Pitch
      const protofilaments = 13;        // Scientific: typically 13 protofilaments
      const tubulinSpacing = 0.08;      // Spacing between tubulin dimers
      
      // Which protofilament (0-12)
      const protoIndex = Math.floor(v * protofilaments);
      const protoAngle = (protoIndex / protofilaments) * 2 * Math.PI;
      
      // Helical twist (slight)
      const helicalTwist = u * 0.1 * Math.PI;
      const height = u * b * 3;
      
      // Tubulin dimer pattern
      const dimerPattern = Math.sin(u * Math.PI * 20) * tubulinSpacing;
      
      const effectiveAngle = protoAngle + helicalTwist;
      
      return [
        a * Math.cos(effectiveAngle) + dimerPattern * Math.cos(effectiveAngle),
        a * Math.sin(effectiveAngle) + dimerPattern * Math.sin(effectiveAngle),
        height
      ];
    },
    defaultParams: { 
      a: 1, b: 0.8,
      uSegments: 104, vSegments: 52
    }
  },

  morphogenetic_spiral: {
    name: "Tissue Morphogenesis (Growth Spiral)",
    description: "Differential growth on helical surface - models organ folding",
    equation: (u, v, params) => {
      const a = params.a ?? 1;          // Base radius
      const b = params.b ?? 3.4;        // Growth axis length
      const phi = 1.618033988749895;    // Golden ratio for growth
      
      // DNA helix as growth substrate
      const helixAngle = u * 2 * Math.PI * 2;
      const baseHeight = u * b;
      
      // Growth vectors normal to helix surface
      const growthRate = phi * u;  // Proportional to φ
      const normalAngle = v * 2 * Math.PI;
      const growthRadius = a * (1 + growthRate * 0.5);
      
      // Folding modulation
      const foldingWave = Math.sin(u * Math.PI * 4) * 0.2;
      
      return [
        growthRadius * Math.cos(helixAngle) * (1 + foldingWave),
        growthRadius * Math.sin(helixAngle) * (1 + foldingWave),
        baseHeight + foldingWave * growthRadius
      ];
    },
    defaultParams: { 
      a: 1, b: 3.4,
      uSegments: 96, vSegments: 48
    }
  },

  neural_pathway_helix: {
    name: "Neural Pathway (Stochastic Branching)",
    description: "Neuron axon with helical backbone and fractal branching",
    equation: (u, v, params) => {
      const a = params.a ?? 1;          // Backbone radius
      const b = params.b ?? 3;          // Path length
      const branchDensity = params.e ?? 8;
      
      // Helical backbone
      const helixAngle = u * 2 * Math.PI * 1.5;
      const pathLength = u * b;
      
      // Stochastic modulation (±ε around parameters)
      const epsilon = 0.1;
      const stochasticX = Math.sin(u * 17.3 + v * 23.1) * epsilon;
      const stochasticY = Math.cos(u * 19.7 + v * 29.3) * epsilon;
      
      // Branch points
      const branchPhase = Math.sin(u * branchDensity * Math.PI);
      const branchRadius = branchPhase > 0.8 ? a * 1.5 : a;
      
      const tubeAngle = v * 2 * Math.PI;
      
      return [
        (branchRadius + stochasticX) * Math.cos(helixAngle) + 0.1 * Math.cos(tubeAngle),
        (branchRadius + stochasticY) * Math.sin(helixAngle) + 0.1 * Math.sin(tubeAngle),
        pathLength
      ];
    },
    defaultParams: { 
      a: 1, b: 3, e: 8,
      uSegments: 128, vSegments: 16
    }
  },

  magnetic_field_helix: {
    name: "Magnetic Field Lines (Cosmic Helix)",
    description: "Helical magnetic field streamlines following φ/π ratios",
    equation: (u, v, params) => {
      const a = params.a ?? 1;          // Field radius
      const b = params.b ?? 3.4;        // Field pitch
      const phi = 1.618033988749895;
      const pi = Math.PI;
      
      // Field line as helical streamline
      const fieldAngle = u * 2 * pi * phi;  // Golden ratio rotation
      const fieldHeight = u * b * 2;
      
      // Field intensity modulation
      const intensity = 1 + Math.sin(u * pi * 4) * 0.3;
      
      // Multiple field lines at different v
      const lineAngle = v * 2 * pi;
      const lineRadius = a * 0.2;
      
      const centerX = a * intensity * Math.cos(fieldAngle);
      const centerY = a * intensity * Math.sin(fieldAngle);
      
      return [
        centerX + lineRadius * Math.cos(lineAngle),
        centerY + lineRadius * Math.sin(lineAngle),
        fieldHeight
      ];
    },
    defaultParams: { 
      a: 1, b: 3.4,
      uSegments: 128, vSegments: 24
    }
  },

  information_helix: {
    name: "Information Encoding (Data Helix)",
    description: "Binary/probabilistic data mapped onto helical topology",
    equation: (u, v, params) => {
      const a = params.a ?? 1;          // Encoding radius
      const b = params.b ?? 3.4;        // Data pitch
      const dataDensity = params.e ?? 16;  // Bits per turn
      
      // Helical path for data encoding
      const dataAngle = u * 2 * Math.PI * 2;
      const dataHeight = u * b * 2;
      
      // Binary encoding (0 or 1) affects radius
      const bitIndex = Math.floor(u * dataDensity);
      const bitValue = ((bitIndex * 7 + bitIndex * 11) % 2); // Pseudo-random binary
      const encodingRadius = a * (1 + bitValue * 0.3);
      
      // Twist represents phase/entropy
      const entropyTwist = Math.sin(bitIndex * 2.5) * 0.1;
      
      const tubeAngle = v * 2 * Math.PI;
      const tubeRadius = 0.1;
      
      return [
        encodingRadius * Math.cos(dataAngle + entropyTwist) + tubeRadius * Math.cos(tubeAngle),
        encodingRadius * Math.sin(dataAngle + entropyTwist) + tubeRadius * Math.sin(tubeAngle),
        dataHeight
      ];
    },
    defaultParams: { 
      a: 1, b: 3.4, e: 16,
      uSegments: 96, vSegments: 16
    }
  },

  structural_helix: {
    name: "Architectural Double Helix (Load-Bearing)",
    description: "DNA-inspired structural design with optimal stress distribution",
    equation: (u, v, params) => {
      const a = params.a ?? 1;          // Structural radius
      const b = params.b ?? 3.4;        // Structural pitch
      const c = params.c ?? 0.2;        // Beam thickness
      
      // Double helix for load-bearing
      const helixAngle = u * 2 * Math.PI * 3;
      const structHeight = u * b * 3;
      
      // Two strands (v < 0.5 = strand 1, v >= 0.5 = strand 2)
      const isSecondStrand = v > 0.5;
      const localV = isSecondStrand ? (v - 0.5) * 2 : v * 2;
      const strandAngleOffset = isSecondStrand ? Math.PI : 0;
      
      // Cross-bracing (base pairs as structural connections)
      const crossBracing = Math.abs(Math.sin(u * 12 * Math.PI)) < 0.1;
      const effectiveRadius = crossBracing ? a * localV : a;
      
      const tubeAngle = localV * 2 * Math.PI;
      
      return [
        effectiveRadius * Math.cos(helixAngle + strandAngleOffset) + c * Math.cos(tubeAngle),
        effectiveRadius * Math.sin(helixAngle + strandAngleOffset) + c * Math.sin(tubeAngle),
        structHeight
      ];
    },
    defaultParams: { 
      a: 1, b: 3.4, c: 0.2,
      uSegments: 144, vSegments: 24
    }
  },

  electromagnetic_helix: {
    name: "EM Wave Polarization (Helical Field)",
    description: "Circularly polarized electromagnetic wave with helical phase rotation",
    equation: (u, v, params) => {
      const a = params.a ?? 1;          // Wave amplitude
      const b = params.b ?? 2 * Math.PI;  // Wavelength (2π for one full rotation)
      const c = params.c ?? 0.1;        // Field thickness
      
      // Wave propagation along z-axis
      const z = u * b * 2;
      const phase = u * 2 * Math.PI * 2;
      
      // E-field vector rotates in x-y plane
      const Ex = a * Math.cos(phase);
      const Ey = a * Math.sin(phase);
      
      // Circular cross-section for field visualization
      const fieldAngle = v * 2 * Math.PI;
      const fieldRadius = c;
      
      return [
        Ex + fieldRadius * Math.cos(fieldAngle),
        Ey + fieldRadius * Math.sin(fieldAngle),
        z
      ];
    },
    defaultParams: { 
      a: 1, b: 2 * Math.PI, c: 0.1,
      uSegments: 128, vSegments: 16
    }
  },

  // ========================================
  // ADVANCED NON-B DNA STRUCTURES
  // Cancer/Aging Research & Nanotechnology
  // ========================================

  h_dna_triplex: {
    name: "H-DNA Triple Helix",
    description: "Three-stranded DNA at mirror repeat sequences, ~2.2nm diameter - linked to cancer and aging",
    equation: (u, v, params) => {
      const a = params.a ?? 1;          // Helix radius
      const b = params.b ?? 2.2;        // Pitch (shorter than B-DNA)
      const turns = params.e ?? 3;
      
      const height = u * turns * b;
      const angle = u * turns * 2 * Math.PI;
      
      // Three strands (v divides into thirds)
      const strandNum = Math.floor(v * 3);
      const localV = (v * 3) % 1;
      const strandOffset = (strandNum / 3) * 2 * Math.PI;
      
      // Third strand binds in major groove via Hoogsteen base pairing
      const radius = strandNum === 2 ? a * 0.6 : a; // Third strand closer to axis
      
      const tubeAngle = localV * 2 * Math.PI;
      const tubeRadius = 0.1;
      
      const centerX = radius * Math.cos(angle + strandOffset);
      const centerY = radius * Math.sin(angle + strandOffset);
      
      return [
        centerX + tubeRadius * Math.cos(tubeAngle),
        centerY + tubeRadius * Math.sin(tubeAngle),
        height
      ];
    },
    defaultParams: { 
      a: 1, b: 2.2, e: 3,
      uSegments: 128, vSegments: 24
    }
  },

  i_motif_dna: {
    name: "i-Motif DNA (Cytosine-Rich)",
    description: "Four-stranded cytosine-rich structure at pH 6.0, ~1.5nm width - occurs in telomeres/promoters",
    equation: (u, v, params) => {
      const a = params.a ?? 0.75;       // Narrower structure
      const b = params.b ?? 1.5;        // Height
      const scale = a;
      
      // Four strands in intercalated arrangement
      const strandNum = Math.floor(v * 4);
      const localV = (v * 4) % 1;
      
      // Intercalated C-C+ base pairs create unique geometry
      const intercalationPhase = (strandNum % 2) * 0.5;
      
      // Position of each strand
      const baseAngle = (strandNum / 4) * 2 * Math.PI;
      const height = u * b;
      
      // Intercalation twist
      const twist = 0.15 * Math.sin(u * 8 * Math.PI + intercalationPhase * Math.PI);
      
      const radius = scale * 0.4;
      const tubeAngle = localV * 2 * Math.PI;
      const tubeRadius = 0.08 * scale;
      
      return [
        radius * Math.cos(baseAngle) + twist + tubeRadius * Math.cos(tubeAngle),
        radius * Math.sin(baseAngle) + tubeRadius * Math.sin(tubeAngle),
        height
      ];
    },
    defaultParams: { 
      a: 0.75, b: 1.5,
      uSegments: 96, vSegments: 32
    }
  },

  holliday_junction: {
    name: "Holliday Junction (4-Way)",
    description: "Four-way DNA junction in genetic recombination, ~4nm span - key to CRISPR and DNA repair",
    equation: (u, v, params) => {
      const a = params.a ?? 1;          // Arm length
      const b = params.b ?? 0.15;       // Strand thickness
      const scale = a;
      
      // Four arms extending from central junction
      const armNum = Math.floor(v * 4);
      const localV = (v * 4) % 1;
      
      // Arm directions (X-shape arrangement)
      const armAngles = [
        Math.PI / 4,      // Upper right
        3 * Math.PI / 4,  // Upper left
        5 * Math.PI / 4,  // Lower left
        7 * Math.PI / 4   // Lower right
      ];
      
      const armAngle = armAngles[armNum];
      const armLength = u * scale * 2;
      
      // DNA helix along each arm
      const helixAngle = u * 4 * Math.PI;
      const helixRadius = b;
      
      const baseX = armLength * Math.cos(armAngle);
      const baseY = armLength * Math.sin(armAngle);
      
      // Add helix around the arm axis
      const tubeAngle = localV * 2 * Math.PI;
      const dx = helixRadius * Math.cos(helixAngle + tubeAngle);
      const dy = helixRadius * Math.sin(helixAngle + tubeAngle);
      
      return [
        baseX + dx * Math.cos(armAngle + Math.PI/2),
        baseY + dx * Math.sin(armAngle + Math.PI/2),
        dy
      ];
    },
    defaultParams: { 
      a: 1, b: 0.15,
      uSegments: 96, vSegments: 32
    }
  },

  dna_origami_tile: {
    name: "DNA Origami Tile",
    description: "Programmed 2D DNA nanostructure, ~100nm × 70nm - revolutionary for nanotechnology",
    equation: (u, v, params) => {
      const a = params.a ?? 2;          // Tile width
      const b = params.b ?? 1.4;        // Tile height (70% of width)
      const c = params.c ?? 0.05;       // Strand thickness
      const helixSpacing = 0.1;         // ~2nm between helices
      
      // Grid of parallel helices
      const numHelices = 14;            // Typical origami has ~14-20 helices
      const helixNum = Math.floor(v * numHelices);
      const localV = (v * numHelices) % 1;
      
      // Each helix runs horizontally
      const x = (u - 0.5) * a;
      const y = (helixNum / numHelices - 0.5) * b;
      
      // Helix twist along length
      const helixAngle = u * 20 * Math.PI;
      const helixOffset = helixNum % 2 === 0 ? 0 : Math.PI; // Alternating phase
      
      // Crossover points every ~32bp
      const crossoverPhase = Math.sin(u * 6 * Math.PI);
      const crossoverOffset = crossoverPhase > 0.9 ? 0.02 : 0;
      
      const tubeAngle = localV * 2 * Math.PI;
      
      return [
        x,
        y + crossoverOffset + c * Math.cos(tubeAngle),
        c * Math.sin(helixAngle + helixOffset) + c * Math.sin(tubeAngle)
      ];
    },
    defaultParams: { 
      a: 2, b: 1.4, c: 0.05,
      uSegments: 128, vSegments: 56
    }
  },

  topological_domain_tad: {
    name: "Topologically Associated Domain (TAD)",
    description: "Self-interacting chromatin region, ~200-800nm span - key unit of 3D genome organization",
    equation: (u, v, params) => {
      const a = params.a ?? 2;          // Domain radius
      const b = params.b ?? 1;          // Compaction level
      const loops = params.e ?? 5;      // Number of loop structures
      
      // TAD as looped chromatin domain
      const mainAngle = u * 2 * Math.PI;
      const mainRadius = a * (0.8 + 0.2 * Math.sin(u * loops * 2 * Math.PI));
      
      // Internal looping structure
      const loopPhase = u * loops * 2 * Math.PI;
      const loopAmplitude = 0.3 * a * b;
      const loopOffset = loopAmplitude * Math.sin(loopPhase);
      
      // Chromatin fiber thickness
      const fiberAngle = v * 2 * Math.PI;
      const fiberRadius = 0.15 * a;
      
      // Height variation for 3D structure
      const height = 0.5 * a * Math.sin(u * 4 * Math.PI) * b;
      
      const centerX = (mainRadius + loopOffset) * Math.cos(mainAngle);
      const centerY = (mainRadius + loopOffset) * Math.sin(mainAngle);
      
      return [
        centerX + fiberRadius * Math.cos(fiberAngle),
        centerY + fiberRadius * Math.sin(fiberAngle),
        height
      ];
    },
    defaultParams: { 
      a: 2, b: 1, e: 5,
      uSegments: 128, vSegments: 24
    }
  },

  r_loop_structure: {
    name: "R-loop (RNA-DNA Hybrid)",
    description: "RNA-DNA hybrid with displaced DNA strand, ~100bp region - genome instability mechanism",
    equation: (u, v, params) => {
      const a = params.a ?? 1;          // Helix radius
      const b = params.b ?? 3.4;        // Pitch
      const loopStart = 0.3;            // Where R-loop begins
      const loopEnd = 0.7;              // Where R-loop ends
      const turns = params.e ?? 3;
      
      const height = u * turns * b;
      const angle = u * turns * 2 * Math.PI;
      
      // Three strands in R-loop region
      const strandNum = Math.floor(v * 3);
      const localV = (v * 3) % 1;
      
      const inRloop = u > loopStart && u < loopEnd;
      
      let radius = a;
      let strandAngle = angle;
      
      if (inRloop) {
        if (strandNum === 0) {
          // Template DNA strand (stays paired with RNA)
          radius = a;
          strandAngle = angle;
        } else if (strandNum === 1) {
          // RNA strand (hybridized with template)
          radius = a * 0.95;
          strandAngle = angle + 0.1;
        } else {
          // Displaced DNA strand (loops out)
          const loopT = (u - loopStart) / (loopEnd - loopStart);
          const loopBulge = Math.sin(loopT * Math.PI) * 0.8;
          radius = a + loopBulge;
          strandAngle = angle;
        }
      } else {
        // Normal double helix outside R-loop
        if (strandNum < 2) {
          strandAngle = angle + (strandNum === 1 ? Math.PI : 0);
        } else {
          return [0, 0, 0]; // No third strand outside loop
        }
      }
      
      const tubeAngle = localV * 2 * Math.PI;
      const tubeRadius = 0.08;
      
      return [
        radius * Math.cos(strandAngle) + tubeRadius * Math.cos(tubeAngle),
        radius * Math.sin(strandAngle) + tubeRadius * Math.sin(tubeAngle),
        height
      ];
    },
    defaultParams: { 
      a: 1, b: 3.4, e: 3,
      uSegments: 128, vSegments: 24
    }
  },

  dna_trefoil_knot: {
    name: "DNA Trefoil Knot",
    description: "Simplest DNA knot (3₁ topology), ~30nm loop - forms during replication/recombination",
    equation: (u, v, params) => {
      const a = params.a ?? 1;          // Knot size
      const c = params.c ?? 0.1;        // Tube radius
      
      // Trefoil knot parametric equations
      const t = u * 2 * Math.PI;
      
      // Classic trefoil: (sin(t) + 2*sin(2t), cos(t) - 2*cos(2t), -sin(3t))
      const x = a * (Math.sin(t) + 2 * Math.sin(2 * t));
      const y = a * (Math.cos(t) - 2 * Math.cos(2 * t));
      const z = a * (-Math.sin(3 * t));
      
      // Add DNA helix along the knot path
      const helixAngle = u * 12 * Math.PI;
      const tubeAngle = v * 2 * Math.PI;
      
      // Calculate tangent for tube orientation
      const dx = Math.cos(t) + 4 * Math.cos(2 * t);
      const dy = -Math.sin(t) + 4 * Math.sin(2 * t);
      const dz = -3 * Math.cos(3 * t);
      const len = Math.sqrt(dx*dx + dy*dy + dz*dz);
      
      // Normal vectors for tube
      const nx = -dy / len;
      const ny = dx / len;
      
      return [
        x + c * (nx * Math.cos(tubeAngle + helixAngle)),
        y + c * (ny * Math.cos(tubeAngle + helixAngle)),
        z + c * Math.sin(tubeAngle + helixAngle)
      ];
    },
    defaultParams: { 
      a: 1, c: 0.1,
      uSegments: 192, vSegments: 16
    }
  },

  dna_catenane: {
    name: "DNA Catenane (Linked Circles)",
    description: "Two interlocked circular DNA molecules, ~50nm each - found in kinetoplast DNA",
    equation: (u, v, params) => {
      const a = params.a ?? 1;          // Ring radius
      const c = params.c ?? 0.08;       // Tube radius
      const separation = params.b ?? 0.5; // Ring separation
      
      // Two interlocked tori (Hopf link)
      const ringNum = Math.floor(v * 2);
      const localV = (v * 2) % 1;
      
      const mainAngle = u * 2 * Math.PI;
      const tubeAngle = localV * 2 * Math.PI;
      
      let x, y, z;
      
      if (ringNum === 0) {
        // First ring (horizontal)
        x = (a + c * Math.cos(tubeAngle)) * Math.cos(mainAngle);
        y = (a + c * Math.cos(tubeAngle)) * Math.sin(mainAngle);
        z = c * Math.sin(tubeAngle);
      } else {
        // Second ring (rotated 90° and offset)
        const r = a + c * Math.cos(tubeAngle);
        x = separation + c * Math.sin(tubeAngle);
        y = r * Math.cos(mainAngle);
        z = r * Math.sin(mainAngle);
      }
      
      // Add DNA helix twist
      const helixAngle = u * 10 * Math.PI;
      const helixOffset = 0.02 * Math.sin(helixAngle);
      
      return [x + helixOffset, y, z];
    },
    defaultParams: { 
      a: 1, b: 0.5, c: 0.08,
      uSegments: 128, vSegments: 32
    }
  },

  dna_nanotube: {
    name: "DNA Nanotube Bundle",
    description: "Self-assembled tubular DNA structure, ~20nm diameter - drug delivery applications",
    equation: (u, v, params) => {
      const a = params.a ?? 1;          // Tube radius
      const b = params.b ?? 3;          // Tube length
      const helicesPerRing = 6;         // Hexagonal arrangement
      
      const helixNum = Math.floor(v * helicesPerRing);
      const localV = (v * helicesPerRing) % 1;
      
      // Hexagonal arrangement of helices
      const ringAngle = (helixNum / helicesPerRing) * 2 * Math.PI;
      const ringRadius = a * 0.8;
      
      const centerX = ringRadius * Math.cos(ringAngle);
      const centerY = ringRadius * Math.sin(ringAngle);
      
      // Each helix has its own twist
      const helixAngle = u * 6 * Math.PI + helixNum * Math.PI / 3;
      const helixRadius = 0.15 * a;
      
      const tubeAngle = localV * 2 * Math.PI;
      const tubeRadius = 0.05 * a;
      
      const height = u * b;
      
      return [
        centerX + helixRadius * Math.cos(helixAngle) + tubeRadius * Math.cos(tubeAngle),
        centerY + helixRadius * Math.sin(helixAngle) + tubeRadius * Math.sin(tubeAngle),
        height
      ];
    },
    defaultParams: { 
      a: 1, b: 3,
      uSegments: 128, vSegments: 48
    }
  },

  cruciform_dna: {
    name: "Cruciform DNA Junction",
    description: "Four-way junction at palindromic sequences, ~5nm arm length - regulatory element",
    equation: (u, v, params) => {
      const a = params.a ?? 1;          // Arm length
      const c = params.c ?? 0.1;        // Strand thickness
      
      // Four arms in cruciform (+ shape)
      const armNum = Math.floor(v * 4);
      const localV = (v * 4) % 1;
      
      // Arms extend in cardinal directions with hairpin loops at tips
      const armDirections = [
        [1, 0],   // Right
        [0, 1],   // Up
        [-1, 0],  // Left
        [0, -1]   // Down
      ];
      
      const [dx, dy] = armDirections[armNum];
      
      // Arm extends from center, then forms hairpin loop at tip
      let x, y, z;
      
      if (u < 0.7) {
        // Straight arm portion
        const armLength = (u / 0.7) * a;
        x = dx * armLength;
        y = dy * armLength;
        z = 0;
      } else {
        // Hairpin loop at tip
        const loopT = (u - 0.7) / 0.3;
        const loopAngle = loopT * Math.PI;
        const loopRadius = 0.15 * a;
        x = dx * a + loopRadius * Math.cos(loopAngle) * (dx === 0 ? 1 : 0);
        y = dy * a + loopRadius * Math.cos(loopAngle) * (dy === 0 ? 1 : 0);
        z = loopRadius * Math.sin(loopAngle);
      }
      
      // Add tube thickness
      const tubeAngle = localV * 2 * Math.PI;
      
      return [
        x + c * Math.cos(tubeAngle) * (dy !== 0 ? 1 : 0),
        y + c * Math.cos(tubeAngle) * (dx !== 0 ? 1 : 0),
        z + c * Math.sin(tubeAngle)
      ];
    },
    defaultParams: { 
      a: 1, c: 0.1,
      uSegments: 96, vSegments: 32
    }
  },

  // ========================================
  // 2026 DNA NANOTECHNOLOGY SYSTEMS
  // Advanced biotechnology applications
  // ========================================

  dna_data_storage: {
    name: "DNA Digital Data Storage",
    description: "DNA as ultra-dense data storage medium - 215 petabytes per gram, encoding binary data in nucleotide sequences",
    equation: (u, v, params) => {
      const a = params.a ?? 1.5;       // Storage lattice size
      const b = params.b ?? 0.8;       // Data density factor
      const c = params.c ?? 0.05;      // Bit strand radius
      
      // 3D lattice of DNA storage strands (like data center architecture)
      const gridX = Math.floor(v * 4);
      const gridY = Math.floor(u * 4);
      const localU = (u * 4) % 1;
      const localV = (v * 4) % 1;
      
      // Each grid position holds a data strand with helix encoding
      const baseX = (gridX - 1.5) * a * 0.6;
      const baseY = (gridY - 1.5) * a * 0.6;
      
      // Data helix structure (encoding bits)
      const helixHeight = localU * a * b;
      const helixAngle = localU * 8 * Math.PI; // Dense helix = more data
      const helixRadius = c * 2;
      
      // Tube rendering
      const tubeAngle = localV * 2 * Math.PI;
      
      // Data "pulses" along strand representing bits
      const dataPulse = 1 + 0.3 * Math.sin(localU * 20 * Math.PI);
      
      return [
        baseX + helixRadius * Math.cos(helixAngle) * dataPulse + c * Math.cos(tubeAngle),
        baseY + helixRadius * Math.sin(helixAngle) * dataPulse + c * Math.sin(tubeAngle),
        helixHeight
      ];
    },
    defaultParams: { 
      a: 1.5, b: 0.8, c: 0.05,
      uSegments: 128, vSegments: 64
    }
  },

  dna_nanobot: {
    name: "Programmable DNA Nanobot",
    description: "Autonomous DNA molecular machine ~50nm - drug delivery, cell targeting, programmable actuators",
    equation: (u, v, params) => {
      const a = params.a ?? 1;         // Robot body size
      const b = params.b ?? 0.4;       // Arm/leg length ratio
      const c = params.c ?? 0.08;      // Component thickness
      
      // Nanobot has central body with sensor arrays and actuator arms
      const component = Math.floor(v * 6); // Body, 4 arms, sensor
      const localV = (v * 6) % 1;
      
      let x = 0, y = 0, z = 0;
      
      if (component === 0) {
        // Central body - icosahedral capsule
        const phi = u * Math.PI;
        const theta = localV * 2 * Math.PI;
        x = a * 0.4 * Math.sin(phi) * Math.cos(theta);
        y = a * 0.4 * Math.sin(phi) * Math.sin(theta);
        z = a * 0.4 * Math.cos(phi);
      } else if (component < 5) {
        // Four actuator arms extending from body
        const armAngle = (component - 1) * Math.PI / 2;
        const armLength = u * a * b;
        const tubeAngle = localV * 2 * Math.PI;
        
        // Arms have joints for articulation
        const jointBend = 0.15 * Math.sin(u * 2 * Math.PI);
        
        x = Math.cos(armAngle) * (a * 0.4 + armLength) + jointBend * Math.sin(armAngle);
        y = Math.sin(armAngle) * (a * 0.4 + armLength) - jointBend * Math.cos(armAngle);
        z = c * Math.sin(tubeAngle);
        
        // Add gripper structure at end
        if (u > 0.8) {
          const gripperOpen = (u - 0.8) / 0.2 * 0.3;
          z += gripperOpen * Math.sin(localV * 4 * Math.PI);
        }
      } else {
        // Sensor dome on top
        const domeAngle = u * Math.PI * 0.5;
        const domeTheta = localV * 2 * Math.PI;
        x = a * 0.2 * Math.sin(domeAngle) * Math.cos(domeTheta);
        y = a * 0.2 * Math.sin(domeAngle) * Math.sin(domeTheta);
        z = a * 0.4 + a * 0.2 * Math.cos(domeAngle);
      }
      
      return [x, y, z];
    },
    defaultParams: { 
      a: 1, b: 0.4, c: 0.08,
      uSegments: 64, vSegments: 48
    }
  },

  dna_nanophotonics: {
    name: "DNA-Directed Nanophotonics",
    description: "Precisely positioned gold/silver nanoparticles on DNA scaffold for light manipulation - quantum sensors, metamaterials",
    equation: (u, v, params) => {
      const a = params.a ?? 1.2;       // Scaffold size
      const b = params.b ?? 0.15;      // Nanoparticle radius
      const c = params.c ?? 8;         // Number of particles per arm
      
      // DNA scaffold with precisely placed metallic nanoparticles
      const arm = Math.floor(v * 3); // 3 scaffold arms (triangular)
      const localV = (v * 3) % 1;
      
      // Triangular scaffold
      const armAngle = arm * 2 * Math.PI / 3;
      const armLength = u * a;
      
      // Position along arm with nanoparticle placement
      const particlePosition = Math.floor(u * c) / c;
      const isParticle = Math.abs(u - particlePosition - 0.5/c) < 0.3/c;
      
      // DNA scaffold backbone
      const scaffoldX = Math.cos(armAngle) * armLength;
      const scaffoldY = Math.sin(armAngle) * armLength;
      
      // Tube for scaffold or sphere for nanoparticle
      const tubeAngle = localV * 2 * Math.PI;
      const radius = isParticle ? b : 0.03;
      
      // Height varies for 3D scaffold structure
      const scaffoldZ = 0.1 * Math.sin(u * 4 * Math.PI);
      
      return [
        scaffoldX + radius * Math.cos(tubeAngle) * Math.cos(armAngle + Math.PI/2),
        scaffoldY + radius * Math.cos(tubeAngle) * Math.sin(armAngle + Math.PI/2),
        scaffoldZ + radius * Math.sin(tubeAngle)
      ];
    },
    defaultParams: { 
      a: 1.2, b: 0.15, c: 8,
      uSegments: 96, vSegments: 36
    }
  },

  cell_free_biomanufacturing: {
    name: "Cell-Free Biomanufacturing System",
    description: "DNA-programmed protein synthesis without living cells - modular bioreactor chambers, 2026 industrial biotech",
    equation: (u, v, params) => {
      const a = params.a ?? 1;         // Reactor module size
      const b = params.b ?? 0.3;       // Channel width
      const c = params.c ?? 0.6;       // Chamber height
      
      // Modular bioreactor system with reaction chambers and channels
      const moduleX = Math.floor(v * 3);
      const moduleY = Math.floor(u * 2);
      const localU = (u * 2) % 1;
      const localV = (v * 3) % 1;
      
      // Base positions for 3x2 grid of chambers
      const baseX = (moduleX - 1) * a * 0.8;
      const baseY = (moduleY - 0.5) * a * 0.8;
      
      // Each chamber is a cylindrical vessel with input/output channels
      const chamberAngle = localV * 2 * Math.PI;
      const chamberRadius = a * 0.25;
      
      // Chamber height with rounded top
      let chamberZ;
      if (localU < 0.1) {
        // Bottom dome
        const domeU = localU / 0.1;
        chamberZ = -c * 0.1 * Math.cos(domeU * Math.PI / 2);
      } else if (localU > 0.9) {
        // Top dome
        const domeU = (localU - 0.9) / 0.1;
        chamberZ = c + c * 0.1 * (1 - Math.cos(domeU * Math.PI / 2));
      } else {
        // Cylindrical body
        chamberZ = ((localU - 0.1) / 0.8) * c;
      }
      
      // Add connecting channels between chambers
      const inChannel = moduleX > 0 && localV < 0.1;
      const outChannel = moduleX < 2 && localV > 0.9;
      
      let x = baseX + chamberRadius * Math.cos(chamberAngle);
      let y = baseY + chamberRadius * Math.sin(chamberAngle);
      
      // Channel modifications
      if (inChannel && localU > 0.4 && localU < 0.6) {
        x -= (1 - localV / 0.1) * a * 0.3;
      }
      if (outChannel && localU > 0.4 && localU < 0.6) {
        x += ((localV - 0.9) / 0.1) * a * 0.3;
      }
      
      return [x, y, chamberZ];
    },
    defaultParams: { 
      a: 1, b: 0.3, c: 0.6,
      uSegments: 64, vSegments: 72
    }
  },

  dna_condensate: {
    name: "DNA Condensate / Synthetic Protocell",
    description: "Phase-separated DNA droplet forming protocell structure - origin of life research, synthetic biology chassis",
    equation: (u, v, params) => {
      const a = params.a ?? 1;         // Condensate radius
      const b = params.b ?? 0.3;       // Internal structure density
      const c = params.c ?? 0.15;      // Membrane thickness
      
      // Spherical condensate with phase-separated internal domains
      const phi = u * Math.PI;
      const theta = v * 2 * Math.PI;
      
      // Multiple layers: outer membrane, middle dense phase, inner dilute core
      const layer = Math.floor(u * 3);
      const layerU = (u * 3) % 1;
      
      let radius;
      if (layer === 0) {
        // Inner dilute core with DNA strands
        radius = a * 0.3 * layerU;
        // Add DNA strand perturbations
        const strandNoise = 0.05 * Math.sin(theta * 6) * Math.sin(phi * 4);
        radius += strandNoise;
      } else if (layer === 1) {
        // Dense phase ring (coacervate)
        radius = a * 0.3 + a * 0.5 * layerU;
        // Dense phase has granular texture
        const grainNoise = b * 0.1 * Math.sin(theta * 10) * Math.sin(phi * 8);
        radius += grainNoise;
      } else {
        // Outer membrane interface
        radius = a * 0.8 + a * 0.2 * layerU;
        // Membrane has surface tension undulations
        const membraneWave = c * 0.1 * Math.sin(theta * 3) * Math.cos(phi * 2);
        radius += membraneWave;
      }
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: { 
      a: 1, b: 0.3, c: 0.15,
      uSegments: 64, vSegments: 64
    }
  },

  dna_walker: {
    name: "DNA Walking Motor",
    description: "Bipedal DNA machine that walks along tracks - molecular transport, 30nm step size, ATP-powered",
    equation: (u, v, params) => {
      const a = params.a ?? 1.5;       // Track length
      const b = params.b ?? 0.2;       // Leg length
      const c = params.c ?? 0.05;      // Strand thickness
      
      const component = Math.floor(v * 4); // Track, walker body, 2 legs
      const localV = (v * 4) % 1;
      
      let x = 0, y = 0, z = 0;
      
      if (component === 0) {
        // Track - linear DNA rail with binding sites
        x = (u - 0.5) * a;
        const tubeAngle = localV * 2 * Math.PI;
        y = c * 2 * Math.cos(tubeAngle);
        z = c * 2 * Math.sin(tubeAngle);
        
        // Binding site markers
        const sitePos = Math.floor(u * 8) / 8;
        if (Math.abs(u - sitePos - 0.0625) < 0.03) {
          z += 0.08;
        }
      } else if (component === 1) {
        // Walker body - spherical cargo container
        const phi = u * Math.PI;
        const theta = localV * 2 * Math.PI;
        const bodyRadius = 0.1;
        x = 0; // Center of track
        y = bodyRadius * Math.sin(phi) * Math.cos(theta);
        z = 0.15 + bodyRadius * Math.sin(phi) * Math.sin(theta) + bodyRadius * Math.cos(phi);
      } else {
        // Legs - alternating walking motion
        const legNum = component - 2;
        const legPhase = legNum * Math.PI; // 180° out of phase
        const walkPhase = Math.sin(u * 2 * Math.PI + legPhase);
        
        // Leg attachment point on body
        const attachY = (legNum === 0 ? -1 : 1) * 0.05;
        const attachZ = 0.15;
        
        // Leg extends down to track with walking motion
        const legProgress = localV;
        const footX = (legNum === 0 ? -0.1 : 0.1) + walkPhase * 0.05;
        const footZ = c * 2;
        
        x = footX * legProgress;
        y = attachY;
        z = attachZ * (1 - legProgress) + footZ * legProgress;
      }
      
      return [x, y, z];
    },
    defaultParams: { 
      a: 1.5, b: 0.2, c: 0.05,
      uSegments: 64, vSegments: 48
    }
  }

};

export const DNA_SHAPE_COUNT = Object.keys(DNA_STRUCTURES).length;
