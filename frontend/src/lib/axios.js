import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api"
      : "api",
  withCredentials: true,
});

// // interceptor: tự động refresh token khi access token hết hạn
// axiosInstance.interceptors.response.use(
//   // Nếu response thành công, trả về như bình thường
//   (response) => response,

//   // Nếu có lỗi (ví dụ 401 Unauthorized), chạy callback này
//   async (error) => {
//     // Giữ lại request gốc (request gây ra lỗi)
//     const originalRequest = error.config;

//     // Kiểm tra xem có phải lỗi 401 (token hết hạn) và chưa retry chưa
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       // Đánh dấu để không retry request này nhiều lần
//       originalRequest._retry = true;

//       try {
//         // Gọi API /auth/refresh-token để backend cấp lại access token mới
//         // - Backend sẽ dùng refresh_token (trong cookie) để sinh access_token mới
//         // - Sau đó server set lại cookie access_token
//         await axiosInstance.post("/auth/refresh-token");

//         // Sau khi refresh thành công, gọi lại request gốc bằng access token mới
//         // - axiosInstance tự động gửi cookie mới (vì withCredentials = true)
//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         // Nếu refresh token cũng hết hạn hoặc lỗi mạng
//         console.error("Refresh token failed:", refreshError);

//         //Xử lý: điều hướng người dùng về trang đăng nhập
//         // - Vì cả access token và refresh token đều hết hạn
//         window.location.href = "/login";
//       }
//     }

//     // Nếu không phải lỗi 401 hoặc refresh thất bại, ném lỗi về cho nơi gọi
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
