import { storage } from "./storage";
import OpenAI from "openai";
import { gradeText } from "./detection/grader";
import { judgeClaim } from "./detection/probability-zone";
import { ellomental } from "./ellomental-hash";

// Model routing:
// 1. OLLAMA_MODEL set → local Ollama (free, no tokens)
// 2. OPENROUTER_API_KEY set → OpenRouter (paid)
// 3. Neither → null (system prompt only mode)
const USE_OLLAMA = process.env.FORCE_OLLAMA === "1";

const client = USE_OLLAMA
  ? new OpenAI({
      apiKey: "ollama",                          // Ollama ignores the key
      baseURL: process.env.OLLAMA_BASE_URL ? process.env.OLLAMA_BASE_URL + "/v1" : "http://127.0.0.1:11434/v1",
    })
  : process.env.OPENROUTER_API_KEY
    ? new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
          "HTTP-Referer": "https://uuon.world/app",
          "X-Title": "UUON Clouud",
        },
      })
    : null;

const MODEL = USE_OLLAMA
  ? (process.env.OLLAMA_MODEL || "clouud:latest")
  : (process.env.OPENROUTER_MODEL || "anthropic/claude-haiku-4-5");

function getLunarPhase(): Record<string, string> {
  const k = 1 / 29.530588853;
  const j2000 = Date.now() / 86400000 - 10957.5;
  const age = ((j2000 * k) % 1 + 1) % 1;
  const phases: Array<[number, string]> = [
    [0.03, "New Moon"], [0.25, "Waxing Crescent"], [0.28, "First Quarter"],
    [0.47, "Waxing Gibbous"], [0.53, "Full Moon"], [0.72, "Waning Gibbous"],
    [0.75, "Last Quarter"], [0.97, "Waning Crescent"], [1, "New Moon"],
  ];
  const phase = phases.find(([t]) => age < t)?.[1] ?? "New Moon";
  return { phase, ageDays: (age * 29.53).toFixed(2), k: k.toFixed(15) };
}

const TOOLS: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "lunar_phase",
      description: "Get current lunar phase using k = 1/29.530588853",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "explore_dmension",
      description:
        "LIVE search of the Δmension 3D mathematical shape library via the " +
        "Dmension bridge API. Returns real current catalog data. Prefer this " +
        "over dmension_search when the user wants current/authoritative results.",
      parameters: {
        type: "object",
        properties: { query: { type: "string" } },
        required: ["query"],
      },
    },
  },
  // ── Layer 3: HONESTY tools (the differentiator) ──
  {
    type: "function",
    function: {
      name: "grade_text",
      description:
        "Grade text for fabrication patterns (FEED-003): unfalsifiable anchors, " +
        "unearned validation stamps, statistics without method, agreement-elicitation " +
        "structure, secrets, personal data. Use on any claim, document, OR your own " +
        "draft before asserting it. Returns grade + findings. CLEAN means 'no known " +
        "pattern detected', not 'true'.",
      parameters: {
        type: "object",
        properties: {
          text: { type: "string", description: "The text to grade" },
        },
        required: ["text"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "probability_zone",
      description:
        "Compute a calibrated confidence for a claim using Bayesian inference " +
        "with the Fisher information metric (CLOUUD-PROB-004). Returns posterior, " +
        "Shannon entropy (bits of uncertainty), and whether the result is well-" +
        "separated from 'I don't know'. Use to report honest confidence instead " +
        "of asserting. priorGrounded is the base rate this kind of claim is true.",
      parameters: {
        type: "object",
        properties: {
          priorGrounded: {
            type: "number",
            description: "Base rate (0-1) that this kind of claim is grounded. Default 0.5.",
          },
          evidenceFor: {
            type: "number",
            description: "Likelihood of the evidence if grounded. Default 1.0.",
          },
          evidenceAgainst: {
            type: "number",
            description: "Likelihood of the evidence if invented. Default 1.0.",
          },
        },
        required: [],
      },
    },
  },
  // ── Existing capability, now callable: provenance ──
  {
    type: "function",
    function: {
      name: "ellomental_verify",
      description:
        "Generate an Ellomental provenance hash for text — a verifiable fingerprint " +
        "proving content origin and integrity. Use when the user asks to track, " +
        "verify, or prove the provenance of a piece of text.",
      parameters: {
        type: "object",
        properties: {
          content: { type: "string", description: "The content to hash" },
        },
        required: ["content"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_founder_memory",
      description:
        "Search the founder conversation archive (835 conversations). Use when " +
        "asked about UUON history, founder decisions, past discussions, the " +
        "Robertson Engine, project history, or anything Clouud should know from " +
        "its own memory. Returns matching messages.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search term or phrase" },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "scrape_url",
      description:
        "Fetch and extract text content from a URL. Use when the user shares a " +
        "link or asks you to read a webpage. Returns extracted text. Rate limited.",
      parameters: {
        type: "object",
        properties: {
          url: { type: "string", description: "The URL to scrape" },
        },
        required: ["url"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "lattice_value",
      description:
        "Get the chi value and metadata for a specific position (1-33) in the " +
        "UUON 33-point lattice. Use when asked about lattice positions, chi values, " +
        "or the mathematical structure of the system.",
      parameters: {
        type: "object",
        properties: {
          position: { type: "number", description: "Lattice position (1-33)" },
        },
        required: ["position"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "dmension_search",
      description:
        "Search a LOCAL CACHED copy (dmension-codex) of the Dmension shape " +
        "library. Fast but may be out of date with the live catalog. Use as " +
        "fallback if explore_dmension (live bridge) is unreachable.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search term for shapes" },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "self_assessment",
      description:
        "Run a self-assessment of Clouud system health: model info, tool count, " +
        "founder memory stats, detection layer status, uptime. Use when asked " +
        "about system status or capabilities.",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
];

async function executeTool(name: string, args: Record<string, any>): Promise<string> {
  if (name === "lunar_phase") return JSON.stringify(getLunarPhase());

  if (name === "explore_dmension") {
    const base = process.env.UUON_DMENSION_URL;
    if (!base) {
      return JSON.stringify({
        error: "UUON_DMENSION_URL not configured — live Dmension search unavailable. Use dmension_search (local cache) instead.",
      });
    }
    try {
      const res = await fetch(
        `${base.replace(/\/$/, "")}/api/shapes/shapes`,
        {
          headers: process.env.UUON_BRIDGE_SECRET
            ? { "x-bridge-secret": process.env.UUON_BRIDGE_SECRET }
            : {},
          signal: AbortSignal.timeout(10000),
        }
      );
      if (!res.ok) {
        return JSON.stringify({ error: `Dmension bridge returned ${res.status}` });
      }
      const all = await res.json();
      const list = Array.isArray(all) ? all : (all.shapes ?? []);
      const q = (args.query || "").toLowerCase();
      const hits = list.filter((s: any) =>
        JSON.stringify(s).toLowerCase().includes(q)).slice(0, 10);
      return JSON.stringify({ query: args.query, count: hits.length, shapes: hits });
    } catch (e: any) {
      return JSON.stringify({ error: "Dmension unreachable: " + (e.message || "unknown") });
    }
  }

  if (name === "grade_text") {
    return JSON.stringify(gradeText(String(args.text || "")));
  }

  if (name === "probability_zone") {
    const prior = typeof args.priorGrounded === "number" ? args.priorGrounded : 0.5;
    const eFor = typeof args.evidenceFor === "number" ? args.evidenceFor : 1.0;
    const eAgainst = typeof args.evidenceAgainst === "number" ? args.evidenceAgainst : 1.0;
    return JSON.stringify(judgeClaim(prior, eFor, eAgainst));
  }

  if (name === "ellomental_verify") {
    try {
      return JSON.stringify(ellomental(String(args.content || "")));
    } catch (e: any) {
      return JSON.stringify({ error: e.message || "ellomental failed" });
    }
  }

  if (name === "search_founder_memory") {
    try {
      const results = await storage.searchFounderMemory(String(args.query || ""), 10);
      return JSON.stringify({ results: results.slice(0, 5).map(m => ({ role: m.role, content: m.content?.substring(0, 500), timestamp: m.timestamp })) });
    } catch (e: any) {
      return JSON.stringify({ error: e.message || "search failed" });
    }
  }

  if (name === "scrape_url") {
    try {
      const fetch = (await import("node-fetch")).default;
      const resp = await fetch(String(args.url), { timeout: 10000 });
      const html = await resp.text();
      const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").substring(0, 2000);
      return JSON.stringify({ url: args.url, text });
    } catch (e: any) {
      return JSON.stringify({ error: e.message || "scrape failed" });
    }
  }

  if (name === "lattice_value") {
    try {
      const { chiValue } = await import("./lattice");
      const pos = Number(args.position) || 1;
      const result = chiValue(pos);
      return JSON.stringify(result);
    } catch (e: any) {
      return JSON.stringify({ error: e.message || "lattice lookup failed" });
    }
  }

  if (name === "dmension_search") {
    try {
      const { searchDmensionShapes } = await import("./dmension-codex");
      const results = await searchDmensionShapes(String(args.query || ""));
      return JSON.stringify({ results: results.slice(0, 5), source: "local-codex-cache" });
    } catch (e: any) {
      return JSON.stringify({ error: e.message || "dmension search failed" });
    }
  }

  if (name === "self_assessment") {
    try {
      const stats = await storage.getFounderStats();
      return JSON.stringify({
        model: process.env.OLLAMA_MODEL || process.env.OPENROUTER_MODEL || "unknown",
        backend: process.env.AI_BACKEND || "openrouter",
        tools: TOOLS.length,
        founderConversations: stats.conversations,
        founderMessages: stats.messages,
        uptime: process.uptime().toFixed(0) + "s",
      });
    } catch (e: any) {
      return JSON.stringify({ error: e.message || "self-assessment failed" });
    }
  }

  return JSON.stringify({ error: "unknown tool" });
}

export async function callClouud(
  systemPrompt: string,
  messages: Array<{ role: string; content: string }>
): Promise<string> {
  if (client) {
    const input = messages.map(m => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    let response = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 1024,
      messages: [{ role: "system", content: systemPrompt }, ...input],
      tools: TOOLS, tool_choice: "auto",
    });

    while (response.choices[0]?.finish_reason === "tool_calls") {
      const calls = response.choices[0].message.tool_calls ?? [];
      const results: OpenAI.Chat.ChatCompletionToolMessageParam[] = await Promise.all(calls.map(async tc => ({
        role: "tool",
        tool_call_id: tc.id,
        content: await executeTool(tc.function.name, JSON.parse(tc.function.arguments || "{}")),
      })));

      response = await client.chat.completions.create({
        model: MODEL,
        max_tokens: 1024,
        messages: [
          { role: "system", content: systemPrompt },
          ...input,
          response.choices[0].message,
          ...results,
        ],
        tools: TOOLS, tool_choice: "auto",
      });
    }

    return response.choices[0]?.message?.content ?? "";
  }

  // Fallback: Ollama
  const res = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "clouud",
      stream: false,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    })
  });
  if (!res.ok) throw new Error(`Ollama unavailable: ${res.status}`);
  const data = await res.json() as { message?: { content?: string } };
  return data.message?.content ?? "";
}
