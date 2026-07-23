import React, { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { BlendFunction, KernelSize } from 'postprocessing';
import VolumetricLighting, { GodRays } from './VolumetricLighting';
import ParticleTrailSystem from './ParticleTrailSystem';
import ChromaticAberration, { QuantumChromaticAberration } from './ChromaticAberration';
import { performanceMonitor } from '../lib/performanceMonitor';
import * as THREE from 'three';

interface AdvancedEffectsRendererProps {
  surfaceParameters: any;
  energyLevel?: 'low' | 'medium' | 'high' | 'quantum';
  enabled?: boolean;
  bloomIntensity?: number;
  particleCount?: number;
  volumetricIntensity?: number;
  chromaticIntensity?: number;
}

export default function AdvancedEffectsRenderer({
  surfaceParameters,
  energyLevel = 'medium',
  enabled = true,
  bloomIntensity = 1.5,
  particleCount = 100,
  volumetricIntensity = 1.0,
  chromaticIntensity = 0.02
}: AdvancedEffectsRendererProps) {
  const { gl } = useThree();
  const isMobile = performanceMonitor.isMobileDevice();

  // Energy-based effect settings with mobile optimizations
  // REDUCED bloom intensities to prevent GPU crashes and mesh rendering issues
  const effectSettings = useMemo(() => {
    const settings = {
      low: {
        bloom: { intensity: isMobile ? 0.15 : 0.3, threshold: 0.6, smoothWidth: 0.3 },
        particles: { count: isMobile ? 15 : 30, speed: 0.5, energy: 'low' as const },
        volumetric: { intensity: isMobile ? 0.1 : 0.25, density: 0.1 },
        chromatic: { intensity: isMobile ? 0.001 : 0.002, quantum: false }
      },
      medium: {
        bloom: { intensity: isMobile ? 0.25 : 0.5, threshold: 0.5, smoothWidth: 0.25 },
        particles: { count: isMobile ? 20 : 50, speed: 1.0, energy: 'medium' as const },
        volumetric: { intensity: isMobile ? 0.15 : 0.4, density: 0.15 },
        chromatic: { intensity: isMobile ? 0.002 : 0.004, quantum: false }
      },
      high: {
        bloom: { intensity: isMobile ? 0.4 : 0.8, threshold: 0.4, smoothWidth: 0.2 },
        particles: { count: isMobile ? 25 : 75, speed: 1.5, energy: 'high' as const },
        volumetric: { intensity: isMobile ? 0.25 : 0.6, density: 0.2 },
        chromatic: { intensity: isMobile ? 0.003 : 0.006, quantum: false }
      },
      quantum: {
        bloom: { intensity: isMobile ? 0.5 : 1.0, threshold: 0.3, smoothWidth: 0.15 },
        particles: { count: isMobile ? 30 : 100, speed: 2.0, energy: 'quantum' as const },
        volumetric: { intensity: isMobile ? 0.4 : 0.8, density: 0.3 },
        chromatic: { intensity: isMobile ? 0.004 : 0.008, quantum: !isMobile }
      }
    };
    return settings[energyLevel];
  }, [energyLevel, isMobile]);


  if (!enabled) return null;

  return (
    <group>
      {/* Post-processing effects with high-resolution outline glow */}
      {isMobile ? (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={effectSettings.bloom.intensity * bloomIntensity * 0.3}
            kernelSize={KernelSize.SMALL}
            luminanceThreshold={0.4}
            luminanceSmoothing={0.5}
            mipmapBlur={false}
            resolutionScale={0.5}
            blendFunction={BlendFunction.ADD}
          />
        </EffectComposer>
      ) : (
        <EffectComposer multisampling={2}>
          {/* Single optimized bloom pass - cleaner, more efficient */}
          <Bloom
            intensity={effectSettings.bloom.intensity * bloomIntensity * 0.35}
            kernelSize={KernelSize.SMALL}
            luminanceThreshold={0.4}
            luminanceSmoothing={0.4}
            mipmapBlur={true}
            resolutionScale={0.5}
            blendFunction={BlendFunction.ADD}
          />
        </EffectComposer>
      )}

      {/* Volumetric lighting system - disabled on mobile */}
      {!isMobile && (
        <VolumetricLighting
          intensity={effectSettings.volumetric.intensity * volumetricIntensity}
          density={effectSettings.volumetric.density}
          enabled={enabled}
          lightPosition={[5, 8, 5]}
          colorTint={new THREE.Color(0.4, 0.8, 1.0)}
        />
      )}

      {/* God rays for dramatic lighting - disabled on mobile */}
      {!isMobile && (
        <GodRays
          lightPosition={[5, 8, 5]}
          enabled={energyLevel === 'high' || energyLevel === 'quantum'}
          intensity={effectSettings.volumetric.intensity * 0.5}
        />
      )}

      {/* Particle trail system - reduced on mobile */}
      <ParticleTrailSystem
        surfaceParameters={surfaceParameters}
        particleCount={effectSettings.particles.count * (particleCount / 100)}
        speed={effectSettings.particles.speed}
        energyMode={effectSettings.particles.energy}
        enabled={enabled}
        trailLength={isMobile ? 20 : (energyLevel === 'quantum' ? 80 : 50)}
      />

      {/* Chromatic aberration effects - simplified on mobile */}
      {!isMobile && (
        effectSettings.chromatic.quantum ? (
          <QuantumChromaticAberration
            enabled={enabled}
            intensity={effectSettings.chromatic.intensity * chromaticIntensity}
          />
        ) : (
          <ChromaticAberration
            intensity={effectSettings.chromatic.intensity * chromaticIntensity}
            enabled={enabled}
            quantumMode={false}
            colorSeparation={0.005}
            distortionStrength={0.1}
          />
        )
      )}

      {/* Additional atmospheric effects for quantum mode - desktop only */}
      {!isMobile && energyLevel === 'quantum' && (
        <group>
          {/* Secondary particle systems */}
          <ParticleTrailSystem
            surfaceParameters={surfaceParameters}
            particleCount={50}
            speed={0.3}
            energyMode="quantum"
            enabled={enabled}
            trailLength={30}
          />
          
          {/* Additional volumetric layers */}
          <VolumetricLighting
            intensity={0.5}
            density={0.1}
            enabled={enabled}
            lightPosition={[-3, 6, -3]}
            colorTint={new THREE.Color(1.0, 0.4, 0.8)}
          />
        </group>
      )}
    </group>
  );
}

// Export helper functions for energy level detection
export function calculateEnergyLevel(surfaceType: string): 'low' | 'medium' | 'high' | 'quantum' {
  const quantumSurfaces = [
    'square_root_riemann', 'logarithm_riemann', 'exponential_riemann',
    'hydrogen_orbital', 'klein_bottle', 'tesseract_4d', 'hypersphere_4d'
  ];
  
  const highEnergySurfaces = [
    'mandelbrot_solid', 'koch_snowflake', 'sierpinski_pyramid',
    'cell_600', 'trefoil_knot', 'dragon_curve'
  ];
  
  const mediumEnergySurfaces = [
    'torus', 'hyperboloid', 'paraboloid', 'helicoid',
    'pentagonal_pyramid', 'hexagonal_pyramid', 'octagonal_pyramid'
  ];
  
  if (quantumSurfaces.includes(surfaceType)) return 'quantum';
  if (highEnergySurfaces.includes(surfaceType)) return 'high';
  if (mediumEnergySurfaces.includes(surfaceType)) return 'medium';
  return 'low';
}

// Export intensity presets
export const ENERGY_PRESETS = {
  minimal: {
    bloom: 0.5,
    particles: 30,
    volumetric: 0.3,
    chromatic: 0.005
  },
  balanced: {
    bloom: 1.0,
    particles: 100,
    volumetric: 1.0,
    chromatic: 0.02
  },
  maximum: {
    bloom: 2.5,
    particles: 200,
    volumetric: 2.0,
    chromatic: 0.05
  }
} as const;