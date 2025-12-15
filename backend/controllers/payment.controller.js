import stripe from "../lib/stripe.js";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";

/**
 * ================================
 * 1. Tạo phiên thanh toán (Checkout Session)
 * ================================
 */
export const createCheckoutSession = async (req, res) => {
  const { products, couponCode } = req.body;

  try {
    // Kiểm tra đầu vào
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid products array" });
    }

    let totalAmount = 0;

    /**
     * Tạo lineItems cho Stripe
     * - Stripe yêu cầu unit_amount (cent)
     * - Duyệt danh sách sản phẩm để tính tổng
     */
    const lineItems = products.map((item) => {
      const itemTotal = item.product.price * item.quantity;
      totalAmount += itemTotal;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.name,
            images: [item.product.image],
          },
          unit_amount: Math.round(item.product.price * 100), // USD -> cent
        },
        quantity: item.quantity || 1,
      };
    });

    // Xử lý mã giảm giá
    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
        expiryDate: { $gt: Date.now() },
      });

      if (coupon) {
        totalAmount -= (totalAmount * coupon.discountPercentage) / 100;
      }
    }

    /**
     * Tạo session trên Stripe
     */
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discounts: coupon
        ? [
            {
              coupon: await createStripeCoupon(coupon.discountPercentage),
            },
          ]
        : [],
      metadata: {
        userId: req.user._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((item) => ({
            productId: item.product._id, // đổi thành productId cho khớp với Order schema
            quantity: item.quantity,
            price: item.product.price,
          }))
        ),
      },
    });

    // Nếu tổng tiền lớn hơn 20000 → tặng coupon mới
    if (totalAmount >= 100) {
      await createNewCoupon(req.user._id);
    }

    res.status(200).json({
      message: "Checkout session created",
      session: {
        id: session.id,
        totalAmount,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * ================================
 * 2. Tạo coupon trên Stripe
 * ================================
 */
async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    duration: "once",
    percent_off: discountPercentage,
  });

  return coupon.id;
}

/**
 * ================================
 * 3. Tạo coupon mới trong DB để tặng user
 * ================================
 */
async function createNewCoupon(userId) {
  // phải tìm và xóa coupon cũ trước khi tạo 1 coupon mới
  await Coupon.findOneAndDelete({ userId: userId });

  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 ngày
    discountPercentage: 10,
    userId: userId,
    isActive: true,
  });
  await newCoupon.save();
  return newCoupon;
}

/**
 * ================================
 * 4. Xử lý sau khi thanh toán thành công
 * ================================
 */
export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // CHẶN REQUEST TRÙNG
    const existed = await Order.findOne({ stripeSessionId: sessionId });
    if (existed) {
      return res.status(200).json({
        success: true,
        message: "Order already processed",
        orderId: existed._id,
      });
    }

    if (session.payment_status === "paid") {
      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            userId: session.metadata.userId,
          },
          { isActive: false }
        );
      }

      const products = JSON.parse(session.metadata.products);

      const newOrder = new Order({
        user: session.metadata.userId,
        products: products.map((item) => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: session.amount_total / 100,
        stripeSessionId: sessionId,
      });

      const savedOrder = await newOrder.save();

      return res.status(200).json({
        success: true,
        message: "Payment successful",
        orderId: savedOrder._id,
      });
    }

    res.status(400).json({ success: false, message: "Payment not completed" });
  } catch (error) {
    console.log("Error: ", error);
    res
      .status(500)
      .json({ message: "Error processing payment", error: error.message });
  }
};
