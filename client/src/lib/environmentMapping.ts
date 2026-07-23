/**
 * ENVIRONMENT MAPPING SYSTEM
 * Generates procedural environment maps for realistic reflections
 * Optimized for glass and metal PBR materials
 */

import * as THREE from 'three';

let environmentMap: THREE.CubeTexture | null = null;

/**
 * Generate procedural environment cube map with clouds (legacy function)
 * @deprecated Use getHDREnvironmentMap() instead
 */
function generateCloudyEnvironmentMap(): THREE.CubeTexture {
  if (environmentMap) return environmentMap;
  
  // Create procedural environment cube map
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d')!;
  
  const faces = [];
  
  // Generate 6 faces of cube map
  for (let face = 0; face < 6; face++) {
    context.clearRect(0, 0, size, size);
    
    // Create gradient sky with horizon
    const gradient = context.createLinearGradient(0, 0, 0, size);
    gradient.addColorStop(0, '#87CEEB'); // Sky blue
    gradient.addColorStop(0.7, '#E0F6FF'); // Light blue
    gradient.addColorStop(1, '#FFFFFF'); // White horizon
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
    
    // Add some clouds for variation
    context.fillStyle = 'rgba(255, 255, 255, 0.8)';
    const cloudCount = 3 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < cloudCount; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size * 0.6; // Upper part of sky
      const radius = 30 + Math.random() * 50;
      
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }
    
    // Add subtle lighting variation per face
    const overlay = context.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
    const intensity = 0.8 + Math.sin(face * Math.PI / 3) * 0.2;
    overlay.addColorStop(0, `rgba(255, 255, 255, ${intensity * 0.1})`);
    overlay.addColorStop(1, `rgba(255, 255, 255, 0)`);
    
    context.fillStyle = overlay;
    context.fillRect(0, 0, size, size);
    
    faces.push(canvas.toDataURL());
  }
  
  // Create cube texture from generated faces
  const loader = new THREE.CubeTextureLoader();
  environmentMap = loader.load(faces);
  environmentMap.mapping = THREE.CubeReflectionMapping;
  environmentMap.colorSpace = THREE.SRGBColorSpace;
  
  return environmentMap;
}

/**
 * Generate a subtle gradient environment map for reflections
 * Creates a realistic sky-to-ground gradient
 */
export function generateEnvironmentMap(): THREE.CubeTexture {
  const size = 512; // Optimized size for real-time
  
  const createGradientCanvas = (topColor: THREE.Color, bottomColor: THREE.Color): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    const gradient = ctx.createLinearGradient(0, 0, 0, size);
    gradient.addColorStop(0, `rgb(${topColor.r * 255}, ${topColor.g * 255}, ${topColor.b * 255})`);
    gradient.addColorStop(1, `rgb(${bottomColor.r * 255}, ${bottomColor.g * 255}, ${bottomColor.b * 255})`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    return canvas;
  };
  
  // Define colors for a subtle, neutral environment
  const skyColor = new THREE.Color(0.9, 0.95, 1.0);      // Light blue-white
  const horizonColor = new THREE.Color(0.7, 0.75, 0.8);  // Soft gray-blue
  const groundColor = new THREE.Color(0.4, 0.42, 0.45);  // Darker gray
  
  // Create the 6 cube faces
  const faces = [
    createGradientCanvas(skyColor, horizonColor),     // PX (right)
    createGradientCanvas(skyColor, horizonColor),     // NX (left)
    createGradientCanvas(skyColor, groundColor),      // PY (top)
    createGradientCanvas(horizonColor, groundColor),  // NY (bottom)
    createGradientCanvas(skyColor, horizonColor),     // PZ (front)
    createGradientCanvas(skyColor, horizonColor),     // NZ (back)
  ];
  
  const cubeTexture = new THREE.CubeTexture(faces as unknown as HTMLImageElement[]);
  cubeTexture.needsUpdate = true;
  cubeTexture.mapping = THREE.CubeReflectionMapping;
  
  return cubeTexture;
}

/**
 * Generate HDR-style environment map with subtle highlights
 * Better for metallic and glossy surfaces
 */
export function generateHDREnvironmentMap(): THREE.CubeTexture {
  const size = 512;
  
  const createHDRCanvas = (): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    // Create gradient from bright sky to darker ground
    const gradient = ctx.createLinearGradient(0, 0, 0, size);
    gradient.addColorStop(0, 'rgb(240, 245, 255)');    // Bright sky
    gradient.addColorStop(0.4, 'rgb(180, 190, 210)');  // Mid-sky
    gradient.addColorStop(0.6, 'rgb(120, 125, 135)');  // Horizon
    gradient.addColorStop(1, 'rgb(60, 62, 65)');       // Ground
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // Add subtle bright spot (sun/light source)
    const centerX = size / 2;
    const centerY = size * 0.3;
    const radialGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size * 0.4);
    radialGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    radialGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
    radialGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = radialGradient;
    ctx.fillRect(0, 0, size, size);
    
    return canvas;
  };
  
  const canvas = createHDRCanvas();
  const faces = [canvas, canvas, canvas, canvas, canvas, canvas];
  
  const cubeTexture = new THREE.CubeTexture(faces as unknown as HTMLImageElement[]);
  cubeTexture.needsUpdate = true;
  cubeTexture.mapping = THREE.CubeReflectionMapping;
  
  return cubeTexture;
}

// Cache for environment maps
let envMapCache: THREE.CubeTexture | null = null;
let hdrEnvMapCache: THREE.CubeTexture | null = null;

export function getEnvironmentMap(): THREE.CubeTexture {
  if (!envMapCache) {
    envMapCache = generateEnvironmentMap();
  }
  return envMapCache;
}

export function getHDREnvironmentMap(): THREE.CubeTexture {
  if (!hdrEnvMapCache) {
    hdrEnvMapCache = generateHDREnvironmentMap();
  }
  return hdrEnvMapCache;
}
