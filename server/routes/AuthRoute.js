import { Router } from "express";
import {
  login,
  me,
  register,
  updateProfile,
} from "../controllers/AuthController.js";
import { requireAuth } from "../middleware/Auth.js";
const r = Router();

r.post("/register", register);
r.post("/login", login);
r.get("/me", requireAuth, me);
r.put("/me", requireAuth, updateProfile);

export default r;
