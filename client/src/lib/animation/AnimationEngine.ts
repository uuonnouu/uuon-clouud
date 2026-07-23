import * as THREE from 'three';

// Animation track types for mathematical surfaces
export enum TrackType {
  PARAMETER = 'parameter',    // Animates a-f parameters
  PATH = 'path',             // Animates object position along curve
  CUSTOM = 'custom'          // Custom animation track
}

// Easing functions for smooth animations
export enum EasingType {
  LINEAR = 'linear',
  EASE_IN = 'easeIn',
  EASE_OUT = 'easeOut',
  EASE_IN_OUT = 'easeInOut',
  BOUNCE = 'bounce',
  ELASTIC = 'elastic'
}

// Keyframe definition for parameter animation
export interface Keyframe {
  time: number;              // Time in seconds
  value: number;             // Parameter value
  easing?: EasingType;       // Easing to next keyframe
}

// Parameter track for animating a-f parameters
export interface ParamTrack {
  type: TrackType.PARAMETER;
  id: string;
  parameter: string;         // 'a', 'b', 'c', 'd', 'e', 'f'
  keyframes: Keyframe[];
  enabled: boolean;
}

// Path track for curve-based motion
export interface PathTrack {
  type: TrackType.PATH;
  id: string;
  curveName: string;         // Reference to curve in CurveEngine
  duration: number;          // Animation duration
  loop: boolean;
  enabled: boolean;
}

// Animation clip specification
export interface AnimationClipSpec {
  name: string;
  duration: number;          // Total duration in seconds
  fps: number;               // Frames per second
  loop: boolean;
  paramTracks: ParamTrack[];
  pathTracks: PathTrack[];
}

// Timeline state
export interface TimelineState {
  currentTime: number;
  isPlaying: boolean;
  speed: number;
  loop: boolean;
}

// Animation Engine for mathematical surfaces
export class AnimationEngine {
  private clips: Map<string, AnimationClipSpec> = new Map();
  private activeClip: string | null = null;
  private timeline: TimelineState = {
    currentTime: 0,
    isPlaying: false,
    speed: 1.0,
    loop: true
  };
  private subscribers: Set<(state: any) => void> = new Set();

  // Easing function implementations
  private easingFunctions = {
    [EasingType.LINEAR]: (t: number) => t,
    [EasingType.EASE_IN]: (t: number) => t * t,
    [EasingType.EASE_OUT]: (t: number) => 1 - (1 - t) * (1 - t),
    [EasingType.EASE_IN_OUT]: (t: number) => t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t),
    [EasingType.BOUNCE]: (t: number) => {
      if (t < 1/2.75) return 7.5625 * t * t;
      if (t < 2/2.75) return 7.5625 * (t -= 1.5/2.75) * t + 0.75;
      if (t < 2.5/2.75) return 7.5625 * (t -= 2.25/2.75) * t + 0.9375;
      return 7.5625 * (t -= 2.625/2.75) * t + 0.984375;
    },
    [EasingType.ELASTIC]: (t: number) => {
      if (t === 0 || t === 1) return t;
      const p = 0.3;
      const s = p / 4;
      return Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1;
    }
  };

  // Create new animation clip
  createClip(spec: AnimationClipSpec): void {
    this.clips.set(spec.name, { ...spec });
    console.log(`🎬 Animation clip created: ${spec.name} (${spec.duration}s)`);
  }

  // Set active animation clip
  setActiveClip(name: string): boolean {
    if (this.clips.has(name)) {
      this.activeClip = name;
      this.timeline.currentTime = 0;
      console.log(`🎬 Active clip set: ${name}`);
      return true;
    }
    return false;
  }

  // Start animation playback
  play(): void {
    if (this.activeClip) {
      this.timeline.isPlaying = true;
      console.log('▶️ Animation playback started');
    }
  }

  // Pause animation playback
  pause(): void {
    this.timeline.isPlaying = false;
    console.log('⏸️ Animation playback paused');
  }

  // Stop and reset animation
  stop(): void {
    this.timeline.isPlaying = false;
    this.timeline.currentTime = 0;
    console.log('⏹️ Animation playback stopped');
  }

  // Set playback speed
  setSpeed(speed: number): void {
    this.timeline.speed = Math.max(0.1, Math.min(5.0, speed));
  }

  // Update animation timeline (call from useFrame)
  update(deltaTime: number): any {
    if (!this.timeline.isPlaying || !this.activeClip) {
      return null;
    }

    const clip = this.clips.get(this.activeClip)!;
    
    // Update timeline
    this.timeline.currentTime += deltaTime * this.timeline.speed;
    
    // Handle looping
    if (this.timeline.currentTime >= clip.duration) {
      if (this.timeline.loop || clip.loop) {
        this.timeline.currentTime = this.timeline.currentTime % clip.duration;
      } else {
        this.timeline.currentTime = clip.duration;
        this.timeline.isPlaying = false;
      }
    }

    // Sample all parameter tracks
    const parameterUpdates: Record<string, number> = {};
    for (const track of clip.paramTracks) {
      if (track.enabled) {
        parameterUpdates[track.parameter] = this.sampleParameterTrack(track, this.timeline.currentTime);
      }
    }

    // Add time parameter for equations that use it
    parameterUpdates.t = this.timeline.currentTime;

    // Sample path tracks (if any)
    const pathUpdates: Array<{ curveName: string; position: THREE.Vector3; rotation: THREE.Quaternion }> = [];
    for (const track of clip.pathTracks) {
      if (track.enabled) {
        const t = this.timeline.currentTime / track.duration;
        const normalizedTime = track.loop ? t % 1 : Math.min(t, 1);
        pathUpdates.push({
          curveName: track.curveName,
          position: new THREE.Vector3(), // Will be filled by CurveEngine
          rotation: new THREE.Quaternion()
        });
      }
    }

    const state = {
      time: this.timeline.currentTime,
      isPlaying: this.timeline.isPlaying,
      parameterUpdates,
      pathUpdates,
      progress: this.timeline.currentTime / clip.duration
    };

    // Notify subscribers
    this.subscribers.forEach(callback => callback(state));
    
    return state;
  }

  // Sample parameter track at given time
  private sampleParameterTrack(track: ParamTrack, time: number): number {
    const keyframes = track.keyframes.sort((a, b) => a.time - b.time);
    
    if (keyframes.length === 0) return 0;
    if (keyframes.length === 1) return keyframes[0].value;
    if (time <= keyframes[0].time) return keyframes[0].value;
    if (time >= keyframes[keyframes.length - 1].time) return keyframes[keyframes.length - 1].value;

    // Find surrounding keyframes
    for (let i = 0; i < keyframes.length - 1; i++) {
      const current = keyframes[i];
      const next = keyframes[i + 1];
      
      if (time >= current.time && time <= next.time) {
        const duration = next.time - current.time;
        const t = (time - current.time) / duration;
        
        // Apply easing
        const easing = current.easing || EasingType.LINEAR;
        const easedT = this.easingFunctions[easing](t);
        
        // Linear interpolation
        return current.value + (next.value - current.value) * easedT;
      }
    }

    return keyframes[keyframes.length - 1].value;
  }

  // Subscribe to animation updates
  subscribe(callback: (state: any) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  // Get current timeline state
  getTimeline(): TimelineState {
    return { ...this.timeline };
  }

  // Get all clips
  getClips(): AnimationClipSpec[] {
    return Array.from(this.clips.values());
  }

  // Get active clip
  getActiveClip(): AnimationClipSpec | null {
    return this.activeClip ? this.clips.get(this.activeClip) || null : null;
  }

  // Create keyframe for parameter
  createKeyframe(time: number, value: number, easing: EasingType = EasingType.LINEAR): Keyframe {
    return { time, value, easing };
  }

  // Helper to create parameter track
  createParameterTrack(id: string, parameter: string, keyframes: Keyframe[]): ParamTrack {
    return {
      type: TrackType.PARAMETER,
      id,
      parameter,
      keyframes: [...keyframes],
      enabled: true
    };
  }

  // Helper to create path track
  createPathTrack(id: string, curveName: string, duration: number, loop: boolean = true): PathTrack {
    return {
      type: TrackType.PATH,
      id,
      curveName,
      duration,
      loop,
      enabled: true
    };
  }
}

// Global animation engine instance
export const animationEngine = new AnimationEngine();