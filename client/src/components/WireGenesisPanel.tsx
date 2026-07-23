
import React, { useState, useRef, useCallback } from 'react';
import { Upload, Image as ImageIcon, Settings, Download, Zap, Layers, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { wireGenesisEngine, WireGenesisEngine, WireGenesisConfig, WireGenesisOutput } from '../lib/wireGenesisEngine';
import { useParameterAuthority } from '../lib/parameterAuthority';

interface WireGenesisPanelProps {
  onMeshGenerated?: (output: WireGenesisOutput) => void;
  onParameterChange?: (params: Record<string, number>) => void;
}

export default function WireGenesisPanel({ onMeshGenerated, onParameterChange }: WireGenesisPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [config, setConfig] = useState<WireGenesisConfig>(WireGenesisEngine.getDefaultConfig());
  const [generatedOutput, setGeneratedOutput] = useState<WireGenesisOutput | null>(null);
  const [showDepthMap, setShowDepthMap] = useState(false);
  
  const batchUpdateAuthority = useParameterAuthority(state => state.batchUpdate);
  const setAuthorityShape = useParameterAuthority(state => state.setShape);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      console.warn('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setImagePreview(imageUrl);
      
      const img = new Image();
      img.onload = () => {
        setUploadedImage(img);
        console.log('✅ Image loaded for WireGenesis processing:', img.width + 'x' + img.height);
      };
      img.src = imageUrl;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const syntheticEvent = {
          target: { files: [file] }
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleImageUpload(syntheticEvent);
      }
    }
  }, [handleImageUpload]);

  const processImage = useCallback(async () => {
    if (!uploadedImage) return;

    setIsProcessing(true);
    console.log('🔄 Processing image with WireGenesis...');

    try {
      const output = await wireGenesisEngine.processImage(uploadedImage, config);
      setGeneratedOutput(output);
      
      // Store mesh globally for ParametricSurface access
      (window as any).wireGenesisMesh = {
        geometry: output.geometry.clone(),
        material: output.material,
        uvMapping: output.uvMapping
      };
      
      // Update Parameter Authority with mapped parameters
      batchUpdateAuthority(output.parameters, 'wiregenesis');
      setAuthorityShape('wiregenesis_mesh');
      
      // Notify parent components
      onMeshGenerated?.(output);
      onParameterChange?.(output.parameters as Record<string, number>);
      
      console.log('✅ WireGenesis processing complete:', {
        vertices: output.geometry.attributes.position.count,
        triangles: output.geometry.index ? output.geometry.index.count / 3 : 0,
        parameters: Object.keys(output.parameters).length
      });
      
    } catch (error) {
      console.error('❌ WireGenesis processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [uploadedImage, config, batchUpdateAuthority, setAuthorityShape, onMeshGenerated, onParameterChange]);

  const updateConfig = useCallback(<T extends keyof WireGenesisConfig>(key: T, value: WireGenesisConfig[T]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          WireGenesis - Image to 3D
        </h3>
        <Badge variant="secondary" className="bg-purple-900/30 text-purple-300">
          Φ26 Engine
        </Badge>
      </div>

      {/* Image Upload */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Source Image
          </CardTitle>
          <CardDescription className="text-xs">
            Upload an image to convert to 3D mesh using depth estimation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {!imagePreview ? (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-900/10 transition-colors"
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-400 mb-1">Drop image here or click to browse</p>
              <p className="text-xs text-gray-500">Supports JPG, PNG, WebP</p>
            </div>
          ) : (
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Source" 
                className="w-full max-h-32 object-contain rounded border border-gray-600"
              />
              {uploadedImage && (
                <Badge variant="outline" className="absolute top-1 right-1 text-xs">
                  {uploadedImage.width}×{uploadedImage.height}
                </Badge>
              )}
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Processing Controls */}
      {uploadedImage && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Processing Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Depth Estimation */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Depth Estimation</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-gray-400">Luminance Weight</Label>
                  <Slider
                    value={[config.luminanceWeight]}
                    onValueChange={([value]) => updateConfig('luminanceWeight', value)}
                    min={0}
                    max={1}
                    step={0.1}
                    className="mt-1"
                  />
                  <span className="text-xs text-gray-500">{(config.luminanceWeight * 100).toFixed(0)}%</span>
                </div>
                <div>
                  <Label className="text-xs text-gray-400">Edge Detection</Label>
                  <Slider
                    value={[config.edgeDetectionWeight]}
                    onValueChange={([value]) => updateConfig('edgeDetectionWeight', value)}
                    min={0}
                    max={1}
                    step={0.1}
                    className="mt-1"
                  />
                  <span className="text-xs text-gray-500">{(config.edgeDetectionWeight * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Mesh Quality */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Mesh Quality</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-gray-400">Max Vertices</Label>
                  <Slider
                    value={[config.maxVertices]}
                    onValueChange={([value]) => updateConfig('maxVertices', value)}
                    min={1000}
                    max={50000}
                    step={1000}
                    className="mt-1"
                  />
                  <span className="text-xs text-gray-500">{(config.maxVertices / 1000).toFixed(0)}K</span>
                </div>
                <div>
                  <Label className="text-xs text-gray-400">Smoothing</Label>
                  <Slider
                    value={[config.smoothingIterations]}
                    onValueChange={([value]) => updateConfig('smoothingIterations', value)}
                    min={0}
                    max={10}
                    step={1}
                    className="mt-1"
                  />
                  <span className="text-xs text-gray-500">{config.smoothingIterations}x</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Material Properties */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Material Properties</Label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs text-gray-400">Displacement</Label>
                  <Slider
                    value={[config.displacement]}
                    onValueChange={([value]) => updateConfig('displacement', value)}
                    min={0.1}
                    max={5.0}
                    step={0.1}
                    className="mt-1"
                  />
                  <span className="text-xs text-gray-500">{config.displacement.toFixed(1)}</span>
                </div>
                <div>
                  <Label className="text-xs text-gray-400">Metalness</Label>
                  <Slider
                    value={[config.metalness]}
                    onValueChange={([value]) => updateConfig('metalness', value)}
                    min={0}
                    max={1}
                    step={0.1}
                    className="mt-1"
                  />
                  <span className="text-xs text-gray-500">{(config.metalness * 100).toFixed(0)}%</span>
                </div>
                <div>
                  <Label className="text-xs text-gray-400">Roughness</Label>
                  <Slider
                    value={[config.roughness]}
                    onValueChange={([value]) => updateConfig('roughness', value)}
                    min={0}
                    max={1}
                    step={0.1}
                    className="mt-1"
                  />
                  <span className="text-xs text-gray-500">{(config.roughness * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Mesh Type & Advanced Options */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Mesh Shape</Label>
              <div className="flex gap-2">
                {(['relief', 'curved', 'dome'] as const).map((type) => (
                  <Button
                    key={type}
                    size="sm"
                    variant={config.meshType === type ? 'default' : 'outline'}
                    onClick={() => updateConfig('meshType', type)}
                    className={`flex-1 text-xs ${config.meshType === type ? 'bg-purple-600' : ''}`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <Label className="text-xs text-gray-400">Depth Contrast</Label>
                  <Slider
                    value={[config.depthContrast]}
                    onValueChange={([value]) => updateConfig('depthContrast', value)}
                    min={0.5}
                    max={3.0}
                    step={0.1}
                    className="mt-1"
                  />
                  <span className="text-xs text-gray-500">{config.depthContrast.toFixed(1)}x</span>
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="invertDepth"
                    checked={config.invertDepth}
                    onChange={(e) => updateConfig('invertDepth', e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <Label htmlFor="invertDepth" className="text-xs text-gray-400 cursor-pointer">
                    Invert Depth
                  </Label>
                </div>
              </div>
            </div>

            {/* Process Button */}
            <Button
              onClick={processImage}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isProcessing ? (
                <>
                  <Layers className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate 3D Mesh
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Processing Results */}
      {generatedOutput && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-green-400" />
              Generated Mesh
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-gray-800/50 p-2 rounded text-center">
                <div className="text-green-400 font-mono">
                  {generatedOutput.geometry.attributes.position.count.toLocaleString()}
                </div>
                <div className="text-gray-400">Vertices</div>
              </div>
              <div className="bg-gray-800/50 p-2 rounded text-center">
                <div className="text-blue-400 font-mono">
                  {generatedOutput.geometry.index ? (generatedOutput.geometry.index.count / 3).toLocaleString() : '0'}
                </div>
                <div className="text-gray-400">Triangles</div>
              </div>
              <div className="bg-gray-800/50 p-2 rounded text-center">
                <div className="text-purple-400 font-mono">
                  {Object.keys(generatedOutput.parameters).length}
                </div>
                <div className="text-gray-400">Parameters</div>
              </div>
            </div>
            
            <p className="text-xs text-gray-400">
              ✅ Mesh generated and synced to Parameter Authority. 
              Use existing export controls to save as GLB with GIP metadata.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
