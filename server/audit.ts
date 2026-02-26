interface CodeBlock {
  source: string;
  language: string;
  code: string;
  lineCount: number;
  viable: boolean;
  score: number;
  flags: string[];
  recommendation: string;
}

export interface AuditReport {
  totalConversations: number;
  totalCodeBlocks: number;
  viable: number;
  needsWork: number;
  discard: number;
  blocks: CodeBlock[];
  summary: string;
}

export function auditConversationExport(exportJson: any, source: "claude" | "chatgpt"): AuditReport {
  const conversations = source === "claude"
    ? extractClaudeConversations(exportJson)
    : extractChatGPTConversations(exportJson);

  const allBlocks: CodeBlock[] = [];

  for (const conv of conversations) {
    const blocks = extractCodeBlocks(conv.messages || conv.chat_messages || [], conv.title || conv.name || "untitled");
    allBlocks.push(...blocks);
  }

  const scored = allBlocks.map(scoreBlock);

  const viable = scored.filter(b => b.recommendation === "keep" || b.recommendation === "promote");
  const needsWork = scored.filter(b => b.recommendation === "fix");
  const discard = scored.filter(b => b.recommendation === "discard");

  return {
    totalConversations: conversations.length,
    totalCodeBlocks: scored.length,
    viable: viable.length,
    needsWork: needsWork.length,
    discard: discard.length,
    blocks: scored,
    summary: buildSummary(scored, conversations.length),
  };
}

function extractClaudeConversations(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (data.conversations) return data.conversations;
  return [];
}

function extractChatGPTConversations(data: any): any[] {
  if (Array.isArray(data)) return data;
  return [];
}

function extractCodeBlocks(messages: any[], source: string): CodeBlock[] {
  const blocks: CodeBlock[] = [];
  const codePattern = /```(\w+)?\n([\s\S]*?)```/g;

  for (const msg of messages) {
    const content = msg.content ?? msg.text ?? "";
    const text = typeof content === "string" ? content
      : Array.isArray(content) ? content.map((c: any) => c.text ?? "").join("\n")
      : "";

    let match;
    while ((match = codePattern.exec(text)) !== null) {
      const lang = match[1]?.toLowerCase() ?? "unknown";
      const code = match[2].trim();
      if (code.length > 30) {
        blocks.push({
          source,
          language: lang,
          code,
          lineCount: code.split("\n").length,
          viable: false,
          score: 0,
          flags: [],
          recommendation: "discard",
        });
      }
    }
  }
  return blocks;
}

function scoreBlock(block: CodeBlock): CodeBlock {
  const flags: string[] = [];
  let score = 60;

  const code = block.code;

  if (block.lineCount > 10) score += 10;
  if (block.lineCount > 30) score += 10;
  if (code.includes("def ") || code.includes("function ") || code.includes("class ")) score += 10;
  if (code.includes("import ") || code.includes("require(")) score += 5;
  if (["python", "typescript", "javascript", "rust", "go"].includes(block.language)) score += 5;

  if (code.includes("TODO") || code.includes("FIXME")) { score -= 10; flags.push("has TODOs"); }
  if (code.includes("YOUR_API_KEY") || code.includes("paste here")) { score -= 15; flags.push("placeholder values"); }
  if (code.includes("...") && code.split("...").length > 3) { score -= 20; flags.push("incomplete — ellipsis placeholders"); }
  if (block.lineCount < 5) { score -= 20; flags.push("too short to be standalone"); }
  if (code.includes("print('hello") || code.includes('console.log("hello')) { score -= 30; flags.push("tutorial snippet only"); }

  if (code.includes("chi_rho") || code.includes("lattice") || code.includes("gcentric")) score += 15;
  if (code.includes("Fraction") || code.includes("fractions")) score += 10;
  if (code.includes("conformal") || code.includes("nerf") || code.includes("dimension")) score += 10;

  score = Math.min(100, Math.max(0, score));

  let recommendation: string;
  if (score >= 80) recommendation = "promote";
  else if (score >= 60) recommendation = "keep";
  else if (score >= 35) recommendation = "fix";
  else recommendation = "discard";

  return { ...block, score, flags, viable: score >= 60, recommendation };
}

function buildSummary(blocks: CodeBlock[], convCount: number): string {
  const promoted = blocks.filter(b => b.recommendation === "promote");
  const langs = [...new Set(blocks.map(b => b.language))].filter(l => l !== "unknown");

  return [
    `Audited ${convCount} conversations. Found ${blocks.length} code blocks.`,
    `${promoted.length} blocks ready to promote into G°centric system.`,
    `Languages present: ${langs.join(", ")}.`,
    promoted.length > 0
      ? `Top candidates: ${promoted.slice(0, 3).map(b => b.source).join(", ")}.`
      : "No blocks met the promote threshold. Review fix-flagged blocks next.",
  ].join(" ");
}
