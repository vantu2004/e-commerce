import { Router } from "express";
import { myOrders, createOrder } from "../controllers/OrderController.js";
import { requireAuth } from "../middleware/Auth.js";
const r = Router();

r.get("/mine", requireAuth, myOrders);
r.post("/create-order", requireAuth, createOrder);

export default r;
