async function getCanvasFingerprint(): Promise<string> {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "no-canvas";
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.fillStyle = "#f0b93b";
    ctx.fillRect(0, 0, 200, 50);
    ctx.fillStyle = "#030811";
    ctx.fillText("UUON☧Clouud∞33", 2, 15);
    ctx.strokeStyle = "#4a8cd4";
    ctx.arc(100, 25, 20, 0, Math.PI * 2);
    ctx.stroke();
    return canvas.toDataURL().slice(-64);
  } catch {
    return "canvas-error";
  }
}

function getWebGLFingerprint(): string {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return "no-webgl";
    const debugInfo = (gl as WebGLRenderingContext).getExtension("WEBGL_debug_renderer_info");
    if (!debugInfo) return "no-debug";
    const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    const vendor = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    return `${vendor}|${renderer}`;
  } catch {
    return "webgl-error";
  }
}

function getAudioFingerprint(): Promise<string> {
  return new Promise((resolve) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const analyser = audioCtx.createAnalyser();
      const gain = audioCtx.createGain();
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);

      gain.gain.value = 0;
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(10000, audioCtx.currentTime);
      oscillator.connect(analyser);
      analyser.connect(processor);
      processor.connect(gain);
      gain.connect(audioCtx.destination);

      oscillator.start(0);

      const dataArray = new Float32Array(analyser.frequencyBinCount);

      setTimeout(() => {
        analyser.getFloatFrequencyData(dataArray);
        const sum = dataArray.slice(0, 30).reduce((a, b) => a + Math.abs(b), 0);
        oscillator.stop();
        audioCtx.close();
        resolve(sum.toFixed(4));
      }, 100);
    } catch {
      resolve("audio-error");
    }
  });
}

export interface FingerprintComponents {
  canvas: string;
  webgl: string;
  audio: string;
  screen: string;
  timezone: string;
  language: string;
  platform: string;
  colorDepth: number;
  touchPoints: number;
  hardwareConcurrency: number;
  deviceMemory: number;
  cookiesEnabled: boolean;
}

export async function generateFingerprint(): Promise<{ hash: string; components: FingerprintComponents }> {
  const canvas = await getCanvasFingerprint();
  const webgl = getWebGLFingerprint();
  const audio = await getAudioFingerprint();

  const components: FingerprintComponents = {
    canvas,
    webgl,
    audio,
    screen: `${screen.width}x${screen.height}x${screen.availWidth}x${screen.availHeight}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    platform: navigator.platform,
    colorDepth: screen.colorDepth,
    touchPoints: navigator.maxTouchPoints,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    deviceMemory: (navigator as any).deviceMemory || 0,
    cookiesEnabled: navigator.cookieEnabled,
  };

  const response = await fetch("/api/auth/register-fingerprint", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ components }),
  });

  const data = await response.json();

  if (data.hash) {
    sessionStorage.setItem("uuon-fingerprint", data.hash);
  }

  return { hash: data.hash, components };
}

export function getStoredFingerprint(): string | null {
  return sessionStorage.getItem("uuon-fingerprint");
}

export function createAuthHeaders(): Record<string, string> {
  const fp = getStoredFingerprint();
  if (!fp) return {};
  return { "x-fingerprint": fp };
}

export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = {
    ...createAuthHeaders(),
    ...(options.headers || {}),
  };
  return fetch(url, { ...options, headers });
}
