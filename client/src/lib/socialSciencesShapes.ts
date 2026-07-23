
/**
 * SOCIAL SCIENCES & APPLIED SCIENCES PARAMETRIC SHAPES
 * Economics, Sociology, Political Science, Engineering applications
 * © 2025 UUON Foundation Inc.
 */

import { ParametricSurface, getCleanDefaults } from '../types/shapes';

export const SOCIAL_SCIENCES_SHAPES: Record<string, ParametricSurface> = {

  // 📊 ECONOMICS
  market_dynamics_visualization: {
    name: "📊 Market Dynamics Surface",
    equation: (u, v, params) => {
      const a = params.d ?? 3; // Market scale
      const b = params.e ?? 2; // Volatility
      const d = params.g ?? 0; // Time/market cycles
      
      const price_time = u * 10; // Price evolution over time
      const market_depth = v; // Market depth (bid/ask spread)
      
      // Base price trend with market cycles
      const trend = a * (1 + 0.1 * price_time + 0.3 * Math.sin(price_time * 0.5 + d));
      
      // Market volatility (higher at market open/close)
      const volatility = b * (0.3 + 0.7 * Math.exp(-Math.pow(market_depth - 0.5, 2) * 8)) *
                        Math.sin(price_time * 3 + d * 2) * 0.2;
      
      // Supply/demand imbalance
      const order_flow = b * 0.4 * Math.sin(price_time * 2) * 
                        Math.exp(-market_depth * 2); // Liquidity decreases with depth
      
      // Market microstructure effects
      const bid_ask_spread = 0.1 * a * (market_depth - 0.5);
      
      const price = trend + volatility + order_flow;
      
      const x = price_time * a * 0.3;
      const y = price + bid_ask_spread;
      const z = market_depth * a + volatility * 0.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 2, g: 0, uSegments: 80, vSegments: 40 })
  },

  supply_demand_curves: {
    name: "📊 Supply & Demand Equilibrium",
    equation: (u, v, params) => {
      const a = params.d ?? 2; // Market size
      const b = params.e ?? 1.5; // Elasticity
      const c = params.f ?? 1; // Shift factors
      
      const quantity = u * a * 2; // Quantity axis
      const price_level = v; // Price levels (0-1)
      
      // Demand curve (downward sloping)
      const demand_price = a * (1 - Math.pow(quantity / (a * 2), 1/b)) + 
                          c * 0.3 * Math.sin(quantity * 2); // Demand shifts
      
      // Supply curve (upward sloping) 
      const supply_price = a * Math.pow(quantity / (a * 2), b) + 
                          c * 0.2 * Math.cos(quantity * 1.5); // Supply shifts
      
      // Market equilibrium point
      const equilibrium_qty = a;
      const equilibrium_price = a * 0.5;
      const equilibrium_distance = Math.sqrt(Math.pow(quantity - equilibrium_qty, 2) + 
                                           Math.pow(price_level * a * 2 - equilibrium_price, 2));
      
      // Consumer/producer surplus visualization
      let surface_height;
      if (price_level * a * 2 < demand_price && quantity < equilibrium_qty) {
        // Consumer surplus area
        surface_height = (demand_price - price_level * a * 2) * 0.3;
      } else if (price_level * a * 2 > supply_price && quantity < equilibrium_qty) {
        // Producer surplus area
        surface_height = (price_level * a * 2 - supply_price) * 0.3;
      } else {
        surface_height = 0;
      }
      
      const x = quantity;
      const y = price_level * a * 2;
      const z = surface_height + Math.exp(-equilibrium_distance) * 0.5; // Equilibrium peak
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1.5, f: 1, uSegments: 60, vSegments: 60 })
  },

  // 👥 SOCIOLOGY
  social_network_analysis: {
    name: "👥 Social Network Graph",
    equation: (u, v, params) => {
      const a = params.d ?? 3; // Network size
      const b = params.e ?? 2; // Connection strength
      const c = params.f ?? 1.5; // Clustering coefficient
      
      const node_index = Math.floor(u * 20); // 20 nodes in network
      const connection_param = v;
      
      // Node positions using force-directed layout principles
      const node_angle = (node_index / 20) * 2 * Math.PI + 
                        0.3 * Math.sin(node_index * 1.3); // Some randomness
      
      // Node importance (degree centrality affects position)
      const centrality = 0.5 + 0.5 * Math.sin(node_index * 0.8);
      const node_radius = a * (0.3 + 0.7 * centrality);
      
      // Community structure (clustering)
      const community = Math.floor(node_index / 5); // 4 communities
      const community_offset = (community / 4) * 2 * Math.PI;
      const intra_community_radius = c * 0.4;
      
      // Edge bundling visualization
      const edge_strength = b * centrality * Math.sin(connection_param * Math.PI);
      
      const base_x = node_radius * Math.cos(node_angle + community_offset);
      const base_y = node_radius * Math.sin(node_angle + community_offset);
      
      // Add community clustering
      const cluster_x = base_x + intra_community_radius * Math.cos(node_index * 2.7);
      const cluster_y = base_y + intra_community_radius * Math.sin(node_index * 2.7);
      
      const x = cluster_x + edge_strength * 0.1;
      const y = cluster_y;
      const z = edge_strength * 0.3 + centrality * 0.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 2, f: 1.5, uSegments: 80, vSegments: 40 })
  },

  urban_development_model: {
    name: "👥 Urban Development Patterns",
    equation: (u, v, params) => {
      const a = params.d ?? 4; // City scale
      const b = params.e ?? 2; // Development intensity
      const d = params.g ?? 0; // Time/growth phase
      
      const x_coord = (u - 0.5) * a * 2;
      const y_coord = (v - 0.5) * a * 2;
      const distance_center = Math.sqrt(x_coord * x_coord + y_coord * y_coord);
      
      // Central Business District (CBD)
      const cbd_height = b * 2 * Math.exp(-Math.pow(distance_center, 2) * 0.5);
      
      // Residential zones (concentric rings)
      const residential_density = b * Math.exp(-distance_center * 0.5) * 
                                 (1 + 0.3 * Math.sin(distance_center * 3));
      
      // Transportation corridors
      const highway_angle_1 = Math.atan2(y_coord, x_coord);
      const highway_effect_1 = Math.exp(-Math.pow(highway_angle_1 - Math.PI * 0.25, 2) * 20) *
                              Math.exp(-Math.abs(distance_center - a * 0.7) * 2);
      
      const highway_effect_2 = Math.exp(-Math.pow(highway_angle_1 + Math.PI * 0.25, 2) * 20) *
                              Math.exp(-Math.abs(distance_center - a * 0.5) * 2);
      
      // Urban sprawl (time-dependent)
      const sprawl_factor = 1 + d * 0.5;
      const sprawl_height = b * 0.3 * Math.exp(-distance_center * 0.3 / sprawl_factor);
      
      // Green spaces (parks)
      const park_effect = -b * 0.4 * Math.exp(-Math.pow(distance_center - a * 0.4, 2) * 8) *
                         Math.sin(Math.atan2(y_coord, x_coord) * 4);
      
      const total_height = cbd_height + residential_density + 
                          (highway_effect_1 + highway_effect_2) * b * 0.5 + 
                          sprawl_height + park_effect;
      
      return [x_coord, y_coord, total_height];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 2, g: 0, uSegments: 80, vSegments: 80 })
  },

  // 🏛️ POLITICAL SCIENCE
  voting_system_analysis: {
    name: "🏛️ Electoral System Dynamics",
    equation: (u, v, params) => {
      const a = params.d ?? 3; // Political space scale
      const b = params.e ?? 2; // Polarization level
      const c = params.f ?? 1.5; // Voter turnout effect
      
      const ideology_x = (u - 0.5) * a * 2; // Left-right political spectrum
      const ideology_y = (v - 0.5) * a * 2; // Auth-lib political spectrum
      
      // Voter distribution (normal distribution around center-right)
      const voter_density = Math.exp(-((ideology_x - 0.3)**2 + ideology_y**2) * 0.5);
      
      // Political polarization effect
      const polarization = b * (Math.exp(-Math.pow(ideology_x + 1, 2)) + 
                               Math.exp(-Math.pow(ideology_x - 1, 2))) * 0.5;
      
      // Party positions
      const party_left = Math.exp(-Math.pow(ideology_x + a * 0.6, 2) * 2) * 
                        Math.exp(-Math.pow(ideology_y, 2) * 4);
      const party_right = Math.exp(-Math.pow(ideology_x - a * 0.6, 2) * 2) * 
                         Math.exp(-Math.pow(ideology_y, 2) * 4);
      const party_center = Math.exp(-Math.pow(ideology_x, 2) * 8) * 
                          Math.exp(-Math.pow(ideology_y, 2) * 8);
      
      // Electoral competitiveness
      const competitiveness = voter_density * (party_left + party_right + party_center * 0.5);
      
      // Voter turnout effects (higher in competitive areas)
      const turnout_effect = c * competitiveness;
      
      // Gerrymandering distortion
      const district_boundary = Math.sin(ideology_x * 3) * Math.sin(ideology_y * 2.5) * 0.2;
      
      const vote_share = voter_density * b + polarization + turnout_effect + district_boundary;
      
      return [ideology_x, ideology_y, vote_share];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 2, f: 1.5, uSegments: 70, vSegments: 70 })
  },

  // 🏭 INDUSTRIAL ENGINEERING  
  manufacturing_optimization: {
    name: "🏭 Manufacturing Process Optimization",
    equation: (u, v, params) => {
      const a = params.d ?? 3; // Production scale
      const b = params.e ?? 2; // Efficiency factor
      const c = params.f ?? 1.5; // Quality parameter
      
      const process_step = u * 8; // 8 manufacturing steps
      const resource_utilization = v;
      
      // Production throughput curve
      const throughput = a * (1 - Math.exp(-process_step * 0.3)) * resource_utilization;
      
      // Quality loss function (Taguchi)
      const target_quality = 0.7;
      const quality_loss = c * Math.pow(resource_utilization - target_quality, 2);
      
      // Bottleneck analysis
      const bottleneck_step = 3; // Step 3 is bottleneck
      const bottleneck_effect = Math.exp(-Math.pow(process_step - bottleneck_step, 2) * 2) * 
                               (1 - resource_utilization * 0.5);
      
      // Learning curve effect
      const learning_factor = 1 + 0.3 * Math.log(1 + process_step);
      
      // Overall equipment effectiveness (OEE)
      const availability = 0.85 + 0.15 * resource_utilization;
      const performance = b * resource_utilization * learning_factor;
      const quality_rate = 1 - quality_loss * 0.1;
      
      const oee = availability * performance * quality_rate * 0.1;
      const efficiency = throughput * learning_factor - quality_loss - bottleneck_effect + oee;
      
      return [process_step * a * 0.3, resource_utilization * a, efficiency];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 2, f: 1.5, uSegments: 64, vSegments: 50 })
  },

  // 🏗️ CIVIL ENGINEERING
  structural_load_analysis: {
    name: "🏗️ Structural Load Distribution",
    equation: (u, v, params) => {
      const a = params.d ?? 4; // Structure span
      const b = params.e ?? 2; // Load magnitude
      const c = params.f ?? 1.5; // Material stiffness
      
      const position_x = u * a; // Position along beam/structure
      const load_type = v; // Different loading conditions
      
      // Distributed load
      const distributed_load = b * Math.sin(Math.PI * position_x / a);
      
      // Point loads
      const point_load_1 = b * 2 * Math.exp(-Math.pow(position_x - a * 0.25, 2) * 20);
      const point_load_2 = b * 1.5 * Math.exp(-Math.pow(position_x - a * 0.75, 2) * 20);
      
      // Wind load (varying with height/position)
      const wind_load = b * 0.5 * (1 + 0.5 * position_x / a) * Math.sin(position_x * 3);
      
      // Select load type based on v parameter
      let applied_load;
      if (load_type < 0.33) {
        applied_load = distributed_load;
      } else if (load_type < 0.66) {
        applied_load = point_load_1 + point_load_2;
      } else {
        applied_load = wind_load;
      }
      
      // Beam deflection (simplified Euler-Bernoulli)
      const beam_stiffness = c * 1000; // EI
      const deflection = applied_load * Math.pow(position_x, 2) * 
                        (a * a - position_x * position_x) / (6 * beam_stiffness);
      
      // Stress concentration at supports
      const support_stress = Math.exp(-Math.pow(position_x, 2) * 2) + 
                            Math.exp(-Math.pow(position_x - a, 2) * 2);
      
      const total_displacement = deflection + support_stress * 0.2;
      
      return [position_x, applied_load * 0.1, total_displacement];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 2, f: 1.5, uSegments: 80, vSegments: 30 })
  },

  // ✈️ AEROSPACE ENGINEERING
  aerodynamic_flow_visualization: {
    name: "✈️ Aerodynamic Flow Patterns",
    equation: (u, v, params) => {
      const a = params.d ?? 3; // Airfoil chord length
      const b = params.e ?? 2; // Flow velocity
      const c = params.f ?? 1.5; // Angle of attack
      
      const chord_position = u; // 0 to 1 along airfoil chord
      const flow_height = (v - 0.5) * a; // Height above/below airfoil
      
      // NACA 4-digit airfoil profile (simplified)
      const thickness = 0.12; // 12% thickness
      const airfoil_thickness = thickness * a * (
        0.2969 * Math.sqrt(chord_position) -
        0.1260 * chord_position -
        0.3516 * chord_position * chord_position +
        0.2843 * Math.pow(chord_position, 3) -
        0.1015 * Math.pow(chord_position, 4)
      );
      
      // Flow field around airfoil
      const angle_of_attack = c * 0.1; // radians
      
      // Upper surface flow acceleration (Bernoulli)
      const upper_flow_speed = b * (1 + 0.3 * Math.sin(Math.PI * chord_position)) *
                              (flow_height > airfoil_thickness ? 1 : 0);
      
      // Lower surface flow deceleration
      const lower_flow_speed = b * (1 - 0.2 * Math.sin(Math.PI * chord_position)) *
                              (flow_height < -airfoil_thickness ? 1 : 0);
      
      // Circulation around airfoil (Kutta condition)
      const circulation_strength = b * angle_of_attack;
      const circulation = circulation_strength * Math.atan2(flow_height, chord_position * a);
      
      // Total flow speed
      const total_flow = upper_flow_speed + lower_flow_speed + circulation * 0.1;
      
      // Pressure distribution (inverse of velocity)
      const pressure = b * 2 - total_flow;
      
      // Boundary layer thickness
      const reynolds_number = 1e6; // Typical for aircraft
      const boundary_layer_thickness = a * 0.01 * Math.sqrt(chord_position) / 
                                     Math.sqrt(reynolds_number / 1e6);
      
      let z_coord;
      if (Math.abs(flow_height) < airfoil_thickness + boundary_layer_thickness) {
        // Inside boundary layer or airfoil
        z_coord = pressure * 0.3;
      } else {
        // Free stream
        z_coord = total_flow * 0.2;
      }
      
      return [chord_position * a, flow_height, z_coord];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 2, f: 1.5, uSegments: 80, vSegments: 60 })
  },

  orbital_mechanics_model: {
    name: "✈️ Orbital Mechanics Trajectory",
    equation: (u, v, params) => {
      const a = params.d ?? 4;
      const b = params.e ?? 3;
      const d = params.g ?? 0;
      
      const orbital_angle = u * 2 * Math.PI + d;
      const orbit_inclination = v * Math.PI * 0.5;
      const eccentricity = Math.sqrt(1 - (b*b)/(a*a));
      const radius = a * (1 - eccentricity * Math.cos(orbital_angle));
      
      const x_orbital = radius * Math.cos(orbital_angle);
      const y_orbital = radius * Math.sin(orbital_angle);
      
      const x = x_orbital;
      const y = y_orbital * Math.cos(orbit_inclination);
      const z = y_orbital * Math.sin(orbit_inclination);
      const perturbation = 0.1 * a * Math.sin(orbital_angle * 3) * Math.sin(orbit_inclination * 2);
      
      return [x + perturbation, y, z + perturbation * 0.5];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 3, g: 0, uSegments: 120, vSegments: 40 })
  },

  bridge_stress_distribution: {
    name: "🏗️ Bridge Stress Distribution",
    equation: (u, v, params) => {
      const a = params.d ?? 5;
      const b = params.e ?? 2;
      const span = (u - 0.5) * a * 2;
      const width = (v - 0.5) * b;
      const cable_sag = -Math.pow(span / a, 2) * 1.5;
      const deck_stress = Math.exp(-span*span*0.1) * 0.3;
      const tower_position = Math.abs(span) < 0.5 ? 2 : 0;
      const z = cable_sag + deck_stress + tower_position * (1 - Math.abs(width));
      return [span, width, z];
    },
    defaultParams: getCleanDefaults({ d: 5, e: 2, uSegments: 80, vSegments: 40 })
  },

  demographic_transition_model: {
    name: "👥 Demographic Transition Model",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const b = params.e ?? 2;
      const time = u * 200;
      const stage = Math.floor(u * 5);
      const birth_rate = a * Math.exp(-time * 0.015) * (0.5 + 0.5 * Math.cos(time * 0.1));
      const death_rate = b * Math.exp(-time * 0.02) * (0.3 + 0.7 * Math.cos(time * 0.08 + Math.PI/4));
      const population_growth = birth_rate - death_rate;
      const x = time * 0.03;
      const y = v * population_growth;
      const z = birth_rate + death_rate * 0.5;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 2, uSegments: 100, vSegments: 40 })
  },

  earthquake_response_model: {
    name: "🏗️ Earthquake Response Model",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const b = params.e ?? 2;
      const time = u * 30;
      const floor = Math.floor(v * 10);
      const natural_freq = 1 / (0.1 * (floor + 1));
      const damping = 0.05;
      const ground_motion = Math.sin(time * 2) * Math.exp(-time * 0.05);
      const response = a * Math.sin(natural_freq * time) * Math.exp(-damping * time) * ground_motion;
      const drift = b * response * (floor + 1) * 0.1;
      const x = time * 0.2;
      const y = floor * 0.5;
      const z = response + drift;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 2, uSegments: 80, vSegments: 40 })
  },

  electoral_map_dynamics: {
    name: "🏛️ Electoral Map Dynamics",
    equation: (u, v, params) => {
      const a = params.d ?? 4;
      const b = params.e ?? 2;
      const lon = (u - 0.5) * Math.PI;
      const lat = (v - 0.5) * Math.PI * 0.5;
      const regional_lean = Math.sin(lon * 2) * Math.cos(lat * 3) * a;
      const swing_volatility = Math.sin(lon * 5 + lat * 4) * b * 0.3;
      const turnout = 0.5 + 0.3 * Math.cos(lon) * Math.cos(lat);
      const x = a * Math.cos(lat) * Math.cos(lon);
      const y = a * Math.cos(lat) * Math.sin(lon);
      const z = regional_lean * 0.3 + swing_volatility * turnout;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 2, uSegments: 80, vSegments: 60 })
  },

  inflation_dynamics_surface: {
    name: "📊 Inflation Dynamics Surface",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const b = params.e ?? 2;
      const time = u * 24;
      const money_supply = v * 10;
      const velocity = 1.5 + 0.5 * Math.sin(time * 0.5);
      const output = a * (1 + 0.02 * time);
      const inflation = (money_supply * velocity) / output - 1;
      const interest_rate = b * Math.max(0, inflation) * 0.5;
      const x = time * 0.3;
      const y = money_supply * 0.5;
      const z = inflation * 2 + interest_rate * 0.5;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 2, uSegments: 72, vSegments: 48 })
  },

  inventory_optimization_surface: {
    name: "🏭 Inventory Optimization Surface",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const b = params.e ?? 2;
      const order_qty = u * 1000;
      const demand_rate = v * 100;
      const holding_cost = 0.2;
      const ordering_cost = 50;
      const eoq = Math.sqrt((2 * demand_rate * ordering_cost) / holding_cost);
      const total_cost = (demand_rate / order_qty) * ordering_cost + (order_qty / 2) * holding_cost;
      const service_level = 1 - Math.exp(-order_qty / (demand_rate * 0.1));
      const x = order_qty * a * 0.003;
      const y = demand_rate * b * 0.03;
      const z = Math.log(total_cost + 1) * 0.5 - service_level;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 2, uSegments: 64, vSegments: 64 })
  },

  population_migration_pattern: {
    name: "👥 Population Migration Pattern",
    equation: (u, v, params) => {
      const a = params.d ?? 4;
      const b = params.e ?? 3;
      const origin = u * 2 * Math.PI;
      const destination = v * 2 * Math.PI;
      const distance = Math.sqrt(Math.pow(Math.cos(origin) - Math.cos(destination), 2) + 
                                 Math.pow(Math.sin(origin) - Math.sin(destination), 2));
      const push_factor = a * Math.sin(origin * 3);
      const pull_factor = b * Math.cos(destination * 2);
      const migration_flow = (push_factor + pull_factor) / (1 + distance);
      const x = a * Math.cos(origin) + migration_flow * 0.2 * Math.cos(destination);
      const y = a * Math.sin(origin) + migration_flow * 0.2 * Math.sin(destination);
      const z = migration_flow;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 3, uSegments: 72, vSegments: 72 })
  },

  power_distribution_network: {
    name: "🏛️ Power Distribution Network",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const b = params.e ?? 2;
      const node = Math.floor(u * 10);
      const connection = v * 2 * Math.PI;
      const centrality = Math.exp(-node * 0.2) * a;
      const influence = b * Math.sin(connection * (node + 1)) * 0.5;
      const hierarchy = node * 0.5;
      const x = centrality * Math.cos(connection);
      const y = centrality * Math.sin(connection);
      const z = hierarchy + influence;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 2, uSegments: 80, vSegments: 40 })
  },

  production_line_dynamics: {
    name: "🏭 Production Line Dynamics",
    equation: (u, v, params) => {
      const a = params.d ?? 4;
      const b = params.e ?? 2;
      const station = u * 10;
      const time = v * 24;
      const cycle_time = 1 + 0.2 * Math.sin(station * 0.5);
      const throughput = a / cycle_time;
      const wip = b * station * (1 + 0.1 * Math.sin(time));
      const bottleneck = Math.exp(-Math.pow(station - 5, 2) * 0.5) * 0.5;
      const x = station * 0.5;
      const y = time * 0.2;
      const z = throughput + wip * 0.1 - bottleneck;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 2, uSegments: 80, vSegments: 60 })
  },

  quality_control_system: {
    name: "🏭 Quality Control System",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const b = params.e ?? 2;
      const sample = u * 100;
      const measurement = (v - 0.5) * 6;
      const mean = 0;
      const sigma = 1;
      const gaussian = Math.exp(-Math.pow(measurement - mean, 2) / (2 * sigma * sigma));
      const ucl = 3 * sigma;
      const lcl = -3 * sigma;
      const in_control = (Math.abs(measurement) < ucl) ? 1 : 0;
      const x = sample * a * 0.03;
      const y = measurement * b;
      const z = gaussian * in_control * 2;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 2, uSegments: 100, vSegments: 60 })
  },

  shock_wave_pattern: {
    name: "✈️ Shock Wave Pattern",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const b = params.e ?? 2;
      const mach = 1.5 + u * 2;
      const angle = v * Math.PI * 0.5;
      const mach_angle = Math.asin(1 / mach);
      const shock_cone = Math.tan(mach_angle) * u * a;
      const pressure_ratio = 1 + (2 * 1.4 * (mach * mach - 1)) / (1.4 + 1);
      const x = u * a * 3;
      const y = shock_cone * Math.cos(angle);
      const z = shock_cone * Math.sin(angle) + (pressure_ratio - 1) * b * 0.2;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 2, uSegments: 60, vSegments: 60 })
  },

  social_mobility_landscape: {
    name: "👥 Social Mobility Landscape",
    equation: (u, v, params) => {
      const a = params.d ?? 4;
      const b = params.e ?? 3;
      const parent_income = u * 100;
      const child_income = v * 100;
      const correlation = 0.4;
      const expected_child = correlation * parent_income + (1 - correlation) * 50;
      const mobility = child_income - expected_child;
      const probability = Math.exp(-Math.pow(child_income - expected_child, 2) * 0.001);
      const x = parent_income * a * 0.03;
      const y = child_income * b * 0.03;
      const z = probability * 3 + mobility * 0.02;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 3, uSegments: 80, vSegments: 80 })
  },

  spacecraft_trajectory: {
    name: "✈️ Spacecraft Trajectory",
    equation: (u, v, params) => {
      const a = params.d ?? 4;
      const b = params.e ?? 2;
      const phase = u * 2 * Math.PI * 3;
      const mission_progress = v;
      const escape_velocity = Math.sqrt(2);
      const orbit_radius = a * (1 + mission_progress * 2);
      const gravity_assist = b * Math.sin(phase * 2) * mission_progress;
      const x = orbit_radius * Math.cos(phase) + gravity_assist * 0.3;
      const y = orbit_radius * Math.sin(phase) + gravity_assist * 0.3;
      const z = mission_progress * a * 2 + Math.sin(phase * 5) * 0.2;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 2, uSegments: 120, vSegments: 40 })
  },

  trade_flow_network: {
    name: "📊 Trade Flow Network",
    equation: (u, v, params) => {
      const a = params.d ?? 4;
      const b = params.e ?? 3;
      const exporter = u * 2 * Math.PI;
      const importer = v * 2 * Math.PI;
      const gdp_exporter = a * (1 + 0.5 * Math.cos(exporter * 2));
      const gdp_importer = b * (1 + 0.5 * Math.sin(importer * 3));
      const distance = Math.sqrt(Math.pow(Math.cos(exporter) - Math.cos(importer), 2) + 
                                 Math.pow(Math.sin(exporter) - Math.sin(importer), 2));
      const trade_flow = (gdp_exporter * gdp_importer) / (1 + distance * distance);
      const x = a * Math.cos(exporter) + trade_flow * 0.05 * Math.cos(importer);
      const y = a * Math.sin(exporter) + trade_flow * 0.05 * Math.sin(importer);
      const z = trade_flow * 0.3;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 3, uSegments: 72, vSegments: 72 })
  }
};

export default SOCIAL_SCIENCES_SHAPES;
