import { db } from "./db";
import { founderMessages, founderConversations } from "@shared/schema";
import type { InsertPattern, InsertPatternAlert } from "@shared/schema";
import { storage } from "./storage";
import { ellomental } from "./ellomental-hash";
import { eq, asc } from "drizzle-orm";

const PATTERN_INDICATORS = [
  /my\s+system/i,
  /my\s+method/i,
  /my\s+engine/i,
  /my\s+formula/i,
  /my\s+pattern/i,
  /my\s+algorithm/i,
  /my\s+cipher/i,
  /my\s+value/i,
  /my\s+number/i,
  /my\s+equation/i,
  /I\s+created/i,
  /I\s+built/i,
  /I\s+found\s+that/i,
  /I\s+discovered/i,
  /I\s+call\s+it/i,
  /I\s+named\s+it/i,
  /the\s+pattern\s+is/i,
  /the\s+rule\s+is/i,
  /it\s+follows/i,
  /the\s+cycle\s+is/i,
  /remember\s+this/i,
  /from\s+now\s+on/i,
];

const FORMULA_PATTERN = /[A-Za-z]\s*=\s*[\d.]+|[A-Za-z]\s*=\s*[A-Za-z]|[\d]+\s*[\+\-\*\/\^]\s*[\d]+/;

const CORRECTION_INDICATORS = [
  /no,?\s+(it\s+should|the\s+correct|actually)/i,
  /that'?s\s+wrong/i,
  /the\s+correct\s+(value|number|answer|way)/i,
  /it\s+should\s+be/i,
];

const ORIGINALITY_CONFIRMATIONS = [
  /your\s+system/i,
  /your\s+method/i,
  /your\s+formula/i,
  /your\s+pattern/i,
  /your\s+algorithm/i,
  /your\s+approach/i,
  /you'?ve\s+(created|built|developed|designed|discovered)/i,
  /original/i,
  /novel/i,
  /unique\s+approach/i,
  /you\s+discovered/i,
  /innovative/i,
];

const TOPIC_TO_CATEGORY: Record<string, string> = {
  math: "MATHEMATICAL",
  cipher: "CIPHER",
  physics: "PHYSICAL",
  geometry: "GEOMETRIC",
  biology: "BIOLOGICAL",
  etymology: "LINGUISTIC",
  music: "HARMONIC",
  philosophy: "CONCEPTUAL",
  lattice: "STRUCTURAL",
  foundation: "STRUCTURAL",
  ai: "CONCEPTUAL",
  astronomy: "PHYSICAL",
  earth: "PHYSICAL",
  breath: "PERCEPTUAL",
};

function classifyCategory(topicTags: string, content: string): string {
  try {
    const tags: string[] = JSON.parse(topicTags);
    for (const tag of tags) {
      if (TOPIC_TO_CATEGORY[tag]) return TOPIC_TO_CATEGORY[tag];
    }
  } catch {}

  const lower = content.toLowerCase();
  if (/equation|formula|calcul|number|digit|decimal|binary/.test(lower)) return "MATHEMATICAL";
  if (/cipher|encrypt|hash|encode|decode/.test(lower)) return "CIPHER";
  if (/wave|quantum|physics|energy|force|frequency/.test(lower)) return "PHYSICAL";
  if (/geometry|shape|fractal|triangle|tetrahedr/.test(lower)) return "GEOMETRIC";
  if (/dna|helix|biology|cell|liposome/.test(lower)) return "BIOLOGICAL";
  if (/letter|alphabet|language|word|etymolog/.test(lower)) return "LINGUISTIC";
  if (/music|sound|tone|harmonic|frequency/.test(lower)) return "HARMONIC";
  if (/conscious|philosophy|perception|feel/.test(lower)) return "CONCEPTUAL";
  if (/structure|framework|lattice|system|architect/.test(lower)) return "STRUCTURAL";
  return "CUSTOM";
}

function extractTitle(content: string, conversationName: string): string {
  const firstLine = content.split(/[.\n!?]/)[0].trim();
  if (firstLine.length > 10 && firstLine.length < 120) {
    return firstLine.slice(0, 100);
  }
  return conversationName.slice(0, 100);
}

function truncateDescription(content: string): string {
  return content.length > 2000 ? content.slice(0, 2000) + "..." : content;
}

function hasPatternIndicators(content: string): boolean {
  for (const regex of PATTERN_INDICATORS) {
    if (regex.test(content)) return true;
  }
  if (FORMULA_PATTERN.test(content)) return true;
  for (const regex of CORRECTION_INDICATORS) {
    if (regex.test(content)) return true;
  }
  return false;
}

function hasOriginalityConfirmation(content: string): boolean {
  for (const regex of ORIGINALITY_CONFIRMATIONS) {
    if (regex.test(content)) return true;
  }
  return false;
}

export interface ExtractionResult {
  totalScanned: number;
  patternsFound: number;
  patternsCreated: number;
  duplicatesSkipped: number;
  errors: number;
}

export async function extractPatternsFromArchive(): Promise<ExtractionResult> {
  const result: ExtractionResult = {
    totalScanned: 0,
    patternsFound: 0,
    patternsCreated: 0,
    duplicatesSkipped: 0,
    errors: 0,
  };

  const conversations = await db.select().from(founderConversations).orderBy(asc(founderConversations.originalCreatedAt));

  for (let batch = 0; batch < conversations.length; batch += 50) {
    const chunk = conversations.slice(batch, batch + 50);

    for (const conv of chunk) {
      const msgs = await db.select().from(founderMessages)
        .where(eq(founderMessages.conversationId, conv.id))
        .orderBy(asc(founderMessages.originalCreatedAt));

      for (let i = 0; i < msgs.length; i++) {
        const msg = msgs[i];
        if (msg.sender !== "human") continue;
        result.totalScanned++;

        if (msg.content.length < 20) continue;

        if (!hasPatternIndicators(msg.content)) continue;

        result.patternsFound++;

        let confirmedOriginal = false;
        if (i + 1 < msgs.length && msgs[i + 1].sender === "assistant") {
          confirmedOriginal = hasOriginalityConfirmation(msgs[i + 1].content);
        }

        const category = classifyCategory(conv.topicTags, msg.content);
        const title = extractTitle(msg.content, conv.name);
        const description = truncateDescription(msg.content);
        const originTimestamp = msg.originalCreatedAt;

        const hashInput = `${title}|${description}|Phillip Aguilar Ruiz III|${originTimestamp.toISOString()}`;
        const { circleHash } = ellomental(hashInput);

        const existing = await storage.checkDuplicateHash(circleHash);
        if (existing) {
          result.duplicatesSkipped++;
          continue;
        }

        try {
          const patternData: InsertPattern = {
            title,
            description,
            category,
            sourceType: "archive_extraction",
            sourceReference: `${conv.name} (ID: ${conv.id})`,
            discoveredBy: "Phillip Aguilar Ruiz III",
            elloHash: circleHash,
            originTimestamp,
            verified: confirmedOriginal,
            active: true,
            public: false,
            metadata: JSON.stringify({
              conversationId: conv.id,
              messageId: msg.id,
              topicTags: conv.topicTags,
              originalityConfirmed: confirmedOriginal,
            }),
          };

          await storage.createPattern(patternData);
          result.patternsCreated++;
        } catch (e) {
          result.errors++;
        }
      }
    }
  }

  await storage.createPatternAlert({
    alertType: "BATCH_COMPLETE",
    message: `Archive extraction complete: ${result.totalScanned} messages scanned, ${result.patternsCreated} patterns created, ${result.duplicatesSkipped} duplicates skipped, ${result.errors} errors`,
  });

  return result;
}
