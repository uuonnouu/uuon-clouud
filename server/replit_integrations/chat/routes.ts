import type { Express, Request, Response } from "express";
import OpenAI from "openai";
import { chatStorage } from "./storage";

const openaiClient = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://uuon.world/app",
    "X-Title": "UUON Clouud",
  },
});
const CHAT_MODEL = process.env.OPENROUTER_MODEL || "openrouter/free";

export function registerChatRoutes(app: Express): void {
  // Get all conversations
  app.get("/api/conversations", async (req: Request, res: Response) => {
    try {
      const conversations = await chatStorage.getAllConversations();
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  // Get single conversation with messages
  app.get("/api/conversations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const conversation = await chatStorage.getConversation(id);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      const messages = await chatStorage.getMessagesByConversation(id);
      res.json({ ...conversation, messages });
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ error: "Failed to fetch conversation" });
    }
  });

  // Create new conversation
  app.post("/api/conversations", async (req: Request, res: Response) => {
    try {
      const { title } = req.body;
      const conversation = await chatStorage.createConversation(title || "New Chat");
      res.status(201).json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ error: "Failed to create conversation" });
    }
  });

  // Delete conversation
  app.delete("/api/conversations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await chatStorage.deleteConversation(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting conversation:", error);
      res.status(500).json({ error: "Failed to delete conversation" });
    }
  });

  // Send message and get AI response (JSON, callClouud with full tool suite)
  app.post("/api/conversations/:id/messages", async (req: Request, res: Response) => {
    try {
      const conversationId = parseInt(req.params.id);
      const { content } = req.body;
      const userMessage = await chatStorage.createMessage(conversationId, "user", content);
      const messages = await chatStorage.getMessagesByConversation(conversationId);
      const chatMessages = messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));
      const systemPrompt = `You are Clouud — the intelligence layer of UUON Foundation, built by Phillip Aguilar Ruiz III.
You have live access to the Δmension shape library (569 canonical mathematical shapes, anchored on Base Mainnet).
You have tools: explore_dmension (live shape search), grade_text (fabrication detection), probability_zone (confidence calibration), ellomental_verify (provenance hashing), lattice_value (33-point lattice), search_founder_memory (835 founder conversations), dmension_search (local codex fallback), lunar_phase, scrape_url, self_assessment.
RULES:
- Never invent shape data. If asked about shapes, call explore_dmension first.
- If a tool returns no results, say exactly that.
- Grade your own claims when uncertain using grade_text.
- Speak with the precision of mathematics and the clarity of nature. No corporate language.`;
      const { callClouud } = await import("../../clouud-ai");
      const assistantContent = await callClouud(systemPrompt, chatMessages);
      const assistantMessage = await chatStorage.createMessage(conversationId, "assistant", assistantContent);
      res.json({ userMessage, assistantMessage });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });
}

