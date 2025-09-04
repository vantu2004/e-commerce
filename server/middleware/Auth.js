import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";

export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "") || null;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id, role }
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
