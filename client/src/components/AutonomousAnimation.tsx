import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { SurfaceParameters } from '../types/math';

interface AutonomousAnimationProps {
  parameters: SurfaceParameters;
  onParameterChange: (params: Partial<SurfaceParameters>) => void;
  enabled?: boolean;
  intensity?: number;
  mode?: 'breathe' | 'wave' | 'morph' | 'expand';
}

export default function AutonomousAnimation({
  parameters,
  onParameterChange,
  enabled = true,
  intensity = 1.0,
  mode = 'breathe',
}: AutonomousAnimationProps) {
  const animationStateRef = useRef({
    phase: 0,
    morphCycle: 0,
    lastUpdate: 0,
    baseA: parameters.a,
    baseUMax: parameters.uMax,
    baseVMax: parameters.vMax,
  });

  useFrame((state) => {
    if (!enabled) return;

    const time = state.clock.elapsedTime;
    const deltaTime = time - animationStateRef.current.lastUpdate;

    if (deltaTime < 0.033) return; // 30 FPS cap
    animationStateRef.current.lastUpdate = time;

    const animState = animationStateRef.current;
    const base = animState.baseA || 1;

    // BREATHING — scale pulses in and out
    const breathe = Math.sin(time * 0.8) * intensity * 0.15 + 1.0;

    // WAVE — harmonic motion on secondary params
    const wave1 = Math.sin(time * 0.4 + animState.phase) * intensity * 0.15;
    const wave2 = Math.cos(time * 0.6 + animState.phase * 1.2) * intensity * 0.12;
    const wave3 = Math.sin(time * 0.3 + animState.phase * 0.8) * intensity * 0.18;

    // EXPAND — UV domain pulses to create shape blooming
    const expandPulse = Math.sin(time * 0.5) * intensity * 0.3;

    // ROTATION EFFECTS on d,e,f
    const rotX = Math.sin(time * 0.8) * intensity * 0.25;
    const rotY = Math.cos(time * 0.6) * intensity * 0.2;
    const rotZ = Math.sin(time * 0.5) * intensity * 0.3;

    // HARMONIC RESONANCE
    const harm1 = Math.sin(time * 1.2) * Math.cos(time * 0.9) * intensity * 0.1;
    const harm2 = Math.cos(time * 1.0) * Math.sin(time * 1.1) * intensity * 0.12;
    const harm3 = Math.sin(time * 0.7) * Math.cos(time * 1.3) * intensity * 0.08;

    let animatedParams: Partial<SurfaceParameters> = {};

    if (mode === 'breathe') {
      animatedParams = {
        a: base * breathe,
        b: Math.max(0.1, parameters.b + wave1 * 0.5),
        c: Math.max(0.1, parameters.c + wave2 * 0.5),
        d: parameters.d + wave3 * 0.3,
        e: parameters.e + rotX * 0.3,
        f: parameters.f + rotY * 0.3,
      };
    } else if (mode === 'wave') {
      animatedParams = {
        a: base * breathe,
        b: Math.max(0.1, parameters.b + wave1),
        c: Math.max(0.1, parameters.c + wave2),
        d: parameters.d + wave3,
        e: parameters.e + rotX,
        f: parameters.f + rotY,
        g: parameters.g + rotZ,
        h: parameters.h + harm1,
        i: parameters.i + harm2,
        j: parameters.j + harm3,
        k: Math.max(0.1, parameters.k * breathe),
        l: Math.max(0.1, parameters.l * breathe),
        m: parameters.m + Math.sin(time * 0.5) * intensity * 0.08,
        n: parameters.n + Math.cos(time * 0.4) * intensity * 0.06,
      };
    } else if (mode === 'expand') {
      animatedParams = {
        a: base * breathe,
        uMax: animState.baseUMax + expandPulse,
        vMax: animState.baseVMax + expandPulse * 0.7,
        b: Math.max(0.1, parameters.b + wave1 * 0.3),
        c: Math.max(0.1, parameters.c + wave2 * 0.3),
      };
    } else if (mode === 'morph') {
      animatedParams = {
        a: base * breathe,
        b: Math.max(0.1, parameters.b + wave1),
        c: Math.max(0.1, parameters.c + wave2),
        d: parameters.d + wave3,
        e: parameters.e + rotX,
        f: parameters.f + rotY,
        g: parameters.g + rotZ,
        h: parameters.h + harm1,
        i: parameters.i + harm2,
        j: parameters.j + harm3,
        k: Math.max(0.1, parameters.k * breathe),
        l: Math.max(0.1, parameters.l * breathe),
        m: parameters.m + Math.sin(time * 0.5) * intensity * 0.08,
        n: parameters.n + Math.cos(time * 0.4) * intensity * 0.06,
        o: parameters.o + Math.sin(time * 0.3) * intensity * 0.07,
        p: parameters.p + Math.sin(time * 0.6) * intensity * 0.05,
        q: parameters.q + Math.cos(time * 0.7) * intensity * 0.06,
        r: parameters.r + Math.sin(time * 0.45) * intensity * 0.04,
        s: parameters.s + Math.sin(time * 0.35) * intensity * 0.03,
        t: parameters.t + Math.cos(time * 0.25) * intensity * 0.04,
        u: parameters.u + Math.sin(time * 0.55) * intensity * 0.05,
      };
    }

    // Smooth state evolution
    animState.phase += deltaTime * 0.2;
    animState.morphCycle += deltaTime * 0.15;

    onParameterChange(animatedParams);
  });

  return null;
}
