import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendError } from "../common/utils/responseHelper";

dotenv.config();

interface DecodedToken {
  userId: number;
  role: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      role?: string;
    }
  }
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    sendError(res, "인증 토큰이 필요합니다", null, 401);
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    req.userId = decoded.userId;
    req.role = decoded.role;

    next();
  } catch (err) {
    sendError(res, "유효하지 않은 토큰입니다", err, 401);
    return;
  }
}
