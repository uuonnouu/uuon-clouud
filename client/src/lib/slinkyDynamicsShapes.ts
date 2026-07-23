import type { ParametricSurface } from './surfaceGenerator';

export const SLINKY_DYNAMICS_SHAPES: Record<string, ParametricSurface> = {
  
  // ═══════════════════════════════════════════════════════════════════════════
  // TIME-VARYING HELIX
  // Core slinky geometry: x = R·cos(θ), y = R·sin(θ), z = p(t)·θ
  // Dynamic pitch creates traveling waves and compression patterns
  // ═══════════════════════════════════════════════════════════════════════════
  
  slinky_time_varying_helix: {
    name: "Slinky Time-Varying Helix",
    formula: "r(θ,t) = [R·cos(θ), R·sin(θ), p(t)·θ] where p(t) = p₀ + A·sin(ωt)",
    description: "Dynamic helix with time-varying pitch - the fundamental geometry of slinky motion. Pitch changes create traveling compression waves.",
    category: "slinky-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 2, e: 0.5, f: 1, g: 6, h: 0.3, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const R = (params.a ?? 1) * 1.5;
      const p0 = (params.b ?? 1) * 0.3;
      const A = (params.c ?? 1) * 0.15;
      const omega = (params.d ?? 2) * 2;
      const turns = (params.g ?? 6) * 4;
      const phase = (params.h ?? 0.3) * Math.PI * 2;
      
      const theta = u * Math.PI * 2 * turns;
      const t = v * Math.PI * 2;
      
      const pitch = p0 + A * Math.sin(omega * t + phase * u);
      
      const x = R * Math.cos(theta) * (params.x ?? 1);
      const y = R * Math.sin(theta) * (params.y ?? 1);
      const z = pitch * theta * (params.z ?? 1) * 0.1;
      
      return { x, y, z };
    }
  },

  slinky_compression_helix: {
    name: "Slinky Compression Helix",
    formula: "r(θ,z) = [R·cos(θ), R·sin(θ), z + C(z)·sin(kz)]",
    description: "Helix with localized compression zones - models the 'density packets' that travel through a slinky during motion.",
    category: "slinky-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 0.5, e: 3, f: 0.4, g: 8, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const R = (params.a ?? 1) * 1.2;
      const compression = (params.d ?? 0.5) * 0.3;
      const k = (params.e ?? 3) * 4;
      const turns = (params.g ?? 8) * 3;
      
      const theta = u * Math.PI * 2 * turns;
      const zBase = v * 8 - 4;
      
      const localCompression = compression * Math.exp(-0.5 * Math.pow(zBase - 2 * Math.sin(u * Math.PI * 2), 2));
      const zOffset = localCompression * Math.sin(k * zBase);
      
      const x = R * Math.cos(theta) * (params.x ?? 1);
      const y = R * Math.sin(theta) * (params.y ?? 1);
      const z = (zBase + zOffset) * (params.z ?? 1);
      
      return { x, y, z };
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LONGITUDINAL WAVE
  // p(t) = p₀ + Σ Aₙ·sin(nωt) - Fourier series of pitch oscillation
  // Creates standing waves and traveling compression pulses
  // ═══════════════════════════════════════════════════════════════════════════

  slinky_longitudinal_wave: {
    name: "Slinky Longitudinal Wave",
    formula: "p(t) = p₀ + Σ Aₙ·sin(nωt) - Fourier compression waves",
    description: "Longitudinal wave propagation through distributed mass-spring system. Shows how compressions travel as waves, not instant changes.",
    category: "slinky-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 1, e: 0.5, f: 0.25, g: 5, h: 2, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const R = (params.a ?? 1) * 1.0;
      const p0 = (params.b ?? 1) * 0.2;
      const A1 = (params.c ?? 1) * 0.15;
      const A2 = (params.d ?? 1) * 0.08;
      const A3 = (params.e ?? 0.5) * 0.04;
      const omega = (params.h ?? 2) * 3;
      const turns = (params.g ?? 5) * 4;
      
      const theta = u * Math.PI * 2 * turns;
      const t = v * Math.PI * 2;
      
      const pitch = p0 + 
        A1 * Math.sin(omega * t) + 
        A2 * Math.sin(2 * omega * t) + 
        A3 * Math.sin(3 * omega * t);
      
      const wavePhase = theta * 0.1 - omega * t * 0.5;
      const localDensity = 1 + 0.3 * Math.sin(wavePhase);
      
      const x = R * localDensity * Math.cos(theta) * (params.x ?? 1);
      const y = R * localDensity * Math.sin(theta) * (params.y ?? 1);
      const z = pitch * theta * 0.08 * (params.z ?? 1);
      
      return { x, y, z };
    }
  },

  slinky_standing_wave: {
    name: "Slinky Standing Wave",
    formula: "ψ(z,t) = A·sin(nπz/L)·cos(ωt) - Standing wave modes",
    description: "Standing wave patterns formed when longitudinal waves reflect off slinky ends. Creates nodes and antinodes of compression.",
    category: "slinky-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 3, e: 1, f: 0.4, g: 6, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const R = (params.a ?? 1) * 1.2;
      const n = Math.floor((params.d ?? 3) * 2) + 1;
      const amplitude = (params.f ?? 0.4) * 0.3;
      const turns = (params.g ?? 6) * 3;
      
      const theta = u * Math.PI * 2 * turns;
      const L = 8;
      const zNorm = v;
      const t = u * Math.PI * 4;
      
      const standingWave = amplitude * Math.sin(n * Math.PI * zNorm) * Math.cos(2 * t);
      const zBase = v * L - L/2;
      
      const localR = R * (1 + standingWave);
      
      const x = localR * Math.cos(theta) * (params.x ?? 1);
      const y = localR * Math.sin(theta) * (params.y ?? 1);
      const z = zBase * (params.z ?? 1);
      
      return { x, y, z };
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // COMPRESSION ENVELOPE
  // C(z,t) = C₀·e^(-αz)·sin(ωt - kz) - Traveling compression wave
  // Exponential decay models damping, phase shift models propagation
  // ═══════════════════════════════════════════════════════════════════════════

  slinky_compression_envelope: {
    name: "Slinky Compression Envelope",
    formula: "C(z,t) = C₀·e^(-αz)·sin(ωt - kz)",
    description: "Traveling compression wave with exponential decay. Models how tension release propagates down from top, creating the 'floating bottom' effect.",
    category: "slinky-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 0.3, e: 2, f: 4, g: 6, h: 0.8, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const R = (params.a ?? 1) * 1.0;
      const C0 = (params.c ?? 1) * 0.4;
      const alpha = (params.d ?? 0.3) * 0.5;
      const omega = (params.e ?? 2) * 3;
      const k = (params.f ?? 4) * 2;
      const turns = (params.g ?? 6) * 3;
      
      const theta = u * Math.PI * 2 * turns;
      const zNorm = v * 6;
      const t = u * Math.PI * 2;
      
      const envelope = C0 * Math.exp(-alpha * zNorm) * Math.sin(omega * t - k * zNorm);
      const pitch = 0.15 + envelope * 0.1;
      
      const x = R * Math.cos(theta) * (params.x ?? 1);
      const y = R * Math.sin(theta) * (params.y ?? 1);
      const z = (zNorm + envelope) * (params.z ?? 1);
      
      return { x, y, z };
    }
  },

  slinky_tension_propagation: {
    name: "Slinky Tension Propagation",
    formula: "T(z,t) = T₀·H(ct - z) - Heaviside tension release wave",
    description: "Models the famous slinky drop: tension release travels at finite speed, so bottom hangs in mid-air until wave arrives.",
    category: "slinky-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 0.6, e: 1, f: 0.3, g: 5, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const R = (params.a ?? 1) * 1.2;
      const waveSpeed = (params.d ?? 0.6);
      const turns = (params.g ?? 5) * 4;
      
      const theta = u * Math.PI * 2 * turns;
      const zNorm = v * 6;
      const t = u;
      
      const waveFront = waveSpeed * t * 6;
      const sigmoid = 1 / (1 + Math.exp(-10 * (zNorm - waveFront)));
      
      const tensionRelease = sigmoid;
      const pitch = 0.2 * (1 - tensionRelease * 0.7);
      
      const collapse = tensionRelease * (zNorm - waveFront) * 0.3;
      
      const x = R * Math.cos(theta) * (params.x ?? 1);
      const y = R * Math.sin(theta) * (params.y ?? 1);
      const z = (zNorm - collapse) * pitch * (params.z ?? 1);
      
      return { x, y, z };
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SLINKY WALKING MAP (Discrete Dynamics)
  // state_{n+1} = f(compression_n, gravity, k)
  // Models the step-by-step flip cycle down stairs
  // ═══════════════════════════════════════════════════════════════════════════

  slinky_walking_map: {
    name: "Slinky Walking Map",
    formula: "state_{n+1} = f(compression_n, gravity, k)",
    description: "Discrete dynamics of slinky walking: gravity → compression wave → flip → extension → next step. A perfect energy conversion machine.",
    category: "slinky-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 0.5, e: 9.8, f: 1, g: 4, h: 0.7, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const R = (params.a ?? 1) * 1.0;
      const k = (params.c ?? 1) * 2;
      const gravity = (params.e ?? 9.8) * 0.1;
      const steps = Math.floor((params.g ?? 4) * 2);
      const flipProgress = (params.h ?? 0.7);
      
      const stepIndex = Math.floor(u * steps);
      const withinStep = (u * steps) % 1;
      
      const theta = u * Math.PI * 2 * 8;
      
      const flipAngle = withinStep * Math.PI;
      const stepHeight = -stepIndex * 0.5;
      const stepOffset = stepIndex * 0.8;
      
      const compression = Math.sin(flipAngle) * flipProgress;
      const extension = 1 - compression * 0.5;
      
      const arcX = Math.sin(flipAngle) * 0.6;
      const arcZ = Math.cos(flipAngle) * 0.3;
      
      const x = (R * Math.cos(theta) + arcX + stepOffset) * (params.x ?? 1);
      const y = R * Math.sin(theta) * extension * (params.y ?? 1);
      const z = (v * 3 * extension + stepHeight + arcZ) * (params.z ?? 1);
      
      return { x, y, z };
    }
  },

  slinky_stair_descent: {
    name: "Slinky Stair Descent",
    formula: "Parametric stair-stepping with compression cycles",
    description: "Complete visualization of slinky walking down stairs - each compression injects parametric energy for the next flip.",
    category: "slinky-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 0.4, e: 0.6, f: 5, g: 6, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const R = (params.a ?? 1) * 0.8;
      const stepHeight = (params.d ?? 0.4) * 1.5;
      const stepDepth = (params.e ?? 0.6) * 2;
      const numSteps = Math.floor((params.f ?? 5) * 1.5);
      const turns = (params.g ?? 6) * 2;
      
      const theta = u * Math.PI * 2 * turns;
      const progression = u * numSteps;
      const currentStep = Math.floor(progression);
      const stepPhase = progression % 1;
      
      const flipCurve = Math.sin(stepPhase * Math.PI);
      const extensionPhase = stepPhase < 0.5 ? stepPhase * 2 : 2 - stepPhase * 2;
      
      const baseX = currentStep * stepDepth + flipCurve * stepDepth * 0.5;
      const baseZ = -currentStep * stepHeight + flipCurve * stepHeight * 0.3;
      
      const helixX = R * Math.cos(theta);
      const helixY = R * Math.sin(theta);
      const helixZ = v * 2 * (1 - flipCurve * 0.4);
      
      const x = (baseX + helixX) * (params.x ?? 1);
      const y = helixY * (params.y ?? 1);
      const z = (baseZ + helixZ) * (params.z ?? 1);
      
      return { x, y, z };
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LAGRANGIAN MODEL
  // L = T - V where T = kinetic, V = gravitational + elastic potential
  // Full simulation accuracy used in robotics and slinky research
  // ═══════════════════════════════════════════════════════════════════════════

  slinky_lagrangian_surface: {
    name: "Slinky Lagrangian Surface",
    formula: "L = T - V = ½m|ṙ|² - (mgz + ½k·Δl²)",
    description: "Lagrangian mechanics surface showing the energy landscape of slinky motion. T = kinetic energy of distributed mass, V = gravitational + elastic potential.",
    category: "slinky-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 1, e: 9.8, f: 2, g: 1, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const m = (params.a ?? 1) * 0.5;
      const k = (params.c ?? 1) * 10;
      const g = (params.e ?? 9.8) * 0.1;
      const l0 = (params.f ?? 2);
      
      const position = u * 4 - 2;
      const velocity = v * 4 - 2;
      
      const kineticEnergy = 0.5 * m * velocity * velocity;
      const gravitationalPotential = m * g * position;
      const stretch = Math.abs(position) - l0 * 0.5;
      const elasticPotential = stretch > 0 ? 0.5 * k * stretch * stretch : 0;
      
      const lagrangian = kineticEnergy - (gravitationalPotential + elasticPotential);
      
      const x = position * (params.x ?? 1);
      const y = velocity * (params.y ?? 1);
      const z = lagrangian * 0.3 * (params.z ?? 1);
      
      return { x, y, z };
    }
  },

  slinky_phase_space: {
    name: "Slinky Phase Space",
    formula: "Phase portrait: (q, p) → (position, momentum)",
    description: "Phase space trajectory of slinky oscillation showing position vs momentum. Closed orbits indicate periodic motion.",
    category: "slinky-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 0.1, e: 2, f: 1, g: 3, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const omega = (params.c ?? 1) * 2;
      const damping = (params.d ?? 0.1) * 0.2;
      const amplitude = (params.e ?? 2);
      const orbits = (params.g ?? 3) * 2;
      
      const t = u * Math.PI * 2 * orbits;
      const decay = Math.exp(-damping * t);
      
      const q = amplitude * decay * Math.cos(omega * t);
      const p = -amplitude * omega * decay * Math.sin(omega * t);
      
      const energy = v * 3;
      
      const x = q * (params.x ?? 1);
      const y = p * (params.y ?? 1);
      const z = energy * (params.z ?? 1);
      
      return { x, y, z };
    }
  },

  slinky_hamiltonian_flow: {
    name: "Slinky Hamiltonian Flow",
    formula: "H = p²/2m + V(q) - Hamiltonian energy function",
    description: "Hamiltonian formulation of slinky dynamics. Energy contours show allowed motion regions.",
    category: "slinky-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 10, e: 9.8, f: 2, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const m = (params.a ?? 1);
      const k = (params.d ?? 10);
      const g = (params.e ?? 9.8) * 0.1;
      
      const q = u * 6 - 3;
      const p = v * 6 - 3;
      
      const kineticTerm = (p * p) / (2 * m);
      const potentialTerm = 0.5 * k * q * q + m * g * q;
      const hamiltonian = kineticTerm + potentialTerm;
      
      const x = q * (params.x ?? 1);
      const y = p * (params.y ?? 1);
      const z = hamiltonian * 0.1 * (params.z ?? 1);
      
      return { x, y, z };
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PARAMETRIC OSCILLATOR
  // d²x/dt² + (ω₀² + ε·cos(Ωt))x = 0 - Mathieu equation
  // Describes stair-stepping, whipping patterns, chaotic flipping
  // ═══════════════════════════════════════════════════════════════════════════

  slinky_parametric_oscillator: {
    name: "Slinky Parametric Oscillator",
    formula: "d²x/dt² + (ω₀² + ε·cos(Ωt))x = 0",
    description: "Parametric oscillator (Mathieu equation) - the mathematical heart of slinky stair-walking. External modulation pumps energy into oscillation.",
    category: "slinky-dynamics",
    defaultParams: { a: 1, b: 1, c: 2, d: 0.5, e: 1.5, f: 0, g: 4, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const omega0 = (params.c ?? 2);
      const epsilon = (params.d ?? 0.5) * 0.8;
      const Omega = (params.e ?? 1.5) * 2;
      const periods = (params.g ?? 4) * 2;
      
      const t = u * Math.PI * 2 * periods;
      const modulation = epsilon * Math.cos(Omega * t);
      const effectiveOmega = Math.sqrt(Math.max(0.1, omega0 * omega0 + modulation));
      
      let x_pos = 0, v_vel = 1;
      const dt = 0.01;
      const steps = Math.floor(t / dt);
      
      for (let i = 0; i < Math.min(steps, 500); i++) {
        const ti = i * dt;
        const omega_t = Math.sqrt(Math.max(0.1, omega0 * omega0 + epsilon * Math.cos(Omega * ti)));
        const a = -omega_t * omega_t * x_pos;
        v_vel += a * dt;
        x_pos += v_vel * dt;
      }
      
      x_pos = Math.max(-3, Math.min(3, x_pos));
      
      const x = t * 0.2 * (params.x ?? 1);
      const y = x_pos * (params.y ?? 1);
      const z = v * 2 * (params.z ?? 1);
      
      return { x, y, z };
    }
  },

  slinky_resonance_zones: {
    name: "Slinky Resonance Zones",
    formula: "Mathieu stability diagram - (δ, ε) parameter space",
    description: "Stability regions in parameter space showing where parametric resonance occurs. Unstable zones cause exponential amplitude growth.",
    category: "slinky-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 4, e: 2, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const deltaMax = (params.d ?? 4);
      const epsilonMax = (params.e ?? 2);
      
      const delta = u * deltaMax;
      const epsilon = v * epsilonMax;
      
      const a0 = delta;
      const q0 = epsilon / 2;
      
      const stability = Math.cos(Math.PI * Math.sqrt(Math.abs(a0))) * 
                       Math.exp(-q0 * q0 * 0.5);
      
      const isStable = Math.abs(stability) < 1 ? 0.5 : -0.5;
      const tonguePattern = Math.sin(Math.PI * Math.sqrt(delta)) * epsilon;
      
      const x = delta * (params.x ?? 1);
      const y = epsilon * (params.y ?? 1);
      const z = (isStable + tonguePattern * 0.3) * (params.z ?? 1);
      
      return { x, y, z };
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SOLITON AND NONLINEAR WAVES
  // Compression packets that maintain shape while traveling
  // ═══════════════════════════════════════════════════════════════════════════

  slinky_soliton_wave: {
    name: "Slinky Soliton Wave",
    formula: "ψ(x,t) = A·sech²((x - ct)/w) - Soliton pulse",
    description: "Soliton wave in slinky - a compression pulse that maintains its shape while traveling. Same physics as rope waves and whip cracks.",
    category: "slinky-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 1.5, e: 0.5, f: 0.8, g: 6, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const R = (params.a ?? 1) * 1.0;
      const A = (params.c ?? 1) * 0.5;
      const c = (params.d ?? 1.5) * 2;
      const w = (params.e ?? 0.5) * 0.8;
      const turns = (params.g ?? 6) * 3;
      
      const theta = u * Math.PI * 2 * turns;
      const x_pos = v * 10 - 5;
      const t = u * 4;
      
      const sech = 1 / Math.cosh((x_pos - c * t) / w);
      const soliton = A * sech * sech;
      
      const localR = R * (1 + soliton);
      
      const x = localR * Math.cos(theta) * (params.x ?? 1);
      const y = localR * Math.sin(theta) * (params.y ?? 1);
      const z = x_pos * (params.z ?? 1);
      
      return { x, y, z };
    }
  },

  slinky_nonlinear_wave: {
    name: "Slinky Nonlinear Wave",
    formula: "∂²u/∂t² = c²∂²u/∂x² + αu² - Nonlinear wave equation",
    description: "Nonlinear wave propagation showing how compression combines with elasticity to create chaotic motion patterns.",
    category: "slinky-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 0.3, e: 2, f: 3, g: 5, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const R = (params.a ?? 1) * 1.0;
      const alpha = (params.d ?? 0.3) * 0.5;
      const c_wave = (params.e ?? 2);
      const k = (params.f ?? 3);
      const turns = (params.g ?? 5) * 3;
      
      const theta = u * Math.PI * 2 * turns;
      const x_pos = v * 8 - 4;
      const t = u * 3;
      
      const linearWave = Math.sin(k * x_pos - c_wave * t);
      const nonlinearTerm = alpha * linearWave * linearWave * Math.sign(linearWave);
      const totalWave = linearWave + nonlinearTerm;
      
      const localR = R * (1 + totalWave * 0.3);
      
      const x = localR * Math.cos(theta) * (params.x ?? 1);
      const y = localR * Math.sin(theta) * (params.y ?? 1);
      const z = x_pos * (params.z ?? 1);
      
      return { x, y, z };
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TORSIONAL AND COUPLED MODES
  // Rotation + extension + compression interactions
  // ═══════════════════════════════════════════════════════════════════════════

  slinky_torsional_mode: {
    name: "Slinky Torsional Mode",
    formula: "θ(z,t) = Θ₀·sin(kz)·cos(ωt) - Torsional oscillation",
    description: "Torsional oscillation mode where coils rotate about the slinky axis. Creates twist waves that travel along the helix.",
    category: "slinky-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 0.5, e: 2, f: 3, g: 6, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const R = (params.a ?? 1) * 1.2;
      const Theta0 = (params.d ?? 0.5) * 0.8;
      const k = (params.e ?? 2) * 2;
      const omega = (params.f ?? 3) * 2;
      const turns = (params.g ?? 6) * 3;
      
      const baseTheta = u * Math.PI * 2 * turns;
      const z = v * 6 - 3;
      const t = u * Math.PI * 2;
      
      const torsion = Theta0 * Math.sin(k * z) * Math.cos(omega * t);
      const theta = baseTheta + torsion;
      
      const x = R * Math.cos(theta) * (params.x ?? 1);
      const y = R * Math.sin(theta) * (params.y ?? 1);
      const zOut = z * (params.z ?? 1);
      
      return { x, y, z: zOut };
    }
  },

  slinky_coupled_modes: {
    name: "Slinky Coupled Modes",
    formula: "Extension-torsion-compression coupling",
    description: "Coupled oscillation modes showing how extension, torsion, and compression interact in nonlinear ways.",
    category: "slinky-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 0.3, e: 0.4, f: 0.2, g: 5, h: 2, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const R = (params.a ?? 1) * 1.0;
      const extensionAmp = (params.d ?? 0.3);
      const torsionAmp = (params.e ?? 0.4);
      const compressionAmp = (params.f ?? 0.2);
      const turns = (params.g ?? 5) * 3;
      const coupling = (params.h ?? 2);
      
      const baseTheta = u * Math.PI * 2 * turns;
      const z = v * 6 - 3;
      const t = u * Math.PI * 4;
      
      const extension = extensionAmp * Math.sin(2 * t);
      const torsion = torsionAmp * Math.sin(3 * t + coupling * extension);
      const compression = compressionAmp * Math.sin(5 * t + coupling * torsion);
      
      const localR = R * (1 + compression);
      const theta = baseTheta + torsion;
      const zStretch = z * (1 + extension * 0.3);
      
      const x = localR * Math.cos(theta) * (params.x ?? 1);
      const y = localR * Math.sin(theta) * (params.y ?? 1);
      const zOut = zStretch * (params.z ?? 1);
      
      return { x, y, z: zOut };
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DISTRIBUTED MASS-SPRING SYSTEM
  // Fundamental slinky physics: thousands of tiny springs connected end-to-end
  // ═══════════════════════════════════════════════════════════════════════════

  slinky_distributed_spring: {
    name: "Slinky Distributed Mass-Spring",
    formula: "ρ·∂²u/∂t² = EA·∂²u/∂x² - Continuous spring model",
    description: "Distributed mass-spring system showing how the slinky acts as an elastic waveguide where motion travels as waves, not instant changes.",
    category: "slinky-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 20, e: 0.1, f: 3, g: 8, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const R = (params.a ?? 1) * 1.0;
      const numMasses = Math.floor((params.d ?? 20));
      const waveSpeed = (params.e ?? 0.1) * 5;
      const k = (params.f ?? 3);
      const turns = (params.g ?? 8) * 2;
      
      const theta = u * Math.PI * 2 * turns;
      const massIndex = Math.floor(v * numMasses);
      const t = u * 4;
      
      const displacement = Math.sin(k * massIndex / numMasses * Math.PI * 2 - waveSpeed * t);
      const zBase = (massIndex / numMasses) * 6 - 3;
      const zDisplaced = zBase + displacement * 0.3;
      
      const x = R * Math.cos(theta) * (params.x ?? 1);
      const y = R * Math.sin(theta) * (params.y ?? 1);
      const z = zDisplaced * (params.z ?? 1);
      
      return { x, y, z };
    }
  },

  slinky_wave_equation: {
    name: "Slinky Wave Equation",
    formula: "∂²u/∂t² = c²·∂²u/∂x² - 1D wave equation",
    description: "Classical wave equation solution for longitudinal waves in slinky. Wave speed depends on spring constant and mass distribution.",
    category: "slinky-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 2, e: 3, f: 0, g: 6, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const R = (params.a ?? 1) * 1.0;
      const c_wave = (params.d ?? 2);
      const k = (params.e ?? 3);
      const turns = (params.g ?? 6) * 3;
      
      const theta = u * Math.PI * 2 * turns;
      const x_pos = v * 8 - 4;
      const t = u * 3;
      
      const rightWave = 0.3 * Math.sin(k * x_pos - c_wave * t);
      const leftWave = 0.2 * Math.sin(k * x_pos + c_wave * t * 0.8);
      const totalWave = rightWave + leftWave;
      
      const localR = R * (1 + totalWave);
      
      const x = localR * Math.cos(theta) * (params.x ?? 1);
      const y = localR * Math.sin(theta) * (params.y ?? 1);
      const z = x_pos * (params.z ?? 1);
      
      return { x, y, z };
    }
  },

  slinky_gravity_drop: {
    name: "Slinky Gravity Drop",
    formula: "Center of mass falls at g while ends redistribute",
    description: "The famous slinky drop experiment: when released, the bottom stays stationary until tension wave arrives, then collapses.",
    category: "slinky-dynamics",
    defaultParams: { a: 1, b: 1, c: 1, d: 9.8, e: 0.5, f: 2, g: 6, x: 1, y: 1, z: 1 },
    fn: (u: number, v: number, params: Record<string, number>) => {
      const R = (params.a ?? 1) * 1.0;
      const g = (params.d ?? 9.8) * 0.02;
      const waveSpeed = (params.e ?? 0.5) * 3;
      const initialLength = (params.f ?? 2) * 2;
      const turns = (params.g ?? 6) * 3;
      
      const theta = u * Math.PI * 2 * turns;
      const coilPos = v;
      const t = u * 2;
      
      const waveFront = waveSpeed * t;
      const hasCollapsed = coilPos < waveFront;
      
      let zPos;
      if (hasCollapsed) {
        const collapseTime = coilPos / waveSpeed;
        const fallTime = t - collapseTime;
        zPos = initialLength * coilPos - 0.5 * g * fallTime * fallTime;
      } else {
        zPos = initialLength * coilPos;
      }
      
      zPos = zPos - initialLength * 0.5;
      
      const x = R * Math.cos(theta) * (params.x ?? 1);
      const y = R * Math.sin(theta) * (params.y ?? 1);
      const z = zPos * (params.z ?? 1);
      
      return { x, y, z };
    }
  }
};

console.log(`🔗 Slinky Dynamics Shapes loaded: ${Object.keys(SLINKY_DYNAMICS_SHAPES).length} shapes`);
console.log(`   🌀 Time-Varying Helix: Dynamic pitch and compression`);
console.log(`   🌊 Longitudinal Wave: Fourier series compression modes`);
console.log(`   📈 Compression Envelope: Traveling decay waves`);
console.log(`   🚶 Walking Map: Discrete stair-stepping dynamics`);
console.log(`   ⚙️ Lagrangian Model: Full energy-based simulation`);
console.log(`   🎵 Parametric Oscillator: Mathieu equation resonance`);
console.log(`   💫 Soliton Waves: Shape-preserving compression pulses`);

export default SLINKY_DYNAMICS_SHAPES;
