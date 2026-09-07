import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | undefined | null) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatTime(dateString: string | undefined | null) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
}

export function formatDateTime(dateString: string | undefined | null) {
  if (!dateString) return "";
  return `${formatDate(dateString)} at ${formatTime(dateString)}`;
}

export function getEventCategoryColor(category: string) {
  const c = category.toLowerCase();
  if (c.includes("academic")) return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800";
  if (c.includes("club")) return "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200 dark:border-teal-800";
  if (c.includes("cultural")) return "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 border-pink-200 dark:border-pink-800";
  if (c.includes("sport")) return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800";
  if (c.includes("workshop")) return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800";
  if (c.includes("seminar")) return "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800";
  if (c.includes("hackathon")) return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
  if (c.includes("recruitment")) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
  if (c.includes("holiday")) return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800";
  if (c.includes("exam")) return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
  return "bg-primary/10 text-primary border-primary/20";
}

export function getStatusColor(status: string) {
  const s = status.toLowerCase();
  if (s === "upcoming") return "bg-indigo-500 text-white";
  if (s === "live") return "bg-emerald-500 text-white animate-pulse";
  if (s === "completed") return "bg-slate-500 text-white";
  if (s === "cancelled") return "bg-red-500 text-white";
  if (s === "postponed") return "bg-amber-500 text-white";
  return "bg-slate-200 text-slate-700";
}
