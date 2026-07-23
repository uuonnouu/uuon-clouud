import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface AccessibilityControlsProps {
  onAccessibilityChange: (settings: AccessibilitySettings) => void;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  colorScheme: 'default' | 'dark' | 'light' | 'yellow-black' | 'blue-white' | 'green-black';
  reducedMotion: boolean;
  largeFonts: boolean;
  focusIndicators: boolean;
}

const COLOR_SCHEMES = {
  default: {
    name: 'Default',
    background: 'bg-background',
    foreground: 'text-foreground',
    primary: 'text-cyan-300',
    secondary: 'text-gray-400',
    accent: 'bg-accent',
    border: 'border-gray-600'
  },
  dark: {
    name: 'Dark High Contrast',
    background: 'bg-black',
    foreground: 'text-white',
    primary: 'text-white',
    secondary: 'text-gray-200',
    accent: 'bg-gray-800',
    border: 'border-white'
  },
  light: {
    name: 'Light High Contrast',
    background: 'bg-white',
    foreground: 'text-black',
    primary: 'text-black',
    secondary: 'text-gray-800',
    accent: 'bg-gray-200',
    border: 'border-black'
  },
  'yellow-black': {
    name: 'Yellow on Black',
    background: 'bg-black',
    foreground: 'text-yellow-300',
    primary: 'text-yellow-200',
    secondary: 'text-yellow-400',
    accent: 'bg-yellow-900',
    border: 'border-yellow-300'
  },
  'blue-white': {
    name: 'Blue on White',
    background: 'bg-white',
    foreground: 'text-blue-900',
    primary: 'text-blue-800',
    secondary: 'text-blue-600',
    accent: 'bg-blue-100',
    border: 'border-blue-900'
  },
  'green-black': {
    name: 'Green on Black',
    background: 'bg-black',
    foreground: 'text-green-300',
    primary: 'text-green-200',
    secondary: 'text-green-400',
    accent: 'bg-green-900',
    border: 'border-green-300'
  }
};

export default function AccessibilityControls({ onAccessibilityChange }: AccessibilityControlsProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    colorScheme: 'default',
    reducedMotion: false,
    largeFonts: false,
    focusIndicators: true
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const oldSettings = localStorage.getItem('accessibility-settings');
    if (oldSettings) {
      localStorage.setItem('uuon-accessibility-settings', oldSettings);
      localStorage.removeItem('accessibility-settings');
    }
    
    const savedSettings = localStorage.getItem('uuon-accessibility-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        onAccessibilityChange(parsed);
        applyAccessibilitySettings(parsed);
      } catch (error) {
        console.error('Failed to load accessibility settings:', error);
      }
    }
  }, [onAccessibilityChange]);

  // Save settings and apply changes
  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('uuon-accessibility-settings', JSON.stringify(updatedSettings));
    onAccessibilityChange(updatedSettings);
    applyAccessibilitySettings(updatedSettings);
  };

  // Apply accessibility settings to the document
  const applyAccessibilitySettings = (accessibilitySettings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // Reset previous classes
    root.classList.remove(
      'accessibility-high-contrast',
      'accessibility-reduced-motion',
      'accessibility-large-fonts',
      'accessibility-enhanced-focus'
    );

    // Remove previous color scheme classes
    Object.keys(COLOR_SCHEMES).forEach(scheme => {
      root.classList.remove(`accessibility-${scheme}`);
    });

    // Apply new settings
    if (accessibilitySettings.highContrast) {
      root.classList.add('accessibility-high-contrast');
    }

    if (accessibilitySettings.reducedMotion) {
      root.classList.add('accessibility-reduced-motion');
    }

    if (accessibilitySettings.largeFonts) {
      root.classList.add('accessibility-large-fonts');
    }

    if (accessibilitySettings.focusIndicators) {
      root.classList.add('accessibility-enhanced-focus');
    }

    // Apply color scheme
    root.classList.add(`accessibility-${accessibilitySettings.colorScheme}`);
  };

  const resetToDefaults = () => {
    const defaultSettings: AccessibilitySettings = {
      highContrast: false,
      colorScheme: 'default',
      reducedMotion: false,
      largeFonts: false,
      focusIndicators: true
    };
    updateSettings(defaultSettings);
  };

  return (
    <Card className="w-80 accessibility-controls">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span role="img" aria-label="accessibility">♿</span>
          Accessibility Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* High Contrast Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="high-contrast" className="text-sm font-medium">
            High Contrast Mode
          </Label>
          <Switch
            id="high-contrast"
            checked={settings.highContrast}
            onCheckedChange={(checked) => updateSettings({ highContrast: checked })}
            aria-describedby="high-contrast-desc"
          />
        </div>
        <p id="high-contrast-desc" className="text-xs text-gray-500">
          Increases contrast for better visibility
        </p>

        {/* Color Scheme Selection */}
        <div className="space-y-2">
          <Label htmlFor="color-scheme" className="text-sm font-medium">
            Color Scheme
          </Label>
          <Select
            value={settings.colorScheme}
            onValueChange={(value: AccessibilitySettings['colorScheme']) => 
              updateSettings({ colorScheme: value })
            }
          >
            <SelectTrigger id="color-scheme">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => (
                <SelectItem key={key} value={key}>
                  {scheme.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reduced Motion */}
        <div className="flex items-center justify-between">
          <Label htmlFor="reduced-motion" className="text-sm font-medium">
            Reduce Motion
          </Label>
          <Switch
            id="reduced-motion"
            checked={settings.reducedMotion}
            onCheckedChange={(checked) => updateSettings({ reducedMotion: checked })}
            aria-describedby="reduced-motion-desc"
          />
        </div>
        <p id="reduced-motion-desc" className="text-xs text-gray-500">
          Minimizes animations and transitions
        </p>

        {/* Large Fonts */}
        <div className="flex items-center justify-between">
          <Label htmlFor="large-fonts" className="text-sm font-medium">
            Large Text
          </Label>
          <Switch
            id="large-fonts"
            checked={settings.largeFonts}
            onCheckedChange={(checked) => updateSettings({ largeFonts: checked })}
            aria-describedby="large-fonts-desc"
          />
        </div>
        <p id="large-fonts-desc" className="text-xs text-gray-500">
          Increases text size for better readability
        </p>

        {/* Enhanced Focus Indicators */}
        <div className="flex items-center justify-between">
          <Label htmlFor="focus-indicators" className="text-sm font-medium">
            Enhanced Focus
          </Label>
          <Switch
            id="focus-indicators"
            checked={settings.focusIndicators}
            onCheckedChange={(checked) => updateSettings({ focusIndicators: checked })}
            aria-describedby="focus-indicators-desc"
          />
        </div>
        <p id="focus-indicators-desc" className="text-xs text-gray-500">
          Shows clear focus indicators for keyboard navigation
        </p>

        {/* Reset Button */}
        <div className="pt-4 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetToDefaults}
            className="w-full"
          >
            Reset to Defaults
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}