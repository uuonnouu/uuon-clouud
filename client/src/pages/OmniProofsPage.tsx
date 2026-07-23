import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { ChevronDown, ChevronRight, ExternalLink, Search, Shield, Atom, Lock, Brain, Sparkles, FlaskConical, Infinity, Boxes, Zap, Dna, Star, Radio } from 'lucide-react';

interface ProofShape {
  id: string;
  url: string;
}

interface ProofCategory {
  category: string;
  displayName: string;
  description: string;
  scientificImpact: string;
  count: number;
  shapes: ProofShape[];
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'cryptography': <Lock className="w-5 h-5" />,
  'algorithms': <Brain className="w-5 h-5" />,
  'quantum-mechanics': <Atom className="w-5 h-5" />,
  'quantum-gravity': <Infinity className="w-5 h-5" />,
  'general-relativity': <Sparkles className="w-5 h-5" />,
  'theory-of-everything': <Zap className="w-5 h-5" />,
  'topology': <Boxes className="w-5 h-5" />,
  '4d-hyperdimensional': <Star className="w-5 h-5" />,
  'fractals': <FlaskConical className="w-5 h-5" />,
  'molecular-biology': <Dna className="w-5 h-5" />,
  'sacred-geometry': <Shield className="w-5 h-5" />,
  'uuon-acas': <Radio className="w-5 h-5" />
};

const DISCOVERY_NARRATIVES: Record<string, { story: string; future: string; impact: string }> = {
  'cryptography': {
    story: 'From ancient ciphers to quantum-resistant lattices, cryptography is humanity\'s shield against chaos. These mathematical proofs don\'t just secure data, they enable trust without authority, privacy without surveillance, identity without centralization.',
    future: 'Zero-knowledge proofs will allow you to prove you\'re over 21 without revealing your birthdate, prove you have funds without revealing your balance, vote without revealing your choice, yet all verifiable.',
    impact: 'Every secure message, every Bitcoin transaction, every digital signature relies on these mathematical certainties. Without them, the digital economy collapses.'
  },
  'algorithms': {
    story: 'Algorithms are the DNA of computation. These proofs establish what can be computed, how efficiently, and what remains forever beyond reach. They define the boundaries of artificial intelligence itself.',
    future: 'Understanding P vs NP could mean either breaking all encryption or proving perfect security is possible. Optimization proofs enable AI to find solutions in spaces larger than the universe.',
    impact: 'From Google\'s search ranking to Netflix recommendations to autonomous vehicles, every intelligent system runs on proven algorithmic foundations.'
  },
  'quantum-mechanics': {
    story: 'Reality at its smallest scale defies intuition. These proofs demonstrate that particles exist in superposition, entanglement spans galaxies instantly, and observation itself changes what is observed.',
    future: 'Quantum computers will simulate molecules to design life-saving drugs, break current encryption while enabling unbreakable new forms, and solve optimization problems currently requiring the age of the universe.',
    impact: 'MRI machines, lasers, semiconductors, LEDs, quantum mechanics already powers the modern world. These proofs push us toward quantum supremacy.'
  },
  'quantum-gravity': {
    story: 'At the Planck scale (10⁻³⁵ meters), space itself becomes quantized. These proofs attempt to unify Einstein\'s curved spacetime with quantum uncertainty, the holy grail of physics.',
    future: 'Understanding quantum gravity could reveal how to manipulate spacetime itself, create wormholes, or explain what happens inside black holes where both theories apply.',
    impact: 'Resolving the black hole information paradox would fundamentally change our understanding of information, entropy, and the nature of reality.'
  },
  'general-relativity': {
    story: 'Einstein showed that gravity isn\'t a force, it\'s the curvature of spacetime itself. These proofs predicted black holes decades before observation, gravitational waves a century before detection.',
    future: 'Gravitational wave astronomy opens a new window on the universe, detecting colliding black holes, neutron stars, and potentially the Big Bang itself.',
    impact: 'Without relativistic corrections, GPS would drift by 10km per day. These proofs keep your navigation accurate to meters.'
  },
  'theory-of-everything': {
    story: 'String theory, loop quantum gravity, supersymmetry, these are humanity\'s attempts to write one equation that explains all forces, all particles, all of reality.',
    future: 'A verified Theory of Everything would be the greatest intellectual achievement in human history, understanding why the universe exists as it does.',
    impact: 'Even failed unification attempts have yielded transformative mathematics and insights into particle physics, cosmology, and pure mathematics.'
  },
  'topology': {
    story: 'Topology studies properties preserved when shapes are stretched but not torn. A coffee cup equals a donut. These proofs classify all possible shapes and their relationships.',
    future: 'Topological quantum computing uses anyons, particles that remember being braided around each other, to create error-free quantum calculations.',
    impact: 'DNA topology determines how genetic information is read. Protein knots determine function. Understanding topology is understanding life itself.'
  },
  '4d-hyperdimensional': {
    story: 'We live in 3D but mathematics reveals 4D, 10D, even infinite dimensions. These proofs map the tesseract, 24-cell, and polytopes we can only see through projection.',
    future: 'String theory requires 10-11 dimensions. Understanding higher-dimensional geometry may reveal hidden dimensions curled up at every point in space.',
    impact: 'Machine learning uses high-dimensional spaces to find patterns invisible in 3D. Your phone\'s neural networks operate in thousands of dimensions.'
  },
  'fractals': {
    story: 'Fractals reveal infinite complexity from simple rules. The Mandelbrot set\'s boundary has infinite length in finite area. Chaos theory shows how small changes cascade into unpredictability.',
    future: 'Understanding chaos means understanding weather limits, market crashes, ecosystem tipping points. Predicting where prediction fails.',
    impact: 'Fractal antennas in your phone, coastline measurement, computer graphics, and understanding heartbeat irregularities all depend on these proofs.'
  },
  'molecular-biology': {
    story: 'Life is mathematics made flesh. DNA stores information more densely than any technology. Proteins fold through energy landscapes to find their function.',
    future: 'AlphaFold revolutionized protein structure prediction. Next: designing novel proteins, editing genomes with precision, and understanding consciousness through neural mathematics.',
    impact: 'Every drug, every vaccine, every understanding of disease flows from the mathematical structures of molecular biology.'
  },
  'sacred-geometry': {
    story: 'The golden ratio appears in galaxies and DNA alike. Platonic solids tile space uniquely. These aren\'t mystical, they\'re mathematical necessities that life and physics discovered independently.',
    future: 'Biomimetic design uses nature\'s mathematical solutions: hexagonal honeycombs, logarithmic spirals, Fibonacci branching, millions of years of optimization encoded in geometry.',
    impact: 'Architecture, art, and design that resonates with humans often unconsciously uses these proportions. Mathematics explains why.'
  },
  'uuon-acas': {
    story: 'UUON-ACAS represents the frontier: autonomous systems that verify, learn, and coordinate through mathematical beacons. Consciousness itself may have geometric structure.',
    future: 'Decentralized autonomous organizations, AI governance, collective intelligence, systems that operate without central authority through mathematical consensus.',
    impact: 'From many, one: E Pluribus Unum. These proofs show how independent agents can converge to unified behavior, the mathematics of civilization itself.'
  }
};

export default function OmniProofsPage() {
  const [categories, setCategories] = useState<ProofCategory[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/proof-navigation.json')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load proof navigation:', err);
        setLoading(false);
      });
  }, []);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const filteredCategories = categories.filter(cat => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      cat.displayName.toLowerCase().includes(term) ||
      cat.description.toLowerCase().includes(term) ||
      cat.shapes.some(s => s.id.toLowerCase().includes(term))
    );
  });

  const totalProofs = categories.reduce((sum, cat) => sum + cat.count, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-cyan-400 text-xl animate-pulse">Loading Omni-Proof Index...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            OMNI-PROOF INDEX
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Mathematical Verification Algorithms & Discovery Narratives
          </p>
          <p className="text-lg text-cyan-400">
            {totalProofs} Proof Algorithms Across {categories.length} Categories
          </p>
        </header>

        <div className="mb-8 max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search proofs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800/50 border border-cyan-500/30 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 mb-8 border border-cyan-500/20">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">The Real Story</h2>
          <p className="text-gray-300 leading-relaxed">
            These are not mere visualizations, they are <span className="text-purple-400 font-semibold">mathematical certainties</span> that 
            govern the universe. Each proof represents humanity's deepest understanding of reality: from the quantum foam beneath 
            spacetime to the cryptographic shields protecting civilization, from the chaotic attractors that limit prediction to 
            the biological algorithms that define life itself.
          </p>
          <p className="text-gray-300 leading-relaxed mt-4">
            <span className="text-cyan-400 font-semibold">Δmension</span> transforms these abstract truths into visual explorations. 
            Click any proof to see its mathematical form, understand its implications, and explore the parameters that shape reality.
          </p>
        </div>

        <div className="space-y-4">
          {filteredCategories.map((cat) => {
            const isExpanded = expandedCategories.has(cat.category);
            const narrative = DISCOVERY_NARRATIVES[cat.category];
            
            return (
              <div 
                key={cat.category}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
              >
                <button
                  onClick={() => toggleCategory(cat.category)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white">
                      {CATEGORY_ICONS[cat.category] || <Shield className="w-5 h-5" />}
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-white">{cat.displayName}</h3>
                      <p className="text-sm text-gray-400">{cat.count} mathematical proofs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full">
                      {cat.count} proofs
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-gray-700/50">
                    {narrative && (
                      <div className="mt-4 space-y-4">
                        <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                          <h4 className="text-purple-400 font-semibold mb-2">The Story</h4>
                          <p className="text-gray-300 text-sm leading-relaxed">{narrative.story}</p>
                        </div>
                        <div className="bg-cyan-900/30 rounded-lg p-4 border border-cyan-500/30">
                          <h4 className="text-cyan-400 font-semibold mb-2">What This Will Change</h4>
                          <p className="text-gray-300 text-sm leading-relaxed">{narrative.future}</p>
                        </div>
                        <div className="bg-pink-900/30 rounded-lg p-4 border border-pink-500/30">
                          <h4 className="text-pink-400 font-semibold mb-2">Scientific Impact</h4>
                          <p className="text-gray-300 text-sm leading-relaxed">{narrative.impact}</p>
                        </div>
                      </div>
                    )}

                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                        Direct Links to Each Proof:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {cat.shapes.map((shape) => (
                          <Link
                            key={shape.id}
                            href={`/shape/${shape.id}`}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-colors group"
                          >
                            <span className="text-sm text-gray-300 group-hover:text-cyan-400 truncate flex-1">
                              {shape.id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                            <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-cyan-400 flex-shrink-0" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <footer className="mt-12 text-center text-gray-400 text-sm">
          <p>
            Δmension Mathematical Universe | {totalProofs} Verification Algorithms | 
            <a href="/sitemap-omni-proofs.xml" className="text-cyan-400 hover:underline ml-1">
              Omni-Proof Sitemap
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
