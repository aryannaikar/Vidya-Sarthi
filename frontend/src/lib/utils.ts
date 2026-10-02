import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes with clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format relative deadline (e.g. "Closes in 3 days", "Closes tomorrow", "Closed")
 */
export function formatDeadlineRelative(dateString: string): {
  text: string;
  isUrgent: boolean;
  isClosed: boolean;
} {
  const target = new Date(dateString);
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: "Closed", isUrgent: false, isClosed: true };
  }
  if (diffDays === 0) {
    return { text: "Closes today", isUrgent: true, isClosed: false };
  }
  if (diffDays === 1) {
    return { text: "Closes tomorrow", isUrgent: true, isClosed: false };
  }
  if (diffDays <= 7) {
    return { text: `In ${diffDays} days`, isUrgent: true, isClosed: false };
  }
  return { text: `In ${diffDays} days`, isUrgent: false, isClosed: false };
}

/**
 * Formats date into editorial date string (e.g. "Oct 12, 2026")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
