import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Brain, Sparkles, Wand2, Search, Zap } from 'lucide-react';
import { textToShape, generateShapeFromText, NEURAL_ALGORITHMS, type TextToShapeResult } from '../lib/neuralRepresentationsEngine';

interface TextToShapePanelProps {
  existingShapes: Array<{ id: string; name: string; formula?: string; category: string; getPosition: any }>;
  onShapeSelected: (shapeId: string) => void;
  onShapeGenerated: (shape: any) => void;
}

export default function TextToShapePanel({ existingShapes, onShapeSelected, onShapeGenerated }: TextToShapePanelProps) {
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState<TextToShapeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAlgorithmInfo, setShowAlgorithmInfo] = useState(false);

  const handleSearch = () => {
    if (!prompt.trim()) return;
    
    setIsSearching(true);
    
    setTimeout(() => {
      const matches = textToShape(prompt, existingShapes);
      setResults(matches);
      setIsSearching(false);
    }, 300);
  };

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    setTimeout(() => {
      const newShape = generateShapeFromText(prompt);
      onShapeGenerated(newShape);
      setIsGenerating(false);
    }, 500);
  };

  const handleSelectResult = (result: TextToShapeResult) => {
    onShapeSelected(result.id);
  };

  const examplePrompts = useMemo(() => [
    'golden spiral shell',
    'DNA double helix',
    'Mandelbrot fractal',
    'twisted torus',
    'spiral galaxy',
    'minimal surface',
    'Klein bottle',
    'snowflake crystal'
  ], []);

  return (
    <div className="space-y-3 p-3 bg-gradient-to-br from-cyan-900/40 to-blue-900/40 rounded-lg border border-cyan-500/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wide">Text to Shape</h3>
        </div>
        <button
          onClick={() => setShowAlgorithmInfo(!showAlgorithmInfo)}
          className="text-[9px] text-cyan-300/70 hover:text-cyan-300 transition-colors"
        >
          {showAlgorithmInfo ? 'Hide' : 'Show'} Algorithm Info
        </button>
      </div>

      {showAlgorithmInfo && (
        <div className="text-[9px] p-2 bg-black/30 rounded border border-cyan-500/20 space-y-2">
          <div className="text-cyan-300 font-semibold">{NEURAL_ALGORITHMS.sds.name}</div>
          <div className="text-gray-400">{NEURAL_ALGORITHMS.sds.description}</div>
          <div className="text-cyan-400/80">Components:</div>
          <ul className="list-disc list-inside text-gray-400 space-y-0.5">
            {NEURAL_ALGORITHMS.sds.components.map((comp, i) => (
              <li key={i}>{comp}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-xs text-cyan-300">Describe a shape in natural language</Label>
        <div className="flex gap-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., golden spiral with waves..."
            className="h-8 text-xs bg-gray-800/80 border-cyan-500/30 text-white placeholder:text-gray-500"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleSearch}
          disabled={isSearching || !prompt.trim()}
          className="flex-1 h-7 text-xs bg-cyan-600 hover:bg-cyan-500 text-white"
        >
          {isSearching ? (
            <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent mr-1" />
          ) : (
            <Search className="w-3 h-3 mr-1" />
          )}
          Find Matching
        </Button>
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="flex-1 h-7 text-xs bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
        >
          {isGenerating ? (
            <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent mr-1" />
          ) : (
            <Wand2 className="w-3 h-3 mr-1" />
          )}
          Generate New
        </Button>
      </div>

      <div className="flex flex-wrap gap-1">
        {examplePrompts.slice(0, 4).map((example) => (
          <button
            key={example}
            onClick={() => setPrompt(example)}
            className="text-[9px] px-2 py-0.5 bg-cyan-800/30 hover:bg-cyan-700/40 text-cyan-300 rounded border border-cyan-500/20 transition-colors"
          >
            {example}
          </button>
        ))}
      </div>

      {results.length > 0 && (
        <div className="space-y-2 max-h-40 overflow-y-auto">
          <Label className="text-xs text-cyan-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {results.length} Matching Shapes
          </Label>
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => handleSelectResult(result)}
              className="w-full text-left p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded border border-cyan-500/20 hover:border-cyan-500/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-white truncate">{result.name}</span>
                <span className="text-[9px] text-cyan-400">
                  {Math.round(result.confidence * 100)}%
                </span>
              </div>
              <div className="text-[9px] text-gray-400 truncate mt-0.5">
                {result.formula}
              </div>
              <div className="flex gap-1 mt-1 flex-wrap">
                {result.matchedKeywords.slice(0, 3).map((kw) => (
                  <span key={kw} className="text-[8px] px-1 py-0.5 bg-cyan-900/40 text-cyan-300 rounded">
                    {kw}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="text-[8px] text-cyan-300/60 text-center flex items-center justify-center gap-1">
        <Zap className="w-2 h-2" />
        Score Distillation Sampling (SDS) powered
      </div>
    </div>
  );
}
