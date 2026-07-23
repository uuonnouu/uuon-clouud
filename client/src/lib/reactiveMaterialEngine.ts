/**
 * Reactive Material Shader Engine
 * 
 * Creates dynamic materials that respond to:
 * - Light sources (intensity, direction, color)
 * - Proximity (camera distance, object distance)
 * - User interaction (hover, click, time)
 * 
 * Includes a visual node-based programming system
 */

import * as THREE from 'three';

// ============================================================
// SHADER NODE TYPES
// ============================================================

export type NodeType = 
  | 'input' | 'output' | 'math' | 'color' | 'texture' 
  | 'light' | 'proximity' | 'time' | 'noise' | 'mix';

export interface ShaderNode {
  id: string;
  type: NodeType;
  name: string;
  position: { x: number; y: number };
  inputs: NodeInput[];
  outputs: NodeOutput[];
  properties: Record<string, number | string | boolean>;
}

export interface NodeInput {
  id: string;
  name: string;
  type: 'float' | 'vec2' | 'vec3' | 'vec4' | 'color' | 'texture';
  value?: number | number[];
  connected?: { nodeId: string; outputId: string };
}

export interface NodeOutput {
  id: string;
  name: string;
  type: 'float' | 'vec2' | 'vec3' | 'vec4' | 'color';
}

export interface NodeConnection {
  id: string;
  fromNode: string;
  fromOutput: string;
  toNode: string;
  toInput: string;
}

export interface ShaderGraph {
  id: string;
  name: string;
  nodes: ShaderNode[];
  connections: NodeConnection[];
}

// ============================================================
// REACTIVE MATERIAL CONFIGURATION
// ============================================================

export interface ReactiveMaterialConfig {
  id: string;
  name: string;
  baseColor: string;
  emissiveColor: string;
  metalness: number;
  roughness: number;
  
  // Light Response
  lightResponse: {
    enabled: boolean;
    intensityMultiplier: number;
    colorBlend: number;
    glowOnLight: boolean;
  };
  
  // Proximity Response
  proximityResponse: {
    enabled: boolean;
    activationDistance: number;
    fadeDistance: number;
    effect: 'glow' | 'color-shift' | 'pulse' | 'dissolve';
  };
  
  // Interaction Response
  interactionResponse: {
    enabled: boolean;
    hoverEffect: 'glow' | 'highlight' | 'ripple' | 'none';
    clickEffect: 'flash' | 'wave' | 'dissolve' | 'none';
    hoverColor: string;
  };
  
  // Time-based Animation
  timeAnimation: {
    enabled: boolean;
    speed: number;
    pattern: 'pulse' | 'wave' | 'breathe' | 'shimmer' | 'rainbow';
  };
}

// ============================================================
// PRESET REACTIVE MATERIALS
// ============================================================

export const REACTIVE_MATERIAL_PRESETS: Record<string, ReactiveMaterialConfig> = {
  glow_proximity: {
    id: 'glow_proximity',
    name: 'Proximity Glow',
    baseColor: '#1a1a2e',
    emissiveColor: '#00d4ff',
    metalness: 0.3,
    roughness: 0.5,
    lightResponse: { enabled: true, intensityMultiplier: 1.5, colorBlend: 0.3, glowOnLight: true },
    proximityResponse: { enabled: true, activationDistance: 5, fadeDistance: 10, effect: 'glow' },
    interactionResponse: { enabled: false, hoverEffect: 'none', clickEffect: 'none', hoverColor: '#ffffff' },
    timeAnimation: { enabled: false, speed: 1, pattern: 'pulse' }
  },
  
  light_reactive: {
    id: 'light_reactive',
    name: 'Light Reactive',
    baseColor: '#2d2d44',
    emissiveColor: '#ff6b35',
    metalness: 0.8,
    roughness: 0.2,
    lightResponse: { enabled: true, intensityMultiplier: 2.0, colorBlend: 0.5, glowOnLight: true },
    proximityResponse: { enabled: false, activationDistance: 5, fadeDistance: 10, effect: 'glow' },
    interactionResponse: { enabled: false, hoverEffect: 'none', clickEffect: 'none', hoverColor: '#ffffff' },
    timeAnimation: { enabled: false, speed: 1, pattern: 'pulse' }
  },
  
  interactive_hover: {
    id: 'interactive_hover',
    name: 'Interactive Hover',
    baseColor: '#1e3a5f',
    emissiveColor: '#00ff88',
    metalness: 0.5,
    roughness: 0.4,
    lightResponse: { enabled: false, intensityMultiplier: 1, colorBlend: 0, glowOnLight: false },
    proximityResponse: { enabled: false, activationDistance: 5, fadeDistance: 10, effect: 'glow' },
    interactionResponse: { enabled: true, hoverEffect: 'glow', clickEffect: 'flash', hoverColor: '#00ff88' },
    timeAnimation: { enabled: false, speed: 1, pattern: 'pulse' }
  },
  
  breathing_pulse: {
    id: 'breathing_pulse',
    name: 'Breathing Pulse',
    baseColor: '#2a1f4e',
    emissiveColor: '#9b59b6',
    metalness: 0.4,
    roughness: 0.6,
    lightResponse: { enabled: false, intensityMultiplier: 1, colorBlend: 0, glowOnLight: false },
    proximityResponse: { enabled: false, activationDistance: 5, fadeDistance: 10, effect: 'glow' },
    interactionResponse: { enabled: false, hoverEffect: 'none', clickEffect: 'none', hoverColor: '#ffffff' },
    timeAnimation: { enabled: true, speed: 0.5, pattern: 'breathe' }
  },
  
  rainbow_shimmer: {
    id: 'rainbow_shimmer',
    name: 'Rainbow Shimmer',
    baseColor: '#1a1a1a',
    emissiveColor: '#ff0080',
    metalness: 0.9,
    roughness: 0.1,
    lightResponse: { enabled: false, intensityMultiplier: 1, colorBlend: 0, glowOnLight: false },
    proximityResponse: { enabled: false, activationDistance: 5, fadeDistance: 10, effect: 'glow' },
    interactionResponse: { enabled: false, hoverEffect: 'none', clickEffect: 'none', hoverColor: '#ffffff' },
    timeAnimation: { enabled: true, speed: 1.5, pattern: 'rainbow' }
  },
  
  holographic: {
    id: 'holographic',
    name: 'Holographic',
    baseColor: '#0a0a1a',
    emissiveColor: '#00ffff',
    metalness: 0.95,
    roughness: 0.05,
    lightResponse: { enabled: true, intensityMultiplier: 1.2, colorBlend: 0.4, glowOnLight: true },
    proximityResponse: { enabled: true, activationDistance: 3, fadeDistance: 8, effect: 'color-shift' },
    interactionResponse: { enabled: true, hoverEffect: 'highlight', clickEffect: 'wave', hoverColor: '#ff00ff' },
    timeAnimation: { enabled: true, speed: 0.8, pattern: 'shimmer' }
  },
  
  energy_field: {
    id: 'energy_field',
    name: 'Energy Field',
    baseColor: '#000022',
    emissiveColor: '#0088ff',
    metalness: 0.2,
    roughness: 0.8,
    lightResponse: { enabled: true, intensityMultiplier: 2.5, colorBlend: 0.6, glowOnLight: true },
    proximityResponse: { enabled: true, activationDistance: 4, fadeDistance: 12, effect: 'pulse' },
    interactionResponse: { enabled: true, hoverEffect: 'ripple', clickEffect: 'flash', hoverColor: '#00ffff' },
    timeAnimation: { enabled: true, speed: 2.0, pattern: 'wave' }
  },
  
  organic_membrane: {
    id: 'organic_membrane',
    name: 'Organic Membrane',
    baseColor: '#1a2f1a',
    emissiveColor: '#44ff44',
    metalness: 0.1,
    roughness: 0.7,
    lightResponse: { enabled: true, intensityMultiplier: 1.3, colorBlend: 0.2, glowOnLight: false },
    proximityResponse: { enabled: true, activationDistance: 2, fadeDistance: 6, effect: 'dissolve' },
    interactionResponse: { enabled: false, hoverEffect: 'none', clickEffect: 'none', hoverColor: '#ffffff' },
    timeAnimation: { enabled: true, speed: 0.3, pattern: 'breathe' }
  }
};

// ============================================================
// SHADER CODE GENERATION
// ============================================================

const VERTEX_SHADER = `
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

function generateFragmentShader(config: ReactiveMaterialConfig): string {
  return `
uniform vec3 baseColor;
uniform vec3 emissiveColor;
uniform float metalness;
uniform float roughness;
uniform float time;
uniform vec3 cameraPosition;
uniform vec3 lightPosition;
uniform float lightIntensity;
uniform float proximityFactor;
uniform float interactionFactor;
uniform float hoverFactor;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;
varying vec2 vUv;

// Noise function for effects
float noise(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// Smooth noise
float smoothNoise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = noise(i);
  float b = noise(i + vec2(1.0, 0.0));
  float c = noise(i + vec2(0.0, 1.0));
  float d = noise(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// HSV to RGB conversion
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  vec3 lightDir = normalize(lightPosition - vWorldPosition);
  
  // Base color
  vec3 color = baseColor;
  vec3 emission = vec3(0.0);
  
  // Light response
  ${config.lightResponse.enabled ? `
  float NdotL = max(dot(normal, lightDir), 0.0);
  float lightEffect = NdotL * lightIntensity * ${config.lightResponse.intensityMultiplier.toFixed(2)};
  color = mix(color, emissiveColor, lightEffect * ${config.lightResponse.colorBlend.toFixed(2)});
  ${config.lightResponse.glowOnLight ? `emission += emissiveColor * lightEffect * 0.5;` : ''}
  ` : ''}
  
  // Proximity response
  ${config.proximityResponse.enabled ? `
  float proxEffect = smoothstep(${config.proximityResponse.fadeDistance.toFixed(1)}, ${config.proximityResponse.activationDistance.toFixed(1)}, proximityFactor);
  ${config.proximityResponse.effect === 'glow' ? `emission += emissiveColor * proxEffect;` : ''}
  ${config.proximityResponse.effect === 'color-shift' ? `color = mix(color, emissiveColor, proxEffect * 0.5);` : ''}
  ${config.proximityResponse.effect === 'pulse' ? `emission += emissiveColor * proxEffect * (0.5 + 0.5 * sin(time * 4.0));` : ''}
  ${config.proximityResponse.effect === 'dissolve' ? `
    float dissolve = smoothNoise(vUv * 10.0 + time) * proxEffect;
    if (dissolve > 0.8) discard;
    emission += emissiveColor * (1.0 - dissolve) * proxEffect;
  ` : ''}
  ` : ''}
  
  // Interaction response
  ${config.interactionResponse.enabled ? `
  ${config.interactionResponse.hoverEffect === 'glow' ? `emission += emissiveColor * hoverFactor * 0.8;` : ''}
  ${config.interactionResponse.hoverEffect === 'highlight' ? `color = mix(color, vec3(1.0), hoverFactor * 0.3);` : ''}
  ${config.interactionResponse.hoverEffect === 'ripple' ? `
    float ripple = sin(length(vUv - 0.5) * 20.0 - time * 5.0) * hoverFactor;
    emission += emissiveColor * max(ripple, 0.0);
  ` : ''}
  ${config.interactionResponse.clickEffect === 'flash' ? `emission += vec3(1.0) * interactionFactor;` : ''}
  ${config.interactionResponse.clickEffect === 'wave' ? `
    float wave = sin(length(vPosition) * 5.0 - time * 8.0) * interactionFactor;
    emission += emissiveColor * max(wave, 0.0);
  ` : ''}
  ` : ''}
  
  // Time animation
  ${config.timeAnimation.enabled ? `
  float animSpeed = ${config.timeAnimation.speed.toFixed(2)};
  ${config.timeAnimation.pattern === 'pulse' ? `
    float pulse = 0.5 + 0.5 * sin(time * animSpeed * 3.14159);
    emission += emissiveColor * pulse * 0.4;
  ` : ''}
  ${config.timeAnimation.pattern === 'wave' ? `
    float wave = 0.5 + 0.5 * sin(vPosition.x * 2.0 + time * animSpeed * 2.0);
    emission += emissiveColor * wave * 0.3;
  ` : ''}
  ${config.timeAnimation.pattern === 'breathe' ? `
    float breathe = 0.3 + 0.7 * pow(0.5 + 0.5 * sin(time * animSpeed), 2.0);
    emission += emissiveColor * breathe * 0.5;
  ` : ''}
  ${config.timeAnimation.pattern === 'shimmer' ? `
    float shimmer = smoothNoise(vUv * 5.0 + time * animSpeed);
    emission += emissiveColor * shimmer * 0.4;
  ` : ''}
  ${config.timeAnimation.pattern === 'rainbow' ? `
    float hue = fract(vPosition.y * 0.1 + time * animSpeed * 0.2);
    vec3 rainbow = hsv2rgb(vec3(hue, 0.8, 1.0));
    emission += rainbow * 0.6;
  ` : ''}
  ` : ''}
  
  // Fresnel effect
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
  emission += emissiveColor * fresnel * 0.2;
  
  // Final color composition
  vec3 finalColor = color + emission;
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`;
}

// ============================================================
// REACTIVE MATERIAL CLASS
// ============================================================

export class ReactiveMaterial extends THREE.ShaderMaterial {
  private config: ReactiveMaterialConfig;
  private startTime: number;
  
  constructor(config: ReactiveMaterialConfig) {
    const baseColor = new THREE.Color(config.baseColor);
    const emissiveColor = new THREE.Color(config.emissiveColor);
    
    super({
      vertexShader: VERTEX_SHADER,
      fragmentShader: generateFragmentShader(config),
      uniforms: {
        baseColor: { value: baseColor },
        emissiveColor: { value: emissiveColor },
        metalness: { value: config.metalness },
        roughness: { value: config.roughness },
        time: { value: 0 },
        cameraPosition: { value: new THREE.Vector3() },
        lightPosition: { value: new THREE.Vector3(10, 10, 10) },
        lightIntensity: { value: 1.0 },
        proximityFactor: { value: 0 },
        interactionFactor: { value: 0 },
        hoverFactor: { value: 0 }
      },
      transparent: true,
      side: THREE.DoubleSide
    });
    
    this.config = config;
    this.startTime = Date.now();
  }
  
  update(camera: THREE.Camera, objectPosition: THREE.Vector3, isHovered: boolean = false, isClicked: boolean = false) {
    const elapsed = (Date.now() - this.startTime) / 1000;
    this.uniforms.time.value = elapsed;
    this.uniforms.cameraPosition.value.copy(camera.position);
    
    // Calculate proximity
    const distance = camera.position.distanceTo(objectPosition);
    this.uniforms.proximityFactor.value = distance;
    
    // Interaction state
    this.uniforms.hoverFactor.value = isHovered ? 1 : 0;
    this.uniforms.interactionFactor.value = isClicked ? 1 : 0;
  }
  
  setLightPosition(position: THREE.Vector3) {
    this.uniforms.lightPosition.value.copy(position);
  }
  
  setLightIntensity(intensity: number) {
    this.uniforms.lightIntensity.value = intensity;
  }
  
  getConfig(): ReactiveMaterialConfig {
    return this.config;
  }
}

// ============================================================
// VISUAL NODE GRAPH SYSTEM
// ============================================================

export const NODE_TEMPLATES: Record<string, Omit<ShaderNode, 'id' | 'position'>> = {
  // Input Nodes
  uv_input: {
    type: 'input',
    name: 'UV Coordinates',
    inputs: [],
    outputs: [{ id: 'uv', name: 'UV', type: 'vec2' }],
    properties: {}
  },
  position_input: {
    type: 'input',
    name: 'Position',
    inputs: [],
    outputs: [{ id: 'pos', name: 'Position', type: 'vec3' }],
    properties: {}
  },
  normal_input: {
    type: 'input',
    name: 'Normal',
    inputs: [],
    outputs: [{ id: 'normal', name: 'Normal', type: 'vec3' }],
    properties: {}
  },
  time_input: {
    type: 'time',
    name: 'Time',
    inputs: [],
    outputs: [{ id: 'time', name: 'Time', type: 'float' }],
    properties: { speed: 1 }
  },
  
  // Light Nodes
  light_intensity: {
    type: 'light',
    name: 'Light Intensity',
    inputs: [],
    outputs: [{ id: 'intensity', name: 'Intensity', type: 'float' }],
    properties: {}
  },
  light_direction: {
    type: 'light',
    name: 'Light Direction',
    inputs: [],
    outputs: [{ id: 'dir', name: 'Direction', type: 'vec3' }],
    properties: {}
  },
  
  // Proximity Nodes
  camera_distance: {
    type: 'proximity',
    name: 'Camera Distance',
    inputs: [],
    outputs: [{ id: 'dist', name: 'Distance', type: 'float' }],
    properties: {}
  },
  
  // Math Nodes
  add: {
    type: 'math',
    name: 'Add',
    inputs: [
      { id: 'a', name: 'A', type: 'float', value: 0 },
      { id: 'b', name: 'B', type: 'float', value: 0 }
    ],
    outputs: [{ id: 'result', name: 'Result', type: 'float' }],
    properties: {}
  },
  multiply: {
    type: 'math',
    name: 'Multiply',
    inputs: [
      { id: 'a', name: 'A', type: 'float', value: 1 },
      { id: 'b', name: 'B', type: 'float', value: 1 }
    ],
    outputs: [{ id: 'result', name: 'Result', type: 'float' }],
    properties: {}
  },
  sine: {
    type: 'math',
    name: 'Sine',
    inputs: [{ id: 'value', name: 'Value', type: 'float', value: 0 }],
    outputs: [{ id: 'result', name: 'Result', type: 'float' }],
    properties: {}
  },
  smoothstep: {
    type: 'math',
    name: 'Smoothstep',
    inputs: [
      { id: 'edge0', name: 'Edge 0', type: 'float', value: 0 },
      { id: 'edge1', name: 'Edge 1', type: 'float', value: 1 },
      { id: 'x', name: 'X', type: 'float', value: 0.5 }
    ],
    outputs: [{ id: 'result', name: 'Result', type: 'float' }],
    properties: {}
  },
  
  // Color Nodes
  color_constant: {
    type: 'color',
    name: 'Color',
    inputs: [],
    outputs: [{ id: 'color', name: 'Color', type: 'color' }],
    properties: { color: '#ffffff' }
  },
  mix_colors: {
    type: 'mix',
    name: 'Mix Colors',
    inputs: [
      { id: 'a', name: 'Color A', type: 'color' },
      { id: 'b', name: 'Color B', type: 'color' },
      { id: 'factor', name: 'Factor', type: 'float', value: 0.5 }
    ],
    outputs: [{ id: 'result', name: 'Result', type: 'color' }],
    properties: {}
  },
  
  // Noise Nodes
  noise_2d: {
    type: 'noise',
    name: 'Noise 2D',
    inputs: [{ id: 'uv', name: 'UV', type: 'vec2' }],
    outputs: [{ id: 'noise', name: 'Noise', type: 'float' }],
    properties: { scale: 10 }
  },
  
  // Output Node
  material_output: {
    type: 'output',
    name: 'Material Output',
    inputs: [
      { id: 'color', name: 'Base Color', type: 'color' },
      { id: 'emission', name: 'Emission', type: 'color' },
      { id: 'alpha', name: 'Alpha', type: 'float', value: 1 }
    ],
    outputs: [],
    properties: {}
  }
};

// Helper to create a new node
export function createNode(templateId: string, position: { x: number; y: number }): ShaderNode | null {
  const template = NODE_TEMPLATES[templateId];
  if (!template) return null;
  
  return {
    ...template,
    id: `${templateId}_${Date.now()}`,
    position
  };
}

// Helper to create a new connection
export function createConnection(
  fromNode: string,
  fromOutput: string,
  toNode: string,
  toInput: string
): NodeConnection {
  return {
    id: `conn_${Date.now()}`,
    fromNode,
    fromOutput,
    toNode,
    toInput
  };
}

// ============================================================
// MATERIAL FACTORY
// ============================================================

export function createReactiveMaterial(presetId: string): ReactiveMaterial | null {
  const config = REACTIVE_MATERIAL_PRESETS[presetId];
  if (!config) return null;
  return new ReactiveMaterial(config);
}

export function createCustomReactiveMaterial(config: ReactiveMaterialConfig): ReactiveMaterial {
  return new ReactiveMaterial(config);
}

// Get all preset IDs
export function getPresetIds(): string[] {
  return Object.keys(REACTIVE_MATERIAL_PRESETS);
}

// Get preset info
export function getPresetInfo(presetId: string): { name: string; description: string } | null {
  const preset = REACTIVE_MATERIAL_PRESETS[presetId];
  if (!preset) return null;
  
  const features: string[] = [];
  if (preset.lightResponse.enabled) features.push('Light-reactive');
  if (preset.proximityResponse.enabled) features.push('Proximity-aware');
  if (preset.interactionResponse.enabled) features.push('Interactive');
  if (preset.timeAnimation.enabled) features.push(`${preset.timeAnimation.pattern} animation`);
  
  return {
    name: preset.name,
    description: features.join(', ') || 'Static material'
  };
}

