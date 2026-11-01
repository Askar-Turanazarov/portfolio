"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import type { Quality, SceneHandle } from "@/lib/street/scene";
import { getScene, setScene } from "@/lib/street/bridge";
import { keep, type SceneHandlers } from "@/lib/street/keep";
import { onColor } from "@/lib/color";

type Card = { slug: string; name: string; tagline: string; accent: string; href: string; live?: string };
type Nav = { label: string; prev: string; next: string; hint: string; page: string; open: string; close: string };

type Props = {
  cards: Card[];
  nav: Nav;
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
 * over the poster. Phones, reduced motion, save-data and missing WebGL keep the poster, and there the navigator
 * opens the cards without a camera.
 */
export function StreetStage({ cards, nav, posterDay, posterEvening, stageLabel, caption, captionScene }: Props) {
  const stage = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);
  const cardEl = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const live = useRef(false);
  const syncGlass = useRef<() => void>(() => undefined);
  const prevBtn = useRef<HTMLButtonElement>(null);
  const nextBtn = useRef<HTMLButtonElement>(null);
  // which project the navigator names, which card is open and where its sign stood on screen when it opened
  // (back from another page, the parked scene knows both)
  const [current, setCurrent] = useState(() => Math.max(0, cards.findIndex((c) => c.slug === keep.sc?.current().slug)));
  const [open, setOpen] = useState<{ i: number; from: { x: number; y: number } | null } | null>(() => (keep.sc?.current().open ? { i: cards.findIndex((c) => c.slug === keep.sc?.current().slug), from: null } : null));

  const close = () => {
    setOpen(null);
    getScene()?.release();
    keep.remember();
  };

  /** With the scene the camera travels and the card opens on arrival; on a poster the card opens at once. */
  const step = (dir: 1 | -1) => {
    const sc = getScene();
    if (sc && live.current) {
      sc.step(dir);
      return;
    }
    const i = (current + dir + cards.length) % cards.length;
    setCurrent(i);
    setOpen({ i, from: null });
  };

  // The card flies out of the building's sign. It is one object, so this only runs when it opens or changes project.
  useLayoutEffect(() => {
    const el = cardEl.current;
    if (!el || !open) {
      getScene()?.setGlass(null);
      return;
    }
    // back from a project page the card just stands where it stood
    if (keep.returning) return;
    // CSS glass while it flies; the shader, on the levels that have it, once it stands still
    delete el.dataset.glass;
    getScene()?.setGlass(null);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      syncGlass.current();
      return;
    }
    const box = el.getBoundingClientRect();
    const host = wrap.current?.getBoundingClientRect();
    const dx = open.from && host ? open.from.x + host.left - box.left : 0;
    const dy = open.from && host ? open.from.y + host.top - box.top : 16;
    const scale = open.from ? 0.22 : 0.98;
    const anim = el.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(${scale})`, opacity: 0 },
        { opacity: 1, offset: 0.35 },
        { transform: "none", opacity: 1 },
      ],
      { duration: open.from ? 620 : 240, easing: "cubic-bezier(.2,.8,.2,1)" },
    );
    anim.finished.then(() => syncGlass.current()).catch(() => undefined);
    return () => anim.cancel();
  }, [open]);

  useEffect(() => {
    syncGlass.current = () => {
      const el = cardEl.current, st = stage.current, sc = getScene();
      if (!sc) return;
      if (!el || !st) {
        sc.setGlass(null);
        return;
      }
      const a = el.getBoundingClientRect(), b = st.getBoundingClientRect();
      if (sc.setGlass({ x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height })) el.dataset.glass = "1";
      else delete el.dataset.glass;
    };
    const ro = new ResizeObserver(() => syncGlass.current());
    if (wrap.current) ro.observe(wrap.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const hero = wrap.current?.closest<HTMLElement>(".hero");
    if (!hero) return;
    let seen = true;
    const io = new IntersectionObserver(([e]) => (seen = e.isIntersecting), { threshold: 0.2 });
    io.observe(hero);
    const dirOf = (e: KeyboardEvent) => (e.code === "ArrowLeft" || e.code === "KeyA" ? -1 : e.code === "ArrowRight" || e.code === "KeyD" ? 1 : 0);
    const down = new Map<string, number>();
    let timer = 0;

    const onDown = (e: KeyboardEvent) => {
      if (e.code === "Escape" && cardEl.current) {
        cardEl.current.querySelector<HTMLButtonElement>(".x")?.click();
        return;
      }
      const dir = dirOf(e);
      const t = e.target as HTMLElement;
      if (!dir || !seen || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || t.closest("input, textarea, select, [contenteditable]")) return;
      e.preventDefault();
      if (e.repeat || down.has(e.code)) return;
      // the event's own time: on a slow frame the handlers run late, and a tap must not read as a hold
      down.set(e.code, e.timeStamp);
      clearTimeout(timer);
      // holding walks; a short press is resolved on release
      timer = window.setTimeout(() => getScene()?.hold(dir), 180);
    };
    const onUp = (e: KeyboardEvent) => {
      const t0 = down.get(e.code);
      if (t0 === undefined) return;
      down.delete(e.code);
      clearTimeout(timer);
      getScene()?.hold(0);
      if (e.timeStamp - t0 < 180) (e.code === "ArrowLeft" || e.code === "KeyA" ? prevBtn : nextBtn).current?.click();
    };
    const onBlur = () => {
      down.clear();
      clearTimeout(timer);
      getScene()?.hold(0);
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    window.addEventListener("blur", onBlur);
    return () => {
      io.disconnect();
      clearTimeout(timer);
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  useLayoutEffect(() => {
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

    // The quality level is chosen inside the scene from the GPU the context lands on; ?q= overrides it.
    const qualityQ = q.get("q");
    const quality: Quality | null = qualityQ === "low" || qualityQ === "mid" || qualityQ === "high" ? qualityQ : null;
    // ?hfov= and ?h= exist to compare fields of view and eye heights; the scene has its own defaults
    const num = (key: string, lo: number, hi: number) => {
      const v = Number(q.get(key));
      return q.has(key) && Number.isFinite(v) && v >= lo && v <= hi ? v : undefined;
    };
    const hfov = num("hfov", 60, 130), eye = num("h", 1.2, 6);

    let cancelled = false;
    let sc: SceneHandle | null = null;
    let io: IntersectionObserver | null = null;
    let mo: MutationObserver | null = null;
    const onVis = () => sc?.pause(document.hidden);

    // The scene outlives this component: it calls whoever is mounted now.
    const handlers: SceneHandlers = {
      onHover(slug, pt, b) {
        const lb = label.current;
        if (!lb) return;
        if (!slug || !pt || !b) {
          lb.hidden = true;
          return;
        }
        lb.hidden = false;
        lb.textContent = b.name;
        lb.style.setProperty("--acc", b.accent);
        lb.style.transform = `translate(${(pt.x + 14).toFixed(0)}px, ${(pt.y + 18).toFixed(0)}px)`;
      },
      onQuality(level) {
        el.dataset.quality = level;
        syncGlass.current();
      },
      onCurrent(slug) {
        const i = cards.findIndex((c) => c.slug === slug);
        if (i >= 0) setCurrent(i);
        keep.remember();
      },
      onDepart() {
        setOpen(null);
        keep.remember();
      },
      onArrive(slug, pt) {
        const i = cards.findIndex((c) => c.slug === slug);
        if (i < 0) return;
        setCurrent(i);
        setOpen({ i, from: pt?.visible ? { x: pt.x, y: pt.y } : null });
        keep.remember();
      },
    };
    keep.handlers = handlers;

    const watch = (scene: SceneHandle) => {
      sc = scene;
      setScene(scene);
      el.dataset.quality = scene.level;
      el.dataset.gpu = scene.gpu.kind;
      io = new IntersectionObserver(([e]) => scene.pause(!e.isIntersecting || document.hidden), { threshold: 0.05 });
      io.observe(hero);
      document.addEventListener("visibilitychange", onVis);
      mo = new MutationObserver(() => scene.setTime(isDark() ? "evening" : "day"));
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    };

    // Back from another page: the same scene, the same view, the same building, on the very first frame.
    if (keep.sc && keep.host) {
      const back = keep.sc;
      clearTimeout(keep.timer);
      el.append(keep.host);
      el.dataset.back = "1";
      watch(back);
      back.setTime(isDark() ? "evening" : "day", true);
      back.pause(document.hidden);
      live.current = true;
      setMode("scene");
      el.dataset.state = "live";
      el.dataset.loaded = "1";
      requestAnimationFrame(() => {
        keep.returning = false;
        syncGlass.current();
      });
      return () => leave();
    }

    const boot = async () => {
      try {
        await Promise.all([document.fonts.load('600 80px "Golos Text"'), document.fonts.load('500 40px "Golos Text"')]).catch(() => undefined);
        const { createScene } = await import("@/lib/street/scene.js");
        if (cancelled) return;
        const host = document.createElement("div");
        host.className = "stage-host";
        el.append(host);
        const debug = q.has("debug");
        const scene = createScene(host, {
          quality,
          time: isDark() ? "evening" : "day",
          still: q.has("still"),
          debug,
          govern: q.get("gov") !== "0",
          hfov,
          eye,
          texturePath: "/street/tex/",
          onHover: (...a) => keep.handlers?.onHover(...a),
          onQuality: (...a) => keep.handlers?.onQuality(...a),
          onCurrent: (...a) => keep.handlers?.onCurrent(...a),
          onDepart: () => keep.handlers?.onDepart(),
          onArrive: (...a) => keep.handlers?.onArrive(...a),
        });
        // a reload lands where the visitor stood; the measurement scripts place the camera themselves
        const was = debug ? null : keep.recall();
        keep.sc = scene;
        keep.host = host;
        if (was?.slug) scene.jumpTo(was.slug, was.open);
        watch(scene);
        // the poster stays until the first frame is drawn (programs linked, textures uploaded), then the canvas
        // fades in over it
        scene.ready.then(() => {
          if (cancelled) return;
          live.current = true;
          setMode("scene");
          el.dataset.state = "live";
          el.dataset.loaded = "1";
        });
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
      near.disconnect();
      leave();
    };

    function leave() {
      cancelled = true;
      live.current = false;
      io?.disconnect();
      mo?.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      setScene(null);
      if (keep.handlers === handlers) keep.handlers = null;
      sc = null;
      keep.park();
    }
  }, [cards]);

  const now = cards[current];
  const card = open ? cards[open.i] : null;

  return (
    <div ref={wrap} className="scene-wrap">
    <div className="scene">
      <picture className="poster day">
        <source media="(max-width: 767px)" srcSet="/street/poster-day-m.webp" />
        {/* Art-directed posters (a tall crop for phones) need <picture>, which next/image does not offer. */}
        <img src="/street/poster-day.webp" alt={posterDay} fetchPriority="high" width={2160} height={1350} />
      </picture>
      <picture className="poster eve">
        <source media="(max-width: 767px)" srcSet="/street/poster-evening-m.webp" />
        {/* Lazy: a poster hidden by the theme is not fetched, so a day visitor never pays for the evening one. */}
        <img src="/street/poster-evening.webp" alt={posterEvening} loading="lazy" width={2160} height={1350} />
      </picture>
      <div ref={stage} className="stage" data-state="idle" role="img" aria-label={stageLabel} />
      <div ref={label} className="label" hidden />
      <p className="cap">
        {caption}
        <span className="only-scene"> {captionScene}</span>
      </p>
    </div>
      <div className="st-nav" role="group" aria-label={nav.label} title={nav.hint} style={{ "--acc": now?.accent } as CSSProperties}>
        <button ref={prevBtn} type="button" onClick={() => step(-1)} aria-label={nav.prev}>
          ←
        </button>
        <button ref={nextBtn} type="button" onClick={() => step(1)} aria-label={nav.next}>
          →
        </button>
        <p className="st-now" aria-live="polite">
          {now?.name}
          <span>
            {current + 1} / {cards.length}
          </span>
        </p>
      </div>
      {card && (
        <div ref={cardEl} className="st-card" role="group" aria-labelledby="st-card-name" aria-live="polite" style={{ "--acc": card.accent, "--acc-on": onColor(card.accent) } as CSSProperties}>
          <h2 id="st-card-name">{card.name}</h2>
          <p>{card.tagline}</p>
          <ul>
            {card.live && (
              <li>
                <a className="go" href={card.live} target="_blank" rel="noopener noreferrer">
                  {nav.open}
                </a>
              </li>
            )}
            <li>
              <Link className={card.live ? undefined : "go"} href={card.href} onClick={() => document.documentElement.style.setProperty("--next-ac", card.accent)}>
                {nav.page}
              </Link>
            </li>
          </ul>
          <button type="button" className="x" onClick={close} aria-label={nav.close}>
            ×
          </button>
        </div>
      )}
    </div>
  );
}
