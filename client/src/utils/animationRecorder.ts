import * as THREE from 'three';

/**
 * Records object transformations over time and creates AnimationClips
 * for export to GLB/GLTF files that play in external viewers.
 *
 * Uses flat Float32Arrays instead of cloned Vector3/Quaternion objects
 * to avoid per-frame heap allocation pressure during long recordings.
 */
export class AnimationRecorder {
  private scene: THREE.Scene;
  private duration: number;
  private fps: number;
  private recordings: Map<string, {
    positions: number[];
    rotations: number[];
    scales: number[];
  }>;
  private startTime: number = 0;
  private frameCount: number = 0;

  constructor(scene: THREE.Scene, duration: number = 5, fps: number = 30) {
    this.scene = scene;
    this.duration = duration;
    this.fps = fps;
    this.recordings = new Map();
  }

  startRecording() {
    this.recordings.clear();
    this.startTime = performance.now();
    this.frameCount = 0;

    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Group || object instanceof THREE.Points) {
        this.recordings.set(object.uuid, {
          positions: [],
          rotations: [],
          scales: [],
        });
      }
    });

    console.log(`📹 Recording started: ${this.recordings.size} objects tracked`);
  }

  captureFrame() {
    this.frameCount++;

    this.scene.traverse((object) => {
      const rec = this.recordings.get(object.uuid);
      if (!rec) return;

      const p = object.position;
      rec.positions.push(p.x, p.y, p.z);

      const q = object.quaternion;
      rec.rotations.push(q.x, q.y, q.z, q.w);

      const s = object.scale;
      rec.scales.push(s.x, s.y, s.z);
    });
  }

  isComplete(): boolean {
    return this.frameCount >= Math.floor(this.duration * this.fps);
  }

  getProgress(): number {
    const target = Math.floor(this.duration * this.fps);
    return target > 0 ? Math.min(this.frameCount / target, 1) : 1;
  }

  generateAnimationClips(): THREE.AnimationClip[] {
    const clips: THREE.AnimationClip[] = [];
    const frameDuration = 1 / this.fps;

    this.scene.traverse((object) => {
      const rec = this.recordings.get(object.uuid);
      if (!rec || rec.positions.length === 0) return;

      const frameCount = rec.positions.length / 3;
      const times = Float32Array.from({ length: frameCount }, (_, i) => i * frameDuration);

      const tracks: THREE.KeyframeTrack[] = [];
      const name = object.name || object.uuid;

      if (this.hasPositionChange(rec.positions)) {
        tracks.push(new THREE.VectorKeyframeTrack(
          `${name}.position`,
          times,
          new Float32Array(rec.positions)
        ));
      }

      const rotFrames = rec.rotations.length / 4;
      const rotTimes = Float32Array.from({ length: rotFrames }, (_, i) => i * frameDuration);
      if (this.hasRotationChange(rec.rotations)) {
        tracks.push(new THREE.QuaternionKeyframeTrack(
          `${name}.quaternion`,
          rotTimes,
          new Float32Array(rec.rotations)
        ));
      }

      if (this.hasScaleChange(rec.scales)) {
        tracks.push(new THREE.VectorKeyframeTrack(
          `${name}.scale`,
          times,
          new Float32Array(rec.scales)
        ));
      }

      if (tracks.length > 0) {
        clips.push(new THREE.AnimationClip(
          `${object.name || 'Object'}_Animation`,
          this.duration,
          tracks
        ));
      }
    });

    console.log(`🎬 Generated ${clips.length} animation clips`);
    return clips;
  }

  private hasPositionChange(flat: number[]): boolean {
    if (flat.length < 6) return false;
    const [x0, y0, z0] = flat;
    const t = 0.001;
    for (let i = 3; i < flat.length; i += 3) {
      if (Math.abs(flat[i] - x0) > t || Math.abs(flat[i + 1] - y0) > t || Math.abs(flat[i + 2] - z0) > t) return true;
    }
    return false;
  }

  private hasRotationChange(flat: number[]): boolean {
    if (flat.length < 8) return false;
    const [x0, y0, z0, w0] = flat;
    const t = 0.001;
    for (let i = 4; i < flat.length; i += 4) {
      if (Math.abs(flat[i] - x0) > t || Math.abs(flat[i + 1] - y0) > t ||
          Math.abs(flat[i + 2] - z0) > t || Math.abs(flat[i + 3] - w0) > t) return true;
    }
    return false;
  }

  private hasScaleChange(flat: number[]): boolean {
    if (flat.length < 6) return false;
    const [x0, y0, z0] = flat;
    const t = 0.001;
    for (let i = 3; i < flat.length; i += 3) {
      if (Math.abs(flat[i] - x0) > t || Math.abs(flat[i + 1] - y0) > t || Math.abs(flat[i + 2] - z0) > t) return true;
    }
    return false;
  }

  clear() {
    this.recordings.clear();
    this.frameCount = 0;
  }
}
