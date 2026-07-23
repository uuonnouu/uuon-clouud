
/**
 * WAVE ALGORITHMS & WAVE EQUATIONS LIBRARY
 * Wave propagation, interference, and wave-based algorithms
 * © 2025 UUON Foundation Inc.
 */

import { SurfaceParameters } from '../types/math';

export interface ParametricSurface {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

function getCleanDefaults(overrides: Partial<SurfaceParameters> = {}): Partial<SurfaceParameters> {
  return {
    a: 1, b: 1, c: 1, d: 2, e: 2, f: 2, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
    uMin: 0, uMax: 1, vMin: 0, vMax: 1,
    uSegments: 96, vSegments: 72,
    ...overrides
  };
}

export const WAVE_ALGORITHMS_SHAPES: Record<string, ParametricSurface> = {

  fourier_transform_surface: {
    name: "📊 Fourier Transform F(ω) = ∫f(t)e^(-iωt)dt",
    equation: (u, v, params) => {
      const amplitude = params.d ?? 2;    // Signal amplitude
      const frequency = params.e ?? 3;    // Base frequency
      const bandwidth = params.f ?? 1;    // Frequency bandwidth
      
      // Time domain (u) and frequency domain (v)
      const t = (u - 0.5) * amplitude * 4;
      const omega = (v - 0.5) * bandwidth * 8;
      
      // Time domain signal: f(t) = A cos(2πft)
      const time_signal = amplitude * Math.cos(2 * Math.PI * frequency * t / 4);
      
      // Frequency domain: F(ω) peaks at ±f
      const freq_response = amplitude * 2 * Math.exp(-Math.pow((omega - frequency), 2) / 2) +
                           amplitude * 2 * Math.exp(-Math.pow((omega + frequency), 2) / 2);
      
      // Create surface showing time-frequency relationship
      const x = t;
      const y = omega;
      const z = time_signal * 0.1 + freq_response * 0.1;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 3, f: 1, uSegments: 128, vSegments: 128 })
  },

  wave_equation_solution: {
    name: "🌊 Wave Equation ∂²u/∂t² = c²∇²u",
    equation: (u, v, params) => {
      const wave_speed = params.d ?? 1;   // Wave propagation speed
      const amplitude = params.e ?? 2;    // Wave amplitude
      const wavelength = params.f ?? 4;   // Spatial wavelength
      const time = params.time ?? 0;      // Time parameter
      
      const x = (u - 0.5) * wavelength * 2;
      const y = (v - 0.5) * wavelength * 2;
      
      // Wave number and frequency
      const k = 2 * Math.PI / wavelength;
      const omega = wave_speed * k;
      
      // Traveling wave solution: u(x,y,t) = A sin(kx - ωt + φ)
      const phase1 = k * x - omega * time;
      const phase2 = k * y - omega * time + Math.PI / 4;
      
      // Superposition of two waves
      const wave1 = amplitude * Math.sin(phase1);
      const wave2 = amplitude * 0.7 * Math.sin(phase2);
      
      const z = wave1 + wave2;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 2, f: 4, time: 0, uSegments: 128, vSegments: 128 })
  },

  lissajous_curves: {
    name: "🎵 Lissajous Curves x=Asin(at+δ), y=Bsin(bt)",
    equation: (u, v, params) => {
      const A = params.d ?? 2;         // X amplitude
      const B = params.e ?? 2;         // Y amplitude  
      const freq_a = params.f ?? 3;    // X frequency
      const freq_b = params.g ?? 2;    // Y frequency
      const delta = params.h ?? 0;     // Phase difference
      
      const t = u * Math.PI * 4; // Time parameter
      const curve_index = v;     // Multiple curves
      
      // Lissajous parametric equations
      const x = A * Math.sin(freq_a * t + delta);
      const y = B * Math.sin(freq_b * t);
      const z = curve_index * 2 - 1; // Stack multiple curves
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 2, f: 3, g: 2, h: 0, uSegments: 128, vSegments: 16 })
  },

  standing_wave_pattern: {
    name: "🎭 Standing Waves - Node and Antinode Pattern",
    equation: (u, v, params) => {
      const amplitude = params.d ?? 2;    // Maximum amplitude
      const wavelength = params.e ?? 4;   // Standing wave wavelength
      const frequency = params.f ?? 1;    // Oscillation frequency
      const time = params.time ?? 0;      // Time evolution
      
      const x = (u - 0.5) * wavelength * 2;
      const y = (v - 0.5) * wavelength;
      
      // Standing wave: u(x,t) = A sin(kx) cos(ωt)
      const k = 2 * Math.PI / wavelength;
      const omega = 2 * Math.PI * frequency;
      
      const spatial_part = Math.sin(k * x);
      const temporal_part = Math.cos(omega * time);
      
      // Add second mode in y-direction
      const mode_y = Math.sin(k * y * 0.5);
      
      const z = amplitude * spatial_part * temporal_part * (1 + mode_y * 0.3);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 4, f: 1, time: 0, uSegments: 128, vSegments: 64 })
  },

  doppler_effect_surface: {
    name: "🚗 Doppler Effect - Moving Source Waves",
    equation: (u, v, params) => {
      const source_speed = params.d ?? 0.5;  // Source velocity (fraction of wave speed)
      const wave_speed = params.e ?? 1;      // Wave propagation speed
      const frequency = params.f ?? 2;       // Source frequency
      const time = params.time ?? 0;        // Time parameter
      
      const x = (u - 0.5) * 10;
      const y = (v - 0.5) * 8;
      
      // Moving source position
      const source_x = source_speed * wave_speed * time;
      const source_y = 0;
      
      // Distance from moving source
      const distance = Math.sqrt((x - source_x)**2 + (y - source_y)**2) + 0.1;
      
      // Doppler-shifted frequency
      const relative_velocity = source_speed * (x - source_x) / distance;
      const doppler_factor = wave_speed / (wave_speed - relative_velocity);
      const shifted_frequency = frequency * doppler_factor;
      
      // Wave from moving source
      const phase = shifted_frequency * (time - distance / wave_speed);
      const wave_amplitude = 1 / distance; // Amplitude decreases with distance
      
      const z = wave_amplitude * Math.sin(2 * Math.PI * phase);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 0.5, e: 1, f: 2, time: 0, uSegments: 128, vSegments: 96 })
  },

  interference_pattern: {
    name: "🌊 Wave Interference - Constructive/Destructive",
    equation: (u, v, params) => {
      const source_separation = params.d ?? 4; // Distance between sources
      const wavelength = params.e ?? 2;        // Wavelength
      const amplitude = params.f ?? 1;         // Wave amplitude
      const phase_diff = params.g ?? 0;        // Phase difference between sources
      
      const x = (u - 0.5) * 10;
      const y = (v - 0.5) * 8;
      
      // Two point sources
      const source1_x = -source_separation / 2;
      const source1_y = 0;
      const source2_x = source_separation / 2;
      const source2_y = 0;
      
      // Distances from each source
      const r1 = Math.sqrt((x - source1_x)**2 + (y - source1_y)**2) + 0.1;
      const r2 = Math.sqrt((x - source2_x)**2 + (y - source2_y)**2) + 0.1;
      
      // Wave number
      const k = 2 * Math.PI / wavelength;
      
      // Waves from each source
      const wave1 = (amplitude / r1) * Math.sin(k * r1);
      const wave2 = (amplitude / r2) * Math.sin(k * r2 + phase_diff);
      
      // Interference pattern
      const z = wave1 + wave2;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 2, f: 1, g: 0, uSegments: 128, vSegments: 128 })
  },

  wave_diffraction: {
    name: "🕳️ Wave Diffraction - Single Slit",
    equation: (u, v, params) => {
      const slit_width = params.d ?? 2;     // Slit width
      const wavelength = params.e ?? 1;     // Wavelength
      const distance = params.f ?? 10;      // Distance to screen
      
      // Screen coordinates
      const x_screen = (u - 0.5) * 10;
      const y_screen = (v - 0.5) * 8;
      
      // Slit is at y=0, |x| < slit_width/2
      if (Math.abs(y_screen) > distance * 0.8) {
        // We're at the screen
        const y_slit = 0;
        const screen_distance = distance;
        
        // Diffraction angle
        const theta = Math.atan(x_screen / screen_distance);
        
        // Single slit diffraction pattern: I ∝ (sin(β)/β)² where β = (πa sin θ)/λ
        const beta = (Math.PI * slit_width * Math.sin(theta)) / wavelength;
        const intensity = Math.abs(beta) < 0.001 ? 1 : Math.pow(Math.sin(beta) / beta, 2);
        
        const z = intensity * 2;
        return [x_screen, y_screen, z];
      } else {
        // Propagation region
        const z = 0;
        return [x_screen, y_screen, z];
      }
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, f: 10, uSegments: 128, vSegments: 128 })
  },

  dispersion_relation: {
    name: "📈 Dispersion Relation ω(k) - Wave Properties",
    equation: (u, v, params) => {
      const phase_velocity = params.d ?? 1;   // Phase velocity
      const group_velocity = params.e ?? 0.8; // Group velocity  
      const nonlinearity = params.f ?? 0.1;   // Nonlinear dispersion
      
      const k = (u - 0.5) * 8;  // Wave number
      const t = v * 10;         // Time or second dimension
      
      // Linear dispersion: ω = vk
      const omega_linear = phase_velocity * Math.abs(k);
      
      // Dispersive medium: ω = v₁k + v₂k³
      const omega_dispersive = phase_velocity * Math.abs(k) + nonlinearity * Math.pow(Math.abs(k), 3);
      
      // Phase and group velocity difference
      const phase_vel = omega_dispersive / (Math.abs(k) + 0.001);
      const group_vel = phase_velocity + 3 * nonlinearity * k * k; // dω/dk
      
      // Show dispersion curve
      const z = omega_dispersive * 0.1 + (phase_vel - group_vel) * t * 0.01;
      
      return [k, t, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 0.8, f: 0.1, uSegments: 128, vSegments: 64 })
  },

  soliton_wave: {
    name: "🌊 Soliton - Self-Reinforcing Wave",
    equation: (u, v, params) => {
      const amplitude = params.d ?? 2;    // Soliton amplitude
      const width = params.e ?? 2;        // Soliton width
      const velocity = params.f ?? 1;     // Propagation velocity
      const time = params.time ?? 0;      // Time evolution
      
      const x = (u - 0.5) * width * 6;
      const y = (v - 0.5) * width * 4;
      
      // KdV soliton solution: u = -2κ² sech²(κ(x - vt))
      const kappa = 1 / width;
      const soliton_center = velocity * time;
      
      // 2D soliton (simplified)
      const xi = kappa * (x - soliton_center);
      const eta = kappa * y * 0.5;
      
      const sech_xi = 1 / Math.cosh(xi);
      const sech_eta = 1 / Math.cosh(eta);
      
      const z = -2 * amplitude * kappa * kappa * sech_xi * sech_xi * sech_eta * sech_eta;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 2, f: 1, time: 0, uSegments: 128, vSegments: 96 })
  },

  shock_wave: {
    name: "💥 Shock Wave - Discontinuous Front",
    equation: (u, v, params) => {
      const mach_number = params.d ?? 2;   // Mach number (supersonic)
      const shock_strength = params.e ?? 3; // Shock amplitude
      const thickness = params.f ?? 0.5;   // Shock thickness
      const time = params.time ?? 0;       // Time evolution
      
      const x = (u - 0.5) * 8;
      const y = (v - 0.5) * 6;
      
      // Shock front position (moving at Mach speed)
      const shock_position = mach_number * time - 2;
      
      // Shock profile: tanh transition
      const shock_distance = x - shock_position;
      const shock_profile = 0.5 * (1 + Math.tanh(shock_distance / thickness));
      
      // Pressure/density jump across shock
      const upstream_value = 1;
      const downstream_value = shock_strength;
      
      const field_value = upstream_value + (downstream_value - upstream_value) * shock_profile;
      
      // Add some 3D structure
      const y_modulation = 1 + 0.2 * Math.sin(y * 2);
      
      const z = field_value * y_modulation;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 3, f: 0.5, time: 0, uSegments: 128, vSegments: 64 })
  },

  wavelet_transform: {
    name: "📊 Wavelet Transform - Time-Frequency Analysis",
    equation: (u, v, params) => {
      const center_frequency = params.d ?? 2; // Wavelet center frequency
      const scale_factor = params.e ?? 1;     // Wavelet scale
      const time_window = params.f ?? 4;      // Time window width
      
      const t = (u - 0.5) * time_window * 2; // Time
      const scale = v * scale_factor * 4 + 0.1; // Scale parameter
      
      // Morlet wavelet: ψ(t) = π^(-1/4) exp(iω₀t) exp(-t²/2)
      const omega0 = 2 * Math.PI * center_frequency;
      const gaussian = Math.exp(-t * t / (2 * scale * scale));
      const oscillation = Math.cos(omega0 * t / scale);
      
      const wavelet = Math.pow(Math.PI, -0.25) * gaussian * oscillation / Math.sqrt(scale);
      
      // Signal to analyze
      const signal = Math.sin(2 * Math.PI * t) + 0.5 * Math.sin(6 * Math.PI * t);
      
      // Wavelet coefficient (simplified convolution)
      const coefficient = wavelet * signal;
      
      const z = coefficient;
      
      return [t, scale, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, f: 4, uSegments: 128, vSegments: 64 })
  },

  surface_acoustic_wave: {
    name: "🎵 Surface Acoustic Wave (SAW) - Rayleigh Waves",
    equation: (u, v, params) => {
      const frequency = params.d ?? 2;      // SAW frequency
      const amplitude = params.e ?? 1;      // Surface amplitude
      const penetration = params.f ?? 1;    // Penetration depth
      const time = params.time ?? 0;        // Time evolution
      
      const x = (u - 0.5) * 8;     // Surface coordinate
      const z = v * penetration * 3; // Depth into material
      
      // Rayleigh wave: amplitude decays exponentially with depth
      const decay = Math.exp(-z / penetration);
      
      // Wave number and phase
      const k = 2 * Math.PI * frequency / 2; // wavelength = 2/frequency
      const omega = 2 * Math.PI * frequency;
      const phase = k * x - omega * time;
      
      // Surface displacement (elliptical motion)
      const ux = amplitude * decay * Math.sin(phase); // Longitudinal
      const uz = amplitude * decay * Math.cos(phase) * 0.6; // Transverse
      
      // Height represents displacement magnitude
      const displacement_magnitude = Math.sqrt(ux * ux + uz * uz);
      
      const y = 0; // Surface is at y=0
      const height = displacement_magnitude;
      
      return [x, y + height, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, f: 1, time: 0, uSegments: 128, vSegments: 64 })
  },

  phononic_crystal: {
    name: "🔮 Phononic Crystal - Acoustic Band Structure",
    equation: (u, v, params) => {
      const lattice_const = params.d ?? 2;   // Crystal lattice constant
      const contrast = params.e ?? 3;        // Acoustic impedance contrast
      const frequency = params.f ?? 1;       // Probe frequency
      
      const x = (u - 0.5) * lattice_const * 4;
      const y = (v - 0.5) * lattice_const * 4;
      
      // Periodic modulation of acoustic properties
      const modulation_x = Math.cos(2 * Math.PI * x / lattice_const);
      const modulation_y = Math.cos(2 * Math.PI * y / lattice_const);
      const modulation = (modulation_x + modulation_y) / 2;
      
      // Acoustic impedance variation
      const impedance = 1 + contrast * (modulation + 1) / 2;
      
      // Band structure effect (simplified)
      const k_x = 2 * Math.PI * x / lattice_const;
      const k_y = 2 * Math.PI * y / lattice_const;
      const brillouin_zone = Math.cos(k_x) * Math.cos(k_y);
      
      // Transmission amplitude (band gaps appear as low transmission)
      const transmission = 1 / (1 + Math.pow(contrast * brillouin_zone, 2));
      
      const z = impedance * 0.3 + transmission * 0.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 3, f: 1, uSegments: 128, vSegments: 128 })
  },

  metamaterial_wave: {
    name: "🔬 Metamaterial - Negative Index Waves",
    equation: (u, v, params) => {
      const refractive_index = params.d ?? -1; // Negative refractive index
      const frequency = params.e ?? 2;         // Wave frequency
      const thickness = params.f ?? 3;         // Metamaterial thickness
      
      const x = (u - 0.5) * thickness * 2;
      const y = (v - 0.5) * thickness * 2;
      
      // Wave in metamaterial
      const k = 2 * Math.PI * frequency * refractive_index; // Negative k for negative index
      const omega = 2 * Math.PI * frequency;
      
      // Phase velocity and group velocity have opposite signs
      const phase_velocity = omega / k;
      const group_velocity = -Math.abs(phase_velocity); // Negative group velocity
      
      // Wave propagation
      const phase = k * x;
      const envelope = Math.exp(-x * x / (thickness * thickness / 4)); // Localized
      
      // Backward wave (phase and group velocities opposite)
      const wave = envelope * Math.cos(phase) * (1 + 0.3 * Math.sin(y * 3));
      
      // Show negative refraction effect
      const refraction_angle = Math.atan(refractive_index * Math.tan(Math.PI / 6));
      const refracted_intensity = Math.cos(refraction_angle) * wave;
      
      const z = wave + refracted_intensity * 0.3;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: -1, e: 2, f: 3, uSegments: 128, vSegments: 96 })
  }

};

console.log(`📐 Loaded ${Object.keys(WAVE_ALGORITHMS_SHAPES).length} Wave Algorithm visualizations 🌊📊🎵`);
