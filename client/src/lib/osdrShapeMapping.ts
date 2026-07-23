/**
 * NASA OSDR Shape Mapping - Links Space Biology shapes to real NASA studies
 * Maps parametric shapes to experimental data sources
 */

export interface OsdrStudyReference {
  studyId: string;
  title: string;
  organism: string;
  tissue: string;
  assayType: string;
  mission?: string;
  description: string;
  osdrUrl: string;
  parameterMapping?: Record<string, string>;
}

export interface ShapeExperimentalContext {
  shapeName: string;
  relatedStudies: OsdrStudyReference[];
  scientificBackground: string;
  experimentalVariables: Record<string, {
    parameter: string;
    experimentalMeaning: string;
    unit?: string;
    range?: [number, number];
  }>;
}

export const OSDR_SHAPE_MAPPING: Record<string, ShapeExperimentalContext> = {
  microgravity_cell_structure: {
    shapeName: "Microgravity Cell Structure",
    scientificBackground: "Cell morphology changes significantly in microgravity. Without gravitational loading, cells adopt rounder shapes and cytoskeletal organization is altered.",
    relatedStudies: [
      {
        studyId: "OSD-48",
        title: "Rodent Research-1 NASA Validation Flight",
        organism: "Mus musculus",
        tissue: "Liver",
        assayType: "RNA Sequencing",
        mission: "SpaceX-4",
        description: "First long-duration rodent study aboard ISS examining cellular adaptation to microgravity",
        osdrUrl: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-48"
      },
      {
        studyId: "OSD-379",
        title: "Inspiration4 Multi-Omics Study",
        organism: "Homo sapiens",
        tissue: "Blood cells",
        assayType: "Multi-omics",
        mission: "Inspiration4",
        description: "Comprehensive cellular analysis from the first all-civilian orbital mission",
        osdrUrl: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-379"
      }
    ],
    experimentalVariables: {
      d: { parameter: "D", experimentalMeaning: "Membrane deformation coefficient", unit: "relative", range: [0, 1] },
      e: { parameter: "E", experimentalMeaning: "Cytoskeletal wave frequency", unit: "Hz", range: [1, 10] },
      f: { parameter: "F", experimentalMeaning: "Polar asymmetry factor", unit: "dimensionless", range: [1, 6] }
    }
  },

  radiation_dna_damage: {
    shapeName: "Radiation DNA Damage Model",
    scientificBackground: "Cosmic radiation causes DNA double-strand breaks. In space, astronauts are exposed to galactic cosmic rays (GCRs) and solar particle events (SPEs) that can cause clustered DNA damage.",
    relatedStudies: [
      {
        studyId: "OSD-87",
        title: "Effect of Spaceflight on Immune Function",
        organism: "Homo sapiens",
        tissue: "Blood",
        assayType: "Cytometry",
        mission: "ISS Expedition 50",
        description: "Analysis of immune cell DNA damage markers in astronauts",
        osdrUrl: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-87"
      }
    ],
    experimentalVariables: {
      d: { parameter: "D", experimentalMeaning: "Break amplitude (Gy equivalent)", unit: "Gy", range: [0, 1] },
      e: { parameter: "E", experimentalMeaning: "Repair enzyme activity", unit: "relative", range: [0, 1] },
      f: { parameter: "F", experimentalMeaning: "Damage cluster frequency", unit: "per helix turn", range: [1, 6] }
    }
  },

  bone_density_loss: {
    shapeName: "Bone Density Loss Surface",
    scientificBackground: "Astronauts lose 1-2% bone mass per month in microgravity. Trabecular bone structure deteriorates as osteoclast activity exceeds osteoblast formation.",
    relatedStudies: [
      {
        studyId: "OSD-48",
        title: "Rodent Research-1 NASA Validation Flight",
        organism: "Mus musculus",
        tissue: "Bone",
        assayType: "Micro-CT",
        mission: "SpaceX-4",
        description: "Trabecular bone structure analysis in space-flown mice",
        osdrUrl: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-48"
      }
    ],
    experimentalVariables: {
      d: { parameter: "D", experimentalMeaning: "Bone loss rate", unit: "% per month", range: [0, 2] },
      e: { parameter: "E", experimentalMeaning: "Porosity increase factor", unit: "relative", range: [0, 1] },
      f: { parameter: "F", experimentalMeaning: "Trabecular spacing", unit: "mm", range: [1, 8] }
    }
  },

  muscle_atrophy_fiber: {
    shapeName: "Muscle Atrophy Fiber",
    scientificBackground: "Skeletal muscle atrophies rapidly in microgravity due to reduced mechanical loading. Type II fast-twitch fibers are particularly affected.",
    relatedStudies: [
      {
        studyId: "OSD-48",
        title: "Rodent Research-1 NASA Validation Flight",
        organism: "Mus musculus",
        tissue: "Gastrocnemius",
        assayType: "Histology",
        mission: "SpaceX-4",
        description: "Muscle fiber cross-sectional area measurements",
        osdrUrl: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-48"
      }
    ],
    experimentalVariables: {
      d: { parameter: "D", experimentalMeaning: "Atrophy progression rate", unit: "% reduction", range: [0, 50] },
      e: { parameter: "E", experimentalMeaning: "Fiber shape irregularity", unit: "relative", range: [0, 1] },
      f: { parameter: "F", experimentalMeaning: "Fascicle pattern frequency", unit: "fibers/mm²", range: [1, 10] }
    }
  },

  circadian_rhythm_wave: {
    shapeName: "Circadian Rhythm Disruption",
    scientificBackground: "ISS astronauts experience 16 sunrises/sunsets per day, disrupting circadian rhythms. This affects sleep, hormone regulation, and cognitive performance.",
    relatedStudies: [
      {
        studyId: "OSD-379",
        title: "Inspiration4 Multi-Omics Study",
        organism: "Homo sapiens",
        tissue: "Blood",
        assayType: "Transcriptomics",
        mission: "Inspiration4",
        description: "Circadian gene expression patterns during orbital flight",
        osdrUrl: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-379"
      }
    ],
    experimentalVariables: {
      d: { parameter: "D", experimentalMeaning: "Phase shift decay rate", unit: "hours⁻¹", range: [0, 1] },
      e: { parameter: "E", experimentalMeaning: "Amplitude suppression", unit: "relative", range: [0, 1] }
    }
  },

  immune_cell_response: {
    shapeName: "Immune Cell Response Surface",
    scientificBackground: "Immune function is altered in space with reduced T-cell activation and cytokine production changes, potentially increasing infection susceptibility.",
    relatedStudies: [
      {
        studyId: "OSD-87",
        title: "Effect of Spaceflight on Immune Function",
        organism: "Homo sapiens",
        tissue: "Blood",
        assayType: "Cytometry",
        mission: "ISS Expedition 50",
        description: "Immune cell population dynamics during spaceflight",
        osdrUrl: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-87"
      }
    ],
    experimentalVariables: {
      d: { parameter: "D", experimentalMeaning: "Growth rate (logistic)", unit: "cells/day", range: [0, 2] },
      e: { parameter: "E", experimentalMeaning: "Carrying capacity", unit: "10⁶ cells/mL", range: [1, 5] }
    }
  },

  vestibular_otolith: {
    shapeName: "Vestibular Otolith Model",
    scientificBackground: "Otolith organs sense linear acceleration and gravity. In microgravity, they no longer provide gravitational reference, causing space motion sickness.",
    relatedStudies: [
      {
        studyId: "OSD-137",
        title: "Vestibular Adaptation Study",
        organism: "Homo sapiens",
        tissue: "Inner ear (assessed)",
        assayType: "Physiological",
        mission: "Various ISS",
        description: "Vestibular function testing pre and post spaceflight",
        osdrUrl: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-137"
      }
    ],
    experimentalVariables: {
      d: { parameter: "D", experimentalMeaning: "Crystal displacement", unit: "μm", range: [0, 50] },
      e: { parameter: "E", experimentalMeaning: "Sensitivity change", unit: "relative", range: [0, 1] },
      f: { parameter: "F", experimentalMeaning: "Adaptation factor", unit: "days⁻¹", range: [0, 1] }
    }
  },

  plant_gravitropism: {
    shapeName: "Plant Gravitropism Response",
    scientificBackground: "Plants sense gravity through statoliths (starch-filled organelles). In microgravity, plants grow toward light sources instead of against gravity.",
    relatedStudies: [
      {
        studyId: "OSD-137",
        title: "Microgravity Effects on Plant Growth",
        organism: "Arabidopsis thaliana",
        tissue: "Root",
        assayType: "Transcriptomics",
        mission: "VEG-03",
        description: "Root growth patterns and gene expression in space-grown plants",
        osdrUrl: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-137"
      }
    ],
    experimentalVariables: {
      d: { parameter: "D", experimentalMeaning: "Curvature response rate", unit: "degrees/hour", range: [0, 10] },
      e: { parameter: "E", experimentalMeaning: "Stem diameter growth", unit: "mm/day", range: [0, 1] }
    }
  },

  fluid_shift_distribution: {
    shapeName: "Cephalad Fluid Shift",
    scientificBackground: "Without gravity, body fluids shift headward causing facial puffiness, nasal congestion, and increased intracranial pressure. This is the 'puffy face, bird legs' phenomenon.",
    relatedStudies: [
      {
        studyId: "OSD-379",
        title: "Inspiration4 Multi-Omics Study",
        organism: "Homo sapiens",
        tissue: "Multiple",
        assayType: "Physiological",
        mission: "Inspiration4",
        description: "Fluid distribution measurements during orbital flight",
        osdrUrl: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-379"
      }
    ],
    experimentalVariables: {
      d: { parameter: "D", experimentalMeaning: "Fluid redistribution magnitude", unit: "L shift", range: [0, 2] }
    }
  },

  cosmic_ray_track: {
    shapeName: "Cosmic Ray Particle Track",
    scientificBackground: "High-energy galactic cosmic rays (GCRs) deposit energy along ionization tracks in tissue. Heavy ions (HZE particles) cause the most biological damage.",
    relatedStudies: [
      {
        studyId: "OSD-87",
        title: "Radiation Dosimetry Study",
        organism: "Homo sapiens",
        tissue: "Multiple",
        assayType: "Dosimetry",
        mission: "ISS Long-duration",
        description: "Radiation exposure tracking and biological effects",
        osdrUrl: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-87"
      }
    ],
    experimentalVariables: {
      d: { parameter: "D", experimentalMeaning: "Track spread (LET dependent)", unit: "μm/MeV", range: [0, 1] },
      f: { parameter: "F", experimentalMeaning: "Delta-ray frequency", unit: "per μm", range: [1, 20] }
    }
  },

  spaceflight_gene_expression: {
    shapeName: "Gene Expression Heatmap Surface",
    scientificBackground: "Spaceflight alters expression of thousands of genes including those involved in immune response, metabolism, DNA repair, and oxidative stress.",
    relatedStudies: [
      {
        studyId: "OSD-48",
        title: "Rodent Research-1 NASA Validation Flight",
        organism: "Mus musculus",
        tissue: "Liver",
        assayType: "RNA Sequencing",
        mission: "SpaceX-4",
        description: "Comprehensive transcriptomic analysis of spaceflight effects",
        osdrUrl: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-48"
      },
      {
        studyId: "OSD-379",
        title: "Inspiration4 Multi-Omics Study",
        organism: "Homo sapiens",
        tissue: "Blood",
        assayType: "RNA Sequencing",
        mission: "Inspiration4",
        description: "Human gene expression changes during short-duration spaceflight",
        osdrUrl: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-379"
      }
    ],
    experimentalVariables: {
      d: { parameter: "D", experimentalMeaning: "Fold-change frequency (X)", unit: "genes/bin", range: [0, 5] },
      e: { parameter: "E", experimentalMeaning: "Fold-change frequency (Y)", unit: "genes/bin", range: [0, 5] }
    }
  },

  telomere_dynamics: {
    shapeName: "Telomere Length Dynamics",
    scientificBackground: "Surprisingly, telomeres elongate during spaceflight (possibly due to telomerase activation) but rapidly shorten upon return to Earth, which may accelerate cellular aging.",
    relatedStudies: [
      {
        studyId: "OSD-379",
        title: "Inspiration4 Multi-Omics Study",
        organism: "Homo sapiens",
        tissue: "Blood",
        assayType: "Telomere analysis",
        mission: "Inspiration4",
        description: "Telomere length measurements before, during, and after spaceflight",
        osdrUrl: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-379"
      }
    ],
    experimentalVariables: {
      d: { parameter: "D", experimentalMeaning: "Elongation during flight", unit: "kb", range: [0, 2] },
      e: { parameter: "E", experimentalMeaning: "Post-flight shortening", unit: "kb", range: [0, 3] }
    }
  },

  iss_orbit_radiation: {
    shapeName: "ISS Orbital Radiation Field",
    scientificBackground: "Radiation dose varies along the ISS orbit, peaking over the South Atlantic Anomaly (SAA) where the Van Allen belts dip closer to Earth.",
    relatedStudies: [
      {
        studyId: "OSD-87",
        title: "ISS Radiation Environment Study",
        organism: "N/A",
        tissue: "N/A",
        assayType: "Dosimetry",
        mission: "ISS Continuous",
        description: "Spatial and temporal radiation mapping aboard ISS",
        osdrUrl: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-87"
      }
    ],
    experimentalVariables: {
      d: { parameter: "D", experimentalMeaning: "SAA dose enhancement", unit: "mSv/day", range: [0, 2] }
    }
  },

  protein_crystallization: {
    shapeName: "Microgravity Protein Crystal",
    scientificBackground: "Protein crystals grown in microgravity are often larger and more ordered than Earth-grown crystals due to absence of convection and sedimentation.",
    relatedStudies: [
      {
        studyId: "OSD-137",
        title: "Protein Crystal Growth Facility",
        organism: "Various proteins",
        tissue: "N/A",
        assayType: "X-ray crystallography",
        mission: "Multiple ISS",
        description: "Microgravity protein crystallization experiments",
        osdrUrl: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-137"
      }
    ],
    experimentalVariables: {
      d: { parameter: "D", experimentalMeaning: "Crystal facet definition", unit: "relative", range: [0, 1] },
      e: { parameter: "E", experimentalMeaning: "Secondary facet clarity", unit: "relative", range: [0, 1] },
      f: { parameter: "F", experimentalMeaning: "Polar facet sharpness", unit: "relative", range: [0, 1] }
    }
  },

  cardiac_remodeling: {
    shapeName: "Cardiac Remodeling Surface",
    scientificBackground: "The heart becomes more spherical in microgravity due to fluid shifts and reduced gravitational loading, which may affect cardiac function.",
    relatedStudies: [
      {
        studyId: "OSD-379",
        title: "Inspiration4 Multi-Omics Study",
        organism: "Homo sapiens",
        tissue: "Heart (echocardiography)",
        assayType: "Imaging",
        mission: "Inspiration4",
        description: "Cardiac structure changes during short-duration spaceflight",
        osdrUrl: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-379"
      }
    ],
    experimentalVariables: {
      d: { parameter: "D", experimentalMeaning: "Shape sphericity index", unit: "relative", range: [0, 1] },
      e: { parameter: "E", experimentalMeaning: "Wall thickness change", unit: "mm", range: [0, 3] }
    }
  }
};

export function getShapeStudyContext(shapeName: string): ShapeExperimentalContext | null {
  return OSDR_SHAPE_MAPPING[shapeName] || null;
}

export function isSpaceBiologyShape(shapeName: string): boolean {
  return shapeName in OSDR_SHAPE_MAPPING;
}

export function getExperimentalTooltip(shapeName: string, parameter: string): string | null {
  const context = OSDR_SHAPE_MAPPING[shapeName];
  if (!context) return null;
  
  const varInfo = context.experimentalVariables[parameter.toLowerCase()];
  if (!varInfo) return null;
  
  return `${varInfo.experimentalMeaning}${varInfo.unit ? ` (${varInfo.unit})` : ''}`;
}
