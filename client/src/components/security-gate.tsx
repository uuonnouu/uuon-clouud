import { useState, useEffect } from "react";
import { Shield, ShieldAlert, Fingerprint, Loader2 } from "lucide-react";
import { generateFingerprint, getStoredFingerprint } from "../lib/fingerprint";

interface SecurityGateProps {
  children: React.ReactNode;
}

export function SecurityGate({ children }: SecurityGateProps) {
  const [status, setStatus] = useState<"loading" | "verified" | "denied" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    authenticate();
  }, []);

  async function authenticate() {
    try {
      const statusRes = await fetch("/api/auth/status");
      const statusData = await statusRes.json();

      const result = await generateFingerprint();

      const fpRes = await fetch("/api/auth/register-fingerprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ components: result.components }),
      });

      const fpData = await fpRes.json();

      if (fpData.status === "OWNER_REGISTERED" || fpData.status === "OWNER_VERIFIED") {
        sessionStorage.setItem("uuon-fingerprint", fpData.hash);
        setStatus("verified");
        setMessage("Identity confirmed");
      } else if (fpData.status === "BLOCKED") {
        setStatus("denied");
        setMessage("Access permanently denied");
      } else {
        setStatus("denied");
        setMessage("Unrecognized identity. This system is private.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Authentication system error");
    }
  }

  if (status === "loading") {
    return (
      <div className="h-screen bg-background flex items-center justify-center" data-testid="security-loading">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <Fingerprint className="w-16 h-16 text-primary animate-pulse" />
            <div className="absolute -bottom-1 -right-1">
              <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
            </div>
          </div>
          <div className="text-center">
            <p className="font-display text-sm tracking-widest uppercase text-primary">UUON CLOUUD</p>
            <p className="font-mono text-[10px] text-muted-foreground tracking-widest mt-2">
              Scanning identity signal...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "denied" || status === "error") {
    return (
      <div className="h-screen bg-background flex items-center justify-center" data-testid="security-denied">
        <div className="flex flex-col items-center gap-6 max-w-md text-center px-6">
          <ShieldAlert className="w-20 h-20 text-red-500" />
          <div>
            <p className="font-display text-lg tracking-wider uppercase text-red-500">Access Denied</p>
            <p className="font-mono text-xs text-muted-foreground mt-3 leading-relaxed">
              {message}
            </p>
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

  return <>{children}</>;
}
