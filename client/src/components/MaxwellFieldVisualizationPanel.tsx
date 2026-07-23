
import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AlertCircle, Zap, Radio, Waves, Gauge, Play, Pause, RotateCcw } from 'lucide-react';

interface MaxwellVisualizationConfig {
  showElectricField: boolean;
  showMagneticField: boolean;
  showFieldLines: boolean;
  showEnergyDensity: boolean;
  showPoyntingVector: boolean;
  fieldLineCount: number;
  animationSpeed: number;
  fieldStrength: number;
  transparency: number;
  waveFrequency: number;
  waveAmplitude: number;
  chargeCount: number;
  isAnimating: boolean;
}

export default function MaxwellFieldVisualizationPanel() {
  const [config, setConfig] = useState<MaxwellVisualizationConfig>({
    showElectricField: true,
    showMagneticField: true,
    showFieldLines: true,
    showEnergyDensity: false,
    showPoyntingVector: false,
    fieldLineCount: 16,
    animationSpeed: 1.0,
    fieldStrength: 1.0,
    transparency: 0.7,
    waveFrequency: 2.0,
    waveAmplitude: 1.0,
    chargeCount: 1,
    isAnimating: true
  });

  const [selectedVisualization, setSelectedVisualization] = useState<string>('electromagnetic_wave');
  const [animationTime, setAnimationTime] = useState(0);
  const animationRef = useRef<number>();

  // Available Maxwell field visualizations
  const fieldVisualizations = [
    {
      id: 'electric_field_lines',
      name: 'Electric Field Lines',
      description: 'Gauss Law: ∇⋅E = ρ/ε₀',
      icon: '⚡',
      equations: ['∇⋅E = ρ/ε₀', 'Field lines diverge from charges']
    },
    {
      id: 'magnetic_field_lines', 
      name: 'Magnetic Field Lines',
      description: 'Gauss Law (Magnetism): ∇⋅B = 0',
      icon: '🧲',
      equations: ['∇⋅B = 0', 'Field lines form closed loops']
    },
    {
      id: 'electromagnetic_wave',
      name: 'EM Wave Propagation',
      description: 'Time Cross Field wave dynamics',
      icon: '〰️',
      equations: ['E ⊥ B ⊥ direction', 'c = 1/√(μ₀ε₀)']
    },
    {
      id: 'faraday_induction',
      name: 'Faraday Induction',
      description: 'Faraday Law: ∇×E = -∂B/∂t',
      icon: '🔄',
      equations: ['∇×E = -∂B/∂t', 'Changing B induces E']
    },
    {
      id: 'ampere_circulation',
      name: 'Ampère Circulation',
      description: 'Ampère-Maxwell: ∇×B = μ₀J + μ₀ε₀∂E/∂t',
      icon: '↻',
      equations: ['∇×B = μ₀J + μ₀ε₀∂E/∂t', 'Current creates B field']
    },
    {
      id: 'maxwell_field_interaction',
      name: 'Field Interaction',
      description: 'Complete E-B coupling dynamics',
      icon: '⚡🧲',
      equations: ['Complete Maxwell system', 'E-B field coupling']
    },
    {
      id: 'poynting_energy_flow',
      name: 'Poynting Energy Flow',
      description: 'Energy transport: S = (1/μ₀)(E × B)',
      icon: '💫',
      equations: ['S = (1/μ₀)(E × B)', 'Energy flux density']
    }
  ];

  // Animation loop
  useEffect(() => {
    if (config.isAnimating) {
      const animate = () => {
        setAnimationTime(prev => prev + 0.016 * config.animationSpeed);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [config.isAnimating, config.animationSpeed]);

  const updateConfig = (updates: Partial<MaxwellVisualizationConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const resetAnimation = () => {
    setAnimationTime(0);
  };

  const toggleAnimation = () => {
    updateConfig({ isAnimating: !config.isAnimating });
  };

  const selectedViz = fieldVisualizations.find(v => v.id === selectedVisualization);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Zap className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold">Maxwell Field Theory Visualizer</h2>
        <Badge variant="outline">Shape Formula Time Cross Field</Badge>
      </div>

      <Tabs defaultValue="visualization" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
          <TabsTrigger value="equations">Field Equations</TabsTrigger>
          <TabsTrigger value="physics">Physics Control</TabsTrigger>
        </TabsList>

        {/* Visualization Tab */}
        <TabsContent value="visualization" className="space-y-4">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Field Visualization Type</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {fieldVisualizations.map((viz) => (
                <Card 
                  key={viz.id}
                  className={`p-3 cursor-pointer transition-colors ${
                    selectedVisualization === viz.id 
                      ? 'bg-blue-50 border-blue-300' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedVisualization(viz.id)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{viz.icon}</span>
                    <h4 className="font-medium text-sm">{viz.name}</h4>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{viz.description}</p>
                  <div className="space-y-1">
                    {viz.equations.map((eq, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {eq}
                      </Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Field Visibility Controls */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Field Components</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.showElectricField}
                  onCheckedChange={(checked) => updateConfig({ showElectricField: checked })}
                />
                <Label className="text-sm">Electric Field (E)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.showMagneticField}
                  onCheckedChange={(checked) => updateConfig({ showMagneticField: checked })}
                />
                <Label className="text-sm">Magnetic Field (B)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.showFieldLines}
                  onCheckedChange={(checked) => updateConfig({ showFieldLines: checked })}
                />
                <Label className="text-sm">Field Lines</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.showEnergyDensity}
                  onCheckedChange={(checked) => updateConfig({ showEnergyDensity: checked })}
                />
                <Label className="text-sm">Energy Density</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.showPoyntingVector}
                  onCheckedChange={(checked) => updateConfig({ showPoyntingVector: checked })}
                />
                <Label className="text-sm">Poynting Vector</Label>
              </div>
            </div>
          </Card>

          {/* Animation Controls */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Animation Control</h3>
            
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant={config.isAnimating ? "default" : "outline"}
                size="sm"
                onClick={toggleAnimation}
              >
                {config.isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {config.isAnimating ? 'Pause' : 'Play'}
              </Button>
              
              <Button variant="outline" size="sm" onClick={resetAnimation}>
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
              
              <Badge variant="secondary">
                Time: {animationTime.toFixed(2)}s
              </Badge>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Animation Speed</Label>
                <Slider
                  value={[config.animationSpeed]}
                  onValueChange={([value]) => updateConfig({ animationSpeed: value })}
                  min={0.1}
                  max={3.0}
                  step={0.1}
                  className="mt-2"
                />
                <div className="text-xs text-gray-500 mt-1">{config.animationSpeed.toFixed(1)}×</div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Field Transparency</Label>
                <Slider
                  value={[config.transparency]}
                  onValueChange={([value]) => updateConfig({ transparency: value })}
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  className="mt-2"
                />
                <div className="text-xs text-gray-500 mt-1">{Math.round(config.transparency * 100)}%</div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Field Equations Tab */}
        <TabsContent value="equations" className="space-y-4">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Maxwell's Equations in Differential Form</h3>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">1. Gauss's Law for Electricity</h4>
                <div className="font-mono text-lg mb-2">∇ ⋅ E = ρ/ε₀</div>
                <p className="text-sm text-blue-700">
                  Electric field lines diverge from electric charges. The divergence of the electric field 
                  is proportional to the charge density.
                </p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">2. Gauss's Law for Magnetism</h4>
                <div className="font-mono text-lg mb-2">∇ ⋅ B = 0</div>
                <p className="text-sm text-red-700">
                  Magnetic field lines form closed loops. There are no magnetic monopoles - 
                  the divergence of magnetic field is always zero.
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">3. Faraday's Law of Induction</h4>
                <div className="font-mono text-lg mb-2">∇ × E = -∂B/∂t</div>
                <p className="text-sm text-green-700">
                  A time-varying magnetic field induces an electric field. The curl of the electric 
                  field equals the negative time derivative of the magnetic field.
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-2">4. Ampère-Maxwell Law</h4>
                <div className="font-mono text-lg mb-2">∇ × B = μ₀J + μ₀ε₀∂E/∂t</div>
                <p className="text-sm text-purple-700">
                  Magnetic fields are created by electric currents and time-varying electric fields. 
                  The curl of the magnetic field has two sources: current density and displacement current.
                </p>
              </div>
            </div>
          </Card>

          {/* Current Visualization Info */}
          {selectedViz && (
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Current Visualization: {selectedViz.name}</h3>
              <div className="space-y-2">
                {selectedViz.equations.map((equation, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Badge variant="outline">{equation}</Badge>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-3">{selectedViz.description}</p>
            </Card>
          )}
        </TabsContent>

        {/* Physics Control Tab */}
        <TabsContent value="physics" className="space-y-4">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Physical Parameters</h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Field Strength</Label>
                <Slider
                  value={[config.fieldStrength]}
                  onValueChange={([value]) => updateConfig({ fieldStrength: value })}
                  min={0.1}
                  max={5.0}
                  step={0.1}
                  className="mt-2"
                />
                <div className="text-xs text-gray-500 mt-1">{config.fieldStrength.toFixed(1)} units</div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Wave Frequency</Label>
                <Slider
                  value={[config.waveFrequency]}
                  onValueChange={([value]) => updateConfig({ waveFrequency: value })}
                  min={0.5}
                  max={10.0}
                  step={0.5}
                  className="mt-2"
                />
                <div className="text-xs text-gray-500 mt-1">{config.waveFrequency.toFixed(1)} Hz</div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Wave Amplitude</Label>
                <Slider
                  value={[config.waveAmplitude]}
                  onValueChange={([value]) => updateConfig({ waveAmplitude: value })}
                  min={0.1}
                  max={3.0}
                  step={0.1}
                  className="mt-2"
                />
                <div className="text-xs text-gray-500 mt-1">{config.waveAmplitude.toFixed(1)} units</div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Field Line Density</Label>
                <Slider
                  value={[config.fieldLineCount]}
                  onValueChange={([value]) => updateConfig({ fieldLineCount: value })}
                  min={4}
                  max={64}
                  step={4}
                  className="mt-2"
                />
                <div className="text-xs text-gray-500 mt-1">{config.fieldLineCount} lines</div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Charge Count</Label>
                <Slider
                  value={[config.chargeCount]}
                  onValueChange={([value]) => updateConfig({ chargeCount: value })}
                  min={1}
                  max={8}
                  step={1}
                  className="mt-2"
                />
                <div className="text-xs text-gray-500 mt-1">{config.chargeCount} charges</div>
              </div>
            </div>
          </Card>

          {/* Physical Constants */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Physical Constants</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="font-medium">Speed of Light</Label>
                <div className="font-mono">c = 2.998 × 10⁸ m/s</div>
              </div>
              
              <div>
                <Label className="font-medium">Vacuum Permittivity</Label>
                <div className="font-mono">ε₀ = 8.854 × 10⁻¹² F/m</div>
              </div>
              
              <div>
                <Label className="font-medium">Vacuum Permeability</Label>
                <div className="font-mono">μ₀ = 4π × 10⁻⁷ H/m</div>
              </div>
              
              <div>
                <Label className="font-medium">Impedance of Free Space</Label>
                <div className="font-mono">Z₀ = 376.73 Ω</div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Status Bar */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-center gap-3">
          <Gauge className="w-5 h-5 text-blue-600" />
          <div className="text-sm">
            <p className="font-medium text-blue-800">
              Maxwell Field Theory Visualization Active
            </p>
            <p className="text-blue-700">
              Visualizing: {selectedViz?.name} • Animation: {config.isAnimating ? 'Running' : 'Paused'} • 
              Components: {[config.showElectricField && 'E', config.showMagneticField && 'B', 
                           config.showFieldLines && 'Lines', config.showEnergyDensity && 'Energy']
                           .filter(Boolean).join(', ')}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
