import { useRef, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';

/**
 * GSAP Animation Hook for React Three Fiber
 * Industry-standard animation system with timeline control
 * 
 * Based on best practices from:
 * - https://gsap.com/community/forums/topic/29721-threejs-and-gsap/
 * - https://tympanus.net/codrops/2023/04/27/building-a-webgl-carousel-with-react-three-fiber-and-gsap/
 */

export type AnimationPreset = 'pulse' | 'wave' | 'morph' | 'rotate' | 'spiral' | 'breathe' | 'none';

export interface GSAPAnimationOptions {
  preset?: AnimationPreset;
  duration?: number;
  ease?: string;
  loop?: boolean;
  yoyo?: boolean;
  autoPlay?: boolean;
}

/**
 * Use GSAP for mesh animations (rotation, position, scale)
 */
export function useGSAPMeshAnimation(
  meshRef: React.RefObject<THREE.Mesh | THREE.Group>,
  options: GSAPAnimationOptions = {}
) {
  const {
    preset = 'none',
    duration = 3,
    ease = 'power2.inOut',
    loop = true,
    yoyo = true,
    autoPlay = false
  } = options;

  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    if (!meshRef.current || preset === 'none') return;

    // Clean up previous timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // Create new timeline
    const tl = gsap.timeline({
      repeat: loop ? -1 : 0,
      yoyo: yoyo,
      paused: !autoPlay
    });

    timelineRef.current = tl;

    // Apply animation preset
    switch (preset) {
      case 'rotate':
        tl.to(meshRef.current.rotation, {
          y: Math.PI * 2,
          duration: duration,
          ease: 'none'
        });
        break;

      case 'pulse':
        tl.to(meshRef.current.scale, {
          x: 1.3,
          y: 1.3,
          z: 1.3,
          duration: duration / 2,
          ease: ease
        }).to(meshRef.current.scale, {
          x: 1.0,
          y: 1.0,
          z: 1.0,
          duration: duration / 2,
          ease: ease
        });
        break;

      case 'breathe':
        tl.to(meshRef.current.scale, {
          x: 1.15,
          y: 1.15,
          z: 1.15,
          duration: duration,
          ease: 'sine.inOut'
        });
        break;

      case 'spiral':
        tl.to(meshRef.current.rotation, {
          y: Math.PI * 2,
          duration: duration,
          ease: 'none'
        }, 0).to(meshRef.current.position, {
          y: '+=2',
          duration: duration,
          ease: ease
        }, 0).to(meshRef.current.position, {
          y: '-=2',
          duration: duration,
          ease: ease
        });
        break;

      case 'wave':
        tl.to(meshRef.current.rotation, {
          x: Math.PI * 0.3,
          duration: duration / 2,
          ease: ease
        }).to(meshRef.current.rotation, {
          x: 0,
          duration: duration / 2,
          ease: ease
        });
        break;

      case 'morph':
        // For morph, we'll animate scale in different axes
        tl.to(meshRef.current.scale, {
          x: 1.4,
          duration: duration / 3,
          ease: ease
        }).to(meshRef.current.scale, {
          y: 1.4,
          x: 1.0,
          duration: duration / 3,
          ease: ease
        }).to(meshRef.current.scale, {
          z: 1.4,
          y: 1.0,
          duration: duration / 3,
          ease: ease
        }).to(meshRef.current.scale, {
          x: 1.0,
          y: 1.0,
          z: 1.0,
          duration: duration / 3,
          ease: ease
        });
        break;
    }

    // Cleanup on unmount
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [meshRef, preset, duration, ease, loop, yoyo, autoPlay]);

  return {
    timeline: timelineRef.current,
    play: () => timelineRef.current?.play(),
    pause: () => timelineRef.current?.pause(),
    restart: () => timelineRef.current?.restart(),
    reverse: () => timelineRef.current?.reverse(),
    seek: (time: number) => timelineRef.current?.seek(time),
    progress: (value?: number) => value !== undefined ? timelineRef.current?.progress(value) : timelineRef.current?.progress()
  };
}

/**
 * Use GSAP for shader uniform animations (GPU-accelerated)
 * This is the recommended approach for parametric surface animations
 */
export function useGSAPShaderAnimation(
  uniformsRef: React.RefObject<{ [uniform: string]: THREE.IUniform }>,
  options: GSAPAnimationOptions = {}
) {
  const {
    preset = 'none',
    duration = 3,
    ease = 'power2.inOut',
    loop = true,
    yoyo = true,
    autoPlay = false
  } = options;

  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    if (!uniformsRef.current || preset === 'none') return;

    // Clean up previous timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // Create new timeline
    const tl = gsap.timeline({
      repeat: loop ? -1 : 0,
      yoyo: yoyo,
      paused: !autoPlay
    });

    timelineRef.current = tl;

    // Animate shader uniforms based on preset
    const uniforms = uniformsRef.current;

    switch (preset) {
      case 'wave':
        if (uniforms.uTime) {
          tl.to(uniforms.uTime, {
            value: uniforms.uTime.value + 10.0,
            duration: duration,
            ease: 'none'
          });
        }
        if (uniforms.uAmplitude) {
          tl.to(uniforms.uAmplitude, {
            value: 2.0,
            duration: duration / 2,
            ease: ease
          }, 0).to(uniforms.uAmplitude, {
            value: 1.0,
            duration: duration / 2,
            ease: ease
          });
        }
        break;

      case 'pulse':
        if (uniforms.uScale) {
          tl.to(uniforms.uScale, {
            value: 1.5,
            duration: duration / 2,
            ease: ease
          }).to(uniforms.uScale, {
            value: 1.0,
            duration: duration / 2,
            ease: ease
          });
        }
        break;

      case 'morph':
        if (uniforms.uMorphProgress) {
          tl.to(uniforms.uMorphProgress, {
            value: 1.0,
            duration: duration,
            ease: ease
          });
        }
        break;

      case 'spiral':
        if (uniforms.uTwist) {
          tl.to(uniforms.uTwist, {
            value: Math.PI * 2,
            duration: duration,
            ease: 'none'
          });
        }
        break;

      case 'breathe':
        if (uniforms.uInflation) {
          tl.to(uniforms.uInflation, {
            value: 1.3,
            duration: duration,
            ease: 'sine.inOut'
          });
        }
        break;
    }

    // Cleanup on unmount
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [uniformsRef, preset, duration, ease, loop, yoyo, autoPlay]);

  return {
    timeline: timelineRef.current,
    play: () => timelineRef.current?.play(),
    pause: () => timelineRef.current?.pause(),
    restart: () => timelineRef.current?.restart(),
    reverse: () => timelineRef.current?.reverse(),
    seek: (time: number) => timelineRef.current?.seek(time),
    progress: (value?: number) => value !== undefined ? timelineRef.current?.progress(value) : timelineRef.current?.progress()
  };
}

/**
 * Combined animation hook for both mesh and shader animations
 */
export function useGSAPAnimation(
  meshRef: React.RefObject<THREE.Mesh | THREE.Group>,
  options: GSAPAnimationOptions = {}
) {
  const meshAnimation = useGSAPMeshAnimation(meshRef, options);
  
  return {
    ...meshAnimation,
    // Helper to create custom timelines
    createTimeline: (config?: gsap.TimelineVars) => {
      return gsap.timeline(config);
    },
    // Helper to animate any object
    to: (target: any, vars: gsap.TweenVars) => {
      return gsap.to(target, vars);
    },
    from: (target: any, vars: gsap.TweenVars) => {
      return gsap.from(target, vars);
    }
  };
}
