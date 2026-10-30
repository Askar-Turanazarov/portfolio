import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Browser-style frame. Keeps very different project designs visually consistent. */
export function DeviceFrame({ url, children, className }: { url?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-bg-elevated shadow-card", className)}>
      <div className="flex items-center gap-2 border-b border-border bg-bg-muted px-3 py-2">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-border-strong" />
          <span className="size-2.5 rounded-full bg-border-strong" />
          <span className="size-2.5 rounded-full bg-border-strong" />
        </span>
        <span className="mx-auto flex h-6 w-full max-w-[60%] items-center justify-center truncate rounded-md bg-bg px-3 font-mono text-[11px] text-fg-subtle">
          {url ?? "localhost"}
        </span>
        <span className="w-[42px]" aria-hidden />
      </div>
      <div className="relative aspect-[16/10] bg-bg-muted">{children}</div>
    </div>
  );
}
