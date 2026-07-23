import React, { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Download, Upload, Image, FileText, Package, Sparkles, Lock } from 'lucide-react';
import { Slider } from './ui/slider';
import * as THREE from 'three';
import { 
  SketchfabExporter, 
  SketchfabExportOptions, 
  SketchfabTransparencyMode,
  getSketchfabTransparencyModes,
  SketchfabExportResult
} from '../lib/sketchfabExporter';
import { UVMappingMode } from '../lib/fractalUVMapping';

interface SketchfabExportPanelProps {
  mesh: THREE.Mesh | null;
  shapeId: string;
  shapeParameters: Record<string, number>;
  onExportComplete?: (result: SketchfabExportResult) => void;
}

export default function SketchfabExportPanel({ 
  mesh, 
  shapeId, 
  shapeParameters,
  onExportComplete 
}: SketchfabExportPanelProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState('');
  const [textureResolution, setTextureResolution] = useState<1024 | 2048 | 4096 | 8192>(2048);
  const [uvMappingMode, setUvMappingMode] = useState<UVMappingMode>('spherical');
  const [uvScale, setUvScale] = useState(1);
  const [transparencyMode, setTransparencyMode] = useState<SketchfabTransparencyMode>('opaque');
  const [alphaThreshold, setAlphaThreshold] = useState(0.5);
  const [ior, setIor] = useState(1.45);
  const [bakeLighting, setBakeLighting] = useState(false);
  const [exportSeparateTextures, setExportSeparateTextures] = useState(true);
  const [includeAttribution, setIncludeAttribution] = useState(true);
  const [quality, setQuality] = useState<'standard' | 'high' | 'ultra'>('high');

  const transparencyModes = getSketchfabTransparencyModes();

  const handleExportClick = () => {
    executeExport();
  };

  const executeExport = async () => {
    if (!mesh) {
      console.error('No mesh available for export');
      return;
    }

    setIsExporting(true);
    setExportProgress('Preparing geometry...');

    try {
      const exporter = new SketchfabExporter(
        mesh.geometry,
        mesh.material as THREE.Material,
        shapeId,
        shapeParameters
      );

      setExportProgress('Generating textures...');
      
      const options: Partial<SketchfabExportOptions> = {
        filename: `dimension_${shapeId.replace(/[^a-zA-Z0-9]/g, '_')}`,
        textureResolution,
        uvMappingMode,
        uvScale,
        materialSettings: {
          transparencyMode,
          alphaThreshold,
          invertAlpha: false,
          tintColor: new THREE.Color(0xffffff),
          indexOfRefraction: ior,
          refractionRoughness: 0.1,
          useNormalOffset: false
        },
        bakeLighting,
        exportSeparateTextures,
        includeAnimation: false,
        quality,
        attribution: includeAttribution
      };

      setExportProgress('Exporting GLB...');
      const result = await exporter.exportForSketchfab(options);

      if (result.success) {
        setExportProgress('Downloading files...');
        exporter.downloadAll(result, options.filename!);
        
        if (onExportComplete) {
          onExportComplete(result);
        }
        
        setExportProgress('Export complete!');
        setTimeout(() => setExportProgress(''), 3000);
      } else {
        setExportProgress(`Export failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Sketchfab export error:', error);
      setExportProgress(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
    }
  };

  const selectedTransparency = transparencyModes.find(m => m.value === transparencyMode);

  return (
    <div className="space-y-3 p-3 bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-lg border border-blue-500/30">
      <div className="flex items-center gap-2">
        <Upload className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wide">Sketchfab Export</h3>
        <span className="text-[9px] bg-blue-600/30 px-1.5 py-0.5 rounded text-blue-300">HD Ready</span>
      </div>

      <div className="text-[10px] text-blue-200/70 -mt-1">
        Export optimized for Sketchfab with HD textures, transparency, and 2D editing support
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-[10px] text-blue-300">Texture Resolution</Label>
          <Select 
            value={textureResolution.toString()} 
            onValueChange={(v) => setTextureResolution(parseInt(v) as typeof textureResolution)}
            disabled={isExporting}
          >
            <SelectTrigger className="h-7 text-[10px] bg-gray-800/80 border-blue-500/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-blue-500/30">
              <SelectItem value="1024">1K (1024px)</SelectItem>
              <SelectItem value="2048">2K (2048px)</SelectItem>
              <SelectItem value="4096">4K (4096px)</SelectItem>
              <SelectItem value="8192">8K (8192px)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-[10px] text-blue-300">UV Mapping</Label>
          <Select 
            value={uvMappingMode} 
            onValueChange={(v) => setUvMappingMode(v as UVMappingMode)}
            disabled={isExporting}
          >
            <SelectTrigger className="h-7 text-[10px] bg-gray-800/80 border-blue-500/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-blue-500/30">
              <SelectItem value="spherical">Spherical</SelectItem>
              <SelectItem value="cylindrical">Cylindrical</SelectItem>
              <SelectItem value="planar">Planar</SelectItem>
              <SelectItem value="box">Box Projection</SelectItem>
              <SelectItem value="triplanar">Triplanar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="text-[10px] text-blue-300">UV Scale: {uvScale.toFixed(1)}</Label>
        <Slider
          value={[uvScale]}
          onValueChange={([v]) => setUvScale(v)}
          min={0.1}
          max={5}
          step={0.1}
          disabled={isExporting}
          className="mt-1"
        />
      </div>

      <div className="p-2 bg-gray-800/50 rounded border border-blue-500/20">
        <Label className="text-[10px] text-blue-300 mb-1 block">Transparency Mode</Label>
        <Select 
          value={transparencyMode} 
          onValueChange={(v) => setTransparencyMode(v as SketchfabTransparencyMode)}
          disabled={isExporting}
        >
          <SelectTrigger className="h-7 text-[10px] bg-gray-900/80 border-blue-500/30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-blue-500/30">
            {transparencyModes.map(mode => (
              <SelectItem key={mode.value} value={mode.value}>
                {mode.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="text-[9px] text-gray-400 mt-1">
          {selectedTransparency?.description}
        </div>
      </div>

      {transparencyMode === 'alpha_mask' && (
        <div>
          <Label className="text-[10px] text-blue-300">Alpha Threshold: {alphaThreshold.toFixed(2)}</Label>
          <Slider
            value={[alphaThreshold]}
            onValueChange={([v]) => setAlphaThreshold(v)}
            min={0}
            max={1}
            step={0.01}
            disabled={isExporting}
            className="mt-1"
          />
        </div>
      )}

      {transparencyMode === 'refraction' && (
        <div>
          <Label className="text-[10px] text-blue-300">Index of Refraction (IOR): {ior.toFixed(2)}</Label>
          <Slider
            value={[ior]}
            onValueChange={([v]) => setIor(v)}
            min={1.0}
            max={2.5}
            step={0.01}
            disabled={isExporting}
            className="mt-1"
          />
          <div className="text-[9px] text-gray-400 mt-1">
            Air: 1.0, Water: 1.33, Glass: 1.45-1.52, Diamond: 2.42
          </div>
        </div>
      )}

      <div>
        <Label className="text-[10px] text-blue-300">Export Quality</Label>
        <Select 
          value={quality} 
          onValueChange={(v) => setQuality(v as typeof quality)}
          disabled={isExporting}
        >
          <SelectTrigger className="h-7 text-[10px] bg-gray-800/80 border-blue-500/30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-blue-500/30">
            <SelectItem value="standard">Standard (4 fractal iterations)</SelectItem>
            <SelectItem value="high">High (8 fractal iterations)</SelectItem>
            <SelectItem value="ultra">Ultra (12 fractal iterations)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 p-2 bg-gray-800/30 rounded">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Image className="w-3 h-3 text-blue-400" />
            <Label className="text-[10px] text-blue-300">Export Separate Textures (PNG)</Label>
          </div>
          <Switch
            checked={exportSeparateTextures}
            onCheckedChange={setExportSeparateTextures}
            disabled={isExporting}
            className="scale-75"
          />
        </div>
        <div className="text-[9px] text-gray-400">
          Download individual texture files for 2D editing before Sketchfab upload
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] py-1.5 px-2 bg-amber-900/20 rounded border border-amber-500/30">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <Label className="text-[9px] text-amber-300">Bake Lighting</Label>
        </div>
        <Switch
          checked={bakeLighting}
          onCheckedChange={setBakeLighting}
          disabled={isExporting}
          className="scale-75"
        />
      </div>

      <div className="flex items-center justify-between text-[10px] py-1.5 px-2 bg-green-900/20 rounded border border-green-500/30">
        <div className="flex items-center gap-1.5">
          <FileText className="w-3 h-3 text-green-400" />
          <Label className="text-[9px] text-green-300">Include Attribution</Label>
        </div>
        <Switch
          checked={includeAttribution}
          onCheckedChange={setIncludeAttribution}
          disabled={isExporting}
          className="scale-75"
        />
      </div>

      {/* Team Password Notice */}
      <div className="text-[9px] text-blue-300/70 bg-blue-900/20 p-2 rounded border border-blue-500/30 flex items-center gap-2">
        <Lock className="w-3 h-3" />
        Team password required for export
      </div>

      <Button
        onClick={handleExportClick}
        disabled={isExporting || !mesh}
        className="h-9 w-full bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-semibold rounded border border-blue-500/40"
      >
        {isExporting ? (
          <>
            <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent mr-2" />
            {exportProgress || 'Exporting...'}
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 mr-2" />
            Export for Sketchfab
          </>
        )}
      </Button>

      {!mesh && (
        <div className="text-[9px] text-red-400 text-center">
          No shape available. Select a shape first.
        </div>
      )}

      <div className="text-[8px] text-blue-300/60 text-center space-y-0.5">
        <div>{textureResolution}px • {uvMappingMode} UV • {transparencyMode}</div>
        <div className="flex items-center justify-center gap-1">
          <span>Includes: GLB</span>
          {exportSeparateTextures && <span>+ 5 PNG textures</span>}
          {includeAttribution && <span>+ Attribution</span>}
        </div>
      </div>

    </div>
  );
}
