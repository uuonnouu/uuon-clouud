
/**
 * G MOD 6 FRONTEND INTEGRATION FOUNDATION
 * 
 * Provides the foundation for frontend implementation of G Mod 6 engine
 * Handles state management, parameter enhancement, and visual integration
 */

import { SurfaceParameters } from '../types/math';
import { gmod6Engine, gmod6Animator, GMod6Config } from './uuon-gmod6-engine';
import * as THREE from 'three';

export interface GMod6FrontendState {
  currentG: number;
  activeState: number;
  interpolationFactor: number;
  animationTime: number;
  isAnimating: boolean;
  config: GMod6Config;
}

export class GMod6FrontendIntegration {
  private state: GMod6FrontendState;
  private listeners: Set<(state: GMod6FrontendState) => void>;
  private animationFrame: number | null;

  constructor() {
    this.state = {
      currentG: 0,
      activeState: 0,
      interpolationFactor: 0,
      animationTime: 0,
      isAnimating: false,
      config: {
        cycleSpeed: 1,
        amplitudeFactor: 0.5,
        phaseOffset: 0,
        enableHexGeometry: true,
        enableColorCycling: true,
        enableRotationalSymmetry: true
      }
    };
    this.listeners = new Set();
    this.animationFrame = null;
  }

  /**
   * Register state change listener
   */
  onStateChange(listener: (state: GMod6FrontendState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Update G value and notify listeners
   */
  updateG(g: number): void {
    this.state.currentG = g;
    this.state.activeState = Math.floor(g) % 6;
    this.state.interpolationFactor = g - Math.floor(g);
    this.notifyListeners();
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<GMod6Config>): void {
    this.state.config = { ...this.state.config, ...config };
    this.notifyListeners();
  }

  /**
   * Start animation loop
   */
  startAnimation(): void {
    if (this.state.isAnimating) return;
    
    this.state.isAnimating = true;
    this.animate();
    this.notifyListeners();
  }

  /**
   * Stop animation loop
   */
  stopAnimation(): void {
    this.state.isAnimating = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.notifyListeners();
  }

  /**
   * Get enhanced parameters for current state
   */
  getEnhancedParameters(baseParams: SurfaceParameters): SurfaceParameters {
    return gmod6Engine.enhanceParametersWithGMod6(baseParams, this.state.config);
  }

  /**
   * Get current state information
   */
  getCurrentStateInfo() {
    const state = gmod6Engine.getCurrentState(this.state.currentG);
    const interpolated = gmod6Engine.getInterpolatedState(this.state.currentG);
    
    return {
      state,
      interpolated,
      frontendState: this.state
    };
  }

  /**
   * Get state visualization data for UI components
   */
  getStateVisualizationData() {
    const states = [];
    for (let i = 0; i < 6; i++) {
      const isActive = this.state.activeState === i;
      const state = gmod6Engine.getCurrentState(i);
      
      states.push({
        id: i,
        isActive,
        color: `hsl(${i * 60}, ${isActive ? 80 : 40}%, ${isActive ? 60 : 40}%)`,
        phase: state.phase,
        name: state.name
      });
    }
    
    return states;
  }

  /**
   * Generate preset configurations for quick access
   */
  getPresetConfigurations(): Record<string, GMod6Config> {
    return {
      'Hexagonal Focus': {
        cycleSpeed: 1,
        amplitudeFactor: 1,
        phaseOffset: 0,
        enableHexGeometry: true,
        enableColorCycling: true,
        enableRotationalSymmetry: true
      },
      'Smooth Rotation': {
        cycleSpeed: 2,
        amplitudeFactor: 0.3,
        phaseOffset: Math.PI / 2,
        enableHexGeometry: false,
        enableColorCycling: true,
        enableRotationalSymmetry: true
      },
      'Geometric Pattern': {
        cycleSpeed: 0.5,
        amplitudeFactor: 1.5,
        phaseOffset: Math.PI,
        enableHexGeometry: true,
        enableColorCycling: false,
        enableRotationalSymmetry: false
      },
      'Fast Cycle': {
        cycleSpeed: 3,
        amplitudeFactor: 0.8,
        phaseOffset: 0,
        enableHexGeometry: true,
        enableColorCycling: true,
        enableRotationalSymmetry: true
      }
    };
  }

  /**
   * Private animation loop
   */
  private animate = (): void => {
    if (!this.state.isAnimating) return;

    this.state.animationTime += 0.016; // ~60fps
    gmod6Engine.updateTime(0.016);

    // Update G value based on animation
    const animatedG = gmod6Engine.getTimeBasedG(this.state.config.cycleSpeed);
    this.updateG(animatedG);

    this.animationFrame = requestAnimationFrame(this.animate);
  };

  /**
   * Notify all listeners of state changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  /**
   * Get current state for external access
   */
  getState(): GMod6FrontendState {
    return { ...this.state };
  }

  /**
   * Reset animation time
   */
  resetAnimation(): void {
    this.state.animationTime = 0;
    gmod6Engine.updateTime(0); // Reset engine time
    this.notifyListeners();
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    this.stopAnimation();
    this.listeners.clear();
  }
}

// Export singleton instance for global access
export const gmod6Frontend = new GMod6FrontendIntegration();

// Export utility functions for frontend components
export const GMod6Utils = {
  /**
   * Generate color for state visualization
   */
  getStateColor(stateId: number, isActive: boolean = false): string {
    const saturation = isActive ? 80 : 40;
    const lightness = isActive ? 60 : 40;
    return `hsl(${stateId * 60}, ${saturation}%, ${lightness}%)`;
  },

  /**
   * Format G value for display
   */
  formatGValue(g: number): string {
    return `${g.toFixed(3)} (State: ${Math.floor(g) % 6})`;
  },

  /**
   * Get state name from ID
   */
  getStateName(stateId: number): string {
    const names = [
      'Origin', 'Transform', 'Expand', 
      'Symmetry', 'Complex', 'Unity'
    ];
    return names[stateId % 6];
  },

  /**
   * Calculate interpolation between two states
   */
  interpolateStates(stateA: number, stateB: number, factor: number): {
    angle: number;
    color: string;
  } {
    const angleA = (stateA / 6) * Math.PI * 2;
    const angleB = (stateB / 6) * Math.PI * 2;
    const interpolatedAngle = angleA + (angleB - angleA) * factor;
    
    const hueA = stateA * 60;
    const hueB = stateB * 60;
    const interpolatedHue = hueA + (hueB - hueA) * factor;
    
    return {
      angle: interpolatedAngle,
      color: `hsl(${interpolatedHue}, 70%, 60%)`
    };
  }
};
