import axios from "axios";
import { store } from "../redux/store";
import { loginFailure } from "../redux/features/userSlice";

// create instance
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// response interceptors
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          "http://localhost:5000/api/auth/refresh-token",
          {},
          { withCredentials: true },
        );

        // retry original request
        return api(originalRequest);
      } catch (err) {
        store.dispatch(loginFailure(null));
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);
export default api;
