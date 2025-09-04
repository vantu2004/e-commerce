import { Router } from "express";
import {
  createProduct,
  getHomeBlocks,
  paginate,
  getBySlug,
} from "../controllers/ProductController.js";
import { requireAuth } from "../middleware/Auth.js";
const r = Router();

r.post("/create-product", requireAuth,createProduct);
r.get("/home", getHomeBlocks);
r.get("/", paginate);
r.get("/:slug", getBySlug);

export default r;
