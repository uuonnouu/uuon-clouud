import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import FractalBiosystemScene from '../components/FractalBiosystem';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { exportAnimatedFractalBiosystem, exportIndividualComponent } from '@/utils/fractalBiosystemExport';

export default function FractalBiosystemVisualizer() {
  const [harmonicFrequency, setHarmonicFrequency] = useState(1);
  const [timeScale, setTimeScale] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportAnimatedFractalBiosystem({
        harmonicFrequency,
        timeScale,
        duration: 7.77,
        fps: 40
      });
      console.log('✅ Complete scene export successful');
    } catch (error) {
      console.error('❌ Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleComponentExport = async (component: string) => {
    setIsExporting(true);
    try {
      await exportIndividualComponent(component, harmonicFrequency);
      console.log(`✅ ${component} model exported successfully`);
    } catch (error) {
      console.error(`❌ ${component} export failed:`, error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full h-screen bg-black relative">
      {/* Canvas */}
      <Canvas ref={canvasRef}>
        <PerspectiveCamera makeDefault position={[0, 5, 15]} />
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={30}
        />
        <FractalBiosystemScene 
          timeScale={timeScale}
          harmonicFrequency={harmonicFrequency}
        />
      </Canvas>

      {/* Control Panel */}
      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm p-6 rounded-lg border border-purple-500/30 min-w-[320px]">
        <h1 className="text-2xl font-bold text-white mb-2">
          Fractal Biosystem
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Unity of DNA & Neural Architecture
        </p>

        {/* Harmonic Frequency Control */}
        <div className="mb-6">
          <label className="text-white text-sm font-medium mb-2 block">
            Harmonic Resonance: {harmonicFrequency.toFixed(2)}
          </label>
          <Slider
            value={[harmonicFrequency]}
            onValueChange={(v) => setHarmonicFrequency(v[0])}
            min={0.1}
            max={3}
            step={0.01}
            className="mb-2"
          />
          <p className="text-xs text-gray-500">
            Electromagnetic wave frequency across structures
          </p>
        </div>

        {/* Time Scale Control */}
        <div className="mb-6">
          <label className="text-white text-sm font-medium mb-2 block">
            Time Scale: {timeScale.toFixed(2)}x
          </label>
          <Slider
            value={[timeScale]}
            onValueChange={(v) => setTimeScale(v[0])}
            min={0.1}
            max={5}
            step={0.1}
            className="mb-2"
          />
          <p className="text-xs text-gray-500">
            Animation speed multiplier
          </p>
        </div>

        {/* Export Controls */}
        <div className="border-t border-purple-500/20 pt-4">
          <h3 className="text-white text-sm font-semibold mb-3">
            Export 3D Models
          </h3>
          
          {/* Complete Scene Export */}
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white mb-3"
          >
            {isExporting ? 'Exporting...' : '📦 Complete Scene (Animated)'}
          </Button>
          
          {/* Individual Component Exports */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => handleComponentExport('dna')}
              disabled={isExporting}
              variant="outline"
              className="text-xs border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
            >
              DNA Helix
            </Button>
            <Button
              onClick={() => handleComponentExport('chromatin')}
              disabled={isExporting}
              variant="outline"
              className="text-xs border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
            >
              Chromatin
            </Button>
            <Button
              onClick={() => handleComponentExport('neural')}
              disabled={isExporting}
              variant="outline"
              className="text-xs border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
            >
              Neural Path
            </Button>
            <Button
              onClick={() => handleComponentExport('harmonic')}
              disabled={isExporting}
              variant="outline"
              className="text-xs border-green-500/50 text-green-400 hover:bg-green-500/10"
            >
              Harmonic Field
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            Individual models export as static GLB files
          </p>
        </div>

        {/* Mathematical Annotations */}
        <div className="border-t border-purple-500/20 mt-6 pt-4">
          <h3 className="text-white text-sm font-semibold mb-3">
            Fractal Parameters
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-gray-300">
              <span>DNA Pitch:</span>
              <span className="font-mono text-cyan-400">3.4 nm</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Golden Ratio (φ):</span>
              <span className="font-mono text-cyan-400">1.618033989</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Nucleosome Diameter:</span>
              <span className="font-mono text-cyan-400">11 nm</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Chromatin Fiber:</span>
              <span className="font-mono text-cyan-400">30 nm</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Scale Recursion:</span>
              <span className="font-mono text-cyan-400">10⁻⁹ → 10⁻³ m</span>
            </div>
          </div>
        </div>

        {/* Attribution */}
        <div className="border-t border-purple-500/20 mt-4 pt-3">
          <p className="text-[10px] text-gray-600 text-center">
            © 2024 UUON Foundation Inc.
          </p>
        </div>
      </div>

      {/* Info Panel */}
      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm p-4 rounded-lg border border-purple-500/30 max-w-[300px]">
        <h3 className="text-white font-semibold mb-2 text-sm">Visualization Guide</h3>
        <div className="space-y-2 text-xs text-gray-300">
          <div>
            <span className="text-cyan-400">◆</span> Left: DNA double helix (molecular scale)
          </div>
          <div>
            <span className="text-purple-400">◆</span> Center: Chromatin fibers (nanoscale)
          </div>
          <div>
            <span className="text-yellow-400">◆</span> Right: Optic neural pathways (microscale)
          </div>
          <div className="border-t border-purple-500/20 pt-2 mt-2">
            <span className="text-cyan-300">•</span> Particles show electromagnetic resonance
          </div>
          <div>
            <span className="text-cyan-300">•</span> All structures share fractal geometry
          </div>
        </div>
      </div>
    </div>
  );
}
