// src/lib/ClientAxiosInstance.ts
import axios from "axios";
import Cookies from "js-cookie";

const clientAxiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BASE_API ||
    "https://tech-tips-tricks-hub-server-code.vercel.app/api/v1",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

clientAxiosInstance.interceptors.request.use(
  function (config) {
    const accessToken = Cookies.get("accessToken");

    if (accessToken) {
      config.headers.Authorization = accessToken;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export default clientAxiosInstance;
