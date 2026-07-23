
/**
 * LIFE SCIENCES PARAMETRIC SHAPES
 * Comprehensive implementation covering molecular biology, microbiology, botany, and ecology
 * © 2025 UUON Foundation Inc.
 */

import { ParametricSurface, getCleanDefaults } from '../types/shapes';

export const LIFE_SCIENCES_SHAPES: Record<string, ParametricSurface> = {

  // 🧬 MOLECULAR BIOLOGY
  protein_folding_landscape: {
    name: "🧬 Protein Folding Energy Landscape",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const b = params.e ?? 2;
      const c = params.f ?? 1.5;
      
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      
      // Complex energy landscape with multiple minima
      const native_fold = Math.exp(-((x - 1)*(x - 1) + (y - 0.5)*(y - 0.5)) * 2);
      const misfolded = Math.exp(-((x + 0.8)*(x + 0.8) + (y + 1)*(y + 1)) * 1.5);
      const intermediate = Math.exp(-((x - 0.2)*(x - 0.2) + (y + 0.3)*(y + 0.3)) * 3);
      
      const energy = -b * (native_fold + 0.6 * misfolded + 0.8 * intermediate);
      const folding_barrier = c * Math.sin(u * 4 * Math.PI) * Math.sin(v * 3 * Math.PI) * 0.3;
      
      return [x, y, energy + folding_barrier];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 2, f: 1.5, uSegments: 80, vSegments: 80 })
  },

  crispr_cas9_mechanism: {
    name: "🧬 CRISPR-Cas9 DNA Cutting Mechanism", 
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const d = params.g ?? 0; // Animation time
      
      const t = u * 4 * Math.PI; // DNA helix parameter
      const height = (v - 0.5) * a * 3;
      
      // Double helix with cut site
      const cut_position = Math.PI * (1 + 0.3 * Math.sin(d * 2));
      const cut_width = 0.5;
      
      let radius = 0.8 * a;
      if (Math.abs(t - cut_position) < cut_width) {
        // CRISPR cut site - DNA strands separated
        const cut_factor = 1 + 2 * Math.exp(-Math.pow(t - cut_position, 2) / (cut_width * 0.3));
        radius *= cut_factor;
      }
      
      // Cas9 protein binding (larger structure at cut site)
      const cas9_binding = Math.abs(t - cut_position) < cut_width * 2 ? 
        0.4 * a * Math.exp(-Math.pow(t - cut_position, 2) / cut_width) : 0;
      
      const strand = v < 0.5 ? 1 : -1;
      const x = radius * Math.cos(t) + cas9_binding * Math.cos(t + Math.PI/2);
      const y = radius * Math.sin(t) + cas9_binding * Math.sin(t + Math.PI/2);
      const z = height + strand * 0.3 * a * Math.sin(t * 10.5/2/Math.PI);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, g: 0, uSegments: 120, vSegments: 32 })
  },

  metabolic_pathway_network: {
    name: "🧬 Metabolic Pathway Network",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const b = params.e ?? 1.5;
      
      // Network of metabolic reactions
      const pathway_num = Math.floor(u * 8); // 8 major pathways
      const reaction_step = v;
      
      const pathway_angle = (pathway_num / 8) * 2 * Math.PI;
      const pathway_radius = a * (0.5 + 0.5 * Math.sin(pathway_angle * 1.5));
      
      // Reaction progression along pathway
      const step_angle = pathway_angle + reaction_step * Math.PI * 0.5;
      const step_radius = pathway_radius + b * 0.3 * Math.sin(reaction_step * 6 * Math.PI);
      
      const x = step_radius * Math.cos(step_angle);
      const y = step_radius * Math.sin(step_angle);
      const z = b * Math.sin(reaction_step * 4 * Math.PI) * 0.5; // Enzyme activity profile
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1.5, uSegments: 96, vSegments: 48 })
  },

  // 🦠 MICROBIOLOGY
  bacterial_growth_curve: {
    name: "🦠 Bacterial Growth Dynamics",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 0.8;
      
      const time = u * 10; // Growth time
      const population_z = v; // Population depth
      
      // Logistic growth curve with phases
      let growth_rate;
      if (time < 1) {
        // Lag phase
        growth_rate = 0.1 * time;
      } else if (time < 5) {
        // Exponential phase
        growth_rate = Math.exp((time - 1) * 0.8);
      } else if (time < 8) {
        // Stationary phase transition
        const carrying_capacity = 50;
        growth_rate = carrying_capacity / (1 + Math.exp(-0.8 * (time - 6)));
      } else {
        // Death phase
        growth_rate = 50 * Math.exp(-(time - 8) * 0.3);
      }
      
      const population = growth_rate * b;
      const nutrients = a * Math.max(0, 1 - time * 0.1); // Nutrient depletion
      
      const x = time * a * 0.5;
      const y = population_z * c;
      const z = population + nutrients * 0.3;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, f: 0.8, uSegments: 64, vSegments: 32 })
  },

  virus_replication_cycle: {
    name: "🦠 Virus Replication Cycle",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const d = params.g ?? 0; // Cycle phase
      
      const cycle_phase = u; // 0 to 1: attachment → release
      const viral_angle = v * 2 * Math.PI;
      
      let radius, height, viral_load;
      
      if (cycle_phase < 0.2) {
        // Attachment phase
        radius = a * 0.8;
        height = 0.2 * a * cycle_phase * 5;
        viral_load = 1;
      } else if (cycle_phase < 0.4) {
        // Entry and uncoating
        const entry_progress = (cycle_phase - 0.2) / 0.2;
        radius = a * (0.8 - 0.3 * entry_progress);
        height = 0.2 * a + entry_progress * 0.3 * a;
        viral_load = 1 - 0.8 * entry_progress;
      } else if (cycle_phase < 0.7) {
        // Replication and assembly
        const replication_progress = (cycle_phase - 0.4) / 0.3;
        radius = a * (0.5 + 0.4 * replication_progress);
        height = 0.5 * a;
        viral_load = 0.2 + 30 * replication_progress; // Exponential replication
      } else {
        // Release (lysis)
        const release_progress = (cycle_phase - 0.7) / 0.3;
        radius = a * (0.9 + 1.5 * release_progress);
        height = 0.5 * a * (1 - release_progress);
        viral_load = 30 * (1 + release_progress);
      }
      
      const virus_size = Math.log(viral_load + 1) * 0.1 * a;
      const x = (radius + virus_size) * Math.cos(viral_angle);
      const y = (radius + virus_size) * Math.sin(viral_angle);
      const z = height;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, g: 0, uSegments: 80, vSegments: 60 })
  },

  // 🌱 BOTANY & PLANT SCIENCE
  photosynthesis_light_reactions: {
    name: "🌱 Photosynthesis Light Reaction Centers",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1.5;
      const e = params.h ?? 0; // Light intensity
      
      const membrane_pos = u * 2 * Math.PI; // Position along thylakoid membrane
      const depth = (v - 0.5) * a; // Membrane depth
      
      // Photosystem II and I complexes
      const psii_activity = Math.exp(-Math.pow(membrane_pos - Math.PI * 0.3, 2)) * (1 + e);
      const psi_activity = Math.exp(-Math.pow(membrane_pos - Math.PI * 1.7, 2)) * (1 + e * 0.8);
      
      // Electron transport chain
      const electron_flow = b * (psii_activity + psi_activity) * Math.sin(membrane_pos * 3);
      
      // ATP synthesis sites
      const atp_synthesis = 0.5 * b * Math.sin(membrane_pos * 8) * (psii_activity + psi_activity);
      
      const x = a * Math.cos(membrane_pos);
      const y = a * Math.sin(membrane_pos);
      const z = depth + electron_flow * 0.3 + atp_synthesis * 0.2;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1.5, h: 0, uSegments: 96, vSegments: 40 })
  },

  root_system_architecture: {
    name: "🌱 Root System Architecture",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const b = params.e ?? 2;
      const c = params.f ?? 1;
      
      const branch_level = Math.floor(u * 4); // Root branching level
      const growth_direction = v * 2 * Math.PI;
      
      // Fractal branching pattern
      const branch_length = a * Math.pow(0.7, branch_level);
      const branch_thickness = c * Math.pow(0.5, branch_level);
      
      // Gravitropism (downward growth bias)
      const gravity_bias = Math.PI * 0.5 + 0.3 * Math.sin(growth_direction) * Math.pow(0.8, branch_level);
      
      // Nutrient/water seeking (chemotropism)
      const nutrient_gradient = 0.2 * Math.sin(growth_direction * 2 + branch_level);
      
      const x = branch_length * Math.sin(gravity_bias + nutrient_gradient) * Math.cos(growth_direction);
      const y = branch_length * Math.sin(gravity_bias + nutrient_gradient) * Math.sin(growth_direction);
      const z = -branch_length * Math.cos(gravity_bias + nutrient_gradient) - branch_level * b * 0.3;
      
      return [x + branch_thickness, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 2, f: 1, uSegments: 72, vSegments: 48 })
  },

  // 🐛 ECOLOGY & ZOOLOGY
  population_dynamics_model: {
    name: "🐛 Population Dynamics (Lotka-Volterra)",
    equation: (u, v, params) => {
      const a = params.d ?? 2; // Prey growth rate
      const b = params.e ?? 1; // Predation rate
      const c = params.f ?? 1.5; // Predator efficiency
      const d = params.g ?? 0.8; // Predator death rate
      
      const time_scale = u * 10; // Time evolution
      const initial_prey = 5 + v * 3; // Initial prey population
      const initial_pred = 2 + (1-v) * 2; // Initial predator population
      
      // Lotka-Volterra equations (simplified integration)
      const prey_pop = initial_prey * (1 + a * Math.sin(time_scale * 0.5) - 
                       b * initial_pred * 0.1 * Math.sin(time_scale * 0.3 + Math.PI/4));
      
      const pred_pop = initial_pred * (1 + c * initial_prey * 0.05 * Math.sin(time_scale * 0.3) -
                       d * Math.sin(time_scale * 0.5 + Math.PI/2));
      
      // Phase space representation
      const x = Math.max(0, prey_pop);
      const y = Math.max(0, pred_pop);
      const z = time_scale * 0.3; // Time axis
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, f: 1.5, g: 0.8, uSegments: 80, vSegments: 40 })
  },

  ecosystem_energy_flow: {
    name: "🐛 Ecosystem Energy Flow Pyramid",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const b = params.e ?? 2;
      
      const trophic_level = Math.floor(v * 4);
      const position = u * 2 * Math.PI;
      
      const energy_efficiency = 0.1;
      const base_energy = 1000;
      const level_energy = base_energy * Math.pow(energy_efficiency, trophic_level);
      
      const level_radius = a * Math.pow(0.6, trophic_level);
      const level_height = trophic_level * b * 0.5;
      const energy_density = Math.log(level_energy + 1) * 0.1;
      
      const x = (level_radius + energy_density) * Math.cos(position);
      const y = (level_radius + energy_density) * Math.sin(position);
      const z = level_height + energy_density * 0.3;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 2, uSegments: 64, vSegments: 32 })
  },

  antibiotic_resistance_evolution: {
    name: "🦠 Antibiotic Resistance Evolution",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const b = params.e ?? 2;
      const generation = u * 100;
      const mutation_rate = v;
      const resistance_level = a * (1 - Math.exp(-mutation_rate * generation * 0.05));
      const population_fitness = b * Math.sin(generation * 0.1) * (1 + resistance_level * 0.3);
      const x = generation * 0.05;
      const y = resistance_level;
      const z = population_fitness;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 2, uSegments: 80, vSegments: 40 })
  },

  biodiversity_landscape: {
    name: "🐛 Biodiversity Landscape",
    equation: (u, v, params) => {
      const a = params.d ?? 4;
      const b = params.e ?? 2;
      const lat = (u - 0.5) * Math.PI;
      const lon = v * 2 * Math.PI;
      const tropical_diversity = Math.exp(-lat * lat * 4) * a;
      const habitat_complexity = b * Math.sin(lon * 3) * Math.cos(lat * 2);
      const x = (a + habitat_complexity * 0.3) * Math.cos(lat) * Math.cos(lon);
      const y = (a + habitat_complexity * 0.3) * Math.cos(lat) * Math.sin(lon);
      const z = (a + tropical_diversity * 0.5) * Math.sin(lat);
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 2, uSegments: 72, vSegments: 72 })
  },

  biofilm_structure: {
    name: "🦠 Biofilm Structure",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const b = params.e ?? 1.5;
      const theta = u * 2 * Math.PI;
      const height = v * a;
      const colony_clusters = Math.sin(theta * 5) * Math.sin(height * 3) * 0.3;
      const matrix_density = 0.8 + 0.2 * Math.sin(theta * 8 + height * 4);
      const r = b * (1 + colony_clusters) * matrix_density;
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = height + colony_clusters * 0.5;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1.5, uSegments: 80, vSegments: 60 })
  },

  enzyme_kinetics_surface: {
    name: "🧬 Enzyme Kinetics Surface",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const b = params.e ?? 2;
      const substrate = u * 10;
      const inhibitor = v * 5;
      const Km = 2;
      const Vmax = a;
      const Ki = 3;
      const velocity = (Vmax * substrate) / (Km * (1 + inhibitor/Ki) + substrate);
      const x = substrate * 0.5;
      const y = inhibitor * 0.5;
      const z = velocity * b;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 2, uSegments: 60, vSegments: 60 })
  },

  food_web_visualization: {
    name: "🐛 Food Web Network",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const b = params.e ?? 2;
      const trophic = Math.floor(v * 4);
      const species = u * 2 * Math.PI * (5 - trophic);
      const r = a * (1 - trophic * 0.2);
      const connection_strength = b * Math.sin(species * 3) * 0.2;
      const x = r * Math.cos(species) + connection_strength;
      const y = r * Math.sin(species) + connection_strength;
      const z = trophic * 1.5;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 2, uSegments: 80, vSegments: 40 })
  },

  leaf_venation_pattern: {
    name: "🌱 Leaf Venation Pattern",
    equation: (u, v, params) => {
      const a = params.d ?? 4;
      const b = params.e ?? 2;
      const leaf_x = (u - 0.5) * 2 * a;
      const leaf_y = (v - 0.5) * 2 * b;
      const leaf_shape = Math.exp(-leaf_x*leaf_x*0.1 - leaf_y*leaf_y*0.3);
      const midrib = Math.exp(-leaf_x*leaf_x*10) * 0.2;
      const secondary_veins = Math.sin(leaf_y * 8) * Math.exp(-Math.abs(leaf_x)*2) * 0.1;
      const tertiary_veins = Math.sin(leaf_x * 15 + leaf_y * 15) * 0.02;
      const z = leaf_shape * (midrib + secondary_veins + tertiary_veins);
      return [leaf_x, leaf_y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 2, uSegments: 100, vSegments: 80 })
  },

  phage_therapy_dynamics: {
    name: "🦠 Phage Therapy Dynamics",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const b = params.e ?? 2;
      const time = u * 24;
      const phage_dose = v * 10;
      const bacteria = a * Math.exp(-phage_dose * 0.1 * time * 0.05) * (1 + Math.sin(time * 0.5));
      const phage_pop = b * phage_dose * Math.exp(-time * 0.02) * (1 + 0.3*Math.sin(time));
      const x = time * 0.2;
      const y = bacteria;
      const z = phage_pop;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 2, uSegments: 72, vSegments: 48 })
  },

  phloem_transport_system: {
    name: "🌱 Phloem Transport System",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const b = params.e ?? 1;
      const vessel_angle = u * 2 * Math.PI;
      const height = v * a * 3;
      const sieve_tube_r = b * (1 + 0.1*Math.sin(height * 10));
      const companion_cells = 0.2 * Math.sin(vessel_angle * 6) * Math.cos(height * 5);
      const x = sieve_tube_r * Math.cos(vessel_angle) + companion_cells;
      const y = sieve_tube_r * Math.sin(vessel_angle) + companion_cells;
      const z = height;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1, uSegments: 64, vSegments: 80 })
  },

  predator_prey_dynamics: {
    name: "🐛 Predator-Prey Dynamics",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const b = params.e ?? 2;
      const time = u * 20;
      const initial_ratio = v + 0.1;
      const prey = a * (1 + 0.8*Math.sin(time * 0.5)) * Math.exp(-0.01*time);
      const predator = b * initial_ratio * (1 + 0.8*Math.sin(time * 0.5 - Math.PI/4)) * Math.exp(-0.005*time);
      const x = prey;
      const y = predator;
      const z = time * 0.2;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 2, uSegments: 80, vSegments: 40 })
  },

  ribosome_structure: {
    name: "🧬 Ribosome Structure",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1.5;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const large_subunit = a * (1 + 0.3*Math.sin(3*theta)*Math.cos(2*phi));
      const small_subunit = b * 0.7 * (1 + 0.2*Math.sin(4*theta)*Math.cos(3*phi));
      const r = (v > 0.5) ? large_subunit : small_subunit;
      const cleft = -0.2 * Math.exp(-Math.pow(phi - Math.PI*0.5, 2) * 10);
      const x = (r + cleft) * Math.sin(phi) * Math.cos(theta);
      const y = (r + cleft) * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + (v > 0.5 ? 0.5 : -0.3);
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1.5, uSegments: 72, vSegments: 72 })
  },

  rna_secondary_structure: {
    name: "🧬 RNA Secondary Structure",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const b = params.e ?? 0.5;
      const nucleotide = u * 100;
      const structure_type = v;
      const helix_radius = b * (1 + 0.3*Math.sin(nucleotide * 0.3));
      const helix_angle = nucleotide * 0.3;
      const bulge = structure_type * Math.sin(nucleotide * 0.1) * 0.5;
      const loop = (structure_type > 0.7) ? Math.sin(nucleotide * 0.5) * 0.8 : 0;
      const x = helix_radius * Math.cos(helix_angle) + bulge;
      const y = helix_radius * Math.sin(helix_angle) + loop;
      const z = nucleotide * a * 0.03;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 0.5, uSegments: 100, vSegments: 40 })
  }
};

export default LIFE_SCIENCES_SHAPES;
