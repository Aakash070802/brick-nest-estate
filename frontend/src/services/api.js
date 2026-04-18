import axios from "axios";
import { store } from "../redux/store";
import { loginFailure, setGlobalLoading } from "../redux/features/userSlice";

let activeRequests = 0;
let isRefreshing = false;
let pendingQueue = [];

const startLoading = () => {
  activeRequests++;
  if (activeRequests === 1) {
    store.dispatch(setGlobalLoading(true));
  }
};

const stopLoading = () => {
  activeRequests--;
  if (activeRequests <= 0) {
    activeRequests = 0;
    store.dispatch(setGlobalLoading(false));
  }
};

const processQueue = (error) => {
  pendingQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  pendingQueue = [];
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

/**
 * REQUEST
 */
api.interceptors.request.use(
  (config) => {
    if (!config._skipLoader) {
      startLoading();
      config._loaderEnabled = true; // track it
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * RESPONSE
 */
api.interceptors.response.use(
  (res) => {
    if (res.config._loaderEnabled) {
      stopLoading();
    }
    return res;
  },
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest?._loaderEnabled) {
      stopLoading();
    }

    // 🔥 HANDLE 401 WITH LOCK
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({
            resolve: () => resolve(api(originalRequest)),
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        await refreshApi.post("/auth/refresh-token", {}, { _skipLoader: true });

        processQueue(null);
        return api(originalRequest);
      } catch (err) {
        processQueue(err);
        store.dispatch(loginFailure("Session expired"));
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
