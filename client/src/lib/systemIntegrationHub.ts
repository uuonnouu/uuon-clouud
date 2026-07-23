/**
 * SYSTEM INTEGRATION HUB
 * 
 * Central communication layer connecting all systems through the Parameter Authority.
 * This is the nervous system that ensures all parts of the app work together.
 * 
 * Connected Systems:
 * - Rendering (ParametricSurface)
 * - Export (GLB/PLY/Sketchfab)
 * - Voice Control
 * - AI Analysis
 * - Cross-Learning Engine
 * - Pattern Discovery
 * - Formula Mapping
 * - Physics Simulation
 * - Animation System
 * - Material System
 * - Background Effects
 * - Camera Control
 */

import { useParameterAuthority, registerSystem, getParameters, PARAMETER_SPECS, ParameterKey, ParameterValues } from './parameterAuthority';

// System IDs for registration
export const SYSTEM_IDS = {
  RENDERER: 'parametric-renderer',
  EXPORT: 'export-system',
  VOICE: 'voice-control',
  AI: 'ai-analysis',
  CROSS_LEARN: 'cross-learning',
  PATTERN: 'pattern-discovery',
  FORMULA: 'formula-mapping',
  PHYSICS: 'physics-simulation',
  ANIMATION: 'animation-system',
  MATERIAL: 'material-system',
  BACKGROUND: 'background-effects',
  CAMERA: 'camera-control'
} as const;

// System priorities (lower = earlier notification)
export const SYSTEM_PRIORITIES = {
  RENDERER: 10,      // First - renders the shape
  PHYSICS: 20,       // Second - physics needs fresh geometry
  ANIMATION: 30,     // Third - animation uses physics state
  MATERIAL: 40,      // Fourth - materials react to shape
  CAMERA: 50,        // Fifth - camera follows shape
  BACKGROUND: 60,    // Sixth - background reacts
  CROSS_LEARN: 70,   // Learning systems observe
  PATTERN: 70,
  FORMULA: 70,
  AI: 80,            // AI analyzes last
  VOICE: 90,         // Voice just confirms
  EXPORT: 100        // Export happens on-demand
} as const;

// System state tracking
interface SystemState {
  initialized: boolean;
  lastUpdate: number;
  errorCount: number;
  metrics: Record<string, number>;
}

const systemStates: Record<string, SystemState> = {};

// Initialize system state
const initSystemState = (systemId: string): SystemState => {
  if (!systemStates[systemId]) {
    systemStates[systemId] = {
      initialized: false,
      lastUpdate: 0,
      errorCount: 0,
      metrics: {}
    };
  }
  return systemStates[systemId];
};

// System registration with automatic state tracking
export const registerSystemWithHub = (
  systemId: string,
  onParameterChange: (params: ParameterValues, changed: ParameterKey[]) => void,
  priority?: number
): (() => void) => {
  const state = initSystemState(systemId);
  
  const wrappedCallback = (params: ParameterValues, changed: ParameterKey[]) => {
    try {
      state.lastUpdate = Date.now();
      onParameterChange(params, changed);
    } catch (err) {
      state.errorCount++;
      console.error(`System ${systemId} error:`, err);
    }
  };
  
  state.initialized = true;
  const unsubscribe = registerSystem(systemId, wrappedCallback, priority);
  
  console.log(`🔗 Hub: ${systemId} connected (priority ${priority})`);
  
  return () => {
    state.initialized = false;
    unsubscribe();
    console.log(`🔗 Hub: ${systemId} disconnected`);
  };
};

// Cross-system message bus
type MessageHandler = (payload: any) => void;
const messageHandlers: Record<string, MessageHandler[]> = {};

export const sendMessage = (channel: string, payload: any): void => {
  const handlers = messageHandlers[channel] || [];
  for (const handler of handlers) {
    try {
      handler(payload);
    } catch (err) {
      console.error(`Message handler error on ${channel}:`, err);
    }
  }
};

export const onMessage = (channel: string, handler: MessageHandler): (() => void) => {
  if (!messageHandlers[channel]) {
    messageHandlers[channel] = [];
  }
  messageHandlers[channel].push(handler);
  
  return () => {
    const idx = messageHandlers[channel].indexOf(handler);
    if (idx >= 0) messageHandlers[channel].splice(idx, 1);
  };
};

// Pre-defined message channels
export const CHANNELS = {
  SHAPE_CHANGED: 'shape:changed',
  EXPORT_REQUESTED: 'export:requested',
  EXPORT_COMPLETE: 'export:complete',
  ANIMATION_TICK: 'animation:tick',
  PHYSICS_UPDATE: 'physics:update',
  LEARNING_INSIGHT: 'learning:insight',
  PATTERN_FOUND: 'pattern:found',
  VOICE_COMMAND: 'voice:command',
  AI_SUGGESTION: 'ai:suggestion',
  CAMERA_MOVE: 'camera:move',
  MATERIAL_CHANGE: 'material:change'
} as const;

// Parameter group utilities
export const getParameterGroup = (group: string): Partial<ParameterValues> => {
  return useParameterAuthority.getState().getGroup(group);
};

export const getParametersByChaosPevel = (minChaos: number, maxChaos: number): Partial<ParameterValues> => {
  const values = getParameters();
  const result: Partial<ParameterValues> = {};
  
  for (const [key, spec] of Object.entries(PARAMETER_SPECS)) {
    if (spec.chaos >= minChaos && spec.chaos <= maxChaos) {
      result[key as ParameterKey] = values[key as ParameterKey];
    }
  }
  return result;
};

// System health monitoring
export const getSystemHealth = (): { 
  systems: Record<string, { connected: boolean; errors: number; lastUpdate: number }>;
  overall: number;
} => {
  const systems: Record<string, { connected: boolean; errors: number; lastUpdate: number }> = {};
  let connected = 0;
  let total = 0;
  
  for (const [id, state] of Object.entries(systemStates)) {
    systems[id] = {
      connected: state.initialized,
      errors: state.errorCount,
      lastUpdate: state.lastUpdate
    };
    total++;
    if (state.initialized) connected++;
  }
  
  return {
    systems,
    overall: total > 0 ? (connected / total) * 100 : 0
  };
};

// Parameter morphing utilities
export const morphParameter = (
  key: ParameterKey,
  targetValue: number,
  duration: number = 500,
  onComplete?: () => void
): (() => void) => {
  const store = useParameterAuthority.getState();
  const startValue = store.values[key];
  const startTime = Date.now();
  let cancelled = false;
  
  const animate = () => {
    if (cancelled) return;
    
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease-in-out
    const eased = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    
    const currentValue = startValue + (targetValue - startValue) * eased;
    store.setParameter(key, currentValue, 'morph');
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      onComplete?.();
    }
  };
  
  requestAnimationFrame(animate);
  
  return () => { cancelled = true; };
};

// Batch morphing (for smooth transitions between presets)
export const morphToPreset = (
  preset: Partial<ParameterValues>,
  duration: number = 500,
  onComplete?: () => void
): (() => void) => {
  const cancellers: (() => void)[] = [];
  let completed = 0;
  const total = Object.keys(preset).length;
  
  for (const [key, value] of Object.entries(preset)) {
    const cancel = morphParameter(
      key as ParameterKey,
      value as number,
      duration,
      () => {
        completed++;
        if (completed >= total) onComplete?.();
      }
    );
    cancellers.push(cancel);
  }
  
  return () => cancellers.forEach(c => c());
};

// Console access
if (typeof window !== 'undefined') {
  (window as any).SystemHub = {
    health: getSystemHealth,
    send: sendMessage,
    channels: CHANNELS,
    systems: SYSTEM_IDS,
    morphParameter,
    morphToPreset,
    getGroup: getParameterGroup
  };
  console.log('🔗 System Integration Hub initialized. Access via window.SystemHub');
}

export default {
  registerSystemWithHub,
  sendMessage,
  onMessage,
  getSystemHealth,
  morphParameter,
  morphToPreset,
  SYSTEM_IDS,
  CHANNELS
};
