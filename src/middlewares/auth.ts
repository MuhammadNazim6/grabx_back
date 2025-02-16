import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export interface UserPayload {
  id: number;
  email: string;
  // iat: number;
  // exp: number;
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  if (!process.env.AUTH_SECRET) {
    return res.status(400).json({
      message: "env variables not configured",
    });
  }

  const token = (req.headers.authorization ||
    req.headers.Authorization) as string;

  try {
    const decoded = jwt.verify(token, process.env.AUTH_SECRET) as UserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid token." });
  }
}

export default verifyToken;
