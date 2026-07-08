import type { Request, Response } from "express";
import type { Express } from "express";
import { storage } from "./storage";
import { dmensionBridge } from "./dmension-bridge";
import { searchDmensionShapes, DMENSION_STATS, DMENSION_CATEGORIES, DMENSION_ENGINES } from "./dmension-codex";
import { upload, extractTextFromFile } from "./uploads";
import type { InsertDmensionShape } from "@shared/schema";

const TOPIC_TO_SHAPE_MAP: Record<string, { categories: string[]; shapes: string[]; url: string }> = {
  "quantum": { categories: ["quantum-physics"], shapes: ["waveFunction", "blochSphere", "quantumEntanglement"], url: "https://uuon.world/app?category=quantum-physics" },
  "wave": { categories: ["waveforms_harmonics", "quantum-physics"], shapes: ["waveFunction", "standingWave", "interference"], url: "https://uuon.world/app?category=waveforms_harmonics" },
  "fractal": { categories: ["fractal-iterations"], shapes: ["mandelbrot", "juliaSet", "sierpinski", "barnsleyFern"], url: "https://uuon.world/app?category=fractal-iterations" },
  "tensor": { categories: ["4d-advanced"], shapes: ["metricTensor", "riemannCurvature", "christoffelSymbols"], url: "https://uuon.world/app?category=4d-advanced" },
  "galaxy": { categories: ["modulo-cosmos"], shapes: ["spiralGalaxy", "ellipticalGalaxy", "blackHoleMerger"], url: "https://uuon.world/app?category=modulo-cosmos" },
  "crystal": { categories: ["Nature & Crystals"], shapes: ["snowflake", "quartz", "diamondLattice"], url: "https://uuon.world/app?category=Nature%20%26%20Crystals" },
  "dna": { categories: ["Medical Imaging"], shapes: ["dnaHelix", "proteinFolding", "cellMembrane"], url: "https://uuon.world/app?category=Medical%20Imaging" },
  "biology": { categories: ["Medical Imaging"], shapes: ["dnaHelix", "proteinFolding", "neuralNetwork"], url: "https://uuon.world/app?category=Medical%20Imaging" },
  "healing": { categories: ["optimization"], shapes: ["sacredGeometry", "flowerOfLife", "metatronsCube"], url: "https://uuon.world/app?category=optimization" },
  "topology": { categories: ["parametric-surfaces", "minimal_surfaces"], shapes: ["kleinBottle", "mobiusStrip", "torus"], url: "https://uuon.world/app?category=parametric-surfaces" },
  "modular": { categories: ["modulo-uuon", "modulo-math", "modulo-graphics"], shapes: ["modularCircle", "clockArithmetic"], url: "https://uuon.world/app?category=modulo-uuon" },
  "slinky": { categories: ["slinky-dynamics"], shapes: ["springWave", "helicalSpring", "wavePropagation"], url: "https://uuon.world/app?category=slinky-dynamics" },
  "rubik": { categories: ["rubiks-cube-dynamics"], shapes: ["rubiksCube", "groupTheory", "permutation"], url: "https://uuon.world/app?category=rubiks-cube-dynamics" },
  "lattice": { categories: ["lattice-structures"], shapes: ["bccLattice", "fccLattice", "hexagonalLattice"], url: "https://uuon.world/app?category=lattice-structures" },
  "entropy": { categories: ["entropy", "modulo-chaos"], shapes: ["strangeAttractor", "lorenzAttractor", "entropyFlow"], url: "https://uuon.world/app?category=entropy" },
  "phi": { categories: ["phi_dimension"], shapes: ["goldenSpiral", "fibonacciSurface", "phiLattice"], url: "https://uuon.world/app?category=phi_dimension" },
  "surface": { categories: ["parametric-surfaces", "surfaces_of_revolution"], shapes: ["parametricSurface", "revolutionSurface"], url: "https://uuon.world/app?category=parametric-surfaces" },
  "curve": { categories: ["foundational_curves"], shapes: ["lissajous", "cycloid", "cardioid"], url: "https://uuon.world/app?category=foundational_curves" },
  "metal": { categories: ["metal"], shapes: ["grainBoundary", "alloyMicrostructure", "phaseDiagram"], url: "https://uuon.world/app?category=metal" },
  "ceramic": { categories: ["ceramic"], shapes: ["zirconiaLattice", "piezoelectric", "thermalBarrier"], url: "https://uuon.world/app?category=ceramic" },
  "crypto": { categories: ["modulo-crypto"], shapes: ["ellipticCurve", "hashFunction", "zeroKnowledge"], url: "https://uuon.world/app?category=modulo-crypto" },
  "sound": { categories: ["modulo-audio"], shapes: ["soundWave", "fourierTransform", "harmonicSeries"], url: "https://uuon.world/app?category=modulo-audio" },
  "robot": { categories: ["modulo-robotics"], shapes: ["inverseKinematics", "pidControl", "pathPlanning"], url: "https://uuon.world/app?category=modulo-robotics" },
  "network": { categories: ["modulo-network"], shapes: ["graphTheory", "distributedSystem", "routingAlgorithm"], url: "https://uuon.world/app?category=modulo-network" },
  "linguistic": { categories: ["Linguistic Geometry"], shapes: ["sentenceTree", "grammarTopology", "phoneticSpace"], url: "https://uuon.world/app?category=Linguistic%20Geometry" },
  "collision": { categories: ["slinky-dynamics"], shapes: ["bgkCollision", "mrtCollision", "latticeBoltzmann"], url: "https://uuon.world/app?category=slinky-dynamics" },
  "pattern": { categories: ["modulo-patterns"], shapes: ["wallpaperGroup", "tilingPattern", "symmetryGroup"], url: "https://uuon.world/app?category=modulo-patterns" },
  "chaos": { categories: ["modulo-chaos"], shapes: ["lorenzAttractor", "butterflyEffect", "strangeAttractor"], url: "https://uuon.world/app?category=modulo-chaos" },
  "4d": { categories: ["4d-advanced"], shapes: ["tesseract", "hypercube", "4dProjection"], url: "https://uuon.world/app?category=4d-advanced" },
  "5d": { categories: ["5d-polytopes"], shapes: ["pentachoron", "5dPolytope"], url: "https://uuon.world/app?category=5d-polytopes" },
  "minimal": { categories: ["minimal_surfaces"], shapes: ["soapBubble", "catenoid", "helicoid"], url: "https://uuon.world/app?category=minimal_surfaces" },
  "thermodynamic": { categories: ["thermodynamic_cosmology"], shapes: ["heatEngine", "entropyFlow"], url: "https://uuon.world/app?category=thermodynamic_cosmology" },
  "causal": { categories: ["causal_entropic"], shapes: ["causalEntropy", "futureLight"], url: "https://uuon.world/app?category=causal_entropic" },
};

export function matchTopicToShape(text: string): { match: string; categories: string[]; shapes: string[]; url: string; categoryData: any[] } | null {
  const lower = text.toLowerCase();

  for (const [keyword, mapping] of Object.entries(TOPIC_TO_SHAPE_MAP)) {
    if (lower.includes(keyword)) {
      const categoryData = DMENSION_CATEGORIES.filter(c =>
        mapping.categories.some(mc => c.id === mc || c.name.toLowerCase().includes(mc.toLowerCase()))
      );
      return { match: keyword, ...mapping, categoryData };
    }
  }

  const codexResults = searchDmensionShapes(lower.split(/\s+/).slice(0, 3).join(" "));
  if (codexResults.length > 0) {
    const first = codexResults[0];
    return {
      match: first.name,
      categories: [first.category],
      shapes: [],
      url: `https://uuon.world/app?category=${encodeURIComponent(first.category)}`,
      categoryData: [first],
    };
  }

  return null;
}

export function registerDmensionRoutes(app: Express) {
  app.post("/api/dmension/upload", upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const text = extractTextFromFile(req.file.path, req.file.mimetype);
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        return res.status(400).json({ error: "File must be valid JSON" });
      }

      const shapes: InsertDmensionShape[] = [];

      if (Array.isArray(data)) {
        for (const item of data) {
          shapes.push(normalizeShapeData(item));
        }
      } else if (data.shapes && Array.isArray(data.shapes)) {
        for (const item of data.shapes) {
          shapes.push(normalizeShapeData(item));
        }
      } else if (data.categories || data.models || data.objects) {
        const items = data.categories || data.models || data.objects;
        if (Array.isArray(items)) {
          for (const item of items) {
            shapes.push(normalizeShapeData(item));
          }
        }
      } else if (data.conversations && Array.isArray(data.conversations)) {
        for (const conv of data.conversations) {
          const title = conv.title || conv.name || "Untitled";
          if (conv.messages) {
            for (const msg of conv.messages) {
              const content = msg.content || msg.text || "";
              if (typeof content === "string" && content.length > 20) {
                const shapeIndicators = /shape|model|formula|equation|surface|curve|mesh|geometry|3d|parametric/i;
                if (shapeIndicators.test(content)) {
                  shapes.push({
                    shapeId: `replit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                    name: title.slice(0, 100),
                    category: extractCategory(content),
                    domain: extractDomain(content),
                    description: content.slice(0, 2000),
                    tags: title,
                    metadata: JSON.stringify({ source: "replit-upload", conversationTitle: title }),
                  });
                }
              }
            }
          }
        }
      } else {
        shapes.push(normalizeShapeData(data));
      }

      const savedCount = await storage.saveDmensionShapes(shapes);
      const totalCount = await storage.getDmensionShapeCount();
      dmensionBridge.setLocalShapeCount(totalCount);

      res.json({
        uploaded: shapes.length,
        saved: savedCount,
        totalInDatabase: totalCount,
        message: `${savedCount} shapes imported into local Δmension library`,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Upload failed" });
    }
  });

  app.post("/api/dmension/upload-json", async (req: Request, res: Response) => {
    try {
      const data = req.body;
      if (!data) return res.status(400).json({ error: "No data provided" });

      const shapes: InsertDmensionShape[] = [];
      const items = Array.isArray(data) ? data : data.shapes || data.categories || data.models || [data];

      for (const item of items) {
        shapes.push(normalizeShapeData(item));
      }

      const savedCount = await storage.saveDmensionShapes(shapes);
      const totalCount = await storage.getDmensionShapeCount();
      dmensionBridge.setLocalShapeCount(totalCount);

      res.json({ uploaded: shapes.length, saved: savedCount, totalInDatabase: totalCount });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/dmension/local/search", async (req: Request, res: Response) => {
    const query = (req.query.q as string) || "";
    if (!query) return res.json({ results: [], codex: [] });

    const [dbResults, codexResults] = await Promise.all([
      storage.searchDmensionShapes(query),
      Promise.resolve(searchDmensionShapes(query)),
    ]);

    res.json({
      results: dbResults,
      codex: codexResults,
      totalLocal: dbResults.length,
      totalCodex: codexResults.length,
    });
  });

  app.get("/api/dmension/local/count", async (_req: Request, res: Response) => {
    const count = await storage.getDmensionShapeCount();
    res.json({ count, codexCategories: DMENSION_CATEGORIES.length, codexShapes: DMENSION_STATS.totalShapes });
  });

  app.get("/api/dmension/match", (req: Request, res: Response) => {
    const topic = (req.query.topic as string) || "";
    if (!topic) return res.json({ match: null });
    const match = matchTopicToShape(topic);
    res.json({ match, dmensionUrl: "https://uuon.world/app" });
  });

  app.post("/api/dmension/seed-from-codex", async (_req: Request, res: Response) => {
    try {
      const shapes: InsertDmensionShape[] = [];

      for (const cat of DMENSION_CATEGORIES) {
        shapes.push({
          shapeId: `codex-cat-${cat.id}`,
          name: cat.name,
          category: cat.id,
          domain: cat.domain,
          description: `${cat.name} — ${cat.count} shapes`,
          earthLink: cat.earthLink,
          tags: `${cat.domain},${cat.id}`,
          metadata: JSON.stringify({ count: cat.count, source: "codex-seed" }),
        });
      }

      for (const [key, engine] of Object.entries(DMENSION_ENGINES)) {
        const engineAny = engine as any;
        shapes.push({
          shapeId: `codex-engine-${key}`,
          name: engineAny.name,
          category: key,
          domain: "engine",
          description: engineAny.description,
          earthLink: engineAny.earthApplication,
          engineName: engineAny.name,
          tags: (engineAny.shapes || []).join(","),
          metadata: JSON.stringify({ count: engineAny.count || 0, source: "codex-seed", fusionDomains: engineAny.fusionDomains }),
        });
      }

      const savedCount = await storage.saveDmensionShapes(shapes);
      const totalCount = await storage.getDmensionShapeCount();
      dmensionBridge.setLocalShapeCount(totalCount);

      res.json({ seeded: shapes.length, saved: savedCount, totalInDatabase: totalCount });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/dmension/bridge-status", (_req: Request, res: Response) => {
    const status = dmensionBridge.getDmensionStatus();
    res.json({
      ...status,
      codex: {
        totalShapes: DMENSION_STATS.totalShapes,
        categories: DMENSION_CATEGORIES.length,
        engines: Object.keys(DMENSION_ENGINES).length,
      },
    });
  });
}

function normalizeShapeData(item: any): InsertDmensionShape {
  return {
    shapeId: item.shapeId || item.id || item.uid || `imported-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: item.name || item.title || item.label || "Unnamed Shape",
    category: item.category || item.type || item.group || "uncategorized",
    domain: item.domain || item.field || extractDomain(JSON.stringify(item)),
    description: item.description || item.desc || item.summary || null,
    formula: item.formula || item.equation || item.math || null,
    parameters: item.parameters ? (typeof item.parameters === "string" ? item.parameters : JSON.stringify(item.parameters)) : null,
    earthLink: item.earthLink || item.earth_link || item.application || null,
    sketchfabUrl: item.sketchfabUrl || item.url || item.link || null,
    tags: item.tags ? (Array.isArray(item.tags) ? item.tags.join(",") : item.tags) : null,
    engineName: item.engineName || item.engine || null,
    metadata: item.metadata ? (typeof item.metadata === "string" ? item.metadata : JSON.stringify(item.metadata)) : null,
  };
}

function extractCategory(text: string): string {
  const lower = text.toLowerCase();
  if (/fractal|mandelbrot|julia|sierpinski/i.test(lower)) return "fractal-iterations";
  if (/quantum|wave\s*function|bloch|superposition/i.test(lower)) return "quantum-physics";
  if (/tensor|riemann|christoffel|metric/i.test(lower)) return "4d-advanced";
  if (/galaxy|cosmic|star|black\s*hole/i.test(lower)) return "modulo-cosmos";
  if (/crystal|mineral|snowflake/i.test(lower)) return "Nature & Crystals";
  if (/dna|protein|cell|bio/i.test(lower)) return "Medical Imaging";
  if (/modulo|modular|clock/i.test(lower)) return "modulo-math";
  if (/lattice|grid|repeat/i.test(lower)) return "lattice-structures";
  if (/entropy|chaos|attractor/i.test(lower)) return "entropy";
  if (/surface|parametric|revolution/i.test(lower)) return "parametric-surfaces";
  if (/wave|harmonic|fourier|sound/i.test(lower)) return "waveforms_harmonics";
  if (/phi|golden|fibonacci/i.test(lower)) return "phi_dimension";
  return "uncategorized";
}

function extractDomain(text: string): string {
  const lower = text.toLowerCase();
  if (/math|algebra|geometry|topology|calculus/i.test(lower)) return "mathematics";
  if (/physics|quantum|wave|force|energy/i.test(lower)) return "physics";
  if (/bio|dna|protein|cell|medical/i.test(lower)) return "science";
  if (/code|algorithm|crypto|network|ai|ml/i.test(lower)) return "technology";
  return "mathematics";
}
