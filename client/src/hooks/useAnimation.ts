import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { animationEngine, AnimationClipSpec, ParamTrack, PathTrack } from '../lib/animation/AnimationEngine';
import { curveEngine } from '../lib/animation/CurveEngine';

// Animation state for UI
export interface AnimationState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  activeClip: string | null;
}

// Animation hook for mathematical surfaces
export function useAnimation() {
  const [animationState, setAnimationState] = useState<AnimationState>({
    isPlaying: false,
    currentTime: 0,
    duration: 1,
    progress: 0,
    activeClip: null
  });
  
  const [parameterUpdates, setParameterUpdates] = useState<Record<string, number>>({});
  const [pathUpdates, setPathUpdates] = useState<any[]>([]);
  const animationCallbackRef = useRef<((updates: Record<string, number>) => void) | null>(null);

  // Subscribe to animation engine updates
  useEffect(() => {
    const unsubscribe = animationEngine.subscribe((state) => {
      setAnimationState({
        isPlaying: state.isPlaying,
        currentTime: state.time,
        duration: animationEngine.getActiveClip()?.duration || 1,
        progress: state.progress,
        activeClip: animationEngine.getActiveClip()?.name || null
      });
      
      setParameterUpdates(state.parameterUpdates || {});
      setPathUpdates(state.pathUpdates || []);
      
      // Notify parameter callback
      if (animationCallbackRef.current && state.parameterUpdates) {
        animationCallbackRef.current(state.parameterUpdates);
      }
    });

    return unsubscribe;
  }, []);

  // Animation update loop
  useFrame((state, deltaTime) => {
    const animationUpdate = animationEngine.update(deltaTime);
    
    if (animationUpdate && animationUpdate.pathUpdates) {
      // Process path updates with curve engine
      const processedPaths = animationUpdate.pathUpdates.map((pathUpdate: any) => {
        const curveSample = curveEngine.sampleCurve(pathUpdate.curveName, animationUpdate.progress);
        return {
          ...pathUpdate,
          position: curveSample?.position || new THREE.Vector3(),
          rotation: curveSample?.rotation || new THREE.Quaternion()
        };
      });
      
      setPathUpdates(processedPaths);
    }
  });

  // Animation control functions
  const play = () => animationEngine.play();
  const pause = () => animationEngine.pause();
  const stop = () => animationEngine.stop();
  const setSpeed = (speed: number) => animationEngine.setSpeed(speed);

  // Create animation clip
  const createClip = (spec: AnimationClipSpec) => {
    animationEngine.createClip(spec);
    console.log(`🎬 Animation clip created: ${spec.name}`);
  };

  // Set active clip
  const setActiveClip = (name: string) => {
    const success = animationEngine.setActiveClip(name);
    if (success) {
      setAnimationState(prev => ({ ...prev, activeClip: name }));
    }
    return success;
  };

  // Helper to create parameter keyframes
  const createParameterAnimation = (
    parameter: string,
    keyframes: Array<{ time: number; value: number; easing?: string }>
  ): ParamTrack => {
    const animKeyframes = keyframes.map(kf => 
      animationEngine.createKeyframe(kf.time, kf.value, kf.easing as any)
    );
    
    return animationEngine.createParameterTrack(
      `param-${parameter}-${Date.now()}`,
      parameter,
      animKeyframes
    );
  };

  // Helper to create path animation
  const createPathAnimation = (
    curveName: string,
    duration: number,
    loop: boolean = true
  ): PathTrack => {
    return animationEngine.createPathTrack(
      `path-${curveName}-${Date.now()}`,
      curveName,
      duration,
      loop
    );
  };

  // Quick animation presets
  const createWaveAnimation = (duration: number = 4) => {
    const clip: AnimationClipSpec = {
      name: 'wave-morph',
      duration,
      fps: 30,
      loop: true,
      paramTracks: [
        createParameterAnimation('a', [
          { time: 0, value: 1 },
          { time: duration / 2, value: 3 },
          { time: duration, value: 1 }
        ]),
        createParameterAnimation('f', [
          { time: 0, value: 0 },
          { time: duration, value: 2 * Math.PI }
        ])
      ],
      pathTracks: []
    };
    
    createClip(clip);
    return clip.name;
  };

  const createHelixMotion = (duration: number = 6) => {
    const clip: AnimationClipSpec = {
      name: 'helix-motion',
      duration,
      fps: 30,
      loop: true,
      paramTracks: [],
      pathTracks: [
        createPathAnimation('helix', duration, true)
      ]
    };
    
    createClip(clip);
    return clip.name;
  };

  const createGoldenRatioMorph = (duration: number = 8) => {
    const phi = 1.618033988749;
    const clip: AnimationClipSpec = {
      name: 'golden-ratio-morph',
      duration,
      fps: 30,
      loop: true,
      paramTracks: [
        createParameterAnimation('a', [
          { time: 0, value: 1 },
          { time: duration / 4, value: phi },
          { time: duration / 2, value: phi * phi },
          { time: 3 * duration / 4, value: phi },
          { time: duration, value: 1 }
        ]),
        createParameterAnimation('b', [
          { time: 0, value: 1 },
          { time: duration / 3, value: Math.PI },
          { time: 2 * duration / 3, value: phi * Math.PI },
          { time: duration, value: 1 }
        ])
      ],
      pathTracks: []
    };
    
    createClip(clip);
    return clip.name;
  };

  // Register parameter update callback
  const onParameterUpdate = (callback: (updates: Record<string, number>) => void) => {
    animationCallbackRef.current = callback;
  };

  // Get available curves
  const getAvailableCurves = () => curveEngine.getCurveNames();

  // Get available clips
  const getAvailableClips = () => animationEngine.getClips();

  return {
    // State
    animationState,
    parameterUpdates,
    pathUpdates,
    
    // Controls
    play,
    pause,
    stop,
    setSpeed,
    
    // Clip management
    createClip,
    setActiveClip,
    
    // Helpers
    createParameterAnimation,
    createPathAnimation,
    createWaveAnimation,
    createHelixMotion,
    createGoldenRatioMorph,
    
    // Data
    getAvailableCurves,
    getAvailableClips,
    
    // Callbacks
    onParameterUpdate
  };
}

// Hook specifically for animated objects
export function useAnimatedObject(meshRef: React.RefObject<THREE.Object3D>) {
  const { pathUpdates } = useAnimation();

  useEffect(() => {
    if (meshRef.current && pathUpdates.length > 0) {
      const pathUpdate = pathUpdates[0]; // Use first path for now
      if (pathUpdate.position && pathUpdate.rotation) {
        meshRef.current.position.copy(pathUpdate.position);
        meshRef.current.quaternion.copy(pathUpdate.rotation);
      }
    }
  }, [pathUpdates, meshRef]);
}