/**
 * GammaHVisualizer — Hierarchical Recursive Transformation (ΓH) Renderer
 */
import { useRef, useEffect, useCallback } from "react";

type Vec2 = { x: number; y: number };
type DimensionalState = { center: Vec2; radius: number; depth: number; angle: number; phase: number };
type AtomicState = { frequency: number; amplitude: number; decay: number; resonance: number };
type RendererConfig = { maxDepth: number; branchFactor: number; scaleFactor: number; rotationFactor: number; atomicCoupling: number; colorMode: "phase" | "depth" | "resonance" };

function gammaH(state: DimensionalState, config: RendererConfig): DimensionalState[] {
  if (state.depth >= config.maxDepth || state.radius < 1) return [];
  const children: DimensionalState[] = [];
  for (let i = 0; i < config.branchFactor; i++) {
    const branchAngle = state.angle + (i * (Math.PI * 2)) / config.branchFactor + state.phase;
    children.push({ center: { x: state.center.x + Math.cos(branchAngle) * state.radius, y: state.center.y + Math.sin(branchAngle) * state.radius }, radius: state.radius * config.scaleFactor, depth: state.depth + 1, angle: branchAngle + config.rotationFactor, phase: state.phase * 0.618 });
  }
  return children;
}

function flattenGH(root: DimensionalState, config: RendererConfig): DimensionalState[] {
  const result: DimensionalState[] = [root];
  for (const child of gammaH(root, config)) result.push(...flattenGH(child, config));
  return result;
}

function computeAtomicField(state: AtomicState, t: number): number {
  return state.amplitude * Math.sin(state.frequency * t + state.resonance) * Math.exp(-state.decay * t);
}

function atomicColor(field: number, depth: number, mode: RendererConfig["colorMode"]): string {
  const norm = (Math.tanh(field) + 1) / 2;
  switch (mode) {
    case "phase": return `hsla(${norm * 360},80%,${40 + depth * 5}%,${0.9 - depth * 0.08})`;
    case "depth": return `hsla(${200 + depth * 20},70%,${50 + norm * 20}%,${0.9 - depth * 0.08})`;
    case "resonance": return `hsla(${norm * 120 + 180},90%,${45 + norm * 20}%,${0.85 - depth * 0.07})`;
  }
}

function renderPass(ctx: CanvasRenderingContext2D, nodes: DimensionalState[], atomic: AtomicState, config: RendererConfig, t: number) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (const node of nodes) {
    const field = computeAtomicField({ ...atomic, frequency: atomic.frequency * (1 + node.depth * config.atomicCoupling) }, t + node.phase);
    const color = atomicColor(field, node.depth, config.colorMode);
    ctx.beginPath();
    ctx.arc(node.center.x, node.center.y, Math.max(node.radius, 0.5), 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(0.5, 2 - node.depth * 0.3);
    ctx.stroke();
    if (node.depth > 0) {
      ctx.beginPath();
      ctx.moveTo(node.center.x, node.center.y);
      ctx.lineTo(node.center.x - Math.cos(node.angle) * node.radius, node.center.y - Math.sin(node.angle) * node.radius);
      ctx.strokeStyle = color.replace("0.9", "0.2");
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }
}

const DEFAULT_CONFIG: RendererConfig = { maxDepth: 5, branchFactor: 6, scaleFactor: 0.42, rotationFactor: Math.PI / 7, atomicCoupling: 0.15, colorMode: "phase" };
const DEFAULT_ATOMIC: AtomicState = { frequency: 1.2, amplitude: 1.0, decay: 0.05, resonance: 0 };

type Props = { width?: number; height?: number; config?: Partial<RendererConfig>; atomic?: Partial<AtomicState>; className?: string };

export default function GammaHVisualizer({ width = 600, height = 600, config: configOverride = {}, atomic: atomicOverride = {}, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const tRef = useRef<number>(0);
  const config: RendererConfig = { ...DEFAULT_CONFIG, ...configOverride };
  const atomic: AtomicState = { ...DEFAULT_ATOMIC, ...atomicOverride };
  const root: DimensionalState = { center: { x: width / 2, y: height / 2 }, radius: Math.min(width, height) * 0.22, depth: 0, angle: 0, phase: 0 };
  const nodesRef = useRef<DimensionalState[]>(flattenGH(root, config));

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    tRef.current += 0.016;
    renderPass(ctx, nodesRef.current, atomic, config, tRef.current);
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    nodesRef.current = flattenGH(root, config);
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  return <canvas ref={canvasRef} width={width} height={height} className={className} style={{ background: "#000", borderRadius: 8 }} />;
}
