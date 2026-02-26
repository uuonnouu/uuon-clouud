import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const originalFetch = window.fetch.bind(window);
window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
  if (url.startsWith("/api/")) {
    const headers = new Headers(init?.headers);
    const fp = sessionStorage.getItem("uuon-fingerprint");
    if (fp && !headers.has("x-fingerprint")) {
      headers.set("x-fingerprint", fp);
    }
    const sessionToken = sessionStorage.getItem("uuon-session-token");
    if (sessionToken && !headers.has("x-session-token")) {
      headers.set("x-session-token", sessionToken);
    }
    init = { ...init, headers };
  }
  return originalFetch(input, init);
};

createRoot(document.getElementById("root")!).render(<App />);
