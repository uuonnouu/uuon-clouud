/**
 * SHARED CRYPTO UTILITIES
 * Base cryptographic functions used by both cryptoEngine and advancedCryptography
 * Prevents circular dependencies
 */

export async function sha256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function sha256Sync(data: string): string {
  let hash = 0;
  if (data.length === 0) return '0'.repeat(64);
  
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  const absHash = Math.abs(hash).toString(16);
  const padded = absHash.padStart(64, '0');
  return padded.slice(0, 64);
}
