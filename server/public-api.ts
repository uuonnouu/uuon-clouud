import type { Express, Request, Response } from "express";
import { requireApiKey } from "./api-auth";
import { storage } from "./storage";
import { generateProvenanceHash } from "./ellomental-hash";

export function registerPublicAPI(app: Express) {

  app.get("/v1/status", (_req: Request, res: Response) => {
    res.json({
      engine: "UUON Clouud",
      version: "3.333",
      status: "online",
      capabilities: [
        "reasoning",
        "provenance",
        "assessment",
        "mathematical intelligence"
      ]
    });
  });


  app.post("/v1/reason", requireApiKey, async (req: Request, res: Response) => {
    try {

      const { input } = req.body;

      if (!input) {
        return res.status(400).json({
          error: "input required"
        });
      }

      const conversation = await storage.createConversation(
        "API Reasoning Session"
      );

      const userMessage = await storage.createMessage({
        conversationId: conversation.id,
        role: "user",
        content: input
      });

      const hash = generateProvenanceHash(input);

      return res.json({
        object: "clouud.reason",
        engine: "UUON Clouud",
        version: "3.333",

        input: userMessage.content,

        provenance: {
          hash
        },

        status: "accepted"
      });

    } catch(error:any) {

      res.status(500).json({
        error:error.message
      });

    }
  });

}
