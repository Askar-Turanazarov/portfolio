import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "success" | "warning" | "muted";
  className?: string;
}) {
  const tones = {
    neutral: "border-border bg-bg-muted text-fg-muted",
    accent: "border-transparent bg-accent-soft text-fg",
    success: "border-transparent bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
    warning: "border-transparent bg-amber-500/14 text-amber-800 dark:text-amber-300",
    muted: "border-border bg-transparent text-fg-subtle",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium leading-5 tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
