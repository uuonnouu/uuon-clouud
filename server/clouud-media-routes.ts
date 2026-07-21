import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const UPLOAD_DIR = path.resolve(process.cwd(), "server/brain/Uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const safeExt = path.extname(file.originalname).slice(0, 10);
    cb(null, crypto.randomBytes(8).toString("hex") + safeExt);
  },
});
const upload = multer({ storage, limits: { fileSize: 25 * 1024 * 1024, files: 1 } });

export const clouudMediaRouter = Router();

clouudMediaRouter.post("/upload", upload.single("file"), (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: "No file received. Field name must be 'file'." });
  const buf = fs.readFileSync(req.file.path);
  const sha256 = crypto.createHash("sha256").update(buf).digest("hex");
  res.json({
    name: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    mimeType: req.file.mimetype,
    sha256: sha256,
    url: "/api/clouud/uploads/" + req.file.filename,
  });
});

clouudMediaRouter.get("/uploads/:name", (req, res) => {
  const name = path.basename(req.params.name);
  const full = path.join(UPLOAD_DIR, name);
  if (!fs.existsSync(full)) return res.status(404).json({ error: "Not found" });
  res.sendFile(full);
});

const BLOCKED_HOSTS = /^(localhost|127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|0\.)/;

clouudMediaRouter.post("/scrape", async (req: Request, res: Response) => {
  const url = (req.body || {}).url;
  let parsed: URL;
  try { parsed = new URL(url); } catch { return res.status(400).json({ error: "Invalid URL" }); }
  if (!/^https?:$/.test(parsed.protocol) || BLOCKED_HOSTS.test(parsed.hostname))
    return res.status(400).json({ error: "URL not allowed" });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const r = await fetch(parsed.href, {
      signal: controller.signal,
      headers: { "User-Agent": "ClouudScraper/1.0 (+https://uuon.world)" },
      redirect: "follow",
    });
    const html = await r.text();
    const pick = (re: RegExp) => ((html.match(re) || [])[1] || "").trim();
    const title = pick(/<title[^>]*>([^<]*)<\/title>/i);
    const description =
      pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i) ||
      pick(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)/i);
    const images = Array.from(html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi))
      .map(function (m) { try { return new URL(m[1], parsed.href).href; } catch { return ""; } })
      .filter(function (u) { return /^https?:/.test(u); }).slice(0, 12);
    const links = Array.from(html.matchAll(/<a[^>]+href=["']([^"'#]+)["']/gi))
      .map(function (m) { try { return new URL(m[1], parsed.href).href; } catch { return ""; } })
      .filter(function (u) { return u.indexOf("http") === 0; }).slice(0, 25);
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim().slice(0, 8000);
    const sha256 = crypto.createHash("sha256").update(html).digest("hex");
    res.json({ url: parsed.href, status: r.status, title: title, description: description, text: text, images: images, links: links, fetchedAt: new Date().toISOString(), sha256: sha256 });
  } catch (e: any) {
    res.status(502).json({ error: e.name === "AbortError" ? "Timed out after 12s" : "Fetch failed" });
  } finally {
    clearTimeout(timer);
  }
});
