/**
 * UNIVERSAL LAW OF INFORMATION
 * Backend Knowledge Layer for Dmension Mathematical Universe
 * 
 * CORE PRINCIPLE: Information ordering must increase or remain equal over evolutionary steps
 * 
 * MATHEMATICAL FORMULATION:
 * ∑(s=1 to n+1) I_s ≥ ∑(s=1 to n) I_s
 * 
 * Where:
 *   I = Information (Ordering)
 *   s = Evolutionary Steps (Step-Time)
 * 
 * This law governs:
 *   - Universal Evolution (E=mc², mass-energy conversion, element formation)
 *   - Biological Evolution (Flora, Fauna, DNA/RNA coding)
 *   - Genetic Ordering (A, T, G, C chemical states)
 *   - Species Formation (Gene ladder progression)
 * 
 * INTEGRATION WITH GEIA FRAMEWORK:
 *   G = Geometry/Structure (mathematical shapes)
 *   E = Energy flows (conversion and transformation)
 *   I = Information (THIS LAW - ordering must increase)
 *   Λ = Natural Laws (E=mc², conservation, gauge symmetry)
 * 
 * COSMOLOGICAL CYCLE:
 *   Beginning → Black Holes → End → Mirror Dimension
 *   "If something has a beginning, it cannot be eternal."
 *   "Nothing created or destroyed, only change in form."
 * 
 * @author UUON Foundation
 * @system Dmension Mathematical Universe
 */

export interface InformationLawContext {
  domain: 'universal' | 'biological' | 'flora' | 'fauna' | 'genetic' | 'atomic' | 'cosmic';
  evolutionaryStep: number;
  informationOrder: number;
  conformsToLaw: boolean;
  annotation: string;
  formula: string;
}

export interface EvolutionaryHierarchy {
  level: number;
  name: string;
  domain: string;
  informationComplexity: number;
  parentLevel?: number;
  description: string;
}

const UNIVERSAL_INFORMATION_LAW = {
  name: "Universal Law of Information",
  symbol: "∑I(n+1) ≥ ∑I(n)",
  latex: "\\sum_{s=1}^{n+1} I_s \\geq \\sum_{s=1}^{n} I_s",
  principle: "Information ordering must increase or remain equal over evolutionary steps",
  origin: "Gauge symmetry: nothing created or destroyed, only change in form"
};

const EVOLUTIONARY_HIERARCHY: EvolutionaryHierarchy[] = [
  { level: 0, name: "Pure Energy", domain: "universal", informationComplexity: 1, description: "T > 0, universe begins as pure positive energy" },
  { level: 1, name: "Electrons, Protons, Neutrons", domain: "universal", informationComplexity: 3, parentLevel: 0, description: "E=mc² converts energy to fundamental particles" },
  { level: 2, name: "Hydrogen Atom", domain: "atomic", informationComplexity: 4, parentLevel: 1, description: "First atomic element, simplest structure" },
  { level: 3, name: "Helium Atom", domain: "atomic", informationComplexity: 5, parentLevel: 2, description: "Stellar fusion creates helium" },
  { level: 4, name: "Periodic Table Elements", domain: "atomic", informationComplexity: 118, parentLevel: 3, description: "Progressive element formation through stellar processes" },
  { level: 5, name: "Atomic Molecules", domain: "atomic", informationComplexity: 200, parentLevel: 4, description: "Elements combine into molecular structures" },
  { level: 6, name: "Asteroids", domain: "cosmic", informationComplexity: 500, parentLevel: 5, description: "Molecular aggregation into celestial bodies" },
  { level: 7, name: "Galaxies, Stars, Planets", domain: "cosmic", informationComplexity: 1000, parentLevel: 6, description: "Large-scale cosmic structure formation" },
  { level: 8, name: "Black Holes", domain: "cosmic", informationComplexity: 10000, parentLevel: 7, description: "Mass-to-energy conversion mechanism, cycle completion" },
  { level: 10, name: "RNA Single Helix", domain: "genetic", informationComplexity: 100, parentLevel: 5, description: "Chemical coding on single helix genome" },
  { level: 11, name: "DNA Double Helix", domain: "genetic", informationComplexity: 200, parentLevel: 10, description: "Improved coding with A, T, G, C states" },
  { level: 12, name: "Flora", domain: "flora", informationComplexity: 500, parentLevel: 11, description: "Plant life following information law through genetics" },
  { level: 13, name: "Fauna", domain: "fauna", informationComplexity: 1000, parentLevel: 11, description: "Animal life with X/Y chromosomes and gene recombination" },
  { level: 14, name: "Species Gene Pool", domain: "biological", informationComplexity: 2000, parentLevel: 13, description: "Set intersection: A ∩ B ∩ C of breed genomes" },
  { level: 15, name: "Consciousness", domain: "biological", informationComplexity: 10000, parentLevel: 14, description: "Emergent property of complex biological information" }
];

const SHAPE_TO_DOMAIN_MAPPING: Record<string, InformationLawContext> = {
  "Electron Cloud": {
    domain: "atomic",
    evolutionaryStep: 1,
    informationOrder: 3,
    conformsToLaw: true,
    annotation: "Fundamental particle, E=mc² conversion product",
    formula: "∑I(1) = 3 ≥ ∑I(0) = 1"
  },
  "Hydrogen Atom": {
    domain: "atomic",
    evolutionaryStep: 2,
    informationOrder: 4,
    conformsToLaw: true,
    annotation: "First atom, proton-electron binding",
    formula: "∑I(2) = 4 ≥ ∑I(1) = 3"
  },
  "DNA Double Helix": {
    domain: "genetic",
    evolutionaryStep: 11,
    informationOrder: 200,
    conformsToLaw: true,
    annotation: "Chemical coding: A, T, G, C states on double helix",
    formula: "∑I(11) = 200 ≥ ∑I(10) = 100"
  },
  "Gene Ladder": {
    domain: "genetic",
    evolutionaryStep: 11,
    informationOrder: 200,
    conformsToLaw: true,
    annotation: "Rungs represent genes with four states (A, T, G, C)",
    formula: "∑I(n+1) ≥ ∑I(n) via environmental stress adaptation"
  },
  "Schwarzschild Black Hole": {
    domain: "cosmic",
    evolutionaryStep: 8,
    informationOrder: 10000,
    conformsToLaw: true,
    annotation: "Mass-to-energy conversion, universe cycle mechanism",
    formula: "Black Hole: M → E through Space-Time Membrane"
  },
  "Bohr Shell": {
    domain: "atomic",
    evolutionaryStep: 1,
    informationOrder: 4,
    conformsToLaw: true,
    annotation: "Electron orbit quantization, atomic structure",
    formula: "∑I(atomic) follows periodic table progression"
  },
  "Protein Folding": {
    domain: "biological",
    evolutionaryStep: 12,
    informationOrder: 500,
    conformsToLaw: true,
    annotation: "Amino acid sequence ordering into 3D structure",
    formula: "∑I(folded) ≥ ∑I(unfolded)"
  },
  "Species Venn": {
    domain: "biological",
    evolutionaryStep: 14,
    informationOrder: 2000,
    conformsToLaw: true,
    annotation: "Species = A ∪ B ∪ C, Gene Pool = A ∩ B ∩ C",
    formula: "Reproductive Limit defines speciation boundary"
  },
  "Unified Field Manifold": {
    domain: "universal",
    evolutionaryStep: 8,
    informationOrder: 10000,
    conformsToLaw: true,
    annotation: "All four forces unified in single framework",
    formula: "∑I(unified) ≥ ∑I(separate forces)"
  },
  "Riemann Hypothesis": {
    domain: "universal",
    evolutionaryStep: 15,
    informationOrder: 50000,
    conformsToLaw: true,
    annotation: "Prime number distribution encoded in zeta function zeros",
    formula: "Information ordering at mathematical foundation level"
  },
  "Calabi-Yau Manifold": {
    domain: "cosmic",
    evolutionaryStep: 8,
    informationOrder: 20000,
    conformsToLaw: true,
    annotation: "Extra dimensions compactified, string theory geometry",
    formula: "Higher dimensional information encoding"
  },
  "Consciousness Embodiment": {
    domain: "biological",
    evolutionaryStep: 15,
    informationOrder: 100000,
    conformsToLaw: true,
    annotation: "Emergent complexity from biological information ordering",
    formula: "∑I(consciousness) >> ∑I(biological substrate)"
  }
};

const CATEGORY_TO_DOMAIN: Record<string, InformationLawContext['domain']> = {
  "Atomic Structure": "atomic",
  "Atomic Orbitals": "atomic",
  "Chemical Bonds": "atomic",
  "Electron Orbitals": "atomic",
  "Biological": "biological",
  "Medical": "biological",
  "DNA/RNA": "genetic",
  "Protein Structure": "biological",
  "Molecular Biology": "biological",
  "Flora": "flora",
  "Fauna": "fauna",
  "Cosmic": "cosmic",
  "Black Holes": "cosmic",
  "Galaxies": "cosmic",
  "Theory of Everything": "universal",
  "Quantum": "universal",
  "String Theory": "universal",
  "Higher Dimensional": "universal",
  "Time Principle": "universal",
  "Phenomenon Principle": "universal"
};

export function getInformationLawContext(shapeName: string, category?: string): InformationLawContext | null {
  if (SHAPE_TO_DOMAIN_MAPPING[shapeName]) {
    return SHAPE_TO_DOMAIN_MAPPING[shapeName];
  }
  
  if (category && CATEGORY_TO_DOMAIN[category]) {
    const domain = CATEGORY_TO_DOMAIN[category];
    const hierarchy = EVOLUTIONARY_HIERARCHY.find(h => h.domain === domain);
    
    if (hierarchy) {
      return {
        domain,
        evolutionaryStep: hierarchy.level,
        informationOrder: hierarchy.informationComplexity,
        conformsToLaw: true,
        annotation: `${hierarchy.description} (follows Universal Information Law)`,
        formula: "∑I(n+1) ≥ ∑I(n)"
      };
    }
  }
  
  return null;
}

export function getEvolutionaryHierarchy(): EvolutionaryHierarchy[] {
  return EVOLUTIONARY_HIERARCHY;
}

export function getUniversalLaw() {
  return UNIVERSAL_INFORMATION_LAW;
}

export function generateInformationLawAnnotation(shapeName: string, category?: string): string | null {
  const context = getInformationLawContext(shapeName, category);
  
  if (!context) return null;
  
  return `[Universal Information Law] ${context.annotation} | ${context.formula}`;
}

export function checkConformance(previousInformation: number, currentInformation: number): boolean {
  return currentInformation >= previousInformation;
}

export function getGEIAInformationComponent(shapeName: string, category?: string): {
  I: number;
  entropy: number;
  order: number;
  conformsToLaw: boolean;
  evolutionaryStep: number;
} | null {
  const context = getInformationLawContext(shapeName, category);
  
  if (!context) return null;
  
  const I = context.informationOrder;
  const entropy = Math.log(I + 1);
  const order = 1 / (entropy + 0.001);
  
  return {
    I,
    entropy,
    order,
    conformsToLaw: context.conformsToLaw,
    evolutionaryStep: context.evolutionaryStep
  };
}

export const BIOLOGICAL_EVOLUTION_CONCEPTS = {
  geneZipper: "Male X-Y + Female XL-XR combine to form offspring genome",
  peacocking: "Natural selection ensures offspring ∑I(n+1) ≥ ∑I(n)",
  environmentalStress: "Amygdala → Pituitary → Ovaries/Testes → New Gene Coding",
  reproductiveLimit: "Genome divergence beyond which species cannot recombine",
  speciesFormation: "When Breed C genome exceeds Reproductive Limit, new species forms"
};

export const COSMOLOGICAL_CYCLE = {
  beginning: "T > 0, pure positive energy, gauge symmetry",
  middle: "E=mc² conversion, element formation, life evolution",
  end: "Black holes convert mass back to energy",
  principle: "Nothing created or destroyed, only change in form",
  mirrorDimension: "Energy returns through Space-Time Membrane"
};

console.log("📜 Universal Law of Information loaded");
console.log("   ∑I(n+1) ≥ ∑I(n) - Information ordering must increase");
console.log("   🌌 Cosmological: Beginning → Evolution → Black Holes → Mirror");
console.log("   🧬 Biological: RNA → DNA → Species → Consciousness");
console.log("   🔗 GEIA Integration: I = Information component enhanced");
