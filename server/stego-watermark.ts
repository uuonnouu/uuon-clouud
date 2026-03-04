
/**
 * Steganographic SVG Watermark Engine
 * Encodes provenance data (sessionId, founderId, timestamp) into invisible SVG elements.
 */

export interface WatermarkData {
  sessionId: string;
  founderId: string;
  timestamp: number;
}

/**
 * Embeds a watermark into SVG content.
 * Uses ~40-60 invisible <rect> elements with specific positions and sizes to encode bits.
 */
export function embedWatermark(svgContent: string, data: WatermarkData): string {
  const { sessionId, founderId, timestamp } = data;
  
  // Create a combined bit string for the payload
  // We'll use a simple hash for founderId to keep it fixed length if it's not already
  const payload = JSON.stringify({
    s: sessionId.substring(0, 8), // Shortened for space
    f: founderId.substring(0, 8),
    t: timestamp,
    m: "UUON" // Marker
  });

  const base64Payload = Buffer.from(payload).toString('base64');
  const bits = base64ToBits(base64Payload);
  
  // Inject micro-elements
  let watermarkElements = `<g class="uuon-provenance" opacity="0.001" style="pointer-events:none;">`;
  
  // Encode bits into positions/sizes of tiny rects
  // We'll use a 10x10 grid or similar
  for (let i = 0; i < bits.length; i++) {
    const x = (i % 20) * 5;
    const y = Math.floor(i / 20) * 5;
    const bit = bits[i];
    // Encode bit in the width: 0.5 for '0', 0.6 for '1'
    const width = bit === '1' ? 0.6 : 0.5;
    watermarkElements += `<rect x="${x}" y="${y}" width="${width}" height="0.5" fill="#000"/>`;
  }
  
  watermarkElements += `</g>`;
  
  // Also add metadata for easier non-stego extraction if needed, but the primary is the stego
  const metadata = `<metadata id="uuon-metadata" data-provenance="${base64Payload}"></metadata>`;
  
  // Insert before the closing </svg> tag
  return svgContent.replace('</svg>', `${watermarkElements}${metadata}</svg>`);
}

/**
 * Extracts watermark data from SVG content.
 */
export function extractWatermark(svgContent: string): (WatermarkData & { valid: boolean }) | null {
  // Try metadata first as a fast path
  const metaMatch = svgContent.match(/data-provenance="([^"]+)"/);
  if (metaMatch) {
    try {
      const payload = JSON.parse(Buffer.from(metaMatch[1], 'base64').toString());
      if (payload.m === "UUON") {
        return {
          sessionId: payload.s,
          founderId: payload.f,
          timestamp: payload.t,
          valid: true
        };
      }
    } catch (e) {
      // Fallback to stego extraction if metadata is corrupted or missing
    }
  }

  // Stego extraction
  const rects = svgContent.match(/<rect[^>]*width="0\.[56]"[^>]*>/g);
  if (!rects || rects.length < 10) return null;

  let bits = "";
  for (const rect of rects) {
    if (rect.includes('width="0.6"')) bits += "1";
    else if (rect.includes('width="0.5"')) bits += "0";
  }

  try {
    const base64 = bitsToBase64(bits);
    const payload = JSON.parse(Buffer.from(base64, 'base64').toString());
    if (payload.m === "UUON") {
      return {
        sessionId: payload.s,
        founderId: payload.f,
        timestamp: payload.t,
        valid: true
      };
    }
  } catch (e) {
    return null;
  }

  return null;
}

function base64ToBits(base64: string): string {
  return base64.split('').map(char => {
    return Buffer.from(char).toString('binary').split('').map(c => {
      return c.charCodeAt(0).toString(2).padStart(8, '0');
    }).join('');
  }).join('');
}

function bitsToBase64(bits: string): string {
  let base64 = "";
  for (let i = 0; i < bits.length; i += 8) {
    const byte = bits.substring(i, i + 8);
    if (byte.length < 8) break;
    base64 += String.fromCharCode(parseInt(byte, 2));
  }
  return base64;
}
