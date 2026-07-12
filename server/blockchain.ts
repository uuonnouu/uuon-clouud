import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

interface BlockchainTransaction {
  id: string;
  timestamp: Date;
  type: "purchase" | "transfer" | "stake" | "unstake";
  asset: string;
  amount: string;
  source: string;
  destination: string;
  txHash: string;
  status: "pending" | "confirmed" | "failed";
  confirmations: number;
  notes: string;
}

const transactionLog: BlockchainTransaction[] = [];

/**
 * Log a blockchain transaction
 * POST /api/blockchain/transaction
 */
router.post("/transaction", (req: Request, res: Response) => {
  try {
    const {
      type,
      asset,
      amount,
      source,
      destination,
      txHash,
      notes,
    } = req.body;

    if (!type || !asset || !amount || !txHash) {
      return res
        .status(400)
        .json({ error: "type, asset, amount, and txHash are required" });
    }

    const transaction: BlockchainTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      timestamp: new Date(),
      type,
      asset,
      amount,
      source: source || "unknown",
      destination: destination || "unknown",
      txHash,
      status: "pending",
      confirmations: 0,
      notes: notes || "",
    };

    transactionLog.push(transaction);

    res.json({
      success: true,
      transaction,
      message: `Transaction logged: ${asset} ${amount} from ${source} → ${destination}`,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get all blockchain transactions
 * GET /api/blockchain/transactions
 */
router.get("/transactions", (req: Request, res: Response) => {
  const asset = req.query.asset as string | undefined;
  const filtered = asset
    ? transactionLog.filter((t) => t.asset.toUpperCase() === asset.toUpperCase())
    : transactionLog;

  res.json({
    count: filtered.length,
    transactions: filtered.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    ),
  });
});

/**
 * Update transaction status
 * PATCH /api/blockchain/transaction/:id
 */
router.patch("/transaction/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, confirmations } = req.body;

  const tx = transactionLog.find((t) => t.id === id);
  if (!tx) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  if (status) tx.status = status;
  if (confirmations !== undefined) tx.confirmations = confirmations;

  res.json({ success: true, transaction: tx });
});

/**
 * Get Blockdaemon validator status
 * GET /api/blockchain/validator/status
 */
router.get("/validator/status", async (req: Request, res: Response) => {
  try {
    const apiKey = process.env.BLOCKDAEMON_API_KEY;
    const baseUrl = process.env.BLOCKDAEMON_BASE_URL;
    const network = process.env.BLOCKDAEMON_NETWORK;
    const validatorAddr = process.env.BLOCKDAEMON_VALIDATOR_ADDRESS;

    if (!apiKey || !validatorAddr) {
      return res.status(400).json({
        error: "Blockdaemon credentials not configured",
        configured: {
          apiKey: !!apiKey,
          validatorAddress: !!validatorAddr,
        },
      });
    }

    // In production, call Blockdaemon API
    // const response = await fetch(`${baseUrl}/v1/${network}/validators/${validatorAddr}`, {
    //   headers: { Authorization: `Bearer ${apiKey}` },
    // });
    // const data = await response.json();

    // For now, return placeholder
    res.json({
      network,
      validator: validatorAddr,
      status: "not_yet_queried",
      message: "Configure BLOCKDAEMON_API_KEY to connect",
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Test Blockdaemon connection
 * POST /api/blockchain/test-connection
 */
router.post("/test-connection", async (req: Request, res: Response) => {
  try {
    const apiKey = process.env.BLOCKDAEMON_API_KEY;
    const baseUrl = process.env.BLOCKDAEMON_BASE_URL;

    if (!apiKey) {
      return res
        .status(400)
        .json({
          error: "BLOCKDAEMON_API_KEY not set in environment",
        });
    }

    // Test connection to Blockdaemon
    const response = await fetch(`${baseUrl}/health`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }).catch((err) => ({ ok: false, error: err.message }));

    if ("error" in response) {
      return res.json({
        success: false,
        error: response.error,
        status: "connection_failed",
      });
    }

    res.json({
      success: response.ok,
      status: response.ok ? "connected" : "disconnected",
      statusCode: response.status,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
