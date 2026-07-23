import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Film, Download, Sun } from 'lucide-react';
import { SurfaceParameters } from '../types/math';
import { AnimationMode } from '../hooks/useOrganicAnimation';
import { useLightingStore } from '../stores/lightingStore';

interface AnimationExportPanelProps {
  parameters: SurfaceParameters;
  animationMode?: AnimationMode;
}

export default function AnimationExportPanel({ parameters, animationMode = 'basic' }: AnimationExportPanelProps) {
  const [duration, setDuration] = useState(10);
  const [fps, setFps] = useState<24 | 30 | 60>(30);
  const [format, setFormat] = useState<'gltf' | 'glb'>('glb');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [bakeLighting, setBakeLighting] = useState(true);
  
  const lightingSettings = useLightingStore();

  // Listen for export completion events
  useEffect(() => {
    const handleExportComplete = () => {
      setIsExporting(false);
      setExportProgress(0);
    };

    const handleExportError = () => {
      setIsExporting(false);
      setExportProgress(0);
    };

    const handleExportProgress = (event: CustomEvent) => {
      setExportProgress(event.detail.progress);
    };

    window.addEventListener('animatedMathExportComplete', handleExportComplete);
    window.addEventListener('animatedMathExportError', handleExportError);
    window.addEventListener('animatedMathExportProgress', handleExportProgress as EventListener);

    return () => {
      window.removeEventListener('animatedMathExportComplete', handleExportComplete);
      window.removeEventListener('animatedMathExportError', handleExportError);
      window.removeEventListener('animatedMathExportProgress', handleExportProgress as EventListener);
    };
  }, []);

  const handleExport = () => {
    setIsExporting(true);
    setExportProgress(0);
    
    console.log('🎬 Dispatching animated export event');
    console.log('🔆 Bake lighting:', bakeLighting);
    
    // Dispatch custom event for ParametricSurface to handle
    const exportEvent = new CustomEvent('exportAnimatedMath', {
      detail: {
        shapeName: parameters.type,
        duration,
        fps,
        format,
        bakeLighting,
        lightingSettings: bakeLighting ? {
          ambientIntensity: lightingSettings.ambientIntensity,
          ambientColor: lightingSettings.ambientColor,
          keyLightIntensity: lightingSettings.keyLightIntensity,
          keyLightColor: lightingSettings.keyLightColor,
          keyLightX: lightingSettings.keyLightX,
          keyLightY: lightingSettings.keyLightY,
          keyLightZ: lightingSettings.keyLightZ,
          fillLightIntensity: lightingSettings.fillLightIntensity,
          fillLightColor: lightingSettings.fillLightColor,
          rimLightIntensity: lightingSettings.rimLightIntensity,
          rimLightColor: lightingSettings.rimLightColor,
          shadowsEnabled: lightingSettings.shadowsEnabled,
          shadowIntensity: lightingSettings.shadowIntensity,
          shadowSoftness: lightingSettings.shadowSoftness,
          shadowMapSize: lightingSettings.shadowMapSize,
          environmentPreset: lightingSettings.environmentPreset,
          activePreset: lightingSettings.activePreset
        } : undefined
      }
    });
    window.dispatchEvent(exportEvent);
  };

  const estimatedFrames = Math.floor(duration * fps);

  return (
    <div className="space-y-2 p-2 bg-gray-900/50 rounded-lg border border-teal-500/30">
      <div className="flex items-center gap-1.5">
        <Film className="w-4 h-4 text-teal-400" />
        <h3 className="text-xs font-semibold text-teal-400 uppercase tracking-wide">Animated Export</h3>
      </div>

      {/* Compact Controls */}
      <div className="grid grid-cols-2 gap-2 text-[10px]">
        <div>
          <Label className="text-[9px] text-teal-300">Duration: {duration}s</Label>
          <Slider
            value={[duration]}
            onValueChange={(values) => setDuration(values[0])}
            min={1}
            max={10}
            step={1}
            className="w-full h-1 mt-1"
            disabled={isExporting}
          />
        </div>
        <div>
          <Label className="text-[9px] text-teal-300">FPS</Label>
          <Select value={fps.toString()} onValueChange={(value) => setFps(parseInt(value) as 24 | 30 | 60)} disabled={isExporting}>
            <SelectTrigger className="h-6 text-[10px] bg-gray-800 border-teal-500/30 mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-teal-500/30">
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="60">60</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Format Selection */}
      <div className="flex items-center gap-2 text-[10px]">
        <Label className="text-[9px] text-teal-300">Format:</Label>
        <Select value={format} onValueChange={(value) => setFormat(value as 'gltf' | 'glb')} disabled={isExporting}>
          <SelectTrigger className="h-6 text-[10px] bg-gray-800 border-teal-500/30 flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-teal-500/30">
            <SelectItem value="glb">GLB (Binary)</SelectItem>
            <SelectItem value="gltf">GLTF (JSON)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bake Lighting Toggle */}
      <div className="flex items-center justify-between text-[10px] py-1 px-2 bg-amber-900/20 rounded border border-amber-500/30">
        <div className="flex items-center gap-1.5">
          <Sun className="w-3 h-3 text-amber-400" />
          <Label className="text-[9px] text-amber-300">Bake Lighting</Label>
        </div>
        <Switch
          checked={bakeLighting}
          onCheckedChange={setBakeLighting}
          disabled={isExporting}
          className="scale-75"
        />
      </div>

      {/* Progress Bar */}
      {isExporting && exportProgress > 0 && (
        <div className="w-full bg-gray-800 rounded-full h-1.5">
          <div 
            className="bg-teal-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${exportProgress * 100}%` }}
          />
        </div>
      )}

      {/* Export Button */}
      <Button
        onClick={handleExport}
        disabled={isExporting}
        className="h-7 w-full bg-gradient-to-br from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white text-[10px] font-semibold rounded border border-teal-500/40"
      >
        {isExporting ? (
          <>
            <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent mr-1" />
            Recording {Math.floor(exportProgress * 100)}%...
          </>
        ) : (
          <>
            <Download className="w-3 h-3 mr-1" />
            Export Animated {format.toUpperCase()}
          </>
        )}
      </Button>

      <p className="text-[8px] text-teal-300/60 text-center">
        {duration}s • {estimatedFrames} frames @ {fps} FPS {bakeLighting ? '• 🔆 Lit' : ''}
      </p>
    </div>
  );
}
