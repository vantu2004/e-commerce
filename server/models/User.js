import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  avatar: String,
  passwordHash: String, // bcrypt hash
  role: { type: String, default: "user" },
});

export default mongoose.model("User", userSchema);
