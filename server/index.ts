import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { securityGate } from "./security";
import { startHydrationLoop } from "./hydration";

process.on("uncaughtException", (err) => {
  console.error("[PROCESS] Uncaught exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("[PROCESS] Unhandled rejection:", reason);
});

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// app.use(securityGate);

const recentConvoRequests = new Map<string, { count: number; windowStart: number }>();
const CONVO_WINDOW_MS = 3000;
const CONVO_MAX_PER_WINDOW = 3;

app.use("/api/conversations", (req: Request, res: Response, next: NextFunction) => {
  if (req.method !== "GET") return next();
  if (req.path !== "/" && req.path !== "") return next();
  const ip  = req.ip ?? "unknown";
  const now = Date.now();
  const entry = recentConvoRequests.get(ip);

  if (entry && now - entry.windowStart < CONVO_WINDOW_MS) {
    entry.count++;
    if (entry.count > CONVO_MAX_PER_WINDOW) {
      return res.status(429).json({
        error:  "duplicate_tab",
        message: "Crystal cache is current. No fetch needed.",
      });
    }
  } else {
    recentConvoRequests.set(ip, { count: 1, windowStart: now });
  }

  if (recentConvoRequests.size > 100) {
    for (const [key, e] of recentConvoRequests) {
      if (now - e.windowStart > CONVO_WINDOW_MS * 10) recentConvoRequests.delete(key);
    }
  }

  next();
});

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        const summary = JSON.stringify(capturedJsonResponse);
        logLine += ` :: ${summary.length > 200 ? summary.slice(0, 200) + "…" : summary}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
      startHydrationLoop();
    },
  );
})();
