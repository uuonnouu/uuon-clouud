import React from 'react';
import { useLightingStore, LIGHTING_PRESETS, LightingMode } from '../stores/lightingStore';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Sun, Moon, Lightbulb, RotateCcw, Sparkles, Film, Layers, Move, Eye, Focus, Contrast, Palette } from 'lucide-react';

interface LightingControlsProps {
  collapsed?: boolean;
}

export default function LightingControls({ collapsed = false }: LightingControlsProps) {
  const {
    lightingMode,
    ambientIntensity,
    keyLightIntensity,
    keyLightX,
    keyLightY,
    keyLightZ,
    fillLightIntensity,
    rimLightIntensity,
    shadowsEnabled,
    shadowSoftness,
    bloomEnabled,
    bloomIntensity,
    ssaoEnabled,
    ssaoIntensity,
    environmentPreset,
    activePreset,
    uvOffsetX,
    uvOffsetY,
    materialOpacity,
    sharpness,
    contrast,
    saturation,
    setLightingMode,
    setAmbientIntensity,
    setKeyLightIntensity,
    setKeyLightPosition,
    setFillLightIntensity,
    setRimLightIntensity,
    setShadowsEnabled,
    setShadowSoftness,
    setBloomEnabled,
    setBloomIntensity,
    setSsaoEnabled,
    setSsaoIntensity,
    setEnvironmentPreset,
    setUvOffsetX,
    setUvOffsetY,
    setMaterialOpacity,
    setSharpness,
    setContrast,
    setSaturation,
    applyPreset,
    resetToDefaults
  } = useLightingStore();

  if (collapsed) {
    return null;
  }

  const presetOptions = Object.keys(LIGHTING_PRESETS).map(key => ({
    value: key,
    label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
  }));

  const environmentOptions = [
    { value: 'night', label: 'Night' },
    { value: 'sunset', label: 'Sunset' },
    { value: 'dawn', label: 'Dawn' },
    { value: 'warehouse', label: 'Warehouse' },
    { value: 'forest', label: 'Forest' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'studio', label: 'Studio' },
    { value: 'city', label: 'City' },
    { value: 'park', label: 'Park' },
    { value: 'lobby', label: 'Lobby' }
  ];

  return (
    <div className="space-y-4 p-3 bg-black/40 rounded-lg backdrop-blur-sm border border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium text-white">Lighting</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetToDefaults}
          className="h-6 px-2 text-xs text-gray-400 hover:text-white"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </Button>
      </div>

      {/* Lighting Mode Toggle */}
      <div className="space-y-1">
        <Label className="text-xs text-gray-400 flex items-center gap-1">
          <Layers className="w-3 h-3" /> Rendering Mode
        </Label>
        <div className="flex gap-1">
          <Button
            variant={lightingMode === 'studio' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLightingMode('studio')}
            className={`flex-1 h-7 text-[10px] ${lightingMode === 'studio' ? 'bg-blue-600' : 'bg-black/30 border-white/20'}`}
          >
            <Film className="w-3 h-3 mr-1" />
            Studio
          </Button>
          <Button
            variant={lightingMode === 'glow' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLightingMode('glow')}
            className={`flex-1 h-7 text-[10px] ${lightingMode === 'glow' ? 'bg-purple-600' : 'bg-black/30 border-white/20'}`}
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Glow
          </Button>
          <Button
            variant={lightingMode === 'cinematic' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLightingMode('cinematic')}
            className={`flex-1 h-7 text-[10px] ${lightingMode === 'cinematic' ? 'bg-amber-600' : 'bg-black/30 border-white/20'}`}
          >
            <Moon className="w-3 h-3 mr-1" />
            Cine
          </Button>
        </div>
        <p className="text-[9px] text-gray-500 mt-0.5">
          {lightingMode === 'studio' && 'Clean geometric shading (SSAO, no bloom)'}
          {lightingMode === 'glow' && 'Emissive glow effects (bloom enabled)'}
          {lightingMode === 'cinematic' && 'Film look (SSAO + subtle bloom)'}
        </p>
      </div>

      {/* Preset Selection */}
      <div className="space-y-1">
        <Label className="text-xs text-gray-400">Preset</Label>
        <Select value={activePreset} onValueChange={applyPreset}>
          <SelectTrigger className="h-8 text-xs bg-black/30 border-white/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {presetOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Ambient Light */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-gray-400 flex items-center gap-1">
            <Sun className="w-3 h-3" /> Ambient
          </Label>
          <span className="text-xs text-gray-500">{ambientIntensity.toFixed(2)}</span>
        </div>
        <Slider
          value={[ambientIntensity]}
          onValueChange={([v]) => setAmbientIntensity(v)}
          min={0}
          max={1}
          step={0.01}
          className="h-1"
        />
      </div>

      {/* Key Light */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-gray-400 flex items-center gap-1">
            <Lightbulb className="w-3 h-3" /> Key Light
          </Label>
          <span className="text-xs text-gray-500">{keyLightIntensity.toFixed(2)}</span>
        </div>
        <Slider
          value={[keyLightIntensity]}
          onValueChange={([v]) => setKeyLightIntensity(v)}
          min={0}
          max={2}
          step={0.05}
          className="h-1"
        />
      </div>

      {/* Key Light Position */}
      <div className="space-y-2">
        <Label className="text-xs text-gray-400">Key Position</Label>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label className="text-[10px] text-gray-500">X</Label>
            <Slider
              value={[keyLightX]}
              onValueChange={([v]) => setKeyLightPosition(v, keyLightY, keyLightZ)}
              min={-20}
              max={20}
              step={1}
              className="h-1"
            />
          </div>
          <div>
            <Label className="text-[10px] text-gray-500">Y</Label>
            <Slider
              value={[keyLightY]}
              onValueChange={([v]) => setKeyLightPosition(keyLightX, v, keyLightZ)}
              min={0}
              max={30}
              step={1}
              className="h-1"
            />
          </div>
          <div>
            <Label className="text-[10px] text-gray-500">Z</Label>
            <Slider
              value={[keyLightZ]}
              onValueChange={([v]) => setKeyLightPosition(keyLightX, keyLightY, v)}
              min={-20}
              max={20}
              step={1}
              className="h-1"
            />
          </div>
        </div>
      </div>

      {/* Fill & Rim Lights */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-gray-400">Fill</Label>
            <span className="text-[10px] text-gray-500">{fillLightIntensity.toFixed(2)}</span>
          </div>
          <Slider
            value={[fillLightIntensity]}
            onValueChange={([v]) => setFillLightIntensity(v)}
            min={0}
            max={1}
            step={0.05}
            className="h-1"
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-gray-400">Rim</Label>
            <span className="text-[10px] text-gray-500">{rimLightIntensity.toFixed(2)}</span>
          </div>
          <Slider
            value={[rimLightIntensity]}
            onValueChange={([v]) => setRimLightIntensity(v)}
            min={0}
            max={1}
            step={0.05}
            className="h-1"
          />
        </div>
      </div>

      {/* Shadows */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-gray-400 flex items-center gap-1">
            <Moon className="w-3 h-3" /> Shadows
          </Label>
          <Switch
            checked={shadowsEnabled}
            onCheckedChange={setShadowsEnabled}
            className="scale-75"
          />
        </div>
        {shadowsEnabled && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-400">Softness</Label>
              <span className="text-[10px] text-gray-500">{shadowSoftness}</span>
            </div>
            <Slider
              value={[shadowSoftness]}
              onValueChange={([v]) => setShadowSoftness(v)}
              min={1}
              max={10}
              step={1}
              className="h-1"
            />
          </div>
        )}
      </div>

      {/* Environment */}
      <div className="space-y-1">
        <Label className="text-xs text-gray-400">Environment</Label>
        <Select value={environmentPreset} onValueChange={setEnvironmentPreset}>
          <SelectTrigger className="h-8 text-xs bg-black/30 border-white/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {environmentOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Studio Enhancements */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <Label className="text-xs text-gray-400 flex items-center gap-1">
          <Focus className="w-3 h-3" /> Studio Enhancements
        </Label>

        {/* UV Offset */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] text-gray-500 flex items-center gap-1">
                <Move className="w-2.5 h-2.5" /> UV X
              </Label>
              <span className="text-[9px] text-gray-500">{uvOffsetX.toFixed(2)}</span>
            </div>
            <Slider
              value={[uvOffsetX]}
              onValueChange={([v]) => setUvOffsetX(v)}
              min={-1}
              max={1}
              step={0.01}
              className="h-1"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] text-gray-500 flex items-center gap-1">
                <Move className="w-2.5 h-2.5" /> UV Y
              </Label>
              <span className="text-[9px] text-gray-500">{uvOffsetY.toFixed(2)}</span>
            </div>
            <Slider
              value={[uvOffsetY]}
              onValueChange={([v]) => setUvOffsetY(v)}
              min={-1}
              max={1}
              step={0.01}
              className="h-1"
            />
          </div>
        </div>

        {/* Opacity */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-gray-400 flex items-center gap-1">
              <Eye className="w-3 h-3" /> Opacity
            </Label>
            <span className="text-[10px] text-gray-500">{(materialOpacity * 100).toFixed(0)}%</span>
          </div>
          <Slider
            value={[materialOpacity]}
            onValueChange={([v]) => setMaterialOpacity(v)}
            min={0.1}
            max={1}
            step={0.01}
            className="h-1"
          />
        </div>

        {/* Sharpness */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-gray-400 flex items-center gap-1">
              <Focus className="w-3 h-3" /> Sharpness
            </Label>
            <span className="text-[10px] text-gray-500">{sharpness.toFixed(1)}</span>
          </div>
          <Slider
            value={[sharpness]}
            onValueChange={([v]) => setSharpness(v)}
            min={0}
            max={2}
            step={0.1}
            className="h-1"
          />
        </div>

        {/* Contrast & Saturation */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] text-gray-500 flex items-center gap-1">
                <Contrast className="w-2.5 h-2.5" /> Contrast
              </Label>
              <span className="text-[9px] text-gray-500">{contrast.toFixed(2)}</span>
            </div>
            <Slider
              value={[contrast]}
              onValueChange={([v]) => setContrast(v)}
              min={0.5}
              max={2}
              step={0.05}
              className="h-1"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] text-gray-500 flex items-center gap-1">
                <Palette className="w-2.5 h-2.5" /> Saturation
              </Label>
              <span className="text-[9px] text-gray-500">{saturation.toFixed(2)}</span>
            </div>
            <Slider
              value={[saturation]}
              onValueChange={([v]) => setSaturation(v)}
              min={0}
              max={2}
              step={0.05}
              className="h-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
