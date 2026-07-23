import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { AnimationRecorder } from './animationRecorder';
import { LightingBaker, BakingOptions } from './lightingBaker';
import { LightingSettings } from '../stores/lightingStore';

export interface MathExportOptions {
  format: 'gltf' | 'glb';
  animations?: THREE.AnimationClip[];
  binary?: boolean;
  bakeLighting?: boolean;
  lightingSettings?: LightingSettings;
  bakingOptions?: Partial<BakingOptions>;
}

/**
 * Recursively filter and clone object hierarchy, preserving UUIDs for animation binding
 */
function cloneObjectHierarchy(object: THREE.Object3D, uuidMap: Map<string, string>): THREE.Object3D | null {
  // Skip ambient lights (not supported by GLTF)
  if (object instanceof THREE.AmbientLight) {
    return null;
  }
  
  // Skip particle systems that cause artifacts
  if (object instanceof THREE.Points) {
    return null;
  }
  
  // Skip fog
  if (object.type === 'Fog' || object.type === 'FogExp2') {
    return null;
  }
  
  // Clone the object
  const originalUUID = object.uuid;
  const cloned = object.clone(false); // Don't clone children yet
  const newUUID = cloned.uuid;
  
  // Map original UUID to new UUID for animation track remapping
  uuidMap.set(originalUUID, newUUID);
  
  // If object doesn't have a name, give it one based on original UUID for animation binding
  if (!object.name) {
    cloned.name = originalUUID;
  }
  
  // Recursively clone and filter children
  object.children.forEach((child) => {
    const clonedChild = cloneObjectHierarchy(child, uuidMap);
    if (clonedChild) {
      cloned.add(clonedChild);
    }
  });
  
  return cloned;
}

/**
 * Remap animation track paths from old UUIDs to new UUIDs/names
 */
function remapAnimationTracks(clips: THREE.AnimationClip[], uuidMap: Map<string, string>): THREE.AnimationClip[] {
  return clips.map(clip => {
    const newTracks = clip.tracks.map(track => {
      const parts = track.name.split('.');
      const objectId = parts[0];
      const property = parts[1];
      
      // The objectId in the track is the original UUID from the source scene
      // We stored it as the name in the cloned object (in cloneObjectHierarchy)
      // So we keep the track name unchanged - it will match the cloned object's name
      const newName = `${objectId}.${property}`;
      
      return new (track.constructor as any)(newName, track.times, track.values);
    });
    
    return new THREE.AnimationClip(clip.name, clip.duration, newTracks);
  });
}

/**
 * Clean scene for export - remove background artifacts and non-model elements
 * Preserves hierarchy, parent transforms, and animation bindings
 */
function createCleanSceneForExport(originalScene: THREE.Scene, animations?: THREE.AnimationClip[]): {
  scene: THREE.Scene;
  animations?: THREE.AnimationClip[];
} {
  const cleanScene = new THREE.Scene();
  const uuidMap = new Map<string, string>();
  
  // Clone top-level objects while preserving hierarchy and tracking UUIDs
  originalScene.children.forEach((child) => {
    const clonedChild = cloneObjectHierarchy(child, uuidMap);
    if (clonedChild) {
      cleanScene.add(clonedChild);
    }
  });
  
  console.log('🧹 Clean scene created:', {
    originalObjects: originalScene.children.length,
    cleanedObjects: cleanScene.children.length,
    animationClips: animations?.length || 0
  });
  
  // Remap animations if provided
  const remappedAnimations = animations ? remapAnimationTracks(animations, uuidMap) : undefined;
  
  return {
    scene: cleanScene,
    animations: remappedAnimations
  };
}

/**
 * Export the current mathematical visualization scene to GLTF/GLB with animations
 */
export async function exportMathScene(
  scene: THREE.Scene,
  shapeName: string,
  options: MathExportOptions = { format: 'glb', binary: true },
  format: 'gltf' | 'glb' = 'glb'
): Promise<void> {
  // Override format from options if explicitly provided
  const exportFormat = options.format || format;
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter();
    
    console.log('🎬 Exporting mathematical shape:', shapeName);
    console.log('📊 Animation clips:', options.animations?.length || 0);
    console.log('🔆 Bake lighting:', options.bakeLighting ? 'YES' : 'NO');
    
    // Create clean scene without background artifacts and remap animations
    let { scene: cleanScene, animations: cleanedAnimations } = createCleanSceneForExport(scene, options.animations);
    
    // Apply lighting baking if enabled
    if (options.bakeLighting && options.lightingSettings) {
      console.log('🔆 Baking lighting into mesh...');
      cleanScene = LightingBaker.bakeSceneForExport(
        cleanScene,
        options.lightingSettings,
        options.bakingOptions
      );
      console.log('✅ Lighting baked successfully');
    }
    
    const exportOptions: any = {
      binary: exportFormat === 'glb',
      onlyVisible: true,
      truncateDrawRange: false,
      embedImages: true,
      maxTextureSize: 4096,
    };

    // Include animations if provided
    if (cleanedAnimations && cleanedAnimations.length > 0) {
      exportOptions.animations = cleanedAnimations;
      console.log('✅ Including', cleanedAnimations.length, 'remapped animations in export');
    }

    exporter.parse(
      cleanScene,
      (result) => {
        try {
          let blob: Blob;
          let filename: string;

          if (exportFormat === 'glb') {
            blob = new Blob([result as ArrayBuffer], { type: 'model/gltf-binary' });
            filename = `${shapeName}.glb`;
          } else {
            const output = JSON.stringify(result, null, 2);
            blob = new Blob([output], { type: 'application/json' });
            filename = `${shapeName}.gltf`;
          }

          // Download the file
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          link.click();
          URL.revokeObjectURL(url);

          console.log('✅ Export successful:', filename);
          if (cleanedAnimations && cleanedAnimations.length > 0) {
            console.log('🎬 Animations included:', cleanedAnimations.length);
          }

          resolve();
        } catch (error) {
          console.error('Export error:', error);
          reject(error);
        }
      },
      (error) => {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('GLTF parsing error:', errorMessage, error);
        reject(new Error(`GLTF export failed: ${errorMessage}`));
      },
      exportOptions
    );
  });
}

export interface AnimatedExportOptions {
  format?: 'gltf' | 'glb';
  bakeLighting?: boolean;
  lightingSettings?: LightingSettings;
  bakingOptions?: Partial<BakingOptions>;
}

/**
 * Record and export scene with actual AnimationClips for playback in external viewers
 * Uses the same transform-based recording as Atom View
 */
export async function exportAnimatedMath(
  scene: THREE.Scene,
  shapeName: string,
  duration: number = 10,
  fps: number = 30,
  onProgress?: (progress: number) => void,
  format: 'gltf' | 'glb' = 'glb',
  options?: AnimatedExportOptions
): Promise<void> {
  console.log('🎬 Recording animated math export:', { shapeName, duration, fps, format });
  console.log('🔆 Bake lighting:', options?.bakeLighting ? 'YES' : 'NO');
  
  return new Promise((resolve, reject) => {
    const recorder = new AnimationRecorder(scene, duration, fps);
    recorder.startRecording();

    const frameDuration = 1000 / fps;
    let frameInterval: number;

    frameInterval = window.setInterval(() => {
      recorder.captureFrame();
      
      if (onProgress) {
        onProgress(recorder.getProgress());
      }

      if (recorder.isComplete()) {
        window.clearInterval(frameInterval);
        
        const clips = recorder.generateAnimationClips();
        
        exportMathScene(scene, `${shapeName}_animated`, {
          format: format,
          animations: clips,
          binary: format === 'glb',
          bakeLighting: options?.bakeLighting,
          lightingSettings: options?.lightingSettings,
          bakingOptions: options?.bakingOptions
        }, format)
          .then(() => {
            recorder.clear();
            console.log('✅ Animated export complete with looping animations');
            if (options?.bakeLighting) {
              console.log('🔆 Lighting baked into export');
            }
            resolve();
          })
          .catch((error) => {
            recorder.clear();
            reject(error);
          });
      }
    }, frameDuration);
  });
}

/**
 * Export static snapshot (non-animated)
 */
export async function exportStaticMath(
  scene: THREE.Scene,
  shapeName: string
): Promise<void> {
  return exportMathScene(scene, shapeName, {
    format: 'glb',
    binary: true
  });
}
