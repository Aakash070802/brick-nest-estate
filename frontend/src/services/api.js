import axios from "axios";
import { store } from "../redux/store";
import { loginFailure } from "../redux/features/userSlice";
import { setGlobalLoading } from "../redux/features/userSlice";

// create instance
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// response interceptors
api.interceptors.response.use(
  (res) => {
    store.dispatch(setGlobalLoading(false));
    return res;
  },
  async (error) => {
    store.dispatch(setGlobalLoading(false));

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          "http://localhost:5000/api/auth/refresh-token",
          {},
          { withCredentials: true },
        );

        return api(originalRequest);
      } catch (err) {
        store.dispatch(loginFailure(null));
      }
    }

    return Promise.reject(error);
  },
);
export default api;
