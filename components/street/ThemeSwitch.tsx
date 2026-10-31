"use client";

import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import type { MouseEvent } from "react";

/**
 * Day ↔ evening. The class on <html> is flipped synchronously inside startViewTransition so the
 * circle wipe gets a correct snapshot and the scene's MutationObserver starts its sky tween in
 * the same frame; next-themes is then told the result so it persists the choice.
 */
export function ThemeSwitch({ toEvening, toDay, toEveningLabel, toDayLabel }: { toEvening: string; toDay: string; toEveningLabel: string; toDayLabel: string }) {
  const { setTheme } = useTheme();

  const flip = (e: MouseEvent<HTMLButtonElement>) => {
    const root = document.documentElement;
    const next = root.classList.contains("dark") ? "light" : "dark";
    const apply = () => {
      root.classList.toggle("dark", next === "dark");
      root.style.colorScheme = next;
      flushSync(() => setTheme(next));
    };
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (document.startViewTransition && !reduce) {
      root.style.setProperty("--vt-x", `${e.clientX}px`);
      root.style.setProperty("--vt-y", `${e.clientY}px`);
      document.startViewTransition(apply);
    } else apply();
  };

  return (
    <button type="button" className="tt" onClick={flip}>
      <span className="when-light" aria-label={toEveningLabel}>
        {toEvening}
      </span>
      <span className="when-dark" aria-label={toDayLabel}>
        {toDay}
      </span>
    </button>
  );
}
