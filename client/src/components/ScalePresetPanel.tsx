/**
 * SCALE PRESET PANEL
 * Micro / Meso / Macro UV presets for rendering objects at preferred dynamics
 * Each scale adjusts UV domain, segments, and rendering parameters automatically
 * © 2025 UUON Foundation Inc.
 */

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Atom, User, Globe, Sparkles, Zap, Mountain, ChevronDown, ChevronRight } from 'lucide-react';
import { SurfaceParameters } from '../types/math';

export type ScalePreset = 'micro' | 'meso' | 'macro';
export type ScalePresetWithAuto = ScalePreset | 'auto';

interface ScalePresetPanelProps {
  currentPreset: ScalePreset;
  onPresetChange: (preset: ScalePreset, params: Partial<SurfaceParameters>) => void;
  shapeType?: string;
}

// Physical Constants for Scale Transformations
const PHYSICAL_CONSTANTS = {
  // Micro (Quantum/Atomic)
  PLANCK_LENGTH: 1.616255e-35,  // meters - smallest meaningful length
  BOHR_RADIUS: 5.29177e-11,     // meters - hydrogen atom radius
  FINE_STRUCTURE: 1/137.036,    // α - electromagnetic coupling
  PLANCK_CONSTANT: 6.62607e-34, // J·s - quantum action
  
  // Meso (Biological)
  CELL_DIAMETER: 10e-6,         // meters - typical cell size
  GOLDEN_RATIO: 1.618033988749, // φ - biological proportion
  MEMBRANE_THICKNESS: 7.5e-9,   // meters - lipid bilayer
  
  // Macro (Cosmic)
  HUBBLE_CONSTANT: 70.0,        // km/s/Mpc - universe expansion rate
  ASTRONOMICAL_UNIT: 1.496e11,  // meters - Earth-Sun distance
  SCHWARZSCHILD_FACTOR: 2.0,    // rs = 2GM/c² coefficient
  COSMOLOGICAL_CONSTANT: 1.1e-52 // m⁻² - dark energy density
};

// Scale Dynamics Presets — set UV domain and mesh segments only, never a/b/c
const SCALE_PRESETS = {
  micro: {
    name: 'Micro',
    icon: Atom,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
    borderColor: 'border-cyan-500/40',
    description: 'Atomic & Quantum Scale',
    examples: 'Atoms, Molecules, Orbitals, Quantum States',
    uvRange: 25,
    parameters: {
      uMin: -25,
      uMax: 25,
      vMin: -25,
      vMax: 25,
      uSegments: 64,
      vSegments: 64,
      a: 0.1,
      b: 0.05,
      c: 1.0 * PHYSICAL_CONSTANTS.GOLDEN_RATIO,
      p: 10,
      q: 0.5,
    }
  },
  meso: {
    name: 'Meso',
    icon: User,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/40',
    description: 'Cellular & Biological Scale',
    examples: 'Cells, Tissues, Organs, Organisms',
    uvRange: 50,
    parameters: {
      uMin: -50,
      uMax: 50,
      vMin: -50,
      vMax: 50,
      uSegments: 48,
      vSegments: 48,
      a: 1.0,
      b: 0.5,
      c: PHYSICAL_CONSTANTS.GOLDEN_RATIO,
      p: 5,
      q: 1.0,
    }
  },
  macro: {
    name: 'Macro',
    icon: Globe,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    borderColor: 'border-orange-500/40',
    description: 'Planetary & Cosmic Scale',
    examples: 'Planets, Galaxies, Black Holes, Universe',
    uvRange: 100,
    parameters: {
      uMin: -100,
      uMax: 100,
      vMin: -100,
      vMax: 100,
      uSegments: 32,
      vSegments: 32,
      a: 10.0,
      b: 5.0,
      c: PHYSICAL_CONSTANTS.SCHWARZSCHILD_FACTOR,
      p: 1,
      q: 5.0,
    }
  }
};

function detectOptimalScale(shapeType: string): ScalePreset {
  const type = shapeType.toLowerCase();
  
  if (type.includes('atom') || type.includes('molecule') || type.includes('orbital') ||
      type.includes('quantum') || type.includes('electron') || type.includes('photon') ||
      type.includes('quark') || type.includes('boson') || type.includes('fermion') ||
      type.includes('wavefunction') || type.includes('bloch') || type.includes('spin') ||
      type.includes('hydrogen') || type.includes('protein') || type.includes('dna') ||
      type.includes('nucleotide') || type.includes('amino') || type.includes('crystal')) {
    return 'micro';
  }
  
  if (type.includes('cell') || type.includes('tissue') || type.includes('organ') ||
      type.includes('anatomy') || type.includes('heart') || type.includes('brain') ||
      type.includes('lung') || type.includes('bone') || type.includes('muscle') ||
      type.includes('membrane') || type.includes('mitochondr') || type.includes('nucleus') ||
      type.includes('human') || type.includes('body') || type.includes('biological')) {
    return 'meso';
  }
  
  if (type.includes('planet') || type.includes('galaxy') || type.includes('star') ||
      type.includes('orbit') || type.includes('universe') || type.includes('cosmic') ||
      type.includes('black_hole') || type.includes('nebula') || type.includes('solar') ||
      type.includes('astronomical') || type.includes('spacetime') || type.includes('relativity') ||
      type.includes('gravitational') || type.includes('cosmic') || type.includes('entropy')) {
    return 'macro';
  }
  
  return 'meso';
}

export default function ScalePresetPanel({ 
  currentPreset, 
  onPresetChange,
  shapeType = ''
}: ScalePresetPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const handlePresetSelect = (preset: ScalePreset) => {
    onPresetChange(preset, SCALE_PRESETS[preset].parameters);
  };
  
  const handleAutoDetect = () => {
    const detectedPreset = detectOptimalScale(shapeType);
    onPresetChange(detectedPreset, SCALE_PRESETS[detectedPreset].parameters);
  };
  
  const detectedScale = detectOptimalScale(shapeType);
  const activePreset = SCALE_PRESETS[currentPreset];
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 rounded-xl border-2 border-indigo-500/30 p-3 shadow-2xl">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              {isOpen ? <ChevronDown className="w-4 h-4 text-indigo-400" /> : <ChevronRight className="w-4 h-4 text-indigo-400" />}
              <Mountain className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-indigo-300">Scale Dynamics</h3>
              <span className={`text-xs px-2 py-0.5 rounded ${activePreset.bgColor} ${activePreset.color}`}>
                {activePreset.name}
              </span>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="mt-3 pt-3 border-t border-indigo-500/20">
            <div className="flex justify-end mb-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAutoDetect}
                className="h-6 px-2 text-xs bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 border border-indigo-500/30"
              >
                <Zap className="w-3 h-3 mr-1" />
                Auto-Detect
              </Button>
            </div>

            {shapeType && (
              <div className="mb-3 p-2 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div className="flex items-center gap-2 text-xs">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  <span className="text-gray-400">Detected:</span>
                  <span className={`font-semibold ${SCALE_PRESETS[detectedScale].color}`}>
                    {SCALE_PRESETS[detectedScale].name}
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(SCALE_PRESETS) as [ScalePreset, typeof SCALE_PRESETS['micro']][]).map(([key, preset]) => {
                const Icon = preset.icon;
                const isActive = currentPreset === key;
                
                return (
                  <button
                    key={key}
                    onClick={() => handlePresetSelect(key)}
                    className={`relative p-2 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? `${preset.bgColor} ${preset.borderColor} border-2 shadow-lg` 
                        : 'bg-gray-800/40 border border-gray-700/50 hover:bg-gray-800/60'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Icon className={`w-5 h-5 ${isActive ? preset.color : 'text-gray-500'}`} />
                      <span className={`text-xs font-bold ${isActive ? preset.color : 'text-gray-400'}`}>
                        {preset.name}
                      </span>
                      <span className={`text-[8px] text-center ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                        {preset.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {activePreset && (
              <Collapsible open={showSettings} onOpenChange={setShowSettings}>
                <CollapsibleTrigger className="w-full mt-3">
                  <div className="flex items-center gap-1 text-xs text-gray-400 cursor-pointer hover:text-gray-300">
                    {showSettings ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    <span>Applied Settings</span>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-2 p-2 bg-gray-800/40 rounded-lg border border-gray-700/50">
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="flex justify-between">
                        <span className="text-gray-500">UV Range:</span>
                        <span className={activePreset.color}>
                          ±{activePreset.uvRange}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Segments:</span>
                        <span className={activePreset.color}>
                          {activePreset.parameters.uSegments}×{activePreset.parameters.vSegments}
                        </span>
                      </div>
                    </div>
                    <p className="mt-1 text-[8px] text-gray-500 italic">
                      {activePreset.examples}
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
