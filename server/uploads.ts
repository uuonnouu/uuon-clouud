import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import type { Request, Response } from "express";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `uuon-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = [
    "image/png", "image/jpeg", "image/gif", "image/webp", "image/svg+xml",
    "application/pdf",
    "text/plain", "text/csv", "text/html", "text/markdown",
    "application/json",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed`));
  }
};

export const upload = multer({
  storage: diskStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export function extractTextFromFile(filePath: string, mimeType: string): string {
  try {
    if (mimeType.startsWith("text/") || mimeType === "application/json") {
      return fs.readFileSync(filePath, "utf-8").slice(0, 50000);
    }
    if (mimeType === "application/pdf") {
      return "[PDF uploaded — binary content, text extraction pending]";
    }
    if (mimeType.startsWith("image/")) {
      return "[Image uploaded — visual content]";
    }
    return "[File uploaded — content type: " + mimeType + "]";
  } catch {
    return "[Could not extract text from file]";
  }
}

export async function handleUpload(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const conversationId = req.body.conversationId ? parseInt(req.body.conversationId) : undefined;
    const extractedText = extractTextFromFile(req.file.path, req.file.mimetype);

    const saved = await storage.saveUpload({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      conversationId,
      extractedText,
    });

    res.json({
      id: saved.id,
      originalName: saved.originalName,
      mimeType: saved.mimeType,
      size: saved.size,
      extractedText: extractedText.slice(0, 500),
      contextReady: true,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Upload failed" });
  }
}
