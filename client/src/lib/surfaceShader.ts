/**
 * Custom Surface Shader System for Δmension
 * Adds visual depth with fresnel, curvature, and gradient effects
 */

import * as THREE from 'three';

/**
 * Create shader material with advanced visual effects
 */
export function createSurfaceShaderMaterial(color: string | number, colorMode: string): THREE.ShaderMaterial {
  const baseColor = new THREE.Color(color);
  
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: baseColor },
      uTime: { value: 0 },
      uFresnelPower: { value: 2.5 },
      uFresnelIntensity: { value: 0.6 },
      uGradientStrength: { value: 0.4 },
      uMetalness: { value: 0.2 },
      uRoughness: { value: 0.6 }
    },
    
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewPosition;
      varying vec2 vUv;
      
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vUv = uv;
        
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uTime;
      uniform float uFresnelPower;
      uniform float uFresnelIntensity;
      uniform float uGradientStrength;
      uniform float uMetalness;
      uniform float uRoughness;
      
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewPosition;
      varying vec2 vUv;
      
      // Spectral wavelength to RGB conversion (380-740nm)
      vec3 wavelengthToRGB(float wavelength) {
        float r, g, b;
        
        if (wavelength >= 380.0 && wavelength < 440.0) {
          r = -(wavelength - 440.0) / (440.0 - 380.0);
          g = 0.0;
          b = 1.0;
        } else if (wavelength >= 440.0 && wavelength < 490.0) {
          r = 0.0;
          g = (wavelength - 440.0) / (490.0 - 440.0);
          b = 1.0;
        } else if (wavelength >= 490.0 && wavelength < 510.0) {
          r = 0.0;
          g = 1.0;
          b = -(wavelength - 510.0) / (510.0 - 490.0);
        } else if (wavelength >= 510.0 && wavelength < 580.0) {
          r = (wavelength - 510.0) / (580.0 - 510.0);
          g = 1.0;
          b = 0.0;
        } else if (wavelength >= 580.0 && wavelength < 645.0) {
          r = 1.0;
          g = -(wavelength - 645.0) / (645.0 - 580.0);
          b = 0.0;
        } else if (wavelength >= 645.0 && wavelength <= 740.0) {
          r = 1.0;
          g = 0.0;
          b = 0.0;
        } else {
          r = 0.0;
          g = 0.0;
          b = 0.0;
        }
        
        return vec3(r, g, b);
      }
      
      // Phi-harmonic color balance using golden ratio
      vec3 applyPhiHarmonic(vec3 color) {
        const float PHI = 1.618033988749;
        float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
        vec3 harmonized = color * (1.0 + sin(luminance * PHI * 3.14159) * 0.1);
        return mix(color, harmonized, 0.3);
      }
      
      // ACES Filmic tone mapping
      vec3 acesFilmic(vec3 x) {
        float a = 2.51;
        float b = 0.03;
        float c = 2.43;
        float d = 0.59;
        float e = 0.14;
        return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
      }
      
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        
        // Enhanced Fresnel with spectral dispersion
        float fresnel = pow(1.0 - abs(dot(normal, viewDir)), uFresnelPower);
        float spectralFresnel = fresnel * (1.0 + sin(vUv.x * 3.14159 * 2.0) * 0.1);
        
        float curvature = abs(dot(normal, vec3(0.0, 1.0, 0.0)));
        curvature = pow(curvature, 1.5);
        
        // Phi-harmonic gradient
        const float PHI = 1.618033988749;
        float gradient = (vPosition.y + 2.0) * 0.25;
        gradient = clamp(gradient, 0.0, 1.0);
        gradient = gradient * PHI - floor(gradient * PHI);
        
        // Physically accurate lighting
        vec3 lightDir1 = normalize(vec3(1.0, 1.0, 0.5));
        vec3 lightDir2 = normalize(vec3(-0.5, 0.8, -0.3));
        
        float diffuse1 = max(dot(normal, lightDir1), 0.0);
        float diffuse2 = max(dot(normal, lightDir2), 0.0) * 0.5;
        float diffuse = diffuse1 + diffuse2;
        
        // Enhanced specular with spectral highlights
        vec3 halfDir = normalize(lightDir1 + viewDir);
        float specular = pow(max(dot(normal, halfDir), 0.0), 64.0);
        specular *= (1.0 - uRoughness) * uMetalness;
        
        // Spectral base color with HDR
        vec3 baseColor = mix(uColor * 0.8, uColor * 1.5, gradient * uGradientStrength + (1.0 - uGradientStrength));
        baseColor = applyPhiHarmonic(baseColor);
        
        // Physically based diffuse lighting
        vec3 litColor = baseColor * (0.2 + diffuse * 0.8);
        
        // Spectral Fresnel highlights
        float avgWavelength = 520.0 + spectralFresnel * 100.0;
        vec3 spectralHighlight = wavelengthToRGB(avgWavelength);
        vec3 fresnelColor = mix(uColor * 1.8, spectralHighlight * 2.0, 0.3);
        litColor = mix(litColor, fresnelColor, spectralFresnel * uFresnelIntensity);
        
        // HDR specular with bloom-ready luminance
        litColor += spectralHighlight * specular * 1.2;
        
        // Curvature-based ambient occlusion
        litColor *= 0.6 + curvature * 0.4;
        
        // Subtle emissive glow
        litColor += uColor * 0.08;
        
        // Apply ACES tone mapping for cinematic HDR
        litColor = acesFilmic(litColor * 1.2);
        
        gl_FragColor = vec4(litColor, 1.0);
      }
    `,
    
    side: THREE.DoubleSide,
    transparent: false
  });
}

/**
 * Enhanced shader material for wireframe mode
 */
export function createWireframeShaderMaterial(color: string | number): THREE.ShaderMaterial {
  const baseColor = new THREE.Color(color);
  
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: baseColor },
      uGlow: { value: 0.8 }
    },
    
    vertexShader: `
      varying vec3 vViewPosition;
      
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uGlow;
      
      varying vec3 vViewPosition;
      
      void main() {
        float dist = length(vViewPosition);
        float glow = 1.0 / (1.0 + dist * 0.05);
        
        vec3 glowColor = uColor * (1.0 + glow * uGlow);
        
        gl_FragColor = vec4(glowColor, 1.0);
      }
    `,
    
    transparent: false,
    wireframe: true
  });
}

/**
 * Update shader uniforms (call in animation loop)
 */
export function updateShaderUniforms(material: THREE.ShaderMaterial, time: number) {
  if (material.uniforms.uTime) {
    material.uniforms.uTime.value = time;
  }
}
