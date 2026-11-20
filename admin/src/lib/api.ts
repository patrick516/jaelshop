import axios, { type AxiosError, type AxiosResponse } from "axios";
import type { ApiResponse } from "@/types";
import { clearSession, getSession } from "./session";

// An error that carries the HTTP status, so screens can react to a 404 or 403
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const http = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api" });

// Every request carries the staff token
http.interceptors.request.use((config) => {
  const session = getSession();
  if (session) config.headers.Authorization = `Bearer ${session.token}`;
  return config;
});

// Every failure becomes an ApiError with the backend's own message
http.interceptors.response.use(
  (res) => res,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status ?? 0;
    const isLogin = error.config?.url?.startsWith("/auth/"); // a wrong password also returns 401
    if (status === 401 && !isLogin) {
      clearSession(); // the saved login has expired
      window.location.href = "/login";
    }
    return Promise.reject(new ApiError(error.response?.data?.message ?? error.message, status));
  },
);

const unwrap = async <T>(request: Promise<AxiosResponse<ApiResponse<T>>>) => (await request).data;

// One place for every call: api.get<Product[]>("/products", { page: 1 })
export const api = {
  get: <T>(url: string, params?: object) => unwrap<T>(http.get(url, { params })),
  post: <T>(url: string, body?: unknown) => unwrap<T>(http.post(url, body)),
  put: <T>(url: string, body?: unknown) => unwrap<T>(http.put(url, body)),
  patch: <T>(url: string, body?: unknown) => unwrap<T>(http.patch(url, body)),
  delete: <T>(url: string) => unwrap<T>(http.delete(url)),
};
