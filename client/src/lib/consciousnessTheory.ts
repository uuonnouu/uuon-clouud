import { SurfaceParameters } from '../types/math';
import { ParametricSurface } from '../types/shapes';

/**
 * CONSCIOUSNESS & COGNITIVE SCIENCE ALGORITHMS
 * Mathematical models of awareness and cognition
 * Author: UUON Foundation Inc.
 */

export const CONSCIOUSNESS_THEORY: Record<string, ParametricSurface> = {
  
  integrated_information_phi: {
    name: "🧠 Integrated Information (Φ)",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 3 } = params;
      const complexity = u * 10;
      const integration = v * 10;
      
      // IIT phi calculation approximation
      const phi = a * Math.log(1 + complexity) * Math.log(1 + integration);
      const consciousness = phi * Math.exp(-Math.abs(complexity - integration) * b / c);
      
      return [complexity - 5, integration - 5, consciousness];
    },
    defaultParams: { a: 2, b: 1, c: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  global_workspace_theory: {
    name: "🌐 Global Workspace Activation",
    equation: (u, v, params) => {
      const { a = 2, b = 0.5, c = 5 } = params;
      const time = u * 10;
      const module = Math.floor(v * 8);
      
      // Conscious access through global broadcasting
      const competition = Math.sin(c * time + module);
      const broadcast = a * Math.exp(-Math.pow(time - 5 - competition, 2) * b);
      const awareness = broadcast * (1 + 0.3 * Math.cos(module * Math.PI / 4));
      
      return [time - 5, module - 4, awareness];
    },
    defaultParams: { a: 2, b: 0.5, c: 5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 32 }
  },

  attention_selection_field: {
    name: "👁️ Selective Attention Field",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 3 } = params;
      const x = (u - 0.5) * 6;
      const y = (v - 0.5) * 6;
      
      // Attention spotlight mechanism
      const saliency = a * Math.exp(-(x * x + y * y) * b);
      const competition = Math.sin(c * x) * Math.cos(c * y) * 0.3;
      const focus = saliency * (1 + competition);
      
      return [x, y, focus];
    },
    defaultParams: { a: 2, b: 1, c: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  predictive_processing: {
    name: "🔮 Predictive Processing Hierarchy",
    equation: (u, v, params) => {
      const { a = 2, b = 0.5, c = 4 } = params;
      const level = Math.floor(v * 5);
      const time = u * 10;
      
      // Hierarchical prediction errors
      const prediction = Math.sin(time / (level + 1));
      const error = a * Math.abs(Math.sin(c * time) - prediction) / (level + 1);
      const precision = b * Math.exp(-level * 0.3);
      
      return [time - 5, level, error * precision];
    },
    defaultParams: { a: 2, b: 0.5, c: 4, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 20 }
  },

  free_energy_principle: {
    name: "⚡ Free Energy Minimization",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 0.5 } = params;
      const belief = (u - 0.5) * 4;
      const sensory = (v - 0.5) * 4;
      
      // Variational free energy landscape
      const surprise = Math.pow(belief - sensory, 2);
      const complexity = c * belief * belief;
      const freeEnergy = a * (surprise + complexity) * Math.exp(-b * sensory * sensory);
      
      return [belief, sensory, freeEnergy];
    },
    defaultParams: { a: 2, b: 1, c: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  working_memory_dynamics: {
    name: "💭 Working Memory Buffer",
    equation: (u, v, params) => {
      const { a = 2, b = 0.3, c = 7 } = params;
      const item = Math.floor(u * c);
      const time = v * 10;
      
      // Limited capacity memory decay
      const activation = a * Math.exp(-b * time) * (1 + 0.2 * Math.sin(item));
      const interference = Math.max(0, 1 - Math.abs(item - c/2) / (c/2));
      
      return [item - c/2, time - 5, activation * interference];
    },
    defaultParams: { a: 2, b: 0.3, c: 7, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 28, vSegments: 48 }
  },

  neural_synchrony: {
    name: "🎵 Neural Oscillation Synchrony",
    equation: (u, v, params) => {
      const { a = 2, b = 40, c = 0.5 } = params;
      const neuron1 = u * 2 * Math.PI;
      const neuron2 = v * 2 * Math.PI;
      
      // Phase-locking and gamma synchrony
      const phase1 = Math.sin(b * neuron1);
      const phase2 = Math.sin(b * neuron2);
      const coherence = a * (phase1 * phase2 + 1) / 2;
      const binding = coherence * Math.exp(-c * Math.pow(neuron1 - neuron2, 2));
      
      return [Math.cos(neuron1) * 2, Math.sin(neuron2) * 2, binding];
    },
    defaultParams: { a: 2, b: 40, c: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  qualia_space: {
    name: "🌈 Phenomenal Qualia Space",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 3 } = params;
      const hue = u * 360;
      const intensity = v;
      
      // Subjective experience manifold
      const phenomenal = a * intensity * (1 + b * Math.sin(hue * Math.PI / 180));
      const valence = c * Math.cos(hue * Math.PI / 90) * intensity;
      
      return [
        intensity * Math.cos(hue * Math.PI / 180) * 2,
        intensity * Math.sin(hue * Math.PI / 180) * 2,
        phenomenal + valence
      ];
    },
    defaultParams: { a: 2, b: 1, c: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 48 }
  }
};
