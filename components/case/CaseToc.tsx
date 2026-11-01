"use client";

import { useEffect, useState } from "react";

/** The page's contents. Plain anchors without JS; with it, the section being read is marked. */
export function CaseToc({ items, label }: { items: { id: string; label: string }[]; label: string }) {
  const [now, setNow] = useState(items[0]?.id);

  useEffect(() => {
    // the tint of the loading screen was for this page
    document.documentElement.style.removeProperty("--next-ac");
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) seen.add(e.target.id);
          else seen.delete(e.target.id);
        }
        const first = items.find((i) => seen.has(i.id));
        if (first) setNow(first.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    for (const i of items) {
      const el = document.getElementById(i.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [items]);

  return (
    <nav className="cs-toc" aria-label={label}>
      <ul>
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`} aria-current={now === i.id ? "true" : undefined}>
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
