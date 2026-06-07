import type { Request, Response, NextFunction } from "express";

export function requireApiKey(
  req: Request,
  res: Response,
  next: NextFunction
) {

  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "API key required"
    });
  }

  const key = auth.replace("Bearer ", "");

  if (key !== process.env.CLOUUD_API_KEY) {
    return res.status(403).json({
      error: "Invalid API key"
    });
  }

  next();
}
