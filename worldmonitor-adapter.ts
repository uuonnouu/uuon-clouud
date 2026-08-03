/**
 * RSS World Context Adapter
 * UUON Foundation Inc. — Phillip Aguilar Ruiz III
 */

const FETCH_TIMEOUT_MS = 5000;
const MAX_ITEMS_PER_FEED = 5;

export interface WorldEvent {
  title: string;
  category: string;
  source: string;
  published: string;
  summary?: string;
}

export interface WorldContext {
  fetched_at: string;
  event_count: number;
  top_events: WorldEvent[];
  categories_present: string[];
  compressed_summary: string;
  wm_available: boolean;
}

const FEEDS = [
  { url: 'https://feeds.bbci.co.uk/news/world/rss.xml',             category: 'world',    source: 'BBC World' },
  { url: 'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml', category: 'conflict', source: 'BBC Middle East' },
  { url: 'https://feeds.bbci.co.uk/news/world/europe/rss.xml',      category: 'conflict', source: 'BBC Europe' },
  { url: 'https://feeds.bbci.co.uk/news/world/asia/rss.xml',        category: 'conflict', source: 'BBC Asia' },
  { url: 'https://feeds.bbci.co.uk/news/business/rss.xml',          category: 'economy',  source: 'BBC Business' },
  { url: 'https://feeds.bbci.co.uk/news/technology/rss.xml',        category: 'tech',     source: 'BBC Tech' },
  { url: 'https://rss.dw.com/rdf/rss-en-world',                     category: 'world',    source: 'DW World' },
];

const USGS_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson';

function extractTag(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  if (!m) return '';
  return (m[1] || m[2] || '').replace(/<[^>]+>/g,'').trim();
}

function parseRSS(xml: string, source: string, category: string): WorldEvent[] {
  const items = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
  return items.slice(0, MAX_ITEMS_PER_FEED).map(item => ({
    title: extractTag(item, 'title'),
    category,
    source,
    published: extractTag(item, 'pubDate') || new Date().toISOString(),
    summary: extractTag(item, 'description')?.slice(0, 150) || undefined,
  })).filter(e => e.title);
}

async function fetchFeed(url: string, source: string, category: string): Promise<WorldEvent[]> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS), headers: { 'User-Agent': 'CLOUUD/1.0' } });
    if (!res.ok) return [];
    return parseRSS(await res.text(), source, category);
  } catch { return []; }
}

async function fetchEarthquakes(): Promise<WorldEvent[]> {
  try {
    const res = await fetch(USGS_URL, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
    if (!res.ok) return [];
    const data = await res.json() as { features?: { properties?: { title?: string; time?: number } }[] };
    return (data.features ?? []).slice(0, 3).map(f => ({
      title: f.properties?.title ?? 'Earthquake',
      category: 'natural', source: 'USGS',
      published: f.properties?.time ? new Date(f.properties.time).toISOString() : new Date().toISOString(),
    }));
  } catch { return []; }
}

function compress(events: WorldEvent[], max = 480): string {
  if (!events.length) return 'No live events.';
  const lines: string[] = [];
  let n = 0;
  for (const e of events) {
    const l = `[${e.category.toUpperCase()}] ${e.source}: ${e.title}`;
    if (n + l.length + 1 > max) break;
    lines.push(l); n += l.length + 1;
  }
  return lines.join('\n');
}

export const WorldMonitorAdapter = {
  async getContext(): Promise<WorldContext> {
    const all = await Promise.all([...FEEDS.map(f => fetchFeed(f.url, f.source, f.category)), fetchEarthquakes()]);
    const events = all.flat();
    const pri: Record<string,number> = { natural:0, conflict:1, world:2, economy:3, tech:4 };
    const top = [...events].sort((a,b) => (pri[a.category]??5)-(pri[b.category]??5)).slice(0,12);
    return {
      fetched_at: new Date().toISOString(),
      event_count: events.length,
      top_events: top,
      categories_present: [...new Set(events.map(e=>e.category))],
      compressed_summary: compress(top),
      wm_available: events.length > 0,
    };
  },
  async isAvailable(): Promise<boolean> {
    try {
      const r = await fetch('https://feeds.bbci.co.uk/news/world/rss.xml', { signal: AbortSignal.timeout(3000), headers: {'User-Agent':'CLOUUD/1.0'} });
      return r.ok;
    } catch { return false; }
  },
};
