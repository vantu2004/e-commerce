import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,

  fetchCartItems: async () => {
    try {
      const response = await axiosInstance.get("/cart");
      set({ cart: response.data.cartItems });

      get().calculateCartTotals();
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  },

  addToCart: async (productId) => {
    try {
      const response = await axiosInstance.post("/cart", { productId });
      set((prevState) => {
        // kiểm tra sản phẩm đã có trong giỏ hàng chưa
        const existingItem = prevState.cart.find(
          (item) => item.product._id === productId
        );
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item.product._id === productId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...prevState.cart, { product: { _id: productId }, quantity: 1 }];

        return { cart: newCart };
      });

      get().calculateCartTotals();

      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
      console.log(error);
    }
  },

  calculateCartTotals: () => {
    set((state) => {
      const subtotal = state.cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      const total = state.coupon
        ? subtotal - (subtotal * state.coupon.discount) / 100
        : subtotal;
      return { subtotal, total };
    });
  },
}));
