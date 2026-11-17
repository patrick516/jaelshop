import type { ApiResponse } from "@/types";

// Backend address from .env.local, with a fallback for local work
const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

// An error that carries the HTTP status, so pages can react to a 404 or 401
export class ApiRequestError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message); // sets the normal Error message
    this.status = status; // saves the HTTP status code
  }
}

// Sends a request to the backend and returns the parsed response.
// <T> is the type of the data you expect, e.g. api<Category[]>("/categories")
export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const res = await fetch(BASE + path, {
    cache: "no-store",
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers }, // tell the backend we send JSON
  });
  const body = await res.json(); // every backend answer is JSON
  if (!res.ok)
    throw new ApiRequestError(body.message ?? "Request failed", res.status); // 4xx and 5xx become errors
  return body;
}
