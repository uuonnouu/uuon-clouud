import React, { useState, useEffect } from 'react';
import { X, Sparkles, Search, Play, Zap, Brain, Atom, Sliders, Eye, Palette, Grid3X3, Download, Hexagon, MousePointer2, RotateCcw, Layers } from 'lucide-react';

interface WelcomeModalProps {
  onClose: () => void;
  onSelectShape: (shapeType: string) => void;
}

const FAVORITE_SHAPES = [
  { type: 'sphere', name: 'Sphere', icon: '🔮', description: 'Perfect 3D sphere - the classic mathematical form.' },
  { type: 'tesseract', name: 'Tesseract', icon: '⬜', description: '4D Hypercube projection' },
  { type: 'shape_of_universe', name: 'Shape of Universe', icon: '🌌', description: 'Unified cosmic geometry' },
  { type: 'dna_double_helix', name: 'DNA Helix', icon: '🧬', description: 'The code of life' },
  { type: 'golden_spiral', name: 'Golden Spiral', icon: '🐚', description: 'Nature\'s perfect ratio' }
];

const INTERFACE_GUIDE = [
  { icon: <Hexagon className="w-6 h-6" />, title: 'Shape Selector', location: 'Top left dropdown', description: '2,200+ shapes by category', color: 'from-cyan-500 to-blue-500' },
  { icon: <Sliders className="w-6 h-6" />, title: 'Parameters A-Z', location: 'Left panel', description: 'Morph shapes in real-time', color: 'from-purple-500 to-pink-500' },
  { icon: <Eye className="w-6 h-6" />, title: 'View Mode', location: 'Top controls', description: 'Surface, Wireframe, Points', color: 'from-green-500 to-emerald-500' },
  { icon: <Palette className="w-6 h-6" />, title: 'Materials', location: 'Studio panel', description: '49 PBR materials & colors', color: 'from-orange-500 to-red-500' },
  { icon: <Grid3X3 className="w-6 h-6" />, title: 'UV Mesh', location: 'Mesh settings', description: 'Adjust surface density', color: 'from-yellow-500 to-amber-500' },
  { icon: <Download className="w-6 h-6" />, title: 'Export', location: 'Export panel', description: 'GLB, PLY, Sketchfab', color: 'from-indigo-500 to-violet-500' },
];

const QUICK_TIPS = [
  { icon: <MousePointer2 className="w-5 h-5" />, tip: 'Click and drag to rotate the 3D view' },
  { icon: <RotateCcw className="w-5 h-5" />, tip: 'Parameters A=B=C=X=Y=Z default to 1.00000' },
  { icon: <Layers className="w-5 h-5" />, tip: 'Collapsible panels keep the interface clean' },
];

export default function WelcomeModal({ onClose, onSelectShape }: WelcomeModalProps) {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleSelectShape = (shapeType: string) => {
    onSelectShape(shapeType);
    handleClose();
  };

  const steps = [
    {
      title: 'Welcome to Δmension',
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🌌</div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Mathematical Universe
          </h2>
          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 rounded-lg p-3 mb-2">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-amber-400 font-semibold">Δ Delta Mode</span>
            </div>
            <p className="text-amber-200/80 text-sm">
              We're actively improving and fixing bugs. Please excuse any issues during this period.
            </p>
          </div>
          <p className="text-gray-300 text-lg">
            We render <strong className="text-cyan-400">mathematical formulas</strong> in 3D space using our special codebase and <strong className="text-purple-400">thousands of hours of testing</strong>.
          </p>
          <p className="text-gray-400">
            Explore 2,200+ shapes across 115+ categories
          </p>
        </div>
      )
    },
    {
      title: 'Interface Guide',
      content: (
        <div className="space-y-4">
          <p className="text-center text-gray-400 text-sm mb-2">Here's where to find everything:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            {INTERFACE_GUIDE.map((item, idx) => (
              <div key={idx} className="bg-gray-800/50 rounded-lg p-2 sm:p-3 border border-gray-700/50 hover:border-cyan-500/30 transition-all">
                <div className={`inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${item.color} mb-1 sm:mb-2`}>
                  {React.cloneElement(item.icon as React.ReactElement, { className: 'w-4 h-4 sm:w-5 sm:h-5 text-white' })}
                </div>
                <h4 className="text-white font-medium text-xs sm:text-sm">{item.title}</h4>
                <p className="text-gray-400 text-[10px] sm:text-xs mb-0.5 sm:mb-1 line-clamp-2">{item.description}</p>
                <span className="text-cyan-400/70 text-[10px] sm:text-xs hidden sm:inline">📍 {item.location}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {QUICK_TIPS.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-gray-800/30 rounded-lg p-2 border border-gray-700/30">
                <div className="text-cyan-400">{item.icon}</div>
                <span className="text-gray-300 text-sm">{item.tip}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Start Exploring',
      content: (
        <div className="space-y-3 sm:space-y-6">
          <p className="text-center text-gray-300 mb-2 sm:mb-4 text-xs sm:text-base">
            Search from the <strong className="text-cyan-400">dropdown menu</strong> or the <strong className="text-purple-400">search bar</strong> for any shape:
          </p>
          <div className="grid gap-2 sm:gap-3">
            {FAVORITE_SHAPES.map((shape) => (
              <button
                key={shape.type}
                onClick={() => handleSelectShape(shape.type)}
                className="flex items-center gap-2 sm:gap-4 p-2 sm:p-4 bg-gray-800/60 hover:bg-gray-700/80 rounded-lg sm:rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all group"
              >
                <span className="text-xl sm:text-3xl">{shape.icon}</span>
                <div className="text-left flex-1 min-w-0">
                  <div className="font-semibold text-white group-hover:text-cyan-400 transition-colors text-sm sm:text-base truncate">
                    {shape.name}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400 truncate">{shape.description}</div>
                </div>
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center pt-12 sm:pt-0 transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      <div 
        className={`relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-700 max-w-2xl w-full mx-2 sm:mx-4 max-h-[85vh] sm:max-h-[90vh] overflow-y-auto transition-all duration-300 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 hover:bg-gray-700 rounded-lg transition-colors z-10"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
        </button>

        <div className="p-4 sm:p-6 md:p-8">
          <div className="mb-4 sm:mb-6 flex justify-center gap-2">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setStep(idx)}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${
                  step === idx 
                    ? 'bg-cyan-400 w-6 sm:w-8' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>

          <div className="min-h-[280px] sm:min-h-[350px]">
            {steps[step].content}
          </div>

          <div className="mt-4 sm:mt-8 flex justify-between items-center">
            {step > 0 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-3 sm:px-6 py-2 text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-4 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold rounded-lg sm:rounded-xl transition-all shadow-lg hover:shadow-cyan-500/25 text-sm sm:text-base"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleClose}
                className="px-4 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold rounded-lg sm:rounded-xl transition-all shadow-lg hover:shadow-cyan-500/25 text-sm sm:text-base"
              >
                Start Exploring
              </button>
            )}
          </div>
        </div>

        <div className="bg-gray-800/50 border-t border-gray-700 px-4 sm:px-8 py-3 sm:py-4 rounded-b-xl sm:rounded-b-2xl">
          <p className="text-center text-gray-500 text-xs sm:text-sm">
            Powered by <strong className="text-cyan-400">UUON Foundation</strong> | 2,200+ Shapes
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-4 bg-gray-800/40 rounded-xl border border-gray-700/50">
      <div className="mb-3">{icon}</div>
      <h4 className="font-semibold text-white mb-1">{title}</h4>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}

export function useWelcomeModal() {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const oldKey = localStorage.getItem('dmension-welcome-seen');
    if (oldKey) {
      localStorage.setItem('uuon-welcome-seen', oldKey);
      localStorage.removeItem('dmension-welcome-seen');
    }
    
    const hasSeenWelcome = localStorage.getItem('uuon-welcome-seen');
    if (!hasSeenWelcome) {
      setTimeout(() => setShowWelcome(true), 1000);
    }
  }, []);

  const closeWelcome = () => {
    localStorage.setItem('uuon-welcome-seen', 'true');
    setShowWelcome(false);
  };

  const resetWelcome = () => {
    localStorage.removeItem('uuon-welcome-seen');
    setShowWelcome(true);
  };

  return { showWelcome, closeWelcome, resetWelcome };
}
