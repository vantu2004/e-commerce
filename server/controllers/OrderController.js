import Order from "../models/Order.js";

export async function myOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("items.product", "name slug images");
    res.json(orders);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function createOrder(req, res) {
  try {
    const { items, address, total } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0)
      return res.status(400).json({ message: "No items" });

    const order = await Order.create({
      user: req.user.id,
      items,
      address,
      total,
    });

    res.status(201).json(order);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
