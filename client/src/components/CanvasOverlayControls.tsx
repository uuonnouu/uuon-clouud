import React, { useState, useEffect, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { SurfaceParameters, VisualizationMode } from "../types/math";
import { getDefaultParameters } from "../lib/parametricSurfacesClean";
import { SHAPE_CATEGORIES as ORGANIZED_CATEGORIES } from '../lib/shapeCategories';
import { customTextureManager, CustomMaterialPreset } from '../lib/customTextureManager';
import { Download, Share2, Eye, EyeOff, Palette, Sliders, Search, Wand2 } from 'lucide-react';
import { TextureUploadPopup } from './TextureUploadPopup';

const MAX_SHAPES_PER_CATEGORY = 15;

interface CanvasOverlayControlsProps {
  parameters: SurfaceParameters;
  visualMode: VisualizationMode;
  colorMode: string;
  backgroundMode: string;
  onParameterChange: (params: Partial<SurfaceParameters>) => void;
  onVisualizationModeChange: (mode: VisualizationMode) => void;
  onColorModeChange: (mode: string) => void;
  onBackgroundModeChange: (mode: string) => void;
  isLockedPreview?: boolean;
}

// Helper function to format shape names for display
function getShapeDisplayName(shape: string): string {
  return shape
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function CanvasOverlayControls({
  parameters,
  visualMode,
  colorMode,
  backgroundMode,
  onParameterChange,
  onVisualizationModeChange,
  onColorModeChange,
  onBackgroundModeChange,
  isLockedPreview = false
}: CanvasOverlayControlsProps) {
  const [customPresets, setCustomPresets] = useState<CustomMaterialPreset[]>([]);
  const [shapeSearch, setShapeSearch] = useState('');

  useEffect(() => {
    const presets = customTextureManager.getAllCustomPresets();
    setCustomPresets(presets);

    const checkInterval = setInterval(() => {
      const updatedPresets = customTextureManager.getAllCustomPresets();
      if (updatedPresets.length !== customPresets.length) {
        setCustomPresets(updatedPresets);
      }
    }, 2000);

    return () => clearInterval(checkInterval);
  }, []);

  const filteredCategories = useMemo(() => {
    const searchLower = shapeSearch.toLowerCase().trim();
    
    if (!searchLower) {
      return ORGANIZED_CATEGORIES.map(cat => ({
        ...cat,
        shapes: cat.shapes.slice(0, MAX_SHAPES_PER_CATEGORY),
        hasMore: cat.shapes.length > MAX_SHAPES_PER_CATEGORY
      }));
    }
    
    return ORGANIZED_CATEGORIES.map(cat => {
      const matchingShapes = cat.shapes.filter(s => 
        s.toLowerCase().includes(searchLower) ||
        getShapeDisplayName(s).toLowerCase().includes(searchLower)
      );
      return {
        ...cat,
        shapes: matchingShapes.slice(0, 30),
        hasMore: matchingShapes.length > 30
      };
    }).filter(cat => cat.shapes.length > 0);
  }, [shapeSearch]);

  return (
    <div className="absolute top-4 left-4 z-20 pointer-events-auto">
      <div className="grid grid-cols-5 gap-3 p-3 bg-black/80 backdrop-blur-md rounded-lg border-2 border-cyan-500/40 shadow-2xl">
        {/* Shape Selector */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-cyan-300 uppercase tracking-wide flex items-center gap-1">
            {isLockedPreview ? '🔒' : '🔷'} Shape
          </Label>
          <Select
            value={parameters.type}
            onValueChange={(value: any) => {
              if (isLockedPreview) {
                console.log('🔒 Shape selection blocked - locked preview mode');
                return;
              }
              const defaults = getDefaultParameters(value);
              onParameterChange({
                ...defaults,
                type: value as any,
                uSegments: defaults.uSegments ?? 360,
                vSegments: defaults.vSegments ?? 360,
              });
            }}
            disabled={isLockedPreview}
          >
            <SelectTrigger className={`h-10 text-xs bg-gray-900 border-2 text-white font-bold transition-all ${
              isLockedPreview 
                ? 'border-amber-500/50 cursor-not-allowed opacity-75' 
                : 'border-cyan-500/50 hover:bg-gray-800'
            }`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-2 border-cyan-500/30 max-h-96 overflow-y-auto">
              <div className="sticky top-0 z-10 bg-gray-900 p-2 border-b border-gray-700">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <Input
                    placeholder="Search shapes..."
                    value={shapeSearch}
                    onChange={(e) => setShapeSearch(e.target.value)}
                    className="h-7 pl-7 text-xs bg-gray-800 border-gray-600 text-white placeholder:text-gray-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              {filteredCategories.map((cat) => (
                <React.Fragment key={cat.id}>
                  <div className="px-2 py-1 text-cyan-400 font-bold text-xs uppercase sticky top-0 bg-gray-900 border-b border-gray-700 z-[5]">
                    {cat.icon} {cat.name} {cat.hasMore && <span className="text-gray-500 font-normal">(+more)</span>}
                  </div>
                  {cat.shapes.map((s) => (
                    <SelectItem key={s} value={s} className="text-white hover:bg-cyan-900/50">
                      {getShapeDisplayName(s)}
                    </SelectItem>
                  ))}
                </React.Fragment>
              ))}
              {filteredCategories.length === 0 && (
                <div className="px-3 py-4 text-gray-400 text-center text-sm">
                  No shapes found for "{shapeSearch}"
                </div>
              )}
            </SelectContent>
          </Select>
          {isLockedPreview && (
            <p className="text-xs text-amber-400/80 mt-1">Preview mode - locked to this shape</p>
          )}
        </div>

        {/* VIZ Mode Selector */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-teal-300 uppercase tracking-wide flex items-center gap-1">
            👁️ VIZ Mode
          </Label>
          <Select value={visualMode} onValueChange={onVisualizationModeChange}>
            <SelectTrigger className="h-10 text-xs bg-gray-900 border-2 border-teal-500/50 text-white font-bold hover:bg-gray-800 transition-all">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-2 border-teal-500/30">
              <SelectItem value="surface" className="text-white hover:bg-teal-900/50">🔲 Surface</SelectItem>
              <SelectItem value="wireframe" className="text-white hover:bg-teal-900/50">🔳 Wireframe</SelectItem>
              <SelectItem value="points" className="text-white hover:bg-teal-900/50">⚫ Points</SelectItem>
              <SelectItem value="neural" className="text-white hover:bg-cyan-900/50">🧠 Neural</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Material Selector */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-purple-300 uppercase tracking-wide flex items-center gap-1">
            💎 Material
          </Label>
          <Select value={colorMode} onValueChange={onColorModeChange}>
            <SelectTrigger className="h-10 text-xs bg-gray-900 border-2 border-purple-500/50 text-white font-bold hover:bg-gray-800 transition-all">
              <SelectValue className="text-white" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-2 border-purple-500/30 max-h-96 overflow-y-auto text-white">
              {/* NONE - Clear any active material */}
              <SelectItem value="none" className="text-white hover:bg-gray-700/50 cursor-pointer font-semibold">⬜ — None —</SelectItem>
              {/* NEON GLOW - PREMIUM CATEGORY (First for easy access) */}
              <div className="px-2 py-1 text-white font-bold text-xs uppercase sticky top-0 bg-gray-900 border-b border-pink-500 bg-gradient-to-r from-pink-900/50 to-purple-900/50">
                ✨ Neon Glow (Premium)
              </div>
              <SelectItem value="neon_pink" className="text-white hover:bg-pink-900/50 cursor-pointer">💗 Neon Pink</SelectItem>
              <SelectItem value="neon_blue" className="text-white hover:bg-blue-900/50 cursor-pointer">💙 Neon Blue</SelectItem>
              <SelectItem value="neon_green" className="text-white hover:bg-green-900/50 cursor-pointer">💚 Neon Green</SelectItem>
              <SelectItem value="neon_orange" className="text-white hover:bg-orange-900/50 cursor-pointer">🧡 Neon Orange</SelectItem>
              <SelectItem value="neon_purple" className="text-white hover:bg-purple-900/50 cursor-pointer">💜 Neon Purple</SelectItem>
              <SelectItem value="neon_cyan" className="text-white hover:bg-cyan-900/50 cursor-pointer">🩵 Neon Cyan</SelectItem>
              <SelectItem value="neon_red" className="text-white hover:bg-red-900/50 cursor-pointer">❤️ Neon Red</SelectItem>
              <SelectItem value="neon_yellow" className="text-white hover:bg-yellow-900/50 cursor-pointer">💛 Neon Yellow</SelectItem>
              <SelectItem value="neon_rainbow" className="text-white hover:bg-purple-900/50 cursor-pointer">🌈 Neon Rainbow</SelectItem>
              <SelectItem value="neon_grid" className="text-white hover:bg-cyan-900/50 cursor-pointer">🔲 Neon Grid (Tron)</SelectItem>
              <SelectItem value="neon_pulse" className="text-white hover:bg-purple-900/50 cursor-pointer">💫 Neon Pulse</SelectItem>
              <SelectItem value="neon_plasma_fusion" className="text-white hover:bg-pink-900/50 cursor-pointer">⚡ Plasma Fusion</SelectItem>
              {/* NEW Creative Glow Patterns */}
              <SelectItem value="neon_hexagon_grid" className="text-white hover:bg-pink-900/50 cursor-pointer">⬡ Hexagon Grid</SelectItem>
              <SelectItem value="neon_circuit" className="text-white hover:bg-green-900/50 cursor-pointer">🔌 Circuit Board</SelectItem>
              <SelectItem value="neon_scanlines" className="text-white hover:bg-orange-900/50 cursor-pointer">📺 Scanlines</SelectItem>
              <SelectItem value="neon_spiral" className="text-white hover:bg-purple-900/50 cursor-pointer">🌀 Spiral Vortex</SelectItem>
              <SelectItem value="neon_laser_grid" className="text-white hover:bg-red-900/50 cursor-pointer">🎯 Laser Grid</SelectItem>
              <SelectItem value="neon_constellation" className="text-white hover:bg-blue-900/50 cursor-pointer">✨ Constellation</SelectItem>

              {/* TOPOLOGICAL PATTERNS */}
              <div className="px-2 py-1 text-white font-bold text-xs uppercase bg-gray-900 border-b border-gray-700 mt-2">
                🔷 Topological Patterns
              </div>
              <SelectItem value="voronoi" className="text-white hover:bg-purple-900/50 cursor-pointer">🔷 Voronoi Cell Pattern</SelectItem>
              <SelectItem value="perlin_noise" className="text-white hover:bg-purple-900/50 cursor-pointer">🌫️ Perlin Noise Gradient</SelectItem>
              <SelectItem value="fractal" className="text-white hover:bg-purple-900/50 cursor-pointer">❄️ Fractal Self-Similar</SelectItem>
              <SelectItem value="hexagonal" className="text-white hover:bg-purple-900/50 cursor-pointer">⬡ Hexagonal Tessellation</SelectItem>
              <SelectItem value="truchet" className="text-white hover:bg-purple-900/50 cursor-pointer">🎨 Truchet Tile Mosaic</SelectItem>
              <SelectItem value="cellular" className="text-white hover:bg-purple-900/50 cursor-pointer">🧬 Cellular Automata</SelectItem>
              <SelectItem value="mandelbrot" className="text-white hover:bg-purple-900/50 cursor-pointer">🌀 Mandelbrot Fractal</SelectItem>
              <SelectItem value="fibonacci" className="text-white hover:bg-purple-900/50 cursor-pointer">🌻 Fibonacci Spiral</SelectItem>
              <SelectItem value="penrose" className="text-white hover:bg-purple-900/50 cursor-pointer">⭐ Penrose Quasicrystal</SelectItem>
              <SelectItem value="delaunay" className="text-white hover:bg-purple-900/50 cursor-pointer">🔺 Delaunay Triangulation</SelectItem>

              {/* CRYSTALLINE - GEMS & PRECIOUS STONES */}
              <div className="px-2 py-1 text-white font-bold text-xs uppercase bg-gray-900 border-b border-gray-700 mt-2">
                💎 Crystalline (Gems)
              </div>
              <SelectItem value="diamond" className="text-white hover:bg-purple-900/50 cursor-pointer">💎 Diamond</SelectItem>
              <SelectItem value="opal" className="text-white hover:bg-purple-900/50 cursor-pointer">🌈 Opal (Play-of-Color)</SelectItem>
              <SelectItem value="alexandrite" className="text-white hover:bg-purple-900/50 cursor-pointer">💜 Alexandrite (Color-Change)</SelectItem>
              <SelectItem value="emerald" className="text-white hover:bg-purple-900/50 cursor-pointer">💚 Emerald</SelectItem>
              <SelectItem value="ruby" className="text-white hover:bg-purple-900/50 cursor-pointer">❤️ Ruby</SelectItem>
              <SelectItem value="sapphire" className="text-white hover:bg-purple-900/50 cursor-pointer">💙 Sapphire</SelectItem>
              <SelectItem value="amethyst" className="text-white hover:bg-purple-900/50 cursor-pointer">🔮 Amethyst</SelectItem>

              {/* METALLIC MATERIALS */}
              <div className="px-2 py-1 text-white font-bold text-xs uppercase bg-gray-900 border-b border-gray-700 mt-2">
                🥇 Metallic
              </div>
              <SelectItem value="gold" className="text-white hover:bg-purple-900/50 cursor-pointer">🥇 Gold (24K)</SelectItem>
              <SelectItem value="silver" className="text-white hover:bg-purple-900/50 cursor-pointer">🥈 Silver (Sterling)</SelectItem>
              <SelectItem value="copper" className="text-white hover:bg-purple-900/50 cursor-pointer">🟤 Copper</SelectItem>
              <SelectItem value="bronze" className="text-white hover:bg-purple-900/50 cursor-pointer">🥉 Bronze</SelectItem>
              <SelectItem value="titanium" className="text-white hover:bg-purple-900/50 cursor-pointer">⚙️ Titanium (Iridescent)</SelectItem>

              {/* ENERGY MATERIALS */}
              <div className="px-2 py-1 text-white font-bold text-xs uppercase bg-gray-900 border-b border-gray-700 mt-2">
                ⚡ Energy
              </div>
              <SelectItem value="plasma" className="text-white hover:bg-purple-900/50 cursor-pointer">⚡ Plasma</SelectItem>
              <SelectItem value="lightning" className="text-white hover:bg-purple-900/50 cursor-pointer">🌩️ Lightning</SelectItem>
              <SelectItem value="neon" className="text-white hover:bg-purple-900/50 cursor-pointer">🎆 Neon Glow</SelectItem>
              <SelectItem value="aurora" className="text-white hover:bg-purple-900/50 cursor-pointer">🌌 Aurora Borealis</SelectItem>

              {/* ORGANIC MATERIALS */}
              <div className="px-2 py-1 text-white font-bold text-xs uppercase bg-gray-900 border-b border-gray-700 mt-2">
                🪵 Organic
              </div>
              <SelectItem value="wood" className="text-white hover:bg-purple-900/50 cursor-pointer">🪵 Wood Grain</SelectItem>
              <SelectItem value="marble" className="text-white hover:bg-purple-900/50 cursor-pointer">🗿 Marble</SelectItem>
              <SelectItem value="granite" className="text-white hover:bg-purple-900/50 cursor-pointer">🪨 Granite</SelectItem>
              <SelectItem value="leather" className="text-white hover:bg-purple-900/50 cursor-pointer">👜 Leather</SelectItem>

              {customPresets.length > 0 && (
                <>
                  <div className="px-2 py-1 text-white font-bold text-xs uppercase bg-gray-900 border-b border-gray-700 mt-2">
                    📸 Uploaded Textures
                  </div>
                  {customPresets.map((preset) => (
                    <SelectItem key={preset.id} value={`custom_${preset.id}`} className="text-white hover:bg-purple-900/50 cursor-pointer">
                      🖼️ {preset.name}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Upload Texture - Quick Access + Smart UV */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-pink-300 uppercase tracking-wide flex items-center gap-1">
            🖼️ Texture
          </Label>
          <div className="h-10 flex items-center gap-1">
            <label className="h-full flex items-center justify-center gap-1 px-2 bg-gray-900 border-2 border-pink-500/50 text-white text-xs font-bold rounded-md hover:bg-gray-800 transition-all cursor-pointer">
              <span className="text-pink-300">+</span>
              <input 
                type="file" 
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    import('../lib/customTextureManager').then(({ customTextureManager }) => {
                      const name = file.name.replace(/\.[^/.]+$/, '');
                      customTextureManager.uploadTexture(file, name, 'albedo').then(() => {
                        const updatedPresets = customTextureManager.getAllCustomPresets();
                        setCustomPresets(updatedPresets);
                      });
                    });
                  }
                  e.target.value = '';
                }}
              />
            </label>
            <TextureUploadPopup
              onTextureApplied={(textureId) => {
                const updatedPresets = customTextureManager.getAllCustomPresets();
                setCustomPresets(updatedPresets);
                onColorModeChange(`preset_${textureId}`);
                console.log(`✅ Smart UV: Applied texture preset_${textureId} to canvas shape`);
              }}
              triggerButton={
                <button className="h-full flex items-center gap-1 px-2 bg-gradient-to-r from-purple-600 to-pink-600 border-2 border-purple-400/50 text-white text-xs font-bold rounded-md hover:from-purple-500 hover:to-pink-500 transition-all">
                  <Wand2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Smart UV</span>
                </button>
              }
            />
            {customPresets.length > 0 && (
              <span className="text-[10px] text-pink-300 bg-pink-500/20 px-1.5 py-0.5 rounded-full">
                {customPresets.length}
              </span>
            )}
          </div>
        </div>

        {/* Background Selector */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-orange-300 uppercase tracking-wide flex items-center gap-1">
            🎨 Background
          </Label>
          <Select value={backgroundMode} onValueChange={onBackgroundModeChange}>
            <SelectTrigger className="h-10 text-xs bg-gray-900 border-2 border-orange-500/50 text-white font-bold hover:bg-gray-800 transition-all">
              <SelectValue className="text-white" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-2 border-orange-500/30 text-white">
              <SelectItem value="black" className="text-white hover:bg-orange-900/50 cursor-pointer">⚫ Black</SelectItem>
              <SelectItem value="gray" className="text-white hover:bg-orange-900/50 cursor-pointer">◼️ Dark Gray</SelectItem>
              <SelectItem value="white" className="text-white hover:bg-orange-900/50 cursor-pointer">⚪ White</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

    </div>
  );
}