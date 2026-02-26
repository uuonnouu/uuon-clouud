import { motion } from "framer-motion";
import clouudImage from "@assets/Image_2-26-26_at_01.30_1772066494720.png";

type ClouudState = "idle" | "thinking" | "speaking";

interface ClouudAvatarProps {
  state: ClouudState;
  size?: "sm" | "md" | "lg" | "hero";
  showLabel?: boolean;
}

const sizeMap = {
  sm: 36,
  md: 52,
  lg: 80,
  hero: 200,
};

export default function ClouudAvatar({ state, size = "md", showLabel = false }: ClouudAvatarProps) {
  const px = sizeMap[size];
  const glowColor = state === "thinking"
    ? "shadow-[0_0_20px_rgba(240,185,59,0.5)]"
    : state === "speaking"
    ? "shadow-[0_0_20px_rgba(74,140,212,0.5)]"
    : "shadow-[0_0_10px_rgba(74,140,212,0.15)]";

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        style={{ width: px, height: px }}
        className={`relative rounded-full overflow-hidden ${glowColor} transition-shadow duration-500`}
        animate={{
          scale: state === "thinking" ? [1, 1.06, 1] : state === "speaking" ? [1, 1.03, 1] : 1,
        }}
        transition={{
          duration: state === "thinking" ? 1 : 2.5,
          repeat: state !== "idle" ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        <img
          src={clouudImage}
          alt="Clouud"
          className="w-full h-full object-cover rounded-full"
          draggable={false}
        />

        {state === "thinking" && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/40 pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{ borderTopColor: "transparent", borderRightColor: "transparent" }}
          />
        )}

        {state === "speaking" && (
          <motion.div
            className="absolute inset-0 rounded-full border border-secondary/30 pointer-events-none"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </motion.div>

      {showLabel && state !== "idle" && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-[10px] tracking-widest uppercase text-primary"
        >
          {state === "thinking" ? "Processing lattice..." : "Responding"}
        </motion.div>
      )}
    </div>
  );
}
