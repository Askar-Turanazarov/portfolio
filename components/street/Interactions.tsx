"use client";

import { useEffect } from "react";
import { getScene } from "@/lib/street/bridge";

/**
 * Wires the static markup to the live scene with delegated listeners, so the strip, the spreads
 * and the board stay server components:
 *  - hovering anything with data-street-slug lights that building up;
 *  - data-street-fly walks the camera to the building and scrolls the hero into view;
 *  - hovering a board row assembles its recipe above the board (FLIP on the chips);
 *  - hovering a module header fades the rows that lack it.
 */
export function Interactions() {
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const recipe = document.getElementById("recipe");
    const board = document.getElementById("board");
    const who = recipe?.querySelector<HTMLElement>(".who");
    const chips = recipe ? Array.from(recipe.querySelectorAll<HTMLElement>(".chip")) : [];
    const all = recipe?.dataset.all ?? "";

    const showRecipe = (row: HTMLElement | null) => {
      if (!recipe || !who) return;
      const before = new Map(chips.map((c) => [c, c.getBoundingClientRect()]));
      const mods = new Set(row?.dataset.modules?.split(" ") ?? []);
      who.textContent = row ? (row.dataset.name ?? "") : all;
      recipe.style.setProperty("--acc", row?.dataset.accent ?? "var(--garnet)");
      recipe.toggleAttribute("data-active", !!row);
      for (const c of chips) {
        const on = !!row && mods.has(c.dataset.mod ?? "");
        c.toggleAttribute("data-on", on);
        c.style.order = row ? (on ? "0" : "1") : "0";
      }
      if (reduce.matches) return;
      for (const c of chips) {
        const a = before.get(c);
        const b = c.getBoundingClientRect();
        if (!a) continue;
        const dx = a.left - b.left;
        const dy = a.top - b.top;
        if (!dx && !dy) continue;
        c.style.transition = "none";
        c.style.transform = `translate(${dx}px, ${dy}px)`;
        void c.offsetWidth;
        c.style.transition = "";
        c.style.transform = "";
      }
    };

    const setColumn = (mod: string | null) => {
      if (!board) return;
      if (mod) board.dataset.col = mod;
      else delete board.dataset.col;
      for (const el of board.querySelectorAll<HTMLElement>("[data-mod]")) el.toggleAttribute("data-hot", !!mod && el.dataset.mod === mod);
      for (const tr of board.querySelectorAll<HTMLElement>("tbody tr")) tr.toggleAttribute("data-has", !!mod && (tr.dataset.modules?.split(" ") ?? []).includes(mod));
    };

    const over = (e: Event) => {
      const t = e.target as HTMLElement;
      const slugEl = t.closest<HTMLElement>("[data-street-slug]");
      if (slugEl) {
        getScene()?.highlight(slugEl.dataset.streetSlug ?? null);
        if (board && slugEl.matches("#board tbody tr")) showRecipe(slugEl);
      }
      const th = t.closest<HTMLElement>("#board thead th[data-mod]");
      if (th) setColumn(th.dataset.mod ?? null);
    };
    const out = (e: Event) => {
      const t = e.target as HTMLElement;
      const related = (e as PointerEvent).relatedTarget as HTMLElement | null;
      const slugEl = t.closest<HTMLElement>("[data-street-slug]");
      if (slugEl && !(related && slugEl.contains(related))) {
        getScene()?.highlight(null);
        if (board && slugEl.matches("#board tbody tr")) showRecipe(null);
      }
      const th = t.closest<HTMLElement>("#board thead th[data-mod]");
      if (th && !(related && th.contains(related))) setColumn(null);
    };
    const click = (e: Event) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-street-fly]");
      if (!btn) return;
      const sc = getScene();
      if (!sc) return;
      sc.flyTo(btn.dataset.streetFly ?? "");
      document.getElementById("hero")?.scrollIntoView({ behavior: reduce.matches ? "auto" : "smooth", block: "start" });
    };

    document.addEventListener("pointerover", over);
    document.addEventListener("pointerout", out);
    document.addEventListener("click", click);
    return () => {
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
      document.removeEventListener("click", click);
    };
  }, []);
  return null;
}
