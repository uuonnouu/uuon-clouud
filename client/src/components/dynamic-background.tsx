import { useEffect, useRef, useMemo } from "react";

type SystemState = "idle" | "thinking" | "speaking";

interface DynamicBackgroundProps {
  aiState: SystemState;
  hashingIntensity: number;
  isTyping: boolean;
  notificationPulse?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  baseOpacity: number;
  hue: number;
  life: number;
  maxLife: number;
}

const STATE_COLORS = {
  idle: { h: 215, s: 60, l: 45 },
  thinking: { h: 42, s: 85, l: 55 },
  speaking: { h: 200, s: 70, l: 50 },
};

const NOTIFICATION_COLOR = { h: 42, s: 90, l: 60 };

export default function DynamicBackground({ aiState, hashingIntensity, isTyping, notificationPulse }: DynamicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const stateRef = useRef({ aiState, hashingIntensity, isTyping, notificationPulse });
  const pulseRef = useRef(0);
  const transitionRef = useRef({ fromH: 215, fromS: 60, fromL: 45, progress: 1 });

  useEffect(() => {
    const prev = stateRef.current;
    if (prev.aiState !== aiState) {
      const prevColor = STATE_COLORS[prev.aiState];
      transitionRef.current = { fromH: prevColor.h, fromS: prevColor.s, fromL: prevColor.l, progress: 0 };
    }
    stateRef.current = { aiState, hashingIntensity, isTyping, notificationPulse };
  }, [aiState, hashingIntensity, isTyping, notificationPulse]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;

    function resize() {
      if (!canvas) return;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    }
    resize();
    window.addEventListener("resize", resize);

    function spawnParticle(): Particle {
      const edge = Math.random();
      let x: number, y: number;
      if (edge < 0.25) { x = Math.random() * w; y = -5; }
      else if (edge < 0.5) { x = Math.random() * w; y = h + 5; }
      else if (edge < 0.75) { x = -5; y = Math.random() * h; }
      else { x = w + 5; y = Math.random() * h; }

      const angle = Math.atan2(h / 2 - y, w / 2 - x) + (Math.random() - 0.5) * 1.5;
      const speed = 0.15 + Math.random() * 0.35;
      const maxLife = 400 + Math.random() * 600;

      return {
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 0.5 + Math.random() * 1.5,
        opacity: 0,
        baseOpacity: 0.03 + Math.random() * 0.06,
        hue: 215 + Math.random() * 30,
        life: 0,
        maxLife,
      };
    }

    for (let i = 0; i < 40; i++) {
      const p = spawnParticle();
      p.life = Math.random() * p.maxLife;
      p.x = Math.random() * w;
      p.y = Math.random() * h;
      particlesRef.current.push(p);
    }

    let lastTime = performance.now();

    function animate(now: number) {
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;

      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, w, h);

      const { aiState: state, hashingIntensity: intensity, isTyping: typing, notificationPulse: pulse } = stateRef.current;
      const targetColor = STATE_COLORS[state];
      const trans = transitionRef.current;

      if (trans.progress < 1) {
        trans.progress = Math.min(1, trans.progress + dt * 0.002);
      }
      const ease = trans.progress * trans.progress * (3 - 2 * trans.progress);
      const currentH = trans.fromH + (targetColor.h - trans.fromH) * ease;
      const currentS = trans.fromS + (targetColor.s - trans.fromS) * ease;
      const currentL = trans.fromL + (targetColor.l - trans.fromL) * ease;

      pulseRef.current += dt * 0.001;
      const pulseCycle = Math.sin(pulseRef.current * 2) * 0.5 + 0.5;

      let ambientOpacity = 0.04 + pulseCycle * 0.02;
      let particleBoost = 1;
      let targetCount = 40;

      if (state === "thinking" || typing) {
        ambientOpacity = 0.06 + pulseCycle * 0.04;
        particleBoost = 2;
        targetCount = 80;
      } else if (state === "speaking") {
        ambientOpacity = 0.05 + pulseCycle * 0.03;
        particleBoost = 1.5;
        targetCount = 60;
      }

      if (intensity > 0) {
        ambientOpacity += intensity * 0.08;
        particleBoost += intensity * 2;
        targetCount += Math.floor(intensity * 40);
      }

      const grad = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.7);
      grad.addColorStop(0, `hsla(${currentH}, ${currentS}%, ${currentL}%, ${ambientOpacity})`);
      grad.addColorStop(0.5, `hsla(${currentH}, ${currentS * 0.6}%, ${currentL * 0.4}%, ${ambientOpacity * 0.4})`);
      grad.addColorStop(1, `hsla(${currentH}, ${currentS * 0.3}%, ${currentL * 0.2}%, 0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      if (state === "thinking" || typing) {
        const waveGrad = ctx.createLinearGradient(0, 0, w, 0);
        const waveOffset = (pulseRef.current * 0.3) % 1;
        waveGrad.addColorStop(Math.max(0, waveOffset - 0.2), `hsla(${currentH}, ${currentS}%, ${currentL}%, 0)`);
        waveGrad.addColorStop(waveOffset, `hsla(${currentH}, ${currentS}%, ${currentL}%, 0.03)`);
        waveGrad.addColorStop(Math.min(1, waveOffset + 0.2), `hsla(${currentH}, ${currentS}%, ${currentL}%, 0)`);
        ctx.fillStyle = waveGrad;
        ctx.fillRect(0, 0, w, h);
      }

      if (pulse) {
        const pulseOp = Math.sin(pulseRef.current * 6) * 0.5 + 0.5;
        const notifGrad = ctx.createRadialGradient(w * 0.5, h * 0.3, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.5);
        notifGrad.addColorStop(0, `hsla(${NOTIFICATION_COLOR.h}, ${NOTIFICATION_COLOR.s}%, ${NOTIFICATION_COLOR.l}%, ${pulseOp * 0.06})`);
        notifGrad.addColorStop(1, `hsla(${NOTIFICATION_COLOR.h}, ${NOTIFICATION_COLOR.s}%, ${NOTIFICATION_COLOR.l}%, 0)`);
        ctx.fillStyle = notifGrad;
        ctx.fillRect(0, 0, w, h);
      }

      const particles = particlesRef.current;

      while (particles.length < targetCount) {
        particles.push(spawnParticle());
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt * 0.1;

        if (p.life > p.maxLife || p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) {
          if (particles.length > targetCount) {
            particles.splice(i, 1);
          } else {
            const np = spawnParticle();
            particles[i] = np;
          }
          continue;
        }

        const lifeRatio = p.life / p.maxLife;
        const fadeIn = Math.min(1, lifeRatio * 5);
        const fadeOut = Math.max(0, 1 - (lifeRatio - 0.7) / 0.3);
        p.opacity = p.baseOpacity * fadeIn * (lifeRatio > 0.7 ? fadeOut : 1) * particleBoost;

        p.x += p.vx * dt * 0.1;
        p.y += p.vy * dt * 0.1;

        if (state === "thinking") {
          p.vx += Math.sin(p.y * 0.005 + pulseRef.current) * 0.001;
          p.vy += Math.cos(p.x * 0.005 + pulseRef.current) * 0.001;
        }

        const pH = currentH + (p.hue - 215) * 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${pH}, ${currentS}%, ${currentL + 20}%, ${Math.min(p.opacity, 0.25)})`;
        ctx.fill();

        if (p.opacity > 0.04 && intensity > 0.3) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${pH}, ${currentS}%, ${currentL}%, ${p.opacity * 0.15})`;
          ctx.fill();
        }
      }

      if (intensity > 0) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < Math.min(i + 8, particles.length); j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              const lineOp = (1 - dist / 120) * 0.03 * intensity;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `hsla(${currentH}, ${currentS}%, ${currentL + 10}%, ${lineOp})`;
              ctx.lineWidth = 0.3;
              ctx.stroke();
            }
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    }

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      data-testid="dynamic-background"
    />
  );
}
