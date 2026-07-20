import { Router } from "express";
// @ts-ignore - salvaged JS module
import { buyCredits, getBalance } from "../modules/billing/server/handlers.js";

export const billingRouter = Router();

// Buy credits: requires verified PIEZ/PSENT transfer on Base
billingRouter.post("/buy", buyCredits);
billingRouter.get("/balance/:user_id", getBalance);
