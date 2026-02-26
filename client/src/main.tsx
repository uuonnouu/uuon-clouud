import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const originalFetch = window.fetch.bind(window);
window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
  if (url.startsWith("/api/")) {
    const fp = sessionStorage.getItem("uuon-fingerprint");
    if (fp) {
      const headers = new Headers(init?.headers);
      if (!headers.has("x-fingerprint")) {
        headers.set("x-fingerprint", fp);
      }
      init = { ...init, headers };
    }
  }
  return originalFetch(input, init);
};

createRoot(document.getElementById("root")!).render(<App />);
