/**
 * Perceptual Hash Pattern Generator
 * Creates a near-invisible CSS background pattern encoding session data.
 * Used for provenance tracking in screenshots.
 */

export function generateProvenancePattern(sessionId: string, timestamp: number): string {
  // 1. Create a 32-bit hash from sessionId and timestamp
  const str = `${sessionId}-${timestamp}-UUON`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }

  // 2. Map bits to micro-gradient stops
  // We'll use a repeating linear gradient with 32 segments
  // Each segment's opacity slightly varies based on the bit
  const bits = Math.abs(hash).toString(2).padStart(32, '0');
  
  // Base opacity is extremely low (0.001 to 0.003)
  // This makes it invisible to the naked eye but mathematically present
  const baseOpacity = 0.001;
  const bitOpacityStep = 0.001;
  
  const stops = [];
  for (let i = 0; i < 32; i++) {
    const bit = bits[i] === '1';
    const opacity = baseOpacity + (bit ? bitOpacityStep : 0);
    const posStart = (i / 32) * 100;
    const posEnd = ((i + 1) / 32) * 100;
    
    stops.push(`rgba(255,255,255,${opacity.toFixed(4)}) ${posStart.toFixed(2)}%`);
    stops.push(`rgba(255,255,255,${opacity.toFixed(4)}) ${posEnd.toFixed(2)}%`);
  }

  // 3. Encode "UUON" marker using a specific interval
  // We'll use two gradients: one for data, one for the marker
  // The marker is a 4-pixel repeating stripe with a specific pattern
  const dataGradient = `linear-gradient(90deg, ${stops.join(', ')})`;
  const markerGradient = `repeating-linear-gradient(45deg, rgba(255,255,255,0.002) 0px, rgba(255,255,255,0.002) 1px, transparent 1px, transparent 4px)`;

  return `${markerGradient}, ${dataGradient}`;
}

export function extractPatternHash(gradientString: string): string | null {
  // In a real scenario, this would involve analyzing a screenshot's pixel data.
  // For the purpose of this tool, we're providing a way to "read" the CSS string.
  if (!gradientString.includes('rgba(255,255,255,0.002)') || !gradientString.includes('0.001')) {
    return null;
  }
  
  try {
    const rgbaMatches = gradientString.match(/rgba\(255,255,255,0\.00(1|2)\)/g);
    if (!rgbaMatches || rgbaMatches.length < 64) return null; // 32 segments * 2 stops per segment

    let bits = "";
    for (let i = 0; i < 64; i += 2) {
      bits += rgbaMatches[i].includes('0.002') ? "1" : "0";
    }
    
    return bits;
  } catch (e) {
    return null;
  }
}
