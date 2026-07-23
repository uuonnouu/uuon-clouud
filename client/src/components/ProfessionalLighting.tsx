import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { getHDREnvironmentMap } from '../lib/environmentMapping';
import { useLightingStore } from '../stores/lightingStore';

export default function ProfessionalLighting() {
  const { scene, gl } = useThree();
  
  const {
    ambientIntensity,
    keyLightIntensity,
    keyLightX,
    keyLightY,
    keyLightZ,
    fillLightIntensity,
    rimLightIntensity,
    shadowsEnabled,
    shadowSoftness,
    environmentPreset
  } = useLightingStore();
  
  useEffect(() => {
    const existingLights = scene.children.filter(c => (c as any).isLight);
    existingLights.forEach(light => scene.remove(light));
    
    const keyLight = new THREE.DirectionalLight(0xffffff, keyLightIntensity * 1.5);
    keyLight.position.set(keyLightX, keyLightY, keyLightZ);
    keyLight.castShadow = shadowsEnabled;
    keyLight.shadow.mapSize.width = 4096;
    keyLight.shadow.mapSize.height = 4096;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 500;
    keyLight.shadow.camera.left = -50;
    keyLight.shadow.camera.right = 50;
    keyLight.shadow.camera.top = 50;
    keyLight.shadow.camera.bottom = -50;
    keyLight.shadow.bias = -0.001;
    keyLight.shadow.normalBias = 0.01;
    keyLight.shadow.radius = shadowSoftness;
    scene.add(keyLight);
    
    const fillLight = new THREE.DirectionalLight(0xb3d9ff, fillLightIntensity);
    fillLight.position.set(-12, 8, -6);
    fillLight.castShadow = false;
    scene.add(fillLight);
    
    const rimLight = new THREE.DirectionalLight(0xffffff, rimLightIntensity * 2);
    rimLight.position.set(0, 10, -15);
    scene.add(rimLight);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, ambientIntensity);
    scene.add(ambientLight);
    
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4);
    scene.add(hemiLight);
    
    const envMap = getHDREnvironmentMap();
    scene.environment = envMap;
    scene.backgroundBlurriness = 0.1;
    scene.environmentIntensity = 0.6;
    
    return () => {
      scene.remove(keyLight);
      scene.remove(fillLight);
      scene.remove(rimLight);
      scene.remove(ambientLight);
      scene.remove(hemiLight);
    };
  }, [scene, gl, ambientIntensity, keyLightIntensity, keyLightX, keyLightY, keyLightZ, fillLightIntensity, rimLightIntensity, shadowsEnabled, shadowSoftness, environmentPreset]);
  
  return null;
}
