
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { gmod6Engine, gmod6Animator, GMod6Config } from '../lib/uuon-gmod6-engine';
import { SurfaceParameters } from '../types/math';

interface GMod6ControlPanelProps {
  onParametersChange: (params: SurfaceParameters) => void;
  currentParameters: SurfaceParameters;
}

export default function GMod6ControlPanel({ 
  onParametersChange, 
  currentParameters 
}: GMod6ControlPanelProps) {
  const [gmod6Config, setGMod6Config] = useState<GMod6Config>({
    cycleSpeed: 1,
    amplitudeFactor: 0.5,
    phaseOffset: 0,
    enableHexGeometry: true,
    enableColorCycling: true,
    enableRotationalSymmetry: true
  });

  const [isAnimating, setIsAnimating] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);

  // Animation loop — dispatches mesh transforms via custom event instead of
  // writing back to the parameter store.  This eliminates geometry rebuilds
  // every 16 ms and keeps A/B/C completely isolated from animation transforms.
  useEffect(() => {
    if (!isAnimating) return;

    let localTime = animationTime;
    const interval = setInterval(() => {
      localTime += 0.016;
      setAnimationTime(localTime);
      gmod6Engine.updateTime(0.016);

      const speed = gmod6Config.cycleSpeed;
      const amp   = gmod6Config.amplitudeFactor;

      const rotY  = localTime * speed * Math.PI / 3;
      const scale = 1 + Math.sin(localTime * speed * 2) * amp * 0.08;

      window.dispatchEvent(new CustomEvent('gmod6Transform', {
        detail: { rotationY: rotY, scale }
      }));
    }, 16);

    return () => clearInterval(interval);
  }, [isAnimating, gmod6Config.cycleSpeed, gmod6Config.amplitudeFactor]);

  const currentState = gmod6Engine.getCurrentState(currentParameters.g || 0);
  const interpolatedState = gmod6Engine.getInterpolatedState(currentParameters.g || 0);

  const handleGValueChange = (value: number[]) => {
    const newG = value[0];
    const enhancedParams = gmod6Engine.enhanceParametersWithGMod6(
      { ...currentParameters, g: newG },
      gmod6Config
    );
    onParametersChange(enhancedParams);
  };

  const handleConfigChange = (key: keyof GMod6Config, value: any) => {
    const newConfig = { ...gmod6Config, [key]: value };
    setGMod6Config(newConfig);
    
    const enhancedParams = gmod6Engine.enhanceParametersWithGMod6(
      currentParameters,
      newConfig
    );
    onParametersChange(enhancedParams);
  };

  const jumpToState = (state: number) => {
    const newParams = { ...currentParameters, g: state };
    onParametersChange(newParams);
  };

  return (
    <div className="space-y-4">
      {/* Main G Mod 6 Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔄 G Mod 6 Cycle Controller
            <Badge variant="secondary">State {currentState.id}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* G Value Slider */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              G Value: {(currentParameters.g || 0).toFixed(2)} 
              (State: {Math.floor(currentParameters.g || 0) % 6})
            </label>
            <Slider
              value={[currentParameters.g || 0]}
              onValueChange={handleGValueChange}
              max={6}
              min={0}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* State Visualization */}
          <div className="grid grid-cols-6 gap-2">
            {[0, 1, 2, 3, 4, 5].map(state => (
              <Button
                key={state}
                variant={Math.floor(currentParameters.g || 0) % 6 === state ? "default" : "outline"}
                size="sm"
                onClick={() => jumpToState(state)}
                className="h-12 flex flex-col items-center justify-center"
                style={{
                  backgroundColor: Math.floor(currentParameters.g || 0) % 6 === state 
                    ? `hsl(${state * 60}, 70%, 50%)` 
                    : undefined
                }}
              >
                <div className="text-xs font-bold">{state}</div>
                <div className="text-xs">{state * 60}°</div>
              </Button>
            ))}
          </div>

          {/* Current State Info */}
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="text-sm font-medium mb-2">Current State Information:</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Phase: {currentState.phase.toFixed(2)} rad</div>
              <div>Color: HSL({currentState.id * 60}, 80%, 60%)</div>
              <div>Hex X: {currentState.hexDirection.x.toFixed(2)}</div>
              <div>Hex Y: {currentState.hexDirection.y.toFixed(2)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle>🎛️ G Mod 6 Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Cycle Speed */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Cycle Speed: {gmod6Config.cycleSpeed.toFixed(2)}
            </label>
            <Slider
              value={[gmod6Config.cycleSpeed]}
              onValueChange={(value) => handleConfigChange('cycleSpeed', value[0])}
              max={3}
              min={0.1}
              step={0.1}
            />
          </div>

          {/* Amplitude Factor */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Amplitude Factor: {gmod6Config.amplitudeFactor.toFixed(2)}
            </label>
            <Slider
              value={[gmod6Config.amplitudeFactor]}
              onValueChange={(value) => handleConfigChange('amplitudeFactor', value[0])}
              max={2}
              min={0}
              step={0.1}
            />
          </div>

          {/* Phase Offset */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Phase Offset: {gmod6Config.phaseOffset.toFixed(2)}
            </label>
            <Slider
              value={[gmod6Config.phaseOffset]}
              onValueChange={(value) => handleConfigChange('phaseOffset', value[0])}
              max={6.28}
              min={0}
              step={0.1}
            />
          </div>

          {/* Feature Toggles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Enable Hexagonal Geometry</label>
              <Switch
                checked={gmod6Config.enableHexGeometry}
                onCheckedChange={(checked) => handleConfigChange('enableHexGeometry', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Enable Color Cycling</label>
              <Switch
                checked={gmod6Config.enableColorCycling}
                onCheckedChange={(checked) => handleConfigChange('enableColorCycling', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Enable Rotational Symmetry</label>
              <Switch
                checked={gmod6Config.enableRotationalSymmetry}
                onCheckedChange={(checked) => handleConfigChange('enableRotationalSymmetry', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Animation Controls */}
      <Card>
        <CardHeader>
          <CardTitle>🎬 G Mod 6 Animation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setIsAnimating(!isAnimating)}
              variant={isAnimating ? "destructive" : "default"}
            >
              {isAnimating ? "Stop Animation" : "Start Animation"}
            </Button>
            
            <Button
              onClick={() => setAnimationTime(0)}
              variant="outline"
            >
              Reset
            </Button>
          </div>

          {isAnimating && (
            <div className="space-y-2">
              <div className="text-sm font-medium">
                Animation Time: {animationTime.toFixed(2)}s
              </div>
              <div className="text-sm text-gray-600">
                Current Cycle: {((animationTime * gmod6Config.cycleSpeed) % 6).toFixed(2)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Presets */}
      <Card>
        <CardHeader>
          <CardTitle>⚡ Quick Presets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={() => {
                setGMod6Config({
                  cycleSpeed: 1,
                  amplitudeFactor: 1,
                  phaseOffset: 0,
                  enableHexGeometry: true,
                  enableColorCycling: true,
                  enableRotationalSymmetry: true
                });
              }}
              variant="outline"
              size="sm"
            >
              Hexagonal Focus
            </Button>
            
            <Button 
              onClick={() => {
                setGMod6Config({
                  cycleSpeed: 2,
                  amplitudeFactor: 0.3,
                  phaseOffset: 1.57,
                  enableHexGeometry: false,
                  enableColorCycling: true,
                  enableRotationalSymmetry: true
                });
              }}
              variant="outline"
              size="sm"
            >
              Smooth Rotation
            </Button>
            
            <Button 
              onClick={() => {
                setGMod6Config({
                  cycleSpeed: 0.5,
                  amplitudeFactor: 1.5,
                  phaseOffset: 3.14,
                  enableHexGeometry: true,
                  enableColorCycling: false,
                  enableRotationalSymmetry: false
                });
              }}
              variant="outline"
              size="sm"
            >
              Geometric Pattern
            </Button>
            
            <Button 
              onClick={() => {
                setGMod6Config({
                  cycleSpeed: 3,
                  amplitudeFactor: 0.8,
                  phaseOffset: 0,
                  enableHexGeometry: true,
                  enableColorCycling: true,
                  enableRotationalSymmetry: true
                });
              }}
              variant="outline"
              size="sm"
            >
              Fast Cycle
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
