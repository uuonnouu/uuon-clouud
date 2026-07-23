import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SystemInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SystemInfoModal({ isOpen, onClose }: SystemInfoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] bg-gradient-to-br from-gray-900 via-blue-950 to-purple-950 border-2 border-blue-500/40">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            How Δmension Mathematical Universe Works
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[65vh] pr-4">
          <div className="space-y-6 text-sm text-gray-200">
            
            <section>
              <h3 className="text-xl font-bold text-blue-400 mb-3 flex items-center gap-2">
                <span className="text-2xl">🔬</span>
                Scientific Discovery Platform
              </h3>
              <p className="leading-relaxed text-gray-300 mb-3">
                Δmension Mathematical Universe is a comprehensive 3D mathematical visualization platform featuring{' '}
                <span className="font-bold text-white">1,649+ unique shapes</span> across{' '}
                <span className="font-bold text-white">118 categories</span>. It uses precise parametric mathematics, 
                4D visualization with SO(4) rotations, and production-grade rendering to explore mathematical structures 
                including quantum mechanics, general relativity, cryptography, AI/ML algorithms, and biological systems.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
                <span className="text-xl">🎛️</span>
                Universal Parameter System (26 Parameters: a-z)
              </h3>
              <div className="space-y-2 text-gray-300">
                <div className="bg-blue-900/20 p-3 rounded border border-blue-500/30">
                  <p className="font-semibold text-blue-300 mb-1">Core Parameters (a-c):</p>
                  <p className="text-sm">Scale and dimension controls - adjust the fundamental size of your shape</p>
                </div>
                <div className="bg-purple-900/20 p-3 rounded border border-purple-500/30">
                  <p className="font-semibold text-purple-300 mb-1">Transformation (d-m):</p>
                  <p className="text-sm">TWIST, HARMONY, and advanced shape modifiers for complex geometric effects</p>
                </div>
                <div className="bg-green-900/20 p-3 rounded border border-green-500/30">
                  <p className="font-semibold text-green-300 mb-1">Advanced (n-z):</p>
                  <p className="text-sm">Shape-specific modifiers including generative parameters (g-j) for emergent complexity</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
                <span className="text-xl">📐</span>
                UV Domain Controls
              </h3>
              <p className="leading-relaxed text-gray-300 mb-2">
                Control the parametric surface mapping with U and V ranges. Use quick presets:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
                <li><span className="font-bold text-pink-400">SPHERICAL</span> (U: 0→2π, V: 0→π) - Perfect for spheres, cells, organs</li>
                <li><span className="font-bold text-green-400">CYLINDRICAL</span> (U: 0→2π, V: 0→2) - For tubes and columns</li>
                <li><span className="font-bold text-indigo-400">PLANAR</span> (U: 0→10, V: 0→10) - For flat surfaces and fields</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
                <span className="text-xl">🎨</span>
                Visualization Modes
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
                <li><span className="font-bold">Surface</span> - Solid rendered geometry with lighting</li>
                <li><span className="font-bold">Wireframe</span> - See the mathematical grid structure</li>
                <li><span className="font-bold">Point Cloud</span> - Visualize vertices as particles</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-orange-400 mb-3 flex items-center gap-2">
                <span className="text-xl">💾</span>
                Export System (Password Protected)
              </h3>
              <p className="leading-relaxed text-gray-300 mb-2">
                All exports require team password authentication (<code className="bg-gray-800 px-1 rounded text-orange-300">sonOF2025!</code>):
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
                <li><span className="font-bold text-green-400">GLB Solid</span> - 3D model with materials</li>
                <li><span className="font-bold text-blue-400">GLB Wireframe</span> - Wireframe overlay model</li>
                <li><span className="font-bold text-purple-400">GLB Points</span> - Point cloud model</li>
                <li><span className="font-bold text-cyan-400">Sketchfab Animated</span> - Animated GLB for Sketchfab</li>
                <li><span className="font-bold text-indigo-400">Transform Anim</span> - Transform animation export</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-pink-400 mb-3 flex items-center gap-2">
                <span className="text-xl">🧬</span>
                Shape Categories (118 Total)
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                <div className="bg-pink-900/20 p-2 rounded border border-pink-500/20">
                  <p className="font-semibold text-pink-300">Quantum Machine Learning</p>
                  <p className="text-[10px]">57 QML visualizations (CNN, RNN, Transformers)</p>
                </div>
                <div className="bg-blue-900/20 p-2 rounded border border-blue-500/20">
                  <p className="font-semibold text-blue-300">General Relativity</p>
                  <p className="text-[10px]">24 spacetime & gravity visualizations</p>
                </div>
                <div className="bg-purple-900/20 p-2 rounded border border-purple-500/20">
                  <p className="font-semibold text-purple-300">Quantum Computing</p>
                  <p className="text-[10px]">IBM Quantum integrated, Bloch spheres</p>
                </div>
                <div className="bg-green-900/20 p-2 rounded border border-green-500/20">
                  <p className="font-semibold text-green-300">Cryptography</p>
                  <p className="text-[10px]">AES, SHA-256, Elliptic Curves, Lattice</p>
                </div>
                <div className="bg-yellow-900/20 p-2 rounded border border-yellow-500/20">
                  <p className="font-semibold text-yellow-300">4D Hyperdimensional</p>
                  <p className="text-[10px]">Tesseract, 24-cell, SO(4) rotations</p>
                </div>
                <div className="bg-cyan-900/20 p-2 rounded border border-cyan-500/20">
                  <p className="font-semibold text-cyan-300">Biological & Medical</p>
                  <p className="text-[10px]">Cells, Anatomy, DNA, Organelles</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-red-400 mb-3 flex items-center gap-2">
                <span className="text-xl">🚀</span>
                Advanced Features
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4 text-sm">
                <li>8 Animation Presets (Gentle Rotation, Pulsing, Biological Breathing, etc.)</li>
                <li>4D to 3D Projection (Stereographic, Orthogonal, Layered)</li>
                <li>Production-Grade Rendering (4K support, HDR bloom, physically correct lighting)</li>
                <li>Dual Intelligence Core (Wolfram Alpha + IBM Quantum integration ready)</li>
                <li>Universal Parameter Validation (prevents crashes, ensures valid ranges)</li>
                <li>Complete Color System (Plasma, Rainbow, Quantum, Electron, Photon modes)</li>
              </ul>
            </section>

            <section className="bg-blue-900/20 p-4 rounded border border-blue-500/30">
              <h3 className="text-lg font-bold text-blue-300 mb-2 flex items-center gap-2">
                <span className="text-xl">💡</span>
                Quick Start Guide
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-300 ml-4 text-sm">
                <li>Select a shape from the SHAPE dropdown</li>
                <li>Adjust parameters (a-z) using sliders</li>
                <li>Choose UV preset for optimal rendering (SPHERICAL for round shapes)</li>
                <li>Select visualization mode (Surface/Wireframe/Points)</li>
                <li>Pick a color mode and background</li>
                <li>Export using password-protected GLB options</li>
              </ol>
            </section>

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
