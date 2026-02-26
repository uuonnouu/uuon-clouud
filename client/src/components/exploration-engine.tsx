import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Zap, Globe, ChevronRight } from "lucide-react";

type EngineAgent = {
  id: string;
  name: string;
  count: number;
  description: string;
  shapes: string[];
  earthApplication: string;
  fusionDomains?: string[];
  mathematicalDNA?: string[];
  formats?: string[];
  color: string;
  prompt: string;
};

const ENGINE_AGENTS: EngineAgent[] = [
  {
    id: "tensorFields",
    name: "Tensor Field Visualization",
    count: 82,
    description: "Riemann curvature tensors, Christoffel symbols, metric tensors — the mathematics of curved spacetime rendered as interactive 3D surfaces",
    shapes: ["multi_qubit_tensor_product", "einstein_tensor_product", "metric_tensor_surface", "riemann_harmonic_surface"],
    earthApplication: "GPS satellite corrections, gravitational lensing prediction, earthquake wave propagation modeling",
    fusionDomains: ["tensor_algebra", "harmonic_analysis", "general_relativity"],
    mathematicalDNA: ["curvature_tensor", "christoffel_symbols", "spherical_harmonics", "riemann_curvature", "tensor_decomposition"],
    color: "#ec4899",
    prompt: "Activate the Tensor Field agent. Show me Riemann curvature tensors, Christoffel symbols, metric tensor surfaces. 82 shapes that map curved spacetime. How do these correct GPS satellites and predict gravitational lensing?",
  },
  {
    id: "quantumVisualization",
    name: "Quantum Mechanics Visualization",
    count: 502,
    description: "Wave functions, probability densities, Bloch spheres, quantum entanglement, superposition states — the invisible world made visible",
    shapes: ["wave_function", "probability_density", "bloch_sphere", "quantum_entanglement", "superposition_state"],
    earthApplication: "Quantum computing education, molecular orbital visualization, spectroscopy training",
    color: "#06b6d4",
    prompt: "Activate the Quantum agent. 502 shapes. Wave functions, probability densities, Bloch spheres, entanglement, superposition. Make the invisible world visible. How does this change education?",
  },
  {
    id: "waveSystems",
    name: "Wave & Field Systems",
    count: 336,
    description: "Electromagnetic waves, gravitational waves, acoustic waves, quantum wave functions — every type of wave the universe produces",
    shapes: ["electromagnetic_wave", "gravitational_wave", "acoustic_wave", "standing_wave", "interference_pattern"],
    earthApplication: "Communication systems, sonar, seismology, musical instrument design, medical ultrasound",
    color: "#3b82f6",
    prompt: "Activate the Wave Systems agent. 336 shapes. Electromagnetic, gravitational, acoustic, quantum wave functions — every wave the universe produces. How do these run communication, sonar, seismology?",
  },
  {
    id: "galaxySimulation",
    name: "Galaxy & Cosmic Systems",
    count: 14,
    description: "Spiral galaxy formation, elliptical galaxy models, dwarf galaxy evolution, black hole mergers, stellar feedback mechanisms",
    shapes: ["spiral_galaxy", "elliptical_galaxy", "galaxy_formation_simulation", "dwarf_galaxy_evolution", "primordial_black_hole_merger"],
    earthApplication: "Understanding cosmic evolution, modeling gravitational interactions, visualizing dark matter distribution",
    color: "#6366f1",
    prompt: "Activate the Galaxy agent. Spiral galaxies, elliptical galaxies, dwarf galaxy evolution, primordial black hole mergers. 14 cosmic models. How does the universe build itself?",
  },
  {
    id: "collisionPhysics",
    name: "Collision Operator Systems",
    count: 14,
    description: "BGK, MRT, cascaded, and entropic collision operators from lattice Boltzmann methods — the math of fluid dynamics at the molecular level",
    shapes: ["uuon_brane_collision", "bgk_collision_001", "mrt_collision_001", "cascaded_collision_001", "entropic_collision_001", "uuon_hash_collision"],
    earthApplication: "Aerodynamic simulation, blood flow modeling, weather prediction, pollution dispersion",
    color: "#f97316",
    prompt: "Activate the Collision Physics agent. BGK, MRT, cascaded, entropic collision operators. UUON brane collision, hash collision. Lattice Boltzmann fluid dynamics at the molecular level. How does this model weather and blood flow?",
  },
  {
    id: "fractalGeneration",
    name: "Fractal Generation Engine",
    count: 23,
    description: "Iterative function systems that produce self-similar geometry at every scale",
    shapes: ["mandelbrot", "julia_set", "sierpinski_triangle", "koch_snowflake", "barnsley_fern", "menger_sponge"],
    earthApplication: "Modeling coastlines, tree branching, river networks, blood vessels, lightning paths",
    color: "#10b981",
    prompt: "Activate the Fractal agent. Mandelbrot, Julia set, Sierpinski triangle, Koch snowflake, Barnsley fern, Menger sponge. Self-similar geometry at every scale. How do these map coastlines and river networks?",
  },
  {
    id: "therapeuticGeometry",
    name: "Therapeutic Geometry",
    count: 107,
    description: "Sacred geometry, healing frequencies, consciousness research shapes — geometry designed for PTSD therapy and meditative applications",
    shapes: ["sacred_geometry", "healing_frequency", "consciousness_shape", "meditation_form", "trauma_recovery_pattern"],
    earthApplication: "Mental health treatment, meditation aids, therapeutic visualization for trauma recovery",
    color: "#a855f7",
    prompt: "Activate the Therapeutic Geometry agent. 107 sacred geometry shapes designed for PTSD therapy and meditation. Healing frequencies, consciousness research. How does geometry become medicine?",
  },
  {
    id: "biologicalModeling",
    name: "Biological Structure Modeling",
    count: 61,
    description: "DNA helices, protein folding, cell membranes, neural networks, molecular dynamics — life's architecture",
    shapes: ["dna_helix", "protein_fold", "cell_membrane", "neural_network", "molecular_dynamics"],
    earthApplication: "Drug design, genetic research, biomimetic engineering, medical education",
    color: "#22c55e",
    prompt: "Activate the Biological Modeling agent. DNA helices, protein folding, cell membranes, neural networks, molecular dynamics. 61 shapes of life's architecture. How does this drive drug design and genetic research?",
  },
  {
    id: "parametricSurfaces",
    name: "Parametric Surface Engine",
    count: 102,
    description: "The core rendering engine — any mathematical equation with two parameters mapped to three-dimensional space. Real-time WebGL rendering with adjustable parameters.",
    shapes: ["torus", "klein_bottle", "mobius_strip", "boy_surface", "roman_surface"],
    earthApplication: "Industrial design, architectural modeling, engineering simulation, educational mathematics",
    color: "#f0b93b",
    prompt: "Activate the Parametric Surfaces agent. 102 core shapes — torus, Klein bottle, Möbius strip, Boy surface. The foundational rendering engine. Two parameters, three dimensions. How does this power industrial design?",
  },
  {
    id: "nerfExport",
    name: "Neural Radiance Field Export",
    count: 11,
    description: "Any mathematical shape can be exported as a NeRF dataset — Fourier-encoded neural network weights that reconstruct the shape from any viewing angle",
    shapes: ["nerf_reconstruction", "fourier_encoded_field", "view_synthesis"],
    formats: ["nerfstudio", "instant_ngp", "nerf_json"],
    earthApplication: "Photorealistic 3D reconstruction from 2D images, architectural preservation, archaeological digitization",
    color: "#ef4444",
    prompt: "Activate the NeRF Export agent. Neural radiance field datasets — Fourier-encoded weights that reconstruct any shape from any angle. Nerfstudio, Instant NGP, NeRF JSON export. How does this preserve architecture and archaeology?",
  },
];

const CONSTELLATION_BONDS: [number, number, string][] = [
  [0, 1, "tensor↔quantum: curvature tensors describe quantum field geometry"],
  [1, 2, "quantum↔wave: wave functions ARE quantum mechanics"],
  [2, 4, "wave↔collision: wave propagation through lattice Boltzmann"],
  [0, 3, "tensor↔galaxy: general relativity governs cosmic structure"],
  [3, 4, "galaxy↔collision: stellar feedback is fluid dynamics at cosmic scale"],
  [5, 7, "fractal↔biological: life is fractal — blood vessels, lungs, neurons"],
  [7, 6, "biological↔therapeutic: healing geometry mirrors life's architecture"],
  [8, 9, "parametric↔nerf: core engine feeds neural radiance export"],
  [8, 0, "parametric↔tensor: parametric surfaces render tensor fields"],
  [8, 2, "parametric↔wave: wave equations are parametric"],
  [1, 6, "quantum↔therapeutic: consciousness research meets quantum states"],
  [5, 2, "fractal↔wave: fractal boundaries generate wave interference"],
  [7, 4, "biological↔collision: blood flow modeled by collision operators"],
  [3, 9, "galaxy↔nerf: cosmic structures reconstructed as radiance fields"],
  [6, 5, "therapeutic↔fractal: sacred geometry IS fractal self-similarity"],
];

const GRID_POSITIONS: { x: number; y: number }[] = [
  { x: 15, y: 15 },
  { x: 50, y: 8 },
  { x: 85, y: 15 },
  { x: 8, y: 45 },
  { x: 92, y: 45 },
  { x: 15, y: 75 },
  { x: 38, y: 55 },
  { x: 62, y: 55 },
  { x: 85, y: 75 },
  { x: 50, y: 88 },
];

function TensorFieldShape({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <defs>
        <radialGradient id="tf-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="40" cy="40" r="30" fill="url(#tf-glow)" />
      {[0, 30, 60, 90, 120, 150].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 40 + 8 * Math.cos(rad);
        const y1 = 40 + 8 * Math.sin(rad);
        const x2 = 40 + 28 * Math.cos(rad);
        const y2 = 40 + 28 * Math.sin(rad);
        const cx1 = 40 + 18 * Math.cos(rad + 0.4);
        const cy1 = 40 + 18 * Math.sin(rad + 0.4);
        return (
          <path key={angle} d={`M${x1},${y1} Q${cx1},${cy1} ${x2},${y2}`} fill="none" stroke={color} strokeWidth="1.5" opacity="0.7">
            <animate attributeName="opacity" values="0.4;0.9;0.4" dur={`${2 + angle * 0.01}s`} repeatCount="indefinite" />
          </path>
        );
      })}
      <ellipse cx="40" cy="40" rx="18" ry="6" fill="none" stroke={color} strokeWidth="1" opacity="0.3" transform="rotate(-20 40 40)" />
      <ellipse cx="40" cy="40" rx="18" ry="6" fill="none" stroke={color} strokeWidth="1" opacity="0.3" transform="rotate(40 40 40)" />
      <circle cx="40" cy="40" r="3" fill={color} opacity="0.8">
        <animate attributeName="r" values="2;4;2" dur="3s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function QuantumShape({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <defs>
        <radialGradient id="q-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="40" cy="40" r="28" fill="url(#q-glow)" />
      <path d="M10 40 Q18 20 26 40 Q34 60 40 40 Q46 20 54 40 Q62 60 70 40" fill="none" stroke={color} strokeWidth="2" opacity="0.8" strokeLinecap="round">
        <animate attributeName="d" values="M10 40 Q18 20 26 40 Q34 60 40 40 Q46 20 54 40 Q62 60 70 40;M10 40 Q18 28 26 40 Q34 52 40 40 Q46 28 54 40 Q62 52 70 40;M10 40 Q18 20 26 40 Q34 60 40 40 Q46 20 54 40 Q62 60 70 40" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M12 45 Q20 30 28 45 Q36 60 42 45 Q48 30 56 45 Q64 60 72 45" fill="none" stroke={color} strokeWidth="1" opacity="0.3" strokeLinecap="round" />
      <circle cx="26" cy="40" r="2.5" fill={color} opacity="0.6">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="54" cy="40" r="2.5" fill={color} opacity="0.6">
        <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="40" cy="22" r="8" fill="none" stroke={color} strokeWidth="1" opacity="0.25" />
    </svg>
  );
}

function WaveSystemShape({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      {[0, 1, 2, 3, 4].map((i) => {
        const y = 25 + i * 8;
        const amp = 12 - i * 2;
        const freq = 2 + i * 0.5;
        const points = Array.from({ length: 20 }, (_, j) => {
          const x = 8 + j * 3.4;
          const py = y + amp * Math.sin((j / 20) * Math.PI * freq);
          return `${x},${py}`;
        }).join(" ");
        return (
          <polyline key={i} points={points} fill="none" stroke={color} strokeWidth={1.5 - i * 0.2} opacity={0.8 - i * 0.12} strokeLinecap="round">
            <animate attributeName="opacity" values={`${0.5 - i * 0.08};${0.9 - i * 0.1};${0.5 - i * 0.08}`} dur={`${2.5 + i * 0.4}s`} repeatCount="indefinite" />
          </polyline>
        );
      })}
    </svg>
  );
}

function GalaxyShape({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <defs>
        <radialGradient id="gal-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.6" />
          <stop offset="40%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="40" cy="40" r="30" fill="url(#gal-core)" />
      {[0, 1].map((arm) => {
        const offset = arm * Math.PI;
        const points = Array.from({ length: 30 }, (_, i) => {
          const t = i * 0.12;
          const r = 5 + t * 18;
          const angle = t * 2.5 + offset;
          return `${40 + r * Math.cos(angle)},${40 + r * Math.sin(angle) * 0.7}`;
        }).join(" ");
        return <polyline key={arm} points={points} fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />;
      })}
      {[0.5, 1.5].map((arm) => {
        const offset = arm * Math.PI;
        const points = Array.from({ length: 25 }, (_, i) => {
          const t = i * 0.1;
          const r = 4 + t * 15;
          const angle = t * 2.5 + offset;
          return `${40 + r * Math.cos(angle)},${40 + r * Math.sin(angle) * 0.7}`;
        }).join(" ");
        return <polyline key={arm} points={points} fill="none" stroke={color} strokeWidth="0.8" opacity="0.25" strokeLinecap="round" />;
      })}
      <circle cx="40" cy="40" r="4" fill={color} opacity="0.7">
        <animate attributeName="opacity" values="0.5;0.9;0.5" dur="4s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function CollisionShape({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 40 + 20 * Math.cos(rad);
        const y = 40 + 20 * Math.sin(rad);
        const x2 = 40 + 20 * Math.cos(rad + Math.PI);
        const y2 = 40 + 20 * Math.sin(rad + Math.PI);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="4" fill="none" stroke={color} strokeWidth="1.2" opacity="0.6">
              <animate attributeName="r" values="3;5;3" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
            <line x1={x} y1={y} x2={x2} y2={y2} stroke={color} strokeWidth="0.5" opacity="0.15" strokeDasharray="2 3" />
          </g>
        );
      })}
      <circle cx="40" cy="40" r="8" fill="none" stroke={color} strokeWidth="1.5" opacity="0.4" strokeDasharray="3 2">
        <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="40" cy="40" r="2" fill={color} opacity="0.9" />
    </svg>
  );
}

function FractalShape({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <polygon points="40,10 10,62 70,62" fill="none" stroke={color} strokeWidth="1.5" opacity="0.7" />
      <polygon points="25,36 40,62 10,62" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      <polygon points="55,36 70,62 40,62" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      <polygon points="40,10 25,36 55,36" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      <polygon points="32.5,23 25,36 40,36" fill="none" stroke={color} strokeWidth="0.7" opacity="0.3" />
      <polygon points="47.5,23 40,36 55,36" fill="none" stroke={color} strokeWidth="0.7" opacity="0.3" />
      <polygon points="17.5,49 10,62 25,62" fill="none" stroke={color} strokeWidth="0.7" opacity="0.3" />
      <polygon points="32.5,49 25,62 40,62" fill="none" stroke={color} strokeWidth="0.7" opacity="0.3" />
      <polygon points="47.5,49 40,62 55,62" fill="none" stroke={color} strokeWidth="0.7" opacity="0.3" />
      <polygon points="62.5,49 55,62 70,62" fill="none" stroke={color} strokeWidth="0.7" opacity="0.3" />
      <circle cx="40" cy="40" r="2" fill={color} opacity="0.5">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function TherapeuticShape({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <defs>
        <radialGradient id="th-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="40" cy="40" r="32" fill="url(#th-glow)" />
      <circle cx="40" cy="40" r="24" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      {[0, 60, 120, 180, 240, 300].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x = 40 + 24 * Math.cos(rad);
        const y = 40 + 24 * Math.sin(rad);
        return <circle key={angle} cx={x} cy={y} r="12" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" />;
      })}
      <circle cx="40" cy="40" r="8" fill="none" stroke={color} strokeWidth="1" opacity="0.4">
        <animate attributeName="r" values="7;10;7" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="40" cy="40" r="3" fill={color} opacity="0.6" />
    </svg>
  );
}

function BiologicalShape({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <path d="M30 12 Q42 20 30 28 Q18 36 30 44 Q42 52 30 60 Q18 68 30 72" fill="none" stroke={color} strokeWidth="2" opacity="0.7" strokeLinecap="round" />
      <path d="M50 12 Q38 20 50 28 Q62 36 50 44 Q38 52 50 60 Q62 68 50 72" fill="none" stroke={color} strokeWidth="2" opacity="0.5" strokeLinecap="round" />
      {[20, 28, 36, 44, 52, 60].map((y, i) => (
        <line key={i} x1="30" y1={y} x2="50" y2={y} stroke={color} strokeWidth="1" opacity={0.15 + (i % 2) * 0.1} />
      ))}
      <circle cx="40" cy="20" r="2" fill={color} opacity="0.5">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="40" cy="44" r="2" fill={color} opacity="0.5">
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function ParametricShape({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <ellipse cx="40" cy="40" rx="26" ry="12" fill="none" stroke={color} strokeWidth="1.8" opacity="0.6" />
      <ellipse cx="40" cy="40" rx="26" ry="12" fill="none" stroke={color} strokeWidth="1" opacity="0.3" transform="rotate(60 40 40)" />
      <ellipse cx="40" cy="40" rx="26" ry="12" fill="none" stroke={color} strokeWidth="1" opacity="0.3" transform="rotate(120 40 40)" />
      <path d="M40 15 Q55 25 55 40 Q55 55 40 65 Q25 55 25 40 Q25 25 40 15" fill="none" stroke={color} strokeWidth="0.8" opacity="0.2" />
      <circle cx="40" cy="40" r="5" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />
      <circle cx="40" cy="40" r="2" fill={color} opacity="0.7">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function NerfShape({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      {[0, 1, 2, 3, 4].map((i) => {
        const r = 8 + i * 5;
        return (
          <circle key={i} cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="0.8" opacity={0.5 - i * 0.08} strokeDasharray={`${2 + i} ${3 + i}`}>
            <animate attributeName="stroke-dashoffset" values={`0;${10 + i * 5}`} dur={`${3 + i}s`} repeatCount="indefinite" />
          </circle>
        );
      })}
      <line x1="15" y1="15" x2="40" y2="40" stroke={color} strokeWidth="0.6" opacity="0.2" />
      <line x1="65" y1="15" x2="40" y2="40" stroke={color} strokeWidth="0.6" opacity="0.2" />
      <line x1="15" y1="65" x2="40" y2="40" stroke={color} strokeWidth="0.6" opacity="0.2" />
      <line x1="65" y1="65" x2="40" y2="40" stroke={color} strokeWidth="0.6" opacity="0.2" />
      <circle cx="15" cy="15" r="2" fill={color} opacity="0.4" />
      <circle cx="65" cy="15" r="2" fill={color} opacity="0.4" />
      <circle cx="15" cy="65" r="2" fill={color} opacity="0.4" />
      <circle cx="65" cy="65" r="2" fill={color} opacity="0.4" />
      <circle cx="40" cy="40" r="3" fill={color} opacity="0.7">
        <animate attributeName="r" values="2;4;2" dur="2.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function renderEngineShape(engineId: string, color: string, size: number) {
  switch (engineId) {
    case "tensorFields": return <TensorFieldShape color={color} size={size} />;
    case "quantumVisualization": return <QuantumShape color={color} size={size} />;
    case "waveSystems": return <WaveSystemShape color={color} size={size} />;
    case "galaxySimulation": return <GalaxyShape color={color} size={size} />;
    case "collisionPhysics": return <CollisionShape color={color} size={size} />;
    case "fractalGeneration": return <FractalShape color={color} size={size} />;
    case "therapeuticGeometry": return <TherapeuticShape color={color} size={size} />;
    case "biologicalModeling": return <BiologicalShape color={color} size={size} />;
    case "parametricSurfaces": return <ParametricShape color={color} size={size} />;
    case "nerfExport": return <NerfShape color={color} size={size} />;
    default: return <ParametricShape color={color} size={size} />;
  }
}

type ExplorationEngineProps = {
  onExplore: (prompt: string) => void;
};

export default function ExplorationEngine({ onExplore }: ExplorationEngineProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [hoveredBond, setHoveredBond] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type FlowParticle = {
      bondIdx: number;
      t: number;
      speed: number;
      r: number;
      g: number;
      b: number;
      size: number;
    };
    type AmbientParticle = {
      x: number; y: number;
      vx: number; vy: number;
      life: number; maxLife: number;
      r: number; g: number; b: number;
    };

    const flowParticles: FlowParticle[] = [];
    const ambientParticles: AmbientParticle[] = [];
    let pulsePhase = 0;

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    let lastFrame = 0;
    const INTERVAL = 1000 / 30;

    const hexRgb = (hex: string) => ({
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16),
    });

    const animate = (ts: number) => {
      rafRef.current = requestAnimationFrame(animate);
      if (ts - lastFrame < INTERVAL) return;
      lastFrame = ts - ((ts - lastFrame) % INTERVAL);

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      pulsePhase += 0.02;

      const posPixels = GRID_POSITIONS.map(p => ({
        x: (p.x / 100) * w,
        y: (p.y / 100) * h,
      }));
      const centerX = w / 2;
      const centerY = h / 2;

      const globalPulse = 0.5 + 0.5 * Math.sin(pulsePhase * 0.8);

      for (let b = 0; b < CONSTELLATION_BONDS.length; b++) {
        const [a1, a2] = CONSTELLATION_BONDS[b];
        const p1 = posPixels[a1];
        const p2 = posPixels[a2];
        const c1 = hexRgb(ENGINE_AGENTS[a1].color);
        const c2 = hexRgb(ENGINE_AGENTS[a2].color);

        const mr = (c1.r + c2.r) / 2;
        const mg = (c1.g + c2.g) / 2;
        const mb = (c1.b + c2.b) / 2;

        const bondPulse = 0.5 + 0.5 * Math.sin(pulsePhase + b * 0.4);
        const baseAlpha = 0.04 + bondPulse * 0.04;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        const cpx = (p1.x + p2.x) / 2 + (centerX - (p1.x + p2.x) / 2) * 0.15;
        const cpy = (p1.y + p2.y) / 2 + (centerY - (p1.y + p2.y) / 2) * 0.15;
        ctx.quadraticCurveTo(cpx, cpy, p2.x, p2.y);
        ctx.strokeStyle = `rgba(${mr},${mg},${mb},${baseAlpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        if (Math.random() < 0.06) {
          const fromA = Math.random() > 0.5;
          const col = fromA ? c1 : c2;
          flowParticles.push({
            bondIdx: b,
            t: fromA ? 0 : 1,
            speed: (fromA ? 1 : -1) * (0.008 + Math.random() * 0.012),
            r: col.r, g: col.g, b: col.b,
            size: 1 + Math.random() * 1.5,
          });
        }
      }

      for (let i = 0; i < ENGINE_AGENTS.length; i++) {
        const p = posPixels[i];
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        const cpx = p.x + (centerX - p.x) * 0.3;
        const cpy = p.y + (centerY - p.y) * 0.3;
        ctx.quadraticCurveTo(cpx, cpy, centerX, centerY);
        ctx.strokeStyle = `rgba(240,185,59,${0.02 + globalPulse * 0.02})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      const coreRadius = 4 + globalPulse * 3;
      const coreGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreRadius * 4);
      coreGrad.addColorStop(0, `rgba(240,185,59,${0.15 + globalPulse * 0.1})`);
      coreGrad.addColorStop(1, "rgba(240,185,59,0)");
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius * 4, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      for (let i = flowParticles.length - 1; i >= 0; i--) {
        const fp = flowParticles[i];
        fp.t += fp.speed;
        if (fp.t < 0 || fp.t > 1) { flowParticles.splice(i, 1); continue; }

        const [a1, a2] = CONSTELLATION_BONDS[fp.bondIdx];
        const p1 = posPixels[a1];
        const p2 = posPixels[a2];
        const cpx = (p1.x + p2.x) / 2 + (centerX - (p1.x + p2.x) / 2) * 0.15;
        const cpy = (p1.y + p2.y) / 2 + (centerY - (p1.y + p2.y) / 2) * 0.15;

        const t = fp.t;
        const mt = 1 - t;
        const fx = mt * mt * p1.x + 2 * mt * t * cpx + t * t * p2.x;
        const fy = mt * mt * p1.y + 2 * mt * t * cpy + t * t * p2.y;

        const edgeFade = Math.min(fp.t, 1 - fp.t) * 4;
        const alpha = Math.min(edgeFade, 1) * 0.7;

        ctx.beginPath();
        ctx.arc(fx, fy, fp.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${fp.r},${fp.g},${fp.b},${alpha})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(fx, fy, fp.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${fp.r},${fp.g},${fp.b},${alpha * 0.15})`;
        ctx.fill();
      }

      for (let i = 0; i < ENGINE_AGENTS.length; i++) {
        const agent = ENGINE_AGENTS[i];
        const p = posPixels[i];
        if (Math.random() < 0.02 && ambientParticles.length < 50) {
          const col = hexRgb(agent.color);
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.15 + Math.random() * 0.3;
          ambientParticles.push({
            x: p.x, y: p.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 30 + Math.random() * 40,
            maxLife: 30 + Math.random() * 40,
            r: col.r, g: col.g, b: col.b,
          });
        }

        const nodePulse = 0.5 + 0.5 * Math.sin(pulsePhase + i * 0.6);
        const fieldRadius = 25 + nodePulse * 10;
        const fieldGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, fieldRadius);
        const col = hexRgb(agent.color);
        fieldGrad.addColorStop(0, `rgba(${col.r},${col.g},${col.b},${0.03 + nodePulse * 0.02})`);
        fieldGrad.addColorStop(1, `rgba(${col.r},${col.g},${col.b},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, fieldRadius, 0, Math.PI * 2);
        ctx.fillStyle = fieldGrad;
        ctx.fill();
      }

      for (let i = ambientParticles.length - 1; i >= 0; i--) {
        const p = ambientParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        if (p.life <= 0) { ambientParticles.splice(i, 1); continue; }
        const alpha = Math.min(p.life / p.maxLife, (p.maxLife - p.life) / 10) * 0.3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${alpha})`;
        ctx.fill();
      }

      if (flowParticles.length > 120) flowParticles.splice(0, flowParticles.length - 120);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleNodeClick = useCallback((agent: EngineAgent) => {
    setActiveNode(agent.id);
    setTimeout(() => { onExplore(agent.prompt); }, 500);
  }, [onExplore]);

  const handleBondClick = useCallback((bondIdx: number) => {
    const [a1, a2, reason] = CONSTELLATION_BONDS[bondIdx];
    const eng1 = ENGINE_AGENTS[a1];
    const eng2 = ENGINE_AGENTS[a2];
    onExplore(`How do ${eng1.name} and ${eng2.name} fuse together? ${reason}. Show me where these two engines intersect and what new physics emerges at that junction.`);
  }, [onExplore]);

  const totalShapes = ENGINE_AGENTS.reduce((s, a) => s + a.count, 0);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden select-none" data-testid="exploration-engine">
      <div className="absolute inset-0 clouud-ambient" />
      <div className="absolute inset-0 lattice-grid-deep opacity-20" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center mb-2 md:mb-4"
      >
        <h1 className="font-display text-3xl md:text-5xl text-white font-bold tracking-[0.3em] mb-1" style={{ textShadow: "0 0 30px rgba(240,185,59,0.25)" }}>CLOUUD</h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="font-mono text-[9px] md:text-[11px] text-primary/70 tracking-[0.4em] uppercase"
        >
          {totalShapes.toLocaleString()} shapes · {ENGINE_AGENTS.length} engines · {CONSTELLATION_BONDS.length} bonds · One System
        </motion.p>
      </motion.div>

      <div className="relative w-full max-w-2xl z-10" style={{ aspectRatio: "4/3" }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px rgba(240,185,59,0.15), 0 0 50px rgba(74,140,212,0.08)",
                "0 0 40px rgba(240,185,59,0.25), 0 0 70px rgba(74,140,212,0.15)",
                "0 0 20px rgba(240,185,59,0.15), 0 0 50px rgba(74,140,212,0.08)",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary/15 to-secondary/15 border border-primary/25 flex items-center justify-center cursor-pointer z-20"
            onClick={() => onExplore("Who is Clouud?")}
            data-testid="button-core-node"
          >
            <Brain className="w-7 h-7 md:w-8 md:h-8 text-primary" />
          </motion.div>
        </div>

        <svg className="absolute inset-0 w-full h-full pointer-events-none z-[5]" viewBox="0 0 100 100" preserveAspectRatio="none">
          {CONSTELLATION_BONDS.map(([a1, a2, reason], idx) => {
            const p1 = GRID_POSITIONS[a1];
            const p2 = GRID_POSITIONS[a2];
            const cpx = (p1.x + p2.x) / 2 + (50 - (p1.x + p2.x) / 2) * 0.15;
            const cpy = (p1.y + p2.y) / 2 + (48 - (p1.y + p2.y) / 2) * 0.15;
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            const isHovered = hoveredBond === idx;
            return (
              <g key={idx}>
                <path
                  d={`M${p1.x},${p1.y} Q${cpx},${cpy} ${p2.x},${p2.y}`}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="4"
                  style={{ cursor: "pointer", pointerEvents: "stroke" }}
                  onMouseEnter={() => setHoveredBond(idx)}
                  onMouseLeave={() => setHoveredBond(null)}
                  onClick={() => handleBondClick(idx)}
                />
                {isHovered && (
                  <g>
                    <circle cx={midX} cy={midY} r="1.5" fill="rgba(240,185,59,0.6)" />
                    <foreignObject x={midX - 15} y={midY + 2} width="30" height="10" style={{ overflow: "visible" }}>
                      <div style={{
                        fontSize: "2.2px",
                        color: "rgba(255,255,255,0.7)",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        fontFamily: "monospace",
                        background: "rgba(0,0,0,0.6)",
                        padding: "0.5px 1.5px",
                        borderRadius: "1px",
                        border: "0.3px solid rgba(240,185,59,0.3)",
                        transform: "translateX(-50%)",
                        marginLeft: "50%",
                        width: "fit-content",
                      }}>
                        {reason.split(":")[0]}
                      </div>
                    </foreignObject>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {ENGINE_AGENTS.map((agent, i) => {
          const pos = GRID_POSITIONS[i];
          const isHovered = hoveredNode === agent.id;
          const isActive = activeNode === agent.id;
          const shapeSize = isHovered ? 65 : 52;
          const bondCount = CONSTELLATION_BONDS.filter(([a, b]) => a === i || b === i).length;

          return (
            <motion.div
              key={agent.id}
              className="absolute cursor-pointer will-change-transform"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: "translate(-50%, -50%)",
                zIndex: isHovered ? 30 : 10,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: isActive ? 0 : 1,
                scale: isActive ? 1.8 : (isHovered ? 1.15 : 1),
              }}
              transition={{
                opacity: { duration: isActive ? 0.3 : 0.6, delay: isActive ? 0 : i * 0.08 },
                scale: { duration: 0.3, ease: "easeOut" },
              }}
              onMouseEnter={() => setHoveredNode(agent.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => handleNodeClick(agent)}
              data-testid={`agent-node-${agent.id}`}
            >
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full blur-xl transition-all duration-300"
                  style={{
                    backgroundColor: agent.color,
                    opacity: isHovered ? 0.35 : 0.08,
                    transform: `scale(${isHovered ? 2.2 : 1.6})`,
                  }}
                />
                <div className="relative glass-panel rounded-full p-1" style={{ borderColor: `${agent.color}20` }}>
                  {renderEngineShape(agent.id, agent.color, shapeSize)}
                </div>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                  <span className="font-mono text-[6px] px-1 py-0.5 rounded-sm whitespace-nowrap" style={{ color: agent.color, backgroundColor: `${agent.color}10`, border: `1px solid ${agent.color}15` }}>
                    {agent.count}
                  </span>
                  <span className="font-mono text-[6px] px-1 py-0.5 rounded-sm whitespace-nowrap" style={{ color: "rgba(240,185,59,0.6)", backgroundColor: "rgba(240,185,59,0.05)", border: "1px solid rgba(240,185,59,0.1)" }}>
                    {bondCount}⟁
                  </span>
                </div>
              </div>

              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 glass-panel rounded-sm px-3 py-2.5 min-w-[200px] max-w-[260px] text-center z-40"
                    style={{ borderColor: `${agent.color}30` }}
                  >
                    <div className="font-display text-[9px] text-white font-bold tracking-wider uppercase">{agent.name}</div>
                    <div className="font-mono text-[7px] mt-1 leading-relaxed" style={{ color: agent.color }}>{agent.description}</div>
                    <div className="font-mono text-[7px] mt-1 text-muted-foreground leading-relaxed">{agent.earthApplication}</div>
                    <div className="flex flex-wrap justify-center gap-0.5 mt-1.5">
                      {agent.shapes.slice(0, 4).map((s) => (
                        <span key={s} className="font-mono text-[6px] px-1 py-0.5 rounded-sm" style={{ backgroundColor: `${agent.color}10`, color: `${agent.color}aa`, border: `1px solid ${agent.color}15` }}>
                          {s.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                    {agent.mathematicalDNA && (
                      <div className="flex flex-wrap justify-center gap-0.5 mt-1">
                        {agent.mathematicalDNA.slice(0, 3).map((d) => (
                          <span key={d} className="font-mono text-[5px] px-1 py-0.5 rounded-sm text-white/40" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                            DNA: {d.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    )}
                    {agent.fusionDomains && (
                      <div className="flex flex-wrap justify-center gap-0.5 mt-1">
                        {agent.fusionDomains.map((f) => (
                          <span key={f} className="font-mono text-[5px] px-1 py-0.5 rounded-sm text-white/40" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                            ⟁ {f.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    )}
                    {agent.formats && (
                      <div className="flex flex-wrap justify-center gap-0.5 mt-1">
                        {agent.formats.map((f) => (
                          <span key={f} className="font-mono text-[5px] px-1 py-0.5 rounded-sm text-white/40" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                            ↗ {f}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-1.5 pt-1 border-t border-white/5">
                      <div className="font-mono text-[5px] text-white/30 mb-1">CONSTELLATION BONDS</div>
                      <div className="flex flex-wrap justify-center gap-0.5">
                        {CONSTELLATION_BONDS.filter(([a, b]) => a === i || b === i).map(([a, b, reason], bIdx) => {
                          const other = a === i ? b : a;
                          return (
                            <span key={bIdx} className="font-mono text-[5px] px-1 py-0.5 rounded-sm" style={{ color: ENGINE_AGENTS[other].color, backgroundColor: `${ENGINE_AGENTS[other].color}08`, border: `1px solid ${ENGINE_AGENTS[other].color}15` }}>
                              ⟁ {ENGINE_AGENTS[other].name.split(" ")[0]}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-1 mt-2 text-[7px] text-white/50">
                      <span className="font-mono font-bold" style={{ color: agent.color }}>{agent.count} shapes</span>
                      <span>·</span>
                      <span>{bondCount} bonds</span>
                      <span>·</span>
                      <span>Tap to activate</span>
                      <ChevronRight className="w-2 h-2" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="relative z-10 mt-2 md:mt-4 text-center max-w-lg"
      >
        <p className="font-mono text-[8px] text-muted-foreground/50 mb-2 tracking-wider">
          NODES = ENGINES · LINES = FUSION BONDS · TAP NODES OR BONDS TO EXPLORE
        </p>
        <div className="flex flex-wrap justify-center gap-1.5">
          {[
            { label: "What can you do?", icon: <Brain className="w-3 h-3" /> },
            { label: "Enhance my idea", icon: <Zap className="w-3 h-3" /> },
            { label: "Surprise me", icon: <Globe className="w-3 h-3" /> },
          ].map((action, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 + i * 0.12 }}
              onClick={() => onExplore(action.label)}
              className="flex items-center gap-1.5 px-3 py-1.5 glass-card rounded-sm text-[10px] text-muted-foreground hover:text-white font-mono tracking-wider uppercase transition-all"
              data-testid={`button-engine-action-${i}`}
            >
              {action.icon}
              {action.label}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
