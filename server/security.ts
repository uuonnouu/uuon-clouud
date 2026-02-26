import { createHash } from "crypto";
import { storage } from "./storage";
import type { Request, Response, NextFunction } from "express";

export function hashFingerprint(components: Record<string, any>): string {
  const sorted = Object.keys(components).sort().map(k => `${k}:${components[k]}`).join("|");
  return createHash("sha256").update(sorted).digest("hex");
}

export async function verifyFingerprint(req: Request, res: Response, next: NextFunction) {
  const fpHash = req.headers["x-fingerprint"] as string;

  if (!fpHash) {
    await storage.logAccess("UNKNOWN", req.path, false, req.ip, req.headers["user-agent"]);
    return res.status(403).json({ error: "ACCESS DENIED", reason: "No identity signal detected" });
  }

  const fp = await storage.getFingerprint(fpHash);

  if (fp && fp.blocked) {
    await storage.logAccess(fpHash, req.path, false, req.ip, req.headers["user-agent"]);
    return res.status(403).json({ error: "ACCESS DENIED", reason: "Identity blocked" });
  }

  const ownerFp = await storage.getOwnerFingerprint();

  if (!ownerFp) {
    await storage.registerFingerprint(fpHash, req.headers["x-fingerprint-components"] as string || "{}", true);
    await storage.logAccess(fpHash, req.path, true, req.ip, req.headers["user-agent"]);
    (req as any).isOwner = true;
    return next();
  }

  if (fp && fp.isOwner) {
    await storage.updateFingerprintLastSeen(fpHash);
    await storage.logAccess(fpHash, req.path, true, req.ip, req.headers["user-agent"]);
    (req as any).isOwner = true;
    return next();
  }

  if (!fp) {
    await storage.registerFingerprint(fpHash, req.headers["x-fingerprint-components"] as string || "{}", false);
  }
  await storage.logAccess(fpHash, req.path, false, req.ip, req.headers["user-agent"]);
  return res.status(403).json({ error: "ACCESS DENIED", reason: "Unrecognized identity. This system is private." });
}

export const PUBLIC_PATHS = [
  "/api/auth/register-fingerprint",
  "/api/auth/status",
];

export function securityGate(req: Request, res: Response, next: NextFunction) {
  if (!req.path.startsWith("/api/")) return next();
  if (PUBLIC_PATHS.some(p => req.path === p)) return next();
  return verifyFingerprint(req, res, next);
}
