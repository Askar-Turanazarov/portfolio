"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();
  // Replace the first segment (the locale) and keep the rest of the path.
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <nav aria-label="Language" className="flex items-center rounded-md border border-border bg-bg-elevated p-0.5 text-xs font-medium">
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest ? `/${rest}` : ""}`}
          hrefLang={l}
          aria-current={l === current ? "true" : undefined}
          className={cn(
            "rounded-[5px] px-2 py-1 uppercase tracking-wide transition",
            l === current ? "bg-fg text-bg" : "text-fg-muted hover:text-fg",
          )}
        >
          {l}
        </Link>
      ))}
    </nav>
  );
}
