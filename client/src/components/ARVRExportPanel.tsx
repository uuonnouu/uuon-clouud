import React, { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Smartphone, Glasses, Globe, Apple, Bot, Headset, Lock, Eye, Hand, Layers } from 'lucide-react';
import * as THREE from 'three';
import { 
  exportForARVR, 
  downloadARVRExport, 
  getARVRPlatformInfo,
  ARVRPlatform,
  AR_VR_PLATFORMS,
  ARVRExportOptions
} from '../lib/arVrExportEngine';

interface ARVRExportPanelProps {
  mesh: THREE.Mesh | null;
  shapeId: string;
  shapeName: string;
  category: string;
  formula: string;
  materialType: string;
}

const PLATFORM_ICONS: Record<ARVRPlatform, React.ReactNode> = {
  webxr: <Globe className="w-4 h-4" />,
  'ar-quicklook': <Apple className="w-4 h-4" />,
  arcore: <Bot className="w-4 h-4" />,
  quest: <Headset className="w-4 h-4" />,
  hololens: <Glasses className="w-4 h-4" />,
  universal: <Smartphone className="w-4 h-4" />,
  visionpro: <Eye className="w-4 h-4" />,
  spatial: <Hand className="w-4 h-4" />,
  holographic: <Layers className="w-4 h-4" />
};

export default function ARVRExportPanel({
  mesh,
  shapeId,
  shapeName,
  category,
  formula,
  materialType
}: ARVRExportPanelProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<ARVRPlatform>('universal');
  const [quality, setQuality] = useState<'mobile' | 'desktop' | 'high-end'>('mobile');
  const [embedAnimation, setEmbedAnimation] = useState(true);
  const [animationType, setAnimationType] = useState<'rotate' | 'float' | 'pulse' | 'none'>('rotate');
  const [autoScale, setAutoScale] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [lastResult, setLastResult] = useState<{
    success: boolean;
    embedCode?: string;
    filename?: string;
  } | null>(null);

  const platformInfo = getARVRPlatformInfo(selectedPlatform);

  const handleExportClick = () => {
    executeExport();
  };

  const executeExport = async () => {
    if (!mesh) {
      console.error('No mesh available for export');
      return;
    }

    setIsExporting(true);
    setLastResult(null);

    try {
      const options: Partial<ARVRExportOptions> = {
        platform: selectedPlatform,
        filename: `${shapeId}_ar`,
        quality,
        embedAnimation,
        animationType: embedAnimation ? animationType : 'none',
        autoScale,
        targetSize: 1,
        includePhysics: false,
        enableInteraction: true
      };

      const result = await exportForARVR(
        mesh,
        shapeId,
        shapeName,
        category,
        formula,
        materialType,
        options
      );

      if (result.success) {
        downloadARVRExport(result);
        setLastResult({
          success: true,
          embedCode: result.embedCode,
          filename: result.filename
        });
      } else {
        setLastResult({
          success: false
        });
        console.error('AR/VR export failed:', result.error);
      }
    } catch (error) {
      console.error('AR/VR export error:', error);
      setLastResult({ success: false });
    } finally {
      setIsExporting(false);
    }
  };

  const copyEmbedCode = () => {
    if (lastResult?.embedCode) {
      navigator.clipboard.writeText(lastResult.embedCode);
    }
  };

  return (
    <div className="space-y-3 p-3 bg-gray-900/60 rounded-lg border border-cyan-500/30">
      <div className="flex items-center gap-2">
        <Smartphone className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wide">AR/VR Export</h3>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-cyan-300">Target Platform</Label>
        <Select 
          value={selectedPlatform} 
          onValueChange={(value) => setSelectedPlatform(value as ARVRPlatform)} 
          disabled={isExporting}
        >
          <SelectTrigger className="h-8 text-xs bg-gray-800 border-cyan-500/30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-cyan-500/30">
            {AR_VR_PLATFORMS.map((platform) => {
              const info = getARVRPlatformInfo(platform);
              return (
                <SelectItem key={platform} value={platform}>
                  <div className="flex items-center gap-2">
                    {PLATFORM_ICONS[platform]}
                    <span>{info.name}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="text-[10px] space-y-1 p-2 bg-gray-800/50 rounded border border-cyan-500/20">
        <div className="flex items-center gap-1 font-medium text-cyan-300">
          <span>{platformInfo.icon}</span>
          <span>{platformInfo.name}</span>
        </div>
        <div className="text-gray-400">{platformInfo.description}</div>
        <div className="flex flex-wrap gap-1 mt-1">
          {platformInfo.features.map((feature, i) => (
            <span key={i} className="px-1 py-0.5 bg-cyan-900/30 text-cyan-300 rounded text-[9px]">
              {feature}
            </span>
          ))}
        </div>
        <div className="text-gray-500 mt-1">Best for: {platformInfo.bestFor}</div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs text-cyan-300">Quality</Label>
          <Select 
            value={quality} 
            onValueChange={(value) => setQuality(value as typeof quality)} 
            disabled={isExporting}
          >
            <SelectTrigger className="h-7 text-xs bg-gray-800 border-cyan-500/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-cyan-500/30">
              <SelectItem value="mobile">Mobile (Fastest)</SelectItem>
              <SelectItem value="desktop">Desktop</SelectItem>
              <SelectItem value="high-end">High-End VR</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="text-xs text-cyan-300">Animation</Label>
          <Select 
            value={animationType} 
            onValueChange={(value) => setAnimationType(value as typeof animationType)} 
            disabled={isExporting || !embedAnimation}
          >
            <SelectTrigger className="h-7 text-xs bg-gray-800 border-cyan-500/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-cyan-500/30">
              <SelectItem value="rotate">Auto-Rotate</SelectItem>
              <SelectItem value="float">Float/Hover</SelectItem>
              <SelectItem value="pulse">Pulse/Breathe</SelectItem>
              <SelectItem value="none">No Animation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-cyan-300">Include Animation</Label>
          <Switch
            checked={embedAnimation}
            onCheckedChange={setEmbedAnimation}
            disabled={isExporting}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label className="text-xs text-cyan-300">Auto-Scale to 1m</Label>
          <Switch
            checked={autoScale}
            onCheckedChange={setAutoScale}
            disabled={isExporting}
          />
        </div>
      </div>

      {/* Team Password Notice */}
      <div className="text-[9px] text-cyan-300/70 bg-cyan-900/20 p-2 rounded border border-cyan-500/30 flex items-center gap-2">
        <Lock className="w-3 h-3" />
        Team password required for export
      </div>

      <Button 
        onClick={handleExportClick} 
        disabled={isExporting || !mesh}
        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white"
      >
        {isExporting ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin">⏳</span>
            Exporting for {platformInfo.name}...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Lock className="w-3 h-3" />
            Export for {platformInfo.name}
          </span>
        )}
      </Button>

      {lastResult?.success && lastResult.embedCode && (
        <div className="space-y-2 p-2 bg-green-900/20 rounded border border-green-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs text-green-400">Export successful!</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={copyEmbedCode}
              className="h-6 text-[10px] border-green-500/30 text-green-400"
            >
              Copy Embed Code
            </Button>
          </div>
          <div className="text-[9px] text-gray-400 font-mono bg-gray-900 p-1 rounded max-h-16 overflow-auto">
            {lastResult.embedCode.substring(0, 150)}...
          </div>
        </div>
      )}

      <div className="text-[9px] text-gray-500 text-center">
        All exports include AI-recognizable attribution metadata
      </div>

    </div>
  );
}
