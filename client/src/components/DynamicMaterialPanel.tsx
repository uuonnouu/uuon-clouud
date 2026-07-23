import React, { useState, useCallback } from 'react';
import { Palette, Zap, Eye, Clock, Sun, Move, MousePointer, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  REACTIVE_MATERIAL_PRESETS, 
  ReactiveMaterialConfig,
  getPresetIds,
  getPresetInfo
} from '../lib/reactiveMaterialEngine';

interface DynamicMaterialPanelProps {
  onMaterialChange: (config: ReactiveMaterialConfig) => void;
  currentMaterial?: ReactiveMaterialConfig;
}

export default function DynamicMaterialPanel({ onMaterialChange, currentMaterial }: DynamicMaterialPanelProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>('glow_proximity');
  const [customConfig, setCustomConfig] = useState<ReactiveMaterialConfig>(
    currentMaterial || REACTIVE_MATERIAL_PRESETS.glow_proximity
  );
  const [isCustomMode, setIsCustomMode] = useState(false);

  const handlePresetChange = useCallback((presetId: string) => {
    setSelectedPreset(presetId);
    const preset = REACTIVE_MATERIAL_PRESETS[presetId];
    if (preset) {
      setCustomConfig(preset);
      onMaterialChange(preset);
    }
  }, [onMaterialChange]);

  const updateConfig = useCallback((updates: Partial<ReactiveMaterialConfig>) => {
    const newConfig = { ...customConfig, ...updates };
    setCustomConfig(newConfig);
    onMaterialChange(newConfig);
  }, [customConfig, onMaterialChange]);

  const updateLightResponse = useCallback((updates: Partial<ReactiveMaterialConfig['lightResponse']>) => {
    updateConfig({
      lightResponse: { ...customConfig.lightResponse, ...updates }
    });
  }, [customConfig, updateConfig]);

  const updateProximityResponse = useCallback((updates: Partial<ReactiveMaterialConfig['proximityResponse']>) => {
    updateConfig({
      proximityResponse: { ...customConfig.proximityResponse, ...updates }
    });
  }, [customConfig, updateConfig]);

  const updateInteractionResponse = useCallback((updates: Partial<ReactiveMaterialConfig['interactionResponse']>) => {
    updateConfig({
      interactionResponse: { ...customConfig.interactionResponse, ...updates }
    });
  }, [customConfig, updateConfig]);

  const updateTimeAnimation = useCallback((updates: Partial<ReactiveMaterialConfig['timeAnimation']>) => {
    updateConfig({
      timeAnimation: { ...customConfig.timeAnimation, ...updates }
    });
  }, [customConfig, updateConfig]);

  const presetIds = getPresetIds();

  return (
    <div className="space-y-3 p-3 bg-gray-900/80 rounded-lg border border-cyan-500/30">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wide">Dynamic Materials</h3>
      </div>

      {/* Preset Selection */}
      <div className="space-y-2">
        <Label className="text-xs text-cyan-300">Material Preset</Label>
        <Select value={selectedPreset} onValueChange={handlePresetChange}>
          <SelectTrigger className="h-8 text-xs bg-gray-800 border-cyan-500/30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-cyan-500/30">
            {presetIds.map(id => {
              const info = getPresetInfo(id);
              return (
                <SelectItem key={id} value={id}>
                  <div className="flex flex-col">
                    <span>{info?.name || id}</span>
                    <span className="text-[9px] text-gray-400">{info?.description}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Custom Mode Toggle */}
      <div className="flex items-center justify-between py-1">
        <Label className="text-xs text-cyan-300">Custom Mode</Label>
        <Switch
          checked={isCustomMode}
          onCheckedChange={setIsCustomMode}
          className="scale-75"
        />
      </div>

      {isCustomMode && (
        <>
          {/* Base Colors */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[10px] text-cyan-300">Base Color</Label>
              <input
                type="color"
                value={customConfig.baseColor}
                onChange={(e) => updateConfig({ baseColor: e.target.value })}
                className="w-full h-6 rounded cursor-pointer"
              />
            </div>
            <div>
              <Label className="text-[10px] text-cyan-300">Emissive</Label>
              <input
                type="color"
                value={customConfig.emissiveColor}
                onChange={(e) => updateConfig({ emissiveColor: e.target.value })}
                className="w-full h-6 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Metalness & Roughness */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[10px] text-cyan-300">Metalness: {customConfig.metalness.toFixed(1)}</Label>
              <Slider
                value={[customConfig.metalness]}
                onValueChange={([v]) => updateConfig({ metalness: v })}
                min={0}
                max={1}
                step={0.1}
                className="h-4"
              />
            </div>
            <div>
              <Label className="text-[10px] text-cyan-300">Roughness: {customConfig.roughness.toFixed(1)}</Label>
              <Slider
                value={[customConfig.roughness]}
                onValueChange={([v]) => updateConfig({ roughness: v })}
                min={0}
                max={1}
                step={0.1}
                className="h-4"
              />
            </div>
          </div>

          {/* Light Response Section */}
          <div className="p-2 bg-amber-900/20 rounded border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Sun className="w-3 h-3 text-amber-400" />
                <Label className="text-[10px] text-amber-300">Light Response</Label>
              </div>
              <Switch
                checked={customConfig.lightResponse.enabled}
                onCheckedChange={(enabled) => updateLightResponse({ enabled })}
                className="scale-75"
              />
            </div>
            
            {customConfig.lightResponse.enabled && (
              <div className="space-y-1">
                <div>
                  <Label className="text-[9px] text-amber-300/70">
                    Intensity: {customConfig.lightResponse.intensityMultiplier.toFixed(1)}x
                  </Label>
                  <Slider
                    value={[customConfig.lightResponse.intensityMultiplier]}
                    onValueChange={([v]) => updateLightResponse({ intensityMultiplier: v })}
                    min={0.5}
                    max={3}
                    step={0.1}
                    className="h-3"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={customConfig.lightResponse.glowOnLight}
                    onCheckedChange={(glowOnLight) => updateLightResponse({ glowOnLight })}
                    className="scale-50"
                  />
                  <Label className="text-[9px] text-amber-300/70">Glow on Light</Label>
                </div>
              </div>
            )}
          </div>

          {/* Proximity Response Section */}
          <div className="p-2 bg-blue-900/20 rounded border border-blue-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Move className="w-3 h-3 text-blue-400" />
                <Label className="text-[10px] text-blue-300">Proximity Response</Label>
              </div>
              <Switch
                checked={customConfig.proximityResponse.enabled}
                onCheckedChange={(enabled) => updateProximityResponse({ enabled })}
                className="scale-75"
              />
            </div>
            
            {customConfig.proximityResponse.enabled && (
              <div className="space-y-1">
                <div>
                  <Label className="text-[9px] text-blue-300/70">Effect</Label>
                  <Select 
                    value={customConfig.proximityResponse.effect} 
                    onValueChange={(effect: any) => updateProximityResponse({ effect })}
                  >
                    <SelectTrigger className="h-6 text-[10px] bg-gray-800/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800">
                      <SelectItem value="glow">Glow</SelectItem>
                      <SelectItem value="color-shift">Color Shift</SelectItem>
                      <SelectItem value="pulse">Pulse</SelectItem>
                      <SelectItem value="dissolve">Dissolve</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[9px] text-blue-300/70">
                    Activation: {customConfig.proximityResponse.activationDistance}
                  </Label>
                  <Slider
                    value={[customConfig.proximityResponse.activationDistance]}
                    onValueChange={([v]) => updateProximityResponse({ activationDistance: v })}
                    min={1}
                    max={20}
                    step={1}
                    className="h-3"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Interaction Response Section */}
          <div className="p-2 bg-green-900/20 rounded border border-green-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <MousePointer className="w-3 h-3 text-green-400" />
                <Label className="text-[10px] text-green-300">Interaction Response</Label>
              </div>
              <Switch
                checked={customConfig.interactionResponse.enabled}
                onCheckedChange={(enabled) => updateInteractionResponse({ enabled })}
                className="scale-75"
              />
            </div>
            
            {customConfig.interactionResponse.enabled && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[9px] text-green-300/70">Hover</Label>
                  <Select 
                    value={customConfig.interactionResponse.hoverEffect} 
                    onValueChange={(hoverEffect: any) => updateInteractionResponse({ hoverEffect })}
                  >
                    <SelectTrigger className="h-6 text-[10px] bg-gray-800/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800">
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="glow">Glow</SelectItem>
                      <SelectItem value="highlight">Highlight</SelectItem>
                      <SelectItem value="ripple">Ripple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[9px] text-green-300/70">Click</Label>
                  <Select 
                    value={customConfig.interactionResponse.clickEffect} 
                    onValueChange={(clickEffect: any) => updateInteractionResponse({ clickEffect })}
                  >
                    <SelectTrigger className="h-6 text-[10px] bg-gray-800/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800">
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="flash">Flash</SelectItem>
                      <SelectItem value="wave">Wave</SelectItem>
                      <SelectItem value="dissolve">Dissolve</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Time Animation Section */}
          <div className="p-2 bg-purple-900/20 rounded border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-purple-400" />
                <Label className="text-[10px] text-purple-300">Time Animation</Label>
              </div>
              <Switch
                checked={customConfig.timeAnimation.enabled}
                onCheckedChange={(enabled) => updateTimeAnimation({ enabled })}
                className="scale-75"
              />
            </div>
            
            {customConfig.timeAnimation.enabled && (
              <div className="space-y-1">
                <div>
                  <Label className="text-[9px] text-purple-300/70">Pattern</Label>
                  <Select 
                    value={customConfig.timeAnimation.pattern} 
                    onValueChange={(pattern: any) => updateTimeAnimation({ pattern })}
                  >
                    <SelectTrigger className="h-6 text-[10px] bg-gray-800/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800">
                      <SelectItem value="pulse">Pulse</SelectItem>
                      <SelectItem value="wave">Wave</SelectItem>
                      <SelectItem value="breathe">Breathe</SelectItem>
                      <SelectItem value="shimmer">Shimmer</SelectItem>
                      <SelectItem value="rainbow">Rainbow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[9px] text-purple-300/70">
                    Speed: {customConfig.timeAnimation.speed.toFixed(1)}x
                  </Label>
                  <Slider
                    value={[customConfig.timeAnimation.speed]}
                    onValueChange={([v]) => updateTimeAnimation({ speed: v })}
                    min={0.1}
                    max={3}
                    step={0.1}
                    className="h-3"
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Preview Info */}
      <div className="text-[9px] text-cyan-300/60 text-center">
        {isCustomMode ? 'Custom reactive material' : getPresetInfo(selectedPreset)?.description}
      </div>
    </div>
  );
}
