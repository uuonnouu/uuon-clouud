import { useEffect, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StudioQualityLightingProps {
  mode?: 'studio' | 'dramatic' | 'soft' | 'product';
  intensity?: number;
  shadowQuality?: 'low' | 'medium' | 'high' | 'ultra';
  enableContactShadows?: boolean;
}

export default function StudioQualityLighting({
  mode = 'studio',
  intensity = 1.0,
  shadowQuality = 'high',
  enableContactShadows = true
}: StudioQualityLightingProps) {
  const { scene, gl } = useThree();
  
  const shadowMapSize = useMemo(() => {
    switch (shadowQuality) {
      case 'ultra': return 4096;
      case 'high': return 2048;
      case 'medium': return 1024;
      default: return 512;
    }
  }, [shadowQuality]);

  useEffect(() => {
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.2;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    
    const existingLights = scene.children.filter(c => (c as any).isLight);
    existingLights.forEach(light => scene.remove(light));
    
    const lightConfig = getLightingConfig(mode, intensity);
    const lights: THREE.Light[] = [];
    
    const keyLight = new THREE.DirectionalLight(
      new THREE.Color(lightConfig.keyColor),
      lightConfig.keyIntensity
    );
    keyLight.position.copy(lightConfig.keyPosition);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = shadowMapSize;
    keyLight.shadow.mapSize.height = shadowMapSize;
    keyLight.shadow.camera.near = 0.1;
    keyLight.shadow.camera.far = 100;
    keyLight.shadow.camera.left = -20;
    keyLight.shadow.camera.right = 20;
    keyLight.shadow.camera.top = 20;
    keyLight.shadow.camera.bottom = -20;
    keyLight.shadow.bias = -0.0001;
    keyLight.shadow.normalBias = 0.02;
    keyLight.shadow.radius = 2;
    scene.add(keyLight);
    lights.push(keyLight);
    
    const fillLight = new THREE.DirectionalLight(
      new THREE.Color(lightConfig.fillColor),
      lightConfig.fillIntensity
    );
    fillLight.position.copy(lightConfig.fillPosition);
    fillLight.castShadow = false;
    scene.add(fillLight);
    lights.push(fillLight);
    
    const rimLight = new THREE.DirectionalLight(
      new THREE.Color(lightConfig.rimColor),
      lightConfig.rimIntensity
    );
    rimLight.position.copy(lightConfig.rimPosition);
    rimLight.castShadow = false;
    scene.add(rimLight);
    lights.push(rimLight);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, lightConfig.ambientIntensity);
    scene.add(ambientLight);
    lights.push(ambientLight);
    
    const hemiLight = new THREE.HemisphereLight(
      lightConfig.skyColor,
      lightConfig.groundColor,
      lightConfig.hemiIntensity
    );
    scene.add(hemiLight);
    lights.push(hemiLight);
    
    if (mode === 'product' || mode === 'studio') {
      const topLight = new THREE.DirectionalLight(0xffffff, 0.3 * intensity);
      topLight.position.set(0, 20, 0);
      topLight.castShadow = false;
      scene.add(topLight);
      lights.push(topLight);
    }
    
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();
    
    const envScene = new THREE.Scene();
    const gradientCanvas = createStudioGradient(mode);
    const gradientTexture = new THREE.CanvasTexture(gradientCanvas);
    gradientTexture.mapping = THREE.EquirectangularReflectionMapping;
    
    const envMap = pmremGenerator.fromEquirectangular(gradientTexture).texture;
    scene.environment = envMap;
    scene.environmentIntensity = lightConfig.envIntensity;
    
    pmremGenerator.dispose();
    gradientTexture.dispose();
    
    return () => {
      lights.forEach(light => scene.remove(light));
      if (scene.environment) {
        scene.environment.dispose();
        scene.environment = null;
      }
    };
  }, [scene, gl, mode, intensity, shadowMapSize]);

  return null;
}

function getLightingConfig(mode: string, intensity: number) {
  const configs: Record<string, any> = {
    studio: {
      keyIntensity: 2.0 * intensity,
      keyColor: 0xffffff,
      keyPosition: new THREE.Vector3(8, 12, 10),
      
      fillIntensity: 0.6 * intensity,
      fillColor: 0xe8f0ff,
      fillPosition: new THREE.Vector3(-10, 6, 5),
      
      rimIntensity: 1.2 * intensity,
      rimColor: 0xffffff,
      rimPosition: new THREE.Vector3(0, 8, -12),
      
      ambientIntensity: 0.15,
      hemiIntensity: 0.3,
      skyColor: 0xffffff,
      groundColor: 0x444466,
      envIntensity: 0.4
    },
    
    dramatic: {
      keyIntensity: 3.0 * intensity,
      keyColor: 0xfff0e0,
      keyPosition: new THREE.Vector3(6, 15, 8),
      
      fillIntensity: 0.2 * intensity,
      fillColor: 0x4060a0,
      fillPosition: new THREE.Vector3(-12, 4, 3),
      
      rimIntensity: 1.8 * intensity,
      rimColor: 0xff8844,
      rimPosition: new THREE.Vector3(-2, 6, -15),
      
      ambientIntensity: 0.05,
      hemiIntensity: 0.15,
      skyColor: 0x404080,
      groundColor: 0x101020,
      envIntensity: 0.2
    },
    
    soft: {
      keyIntensity: 1.2 * intensity,
      keyColor: 0xffffff,
      keyPosition: new THREE.Vector3(5, 10, 8),
      
      fillIntensity: 0.8 * intensity,
      fillColor: 0xf0f4ff,
      fillPosition: new THREE.Vector3(-8, 8, 6),
      
      rimIntensity: 0.5 * intensity,
      rimColor: 0xffffff,
      rimPosition: new THREE.Vector3(0, 5, -10),
      
      ambientIntensity: 0.4,
      hemiIntensity: 0.5,
      skyColor: 0xffffff,
      groundColor: 0x888899,
      envIntensity: 0.6
    },
    
    product: {
      keyIntensity: 2.5 * intensity,
      keyColor: 0xffffff,
      keyPosition: new THREE.Vector3(10, 15, 12),
      
      fillIntensity: 1.0 * intensity,
      fillColor: 0xffffff,
      fillPosition: new THREE.Vector3(-12, 10, 8),
      
      rimIntensity: 1.5 * intensity,
      rimColor: 0xffffff,
      rimPosition: new THREE.Vector3(0, 10, -15),
      
      ambientIntensity: 0.3,
      hemiIntensity: 0.4,
      skyColor: 0xffffff,
      groundColor: 0x666666,
      envIntensity: 0.5
    }
  };
  
  return configs[mode] || configs.studio;
}

function createStudioGradient(mode: string): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;
  
  const gradientConfigs: Record<string, { top: string; middle: string; bottom: string }> = {
    studio: { top: '#202030', middle: '#303040', bottom: '#101018' },
    dramatic: { top: '#0a0a15', middle: '#151525', bottom: '#050508' },
    soft: { top: '#404050', middle: '#505060', bottom: '#303038' },
    product: { top: '#252530', middle: '#353545', bottom: '#151520' }
  };
  
  const colors = gradientConfigs[mode] || gradientConfigs.studio;
  
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, colors.top);
  gradient.addColorStop(0.5, colors.middle);
  gradient.addColorStop(1, colors.bottom);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.globalAlpha = 0.03;
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height * 0.4;
    const radius = Math.random() * 100 + 50;
    
    const spotGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    spotGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    spotGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = spotGradient;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }
  
  return canvas;
}

export { StudioQualityLighting };
