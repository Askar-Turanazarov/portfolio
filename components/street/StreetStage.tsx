"use client";

import { useEffect, useRef } from "react";
import type { SceneHandle } from "@/lib/street/scene";
import { setScene } from "@/lib/street/bridge";

type Props = {
  taglines: Record<string, string>;
  posterDay: string;
  posterEvening: string;
  stageLabel: string;
  caption: string;
  captionScene: string;
};

const isDark = () => document.documentElement.classList.contains("dark");

/**
 * The street on the hero. Server-rendered as two posters (day / evening, the LCP element); on
 * capable devices the scene is imported lazily once the hero is near the viewport and fades in
 * over the poster. Phones, reduced motion, save-data and missing WebGL keep the poster.
 */
export function StreetStage({ taglines, posterDay, posterEvening, stageLabel, caption, captionScene }: Props) {
  const stage = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stage.current;
    const hero = el?.closest<HTMLElement>(".hero");
    const root = el?.closest<HTMLElement>(".street");
    if (!el || !hero || !root) return;

    const q = new URLSearchParams(location.search);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = matchMedia("(pointer: coarse)").matches;
    const narrow = matchMedia("(max-width: 767px)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    const webgl = (() => {
      try {
        const c = document.createElement("canvas");
        return !!(c.getContext("webgl2") || c.getContext("webgl"));
      } catch {
        return false;
      }
    })();
    const poster = (q.has("poster") || reduce.matches || coarse || narrow || saveData || !webgl) && !q.has("scene");
    const setMode = (m: "poster" | "scene") => {
      hero.dataset.mode = m;
      root.dataset.mode = m;
    };
    if (poster) {
      setMode("poster");
      return;
    }

    const cores = navigator.hardwareConcurrency || 4;
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 8;
    const tierQ = q.get("tier");
    const tier = tierQ === "high" || tierQ === "mid" ? tierQ : cores >= 8 && mem >= 8 ? "high" : "mid";

    let cancelled = false;
    let sc: SceneHandle | null = null;
    let io: IntersectionObserver | null = null;
    let mo: MutationObserver | null = null;
    const onVis = () => sc?.pause(document.hidden);

    const boot = async () => {
      try {
        await Promise.all([document.fonts.load('600 80px "Golos Text"'), document.fonts.load('500 40px "Golos Text"')]).catch(() => undefined);
        const { createScene } = await import("@/lib/street/scene.js");
        if (cancelled) return;
        sc = createScene(el, {
          tier,
          time: isDark() ? "evening" : "day",
          still: q.has("still"),
          texturePath: "/street/tex/",
          onHover(slug, pt, b) {
            const lb = label.current;
            if (!lb) return;
            if (!slug || !pt || !b) {
              lb.hidden = true;
              return;
            }
            lb.hidden = !pt.visible;
            (lb.firstElementChild as HTMLElement).textContent = b.name;
            (lb.lastElementChild as HTMLElement).textContent = taglines[slug] ?? "";
            lb.style.setProperty("--acc", b.accent);
            lb.style.transform = `translate(${pt.x.toFixed(0)}px, ${pt.y.toFixed(0)}px) translate(-50%, -100%)`;
          },
          onPick(slug) {
            const target = document.getElementById(`spread-${slug}`) ?? document.getElementById(`row-${slug}`);
            if (!target) return;
            target.scrollIntoView({ behavior: reduce.matches ? "auto" : "smooth", block: "start" });
            target.classList.add("flash");
            setTimeout(() => target.classList.remove("flash"), 1800);
          },
        });
        setScene(sc);
        setMode("scene");
        el.dataset.state = "live";
        el.dataset.tier = tier;
        sc.ready.then(() => {
          el.dataset.loaded = "1";
        });
        io = new IntersectionObserver(([e]) => sc?.pause(!e.isIntersecting || document.hidden), { threshold: 0.05 });
        io.observe(hero);
        document.addEventListener("visibilitychange", onVis);
        mo = new MutationObserver(() => sc?.setTime(isDark() ? "evening" : "day"));
        mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      } catch (err) {
        console.error(err);
        setMode("poster");
      }
    };

    // Start only when the hero is about to be seen (it is, on the home page, but a deep link to the board should not pay first).
    const near = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        near.disconnect();
        boot();
      },
      { rootMargin: "400px" },
    );
    near.observe(hero);

    return () => {
      cancelled = true;
      near.disconnect();
      io?.disconnect();
      mo?.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      setScene(null);
      sc?.dispose();
      sc = null;
    };
  }, [taglines]);

  return (
    <div className="scene">
      <picture className="poster day">
        <source media="(max-width: 767px)" srcSet="/street/poster-day-m.webp" />
        {/* Art-directed posters (a tall crop for phones) need <picture>, which next/image does not offer. */}
        <img src="/street/poster-day.webp" alt={posterDay} fetchPriority="high" width={2160} height={1350} />
      </picture>
      <picture className="poster eve">
        <source media="(max-width: 767px)" srcSet="/street/poster-evening-m.webp" />
        <img src="/street/poster-evening.webp" alt={posterEvening} fetchPriority="high" width={2160} height={1350} />
      </picture>
      <div ref={stage} className="stage" data-state="idle" role="img" aria-label={stageLabel} />
      <div ref={label} className="label" hidden>
        <b />
        <span />
      </div>
      <p className="cap">
        {caption}
        <span className="only-scene"> {captionScene}</span>
      </p>
    </div>
  );
}
