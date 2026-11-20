import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Joins class names and resolves conflicts, e.g. cn("p-2", "p-4") gives "p-4"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
