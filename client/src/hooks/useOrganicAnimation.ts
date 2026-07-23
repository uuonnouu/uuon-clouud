import { useEffect, useRef, useState } from 'react';
import { SurfaceParameters } from '../types/math';
import { quantumGapMath } from '../lib/quantumGapMathematics';

export type AnimationMode = 'basic' | 'dynamic' | 'collapse';

interface AnimationConfig {
  enabled: boolean;
  speed: number;
  mode: AnimationMode;
}

// Internal animation state that NEVER modifies user parameters
export interface InternalAnimationState {
  time: number;
  isAnimating: boolean;
  mode: AnimationMode;
  // Internal transform parameters (separate from user controls)
  internalE: number;  // Frequency
  internalF: number;  // Bulge
  internalG: number;  // Pinch
  internalH: number;  // Morph
}

export function useOrganicAnimation(
  parameters: SurfaceParameters,
  onParameterChange: (params: Partial<SurfaceParameters>) => void
) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationMode, setAnimationMode] = useState<AnimationMode>('basic');
  const [internalAnimationState, setInternalAnimationState] = useState<InternalAnimationState>({
    time: 0,
    isAnimating: false,
    mode: 'basic',
    internalE: 0,
    internalF: 0,
    internalG: 0,
    internalH: 0
  });
  const animationFrameRef = useRef<number>();
  const timeRef = useRef(0);
  const lastFrameTimeRef = useRef<number>(0);
  const baseParamsRef = useRef<SurfaceParameters>(parameters);

  useEffect(() => {
    // Always update base params to ensure static rendering works
    baseParamsRef.current = parameters;
  }, [parameters]);

  useEffect(() => {
    if (!isAnimating) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    lastFrameTimeRef.current = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastFrameTimeRef.current) / 1000;
      lastFrameTimeRef.current = currentTime;

      // Apply discrete temporal modeling
      // Based on observed Earth rotation period: 86,400.002 seconds (0.002s deviation per day)
      const temporalGap = 0.002; // seconds per day deviation
      const quantizedDelta = deltaTime * (1 + temporalGap / 86400); // Apply discrete timing model
      timeRef.current += quantizedDelta;
      const t = timeRef.current;

      // ============================================================================
      // INTERNAL ANIMATION ENGINE - Does NOT modify user parameters!
      // ============================================================================
      let internalE = 0;
      let internalF = 0;
      let internalG = 0;
      let internalH = 0;

      if (animationMode === 'basic') {
        // Internal wave animation - object stays fixed, internal patterns oscillate
        const wave1 = Math.sin(t * 1.2);
        const wave2 = Math.sin(t * 0.9);
        const wave3 = Math.sin(t * 1.5);

        internalE = wave1 * 0.5;
        internalF = wave2 * 0.3;
        internalG = wave3 * 0.2;
        internalH = 0;
      } else if (animationMode === 'collapse') {
        // MORPH animation - shape materializes from point to full form
        const cycleDuration = 4.0;
        const cycleTime = t % cycleDuration;
        const progress = cycleTime / cycleDuration;

        // Smooth ease in-out
        const eased = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        internalE = 0;
        internalF = 0;
        internalG = 0;
        internalH = eased * 25;
      } else {
        // Dynamic mode: Multi-frequency internal wave patterns
        const wave1 = Math.sin(t * 0.8);
        const wave2 = Math.sin(t * 1.3 + 0.5);
        const wave3 = Math.sin(t * 0.6 + 1.0);

        internalE = wave1 * 0.8;
        internalF = wave2 * 0.5;
        internalG = wave3 * 0.4;
        internalH = 0;
      }

      // Update internal state WITHOUT modifying user parameters
      setInternalAnimationState({
        time: t,
        isAnimating: true,
        mode: animationMode,
        internalE,
        internalF,
        internalG,
        internalH
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAnimating, animationMode, onParameterChange]);

  const toggleAnimation = () => {
    if (isAnimating) {
      timeRef.current = 0;
      // Reset internal animation state
      setInternalAnimationState({
        time: 0,
        isAnimating: false,
        mode: animationMode,
        internalE: 0,
        internalF: 0,
        internalG: 0,
        internalH: 0
      });
    }
    setIsAnimating(!isAnimating);
  };

  const setMode = (mode: AnimationMode) => {
    setAnimationMode(mode);
    if (isAnimating) {
      timeRef.current = 0;
    }
  };

  return {
    isAnimating,
    animationMode,
    toggleAnimation,
    setAnimationMode: setMode,
    internalAnimationState  // NEW: Return internal state instead of modifying parameters
  };
}