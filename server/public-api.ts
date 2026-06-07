import type { Express, Request, Response } from "express";
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

  app.post("/v1/reason", async (req: Request, res: Response) => {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({
        error: "input required"
      });
    }

    const hash = generateProvenanceHash(input);

    return res.json({
      object: "clouud.reason",
      engine: "UUON Clouud",
      version: "3.333",
      response: {
        message: "Request accepted by Clouud reasoning interface"
      },
      provenance: {
        hash
      }
    });
  });

}
