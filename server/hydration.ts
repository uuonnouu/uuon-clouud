import { storage } from "./storage";

interface HydrationStatus {
  lastRun: number | null;
  intervalMinutes: number;
  dimensionConnected: boolean;
  dimensionUrl: string | null;
  anchorsLoaded: number;
  maxAnchors: number;
  nextRunIn: string;
}

let lastHydrationRun: number | null = null;
let hydrationTimer: ReturnType<typeof setInterval> | null = null;

const HYDRATION_INTERVAL_MS = (parseInt(process.env.HYDRATION_INTERVAL_MIN || "15", 10)) * 60 * 1000;

async function hydrate(): Promise<{ anchorsRefreshed: number; dimensionStatus: string }> {
  const startTime = Date.now();
  let dimensionStatus = "not configured";
  let anchorsRefreshed = 0;

  try {
    const entries = await storage.getAllCreatorProfileEntries();
    anchorsRefreshed = entries.length;
  } catch (e) {
    console.error("[HYDRATION] Failed to refresh anchors:", e);
  }

  const dimensionUrl = process.env.DIMENSION_APP_URL;
  if (dimensionUrl) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${dimensionUrl}/api/status`, {
        signal: controller.signal,
        headers: { "X-Source": "UUON-CLOUUD" },
      });
      clearTimeout(timeout);
      if (res.ok) {
        dimensionStatus = "connected";
      } else {
        dimensionStatus = `responded ${res.status}`;
      }
    } catch (e: any) {
      dimensionStatus = e.name === "AbortError" ? "timeout" : "unreachable";
    }
  }

  lastHydrationRun = Date.now();
  const elapsed = Date.now() - startTime;
  console.log(`[HYDRATION] Complete in ${elapsed}ms — ${anchorsRefreshed} anchors loaded, Δmension: ${dimensionStatus}`);

  return { anchorsRefreshed, dimensionStatus };
}

export function startHydrationLoop(): void {
  if (hydrationTimer) return;

  hydrate().catch(console.error);

  hydrationTimer = setInterval(() => {
    hydrate().catch(console.error);
  }, HYDRATION_INTERVAL_MS);

  console.log(`[HYDRATION] Loop started — interval ${HYDRATION_INTERVAL_MS / 60000}min`);
}

export function stopHydrationLoop(): void {
  if (hydrationTimer) {
    clearInterval(hydrationTimer);
    hydrationTimer = null;
    console.log("[HYDRATION] Loop stopped");
  }
}

export async function getHydrationStatus(): Promise<HydrationStatus> {
  const dimensionUrl = process.env.DIMENSION_APP_URL || null;
  let dimensionConnected = false;

  if (dimensionUrl) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${dimensionUrl}/api/status`, { signal: controller.signal });
      clearTimeout(timeout);
      dimensionConnected = res.ok;
    } catch {
      dimensionConnected = false;
    }
  }

  let entries: any[] = [];
  try {
    entries = await storage.getAllCreatorProfileEntries();
  } catch {}

  const intervalMinutes = HYDRATION_INTERVAL_MS / 60000;
  let nextRunIn = "not started";
  if (lastHydrationRun) {
    const elapsed = Date.now() - lastHydrationRun;
    const remaining = Math.max(0, HYDRATION_INTERVAL_MS - elapsed);
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    nextRunIn = `${mins}m ${secs}s`;
  }

  return {
    lastRun: lastHydrationRun,
    intervalMinutes,
    dimensionConnected,
    dimensionUrl,
    anchorsLoaded: entries.length,
    maxAnchors: 33,
    nextRunIn,
  };
}

export async function runHydrationNow(): Promise<{ anchorsRefreshed: number; dimensionStatus: string }> {
  return hydrate();
}
