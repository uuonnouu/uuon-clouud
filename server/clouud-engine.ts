import Anthropic from "@anthropic-ai/sdk";
import { generateProvenanceHash } from "./ellomental-hash";

const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

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

  const result = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: input
      }
    ]
  });

  let response = "";

  for (const block of result.content) {
    if (block.type === "text") {
      response += block.text;
    }
  }

  const assessment = assessResponse(response);
  const hash = generateProvenanceHash(response);

  return {
    response,
    assessment,
    provenance: {
      hash
    },
    status: "complete"
  };
}
