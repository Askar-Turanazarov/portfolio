"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ label }: { label: string }) {
  const { setTheme } = useTheme();

  // Read the resolved theme from the DOM at click time instead of tracking a
  // "mounted" flag in state: no extra render, no hydration mismatch.
  const toggle = () => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={toggle}
      className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-bg-elevated text-fg-muted transition hover:border-border-strong hover:text-fg"
    >
      {/* Render both icons; CSS decides which one shows, so SSR and client markup match. */}
      <Sun className="size-4 dark:hidden" aria-hidden />
      <Moon className="hidden size-4 dark:block" aria-hidden />
    </button>
  );
}
