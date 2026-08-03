/**
 * WorldMonitor Adapter
 * UUON Foundation Inc. — Phillip Aguilar Ruiz III
 *
 * Pulls live context from a local WorldMonitor instance (localhost:3000).
 * WorldMonitor is treated as an internal service — not merged, not vendored.
 * This adapter is the only coupling point.
 *
 * Usage:
 *   import { WorldMonitorAdapter } from './worldmonitor-adapter';
 *   const ctx = await WorldMonitorAdapter.getContext();
 */

const WM_BASE = process.env.WORLDMONITOR_URL ?? 'http://localhost:3000';
const WM_TIMEOUT_MS = 4000;

export interface WorldEvent {
  id: string;
  title: string;
  category: string;       // conflicts | bases | hotspots | sanctions | weather | outages | datacenters | natural
  region: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;      // ISO 8601
  lat?: number;
  lon?: number;
  source?: string;
  summary?: string;
}

export interface WorldContext {
  fetched_at: string;
  event_count: number;
  top_events: WorldEvent[];
  categories_present: string[];
  compressed_summary: string;  // plain text, <500 chars, ready for LLM prompt injection
  wm_available: boolean;
}

// ── Fetch helpers ─────────────────────────────────────────────────────────────

async function fetchJSON<T>(path: string): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), WM_TIMEOUT_MS);
  try {
    const res = await fetch(`${WM_BASE}${path}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// ── WorldMonitor known API surface (koala73/world-monitor) ───────────────────
// The app exposes its data through several JSON endpoints.
// We probe the most stable ones and degrade gracefully if any are missing.

async function probeEndpoints(): Promise<WorldEvent[]> {
  const events: WorldEvent[] = [];

  // Primary: /api/events — standard REST export most dashboard apps expose
  const apiEvents = await fetchJSON<WorldEvent[]>('/api/events');
  if (apiEvents && Array.isArray(apiEvents)) {
    events.push(...apiEvents);
  }

  // Fallback: /api/news — news feed endpoint
  const news = await fetchJSON<{ items?: WorldEvent[]; articles?: WorldEvent[] }>('/api/news');
  if (news) {
    const items = news.items ?? news.articles ?? [];
    events.push(...items);
  }

  // Fallback: /api/conflicts, /api/hotspots
  for (const cat of ['conflicts', 'hotspots', 'sanctions', 'natural']) {
    const catData = await fetchJSON<WorldEvent[] | { data?: WorldEvent[] }>(`/api/${cat}`);
    if (catData) {
      const arr = Array.isArray(catData) ? catData : (catData.data ?? []);
      events.push(...arr.map(e => ({ ...e, category: cat })));
    }
  }

  return events;
}

// ── Compression ───────────────────────────────────────────────────────────────
// Reduces N events to a compact plain-text context block for LLM injection.
// Target: < 500 characters. Priority: severity DESC, recency DESC.

function compressEvents(events: WorldEvent[], maxChars = 480): string {
  if (!events.length) return 'No live world events available.';

  const order: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  const sorted = [...events].sort((a, b) => {
    const sd = (order[a.severity] ?? 4) - (order[b.severity] ?? 4);
    if (sd !== 0) return sd;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const lines: string[] = [];
  let total = 0;
  for (const e of sorted) {
    const line = `[${e.severity?.toUpperCase() ?? 'UNK'}] ${e.category ?? '?'} — ${e.title ?? e.summary ?? '(no title)'} (${e.region ?? '?'})`;
    if (total + line.length + 1 > maxChars) break;
    lines.push(line);
    total += line.length + 1;
  }

  return lines.join('\n');
}

// ── Public API ────────────────────────────────────────────────────────────────

export const WorldMonitorAdapter = {
  /**
   * Pull live context from WorldMonitor.
   * Always resolves — returns wm_available: false if WorldMonitor is down.
   */
  async getContext(): Promise<WorldContext> {
    const events = await probeEndpoints();
    const wm_available = events.length > 0;

    const categories_present = [...new Set(events.map(e => e.category).filter(Boolean))];
    const top_events = events
      .sort((a, b) => {
        const order: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
        return (order[a.severity] ?? 4) - (order[b.severity] ?? 4);
      })
      .slice(0, 10);

    return {
      fetched_at: new Date().toISOString(),
      event_count: events.length,
      top_events,
      categories_present,
      compressed_summary: compressEvents(events),
      wm_available,
    };
  },

  /**
   * Health check — is WorldMonitor reachable right now?
   */
  async isAvailable(): Promise<boolean> {
    const result = await fetchJSON<unknown>('/api/health').catch(() => null);
    // Also try root — dashboard will return HTML either way
    if (result) return true;
    try {
      const res = await fetch(WM_BASE, { signal: AbortSignal.timeout(2000) });
      return res.ok;
    } catch {
      return false;
    }
  },
};
