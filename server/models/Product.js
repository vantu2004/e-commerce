import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  images: [String],
  price: Number,
  category: String,
  stock: Number,
  sold: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  discount: { type: Number, default: 0 }, // %
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Product", productSchema);
