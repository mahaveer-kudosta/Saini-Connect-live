import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely converts nullable strings to undefined for React components
 * that accept string | undefined but not null
 */
export function safeString(value: string | null | undefined): string | undefined {
  return value === null ? undefined : value;
}