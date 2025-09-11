import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,

  setProducts: (products) => set({ products }),

  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get("/products");
      set({ products: response.data.products });
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  createProduct: async (newProduct) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.post("/products", newProduct);
      set((prevState) => ({
        products: [...prevState.products, response.data.product],
      }));

      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      await axiosInstance.delete(`/products/${productId}`);
      set((prevState) => ({
        products: prevState.products.filter(
          (product) => product._id !== productId
        ),
      }));

      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.put(`/products/${productId}`);
      set((prevState) => ({
        products: prevState.products.map((product) =>
          product._id === productId
            ? {
                ...product,
                isFeatured: response.data.product.isFeatured,
              }
            : product
        ),
      }));
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      set({ loading: false });
    }
  },
}));
