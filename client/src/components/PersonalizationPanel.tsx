import React, { useState } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Palette, Zap, Eye, Save, Download } from 'lucide-react';

interface PersonalizationSettings {
  theme: 'dark' | 'light' | 'neon' | 'minimal' | 'vibrant';
  animationSpeed: number;
  particleEffects: boolean;
  bloomIntensity: number;
  autoRotation: boolean;
  backgroundColor: string;
  gridOpacity: number;
  responsiveMode: boolean;
}

interface PersonalizationPanelProps {
  onSettingsChange: (settings: PersonalizationSettings) => void;
}

export default function PersonalizationPanel({ onSettingsChange }: PersonalizationPanelProps) {
  const [settings, setSettings] = useState<PersonalizationSettings>({
    theme: 'dark',
    animationSpeed: 1.0,
    particleEffects: true,
    bloomIntensity: 0.3,
    autoRotation: false,
    backgroundColor: '#0a0a0a',
    gridOpacity: 0.3,
    responsiveMode: true
  });

  const [isOpen, setIsOpen] = useState(false);

  const updateSetting = <K extends keyof PersonalizationSettings>(
    key: K,
    value: PersonalizationSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const themePresets = {
    dark: { backgroundColor: '#0a0a0a', gridOpacity: 0.3 },
    light: { backgroundColor: '#f8f9fa', gridOpacity: 0.6 },
    neon: { backgroundColor: '#0d1117', gridOpacity: 0.8 },
    minimal: { backgroundColor: '#ffffff', gridOpacity: 0.1 },
    vibrant: { backgroundColor: '#1a0626', gridOpacity: 0.5 }
  };

  const applyTheme = (theme: PersonalizationSettings['theme']) => {
    const preset = themePresets[theme];
    updateSetting('theme', theme);
    updateSetting('backgroundColor', preset.backgroundColor);
    updateSetting('gridOpacity', preset.gridOpacity);
  };

  const exportSettings = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dimensional-math-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const savePreset = () => {
    localStorage.setItem('uuon-user-preferences', JSON.stringify(settings));
    alert('Preferences saved successfully!');
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-all duration-300"
        title="Personalization Settings"
      >
        <Palette className="w-5 h-5" />
      </button>

      {/* Personalization Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-2 sm:right-4 w-[calc(100vw-1rem)] sm:w-72 md:w-80 bg-black/95 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-purple-500 text-white z-40 max-h-[65vh] sm:max-h-[70vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-purple-300">Personalization</h3>
            <Button
              onClick={() => setIsOpen(false)}
              className="p-1 h-auto bg-transparent hover:bg-gray-700"
            >
              ×
            </Button>
          </div>

          {/* Theme Selection */}
          <div className="space-y-3 mb-4">
            <Label className="text-sm font-medium text-purple-200">Visual Theme</Label>
            <Select value={settings.theme} onValueChange={applyTheme}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="dark">🌚 Dark Space</SelectItem>
                <SelectItem value="light">☀️ Light Mode</SelectItem>
                <SelectItem value="neon">⚡ Neon Cyber</SelectItem>
                <SelectItem value="minimal">⚪ Minimal Clean</SelectItem>
                <SelectItem value="vibrant">🌈 Vibrant Colors</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Animation Controls */}
          <div className="space-y-3 mb-4">
            <Label className="text-sm font-medium text-purple-200 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Animation Speed: {settings.animationSpeed.toFixed(1)}x
            </Label>
            <Slider
              value={[settings.animationSpeed]}
              onValueChange={(value) => updateSetting('animationSpeed', value[0])}
              min={0.1}
              max={3.0}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Visual Effects */}
          <div className="space-y-3 mb-4">
            <Label className="text-sm font-medium text-purple-200">Visual Effects</Label>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Particle Effects</span>
              <Switch
                checked={settings.particleEffects}
                onCheckedChange={(checked) => updateSetting('particleEffects', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Auto Rotation</span>
              <Switch
                checked={settings.autoRotation}
                onCheckedChange={(checked) => updateSetting('autoRotation', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Responsive Mode</span>
              <Switch
                checked={settings.responsiveMode}
                onCheckedChange={(checked) => updateSetting('responsiveMode', checked)}
              />
            </div>
          </div>

          {/* Bloom Intensity */}
          <div className="space-y-3 mb-4">
            <Label className="text-sm font-medium text-purple-200 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Bloom Intensity: {(settings.bloomIntensity * 100).toFixed(0)}%
            </Label>
            <Slider
              value={[settings.bloomIntensity]}
              onValueChange={(value) => updateSetting('bloomIntensity', value[0])}
              min={0}
              max={1}
              step={0.05}
              className="w-full"
            />
          </div>

          {/* Grid Opacity */}
          <div className="space-y-3 mb-4">
            <Label className="text-sm font-medium text-purple-200">
              Grid Opacity: {(settings.gridOpacity * 100).toFixed(0)}%
            </Label>
            <Slider
              value={[settings.gridOpacity]}
              onValueChange={(value) => updateSetting('gridOpacity', value[0])}
              min={0}
              max={1}
              step={0.05}
              className="w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-6">
            <Button
              onClick={savePreset}
              className="bg-green-600 hover:bg-green-700 text-white text-xs flex items-center gap-1"
            >
              <Save className="w-3 h-3" />
              Save
            </Button>
            <Button
              onClick={exportSettings}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              Export
            </Button>
          </div>

          {/* Performance Info */}
          <div className="mt-4 p-2 bg-gray-800 rounded text-xs text-gray-400">
            <div className="font-semibold text-purple-300 mb-1">Performance Tips:</div>
            <div>• Lower animation speed for better performance</div>
            <div>• Disable particle effects on slower devices</div>
            <div>• Use minimal theme for maximum speed</div>
          </div>
        </div>
      )}
    </>
  );
}