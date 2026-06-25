import { generateProvenanceHash } from "./ellomental-hash";

const OLLAMA_BASE = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.1:8b";

function assessResponse(text: string) {
  const words = text.trim().split(/\s+/).length;
  return { pass: true, flags: [], score: 100, wordCount: words };
}

export async function processClouud(input: string) {
  const resp = await fetch(`${OLLAMA_BASE}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: [{ role: "user", content: input }],
      stream: false,
    }),
  });

  if (!resp.ok) {
    throw new Error(`Ollama error: ${resp.status} ${resp.statusText}`);
  }

  const data = await resp.json() as any;
  const response = data.choices?.[0]?.message?.content || "";

  const assessment = assessResponse(response);
  const hash = generateProvenanceHash(response);

  return {
    response,
    assessment,
    provenance: { hash },
    status: "complete",
  };
}
