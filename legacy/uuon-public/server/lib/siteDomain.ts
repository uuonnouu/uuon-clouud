/**
 * Single source of truth for the site domain used in sitemap generation.
 * Set SITE_DOMAIN env var to override (e.g. when deploying to a custom domain).
 * Railway is the public-facing canonical URL.
 * Falls back to REPLIT_DOMAINS only for local dev if SITE_DOMAIN is not set.
 */
export const SITE_DOMAIN: string = process.env.SITE_DOMAIN
  ? process.env.SITE_DOMAIN
  : process.env.RAILWAY_STATIC_URL
    ? `https://${process.env.RAILWAY_STATIC_URL}`
    : 'https://distinguished-rebirth-production.up.railway.app';
