import axios from "axios";
import { store } from "../redux/store";
import { loginFailure, setGlobalLoading } from "../redux/features/userSlice";

// create instance
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

/**
 * REQUEST INTERCEPTOR
 * Start global loader
 */
api.interceptors.request.use(
  (config) => {
    // allow skipping loader for specific requests
    if (!config._skipLoader) {
      store.dispatch(setGlobalLoading(true));
    }
    return config;
  },
  (error) => {
    store.dispatch(setGlobalLoading(false));
    return Promise.reject(error);
  },
);

/**
 * RESPONSE INTERCEPTOR
 * Stop loader + handle token refresh
 */
api.interceptors.response.use(
  (res) => {
    store.dispatch(setGlobalLoading(false));
    return res;
  },
  async (error) => {
    store.dispatch(setGlobalLoading(false));

    const originalRequest = error.config;

    // prevent infinite retry loop
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
