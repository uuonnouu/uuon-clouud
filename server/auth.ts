import { randomBytes, createHash } from "crypto";
import bcrypt from "bcryptjs";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import type { Request, Response } from "express";
import { db } from "./db";
import { webauthnCredentials, ownerPassphrase, authSessions, accessLog, fingerprints } from "@shared/schema";
import { eq, and, gt } from "drizzle-orm";
import { storage } from "./storage";

const RP_NAME = "UUON Clouud";
const RP_ID_FALLBACK = "localhost";
const ORIGIN_FALLBACK = "http://localhost:5000";
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;
const BCRYPT_ROUNDS = 12;

function getRpId(req: Request): string {
  const host = req.hostname;
  return host || RP_ID_FALLBACK;
}

function getOrigin(req: Request): string {
  const proto = req.headers["x-forwarded-proto"] || req.protocol || "http";
  const host = req.headers.host || `${RP_ID_FALLBACK}:5000`;
  return `${proto}://${host}`;
}

const challenges = new Map<string, { challenge: string; expires: number }>();

function challengeKey(prefix: string, req: Request): string {
  const sessionToken = req.headers["x-session-token"] as string || req.ip || "anon";
  return `${prefix}:${sessionToken}`;
}

function storeChallenge(key: string, challenge: string) {
  challenges.set(key, { challenge, expires: Date.now() + 300000 });
  for (const [k, v] of challenges) {
    if (v.expires < Date.now()) challenges.delete(k);
  }
}

function getChallenge(key: string): string | null {
  const entry = challenges.get(key);
  if (!entry || entry.expires < Date.now()) {
    challenges.delete(key);
    return null;
  }
  challenges.delete(key);
  return entry.challenge;
}

function generateSessionToken(): string {
  return randomBytes(48).toString("hex");
}

export async function isSetupComplete(): Promise<{ webauthn: boolean; passphrase: boolean; fingerprint: boolean }> {
  const [creds] = await db.select().from(webauthnCredentials).limit(1);
  const [pass] = await db.select().from(ownerPassphrase).limit(1);
  const ownerFp = await storage.getOwnerFingerprint();
  return {
    webauthn: !!creds,
    passphrase: !!pass,
    fingerprint: !!ownerFp,
  };
}

export async function getValidSession(token: string): Promise<any | null> {
  if (!token) return null;
  const [session] = await db.select().from(authSessions)
    .where(and(eq(authSessions.token, token), gt(authSessions.expiresAt, new Date())));
  return session || null;
}

export function registerAuthRoutes(app: any) {
  app.get("/api/auth/setup-status", async (req: Request, res: Response) => {
    try {
      const setup = await isSetupComplete();
      const ownerFp = await storage.getOwnerFingerprint();
      res.json({
        setupComplete: setup.webauthn && setup.passphrase && setup.fingerprint,
        layers: setup,
        ownerRegistered: !!ownerFp,
        system: "UUON-CLOUUD-3LAYER",
      });
    } catch (error) {
      res.status(500).json({ error: "Setup status check failed" });
    }
  });

  app.post("/api/auth/webauthn/register-options", async (req: Request, res: Response) => {
    try {
      const rpId = getRpId(req);
      const existingCreds = await db.select().from(webauthnCredentials);
      const options = await generateRegistrationOptions({
        rpName: RP_NAME,
        rpID: rpId,
        userName: "founder",
        userDisplayName: "Philip Aguilar Ruiz III",
        attestationType: "none",
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
          residentKey: "preferred",
        },
        excludeCredentials: existingCreds.map(c => ({
          id: c.credentialId,
          transports: c.transports ? JSON.parse(c.transports) : undefined,
        })),
      });

      storeChallenge(challengeKey("webauthn-register", req), options.challenge);
      res.json(options);
    } catch (error: any) {
      console.error("WebAuthn register options error:", error);
      res.status(500).json({ error: "Failed to generate registration options" });
    }
  });

  app.post("/api/auth/webauthn/register-verify", async (req: Request, res: Response) => {
    try {
      const expectedChallenge = getChallenge(challengeKey("webauthn-register", req));
      if (!expectedChallenge) {
        return res.status(400).json({ error: "Challenge expired or not found" });
      }

      const rpId = getRpId(req);
      const origin = getOrigin(req);

      const verification = await verifyRegistrationResponse({
        response: req.body,
        expectedChallenge,
        expectedOrigin: origin,
        expectedRPID: rpId,
      });

      if (!verification.verified || !verification.registrationInfo) {
        await storage.logAccess("WEBAUTHN", "REGISTER_FAIL", false, req.ip, req.headers["user-agent"]);
        return res.status(400).json({ error: "Verification failed" });
      }

      const { credential } = verification.registrationInfo;
      await db.insert(webauthnCredentials).values({
        credentialId: credential.id,
        publicKey: Buffer.from(credential.publicKey).toString("base64"),
        counter: credential.counter,
        transports: req.body.response?.transports ? JSON.stringify(req.body.response.transports) : null,
      });

      await storage.logAccess("WEBAUTHN", "REGISTER_SUCCESS", true, req.ip, req.headers["user-agent"]);
      res.json({ verified: true });
    } catch (error: any) {
      console.error("WebAuthn register verify error:", error);
      res.status(500).json({ error: "Registration verification failed" });
    }
  });

  app.post("/api/auth/webauthn/auth-options", async (req: Request, res: Response) => {
    try {
      const rpId = getRpId(req);
      const creds = await db.select().from(webauthnCredentials);

      if (creds.length === 0) {
        return res.status(400).json({ error: "No credentials registered" });
      }

      const options = await generateAuthenticationOptions({
        rpID: rpId,
        allowCredentials: creds.map(c => ({
          id: c.credentialId,
          transports: c.transports ? JSON.parse(c.transports) : undefined,
        })),
        userVerification: "required",
      });

      storeChallenge(challengeKey("webauthn-auth", req), options.challenge);
      res.json(options);
    } catch (error: any) {
      console.error("WebAuthn auth options error:", error);
      res.status(500).json({ error: "Failed to generate auth options" });
    }
  });

  app.post("/api/auth/webauthn/auth-verify", async (req: Request, res: Response) => {
    try {
      const expectedChallenge = getChallenge(challengeKey("webauthn-auth", req));
      if (!expectedChallenge) {
        return res.status(400).json({ error: "Challenge expired" });
      }

      const rpId = getRpId(req);
      const origin = getOrigin(req);

      const [cred] = await db.select().from(webauthnCredentials)
        .where(eq(webauthnCredentials.credentialId, req.body.id));

      if (!cred) {
        await storage.logAccess("WEBAUTHN", "AUTH_UNKNOWN_CRED", false, req.ip, req.headers["user-agent"]);
        return res.status(400).json({ error: "Unknown credential" });
      }

      const verification = await verifyAuthenticationResponse({
        response: req.body,
        expectedChallenge,
        expectedOrigin: origin,
        expectedRPID: rpId,
        credential: {
          id: cred.credentialId,
          publicKey: new Uint8Array(Buffer.from(cred.publicKey, "base64")),
          counter: cred.counter,
          transports: cred.transports ? JSON.parse(cred.transports) : undefined,
        },
      });

      if (!verification.verified) {
        await storage.logAccess("WEBAUTHN", "AUTH_FAIL", false, req.ip, req.headers["user-agent"]);
        return res.status(400).json({ error: "Authentication failed" });
      }

      await db.update(webauthnCredentials)
        .set({ counter: verification.authenticationInfo.newCounter })
        .where(eq(webauthnCredentials.id, cred.id));

      const sessionToken = req.headers["x-session-token"] as string;
      if (sessionToken) {
        await db.update(authSessions)
          .set({ webauthnVerified: true, layersCompleted: 1 })
          .where(eq(authSessions.token, sessionToken));
      }

      await storage.logAccess("WEBAUTHN", "AUTH_SUCCESS", true, req.ip, req.headers["user-agent"]);
      res.json({ verified: true });
    } catch (error: any) {
      console.error("WebAuthn auth verify error:", error);
      res.status(500).json({ error: "Authentication verification failed" });
    }
  });

  app.post("/api/auth/passphrase/set", async (req: Request, res: Response) => {
    try {
      const { passphrase } = req.body;
      if (!passphrase || typeof passphrase !== "string" || passphrase.length < 8) {
        return res.status(400).json({ error: "Passphrase must be at least 8 characters" });
      }

      const existing = await db.select().from(ownerPassphrase).limit(1);
      if (existing.length > 0) {
        return res.status(400).json({ error: "Passphrase already set. Use change endpoint." });
      }

      const hash = await bcrypt.hash(passphrase, BCRYPT_ROUNDS);
      await db.insert(ownerPassphrase).values({ hash });
      await storage.logAccess("PASSPHRASE", "SET_SUCCESS", true, req.ip, req.headers["user-agent"]);
      res.json({ set: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to set passphrase" });
    }
  });

  app.post("/api/auth/passphrase/verify", async (req: Request, res: Response) => {
    try {
      const { passphrase } = req.body;
      if (!passphrase || typeof passphrase !== "string") {
        return res.status(400).json({ error: "Passphrase required" });
      }

      const [stored] = await db.select().from(ownerPassphrase).limit(1);
      if (!stored) {
        return res.status(400).json({ error: "No passphrase set" });
      }

      const valid = await bcrypt.compare(passphrase, stored.hash);
      if (!valid) {
        await storage.logAccess("PASSPHRASE", "VERIFY_FAIL", false, req.ip, req.headers["user-agent"]);
        return res.status(403).json({ error: "Invalid passphrase", verified: false });
      }

      const sessionToken = req.headers["x-session-token"] as string;
      if (sessionToken) {
        const [session] = await db.select().from(authSessions).where(eq(authSessions.token, sessionToken));
        if (session) {
          await db.update(authSessions)
            .set({ passphraseVerified: true, layersCompleted: (session.webauthnVerified ? 1 : 0) + 1 + (session.fingerprintVerified ? 1 : 0) })
            .where(eq(authSessions.token, sessionToken));
        }
      }

      await storage.logAccess("PASSPHRASE", "VERIFY_SUCCESS", true, req.ip, req.headers["user-agent"]);
      res.json({ verified: true });
    } catch (error) {
      res.status(500).json({ error: "Passphrase verification failed" });
    }
  });

  app.post("/api/auth/session/create", async (req: Request, res: Response) => {
    try {
      const { fingerprintHash, webauthnSkipped } = req.body;
      if (!fingerprintHash) {
        return res.status(400).json({ error: "Fingerprint hash required" });
      }

      const token = generateSessionToken();
      const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

      await db.insert(authSessions).values({
        token,
        fingerprintHash,
        layersCompleted: 0,
        webauthnSkipped: !!webauthnSkipped,
        expiresAt,
      });

      res.json({ token, expiresAt: expiresAt.toISOString() });
    } catch (error) {
      res.status(500).json({ error: "Session creation failed" });
    }
  });

  app.post("/api/auth/session/verify-fingerprint", async (req: Request, res: Response) => {
    try {
      const sessionToken = req.headers["x-session-token"] as string;
      const { currentFingerprintHash } = req.body;

      if (!sessionToken || !currentFingerprintHash) {
        return res.status(400).json({ error: "Session token and fingerprint required" });
      }

      const [session] = await db.select().from(authSessions)
        .where(and(eq(authSessions.token, sessionToken), gt(authSessions.expiresAt, new Date())));

      if (!session) {
        return res.status(403).json({ error: "Invalid or expired session" });
      }

      if (session.fingerprintHash !== currentFingerprintHash) {
        await db.update(authSessions)
          .set({ fingerprintVerified: false, layersCompleted: 0 })
          .where(eq(authSessions.token, sessionToken));
        await storage.logAccess(currentFingerprintHash, "FINGERPRINT_MISMATCH", false, req.ip, req.headers["user-agent"]);
        return res.status(403).json({ error: "Device signature changed. Session locked.", locked: true });
      }

      const webauthnDone = session.webauthnVerified || session.webauthnSkipped;
      await db.update(authSessions)
        .set({
          fingerprintVerified: true,
          layersCompleted: (webauthnDone ? 1 : 0) + (session.passphraseVerified ? 1 : 0) + 1,
        })
        .where(eq(authSessions.token, sessionToken));

      res.json({ verified: true, match: true });
    } catch (error) {
      res.status(500).json({ error: "Fingerprint verification failed" });
    }
  });

  app.get("/api/auth/session/status", async (req: Request, res: Response) => {
    try {
      const sessionToken = req.headers["x-session-token"] as string;
      if (!sessionToken) {
        return res.json({ authenticated: false, layers: { webauthn: false, passphrase: false, fingerprint: false } });
      }

      const session = await getValidSession(sessionToken);
      if (!session) {
        return res.json({ authenticated: false, layers: { webauthn: false, passphrase: false, fingerprint: false } });
      }

      const webauthnOk = session.webauthnVerified || session.webauthnSkipped;
      const allVerified = webauthnOk && session.passphraseVerified && session.fingerprintVerified;
      res.json({
        authenticated: allVerified,
        layers: {
          webauthn: session.webauthnVerified,
          webauthnSkipped: session.webauthnSkipped,
          passphrase: session.passphraseVerified,
          fingerprint: session.fingerprintVerified,
        },
        expiresAt: session.expiresAt,
      });
    } catch (error) {
      res.status(500).json({ error: "Session status check failed" });
    }
  });
}
