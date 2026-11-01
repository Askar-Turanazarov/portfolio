"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

type Branch = { slug: string; name: string; href: string; leaf: string };

/**
 * The tree behind the text. Server-rendered as a poster of the grown tree; on capable devices the scene is imported
 * lazily and takes over, and the page's scroll position becomes the tree's age.
 */
export function GrowthStage({ branches, alt }: { branches: Branch[]; alt: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const labels = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const el = stage.current;
    const box = el?.closest<HTMLElement>(".growth");
    if (!el || !box) return;
    const q = new URLSearchParams(location.search);
    const webgl = (() => {
      try {
        return !!document.createElement("canvas").getContext("webgl2");
      } catch {
        return false;
      }
    })();
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    const weak = matchMedia("(prefers-reduced-motion: reduce)").matches || matchMedia("(pointer: coarse)").matches || matchMedia("(max-width: 767px)").matches || saveData;
    if ((weak || !webgl) && !q.has("scene")) return;

    let cancelled = false;
    let dispose: (() => void) | undefined;
    (async () => {
      const [{ createGrowth }, { detectGPU }] = await Promise.all([import("@/lib/growth/tree.js"), import("@/lib/street/perf.js")]);
      if (cancelled) return;
      // software rendering keeps the poster: it cannot follow a scroll
      const probe = document.createElement("canvas").getContext("webgl2");
      if (probe && detectGPU(probe).kind === "software" && !q.has("scene")) return;
      const fixed = q.get("p");
      const progress = () => {
        if (fixed !== null) return Number(fixed);
        const r = box.getBoundingClientRect();
        return Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
      };
      const sc = createGrowth(el, {
        branches,
        labels: labels.current,
        level: q.get("q") ?? undefined,
        initial: progress(),
        still: fixed !== null,
      });
      const onScroll = () => sc.setProgress(progress());
      const onVis = () => sc.pause(document.hidden);
      addEventListener("scroll", onScroll, { passive: true });
      document.addEventListener("visibilitychange", onVis);
      sc.ready.then(() => {
        if (!cancelled) el.dataset.state = "live";
      });
      dispose = () => {
        removeEventListener("scroll", onScroll);
        document.removeEventListener("visibilitychange", onVis);
        sc.dispose();
      };
    })().catch((err) => console.error(err));
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [branches]);

  return (
    <div className="gr-stage">
      <picture className="gr-poster">
        <source media="(max-width: 767px)" srcSet="/growth/poster-m.webp" />
        {/* Art-directed crops for phones need <picture>, which next/image does not offer. */}
        <img src="/growth/poster.webp" alt={alt} fetchPriority="high" width={2160} height={1350} />
      </picture>
      <div ref={stage} className="gr-canvas" data-state="idle" />
      <div className="gr-labels" aria-hidden="true">
        {branches.map((b, i) => (
          <Link
            key={b.slug}
            href={b.href}
            tabIndex={-1}
            ref={(n) => {
              labels.current[i] = n;
            }}
          >
            {b.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
