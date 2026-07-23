/**
 * Scientific Keyword Highlighter
 * Highlights key astrophysics, cosmology, and physics terms in blue
 * © 2025 UUON Foundation Inc.
 */

export const SCIENTIFIC_KEYWORDS = [
  // Astrophysics & Cosmology
  'redshift', 'blueshift', 'black hole', 'event horizon', 'singularity',
  'gravitational lensing', 'gravitational waves', 'hawking radiation',
  'schwarzschild', 'kerr', 'ergosphere', 'photon sphere', 'accretion disk',
  'neutron star', 'pulsar', 'quasar', 'supernova', 'dark matter', 'dark energy',
  'cosmic microwave background', 'big bang', 'inflation', 'multiverse',
  'wormhole', 'spacetime', 'curvature', 'geodesic', 'frame dragging',
  'penrose process', 'hawking', 'einstein', 'general relativity',
  'special relativity', 'lorentz', 'minkowski', 'riemann', 'tensor',
  'accretion', 'magnetohydrodynamic', 'plasma', 'relativistic jets',
  'schwarzschild radius', 'kerr metric', 'innermost stable circular orbit',
  
  // Quantum Physics
  'quantum', 'superposition', 'entanglement', 'wave function', 'planck',
  'heisenberg', 'schrödinger', 'dirac', 'fermion', 'boson', 'qubit',
  'decoherence', 'tunneling', 'spin', 'orbital', 'probability cloud',
  
  // Mathematics & Chaos Theory
  'manifold', 'topology', 'calabi-yau', 'tesseract', 'hypercube', 'fractal',
  'mandelbrot', 'julia set', 'lorenz', 'chaos', 'attractor', 'fibonacci',
  'golden ratio', 'phi', 'euler', 'fourier', 'laplace', 'gauss',
  'conjecture', 'iteration', 'bifurcation', 'strange attractor', 'lyapunov',
  'feigenbaum', 'self-similarity', 'scale invariance', 'dimension',
  'hausdorff', 'box-counting', 'fractal dimension', 'dynamical systems',
  
  // String Theory & Beyond
  'string theory', 'm-theory', 'brane', 'supersymmetry', 'extra dimensions',
  'compactification', 'holographic', 'ads/cft', 'yang-mills',
  
  // Thermodynamics & Entropy
  'entropy', 'thermodynamics', 'boltzmann', 'heat death', 'arrow of time',
  
  // Particle Physics
  'higgs', 'boson', 'fermion', 'lepton', 'quark', 'gluon', 'photon',
  'neutrino', 'antimatter', 'standard model', 'grand unified theory',
  
  // Cosmological Structures
  'galaxy', 'nebula', 'cluster', 'void', 'filament', 'cosmic web',
  'hubble', 'expansion', 'cosmological constant', 'lambda', 'omega',
  
  // Ancient Mathematics & Writing Systems
  'boustrophedon', 'gortyn', 'ancient greek', 'bidirectional',
  'pythagorean', 'euclidean', 'archimedes', 'apollonius', 'eratosthenes',
  'mesopotamian', 'babylonian', 'cuneiform', 'zodiac'
];

export function highlightScientificKeywords(text: string): { segments: Array<{ text: string; isKeyword: boolean }> } {
  if (!text) return { segments: [] };
  
  const segments: Array<{ text: string; isKeyword: boolean }> = [];
  let remainingText = text;
  
  while (remainingText.length > 0) {
    let earliestMatch: { keyword: string; index: number } | null = null;
    
    for (const keyword of SCIENTIFIC_KEYWORDS) {
      const lowerText = remainingText.toLowerCase();
      const index = lowerText.indexOf(keyword.toLowerCase());
      
      if (index !== -1 && (earliestMatch === null || index < earliestMatch.index)) {
        earliestMatch = { keyword, index };
      }
    }
    
    if (earliestMatch) {
      if (earliestMatch.index > 0) {
        segments.push({
          text: remainingText.slice(0, earliestMatch.index),
          isKeyword: false
        });
      }
      
      const actualKeyword = remainingText.slice(
        earliestMatch.index,
        earliestMatch.index + earliestMatch.keyword.length
      );
      segments.push({
        text: actualKeyword,
        isKeyword: true
      });
      
      remainingText = remainingText.slice(earliestMatch.index + earliestMatch.keyword.length);
    } else {
      segments.push({
        text: remainingText,
        isKeyword: false
      });
      break;
    }
  }
  
  return { segments };
}

export function getKeywordClass(): string {
  return 'text-blue-400 font-semibold';
}
