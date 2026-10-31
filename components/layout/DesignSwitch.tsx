"use client";

import type { ReactNode } from "react";

export type Design = "street" | "v2";

/**
 * Switches between the two designs of the site. A plain anchor (full navigation, past the
 * router cache) that remembers the choice in a cookie; proxy.ts reads it for the bare /{lang} path.
 */
export function DesignSwitch({ to, href, className, children }: { to: Design; href: string; className?: string; children: ReactNode }) {
  const remember = () => {
    document.cookie = `design=${to}; path=/; max-age=31536000; SameSite=Lax`;
  };
  return (
    <a href={href} className={className} onClick={remember} data-design-switch={to}>
      {children}
    </a>
  );
}
