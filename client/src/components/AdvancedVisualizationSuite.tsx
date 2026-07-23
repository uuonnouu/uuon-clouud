import React, { useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Noise } from '@react-three/postprocessing';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { SurfaceParameters } from '../types/math';
import { adaptiveCryptographicRenderer } from '@/lib/adaptiveCryptographicRenderer';

interface AdvancedEffect {
  name: string;
  type: 'healing' | 'educational' | 'research' | 'artistic';
  description: string;
  therapeuticBenefits: string[];
  parameters: Partial<SurfaceParameters>;
}

const ADVANCED_EFFECTS: AdvancedEffect[] = [
  {
    name: "Sacred Geometry Exploration",
    type: "artistic",
    description: "Explore sacred geometric patterns and structures",
    therapeuticBenefits: [
      "Visual meditation through geometric patterns",
      "Relaxation via rhythmic mathematical structures",
      "Creative inspiration through complex forms",
      "Focus enhancement through pattern observation"
    ],
    parameters: {
      type: 'root_chakra',
      a: 2.0,
      b: 1.5,
      c: 0.8,
      d: 1.2
    }
  },
  {
    name: "4D Visualization Suite",
    type: "educational",
    description: "Explore higher-dimensional geometry through 3D projections",
    therapeuticBenefits: [
      "Spatial reasoning development",
      "Mathematical intuition building",
      "Dimensional thinking practice",
      "Problem-solving through visualization"
    ],
    parameters: {
      type: 'tesseract_4d',
      a: 1.0,
      d: 0.5,
      e: 0.3
    }
  },
  {
    name: "Geometric Meditation Patterns",
    type: "artistic",
    description: "Contemplative geometric patterns for relaxation",
    therapeuticBenefits: [
      "Visual relaxation through geometry",
      "Focus enhancement",
      "Creative visualization",
      "Pattern appreciation"
    ],
    parameters: {
      type: 'crown_chakra',
      a: 3.0,
      b: 2.5,
      c: 1.8
    }
  },
  {
    name: "Quantum Consciousness Explorer",
    type: "research",
    description: "Advanced quantum field visualization for consciousness research",
    therapeuticBenefits: [
      "Reality perception expansion",
      "Dimensional awareness development",
      "Quantum thinking enhancement",
      "Cosmic consciousness connection"
    ],
    parameters: {
      type: 'hypersphere_4d',
      a: 2.5,
      w: 1.0,
      d: 0.7
    }
  },
  {
    name: "Educational STEM Accelerator",
    type: "educational",
    description: "Progressive mathematical learning through interactive visualization",
    therapeuticBenefits: [
      "Mathematical intuition development",
      "Spatial intelligence enhancement",
      "Problem-solving skill building",
      "STEM confidence boosting"
    ],
    parameters: {
      type: 'cube',
      a: 1.5,
      b: 1.5,
      c: 1.5
    }
  }
];

interface AdvancedVisualizationSuiteProps {
  onEffectSelect: (effect: AdvancedEffect) => void;
}

export default function AdvancedVisualizationSuite({ onEffectSelect }: AdvancedVisualizationSuiteProps) {
  const [activeEffect, setActiveEffect] = useState<AdvancedEffect | null>(null);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [therapeuticMode, setTherapeuticMode] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (therapeuticMode) {
      interval = setInterval(() => {
        setSessionTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [therapeuticMode]);

  const startTherapeuticSession = (effect: AdvancedEffect) => {
    setActiveEffect(effect);
    setTherapeuticMode(true);
    setSessionTimer(0);
    onEffectSelect(effect);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const [parameters, setParameters] = useState<Partial<SurfaceParameters>>({});

  const handleParameterChange = useCallback((param: string, value: number) => {
    adaptiveCryptographicRenderer.updateWithInput(`${param}:${value}`);
    const newParameters = { ...parameters, [param]: value };
    setParameters(newParameters);
  }, [parameters]);

  return (
    <div className="advanced-visualization-suite p-6 bg-black/90 backdrop-blur-sm rounded-lg border border-cyan-300 text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-cyan-300 mb-2">Advanced Therapeutic & Research Suite</h2>
        <p className="text-gray-300">Professional-grade mathematical visualization for healing, education, and consciousness research</p>
      </div>

      {therapeuticMode && activeEffect && (
        <Card className="mb-6 bg-green-900/50 border-green-400">
          <CardHeader>
            <CardTitle className="text-green-300">Active Session: {activeEffect.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-green-200">Session Duration: {formatTime(sessionTimer)}</span>
              <Button 
                onClick={() => setTherapeuticMode(false)}
                variant="destructive"
                size="sm"
              >
                End Session
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="healing" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="healing" className="data-[state=active]:bg-green-600">Healing</TabsTrigger>
          <TabsTrigger value="educational" className="data-[state=active]:bg-blue-600">Educational</TabsTrigger>
          <TabsTrigger value="research" className="data-[state=active]:bg-purple-600">Research</TabsTrigger>
          <TabsTrigger value="artistic" className="data-[state=active]:bg-orange-600">Artistic</TabsTrigger>
        </TabsList>

        {['healing', 'educational', 'research', 'artistic'].map(category => (
          <TabsContent key={category} value={category} className="mt-6">
            <div className="grid gap-4">
              {ADVANCED_EFFECTS.filter(effect => effect.type === category).map((effect, index) => (
                <Card key={index} className="bg-gray-900/80 border-gray-600 hover:border-cyan-400 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-cyan-300">{effect.name}</CardTitle>
                    <p className="text-gray-400">{effect.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h4 className="font-semibold text-green-300 mb-2">Therapeutic Benefits:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                        {effect.therapeuticBenefits.map((benefit, i) => (
                          <li key={i}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                    <Button 
                      onClick={() => startTherapeuticSession(effect)}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                    >
                      Start {effect.type === 'healing' ? 'Therapy' : 'Session'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-8 p-4 bg-yellow-900/30 border border-yellow-500 rounded-lg">
        <h3 className="font-bold text-yellow-300 mb-2">⚠️ Professional Disclaimer</h3>
        <p className="text-yellow-200 text-sm">
          This application provides supplementary therapeutic visualization. Always consult qualified healthcare 
          professionals for serious mental health conditions. Not a replacement for professional medical treatment.
        </p>
      </div>
    </div>
  );
}