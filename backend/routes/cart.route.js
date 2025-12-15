import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getCartItems,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearAllCartItems,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/", protectRoute, getCartItems);
router.post("/", protectRoute, addToCart);
router.put("/:productId", protectRoute, updateCartItemQuantity);
router.delete("/:productId", protectRoute, removeFromCart);
router.delete("/", protectRoute, clearAllCartItems);

export default router;
