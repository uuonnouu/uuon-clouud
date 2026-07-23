import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VolumetricLightingProps {
  intensity?: number;
  density?: number;
  decay?: number;
  exposure?: number;
  enabled?: boolean;
  lightPosition?: [number, number, number];
  colorTint?: THREE.Color;
}

export default function VolumetricLighting({
  intensity = 1.0,
  density = 0.25,
  decay = 0.95,
  exposure = 0.8,
  enabled = true,
  lightPosition = [5, 5, 5],
  colorTint = new THREE.Color(0.4, 0.8, 1.0)
}: VolumetricLightingProps) {
  const volumetricRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.DirectionalLight>(null);

  // Volumetric fog geometry and material
  const { geometry, material } = useMemo(() => {
    const geom = new THREE.SphereGeometry(10, 32, 32);
    
    const vertexShader = `
      varying vec3 vWorldPosition;
      varying vec3 vNormal;
      
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform vec3 lightPosition;
      uniform vec3 colorTint;
      uniform float intensity;
      uniform float density;
      uniform float decay;
      uniform float exposure;
      uniform float time;
      
      varying vec3 vWorldPosition;
      varying vec3 vNormal;
      
      // Improved 3D noise with better distribution
      float noise3D(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        
        float n = i.x + i.y * 157.0 + 113.0 * i.z;
        return mix(
          mix(mix(fract(sin(n) * 43758.5453), fract(sin(n + 1.0) * 43758.5453), f.x),
              mix(fract(sin(n + 157.0) * 43758.5453), fract(sin(n + 158.0) * 43758.5453), f.x), f.y),
          mix(mix(fract(sin(n + 113.0) * 43758.5453), fract(sin(n + 114.0) * 43758.5453), f.x),
              mix(fract(sin(n + 270.0) * 43758.5453), fract(sin(n + 271.0) * 43758.5453), f.x), f.y),
          f.z
        );
      }
      
      // High-quality fractal Brownian motion
      float fbm(vec3 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        
        for(int i = 0; i < 6; i++) {
          value += amplitude * noise3D(p * frequency);
          amplitude *= 0.47;
          frequency *= 2.13;
        }
        
        return value;
      }
      
      // Mie scattering phase function for realistic atmospheric scattering
      float miePhase(float cosTheta, float g) {
        float g2 = g * g;
        float num = (1.0 - g2) * (1.0 + cosTheta * cosTheta);
        float denom = (2.0 + g2) * pow(1.0 + g2 - 2.0 * g * cosTheta, 1.5);
        return num / max(denom, 0.001);
      }
      
      void main() {
        vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
        vec3 lightDirection = normalize(lightPosition - vWorldPosition);
        
        // Distance from light with soft falloff
        float lightDistance = length(lightPosition - vWorldPosition);
        
        // Realistic atmospheric scattering (Mie scattering)
        float cosTheta = dot(viewDirection, lightDirection);
        float mieScatter = miePhase(cosTheta, 0.76);
        
        // Distance-based scattering with physical accuracy
        float scattering = exp(-lightDistance * density * 0.15) * mieScatter;
        
        // Multi-octave volumetric noise for realistic fog
        vec3 noisePos = vWorldPosition * 0.08 + vec3(time * 0.05, time * 0.03, 0.0);
        float volumeNoise = fbm(noisePos);
        volumeNoise = volumeNoise * 0.6 + 0.4;
        
        // Combine scattering with noise
        float volumetricIntensity = scattering * volumeNoise * intensity;
        
        // Soft shadows and depth-based density variation
        float depthFactor = smoothstep(0.0, 10.0, lightDistance);
        volumetricIntensity *= mix(1.0, 0.3, depthFactor);
        
        // Apply exposure and decay with HDR-ready range
        volumetricIntensity *= exposure;
        volumetricIntensity = 1.0 - exp(-volumetricIntensity * decay);
        
        // Enhanced light shaft effect with bloom-ready luminance
        float lightShaft = max(0.0, cosTheta);
        lightShaft = pow(lightShaft, 12.0) * 2.5;
        
        // Spectral color variation based on distance (atmospheric perspective)
        vec3 atmosphericColor = mix(colorTint, colorTint * vec3(1.2, 0.9, 0.7), depthFactor * 0.3);
        
        // Final color with HDR bloom support
        vec3 finalColor = atmosphericColor * volumetricIntensity * (1.0 + lightShaft * 3.0);
        
        // Soft alpha for natural blending
        float alpha = volumetricIntensity * 0.25 * (1.0 + lightShaft * 0.5);
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        lightPosition: { value: new THREE.Vector3(...lightPosition) },
        cameraPosition: { value: new THREE.Vector3() },
        colorTint: { value: colorTint },
        intensity: { value: intensity },
        density: { value: density },
        decay: { value: decay },
        exposure: { value: exposure },
        time: { value: 0 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false
    });

    return { geometry: geom, material: mat };
  }, [intensity, density, decay, exposure, lightPosition, colorTint]);

  useFrame((state) => {
    if (!enabled || !volumetricRef.current) return;

    const mat = volumetricRef.current.material as THREE.ShaderMaterial;
    
    // Update uniforms
    mat.uniforms.time.value = state.clock.elapsedTime;
    mat.uniforms.cameraPosition.value.copy(state.camera.position);
    mat.uniforms.lightPosition.value.set(...lightPosition);
    
    // Dynamic intensity based on time
    const pulseFactor = Math.sin(state.clock.elapsedTime * 0.5) * 0.2 + 1;
    mat.uniforms.intensity.value = intensity * pulseFactor;
  });

  if (!enabled) return null;

  return (
    <group>
      {/* Volumetric fog mesh */}
      <mesh ref={volumetricRef} geometry={geometry} material={material} />
      
      {/* Primary light source */}
      <directionalLight
        ref={lightRef}
        position={lightPosition}
        intensity={intensity * 1.5}
        color={colorTint}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Additional atmospheric lights */}
      <pointLight
        position={[lightPosition[0] * 0.5, lightPosition[1] * 0.3, lightPosition[2] * 0.8]}
        intensity={intensity * 0.3}
        color={new THREE.Color(0.8, 0.4, 1.0)}
        distance={15}
        decay={2}
      />
      
      <spotLight
        position={[lightPosition[0] * -0.3, lightPosition[1] * 1.2, lightPosition[2] * 0.6]}
        intensity={intensity * 0.8}
        color={new THREE.Color(1.0, 0.6, 0.2)}
        angle={Math.PI / 6}
        penumbra={0.3}
        distance={20}
        decay={1.5}
      />
    </group>
  );
}

// Helper component for god rays effect
export function GodRays({ 
  lightPosition = [5, 5, 5], 
  enabled = true,
  intensity = 0.5 
}: {
  lightPosition?: [number, number, number];
  enabled?: boolean;
  intensity?: number;
}) {
  const raysRef = useRef<THREE.Mesh>(null);

  const { geometry, material } = useMemo(() => {
    const geom = new THREE.PlaneGeometry(20, 20, 1, 1);
    
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform vec3 lightPosition;
      uniform vec3 cameraPosition;
      uniform float intensity;
      uniform float time;
      
      varying vec2 vUv;
      
      void main() {
        vec2 center = vec2(0.5);
        vec2 direction = vUv - center;
        float distance = length(direction);
        
        // Create ray pattern
        float rays = sin(atan(direction.y, direction.x) * 12.0 + time) * 0.5 + 0.5;
        rays *= (1.0 - distance);
        
        // Fade with distance
        float fade = 1.0 / (1.0 + distance * 8.0);
        
        float alpha = rays * fade * intensity;
        
        gl_FragColor = vec4(1.0, 0.9, 0.7, alpha * 0.1);
      }
    `;

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        lightPosition: { value: new THREE.Vector3(...lightPosition) },
        cameraPosition: { value: new THREE.Vector3() },
        intensity: { value: intensity },
        time: { value: 0 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    return { geometry: geom, material: mat };
  }, [lightPosition, intensity]);

  useFrame((state) => {
    if (!enabled || !raysRef.current) return;

    const mat = raysRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.time.value = state.clock.elapsedTime * 0.3;
    mat.uniforms.cameraPosition.value.copy(state.camera.position);
    
    // Orient towards camera
    raysRef.current.lookAt(state.camera.position);
  });

  if (!enabled) return null;

  return (
    <mesh
      ref={raysRef}
      geometry={geometry}
      material={material}
      position={lightPosition}
      scale={[2, 2, 2]}
    />
  );
}