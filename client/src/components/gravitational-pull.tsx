import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Shield, Zap, Recycle, AlertTriangle, HeartPulse } from "lucide-react";

export type GravNotificationType = "immune" | "correction" | "symbiont" | "quarantine" | "extinction" | "score" | "paraneuma";

export type GravNotification = {
  id: string;
  type: GravNotificationType;
  message: string;
  timestamp: number;
};

const TYPE_CONFIG: Record<GravNotificationType, { icon: typeof Activity; color: string; glow: string; label: string }> = {
  immune: { icon: Shield, color: "#ef4444", glow: "0 0 20px rgba(239,68,68,0.4)", label: "IMMUNE" },
  correction: { icon: HeartPulse, color: "#22c55e", glow: "0 0 20px rgba(34,197,94,0.4)", label: "PURGE" },
  symbiont: { icon: Zap, color: "#a855f7", glow: "0 0 20px rgba(168,85,247,0.4)", label: "SYMBIONT" },
  quarantine: { icon: AlertTriangle, color: "#f59e0b", glow: "0 0 20px rgba(245,158,11,0.4)", label: "QUARANTINE" },
  extinction: { icon: Recycle, color: "#6b7280", glow: "0 0 20px rgba(107,114,128,0.3)", label: "EXTINCT" },
  score: { icon: Activity, color: "#3b82f6", glow: "0 0 20px rgba(59,130,246,0.4)", label: "SCORE" },
  paraneuma: { icon: HeartPulse, color: "#06b6d4", glow: "0 0 20px rgba(6,182,212,0.4)", label: "PARANEUMA" },
};

function getRandomEdgePosition() {
  const edge = Math.floor(Math.random() * 4);
  const offset = 20 + Math.random() * 60;
  switch (edge) {
    case 0: return { x: offset + "vw", y: "-60px" };
    case 1: return { x: "calc(100vw + 60px)", y: offset + "vh" };
    case 2: return { x: offset + "vw", y: "calc(100vh + 60px)" };
    default: return { x: "-200px", y: offset + "vh" };
  }
}

function GravNotificationItem({ notification, onDismiss }: { notification: GravNotification; onDismiss: (id: string) => void }) {
  const config = TYPE_CONFIG[notification.type];
  const Icon = config.icon;
  const startPos = getRandomEdgePosition();

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(notification.id), 6000);
    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  return (
    <motion.div
      data-testid={`grav-notification-${notification.type}-${notification.id}`}
      initial={{
        position: "fixed",
        left: startPos.x,
        top: startPos.y,
        opacity: 0,
        scale: 0.3,
      }}
      animate={{
        left: "50%",
        top: "50%",
        opacity: [0, 1, 1, 1, 0.8, 0],
        scale: [0.3, 0.6, 1.05, 1, 0.95, 0.8],
        x: [0, 0, "-50%"],
        y: [0, 0, "-50%"],
      }}
      transition={{
        duration: 5.5,
        times: [0, 0.15, 0.35, 0.5, 0.8, 1],
        ease: [0.25, 0.1, 0.25, 1],
        left: { duration: 2.5, ease: [0.34, 1.56, 0.64, 1] },
        top: { duration: 2.5, ease: [0.34, 1.56, 0.64, 1] },
      }}
      style={{
        position: "fixed",
        zIndex: 9999,
        pointerEvents: "auto",
        transformOrigin: "center center",
      }}
      onClick={() => onDismiss(notification.id)}
      className="cursor-pointer"
    >
      <motion.div
        animate={{
          y: [0, -4, 0, 3, 0, -2, 0],
          x: [0, 2, 0, -2, 0, 1, 0],
          rotate: [0, 0.5, 0, -0.5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-sm border backdrop-blur-md"
        style={{
          backgroundColor: "rgba(0,0,0,0.85)",
          borderColor: config.color + "40",
          boxShadow: config.glow + ", inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Icon className="w-4 h-4" style={{ color: config.color }} />
        </motion.div>
        <div className="flex flex-col">
          <span className="font-mono text-[8px] tracking-[0.2em] uppercase" style={{ color: config.color }}>
            {config.label}
          </span>
          <span className="font-mono text-[10px] text-foreground/80 max-w-[200px] truncate">
            {notification.message}
          </span>
        </div>
        <motion.div
          className="absolute inset-0 rounded-sm"
          style={{ border: `1px solid ${config.color}` }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  );
}

export function useGravitationalPull() {
  const [notifications, setNotifications] = useState<GravNotification[]>([]);

  const pull = useCallback((type: GravNotificationType, message: string) => {
    const id = `grav-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setNotifications(prev => {
      if (prev.length >= 3) return prev;
      return [...prev, { id, type, message, timestamp: Date.now() }];
    });
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return { notifications, pull, dismiss };
}

export default function GravitationalPullLayer({
  notifications,
  onDismiss,
}: {
  notifications: GravNotification[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div
      data-testid="gravitational-pull-layer"
      style={{ position: "fixed", inset: 0, zIndex: 9998, pointerEvents: "none" }}
    >
      <AnimatePresence>
        {notifications.map(n => (
          <GravNotificationItem key={n.id} notification={n} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}
