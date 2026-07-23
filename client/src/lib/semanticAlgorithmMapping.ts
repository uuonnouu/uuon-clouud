/**
 * SEMANTIC ALGORITHM MAPPINGS
 * Maps emojis to mathematical algorithms and their parameters
 * © 2025 UUON Foundation Inc.
 */

import { SurfaceParameters } from '../types/math';

export interface AlgorithmMapping {
  emoji: string;
  primary_algorithm: string;
  parameters: Partial<SurfaceParameters>;
  complexity_level: number;
}

// Mapping of emojis to their corresponding algorithms
export const SEMANTIC_ALGORITHM_MAPPINGS: Record<string, AlgorithmMapping> = {
  '🔥': {
    emoji: '🔥',
    primary_algorithm: 'fluid_dynamics_navier_stokes',
    parameters: { a: 2.5, b: 1.8, c: 0.3, d: 15, e: 0.8 },
    complexity_level: 8
  },
  '⚡': {
    emoji: '⚡',
    primary_algorithm: 'maxwell_equations_electromagnetic',
    parameters: { a: 3.0, b: 1.5, c: 0.5, d: 10 },
    complexity_level: 9
  },
  '❤️': {
    emoji: '❤️',
    primary_algorithm: 'cardioid_polar_equation',
    parameters: { a: 1.6, b: 1.0, c: 0.3, d: 8 },
    complexity_level: 5
  },
  '🌊': {
    emoji: '🌊',
    primary_algorithm: 'korteweg_de_vries_solitons',
    parameters: { a: 3.0, b: 1.2, c: 0.8, d: 6 },
    complexity_level: 7
  },
  '⭐': {
    emoji: '⭐',
    primary_algorithm: 'stellar_structure_equations',
    parameters: { a: 2.5, b: 1.5, c: 0.6, d: 12 },
    complexity_level: 8
  },
  '🌀': {
    emoji: '🌀',
    primary_algorithm: 'rankine_vortex_model',
    parameters: { a: 2.0, b: 1.0, c: 0.4, d: 15 },
    complexity_level: 6
  }
};
