import React, { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Download, Palette, Settings, Sun, Lock, Shield, Unlock } from 'lucide-react';
import { SurfaceParameters } from '../types/math';
import { useLightingStore } from '../stores/lightingStore';
import { SecurityLevel, SECURITY_PRESETS, getSecurityLevelDescription } from '../lib/exportSecurityCore';
import { sdkClient } from '../lib/unifiedSDKClient';
import { formatShapeName } from '../lib/shapeCategories';

interface VersatileExportPanelProps {
  parameters: SurfaceParameters;
  onExport: (format: string, quality: string, options?: { 
    bakeLighting?: boolean; 
    lightingSettings?: any;
    securityLevel?: SecurityLevel;
    password?: string;
  }) => void;
}

export type ExportFormatType = 'gltf' | 'glb' | 'tubular' | 'laser' | 'fbx' | 'obj' | 'stl' | 'ply' | 'points' | 'nerf';

export default function VersatileExportPanel({ parameters, onExport }: VersatileExportPanelProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormatType>('glb');
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('high');
  const [includeColors, setIncludeColors] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [bakeLighting, setBakeLighting] = useState(true);
  const [securityLevel, setSecurityLevel] = useState<SecurityLevel>('open');
  const [password, setPassword] = useState('');
  const lightingSettings = useLightingStore();

  const formatInfo: Record<ExportFormatType, { name: string; color: string; web: string; ar: string }> = {
    gltf: { name: 'glTF 2.0 (JSON)', color: '✅ Full PBR', web: '✅ Web Standard', ar: '✅ WebXR' },
    glb: { name: 'glTF Binary', color: '✅ Full PBR', web: '✅ Web Optimized', ar: '✅ WebXR' },
    nerf: { name: 'Nerfstudio Compatible NeRF', color: '✅ Continuous', web: '✅ AI/ML Ready', ar: '🧠 Neural (nerfacto/instant-ngp)' },
    tubular: { name: 'Tubular/Pipe Mesh', color: '✅ Neon Glow', web: '✅ Web Ready', ar: '✅ 3D Tubes' },
    laser: { name: 'Laser Line Mesh', color: '✅ Laser Glow', web: '✅ Web Ready', ar: '✅ Laser Lines' },
    fbx: { name: 'Autodesk FBX', color: '✅ Materials', web: '❌ Desktop', ar: '⚠️ Import Only' },
    obj: { name: 'Wavefront OBJ+MTL', color: '✅ MTL Colors', web: '✅ Basic', ar: '⚠️ Basic' },
    stl: { name: 'Stereolithography', color: '❌ Geometry Only', web: '❌ 3D Print', ar: '❌ No Color' },
    ply: { name: 'Polygon File Format', color: '✅ Vertex Colors', web: '⚠️ Limited', ar: '⚠️ Basic' },
    points: { name: 'Point Cloud Spheres', color: '✅ Vertex Colors', web: '✅ Web Ready', ar: '✅ Point Cloud' }
  };

  const handleExportClick = () => {
    executeExport();
  };

  const executeExport = async () => {
    setIsExporting(true);
    try {
      const exportOptions: any = {
        securityLevel,
        password: securityLevel === 'encrypted' ? password : undefined
      };
      
      if (bakeLighting && (selectedFormat === 'glb' || selectedFormat === 'gltf')) {
        exportOptions.bakeLighting = true;
        exportOptions.lightingSettings = {
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
        };
      }
      
      await onExport(selectedFormat, quality, exportOptions);
    } finally {
      setIsExporting(false);
    }
  };

  const currentFormat = formatInfo[selectedFormat];

  return (
    <div className="space-y-3 p-3 bg-gray-900/60 rounded-lg border border-purple-500/30">
      <div className="flex items-center gap-2">
        <Download className="w-4 h-4 text-purple-400" />
        <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wide">Universal Export</h3>
      </div>

      {/* Format Selection */}
      <div className="space-y-2">
        <Label className="text-xs text-purple-300">Export Format</Label>
        <Select value={selectedFormat} onValueChange={(value) => setSelectedFormat(value as typeof selectedFormat)} disabled={isExporting}>
          <SelectTrigger className="h-8 text-xs bg-gray-800 border-purple-500/30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-purple-500/30">
            <SelectItem value="glb">glTF Binary (.glb) - Web Standard</SelectItem>
            <SelectItem value="gltf">glTF JSON (.gltf) - Web Development</SelectItem>
            <SelectItem value="nerf">Nerfstudio NeRF - nerfacto/instant-ngp Compatible</SelectItem>
            <SelectItem value="tubular">Tubular Mesh (.glb) - 3D Tubes/Pipes</SelectItem>
            <SelectItem value="laser">Laser Lines (.glb) - Neon Laser Effect</SelectItem>
            <SelectItem value="points">Point Cloud (.glb) - Sphere Points</SelectItem>
            <SelectItem value="fbx">FBX (.fbx) - Game Development</SelectItem>
            <SelectItem value="obj">OBJ+MTL (.obj) - Universal</SelectItem>
            <SelectItem value="ply">PLY (.ply) - Research/Vertex Colors</SelectItem>
            <SelectItem value="stl">STL (.stl) - 3D Printing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Format Information */}
      <div className="text-[10px] space-y-1 p-2 bg-gray-800/50 rounded border border-purple-500/20">
        <div className="font-medium text-purple-300">{currentFormat.name}</div>
        <div className="grid grid-cols-1 gap-1 text-gray-300">
          <div>Color Support: {currentFormat.color}</div>
          <div>Web Compatibility: {currentFormat.web}</div>
          <div>AR/VR Support: {currentFormat.ar}</div>
        </div>
      </div>

      {/* Quality Settings */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs text-purple-300">Quality</Label>
          <Select value={quality} onValueChange={(value) => setQuality(value as typeof quality)} disabled={isExporting}>
            <SelectTrigger className="h-7 text-xs bg-gray-800 border-purple-500/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-purple-500/30">
              <SelectItem value="low">Low (Fast)</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-end">
          <div className="flex items-center gap-1">
            <Switch
              checked={includeColors}
              onCheckedChange={setIncludeColors}
              disabled={isExporting || selectedFormat === 'stl'}
              className="scale-75"
            />
            <Label className="text-[10px] text-purple-300">Colors</Label>
          </div>
        </div>
      </div>

      {/* Bake Lighting Toggle - Only for GLB/GLTF */}
      {(selectedFormat === 'glb' || selectedFormat === 'gltf') && (
        <div className="flex items-center justify-between text-[10px] py-1.5 px-2 bg-amber-900/20 rounded border border-amber-500/30">
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
      )}

      {/* Nerfstudio Export Info */}
      {selectedFormat === 'nerf' && (
        <div className="text-[9px] space-y-1.5 p-2 bg-blue-900/20 rounded border border-blue-500/30">
          <div className="font-medium text-blue-300">Nerfstudio Export Package:</div>
          <ul className="text-gray-300 space-y-0.5 ml-2">
            <li>transforms.json - Camera poses (100 orbiting views)</li>
            <li>instant_ngp_config.json - Hash grid encoding config</li>
            <li>formulas.json - Mathematical documentation</li>
            <li>points.ply - Point cloud with colors</li>
            <li>metadata.json - Shape parameters & security</li>
          </ul>
          <div className="text-blue-400 mt-1">
            Compatible with: nerfacto, instant-ngp, mipnerf360
          </div>
        </div>
      )}

      {/* Security Level Selection */}
      <div className="space-y-2">
        <Label className="text-xs text-purple-300 flex items-center gap-1">
          <Shield className="w-3 h-3" />
          Export Security
        </Label>
        <Select value={securityLevel} onValueChange={(value) => setSecurityLevel(value as SecurityLevel)} disabled={isExporting}>
          <SelectTrigger className="h-8 text-xs bg-gray-800 border-purple-500/30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-purple-500/30">
            <SelectItem value="open">
              <div className="flex items-center gap-2">
                <Unlock className="w-3 h-3 text-green-400" />
                <span>Open - No encryption</span>
              </div>
            </SelectItem>
            <SelectItem value="protected">
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3 text-blue-400" />
                <span>Protected - Watermarked</span>
              </div>
            </SelectItem>
            <SelectItem value="encrypted">
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-red-400" />
                <span>Encrypted - Password required</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <div className="text-[9px] text-purple-300/70 px-1">
          {getSecurityLevelDescription(securityLevel)}
        </div>
      </div>

      {/* Password Input for Encrypted Mode */}
      {securityLevel === 'encrypted' && (
        <div className="space-y-1.5">
          <Label className="text-xs text-red-300 flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Encryption Password
          </Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password to encrypt..."
            className="h-8 text-xs bg-gray-800 border-red-500/30 text-white"
            disabled={isExporting}
          />
          {password.length > 0 && password.length < 8 && (
            <div className="text-[9px] text-red-400">Password should be at least 8 characters</div>
          )}
        </div>
      )}

      {/* Color Information */}
      {selectedFormat !== 'stl' && (
        <div className="text-[9px] text-purple-300/80 flex items-center gap-1">
          <Palette className="w-3 h-3" />
          <span>
            {selectedFormat === 'glb' || selectedFormat === 'gltf'
              ? bakeLighting ? 'PBR materials with baked lighting' : 'Full PBR materials with metalness/roughness' 
              : selectedFormat === 'tubular'
              ? 'Neon tube geometry with emissive glow'
              : selectedFormat === 'laser'
              ? 'Laser line geometry with bright emission'
              : selectedFormat === 'points'
              ? 'Point cloud as small glowing spheres'
              : selectedFormat === 'obj'
              ? 'MTL material file with diffuse/specular colors'
              : selectedFormat === 'ply'
              ? 'RGB vertex colors embedded in geometry'
              : 'Basic material colors'}
          </span>
        </div>
      )}

      {/* Attribution Notice */}
      <div className="text-[9px] text-purple-300/70 bg-purple-900/20 p-2 rounded border border-purple-500/30 flex items-center gap-2">
        <Shield className="w-3 h-3" />
        All exports meta-tagged: UUON Foundation · Phillip Aguiar Ruiz III
      </div>

      {/* Export Button */}
      <Button
        onClick={handleExportClick}
        disabled={isExporting}
        className="h-8 w-full bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white text-xs font-semibold rounded border border-purple-500/40"
      >
        {isExporting ? (
          <>
            <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent mr-1" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="w-3 h-3 mr-1" />
            Export {selectedFormat.toUpperCase()}
          </>
        )}
      </Button>

      {/* NFT Minting Button */}
      <NFTMintButton parameters={parameters} />

      <div className="text-[8px] text-purple-300/60 text-center">
        {parameters.type} • {quality} quality • {includeColors && selectedFormat !== 'stl' ? 'With colors' : 'Geometry only'}{bakeLighting && (selectedFormat === 'glb' || selectedFormat === 'gltf') ? ' • 🔆 Lit' : ''} • {securityLevel === 'encrypted' ? '🔐' : securityLevel === 'protected' ? '🛡️' : '🔓'} {securityLevel}
      </div>

    </div>
  );
}

// NFT Minting Component
function NFTMintButton({ parameters }: { parameters: SurfaceParameters }) {
  const [isMinting, setIsMinting] = useState(false);
  const [mintResult, setMintResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);

  const handleMintNFT = async () => {
    setIsMinting(true);
    try {
      const result = await sdkClient.mintNFT({
        shapeId: parameters.type || 'unknown',
        shapeName: parameters.type ? formatShapeName(parameters.type) : 'Mathematical Shape',
        category: 'mathematical',
        formula: 'Parametric Surface',
        parameters: {
          a: parameters.a || 1,
          b: parameters.b || 1,
          c: parameters.c || 1,
          d: parameters.d || 0,
          e: parameters.e || 0,
          f: parameters.f || 0
        },
        royaltyPercent: 5
      });

      if (result.success) {
        setMintResult(result.data);
        setShowResult(true);
        console.log('NFT minted successfully:', result.data);
      } else {
        console.error('NFT minting failed');
      }
    } catch (error) {
      console.error('NFT minting error:', error);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleMintNFT}
        disabled={isMinting}
        className="h-8 w-full bg-gradient-to-br from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-semibold rounded border border-orange-500/40"
      >
        {isMinting ? (
          <>
            <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent mr-1" />
            Creating NFT...
          </>
        ) : (
          <>
            🎨 Mint as NFT
          </>
        )}
      </Button>

      {showResult && mintResult?.success && (
        <div className="p-2 bg-green-900/30 rounded border border-green-500/30 text-[9px] space-y-1">
          <div className="text-green-400 font-medium">NFT Ready!</div>
          <div className="text-gray-300">Token: {mintResult.nft?.tokenId}</div>
          <div className="text-gray-300">Value: ${mintResult.nft?.valuation?.estimatedValue}</div>
          <div className="text-gray-300">Rarity: {mintResult.nft?.valuation?.rarity}</div>
          <Button
            size="sm"
            variant="outline"
            className="w-full h-6 text-[9px] mt-1"
            onClick={() => setShowResult(false)}
          >
            Close
          </Button>
        </div>
      )}
    </div>
  );
}
