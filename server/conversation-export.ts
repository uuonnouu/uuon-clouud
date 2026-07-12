import { storage } from "./storage";
import * as fs from "fs";
import * as path from "path";

/**
 * Conversation Export/Import Engine
 * Exports all conversations from this system for local CLOUUD
 */

export interface ConversationExport {
  id: number;
  title: string;
  createdAt: string;
  messages: Array<{
    id: number;
    role: "user" | "assistant";
    content: string;
    createdAt: string;
  }>;
  metadata: {
    messageCount: number;
    tokens: number;
  };
}

export async function exportAllConversations(): Promise<ConversationExport[]> {
  try {
    const conversations = await storage.getAllConversations();
    const exports: ConversationExport[] = [];

    for (const conv of conversations) {
      const messages = await storage.getMessagesByConversation(conv.id);
      const tokenCount = await storage.getUuonTokensByConversation(conv.id);

      const exported: ConversationExport = {
        id: conv.id,
        title: conv.title,
        createdAt: conv.createdAt.toISOString(),
        messages: messages.map((m) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content: m.content,
          createdAt: m.createdAt.toISOString(),
        })),
        metadata: {
          messageCount: messages.length,
          tokens: tokenCount.length,
        },
      };

      exports.push(exported);
    }

    return exports;
  } catch (error) {
    console.error("[EXPORT] Failed to export conversations:", error);
    throw error;
  }
}

export async function exportConversationsToFile(
  outputPath: string = "./conversations-export.json"
): Promise<{ count: number; filePath: string; size: number }> {
  try {
    const exports = await exportAllConversations();
    const json = JSON.stringify(exports, null, 2);

    fs.writeFileSync(outputPath, json);
    const stats = fs.statSync(outputPath);

    console.log(`[EXPORT] Exported ${exports.length} conversations to ${outputPath}`);
    return {
      count: exports.length,
      filePath: path.resolve(outputPath),
      size: stats.size,
    };
  } catch (error) {
    console.error("[EXPORT] Failed to write export file:", error);
    throw error;
  }
}

export async function generateOllamaContextFile(
  outputPath: string = "./ollama-knowledge-base.txt"
): Promise<{ size: number; path: string }> {
  try {
    const exports = await exportAllConversations();
    let contextText = `# CLOUUD Knowledge Base — Exported ${new Date().toISOString()}
# Complete Conversation History for Ollama Integration

## Overview
- Total Conversations: ${exports.length}
- Export Date: ${new Date().toISOString()}
- Source: CLOUUD Terminal System

---

`;

    for (const conv of exports) {
      contextText += `
## Conversation: ${conv.title}
**Created**: ${conv.createdAt}
**Messages**: ${conv.metadata.messageCount}

`;

      for (const msg of conv.messages) {
        const role = msg.role.toUpperCase();
        contextText += `**${role}** [${msg.createdAt}]:
${msg.content}

`;
      }

      contextText += "\n---\n";
    }

    fs.writeFileSync(outputPath, contextText);
    const stats = fs.statSync(outputPath);

    console.log(`[OLLAMA] Generated knowledge base: ${outputPath} (${stats.size} bytes)`);
    return { size: stats.size, path: path.resolve(outputPath) };
  } catch (error) {
    console.error("[OLLAMA] Failed to generate context file:", error);
    throw error;
  }
}
