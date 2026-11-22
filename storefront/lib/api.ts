import type { ApiResponse } from "@/types";
const BASE = process.env.NEXT_PUBLIC_API_URL;

if (!BASE && process.env.NODE_ENV === "production") {
  console.warn(
    " WARNING: NEXT_PUBLIC_API_URL is missing from environment variables!",
  );
}

// An error that carries the HTTP status, so pages can react to a 404 or 401
export class ApiRequestError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const baseUrl =
    BASE ??
    (process.env.NODE_ENV === "development" ? "http://localhost:5000/api" : "");

  if (!baseUrl) {
    throw new Error(
      "API URL is not defined. Please set NEXT_PUBLIC_API_URL in your environment.",
    );
  }

  const res = await fetch(baseUrl + path, {
    cache: "no-store",
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });

  const body = await res.json();

  if (!res.ok)
    throw new ApiRequestError(body.message ?? "Request failed", res.status);

  return body;
}
