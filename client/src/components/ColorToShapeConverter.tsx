
/**
 * COLOR TO SHAPE CONVERTER COMPONENT
 * Intelligent color recognition with mathematical shape recommendations
 * © 2025 UUON Foundation Inc.
 */

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Palette, Zap, Atom } from 'lucide-react';
import { parseColorInput, recommendShapeFromColor, INTELLIGENT_COLOR_MAPPINGS } from '../lib/intelligentColorRecognition';
import { SurfaceParameters } from '../types/math';

interface ColorToShapeConverterProps {
  onShapeSelect: (params: Partial<SurfaceParameters>) => void;
  className?: string;
}

export default function ColorToShapeConverter({ onShapeSelect, className = '' }: ColorToShapeConverterProps) {
  const [colorInput, setColorInput] = useState('');
  const [colorResult, setColorResult] = useState<any>(null);

  // Quick color buttons with scientific meanings
  const scientificColors = [
    { name: 'plasma', display: 'Plasma', icon: '⚡', color: '#8A2BE2' },
    { name: 'quantum', display: 'Quantum', icon: '🌊', color: '#00FFFF' },
    { name: 'thermal', display: 'Thermal', icon: '🔥', color: '#FF4500' },
    { name: 'ultraviolet', display: 'UV', icon: '💜', color: '#9400D3' },
    { name: 'infrared', display: 'IR', icon: '🔴', color: '#8B0000' },
  ];

  const handleColorInput = (input: string) => {
    setColorInput(input);
    
    // Try color name first
    const recommendation = recommendShapeFromColor(input);
    if (recommendation) {
      setColorResult(recommendation);
    } else {
      // Try hex code
      if (input.startsWith('#')) {
        const mapping = parseColorInput('plasma'); // Default fallback
        setColorResult({
          shapeType: 'spectral_surface',
          parameters: { a: 2, b: 1.5, hexCode: input },
          explanation: `Custom hex color ${input} → Spectral surface visualization`
        });
      } else {
        setColorResult(null);
      }
    }
  };

  const handleQuickColor = (colorName: string) => {
    handleColorInput(colorName);
  };

  const handleUseShape = () => {
    if (colorResult) {
      onShapeSelect({
        type: colorResult.shapeType,
        ...colorResult.parameters
      });
    }
  };

  return (
    <Card className={`bg-black/40 border border-blue-500/30 ${className}`}>
      <CardHeader>
        <CardTitle className="text-blue-400 text-sm flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Intelligent Color Recognition
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        
        {/* Color Input */}
        <div className="space-y-2">
          <Input
            value={colorInput}
            onChange={(e) => handleColorInput(e.target.value)}
            placeholder="Type: plasma, quantum, #FF0000, thermal..."
            className="bg-black/60 border-blue-500/50 text-white placeholder-gray-400"
          />
          
          {/* Scientific Color Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {scientificColors.map(color => (
              <Button
                key={color.name}
                variant="outline"
                size="sm"
                onClick={() => handleQuickColor(color.name)}
                className="border-blue-500/30 hover:border-blue-400 text-white text-xs p-2"
                style={{ borderColor: color.color }}
              >
                <span className="mr-1">{color.icon}</span>
                {color.display}
              </Button>
            ))}
          </div>
        </div>

        {/* Color Recognition Result */}
        {colorResult && (
          <div className="space-y-2">
            <div className="bg-black/40 p-3 rounded border border-blue-500/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Atom className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium text-sm">Scientific Match</span>
                </div>
                <Badge variant="outline" className="text-xs border-blue-500/30 text-blue-300">
                  {colorResult.shapeType}
                </Badge>
              </div>
              <div className="text-gray-300 text-xs mb-2">
                {colorResult.explanation}
              </div>
              <Button
                size="sm"
                onClick={handleUseShape}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
              >
                <Zap className="w-3 h-3 mr-1" />
                Generate Shape
              </Button>
            </div>
          </div>
        )}

        {/* Available Scientific Colors */}
        <div className="space-y-1">
          <div className="text-xs text-blue-300">Available Scientific Colors:</div>
          <div className="grid grid-cols-2 gap-1 text-xs text-gray-400">
            {Object.keys(INTELLIGENT_COLOR_MAPPINGS).map(color => (
              <div key={color} className="flex items-center gap-1">
                <div 
                  className="w-2 h-2 rounded"
                  style={{ backgroundColor: INTELLIGENT_COLOR_MAPPINGS[color].hexCode }}
                />
                {color}
              </div>
            ))}
          </div>
        </div>

        {/* Info Text */}
        <div className="text-xs text-gray-400 space-y-1">
          <div>🎨 Colors map to scientific phenomena</div>
          <div>⚡ Each color has mathematical meaning</div>
          <div>🔬 Hex codes generate spectral surfaces</div>
        </div>

      </CardContent>
    </Card>
  );
}
