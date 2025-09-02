import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      mathch: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters long"],
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity must be at least 1"],
        },
      },
    ],
    role: {
      type: String,
      enum: ["CUSTOMER", "ADMIN"],
      default: "CUSTOMER",
    },
  },
  { timestamps: true }
);

// Middleware pre-save: chạy trước khi document User được lưu vào DB
userSchema.pre("save", async function (next) {
  // Nếu field password không bị thay đổi (ví dụ update name, email, ...) thì bỏ qua việc hash
  if (!this.isModified("password")) return next();

  try {
    // Tạo salt (chuỗi ngẫu nhiên) với cost = 10 vòng lặp
    const salt = await bcryptjs.genSalt(10);

    // Hash mật khẩu với salt, sau đó gán lại vào field password
    this.password = await bcryptjs.hash(this.password, salt);

    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
