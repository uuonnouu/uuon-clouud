/**
 * UNIFIED ANIMATION SYSTEM
 * Consolidates all animation engines into one simple, reliable system
 * © 2025 UUON Foundation Inc.
 */

import * as THREE from 'three';

export type AnimationPreset = 'off' | 'rotate' | 'pulse' | 'wave' | 'breathe' | 'spiral';

export interface AnimationState {
  preset: AnimationPreset;
  speed: number; // 0.1 to 2.0
  time: number;
}

/**
 * Apply animation to a mesh based on preset
 * Called from useFrame in ParametricSurface
 */
export function applyAnimation(
  mesh: THREE.Mesh | THREE.Group,
  preset: AnimationPreset,
  time: number,
  speed: number = 1.0
): void {
  if (preset === 'off' || !mesh) return;

  const t = time * speed;

  switch (preset) {
    case 'rotate':
      // Simple Y-axis rotation
      mesh.rotation.y = t * 0.5;
      break;

    case 'pulse':
      // Scale pulsing
      const pulseScale = 1 + Math.sin(t * 2) * 0.15;
      mesh.scale.set(pulseScale, pulseScale, pulseScale);
      break;

    case 'wave':
      // Gentle wave motion
      mesh.rotation.x = Math.sin(t * 0.8) * 0.2;
      mesh.rotation.z = Math.cos(t * 0.6) * 0.2;
      break;

    case 'breathe':
      // Breathing scale effect
      const breatheScale = 1 + Math.sin(t) * 0.1;
      mesh.scale.set(breatheScale, breatheScale, breatheScale);
      break;

    case 'spiral':
      // Rotation + vertical movement
      mesh.rotation.y = t * 0.8;
      mesh.position.y = Math.sin(t * 0.5) * 0.3;
      break;

    default:
      break;
  }
}

/**
 * Reset mesh transformations when animation is turned off
 */
export function resetAnimation(mesh: THREE.Mesh | THREE.Group): void {
  if (!mesh) return;
  
  mesh.rotation.set(0, 0, 0);
  mesh.scale.set(1, 1, 1);
  mesh.position.set(0, 0, 0);
}

/**
 * Get recommended animation preset for a shape type
 */
export function getRecommendedAnimation(shapeType: string): AnimationPreset {
  const lowerType = shapeType.toLowerCase();

  // Biological/organic shapes
  if (lowerType.includes('cell') || lowerType.includes('bacteria') || 
      lowerType.includes('virus') || lowerType.includes('mitochondria')) {
    return 'breathe';
  }

  // Quantum/physics shapes
  if (lowerType.includes('quantum') || lowerType.includes('orbital') ||
      lowerType.includes('wave') || lowerType.includes('entanglement')) {
    return 'wave';
  }

  // Geometric/mathematical shapes
  if (lowerType.includes('spiral') || lowerType.includes('helix') ||
      lowerType.includes('dna') || lowerType.includes('fibonacci')) {
    return 'spiral';
  }

  // Crystalline/diamond shapes
  if (lowerType.includes('diamond') || lowerType.includes('crystal') ||
      lowerType.includes('lattice')) {
    return 'rotate';
  }

  // Default: gentle rotation
  return 'rotate';
}
