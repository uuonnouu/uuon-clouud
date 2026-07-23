
/**
 * SETTINGS PRESERVATION ENGINE
 * Prevents system overrides of user-modified parameters
 */

import { SurfaceParameters } from '../types/math';

interface PreservedSetting {
  value: number;
  timestamp: number;
  source: 'user' | 'system' | 'cleanup';
}

class SettingsPreservationEngine {
  private static instance: SettingsPreservationEngine;
  private preservedSettings = new Map<keyof SurfaceParameters, PreservedSetting>();
  private lockDuration = 30000; // 30 seconds lock on user settings

  static getInstance(): SettingsPreservationEngine {
    if (!SettingsPreservationEngine.instance) {
      SettingsPreservationEngine.instance = new SettingsPreservationEngine();
    }
    return SettingsPreservationEngine.instance;
  }

  // Lock a parameter to prevent system override
  lockParameter(key: keyof SurfaceParameters, value: number, source: 'user' | 'system' = 'user'): void {
    console.log(`🔒 Locking parameter ${key} = ${value} (source: ${source})`);
    
    this.preservedSettings.set(key, {
      value,
      timestamp: Date.now(),
      source
    });

    // Auto-unlock after lock duration (except for user modifications)
    if (source !== 'user') {
      setTimeout(() => {
        if (this.preservedSettings.get(key)?.timestamp === this.preservedSettings.get(key)?.timestamp) {
          this.unlockParameter(key);
        }
      }, this.lockDuration);
    }
  }

  // Unlock parameter to allow changes
  unlockParameter(key: keyof SurfaceParameters): void {
    if (this.preservedSettings.has(key)) {
      console.log(`🔓 Unlocking parameter ${key}`);
      this.preservedSettings.delete(key);
    }
  }

  // Check if parameter is locked
  isParameterLocked(key: keyof SurfaceParameters): boolean {
    const setting = this.preservedSettings.get(key);
    if (!setting) return false;

    // User settings never expire
    if (setting.source === 'user') return true;

    // System settings expire after lock duration
    const isExpired = Date.now() - setting.timestamp > this.lockDuration;
    if (isExpired) {
      this.unlockParameter(key);
      return false;
    }

    return true;
  }

  // Get preserved value or return provided value
  getPreservedValue(key: keyof SurfaceParameters, fallbackValue: number): number {
    const setting = this.preservedSettings.get(key);
    if (setting && this.isParameterLocked(key)) {
      console.log(`✋ Preserving ${key} = ${setting.value} (preventing override to ${fallbackValue})`);
      return setting.value;
    }
    return fallbackValue;
  }

  // Apply preservation to parameter object
  preserveParameters(newParams: Partial<SurfaceParameters>, currentParams: SurfaceParameters): SurfaceParameters {
    const preserved = { ...currentParams };

    Object.entries(newParams).forEach(([key, value]) => {
      const paramKey = key as keyof SurfaceParameters;
      
      if (typeof value === 'number') {
        if (this.isParameterLocked(paramKey)) {
          // Use preserved value instead of new value
          const preservedValue = this.getPreservedValue(paramKey, value);
          (preserved as any)[paramKey] = preservedValue;
        } else {
          // Accept new value and lock it as user setting
          (preserved as any)[paramKey] = value;
          this.lockParameter(paramKey, value, 'user');
        }
      } else {
        // Non-numeric parameters pass through
        (preserved as any)[paramKey] = value;
      }
    });

    return preserved;
  }

  // Clear all locks (emergency reset)
  clearAllLocks(): void {
    console.log('🚨 Clearing all parameter locks');
    this.preservedSettings.clear();
  }

  // Get locked parameters summary
  getLockedParametersSummary(): Record<string, PreservedSetting> {
    const summary: Record<string, PreservedSetting> = {};
    this.preservedSettings.forEach((setting, key) => {
      if (this.isParameterLocked(key)) {
        summary[key] = setting;
      }
    });
    return summary;
  }

  // Handle cleanup events without overriding user settings
  handleSystemCleanup(suggestedSettings: Partial<SurfaceParameters>): Partial<SurfaceParameters> {
    const cleanupSettings: Partial<SurfaceParameters> = {};

    Object.entries(suggestedSettings).forEach(([key, value]) => {
      const paramKey = key as keyof SurfaceParameters;
      
      if (typeof value === 'number' && !this.isParameterLocked(paramKey)) {
        // Only apply cleanup to unlocked parameters
        cleanupSettings[paramKey] = value;
        this.lockParameter(paramKey, value, 'system');
      }
    });

    console.log('🧹 Cleanup applied to unlocked parameters only:', Object.keys(cleanupSettings));
    return cleanupSettings;
  }
}

export const settingsPreservation = SettingsPreservationEngine.getInstance();

// Listen for preservation events
if (typeof window !== 'undefined') {
  window.addEventListener('preserveCurrentSettings', () => {
    console.log('📋 Preserving all current user settings');
  });

  window.addEventListener('clearParameterLocks', () => {
    settingsPreservation.clearAllLocks();
  });
}
