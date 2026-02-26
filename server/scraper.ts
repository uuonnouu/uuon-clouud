import type { Request, Response } from "express";
import { resolve4 } from "dns/promises";

const BLOCKED_HOSTNAMES = ["localhost", "127.0.0.1", "0.0.0.0", "[::1]", "metadata.google.internal", "169.254.169.254"];

function isPrivateIP(ip: string): boolean {
  if (ip.startsWith("10.") || ip.startsWith("127.") || ip.startsWith("0.")) return true;
  if (ip.startsWith("172.")) {
    const second = parseInt(ip.split(".")[1]);
    if (second >= 16 && second <= 31) return true;
  }
  if (ip.startsWith("192.168.")) return true;
  if (ip.startsWith("169.254.")) return true;
  return false;
}

export async function scrapeUrl(req: Request, res: Response) {
  try {
    const { url } = req.body;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "URL is required" });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return res.status(400).json({ error: "Only HTTP/HTTPS URLs are supported" });
    }

    const hostname = parsedUrl.hostname;
    if (BLOCKED_HOSTNAMES.includes(hostname)) {
      return res.status(403).json({ error: "Access to internal addresses is not allowed" });
    }

    try {
      const ips = await resolve4(hostname);
      if (ips.some(isPrivateIP)) {
        return res.status(403).json({ error: "Access to private network addresses is not allowed" });
      }
    } catch {}

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "UUON-Clouud/1.0 (Content Analysis)",
        "Accept": "text/html, text/plain, application/json, */*",
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(400).json({ error: `Failed to fetch URL: ${response.status} ${response.statusText}` });
    }

    const contentType = response.headers.get("content-type") || "";
    const rawText = await response.text();

    let extractedText = "";
    let title = "";

    if (contentType.includes("text/html")) {
      title = rawText.match(/<title[^>]*>(.*?)<\/title>/is)?.[1]?.trim() || "";
      extractedText = rawText
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
        .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
        .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, " ")
        .trim();
    } else if (contentType.includes("application/json")) {
      try {
        const json = JSON.parse(rawText);
        extractedText = JSON.stringify(json, null, 2);
      } catch {
        extractedText = rawText;
      }
    } else {
      extractedText = rawText;
    }

    extractedText = extractedText.slice(0, 50000);

    res.json({
      url,
      title,
      contentType,
      textLength: extractedText.length,
      extractedText: extractedText.slice(0, 2000),
      fullText: extractedText,
    });
  } catch (error: any) {
    if (error.name === "AbortError") {
      return res.status(408).json({ error: "Request timed out (15s limit)" });
    }
    res.status(500).json({ error: error.message || "Failed to scrape URL" });
  }
}
