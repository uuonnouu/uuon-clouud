import { db } from "./storage";
import { sql } from "drizzle-orm";

export async function searchDmensionShapes(
  query: string
): Promise<{ category: string; name: string; earthLink: string; domain: string }[]> {
  const q = query.toLowerCase().trim();

  try {
    const rows = await db.execute(
      sql`SELECT shape_id, name, category, earth_link, formula
          FROM dmension_shapes
          WHERE LOWER(name) LIKE ${"%" + q + "%"}
             OR LOWER(category) LIKE ${"%" + q + "%"}
             OR LOWER(earth_link) LIKE ${"%" + q + "%"}
          LIMIT 10`
    );

    const results = (rows as any[]).map((r: any) => ({
      category: r.category ?? "",
      name: r.name ?? "",
      earthLink: r.earth_link ?? "",
      domain: r.formula ? "live-corpus" : "no-formula",
    }));

    if (results.length > 0) return results;
  } catch (e: any) {
    console.error("[dmension-codex] live search failed, falling back:", e.message);
  }

  // Static fallback — stale but better than nothing
  const lower = q;
  const fallback: { category: string; name: string; earthLink: string; domain: string }[] = [];
  for (const cat of DMENSION_CATEGORIES) {
    if (
      cat.name.toLowerCase().includes(lower) ||
      cat.domain.toLowerCase().includes(lower) ||
      cat.earthLink.toLowerCase().includes(lower)
    ) {
      fallback.push({ category: cat.id, name: cat.name, earthLink: cat.earthLink, domain: cat.domain });
    }
  }
  return fallback.slice(0, 8);
}