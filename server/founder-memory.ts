import fs from "fs";
import zlib from "zlib";
import { storage } from "./storage";

const TOPIC_KEYWORDS: Record<string, string[]> = {
  math: ["math", "formula", "equation", "algorithm", "digit", "number", "calcul", "fraction", "decimal", "parametric", "euler", "prime"],
  lattice: ["lattice", "chi", "position", "percentage", "per mille", "‰", "«…»", "zero-point", "g°centric"],
  etymology: ["etymolog", "latin", "greek", "hebrew", "arabic", "word origin", "root word", "linguist"],
  cipher: ["cipher", "cryptograph", "encrypt", "decode", "pattern", "algorithm"],
  physics: ["physics", "quantum", "dimension", "plasma", "frequency", "oscillat", "crystal", "wave", "field", "tensor", "4d", "3d"],
  astronomy: ["constellation", "star", "solar", "cosmos", "galaxy", "orbit", "celestial", "ptolemy"],
  geometry: ["geometry", "flower of life", "wireframe", "sacred geometry", "fractal", "spiral", "tetrahed", "pyramid", "diamond"],
  breath: ["breath", "neuma", "pneuma", "vertical stroke", "dash", "em dash"],
  foundation: ["uuon", "foundation", "platform", "build", "architect", "system", "engine"],
  biology: ["neural", "cell", "dna", "genetic", "organic", "plasma", "life"],
  philosophy: ["meaning", "perception", "consciousness", "truth", "existence", "reality"],
  music: ["music", "frequency", "harmonic", "tone", "sound", "vibrat"],
  earth: ["earth", "planet", "geograph", "element", "water", "fire", "wind", "sahara"],
  ai: ["ai", "a.i.", "model", "machine learning", "artificial", "æye", "clouud"],
};

const CORRECTION_PATTERNS = [
  /\bno[,.]?\s+(that'?s?\s+)?(not|wrong|incorrect)/i,
  /\bactually[,.]?\s/i,
  /\bthe correct\b/i,
  /\bnot\s+\w+[,]\s+but\b/i,
  /\bi said\b/i,
  /\bi didn'?t\s+(say|mean|ask)\b/i,
  /\bthat'?s\s+not\s+what\b/i,
  /\byou'?re\s+(missing|wrong|confused|misunderstand)/i,
  /\bwrong\b.*\bcorrect\b/i,
  /\bno[,.]?\s+it'?s\b/i,
  /\byou\s+(missed|forgot|overlooked|ignored)\b/i,
  /\btry again\b/i,
  /\bnot quite\b/i,
  /\bclose but\b/i,
  /\bthat'?s\s+backwards\b/i,
  /\byou'?re\s+reversing\b/i,
];

const DIRECTIVE_PATTERNS = [
  /\balways\s+\w/i,
  /\bnever\s+\w/i,
  /\byou must\b/i,
  /\bfrom now on\b/i,
  /\bremember that\b/i,
  /\bremember this\b/i,
  /\bdo not\s+\w/i,
  /\bdon'?t\s+(ever|forget|ignore)\b/i,
  /\bevery time\s+you\b/i,
  /\bwhen I (say|ask|tell)\b/i,
  /\bthis is (important|critical|key|essential)\b/i,
  /\brule[:]?\s/i,
  /\bgoing forward\b/i,
  /\bmake sure\s+(you|to)\b/i,
  /\bkeep (this|that) in mind\b/i,
];

function classifyCorrectionType(text: string): string {
  const lower = text.toLowerCase();
  if (/\bname|naming|called|spell|title\b/.test(lower)) return "NAMING";
  if (/\bstructur|architect|design|order|sequence|format\b/.test(lower)) return "STRUCTURAL";
  if (/\bconcept|understand|mean|definition|idea|theory\b/.test(lower)) return "CONCEPTUAL";
  return "FACTUAL";
}

function extractTopicTags(text: string): string[] {
  const lower = text.toLowerCase();
  const tags: string[] = [];
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) {
      tags.push(topic);
    }
  }
  return tags;
}

function extractTextFromContent(msg: any): string {
  if (msg.text && msg.text.length > 0) return msg.text;
  if (msg.content && Array.isArray(msg.content)) {
    const texts: string[] = [];
    for (const block of msg.content) {
      if (block.text && block.text.length > 0) texts.push(block.text);
    }
    return texts.join("\n");
  }
  return "";
}

function extractFromZip(zipBuffer: Buffer, targetName: string): Buffer | null {
  let offset = 0;
  while (offset < zipBuffer.length - 4) {
    if (zipBuffer.readUInt32LE(offset) !== 0x04034b50) break;
    const method = zipBuffer.readUInt16LE(offset + 8);
    const compSize = zipBuffer.readUInt32LE(offset + 18);
    const fnLen = zipBuffer.readUInt16LE(offset + 26);
    const extraLen = zipBuffer.readUInt16LE(offset + 28);
    const filename = zipBuffer.toString("utf8", offset + 30, offset + 30 + fnLen);
    const dataStart = offset + 30 + fnLen + extraLen;
    if (filename === targetName) {
      const compData = zipBuffer.subarray(dataStart, dataStart + compSize);
      if (method === 8) return zlib.inflateRawSync(compData);
      return compData;
    }
    offset = dataStart + compSize;
  }
  return null;
}

export interface IngestionProgress {
  status: "idle" | "running" | "complete" | "failed";
  conversationsProcessed: number;
  conversationsTotal: number;
  messagesProcessed: number;
  correctionsFound: number;
  directivesFound: number;
  startedAt: string | null;
  completedAt: string | null;
  error?: string;
}

let currentProgress: IngestionProgress = {
  status: "idle",
  conversationsProcessed: 0,
  conversationsTotal: 0,
  messagesProcessed: 0,
  correctionsFound: 0,
  directivesFound: 0,
  startedAt: null,
  completedAt: null,
};

export function getIngestionProgress(): IngestionProgress {
  return { ...currentProgress };
}

export async function ingestFounderArchive(zipPath: string): Promise<IngestionProgress> {
  if (currentProgress.status === "running") {
    return currentProgress;
  }

  currentProgress = {
    status: "running",
    conversationsProcessed: 0,
    conversationsTotal: 0,
    messagesProcessed: 0,
    correctionsFound: 0,
    directivesFound: 0,
    startedAt: new Date().toISOString(),
    completedAt: null,
  };

  try {
    console.log("[MEMORY] Beginning founder archive ingestion...");
    const zipBuffer = fs.readFileSync(zipPath);
    const convBuffer = extractFromZip(zipBuffer, "conversations.json");
    if (!convBuffer) {
      throw new Error("conversations.json not found in archive");
    }

    const conversations: any[] = JSON.parse(convBuffer.toString("utf8"));
    currentProgress.conversationsTotal = conversations.length;
    console.log(`[MEMORY] Archive contains ${conversations.length} conversations`);

    for (let ci = 0; ci < conversations.length; ci++) {
      const conv = conversations[ci];
      const chatMessages = conv.chat_messages || [];
      const convName = conv.name || "untitled";
      const convTopics = extractTopicTags(convName + " " + (conv.summary || ""));

      const dbConv = await storage.importFounderConversation({
        externalUuid: conv.uuid,
        name: convName,
        summary: conv.summary || null,
        messageCount: chatMessages.length,
        topicTags: JSON.stringify(convTopics),
        projectName: null,
        originalCreatedAt: new Date(conv.created_at),
      });

      let prevAssistantContent = "";
      for (let mi = 0; mi < chatMessages.length; mi++) {
        const msg = chatMessages[mi];
        const content = extractTextFromContent(msg);
        if (!content || content.trim().length === 0) continue;

        const isHuman = msg.sender === "human";
        const msgTopics = extractTopicTags(content);

        let isCorrection = false;
        let isDirective = false;

        if (isHuman) {
          isCorrection = CORRECTION_PATTERNS.some(p => p.test(content));
          isDirective = DIRECTIVE_PATTERNS.some(p => p.test(content));
        }

        const dbMsg = await storage.importFounderMessage({
          conversationId: dbConv.id,
          externalUuid: msg.uuid,
          sender: msg.sender,
          content: content,
          isCorrection,
          isDirective,
          topicTags: msgTopics.length > 0 ? JSON.stringify(msgTopics) : null,
          originalCreatedAt: new Date(msg.created_at),
        });

        currentProgress.messagesProcessed++;

        if (isCorrection && prevAssistantContent) {
          const corrType = classifyCorrectionType(content);
          const resolution = content.substring(0, 500);
          const assistantError = prevAssistantContent.substring(0, 500);

          await storage.saveFounderCorrection({
            messageId: dbMsg.id,
            conversationId: dbConv.id,
            correctionType: corrType,
            founderStatement: resolution,
            assistantError: assistantError,
            resolution: resolution,
            topicTags: msgTopics.length > 0 ? JSON.stringify(msgTopics) : null,
          });
          currentProgress.correctionsFound++;
        }

        if (isDirective) {
          currentProgress.directivesFound++;
        }

        if (!isHuman) {
          prevAssistantContent = content;
        } else {
          prevAssistantContent = "";
        }
      }

      currentProgress.conversationsProcessed++;
      if ((ci + 1) % 50 === 0) {
        console.log(`[MEMORY] Progress: ${ci + 1}/${conversations.length} conversations, ${currentProgress.messagesProcessed} messages, ${currentProgress.correctionsFound} corrections, ${currentProgress.directivesFound} directives`);
      }
    }

    currentProgress.status = "complete";
    currentProgress.completedAt = new Date().toISOString();
    console.log(`[MEMORY] Ingestion complete: ${currentProgress.conversationsProcessed} conversations, ${currentProgress.messagesProcessed} messages, ${currentProgress.correctionsFound} corrections, ${currentProgress.directivesFound} directives`);
    return currentProgress;
  } catch (err: any) {
    currentProgress.status = "failed";
    currentProgress.error = err.message;
    currentProgress.completedAt = new Date().toISOString();
    console.error(`[MEMORY] Ingestion failed: ${err.message}`);
    return currentProgress;
  }
}
