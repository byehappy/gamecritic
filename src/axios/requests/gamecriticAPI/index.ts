import axios, { AxiosError } from "axios";
import { redirect } from "react-router-dom";
import { refreshToken } from "./auth.requests";

export const instanceAPI = axios.create({
  baseURL: import.meta.env.VITE_URL_BACKEND,
});

instanceAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

instanceAPI.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const _error = err as AxiosError;
    const originalConfig = err.config;
    if (_error.response) {
      if (_error.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const rs = await refreshToken();
          const { accessToken } = rs.data;
          localStorage.setItem("accessToken", accessToken);
          return instanceAPI(originalConfig);
        } catch (_e) {
          const _error = _e as AxiosError;
          if (_error.response) {
            const params = new URLSearchParams();
            params.set("from", new URL(originalConfig.url).pathname);
            return redirect("/auth/sign-in?" + params.toString());
          }
          return Promise.reject(_error);
        }
      }

      if (_error.response.status === 403 && _error.response.data) {
        const params = new URLSearchParams();
        params.set("from", new URL(originalConfig.url).pathname);
        return redirect("/auth/sign-in?" + params.toString());
      }
    }

    return Promise.reject(_error);
  }
);
