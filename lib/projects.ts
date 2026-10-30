import type { Project, Tag } from "./schema";
import { tags as tagOrder } from "./schema";

/** Tags that at least one project in the list uses, in canonical order. */
export function tagsInUse(list: Project[]): Tag[] {
  const used = new Set<Tag>();
  for (const p of list) for (const t of p.tags) used.add(t);
  return tagOrder.filter((t) => used.has(t));
}

/** "2026-10" → "Oct 2026" using the dictionary's month names. */
export function formatMonth(ym: string, months: readonly string[]): string {
  const [year, month] = ym.split("-");
  return `${months[Number(month) - 1]} ${year}`;
}

export function formatPeriod(period: Project["period"], months: readonly string[]): string {
  if (period.from === period.to) return formatMonth(period.from, months);
  return `${formatMonth(period.from, months)} – ${formatMonth(period.to, months)}`;
}

/** Up to three capital letters for the fallback tile when a project has no cover. */
export function monogram(name: string): string {
  const words = name.split(/[\s-]+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}
