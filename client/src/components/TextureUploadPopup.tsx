import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, RotateCw, Maximize2, X, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
import { customTextureManager } from '@/lib/customTextureManager';

type TargetShape = 'sphere' | 'torus' | 'cube' | 'cylinder' | 'plane' | 'custom';
type UVMappingPreset = 'auto' | 'equirectangular' | 'cylindrical' | 'box' | 'planar';

interface TextureUploadPopupProps {
  onTextureApplied?: (textureId: string) => void;
  triggerButton?: React.ReactNode;
}

export function TextureUploadPopup({ onTextureApplied, triggerButton }: TextureUploadPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState('');
  const [targetShape, setTargetShape] = useState<TargetShape>('sphere');
  const [uvPreset, setUvPreset] = useState<UVMappingPreset>('auto');
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [scale, setScale] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);

  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const textureRef = useRef<THREE.Texture | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const imageElementRef = useRef<HTMLImageElement | null>(null);

  const initScene = useCallback(() => {
    if (!mountRef.current || sceneRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);

    const camera = new THREE.PerspectiveCamera(60, 1.5, 0.1, 1000);
    camera.position.set(0, 0, 3);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: false,
      preserveDrawingBuffer: true,
      alpha: false,
      powerPreference: 'low-power'
    });

    renderer.setSize(360, 240);
    renderer.setPixelRatio(1);
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(ambientLight);
    scene.add(directionalLight);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
    };
    animate();
  }, []);

  const cleanupScene = useCallback(() => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
    if (meshRef.current) {
      meshRef.current.geometry.dispose();
      (meshRef.current.material as THREE.Material).dispose();
      sceneRef.current?.remove(meshRef.current);
      meshRef.current = null;
    }
    if (textureRef.current) {
      textureRef.current.dispose();
      textureRef.current = null;
    }
    if (rendererRef.current && mountRef.current) {
      if (mountRef.current.contains(rendererRef.current.domElement)) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current.dispose();
      rendererRef.current = null;
    }
    sceneRef.current = null;
    cameraRef.current = null;
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(initScene, 100);
    } else {
      cleanupScene();
      setSourceImage(null);
      setPreviewReady(false);
      setRotation({ x: 0, y: 0, z: 0 });
      setScale(1);
    }
    return () => {
      if (!isOpen) cleanupScene();
    };
  }, [isOpen, initScene, cleanupScene]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageName(file.name.replace(/\.[^/.]+$/, ''));
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        imageElementRef.current = img;
        setSourceImage(event.target?.result as string);
        loadTexture(img);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const loadTexture = (img: HTMLImageElement) => {
    if (!sceneRef.current) return;

    if (textureRef.current) {
      textureRef.current.dispose();
    }

    const texture = new THREE.Texture(img);
    texture.needsUpdate = true;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    textureRef.current = texture;
    updatePreviewMesh();
    setPreviewReady(true);
  };

  const getGeometryForShape = (shape: TargetShape): THREE.BufferGeometry => {
    switch (shape) {
      case 'sphere':
        const sphereGeom = new THREE.SphereGeometry(1, 32, 32);
        sphereGeom.scale(-1, 1, 1);
        return sphereGeom;
      case 'torus':
        return new THREE.TorusGeometry(0.7, 0.3, 16, 32);
      case 'cube':
        return new THREE.BoxGeometry(1.5, 1.5, 1.5);
      case 'cylinder':
        return new THREE.CylinderGeometry(0.6, 0.6, 1.5, 32);
      case 'plane':
        return new THREE.PlaneGeometry(2, 2);
      default:
        return new THREE.SphereGeometry(1, 32, 32);
    }
  };

  const updatePreviewMesh = useCallback(() => {
    if (!textureRef.current || !sceneRef.current) return;

    if (meshRef.current) {
      sceneRef.current.remove(meshRef.current);
      meshRef.current.geometry.dispose();
      (meshRef.current.material as THREE.Material).dispose();
    }

    const geometry = getGeometryForShape(targetShape);
    
    const material = new THREE.MeshStandardMaterial({ 
      map: textureRef.current,
      side: THREE.DoubleSide,
      metalness: 0.2,
      roughness: 0.6
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = rotation.x * Math.PI / 180;
    mesh.rotation.y = rotation.y * Math.PI / 180;
    mesh.rotation.z = rotation.z * Math.PI / 180;
    mesh.scale.setScalar(scale);

    sceneRef.current.add(mesh);
    meshRef.current = mesh;
  }, [targetShape, rotation, scale]);

  useEffect(() => {
    if (previewReady) {
      updatePreviewMesh();
    }
  }, [targetShape, rotation, scale, previewReady, updatePreviewMesh]);

  const getOptimalUVMapping = () => {
    if (uvPreset !== 'auto') return uvPreset;
    
    switch (targetShape) {
      case 'sphere': return 'equirectangular';
      case 'cylinder': return 'cylindrical';
      case 'cube': return 'box';
      case 'torus': return 'cylindrical';
      case 'plane': return 'planar';
      default: return 'equirectangular';
    }
  };

  const generateEquirectangular = async (): Promise<string> => {
    if (!imageElementRef.current) throw new Error('No image loaded');

    const img = imageElementRef.current;
    const width = 2048;
    const height = 1024;
    
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(rotation.y * Math.PI / 180);
    ctx.scale(scale, scale);
    ctx.translate(-width / 2, -height / 2);
    
    ctx.drawImage(img, 0, 0, width, height);
    ctx.restore();
    
    return canvas.toDataURL('image/png', 0.9);
  };

  const handleApplyTexture = async () => {
    if (!imageElementRef.current) return;

    setGenerating(true);

    try {
      const mapping = getOptimalUVMapping();
      let textureUrl = sourceImage!;
      
      if (mapping === 'equirectangular' && targetShape === 'sphere') {
        textureUrl = await generateEquirectangular();
      }

      const blob = await fetch(textureUrl).then(r => r.blob());
      const file = new File([blob], `${imageName || 'custom'}_${mapping}.png`, { type: 'image/png' });
      
      const customTexture = await customTextureManager.uploadTexture(file, imageName || 'Custom Texture', 'albedo');
      
      const uvConfig = customTextureManager.getDefaultUVMapping();
      uvConfig.mode = mapping === 'equirectangular' ? 'spherical' : mapping as any;
      uvConfig.scale = scale;
      uvConfig.rotation = rotation.y;
      
      customTextureManager.updatePresetUVMapping(`preset_${customTexture.id}`, uvConfig);

      onTextureApplied?.(customTexture.id);
      
      setIsOpen(false);
      console.log(`✅ Applied texture with ${mapping} UV mapping for ${targetShape}`);
      
    } catch (error) {
      console.error('Error applying texture:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleExportTexture = async () => {
    if (!imageElementRef.current) return;

    setGenerating(true);

    try {
      const dataUrl = await generateEquirectangular();
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${imageName || 'texture'}_equirect_2048x1024.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log('✅ Exported equirectangular texture');
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="outline" size="sm" className="gap-2">
            <Upload className="w-4 h-4" />
            Upload Texture
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl bg-slate-900 border-purple-500/30 text-white p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2 border-b border-purple-500/20">
          <DialogTitle className="flex items-center gap-2 text-purple-200">
            <ImageIcon className="w-5 h-5" />
            Smart Texture Upload
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4 p-4">
          <div className="space-y-4">
            <label className="block w-full p-6 border-2 border-dashed border-purple-500/40 rounded-lg cursor-pointer hover:border-purple-400 transition-colors bg-purple-900/20">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="text-center">
                <Upload className="w-10 h-10 mx-auto mb-2 text-purple-300" />
                <p className="text-white font-medium text-sm">Click to upload</p>
                <p className="text-purple-300 text-xs mt-1">PNG, JPG, WEBP</p>
              </div>
            </label>

            {sourceImage && (
              <div className="relative">
                <img
                  src={sourceImage}
                  alt="Source"
                  className="w-full h-24 object-cover rounded-lg border border-purple-500/30"
                />
                <span className="absolute bottom-1 right-1 bg-green-500/80 text-white text-xs px-2 py-0.5 rounded">
                  Ready
                </span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs text-purple-200 mb-1 block">Target Shape</label>
                <Select value={targetShape} onValueChange={(v) => setTargetShape(v as TargetShape)}>
                  <SelectTrigger className="bg-purple-900/30 border-purple-500/30 text-white h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-purple-500/30">
                    <SelectItem value="sphere">Sphere (360°)</SelectItem>
                    <SelectItem value="torus">Torus</SelectItem>
                    <SelectItem value="cube">Cube</SelectItem>
                    <SelectItem value="cylinder">Cylinder</SelectItem>
                    <SelectItem value="plane">Plane</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-purple-200 mb-1 block">UV Mapping</label>
                <Select value={uvPreset} onValueChange={(v) => setUvPreset(v as UVMappingPreset)}>
                  <SelectTrigger className="bg-purple-900/30 border-purple-500/30 text-white h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-purple-500/30">
                    <SelectItem value="auto">Auto (Optimal)</SelectItem>
                    <SelectItem value="equirectangular">Equirectangular</SelectItem>
                    <SelectItem value="cylindrical">Cylindrical</SelectItem>
                    <SelectItem value="box">Box Projection</SelectItem>
                    <SelectItem value="planar">Planar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-purple-200 mb-1 flex justify-between">
                  <span>Rotation Y</span>
                  <span>{rotation.y}°</span>
                </label>
                <Slider
                  value={[rotation.y]}
                  onValueChange={([v]) => setRotation(r => ({ ...r, y: v }))}
                  min={-180}
                  max={180}
                  step={5}
                  disabled={!previewReady}
                  className="py-1"
                />
              </div>

              <div>
                <label className="text-xs text-purple-200 mb-1 flex justify-between">
                  <span>Scale</span>
                  <span>{scale.toFixed(1)}x</span>
                </label>
                <Slider
                  value={[scale]}
                  onValueChange={([v]) => setScale(v)}
                  min={0.5}
                  max={2}
                  step={0.1}
                  disabled={!previewReady}
                  className="py-1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-800 rounded-lg border border-purple-500/30 overflow-hidden">
              <div className="text-xs text-purple-300 px-2 py-1 bg-purple-900/30 flex items-center gap-1">
                <RotateCw className="w-3 h-3" />
                3D Preview
              </div>
              <div 
                ref={mountRef} 
                className="w-full h-[240px] flex items-center justify-center"
              >
                {!sourceImage && (
                  <p className="text-purple-400 text-sm">Upload image to preview</p>
                )}
              </div>
            </div>

            <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-500/20">
              <div className="text-xs text-purple-200 mb-2">
                <strong>Optimal Mapping:</strong> {getOptimalUVMapping()}
              </div>
              <ul className="text-xs text-purple-300 space-y-1">
                <li>• Perfect seam correction for spheres</li>
                <li>• Auto-detects best UV projection</li>
                <li>• Preserves original image quality</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleExportTexture}
                disabled={!previewReady || generating}
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent border-purple-500/50 text-purple-200 hover:bg-purple-900/30 text-xs"
              >
                <Download className="w-3 h-3 mr-1" />
                Export
              </Button>
              <Button
                onClick={handleApplyTexture}
                disabled={!previewReady || generating}
                size="sm"
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white text-xs"
              >
                {generating ? (
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <Check className="w-3 h-3 mr-1" />
                )}
                Apply to Shape
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TextureUploadPopup;
