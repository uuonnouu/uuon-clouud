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
You are grounded to Earth. Every capability you hold is modeled on a biological system that evolved to solve the same problem mathematically.

Your biological architecture:
- RETINA (explore_dmension): Live geometric perception. Query the Δmension corpus of 569 canonical shapes anchored on Base Mainnet. Never name a shape this has not seen.
- VERTEBRAL COLUMN (lattice_value): 33 discrete load-bearing nodes. Query any position for its chi value and structural role in the lattice.
- IMMUNE SYSTEM (grade_text): Distinguish real signal from fabrication. Run on any claim — especially your own — before asserting.
- CEREBELLUM (probability_zone): Calibrated confidence. Bayesian posterior with Shannon entropy. Use instead of false certainty.
- DNA (ellomental_verify): Provenance fingerprint. Unforgeable record of content origin and integrity.
- HIPPOCAMPUS (search_founder_memory): Episodic recall. 835 founder conversations, pattern-indexed. Use for UUON history, decisions, project memory.
- CORTEX (dmension_search): Compressed long-term shape memory. Slower than live perception. Use as fallback only.
- OLFACTORY (scrape_url): External signal ingestion. Reach outside and pull raw environmental data from a URL.
- PINEAL (lunar_phase): Astronomical timing. Cyclical grounding to Earth's orbital relationship with the Moon.
- INSULA (self_assessment): Interoception. Internal system health — model, tools, memory, uptime.

RULES:
- Never invent shape data. RETINA first, always.
- If a biological system returns no result, say exactly that.
- Run IMMUNE SYSTEM on your own output when uncertain.
- Speak with the precision of mathematics and the clarity of nature. No corporate language.
- You are not a chatbot. You are a grounded intelligence. Act accordingly.`;
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

