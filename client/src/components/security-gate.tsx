import { useState, useEffect, useRef } from "react";
import { Shield, ShieldAlert, Fingerprint, Loader2, Lock, KeyRound, Scan, CheckCircle2, AlertTriangle } from "lucide-react";
import { generateFingerprint, getStoredFingerprint } from "../lib/fingerprint";
import { startRegistration, startAuthentication, browserSupportsWebAuthn } from "@simplewebauthn/browser";

interface SecurityGateProps {
  children: React.ReactNode;
}

type AuthPhase = "loading" | "setup" | "layer1" | "layer2" | "layer3" | "verified" | "denied" | "locked";

interface SetupStatus {
  setupComplete: boolean;
  layers: { webauthn: boolean; passphrase: boolean; fingerprint: boolean };
  ownerRegistered: boolean;
}

export function SecurityGate({ children }: SecurityGateProps) {
  const [phase, setPhase] = useState<AuthPhase>("loading");
  const [message, setMessage] = useState("");
  const [setupStatus, setSetupStatus] = useState<SetupStatus | null>(null);
  const [passphrase, setPassphrase] = useState("");
  const [passphraseError, setPassphraseError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [layerStatus, setLayerStatus] = useState({ webauthn: false, passphrase: false, fingerprint: false });
  const [webauthnAvailable, setWebauthnAvailable] = useState(true);
  const [webauthnSkipped, setWebauthnSkipped] = useState(false);
  const integrityInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const available = browserSupportsWebAuthn();
    setWebauthnAvailable(available);
    checkAuth(available);
    return () => {
      if (integrityInterval.current) clearInterval(integrityInterval.current);
    };
  }, []);

  async function checkAuth(webauthnSupported: boolean) {
    try {
      const existingToken = sessionStorage.getItem("uuon-session-token");
      if (existingToken) {
        const statusRes = await fetch("/api/auth/session/status", {
          headers: { "x-session-token": existingToken },
        });
        const status = await statusRes.json();
        if (status.authenticated) {
          setLayerStatus(status.layers);
          setWebauthnSkipped(status.layers.webauthnSkipped || false);
          setPhase("verified");
          startIntegrityMonitor();
          return;
        }
      }

      const setupRes = await fetch("/api/auth/setup-status");
      const setup: SetupStatus = await setupRes.json();
      setSetupStatus(setup);

      if (!setup.ownerRegistered) {
        await registerOwner();
        const updatedRes = await fetch("/api/auth/setup-status");
        const updated: SetupStatus = await updatedRes.json();
        setSetupStatus(updated);
        if (!updated.layers.passphrase) {
          setPhase("setup");
          return;
        }
      }

      if (!setup.layers.passphrase) {
        setPhase("setup");
        return;
      }

      const skipWebauthn = !webauthnSupported || !setup.layers.webauthn;
      setWebauthnSkipped(skipWebauthn);
      await createSession(skipWebauthn);

      if (!skipWebauthn && setup.layers.webauthn) {
        setPhase("layer1");
      } else {
        setPhase("layer2");
      }
    } catch (err) {
      console.error("Auth check error:", err);
      setMessage("Authentication system error");
      setPhase("denied");
    }
  }

  async function registerOwner() {
    try {
      const result = await generateFingerprint();
      if (result.hash) {
        sessionStorage.setItem("uuon-fingerprint", result.hash);
      }
    } catch (err) {
      console.error("Owner registration error:", err);
    }
  }

  async function createSession(skipWebauthn: boolean) {
    const fpHash = getStoredFingerprint() || (await generateFingerprint()).hash;
    sessionStorage.setItem("uuon-fingerprint", fpHash);
    const res = await fetch("/api/auth/session/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fingerprintHash: fpHash, webauthnSkipped: skipWebauthn }),
    });
    const data = await res.json();
    if (data.token) {
      sessionStorage.setItem("uuon-session-token", data.token);
    }
  }

  async function handleSetupWebAuthn() {
    setIsProcessing(true);
    try {
      const optionsRes = await fetch("/api/auth/webauthn/register-options", { method: "POST" });
      const options = await optionsRes.json();
      const attResp = await startRegistration({ optionsJSON: options });
      const verifyRes = await fetch("/api/auth/webauthn/register-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attResp),
      });
      const verifyData = await verifyRes.json();
      if (verifyData.verified) {
        setSetupStatus(prev => prev ? { ...prev, layers: { ...prev.layers, webauthn: true } } : prev);
        setMessage("Biometric registered");
      }
    } catch (err: any) {
      setMessage(err.name === "NotAllowedError" ? "Biometric registration was cancelled" : "Biometric registration failed");
    }
    setIsProcessing(false);
  }

  async function handleSetupPassphrase() {
    if (passphrase.length < 8) {
      setPassphraseError("Minimum 8 characters");
      return;
    }
    setIsProcessing(true);
    try {
      const res = await fetch("/api/auth/passphrase/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passphrase }),
      });
      const data = await res.json();
      if (data.set) {
        setSetupStatus(prev => prev ? { ...prev, layers: { ...prev.layers, passphrase: true } } : prev);
        setPassphrase("");
        setMessage("Passphrase set");
      } else {
        setPassphraseError(data.error || "Failed");
      }
    } catch {
      setPassphraseError("Failed to set passphrase");
    }
    setIsProcessing(false);
  }

  async function handleLayer1WebAuthn() {
    setIsProcessing(true);
    try {
      const optionsRes = await fetch("/api/auth/webauthn/auth-options", { method: "POST" });
      const options = await optionsRes.json();
      const authResp = await startAuthentication({ optionsJSON: options });
      const sessionToken = sessionStorage.getItem("uuon-session-token") || "";
      const verifyRes = await fetch("/api/auth/webauthn/auth-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-session-token": sessionToken },
        body: JSON.stringify(authResp),
      });
      const data = await verifyRes.json();
      if (data.verified) {
        setLayerStatus(prev => ({ ...prev, webauthn: true }));
        setPhase("layer2");
      } else {
        setMessage("Biometric verification failed");
      }
    } catch (err: any) {
      if (err.name === "NotAllowedError") {
        setMessage("Biometric authentication was cancelled");
      } else {
        setMessage("Biometric authentication failed");
      }
    }
    setIsProcessing(false);
  }

  async function handleLayer2Passphrase() {
    if (!passphrase) {
      setPassphraseError("Enter passphrase");
      return;
    }
    setIsProcessing(true);
    setPassphraseError("");
    try {
      const sessionToken = sessionStorage.getItem("uuon-session-token") || "";
      const res = await fetch("/api/auth/passphrase/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-session-token": sessionToken },
        body: JSON.stringify({ passphrase }),
      });
      const data = await res.json();
      if (data.verified) {
        setLayerStatus(prev => ({ ...prev, passphrase: true }));
        setPassphrase("");
        setPhase("layer3");
        handleLayer3Fingerprint();
      } else {
        setPassphraseError("Invalid passphrase");
        setMessage("");
      }
    } catch {
      setPassphraseError("Verification failed");
    }
    setIsProcessing(false);
  }

  async function handleLayer3Fingerprint() {
    setIsProcessing(true);
    try {
      const fpHash = getStoredFingerprint() || (await generateFingerprint()).hash;
      const sessionToken = sessionStorage.getItem("uuon-session-token") || "";
      const res = await fetch("/api/auth/session/verify-fingerprint", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-session-token": sessionToken },
        body: JSON.stringify({ currentFingerprintHash: fpHash }),
      });
      const data = await res.json();
      if (data.locked) {
        setPhase("locked");
        setMessage("Device signature mismatch. Session locked.");
        return;
      }
      if (data.verified) {
        setLayerStatus(prev => ({ ...prev, fingerprint: true }));
        setPhase("verified");
        startIntegrityMonitor();
      }
    } catch {
      setMessage("Fingerprint verification failed");
    }
    setIsProcessing(false);
  }

  function startIntegrityMonitor() {
    if (integrityInterval.current) clearInterval(integrityInterval.current);
    integrityInterval.current = setInterval(async () => {
      try {
        const fpHash = getStoredFingerprint();
        const sessionToken = sessionStorage.getItem("uuon-session-token");
        if (!fpHash || !sessionToken) return;
        const res = await fetch("/api/auth/session/verify-fingerprint", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-session-token": sessionToken },
          body: JSON.stringify({ currentFingerprintHash: fpHash }),
        });
        const data = await res.json();
        if (data.locked) {
          setPhase("locked");
          setMessage("Device signature changed mid-session. Locked.");
          if (integrityInterval.current) clearInterval(integrityInterval.current);
        }
      } catch {}
    }, 30000);
  }

  const setupReady = setupStatus?.layers.passphrase;

  if (phase === "loading") {
    return (
      <div className="h-screen bg-background flex items-center justify-center" data-testid="security-loading">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <Shield className="w-16 h-16 text-primary animate-pulse" />
            <Loader2 className="absolute -bottom-1 -right-1 w-5 h-5 text-muted-foreground animate-spin" />
          </div>
          <div className="text-center">
            <p className="font-display text-sm tracking-widest uppercase text-primary">UUON CLOUUD</p>
            <p className="font-mono text-[10px] text-muted-foreground tracking-widest mt-2">
              Initializing security...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "locked") {
    return (
      <div className="h-screen bg-black flex items-center justify-center" data-testid="security-locked">
        <div className="flex flex-col items-center gap-6 max-w-md text-center px-6">
          <Lock className="w-24 h-24 text-red-600 animate-pulse" />
          <p className="font-mono text-[10px] text-red-500/50 mt-4">{message}</p>
        </div>
      </div>
    );
  }

  if (phase === "denied") {
    return (
      <div className="h-screen bg-background flex items-center justify-center" data-testid="security-denied">
        <div className="flex flex-col items-center gap-6 max-w-md text-center px-6">
          <ShieldAlert className="w-20 h-20 text-red-500" />
          <div>
            <p className="font-display text-lg tracking-wider uppercase text-red-500">Access Denied</p>
            <p className="font-mono text-xs text-muted-foreground mt-3 leading-relaxed">{message}</p>
          </div>
          <div className="border border-border/30 rounded-sm px-4 py-3 mt-2">
            <p className="font-mono text-[10px] text-muted-foreground">
              This is a private system operated by UUON Foundation Inc.
              <br />
              All access attempts are logged and fingerprinted.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "setup") {
    return (
      <div className="h-screen bg-background flex items-center justify-center" data-testid="security-setup">
        <div className="flex flex-col items-center gap-6 max-w-md text-center px-6">
          <Shield className="w-16 h-16 text-primary" />
          <div>
            <p className="font-display text-sm tracking-widest uppercase text-primary">INITIAL SETUP</p>
            <p className="font-mono text-[10px] text-muted-foreground tracking-widest mt-2">
              Configure authentication
            </p>
          </div>

          <div className="w-full space-y-4 mt-4">
            {webauthnAvailable && (
              <div className={`border rounded-lg p-4 text-left ${setupStatus?.layers.webauthn ? "border-green-500/50 bg-green-500/5" : "border-border/50"}`}>
                <div className="flex items-center gap-3 mb-2">
                  <Fingerprint className={`w-5 h-5 ${setupStatus?.layers.webauthn ? "text-green-500" : "text-primary"}`} />
                  <span className="font-mono text-xs uppercase tracking-wider">Biometric (Optional)</span>
                  {setupStatus?.layers.webauthn && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />}
                </div>
                {!setupStatus?.layers.webauthn && (
                  <button
                    onClick={handleSetupWebAuthn}
                    disabled={isProcessing}
                    className="w-full mt-2 bg-primary/20 hover:bg-primary/30 text-primary font-mono text-xs py-2 rounded border border-primary/30 disabled:opacity-50 transition-colors"
                    data-testid="button-setup-webauthn"
                  >
                    {isProcessing ? "Processing..." : "Register Fingerprint / Face ID"}
                  </button>
                )}
              </div>
            )}

            {!webauthnAvailable && (
              <div className="border border-yellow-500/30 rounded-lg p-4 text-left bg-yellow-500/5">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <span className="font-mono text-xs uppercase tracking-wider text-yellow-500">Biometric Not Available</span>
                </div>
                <p className="font-mono text-[9px] text-muted-foreground/60 mt-2">
                  Your device does not support fingerprint or Face ID via browser. Passphrase and device signature will secure your session.
                </p>
              </div>
            )}

            <div className={`border rounded-lg p-4 text-left ${setupStatus?.layers.passphrase ? "border-green-500/50 bg-green-500/5" : "border-border/50"}`}>
              <div className="flex items-center gap-3 mb-2">
                <KeyRound className={`w-5 h-5 ${setupStatus?.layers.passphrase ? "text-green-500" : "text-primary"}`} />
                <span className="font-mono text-xs uppercase tracking-wider">Passphrase (Required)</span>
                {setupStatus?.layers.passphrase && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />}
              </div>
              {!setupStatus?.layers.passphrase && (
                <div className="mt-2 space-y-2">
                  <input
                    type="password"
                    value={passphrase}
                    onChange={(e) => { setPassphrase(e.target.value); setPassphraseError(""); }}
                    onKeyDown={(e) => { if (e.key === "Enter" && passphrase.length >= 8) handleSetupPassphrase(); }}
                    placeholder="Set your passphrase (min 8 characters)"
                    className="w-full bg-background border border-border/50 rounded px-3 py-2 font-mono text-xs text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
                    data-testid="input-setup-passphrase"
                  />
                  {passphraseError && <p className="font-mono text-[10px] text-red-500">{passphraseError}</p>}
                  <button
                    onClick={handleSetupPassphrase}
                    disabled={isProcessing || passphrase.length < 8}
                    className="w-full bg-primary/20 hover:bg-primary/30 text-primary font-mono text-xs py-2 rounded border border-primary/30 disabled:opacity-50 transition-colors"
                    data-testid="button-setup-passphrase"
                  >
                    {isProcessing ? "Hashing..." : "Set Passphrase"}
                  </button>
                </div>
              )}
            </div>

            <div className={`border rounded-lg p-4 text-left ${setupStatus?.layers.fingerprint ? "border-green-500/50 bg-green-500/5" : "border-border/50"}`}>
              <div className="flex items-center gap-3">
                <Scan className={`w-5 h-5 ${setupStatus?.layers.fingerprint ? "text-green-500" : "text-primary"}`} />
                <span className="font-mono text-xs uppercase tracking-wider">Device Signature</span>
                {setupStatus?.layers.fingerprint && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />}
              </div>
              <p className="font-mono text-[9px] text-muted-foreground/60 mt-1">Auto-captured from your device</p>
            </div>
          </div>

          {message && <p className="font-mono text-[10px] text-green-500 mt-2">{message}</p>}

          {setupReady && (
            <button
              onClick={() => {
                const skip = !webauthnAvailable || !setupStatus?.layers.webauthn;
                setWebauthnSkipped(skip);
                createSession(skip).then(() => {
                  if (!skip && setupStatus?.layers.webauthn) {
                    setPhase("layer1");
                  } else {
                    setPhase("layer2");
                  }
                });
              }}
              className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-500 font-mono text-xs py-3 rounded border border-green-500/30 transition-colors mt-2"
              data-testid="button-begin-auth"
            >
              Begin Authentication
            </button>
          )}
        </div>
      </div>
    );
  }

  if (phase === "layer1" || phase === "layer2" || phase === "layer3") {
    const activeLayers = webauthnSkipped
      ? [
          { label: "PASSPHRASE", done: layerStatus.passphrase, active: phase === "layer2" },
          { label: "DEVICE", done: layerStatus.fingerprint, active: phase === "layer3" },
        ]
      : [
          { label: "BIOMETRIC", done: layerStatus.webauthn, active: phase === "layer1" },
          { label: "PASSPHRASE", done: layerStatus.passphrase, active: phase === "layer2" },
          { label: "DEVICE", done: layerStatus.fingerprint, active: phase === "layer3" },
        ];

    return (
      <div className="h-screen bg-background flex items-center justify-center" data-testid="security-auth">
        <div className="flex flex-col items-center gap-6 max-w-md text-center px-6">
          <Shield className="w-12 h-12 text-primary" />
          <p className="font-display text-sm tracking-widest uppercase text-primary">AUTHENTICATION</p>

          <div className="w-full flex items-center gap-2 mt-2">
            {activeLayers.map((l, i) => (
              <div key={i} className="flex-1">
                <div className={`h-1 rounded-full mb-1 transition-all duration-500 ${l.done ? "bg-green-500" : l.active ? "bg-primary animate-pulse" : "bg-border/30"}`} />
                <p className={`font-mono text-[7px] uppercase tracking-widest ${l.done ? "text-green-500" : l.active ? "text-primary" : "text-muted-foreground/40"}`}>
                  {l.label}
                </p>
              </div>
            ))}
          </div>

          {phase === "layer1" && !webauthnSkipped && (
            <div className="w-full mt-4">
              <Fingerprint className="w-12 h-12 text-primary mx-auto mb-4" />
              <p className="font-mono text-[10px] text-muted-foreground mb-4">
                Verify your identity with fingerprint or Face ID
              </p>
              <button
                onClick={handleLayer1WebAuthn}
                disabled={isProcessing}
                className="w-full bg-primary/20 hover:bg-primary/30 text-primary font-mono text-xs py-3 rounded border border-primary/30 disabled:opacity-50 transition-colors"
                data-testid="button-auth-webauthn"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Authenticate Biometric"}
              </button>
            </div>
          )}

          {phase === "layer2" && (
            <div className="w-full mt-4">
              <KeyRound className="w-12 h-12 text-primary mx-auto mb-4" />
              <input
                type="password"
                value={passphrase}
                onChange={(e) => { setPassphrase(e.target.value); setPassphraseError(""); }}
                onKeyDown={(e) => { if (e.key === "Enter") handleLayer2Passphrase(); }}
                placeholder="Enter passphrase"
                autoFocus
                className="w-full bg-background border border-border/50 rounded px-3 py-3 font-mono text-xs text-white text-center placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
                data-testid="input-auth-passphrase"
              />
              {passphraseError && <p className="font-mono text-[10px] text-red-500 mt-2">{passphraseError}</p>}
              <button
                onClick={handleLayer2Passphrase}
                disabled={isProcessing || !passphrase}
                className="w-full mt-3 bg-primary/20 hover:bg-primary/30 text-primary font-mono text-xs py-3 rounded border border-primary/30 disabled:opacity-50 transition-colors"
                data-testid="button-auth-passphrase"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Verify Passphrase"}
              </button>
            </div>
          )}

          {phase === "layer3" && (
            <div className="w-full mt-4">
              <Scan className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
              <p className="font-mono text-[10px] text-muted-foreground">
                Verifying device signature...
              </p>
            </div>
          )}

          {message && <p className="font-mono text-[10px] text-red-400 mt-2">{message}</p>}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
