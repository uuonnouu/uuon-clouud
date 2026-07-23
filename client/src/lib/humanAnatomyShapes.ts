/**
 * Human Anatomy Structures
 * 50 parametric surface representations of human anatomical systems
 * Organized into 6 major subsections for comprehensive medical/biological visualization
 * Enhanced with anatomy-engine-v2 integration for mesh and hybrid support
 */

import { SurfaceParameters } from '../types/math';
import { HUMAN_ANATOMY_SHAPES as ANATOMY_ENGINE_SHAPES, generateMesh, getShapeById } from './anatomy-engine-v2';

export interface AnatomyStructure {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
  description?: string;
}

export const HUMAN_ANATOMY_SHAPES: Record<string, AnatomyStructure> = {

  // ========================================
  // CARDIOVASCULAR SYSTEM (11 shapes)
  // ========================================

  heart_4_chambers: {
    name: "Heart (4 Chambers)",
    description: "Anatomically accurate heart with proper chamber positioning",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Create anatomically correct heart shape
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // Base heart shape (cardioid-like)
      const heartX = scale * (1 + Math.cos(theta)) * Math.cos(theta) * 0.5;
      const heartY = scale * (1 + Math.cos(theta)) * Math.sin(theta) * 0.5;
      const heartZ = scale * Math.sin(phi) * 0.3;
      
      // Chamber separations (septum and valve planes)
      const septalWall = 0.05 * scale * Math.sin(theta * 4);
      const atrialSeparation = phi < Math.PI * 0.6 ? 0.1 * scale * Math.sin(theta * 2) : 0;
      
      // Atria (upper chambers) - smaller, rounded
      if (phi < Math.PI * 0.6) {
        return [
          heartX * 0.8 + atrialSeparation,
          heartY * 0.8,
          heartZ + scale * 0.3
        ];
      }
      // Ventricles (lower chambers) - larger, more muscular
      else {
        return [
          heartX + septalWall,
          heartY,
          heartZ - scale * 0.2
        ];
      }
    },
    defaultParams: { 
      a: 1,
      uSegments: 128, vSegments: 64
    }
  },

  heart_valves: {
    name: "Heart Valves (4 Types)",
    description: "Mitral, tricuspid, aortic, and pulmonary valves",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Four heart valves as tri-leaflet or bi-leaflet structures
      const valveIndex = Math.floor(u * 4);
      const localU = (u * 4) % 1;
      
      const angle = localU * 2 * Math.PI;
      const radius = 0.3 * scale * (1 + 0.2 * Math.sin(v * 3 * 2 * Math.PI));
      
      // Valve positions
      const valveZ = [0.6 * scale, 0.5 * scale, -0.3 * scale, -0.2 * scale][valveIndex];
      const valveX = [-0.2 * scale, 0.2 * scale, -0.1 * scale, 0.15 * scale][valveIndex];
      
      return [
        valveX + radius * Math.cos(angle) * (1 - v),
        radius * Math.sin(angle) * (1 - v),
        valveZ
      ];
    },
    defaultParams: { 
      a: 1,
      uSegments: 64, vSegments: 32
    }
  },

  coronary_arteries: {
    name: "Coronary Arteries",
    description: "Network supplying blood to heart muscle",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Main coronary arteries branching over heart surface
      const branchIndex = Math.floor(u * 3);
      const t = (u * 3) % 1;
      
      // Heart surface (simplified)
      const heartAngle = t * Math.PI;
      const heartRadius = scale * (1 - 0.3 * Math.cos(heartAngle));
      
      const tubeAngle = v * 2 * Math.PI;
      const tubeRadius = 0.05 * scale;
      
      const offset = (branchIndex - 1) * 0.7;
      
      return [
        heartRadius * Math.cos(heartAngle) + tubeRadius * Math.cos(tubeAngle) + offset,
        heartRadius * Math.sin(heartAngle) + tubeRadius * Math.sin(tubeAngle),
        -Math.abs(Math.sin(heartAngle)) * scale
      ];
    },
    defaultParams: { 
      a: 1,
      uSegments: 96, vSegments: 12
    }
  },

  cardiac_conduction: {
    name: "Cardiac Conduction Pathway",
    description: "Electrical pathway: SA node → AV node → Bundle of His",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Electrical conduction path through heart
      const pathPhase = u;
      
      let x, y, z;
      
      if (pathPhase < 0.2) {
        // SA node (top right)
        const t = pathPhase / 0.2;
        const theta = v * 2 * Math.PI;
        const nodeRadius = 0.1 * scale;
        x = 0.4 * scale + nodeRadius * Math.cos(theta);
        y = 0.3 * scale + nodeRadius * Math.sin(theta);
        z = 0.6 * scale;
      } else if (pathPhase < 0.5) {
        // Atrial pathway
        const t = (pathPhase - 0.2) / 0.3;
        x = 0.4 * scale * (1 - t);
        y = 0.3 * scale;
        z = 0.6 * scale - t * 0.3 * scale;
      } else if (pathPhase < 0.7) {
        // AV node
        const t = (pathPhase - 0.5) / 0.2;
        const theta = v * 2 * Math.PI;
        const nodeRadius = 0.08 * scale;
        x = nodeRadius * Math.cos(theta);
        y = 0.2 * scale + nodeRadius * Math.sin(theta);
        z = 0.3 * scale;
      } else {
        // Bundle of His & Purkinje fibers
        const t = (pathPhase - 0.7) / 0.3;
        const branchOffset = (v < 0.5 ? -0.3 : 0.3) * scale;
        x = branchOffset * t;
        y = 0.2 * scale - t * 0.6 * scale;
        z = 0.3 * scale - t * 0.5 * scale;
      }
      
      return [x, y, z];
    },
    defaultParams: { 
      a: 1,
      uSegments: 128, vSegments: 8
    }
  },

  aorta_arch: {
    name: "Aortic Arch",
    description: "Main artery arch with branching vessels",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Curved aortic arch
      const angle = u * Math.PI;
      const archRadius = 0.8 * scale;
      
      const tubeAngle = v * 2 * Math.PI;
      const tubeRadius = 0.15 * scale;
      
      const centerX = archRadius * Math.cos(angle);
      const centerZ = 0.5 * scale + archRadius * Math.sin(angle);
      
      return [
        centerX + tubeRadius * Math.cos(tubeAngle) * Math.cos(angle),
        tubeRadius * Math.sin(tubeAngle),
        centerZ + tubeRadius * Math.cos(tubeAngle) * Math.sin(angle)
      ];
    },
    defaultParams: { 
      a: 1,
      uSegments: 64, vSegments: 24
    }
  },

  vena_cava_network: {
    name: "Vena Cava (Superior & Inferior)",
    description: "Major veins returning blood to heart",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Two main vessels
      const vessel = u < 0.5 ? 0 : 1; // Superior vs Inferior
      const t = (u < 0.5 ? u : u - 0.5) * 2;
      
      const tubeAngle = v * 2 * Math.PI;
      const tubeRadius = 0.12 * scale;
      
      let centerZ;
      if (vessel === 0) {
        // Superior vena cava (from top)
        centerZ = 0.8 * scale - t * 0.5 * scale;
      } else {
        // Inferior vena cava (from bottom)
        centerZ = -0.8 * scale + t * 0.5 * scale;
      }
      
      return [
        0.3 * scale + tubeRadius * Math.cos(tubeAngle),
        tubeRadius * Math.sin(tubeAngle),
        centerZ
      ];
    },
    defaultParams: { 
      a: 1,
      uSegments: 64, vSegments: 16
    }
  },

  pulmonary_circulation: {
    name: "Pulmonary Circulation Loop",
    description: "Blood flow path through lungs",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Loop from heart to lungs and back
      const loopAngle = u * 2 * Math.PI;
      const loopRadius = 0.8 * scale;
      
      const tubeAngle = v * 2 * Math.PI;
      const tubeRadius = 0.08 * scale;
      
      const centerX = loopRadius * Math.cos(loopAngle);
      const centerY = loopRadius * Math.sin(loopAngle);
      const centerZ = 0.3 * scale * Math.sin(loopAngle * 2);
      
      return [
        centerX + tubeRadius * Math.cos(tubeAngle) * Math.cos(loopAngle),
        centerY + tubeRadius * Math.cos(tubeAngle) * Math.sin(loopAngle),
        centerZ + tubeRadius * Math.sin(tubeAngle)
      ];
    },
    defaultParams: { 
      a: 1,
      uSegments: 96, vSegments: 16
    }
  },

  capillary_bed: {
    name: "Capillary Bed Network",
    description: "Microscopic blood vessel network",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Dense network of tiny vessels
      const branchNum = Math.floor(u * 12);
      const t = (u * 12) % 1;
      
      const branchAngle = (branchNum / 12) * 2 * Math.PI;
      const branchRadius = 0.5 * scale + t * 0.4 * scale;
      
      const tubeAngle = v * 2 * Math.PI;
      const tubeRadius = 0.02 * scale;
      
      return [
        branchRadius * Math.cos(branchAngle) + tubeRadius * Math.cos(tubeAngle),
        branchRadius * Math.sin(branchAngle) + tubeRadius * Math.sin(tubeAngle),
        0.1 * scale * Math.sin(t * 4 * Math.PI)
      ];
    },
    defaultParams: { 
      a: 1,
      uSegments: 192, vSegments: 8
    }
  },

  lymphatic_vessel: {
    name: "Lymphatic Vessel",
    description: "Lymph drainage vessel with valves",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 2;
      const scale = a;
      
      // Vessel with periodic valve constrictions
      const z = u * b;
      const valvePattern = 1 - 0.3 * Math.abs(Math.sin(u * 8 * Math.PI));
      
      const theta = v * 2 * Math.PI;
      const radius = 0.1 * scale * valvePattern;
      
      return [
        radius * Math.cos(theta),
        radius * Math.sin(theta),
        z
      ];
    },
    defaultParams: { 
      a: 1, b: 2,
      uSegments: 96, vSegments: 16
    }
  },

  blood_pressure_wave: {
    name: "Blood Pressure Waveform",
    description: "Arterial pressure wave (systole/diastole)",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 3;
      
      // Pressure waveform over time
      const x = u * b;
      
      // Systolic peak + dicrotic notch
      const systolic = 1.2 * Math.sin(u * 2 * Math.PI);
      const dicrotic = -0.2 * Math.sin((u - 0.35) * 20 * Math.PI) * Math.exp(-10 * Math.abs(u - 0.35));
      const pressure = a * (systolic + dicrotic);
      
      // Create surface
      const y = (v - 0.5) * 0.3 * a;
      
      return [x, y, pressure];
    },
    defaultParams: { 
      a: 1, b: 3,
      uSegments: 128, vSegments: 8
    }
  },

  cardiac_stent: {
    name: "Cardiac Stent (Medical Device)",
    description: "Mesh stent for artery support",
    equation: (u, v, params) => {
      const a = params.a ?? 0.5;
      const b = params.b ?? 1.5;
      
      // Cylindrical mesh structure
      const z = u * b;
      const theta = v * 2 * Math.PI;
      
      // Mesh pattern
      const meshPattern = 0.05 * a * Math.sin(u * 20 * 2 * Math.PI) * Math.sin(v * 16 * 2 * Math.PI);
      const radius = a + meshPattern;
      
      return [
        radius * Math.cos(theta),
        radius * Math.sin(theta),
        z
      ];
    },
    defaultParams: { 
      a: 0.5, b: 1.5,
      uSegments: 80, vSegments: 64
    }
  },

  // ========================================
  // NERVOUS SYSTEM (9 shapes)
  // ========================================

  cerebral_cortex: {
    name: "Cerebral Cortex (Folded Surface)",
    description: "Anatomically accurate brain cortex with realistic gyri and sulci",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      // Brain-shaped base (not perfect sphere)
      let baseRadius = scale * Math.sin(theta);
      
      // Anatomically correct brain proportions
      const frontBack = 1 + 0.15 * Math.cos(phi); // Slightly elongated front-to-back
      const leftRight = 1 + 0.08 * Math.sin(phi); // Slight asymmetry
      
      // Realistic cortical folding patterns
      const primaryFolds = 0.08 * scale * Math.sin(theta * 6) * Math.cos(phi * 8);
      const secondaryFolds = 0.05 * scale * Math.sin(theta * 12) * Math.sin(phi * 15);
      const fineFolds = 0.02 * scale * Math.sin(theta * 20) * Math.cos(phi * 25);
      
      // Sulcal depth varies by location
      const sulcalDepth = theta < Math.PI * 0.3 ? 0.6 : // Frontal region - deeper folds
                         theta > Math.PI * 0.7 ? 0.8 : // Occipital region - deeper
                         1.0; // Parietal/temporal - standard
      
      const totalFolds = (primaryFolds + secondaryFolds + fineFolds) * sulcalDepth;
      baseRadius *= frontBack * leftRight;
      const radius = baseRadius + totalFolds;
      
      return [
        radius * Math.cos(phi),
        radius * Math.sin(phi),
        scale * Math.cos(theta)
      ];
    },
    defaultParams: { 
      a: 1,
      uSegments: 128, vSegments: 128
    }
  },

  cerebellum_layers: {
    name: "Cerebellum (Layered Structure)",
    description: "Cerebellum with characteristic parallel folds",
    equation: (u, v, params) => {
      const a = params.a ?? 0.8;
      const scale = a;
      
      // Smaller, more tightly folded structure
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const baseRadius = scale * 0.7 * Math.sin(theta);
      
      // Very fine parallel folds
      const folds = 0.08 * scale * Math.sin(phi * 30);
      
      return [
        (baseRadius + folds) * Math.cos(phi),
        (baseRadius + folds) * Math.sin(phi),
        -0.5 * scale + scale * Math.cos(theta) * 0.6
      ];
    },
    defaultParams: { 
      a: 0.8,
      uSegments: 96, vSegments: 120
    }
  },

  hippocampus: {
    name: "Hippocampus (Seahorse Shape)",
    description: "Memory center with characteristic curved structure",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Curved, elongated structure
      const t = u;
      const theta = v * 2 * Math.PI;
      
      // Seahorse-like curve
      const curveAngle = t * Math.PI;
      const x = scale * Math.cos(curveAngle) * (1 - t * 0.5);
      const z = scale * Math.sin(curveAngle);
      
      // Cross-section radius (tapering)
      const radius = 0.2 * scale * (1 - t * 0.6);
      
      return [
        x + radius * Math.cos(theta) * Math.cos(curveAngle),
        radius * Math.sin(theta),
        z + radius * Math.cos(theta) * Math.sin(curveAngle)
      ];
    },
    defaultParams: { 
      a: 1,
      uSegments: 64, vSegments: 32
    }
  },

  amygdala: {
    name: "Amygdala (Almond Shape)",
    description: "Emotion processing center",
    equation: (u, v, params) => {
      const a = params.a ?? 0.4;
      const scale = a;
      
      // Almond-shaped structure
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // Ellipsoidal with taper
      const rx = scale;
      const ry = scale * 0.7;
      const rz = scale * 0.6;
      
      return [
        rx * Math.sin(phi) * Math.cos(theta),
        ry * Math.sin(phi) * Math.sin(theta),
        rz * Math.cos(phi)
      ];
    },
    defaultParams: { 
      a: 0.4,
      uSegments: 48, vSegments: 36
    }
  },

  spinal_cord_section: {
    name: "Spinal Cord Cross-Section",
    description: "Anatomically correct butterfly-shaped gray matter with white matter",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 2;
      const scale = a;
      
      const z = u * b - b * 0.5; // Center the cord
      const angle = v * 2 * Math.PI;
      
      // Create proper butterfly shape for gray matter
      const butterflyShape = () => {
        const normalizedAngle = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        
        // Butterfly wings (dorsal and ventral horns)
        if (normalizedAngle < Math.PI * 0.25 || 
            (normalizedAngle > Math.PI * 0.75 && normalizedAngle < Math.PI * 1.25) ||
            normalizedAngle > Math.PI * 1.75) {
          // Dorsal horns (sensory) - thinner
          return scale * 0.15 * (1 + 0.3 * Math.sin(normalizedAngle * 4));
        } else if (normalizedAngle > Math.PI * 0.25 && normalizedAngle < Math.PI * 0.75) {
          // Ventral horns (motor) - thicker
          return scale * 0.25 * (1 + 0.4 * Math.cos(normalizedAngle * 2));
        } else {
          // Central canal area
          return scale * 0.08;
        }
      };
      
      const radius = butterflyShape();
      
      // White matter surrounds gray matter
      const whiteMatterRadius = scale * 0.35;
      const finalRadius = Math.max(radius, whiteMatterRadius * 0.7);
      
      return [
        finalRadius * Math.cos(angle),
        finalRadius * Math.sin(angle),
        z
      ];
    },
    defaultParams: { 
      a: 1, b: 2,
      uSegments: 64, vSegments: 32
    }
  },

  peripheral_nerve: {
    name: "Peripheral Nerve Bundle",
    description: "Bundle of nerve fibers (fascicles)",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 3;
      
      // Multiple fascicles bundled together
      const fascicleNum = Math.floor(v * 6);
      const localV = (v * 6) % 1;
      
      const ringAngle = (fascicleNum / 6) * 2 * Math.PI;
      const ringRadius = 0.3 * a;
      
      const z = u * b;
      const tubeAngle = localV * 2 * Math.PI;
      const tubeRadius = 0.08 * a;
      
      return [
        ringRadius * Math.cos(ringAngle) + tubeRadius * Math.cos(tubeAngle),
        ringRadius * Math.sin(ringAngle) + tubeRadius * Math.sin(tubeAngle),
        z
      ];
    },
    defaultParams: { 
      a: 1, b: 3,
      uSegments: 96, vSegments: 72
    }
  },

  synapse_field: {
    name: "Synaptic Field (Neuron Connections)",
    description: "Network of synaptic connections",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Network of connection points
      const nodeNum = Math.floor(u * 20);
      const t = (u * 20) % 1;
      
      // Random-like positions (deterministic)
      const nodeX = scale * Math.cos(nodeNum * 2.4);
      const nodeY = scale * Math.sin(nodeNum * 1.7);
      const nodeZ = scale * Math.sin(nodeNum * 3.1);
      
      // Small sphere at each synapse
      const theta = t * 2 * Math.PI;
      const phi = v * Math.PI;
      const synapseRadius = 0.05 * scale;
      
      return [
        nodeX + synapseRadius * Math.sin(phi) * Math.cos(theta),
        nodeY + synapseRadius * Math.sin(phi) * Math.sin(theta),
        nodeZ + synapseRadius * Math.cos(phi)
      ];
    },
    defaultParams: { 
      a: 1,
      uSegments: 160, vSegments: 20
    }
  },

  glial_network: {
    name: "Glial Cell Network",
    description: "Support cells (astrocytes, oligodendrocytes)",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Star-shaped astrocyte processes
      const processNum = Math.floor(v * 8);
      const t = u;
      
      const processAngle = (processNum / 8) * 2 * Math.PI;
      const radius = t * scale;
      
      // Branching pattern
      const branch = 0.1 * scale * Math.sin(t * 12 * Math.PI);
      
      return [
        radius * Math.cos(processAngle) + branch,
        radius * Math.sin(processAngle),
        t * 0.3 * scale * Math.sin(processNum)
      ];
    },
    defaultParams: { 
      a: 1,
      uSegments: 64, vSegments: 64
    }
  },

  neuromuscular_junction: {
    name: "Neuromuscular Junction",
    description: "Nerve-muscle connection point with synaptic cleft",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Nerve ending + muscle fiber interface
      if (u < 0.5) {
        // Nerve terminal (branching)
        const t = u / 0.5;
        const branchNum = Math.floor(v * 4);
        const branchAngle = (branchNum / 4) * 2 * Math.PI;
        
        const radius = 0.1 * scale * (1 - t);
        return [
          t * scale * Math.cos(branchAngle),
          t * scale * Math.sin(branchAngle),
          0.5 * scale
        ];
      } else {
        // Muscle fiber (striations)
        const t = (u - 0.5) / 0.5;
        const theta = v * 2 * Math.PI;
        const radius = 0.3 * scale;
        
        // Striation pattern
        const striation = 0.05 * scale * Math.sin(t * 20 * 2 * Math.PI);
        
        return [
          (radius + striation) * Math.cos(theta),
          (radius + striation) * Math.sin(theta),
          -t * scale
        ];
      }
    },
    defaultParams: { 
      a: 1,
      uSegments: 96, vSegments: 48
    }
  },

  // ========================================
  // RESPIRATORY SYSTEM (7 shapes)
  // ========================================

  lung_lobes: {
    name: "Lung Lobes (3 Right, 2 Left)",
    description: "Anatomically correct lung lobes with proper fissures",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // Determine left vs right lung
      const isRightLung = theta > Math.PI;
      const localTheta = isRightLung ? (theta - Math.PI) : theta;
      
      // Lung-shaped base (elongated ellipsoid)
      const lungWidth = scale * 0.4;
      const lungDepth = scale * 0.6;
      const lungHeight = scale * 1.2;
      
      const x = (isRightLung ? 1 : -1) * lungWidth * Math.sin(phi) * Math.cos(localTheta);
      let y = lungDepth * Math.sin(phi) * Math.sin(localTheta);
      let z = lungHeight * Math.cos(phi);
      
      // Fissures (anatomical separations between lobes)
      if (isRightLung) {
        // Right lung: 3 lobes with 2 fissures
        const horizontalFissure = phi > Math.PI * 0.4 && phi < Math.PI * 0.6 ? -0.1 * scale : 0;
        const obliqueFissure = (phi > Math.PI * 0.5) && (localTheta > Math.PI * 0.3) ? -0.15 * scale : 0;
        y += horizontalFissure + obliqueFissure;
      } else {
        // Left lung: 2 lobes with 1 fissure
        const obliqueFissure = (phi > Math.PI * 0.5) && (localTheta > Math.PI * 0.4) ? -0.15 * scale : 0;
        y += obliqueFissure;
        
        // Cardiac notch (heart indentation)
        if (localTheta < Math.PI * 0.3 && phi > Math.PI * 0.6) {
          y -= 0.2 * scale;
        }
      }
      
      return [x, y, z];
    },
    defaultParams: { 
      a: 1,
      uSegments: 80, vSegments: 48
    }
  },

  bronchial_tree: {
    name: "Bronchial Tree (Airway Branching)",
    description: "Hierarchical branching airways",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Recursive branching structure
      const branchLevel = Math.floor(u * 4);
      const t = (u * 4) % 1;
      
      const numBranches = Math.pow(2, branchLevel);
      const branchNum = Math.floor(v * numBranches);
      const branchAngle = (branchNum / numBranches) * 2 * Math.PI;
      
      // Tapering radius
      const radius = 0.1 * scale * Math.pow(0.6, branchLevel);
      const tubeRadius = 0.05 * scale * Math.pow(0.7, branchLevel);
      
      const x = radius * Math.cos(branchAngle);
      const y = radius * Math.sin(branchAngle);
      const z = t * scale;
      
      return [x, y, z];
    },
    defaultParams: { 
      a: 1,
      uSegments: 128, vSegments: 64
    }
  },

  alveolar_sacs: {
    name: "Alveolar Sacs (Gas Exchange)",
    description: "Clusters of alveoli (air sacs)",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Cluster of small spherical sacs
      const sacNum = Math.floor(u * 20);
      const localU = (u * 20) % 1;
      
      // Cluster position
      const clusterAngle = (sacNum / 20) * 2 * Math.PI;
      const clusterRadius = 0.5 * scale;
      
      const centerX = clusterRadius * Math.cos(clusterAngle);
      const centerY = clusterRadius * Math.sin(clusterAngle);
      
      // Individual alveolus
      const theta = localU * 2 * Math.PI;
      const phi = v * Math.PI;
      const alveolarRadius = 0.08 * scale;
      
      return [
        centerX + alveolarRadius * Math.sin(phi) * Math.cos(theta),
        centerY + alveolarRadius * Math.sin(phi) * Math.sin(theta),
        alveolarRadius * Math.cos(phi)
      ];
    },
    defaultParams: { 
      a: 1,
      uSegments: 160, vSegments: 32
    }
  },

  diaphragm_motion: {
    name: "Diaphragm (Breathing Motion)",
    description: "Dome-shaped muscle with contraction pattern",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const d = params.d ?? 0;
      const scale = a;
      
      // Dome shape
      const radius = u * scale;
      const theta = v * 2 * Math.PI;
      
      // Height varies with breathing cycle (d = 0 to 1)
      const domeHeight = 0.4 * scale * (1 - radius / scale) * (1 + 0.5 * d);
      
      return [
        radius * Math.cos(theta),
        radius * Math.sin(theta),
        -domeHeight
      ];
    },
    defaultParams: { 
      a: 1, d: 0,
      uSegments: 48, vSegments: 48
    }
  },

  trachea_cilia: {
    name: "Trachea with Cilia",
    description: "Windpipe with ciliated epithelium",
    equation: (u, v, params) => {
      const a = params.a ?? 0.5;
      const b = params.b ?? 2;
      
      // Cylindrical trachea
      const z = u * b;
      const theta = v * 2 * Math.PI;
      
      // Cilia pattern (small projections)
      const cilia = 0.02 * a * Math.sin(u * 40 * 2 * Math.PI) * Math.sin(v * 30 * 2 * Math.PI);
      const radius = a + cilia;
      
      return [
        radius * Math.cos(theta),
        radius * Math.sin(theta),
        z
      ];
    },
    defaultParams: { 
      a: 0.5, b: 2,
      uSegments: 96, vSegments: 80
    }
  },

  pleural_cavity: {
    name: "Pleural Cavity (Lung Lining)",
    description: "Membrane space around lungs",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Thin membrane layer
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // Lung-shaped envelope
      const baseRadius = scale * Math.sin(phi);
      const asymmetry = 0.2 * scale * Math.cos(theta);
      
      return [
        (baseRadius + asymmetry) * Math.cos(theta),
        (baseRadius + asymmetry) * Math.sin(theta),
        scale * Math.cos(phi)
      ];
    },
    defaultParams: { 
      a: 1,
      uSegments: 64, vSegments: 48
    }
  },

  gas_exchange_membrane: {
    name: "Gas Exchange Interface",
    description: "Alveolar-capillary membrane",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Highly folded thin membrane
      const x = (u - 0.5) * 2 * scale;
      const y = (v - 0.5) * 2 * scale;
      
      // Complex folding pattern
      const z = 0.1 * scale * (
        Math.sin(u * 10 * 2 * Math.PI) * Math.sin(v * 10 * 2 * Math.PI) +
        Math.sin(u * 15 * 2 * Math.PI) * Math.cos(v * 12 * 2 * Math.PI)
      );
      
      return [x, y, z];
    },
    defaultParams: { 
      a: 1,
      uSegments: 128, vSegments: 128
    }
  },

  // ========================================
  // DIGESTIVE SYSTEM (9 shapes)
  // ========================================

  oral_cavity: {
    name: "Oral Cavity Structure",
    description: "Mouth cavity with palate and tongue space",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Arched cavity
      const archAngle = u * Math.PI;
      const width = v * 2 - 1; // -1 to 1
      
      const archRadius = scale;
      const depth = 0.5 * scale;
      
      return [
        archRadius * Math.cos(archAngle),
        width * scale * 0.6,
        depth * Math.sin(archAngle)
      ];
    },
    defaultParams: { 
      a: 1,
      uSegments: 48, vSegments: 32
    }
  },

  esophagus_peristalsis: {
    name: "Esophagus (Peristaltic Waves)",
    description: "Food tube with muscular contraction waves",
    equation: (u, v, params) => {
      const a = params.a ?? 0.5;
      const b = params.b ?? 3;
      const d = params.d ?? 0;
      
      const z = u * b;
      const theta = v * 2 * Math.PI;
      
      // Peristaltic wave (d controls wave position)
      const wave = 1 - 0.4 * Math.sin((u - d) * 6 * 2 * Math.PI);
      const radius = a * wave;
      
      return [
        radius * Math.cos(theta),
        radius * Math.sin(theta),
        z
      ];
    },
    defaultParams: { 
      a: 0.5, b: 3, d: 0,
      uSegments: 96, vSegments: 24
    }
  },

  stomach_layers: {
    name: "Stomach (Layered Wall)",
    description: "Stomach with rugae (folds) and muscle layers",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // J-shaped stomach
      const t = u;
      const theta = v * 2 * Math.PI;
      
      // J-curve path
      const curveAngle = t * 1.5 * Math.PI;
      const curveRadius = scale * 0.8;
      
      const centerX = curveRadius * Math.cos(curveAngle);
      const centerZ = curveRadius * Math.sin(curveAngle) - 0.3 * scale;
      
      // Cross-section with rugae
      const rugae = 0.1 * scale * Math.sin(v * 8 * 2 * Math.PI);
      const radius = 0.4 * scale + rugae;
      
      return [
        centerX + radius * Math.cos(theta) * Math.cos(curveAngle),
        radius * Math.sin(theta),
        centerZ + radius * Math.cos(theta) * Math.sin(curveAngle)
      ];
    },
    defaultParams: { 
      a: 1,
      uSegments: 64, vSegments: 48
    }
  },

  small_intestine_villi: {
    name: "Small Intestine with Villi",
    description: "Intestinal wall with finger-like projections",
    equation: (u, v, params) => {
      const a = params.a ?? 0.6;
      const b = params.b ?? 5;
      
      // Long coiled tube
      const t = u;
      const coilAngle = t * 8 * 2 * Math.PI;
      const coilRadius = 0.5 * a;
      
      const centerX = coilRadius * Math.cos(coilAngle);
      const centerY = coilRadius * Math.sin(coilAngle);
      const centerZ = t * b;
      
      // Tube with villi
      const theta = v * 2 * Math.PI;
      const villi = 0.08 * a * Math.abs(Math.sin(v * 20 * 2 * Math.PI));
      const radius = a + villi;
      
      return [
        centerX + radius * Math.cos(theta),
        centerY + radius * Math.sin(theta),
        centerZ
      ];
    },
    defaultParams: { 
      a: 0.6, b: 5,
      uSegments: 192, vSegments: 64
    }
  },

  large_intestine: {
    name: "Large Intestine (Colon)",
    description: "Colon with haustra (pouches)",
    equation: (u, v, params) => {
      const a = params.a ?? 0.8;
      const b = params.b ?? 4;
      
      // Path around abdomen
      const t = u;
      const pathAngle = t * 1.5 * Math.PI;
      const pathRadius = 1.2 * a;
      
      const centerX = pathRadius * Math.cos(pathAngle);
      const centerY = pathRadius * Math.sin(pathAngle);
      
      // Cross-section with haustra (segmented pouches)
      const theta = v * 2 * Math.PI;
      const haustra = 0.15 * a * Math.abs(Math.sin(t * 12 * Math.PI));
      const radius = a + haustra;
      
      return [
        centerX + radius * Math.cos(theta),
        centerY + radius * Math.sin(theta),
        t * 0.5 * b - 0.25 * b
      ];
    },
    defaultParams: { 
      a: 0.8, b: 4,
      uSegments: 96, vSegments: 32
    }
  },

  liver_lobule: {
    name: "Liver Lobule (Hexagonal Unit)",
    description: "Functional unit with portal triads",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Hexagonal lobule structure
      const hexAngle = u * 6;
      const sideNum = Math.floor(hexAngle);
      const t = hexAngle % 1;
      
      const angle1 = (sideNum / 6) * 2 * Math.PI;
      const angle2 = ((sideNum + 1) / 6) * 2 * Math.PI;
      
      const x = scale * (Math.cos(angle1) * (1 - t) + Math.cos(angle2) * t);
      const y = scale * (Math.sin(angle1) * (1 - t) + Math.sin(angle2) * t);
      const z = (v - 0.5) * 0.3 * scale;
      
      return [x, y, z];
    },
    defaultParams: { 
      a: 1,
      uSegments: 48, vSegments: 16
    }
  },

  pancreas_acini: {
    name: "Pancreatic Acini (Enzyme Clusters)",
    description: "Grape-like enzyme-secreting clusters",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Cluster of small spherical acini
      const acinusNum = Math.floor(u * 15);
      const localU = (u * 15) % 1;
      
      // Cluster arrangement
      const clusterAngle = (acinusNum / 15) * 2 * Math.PI;
      const clusterRadius = 0.6 * scale;
      
      const centerX = clusterRadius * Math.cos(clusterAngle) * Math.sqrt(acinusNum / 15);
      const centerY = clusterRadius * Math.sin(clusterAngle) * Math.sqrt(acinusNum / 15);
      
      // Individual acinus (small sphere)
      const theta = localU * 2 * Math.PI;
      const phi = v * Math.PI;
      const acinusRadius = 0.12 * scale;
      
      return [
        centerX + acinusRadius * Math.sin(phi) * Math.cos(theta),
        centerY + acinusRadius * Math.sin(phi) * Math.sin(theta),
        acinusRadius * Math.cos(phi)
      ];
    },
    defaultParams: { 
      a: 1,
      uSegments: 120, vSegments: 24
    }
  },

  gallbladder: {
    name: "Gallbladder (Bile Storage)",
    description: "Pear-shaped bile storage organ",
    equation: (u, v, params) => {
      const a = params.a ?? 0.6;
      const scale = a;
      
      // Pear shape
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // Radius varies with phi (wider at bottom)
      const radius = scale * Math.sin(phi) * (1 + 0.3 * Math.sin(phi));
      
      return [
        radius * Math.cos(theta),
        radius * Math.sin(theta),
        scale * (Math.cos(phi) - 0.5)
      ];
    },
    defaultParams: { 
      a: 0.6,
      uSegments: 48, vSegments: 36
    }
  },

  digestive_enzymes: {
    name: "Digestive Enzyme Field",
    description: "Visualization of enzyme concentration gradient",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // 2D field showing enzyme distribution
      const x = (u - 0.5) * 2 * scale;
      const y = (v - 0.5) * 2 * scale;
      
      // Concentration gradient (Gaussian-like)
      const concentration = scale * 0.3 * Math.exp(-(x * x + y * y) / (scale * scale));
      
      // Add some variation
      const variation = 0.1 * scale * Math.sin(u * 8 * 2 * Math.PI) * Math.sin(v * 8 * 2 * Math.PI);
      
      return [x, y, concentration + variation];
    },
    defaultParams: { 
      a: 1,
      uSegments: 64, vSegments: 64
    }
  },

  // ========================================
  // SKELETAL & MUSCULAR SYSTEM (7 shapes)
  // ========================================

  vertebral_column: {
    name: "Vertebral Column (Spine)",
    description: "33 vertebrae with natural curvature",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 3;
      const scale = a;
      
      // 33 vertebrae along curved spine
      const vertebraNum = Math.floor(u * 33);
      const localU = (u * 33) % 1;
      
      const z = u * b - b / 2;
      
      // Spinal curvature (cervical, thoracic, lumbar, sacral)
      const curvature = 0.2 * scale * Math.sin(u * 3 * Math.PI);
      
      // Individual vertebra shape
      const theta = v * 2 * Math.PI;
      const vertebraRadius = 0.15 * scale * (1 + 0.3 * Math.abs(Math.sin(theta * 3)));
      
      return [
        curvature + vertebraRadius * Math.cos(theta),
        vertebraRadius * Math.sin(theta),
        z
      ];
    },
    defaultParams: { 
      a: 1, b: 3,
      uSegments: 132, vSegments: 24
    }
  },

  rib_cage: {
    name: "Rib Cage (12 Pairs)",
    description: "Thoracic cage with ribs and sternum",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // 12 pairs of ribs
      const ribNum = Math.floor(u * 12);
      const t = (u * 12) % 1;
      
      // Which side (left/right)
      const side = v < 0.5 ? -1 : 1;
      const localV = (v < 0.5 ? v : v - 0.5) * 2;
      
      // Rib curve
      const ribAngle = localV * Math.PI;
      const ribRadius = scale * (1 - ribNum * 0.05);
      
      const x = side * ribRadius * Math.cos(ribAngle);
      const y = ribRadius * Math.sin(ribAngle);
      const z = ribNum * 0.15 * scale - 0.9 * scale;
      
      return [x, y, z];
    },
    defaultParams: { 
      a: 1,
      uSegments: 96, vSegments: 32
    }
  },

  skull_vault: {
    name: "Cranial Vault (Skull Cap)",
    description: "Brain case with sutures",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Dome-shaped cranium
      const theta = u * 2 * Math.PI;
      const phi = v * 0.6 * Math.PI; // Partial sphere (dome)
      
      const radius = scale * Math.sin(phi);
      
      // Suture lines
      const suture = 0.02 * scale * Math.abs(Math.sin(theta * 4)) * Math.sin(phi * 8);
      
      return [
        (radius - suture) * Math.cos(theta),
        (radius - suture) * Math.sin(theta),
        scale * Math.cos(phi)
      ];
    },
    defaultParams: { 
      a: 1,
      uSegments: 64, vSegments: 48
    }
  },

  pelvis_structure: {
    name: "Pelvis (Hip Bone)",
    description: "Pelvic girdle with ilium, ischium, pubis",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Ring-like structure
      const ringAngle = u * 2 * Math.PI;
      const ringRadiusX = scale * 0.8;
      const ringRadiusY = scale * 0.6;
      
      // Asymmetric cross-section
      const theta = v * 2 * Math.PI;
      const sectionRadius = 0.1 * scale * (1 + 0.5 * Math.abs(Math.sin(ringAngle)));
      
      return [
        ringRadiusX * Math.cos(ringAngle) + sectionRadius * Math.cos(theta),
        ringRadiusY * Math.sin(ringAngle) + sectionRadius * Math.sin(theta),
        -0.2 * scale * Math.sin(ringAngle * 2)
      ];
    },
    defaultParams: { 
      a: 1,
      uSegments: 64, vSegments: 24
    }
  },

  femur_section: {
    name: "Femur Cross-Section",
    description: "Long bone showing cortical and trabecular bone",
    equation: (u, v, params) => {
      const a = params.a ?? 0.5;
      const b = params.b ?? 3;
      
      // Long bone with medullary cavity
      const z = u * b;
      const theta = v * 2 * Math.PI;
      
      // Cortical bone (outer) and medullary cavity (inner)
      const outerRadius = a;
      const innerRadius = 0.6 * a;
      
      // Show both layers
      const radius = v < 0.7 ? outerRadius : innerRadius;
      
      return [
        radius * Math.cos(theta),
        radius * Math.sin(theta),
        z
      ];
    },
    defaultParams: { 
      a: 0.5, b: 3,
      uSegments: 64, vSegments: 32
    }
  },

  skeletal_muscle_fiber: {
    name: "Skeletal Muscle Fiber",
    description: "Striated muscle with sarcomeres",
    equation: (u, v, params) => {
      const a = params.a ?? 0.3;
      const b = params.b ?? 3;
      
      // Long fiber with striations
      const z = u * b;
      const theta = v * 2 * Math.PI;
      
      // Striation pattern (A-band, I-band, Z-line)
      const striation = a * (1 - 0.2 * Math.abs(Math.sin(u * 20 * 2 * Math.PI)));
      
      return [
        striation * Math.cos(theta),
        striation * Math.sin(theta),
        z
      ];
    },
    defaultParams: { 
      a: 0.3, b: 3,
      uSegments: 120, vSegments: 20
    }
  },

  tendon_matrix: {
    name: "Tendon Collagen Matrix",
    description: "Parallel collagen fiber bundles",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 2;
      
      // Multiple parallel fibers
      const fiberNum = Math.floor(v * 12);
      const localV = (v * 12) % 1;
      
      const ringAngle = (fiberNum / 12) * 2 * Math.PI;
      const ringRadius = 0.3 * a;
      
      const z = u * b;
      
      // Wave pattern in fiber
      const wave = 0.05 * a * Math.sin(u * 15 * 2 * Math.PI);
      
      return [
        ringRadius * Math.cos(ringAngle) + wave,
        ringRadius * Math.sin(ringAngle),
        z
      ];
    },
    defaultParams: { 
      a: 1, b: 2,
      uSegments: 96, vSegments: 72
    }
  },

  // ========================================
  // SENSORY ORGANS (7 shapes)
  // ========================================

  retina_layers: {
    name: "Retinal Layers (10 Layers)",
    description: "Layered structure of the retina",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // 10 distinct layers
      const layerNum = Math.floor(u * 10);
      const localU = (u * 10) % 1;
      
      // Curved retinal surface
      const angle = v * Math.PI;
      const radius = scale;
      
      const layerDepth = layerNum * 0.02 * scale;
      
      return [
        (radius - layerDepth) * Math.cos(angle),
        (radius - layerDepth) * Math.sin(angle),
        localU * 0.1 * scale
      ];
    },
    defaultParams: { 
      a: 1,
      uSegments: 80, vSegments: 48
    }
  },

  optic_nerve: {
    name: "Optic Nerve Bundle",
    description: "Bundle of ~1.2 million nerve fibers",
    equation: (u, v, params) => {
      const a = params.a ?? 0.3;
      const b = params.b ?? 2;
      
      // Cylindrical bundle
      const z = u * b;
      const theta = v * 2 * Math.PI;
      
      // Dense fiber packing pattern
      const fiberPattern = 0.02 * a * (
        Math.sin(v * 50 * 2 * Math.PI) +
        Math.sin(v * 73 * 2 * Math.PI)
      );
      
      const radius = a + fiberPattern;
      
      return [
        radius * Math.cos(theta),
        radius * Math.sin(theta),
        z
      ];
    },
    defaultParams: { 
      a: 0.3, b: 2,
      uSegments: 64, vSegments: 96
    }
  },

  cochlea_spiral: {
    name: "Cochlea (Inner Ear Spiral)",
    description: "2.5 turn spiral for sound processing",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // 2.5 turn spiral
      const turns = 2.5;
      const angle = u * turns * 2 * Math.PI;
      
      // Tapering spiral radius
      const spiralRadius = scale * (1 - u * 0.7);
      
      // Tubular cross-section
      const tubeAngle = v * 2 * Math.PI;
      const tubeRadius = 0.1 * scale * (1 - u * 0.5);
      
      const centerX = spiralRadius * Math.cos(angle);
      const centerY = spiralRadius * Math.sin(angle);
      
      return [
        centerX + tubeRadius * Math.cos(tubeAngle) * Math.cos(angle),
        centerY + tubeRadius * Math.cos(tubeAngle) * Math.sin(angle),
        u * 0.8 * scale + tubeRadius * Math.sin(tubeAngle)
      ];
    },
    defaultParams: { 
      a: 1,
      uSegments: 128, vSegments: 24
    }
  },

  semicircular_canals: {
    name: "Semicircular Canals (Balance)",
    description: "Three perpendicular balance sensors",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Three orthogonal loops
      const canalNum = Math.floor(u * 3);
      const t = (u * 3) % 1;
      
      const loopAngle = t * 2 * Math.PI;
      const loopRadius = 0.6 * scale;
      
      const tubeAngle = v * 2 * Math.PI;
      const tubeRadius = 0.08 * scale;
      
      let x, y, z;
      
      if (canalNum === 0) {
        // Horizontal canal
        x = loopRadius * Math.cos(loopAngle) + tubeRadius * Math.cos(tubeAngle);
        y = loopRadius * Math.sin(loopAngle) + tubeRadius * Math.sin(tubeAngle);
        z = 0;
      } else if (canalNum === 1) {
        // Anterior canal
        x = loopRadius * Math.cos(loopAngle) + tubeRadius * Math.cos(tubeAngle);
        y = 0;
        z = loopRadius * Math.sin(loopAngle) + tubeRadius * Math.sin(tubeAngle);
      } else {
        // Posterior canal
        x = 0;
        y = loopRadius * Math.cos(loopAngle) + tubeRadius * Math.cos(tubeAngle);
        z = loopRadius * Math.sin(loopAngle) + tubeRadius * Math.sin(tubeAngle);
      }
      
      return [x, y, z];
    },
    defaultParams: { 
      a: 1,
      uSegments: 192, vSegments: 16
    }
  },

  olfactory_epithelium: {
    name: "Olfactory Epithelium (Smell Sensors)",
    description: "Nasal sensory tissue with cilia",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Curved epithelial surface with cilia projections
      const x = (u - 0.5) * 2 * scale;
      const y = (v - 0.5) * 2 * scale;
      
      // Base surface (turbinate shape)
      const baseSurface = 0.2 * scale * Math.sin(u * 3 * Math.PI);
      
      // Cilia projections
      const cilia = 0.15 * scale * Math.abs(Math.sin(u * 20 * 2 * Math.PI) * Math.sin(v * 20 * 2 * Math.PI));
      
      return [x, y, baseSurface + cilia];
    },
    defaultParams: { 
      a: 1,
      uSegments: 80, vSegments: 80
    }
  },

  taste_buds: {
    name: "Taste Bud Cluster",
    description: "Gustatory receptors on tongue",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Multiple taste buds (onion-shaped structures)
      const budNum = Math.floor(u * 10);
      const localU = (u * 10) % 1;
      
      // Cluster arrangement
      const clusterAngle = (budNum / 10) * 2 * Math.PI;
      const clusterRadius = 0.6 * scale;
      
      const centerX = clusterRadius * Math.cos(clusterAngle);
      const centerY = clusterRadius * Math.sin(clusterAngle);
      
      // Individual bud (elongated sphere)
      const theta = localU * 2 * Math.PI;
      const phi = v * Math.PI;
      const budRadiusXY = 0.08 * scale;
      const budRadiusZ = 0.15 * scale;
      
      return [
        centerX + budRadiusXY * Math.sin(phi) * Math.cos(theta),
        centerY + budRadiusXY * Math.sin(phi) * Math.sin(theta),
        budRadiusZ * Math.cos(phi)
      ];
    },
    defaultParams: { 
      a: 1,
      uSegments: 80, vSegments: 32
    }
  },

  skin_receptors: {
    name: "Skin Mechanoreceptors",
    description: "Touch sensors (Meissner, Pacinian corpuscles)",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const scale = a;
      
      // Field of various receptor types
      const receptorNum = Math.floor(u * 15);
      const localU = (u * 15) % 1;
      
      // Random-like distribution
      const posX = scale * Math.cos(receptorNum * 2.7);
      const posY = scale * Math.sin(receptorNum * 1.9);
      
      // Receptor shape (capsule)
      const theta = localU * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const receptorRadius = 0.1 * scale;
      
      return [
        posX + receptorRadius * Math.sin(phi) * Math.cos(theta),
        posY + receptorRadius * Math.sin(phi) * Math.sin(theta),
        receptorRadius * Math.cos(phi)
      ];
    },
    defaultParams: { 
      a: 1,
      uSegments: 120, vSegments: 24
    }
  }

};

export const ANATOMY_SHAPE_COUNT = Object.keys(HUMAN_ANATOMY_SHAPES).length;
