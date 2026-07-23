/**
 * useParameterControl - React Hook for Parameter Authority
 * 
 * Provides clean interface for components to read/write parameters
 * through the central authority. No interference, no conflicts.
 */

import { useCallback, useEffect, useMemo } from 'react';
import { 
  useParameterAuthority, 
  PARAMETER_SPECS, 
  ParameterKey, 
  ParameterValues 
} from '../lib/parameterAuthority';
import { SurfaceParameters } from '../types/math';

// Hook for reading all parameters
export const useParameters = (): ParameterValues => {
  return useParameterAuthority(state => state.values);
};

// Hook for reading a single parameter
export const useParameter = (key: ParameterKey): number => {
  return useParameterAuthority(state => state.values[key]);
};

// Hook for parameter actions
export const useParameterActions = () => {
  const store = useParameterAuthority();
  
  return useMemo(() => ({
    set: store.setParameter,
    batch: store.batchUpdate,
    reset: store.resetParameter,
    resetAll: store.resetAll,
    resetGroup: store.resetGroup,
    getSpec: store.getParameterSpec,
    getMirror: store.getMirrorValue,
    interpolate: store.interpolate
  }), [store]);
};

// Hook for parameter with setter (like useState)
export const useParameterState = (key: ParameterKey): [number, (value: number) => void] => {
  const value = useParameterAuthority(state => state.values[key]);
  const setParameter = useParameterAuthority(state => state.setParameter);
  
  const setValue = useCallback((newValue: number) => {
    setParameter(key, newValue, 'component');
  }, [key, setParameter]);
  
  return [value, setValue];
};

// Hook for parameter group
export const useParameterGroup = (group: string): Partial<ParameterValues> => {
  const values = useParameterAuthority(state => state.values);
  
  return useMemo(() => {
    const result: Partial<ParameterValues> = {};
    for (const [key, spec] of Object.entries(PARAMETER_SPECS)) {
      if (spec.group === group) {
        result[key as ParameterKey] = values[key as ParameterKey];
      }
    }
    return result;
  }, [values, group]);
};

// Hook to convert authority values to SurfaceParameters format
export const useSurfaceParameters = (shapeType: string): SurfaceParameters => {
  const values = useParameterAuthority(state => state.values);
  
  return useMemo(() => ({
    type: shapeType,
    ...values,
    // Ensure mesh parameters have defaults
    uSegments: 64,
    vSegments: 64,
    uMin: 0,
    uMax: 1,
    vMin: 0,
    vMax: 1,
    time: 0
  } as SurfaceParameters), [shapeType, values]);
};

// Hook for subscribing to parameter changes
export const useParameterSubscription = (
  callback: (params: ParameterValues, changed: ParameterKey[]) => void,
  systemId: string
) => {
  const subscribe = useParameterAuthority(state => state.subscribe);
  
  useEffect(() => {
    const unsubscribe = subscribe(systemId, callback);
    return unsubscribe;
  }, [subscribe, callback, systemId]);
};

// Hook for chaos-level parameter groups
export const useChaosLevel = (minChaos: number, maxChaos: number): Partial<ParameterValues> => {
  const values = useParameterAuthority(state => state.values);
  
  return useMemo(() => {
    const result: Partial<ParameterValues> = {};
    for (const [key, spec] of Object.entries(PARAMETER_SPECS)) {
      if (spec.chaos >= minChaos && spec.chaos <= maxChaos) {
        result[key as ParameterKey] = values[key as ParameterKey];
      }
    }
    return result;
  }, [values, minChaos, maxChaos]);
};

// Parameter specs helper
export const getParameterInfo = (key: ParameterKey) => {
  const spec = PARAMETER_SPECS[key];
  return {
    ...spec,
    key,
    label: key.toUpperCase(),
    description: getParameterDescription(key)
  };
};

// Human-readable descriptions
const getParameterDescription = (key: ParameterKey): string => {
  const descriptions: Record<ParameterKey, string> = {
    a: 'Primary scale / X-axis',
    b: 'Secondary scale / Y-axis',
    c: 'Tertiary scale / Z-axis',
    d: 'Foundational curve intensity',
    e: 'Foundational curve phase',
    f: 'Revolution surface twist',
    g: 'Revolution surface warp',
    h: 'Extrusion depth',
    i: 'Sweep angle',
    j: 'Loft interpolation',
    k: 'Loft blend',
    l: 'Superquadric power',
    m: 'Superquadric exponent',
    n: 'Minimal surface tension',
    o: 'Minimal surface curvature',
    p: 'Waveform frequency',
    q: 'Waveform amplitude',
    r: 'Special structure twist',
    s: 'Special structure fold',
    t: 'Phi-based scaling',
    u: 'Phi-based rotation',
    v: 'Fractal iteration',
    w: 'Noise amplitude',
    x: 'Universal X offset',
    y: 'Universal Y offset',
    z: 'Universal Z offset'
  };
  return descriptions[key];
};

// All parameter keys for iteration
export const ALL_PARAMETER_KEYS: ParameterKey[] = Object.keys(PARAMETER_SPECS) as ParameterKey[];

// Parameter groups for UI organization
export const PARAMETER_GROUPS = {
  global: ['a', 'b', 'c'] as ParameterKey[],
  foundational: ['d', 'e'] as ParameterKey[],
  revolution: ['f', 'g'] as ParameterKey[],
  extrusion: ['h', 'i'] as ParameterKey[],
  loft: ['j', 'k'] as ParameterKey[],
  superquadric: ['l', 'm'] as ParameterKey[],
  minimal: ['n', 'o'] as ParameterKey[],
  waveform: ['p', 'q'] as ParameterKey[],
  special: ['r', 's'] as ParameterKey[],
  phi: ['t', 'u'] as ParameterKey[],
  fractal: ['v', 'w'] as ParameterKey[],
  offset: ['x', 'y', 'z'] as ParameterKey[]
};

export default useParameterAuthority;
