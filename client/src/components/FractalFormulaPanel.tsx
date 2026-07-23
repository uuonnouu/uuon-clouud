import React, { useState } from 'react';
import { X, Zap, Sparkles, Calculator, ChevronDown } from 'lucide-react';
import { 
  FRACTAL_FORMULAS, 
  FORMULA_CATEGORIES, 
  MATHEMATICAL_CONSTANTS, 
  applyConstantTransform,
  type ConstantKey,
  type FractalFormula
} from '../lib/fractalFormulaExtensions';

interface FractalFormulaPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFormula: (formula: FractalFormula, intensity: number) => void;
  onApplyConstant: (constant: ConstantKey, operation: string, parameter: string) => void;
  currentParameters: Record<string, number>;
}

export default function FractalFormulaPanel({
  isOpen,
  onClose,
  onApplyFormula,
  onApplyConstant,
  currentParameters
}: FractalFormulaPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('polynomial');
  const [selectedFormula, setSelectedFormula] = useState<FractalFormula | null>(null);
  const [intensity, setIntensity] = useState(0.5);
  const [selectedConstant, setSelectedConstant] = useState<ConstantKey>('pi');
  const [selectedOperation, setSelectedOperation] = useState('multiply');
  const [targetParameter, setTargetParameter] = useState('a');

  if (!isOpen) return null;

  const categoryFormulas = FRACTAL_FORMULAS.filter(f => f.category === selectedCategory);

  const operations = [
    { value: 'multiply', label: 'Multiply (×)', symbol: '×' },
    { value: 'divide', label: 'Divide (÷)', symbol: '÷' },
    { value: 'power', label: 'Power (^)', symbol: '^' },
    { value: 'root', label: 'Root (√)', symbol: '√' },
    { value: 'add', label: 'Add (+)', symbol: '+' },
    { value: 'modulo', label: 'Modulo (%)', symbol: '%' }
  ];

  const parameters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 rounded-xl border border-purple-500/40 shadow-2xl w-[90vw] max-w-2xl max-h-[85vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-purple-500/30 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Fractal Formula Modifiers</h2>
              <p className="text-xs text-purple-300/70">70+ iteration formulas & mathematical constants</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(85vh-80px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20">
                <h3 className="text-sm font-bold text-purple-300 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Fractal Iteration Formulas
                </h3>

                <div className="mb-3">
                  <label className="text-xs text-gray-400 mb-1 block">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white"
                  >
                    {Object.entries(FORMULA_CATEGORIES).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {categoryFormulas.map((formula) => (
                    <button
                      key={formula.id}
                      onClick={() => setSelectedFormula(formula)}
                      className={`w-full text-left p-2 rounded-lg border transition-all ${
                        selectedFormula?.id === formula.id
                          ? 'bg-purple-600/30 border-purple-400'
                          : 'bg-gray-800/50 border-gray-700 hover:border-purple-500/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-mono text-purple-200">{formula.formula}</span>
                        <span className="text-xs text-gray-500">{formula.name}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">{formula.visualEffect}</p>
                    </button>
                  ))}
                </div>

                {selectedFormula && (
                  <div className="mt-3 p-3 bg-purple-900/30 rounded-lg border border-purple-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400">Intensity</span>
                      <span className="text-xs text-purple-300">{intensity.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={intensity}
                      onChange={(e) => setIntensity(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <button
                      onClick={() => onApplyFormula(selectedFormula, intensity)}
                      className="w-full mt-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg text-sm font-medium transition-all"
                    >
                      Apply {selectedFormula.formula}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-black/40 rounded-lg p-4 border border-cyan-500/20">
                <h3 className="text-sm font-bold text-cyan-300 mb-3 flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Mathematical Constants
                </h3>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  {Object.entries(MATHEMATICAL_CONSTANTS).map(([key, { symbol, name, value }]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedConstant(key as ConstantKey)}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        selectedConstant === key
                          ? 'bg-cyan-600/30 border-cyan-400'
                          : 'bg-gray-800/50 border-gray-700 hover:border-cyan-500/50'
                      }`}
                    >
                      <div className="text-lg font-bold text-cyan-200">{symbol}</div>
                      <div className="text-[9px] text-gray-400">{value.toFixed(4)}</div>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Operation</label>
                    <select
                      value={selectedOperation}
                      onChange={(e) => setSelectedOperation(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-sm text-white"
                    >
                      {operations.map((op) => (
                        <option key={op.value} value={op.value}>{op.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Parameter</label>
                    <select
                      value={targetParameter}
                      onChange={(e) => setTargetParameter(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-sm text-white"
                    >
                      {parameters.map((p) => (
                        <option key={p} value={p}>{p.toUpperCase()} = {currentParameters[p]?.toFixed(2) || 0}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-cyan-900/20 rounded-lg border border-cyan-500/30 mb-3">
                  <div className="text-center">
                    <span className="text-sm text-gray-400">Result: </span>
                    <span className="text-lg font-mono text-cyan-200">
                      {targetParameter.toUpperCase()} {operations.find(o => o.value === selectedOperation)?.symbol} {MATHEMATICAL_CONSTANTS[selectedConstant].symbol} = {' '}
                      {applyConstantTransform(
                        currentParameters[targetParameter] || 1,
                        selectedConstant,
                        selectedOperation as any
                      ).toFixed(4)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onApplyConstant(selectedConstant, selectedOperation, targetParameter)}
                  className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-sm font-medium transition-all"
                >
                  Apply {MATHEMATICAL_CONSTANTS[selectedConstant].symbol} to {targetParameter.toUpperCase()}
                </button>
              </div>

              <div className="bg-black/40 rounded-lg p-3 border border-yellow-500/20">
                <h4 className="text-xs font-bold text-yellow-300 mb-2">Three-Formula Hybrid Presets</h4>
                <div className="grid grid-cols-1 gap-2 mb-3">
                  <button
                    onClick={() => {
                      const waveEnergyFormula = FRACTAL_FORMULAS.find(f => f.id === 'wave_energy_hybrid');
                      if (waveEnergyFormula) onApplyFormula(waveEnergyFormula, 0.7);
                    }}
                    className="p-2 bg-gradient-to-r from-purple-900/40 to-pink-900/40 hover:from-purple-900/60 hover:to-pink-900/60 border border-purple-500/30 rounded text-xs text-purple-200"
                  >
                    🌊⚡ Wave-Energy Mandala
                  </button>
                  <button
                    onClick={() => {
                      const spikeShellFormula = FRACTAL_FORMULAS.find(f => f.id === 'spike_shell_armor');
                      if (spikeShellFormula) onApplyFormula(spikeShellFormula, 0.6);
                    }}
                    className="p-2 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 hover:from-cyan-900/60 hover:to-blue-900/60 border border-cyan-500/30 rounded text-xs text-cyan-200"
                  >
                    🔱🛡️ Spike-Shell Armor
                  </button>
                  <button
                    onClick={() => {
                      const crystalFlameFormula = FRACTAL_FORMULAS.find(f => f.id === 'crystal_flame_fusion');
                      if (crystalFlameFormula) onApplyFormula(crystalFlameFormula, 0.5);
                    }}
                    className="p-2 bg-gradient-to-r from-orange-900/40 to-red-900/40 hover:from-orange-900/60 hover:to-red-900/60 border border-orange-500/30 rounded text-xs text-orange-200"
                  >
                    💎🔥 Crystal-Flame Fusion
                  </button>
                  <button
                    onClick={() => {
                      const bioOrganicFormula = FRACTAL_FORMULAS.find(f => f.id === 'bio_organic_tissue');
                      if (bioOrganicFormula) onApplyFormula(bioOrganicFormula, 0.4);
                    }}
                    className="p-2 bg-gradient-to-r from-green-900/40 to-emerald-900/40 hover:from-green-900/60 hover:to-emerald-900/60 border border-green-500/30 rounded text-xs text-green-200"
                  >
                    🧬🌱 Bio-Organic Tissue
                  </button>
                </div>
                <h4 className="text-xs font-bold text-yellow-300 mb-2">Classic Presets</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onApplyConstant('phi', 'multiply', 'a');
                      onApplyConstant('phi', 'multiply', 'b');
                    }}
                    className="p-2 bg-yellow-900/30 hover:bg-yellow-900/50 border border-yellow-500/30 rounded text-xs text-yellow-200"
                  >
                    Golden Scale (A×φ, B×φ)
                  </button>
                  <button
                    onClick={() => {
                      onApplyConstant('pi', 'divide', 'a');
                    }}
                    className="p-2 bg-yellow-900/30 hover:bg-yellow-900/50 border border-yellow-500/30 rounded text-xs text-yellow-200"
                  >
                    Pi Ratio (A÷π)
                  </button>
                  <button
                    onClick={() => {
                      onApplyConstant('sqrt2', 'power', 'c');
                    }}
                    className="p-2 bg-yellow-900/30 hover:bg-yellow-900/50 border border-yellow-500/30 rounded text-xs text-yellow-200"
                  >
                    Root Power (C^√2)
                  </button>
                  <button
                    onClick={() => {
                      onApplyConstant('e', 'root', 'a');
                    }}
                    className="p-2 bg-yellow-900/30 hover:bg-yellow-900/50 border border-yellow-500/30 rounded text-xs text-yellow-200"
                  >
                    Euler Root (A^(1/e))
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
