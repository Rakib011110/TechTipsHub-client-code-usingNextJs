// src/lib/ClientAxiosInstance.ts
import axios from "axios";

const clientAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default clientAxiosInstance;
