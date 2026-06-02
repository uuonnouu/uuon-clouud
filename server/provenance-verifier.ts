import { decodeFingerprint } from "./zwc-fingerprint";
import { extractWatermark } from "./stego-watermark";

export interface ZWCResult {
  found: boolean;
  sessionId?: string;
  timestamp?: number;
  decodedAt?: string;
}

export interface ImageWatermarkResult {
  found: boolean;
  sessionId?: string;
  founderId?: string;
  timestamp?: number;
  decodedAt?: string;
}

export interface CSSPatternResult {
  found: boolean;
  hash?: string;
  sessionId?: string;
  decodedAt?: string;
}

export interface ProvenanceReport {
  zwcFingerprint: ZWCResult;
  imageWatermark: ImageWatermarkResult;
  cssPattern: CSSPatternResult;
  methodsChecked: number;
  methodsFound: number;
  provenanceSummary: string;
}

export function verifyText(text: string): ZWCResult {
  if (!text || typeof text !== "string") {
    return { found: false };
  }
  const decoded = decodeFingerprint(text);
  if (decoded.valid) {
    return {
      found: true,
      sessionId: decoded.sessionId,
      timestamp: decoded.timestamp,
      decodedAt: new Date().toISOString(),
    };
  }
  return { found: false };
}

export function verifyImage(svgContent: string): ImageWatermarkResult {
  if (!svgContent || typeof svgContent !== "string") {
    return { found: false };
  }
  const extracted = extractWatermark(svgContent);
  if (extracted && extracted.valid) {
    return {
      found: true,
      sessionId: extracted.sessionId,
      founderId: extracted.founderId,
      timestamp: extracted.timestamp,
      decodedAt: new Date().toISOString(),
    };
  }
  return { found: false };
}

export function verifyPattern(cssGradient: string): CSSPatternResult {
  if (!cssGradient || typeof cssGradient !== "string") {
    return { found: false };
  }
  if (!cssGradient.includes("rgba(255,255,255,0.00") || !cssGradient.includes("UUON") && !cssGradient.includes("repeating-linear-gradient")) {
    return { found: false };
  }
  const rgbaMatches = cssGradient.match(/rgba\(255,255,255,0\.00[12]0?\)/g);
  if (!rgbaMatches || rgbaMatches.length < 64) {
    return { found: false };
  }
  let bits = "";
  for (let i = 0; i < 64; i += 2) {
    bits += rgbaMatches[i].includes("0.002") ? "1" : "0";
  }
  const hash = parseInt(bits, 2);
  return {
    found: true,
    hash: bits,
    sessionId: `hash-${Math.abs(hash).toString(16)}`,
    decodedAt: new Date().toISOString(),
  };
}

export function verifyAll(input: {
  text?: string;
  image?: string;
  pattern?: string;
}): ProvenanceReport {
  const zwcResult = input.text ? verifyText(input.text) : { found: false };
  const imageResult = input.image ? verifyImage(input.image) : { found: false };
  const patternResult = input.pattern ? verifyPattern(input.pattern) : { found: false };

  let methodsChecked = 0;
  let methodsFound = 0;
  if (input.text) { methodsChecked++; if (zwcResult.found) methodsFound++; }
  if (input.image) { methodsChecked++; if (imageResult.found) methodsFound++; }
  if (input.pattern) { methodsChecked++; if (patternResult.found) methodsFound++; }

  const parts: string[] = [];
  if (zwcResult.found) parts.push(`ZWC fingerprint: session ${zwcResult.sessionId}, ts ${zwcResult.timestamp}`);
  if (imageResult.found) parts.push(`SVG watermark: session ${imageResult.sessionId}, founder ${imageResult.founderId}, ts ${imageResult.timestamp}`);
  if (patternResult.found) parts.push(`CSS pattern: hash ${patternResult.hash?.substring(0, 8)}...`);

  const summary = methodsFound === 0
    ? "No UUON provenance detected."
    : `UUON provenance confirmed via ${methodsFound}/${methodsChecked} method(s). ${parts.join(". ")}.`;

  return {
    zwcFingerprint: zwcResult as ZWCResult,
    imageWatermark: imageResult as ImageWatermarkResult,
    cssPattern: patternResult as CSSPatternResult,
    methodsChecked,
    methodsFound,
    provenanceSummary: summary,
  };
}
