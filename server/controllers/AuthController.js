import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET } from "../config/config.js";

export async function register(req, res) {
  try {
    const { fullName, email, phone, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already used" });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, phone, passwordHash });
    return res.status(201).json({ id: user._id });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function me(req, res) {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "Not found" });
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function updateProfile(req, res) {
  try {
    const { fullName, phone, avatar } = req.body; // email có thể không cho sửa hoặc cần verify
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { fullName, phone, avatar } },
      { new: true }
    ).select("-passwordHash");
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function logout(req, res) {
    res.json({ ok: true });
}
