import * as THREE from 'three';

/**
 * GPU-Accelerated Animation Shaders
 * Animate parametric surfaces on the GPU for maximum performance
 * 
 * Based on WebGL optimization best practices:
 * - Compute deformations in vertex shader (not JavaScript)
 * - Pass animation state as uniforms
 * - Use built-in GLSL functions for performance
 */

export interface AnimationUniforms {
  uTime: THREE.IUniform<number>;
  uAmplitude: THREE.IUniform<number>;
  uFrequency: THREE.IUniform<number>;
  uScale: THREE.IUniform<number>;
  uTwist: THREE.IUniform<number>;
  uInflation: THREE.IUniform<number>;
  uMorphProgress: THREE.IUniform<number>;
  uWaveStrength: THREE.IUniform<number>;
}

export function createAnimationUniforms(): AnimationUniforms {
  return {
    uTime: { value: 0.0 },
    uAmplitude: { value: 1.0 },
    uFrequency: { value: 2.0 },
    uScale: { value: 1.0 },
    uTwist: { value: 0.0 },
    uInflation: { value: 1.0 },
    uMorphProgress: { value: 0.0 },
    uWaveStrength: { value: 1.0 }
  };
}

/**
 * Vertex shader for animated parametric surfaces
 * Applies deformations directly on the GPU
 */
export const parametricAnimationVertexShader = `
  uniform float uTime;
  uniform float uAmplitude;
  uniform float uFrequency;
  uniform float uScale;
  uniform float uTwist;
  uniform float uInflation;
  uniform float uMorphProgress;
  uniform float uWaveStrength;
  
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normal;
    
    // Start with original position
    vec3 pos = position;
    
    // Apply scale animation
    pos *= uScale;
    
    // Apply wave deformation
    float wave = sin(pos.x * uFrequency + uTime) * cos(pos.z * uFrequency + uTime);
    pos.y += wave * uAmplitude * uWaveStrength;
    
    // Apply twist deformation (spiral)
    float angle = uTwist * length(pos.xz);
    float cosA = cos(angle);
    float sinA = sin(angle);
    vec3 twisted = pos;
    twisted.x = pos.x * cosA - pos.z * sinA;
    twisted.z = pos.x * sinA + pos.z * cosA;
    pos = mix(pos, twisted, uMorphProgress);
    
    // Apply inflation (breathing effect)
    vec3 inflated = normalize(pos) * length(pos) * uInflation;
    pos = mix(pos, inflated, uMorphProgress * 0.5);
    
    // Calculate final position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    
    // Pass transformed position and normal to fragment shader
    vPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
    
    // Recalculate normal for proper lighting using normalMatrix (handles non-uniform scaling)
    vNormal = normalize(normalMatrix * normal);
  }
`;

/**
 * Fragment shader for animated surfaces
 * Provides smooth shading with optional color effects
 */
export const parametricAnimationFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  
  void main() {
    // Basic lighting
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diffuse = max(dot(vNormal, lightDir), 0.0);
    
    // Ambient + diffuse lighting
    vec3 ambient = uColor * 0.3;
    vec3 color = ambient + uColor * diffuse * 0.7;
    
    // Optional: Animated color variation
    float colorShift = sin(uTime * 0.5 + vPosition.y) * 0.1 + 0.9;
    color *= colorShift;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

/**
 * Diamond-specific shader with refraction and sparkle effects
 */
export const diamondVertexShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vReflect;
  varying vec3 vRefract;
  
  uniform float uIOR;
  
  void main() {
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    
    vec3 viewDirection = normalize(cameraPosition - (modelMatrix * vec4(position, 1.0)).xyz);
    
    // Calculate reflection vector
    vReflect = reflect(-viewDirection, vNormal);
    
    // Calculate refraction vector (for diamond, IOR = 2.4)
    vRefract = refract(-viewDirection, vNormal, 1.0 / uIOR);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const diamondFragmentShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vReflect;
  varying vec3 vRefract;
  
  uniform samplerCube uEnvMap;
  uniform float uTime;
  uniform float uDispersion;
  
  void main() {
    // Environment mapping for reflection
    vec3 reflection = textureCube(uEnvMap, vReflect).rgb;
    
    // Chromatic aberration for dispersion (rainbow effect)
    vec3 refractR = refract(vRefract, vNormal, 1.0 / 2.4);
    vec3 refractG = refract(vRefract, vNormal, 1.0 / 2.42);
    vec3 refractB = refract(vRefract, vNormal, 1.0 / 2.44);
    
    float r = textureCube(uEnvMap, refractR).r;
    float g = textureCube(uEnvMap, refractG).g;
    float b = textureCube(uEnvMap, refractB).b;
    
    vec3 refraction = vec3(r, g, b);
    
    // Fresnel effect (more reflection at glancing angles)
    float fresnel = pow(1.0 - max(dot(vNormal, normalize(vReflect)), 0.0), 3.0);
    
    // Mix reflection and refraction
    vec3 color = mix(refraction, reflection, fresnel);
    
    // Add sparkle effect
    float sparkle = sin(vPosition.x * 100.0 + uTime) * 
                    sin(vPosition.y * 100.0 + uTime) * 
                    sin(vPosition.z * 100.0 + uTime);
    sparkle = smoothstep(0.95, 1.0, sparkle) * 0.5;
    
    color += vec3(sparkle);
    
    // Enhance brightness for diamond brilliance
    color *= 1.5;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

/**
 * Create animated shader material for parametric surfaces
 */
export function createAnimatedParametricMaterial(
  color: THREE.Color | string = '#00ff00',
  wireframe: boolean = false
): THREE.ShaderMaterial {
  const uniforms = {
    ...createAnimationUniforms(),
    uColor: { value: new THREE.Color(color) }
  };

  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader: parametricAnimationVertexShader,
    fragmentShader: parametricAnimationFragmentShader,
    wireframe,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.9
  });
}

/**
 * Create diamond material with realistic refraction
 */
export function createDiamondMaterial(
  envMap?: THREE.CubeTexture
): THREE.ShaderMaterial {
  // Create default environment map if none provided
  const defaultEnvMap = envMap || createDefaultEnvMap();

  return new THREE.ShaderMaterial({
    uniforms: {
      uEnvMap: { value: defaultEnvMap },
      uTime: { value: 0.0 },
      uIOR: { value: 2.4 }, // Diamond index of refraction
      uDispersion: { value: 0.01 }
    },
    vertexShader: diamondVertexShader,
    fragmentShader: diamondFragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.98
  });
}

/**
 * Create a simple environment map for diamonds
 */
function createDefaultEnvMap(): THREE.CubeTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Create gradient environment
  const gradient = ctx.createLinearGradient(0, 0, 0, size);
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(0.5, '#87CEEB');
  gradient.addColorStop(1, '#000033');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  // Create cube texture from single texture
  const cubeTexture = new THREE.CubeTexture([
    canvas, canvas, canvas, canvas, canvas, canvas
  ]);
  cubeTexture.needsUpdate = true;

  return cubeTexture;
}

/**
 * Animation preset configurations for easy use
 */
export const ANIMATION_PRESETS = {
  wave: {
    uAmplitude: 0.3,
    uFrequency: 2.0,
    uWaveStrength: 1.0
  },
  pulse: {
    uScale: 1.0, // Will animate to 1.3
    uAmplitude: 0.0
  },
  spiral: {
    uTwist: 0.0, // Will animate to Math.PI * 2
    uMorphProgress: 0.5
  },
  breathe: {
    uInflation: 1.0, // Will animate to 1.3
    uMorphProgress: 0.3
  },
  morph: {
    uMorphProgress: 0.0 // Will animate to 1.0
  }
};
