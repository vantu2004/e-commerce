import User from "../models/user.model.js";

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    const existingItem = user.cartItems.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push({ product: productId, quantity: 1 });
    }

    await user.save();

    res.status(201).json({
      message: "Product added to cart successfully",
      cartItems: user.cartItems,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding product to cart" });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    // TH1: Nếu không có productId, xóa tất cả sản phẩm trong giỏ hàng
    if (!productId) {
      user.cartItems = [];
    }
    // TH2: Nếu có productId, xóa sản phẩm khỏi giỏ hàng
    else {
      user.cartItems = user.cartItems.filter(
        (item) => item.product.toString() !== productId
      );
    }

    await user.save();

    res.status(200).json({
      message: "All items removed from cart successfully",
      cartItems: user.cartItems,
    });
  } catch (error) {
    res.status(500).json({ message: "Error removing items from cart" });
  }
};

export const updateCartItemQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;

    const cartItem = user.cartItems.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    // nếu quantity = 0 thì remove luôn, != 0 thì update quantity
    if (quantity === 0) {
      user.cartItems = user.cartItems.filter(
        (item) => item.product.toString() !== productId
      );
    } else {
      cartItem.quantity = quantity;
    }

    await user.save();

    res.status(200).json({
      message: "Cart item quantity updated successfully",
      cartItems: user.cartItems,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating cart item quantity" });
  }
};

export const getCartItems = async (req, res) => {
  try {
    // lấy user trong db, từ field cartItems, dùng populate để lấy document của product nhờ id tham chiếu trc đó
    const user = await User.findById(req.user._id).populate(
      "cartItems.product"
    );

    if (!user || !user.cartItems.length) {
      return res.status(404).json({ message: "No cart items found" });
    }

    res.status(200).json({
      message: "Cart items retrieved successfully",
      cartItems: user.cartItems,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving cart items" });
  }
};
