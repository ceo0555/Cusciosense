import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error", error);
    return Promise.reject(error);
  }
);
