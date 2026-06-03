import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names and dedupe conflicting Tailwind utilities.
 * Standard shadcn/ui helper — keep it here so `npx shadcn add <component>`
 * wires up against `@/lib/utils`.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
