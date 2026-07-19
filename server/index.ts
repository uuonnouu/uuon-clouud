import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerPublicAPI } from "./public-api";
import { registerRoutes, registerSystemRoutes } from "./routes";
import { codexRouter } from "./codex-routes";
import { registerDmensionRoutes } from "./dmension-routes";
import registerEnhancedRoutes from "./enhanced-routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { dmensionBridge } from "./dmension-bridge";
import { storage } from "./storage";
import { globalLimiter, apiLimiter } from "./middleware/rate-limit";
import { configureSecurityHeaders, corsOptions } from "./middleware/security-headers";
import { auditLogMiddleware } from "./middleware/audit-log";
import { registerBrainRoutes } from "./brain/routes";
import { brainService } from "./brain/service";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

configureSecurityHeaders(app);
app.use(cors(corsOptions));
app.use(auditLogMiddleware);
app.use(globalLimiter);

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

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
    if (path.startsWith("/api") && !path.includes("/metrics") && !path.includes("/self-assessment")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);
  registerPublicAPI(app);
  app.use("/api/codex", codexRouter);
  registerDmensionRoutes(app);
  registerEnhancedRoutes(app);
  registerSystemRoutes(app);
  await registerBrainRoutes(app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("Internal Server Error:", err);
    if (res.headersSent) return next(err);
    return res.status(status).json({ message });
  });

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  const host = process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1";

  httpServer.listen({ port, host }, () => {
    log(`serving on port ${port}`);

    storage.getDmensionShapeCount().then((count) => {
      dmensionBridge.setLocalShapeCount(count);
      console.log(`[DMENSION] Local shape database: ${count} shapes`);
    }).catch(() => {});

    dmensionBridge.startConnectionMonitor();

    // Brain init is NON-BLOCKING — fires after port is bound
    // Scan of 245 files runs in background; endpoints return "initializing" until ready
    log("Brain Compression System initializing (non-blocking)...");
    brainService.initialize().then(() => {
      log("Brain Compression System ready");
    }).catch((error) => {
      console.error("[Brain] Initialization error:", error);
    });
  });
})();
