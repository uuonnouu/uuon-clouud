
/**
 * EARTH & ENVIRONMENTAL SCIENCES PARAMETRIC SHAPES
 * Comprehensive implementation covering geology, oceanography, and meteorology
 * © 2025 UUON Foundation Inc.
 */

import { ParametricSurface, getCleanDefaults } from '../types/shapes';

export const EARTH_SCIENCES_SHAPES: Record<string, ParametricSurface> = {

  // 🌍 GEOLOGY
  plate_tectonics_simulation: {
    name: "🌍 Plate Tectonics Simulation",
    equation: (u, v, params) => {
      const a = params.d ?? 4;
      const d = params.g ?? 0; // Geological time
      const e = params.h ?? 1; // Convection intensity
      
      const longitude = (u - 0.5) * 4 * Math.PI;
      const latitude = (v - 0.5) * 2 * Math.PI;
      
      // Major plate boundaries
      const mid_atlantic_ridge = Math.exp(-Math.pow(longitude - Math.PI, 2) * 2);
      const pacific_ring = Math.exp(-Math.pow(latitude - Math.PI * 0.3, 2) * 1.5) * 
                          Math.sin(longitude * 2);
      
      // Mantle convection (simplified)
      const convection = e * 0.5 * Math.sin(longitude * 1.5 + d) * Math.sin(latitude * 2 + d * 0.5);
      
      // Elevation changes due to tectonics
      const elevation = a * (
        0.2 + mid_atlantic_ridge * 0.3 + // Mid-ocean ridge
        pacific_ring * 0.4 + // Mountain ranges
        convection * 0.2 // Mantle influence
      );
      
      // Earth surface coordinates
      const radius = 6371 + elevation; // Earth radius + topography (km scale normalized)
      const x = radius * 0.001 * Math.sin(latitude) * Math.cos(longitude);
      const y = radius * 0.001 * Math.sin(latitude) * Math.sin(longitude);
      const z = radius * 0.001 * Math.cos(latitude);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, g: 0, h: 1, uSegments: 120, vSegments: 80 })
  },

  mineral_crystal_growth: {
    name: "🌍 Mineral Crystal Growth Patterns",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1.5;
      const c = params.f ?? 1;
      const d = params.g ?? 0; // Growth time
      
      const growth_stage = d;
      const crystal_face = Math.floor(u * 6); // 6 crystal faces
      const face_position = (u * 6) % 1;
      const surface_param = v;
      
      // Crystal system (cubic, hexagonal, etc.)
      const face_angles = [0, Math.PI/3, 2*Math.PI/3, Math.PI, 4*Math.PI/3, 5*Math.PI/3];
      const face_angle = face_angles[crystal_face % 6];
      
      // Growth rate varies by crystallographic direction
      const growth_rate = 1 + 0.3 * Math.sin(face_angle * 3) + growth_stage * 0.5;
      
      // Face geometry
      const face_size = a * growth_rate;
      const face_x = face_size * Math.cos(face_angle) * (1 - face_position);
      const face_y = face_size * Math.sin(face_angle) * (1 - face_position);
      
      // Surface roughness and crystal defects
      const surface_roughness = b * 0.1 * Math.sin(surface_param * 15 * Math.PI);
      const defect_pattern = c * 0.05 * Math.sin(face_position * 8 * Math.PI) * 
                            Math.sin(surface_param * 12 * Math.PI);
      
      const x = face_x + surface_roughness;
      const y = face_y + defect_pattern;
      const z = surface_param * c + defect_pattern * 0.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1.5, f: 1, g: 0, uSegments: 72, vSegments: 48 })
  },

  volcanic_eruption_model: {
    name: "🌍 Volcanic Eruption Dynamics",
    equation: (u, v, params) => {
      const a = params.d ?? 3; // Volcano size
      const b = params.e ?? 2; // Eruption intensity
      const d = params.g ?? 0; // Eruption phase
      
      const radial_distance = u;
      const height_param = v;
      const angle = height_param * 2 * Math.PI;
      
      // Volcano cone shape
      const cone_height = a * 1.5;
      const cone_radius = a * (1 - height_param * 0.8);
      
      // Eruption column
      let eruption_height = 0;
      let eruption_spread = 0;
      
      if (d > 0) {
        eruption_height = b * d * 2;
        eruption_spread = Math.min(d * 0.5, 1) * a * 0.3;
        
        // Pyroclastic flow
        if (height_param < 0.3 && d > 0.5) {
          const flow_speed = (d - 0.5) * 2;
          eruption_spread += flow_speed * a * 0.4 * (1 - height_param * 3);
        }
      }
      
      const base_radius = cone_radius + eruption_spread;
      const total_height = cone_height * height_param + eruption_height;
      
      // Add volcanic bombs and ash distribution
      const volcanic_debris = b * 0.2 * Math.sin(angle * 8) * Math.sin(radial_distance * 6 * Math.PI) * d;
      
      const x = (base_radius + volcanic_debris) * Math.cos(angle) * radial_distance;
      const y = (base_radius + volcanic_debris) * Math.sin(angle) * radial_distance;
      const z = total_height + volcanic_debris * 0.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 2, g: 0, uSegments: 80, vSegments: 60 })
  },

  // 🌊 OCEANOGRAPHY
  ocean_current_system: {
    name: "🌊 Ocean Current Circulation",
    equation: (u, v, params) => {
      const a = params.d ?? 4; // Ocean basin size
      const b = params.e ?? 1.5; // Current strength
      const d = params.g ?? 0; // Time/seasonal variation
      
      const longitude = u * 2 * Math.PI;
      const latitude = (v - 0.5) * Math.PI; // -π/2 to π/2
      
      // Major ocean currents (Gulf Stream, Kuroshio, etc.)
      const gulf_stream = Math.exp(-Math.pow(longitude - Math.PI * 0.8, 2) * 2) *
                         Math.exp(-Math.pow(latitude - Math.PI * 0.15, 2) * 3);
      
      const kuroshio = Math.exp(-Math.pow(longitude - Math.PI * 1.7, 2) * 2) *
                      Math.exp(-Math.pow(latitude - Math.PI * 0.15, 2) * 3);
      
      // Antarctic Circumpolar Current
      const acc = Math.exp(-Math.pow(latitude + Math.PI * 0.35, 2) * 8) * 
                  Math.sin(longitude * 3);
      
      // Thermohaline circulation
      const thermohaline = b * 0.3 * Math.sin(longitude * 2 + d) * 
                          Math.sin(latitude * 4 + d * 0.5);
      
      // Current velocity field
      const current_strength = b * (gulf_stream + kuroshio + acc * 0.5) + thermohaline;
      
      // Ocean surface with current effects
      const ocean_radius = 6371; // Earth radius (normalized)
      const surface_height = current_strength * 0.1; // Sea surface height anomaly
      
      const radius = (ocean_radius + surface_height) * 0.001;
      const x = radius * Math.cos(latitude) * Math.cos(longitude);
      const y = radius * Math.cos(latitude) * Math.sin(longitude);
      const z = radius * Math.sin(latitude);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 1.5, g: 0, uSegments: 100, vSegments: 80 })
  },

  tidal_dynamics_model: {
    name: "🌊 Tidal Dynamics",
    equation: (u, v, params) => {
      const a = params.d ?? 3; // Tidal amplitude
      const d = params.g ?? 0; // Time (tidal phase)
      
      const position = u * 2 * Math.PI; // Position around coastline
      const depth = v; // Water depth (0 = surface, 1 = seabed)
      
      // Lunar tidal force (M2 constituent - 12.42 hour period)
      const lunar_tide = a * Math.sin(position - d * 2 * Math.PI / 12.42);
      
      // Solar tidal force (S2 constituent - 12 hour period)  
      const solar_tide = a * 0.46 * Math.sin(position - d * 2 * Math.PI / 12);
      
      // Tidal harmonics (overtides)
      const m4_tide = a * 0.1 * Math.sin(2 * (position - d * 2 * Math.PI / 12.42));
      
      // Total tidal elevation
      const tidal_height = lunar_tide + solar_tide + m4_tide;
      
      // Tidal current velocity (phase-shifted from elevation)
      const tidal_current = a * 0.3 * Math.cos(position - d * 2 * Math.PI / 12.42 + Math.PI/2);
      
      // Depth-dependent flow profile
      const depth_factor = Math.sin(depth * Math.PI * 0.5); // Stronger at surface
      const current_effect = tidal_current * depth_factor;
      
      const radius = 2 + depth * 1.5;
      const x = (radius + current_effect * 0.2) * Math.cos(position);
      const y = (radius + current_effect * 0.2) * Math.sin(position);
      const z = tidal_height * (1 - depth * 0.8); // Tidal effect decreases with depth
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, g: 0, uSegments: 96, vSegments: 40 })
  },

  // 🌤️ METEOROLOGY
  weather_pattern_simulation: {
    name: "🌤️ Weather Pattern Simulation",
    equation: (u, v, params) => {
      const a = params.d ?? 3; // Atmospheric scale
      const b = params.e ?? 2; // Storm intensity
      const d = params.g ?? 0; // Time evolution
      
      const longitude = u * 4 * Math.PI;
      const latitude = (v - 0.5) * 2 * Math.PI;
      
      // Pressure systems
      const high_pressure = Math.exp(-Math.pow(longitude - Math.PI, 2) - Math.pow(latitude - Math.PI * 0.3, 2));
      const low_pressure = -Math.exp(-Math.pow(longitude - 3 * Math.PI, 2) - Math.pow(latitude + Math.PI * 0.2, 2));
      
      // Jet stream
      const jet_stream = b * 0.5 * Math.exp(-Math.pow(latitude - Math.PI * 0.4, 2) * 5) * 
                        Math.sin(longitude * 1.5 + d);
      
      // Storm systems (cyclones)
      const storm_center_lon = 2 * Math.PI + d * 0.3;
      const storm_center_lat = Math.PI * 0.2;
      const storm_distance = Math.sqrt(Math.pow(longitude - storm_center_lon, 2) + 
                                     Math.pow(latitude - storm_center_lat, 2));
      
      const cyclone = b * Math.exp(-storm_distance * 2) * 
                     Math.sin(storm_distance * 8 - d * 4); // Rotating storm
      
      // Atmospheric pressure field
      const pressure = a + high_pressure * b + low_pressure * b + jet_stream + cyclone;
      
      // Cloud formation altitude
      const cloud_altitude = Math.max(0, pressure - a + 0.5);
      
      const x = a * Math.cos(latitude) * Math.cos(longitude);
      const y = a * Math.cos(latitude) * Math.sin(longitude);
      const z = a * Math.sin(latitude) + cloud_altitude * 0.3;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 2, g: 0, uSegments: 120, vSegments: 80 })
  },

  climate_change_model: {
    name: "🌤️ Climate Change Temperature Model",
    equation: (u, v, params) => {
      const a = params.d ?? 3; // Global scale
      const b = params.e ?? 1.5; // Warming amplitude
      const d = params.g ?? 0; // Time (years from baseline)
      
      const longitude = u * 2 * Math.PI;
      const latitude = (v - 0.5) * Math.PI;
      
      // Base temperature distribution (latitude-dependent)
      const base_temp = 15 - 30 * Math.abs(Math.sin(latitude)); // Warmer at equator
      
      // Global warming trend
      const warming_trend = b * d * 0.1; // ~0.1°C per decade
      
      // Regional warming variations
      const arctic_amplification = b * 2 * d * 0.1 * 
                                  Math.exp(-Math.pow(latitude - Math.PI * 0.4, 2) * 2);
      
      // Ocean thermal inertia (slower warming over oceans)
      const ocean_mask = Math.sin(longitude * 3) * Math.sin(latitude * 2);
      const thermal_inertia = ocean_mask > 0 ? 0.7 : 1.0; // Land warms faster
      
      // Climate feedback effects
      const ice_albedo_feedback = b * 0.3 * d * 0.05 * 
                                 (Math.abs(latitude) > Math.PI * 0.3 ? 1 : 0);
      
      // Total temperature anomaly
      const temp_anomaly = (warming_trend + arctic_amplification + ice_albedo_feedback) * thermal_inertia;
      const total_temp = base_temp + temp_anomaly;
      
      // Earth surface with temperature-driven elevation changes
      const thermal_expansion = total_temp * 0.01; // Thermal effects on topography
      const radius = (6371 + thermal_expansion) * 0.001;
      
      const x = radius * Math.cos(latitude) * Math.cos(longitude);
      const y = radius * Math.cos(latitude) * Math.sin(longitude);
      const z = radius * Math.sin(latitude) + temp_anomaly * 0.05; // Temperature as height
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1.5, g: 0, uSegments: 100, vSegments: 60 })
  },

  atmospheric_circulation: {
    name: "🌤️ Atmospheric Circulation Patterns",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const b = params.e ?? 2;
      const d = params.g ?? 0;
      
      const longitude = u * 2 * Math.PI;
      const latitude = (v - 0.5) * Math.PI;
      
      const hadley_north = Math.exp(-Math.pow(latitude - Math.PI * 0.15, 2) * 8) * Math.sin(longitude + d);
      const hadley_south = Math.exp(-Math.pow(latitude + Math.PI * 0.15, 2) * 8) * Math.sin(longitude + d);
      const ferrel_north = Math.exp(-Math.pow(latitude - Math.PI * 0.3, 2) * 6) * Math.sin(longitude - d * 0.7);
      const ferrel_south = Math.exp(-Math.pow(latitude + Math.PI * 0.3, 2) * 6) * Math.sin(longitude - d * 0.7);
      const polar_north = Math.exp(-Math.pow(latitude - Math.PI * 0.42, 2) * 10) * Math.sin(longitude + d * 1.3);
      const polar_south = Math.exp(-Math.pow(latitude + Math.PI * 0.42, 2) * 10) * Math.sin(longitude + d * 1.3);
      
      const circulation = b * (hadley_north + hadley_south - ferrel_north - ferrel_south + polar_north * 0.5 + polar_south * 0.5);
      const coriolis_deflection = b * 0.2 * Math.sin(latitude) * Math.cos(longitude + d);
      
      const altitude = a + circulation * 0.2;
      const x = altitude * Math.cos(latitude) * Math.cos(longitude) + coriolis_deflection * 0.1;
      const y = altitude * Math.cos(latitude) * Math.sin(longitude);
      const z = altitude * Math.sin(latitude) + circulation * 0.1;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 2, g: 0, uSegments: 96, vSegments: 72 })
  },

  coral_reef_structure: {
    name: "🌊 Coral Reef Structure",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const b = params.e ?? 2;
      const theta = u * 2 * Math.PI;
      const depth = v * a;
      const coral_branches = Math.sin(theta * 8) * Math.cos(depth * 5) * 0.4;
      const reef_structure = b * (1 + 0.3*Math.sin(theta * 3) * Math.sin(depth * 2));
      const polyp_detail = 0.1 * Math.sin(theta * 20) * Math.sin(depth * 15);
      const x = (reef_structure + coral_branches) * Math.cos(theta);
      const y = (reef_structure + coral_branches) * Math.sin(theta);
      const z = depth + polyp_detail;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 2, uSegments: 96, vSegments: 72 })
  },

  deep_sea_pressure_effects: {
    name: "🌊 Deep Sea Pressure Effects",
    equation: (u, v, params) => {
      const a = params.d ?? 4;
      const b = params.e ?? 2;
      const depth = v * 11000;
      const position = u * 2 * Math.PI;
      const pressure_atm = 1 + depth / 10;
      const compression = 1 / (1 + pressure_atm * 0.00001);
      const density = 1.025 + depth * 0.00001;
      const r = b * compression * (1 + 0.1*Math.sin(position * 5));
      const x = r * Math.cos(position);
      const y = r * Math.sin(position);
      const z = -depth * a * 0.0003;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 2, uSegments: 64, vSegments: 80 })
  },

  fault_system_dynamics: {
    name: "🌍 Fault System Dynamics",
    equation: (u, v, params) => {
      const a = params.d ?? 4;
      const b = params.e ?? 2;
      const x_pos = (u - 0.5) * a * 2;
      const y_pos = (v - 0.5) * b * 2;
      const fault_offset = (x_pos > 0) ? 0.5 : -0.5;
      const stress = Math.exp(-x_pos*x_pos*2) * Math.sin(y_pos * 3);
      const deformation = 0.3 * Math.tanh(x_pos * 3) * Math.cos(y_pos * 2);
      const z = fault_offset + stress * 0.3 + deformation;
      return [x_pos, y_pos, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 2, uSegments: 80, vSegments: 60 })
  },

  hurricane_eye_wall: {
    name: "🌤️ Hurricane Eye Wall",
    equation: (u, v, params) => {
      const a = params.d ?? 4;
      const b = params.e ?? 3;
      const theta = u * 2 * Math.PI;
      const height = v * a;
      const eye_radius = 0.3;
      const eye_wall_radius = 1.2;
      const r = eye_radius + (eye_wall_radius - eye_radius) * (1 - Math.exp(-height * 0.5));
      const wind_spiral = 0.3 * Math.sin(theta * 3 + height * 2);
      const updraft = b * Math.exp(-Math.pow(height - a*0.6, 2) * 0.5);
      const x = (r + wind_spiral) * Math.cos(theta + height * 0.2);
      const y = (r + wind_spiral) * Math.sin(theta + height * 0.2);
      const z = height + updraft * 0.2;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 3, uSegments: 80, vSegments: 60 })
  },

  mountain_building_process: {
    name: "🌍 Mountain Building Process",
    equation: (u, v, params) => {
      const a = params.d ?? 4;
      const b = params.e ?? 3;
      const x_pos = (u - 0.5) * a * 2;
      const y_pos = (v - 0.5) * b * 2;
      const plate_collision = Math.exp(-x_pos*x_pos*0.5);
      const folding = Math.sin(x_pos * 3) * plate_collision;
      const thrust_faults = Math.tanh(x_pos * 2) * 0.5;
      const erosion = -0.1 * Math.abs(folding) * (1 + Math.sin(y_pos * 5));
      const z = plate_collision * 2 + folding * 0.5 + thrust_faults + erosion;
      return [x_pos, y_pos, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 3, uSegments: 80, vSegments: 60 })
  },

  thermohaline_circulation: {
    name: "🌊 Thermohaline Circulation",
    equation: (u, v, params) => {
      const a = params.d ?? 4;
      const b = params.e ?? 2;
      const lon = u * 2 * Math.PI;
      const lat = (v - 0.5) * Math.PI;
      const depth_factor = Math.sin(lat * 2) * 0.5;
      const surface_temp = Math.cos(lat) * a;
      const deep_current = -Math.sin(lat) * Math.cos(lon * 2) * b;
      const upwelling = Math.exp(-Math.pow(lat, 2) * 3) * Math.sin(lon * 4) * 0.5;
      const r = a + depth_factor;
      const x = r * Math.cos(lat) * Math.cos(lon);
      const y = r * Math.cos(lat) * Math.sin(lon);
      const z = r * Math.sin(lat) + deep_current * 0.2 + upwelling;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 2, uSegments: 96, vSegments: 72 })
  },

  tornado_vortex_structure: {
    name: "🌤️ Tornado Vortex Structure",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const b = params.e ?? 2;
      const theta = u * 2 * Math.PI * 3;
      const height = v * a;
      const funnel_radius = b * (0.1 + 0.9 * (1 - v));
      const rotation_speed = 1 + height * 0.5;
      const debris_cloud = 0.2 * Math.sin(theta * 5 + height * 3) * (1 - v);
      const x = funnel_radius * Math.cos(theta * rotation_speed) + debris_cloud;
      const y = funnel_radius * Math.sin(theta * rotation_speed) + debris_cloud;
      const z = height;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 2, uSegments: 80, vSegments: 60 })
  }
};

export default EARTH_SCIENCES_SHAPES;
