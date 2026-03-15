import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "rydo-dev-secret-change-in-production";

export function signToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  const userId = verifyToken(token);
  if (!userId) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }

  const user = await User.findById(userId).lean();
  if (!user) {
    return res.status(401).json({ message: "User not found." });
  }
  delete user.password;

  req.user = user;
  req.userId = userId;
  next();
}

/** Optional auth: attach user if token present, don't reject if missing */
export async function optionalAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return next();
  }

  const userId = verifyToken(token);
  if (!userId) return next();

  const user = await User.findById(userId).lean();
  if (user) {
    delete user.password;
    req.user = user;
    req.userId = userId;
  }
  next();
}
