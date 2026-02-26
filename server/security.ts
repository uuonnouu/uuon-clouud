import { createHash } from "crypto";
import { storage } from "./storage";
import { getValidSession } from "./auth";
import type { Request, Response, NextFunction } from "express";

export function hashFingerprint(components: Record<string, any>): string {
  const sorted = Object.keys(components).sort().map(k => `${k}:${components[k]}`).join("|");
  return createHash("sha256").update(sorted).digest("hex");
}

export const PUBLIC_PATHS = [
  "/api/auth/register-fingerprint",
  "/api/auth/status",
  "/api/auth/setup-status",
  "/api/auth/webauthn/register-options",
  "/api/auth/webauthn/register-verify",
  "/api/auth/webauthn/auth-options",
  "/api/auth/webauthn/auth-verify",
  "/api/auth/passphrase/set",
  "/api/auth/passphrase/verify",
  "/api/auth/session/create",
  "/api/auth/session/verify-fingerprint",
  "/api/auth/session/status",
];

export function securityGate(req: Request, res: Response, next: NextFunction) {
  if (!req.path.startsWith("/api/")) return next();
  if (PUBLIC_PATHS.some(p => req.path === p)) return next();
  return enforceFullAuth(req, res, next);
}

async function enforceFullAuth(req: Request, res: Response, next: NextFunction) {
  const fpHash = req.headers["x-fingerprint"] as string;
  const sessionToken = req.headers["x-session-token"] as string;

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

  if (!(fp && fp.isOwner)) {
    if (!fp) {
      await storage.registerFingerprint(fpHash, req.headers["x-fingerprint-components"] as string || "{}", false);
    }
    await storage.logAccess(fpHash, req.path, false, req.ip, req.headers["user-agent"]);
    return res.status(403).json({ error: "ACCESS DENIED", reason: "Unrecognized identity. This system is private." });
  }

  if (sessionToken) {
    const session = await getValidSession(sessionToken);
    if (session) {
      const webauthnOk = session.webauthnVerified || session.webauthnSkipped;
      if (webauthnOk && session.passphraseVerified && session.fingerprintVerified) {
        await storage.updateFingerprintLastSeen(fpHash);
        await storage.logAccess(fpHash, req.path, true, req.ip, req.headers["user-agent"]);
        (req as any).isOwner = true;
        return next();
      }
    }
  }

  return res.status(401).json({ error: "AUTH_REQUIRED", reason: "Complete 3-layer authentication required" });
}
