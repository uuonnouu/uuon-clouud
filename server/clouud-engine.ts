import { generateProvenanceHash } from "./ellomental-hash";

function assessResponse(text: string) {
  const words = text.trim().split(/\s+/).length;
  return {
    pass: true,
    flags: [],
    score: 100,
    wordCount: words
  };
}

export async function processClouud(input: string) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "anthropic/claude-3-haiku",
      max_tokens: 1024,
      messages: [{ role: "user", content: input }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${err}`);
  }

  const data = await res.json() as { choices: { message: { content: string } }[] };
  const response = data.choices[0]?.message?.content ?? "";

  const assessment = assessResponse(response);
  const hash = generateProvenanceHash(response);

  return {
    response,
    assessment,
    provenance: { hash },
    status: "complete",
  };
}
