import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import {
  getAnalyticsData,
  getDailySalesData,
} from "../controllers/analytic.controller.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, async (req, res) => {
  try {
    // tổng số liệu
    const analyticsData = await getAnalyticsData();

    // khoảng thời gian 7 ngày trc nên phải trừ
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    // số liệu theo ngày
    const dailySalesData = await getDailySalesData(startDate, endDate);

    res.status(200).json({
      message: "Analytics data fetched successfully",
      data: {
        analyticsData,
        dailySalesData,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching analytics data" });
  }
});

export default router;
