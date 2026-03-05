import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.token;

  if (!token) return res.status(401).send("Not logged in");

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { userId: string; email: string };

    req.user = payload;
    next();
  } catch {
    return res.status(401).send("Invalid or expired token");
  }
}