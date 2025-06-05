import type { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { storage } from "./storage";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export type RequestWithAuth = Request & { user: AuthUser };

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  // For development, accept any login with email
  const userId = Buffer.from(email).toString("hex");
  const user = await storage.getUser(userId) || await storage.upsertUser({
    id: userId,
    email: email,
    firstName: null,
    lastName: null,
    profileImageUrl: null,
    role: "sales",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token, user });
};

export const isAuthenticated: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    (req as RequestWithAuth).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}; 