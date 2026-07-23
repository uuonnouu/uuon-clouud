import React, { useMemo } from 'react';
import { EffectComposer, SSAO, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

interface StudioPostProcessingProps {
  enabled?: boolean;
  ssaoIntensity?: number;
  vignetteIntensity?: number;
  prismaticEnabled?: boolean;
  prismaticIntensity?: number;
}

export default function StudioPostProcessing({
  enabled = true,
  ssaoIntensity = 0.5,
  vignetteIntensity = 0.3,
  prismaticEnabled = true,
  prismaticIntensity = 0.25
}: StudioPostProcessingProps) {
  if (!enabled) return null;

  const chromaticOffset = useMemo(() => {
    const intensity = prismaticIntensity * 0.0015;
    return new THREE.Vector2(intensity, intensity * 0.6);
  }, [prismaticIntensity]);

  return (
    <EffectComposer multisampling={4} enableNormalPass={true}>
      <SSAO
        blendFunction={BlendFunction.MULTIPLY}
        samples={16}
        radius={0.12}
        intensity={ssaoIntensity * 0.8}
        luminanceInfluence={0.4}
        color={new THREE.Color(0x000000)}
        worldDistanceThreshold={0.4}
        worldDistanceFalloff={0.08}
        worldProximityThreshold={0.25}
        worldProximityFalloff={0.08}
      />
      
      {prismaticEnabled ? (
        <ChromaticAberration
          offset={chromaticOffset}
          radialModulation={true}
          modulationOffset={0.15}
        />
      ) : null}
      
      <Vignette
        offset={0.35}
        darkness={vignetteIntensity * 0.85}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}

export { StudioPostProcessing };
