import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      userId: req.user._id,
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({ message: "No active coupons found" });
    }

    res.status(200).json({ message: "Coupon fetched successfully", coupon });
  } catch (error) {
    res.status(500).json({ message: "Error fetching coupon" });
  }
};

export const validateCoupon = async (req, res) => {
  const { code } = req.body;

  try {
    // lấy coupon từ người nhập, so sánh code coupon, lấy id mặc định của người có quyền dùng so sánh vs người login, ktra có active ko
    const coupon = await Coupon.findOne({
      code,
      userId: req.user._id,
      isActive: true,
      expiryDate: { $gt: Date.now() },
    });

    if (!coupon) {
      return res.status(404).json({ message: "Invalid or expired coupon" });
    }

    res.status(200).json({
      message: "Coupon is valid",
      coupon: {
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error validating coupon" });
  }
};
