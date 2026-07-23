/**
 * THERMAL ENGINEERING & DATA CENTER COOLING SHAPES
 * Mathematical visualization of heat transfer, fluid dynamics, and cooling systems
 * Based on AI Infrastructure Thermal Engineering Formulas
 * © 2025 UUON Foundation Inc.
 */

import { SurfaceParameters } from '../types/math';

export interface ParametricSurface {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
  description?: string;
}

function getCleanDefaults(overrides: Partial<SurfaceParameters> = {}): Partial<SurfaceParameters> {
  return {
    a: 1, b: 1, c: 1, d: 0,
    e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
    n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
    uMin: 0, uMax: 1, vMin: 0, vMax: 1,
    uSegments: 96, vSegments: 72,
    ...overrides
  };
}

export const THERMAL_ENGINEERING_SHAPES: Record<string, ParametricSurface> = {

  // ============================================================================
  // HEAT DISSIPATION - Q = P × (1 - η)
  // ============================================================================
  
  heat_dissipation_surface: {
    name: "🔥 Heat Dissipation: Q = P × (1 - η)",
    description: "Visualizes heat dissipated as a function of power consumed and system efficiency. The surface shows how inefficiency generates waste heat.",
    equation: (u, v, params) => {
      const P = params.a ?? 5;           // Power consumed (kW)
      const eta = params.b ?? 0.95;      // Efficiency (0-1)
      const scale = params.c ?? 3;       // Visualization scale
      
      const Q = P * (1 - Math.min(eta, 0.99));  // Heat dissipated
      
      const theta = u * Math.PI * 2;
      const radius = scale * (0.5 + v * 2);
      
      const heatWave = Math.sin(theta * 6 + v * Math.PI * 4) * Q * 0.3;
      const riseEffect = Q * v * 2;
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = riseEffect + heatWave;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 5, b: 0.95, c: 3, uSegments: 96, vSegments: 72 })
  },

  // ============================================================================
  // HEAT FLUX DENSITY - q = Q / A
  // ============================================================================
  
  heat_flux_density: {
    name: "🌡️ Heat Flux Density: q = Q/A (kW/m²)",
    description: "Heat flux visualization showing power density per unit area. Higher density creates steeper thermal gradients.",
    equation: (u, v, params) => {
      const Q = params.a ?? 30;          // Heat load (kW)
      const A = params.b ?? 1;           // Area (m²)
      const scale = params.c ?? 4;       // Visualization scale
      
      const q = Q / Math.max(A, 0.1);    // Heat flux density
      
      const x = (u - 0.5) * scale * 2;
      const y = (v - 0.5) * scale * 2;
      const r = Math.sqrt(x * x + y * y);
      
      const fluxIntensity = q * Math.exp(-r * 0.3) * 0.1;
      const turbulence = Math.sin(x * 5) * Math.cos(y * 5) * q * 0.02;
      
      return [x, y, fluxIntensity + turbulence];
    },
    defaultParams: getCleanDefaults({ a: 30, b: 1, c: 4, uSegments: 128, vSegments: 128 })
  },

  // ============================================================================
  // SENSIBLE HEAT REMOVAL - Q = ṁ × Cp × DT
  // ============================================================================
  
  sensible_heat_removal: {
    name: "💨 Sensible Heat: Q = ṁ × Cp × DT",
    description: "Cooling capacity visualization based on mass flow rate, specific heat, and temperature difference.",
    equation: (u, v, params) => {
      const m_dot = params.a ?? 2;       // Mass flow rate (kg/s)
      const Cp = params.b ?? 4.18;       // Specific heat (kJ/kg·K for water)
      const deltaT = params.c ?? 10;     // Temperature difference (K)
      const scale = params.d ?? 3;       // Scale
      
      const Q = m_dot * Cp * deltaT;     // Cooling capacity
      
      const theta = u * Math.PI * 2;
      const flowPhase = v * Math.PI * 4;
      const radius = scale * (1 + 0.3 * Math.sin(flowPhase));
      
      const flowSpiral = Q * 0.02 * v;
      const turbulentMix = Math.sin(theta * 8 + flowPhase) * m_dot * 0.1;
      
      const x = radius * Math.cos(theta + flowSpiral);
      const y = radius * Math.sin(theta + flowSpiral);
      const z = (v - 0.5) * scale * 2 + turbulentMix;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 4.18, c: 10, d: 3, uSegments: 96, vSegments: 96 })
  },

  // ============================================================================
  // POWER USAGE EFFECTIVENESS - PUE = Total Power / IT Power
  // ============================================================================
  
  pue_efficiency_surface: {
    name: "⚡ PUE Surface: Total/IT Power Efficiency",
    description: "Power Usage Effectiveness visualization. Lower PUE (closer to 1.0) indicates higher efficiency.",
    equation: (u, v, params) => {
      const totalPower = params.a ?? 1.5;  // Total facility power (normalized)
      const itPower = params.b ?? 1;       // IT equipment power
      const scale = params.c ?? 5;         // Visualization scale
      
      const PUE = totalPower / Math.max(itPower, 0.1);
      const efficiency = 1 / PUE;         // Higher is better
      
      const theta = u * Math.PI * 2;
      const r = v * scale;
      
      const efficiencyRings = efficiency * Math.sin(r * 3) * 0.5;
      const height = (1 - efficiency) * 3;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = height + efficiencyRings;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1.2, b: 1, c: 5, uSegments: 96, vSegments: 72 })
  },

  // ============================================================================
  // COEFFICIENT OF PERFORMANCE - COP = Cooling Output / Power Input
  // ============================================================================
  
  cop_coefficient_performance: {
    name: "❄️ COP: Cooling Output/Power Input",
    description: "Coefficient of Performance showing cooling efficiency. Water-cooled chillers can achieve COP 4-7.",
    equation: (u, v, params) => {
      const coolingOutput = params.a ?? 100;  // Cooling output (kW)
      const powerInput = params.b ?? 20;      // Power input (kW)
      const scale = params.c ?? 4;            // Visualization scale
      
      const COP = coolingOutput / Math.max(powerInput, 0.1);
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const baseRadius = scale * Math.pow(COP / 5, 0.5);
      const efficiencyWave = Math.sin(theta * 4) * Math.cos(phi * 3) * COP * 0.1;
      const radius = baseRadius + efficiencyWave;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 100, b: 20, c: 4, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 72 })
  },

  // ============================================================================
  // THERMAL RESISTANCE - R_th = DT / Q
  // ============================================================================
  
  thermal_resistance_network: {
    name: "🔌 Thermal Resistance: R_th = DT/Q",
    description: "Thermal resistance network showing heat flow barriers. Higher R_th means better insulation but worse heat dissipation.",
    equation: (u, v, params) => {
      const deltaT = params.a ?? 50;     // Temperature difference (°C)
      const Q = params.b ?? 100;         // Heat flow (W)
      const scale = params.c ?? 4;       // Visualization scale
      
      const R_th = deltaT / Math.max(Q, 0.1);  // Thermal resistance (°C/W)
      
      const x = (u - 0.5) * scale * 2;
      const y = (v - 0.5) * scale * 2;
      
      const resistanceLayers = Math.floor(R_th * 10);
      const layerHeight = Math.sin(x * resistanceLayers) * Math.sin(y * resistanceLayers);
      const heatPathway = Math.exp(-(x * x + y * y) * 0.1) * (1 - R_th);
      
      const z = layerHeight * R_th + heatPathway * 2;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 50, b: 100, c: 4, uSegments: 128, vSegments: 128 })
  },

  // ============================================================================
  // JUNCTION TEMPERATURE - T_junction = T_ambient + Q × (R_jc + R_cs + R_sa)
  // ============================================================================
  
  junction_temperature_surface: {
    name: "🔥 Junction Temp: T_j = T_amb + Q×ΣR",
    description: "Chip junction temperature visualization showing thermal stack from junction to ambient.",
    equation: (u, v, params) => {
      const T_ambient = params.a ?? 25;   // Ambient temperature (°C)
      const Q = params.b ?? 350;          // Heat flow (W) - GPU level
      const R_jc = params.c ?? 0.05;      // Junction-to-case (°C/W)
      const R_cs = params.d ?? 0.1;       // Case-to-sink (°C/W)
      const R_sa = params.e ?? 0.2;       // Sink-to-ambient (°C/W)
      const scale = params.f ?? 4;        // Scale
      
      const R_total = R_jc + R_cs + R_sa;
      const T_junction = T_ambient + Q * R_total;
      
      const theta = u * Math.PI * 2;
      const layerDepth = v;
      
      const localR = R_jc * (1 - layerDepth) + R_cs * layerDepth * (1 - layerDepth) + R_sa * layerDepth;
      const localTemp = T_ambient + Q * localR;
      
      const radius = scale * (1 - layerDepth * 0.5);
      const heatSpread = Math.sin(theta * 8) * (localTemp - T_ambient) * 0.01;
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = (localTemp - T_ambient) * 0.05 + heatSpread;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 25, b: 350, c: 0.05, d: 0.1, e: 0.2, f: 4, uSegments: 96, vSegments: 72 })
  },

  // ============================================================================
  // NUSSELT NUMBER CONVECTION - Nu = h × L / k
  // ============================================================================
  
  nusselt_convection_surface: {
    name: "🌀 Nusselt Number: Nu = hL/k (Convection)",
    description: "Convective heat transfer coefficient visualization. Higher Nu indicates stronger convection.",
    equation: (u, v, params) => {
      const h = params.a ?? 500;         // Heat transfer coefficient (W/m²·K)
      const L = params.b ?? 0.1;         // Characteristic length (m)
      const k = params.c ?? 0.6;         // Thermal conductivity (W/m·K) - water
      const scale = params.d ?? 4;       // Scale
      
      const Nu = (h * L) / k;            // Nusselt number
      
      const theta = u * Math.PI * 2;
      const r = v * scale;
      
      const convectionCells = Math.sin(theta * Nu * 0.1) * Math.cos(r * 3);
      const height = convectionCells * Nu * 0.02 + Math.sin(r * 2) * 0.5;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = height;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 500, b: 0.1, c: 0.6, d: 4, uSegments: 96, vSegments: 72 })
  },

  // ============================================================================
  // REYNOLDS NUMBER TURBULENCE - Re = ρvL/μ
  // ============================================================================
  
  reynolds_flow_regime: {
    name: "🌊 Reynolds Number: Re = ρvL/μ (Turbulence)",
    description: "Flow regime visualization. Re < 2300 = laminar, Re > 4000 = turbulent.",
    equation: (u, v, params) => {
      const rho = params.a ?? 1000;      // Density (kg/m³) - water
      const velocity = params.b ?? 2;    // Velocity (m/s)
      const L = params.c ?? 0.05;        // Characteristic length (m)
      const mu = params.d ?? 0.001;      // Dynamic viscosity (Pa·s)
      const scale = params.e ?? 5;       // Scale
      
      const Re = (rho * velocity * L) / mu;  // Reynolds number
      const isTurbulent = Re > 4000;
      
      const x = (u - 0.5) * scale * 2;
      const flowProgress = v;
      const y = flowProgress * scale * 2;
      
      const baseZ = velocity * 0.3;
      let turbulence = 0;
      
      if (isTurbulent) {
        turbulence = Math.sin(x * 20 + flowProgress * 30) * Math.cos(x * 15) * 0.5;
        turbulence += Math.sin(x * 35 + flowProgress * 50) * 0.2;
      } else {
        turbulence = Math.sin(flowProgress * 6) * 0.1;
      }
      
      const z = baseZ + turbulence * (Re / 10000);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1000, b: 2, c: 0.05, d: 0.001, e: 5, uSegments: 128, vSegments: 96 })
  },

  // ============================================================================
  // TWO-PHASE IMMERSION COOLING - Pool Boiling
  // ============================================================================
  
  immersion_cooling_boiling: {
    name: "💧 Immersion Cooling: Two-Phase Boiling",
    description: "Two-phase immersion cooling with vapor bubble formation and nucleate boiling dynamics.",
    equation: (u, v, params) => {
      const heatFlux = params.a ?? 100;  // Heat flux (kW/m²)
      const satTemp = params.b ?? 50;    // Saturation temperature (°C)
      const scale = params.c ?? 4;       // Scale
      const time = params.time ?? 0;     // Animation time
      
      const theta = u * Math.PI * 2;
      const depth = v;
      
      const bubbleFreq = heatFlux * 0.1;
      const bubblePhase = time * 0.05;
      
      const bubblePattern = Math.sin(theta * 8 + bubblePhase) * 
                           Math.sin(depth * Math.PI * 4 + bubblePhase * 2);
      const buoyancy = depth * (1 + bubblePattern * 0.3);
      
      const radius = scale * (1 + bubblePattern * 0.15);
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = buoyancy * scale - scale * 0.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 100, b: 50, c: 4, uSegments: 96, vSegments: 96 })
  },

  // ============================================================================
  // HEAT EXCHANGER EFFECTIVENESS - ε = (T_in - T_out) / (T_in - T_coolant)
  // ============================================================================
  
  heat_exchanger_effectiveness: {
    name: "🔄 Heat Exchanger: ε = DT_actual/DT_max",
    description: "Heat exchanger effectiveness showing temperature drop across cooling surfaces.",
    equation: (u, v, params) => {
      const T_in = params.a ?? 80;       // Inlet temperature (°C)
      const T_out = params.b ?? 35;      // Outlet temperature (°C)
      const T_coolant = params.c ?? 20;  // Coolant temperature (°C)
      const scale = params.d ?? 4;       // Scale
      
      const epsilon = (T_in - T_out) / Math.max(T_in - T_coolant, 0.1);
      
      const theta = u * Math.PI * 2;
      const finPosition = v;
      
      const localTemp = T_in - (T_in - T_out) * finPosition;
      const finHeight = (localTemp - T_coolant) * 0.05;
      const finWave = Math.sin(theta * 24) * 0.3;
      
      const radius = scale * (0.5 + finPosition * 0.5);
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = finHeight + finWave * epsilon;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 80, b: 35, c: 20, d: 4, uSegments: 144, vSegments: 72 })
  },

  // ============================================================================
  // NTU METHOD - Number of Transfer Units
  // ============================================================================
  
  ntu_transfer_units: {
    name: "📊 NTU Method: UA/(ṁCp)_min",
    description: "Number of Transfer Units visualization for heat exchanger design and sizing.",
    equation: (u, v, params) => {
      const U = params.a ?? 500;         // Overall heat transfer coefficient (W/m²·K)
      const A = params.b ?? 10;          // Heat transfer area (m²)
      const mCp_min = params.c ?? 2000;  // Minimum capacity rate (W/K)
      const scale = params.d ?? 4;       // Scale
      
      const NTU = (U * A) / mCp_min;
      const epsilon = 1 - Math.exp(-NTU);  // Simplified for Cr=0
      
      const x = (u - 0.5) * scale * 2;
      const y = (v - 0.5) * scale * 2;
      
      const transferWaves = Math.sin(x * NTU * 2) * Math.cos(y * NTU * 2);
      const effectivenessHeight = epsilon * 3;
      
      const z = effectivenessHeight + transferWaves * 0.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 500, b: 10, c: 2000, d: 4, uSegments: 128, vSegments: 128 })
  },

  // ============================================================================
  // NAVIER-STOKES CFD - Momentum Equation
  // ============================================================================
  
  navier_stokes_momentum: {
    name: "🌀 Navier-Stokes: ρ(∂v/∂t + v·∇v) = -∇P + μ∇²v",
    description: "Computational Fluid Dynamics momentum equation visualization for thermal airflow simulation.",
    equation: (u, v, params) => {
      const rho = params.a ?? 1.2;       // Air density (kg/m³)
      const mu = params.b ?? 0.00001;    // Dynamic viscosity (Pa·s)
      const pressure = params.c ?? 101325; // Pressure (Pa)
      const velocity = params.d ?? 5;    // Inlet velocity (m/s)
      const scale = params.e ?? 5;       // Scale
      const time = params.time ?? 0;
      
      const x = (u - 0.5) * scale * 2;
      const y = (v - 0.5) * scale * 2;
      const r = Math.sqrt(x * x + y * y);
      
      const vorticity = Math.sin(r * 3 + time * 0.1) * velocity * 0.3;
      const pressureGradient = -Math.exp(-r * 0.5) * (pressure / 100000) * 0.5;
      const viscousDiffusion = Math.sin(x * 10) * Math.cos(y * 10) * mu * 10000;
      
      const z = vorticity + pressureGradient + viscousDiffusion;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1.2, b: 0.00001, c: 101325, d: 5, e: 5, uSegments: 128, vSegments: 128 })
  },

  // ============================================================================
  // HOT AISLE CONTAINMENT - Temperature Distribution
  // ============================================================================
  
  hot_cold_aisle_containment: {
    name: "🏢 Hot/Cold Aisle Containment",
    description: "Data center aisle containment showing temperature separation between hot and cold zones.",
    equation: (u, v, params) => {
      const T_cold = params.a ?? 18;     // Cold aisle temperature (°C)
      const T_hot = params.b ?? 38;      // Hot aisle temperature (°C)
      const efficiency = params.c ?? 0.9; // Containment effectiveness
      const scale = params.d ?? 5;       // Scale
      
      const aislePosition = u;           // 0 = cold, 1 = hot
      const rackPosition = v;
      
      const mixingFactor = 1 - efficiency;
      const localTemp = T_cold + (T_hot - T_cold) * (aislePosition + mixingFactor * Math.sin(rackPosition * Math.PI * 4) * 0.2);
      
      const x = (aislePosition - 0.5) * scale * 2;
      const y = (rackPosition - 0.5) * scale * 3;
      
      const rackStructure = Math.abs(Math.sin(rackPosition * Math.PI * 8)) * 0.5;
      const z = (localTemp - T_cold) * 0.1 + rackStructure;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 18, b: 38, c: 0.9, d: 5, uSegments: 96, vSegments: 144 })
  },

  // ============================================================================
  // DIRECT-TO-CHIP LIQUID COOLING - Microchannel Flow
  // ============================================================================
  
  direct_chip_liquid_cooling: {
    name: "💧 Direct-to-Chip: Microchannel Cooling",
    description: "GPU/CPU microchannel liquid cooling visualization with 500W+ heat removal capacity.",
    equation: (u, v, params) => {
      const heatLoad = params.a ?? 500;  // Heat load per chip (W)
      const flowRate = params.b ?? 0.5;  // Flow rate (L/min)
      const channelWidth = params.c ?? 0.1; // Channel width (mm) normalized
      const scale = params.d ?? 3;       // Scale
      const time = params.time ?? 0;
      
      const numChannels = 20;
      const channelIndex = Math.floor(u * numChannels);
      const inChannel = (u * numChannels) % 1;
      
      const flowDirection = channelIndex % 2 === 0 ? 1 : -1;
      const flowPhase = v + time * flowRate * 0.1 * flowDirection;
      
      const x = (u - 0.5) * scale * 2;
      const y = (v - 0.5) * scale * 2;
      
      const channelWalls = Math.abs(Math.sin(inChannel * Math.PI)) * channelWidth;
      const flowTurbulence = Math.sin(flowPhase * Math.PI * 8) * (heatLoad / 1000) * 0.2;
      const heatRemoval = (1 - v) * (heatLoad / 500) * 0.5;
      
      const z = channelWalls + flowTurbulence + heatRemoval;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 500, b: 0.5, c: 0.1, d: 3, uSegments: 144, vSegments: 96 })
  },

  // ============================================================================
  // FAN POWER AFFINITY LAWS - P₂/P₁ = (N₂/N₁)³
  // ============================================================================
  
  fan_affinity_laws: {
    name: "🌬️ Fan Affinity: P₂/P₁ = (N₂/N₁)³",
    description: "Fan power scaling visualization. Reducing fan speed 20% = 51% power reduction.",
    equation: (u, v, params) => {
      const N1 = params.a ?? 100;        // Base speed (%)
      const N2 = params.b ?? 80;         // New speed (%)
      const P1 = params.c ?? 1;          // Base power (kW)
      const scale = params.d ?? 4;       // Scale
      const time = params.time ?? 0;
      
      const speedRatio = N2 / N1;
      const powerRatio = Math.pow(speedRatio, 3);
      const P2 = P1 * powerRatio;
      
      const theta = u * Math.PI * 2 + time * speedRatio * 0.1;
      const r = v * scale;
      
      const bladeCurve = Math.sin(theta * 4) * r * 0.3;
      const powerSurface = P2 * r * 0.2;
      
      const x = r * Math.cos(theta) + bladeCurve * Math.cos(theta + Math.PI / 2);
      const y = r * Math.sin(theta) + bladeCurve * Math.sin(theta + Math.PI / 2);
      const z = powerSurface + Math.sin(r * 3) * 0.3;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 100, b: 80, c: 1, d: 4, uSegments: 96, vSegments: 72 })
  },

  // ============================================================================
  // COOLING TOWER EFFECTIVENESS
  // ============================================================================
  
  cooling_tower_effectiveness: {
    name: "🗼 Cooling Tower: (T_in - T_out)/(T_in - T_wb)",
    description: "Evaporative cooling tower performance with approach temperature visualization.",
    equation: (u, v, params) => {
      const T_w_in = params.a ?? 38;     // Water inlet temp (°C)
      const T_w_out = params.b ?? 28;    // Water outlet temp (°C)
      const T_wb = params.c ?? 25;       // Wet bulb temp (°C)
      const scale = params.d ?? 5;       // Scale
      const time = params.time ?? 0;
      
      const effectiveness = (T_w_in - T_w_out) / Math.max(T_w_in - T_wb, 0.1);
      const approach = T_w_out - T_wb;
      
      const theta = u * Math.PI * 2;
      const height = v;
      
      const radius = scale * (0.3 + height * 0.7) * (1 - height * 0.3);
      const evaporationPattern = Math.sin(theta * 6 + height * Math.PI * 4 + time * 0.1);
      const plume = evaporationPattern * effectiveness * 0.3 * (1 - height);
      
      const x = radius * Math.cos(theta) * (1 + plume * 0.5);
      const y = radius * Math.sin(theta) * (1 + plume * 0.5);
      const z = height * scale * 2 + plume * 0.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 38, b: 28, c: 25, d: 5, uSegments: 96, vSegments: 96 })
  },

  // ============================================================================
  // RACK POWER DENSITY LIMIT
  // ============================================================================
  
  rack_power_density_limit: {
    name: "📦 Rack Density: q_max/(R_th × A)",
    description: "Rack power density limits showing thermal wall. Air cooling ~30kW, liquid ~200kW+.",
    equation: (u, v, params) => {
      const q_max = params.a ?? 100;     // Max heat flux (kW/m²)
      const R_th = params.b ?? 0.01;     // Thermal resistance (K/W)
      const A = params.c ?? 0.5;         // Footprint area (m²)
      const isLiquid = params.d ?? 1;    // 0 = air, 1 = liquid cooling
      const scale = params.e ?? 4;       // Scale
      
      const densityLimit = q_max / (R_th * A * 1000);
      const coolingMultiplier = isLiquid > 0.5 ? 5 : 1;
      const effectiveLimit = densityLimit * coolingMultiplier;
      
      const rackX = Math.floor(u * 4) / 4;
      const rackY = Math.floor(v * 6) / 6;
      const localU = (u * 4) % 1;
      const localV = (v * 6) % 1;
      
      const x = (rackX - 0.5) * scale * 2 + (localU - 0.5) * scale * 0.4;
      const y = (rackY - 0.5) * scale * 3 + (localV - 0.5) * scale * 0.4;
      
      const rackHeight = effectiveLimit * 0.1;
      const heatSignature = Math.sin(localU * Math.PI) * Math.sin(localV * Math.PI) * rackHeight * 0.3;
      const z = rackHeight + heatSignature;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 100, b: 0.01, c: 0.5, d: 1, e: 4, uSegments: 96, vSegments: 144 })
  },

  // ============================================================================
  // GPU DYNAMIC POWER - P = C × V² × f × α
  // ============================================================================
  
  gpu_dynamic_power: {
    name: "🎮 GPU Power: P = CV²fα (Dynamic)",
    description: "GPU/AI accelerator dynamic power consumption visualization. Modern AI chips: 350-700W.",
    equation: (u, v, params) => {
      const C = params.a ?? 1;           // Capacitance (normalized)
      const V = params.b ?? 0.8;         // Voltage
      const f = params.c ?? 2.5;         // Frequency (GHz)
      const alpha = params.d ?? 0.7;     // Activity factor
      const scale = params.e ?? 4;       // Scale
      
      const P_dynamic = C * V * V * f * alpha;  // Dynamic power
      
      const theta = u * Math.PI * 2;
      const corePosition = v;
      
      const numCores = 12;
      const coreIndex = Math.floor(corePosition * numCores);
      const localActivity = alpha * (0.5 + 0.5 * Math.sin(coreIndex * 0.5));
      
      const localPower = C * V * V * f * localActivity;
      const radius = scale * (0.3 + corePosition * 0.7);
      
      const powerSpikes = Math.sin(theta * numCores) * localPower * 0.3;
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = localPower * 2 + powerSpikes;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 0.8, c: 2.5, d: 0.7, e: 4, uSegments: 144, vSegments: 72 })
  },

  // ============================================================================
  // EXERGY ANALYSIS - Ex = (h - h₀) - T₀(s - s₀)
  // ============================================================================
  
  exergy_thermodynamic_analysis: {
    name: "⚡ Exergy: Ex = Dh - T₀Ds",
    description: "Thermodynamic exergy analysis identifying true efficiency losses beyond simple heat transfer.",
    equation: (u, v, params) => {
      const h_diff = params.a ?? 100;    // Enthalpy difference (kJ/kg)
      const T0 = params.b ?? 298;        // Reference temperature (K)
      const s_diff = params.c ?? 0.2;    // Entropy difference (kJ/kg·K)
      const scale = params.d ?? 4;       // Scale
      
      const Ex = h_diff - T0 * s_diff;   // Exergy
      const exergyEfficiency = Ex / Math.max(h_diff, 0.1);
      
      const theta = u * Math.PI * 2;
      const processStage = v;
      
      const localExergy = Ex * (1 - processStage * 0.3);  // Exergy destruction
      const radius = scale * (0.5 + processStage);
      
      const irreversibility = T0 * s_diff * processStage;
      const exergySurface = Math.sin(theta * 6) * localExergy * 0.02;
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = localExergy * 0.03 - irreversibility * 0.1 + exergySurface;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 100, b: 298, c: 0.2, d: 4, uSegments: 96, vSegments: 72 })
  },

  // ============================================================================
  // WASTE HEAT RECOVERY - District Heating
  // ============================================================================
  
  waste_heat_recovery: {
    name: "♻️ Waste Heat Recovery: Q × η × $/kWh",
    description: "Data center waste heat recovery for district heating and industrial processes.",
    equation: (u, v, params) => {
      const Q_waste = params.a ?? 5000;  // Waste heat (kW)
      const eta_delivery = params.b ?? 0.85; // Delivery efficiency
      const recoveryTemp = params.c ?? 50; // Recovery temperature (°C)
      const scale = params.d ?? 5;       // Scale
      
      const Q_recovered = Q_waste * eta_delivery;
      
      const theta = u * Math.PI * 2;
      const pipeProgress = v;
      
      const heatLoss = (1 - eta_delivery) * pipeProgress;
      const currentHeat = Q_recovered * (1 - heatLoss);
      
      const pipeRadius = scale * 0.1;
      const mainRadius = scale * (0.3 + pipeProgress * 0.7);
      
      const heatVisualization = Math.sin(theta * 8 + pipeProgress * Math.PI * 6) * currentHeat * 0.0001;
      
      const x = (mainRadius + pipeRadius * Math.cos(theta * 12)) * Math.cos(theta);
      const y = (mainRadius + pipeRadius * Math.cos(theta * 12)) * Math.sin(theta);
      const z = pipeProgress * scale * 2 + heatVisualization;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 5000, b: 0.85, c: 50, d: 5, uSegments: 144, vSegments: 96 })
  },

  // ============================================================================
  // PHASE CHANGE MATERIALS - Energy Storage
  // ============================================================================
  
  phase_change_thermal_storage: {
    name: "🧊 PCM Thermal Storage: Q = m × h_fusion",
    description: "Phase Change Material energy storage for thermal buffering and load shifting.",
    equation: (u, v, params) => {
      const mass = params.a ?? 100;      // Mass (kg)
      const h_fusion = params.b ?? 200;  // Latent heat of fusion (kJ/kg)
      const meltTemp = params.c ?? 28;   // Melting temperature (°C)
      const scale = params.d ?? 4;       // Scale
      const time = params.time ?? 0;
      
      const Q_storage = mass * h_fusion; // Total storage capacity (kJ)
      
      const theta = u * Math.PI * 2;
      const depth = v;
      
      const phaseTransition = Math.sin(depth * Math.PI + time * 0.05);
      const isMelting = phaseTransition > 0;
      
      const crystallineStructure = isMelting ? 
        Math.sin(theta * 12) * 0.1 * (1 - phaseTransition) :
        Math.sin(theta * 24) * Math.sin(depth * Math.PI * 8) * 0.2;
      
      const radius = scale * (0.8 + 0.2 * phaseTransition);
      
      const x = radius * Math.cos(theta) * (1 + crystallineStructure);
      const y = radius * Math.sin(theta) * (1 + crystallineStructure);
      const z = (depth - 0.5) * scale * 2 + Q_storage * 0.0001 * phaseTransition;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 100, b: 200, c: 28, d: 4, uSegments: 144, vSegments: 96 })
  },

  // ============================================================================
  // WATER USAGE EFFECTIVENESS - WUE = L/kWh
  // ============================================================================
  
  water_usage_effectiveness: {
    name: "💧 WUE: Water Usage/IT Energy (L/kWh)",
    description: "Water Usage Effectiveness metric. Evaporative: 1-2 L/kWh, Closed-loop: <0.2 L/kWh.",
    equation: (u, v, params) => {
      const waterUsage = params.a ?? 1000; // Annual water (L)
      const itEnergy = params.b ?? 1000;   // IT energy (kWh)
      const isClosed = params.c ?? 0;      // 0 = evaporative, 1 = closed-loop
      const scale = params.d ?? 4;         // Scale
      const time = params.time ?? 0;
      
      const closedMultiplier = isClosed > 0.5 ? 0.1 : 1;
      const WUE = (waterUsage * closedMultiplier) / Math.max(itEnergy, 0.1);
      
      const theta = u * Math.PI * 2;
      const dropletPosition = v;
      
      const dropletFrequency = WUE * 10;
      const dropletPhase = Math.sin(dropletPosition * Math.PI * dropletFrequency + time * 0.1);
      
      const radius = scale * (0.5 + dropletPosition * 0.5);
      const dropletPerturbation = dropletPhase * 0.2 * WUE;
      
      const x = radius * Math.cos(theta) * (1 + dropletPerturbation);
      const y = radius * Math.sin(theta) * (1 + dropletPerturbation);
      const z = dropletPosition * scale * 2 - scale + dropletPerturbation * 0.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1000, b: 1000, c: 0, d: 4, uSegments: 96, vSegments: 96 })
  },

  // ============================================================================
  // CARBON USAGE EFFECTIVENESS - CUE = PUE × Grid Carbon
  // ============================================================================
  
  carbon_usage_effectiveness: {
    name: "🌍 CUE: PUE × Carbon Intensity × (1 - Renewable%)",
    description: "Carbon Usage Effectiveness combining power efficiency with grid carbon intensity.",
    equation: (u, v, params) => {
      const PUE = params.a ?? 1.2;       // Power Usage Effectiveness
      const gridCarbon = params.b ?? 400; // Grid carbon intensity (gCO2/kWh)
      const renewablePercent = params.c ?? 0.5; // Renewable fraction
      const scale = params.d ?? 4;       // Scale
      
      const CUE = PUE * gridCarbon * (1 - renewablePercent) / 1000; // kgCO2/kWh
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const cleanEnergy = renewablePercent;
      const dirtyEnergy = 1 - renewablePercent;
      
      const baseRadius = scale * (1 - CUE * 0.5);
      const carbonLayer = Math.sin(theta * 6) * Math.cos(phi * 4) * CUE * 2;
      const greenLayer = Math.sin(theta * 3 + phi * 2) * cleanEnergy * 0.5;
      
      const radius = baseRadius + carbonLayer * dirtyEnergy + greenLayer;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1.2, b: 400, c: 0.5, d: 4, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 72 })
  },

  // ============================================================================
  // ELECTROHYDRODYNAMIC COOLING - Enhanced Heat Transfer
  // ============================================================================
  
  ehd_electrohydrodynamic_cooling: {
    name: "⚡ EHD Cooling: h_enhanced = h × (1 + C×E²)",
    description: "Electrohydrodynamic enhanced cooling using electric fields to improve heat transfer.",
    equation: (u, v, params) => {
      const h_base = params.a ?? 100;
      const C_constant = params.b ?? 0.01;
      const E_field = params.c ?? 10;
      const scale = params.d ?? 4;
      const time = params.time ?? 0;
      
      const enhancement = 1 + C_constant * E_field * E_field;
      const h_enhanced = h_base * enhancement;
      
      const theta = u * Math.PI * 2;
      const fieldPosition = v;
      
      const fieldLines = Math.sin(theta * 12 + time * 0.1) * E_field * 0.05;
      const ionMovement = Math.sin(fieldPosition * Math.PI * 6 + theta * 4) * enhancement * 0.2;
      
      const radius = scale * (0.5 + fieldPosition * 0.5);
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = fieldLines + ionMovement + h_enhanced * 0.01 * fieldPosition;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 100, b: 0.01, c: 10, d: 4, uSegments: 144, vSegments: 96 })
  },

  // ============================================================================
  // ADVANCED NONLINEAR COOLING MODELS (from Publications)
  // ============================================================================

  polynomial_cop_surface: {
    name: "📈 Polynomial COP: a₀ + a₁L + a₂L² + a₃T + a₄T² + a₅LT",
    description: "Polynomial expansion of COP as function of load ratio L and ambient temperature T. Captures nonlinear efficiency behavior across operating range.",
    equation: (u, v, params) => {
      const a0 = params.a ?? 5;
      const a1 = params.b ?? -2;
      const a2 = params.c ?? 0.5;
      const a3 = params.d ?? -0.1;
      const a4 = params.e ?? 0.002;
      const a5 = params.f ?? 0.05;
      const scale = params.g ?? 4;
      
      const L = u;
      const T = v * 40 + 10;
      const T_norm = (T - 25) / 15;
      
      const COP = a0 + a1 * L + a2 * L * L + a3 * T_norm + a4 * T_norm * T_norm + a5 * L * T_norm;
      const COP_clamped = Math.max(1, Math.min(8, COP));
      
      const x = (u - 0.5) * scale * 2;
      const y = (v - 0.5) * scale * 2;
      const z = COP_clamped * 0.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 5, b: -2, c: 0.5, d: -0.1, e: 0.002, f: 0.05, g: 4, uSegments: 96, vSegments: 72 })
  },

  rational_cop_model: {
    name: "📊 Rational COP: (a₀+a₁L+a₂L²)/(1+a₃L+a₄T+a₅LT)",
    description: "Rational function COP model providing asymptotic behavior for extreme operating conditions. Better extrapolation than polynomial.",
    equation: (u, v, params) => {
      const a0 = params.a ?? 6;
      const a1 = params.b ?? -1;
      const a2 = params.c ?? 0.2;
      const a3 = params.d ?? 0.3;
      const a4 = params.e ?? 0.02;
      const a5 = params.f ?? 0.01;
      const scale = params.g ?? 4;
      
      const L = u;
      const T = v;
      
      const numerator = a0 + a1 * L + a2 * L * L;
      const denominator = 1 + a3 * L + a4 * T + a5 * L * T;
      const COP = numerator / Math.max(denominator, 0.1);
      const COP_clamped = Math.max(1, Math.min(10, COP));
      
      const theta = u * Math.PI * 2;
      const r = v * scale;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = COP_clamped * 0.4;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 6, b: -1, c: 0.2, d: 0.3, e: 0.02, f: 0.01, g: 4, uSegments: 96, vSegments: 72 })
  },

  bezier_cop_curve: {
    name: "🎯 Bezier COP: Σᵢ Bᵢ(t)Pᵢ (Manufacturer Curves)",
    description: "Cubic Bezier curve interpolation for manufacturer chiller performance data. Smooth efficiency curves from control points.",
    equation: (u, v, params) => {
      const P0 = params.a ?? 2;
      const P1 = params.b ?? 5;
      const P2 = params.c ?? 6;
      const P3 = params.d ?? 4;
      const scale = params.e ?? 4;
      
      const t = u;
      const loadLevel = v;
      
      const B0 = Math.pow(1 - t, 3);
      const B1 = 3 * Math.pow(1 - t, 2) * t;
      const B2 = 3 * (1 - t) * t * t;
      const B3 = Math.pow(t, 3);
      
      const COP = B0 * P0 + B1 * P1 + B2 * P2 + B3 * P3;
      const loadModifier = 1 + 0.3 * Math.sin(loadLevel * Math.PI * 2);
      
      const x = (u - 0.5) * scale * 2;
      const y = (v - 0.5) * scale * 2;
      const z = COP * loadModifier * 0.4;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 5, c: 6, d: 4, e: 4, uSegments: 96, vSegments: 72 })
  },

  // ============================================================================
  // CROSS-DOMAIN MATHEMATICAL DNA (from Publications)
  // ============================================================================

  unified_polar_field: {
    name: "🌀 Unified Polar: A×exp(-r/λ)×cos(nθ)×r^α",
    description: "Universal polar field generator shared by thermal, fluid, quantum, and gravitational systems. Same mathematical DNA across domains.",
    equation: (u, v, params) => {
      const amplitude = params.a ?? 3;
      const decayLength = params.b ?? 2;
      const modeNumber = params.c ?? 2;
      const spiralExponent = params.d ?? 0.5;
      const phase = params.e ?? 0;
      const scale = params.f ?? 4;
      
      const theta = u * Math.PI * 2;
      const r = v * scale;
      
      const radialDecay = amplitude * Math.exp(-r / Math.max(decayLength, 0.1));
      const angularMod = Math.cos(modeNumber * theta + phase);
      const spiralGrowth = Math.pow(r + 0.1, spiralExponent);
      
      const fieldValue = radialDecay * angularMod * spiralGrowth;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = fieldValue;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 2, c: 2, d: 0.5, e: 0, f: 4, uSegments: 96, vSegments: 72 })
  },

  interference_enhanced_cooling: {
    name: "🌊 Interference Cooling: T₀×exp(-r²/4αt)×[1+m×cos(k₁x)×cos(k₂y)]",
    description: "Wave interference principles applied to thermal optimization. Creates thermal standing waves that enhance convection.",
    equation: (u, v, params) => {
      const T0 = params.a ?? 100;
      const alpha = params.b ?? 1;
      const t = params.c ?? 1;
      const modDepth = params.d ?? 0.5;
      const k1 = params.e ?? 4;
      const k2 = params.f ?? 4;
      const scale = params.g ?? 4;
      
      const x = (u - 0.5) * scale * 2;
      const y = (v - 0.5) * scale * 2;
      const r_sq = x * x + y * y;
      
      const baseThermal = T0 * Math.exp(-r_sq / (4 * alpha * Math.max(t, 0.01)));
      const interferenceFactor = 1 + modDepth * Math.cos(k1 * x) * Math.cos(k2 * y);
      const T_enhanced = baseThermal * interferenceFactor;
      
      const z = T_enhanced * 0.03;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 100, b: 1, c: 1, d: 0.5, e: 4, f: 4, g: 4, uSegments: 128, vSegments: 128 })
  },

  spherical_harmonic_cop: {
    name: "⚛️ Spherical Harmonic COP: Σₗₘ cₗₘYₗᵐ(θ,φ)",
    description: "Efficiency surface fit to spherical harmonic basis, analogous to quantum orbital probability clouds. Bridges thermal and quantum mathematics.",
    equation: (u, v, params) => {
      const c00 = params.a ?? 5;
      const c10 = params.b ?? 1;
      const c20 = params.c ?? 0.5;
      const c11_real = params.d ?? 0.3;
      const scale = params.e ?? 4;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const Y00 = 0.5 * Math.sqrt(1 / Math.PI);
      const Y10 = 0.5 * Math.sqrt(3 / Math.PI) * Math.cos(phi);
      const Y20 = 0.25 * Math.sqrt(5 / Math.PI) * (3 * Math.cos(phi) * Math.cos(phi) - 1);
      const Y11 = -0.5 * Math.sqrt(3 / (2 * Math.PI)) * Math.sin(phi) * Math.cos(theta);
      
      const COP = c00 * Y00 + c10 * Y10 + c20 * Y20 + c11_real * Y11;
      const COP_normalized = (COP + 2) * 1.5;
      
      const radius = scale * (0.5 + COP_normalized * 0.15);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 5, b: 1, c: 0.5, d: 0.3, e: 4, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 72 })
  },

  spiral_flow_structure: {
    name: "🌀 Spiral Flow Structure: r(θ) = a·e^(bθ)",
    description: "Beyond Darwin High-Priority Pattern #6: Logarithmic spiral flow unifying galaxy arms, DNA helix, tornado vortices, and thermal convection cells. Fifth harmonic (frequency 243, wavelength 1/243).",
    equation: (u, v, params) => {
      const spiralA = params.a ?? 0.5;
      const spiralB = params.b ?? 0.2;
      const height = params.c ?? 4;
      const turns = params.d ?? 3;
      const radiusScale = params.e ?? 3;
      
      const theta = u * 2 * Math.PI * turns;
      const t = v;
      
      const r = spiralA * Math.exp(spiralB * theta);
      const normalizedR = Math.min(r, radiusScale);
      
      const x = normalizedR * Math.cos(theta);
      const y = normalizedR * Math.sin(theta);
      const z = (t - 0.5) * height + 0.1 * Math.sin(5 * theta);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 0.5, b: 0.2, c: 4, d: 3, e: 3, uSegments: 128, vSegments: 64 })
  }
};

export const THERMAL_ENGINEERING_SHAPE_COUNT = Object.keys(THERMAL_ENGINEERING_SHAPES).length;

export const THERMAL_ENGINEERING_CATEGORY = {
  id: 'thermal_engineering',
  name: 'Thermal Engineering & Data Center Cooling 🔥',
  icon: '🔥',
  description: `AI Infrastructure Thermal Engineering: ${THERMAL_ENGINEERING_SHAPE_COUNT} parametric surfaces covering heat dissipation (Q=P×(1-η)), PUE/COP efficiency metrics, Navier-Stokes CFD, Reynolds turbulence, immersion cooling, heat exchangers (NTU method), GPU power dynamics (CV²fα), exergy analysis, and sustainability metrics (WUE/CUE).`,
  engineDynamics: {
    primaryType: 'wave' as const,
    symmetryOrder: 4,
    influenceFactors: ['heat_transfer', 'fluid_dynamics', 'thermodynamic_efficiency', 'CFD_simulation']
  },
  shapes: Object.keys(THERMAL_ENGINEERING_SHAPES)
};

export default THERMAL_ENGINEERING_SHAPES;
