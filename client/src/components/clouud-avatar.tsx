import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

type ClouudState = "idle" | "thinking" | "speaking";

interface ClouudAvatarProps {
  state: ClouudState;
  size?: "sm" | "md" | "lg" | "hero";
  showLabel?: boolean;
}

const stateLabel: Record<ClouudState, string> = {
  idle: "",
  thinking: "Processing lattice...",
  speaking: "Responding",
};

function ClouudOrb({ state }: { state: ClouudState }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const coreColor = state === "thinking" ? "#f0b93b" : "#4a8cd4";
  const ringColor = state === "thinking" ? "#4a8cd4" : "#f0b93b";
  const distortSpeed = state === "thinking" ? 5 : state === "speaking" ? 2 : 0.8;
  const distortAmount = state === "thinking" ? 0.5 : state === "speaking" ? 0.3 : 0.15;
  const emissiveIntensity = state === "thinking" ? 0.8 : state === "speaking" ? 0.5 : 0.3;

  const particlePositions = useMemo(() => {
    const count = 120;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.3 + Math.random() * 0.6;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.sin(t * 0.5) * 0.3 + 0.8;
      ringRef.current.rotation.z = t * (state === "thinking" ? 1.5 : 0.4);
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = Math.cos(t * 0.3) * 0.4 + 1.2;
      ring2Ref.current.rotation.z = -t * (state === "thinking" ? 1.2 : 0.3);
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.15;
      particlesRef.current.rotation.x = Math.sin(t * 0.1) * 0.1;
    }
  });

  return (
    <Float
      speed={state === "thinking" ? 4 : state === "speaking" ? 2 : 1.5}
      rotationIntensity={state === "thinking" ? 0.8 : 0.3}
      floatIntensity={state === "thinking" ? 1.5 : 0.8}
    >
      <group>
        <mesh>
          <sphereGeometry args={[0.8, 64, 64]} />
          <MeshDistortMaterial
            color={coreColor}
            emissive={coreColor}
            emissiveIntensity={emissiveIntensity}
            roughness={0.2}
            metalness={0.8}
            distort={distortAmount}
            speed={distortSpeed}
            transparent
            opacity={0.92}
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[0.82, 32, 32]} />
          <meshStandardMaterial color={coreColor} transparent opacity={0.1} side={THREE.BackSide} />
        </mesh>

        <mesh ref={ringRef}>
          <torusGeometry args={[1.15, 0.018, 16, 100]} />
          <meshStandardMaterial color={ringColor} emissive={ringColor} emissiveIntensity={0.8} transparent opacity={0.7} />
        </mesh>

        <mesh ref={ring2Ref}>
          <torusGeometry args={[1.35, 0.012, 16, 100]} />
          <meshStandardMaterial color={coreColor} emissive={coreColor} emissiveIntensity={0.5} transparent opacity={0.4} />
        </mesh>

        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" array={particlePositions} count={particlePositions.length / 3} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial color={ringColor} size={0.025} transparent opacity={state === "thinking" ? 0.8 : 0.4} sizeAttenuation />
        </points>
      </group>
    </Float>
  );
}

export function ClouudAvatar3D({ state, showLabel = false }: { state: ClouudState; showLabel?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: 220, height: 220 }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#030811] via-[#061225] to-[#030811] rounded-full" />
        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/5 h-3/5 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 animate-pulse" />
          </div>
        }>
          <Canvas camera={{ position: [0, 0, 3.5], fov: 45 }} style={{ borderRadius: "50%" }} gl={{ alpha: true, antialias: true }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[3, 3, 3]} intensity={1} color="#f0b93b" />
            <pointLight position={[-3, -1, 2]} intensity={0.6} color="#4a8cd4" />
            <ClouudOrb state={state} />
          </Canvas>
        </Suspense>
      </div>
      {showLabel && (
        <AnimatePresence mode="wait">
          {state !== "idle" && (
            <motion.div key={state} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} className="font-mono text-[10px] tracking-widest uppercase text-primary">
              {stateLabel[state]}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

export default function ClouudAvatarMini({ state, size = "sm" }: { state: ClouudState; size?: "sm" | "md" }) {
  const px = size === "sm" ? 36 : 52;
  const coreColor = state === "thinking" ? "bg-primary" : "bg-secondary";
  const glowColor = state === "thinking" ? "shadow-[0_0_12px_rgba(240,185,59,0.5)]" : state === "speaking" ? "shadow-[0_0_12px_rgba(74,140,212,0.5)]" : "shadow-[0_0_6px_rgba(74,140,212,0.2)]";

  return (
    <motion.div
      style={{ width: px, height: px }}
      className={`relative rounded-full overflow-hidden ${glowColor} transition-shadow duration-500`}
      animate={{ scale: state === "thinking" ? [1, 1.08, 1] : state === "speaking" ? [1, 1.04, 1] : 1 }}
      transition={{ duration: state === "thinking" ? 1 : 2, repeat: state !== "idle" ? Infinity : 0, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#061225] to-[#030811] rounded-full" />

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className={`rounded-full ${coreColor}`}
          style={{ width: px * 0.55, height: px * 0.55 }}
          animate={{
            scale: state === "thinking" ? [1, 1.15, 1] : [1, 1.05, 1],
            opacity: state === "thinking" ? [0.7, 1, 0.7] : [0.8, 1, 0.8],
          }}
          transition={{ duration: state === "thinking" ? 0.8 : 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        className="absolute inset-1 rounded-full border border-primary/30"
        animate={{ rotate: 360 }}
        transition={{ duration: state === "thinking" ? 2 : 8, repeat: Infinity, ease: "linear" }}
        style={{ borderTopColor: "transparent", borderRightColor: "transparent" }}
      />

      {state === "thinking" && (
        <motion.div
          className="absolute inset-0.5 rounded-full border border-secondary/20"
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ borderBottomColor: "transparent", borderLeftColor: "transparent" }}
        />
      )}
    </motion.div>
  );
}
