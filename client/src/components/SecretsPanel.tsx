import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Unlock, Sparkles, Infinity, Atom, Music, Waves, Pi, GitBranch, Compass } from 'lucide-react';

interface SecretsPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

const secrets = [
  {
    id: 1,
    icon: Infinity,
    title: 'The Self-Reference Loop',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    formula: '1.681² = 2.825761 → √2.825761 = 1.681',
    description: 'This number contains its own operation. A fixed point that regenerates itself. Mathematical DNA, a number aware of itself.',
    implication: 'In quantum terms: Eigenvalue of its own matrix. In chaos theory: Strange attractor at 1.681.'
  },
  {
    id: 2,
    icon: Waves,
    title: 'Shadow Geometry Convergence',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    formula: 'Shadow(t) = (1-t)×Ring + t×Nucleus',
    description: 'Orbital shadows follow the SAME convergence formula as electrons. Light itself converges through shadow geometry.',
    implication: 'Penumbra falloff: Darkness(r) = e^(-r/π). Your shadows encode π in their intensity.'
  },
  {
    id: 3,
    icon: GitBranch,
    title: 'Self-Regulating Energy Cascade',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    formula: 'E = 1.681 × (ΣEnergies) / count',
    description: 'Higher electron energy → stronger pull → faster decay. The system regulates itself through feedback.',
    implication: 'The more energy invested, the more power returned. Universal optimization principle.'
  },
  {
    id: 4,
    icon: Pi,
    title: 'π Encoded in Structure',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    formula: 'Ratios: 3/6, 6/9, 9/12, 12/15 → Wallis Product',
    description: 'Orbital radius ratios form n/(n+1), which produces ∏[n/(n+1)]² → π/2. The model beats at 1000π frames.',
    implication: 'π appears in shadows, orbital velocities, spiral paths, and frequency harmonics.'
  },
  {
    id: 5,
    icon: Atom,
    title: 'Five-Fold Biological Symmetry',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    formula: '5 Operations = 5-fold rotation',
    description: 'Forbidden in crystals but dominant in biology: flowers, starfish, DNA replication, human senses.',
    implication: 'The model is biologically encoded. This symmetry breaks 3D isotropy. It\'s alive.'
  },
  {
    id: 6,
    icon: Sparkles,
    title: 'Fibonacci Spiral Trajectories',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
    formula: 'Electron paths → Golden Spiral',
    description: 'Recording 1000 frames of all 5 electrons creates a nautilus shape. The trajectory cloud forms Fibonacci spirals in 3D.',
    implication: 'Wavefunction clouds aren\'t random, they\'re golden ratio spirals in motion.'
  },
  {
    id: 7,
    icon: Music,
    title: 'Musical Intervals Encoded',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    formula: '500:400:333:285:250 cycles',
    description: 'Orbital speeds encode natural musical intervals: 5/4 (Major Third), 6/5 (Minor Third), 7/6 (Harmonic Seventh).',
    implication: 'Your electrons are PLAYING MUSIC. The atoms sing in perfect harmony.'
  },
  {
    id: 8,
    icon: Compass,
    title: 'Maximum Information Compression',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    formula: '900 numbers/sec → 25 parameters',
    description: 'Each electron predictable from radius, speed, angle. Infinite motion encoded in 25 numbers.',
    implication: 'Maximum compression algorithm. Position-momentum uncertainty built in (Heisenberg).'
  },
  {
    id: 9,
    icon: Eye,
    title: '4D Klein Bottle Topology',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/30',
    formula: '5 Operations = 5D projection',
    description: 'The 3D model is a shadow of 5D space. Non-orientable surface where inside/outside are meaningless.',
    implication: 'Your brain senses 4D geometry embedded in 3D space. Like viewing a hypercube shadow.'
  },
  {
    id: 10,
    icon: Sparkles,
    title: 'Universal Reality Template',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    formula: 'P(t) = (1-t)×Start + t×Target',
    description: 'This formula appears in quantum mechanics, neuroscience, economics, evolution, chemistry, cosmology.',
    implication: 'The model doesn\'t represent reality, it IS the template reality uses to organize everything.'
  }
];

export default function SecretsPanel({ isOpen, onToggle }: SecretsPanelProps) {
  const [unlockedSecrets, setUnlockedSecrets] = useState<Set<number>>(new Set());
  const [showAll, setShowAll] = useState(false);

  const toggleSecret = (id: number) => {
    setUnlockedSecrets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const unlockAll = () => {
    setShowAll(true);
    setUnlockedSecrets(new Set(secrets.map(s => s.id)));
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-all hover:scale-110 z-50"
        title="Open Secrets Portal"
      >
        <Lock className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg border-2 border-purple-500/50 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-purple-500/30 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                🔐 Hidden Secrets of 1.681 Convergence
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">
                {unlockedSecrets.size}/{secrets.length} Revealed
              </span>
              <button
                onClick={unlockAll}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
              >
                <Unlock className="w-4 h-4 inline mr-1" />
                Unlock All
              </button>
              <button
                onClick={onToggle}
                className="p-2 hover:bg-gray-800 rounded transition-colors text-gray-400"
              >
                ✕
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            <em>"The model doesn't represent reality, it IS the template reality uses to organize everything."</em>
          </p>
        </div>

        {/* Secrets Grid */}
        <div className="overflow-y-auto p-4 space-y-3">
          {secrets.map((secret) => {
            const Icon = secret.icon;
            const isUnlocked = unlockedSecrets.has(secret.id) || showAll;

            return (
              <div
                key={secret.id}
                className={`p-4 rounded-lg border ${secret.borderColor} ${secret.bgColor} transition-all hover:scale-[1.01]`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleSecret(secret.id)}
                    className={`p-2 rounded-lg transition-all ${isUnlocked ? 'bg-green-500/20' : 'bg-gray-800'}`}
                  >
                    {isUnlocked ? (
                      <Eye className={`w-5 h-5 ${secret.color}`} />
                    ) : (
                      <EyeOff className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-5 h-5 ${secret.color}`} />
                      <h3 className={`font-bold ${secret.color}`}>
                        Level {secret.id}: {secret.title}
                      </h3>
                    </div>

                    {isUnlocked ? (
                      <div className="space-y-2">
                        <div className="p-2 bg-black/30 rounded font-mono text-sm text-gray-300 border border-gray-700">
                          {secret.formula}
                        </div>
                        <p className="text-sm text-gray-300">
                          {secret.description}
                        </p>
                        <p className="text-xs text-gray-500 italic">
                          💡 {secret.implication}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">
                        🔒 Click the eye icon to reveal this secret...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-purple-500/30 bg-gray-950">
          <div className="text-center space-y-1">
            <p className="text-sm text-purple-400 font-bold">
              🌀 The Observer Effect
            </p>
            <p className="text-xs text-gray-500">
              The model watches you watching it. Perfect recursive loop where observer and observed become one.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
