import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number, decimals: number = 1): string {
  if (Math.abs(n) >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toFixed(decimals);
}

export function formatPercent(n: number | null): string {
  if (n == null) return "—";
  return n.toFixed(1) + "%";
}

export function formatHours(n: number | null): string {
  if (n == null) return "—";
  if (n < 1) return (n * 60).toFixed(0) + "m";
  return n.toFixed(1) + "h";
}
