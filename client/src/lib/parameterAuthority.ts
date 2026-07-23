/**
 * PARAMETER AUTHORITY - The Central Nervous System
 * 
 * Single source of truth for ALL A-Z parameters.
 * NO OTHER SYSTEM can override these values.
 * All systems subscribe, none interfere.
 * 
 * Benefits:
 * - Shape rendering: Direct parameter feed
 * - Export systems: Consistent values across GLB/PLY/Sketchfab
 * - Voice control: Unified input handler
 * - AI analysis: Clean parameter access
 * - Cross-learning: Shared state for pattern detection
 * - Formula mapping: Reliable parameter snapshots
 * - Physics simulation: Stable input values
 * - Animation system: Synchronized morphing
 * - Material system: Parameter-reactive shaders
 * - Background effects: Parameter-driven environments
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { SHAPE_DEFAULTS_MAP } from './unifiedShapes';

// EXTENDED WHOLE NUMBER SYSTEM - Full creative range
// Step size of 1 for clean integer values, extended range for expressive control
export const PARAMETER_SPECS = {
  // A-C: Core Shape Parameters - full -360 to 360 range for creative freedom
  a: { min: -360, max: 360, step: 0.01, default: 1, chaos: 0, group: 'global' }, // X Scale
  b: { min: -360, max: 360, step: 0.01, default: 1, chaos: 0, group: 'global' }, // Y Scale
  c: { min: -360, max: 360, step: 0.01, default: 1, chaos: 0, group: 'global' }, // Z Scale
  
  // ═══════════════════════════════════════════════════════════════════════════
  // 10 ADVANCED MORPHING PARAMETERS (D-M): Symmetrical topology-transforming controls
  // Creates dramatic inversions, folds, twists, and fractal subdivisions
  // ═══════════════════════════════════════════════════════════════════════════
  
  // D: TORSION TWIST (φ) - Helical spiral deformation around central axis
  d: { min: -360, max: 360, step: 0.01, default: 0, chaos: 3, group: 'torsion', label: 'Torsion φ', desc: 'Helical twist - mobius spiral deformation' },
  
  // E: RADIAL BULGE/PINCH (β) - Expand or compress vertices from center
  e: { min: -360, max: 360, step: 0.01, default: 0, chaos: 2, group: 'bulge', label: 'Bulge β', desc: 'Radial bulge/pinch - hourglass to sphere' },
  
  // F: FOURIER HARMONIC WAVE (ω) - Sinusoidal ripples across surface
  f: { min: -360, max: 360, step: 0.01, default: 0, chaos: 4, group: 'wave', label: 'Wave ω', desc: 'Fourier harmonics - undulating ripples' },
  
  // G: INVERSION (ι) - Inside/outside topology flip around sphere
  g: { min: -360, max: 360, step: 0.01, default: 0, chaos: 5, group: 'invert', label: 'Invert ι', desc: 'Sphere inversion - concave/convex flip' },
  
  // H: TAPER RATIO (τ) - Progressive scaling along axis (cone/wedge)
  h: { min: -360, max: 360, step: 0.01, default: 0, chaos: 2, group: 'taper', label: 'Taper τ', desc: 'Taper ratio - pyramid/funnel scaling' },
  
  // I: SYMMETRY PLANE MIRROR (σ) - Asymmetric distortion with partial symmetry
  i: { min: -360, max: 360, step: 0.01, default: 0, chaos: 3, group: 'mirror', label: 'Mirror σ', desc: 'Symmetry mirror - bilateral folding' },
  
  // J: STELLULAR EXTRUSION (ε) - Spiky star or smooth along normals
  j: { min: -360, max: 360, step: 0.01, default: 0, chaos: 4, group: 'stellar', label: 'Stellar ε', desc: 'Stellular extrusion - spiky/smooth morph' },
  
  // K: GYRATION ROTATION (γ) - Multi-axis gyroscopic spinning
  k: { min: -360, max: 360, step: 0.01, default: 0, chaos: 5, group: 'gyro', label: 'Gyro γ', desc: 'Gyration spin - centrifugal folding' },
  
  // L: CURVILINEAR ENVELOPE (κ) - Gaussian curvature scaling
  l: { min: -360, max: 360, step: 0.01, default: 0, chaos: 3, group: 'curve', label: 'Curve κ', desc: 'Curvature envelope - saddle/blob morph' },
  
  // M: RECURSIVE FRACTAL (δ) - Fractal subdivision with inversion
  m: { min: -360, max: 360, step: 0.01, default: 0, chaos: 6, group: 'fractal', label: 'Fractal δ', desc: 'Recursive fractal - self-similar complexity' },
  
  // N-O: Minimal Surfaces - topological chaos
  n: { min: -360, max: 360, step: 0.01, default: 0, chaos: 6, group: 'minimal' },
  o: { min: -360, max: 360, step: 0.01, default: 0, chaos: 6, group: 'minimal' },
  
  // P-Q: Waveforms & Harmonics - wave dynamics
  p: { min: -360, max: 360, step: 0.01, default: 0, chaos: 7, group: 'waveform' },
  q: { min: -360, max: 360, step: 0.01, default: 0, chaos: 7, group: 'waveform' },
  
  // R-S: Special Structures - topological twist
  r: { min: -360, max: 360, step: 0.01, default: 0, chaos: 8, group: 'special' },
  s: { min: -360, max: 360, step: 0.01, default: 0, chaos: 8, group: 'special' },
  
  // T-U: Φ-based Forms - golden ratio
  t: { min: -360, max: 360, step: 0.01, default: 0, chaos: 9, group: 'phi' },
  u: { min: -360, max: 360, step: 0.01, default: 0, chaos: 9, group: 'phi' },
  
  // V-W: Fractals & Noise - high chaos
  v: { min: -360, max: 360, step: 0.01, default: 0, chaos: 10, group: 'fractal' },
  w: { min: -360, max: 360, step: 0.01, default: 0, chaos: 10, group: 'fractal' },
  
  // X-Y-Z: Universal Axis Offsets - full range
  x: { min: -360, max: 360, step: 0.01, default: 1, chaos: 0, group: 'offset' },
  y: { min: -360, max: 360, step: 0.01, default: 1, chaos: 0, group: 'offset' },
  z: { min: -360, max: 360, step: 0.01, default: 1, chaos: 0, group: 'offset' },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // UV DOMAIN & MESH DENSITY CONTROLS
  // These control surface unfolding and mesh resolution
  // ═══════════════════════════════════════════════════════════════════════════
  
  // UV Domain: Controls parametric surface boundaries (-360 to 360 for full unfolding)
  uMin: { min: -360, max: 360, step: 0.1, default: 0, chaos: 0, group: 'uv' },
  uMax: { min: -360, max: 360, step: 0.1, default: 1, chaos: 0, group: 'uv' },
  vMin: { min: -360, max: 360, step: 0.1, default: 0, chaos: 0, group: 'uv' },
  vMax: { min: -360, max: 360, step: 0.1, default: 1, chaos: 0, group: 'uv' },
  
  // Mesh Density: Controls surface tessellation (-360 to 360 for bidirectional control)
  uSegments: { min: 5, max: 64, step: 1, default: 64, chaos: 0, group: 'mesh' },
  vSegments: { min: 5, max: 64, step: 1, default: 64, chaos: 0, group: 'mesh' },
} as const;

export type ParameterKey = keyof typeof PARAMETER_SPECS;
export type ParameterValues = Record<ParameterKey, number>;

// Subscriber types for cross-system communication
type SubscriberCallback = (params: ParameterValues, changed: ParameterKey[]) => void;
type SystemSubscriber = {
  id: string;
  callback: SubscriberCallback;
  priority: number; // Lower = earlier notification
};

interface ParameterAuthorityState {
  // Core parameter values - THE source of truth
  values: ParameterValues;
  
  // Shape context
  currentShape: string;
  
  // System subscribers (for cross-system communication)
  subscribers: SystemSubscriber[];
  
  // Change history for learning/undo
  history: { timestamp: number; key: ParameterKey; oldValue: number; newValue: number }[];
  
  // Actions - THE ONLY way to modify parameters
  setParameter: (key: ParameterKey, value: number, source?: string) => void;
  batchUpdate: (updates: Partial<ParameterValues>, source?: string) => void;
  resetParameter: (key: ParameterKey) => void;
  resetAll: () => void;
  resetGroup: (group: string) => void;
  
  // Shape context
  setShape: (shapeType: string) => void;
  
  // Subscription management
  subscribe: (id: string, callback: SubscriberCallback, priority?: number) => () => void;
  notifySubscribers: (changed: ParameterKey[]) => void;
  
  // Query methods
  getSnapshot: () => ParameterValues;
  getParameterSpec: (key: ParameterKey) => typeof PARAMETER_SPECS[ParameterKey];
  getGroup: (group: string) => Partial<ParameterValues>;
  
  // Morphing helpers
  getMirrorValue: (key: ParameterKey) => number; // For symmetric morphing
  interpolate: (key: ParameterKey, targetValue: number, steps: number) => number[];
}

// Initialize default values from specs
const getDefaultValues = (): ParameterValues => {
  const defaults = {} as ParameterValues;
  for (const [key, spec] of Object.entries(PARAMETER_SPECS)) {
    defaults[key as ParameterKey] = spec.default;
  }
  return defaults;
};

// Enforce range with symmetric morphing behavior - 5 decimal precision
const enforceRange = (key: ParameterKey, value: number): number => {
  const spec = PARAMETER_SPECS[key];
  // Clamp to range
  const clamped = Math.max(spec.min, Math.min(spec.max, value));
  // Round to step precision (0.00001 = 5 decimals)
  const stepped = Math.round(clamped / spec.step) * spec.step;
  // Fix floating point precision - 5 decimal places
  return parseFloat(stepped.toFixed(5));
};

/**
 * NORMALIZE PARAMS - Industry-Standard Parameter Sanitization
 * 
 * Fixes the "Parameter Default Drift / Shadowed Default Bug" by:
 * 1. Only falling back on null/undefined (not 0 or other truthy values)
 * 2. Replacing NaN/Infinity with spec defaults
 * 3. Enforcing range constraints on all parameters
 * 4. Ensuring all A-Z parameters are explicitly initialized
 * 
 * Call this after loading any parameter set to guarantee clean state.
 */
export const normalizeParams = (shapeType: string, params: Partial<ParameterValues>): ParameterValues => {
  // Start with spec defaults as foundation
  const specDefaults = getDefaultValues();
  
  // Get shape-specific defaults (overrides spec defaults)
  let shapeDefaults: Partial<ParameterValues> = {};
  if (SHAPE_DEFAULTS_MAP[shapeType]) {
    const shapeParams = SHAPE_DEFAULTS_MAP[shapeType];
    for (const key of Object.keys(PARAMETER_SPECS)) {
      if (shapeParams[key] !== undefined && !isNaN(shapeParams[key]) && isFinite(shapeParams[key])) {
        shapeDefaults[key as ParameterKey] = shapeParams[key];
      }
    }
  }
  
  // Build final normalized parameters
  const normalized = {} as ParameterValues;
  for (const key of Object.keys(PARAMETER_SPECS) as ParameterKey[]) {
    // Priority: input params > shape defaults > spec defaults
    // Use nullish coalescing (??) to only fall back on null/undefined
    let value = params[key] ?? shapeDefaults[key] ?? specDefaults[key];
    
    // Sanitize: Replace NaN/Infinity with spec default
    if (!isFinite(value) || isNaN(value)) {
      value = specDefaults[key];
    }
    
    // Enforce range constraints
    normalized[key] = enforceRange(key, value);
  }
  
  return normalized;
};

// FOUNDATIONAL PARAMETERS - Always enforced as 1.00000 (cannot be overridden by shapes)
const FOUNDATIONAL_PARAMS: Partial<ParameterValues> = {
  a: 1, b: 1, c: 1,  // Global transforms
  x: 1, y: 1, z: 1,  // Universal axis offsets
};

// Get shape-specific defaults from SHAPE_DEFAULTS_MAP (synchronous, immediate access)
const getShapeDefaults = (shapeType: string): ParameterValues => {
  // Start with spec defaults
  const defaults = getDefaultValues();
  
  // Check pre-computed defaults map (synchronous, always available)
  if (SHAPE_DEFAULTS_MAP[shapeType]) {
    const shapeParams = SHAPE_DEFAULTS_MAP[shapeType];
    // Extract D-Z parameters (shapes need these internally) + UV domain + mesh parameters
    // Skip A, B, C, X, Y, Z - they are foundational and locked to 1.0
    const overrides: Partial<ParameterValues> = {};
    for (const key of Object.keys(PARAMETER_SPECS)) {
      // Skip foundational parameters - they must stay at 1.0
      if (['a', 'b', 'c', 'x', 'y', 'z'].includes(key)) continue;
      if (shapeParams[key] !== undefined) {
        overrides[key as ParameterKey] = shapeParams[key];
      }
    }
    console.log(`⚡ Shape defaults loaded for ${shapeType}:`, overrides);
    // Foundational params applied LAST to ensure they're always 1.0
    return { ...defaults, ...overrides, ...FOUNDATIONAL_PARAMS } as ParameterValues;
  }
  
  // Fallback: check registered shape lookup for shapes not in defaults map
  if (registeredShapeLookup) {
    const lookupParams = registeredShapeLookup(shapeType);
    if (lookupParams) {
      // Extract D-Z parameters (shapes need these internally) + UV domain + mesh parameters
      // Skip A, B, C, X, Y, Z - they are foundational and locked to 1.0
      const overrides: Partial<ParameterValues> = {};
      for (const key of Object.keys(PARAMETER_SPECS)) {
        // Skip foundational parameters - they must stay at 1.0
        if (['a', 'b', 'c', 'x', 'y', 'z'].includes(key)) continue;
        if (lookupParams[key] !== undefined) {
          overrides[key as ParameterKey] = lookupParams[key];
        }
      }
      console.log(`⚡ Shape defaults loaded via lookup for ${shapeType}:`, overrides);
      // Foundational params applied LAST to ensure they're always 1.0
      return { ...defaults, ...overrides, ...FOUNDATIONAL_PARAMS } as ParameterValues;
    }
  }
  
  // Last fallback: basic shapes - all foundational params at 1.0
  // Foundational params applied LAST to ensure they're always 1.0
  return { ...defaults, ...FOUNDATIONAL_PARAMS } as ParameterValues;
};

// Log shape defaults availability on module load
console.log(`⚡ Shape defaults map available with ${Object.keys(SHAPE_DEFAULTS_MAP).length} shapes`);

// Shape lookup callback for shapes not in SHAPE_DEFAULTS_MAP
// This provides access to ALL_SHAPE_LIBRARIES for shapes not in UNIFIED_SHAPES
type ShapeLookupFn = (shapeType: string) => Record<string, number> | null;
let registeredShapeLookup: ShapeLookupFn | null = null;
let shapeLibrariesLoaded = false;

export function registerShapeLookup(lookupFn: ShapeLookupFn): void {
  if (!registeredShapeLookup) {
    registeredShapeLookup = lookupFn;
    shapeLibrariesLoaded = true;
    console.log(`⚡ Shape lookup callback registered - full shape library access enabled`);
  }
}

// Lazy initialization: Load shape libraries on first use if not already registered
// This ensures defaults are available even if ParametricSurface hasn't loaded yet
async function ensureShapeLibrariesLoaded(): Promise<void> {
  if (shapeLibrariesLoaded) return;
  
  try {
    // Dynamic import to avoid circular dependencies
    const module = await import('./shapeLibrariesLoader');
    if (module.ALL_SHAPE_LIBRARIES && !registeredShapeLookup) {
      registerShapeLookup((shapeType: string) => {
        const shape = module.ALL_SHAPE_LIBRARIES[shapeType];
        if (shape && shape.defaultParams) {
          return shape.defaultParams as Record<string, number>;
        }
        return null;
      });
    }
  } catch (e) {
    console.log('⚡ Shape libraries will load when ParametricSurface initializes');
  }
}

// Trigger lazy load during module initialization (non-blocking)
ensureShapeLibrariesLoaded().catch(() => {});

// Create the authority store with selector subscription
export const useParameterAuthority = create<ParameterAuthorityState>()(
  subscribeWithSelector((set, get) => ({
    values: getDefaultValues(),
    currentShape: 'sphere',
    subscribers: [],
    history: [],
    
    setParameter: (key: ParameterKey, value: number, source = 'user') => {
      const oldValue = get().values[key];
      const newValue = enforceRange(key, value);
      
      if (oldValue === newValue) return; // No change
      
      set((state) => ({
        values: { ...state.values, [key]: newValue },
        history: [
          ...state.history.slice(-99), // Keep last 100 changes
          { timestamp: Date.now(), key, oldValue, newValue }
        ]
      }));
      
      // Notify all subscribers
      get().notifySubscribers([key]);
      
      // Log for debugging
      console.log(`⚡ Parameter Authority: ${key.toUpperCase()} = ${newValue} (from ${source})`);
    },
    
    batchUpdate: (updates: Partial<ParameterValues>, source = 'user') => {
      const current = get().values;
      const changed: ParameterKey[] = [];
      const newValues = { ...current };
      
      for (const [key, value] of Object.entries(updates)) {
        const paramKey = key as ParameterKey;
        if (PARAMETER_SPECS[paramKey]) {
          const enforced = enforceRange(paramKey, value as number);
          if (current[paramKey] !== enforced) {
            newValues[paramKey] = enforced;
            changed.push(paramKey);
          }
        }
      }
      
      if (changed.length === 0) return;
      
      set({ values: newValues });
      get().notifySubscribers(changed);
      
      console.log(`⚡ Parameter Authority: Batch update ${changed.length} params (from ${source})`);
    },
    
    resetParameter: (key: ParameterKey) => {
      const spec = PARAMETER_SPECS[key];
      get().setParameter(key, spec.default, 'reset');
    },
    
    resetAll: () => {
      set({ values: getDefaultValues(), history: [] });
      get().notifySubscribers(Object.keys(PARAMETER_SPECS) as ParameterKey[]);
      console.log('⚡ Parameter Authority: All parameters reset');
    },
    
    resetGroup: (group: string) => {
      const updates: Partial<ParameterValues> = {};
      for (const [key, spec] of Object.entries(PARAMETER_SPECS)) {
        if (spec.group === group) {
          updates[key as ParameterKey] = spec.default;
        }
      }
      get().batchUpdate(updates, 'reset-group');
    },
    
    setShape: (shapeType: string) => {
      const previousShape = get().currentShape;
      
      // Always reset parameters to shape defaults when changing shapes
      if (shapeType !== previousShape) {
        const newDefaults = getShapeDefaults(shapeType);
        set({ 
          currentShape: shapeType,
          values: newDefaults,
          history: [] // Clear history on shape change
        });
        
        // Notify all subscribers of the parameter reset
        get().notifySubscribers(Object.keys(PARAMETER_SPECS) as ParameterKey[]);
        console.log(`⚡ Parameter Authority: Shape changed to ${shapeType} - Parameters RESET to defaults`);
      } else {
        set({ currentShape: shapeType });
        console.log(`⚡ Parameter Authority: Shape context = ${shapeType}`);
      }
    },
    
    subscribe: (id: string, callback: SubscriberCallback, priority = 50) => {
      set((state) => ({
        subscribers: [...state.subscribers, { id, callback, priority }]
          .sort((a, b) => a.priority - b.priority)
      }));
      
      console.log(`📡 Parameter Authority: ${id} subscribed (priority ${priority})`);
      
      // Return unsubscribe function
      return () => {
        set((state) => ({
          subscribers: state.subscribers.filter(s => s.id !== id)
        }));
        console.log(`📡 Parameter Authority: ${id} unsubscribed`);
      };
    },
    
    notifySubscribers: (changed: ParameterKey[]) => {
      const { subscribers, values } = get();
      for (const sub of subscribers) {
        try {
          sub.callback(values, changed);
        } catch (err) {
          console.error(`Parameter Authority: Subscriber ${sub.id} error:`, err);
        }
      }
    },
    
    getSnapshot: () => ({ ...get().values }),
    
    getParameterSpec: (key: ParameterKey) => PARAMETER_SPECS[key],
    
    getGroup: (group: string) => {
      const values = get().values;
      const result: Partial<ParameterValues> = {};
      for (const [key, spec] of Object.entries(PARAMETER_SPECS)) {
        if (spec.group === group) {
          result[key as ParameterKey] = values[key as ParameterKey];
        }
      }
      return result;
    },
    
    getMirrorValue: (key: ParameterKey) => {
      const value = get().values[key];
      return -value; // Symmetric around 0
    },
    
    interpolate: (key: ParameterKey, targetValue: number, steps: number) => {
      const current = get().values[key];
      const delta = (targetValue - current) / steps;
      return Array.from({ length: steps }, (_, i) => 
        enforceRange(key, current + delta * (i + 1))
      );
    }
  }))
);

// System registration helpers for cross-system communication
export const registerSystem = (
  systemId: string,
  onParameterChange: SubscriberCallback,
  priority = 50
): (() => void) => {
  return useParameterAuthority.getState().subscribe(systemId, onParameterChange, priority);
};

// Quick access to parameter values (read-only snapshot)
export const getParameters = (): ParameterValues => {
  return useParameterAuthority.getState().getSnapshot();
};

// Quick parameter set (for external systems)
export const setParameter = (key: ParameterKey, value: number, source = 'external'): void => {
  useParameterAuthority.getState().setParameter(key, value, source);
};

// Batch update helper
export const batchUpdateParameters = (updates: Partial<ParameterValues>, source = 'external'): void => {
  useParameterAuthority.getState().batchUpdate(updates, source);
};

// Console access for debugging
if (typeof window !== 'undefined') {
  (window as any).ParameterAuthority = {
    get: getParameters,
    set: setParameter,
    batch: batchUpdateParameters,
    reset: () => useParameterAuthority.getState().resetAll(),
    specs: PARAMETER_SPECS,
    store: useParameterAuthority
  };
  console.log('⚡ Parameter Authority initialized. Access via window.ParameterAuthority');
}

export default useParameterAuthority;
