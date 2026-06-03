"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";

/**
 * Both icons are always rendered; which one shows is decided by CSS keyed on
 * <html data-theme> (see globals.css). This keeps the server and client markup
 * identical, so the theme — known only on the client before hydration — never
 * causes a hydration mismatch.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle light or dark theme"
      title="Toggle theme"
      className={`wc-btn grid h-10 w-10 place-items-center rounded-full border-2 border-border-soft bg-surface text-muted hover:text-ink ${className ?? ""}`}
    >
      <Moon size={18} className="theme-icon-moon" />
      <Sun size={18} className="theme-icon-sun" />
    </button>
  );
}
