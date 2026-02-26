import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Globe, Zap, ChevronRight } from "lucide-react";

type ShapeNode = {
  id: string;
  label: string;
  description: string;
  prompt: string;
  icon: "torus" | "tetrahedron" | "wave" | "helix" | "lattice" | "monad";
  color: string;
  x: number;
  y: number;
  scale: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitOffset: number;
};

const SHAPE_NODES: ShapeNode[] = [
  {
    id: "energy",
    label: "Energy",
    description: "Clean power from sun, wind, and water",
    prompt: "How can we enhance clean energy systems using patterns from nature?",
    icon: "wave",
    color: "#4a8cd4",
    x: 50, y: 30,
    scale: 1.2,
    orbitRadius: 28,
    orbitSpeed: 0.0003,
    orbitOffset: 0,
  },
  {
    id: "patterns",
    label: "Patterns",
    description: "The same shapes show up everywhere on Earth",
    prompt: "Show me patterns that repeat across nature and how we can use them",
    icon: "tetrahedron",
    color: "#f0b93b",
    x: 50, y: 30,
    scale: 1.0,
    orbitRadius: 28,
    orbitSpeed: 0.0003,
    orbitOffset: Math.PI * 0.4,
  },
  {
    id: "systems",
    label: "Systems",
    description: "Rivers, roots, and networks all flow the same way",
    prompt: "How are rivers, blood vessels, and the internet all built the same way?",
    icon: "torus",
    color: "#8b5cf6",
    x: 50, y: 30,
    scale: 1.1,
    orbitRadius: 28,
    orbitSpeed: 0.0003,
    orbitOffset: Math.PI * 0.8,
  },
  {
    id: "life",
    label: "Life",
    description: "Spirals inside every living thing",
    prompt: "What shapes make life work — from seeds to galaxies?",
    icon: "helix",
    color: "#22c55e",
    x: 50, y: 30,
    scale: 0.9,
    orbitRadius: 28,
    orbitSpeed: 0.0003,
    orbitOffset: Math.PI * 1.2,
  },
  {
    id: "enhance",
    label: "Enhance",
    description: "Bring your idea — let's make it better",
    prompt: "I have a project I want to enhance. Help me think through it.",
    icon: "lattice",
    color: "#f0b93b",
    x: 50, y: 30,
    scale: 1.0,
    orbitRadius: 28,
    orbitSpeed: 0.0003,
    orbitOffset: Math.PI * 1.6,
  },
];

function WaveShape({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60">
      <defs>
        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path d="M5 30 Q15 10 25 30 Q35 50 45 30 Q55 10 55 30" fill="none" stroke="url(#waveGrad)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M5 35 Q15 15 25 35 Q35 55 45 35 Q55 15 55 35" fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.3" />
      <circle cx="25" cy="30" r="3" fill={color} opacity="0.6">
        <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function TetrahedronShape({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60">
      <defs>
        <linearGradient id="tetraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <polygon points="30,8 8,50 52,50" fill="none" stroke="url(#tetraGrad)" strokeWidth="2" strokeLinejoin="round" />
      <line x1="30" y1="8" x2="30" y2="50" stroke={color} strokeWidth="1" opacity="0.3" />
      <line x1="8" y1="50" x2="41" y2="29" stroke={color} strokeWidth="1" opacity="0.2" />
      <line x1="52" y1="50" x2="19" y2="29" stroke={color} strokeWidth="1" opacity="0.2" />
      <circle cx="30" cy="36" r="2" fill={color} opacity="0.5">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function TorusShape({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60">
      <defs>
        <linearGradient id="torusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <ellipse cx="30" cy="30" rx="22" ry="10" fill="none" stroke="url(#torusGrad)" strokeWidth="2" />
      <ellipse cx="30" cy="30" rx="22" ry="10" fill="none" stroke={color} strokeWidth="1" opacity="0.2" transform="rotate(60 30 30)" />
      <ellipse cx="30" cy="30" rx="22" ry="10" fill="none" stroke={color} strokeWidth="1" opacity="0.2" transform="rotate(120 30 30)" />
      <circle cx="30" cy="30" r="4" fill="none" stroke={color} strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}

function HelixShape({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60">
      <path d="M20 8 Q40 15 20 22 Q0 29 20 36 Q40 43 20 50" fill="none" stroke={color} strokeWidth="2" opacity="0.7" strokeLinecap="round" />
      <path d="M40 8 Q20 15 40 22 Q60 29 40 36 Q20 43 40 50" fill="none" stroke={color} strokeWidth="2" opacity="0.4" strokeLinecap="round" />
      <line x1="20" y1="15" x2="40" y2="15" stroke={color} strokeWidth="1" opacity="0.2" />
      <line x1="20" y1="29" x2="40" y2="29" stroke={color} strokeWidth="1" opacity="0.2" />
      <line x1="20" y1="43" x2="40" y2="43" stroke={color} strokeWidth="1" opacity="0.2" />
    </svg>
  );
}

function LatticeShape({ color, size }: { color: string; size: number }) {
  const points: [number, number][] = [];
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 * Math.PI) / 180;
    points.push([30 + 18 * Math.cos(angle), 30 + 18 * Math.sin(angle)]);
  }
  return (
    <svg width={size} height={size} viewBox="0 0 60 60">
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r="2" fill={color} opacity={0.3 + (i % 3) * 0.2}>
            <animate attributeName="opacity" values={`${0.3 + (i % 3) * 0.2};${0.7 + (i % 3) * 0.1};${0.3 + (i % 3) * 0.2}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
          {i < 11 && <line x1={p[0]} y1={p[1]} x2={points[i + 1][0]} y2={points[i + 1][1]} stroke={color} strokeWidth="0.5" opacity="0.15" />}
        </g>
      ))}
      <line x1={points[0][0]} y1={points[0][1]} x2={points[11][0]} y2={points[11][1]} stroke={color} strokeWidth="0.5" opacity="0.15" />
      <circle cx="30" cy="30" r="3" fill={color} opacity="0.5">
        <animate attributeName="r" values="3;4;3" dur="4s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function renderShape(icon: string, color: string, size: number) {
  switch (icon) {
    case "wave": return <WaveShape color={color} size={size} />;
    case "tetrahedron": return <TetrahedronShape color={color} size={size} />;
    case "torus": return <TorusShape color={color} size={size} />;
    case "helix": return <HelixShape color={color} size={size} />;
    case "lattice": return <LatticeShape color={color} size={size} />;
    default: return <TorusShape color={color} size={size} />;
  }
}

type ExplorationEngineProps = {
  onExplore: (prompt: string) => void;
};

export default function ExplorationEngine({ onExplore }: ExplorationEngineProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [time, setTime] = useState(0);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; vx: number; vy: number; life: number; color: string; theory?: string }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Theories into visual play
  const THEORIES = [
    { name: "Fluid Dynamics", color: "#4a8cd4", particles: 20, speed: 1.2 },
    { name: "Entropy Reduction", color: "#f0b93b", particles: 10, speed: 0.4 },
    { name: "Wave Interference", color: "#8b5cf6", particles: 15, speed: 1.8 },
    { name: "Tensor Fields", color: "#22c55e", particles: 12, speed: 0.8 },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const theory = THEORIES[Math.floor(Math.random() * THEORIES.length)];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      setParticles(prev => {
        const alive = prev.map(p => {
          const dx = p.vx * theory.speed;
          const dy = p.vy * theory.speed;
          return {
            ...p,
            x: p.x + dx,
            y: p.y + dy,
            life: p.life - 1
          };
        }).filter(p => p.life > 0);

        if (Math.random() < 0.1 && alive.length < 25) {
          alive.push({
            id: Math.random(),
            x: Math.random() * 100,
            y: Math.random() * 100,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            life: 50 + Math.random() * 50,
            color: theory.color,
            theory: theory.name
          });
        }
        return alive;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function handleNodeClick(node: ShapeNode) {
    setActiveNode(node.id);
    setTimeout(() => {
      onExplore(node.prompt);
    }, 600);
  }

  return (
    <div ref={containerRef} className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden select-none" data-testid="exploration-engine">
      <div className="absolute inset-0 clouud-ambient" />
      <div className="absolute inset-0 lattice-grid-deep opacity-40" />
      
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      <div className="absolute inset-0 pointer-events-none">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              backgroundColor: p.color,
              opacity: Math.min(p.life / 40, 0.6),
              boxShadow: `0 0 4px ${p.color}`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center mb-4 md:mb-8"
      >
        <h1 className="font-display text-3xl md:text-5xl text-white font-bold tracking-[0.3em] mb-1" style={{ textShadow: "0 0 30px rgba(240,185,59,0.25)" }}>CLOUUD</h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="font-mono text-[10px] md:text-xs text-primary/70 tracking-[0.5em] uppercase"
        >
          Earth Enhancement
        </motion.p>
      </motion.div>

      <div className="relative w-full max-w-lg aspect-square md:max-w-xl z-10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[60%] h-[60%] rounded-full border border-secondary/8 animate-[spin_120s_linear_infinite]" />
          <div className="absolute w-[85%] h-[85%] rounded-full border border-primary/5 animate-[spin_90s_linear_infinite_reverse]" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{
              boxShadow: [
                "0 0 30px rgba(240,185,59,0.2), 0 0 60px rgba(74,140,212,0.1)",
                "0 0 50px rgba(240,185,59,0.3), 0 0 80px rgba(74,140,212,0.2)",
                "0 0 30px rgba(240,185,59,0.2), 0 0 60px rgba(74,140,212,0.1)",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center cursor-pointer"
            onClick={() => onExplore("Who is Clouud?")}
            data-testid="button-core-node"
          >
            <Brain className="w-8 h-8 md:w-10 md:h-10 text-primary" />
          </motion.div>
        </div>

        {SHAPE_NODES.map((node, i) => {
          const angle = node.orbitOffset + time * node.orbitSpeed;
          const cx = 50 + node.orbitRadius * Math.cos(angle);
          const cy = 50 + node.orbitRadius * Math.sin(angle) * 0.6;
          const isHovered = hoveredNode === node.id;
          const isActive = activeNode === node.id;
          const shapeSize = isHovered ? 65 : 50;

          return (
            <motion.div
              key={node.id}
              className="absolute cursor-pointer"
              style={{
                left: `${cx}%`,
                top: `${cy}%`,
                transform: "translate(-50%, -50%)",
                zIndex: isHovered ? 20 : 10,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: isActive ? 0 : 1,
                scale: isActive ? 2 : (isHovered ? 1.3 : node.scale),
              }}
              transition={{
                opacity: { duration: isActive ? 0.3 : 0.8, delay: i * 0.15 },
                scale: { duration: isActive ? 0.4 : 0.3, ease: "easeOut" },
              }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => handleNodeClick(node)}
              data-testid={`shape-node-${node.id}`}
            >
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full blur-xl"
                  style={{
                    backgroundColor: node.color,
                    opacity: isHovered ? 0.4 : 0.15,
                    transform: `scale(${isHovered ? 2 : 1.5})`,
                    transition: "all 0.3s ease",
                  }}
                />
                <div className="relative glass-panel rounded-full p-2 md:p-3" style={{ borderColor: `${node.color}30` }}>
                  {renderShape(node.icon, node.color, shapeSize)}
                </div>
              </div>

              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 glass-panel rounded-sm px-3 py-2 min-w-[140px] text-center z-30"
                    style={{ borderColor: `${node.color}40` }}
                  >
                    <div className="font-display text-[11px] text-white font-bold tracking-wider uppercase">{node.label}</div>
                    <div className="font-mono text-[8px] mt-0.5" style={{ color: node.color }}>{node.description}</div>
                    <div className="flex items-center justify-center gap-1 mt-1.5 text-[8px] text-white/60">
                      <span>Tap to explore</span>
                      <ChevronRight className="w-2.5 h-2.5" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
          {SHAPE_NODES.map((node, i) => {
            const angle = node.orbitOffset + time * node.orbitSpeed;
            const cx = 50 + node.orbitRadius * Math.cos(angle);
            const cy = 50 + node.orbitRadius * Math.sin(angle) * 0.6;
            return (
              <line
                key={node.id}
                x1="50" y1="50"
                x2={cx} y2={cy}
                stroke={node.color}
                strokeWidth="0.3"
                opacity={hoveredNode === node.id ? 0.5 : 0.1}
                style={{ transition: "opacity 0.3s ease" }}
              />
            );
          })}
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="relative z-10 mt-4 md:mt-8 text-center max-w-md"
      >
        <p className="font-mono text-[10px] text-muted-foreground/60 mb-3 tracking-wider">
          TAP A SHAPE TO EXPLORE · OR ASK ANYTHING BELOW
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
              transition={{ delay: 1.5 + i * 0.15 }}
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