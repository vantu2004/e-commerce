import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponApplied: false,

  fetchCartItems: async () => {
    try {
      const response = await axiosInstance.get("/cart");
      set({ cart: response.data.cartItems });

      get().calculateCartTotals();
    } catch (error) {
      console.error(error.response.data.message || "Something went wrong");
    }
  },

  addToCart: async (product) => {
    try {
      const response = await axiosInstance.post("/cart", {
        productId: product._id,
      });

      set({ cart: response.data.cartItems });

      toast.success("Product added to cart");

      get().calculateCartTotals();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  calculateCartTotals: () => {
    set((state) => {
      const subtotal = state.cart.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      );
      const total = state.coupon
        ? subtotal - (subtotal * state.coupon.discountPercentage) / 100
        : subtotal;
      return { subtotal, total };
    });
  },

  updateQuantity: async (productId, quantity) => {
    try {
      const response = await axiosInstance.put(`/cart/${productId}`, {
        quantity,
      });

      set({ cart: response.data.cartItems });

      get().calculateCartTotals();
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  },

  removeFromCart: async (productId) => {
    try {
      await axiosInstance.delete(`/cart/${productId}`);
      set((prevState) => ({
        cart: prevState.cart.filter((item) => item.product._id !== productId),
      }));
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  },

  clearAllCartItems: async () => {
    try {
      await axiosInstance.delete("/cart");
      set({ cart: [] });
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  },

  getMyCoupon: async () => {
    try {
      const response = await axiosInstance.get("/coupons");
      set({ coupon: response.data.coupon });
    } catch (error) {
      console.error(error.response.data.message || "Something went wrong");
    }
  },

  applyCoupon: async (code) => {
    try {
      const response = await axiosInstance.post("/coupons/validate", { code });
      set({ coupon: response.data.coupon, isCouponApplied: true });

      get().calculateCartTotals();
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
      set({ coupon: null, isCouponApplied: false });
    }
  },

  removeCoupon: () => {
    set({ coupon: null, isCouponApplied: false });

    get().calculateCartTotals();

    toast.success("Coupon removed successfully");
  },
}));
