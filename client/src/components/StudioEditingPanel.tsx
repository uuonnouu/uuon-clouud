import React, { useState, useCallback, useRef } from 'react';
import { 
  Palette, Eye, Sparkles, Upload, Download, Sliders, 
  Sun, Star, Wand2, Image, Circle, Square
} from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

export interface StudioSettings {
  matcap: {
    enabled: boolean;
    texture: string | null;
    intensity: number;
    bakeToExport: boolean;
  };
  opacity: {
    value: number;
    transmissionEnabled: boolean;
    transmissionIntensity: number;
  };
  sharpness: {
    enabled: boolean;
    value: number;
    edgeContrast: number;
  };
  textureMaps: {
    normalMapEnabled: boolean;
    normalMapTexture: string | null;
    normalMapIntensity: number;
    bumpMapEnabled: boolean;
    bumpMapTexture: string | null;
    bumpMapIntensity: number;
    bakeToExport: boolean;
  };
  starDust: {
    enabled: boolean;
    count: number;
    size: number;
    speed: number;
    color: string;
    includeInExport: boolean;
  };
  exportFidelity: {
    matchStudioAppearance: boolean;
    bakePostProcessing: boolean;
    includeLighting: boolean;
    includeParticles: boolean;
    includeTextureMaps: boolean;
  };
}

const DEFAULT_STUDIO_SETTINGS: StudioSettings = {
  matcap: {
    enabled: false,
    texture: null,
    intensity: 1.0,
    bakeToExport: true
  },
  opacity: {
    value: 1.0,
    transmissionEnabled: false,
    transmissionIntensity: 0.5
  },
  sharpness: {
    enabled: false,
    value: 0.5,
    edgeContrast: 0.3
  },
  textureMaps: {
    normalMapEnabled: false,
    normalMapTexture: null,
    normalMapIntensity: 1.0,
    bumpMapEnabled: false,
    bumpMapTexture: null,
    bumpMapIntensity: 0.5,
    bakeToExport: true
  },
  starDust: {
    enabled: false,
    count: 500,
    size: 0.02,
    speed: 0.5,
    color: '#ffffff',
    includeInExport: true
  },
  exportFidelity: {
    matchStudioAppearance: true,
    bakePostProcessing: true,
    includeLighting: true,
    includeParticles: true,
    includeTextureMaps: true
  }
};

const PRESET_MATCAPS = [
  { id: 'none', name: 'None', url: null },
  { id: 'custom', name: 'Upload Custom MatCap...', url: null }
];

interface StudioEditingPanelProps {
  settings?: StudioSettings;
  onSettingsChange: (settings: StudioSettings) => void;
  onExportWithSettings?: (settings: StudioSettings) => void;
}

export default function StudioEditingPanel({ 
  settings = DEFAULT_STUDIO_SETTINGS, 
  onSettingsChange,
  onExportWithSettings 
}: StudioEditingPanelProps) {
  const [currentSettings, setCurrentSettings] = useState<StudioSettings>(settings);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    matcap: false,
    opacity: false,
    sharpness: false,
    textureMaps: false,
    starDust: false,
    exportFidelity: true
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const normalMapInputRef = useRef<HTMLInputElement>(null);
  const bumpMapInputRef = useRef<HTMLInputElement>(null);

  const updateSettings = useCallback((updates: Partial<StudioSettings>) => {
    const newSettings = { ...currentSettings, ...updates };
    setCurrentSettings(newSettings);
    onSettingsChange(newSettings);
  }, [currentSettings, onSettingsChange]);

  const updateMatcap = useCallback((updates: Partial<StudioSettings['matcap']>) => {
    updateSettings({ matcap: { ...currentSettings.matcap, ...updates } });
  }, [currentSettings, updateSettings]);

  const updateOpacity = useCallback((updates: Partial<StudioSettings['opacity']>) => {
    updateSettings({ opacity: { ...currentSettings.opacity, ...updates } });
  }, [currentSettings, updateSettings]);

  const updateSharpness = useCallback((updates: Partial<StudioSettings['sharpness']>) => {
    updateSettings({ sharpness: { ...currentSettings.sharpness, ...updates } });
  }, [currentSettings, updateSettings]);

  const updateStarDust = useCallback((updates: Partial<StudioSettings['starDust']>) => {
    updateSettings({ starDust: { ...currentSettings.starDust, ...updates } });
  }, [currentSettings, updateSettings]);

  const updateExportFidelity = useCallback((updates: Partial<StudioSettings['exportFidelity']>) => {
    updateSettings({ exportFidelity: { ...currentSettings.exportFidelity, ...updates } });
  }, [currentSettings, updateSettings]);

  const updateTextureMaps = useCallback((updates: Partial<StudioSettings['textureMaps']>) => {
    updateSettings({ textureMaps: { ...currentSettings.textureMaps, ...updates } });
  }, [currentSettings, updateSettings]);

  const handleMatcapUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        updateMatcap({ texture: dataUrl, enabled: true });
      };
      reader.readAsDataURL(file);
    }
  }, [updateMatcap]);

  const handleNormalMapUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        updateTextureMaps({ normalMapTexture: dataUrl, normalMapEnabled: true });
      };
      reader.readAsDataURL(file);
    }
  }, [updateTextureMaps]);

  const handleBumpMapUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        updateTextureMaps({ bumpMapTexture: dataUrl, bumpMapEnabled: true });
      };
      reader.readAsDataURL(file);
    }
  }, [updateTextureMaps]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="space-y-2 p-3 bg-gradient-to-b from-gray-900/95 to-gray-950/95 rounded-lg border border-purple-500/40 shadow-lg shadow-purple-500/10">
      <div className="flex items-center gap-2 pb-2 border-b border-purple-500/30">
        <Wand2 className="w-5 h-5 text-purple-400" />
        <h2 className="text-sm font-bold text-purple-300 uppercase tracking-wider">Studio Editing</h2>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleMatcapUpload}
        className="hidden"
      />
      <input
        ref={normalMapInputRef}
        type="file"
        accept="image/*"
        onChange={handleNormalMapUpload}
        className="hidden"
      />
      <input
        ref={bumpMapInputRef}
        type="file"
        accept="image/*"
        onChange={handleBumpMapUpload}
        className="hidden"
      />

      {/* MatCap Section */}
      <Collapsible open={expandedSections.matcap} onOpenChange={() => toggleSection('matcap')}>
        <CollapsibleTrigger className="w-full flex items-center justify-between p-2 bg-amber-900/30 rounded border border-amber-500/30 hover:bg-amber-900/40 transition-colors">
          <div className="flex items-center gap-2">
            <Circle className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-medium text-amber-300">MatCap Materials</span>
          </div>
          <Switch checked={currentSettings.matcap.enabled} onCheckedChange={(v) => updateMatcap({ enabled: v })} className="scale-75" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          <div className="pl-2 space-y-2">
            <div className="flex gap-2">
              <Select 
                value={currentSettings.matcap.texture ? 'custom' : 'none'} 
                onValueChange={(v) => {
                  const preset = PRESET_MATCAPS.find(p => p.id === v);
                  if (v === 'custom') {
                    fileInputRef.current?.click();
                  } else {
                    updateMatcap({ texture: preset?.url || null });
                  }
                }}
              >
                <SelectTrigger className="h-7 text-xs bg-gray-800 border-amber-500/30 flex-1">
                  <SelectValue placeholder="Select MatCap" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-amber-500/30">
                  {PRESET_MATCAPS.map(preset => (
                    <SelectItem key={preset.id} value={preset.id}>{preset.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} className="h-7 px-2 border-amber-500/30">
                <Upload className="w-3 h-3" />
              </Button>
            </div>
            <div>
              <Label className="text-[10px] text-amber-300/70">Intensity: {currentSettings.matcap.intensity.toFixed(2)}</Label>
              <Slider
                value={[currentSettings.matcap.intensity]}
                onValueChange={([v]) => updateMatcap({ intensity: v })}
                min={0} max={2} step={0.01}
                className="h-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-[10px] text-amber-300/70">Bake to Export</Label>
              <Switch checked={currentSettings.matcap.bakeToExport} onCheckedChange={(v) => updateMatcap({ bakeToExport: v })} className="scale-75" />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Opacity Section */}
      <Collapsible open={expandedSections.opacity} onOpenChange={() => toggleSection('opacity')}>
        <CollapsibleTrigger className="w-full flex items-center justify-between p-2 bg-cyan-900/30 rounded border border-cyan-500/30 hover:bg-cyan-900/40 transition-colors">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-medium text-cyan-300">Opacity & Transparency</span>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          <div className="pl-2 space-y-2">
            <div>
              <Label className="text-[10px] text-cyan-300/70">Opacity: {(currentSettings.opacity.value * 100).toFixed(0)}%</Label>
              <Slider
                value={[currentSettings.opacity.value]}
                onValueChange={([v]) => updateOpacity({ value: v })}
                min={0} max={1} step={0.01}
                className="h-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-[10px] text-cyan-300/70">Glass Transmission</Label>
              <Switch checked={currentSettings.opacity.transmissionEnabled} onCheckedChange={(v) => updateOpacity({ transmissionEnabled: v })} className="scale-75" />
            </div>
            {currentSettings.opacity.transmissionEnabled && (
              <div>
                <Label className="text-[10px] text-cyan-300/70">Transmission: {currentSettings.opacity.transmissionIntensity.toFixed(2)}</Label>
                <Slider
                  value={[currentSettings.opacity.transmissionIntensity]}
                  onValueChange={([v]) => updateOpacity({ transmissionIntensity: v })}
                  min={0} max={1} step={0.01}
                  className="h-4"
                />
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Sharpness Section */}
      <Collapsible open={expandedSections.sharpness} onOpenChange={() => toggleSection('sharpness')}>
        <CollapsibleTrigger className="w-full flex items-center justify-between p-2 bg-green-900/30 rounded border border-green-500/30 hover:bg-green-900/40 transition-colors">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-green-400" />
            <span className="text-xs font-medium text-green-300">Sharpness & Detail</span>
          </div>
          <Switch checked={currentSettings.sharpness.enabled} onCheckedChange={(v) => updateSharpness({ enabled: v })} className="scale-75" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          <div className="pl-2 space-y-2">
            <div>
              <Label className="text-[10px] text-green-300/70">Sharpness: {currentSettings.sharpness.value.toFixed(2)}</Label>
              <Slider
                value={[currentSettings.sharpness.value]}
                onValueChange={([v]) => updateSharpness({ value: v })}
                min={0} max={1} step={0.01}
                className="h-4"
              />
            </div>
            <div>
              <Label className="text-[10px] text-green-300/70">Edge Contrast: {currentSettings.sharpness.edgeContrast.toFixed(2)}</Label>
              <Slider
                value={[currentSettings.sharpness.edgeContrast]}
                onValueChange={([v]) => updateSharpness({ edgeContrast: v })}
                min={0} max={1} step={0.01}
                className="h-4"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Texture Maps Section - Normal & Bump */}
      <Collapsible open={expandedSections.textureMaps} onOpenChange={() => toggleSection('textureMaps')}>
        <CollapsibleTrigger className="w-full flex items-center justify-between p-2 bg-blue-900/30 rounded border border-blue-500/30 hover:bg-blue-900/40 transition-colors">
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-medium text-blue-300">Normal & Bump Maps</span>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-3">
          <div className="pl-2 space-y-3">
            {/* Normal Map */}
            <div className="space-y-2 p-2 bg-blue-950/30 rounded border border-blue-500/20">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-blue-300">Normal Map</span>
                <Switch checked={currentSettings.textureMaps.normalMapEnabled} onCheckedChange={(v) => updateTextureMaps({ normalMapEnabled: v })} className="scale-75" />
              </div>
              <Button size="sm" variant="outline" onClick={() => normalMapInputRef.current?.click()} className="w-full h-7 text-xs border-blue-500/30">
                <Upload className="w-3 h-3 mr-1" />
                {currentSettings.textureMaps.normalMapTexture ? 'Change Normal Map' : 'Upload Normal Map'}
              </Button>
              {currentSettings.textureMaps.normalMapEnabled && (
                <div>
                  <Label className="text-[10px] text-blue-300/70">Intensity: {currentSettings.textureMaps.normalMapIntensity.toFixed(2)}</Label>
                  <Slider
                    value={[currentSettings.textureMaps.normalMapIntensity]}
                    onValueChange={([v]) => updateTextureMaps({ normalMapIntensity: v })}
                    min={0} max={3} step={0.05}
                    className="h-4"
                  />
                </div>
              )}
            </div>
            {/* Bump Map */}
            <div className="space-y-2 p-2 bg-blue-950/30 rounded border border-blue-500/20">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-blue-300">Bump Map</span>
                <Switch checked={currentSettings.textureMaps.bumpMapEnabled} onCheckedChange={(v) => updateTextureMaps({ bumpMapEnabled: v })} className="scale-75" />
              </div>
              <Button size="sm" variant="outline" onClick={() => bumpMapInputRef.current?.click()} className="w-full h-7 text-xs border-blue-500/30">
                <Upload className="w-3 h-3 mr-1" />
                {currentSettings.textureMaps.bumpMapTexture ? 'Change Bump Map' : 'Upload Bump Map'}
              </Button>
              {currentSettings.textureMaps.bumpMapEnabled && (
                <div>
                  <Label className="text-[10px] text-blue-300/70">Intensity: {currentSettings.textureMaps.bumpMapIntensity.toFixed(2)}</Label>
                  <Slider
                    value={[currentSettings.textureMaps.bumpMapIntensity]}
                    onValueChange={([v]) => updateTextureMaps({ bumpMapIntensity: v })}
                    min={0} max={2} step={0.05}
                    className="h-4"
                  />
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-[10px] text-blue-300/70">Bake to Export</Label>
              <Switch checked={currentSettings.textureMaps.bakeToExport} onCheckedChange={(v) => updateTextureMaps({ bakeToExport: v })} className="scale-75" />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Star Dust Particles Section */}
      <Collapsible open={expandedSections.starDust} onOpenChange={() => toggleSection('starDust')}>
        <CollapsibleTrigger className="w-full flex items-center justify-between p-2 bg-purple-900/30 rounded border border-purple-500/30 hover:bg-purple-900/40 transition-colors">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-medium text-purple-300">Star Dust Particles</span>
          </div>
          <Switch checked={currentSettings.starDust.enabled} onCheckedChange={(v) => updateStarDust({ enabled: v })} className="scale-75" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          <div className="pl-2 space-y-2">
            <div>
              <Label className="text-[10px] text-purple-300/70">Particle Count: {currentSettings.starDust.count}</Label>
              <Slider
                value={[currentSettings.starDust.count]}
                onValueChange={([v]) => updateStarDust({ count: Math.round(v) })}
                min={50} max={2000} step={50}
                className="h-4"
              />
            </div>
            <div>
              <Label className="text-[10px] text-purple-300/70">Size: {currentSettings.starDust.size.toFixed(3)}</Label>
              <Slider
                value={[currentSettings.starDust.size]}
                onValueChange={([v]) => updateStarDust({ size: v })}
                min={0.005} max={0.1} step={0.005}
                className="h-4"
              />
            </div>
            <div>
              <Label className="text-[10px] text-purple-300/70">Speed: {currentSettings.starDust.speed.toFixed(2)}</Label>
              <Slider
                value={[currentSettings.starDust.speed]}
                onValueChange={([v]) => updateStarDust({ speed: v })}
                min={0} max={2} step={0.05}
                className="h-4"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-[10px] text-purple-300/70">Color:</Label>
              <input
                type="color"
                value={currentSettings.starDust.color}
                onChange={(e) => updateStarDust({ color: e.target.value })}
                className="w-8 h-5 rounded cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-[10px] text-purple-300/70">Include in Export</Label>
              <Switch checked={currentSettings.starDust.includeInExport} onCheckedChange={(v) => updateStarDust({ includeInExport: v })} className="scale-75" />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Export Fidelity Section */}
      <Collapsible open={expandedSections.exportFidelity} onOpenChange={() => toggleSection('exportFidelity')}>
        <CollapsibleTrigger className="w-full flex items-center justify-between p-2 bg-rose-900/30 rounded border border-rose-500/30 hover:bg-rose-900/40 transition-colors">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-medium text-rose-300">Export Fidelity</span>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          <div className="pl-2 space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] text-rose-300/70">Match Studio Appearance</Label>
              <Switch checked={currentSettings.exportFidelity.matchStudioAppearance} onCheckedChange={(v) => updateExportFidelity({ matchStudioAppearance: v })} className="scale-75" />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-[10px] text-rose-300/70">Bake Post-Processing</Label>
              <Switch checked={currentSettings.exportFidelity.bakePostProcessing} onCheckedChange={(v) => updateExportFidelity({ bakePostProcessing: v })} className="scale-75" />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-[10px] text-rose-300/70">Include Lighting</Label>
              <Switch checked={currentSettings.exportFidelity.includeLighting} onCheckedChange={(v) => updateExportFidelity({ includeLighting: v })} className="scale-75" />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-[10px] text-rose-300/70">Include Particles</Label>
              <Switch checked={currentSettings.exportFidelity.includeParticles} onCheckedChange={(v) => updateExportFidelity({ includeParticles: v })} className="scale-75" />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-[10px] text-rose-300/70">Include Texture Maps</Label>
              <Switch checked={currentSettings.exportFidelity.includeTextureMaps} onCheckedChange={(v) => updateExportFidelity({ includeTextureMaps: v })} className="scale-75" />
            </div>
            <p className="text-[9px] text-rose-300/50 italic">
              Exported meshes include baked lighting, normal maps, bump maps, and opacity settings
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Quick Export Button */}
      {onExportWithSettings && (
        <Button 
          className="w-full mt-3 bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-medium"
          onClick={() => onExportWithSettings(currentSettings)}
        >
          <Download className="w-4 h-4 mr-2" />
          Export with Studio Settings
        </Button>
      )}
    </div>
  );
}

export { StudioEditingPanel, DEFAULT_STUDIO_SETTINGS };
