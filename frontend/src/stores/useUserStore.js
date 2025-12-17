import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set) => ({
  user: undefined,
  loading: false,
  checkingAuth: false,

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axiosInstance.get("/auth/profile");
      set({ user: response.data.user });
    } catch (error) {
      set({ user: null });
      console.log(error);
    } finally {
      set({ checkingAuth: false });
    }
  },

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });
    if (!name || !email || !password || !confirmPassword) {
      set({ loading: false });
      return toast.error("All fields are required");
    }
    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }
    try {
      const response = await axiosInstance.post("/auth/signup", {
        email,
        password,
        name,
      });

      set({ user: response.data.user });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true });

    if (!email || !password) {
      set({ loading: false });
      return toast.error("All fields are required");
    }

    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      set({ user: response.data.user });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ user: null });

      toast.success("Logout successful");
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  },

  refreshToken: async () => {
    try {
      await axiosInstance.post("/auth/refresh-token");
    } catch (error) {
      console.log(error);
    }
  },
}));

// axios interceptors
let refreshPromise = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // ko tính endpoint refresh-token vì nó cx trả 401, nếu ko sẽ rơi vào loop do refresh-token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        if (refreshPromise) {
          await refreshPromise;
          return axiosInstance(originalRequest);
        }

        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axiosInstance(originalRequest);
      } catch (error) {
        useUserStore.getState().logout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
