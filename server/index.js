import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { PORT, CLIENT_ORIGIN } from "./config/config.js";
import { connectDB } from "./config/db.js";
import AuthRoute from "./routes/AuthRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import OrderRoute from "./routes/OrderRoute.js";

const app = express();

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", AuthRoute);
app.use("/api/products", ProductRoute);
app.use("/api/orders", OrderRoute);

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});