import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ChromaticAberrationProps {
  intensity?: number;
  quantumMode?: boolean;
  enabled?: boolean;
  colorSeparation?: number;
  distortionStrength?: number;
}

export default function ChromaticAberration({
  intensity = 0.002,
  quantumMode = false,
  enabled = true,
  colorSeparation = 0.0005,
  distortionStrength = 0.015
}: ChromaticAberrationProps) {
  const { gl, scene, camera } = useThree();
  const renderTarget = useRef<THREE.WebGLRenderTarget>();
  const aberrationMaterial = useRef<THREE.ShaderMaterial>();
  const quadGeometry = useRef<THREE.PlaneGeometry>();
  const quadMesh = useRef<THREE.Mesh>();

  // Initialize render target and materials
  useMemo(() => {
    // Create render target for post-processing
    renderTarget.current = new THREE.WebGLRenderTarget(
      gl.domElement.clientWidth,
      gl.domElement.clientHeight,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
      }
    );

    // Chromatic aberration shader
    const vertexShader = `
      varying vec2 vUv;
      
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D tDiffuse;
      uniform float intensity;
      uniform float colorSeparation;
      uniform float distortionStrength;
      uniform float time;
      uniform bool quantumMode;
      uniform vec2 resolution;
      
      varying vec2 vUv;
      
      // Smooth barrel distortion with reduced artifacts
      vec2 barrelDistortion(vec2 coord, float amt) {
        vec2 cc = coord - 0.5;
        float dist = dot(cc, cc);
        float distSq = dist * dist;
        return coord + cc * (dist * amt + distSq * amt * 0.5);
      }
      
      // Improved noise function with better distribution
      float smoothNoise(vec2 co) {
        return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453) * 0.5 + 0.5;
      }
      
      // Spectral wavelength simulation for realistic chromatic aberration
      vec3 spectralSample(sampler2D tex, vec2 uv, float wavelength) {
        float offset = wavelength * colorSeparation * intensity;
        vec2 radialDir = normalize(uv - 0.5);
        return texture2D(tex, uv + radialDir * offset).rgb;
      }
      
      void main() {
        vec2 uv = vUv;
        vec2 centerOffset = uv - 0.5;
        float distFromCenter = length(centerOffset);
        
        // Apply smooth barrel distortion
        vec2 distortedUV = barrelDistortion(uv, distortionStrength * intensity * 0.8);
        
        // Radial chromatic aberration (physically accurate)
        vec2 radialDir = normalize(centerOffset);
        
        // Spectral dispersion based on distance from center (heavily reduced intensity)
        float aberrationAmount = distFromCenter * intensity * colorSeparation * 0.15;
        
        // Quantum mode adds subtle temporal variations (minimized)
        if (quantumMode) {
          float quantumFluctuation = sin(time * 2.0 + distFromCenter * 5.0) * 0.00005;
          aberrationAmount *= (1.0 + quantumFluctuation);
        }
        
        // Sample RGB channels with radial offsets (minimized offsets)
        float r = texture2D(tDiffuse, distortedUV + radialDir * aberrationAmount * 0.3).r;
        float g = texture2D(tDiffuse, distortedUV).g;
        float b = texture2D(tDiffuse, distortedUV - radialDir * aberrationAmount * 0.3).b;
        
        // Enhanced spectral dispersion for quantum mode (cleaner)
        if (quantumMode) {
          // Sample intermediate wavelengths for prismatic effect
          vec3 cyan = spectralSample(tDiffuse, distortedUV, -0.6);
          vec3 magenta = spectralSample(tDiffuse, distortedUV, 0.6);
          
          // Blend with minimal noise
          float edgeFactor = smoothstep(0.3, 0.7, distFromCenter);
          vec3 spectralMix = mix(vec3(r, g, b), (cyan + magenta) * 0.5, edgeFactor * 0.2);
          
          // Apply spectral color grading
          spectralMix.r = mix(spectralMix.r, r, 0.7);
          spectralMix.b = mix(spectralMix.b, b, 0.7);
          
          gl_FragColor = vec4(spectralMix, 1.0);
        } else {
          // Clean chromatic aberration without noise
          gl_FragColor = vec4(r, g, b, 1.0);
        }
      }
    `;

    aberrationMaterial.current = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        tDiffuse: { value: null },
        intensity: { value: intensity },
        colorSeparation: { value: colorSeparation },
        distortionStrength: { value: distortionStrength },
        time: { value: 0 },
        quantumMode: { value: quantumMode },
        resolution: { value: new THREE.Vector2(gl.domElement.clientWidth, gl.domElement.clientHeight) }
      }
    });

    // Full-screen quad for post-processing
    quadGeometry.current = new THREE.PlaneGeometry(2, 2);
    quadMesh.current = new THREE.Mesh(quadGeometry.current, aberrationMaterial.current);
  }, [gl, intensity, colorSeparation, distortionStrength, quantumMode]);

  useFrame((state) => {
    if (!enabled || !renderTarget.current || !aberrationMaterial.current || !quadMesh.current) return;

    // Update uniforms
    aberrationMaterial.current.uniforms.time.value = state.clock.elapsedTime;
    aberrationMaterial.current.uniforms.intensity.value = intensity;
    aberrationMaterial.current.uniforms.quantumMode.value = quantumMode;
    
    // Dynamic intensity for quantum mode
    if (quantumMode) {
      const fluctuation = Math.sin(state.clock.elapsedTime * 3) * 0.5 + 1;
      aberrationMaterial.current.uniforms.intensity.value = intensity * fluctuation;
    }

    // Render scene to texture
    const originalTarget = gl.getRenderTarget();
    gl.setRenderTarget(renderTarget.current);
    gl.render(scene, camera);
    
    // Apply chromatic aberration post-process
    aberrationMaterial.current.uniforms.tDiffuse.value = renderTarget.current.texture;
    
    // Render to screen
    gl.setRenderTarget(originalTarget);
    
    // Create temporary scene for post-processing
    const postScene = new THREE.Scene();
    const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    postScene.add(quadMesh.current);
    
    gl.render(postScene, postCamera);
  });

  // Handle resize
  useMemo(() => {
    const handleResize = () => {
      if (renderTarget.current && aberrationMaterial.current) {
        renderTarget.current.setSize(gl.domElement.clientWidth, gl.domElement.clientHeight);
        aberrationMaterial.current.uniforms.resolution.value.set(
          gl.domElement.clientWidth, 
          gl.domElement.clientHeight
        );
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [gl]);

  return null; // This is a post-processing effect, no visual component needed
}

// Quantum-specific chromatic aberration component
export function QuantumChromaticAberration({ 
  enabled = true,
  intensity = 0.003 
}: {
  enabled?: boolean;
  intensity?: number;
}) {
  return (
    <ChromaticAberration
      enabled={enabled}
      intensity={intensity}
      quantumMode={true}
      colorSeparation={0.0008}
      distortionStrength={0.02}
    />
  );
}

// Helper function for creating chromatic materials
export function createChromaticMaterial(
  baseColor: THREE.Color,
  chromaticIntensity: number = 0.1
): THREE.ShaderMaterial {
  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 baseColor;
    uniform float chromaticIntensity;
    uniform float time;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    
    void main() {
      vec2 uv = vUv;
      
      // Create chromatic offset based on position and time
      vec2 chromaticOffset = vec2(
        sin(vWorldPosition.x * 5.0 + time) * chromaticIntensity,
        cos(vWorldPosition.y * 5.0 + time) * chromaticIntensity
      );
      
      // Sample different color channels
      float r = baseColor.r + chromaticOffset.x;
      float g = baseColor.g;
      float b = baseColor.b - chromaticOffset.x;
      
      // Apply fresnel effect
      vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
      float fresnel = 1.0 - max(0.0, dot(vNormal, viewDirection));
      
      vec3 finalColor = vec3(r, g, b) * (1.0 + fresnel * 0.5);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      baseColor: { value: baseColor },
      chromaticIntensity: { value: chromaticIntensity },
      time: { value: 0 }
    }
  });
}