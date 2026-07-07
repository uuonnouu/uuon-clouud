import OpenAI from "openai";

// Model routing:
// 1. OLLAMA_MODEL set → local Ollama (free, no tokens)
// 2. OPENROUTER_API_KEY set → OpenRouter (paid)
// 3. Neither → null (system prompt only mode)
const USE_OLLAMA = !!process.env.OLLAMA_MODEL || process.env.AI_BACKEND === "ollama";

const client = USE_OLLAMA
  ? new OpenAI({
      apiKey: "ollama",                          // Ollama ignores the key
      baseURL: process.env.OLLAMA_HOST || "http://127.0.0.1:11434/v1",
    })
  : process.env.OPENROUTER_API_KEY
    ? new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
          "HTTP-Referer": "https://uuon-foundation.com",
          "X-Title": "UUON Clouud",
        },
      })
    : null;

const MODEL = USE_OLLAMA
  ? (process.env.OLLAMA_MODEL || "clouud:latest")
  : (process.env.OPENROUTER_MODEL || "meta-llama/llama-3.1-8b-instruct");

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
      description: "Search Δmension 3D mathematical shape library",
      parameters: {
        type: "object",
        properties: { query: { type: "string" } },
        required: ["query"],
      },
    },
  },
];

function executeTool(name: string, args: Record<string, string>): string {
  if (name === "lunar_phase") return JSON.stringify(getLunarPhase());
  if (name === "explore_dmension") {
    return JSON.stringify({
      query: args.query,
      url: `https://uuon-foundation.com/search?q=${encodeURIComponent(args.query || "")}`,
    });
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
      max_tokens: 768,
      messages: [{ role: "system", content: systemPrompt }, ...input],
      ...(USE_OLLAMA ? {} : { tools: TOOLS, tool_choice: "auto" }),
    });

    while (response.choices[0]?.finish_reason === "tool_calls") {
      const calls = response.choices[0].message.tool_calls ?? [];
      const results: OpenAI.Chat.ChatCompletionToolMessageParam[] = calls.map(tc => ({
        role: "tool",
        tool_call_id: tc.id,
        content: executeTool(tc.function.name, JSON.parse(tc.function.arguments || "{}")),
      }));

      response = await client.chat.completions.create({
        model: MODEL,
        max_tokens: 768,
        messages: [
          { role: "system", content: systemPrompt },
          ...input,
          response.choices[0].message,
          ...results,
        ],
        ...(USE_OLLAMA ? {} : { tools: TOOLS, tool_choice: "auto" }),
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
    }),
  });
  if (!res.ok) throw new Error(`Ollama unavailable: ${res.status}`);
  const data = await res.json() as { message?: { content?: string } };
  return data.message?.content ?? "";
}
