import { Request, Response, NextFunction } from 'express';

/**
 * Response scrubbing middleware — strips sensitive fields from all outbound
 * JSON responses so individual routes don't need to be audited one-by-one.
 *
 * CONFIGURATION: edit BLOCKED_KEYS and BLOCKED_VALUE_PATTERNS below.
 * The filter walks the entire JSON body recursively so nested fields are caught.
 */

// ── Blocklist: exact key names (case-insensitive) ────────────────────────────
const BLOCKED_KEYS: Set<string> = new Set([
  // Upgrade / internal routing hints
  'upgradeurl',
  'sdkrecommendation',

  // Pricing tier breakdowns (task requirement: /api/pricing leakage)
  'pricing',
  'pricinginfo',
  'pricingtier',
  'pricingtiers',
  'tier',
  'tiers',
  'monthlyprice',
  'regularprice',
  'overage',
  'overagerate',
  'promotion',

  // Pinata / IPFS credentials
  'pinata_api_key',
  'pinata_secret_api_key',

  // Generic API credential field names
  'apikey',
  'api_key',
  'secretkey',
  'secret_key',
  'accesstoken',
  'access_token',
  'authorization',
]);

// ── Blocklist: substrings that must not appear in string values ───────────────
const BLOCKED_VALUE_PATTERNS: RegExp[] = [
  /railway\.app/i,
  /replit\.app/i,
  /pinata\.cloud/i,
];

const REPLACEMENT = '[redacted]';

/**
 * Recursively walk a parsed JSON value and redact blocked content.
 * Returns a new object; the original is never mutated.
 */
function scrub(value: unknown): unknown {
  if (value === null || value === undefined) return value;

  if (Array.isArray(value)) {
    return value.map(scrub);
  }

  if (typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (BLOCKED_KEYS.has(k.toLowerCase())) {
        out[k] = REPLACEMENT;
      } else {
        out[k] = scrub(v);
      }
    }
    return out;
  }

  if (typeof value === 'string') {
    for (const pattern of BLOCKED_VALUE_PATTERNS) {
      if (pattern.test(value)) return REPLACEMENT;
    }
  }

  return value;
}

/**
 * Intercept res.json() so every JSON response body is scrubbed before
 * bytes leave the process. Mounted after all routes in server/index.ts.
 */
export function responseFilter(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const originalJson = res.json.bind(res);

  res.json = function (body: unknown): Response {
    try {
      const cleaned = scrub(body);
      return originalJson(cleaned);
    } catch {
      return originalJson(body);
    }
  };

  next();
}
